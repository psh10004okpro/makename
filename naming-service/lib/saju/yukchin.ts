/**
 * 육친(六親) 분석 시스템
 *
 * 십성을 기반으로 가족 관계 운세를 분석합니다.
 */

import type { Saju, SipseongAnalysis, YukchinAnalysis, YukchinLuck, Sipseong } from './types'
import { analyzeSipseong } from './sipseong'

/**
 * 개수를 운세 등급으로 변환
 */
function countToLuck(count: number): YukchinLuck {
  if (count >= 4) return '매우 좋음'
  if (count === 3) return '좋음'
  if (count === 2) return '보통'
  if (count === 1) return '약함'
  return '매우 약함'
}

/**
 * 부모운 분석
 * 정인, 편인 기준
 */
function analyzeParents(sipseongAnalysis: SipseongAnalysis) {
  const sipseong: Sipseong[] = ['정인', '편인']
  const count = sipseongAnalysis.count.정인 + sipseongAnalysis.count.편인
  const luck = countToLuck(count)

  let description = ''
  let recommendations: string[] = []

  if (count >= 3) {
    description = '부모운이 매우 좋습니다. 부모님의 사랑과 보살핌을 많이 받으며, 부모님과의 관계가 원만합니다. 부모님의 덕을 크게 봅니다.'
    recommendations.push('부모님께 효도하는 마음을 담은 한자 (孝, 親, 敬)')
    recommendations.push('부모님의 은혜를 갚는 의미의 한자 (恩, 德, 報)')
  } else if (count === 2) {
    description = '부모운이 보통입니다. 부모님과의 관계는 평범하며, 때로 멀리 떨어져 지낼 수 있습니다.'
    recommendations.push('부모님과의 유대를 강화하는 한자 (親, 孝, 和)')
  } else if (count === 1) {
    description = '부모운이 약한 편입니다. 부모님과 이별하거나 멀리 떨어져 지낼 수 있으며, 일찍 독립할 가능성이 있습니다.'
    recommendations.push('부모 인연을 보강하는 한자 필요 (親, 孝, 敬, 慈)')
    recommendations.push('독립적이되 효를 실천하는 의미')
  } else {
    description = '부모운이 매우 약합니다. 부모님의 도움을 받기 어렵거나, 일찍 부모님과 이별할 수 있습니다. 스스로 독립해야 하는 운명입니다.'
    recommendations.push('부모 인연을 보강하는 한자 강력 추천 (親, 孝, 敬, 慈, 愛)')
    recommendations.push('자립과 효도를 함께 담는 이름')
  }

  return {
    luck,
    sipseong,
    count,
    description,
    recommendations,
  }
}

/**
 * 형제자매운 분석
 * 비견, 겁재 기준
 */
function analyzeSiblings(sipseongAnalysis: SipseongAnalysis) {
  const sipseong: Sipseong[] = ['비견', '겁재']
  const count = sipseongAnalysis.count.비견 + sipseongAnalysis.count.겁재
  const luck = countToLuck(count)

  let description = ''
  let recommendations: string[] = []

  if (count >= 3) {
    description = '형제자매가 많거나 형제자매와의 인연이 깊습니다. 친구나 동료들과도 잘 어울리며, 협력 관계가 좋습니다.'
    recommendations.push('화목과 협력을 상징하는 한자 (和, 協, 同, 友)')
  } else if (count === 2) {
    description = '형제자매운이 보통입니다. 형제자매와의 관계는 평범하며, 때로 경쟁하기도 합니다.'
    recommendations.push('조화와 우애를 담은 한자 (和, 睦, 友)')
  } else if (count === 1) {
    description = '형제자매운이 약합니다. 외동이거나 형제자매와 떨어져 지낼 수 있습니다. 독립적인 성향이 강합니다.'
    recommendations.push('우애와 화합의 한자로 보완 (和, 友, 親)')
  } else {
    description = '형제자매운이 매우 약합니다. 외동이거나 형제자매의 도움을 받기 어렵습니다. 스스로 해결하는 능력이 필요합니다.'
    recommendations.push('협력과 우애의 한자로 보완 (和, 協, 友, 睦)')
  }

  return {
    luck,
    sipseong,
    count,
    description,
    recommendations,
  }
}

