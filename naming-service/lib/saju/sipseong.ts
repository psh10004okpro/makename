/**
 * 십성(十星) 분석 엔진
 *
 * 일간을 기준으로 사주팔자의 십성을 분석합니다.
 * 십성은 일간과 다른 천간/지지 간의 오행 관계를 10가지로 분류한 것입니다.
 */

import type {
  Cheongan,
  Jiji,
  Ohang,
  Eumyang,
  Saju,
  Sipseong,
  SipseongCount,
  SipseongAnalysis,
  SipseongCategory,
} from './types'
import {
  SIPSEONG_LIST,
  SIPSEONG_HANJA,
  SIPSEONG_CATEGORY,
} from './types'
import {
  CHEONGAN_OHANG,
  JIJI_OHANG,
  CHEONGAN_EUMYANG,
  JIJI_EUMYANG,
  OHANG_SAENGSEONG,
  OHANG_SANGGEUK,
} from './ohang'

// ============================================================================
// 십성 계산 함수
// ============================================================================

/**
 * 두 천간/지지 간의 십성 관계 계산
 *
 * @param ilgan 일간
 * @param ilganEumyang 일간 음양
 * @param ilganOhang 일간 오행
 * @param target 대상 천간/지지
 * @param targetEumyang 대상 음양
 * @param targetOhang 대상 오행
 * @returns 십성
 */
export function calculateSipseong(
  ilgan: Cheongan,
  ilganEumyang: Eumyang,
  ilganOhang: Ohang,
  target: Cheongan | Jiji,
  targetEumyang: Eumyang,
  targetOhang: Ohang
): Sipseong {
  // 같은 오행인 경우 - 비견/겁재
  if (ilganOhang === targetOhang) {
    return ilganEumyang === targetEumyang ? '비견' : '겁재'
  }

  // 내가 생하는 오행 - 식신/상관
  if (OHANG_SAENGSEONG[ilganOhang] === targetOhang) {
    return ilganEumyang === targetEumyang ? '식신' : '상관'
  }

  // 내가 극하는 오행 - 편재/정재
  if (OHANG_SANGGEUK[ilganOhang] === targetOhang) {
    return ilganEumyang === targetEumyang ? '편재' : '정재'
  }

  // 나를 극하는 오행 - 편관/정관
  if (OHANG_SANGGEUK[targetOhang] === ilganOhang) {
    return ilganEumyang === targetEumyang ? '편관' : '정관'
  }

  // 나를 생하는 오행 - 편인/정인
  if (OHANG_SAENGSEONG[targetOhang] === ilganOhang) {
    return ilganEumyang === targetEumyang ? '편인' : '정인'
  }

  // 이론적으로 여기 도달 불가 (모든 오행 관계는 위에서 처리됨)
  throw new Error(`십성 계산 오류: ${ilganOhang} -> ${targetOhang}`)
}

/**
 * 사주의 십성 분석
 *
 * @param saju 사주팔자
 * @returns 십성 분석 결과
 */
