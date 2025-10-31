/**
 * 신살(神殺) 분석 시스템
 *
 * 사주에 출현하는 신살(길신/흉신)을 판단하고 분석합니다.
 */

import type { Saju, Cheongan, Jiji, Sinsal, SinsalInfo, SinsalAnalysis } from './types'

/**
 * 천을귀인(天乙貴人) 판단
 * 일간을 기준으로 특정 지지에 출현
 */
const CHEONUL_GWIIN_TABLE: Record<Cheongan, Jiji[]> = {
  갑: ['축', '미'],
  을: ['자', '신'],
  병: ['해', '유'],
  정: ['해', '유'],
  무: ['축', '미'],
  기: ['자', '신'],
  경: ['축', '미'],
  신: ['인', '오'],
  임: ['묘', '사'],
  계: ['묘', '사'],
}

/**
 * 도화살(桃花殺) 판단
 * 연지 또는 일지 기준
 */
const DOHWA_TABLE: Record<string, Jiji> = {
  인오술: '묘',  // 寅午戌 → 卯
  사유축: '오',  // 巳酉丑 → 午
  신자진: '유',  // 申子辰 → 酉
  해묘미: '자',  // 亥卯未 → 子
}

/**
 * 역마살(驛馬殺) 판단
 * 연지 또는 일지 기준
 */
const YEOKMA_TABLE: Record<string, Jiji> = {
  인오술: '신',  // 寅午戌 → 申
  사유축: '해',  // 巳酉丑 → 亥
  신자진: '인',  // 申子辰 → 寅
  해묘미: '사',  // 亥卯未 → 巳
}

/**
 * 양인(羊刃) 판단
 * 일간 기준
 */
const YANGIN_TABLE: Record<Cheongan, Jiji> = {
  갑: '묘',
  을: '인',
  병: '오',
  정: '사',
  무: '오',
  기: '사',
  경: '유',
  신: '신',
  임: '자',
  계: '해',
}

/**
 * 공망(空亡) 판단
 * 일주(갑자) 기준으로 해당 순환에서 비어있는 지지
 */
const GONGMANG_TABLE: Record<string, Jiji[]> = {
  갑자: ['술', '해'],
  갑술: ['신', '유'],
  갑신: ['오', '미'],
  갑오: ['진', '사'],
  갑진: ['인', '묘'],
  갑인: ['자', '축'],
}

/**
 * 천의성(天醫星) 판단
 * 일간 기준
 */
const CHEONUI_TABLE: Record<Cheongan, Jiji> = {
  갑: '축',
  을: '자',
  병: '묘',
  정: '인',
  무: '사',
  기: '진',
  경: '미',
  신: '오',
  임: '유',
  계: '신',
}

/**
 * 문창귀인(文昌貴人) 판단
 * 일간과 년지/시지 기준
 */
const MUNCHANG_TABLE: Record<Cheongan, Jiji> = {
  갑: '사',
  을: '오',
  병: '신',
  정: '유',
  무: '신',
  기: '유',
  경: '해',
  신: '자',
  임: '인',
  계: '묘',
}

/**
 * 화개살(華蓋殺) 판단
 * 연지 기준
 */
const HWAGAE_TABLE: Record<string, Jiji> = {
  인오술: '술',
  사유축: '축',
  신자진: '진',
  해묘미: '미',
}

/**
 * 신살 상세 정보
 */
