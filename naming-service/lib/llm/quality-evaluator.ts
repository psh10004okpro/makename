/**
 * 이름 품질 평가 시스템
 *
 * LLM이 생성한 이름의 품질을 다양한 기준으로 평가합니다.
 */

import { NameSuggestion, NamingRequest } from './types'
import { HanjaAnalyzer } from '../hanja/analyzer'
import { HanjaData } from '../hanja/data'

/**
 * 품질 평가 기준
 */
export interface QualityCriteria {
  /** 의미 적절성 (0-100) */
  meaningRelevance: number
  /** 발음 자연스러움 (0-100) */
  pronunciationNaturalness: number
  /** 한자 적절성 (0-100, 한자가 있는 경우) */
  hanjaAppropriateness?: number
  /** 현대성 (0-100) */
  modernity: number
  /** 독창성 (0-100) */
  uniqueness: number
  /** 궁합도 신뢰성 (0-100) */
  compatibilityReliability: number
  /** 추천 이유 품질 (0-100) */
  reasoningQuality: number
}

/**
 * 품질 평가 결과
 */
export interface QualityAssessment {
  /** 제안된 이름 */
  suggestion: NameSuggestion
  /** 평가 기준별 점수 */
  criteria: QualityCriteria
  /** 종합 점수 (0-100) */
  overallScore: number
  /** 등급 (S, A, B, C, D, F) */
  grade: string
  /** 강점 */
  strengths: string[]
  /** 약점 */
  weaknesses: string[]
  /** 개선 제안 */
  improvements: string[]
}

/**
 * 품질 평가 보고서
 */
export interface QualityReport {
  /** 요청 정보 */
  request: NamingRequest
  /** 평가 결과 목록 */
  assessments: QualityAssessment[]
  /** 평균 점수 */
  averageScore: number
  /** 최고 점수 */
  bestScore: number
  /** 최저 점수 */
  worstScore: number
  /** 품질 분포 */
  distribution: {
    S: number
    A: number
    B: number
    C: number
    D: number
    F: number
  }
  /** 전체 강점 */
  overallStrengths: string[]
  /** 전체 약점 */
  overallWeaknesses: string[]
  /** 프롬프트 개선 제안 */
  promptImprovements: string[]
}

/**
 * 이름 품질 평가기
 */
export class NameQualityEvaluator {
  private hanjaAnalyzer: HanjaAnalyzer

  constructor() {
    this.hanjaAnalyzer = new HanjaAnalyzer()
  }

  /**
   * 이름 제안 평가
   */
  async evaluate(
    suggestion: NameSuggestion,
    request: NamingRequest
  ): Promise<QualityAssessment> {
    const criteria: QualityCriteria = {
      meaningRelevance: this.evaluateMeaningRelevance(suggestion, request),
      pronunciationNaturalness: this.evaluatePronunciation(suggestion),
      hanjaAppropriateness: suggestion.hanjaOptions
        ? await this.evaluateHanjaAppropriateness(suggestion, request)
        : undefined,
      modernity: this.evaluateModernity(suggestion),
      uniqueness: this.evaluateUniqueness(suggestion),
      compatibilityReliability: this.evaluateCompatibilityReliability(suggestion),
      reasoningQuality: this.evaluateReasoningQuality(suggestion),
    }

    const overallScore = this.calculateOverallScore(criteria)
    const grade = this.getGrade(overallScore)
    const strengths = this.identifyStrengths(criteria, suggestion)
    const weaknesses = this.identifyWeaknesses(criteria, suggestion)
    const improvements = this.suggestImprovements(weaknesses, suggestion)

    return {
      suggestion,
      criteria,
      overallScore,
      grade,
      strengths,
      weaknesses,
      improvements,
    }
  }

