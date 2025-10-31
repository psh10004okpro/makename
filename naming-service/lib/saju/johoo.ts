/**
 * 조후 용신 (Seasonal Yongsin Adjustment)
 *
 * 사주명리학에서 계절에 따른 오행의 강약을 고려하여
 * 용신을 조정하는 시스템입니다.
 *
 * 계절별 특성:
 * - 봄(2-4월): 목이 왕성, 금/토로 제어 필요
 * - 여름(5-7월): 화가 왕성, 수로 조절 필요
 * - 가을(8-10월): 금이 왕성, 화/수로 균형
 * - 겨울(11-1월): 수가 왕성, 화/목으로 온기
 */

import { Ohang } from './types'

/**
 * 계절 정의
 */
export type Season = 'SPRING' | 'SUMMER' | 'FALL' | 'WINTER'

/**
 * 계절 정보
 */
export interface SeasonInfo {
  season: Season
  seasonName: string
  dominantElement: Ohang // 계절의 주도 오행
  weakElements: Ohang[] // 약한 오행
  preferredYongsin: Ohang[] // 선호 용신
  avoidedElements: Ohang[] // 피해야 할 오행
  description: string
  characteristics: string[]
}

/**
 * 조후 조정 정보
 */
export interface JohooAdjustment {
  season: SeasonInfo
  originalYongsin: Ohang[]
  adjustedYongsin: Ohang[]
  adjustmentReason: string
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
}

/**
 * 월에 따른 계절 판단
 */
export function getSeason(month: number): Season {
  // 음력 기준
  // 봄: 인월(1월), 묘월(2월), 진월(3월) -> 양력 2-4월
  // 여름: 사월(4월), 오월(5월), 미월(6월) -> 양력 5-7월
  // 가을: 신월(7월), 유월(8월), 술월(9월) -> 양력 8-10월
  // 겨울: 해월(10월), 자월(11월), 축월(12월) -> 양력 11-1월

  if (month >= 2 && month <= 4) {
    return 'SPRING'
  } else if (month >= 5 && month <= 7) {
    return 'SUMMER'
  } else if (month >= 8 && month <= 10) {
    return 'FALL'
  } else {
    return 'WINTER'
  }
}

/**
 * 계절 정보 가져오기
 */
export function getSeasonInfo(month: number): SeasonInfo {
  const season = getSeason(month)

  const seasonData: Record<Season, SeasonInfo> = {
    SPRING: {
      season: 'SPRING',
      seasonName: '봄(春)',
      dominantElement: '목',
      weakElements: ['금', '토'],
      preferredYongsin: ['금', '토', '화'],
      avoidedElements: ['목', '수'],
      description: '목기(木氣)가 왕성한 계절로 금(金)과 토(土)로 제어가 필요합니다.',
      characteristics: [
        '목이 과하면 분산되고 집중력 부족',
        '금으로 가지치기하여 방향성 제시',
        '토로 뿌리를 안정시켜 기반 마련',
        '화는 목생화로 에너지 발산에 도움',
      ],
    },
    SUMMER: {
      season: 'SUMMER',
      seasonName: '여름(夏)',
      dominantElement: '화',
      weakElements: ['수', '금'],
      preferredYongsin: ['수', '금'],
      avoidedElements: ['화', '목'],
      description: '화기(火氣)가 극성한 계절로 수(水)로 조절이 필수입니다.',
      characteristics: [
        '화가 과하면 조급하고 성격이 급함',
        '수로 냉각하여 침착함과 지혜 부여',
        '금은 수생금으로 간접 지원',
        '목과 화는 더욱 뜨거워지므로 피해야 함',
      ],
    },
    FALL: {
      season: 'FALL',
      seasonName: '가을(秋)',
      dominantElement: '금',
      weakElements: ['화', '목'],
      preferredYongsin: ['화', '수', '목'],
      avoidedElements: ['금', '토'],
      description: '금기(金氣)가 숙살하는 계절로 화(火)와 수(水)로 균형이 필요합니다.',
      characteristics: [
        '금이 과하면 차갑고 냉정함',
        '화로 온기를 더해 따뜻함 회복',
        '수는 금수상생으로 재능 발현',
        '목은 금극목이지만 부드러움 추가',
      ],
    },
    WINTER: {
      season: 'WINTER',
      seasonName: '겨울(冬)',
      dominantElement: '수',
      weakElements: ['화', '목'],
      preferredYongsin: ['화', '목'],
      avoidedElements: ['수', '금'],
      description: '수기(水氣)가 한랭한 계절로 화(火)와 목(木)으로 온기가 필요합니다.',
      characteristics: [
        '수가 과하면 냉정하고 고립됨',
        '화로 따뜻함을 더해 생명력 회복',
        '목은 수생목으로 성장 에너지 제공',
        '수와 금은 더욱 차갑게 만들어 피해야 함',
      ],
    },
  }

  return seasonData[season]
}