const SINSAL_DETAILS: Record<Sinsal, Omit<SinsalInfo, 'location'>> = {
  천을귀인: {
    name: '천을귀인',
    hanja: '天乙貴人',
    meaning: '하늘의 귀인, 귀인의 도움',
    positive: ['귀인의 도움을 받음', '위기 시 도움', '사회적 명예'],
    negative: [],
    careerSuitability: ['공직', '정치', '법조계', '교육'],
    namingGuide: '귀(貴), 현(賢), 덕(德) 등 고귀하고 덕망 있는 한자 사용',
  },
  천덕귀인: {
    name: '천덕귀인',
    hanja: '天德貴人',
    meaning: '하늘의 덕',
    positive: ['재난 면함', '길한 일이 많음', '타인의 존경'],
    negative: [],
    careerSuitability: ['종교', '자선사업', '사회복지'],
    namingGuide: '덕(德), 복(福), 선(善) 등 덕망과 복을 상징하는 한자',
  },
  월덕귀인: {
    name: '월덕귀인',
    hanja: '月德貴人',
    meaning: '달의 덕',
    positive: ['부드러운 성품', '인복이 많음', '조화로움'],
    negative: [],
    careerSuitability: ['외교', '상담', '서비스업'],
    namingGuide: '화(和), 순(順), 온(溫) 등 부드럽고 조화로운 한자',
  },
  도화살: {
    name: '도화살',
    hanja: '桃花殺',
    meaning: '복숭아꽃 - 이성운, 예술적 재능',
    positive: ['이성에게 인기', '예술적 재능', '매력적', '사교성'],
    negative: ['이성 관계 복잡', '유혹에 약함', '경박해 보일 수 있음'],
    careerSuitability: ['예술가', '배우', '가수', '디자이너', '뷰티 관련'],
    namingGuide: '아름답고 우아한 한자 사용 가능. 예(藝), 미(美), 려(麗) 등',
  },
  역마살: {
    name: '역마살',
    hanja: '驛馬殺',
    meaning: '역참의 말 - 이동, 변화, 활동성',
    positive: ['활동적', '진취적', '해외 인연', '새로운 기회'],
    negative: ['불안정', '정착 어려움', '분주함'],
    careerSuitability: ['무역', '여행업', '항공', '운송', '해외 영업'],
    namingGuide: '진(進), 동(動), 원(遠) 등 진취적이고 활동적인 한자',
  },
  양인: {
    name: '양인',
    hanja: '羊刃',
    meaning: '양의 칼날 - 강한 기운',
    positive: ['추진력', '결단력', '리더십', '용맹'],
    negative: ['과격함', '충동적', '사고 위험', '대인관계 마찰'],
    careerSuitability: ['군인', '경찰', '스포츠', '외과의'],
    namingGuide: '부드럽고 온화한 한자로 중화. 유(柔), 화(和), 평(平) 등',
  },
  공망: {
    name: '공망',
    hanja: '空亡',
    meaning: '비어있음',
    positive: ['정신적 성장', '초월적 사고', '집착 없음'],
    negative: ['허무함', '불안정', '노력의 공허함'],
    careerSuitability: ['종교', '철학', '상담', '심리학'],
    namingGuide: '채워주는 한자 필요. 실(實), 충(充), 만(滿) 등',
  },
  천의성: {
    name: '천의성',
    hanja: '天醫星',
    meaning: '하늘의 의원 - 의료 재능',
    positive: ['치유 능력', '의학 재능', '건강 관심', '타인 돕기'],
    negative: [],
    careerSuitability: ['의사', '한의사', '간호사', '약사', '물리치료사'],
    namingGuide: '의(醫), 약(藥), 치(治), 강(康) 등 치유 관련 한자',
  },
  문창귀인: {
    name: '문창귀인',
    hanja: '文昌貴人',
    meaning: '문장의 귀인 - 학문 재능',
    positive: ['학업 우수', '문학적 재능', '시험운', '명석함'],
    negative: [],
    careerSuitability: ['학자', '교수', '작가', '언론인', '교사'],
    namingGuide: '문(文), 학(學), 지(智), 서(書) 등 학문 관련 한자',
  },
  금여록: {
    name: '금여록',
    hanja: '金輿祿',
    meaning: '금빛 수레 - 재물과 명예',
    positive: ['재물운', '부귀', '편안한 삶', '고급스러움'],
    negative: [],
    careerSuitability: ['기업가', '투자가', '금융업'],
    namingGuide: '금(金), 재(財), 부(富), 귀(貴) 등 재물과 귀함을 상징',
  },
  화개살: {
    name: '화개살',
    hanja: '華蓋殺',
    meaning: '화려한 덮개 - 예술, 종교',
    positive: ['예술적 재능', '직관력', '종교적 소질', '고독을 즐김'],
    negative: ['고독', '외로움', '현실 괴리', '결혼 늦음'],
    careerSuitability: ['예술가', '승려', '철학자', '점술가'],
    namingGuide: '예술과 정신세계 관련 한자. 예(藝), 선(禪), 도(道) 등',
  },
  백호대살: {
    name: '백호대살',
    hanja: '白虎大殺',
    meaning: '흰 호랑이 - 위험, 사고',
    positive: ['용맹', '강인함'],
    negative: ['사고 위험', '수술', '부상', '혈광'],
    careerSuitability: [],
    namingGuide: '부드럽고 안전한 한자로 중화. 안(安), 녕(寧), 평(平) 등',
  },
  괴강살: {
    name: '괴강살',
    hanja: '魁罡殺',
    meaning: '강한 성격',
    positive: ['강한 성격', '독립심', '결단력', '리더십'],
    negative: ['고집', '독단적', '부부운 약함'],
    careerSuitability: ['CEO', '사업가', '정치인'],
    namingGuide: '부드럽고 조화로운 한자로 보완. 유(柔), 화(和) 등',
  },
}