/**
 * 자녀운 분석
 * 식신, 상관 기준
 */
function analyzeChildren(sipseongAnalysis: SipseongAnalysis) {
  const sipseong: Sipseong[] = ['식신', '상관']
  const count = sipseongAnalysis.count.식신 + sipseongAnalysis.count.상관
  const luck = countToLuck(count)

  let description = ''
  let recommendations: string[] = []

  if (count >= 3) {
    description = '자녀운이 매우 좋습니다. 자녀를 많이 두거나, 자녀와의 인연이 깊습니다. 자녀로 인한 기쁨이 많습니다.'
    recommendations.push('자녀 교육과 성장을 담은 한자 (育, 養, 慈, 愛)')
  } else if (count === 2) {
    description = '자녀운이 보통입니다. 자녀와의 관계는 평범하며, 자녀 양육에 적당한 노력이 필요합니다.'
    recommendations.push('자녀 사랑을 담은 한자 (愛, 慈, 育)')
  } else if (count === 1) {
    description = '자녀운이 약합니다. 자녀를 적게 두거나, 자녀 양육에 어려움이 있을 수 있습니다.'
    recommendations.push('자녀 인연을 보강하는 한자 (子, 育, 養, 愛)')
  } else {
    description = '자녀운이 매우 약합니다. 자녀를 두기 어렵거나, 자녀와 떨어져 지낼 수 있습니다.'
    recommendations.push('자녀 인연을 강화하는 한자 강력 추천 (子, 育, 養, 愛, 慈)')
  }

  return {
    luck,
    sipseong,
    count,
    description,
    recommendations,
  }
}

/**
 * 배우자운 분석
 * 남자: 정재, 편재 / 여자: 정관, 편관 기준
 */
function analyzeSpouse(sipseongAnalysis: SipseongAnalysis, gender: 'MALE' | 'FEMALE') {
  let sipseong: Sipseong[]
  let count: number

  if (gender === 'MALE') {
    // 남자는 재성으로 배우자 판단
    sipseong = ['정재', '편재']
    count = sipseongAnalysis.count.정재 + sipseongAnalysis.count.편재
  } else {
    // 여자는 관성으로 배우자 판단
    sipseong = ['정관', '편관']
    count = sipseongAnalysis.count.정관 + sipseongAnalysis.count.편관
  }

  const luck = countToLuck(count)

  let description = ''
  let recommendations: string[] = []

  if (count >= 3) {
    description = '배우자운이 복잡합니다. 이성 인연이 많으나, 너무 많아서 선택에 어려움이 있을 수 있습니다. 결혼 후에도 이성 문제 주의가 필요합니다.'
    recommendations.push('정숙과 신의를 담은 한자 (貞, 信, 誠, 節)')
    recommendations.push('한 사람에게 집중하는 의미 (一, 專, 定)')
  } else if (count === 2) {
    description = '배우자운이 좋습니다. 좋은 배우자를 만날 수 있으며, 결혼생활이 원만합니다.'
    recommendations.push('화목과 사랑을 담은 한자 (和, 愛, 樂, 美)')
  } else if (count === 1) {
    description = '배우자운이 약합니다. 배우자를 만나기 어렵거나, 결혼이 늦어질 수 있습니다.'
    recommendations.push('인연을 강화하는 한자 (緣, 合, 和, 愛)')
    recommendations.push('배우자 인연을 보강하는 의미')
  } else {
    description = '배우자운이 매우 약합니다. 결혼이 매우 늦거나, 배우자와의 인연이 약합니다. 독신으로 지낼 가능성도 있습니다.'
    recommendations.push('인연을 강화하는 한자 강력 추천 (緣, 合, 和, 愛, 情)')
    recommendations.push('배우자 인연을 적극적으로 보강')
  }

  return {
    luck,
    sipseong,
    count,
    description,
    recommendations,
  }
}

