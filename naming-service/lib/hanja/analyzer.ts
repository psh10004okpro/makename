/**
 * 한자 분석 엔진
 *
 * 작명에 사용될 한자를 분석하고 평가하는 핵심 클래스입니다.
 * - 한자 검색 및 매칭
 * - 획수 길흉 분석 (81수리)
 * - 오격 분석 (천격/인격/지격/외격/총격)
 * - 한자 조합 평가
 */

import { PrismaClient } from '@prisma/client'
import { Ohang, OhangAnalysis } from '../saju/types'
import { COMMON_HANJA, HanjaData, searchHanja, HanjaSearchOptions } from './data'
import { getStrokeInfo, StrokeInfo, STROKE_81 } from './strokes'

// Lazy-loaded Prisma client (only initialized when needed)
let prisma: PrismaClient | null = null
function getPrisma(): PrismaClient {
  if (!prisma) {
    prisma = new PrismaClient()
  }
  return prisma
}

/**
 * 오격 (五格) 분석 결과
 */
export interface OgyeokAnalysis {
  /** 천격 (天格): 성씨 획수 */
  cheongyeok: {
    strokes: number
    info: StrokeInfo
    score: number
  }
  /** 인격 (人格): 성씨 끝자 + 이름 첫자 */
  ingyeok: {
    strokes: number
    info: StrokeInfo
    score: number
  }
  /** 지격 (地格): 이름 획수 합 */
  jigyeok: {
    strokes: number
    info: StrokeInfo
    score: number
  }
  /** 외격 (外格): 총격 - 인격 + 1 */
  oegyeok: {
    strokes: number
    info: StrokeInfo
    score: number
  }
  /** 총격 (總格): 전체 획수 합 */
  chonggyeok: {
    strokes: number
    info: StrokeInfo
    score: number
  }
  /** 전체 평균 점수 */
  averageScore: number
  /** 종합 등급 */
  grade: string
  /** 상세 설명 */
  description: string
}

/**
 * 한자 조합 평가 결과
 */
export interface CombinationScore {
  /** 총점 (0-100) */
  total: number
  /** 오행 조화 점수 (0-40) */
  ohangHarmony: number
  /** 오격 점수 (0-40) */
  ogyeokScore: number
  /** 의미 적합성 (0-20) */
  meaningScore: number
  /** 등급 (A+, A, B+, B, C, D) */
  grade: string
  /** 상세 설명 */
  details: string[]
}

/**
 * 한자 분석기 클래스
 */
export class HanjaAnalyzer {
  /**
   * 조건에 맞는 한자 찾기 (데이터베이스 또는 메모리에서)
   *
   * @param options 검색 옵션
   * @param useDatabase true면 DB에서 검색, false면 메모리에서 검색
   */
  async findMatchingHanja(
    options: HanjaSearchOptions,
    useDatabase: boolean = false
  ): Promise<HanjaData[]> {
    if (useDatabase) {
      // 데이터베이스에서 검색
      const where: any = {}

      if (options.korean) where.korean = options.korean
      if (options.ohang) where.ohang = options.ohang
      if (options.gender) where.gender = { has: options.gender }
      if (options.positiveOnly) where.positive = true
      if (options.strokesMin || options.strokesMax) {
        where.strokes = {}
        if (options.strokesMin) where.strokes.gte = options.strokesMin
        if (options.strokesMax) where.strokes.lte = options.strokesMax
      }
      if (options.tags && options.tags.length > 0) {
        where.tags = { hasSome: options.tags }
      }

      const results = await getPrisma().hanja.findMany({
        where,
        orderBy: [{ frequency: 'desc' }, { strokes: 'asc' }],
      })

      // Prisma 결과를 HanjaData 형식으로 변환
      return results.map((r: any) => ({
        character: r.character,
        korean: r.korean,
        meaning: r.meaning,
        strokes: r.strokes,
        ohang: r.ohang as '목' | '화' | '토' | '금' | '수',
        gender: r.gender as ('MALE' | 'FEMALE' | 'NEUTRAL')[],
        positive: r.positive,
        tags: r.tags,
        radical: r.radical || undefined,
      }))
    } else {
      // 메모리에서 검색 (빠름)
      return searchHanja(options)
    }
  }

  /**
   * 획수 길흉 계산 (81수리)
   *
   * @param strokes 획수
   * @returns 81수리 정보 및 점수
   */
  calculateStrokeLuck(strokes: number): { strokes: number; info: StrokeInfo; score: number } {
    const info = getStrokeInfo(strokes)

    // 길흉에 따른 점수 부여
    let score: number
    switch (info.luck) {
      case '대길':
        score = 100
        break
      case '길':
        score = 85
        break
      case '중길':
        score = 70
        break
      case '평':
        score = 50
        break
      case '흉':
        score = 30
        break
      case '대흉':
        score = 10
        break
      default:
        score = 50
    }

    return { strokes, info, score }
  }

