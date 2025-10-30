/**
 * 사주팔자 계산 엔진 - 통합 Export
 *
 * 전통 명리학 기반의 사주팔자 계산 및 오행 분석 시스템
 *
 * @example
 * ```typescript
 * import { calculateSaju, analyzeOhangBalance, evaluateNameCompatibility } from '@/lib/saju'
 *
 * // 1. 사주 계산
 * const saju = calculateSaju(new Date(1990, 0, 15), { time: '14:30' })
 *
 * // 2. 오행 분석
 * const analysis = analyzeOhangBalance(saju)
 * console.log(analysis.yongsin) // ['화', '토']
 *
 * // 3. 이름 궁합 평가
 * const score = evaluateNameCompatibility(saju, '화', 15)
 * console.log(score.total) // 85
 * console.log(score.grade) // "A"
 * ```
 */

// ============================================================================
// Types
// ============================================================================

export type {
  // 기본 타입
  Cheongan,
  Jiji,
  Ohang,
  Eumyang,
  Ganji,
  Jeolgi,
  // 사주 관련
  Pillar,
  Saju,
  BirthInfo,
  SajuCalculationOptions,
  // 오행 분석
  OhangCount,
  OhangAnalysis,
  // 궁합 평가
  CompatibilityScore,
  NamingRecommendation,
} from './types'

export {
  // 상수
  CHEONGAN_LIST,
  JIJI_LIST,
  OHANG_LIST,
  CHEONGAN_HANJA,
  JIJI_HANJA,
  JIJI_ANIMAL,
  OHANG_HANJA,
} from './types'

// ============================================================================
// Calendar Functions
// ============================================================================

export {
  // 음력/양력 변환
  solarToLunar,
  lunarToSolar,
  // 절기
  getJeolgiDatesInYear,
  getCurrentJeolgi,
  getSajuMonth,
  // 유틸리티
  formatLunarDate,
  formatSolarDate,
  getLeapMonth,
  // 상수
  JEOLGI_LIST,
  JEOLGI_HANJA,
  MONTH_JEOLGI,
} from './calendar'

// ============================================================================
// Calculator Functions
// ============================================================================

export {
  // 클래스
  SajuCalculator,
  // 메인 함수
  calculateSaju,
} from './calculator'

// ============================================================================
// Ohang (Five Elements) Functions
// ============================================================================

export {
  // 오행 분석
  countOhang,
  analyzeOhangBalance,
  getOhangRelation,
  calculateOhangHarmony,
  getStrongElement,
  getWeakElement,
  // 오행 매핑
  CHEONGAN_OHANG,
  JIJI_OHANG,
  CHEONGAN_EUMYANG,
  JIJI_EUMYANG,
  // 오행 상생상극
  OHANG_SAENGSEONG,
  OHANG_SANGGEUK,
  OHANG_MOTHER,
  OHANG_CONTROLLER,
} from './ohang'

// ============================================================================
// Compatibility Functions
// ============================================================================

export {
  // 궁합 평가
  evaluateNameCompatibility,
  generateNamingRecommendation,
} from './compatibility'

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * 사주팔자 문자열 표현
 *
 * @param saju 사주팔자
 * @param useHanja 한자 사용 여부
 * @returns 사주 문자열
 *
 * @example
 * ```typescript
 * const saju = calculateSaju(new Date(1990, 0, 15))
 * const str = formatSaju(saju)
 * console.log(str) // "경오 무인 을사 계미"
 *
 * const hanjaStr = formatSaju(saju, true)
 * console.log(hanjaStr) // "庚午 戊寅 乙巳 癸未"
 * ```
 */
export function formatSaju(saju: import('./types').Saju, useHanja: boolean = false): string {
  if (useHanja) {
    return `${saju.year.hanja} ${saju.month.hanja} ${saju.day.hanja} ${saju.hour.hanja}`
  }
  return `${saju.year.name} ${saju.month.name} ${saju.day.name} ${saju.hour.name}`
}

/**
 * 사주팔자 상세 정보 생성
 *
 * @param saju 사주팔자
 * @returns 상세 정보 객체
 *
 * @example
 * ```typescript
 * const saju = calculateSaju(new Date(1990, 0, 15))
 * const info = getSajuInfo(saju)
 * console.log(info.yearAnimal) // "말"
 * console.log(info.dayOhang)   // "목"
 * ```
 */
export function getSajuInfo(saju: import('./types').Saju) {
  const { JIJI_ANIMAL } = require('./types')
  const { CHEONGAN_OHANG, JIJI_OHANG } = require('./ohang')

  return {
    // 기본 정보
    sajuString: formatSaju(saju),
    sajuHanja: formatSaju(saju, true),
    // 띠
    yearAnimal: JIJI_ANIMAL[saju.year.jiji],
    // 일간 (사주의 주인공)
    ilgan: saju.day.cheongan,
    ilganOhang: CHEONGAN_OHANG[saju.day.cheongan],
    // 오행
    yearOhang: CHEONGAN_OHANG[saju.year.cheongan],
    monthOhang: CHEONGAN_OHANG[saju.month.cheongan],
    dayOhang: CHEONGAN_OHANG[saju.day.cheongan],
    hourOhang: CHEONGAN_OHANG[saju.hour.cheongan],
  }
}