/**
 * 재물운 분석
 * 정재, 편재 기준
 */
function analyzeWealth(sipseongAnalysis: SipseongAnalysis) {
  const sipseong: Sipseong[] = ['정재', '편재']
  const count = sipseongAnalysis.count.정재 + sipseongAnalysis.count.편재
  const luck = countToLuck(count)

  let description = ''
  let recommendations: string[] = []

  if (count >= 3) {
    description = '재물운이 매우 좋습니다. 재물을 모으는 능력이 뛰어나며, 사업이나 투자로 성공할 수 있습니다.'
    recommendations.push('재물 관리와 절제를 담은 한자 (節, 儉, 賢, 明)')
    recommendations.push('너무 많은 재물에 집착하지 않도록')
  } else if (count === 2) {
    description = '재물운이 좋습니다. 적절한 재물을 모을 수 있으며, 경제적으로 안정됩니다.'
    recommendations.push('재물 증진을 담은 한자 (富, 財, 寶, 金)')
  } else if (count === 1) {
    description = '재물운이 약합니다. 재물을 모으기 어렵거나, 돈이 생겨도 쉽게 나갑니다.'
    recommendations.push('재물을 보강하는 한자 (富, 財, 寶, 金, 福)')
    recommendations.push('절약과 재테크의 의미')
  } else {
    description = '재물운이 매우 약합니다. 재물과 인연이 박하여 평생 재물로 고생할 수 있습니다.'
    recommendations.push('재물을 강화하는 한자 강력 추천 (富, 財, 寶, 金, 福, 祿)')
    recommendations.push('재물 인연을 적극적으로 보강')
  }

  return {
    luck,
    sipseong,
    count,
    description,
    recommendations,
  }
}

/**
 * 육친 종합 분석
 */
export function analyzeYukchin(saju: Saju, gender: 'MALE' | 'FEMALE'): YukchinAnalysis {
  // 십성 분석 먼저 수행
  const sipseongAnalysis = analyzeSipseong(saju)

  // 각 육친 분석
  const parents = analyzeParents(sipseongAnalysis)
  const siblings = analyzeSiblings(sipseongAnalysis)
  const children = analyzeChildren(sipseongAnalysis)
  const spouse = analyzeSpouse(sipseongAnalysis, gender)
  const wealth = analyzeWealth(sipseongAnalysis)

  // 종합 평가
  const allAreas = [
    { name: '부모', data: parents },
    { name: '형제자매', data: siblings },
    { name: '자녀', data: children },
    { name: '배우자', data: spouse },
    { name: '재물', data: wealth },
  ]

  const strongAreas = allAreas
    .filter((area) => area.data.luck === '매우 좋음' || area.data.luck === '좋음')
    .map((area) => area.name)

  const weakAreas = allAreas
    .filter((area) => area.data.luck === '약함' || area.data.luck === '매우 약함')
    .map((area) => area.name)

  // 작명 가이드 종합
  let namingGuide = ''
  if (weakAreas.length > 0) {
    namingGuide = `${weakAreas.join(', ')} 인연이 약하므로, 이를 보강하는 한자를 사용하는 것이 좋습니다. `
  }
  if (strongAreas.length > 0) {
    namingGuide += `${strongAreas.join(', ')} 인연은 좋으므로, 이를 더욱 강화하는 한자도 좋습니다.`
  }

  return {
    parents,
    siblings,
    children,
    spouse,
    wealth,
    overall: {
      strongAreas,
      weakAreas,
      namingGuide: namingGuide || '전반적으로 균형잡힌 육친 관계입니다.',
    },
  }
}