  /**
   * 의미 적절성 평가
   */
  private evaluateMeaningRelevance(
    suggestion: NameSuggestion,
    request: NamingRequest
  ): number {
    let score = 50 // 기본 점수

    // 선호 키워드 일치 확인
    if (request.preferences?.meaningKeywords) {
      const keywords = request.preferences.meaningKeywords
      const meaningLower = suggestion.meaning.toLowerCase()

      const matchedKeywords = keywords.filter(keyword =>
        meaningLower.includes(keyword.toLowerCase())
      )

      // 매칭된 키워드 수에 따라 점수 증가
      score += matchedKeywords.length * 15
    }

    // 의미 길이 확인 (너무 짧거나 길면 감점)
    if (suggestion.meaning.length < 10) {
      score -= 10
    } else if (suggestion.meaning.length > 100) {
      score -= 5
    }

    // 긍정적 단어 포함 확인
    const positiveWords = [
      '지혜',
      '사랑',
      '평화',
      '행복',
      '건강',
      '성공',
      '아름다움',
      '용기',
      '희망',
    ]
    const hasPositiveWord = positiveWords.some(word =>
      suggestion.meaning.includes(word)
    )
    if (hasPositiveWord) score += 10

    return Math.min(100, Math.max(0, score))
  }

  /**
   * 발음 자연스러움 평가
   */
  private evaluatePronunciation(suggestion: NameSuggestion): number {
    let score = 70 // 기본 점수

    const name = suggestion.name

    // 이름 길이 확인 (2-3자가 가장 자연스러움)
    if (name.length === 2 || name.length === 3) {
      score += 10
    } else if (name.length === 1 || name.length === 4) {
      score -= 10
    } else {
      score -= 20
    }

    // 받침 패턴 확인 (너무 많은 받침은 발음하기 어려움)
    const consonantEndings = name.split('').filter(char => {
      const code = char.charCodeAt(0)
      if (code < 0xac00 || code > 0xd7a3) return false
      const jongseong = (code - 0xac00) % 28
      return jongseong !== 0
    })

    if (consonantEndings.length === 0) {
      // 받침이 하나도 없으면 부드러움
      score += 15
    } else if (consonantEndings.length === name.length) {
      // 모든 글자에 받침이 있으면 딱딱함
      score -= 15
    }

    // phonetics 설명 품질 확인
    if (suggestion.phonetics.length < 10) {
      score -= 10
    }

    return Math.min(100, Math.max(0, score))
  }

  /**
   * 한자 적절성 평가
   */
  private async evaluateHanjaAppropriateness(
    suggestion: NameSuggestion,
    request: NamingRequest
  ): Promise<number> {
    if (!suggestion.hanjaOptions || suggestion.hanjaOptions.length === 0) {
      return 0
    }

    let totalScore = 0
    const option = suggestion.hanjaOptions[0] // 첫 번째 옵션 평가

    // 오행 일치 확인
    if (request.sajuAnalysis?.yongsin) {
      const yongsinMatches = option.ohang.filter(o =>
        request.sajuAnalysis!.yongsin.includes(o as any)
      )
      totalScore += yongsinMatches.length * 20
    }

    // 기신과 일치하면 감점
    if (request.sajuAnalysis?.gisin) {
      const gisinMatches = option.ohang.filter(o =>
        request.sajuAnalysis!.gisin.includes(o as any)
      )
      totalScore -= gisinMatches.length * 20
    }

    // 획수 길흉 확인
    const strokeScores = option.strokes.map(strokes => {
      const strokeInfo = this.hanjaAnalyzer.calculateStrokeLuck(strokes)
      return strokeInfo.score
    })
    const avgStrokeScore = strokeScores.reduce((a, b) => a + b, 0) / strokeScores.length
    totalScore += avgStrokeScore * 0.3

    // 의미 적절성 확인
    const hasGoodMeaning = option.meanings.every(m => m.length > 3)
    if (hasGoodMeaning) totalScore += 10

    return Math.min(100, Math.max(0, totalScore + 30))
  }

  /**
   * 현대성 평가
   */
  private evaluateModernity(suggestion: NameSuggestion): number {
    let score = 50

    const name = suggestion.name

    // 현대적인 이름 패턴 (ㅓ, ㅜ, ㅣ 등 밝은 모음)
    const modernVowels = ['ㅓ', 'ㅕ', 'ㅗ', 'ㅛ', 'ㅜ', 'ㅠ', 'ㅣ']
    const hasModernVowel = modernVowels.some(vowel => name.includes(vowel))
    if (hasModernVowel) score += 15

    // 2음절 이름은 현대적
    if (name.length === 2) score += 10

    // phonetics에 "현대적" 언급이 있으면 가산점
    if (suggestion.phonetics.includes('현대적')) score += 15

    // 너무 전통적인 한자만 있으면 감점
    if (suggestion.hanjaOptions && suggestion.hanjaOptions.length > 0) {
      const firstOption = suggestion.hanjaOptions[0]
      const traditionalChars = ['壽', '福', '祿', '貴', '富']
      const hasTraditional = traditionalChars.some(char =>
        firstOption.characters.includes(char)
      )
      if (hasTraditional) score -= 10
    }

    return Math.min(100, Math.max(0, score))
  }

