/**
 * 오행(五行) 분석 엔진
 *
 * 사주팔자의 오행 균형을 분석하고 용신을 추출합니다.
 */

import type {
  Cheongan,
  Jiji,
  Ohang,
  Eumyang,
  Saju,
  OhangCount,
  OhangAnalysis,
} from './types'
import { OHANG_LIST } from './types'

// ============================================================================
// 오행 매핑 데이터
// ============================================================================

/**
 * 천간의 오행 매핑
 */
export const CHEONGAN_OHANG: Record<Cheongan, Ohang> = {
  '갑': '목', // 甲 - 양목
  '을': '목', // 乙 - 음목
  '병': '화', // 丙 - 양화
  '정': '화', // 丁 - 음화
  '무': '토', // 戊 - 양토
  '기': '토', // 己 - 음토
  '경': '금', // 庚 - 양금
  '신': '금', // 辛 - 음금
  '임': '수', // 壬 - 양수
  '계': '수', // 癸 - 음수
}

/**
 * 지지의 오행 매핑
 */
export const JIJI_OHANG: Record<Jiji, Ohang> = {
  '인': '목', // 寅 - 양목
  '묘': '목', // 卯 - 음목
  '사': '화', // 巳 - 양화
  '오': '화', // 午 - 음화
  '진': '토', // 辰 - 양토 (습토)
  '술': '토', // 戌 - 양토 (조토)
  '축': '토', // 丑 - 음토 (습토)
  '미': '토', // 未 - 음토 (조토)
  '신': '금', // 申 - 양금
  '유': '금', // 酉 - 음금
  '자': '수', // 子 - 양수
  '해': '수', // 亥 - 음수
}

/**
 * 천간의 음양 구분
 */
export const CHEONGAN_EUMYANG: Record<Cheongan, Eumyang> = {
  '갑': '양', '을': '음',
  '병': '양', '정': '음',
  '무': '양', '기': '음',
  '경': '양', '신': '음',
  '임': '양', '계': '음',
}

/**
 * 지지의 음양 구분
 */
export const JIJI_EUMYANG: Record<Jiji, Eumyang> = {
  '자': '양', '축': '음',
  '인': '양', '묘': '음',
  '진': '양', '사': '양',
  '오': '음', '미': '음',
  '신': '양', '유': '음',
  '술': '양', '해': '음',
}

// ============================================================================
// 오행 상생상극
// ============================================================================

/**
 * 오행 상생 (五行相生)
 * 목생화, 화생토, 토생금, 금생수, 수생목
 */
export const OHANG_SAENGSEONG: Record<Ohang, Ohang> = {
  '목': '화', // 목생화 (木生火)
  '화': '토', // 화생토 (火生土)
  '토': '금', // 토생금 (土生金)
  '금': '수', // 금생수 (金生水)
  '수': '목', // 수생목 (水生木)
}

/**
 * 오행 상극 (五行相克)
 * 목극토, 토극수, 수극화, 화극금, 금극목
 */
export const OHANG_SANGGEUK: Record<Ohang, Ohang> = {
  '목': '토', // 목극토 (木克土)
  '토': '수', // 토극수 (土克水)
  '수': '화', // 수극화 (水克火)
  '화': '금', // 화극금 (火克金)
  '금': '목', // 금극목 (金克木)
}

/**
 * 나를 생하는 오행 (모)
 */
export const OHANG_MOTHER: Record<Ohang, Ohang> = {
  '목': '수', // 수생목
  '화': '목', // 목생화
  '토': '화', // 화생토
  '금': '토', // 토생금
  '수': '금', // 금생수
}

/**
 * 나를 극하는 오행 (관)
 */
export const OHANG_CONTROLLER: Record<Ohang, Ohang> = {
  '목': '금', // 금극목
  '화': '수', // 수극화
  '토': '목', // 목극토
  '금': '화', // 화극금
  '수': '토', // 토극수
}

// ============================================================================
// 오행 분석 함수
// ============================================================================