/**
 * 계절에 따른 용신 조정
 *
 * @param originalYongsin 기본 용신 분석 결과
 * @param birthMonth 출생 월 (1-12)
 * @returns 조후 조정이 적용된 용신
 */
export function adjustYongsinBySeason(
  originalYongsin: Ohang[],
  birthMonth: number
): JohooAdjustment {
  const seasonInfo = getSeasonInfo(birthMonth)
  const adjustedYongsin: Ohang[] = []

  // Priority 판단
  let priority: 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM'

  // 기존 용신 중 계절에 선호되는 용신 유지
  for (const yongsin of originalYongsin) {
    if (seasonInfo.preferredYongsin.includes(yongsin)) {
      adjustedYongsin.push(yongsin)
      priority = 'HIGH' // 기존 용신이 계절과 맞으면 높은 우선순위
    }
  }

  // 계절 선호 용신 중 기존에 없던 것 추가
  for (const preferred of seasonInfo.preferredYongsin) {
    if (!adjustedYongsin.includes(preferred) && adjustedYongsin.length < 3) {
      adjustedYongsin.push(preferred)
    }
  }

  // 기존 용신 중 계절에 피해야 할 용신이 있는지 체크
  const hasAvoidedElements = originalYongsin.some(y =>
    seasonInfo.avoidedElements.includes(y)
  )
  if (hasAvoidedElements) {
    priority = 'HIGH' // 피해야 할 오행이 있으면 조정 필수
  }

  // 조정이 없었다면 기존 용신 유지
  if (adjustedYongsin.length === 0) {
    adjustedYongsin.push(...originalYongsin)
    priority = 'LOW'
  }

  // 조정 이유 생성
  let adjustmentReason = `${seasonInfo.seasonName} 출생으로 ${seasonInfo.description}\n`

  if (priority === 'HIGH') {
    adjustmentReason += `계절 조후를 반영하여 용신을 조정했습니다. `
    if (hasAvoidedElements) {
      const avoided = originalYongsin.filter(y =>
        seasonInfo.avoidedElements.includes(y)
      )
      adjustmentReason += `기존 용신 [${avoided.join(', ')}]는 이 계절에 과도하여 제외했습니다. `
    }
    adjustmentReason += `최종 용신: [${adjustedYongsin.join(', ')}]`
  } else if (priority === 'MEDIUM') {
    adjustmentReason += `기존 용신에 계절 특성을 보완했습니다.`
  } else {
    adjustmentReason += `기존 용신이 계절과 무난하여 유지합니다.`
  }

  return {
    season: seasonInfo,
    originalYongsin,
    adjustedYongsin,
    adjustmentReason,
    priority,
  }
}

/**
 * 계절별 한자 추천 강도 조정
 *
 * @param hanja 한자
 * @param ohang 한자의 오행
 * @param birthMonth 출생 월
 * @returns 조정된 점수 (0.5 ~ 1.5 배율)
 */