  /**
   * 독창성 평가
   */
  private evaluateUniqueness(suggestion: NameSuggestion): number {
    let score = 60

    const name = suggestion.name

    // 매우 흔한 이름들
    const commonNames = [
      '민준',
      '서준',
      '예준',
      '도윤',
      '시우',
      '지호',
      '서연',
      '서윤',
      '지우',
      '하은',
    ]
    if (commonNames.includes(name)) {
      score -= 30
    }

    // 이름 길이가 일반적이지 않으면 독특함
    if (name.length === 1 || name.length >= 4) {
      score += 20
    }

    // 한자 조합이 독특하면 가산점
    if (suggestion.hanjaOptions && suggestion.hanjaOptions.length > 2) {
      score += 10
    }

    return Math.min(100, Math.max(0, score))
  }

  /**
   * 궁합도 신뢰성 평가
   */
  private evaluateCompatibilityReliability(suggestion: NameSuggestion): number {
    let score = 50

    const compat = suggestion.compatibility

    // 점수가 모두 채워져 있는지 확인
    const scoreCount = [compat.saju, compat.ohang, compat.strokes, compat.phonetics].filter(
      s => s !== undefined && s > 0
    ).length

    score += scoreCount * 10

    // 총점과 개별 점수의 일관성 확인
    const scores = [compat.saju, compat.ohang, compat.strokes, compat.phonetics].filter(
      (s): s is number => s !== undefined && s > 0
    )

    if (scores.length > 0) {
      const average = scores.reduce((a, b) => a + b, 0) / scores.length
      const diff = Math.abs(compat.total - average)

      // 차이가 작을수록 신뢰도 높음
      if (diff < 5) score += 20
      else if (diff < 10) score += 10
      else score -= 10
    }

    // 점수가 너무 높거나 낮으면 의심스러움
    if (compat.total > 95 || compat.total < 50) {
      score -= 15
    }

    return Math.min(100, Math.max(0, score))
  }

  /**
   * 추천 이유 품질 평가
   */
  private evaluateReasoningQuality(suggestion: NameSuggestion): number {
    let score = 50

    const reasoning = suggestion.reasoning

    // 길이 확인 (최소 30자 이상)
    if (reasoning.length >= 30) score += 20
    else if (reasoning.length < 20) score -= 20

    // 구체적인 설명 포함 여부
    const specificTerms = ['오행', '사주', '획수', '의미', '발음', '조화']
    const mentionedTerms = specificTerms.filter(term => reasoning.includes(term))
    score += mentionedTerms.length * 5

    // 문장 수 확인 (2문장 이상이 좋음)
    const sentences = reasoning.split(/[.!?]/).filter(s => s.trim().length > 0)
    if (sentences.length >= 2) score += 10
    else if (sentences.length === 1) score -= 10

    // 너무 반복적인 표현 사용 확인
    if (reasoning.includes('좋은 이름') && reasoning.split('좋은 이름').length > 3) {
      score -= 10
    }

    return Math.min(100, Math.max(0, score))
  }

  /**
   * 종합 점수 계산
   */
  private calculateOverallScore(criteria: QualityCriteria): number {
    const weights = {
      meaningRelevance: 0.25,
      pronunciationNaturalness: 0.2,
      hanjaAppropriateness: 0.2,
      modernity: 0.1,
      uniqueness: 0.1,
      compatibilityReliability: 0.1,
      reasoningQuality: 0.05,
    }

    let totalWeight = 0
    let weightedSum = 0

    for (const [key, value] of Object.entries(criteria)) {
      if (value !== undefined) {
        const weight = weights[key as keyof typeof weights]
        weightedSum += value * weight
        totalWeight += weight
      }
    }

    return Math.round(weightedSum / totalWeight)
  }