/**
 * 삼합 그룹 찾기
 */
function getSamhapGroup(jiji: Jiji): string | null {
  const groups = {
    인오술: ['인', '오', '술'],
    사유축: ['사', '유', '축'],
    신자진: ['신', '자', '진'],
    해묘미: ['해', '묘', '미'],
  }

  for (const [key, jijiList] of Object.entries(groups)) {
    if (jijiList.includes(jiji)) {
      return key
    }
  }
  return null
}

/**
 * 천을귀인 판단
 */
function checkCheonulGwiin(saju: Saju): SinsalInfo | null {
  const ilgan = saju.day.cheongan
  const targetJijiList = CHEONUL_GWIIN_TABLE[ilgan]

  const locations: ('year' | 'month' | 'day' | 'hour')[] = []
  if (targetJijiList.includes(saju.year.jiji)) locations.push('year')
  if (targetJijiList.includes(saju.month.jiji)) locations.push('month')
  if (targetJijiList.includes(saju.day.jiji)) locations.push('day')
  if (targetJijiList.includes(saju.hour.jiji)) locations.push('hour')

  if (locations.length > 0) {
    return {
      ...SINSAL_DETAILS.천을귀인,
      location: locations,
    }
  }

  return null
}

/**
 * 도화살 판단
 */
function checkDohwa(saju: Saju): SinsalInfo | null {
  const yearGroup = getSamhapGroup(saju.year.jiji)
  const dayGroup = getSamhapGroup(saju.day.jiji)

  const locations: ('year' | 'month' | 'day' | 'hour')[] = []

  // 연지 기준
  if (yearGroup) {
    const targetJiji = DOHWA_TABLE[yearGroup]
    if (saju.month.jiji === targetJiji) locations.push('month')
    if (saju.day.jiji === targetJiji) locations.push('day')
    if (saju.hour.jiji === targetJiji) locations.push('hour')
  }

  // 일지 기준
  if (dayGroup) {
    const targetJiji = DOHWA_TABLE[dayGroup]
    if (saju.year.jiji === targetJiji && !locations.includes('year')) locations.push('year')
    if (saju.month.jiji === targetJiji && !locations.includes('month')) locations.push('month')
    if (saju.hour.jiji === targetJiji && !locations.includes('hour')) locations.push('hour')
  }

  if (locations.length > 0) {
    return {
      ...SINSAL_DETAILS.도화살,
      location: locations,
    }
  }

  return null
}

/**
 * 역마살 판단
 */
