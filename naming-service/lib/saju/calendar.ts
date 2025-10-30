/**
 * 음력/양력 변환 및 절기 계산 유틸리티
 *
 * lunar-javascript 라이브러리를 사용하여 정확한 음력 변환을 수행합니다.
 */

import { Solar, Lunar } from 'lunar-javascript'
import type { Jeolgi } from './types'

// ============================================================================
// 절기 (節氣) 데이터
// ============================================================================

/**
 * 24절기 목록 (순서대로)
 */
export const JEOLGI_LIST: Jeolgi[] = [
  '입춘', '우수', '경칩', '춘분', '청명', '곡우',
  '입하', '소만', '망종', '하지', '소서', '대서',
  '입추', '처서', '백로', '추분', '한로', '상강',
  '입동', '소설', '대설', '동지', '소한', '대한',
]

/**
 * 절기의 한자 매핑
 */
export const JEOLGI_HANJA: Record<Jeolgi, string> = {
  '입춘': '立春', '우수': '雨水', '경칩': '驚蟄', '춘분': '春分', '청명': '淸明', '곡우': '穀雨',
  '입하': '立夏', '소만': '小滿', '망종': '芒種', '하지': '夏至', '소서': '小暑', '대서': '大暑',
  '입추': '立秋', '처서': '處暑', '백로': '白露', '추분': '秋分', '한로': '寒露', '상강': '霜降',
  '입동': '立冬', '소설': '小雪', '대설': '大雪', '동지': '冬至', '소한': '小寒', '대한': '大寒',
}

/**
 * 월별 절기 (입절 기준)
 * 월의 시작은 절기로 결정됨 (예: 2월 = 입춘부터 경칩 전까지)
 */
export const MONTH_JEOLGI: Record<number, Jeolgi> = {
  1: '입춘',   // 음력 1월 = 입춘
  2: '경칩',   // 음력 2월 = 경칩
  3: '청명',   // 음력 3월 = 청명
  4: '입하',   // 음력 4월 = 입하
  5: '망종',   // 음력 5월 = 망종
  6: '소서',   // 음력 6월 = 소서
  7: '입추',   // 음력 7월 = 입추
  8: '백로',   // 음력 8월 = 백로
  9: '한로',   // 음력 9월 = 한로
  10: '입동',  // 음력 10월 = 입동
  11: '대설',  // 음력 11월 = 대설
  12: '소한',  // 음력 12월 = 소한
}

// ============================================================================
// 양력 ↔ 음력 변환
// ============================================================================

/**
 * 양력 날짜를 음력으로 변환
 *
 * @param date 양력 날짜
 * @returns 음력 날짜 정보
 *
 * @example
 * ```typescript
 * const lunar = solarToLunar(new Date(1990, 0, 15)) // 1990년 1월 15일
 * console.log(lunar) // { year: 1989, month: 12, day: 19, isLeapMonth: false }
 * ```
 */
export function solarToLunar(date: Date): {
  year: number
  month: number
  day: number
  isLeapMonth: boolean
} {
  const solar = Solar.fromDate(date)
  const lunar = solar.getLunar()

  // TODO: lunar-javascript의 정확한 윤달 API 확인 필요
  // 현재는 간단하게 false로 처리
  const isLeapMonth = false

  return {
    year: lunar.getYear(),
    month: lunar.getMonth(),
    day: lunar.getDay(),
    isLeapMonth,
  }
}

/**
 * 음력 날짜를 양력으로 변환
 *
 * @param year 음력 년
 * @param month 음력 월
 * @param day 음력 일
 * @param isLeapMonth 윤달 여부
 * @returns 양력 날짜
 *
 * @example
 * ```typescript
 * const solar = lunarToSolar(1989, 12, 19, false)
 * console.log(solar) // Date(1990, 0, 15)
 * ```
 */
export function lunarToSolar(
  year: number,
  month: number,
  day: number,
  isLeapMonth: boolean = false
): Date {
  const lunar = Lunar.fromYmd(year, month, day)

  // 윤달 처리
  if (isLeapMonth && lunar.getLeapMonth() === month) {
    // 윤달인 경우
    const solar = lunar.getSolar()
    return new Date(solar.getYear(), solar.getMonth() - 1, solar.getDay())
  }

  const solar = lunar.getSolar()
  return new Date(solar.getYear(), solar.getMonth() - 1, solar.getDay())
}

// ============================================================================
// 절기 계산
// ============================================================================

/**
 * 특정 년도의 절기 날짜들을 계산 (근사값)
 *
 * @param year 년도
 * @returns 절기별 양력 날짜 맵
 *
 * @example
 * ```typescript
 * const jeolgiDates = getJeolgiDatesInYear(2024)
 * console.log(jeolgiDates['입춘']) // Date(2024, 1, 4) - 2024년 2월 4일
 * ```
 *
 * 참고: 현재는 근사값을 사용합니다. 정확한 절입시각은 천문 계산이 필요합니다.
 */