  /**
   * 등급 계산
   */
  private getGrade(score: number): string {
    if (score >= 95) return 'S'
    if (score >= 90) return 'A+'
    if (score >= 85) return 'A'
    if (score >= 80) return 'B+'
    if (score >= 75) return 'B'
    if (score >= 70) return 'C+'
    if (score >= 65) return 'C'
    if (score >= 60) return 'D+'
    if (score >= 55) return 'D'
    return 'F'
  }

  /**
   * 강점 식별
   */
  private identifyStrengths(
    criteria: QualityCriteria,
    suggestion: NameSuggestion
  ): string[] {
    const strengths: string[] = []

    if (criteria.meaningRelevance >= 80) {
      strengths.push('의미가 요청사항과 매우 잘 일치함')
    }
    if (criteria.pronunciationNaturalness >= 80) {
      strengths.push('발음이 매우 자연스럽고 부드러움')
    }
    if (criteria.hanjaAppropriateness && criteria.hanjaAppropriateness >= 80) {
      strengths.push('한자 선택이 사주와 매우 잘 맞음')
    }
    if (criteria.modernity >= 80) {
      strengths.push('현대적 감각이 뛰어남')
    }
    if (criteria.uniqueness >= 80) {
      strengths.push('독창적이고 개성있는 이름')
    }
    if (criteria.reasoningQuality >= 80) {
      strengths.push('추천 이유가 구체적이고 설득력 있음')
    }

    return strengths
  }

  /**
   * 약점 식별
   */
  private identifyWeaknesses(
    criteria: QualityCriteria,
    suggestion: NameSuggestion
  ): string[] {
    const weaknesses: string[] = []

    if (criteria.meaningRelevance < 60) {
      weaknesses.push('의미가 요청사항과 잘 맞지 않음')
    }
    if (criteria.pronunciationNaturalness < 60) {
      weaknesses.push('발음이 어렵거나 딱딱함')
    }
    if (criteria.hanjaAppropriateness && criteria.hanjaAppropriateness < 60) {
      weaknesses.push('한자가 사주와 잘 맞지 않음')
    }
    if (criteria.modernity < 60) {
      weaknesses.push('너무 전통적이거나 구식 느낌')
    }
    if (criteria.uniqueness < 40) {
      weaknesses.push('너무 흔한 이름')
    }
    if (criteria.compatibilityReliability < 60) {
      weaknesses.push('궁합도 점수가 신뢰하기 어려움')
    }
    if (criteria.reasoningQuality < 60) {
      weaknesses.push('추천 이유가 불충분하거나 모호함')
    }

    return weaknesses
  }

  /**
   * 개선 제안
   */
  private suggestImprovements(
    weaknesses: string[],
    suggestion: NameSuggestion
  ): string[] {
    const improvements: string[] = []

    weaknesses.forEach(weakness => {
      if (weakness.includes('의미')) {
        improvements.push('선호 키워드를 더 명확히 반영한 이름 필요')
      }
      if (weakness.includes('발음')) {
        improvements.push('받침이 적고 부드러운 모음이 많은 이름 고려')
      }
      if (weakness.includes('한자')) {
        improvements.push('용신 오행에 맞는 한자 사용 필요')
      }
      if (weakness.includes('전통적')) {
        improvements.push('2음절 이름 또는 밝은 모음 사용 고려')
      }
      if (weakness.includes('흔한')) {
        improvements.push('더 독특한 한자 조합이나 발음 필요')
      }
      if (weakness.includes('궁합도')) {
        improvements.push('사주 분석에 기반한 정확한 점수 산정 필요')
      }
      if (weakness.includes('추천 이유')) {
        improvements.push('구체적인 근거와 설명이 포함된 이유 필요')
      }
    })

    return improvements
  }