export function analyzeSipseong(saju: Saju): SipseongAnalysis {
  // 일간 정보
  const ilgan = saju.day.cheongan
  const ilganOhang = CHEONGAN_OHANG[ilgan]
  const ilganEumyang = CHEONGAN_EUMYANG[ilgan]

  // 각 기둥의 십성 계산
  const pillars = {
    year: {
      cheongan: calculateSipseong(
        ilgan,
        ilganEumyang,
        ilganOhang,
        saju.year.cheongan,
        CHEONGAN_EUMYANG[saju.year.cheongan],
        CHEONGAN_OHANG[saju.year.cheongan]
      ),
      jiji: calculateSipseong(
        ilgan,
        ilganEumyang,
        ilganOhang,
        saju.year.jiji,
        JIJI_EUMYANG[saju.year.jiji],
        JIJI_OHANG[saju.year.jiji]
      ),
    },
    month: {
      cheongan: calculateSipseong(
        ilgan,
        ilganEumyang,
        ilganOhang,
        saju.month.cheongan,
        CHEONGAN_EUMYANG[saju.month.cheongan],
        CHEONGAN_OHANG[saju.month.cheongan]
      ),
      jiji: calculateSipseong(
        ilgan,
        ilganEumyang,
        ilganOhang,
        saju.month.jiji,
        JIJI_EUMYANG[saju.month.jiji],
        JIJI_OHANG[saju.month.jiji]
      ),
    },
    day: {
      // 일간은 자기 자신이므로 제외, 일지만 계산
      cheongan: '비견' as Sipseong, // 일간은 자기 자신이므로 비견으로 처리
      jiji: calculateSipseong(
        ilgan,
        ilganEumyang,
        ilganOhang,
        saju.day.jiji,
        JIJI_EUMYANG[saju.day.jiji],
        JIJI_OHANG[saju.day.jiji]
      ),
    },
    hour: {
      cheongan: calculateSipseong(
        ilgan,
        ilganEumyang,
        ilganOhang,
        saju.hour.cheongan,
        CHEONGAN_EUMYANG[saju.hour.cheongan],
        CHEONGAN_OHANG[saju.hour.cheongan]
      ),
      jiji: calculateSipseong(
        ilgan,
        ilganEumyang,
        ilganOhang,
        saju.hour.jiji,
        JIJI_EUMYANG[saju.hour.jiji],
        JIJI_OHANG[saju.hour.jiji]
      ),
    },
  }

  // 십성 개수 계산 (일간 제외, 7글자)
  const count = countSipseong(pillars)

  // 강약 분석
  const strong: Sipseong[] = []
  const weak: Sipseong[] = []
  const missing: Sipseong[] = []

  SIPSEONG_LIST.forEach((sipseong) => {
    if (count[sipseong] >= 3) {
      strong.push(sipseong)
    } else if (count[sipseong] === 1) {
      weak.push(sipseong)
    } else if (count[sipseong] === 0) {
      missing.push(sipseong)
    }
  })

  // 설명 생성
  const description = generateSipseongDescription(count, strong, weak, missing)

  // 성격 특성 분석
  const personality = analyzePersonality(count, strong)

  // 재능 및 적성 분석
  const talents = analyzeTalents(count, strong)

  // 주의사항 분석
  const warnings = analyzeWarnings(count, strong, missing)

  return {
    ilgan,
    ilganOhang,
    ilganEumyang,
    pillars,
    count,
    strong,
    weak,
    missing,
    description,
    personality,
    talents,
    warnings,
  }
}

/**
 * 십성 개수 계산
 */
function countSipseong(pillars: SipseongAnalysis['pillars']): SipseongCount {
  const count: SipseongCount = {
    비견: 0,
    겁재: 0,
    식신: 0,
    상관: 0,
    편재: 0,
    정재: 0,
    편관: 0,
    정관: 0,
    편인: 0,
    정인: 0,
  }

  // 년주
  count[pillars.year.cheongan]++
  count[pillars.year.jiji]++

  // 월주
  count[pillars.month.cheongan]++
  count[pillars.month.jiji]++

  // 일주 (일간은 제외, 일지만)
  count[pillars.day.jiji]++

  // 시주
  count[pillars.hour.cheongan]++
  count[pillars.hour.jiji]++

  return count
}

/**
 * 십성 균형 설명 생성
 */
function generateSipseongDescription(
  count: SipseongCount,
  strong: Sipseong[],
  weak: Sipseong[],
  missing: Sipseong[]
): string {
  const parts: string[] = []

  // 십성 개수 요약
  const nonZero = SIPSEONG_LIST.filter((s) => count[s] > 0)
  parts.push(`십성 분포: ${nonZero.map((s) => `${SIPSEONG_HANJA[s]}(${count[s]})`).join(', ')}`)

  // 강한 십성
  if (strong.length > 0) {
    parts.push(`강한 십성: ${strong.map((s) => SIPSEONG_HANJA[s]).join(', ')}`)
  }

  // 약한 십성
  if (weak.length > 0) {
    parts.push(`약한 십성: ${weak.map((s) => SIPSEONG_HANJA[s]).join(', ')}`)
  }

  // 없는 십성
  if (missing.length > 0) {
    parts.push(`결여된 십성: ${missing.map((s) => SIPSEONG_HANJA[s]).join(', ')}`)
  }

  return parts.join('. ')
}

/**
 * 성격 특성 분석
 */