/**
 * 사주의 오행 개수 계산
 *
 * @param saju 사주팔자
 * @returns 오행별 개수
 *
 * @example
 * ```typescript
 * const count = countOhang(saju)
 * console.log(count) // { 목: 2, 화: 1, 토: 2, 금: 1, 수: 2 }
 * ```
 */
export function countOhang(saju: Saju): OhangCount {
  const count: OhangCount = {
    목: 0,
    화: 0,
    토: 0,
    금: 0,
    수: 0,
  }

  // 년주
  count[CHEONGAN_OHANG[saju.year.cheongan]]++
  count[JIJI_OHANG[saju.year.jiji]]++

  // 월주
  count[CHEONGAN_OHANG[saju.month.cheongan]]++
  count[JIJI_OHANG[saju.month.jiji]]++

  // 일주
  count[CHEONGAN_OHANG[saju.day.cheongan]]++
  count[JIJI_OHANG[saju.day.jiji]]++

  // 시주
  count[CHEONGAN_OHANG[saju.hour.cheongan]]++
  count[JIJI_OHANG[saju.hour.jiji]]++

  return count
}

/**
 * 오행 균형 분석
 *
 * @param saju 사주팔자
 * @returns 오행 분석 결과
 *
 * @example
 * ```typescript
 * const analysis = analyzeOhangBalance(saju)
 * console.log(analysis.strong) // ['목', '토']
 * console.log(analysis.weak)   // ['화', '수']
 * console.log(analysis.yongsin) // ['화', '금']
 * ```
 */
export function analyzeOhangBalance(saju: Saju): OhangAnalysis {
  const count = countOhang(saju)

  // 강한 오행 (3개 이상)
  const strong: Ohang[] = []
  // 약한 오행 (1개)
  const weak: Ohang[] = []
  // 없는 오행 (0개)
  const missing: Ohang[] = []

  OHANG_LIST.forEach((ohang) => {
    if (count[ohang] >= 3) {
      strong.push(ohang)
    } else if (count[ohang] === 1) {
      weak.push(ohang)
    } else if (count[ohang] === 0) {
      missing.push(ohang)
    }
  })

  // 용신 추출 (부족한 오행을 보충)
  const yongsin = extractYongsin(saju, count, weak, missing)

  // 기신 (피해야 할 오행, 주로 과다한 오행)
  const gisin = [...strong]

  // 사주 강약 판단
  const ilganOhang = CHEONGAN_OHANG[saju.day.cheongan]
  const ilganCount = count[ilganOhang]
  const strength = ilganCount >= 3 ? '강' : ilganCount === 1 ? '약' : '중'

  // 분석 설명 생성
  const description = generateAnalysisDescription(count, strong, weak, missing, yongsin)

  return {
    count,
    strong,
    weak,
    missing,
    yongsin,
    gisin,
    strength,
    description,
  }
}

/**
 * 용신 추출
 *
 * 명리학의 용신론을 바탕으로 필요한 오행을 추출합니다.
 *
 * @param saju 사주팔자
 * @param count 오행 개수
 * @param weak 약한 오행
 * @param missing 없는 오행
 * @returns 용신 배열
 */
function extractYongsin(
  saju: Saju,
  count: OhangCount,
  weak: Ohang[],
  missing: Ohang[]
): Ohang[] {
  const yongsin: Ohang[] = []

  // 일간의 오행
  const ilganOhang = CHEONGAN_OHANG[saju.day.cheongan]

  // 1. 부족한 오행 (없거나 약한 오행)
  if (missing.length > 0) {
    // 없는 오행 중에서 일간을 생하는 오행 우선
    const supportingMissing = missing.filter(
      (ohang) => OHANG_SAENGSEONG[ohang] === ilganOhang
    )
    if (supportingMissing.length > 0) {
      yongsin.push(...supportingMissing)
    } else {
      // 없으면 그냥 없는 오행 추가
      yongsin.push(...missing.slice(0, 2))
    }
  }

  // 2. 약한 오행 중 일간과 관련된 오행
  if (weak.length > 0) {
    const supportingWeak = weak.filter(
      (ohang) =>
        OHANG_SAENGSEONG[ohang] === ilganOhang || // 나를 생하는 오행
        OHANG_SAENGSEONG[ilganOhang] === ohang    // 내가 생하는 오행
    )
    yongsin.push(...supportingWeak)
  }

  // 중복 제거 및 최대 3개까지
  return Array.from(new Set(yongsin)).slice(0, 3)
}