  /**
   * 오격 (五格) 분석
   *
   * 전통 작명법에서 사용하는 오격 분석:
   * - 천격: 성씨 획수 (조상운, 타고난 운)
   * - 인격: 성씨 끝자 + 이름 첫자 (주운, 성격)
   * - 지격: 이름 획수 합 (초년운, 기초운)
   * - 외격: 성씨 첫자 + 이름 끝자 (사회운, 대인관계)
   * - 총격: 전체 획수 합 (만년운, 종합운)
   *
   * @param familyNameStrokes 성씨 획수 배열 (예: "김" = [8], "남궁" = [5, 10])
   * @param givenNameStrokes 이름 획수 배열 (예: "지혜" = [12, 15])
   */
  analyzeOgyeok(
    familyNameStrokes: number[],
    givenNameStrokes: number[]
  ): OgyeokAnalysis {
    // 1. 천격 (天格): 성씨 획수 합
    const cheongyeokStrokes = familyNameStrokes.reduce((a, b) => a + b, 0)
    const cheongyeok = this.calculateStrokeLuck(cheongyeokStrokes)

    // 2. 지격 (地格): 이름 획수 합
    const jigyeokStrokes = givenNameStrokes.reduce((a, b) => a + b, 0)
    const jigyeok = this.calculateStrokeLuck(jigyeokStrokes)

    // 3. 인격 (人格): 성씨 끝자 + 이름 첫자
    const familyLastStroke = familyNameStrokes[familyNameStrokes.length - 1]
    const givenFirstStroke = givenNameStrokes[0]
    const ingyeokStrokes = familyLastStroke + givenFirstStroke
    const ingyeok = this.calculateStrokeLuck(ingyeokStrokes)

    // 4. 총격 (總格): 전체 획수 합
    const chonggyeokStrokes = cheongyeokStrokes + jigyeokStrokes
    const chonggyeok = this.calculateStrokeLuck(chonggyeokStrokes)

    // 5. 외격 (外格): 성씨 첫자 + 이름 끝자 + 1
    // (단성 단명인 경우 특별 계산)
    let oegyeokStrokes: number
    if (familyNameStrokes.length === 1 && givenNameStrokes.length === 1) {
      // 단성 단명: 천격 + 지격 - 인격 + 1
      oegyeokStrokes = cheongyeokStrokes + jigyeokStrokes - ingyeokStrokes + 1
    } else {
      const familyFirstStroke = familyNameStrokes[0]
      const givenLastStroke = givenNameStrokes[givenNameStrokes.length - 1]
      oegyeokStrokes = familyFirstStroke + givenLastStroke + 1
    }
    const oegyeok = this.calculateStrokeLuck(oegyeokStrokes)

    // 평균 점수 및 등급 계산
    const scores = [
      ingyeok.score, // 인격 가중치 높음 (주운)
      jigyeok.score, // 지격 가중치 높음 (기초운)
      chonggyeok.score, // 총격 가중치 높음 (종합운)
      oegyeok.score,
      cheongyeok.score, // 천격은 선천적이라 가중치 낮음
    ]
    const weights = [0.3, 0.25, 0.25, 0.15, 0.05]
    const averageScore = scores.reduce((sum, score, i) => sum + score * weights[i], 0)

    const grade = this.getGradeFromScore(averageScore)

    // 상세 설명 생성
    const description = this.generateOgyeokDescription({
      cheongyeok,
      ingyeok,
      jigyeok,
      oegyeok,
      chonggyeok,
      averageScore,
      grade,
    } as any)

    return {
      cheongyeok: {
        strokes: cheongyeokStrokes,
        info: cheongyeok.info,
        score: cheongyeok.score,
      },
      ingyeok: {
        strokes: ingyeokStrokes,
        info: ingyeok.info,
        score: ingyeok.score,
      },
      jigyeok: {
        strokes: jigyeokStrokes,
        info: jigyeok.info,
        score: jigyeok.score,
      },
      oegyeok: {
        strokes: oegyeokStrokes,
        info: oegyeok.info,
        score: oegyeok.score,
      },
      chonggyeok: {
        strokes: chonggyeokStrokes,
        info: chonggyeok.info,
        score: chonggyeok.score,
      },
      averageScore,
      grade,
      description,
    }
  }