export function getSeasonalHanjaScore(
  hanja: string,
  ohang: Ohang,
  birthMonth: number
): number {
  const seasonInfo = getSeasonInfo(birthMonth)

  // 선호 용신이면 가점
  if (seasonInfo.preferredYongsin.includes(ohang)) {
    return 1.3
  }

  // 피해야 할 오행이면 감점
  if (seasonInfo.avoidedElements.includes(ohang)) {
    return 0.7
  }

  // 중립
  return 1.0
}

/**
 * 계절 조후 설명을 위한 상세 정보
 */
export function getSeasonalGuidance(birthMonth: number): string {
  const seasonInfo = getSeasonInfo(birthMonth)

  return `
## 🌸 계절 조후 (調候) 분석

**출생 계절**: ${seasonInfo.seasonName}
**주도 오행**: ${seasonInfo.dominantElement}
**계절 특성**: ${seasonInfo.description}

### 특징
${seasonInfo.characteristics.map((c, i) => `${i + 1}. ${c}`).join('\n')}

### 작명 시 고려사항
- ✅ **선호 오행**: ${seasonInfo.preferredYongsin.join(', ')} - 이 오행의 한자를 적극 활용
- ⚠️ **주의 오행**: ${seasonInfo.avoidedElements.join(', ')} - 이 오행의 한자는 신중히 사용

계절 조후를 고려한 작명은 사주의 균형을 맞추고 삶의 운을 개선하는 데 매우 중요합니다.
  `.trim()
}

/**
 * 계절별 추천 한자 특성
 */
export function getSeasonalHanjaCharacteristics(birthMonth: number): {
  recommended: string[]
  avoid: string[]
} {
  const seasonInfo = getSeasonInfo(birthMonth)

  const characteristics: Record<
    Season,
    { recommended: string[]; avoid: string[] }
  > = {
    SPRING: {
      recommended: [
        '금 오행: 鋭(예리할 예), 銳(날카로울 예), 鑛(광석 광)',
        '토 오행: 堅(굳을 견), 固(굳을 고), 基(터 기)',
        '화 오행: 明(밝을 명), 輝(빛날 휘), 燦(빛날 찬)',
      ],
      avoid: [
        '목 오행 과다: 林(수풀 림), 森(울창할 삼) - 목이 이미 강함',
        '수 오행: 洪(큰물 홍), 江(강 강) - 목생수로 기운 분산',
      ],
    },
    SUMMER: {
      recommended: [
        '수 오행: 淵(연못 연), 海(바다 해), 潤(윤택할 윤)',
        '금 오행: 珍(보배 진), 瑜(아름다울 유), 瑞(상서로울 서)',
      ],
      avoid: [
        '화 오행 과다: 炎(불꽃 염), 煜(빛날 욱) - 화가 이미 강함',
        '목 오행: 栢(잣나무 백), 楠(녹나무 남) - 목생화로 더 뜨거워짐',
      ],
    },
    FALL: {
      recommended: [
        '화 오행: 曉(새벽 효), 暉(햇빛 휘), 煥(빛날 환)',
        '수 오행: 慧(슬기 혜), 智(지혜 지), 泳(헤엄칠 영)',
        '목 오행: 柔(부드러울 유), 和(화할 화)',
      ],
      avoid: [
        '금 오행 과다: 鋼(강철 강), 銳(날카로울 예) - 금이 이미 강함',
        '토 오행: 堅(굳을 견), 硬(굳을 경) - 금생토로 더 차가워짐',
      ],
    },
    WINTER: {
      recommended: [
        '화 오행: 陽(볕 양), 溫(따뜻할 온), 暖(따뜻할 난)',
        '목 오행: 春(봄 춘), 榮(영화 영), 茂(무성할 무)',
      ],
      avoid: [
        '수 오행 과다: 寒(찰 한), 冷(찰 랭) - 수가 이미 강함',
        '금 오행: 凜(차가울 름), 霜(서리 상) - 금생수로 더 차가워짐',
      ],
    },
  }

  return characteristics[seasonInfo.season]
}
