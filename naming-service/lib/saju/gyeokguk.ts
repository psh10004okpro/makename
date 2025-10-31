/**
 * 격국(格局) 판단 엔진
 *
 * 사주의 구조와 패턴을 분석하여 격국을 판단합니다.
 */

import type {
  Saju,
  Gyeokguk,
  JeongGyeokguk,
  OeGyeokguk,
  GyeokgukAnalysis,
  GyeokgukStrength,
  Sipseong,
  SipseongCount,
} from './types'
import { SIPSEONG_HANJA } from './types'
import { analyzeSipseong } from './sipseong'

// ============================================================================
// 정격 (正格) 판단
// ============================================================================

/**
 * 월지 십성 기준 정격 판단
 *
 * @param monthJijiSipseong 월지의 십성
 * @returns 정격 타입
 */
function determineJeongGyeokguk(monthJijiSipseong: Sipseong): JeongGyeokguk | null {
  const gyeokgukMap: Record<Sipseong, JeongGyeokguk> = {
    '정관': '정관격',
    '편관': '편관격',
    '정재': '정재격',
    '편재': '편재격',
    '식신': '식신격',
    '상관': '상관격',
    '정인': '정인격',
    '편인': '편인격',
    '비견': '정관격', // 비견/겁재는 월지에 있어도 정격이 아님, 다른 격국 찾음
    '겁재': '정관격',
  }

  // 월지가 비견이나 겁재면 정격이 성립하지 않음
  if (monthJijiSipseong === '비견' || monthJijiSipseong === '겁재') {
    return null
  }

  return gyeokgukMap[monthJijiSipseong]
}

// ============================================================================
// 외격 (外格) 판단
// ============================================================================

/**
 * 종격 (從格) 판단
 *
 * 일간이 극약하여 특정 오행을 따르는 격국
 */
function determineJongGyeokguk(sipseongCount: SipseongCount): OeGyeokguk | null {
  const bigeop = sipseongCount.비견 + sipseongCount.겁재
  const siksang = sipseongCount.식신 + sipseongCount.상관
  const jaeseong = sipseongCount.편재 + sipseongCount.정재
  const gwanseong = sipseongCount.편관 + sipseongCount.정관
  const inseong = sipseongCount.편인 + sipseongCount.정인

  // 종재격: 재성이 5개 이상, 비겁이 없거나 매우 약함
  if (jaeseong >= 5 && bigeop <= 1) {
    return '종재격'
  }

  // 종살격: 관살이 5개 이상, 비겁이 없거나 매우 약함
  if (gwanseong >= 5 && bigeop <= 1) {
    return '종살격'
  }

  // 종아격: 식상이 5개 이상, 인성이 없거나 매우 약함
  if (siksang >= 5 && inseong === 0) {
    return '종아격'
  }

  // 종왕격: 비겁이 5개 이상
  if (bigeop >= 5) {
    return '종왕격'
  }

  return null
}

// ============================================================================
// 격국 강도 판단
// ============================================================================

/**
 * 격국의 강도 판단
 */
function analyzeGyeokgukStrength(
  gyeokguk: Gyeokguk,
  sipseongCount: SipseongCount
): GyeokgukStrength {
  // 외격은 별도 판단
  if (gyeokguk.includes('종')) {
    return '강' // 종격은 보통 강함
  }

  // 정격의 경우
  const gyeokgukSipseongMap: Record<string, Sipseong[]> = {
    '정관격': ['정관'],
    '편관격': ['편관'],
    '정재격': ['정재'],
    '편재격': ['편재'],
    '식신격': ['식신'],
    '상관격': ['상관'],
    '정인격': ['정인'],
    '편인격': ['편인'],
  }

  const targetSipseong = gyeokgukSipseongMap[gyeokguk]
  if (!targetSipseong) {
    return '중'
  }

  // 해당 십성의 개수로 강도 판단
  const count = targetSipseong.reduce((sum, s) => sum + sipseongCount[s], 0)

  if (count >= 3) return '강'
  if (count === 2) return '중'
  if (count === 1) return '약'

  return '파격'
}

// ============================================================================
// 격국별 용신/희신/기신
// ============================================================================

/**
 * 격국에 맞는 용신 도출
 */