  /**
   * 한자 조합 평가
   *
   * 주어진 성씨와 한자 조합을 종합적으로 평가합니다.
   *
   * @param familyName 성씨 (예: "김")
   * @param familyNameStrokes 성씨 획수 배열
   * @param characters 이름 한자 배열
   * @param recommendedOhang 추천 오행 (사주 분석 결과)
   */
  evaluateCombination(
    familyName: string,
    familyNameStrokes: number[],
    characters: HanjaData[],
    recommendedOhang?: Ohang[]
  ): CombinationScore {
    // 1. 오행 조화 점수 (0-40점)
    let ohangHarmony = 0
    if (recommendedOhang && recommendedOhang.length > 0) {
      const characterOhangs = characters.map(c => c.ohang)
      const matchCount = characterOhangs.filter(o =>
        recommendedOhang.includes(o)
      ).length
      const matchRate = matchCount / characters.length
      ohangHarmony = matchRate * 40

      // 보너스: 두 글자가 상생 관계면 +5점
      if (characters.length === 2) {
        const [first, second] = characterOhangs
        if (this.isCompatibleOhang(first, second)) {
          ohangHarmony = Math.min(40, ohangHarmony + 5)
        }
      }
    } else {
      // 추천 오행이 없으면 기본 점수 (중립적으로 평가)
      ohangHarmony = 25
    }

    // 2. 오격 점수 (0-40점)
    const givenNameStrokes = characters.map(c => c.strokes)
    const ogyeok = this.analyzeOgyeok(familyNameStrokes, givenNameStrokes)
    const ogyeokScore = (ogyeok.averageScore / 100) * 40

    // 3. 의미 적합성 (0-20점)
    let meaningScore = 0

    // 긍정적 의미 한자인지 확인 (+10점)
    const positiveCount = characters.filter(c => c.positive).length
    meaningScore += (positiveCount / characters.length) * 10

    // 태그가 잘 어울리는지 확인 (+10점)
    const allTags = characters.flatMap(c => c.tags)
    const uniqueTags = new Set(allTags)
    if (uniqueTags.size >= 2 && uniqueTags.size <= 4) {
      // 적절한 다양성
      meaningScore += 10
    } else if (uniqueTags.size === 1) {
      // 테마가 명확하지만 다양성 부족
      meaningScore += 7
    } else {
      // 너무 산만함
      meaningScore += 5
    }

    // 총점 계산
    const total = Math.round(ohangHarmony + ogyeokScore + meaningScore)
    const grade = this.getGradeFromScore(total)

    // 상세 설명 생성
    const details = this.generateCombinationDetails({
      familyName,
      characters,
      ohangHarmony,
      ogyeokScore,
      meaningScore,
      ogyeok,
      recommendedOhang,
    })

    return {
      total,
      ohangHarmony: Math.round(ohangHarmony),
      ogyeokScore: Math.round(ogyeokScore),
      meaningScore: Math.round(meaningScore),
      grade,
      details,
    }
  }

  /**
   * 오행 상생 관계 확인
   */
  private isCompatibleOhang(ohang1: Ohang, ohang2: Ohang): boolean {
    const compatibility: Record<Ohang, Ohang[]> = {
      '목': ['수', '화'], // 목생화, 수생목
      '화': ['목', '토'], // 화생토, 목생화
      '토': ['화', '금'], // 토생금, 화생토
      '금': ['토', '수'], // 금생수, 토생금
      '수': ['금', '목'], // 수생목, 금생수
    }
    return compatibility[ohang1]?.includes(ohang2) ?? false
  }

  /**
   * 점수를 등급으로 변환
   */
  private getGradeFromScore(score: number): string {
    if (score >= 95) return 'A+'
    if (score >= 90) return 'A'
    if (score >= 85) return 'B+'
    if (score >= 80) return 'B'
    if (score >= 70) return 'C+'
    if (score >= 60) return 'C'
    if (score >= 50) return 'D'
    return 'F'
  }

  /**
   * 오격 분석 설명 생성
   */
  private generateOgyeokDescription(result: OgyeokAnalysis): string {
    const parts: string[] = []

    parts.push(`오격 종합 평가: ${result.grade} (${result.averageScore.toFixed(1)}점)`)
    parts.push('')
    parts.push(`천격 ${result.cheongyeok.strokes}획 (${result.cheongyeok.info.luck}): ${result.cheongyeok.info.meaning}`)
    parts.push(`인격 ${result.ingyeok.strokes}획 (${result.ingyeok.info.luck}): ${result.ingyeok.info.meaning}`)
    parts.push(`지격 ${result.jigyeok.strokes}획 (${result.jigyeok.info.luck}): ${result.jigyeok.info.meaning}`)
    parts.push(`외격 ${result.oegyeok.strokes}획 (${result.oegyeok.info.luck}): ${result.oegyeok.info.meaning}`)
    parts.push(`총격 ${result.chonggyeok.strokes}획 (${result.chonggyeok.info.luck}): ${result.chonggyeok.info.meaning}`)

    return parts.join('\n')
  }