function analyzePersonality(count: SipseongCount, strong: Sipseong[]): string[] {
  const personality: string[] = []

  // 비겁(비견/겁재) - 자아, 경쟁, 독립심
  const bigeop = count.비견 + count.겁재
  if (bigeop >= 3) {
    personality.push('자아가 강하고 독립심이 강함')
    personality.push('경쟁심이 강하고 주도적')
  } else if (bigeop === 0) {
    personality.push('타인 의견을 잘 수용하고 협력적')
  }

  // 식상(식신/상관) - 표현, 창의, 재능
  const siksang = count.식신 + count.상관
  if (siksang >= 3) {
    personality.push('표현력이 뛰어나고 창의적')
    personality.push('예술적 감각이 있고 재능이 다양함')
  } else if (siksang === 0) {
    personality.push('내면의 생각을 표현하는데 소극적')
  }

  // 재성(편재/정재) - 재물, 현실, 실용
  const jaeseong = count.편재 + count.정재
  if (jaeseong >= 3) {
    personality.push('재물운이 좋고 경제관념이 뛰어남')
    personality.push('현실적이고 실용적인 사고')
  } else if (jaeseong === 0) {
    personality.push('재물에 대한 집착이 적고 이상주의적')
  }

  // 관성(편관/정관) - 명예, 질서, 책임
  const gwanseong = count.편관 + count.정관
  if (gwanseong >= 3) {
    personality.push('책임감이 강하고 규율을 중시함')
    personality.push('명예를 중시하고 사회적 지위 추구')
  } else if (gwanseong === 0) {
    personality.push('자유로운 영혼, 규칙에 얽매이지 않음')
  }

  // 인성(편인/정인) - 학문, 지혜, 명예
  const inseong = count.편인 + count.정인
  if (inseong >= 3) {
    personality.push('학문을 좋아하고 지적 호기심이 강함')
    personality.push('사색적이고 정신세계를 중시함')
  } else if (inseong === 0) {
    personality.push('실천과 행동을 중시, 이론보다 경험 선호')
  }

  return personality
}

/**
 * 재능 및 적성 분석
 */
function analyzeTalents(count: SipseongCount, strong: Sipseong[]): string[] {
  const talents: string[] = []

  // 강한 십성 기반 재능 분석
  strong.forEach((sipseong) => {
    const category = SIPSEONG_CATEGORY[sipseong]

    switch (category) {
      case '비겁':
        talents.push('독립적 사업, 자영업, 스포츠, 경쟁 분야')
        break
      case '식상':
        talents.push('예술, 창작, 연예, 강연, 교육, 디자인')
        break
      case '재성':
        talents.push('금융, 경영, 무역, 영업, 서비스업')
        break
      case '관성':
        talents.push('공무원, 법조계, 군인, 경찰, 대기업')
        break
      case '인성':
        talents.push('학자, 연구원, 교수, 의료, 종교, 상담')
        break
    }
  })

  // 중복 제거
  return Array.from(new Set(talents))
}

/**
 * 주의사항 분석
 */
function analyzeWarnings(
  count: SipseongCount,
  strong: Sipseong[],
  missing: Sipseong[]
): string[] {
  const warnings: string[] = []

  // 비겁 과다
  if (count.비견 + count.겁재 >= 4) {
    warnings.push('과도한 독립심으로 협력이 어려울 수 있음')
    warnings.push('재물 관리에 신중해야 함 (재물 손실 가능성)')
  }

  // 식상 과다
  if (count.식신 + count.상관 >= 4) {
    warnings.push('생각이 너무 많아 실행력이 부족할 수 있음')
    warnings.push('말실수 주의, 감정 조절 필요')
  }

  // 재성 과다
  if (count.편재 + count.정재 >= 4) {
    warnings.push('물질에 치우쳐 정신적 가치 소홀 주의')
    warnings.push('과로로 건강 해칠 수 있음')
  }

  // 관성 과다
  if (count.편관 + count.정관 >= 4) {
    warnings.push('스트레스와 압박감이 클 수 있음')
    warnings.push('권위에 대한 반발심 또는 과도한 순응')
  }

  // 인성 과다
  if (count.편인 + count.정인 >= 4) {
    warnings.push('현실 감각이 부족하고 실천력 저하')
    warnings.push('우유부단하고 결정을 미루는 경향')
  }

  // 재성 결여
  if (count.편재 + count.정재 === 0) {
    warnings.push('재물운이 약하므로 저축과 투자에 신중해야 함')
  }

  // 관성 결여
  if (count.편관 + count.정관 === 0) {
    warnings.push('규율과 질서 의식이 약할 수 있으므로 자기관리 필요')
  }

  // 인성 결여
  if (count.편인 + count.정인 === 0) {
    warnings.push('학습 의욕이 낮을 수 있으므로 지속적 자기계발 필요')
  }

  return warnings
}

/**
 * 십성별 의미 설명
 */