function getGyeokgukYongsin(gyeokguk: Gyeokguk, strength: GyeokgukStrength): {
  yongsin: Sipseong[]
  heesin: Sipseong[]
  gisin: Sipseong[]
} {
  // 정관격
  if (gyeokguk === '정관격') {
    if (strength === '강') {
      return {
        yongsin: ['정재', '식신'], // 관을 생하거나 설기
        heesin: ['정인'],
        gisin: ['상관', '비견'], // 관을 극하거나 빼앗음
      }
    } else {
      return {
        yongsin: ['정인', '정재'], // 일간을 생하거나 관을 생함
        heesin: ['비견'],
        gisin: ['상관'],
      }
    }
  }

  // 정재격
  if (gyeokguk === '정재격') {
    return {
      yongsin: ['식신', '정관'], // 재를 생하거나 재를 설기
      heesin: ['정재'],
      gisin: ['비견', '편인'], // 재를 빼앗거나 극함
    }
  }

  // 식신격
  if (gyeokguk === '식신격') {
    return {
      yongsin: ['정재', '식신'], // 식신을 설기하거나 강화
      heesin: ['비견'],
      gisin: ['정인', '편관'], // 식신을 극하거나 제거
    }
  }

  // 정인격
  if (gyeokguk === '정인격') {
    return {
      yongsin: ['정관', '정인'], // 인성을 생하거나 강화
      heesin: ['비견'],
      gisin: ['정재'], // 인성을 극함
    }
  }

  // 종재격
  if (gyeokguk === '종재격') {
    return {
      yongsin: ['정재', '편재', '식신'], // 재를 생하거나 따름
      heesin: ['상관'],
      gisin: ['비견', '정인'], // 재를 빼앗거나 극함
    }
  }

  // 종살격
  if (gyeokguk === '종살격') {
    return {
      yongsin: ['정관', '편관', '정재'], // 관살을 따르거나 생함
      heesin: ['식신'],
      gisin: ['비견', '정인'], // 관살에 저항
    }
  }

  // 종아격
  if (gyeokguk === '종아격') {
    return {
      yongsin: ['식신', '상관', '정재'], // 식상을 따르거나 설기
      heesin: ['비견'],
      gisin: ['정인'], // 식상을 극함
    }
  }

  // 종왕격
  if (gyeokguk === '종왕격') {
    return {
      yongsin: ['비견', '겁재', '식신'], // 비겁을 따르거나 설기
      heesin: ['정인'],
      gisin: ['정관', '정재'], // 비겁을 극하거나 설기
    }
  }

  // 기본값
  return {
    yongsin: ['정재', '식신'],
    heesin: ['정인'],
    gisin: ['비견'],
  }
}

// ============================================================================
// 격국별 특성
// ============================================================================

/**
 * 격국별 설명 및 특성
 */
