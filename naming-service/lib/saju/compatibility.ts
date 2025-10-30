/**
 * 사주와 이름의 궁합 평가 엔진
 *
 * 사주팔자와 이름의 오행 조화를 분석하여 적합성을 평가합니다.
 */

import type {
  Saju,
  Ohang,
  OhangAnalysis,
  CompatibilityScore,
  NamingRecommendation,
} from './types'
import {
  analyzeOhangBalance,
  calculateOhangHarmony,
  CHEONGAN_OHANG,
  CHEONGAN_EUMYANG,
} from './ohang'

// ============================================================================
// 궁합 평가 함수
// ============================================================================

/**
 * 이름과 사주의 궁합 점수 계산
 *
 * @param saju 사주팔자
 * @param nameOhang 이름의 주된 오행
 * @param nameStrokes 이름의 총 획수 (선택)
 * @returns 궁합 점수 및 평가
 *
 * @example
 * ```typescript
 * const score = evaluateNameCompatibility(saju, '화', 15)
 * console.log(score.total)  // 85
 * console.log(score.grade)  // "A"
 * console.log(score.details) // ["오행 조화가 매우 좋습니다", ...]
 * ```
 */
export function evaluateNameCompatibility(
  saju: Saju,
  nameOhang: Ohang,
  nameStrokes?: number
): CompatibilityScore {
  // 오행 분석
  const ohangAnalysis = analyzeOhangBalance(saju)

  // 1. 오행 조화 점수 (40점 만점)
  const ohangHarmony = calculateDetailedOhangHarmony(ohangAnalysis, nameOhang, saju)

  // 2. 음양 균형 점수 (30점 만점)
  const eumyangBalance = calculateEumyangBalance(saju, nameOhang)

  // 3. 획수 점수 (30점 만점)
  const strokeScore = nameStrokes ? calculateStrokeScore(nameStrokes) : 25

  // 총점 계산
  const total = ohangHarmony + eumyangBalance + strokeScore

  // 등급 결정
  const grade = getGrade(total)

  // 상세 설명 생성
  const details = generateCompatibilityDetails(
    ohangAnalysis,
    nameOhang,
    ohangHarmony,
    eumyangBalance,
    strokeScore,
    nameStrokes
  )

  return {
    total: Math.round(total),
    ohangHarmony: Math.round(ohangHarmony),
    eumyangBalance: Math.round(eumyangBalance),
    strokeScore: Math.round(strokeScore),
    grade,
    details,
  }
}

/**
 * 작명 추천 정보 생성
 *
 * @param saju 사주팔자
 * @returns 작명 추천 정보
 *
 * @example
 * ```typescript
 * const recommendation = generateNamingRecommendation(saju)
 * console.log(recommendation.recommendedOhang) // ['화', '토']
 * console.log(recommendation.avoidOhang)       // ['수']
 * console.log(recommendation.reason)           // "사주에 화와 토가 부족하므로..."
 * ```
 */
export function generateNamingRecommendation(saju: Saju): NamingRecommendation {
  const ohangAnalysis = analyzeOhangBalance(saju)

  // 추천 오행 = 용신
  const recommendedOhang = [...ohangAnalysis.yongsin]

  // 약한 오행도 추가 가능
  ohangAnalysis.weak.forEach((ohang) => {
    if (!recommendedOhang.includes(ohang) && recommendedOhang.length < 3) {
      recommendedOhang.push(ohang)
    }
  })

  // 피해야 할 오행 = 기신 (과다한 오행)
  const avoidOhang = [...ohangAnalysis.gisin]

  // 추천 획수 (길한 획수)
  const recommendedStrokes = getAuspiciousStrokes()

  // 이유 설명
  const reason = generateRecommendationReason(ohangAnalysis, recommendedOhang, avoidOhang)

  return {
    recommendedOhang,
    avoidOhang,
    recommendedStrokes,
    reason,
  }
}

// ============================================================================
// Private Helper Functions
// ============================================================================

/**
 * 상세 오행 조화 점수 (40점 만점)
 */
function calculateDetailedOhangHarmony(
  analysis: OhangAnalysis,
  nameOhang: Ohang,
  saju: Saju
): number {
  let score = 0

  // 용신과 일치 (+30점)
  if (analysis.yongsin.includes(nameOhang)) {
    score += 30
  }

  // 약한 오행 (+15점)
  else if (analysis.weak.includes(nameOhang)) {
    score += 15
  }

  // 없는 오행 (+20점)
  else if (analysis.missing.includes(nameOhang)) {
    score += 20
  }

  // 일반 오행 (+10점)
  else if (!analysis.strong.includes(nameOhang)) {
    score += 10
  }

  // 강한 오행(기신) (-10점)
  else {
    score -= 10
  }

  // 일간과의 관계 보너스 (+10점)
  const ilganOhang = CHEONGAN_OHANG[saju.day.cheongan]
  if (nameOhang === ilganOhang) {
    score += 10 // 같은 오행
  }

  return Math.max(0, Math.min(40, score))
}

/**
 * 음양 균형 점수 (30점 만점)
 */