function checkYeokma(saju: Saju): SinsalInfo | null {
  const yearGroup = getSamhapGroup(saju.year.jiji)
  const dayGroup = getSamhapGroup(saju.day.jiji)

  const locations: ('year' | 'month' | 'day' | 'hour')[] = []

  // 연지 기준
  if (yearGroup) {
    const targetJiji = YEOKMA_TABLE[yearGroup]
    if (saju.month.jiji === targetJiji) locations.push('month')
    if (saju.day.jiji === targetJiji) locations.push('day')
    if (saju.hour.jiji === targetJiji) locations.push('hour')
  }

  // 일지 기준
  if (dayGroup) {
    const targetJiji = YEOKMA_TABLE[dayGroup]
    if (saju.year.jiji === targetJiji && !locations.includes('year')) locations.push('year')
    if (saju.month.jiji === targetJiji && !locations.includes('month')) locations.push('month')
    if (saju.hour.jiji === targetJiji && !locations.includes('hour')) locations.push('hour')
  }

  if (locations.length > 0) {
    return {
      ...SINSAL_DETAILS.역마살,
      location: locations,
    }
  }

  return null
}

/**
 * 양인 판단
 */
function checkYangin(saju: Saju): SinsalInfo | null {
  const ilgan = saju.day.cheongan
  const targetJiji = YANGIN_TABLE[ilgan]

  const locations: ('year' | 'month' | 'day' | 'hour')[] = []
  if (saju.year.jiji === targetJiji) locations.push('year')
  if (saju.month.jiji === targetJiji) locations.push('month')
  if (saju.day.jiji === targetJiji) locations.push('day')
  if (saju.hour.jiji === targetJiji) locations.push('hour')

  if (locations.length > 0) {
    return {
      ...SINSAL_DETAILS.양인,
      location: locations,
    }
  }

  return null
}

/**
 * 공망 판단
 */
function checkGongmang(saju: Saju): SinsalInfo | null {
  // 일주를 60갑자 순환에서 찾아서 해당 공망 지지 확인
  const iljuName = saju.day.name

  // 10갑자씩 그룹으로 나누기
  let gongmangJijiList: Jiji[] = []
  if (['갑자', '을축', '병인', '정묘', '무진', '기사', '경오', '신미', '임신', '계유'].includes(iljuName)) {
    gongmangJijiList = ['술', '해']
  } else if (['갑술', '을해', '병자', '정축', '무인', '기묘', '경진', '신사', '임오', '계미'].includes(iljuName)) {
    gongmangJijiList = ['신', '유']
  } else if (['갑신', '을유', '병술', '정해', '무자', '기축', '경인', '신묘', '임진', '계사'].includes(iljuName)) {
    gongmangJijiList = ['오', '미']
  } else if (['갑오', '을미', '병신', '정유', '무술', '기해', '경자', '신축', '임인', '계묘'].includes(iljuName)) {
    gongmangJijiList = ['진', '사']
  } else if (['갑진', '을사', '병오', '정미', '무신', '기유', '경술', '신해', '임자', '계축'].includes(iljuName)) {
    gongmangJijiList = ['인', '묘']
  } else if (['갑인', '을묘', '병진', '정사', '무오', '기미', '경신', '신유', '임술', '계해'].includes(iljuName)) {
    gongmangJijiList = ['자', '축']
  }

  const locations: ('year' | 'month' | 'day' | 'hour')[] = []
  if (gongmangJijiList.includes(saju.year.jiji)) locations.push('year')
  if (gongmangJijiList.includes(saju.month.jiji)) locations.push('month')
  if (gongmangJijiList.includes(saju.hour.jiji)) locations.push('hour')

  if (locations.length > 0) {
    return {
      ...SINSAL_DETAILS.공망,
      location: locations,
    }
  }

  return null
}

/**
 * 천의성 판단
 */