  /**
   * 여러 제안 일괄 평가
   */
  async evaluateAll(
    suggestions: NameSuggestion[],
    request: NamingRequest
  ): Promise<QualityReport> {
    const assessments = await Promise.all(
      suggestions.map(s => this.evaluate(s, request))
    )

    const scores = assessments.map(a => a.overallScore)
    const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length
    const bestScore = Math.max(...scores)
    const worstScore = Math.min(...scores)

    const distribution = {
      S: assessments.filter(a => a.grade === 'S').length,
      A: assessments.filter(a => a.grade.startsWith('A')).length,
      B: assessments.filter(a => a.grade.startsWith('B')).length,
      C: assessments.filter(a => a.grade.startsWith('C')).length,
      D: assessments.filter(a => a.grade.startsWith('D')).length,
      F: assessments.filter(a => a.grade === 'F').length,
    }

    // 전체 강점/약점 집계
    const allStrengths = assessments.flatMap(a => a.strengths)
    const allWeaknesses = assessments.flatMap(a => a.weaknesses)

    const overallStrengths = this.getTopItems(allStrengths, 5)
    const overallWeaknesses = this.getTopItems(allWeaknesses, 5)

    // 프롬프트 개선 제안
    const promptImprovements = this.generatePromptImprovements(
      assessments,
      overallWeaknesses
    )

    return {
      request,
      assessments,
      averageScore: Math.round(averageScore),
      bestScore,
      worstScore,
      distribution,
      overallStrengths,
      overallWeaknesses,
      promptImprovements,
    }
  }

  /**
   * 상위 항목 추출 (빈도수 기준)
   */
  private getTopItems(items: string[], limit: number): string[] {
    const counts = new Map<string, number>()

    items.forEach(item => {
      counts.set(item, (counts.get(item) || 0) + 1)
    })

    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([item]) => item)
  }

  /**
   * 프롬프트 개선 제안 생성
   */
  private generatePromptImprovements(
    assessments: QualityAssessment[],
    weaknesses: string[]
  ): string[] {
    const improvements: string[] = []

    // 평균 점수가 낮은 기준 찾기
    const avgCriteria = {
      meaningRelevance: 0,
      pronunciationNaturalness: 0,
      hanjaAppropriateness: 0,
      modernity: 0,
      uniqueness: 0,
      compatibilityReliability: 0,
      reasoningQuality: 0,
    }

    assessments.forEach(a => {
      Object.keys(avgCriteria).forEach(key => {
        const value = a.criteria[key as keyof QualityCriteria]
        if (value !== undefined) {
          avgCriteria[key as keyof typeof avgCriteria] += value
        }
      })
    })

    Object.keys(avgCriteria).forEach(key => {
      avgCriteria[key as keyof typeof avgCriteria] /= assessments.length
    })

    // 낮은 점수 기준에 대한 개선안
    if (avgCriteria.meaningRelevance < 70) {
      improvements.push(
        '프롬프트에 "사용자가 요청한 의미 키워드를 반드시 이름의 의미에 포함하세요" 추가'
      )
    }

    if (avgCriteria.pronunciationNaturalness < 70) {
      improvements.push(
        '프롬프트에 "발음이 부드럽고 자연스러운 이름을 우선하세요. 받침이 많은 이름은 피하세요" 추가'
      )
    }

    if (avgCriteria.hanjaAppropriateness && avgCriteria.hanjaAppropriateness < 70) {
      improvements.push(
        '프롬프트에 "용신 오행에 해당하는 한자를 우선적으로 사용하고, 기신 오행의 한자는 절대 사용하지 마세요" 강조'
      )
    }

    if (avgCriteria.modernity < 70) {
      improvements.push('프롬프트에 "현대적 감각의 이름을 더 많이 제안하세요" 추가')
    }

    if (avgCriteria.uniqueness < 60) {
      improvements.push(
        '프롬프트에 "너무 흔한 이름(민준, 서연 등)은 피하고 독창적인 이름을 제안하세요" 추가'
      )
    }

    if (avgCriteria.reasoningQuality < 70) {
      improvements.push(
        '프롬프트에 "reasoning은 최소 3문장 이상으로 구체적인 근거를 포함하여 작성하세요" 추가'
      )
    }

    if (avgCriteria.compatibilityReliability < 70) {
      improvements.push(
        '프롬프트에 "궁합도 점수는 사주 분석에 기반하여 정확하게 산정하세요" 추가'
      )
    }

    return improvements
  }
}

/**
 * 기본 인스턴스
 */
export const nameQualityEvaluator = new NameQualityEvaluator()