function calculateEumyangBalance(saju: Saju, nameOhang: Ohang): number {
  let yangCount = 0
  let eumCount = 0

  // 사주의 음양 개수 세기
  const pillars = [saju.year, saju.month, saju.day, saju.hour]
  pillars.forEach((pillar) => {
    if (CHEONGAN_EUMYANG[pillar.cheongan] === '양') yangCount++
    else eumCount++
  })

  // 음양 불균형 정도
  const imbalance = Math.abs(yangCount - eumCount)

  // 균형이 좋을수록 높은 점수
  let score = 30 - (imbalance * 3)

  // 이름의 오행이 부족한 쪽을 보완하면 보너스
  // (간단한 근사: 목/화 = 양, 금/수 = 음, 토 = 중립)
  const yangElements: Ohang[] = ['목', '화']
  const eumElements: Ohang[] = ['금', '수']

  if (yangCount < eumCount && yangElements.includes(nameOhang)) {
    score += 5 // 양을 보충
  } else if (eumCount < yangCount && eumElements.includes(nameOhang)) {
    score += 5 // 음을 보충
  } else if (nameOhang === '토') {
    score += 3 // 토는 중립이라 조화
  }

  return Math.max(0, Math.min(30, score))
}

/**
 * 획수 점수 (30점 만점)
 *
 * 전통적으로 길한 획수를 기준으로 평가
 */
function calculateStrokeScore(strokes: number): number {
  // 길한 획수 (대길)
  const veryAuspicious = [1, 3, 5, 6, 7, 8, 11, 13, 15, 16, 17, 18, 21, 23, 24, 25, 29, 31, 32, 33, 35, 37, 39, 41, 45, 47, 48, 52, 57, 63, 65, 67, 68, 81]

  // 중길 획수
  const auspicious = [2, 14, 19, 26, 27, 30, 38, 40, 42, 43, 50, 51, 53, 55, 58, 61, 71, 73, 75]

  // 흉 획수
  const inauspicious = [4, 9, 10, 12, 14, 19, 20, 22, 26, 27, 28, 34, 36, 43, 44, 46, 49, 50, 54, 56, 59, 60, 62, 64, 66, 69, 70, 72, 74, 76, 77, 78, 79, 80]

  if (veryAuspicious.includes(strokes)) {
    return 30 // 대길
  } else if (auspicious.includes(strokes)) {
    return 23 // 중길
  } else if (inauspicious.includes(strokes)) {
    return 10 // 흉
  } else {
    return 18 // 평
  }
}

/**
 * 등급 결정
 */
function getGrade(score: number): string {
  if (score >= 90) return 'A+'
  if (score >= 80) return 'A'
  if (score >= 70) return 'B+'
  if (score >= 60) return 'B'
  if (score >= 50) return 'C+'
  if (score >= 40) return 'C'
  return 'D'
}

/**
 * 궁합 상세 설명 생성
 */
function generateCompatibilityDetails(
  analysis: OhangAnalysis,
  nameOhang: Ohang,
  ohangHarmony: number,
  eumyangBalance: number,
  strokeScore: number,
  nameStrokes?: number
): string[] {
  const details: string[] = []

  // 오행 조화 설명
  if (analysis.yongsin.includes(nameOhang)) {
    details.push(`✓ 이름의 오행(${nameOhang})이 사주의 용신과 일치하여 매우 좋습니다.`)
  } else if (analysis.weak.includes(nameOhang)) {
    details.push(`✓ 이름의 오행(${nameOhang})이 사주의 약한 오행을 보충해줍니다.`)
  } else if (analysis.missing.includes(nameOhang)) {
    details.push(`✓ 이름의 오행(${nameOhang})이 사주에 부족한 오행을 채워줍니다.`)
  } else if (analysis.strong.includes(nameOhang)) {
    details.push(`△ 이름의 오행(${nameOhang})이 사주에 이미 강한 오행입니다. 다른 오행을 고려해보세요.`)
  } else {
    details.push(`○ 이름의 오행(${nameOhang})이 사주와 무난한 조화를 이룹니다.`)
  }

  // 음양 균형 설명
  if (eumyangBalance >= 25) {
    details.push(`✓ 음양의 균형이 매우 좋습니다.`)
  } else if (eumyangBalance >= 20) {
    details.push(`○ 음양의 균형이 양호합니다.`)
  } else {
    details.push(`△ 음양의 균형을 더 고려해볼 필요가 있습니다.`)
  }

  // 획수 설명
  if (nameStrokes) {
    if (strokeScore >= 28) {
      details.push(`✓ 획수 ${nameStrokes}획은 대길한 획수입니다.`)
    } else if (strokeScore >= 20) {
      details.push(`○ 획수 ${nameStrokes}획은 무난한 획수입니다.`)
    } else {
      details.push(`△ 획수 ${nameStrokes}획은 다소 주의가 필요합니다.`)
    }
  }

  return details
}

/**
 * 추천 이유 생성
 */
function generateRecommendationReason(
  analysis: OhangAnalysis,
  recommended: Ohang[],
  avoid: Ohang[]
): string {
  const parts: string[] = []

  if (recommended.length > 0) {
    parts.push(`사주에 ${recommended.join(', ')} 오행이 부족하거나 필요합니다.`)
  }

  if (avoid.length > 0) {
    parts.push(`반면 ${avoid.join(', ')} 오행은 이미 충분하므로 피하는 것이 좋습니다.`)
  }

  if (analysis.yongsin.length > 0) {
    parts.push(`특히 용신인 ${analysis.yongsin.join(', ')} 오행을 포함한 이름이 좋습니다.`)
  }

  return parts.join(' ')
}

/**
 * 길한 획수 목록
 */
function getAuspiciousStrokes(): number[] {
  return [1, 3, 5, 6, 7, 8, 11, 13, 15, 16, 17, 18, 21, 23, 24, 25, 29, 31, 32, 33, 35, 37, 39, 41]
}