/**
 * 분석 설명 생성
 */
function generateAnalysisDescription(
  count: OhangCount,
  strong: Ohang[],
  weak: Ohang[],
  missing: Ohang[],
  yongsin: Ohang[]
): string {
  const parts: string[] = []

  // 오행 개수 설명
  parts.push(`오행 분포: 목${count.목}, 화${count.화}, 토${count.토}, 금${count.금}, 수${count.수}`)

  // 강한 오행
  if (strong.length > 0) {
    parts.push(`강한 오행: ${strong.join(', ')}`)
  }

  // 약한 오행
  if (weak.length > 0) {
    parts.push(`약한 오행: ${weak.join(', ')}`)
  }

  // 없는 오행
  if (missing.length > 0) {
    parts.push(`부족한 오행: ${missing.join(', ')}`)
  }

  // 용신
  if (yongsin.length > 0) {
    parts.push(`용신(필요한 오행): ${yongsin.join(', ')}`)
  }

  return parts.join('. ')
}

/**
 * 두 오행의 관계 확인
 *
 * @param ohang1 첫 번째 오행
 * @param ohang2 두 번째 오행
 * @returns 관계 (상생, 상극, 비화, 같음)
 *
 * @example
 * ```typescript
 * getOhangRelation('목', '화') // '상생' (목생화)
 * getOhangRelation('목', '토') // '상극' (목극토)
 * getOhangRelation('목', '목') // '같음'
 * ```
 */
export function getOhangRelation(
  ohang1: Ohang,
  ohang2: Ohang
): '상생' | '상극' | '비화' | '같음' {
  if (ohang1 === ohang2) return '같음'

  if (OHANG_SAENGSEONG[ohang1] === ohang2) return '상생'
  if (OHANG_SANGGEUK[ohang1] === ohang2) return '상극'

  return '비화' // 특별한 관계 없음
}

/**
 * 오행 조화 점수 계산
 *
 * @param sajuOhang 사주의 오행 분석
 * @param nameOhang 이름의 오행
 * @returns 조화 점수 (0-100)
 *
 * @example
 * ```typescript
 * const analysis = analyzeOhangBalance(saju)
 * const score = calculateOhangHarmony(analysis, '화')
 * console.log(score) // 85
 * ```
 */
export function calculateOhangHarmony(
  sajuOhang: OhangAnalysis,
  nameOhang: Ohang
): number {
  let score = 50 // 기본 점수

  // 용신과 일치하면 +30점
  if (sajuOhang.yongsin.includes(nameOhang)) {
    score += 30
  }

  // 약한 오행이면 +20점
  if (sajuOhang.weak.includes(nameOhang)) {
    score += 20
  }

  // 없는 오행이면 +25점
  if (sajuOhang.missing.includes(nameOhang)) {
    score += 25
  }

  // 강한 오행(기신)이면 -30점
  if (sajuOhang.gisin.includes(nameOhang)) {
    score -= 30
  }

  // 일간과의 관계
  // (실제로는 일간 오행을 매개변수로 받아야 하지만, 여기서는 간단히)

  return Math.max(0, Math.min(100, score))
}

/**
 * 강한 오행 추출
 *
 * @param analysis 오행 분석 결과
 * @returns 강한 오행 배열
 */
export function getStrongElement(analysis: OhangAnalysis): Ohang[] {
  return analysis.strong
}

/**
 * 약한 오행 추출
 *
 * @param analysis 오행 분석 결과
 * @returns 약한 오행 배열
 */
export function getWeakElement(analysis: OhangAnalysis): Ohang[] {
  return [...analysis.weak, ...analysis.missing]
}