  /**
   * 조합 평가 상세 설명 생성
   */
  private generateCombinationDetails(params: {
    familyName: string
    characters: HanjaData[]
    ohangHarmony: number
    ogyeokScore: number
    meaningScore: number
    ogyeok: OgyeokAnalysis
    recommendedOhang?: Ohang[]
  }): string[] {
    const details: string[] = []

    const fullName = params.familyName + params.characters.map(c => c.character).join('')
    details.push(`이름: ${fullName} (${params.characters.map(c => c.korean).join('')})`)

    // 오행 정보
    const ohangs = params.characters.map(c => c.ohang).join(', ')
    details.push(`오행: ${ohangs}`)
    if (params.recommendedOhang && params.recommendedOhang.length > 0) {
      const recommended = params.recommendedOhang.join(', ')
      details.push(`추천 오행: ${recommended}`)
      details.push(`오행 조화도: ${params.ohangHarmony.toFixed(1)}점/40점`)
    }

    // 오격 정보
    details.push(`오격 점수: ${params.ogyeokScore.toFixed(1)}점/40점 (${params.ogyeok.grade})`)
    details.push(
      `  인격 ${params.ogyeok.ingyeok.strokes}획(${params.ogyeok.ingyeok.info.luck}), ` +
      `지격 ${params.ogyeok.jigyeok.strokes}획(${params.ogyeok.jigyeok.info.luck}), ` +
      `총격 ${params.ogyeok.chonggyeok.strokes}획(${params.ogyeok.chonggyeok.info.luck})`
    )

    // 의미 정보
    const meanings = params.characters.map(c => c.meaning).join(', ')
    details.push(`의미: ${meanings}`)
    details.push(`의미 적합성: ${params.meaningScore.toFixed(1)}점/20점`)

    // 태그 정보
    const allTags = params.characters.flatMap(c => c.tags)
    const uniqueTags = [...new Set(allTags)]
    details.push(`특징: ${uniqueTags.join(', ')}`)

    return details
  }

  /**
   * 성씨별 획수 조회 헬퍼 함수
   *
   * 일반적인 한국 성씨의 획수를 반환합니다.
   * 복성(複姓)도 지원합니다.
   */
  static getFamilyNameStrokes(familyName: string): number[] {
    // 한국 성씨 획수 데이터 (간체자 기준)
    const strokesMap: Record<string, number[]> = {
      '김': [8],
      '이': [7],
      '박': [5],
      '최': [12],
      '정': [9],
      '강': [11],
      '조': [10],
      '윤': [7],
      '장': [11],
      '임': [5],
      '한': [12],
      '오': [8],
      '서': [9],
      '신': [10],
      '권': [18],
      '황': [12],
      '안': [6],
      '송': [14],
      '전': [6],
      '홍': [9],
      '유': [6],
      '고': [10],
      '문': [4],
      '양': [13],
      '손': [10],
      '배': [11],
      '백': [11],
      '허': [11],
      '남': [5],
      '심': [13],
      '노': [6],
      '하': [12],
      '곽': [15],
      '성': [6],
      '차': [10],
      '주': [6],
      '우': [7],
      '구': [8],
      '라': [7],
      '진': [10],
      '민': [5],
      '엄': [20],
      '원': [10],
      '천': [4],
      '방': [10],
      '공': [4],
      '현': [11],
      '함': [9],
      '변': [9],
      '염': [7],
      '여': [8],
      '추': [11],
      '도': [10],
      '소': [10],
      '석': [5],
      '선': [13],
      '설': [14],
      '마': [10],
      '길': [6],
      '연': [10],
      '위': [11],
      '표': [15],
      '명': [8],
      '기': [5],
      '반': [7],
      '왕': [4],
      '금': [8],
      '옥': [5],
      '육': [6],
      '인': [4],
      '맹': [8],
      '제': [11],
      '탁': [8],
      '국': [11],
      '어': [8],
      '경': [12],
      '예': [11],
      // 복성 (複姓)
      '남궁': [5, 10],
      '선우': [13, 7],
      '황보': [12, 9],
      '독고': [9, 5],
      '사공': [5, 4],
      '동방': [8, 4],
      '서문': [9, 4],
      '제갈': [11, 11],
    }

    return strokesMap[familyName] || [familyName.length * 8] // 기본값
  }
}

export default HanjaAnalyzer