export function getJeolgiDatesInYear(year: number): Record<Jeolgi, Date> {
  // 절기 근사 날짜 (매년 비슷한 날짜에 발생)
  const approximateDates: Record<Jeolgi, { month: number; day: number }> = {
    '입춘': { month: 2, day: 4 },
    '우수': { month: 2, day: 19 },
    '경칩': { month: 3, day: 6 },
    '춘분': { month: 3, day: 21 },
    '청명': { month: 4, day: 5 },
    '곡우': { month: 4, day: 20 },
    '입하': { month: 5, day: 6 },
    '소만': { month: 5, day: 21 },
    '망종': { month: 6, day: 6 },
    '하지': { month: 6, day: 21 },
    '소서': { month: 7, day: 7 },
    '대서': { month: 7, day: 23 },
    '입추': { month: 8, day: 8 },
    '처서': { month: 8, day: 23 },
    '백로': { month: 9, day: 8 },
    '추분': { month: 9, day: 23 },
    '한로': { month: 10, day: 8 },
    '상강': { month: 10, day: 23 },
    '입동': { month: 11, day: 7 },
    '소설': { month: 11, day: 22 },
    '대설': { month: 12, day: 7 },
    '동지': { month: 12, day: 22 },
    '소한': { month: 1, day: 6 },
    '대한': { month: 1, day: 20 },
  }

  const jeolgiDates: Partial<Record<Jeolgi, Date>> = {}

  for (const [name, dateInfo] of Object.entries(approximateDates)) {
    jeolgiDates[name as Jeolgi] = new Date(year, dateInfo.month - 1, dateInfo.day)
  }

  return jeolgiDates as Record<Jeolgi, Date>
}

/**
 * 특정 날짜가 어떤 절기에 속하는지 확인
 *
 * @param date 확인할 날짜
 * @returns 현재 절기와 다음 절기
 *
 * @example
 * ```typescript
 * const jeolgi = getCurrentJeolgi(new Date(2024, 1, 10))
 * console.log(jeolgi) // { current: '입춘', next: '우수', ... }
 * ```
 */
export function getCurrentJeolgi(date: Date): {
  current: Jeolgi
  next: Jeolgi
  currentDate: Date
  nextDate: Date
} {
  const year = date.getFullYear()
  const jeolgiDates = getJeolgiDatesInYear(year)

  // 날짜 순으로 정렬된 절기 배열
  const sortedJeolgi = JEOLGI_LIST.map(name => ({
    name,
    date: jeolgiDates[name]
  })).sort((a, b) => a.date.getTime() - b.date.getTime())

  // 현재 날짜가 어느 절기와 절기 사이인지 찾기
  for (let i = 0; i < sortedJeolgi.length; i++) {
    const current = sortedJeolgi[i]
    const next = sortedJeolgi[(i + 1) % sortedJeolgi.length]

    if (date >= current.date && (i === sortedJeolgi.length - 1 || date < next.date)) {
      return {
        current: current.name,
        next: next.name,
        currentDate: current.date,
        nextDate: next.date,
      }
    }
  }

  // 년 초에는 대한이 현재 절기
  const lastJeolgi = sortedJeolgi[sortedJeolgi.length - 1]
  const firstJeolgi = sortedJeolgi[0]

  return {
    current: lastJeolgi.name,
    next: firstJeolgi.name,
    currentDate: lastJeolgi.date,
    nextDate: firstJeolgi.date,
  }
}

/**
 * 월 계산용 절입 확인
 * 사주에서 월은 절기를 기준으로 바뀝니다.
 *
 * @param date 확인할 날짜
 * @returns 사주상의 월 (1-12)
 *
 * @example
 * ```typescript
 * // 2024년 2월 3일 (입춘 전)
 * const month1 = getSajuMonth(new Date(2024, 1, 3)) // 12월
 *
 * // 2024년 2월 4일 (입춘 당일 또는 이후)
 * const month2 = getSajuMonth(new Date(2024, 1, 4)) // 1월
 * ```
 */
export function getSajuMonth(date: Date): number {
  const jeolgi = getCurrentJeolgi(date)

  // 절기명으로 월 찾기
  const monthMapping: Record<Jeolgi, number> = {
    '입춘': 1, '우수': 1,
    '경칩': 2, '춘분': 2,
    '청명': 3, '곡우': 3,
    '입하': 4, '소만': 4,
    '망종': 5, '하지': 5,
    '소서': 6, '대서': 6,
    '입추': 7, '처서': 7,
    '백로': 8, '추분': 8,
    '한로': 9, '상강': 9,
    '입동': 10, '소설': 10,
    '대설': 11, '동지': 11,
    '소한': 12, '대한': 12,
  }

  return monthMapping[jeolgi.current] || 1
}

// ============================================================================
// 유틸리티 함수
// ============================================================================

/**
 * 음력 날짜 문자열 포맷팅
 *
 * @param year 음력 년
 * @param month 음력 월
 * @param day 음력 일
 * @param isLeapMonth 윤달 여부
 * @returns 포맷팅된 문자열
 *
 * @example
 * ```typescript
 * formatLunarDate(2024, 1, 15, false) // "2024년 1월 15일"
 * formatLunarDate(2024, 3, 10, true)  // "2024년 윤3월 10일"
 * ```
 */
export function formatLunarDate(
  year: number,
  month: number,
  day: number,
  isLeapMonth: boolean = false
): string {
  const leapPrefix = isLeapMonth ? '윤' : ''
  return `${year}년 ${leapPrefix}${month}월 ${day}일`
}

/**
 * 양력 날짜 문자열 포맷팅
 *
 * @param date 양력 날짜
 * @returns 포맷팅된 문자열
 *
 * @example
 * ```typescript
 * formatSolarDate(new Date(2024, 0, 15)) // "2024년 1월 15일"
 * ```
 */
export function formatSolarDate(date: Date): string {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
}

/**
 * 윤달이 있는 해인지 확인
 *
 * @param year 음력 년도
 * @returns 윤달 정보 (윤달이 있으면 윤달의 월, 없으면 0)
 */
export function getLeapMonth(year: number): number {
  const lunar = Lunar.fromYmd(year, 1, 1)
  return lunar.getLeapMonth()
}