function checkCheonui(saju: Saju): SinsalInfo | null {
  const ilgan = saju.day.cheongan
  const targetJiji = CHEONUI_TABLE[ilgan]

  const locations: ('year' | 'month' | 'day' | 'hour')[] = []
  if (saju.year.jiji === targetJiji) locations.push('year')
  if (saju.month.jiji === targetJiji) locations.push('month')
  if (saju.day.jiji === targetJiji) locations.push('day')
  if (saju.hour.jiji === targetJiji) locations.push('hour')

  if (locations.length > 0) {
    return {
      ...SINSAL_DETAILS.천의성,
      location: locations,
    }
  }

  return null
}

/**
 * 문창귀인 판단
 */
function checkMunchang(saju: Saju): SinsalInfo | null {
  const ilgan = saju.day.cheongan
  const targetJiji = MUNCHANG_TABLE[ilgan]

  const locations: ('year' | 'month' | 'day' | 'hour')[] = []
  if (saju.year.jiji === targetJiji) locations.push('year')
  if (saju.month.jiji === targetJiji) locations.push('month')
  if (saju.day.jiji === targetJiji) locations.push('day')
  if (saju.hour.jiji === targetJiji) locations.push('hour')

  if (locations.length > 0) {
    return {
      ...SINSAL_DETAILS.문창귀인,
      location: locations,
    }
  }

  return null
}

/**
 * 화개살 판단
 */
function checkHwagae(saju: Saju): SinsalInfo | null {
  const yearGroup = getSamhapGroup(saju.year.jiji)

  if (!yearGroup) return null

  const targetJiji = HWAGAE_TABLE[yearGroup]

  const locations: ('year' | 'month' | 'day' | 'hour')[] = []
  if (saju.month.jiji === targetJiji) locations.push('month')
  if (saju.day.jiji === targetJiji) locations.push('day')
  if (saju.hour.jiji === targetJiji) locations.push('hour')

  if (locations.length > 0) {
    return {
      ...SINSAL_DETAILS.화개살,
      location: locations,
    }
  }

  return null
}

/**
 * 신살 종합 분석
 */
export function analyzeSinsal(saju: Saju): SinsalAnalysis {
  const sinsals: SinsalInfo[] = []

  // 각 신살 검사
  const cheonulGwiin = checkCheonulGwiin(saju)
  if (cheonulGwiin) sinsals.push(cheonulGwiin)

  const dohwa = checkDohwa(saju)
  if (dohwa) sinsals.push(dohwa)

  const yeokma = checkYeokma(saju)
  if (yeokma) sinsals.push(yeokma)

  const yangin = checkYangin(saju)
  if (yangin) sinsals.push(yangin)

  const gongmang = checkGongmang(saju)
  if (gongmang) sinsals.push(gongmang)

  const cheonui = checkCheonui(saju)
  if (cheonui) sinsals.push(cheonui)

  const munchang = checkMunchang(saju)
  if (munchang) sinsals.push(munchang)

  const hwagae = checkHwagae(saju)
  if (hwagae) sinsals.push(hwagae)

  // 좋은 신살 / 나쁜 신살 분류
  const goodSinsals = sinsals.filter((s) => s.negative.length === 0)
  const badSinsals = sinsals.filter((s) => s.negative.length > 0).map((s) => s.name)
  const neutralSinsals = sinsals.filter((s) => s.positive.length > 0 && s.negative.length > 0).map((s) => s.name)

  // 직업 적성 추출
  const careerRecommendations = Array.from(
    new Set(sinsals.flatMap((s) => s.careerSuitability))
  )

  // 성격 특성 추출
  const personality = Array.from(
    new Set(sinsals.flatMap((s) => s.positive))
  )

  // 작명 가이드 추출
  const namingRecommendations = sinsals.map((s) => s.namingGuide)

  // 주의사항
  const warnings = Array.from(
    new Set(sinsals.flatMap((s) => s.negative))
  )

  return {
    sinsals,
    goodSinsals,
    badSinsals,
    neutralSinsals,
    careerRecommendations,
    personality,
    namingRecommendations,
    warnings,
  }
}