export const SIPSEONG_MEANING: Record<Sipseong, {
  name: string
  hanja: string
  category: SipseongCategory
  positive: string[]
  negative: string[]
  keywords: string[]
}> = {
  비견: {
    name: '비견',
    hanja: '比肩',
    category: '비겁',
    positive: ['독립심', '추진력', '경쟁력', '자립심'],
    negative: ['고집', '아집', '독단', '경쟁심 과다'],
    keywords: ['어깨를 나란히', '동등한 관계', '형제자매', '동업자'],
  },
  겁재: {
    name: '겁재',
    hanja: '劫財',
    category: '비겁',
    positive: ['순발력', '결단력', '행동력', '개척정신'],
    negative: ['재물 손실', '충동적', '변덕', '배신'],
    keywords: ['재물을 빼앗음', '경쟁자', '위기', '변화'],
  },
  식신: {
    name: '식신',
    hanja: '食神',
    category: '식상',
    positive: ['순수함', '여유로움', '복록', '재능 발산'],
    negative: ['게으름', '의존적', '낭비', '비만'],
    keywords: ['먹는 신', '여유', '재능', '자식', '의식주'],
  },
  상관: {
    name: '상관',
    hanja: '傷官',
    category: '식상',
    positive: ['창의성', '표현력', '예술성', '비판력'],
    negative: ['반항', '말실수', '오만', '권위 거부'],
    keywords: ['관을 상하게 함', '재능', '표현', '비판', '반항'],
  },
  편재: {
    name: '편재',
    hanja: '偏財',
    category: '재성',
    positive: ['사교성', '활동성', '재치', '사업수완'],
    negative: ['산만함', '허영', '낭비', '여색'],
    keywords: ['움직이는 재물', '사업', '투자', '유동자산'],
  },
  정재: {
    name: '정재',
    hanja: '正財',
    category: '재성',
    positive: ['성실함', '근면함', '정직', '신용'],
    negative: ['소심함', '보수적', '인색', '고지식'],
    keywords: ['정당한 재물', '월급', '아내', '고정자산'],
  },
  편관: {
    name: '편관',
    hanja: '偏官',
    category: '관성',
    positive: ['추진력', '결단력', '용기', '의리'],
    negative: ['폭력성', '충동', '불안', '과격'],
    keywords: ['칠살', '권력', '명예', '시험', '아들'],
  },
  정관: {
    name: '정관',
    hanja: '正官',
    category: '관성',
    positive: ['책임감', '성실함', '명예', '규범 준수'],
    negative: ['소극적', '보수적', '권위주의', '형식'],
    keywords: ['바른 관', '직장', '명예', '남편', '공직'],
  },
  편인: {
    name: '편인',
    hanja: '偏印',
    category: '인성',
    positive: ['독창성', '직관력', '영감', '특수 재능'],
    negative: ['고독', '신경질', '변덕', '현실 도피'],
    keywords: ['효신', '도식', '특수 학문', '종교', '예술'],
  },
  정인: {
    name: '정인',
    hanja: '正印',
    category: '인성',
    positive: ['학구열', '지혜', '덕성', '인내심'],
    negative: ['우유부단', '의존적', '수동적', '실천력 부족'],
    keywords: ['정당한 인수', '학문', '모성', '문서', '자격증'],
  },
}

/**
 * 십성 조합 분석 (특수 격국 판단용)
 */
export function analyzeSipseongCombination(analysis: SipseongAnalysis): {
  type: string
  description: string
} | null {
  const { count } = analysis

  // 종격 (從格) 판단
  const bigeop = count.비견 + count.겁재
  const siksang = count.식신 + count.상관
  const jaeseong = count.편재 + count.정재
  const gwanseong = count.편관 + count.정관
  const inseong = count.편인 + count.정인

  // 종재격 (財星이 5개 이상, 비겁 없음)
  if (jaeseong >= 5 && bigeop === 0) {
    return {
      type: '종재격',
      description: '재성을 따르는 격국. 재물운이 매우 강하고 사업가 기질.',
    }
  }

  // 종살격 (官殺이 5개 이상, 비겁 없음)
  if (gwanseong >= 5 && bigeop === 0) {
    return {
      type: '종살격',
      description: '관성을 따르는 격국. 권력과 명예를 추구하며 리더십 강함.',
    }
  }

  // 종아격 (食傷이 5개 이상, 인성 없음)
  if (siksang >= 5 && inseong === 0) {
    return {
      type: '종아격',
      description: '식상을 따르는 격국. 예술적 재능이 뛰어나고 표현력 탁월.',
    }
  }

  // 종왕격 (比劫이 5개 이상)
  if (bigeop >= 5) {
    return {
      type: '종왕격',
      description: '일간이 매우 강한 격국. 독립심 강하고 자수성가형.',
    }
  }

  return null
}