function getGyeokgukCharacteristics(gyeokguk: Gyeokguk): {
  description: string
  characteristics: string[]
  careerSuitability: string[]
  wealthLuck: '매우 좋음' | '좋음' | '보통' | '약함'
  fameLuck: '매우 좋음' | '좋음' | '보통' | '약함'
  academicLuck: '매우 좋음' | '좋음' | '보통' | '약함'
  warnings: string[]
} {
  const gyeokgukInfo: Record<string, ReturnType<typeof getGyeokgukCharacteristics>> = {
    '정관격': {
      description: '정관을 격국의 중심으로 하는 사주. 정직하고 원칙적이며 책임감이 강함.',
      characteristics: [
        '성실하고 책임감이 강함',
        '규율과 질서를 중시함',
        '명예를 중요하게 생각함',
        '보수적이고 안정을 추구함',
      ],
      careerSuitability: ['공무원', '법조인', '교사', '대기업 직원', '관리직'],
      wealthLuck: '보통',
      fameLuck: '매우 좋음',
      academicLuck: '좋음',
      warnings: ['과도한 규율에 얽매일 수 있음', '융통성 부족 주의'],
    },
    '정재격': {
      description: '정재를 격국의 중심으로 하는 사주. 성실하게 재물을 모으고 현실적임.',
      characteristics: [
        '근면하고 성실함',
        '재물 관리 능력이 뛰어남',
        '현실적이고 실용적',
        '인색하지만 안정적',
      ],
      careerSuitability: ['회계사', '재무 전문가', '사업가', '은행원', '부동산'],
      wealthLuck: '매우 좋음',
      fameLuck: '보통',
      academicLuck: '보통',
      warnings: ['물질에 집착할 수 있음', '인색함 주의'],
    },
    '식신격': {
      description: '식신을 격국의 중심으로 하는 사주. 여유롭고 복록이 있으며 재능이 다양함.',
      characteristics: [
        '여유롭고 낙천적',
        '예술적 재능이 있음',
        '표현력이 뛰어남',
        '복록이 있고 건강함',
      ],
      careerSuitability: ['예술가', '요리사', '작가', '디자이너', '연예인'],
      wealthLuck: '좋음',
      fameLuck: '좋음',
      academicLuck: '보통',
      warnings: ['게으름 주의', '비만 경향'],
    },
    '정인격': {
      description: '정인을 격국의 중심으로 하는 사주. 학문을 좋아하고 지혜로우며 덕성이 있음.',
      characteristics: [
        '학구열이 높음',
        '지혜롭고 사려 깊음',
        '덕성이 있음',
        '인내심이 강함',
      ],
      careerSuitability: ['학자', '연구원', '교수', '의사', '종교인', '상담가'],
      wealthLuck: '약함',
      fameLuck: '좋음',
      academicLuck: '매우 좋음',
      warnings: ['우유부단함', '실천력 부족', '현실 감각 부족'],
    },
    '종재격': {
      description: '재성을 따르는 외격. 재물운이 매우 강하고 사업가 기질이 있음.',
      characteristics: [
        '재물운이 매우 강함',
        '사업 수완이 뛰어남',
        '활동적이고 적극적',
        '융통성이 있음',
      ],
      careerSuitability: ['기업가', '사업가', '투자가', '무역업', '대형 사업'],
      wealthLuck: '매우 좋음',
      fameLuck: '좋음',
      academicLuck: '보통',
      warnings: ['과욕 주의', '재물에 집착', '건강 소홀'],
    },
    '종살격': {
      description: '관살을 따르는 외격. 권력과 명예를 추구하며 리더십이 강함.',
      characteristics: [
        '권력 지향적',
        '리더십이 강함',
        '추진력과 결단력',
        '승부욕이 강함',
      ],
      careerSuitability: ['정치인', '군인', '경찰', 'CEO', '고위 공직자'],
      wealthLuck: '좋음',
      fameLuck: '매우 좋음',
      academicLuck: '보통',
      warnings: ['폭력성 주의', '독단적 행동', '스트레스 과다'],
    },
    '종아격': {
      description: '식상을 따르는 외격. 예술적 재능이 뛰어나고 표현력이 탁월함.',
      characteristics: [
        '예술적 재능 탁월',
        '표현력이 뛰어남',
        '창의성이 높음',
        '자유로운 영혼',
      ],
      careerSuitability: ['예술가', '작가', '연예인', '크리에이터', '디자이너'],
      wealthLuck: '좋음',
      fameLuck: '매우 좋음',
      academicLuck: '보통',
      warnings: ['권위 거부', '말실수', '충동적 행동'],
    },
    '종왕격': {
      description: '비겁이 왕성한 외격. 독립심이 강하고 자수성가형.',
      characteristics: [
        '독립심이 매우 강함',
        '자수성가 가능',
        '추진력이 강함',
        '경쟁심이 강함',
      ],
      careerSuitability: ['자영업', '창업', '독립 사업', '프리랜서', '운동선수'],
      wealthLuck: '보통',
      fameLuck: '보통',
      academicLuck: '약함',
      warnings: ['고집과 독단', '재물 손실 주의', '협력 어려움'],
    },
  }

  return gyeokgukInfo[gyeokguk] || {
    description: '일반적인 사주 구조',
    characteristics: ['균형잡힌 성격'],
    careerSuitability: ['다양한 분야'],
    wealthLuck: '보통',
    fameLuck: '보통',
    academicLuck: '보통',
    warnings: [],
  }
}

// ============================================================================
// 격국 종합 분석
// ============================================================================

/**
 * 사주의 격국 분석
 *
 * @param saju 사주팔자
 * @returns 격국 분석 결과
 */
export function analyzeGyeokguk(saju: Saju): GyeokgukAnalysis {
  // 십성 분석
  const sipseongAnalysis = analyzeSipseong(saju)
  const { pillars, count } = sipseongAnalysis

  // 월지의 십성
  const monthJijiSipseong = pillars.month.jiji

  // 1. 외격 판단 (우선)
  const jongGyeokguk = determineJongGyeokguk(count)
  let gyeokguk: Gyeokguk
  let category: '정격' | '외격' | '기타'

  if (jongGyeokguk) {
    gyeokguk = jongGyeokguk
    category = '외격'
  } else {
    // 2. 정격 판단
    const jeongGyeokguk = determineJeongGyeokguk(monthJijiSipseong)
    if (jeongGyeokguk) {
      gyeokguk = jeongGyeokguk
      category = '정격'
    } else {
      gyeokguk = '미상'
      category = '기타'
    }
  }

  // 3. 격국 강도 판단
  const strength = analyzeGyeokgukStrength(gyeokguk, count)

  // 4. 용신/희신/기신
  const { yongsin, heesin, gisin } = getGyeokgukYongsin(gyeokguk, strength)

  // 5. 격국 특성
  const characteristics = getGyeokgukCharacteristics(gyeokguk)

  return {
    gyeokguk,
    category,
    strength,
    yongsin,
    heesin,
    gisin,
    ...characteristics,
  }
}

/**
 * 격국 요약 정보
 */
export function getGyeokgukSummary(analysis: GyeokgukAnalysis): string {
  return `${analysis.gyeokguk} (${analysis.category}, ${analysis.strength})`
}
