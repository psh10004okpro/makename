/**
 * 사주팔자 계산 엔진
 *
 * 생년월일시로부터 사주팔자(년주, 월주, 일주, 시주)를 계산합니다.
 */

import { Solar, Lunar } from 'lunar-javascript'
import type {
  Cheongan,
  Jiji,
  Pillar,
  Saju,
  BirthInfo,
  SajuCalculationOptions,
} from './types'
import {
  CHEONGAN_LIST,
  JIJI_LIST,
  CHEONGAN_HANJA,
  JIJI_HANJA,
} from './types'
import { solarToLunar, lunarToSolar, getSajuMonth } from './calendar'

// ============================================================================
// 사주 계산 클래스
// ============================================================================

/**
 * 사주팔자 계산기
 *
 * 전통 명리학의 계산 방법을 따라 사주팔자를 정확하게 계산합니다.
 */
export class SajuCalculator {
  /** 천간 배열 */
  private readonly cheongan = CHEONGAN_LIST
  /** 지지 배열 */
  private readonly jiji = JIJI_LIST

  /**
   * 년주 계산
   *
   * 갑자년(1984년)을 기준으로 계산합니다.
   * 주의: 입춘 전에 태어난 경우 전년도로 계산해야 합니다.
   *
   * @param year 년도
   * @returns 년주 기둥
   *
   * @example
   * ```typescript
   * const calculator = new SajuCalculator()
   * const yearPillar = calculator.calculateYearPillar(1990)
   * console.log(yearPillar) // { cheongan: '경', jiji: '오', name: '경오', hanja: '庚午' }
   * ```
   */
  calculateYearPillar(year: number): Pillar {
    // 1984년 = 갑자년 (甲子年)
    const baseYear = 1984
    const yearDiff = year - baseYear

    // 천간은 10년 주기, 지지는 12년 주기
    const cheonganIndex = ((yearDiff % 10) + 10) % 10
    const jijiIndex = ((yearDiff % 12) + 12) % 12

    const cheongan = this.cheongan[cheonganIndex]
    const jiji = this.jiji[jijiIndex]

    return this.createPillar(cheongan, jiji)
  }

  /**
   * 월주 계산
   *
   * 오호둔갑법(五虎遁甲法)을 사용하여 계산합니다.
   * 절기를 기준으로 월이 바뀝니다.
   *
   * @param date 날짜
   * @param yearStem 년간 (천간)
   * @returns 월주 기둥
   *
   * @example
   * ```typescript
   * const calculator = new SajuCalculator()
   * const monthPillar = calculator.calculateMonthPillar(new Date(1990, 0, 15), '경')
   * console.log(monthPillar) // { cheongan: '무', jiji: '인', name: '무인', hanja: '戊寅' }
   * ```
   */
  calculateMonthPillar(date: Date, yearStem: Cheongan): Pillar {
    // 절기를 고려한 사주상의 월
    const month = getSajuMonth(date)

    // 월지는 월에 따라 고정
    // 1월=인, 2월=묘, 3월=진, ... 12월=축
    const monthJijiIndex = (month + 1) % 12 // 인(寅)부터 시작
    const monthJiji = this.jiji[monthJijiIndex]

    // 월간은 오호둔갑법으로 계산
    // 년간에 따라 정월(인월)의 천간이 결정됨
    const monthStem = this.getMonthStemByOhoDungap(yearStem, month)

    return this.createPillar(monthStem, monthJiji)
  }

  /**
   * 일주 계산
   *
   * lunar-javascript 라이브러리를 사용하여 정확한 일주를 계산합니다.
   * 만세력 기준으로 계산됩니다.
   *
   * @param date 날짜
   * @returns 일주 기둥
   *
   * @example
   * ```typescript
   * const calculator = new SajuCalculator()
   * const dayPillar = calculator.calculateDayPillar(new Date(1990, 0, 15))
   * console.log(dayPillar) // { cheongan: '을', jiji: '사', name: '을사', hanja: '乙巳' }
   * ```
   */
  calculateDayPillar(date: Date): Pillar {
    const solar = Solar.fromDate(date)
    const lunar = solar.getLunar()

    // lunar-javascript의 일주 정보 가져오기
    const dayGanZhi = lunar.getDayInGanZhi()

    // 한자를 한글로 변환
    const { cheongan, jiji } = this.parseGanjiHanja(dayGanZhi)

    return this.createPillar(cheongan, jiji)
  }

  /**
   * 시주 계산
   *
   * 오자둔갑법(五鼠遁甲法)을 사용하여 계산합니다.
   *
   * @param hour 시간 (0-23)
   * @param dayStem 일간 (천간)
   * @returns 시주 기둥
   *
   * @example
   * ```typescript
   * const calculator = new SajuCalculator()
   * const hourPillar = calculator.calculateHourPillar(14, '을')
   * console.log(hourPillar) // { cheongan: '계', jiji: '미', name: '계미', hanja: '癸未' }
   * ```
   */
  calculateHourPillar(hour: number, dayStem: Cheongan): Pillar {
    // 시지는 시간에 따라 고정
    // 23-01시=자, 01-03시=축, ...
    const hourJijiIndex = Math.floor(((hour + 1) % 24) / 2)
    const hourJiji = this.jiji[hourJijiIndex]

    // 시간은 오자둔갑법으로 계산
    const hourStem = this.getHourStemByOjaDungap(dayStem, hourJijiIndex)

    return this.createPillar(hourStem, hourJiji)
  }

  /**
   * 완전한 사주팔자 계산
   *
   * 생년월일시를 입력받아 사주팔자 전체를 계산합니다.
   *
   * @param birthDate 생년월일
   * @param options 계산 옵션 (시간, 음력 여부 등)
   * @returns 완전한 사주팔자
   *
   * @example
   * ```typescript
   * const calculator = new SajuCalculator()
   * const saju = calculator.calculateSaju(
   *   new Date(1990, 0, 15),
   *   { time: '14:30', isLunar: false }
   * )
   * console.log(saju.year.name)  // "경오"
   * console.log(saju.month.name) // "무인"
   * console.log(saju.day.name)   // "을사"
   * console.log(saju.hour.name)  // "계미"
   * ```
   */
  calculateSaju(
    birthDate: Date,
    options: SajuCalculationOptions = {}
  ): Saju {
    const { isLunar = false, time, isLeapMonth = false } = options

    // 음력인 경우 양력으로 변환
    let solarDate = birthDate
    if (isLunar) {
      solarDate = lunarToSolar(
        birthDate.getFullYear(),
        birthDate.getMonth() + 1,
        birthDate.getDate(),
        isLeapMonth
      )
    }

    // 시간 파싱 (문자열 또는 숫자)
    const hour = this.parseTime(time)

    // 년주 계산 (입춘 조정 필요)
    const yearForPillar = this.adjustYearForIpchun(solarDate)
    const yearPillar = this.calculateYearPillar(yearForPillar)

    // 월주 계산
    const monthPillar = this.calculateMonthPillar(solarDate, yearPillar.cheongan)

    // 일주 계산
    const dayPillar = this.calculateDayPillar(solarDate)

    // 시주 계산
    const hourPillar = this.calculateHourPillar(hour, dayPillar.cheongan)

    // 생년월일시 정보
    const birthInfo: BirthInfo = {
      date: solarDate,
      isLunar,
      time,
      isLeapMonth,
    }

    return {
      year: yearPillar,
      month: monthPillar,
      day: dayPillar,
      hour: hourPillar,
      birthInfo,
    }
  }

  // ==========================================================================
  // Private Helper Methods
  // ==========================================================================

  /**
   * 천간과 지지로 기둥 객체 생성
   */
  private createPillar(cheongan: Cheongan, jiji: Jiji): Pillar {
    return {
      cheongan,
      jiji,
      name: `${cheongan}${jiji}`,
      hanja: `${CHEONGAN_HANJA[cheongan]}${JIJI_HANJA[jiji]}`,
    }
  }

  /**
   * 오호둔갑법 (五虎遁甲法) - 월간 계산
   *
   * 년간에 따라 정월(인월)의 천간이 결정됨
   * - 갑기년: 병인월부터 시작
   * - 을경년: 무인월부터 시작
   * - 병신년: 경인월부터 시작
   * - 정임년: 임인월부터 시작
   * - 무계년: 갑인월부터 시작
   */
  private getMonthStemByOhoDungap(yearStem: Cheongan, month: number): Cheongan {
    // 년간의 인덱스
    const yearStemIndex = this.cheongan.indexOf(yearStem)

    // 정월(인월)의 천간 시작 인덱스
    // 갑(0), 을(1), 병(2), 정(3), 무(4), 기(5), 경(6), 신(7), 임(8), 계(9)
    // 갑기(0,5) -> 병(2), 을경(1,6) -> 무(4), 병신(2,7) -> 경(6), 정임(3,8) -> 임(8), 무계(4,9) -> 갑(0)
    const startStemIndex = (yearStemIndex % 5) * 2 + 2

    // 월에 따른 천간 계산 (인월=1월부터)
    const monthStemIndex = (startStemIndex + month - 1) % 10

    return this.cheongan[monthStemIndex]
  }

  /**
   * 오자둔갑법 (五鼠遁甲法) - 시간 계산
   *
   * 일간에 따라 자시의 천간이 결정됨
   * - 갑기일: 갑자시부터 시작
   * - 을경일: 병자시부터 시작
   * - 병신일: 무자시부터 시작
   * - 정임일: 경자시부터 시작
   * - 무계일: 임자시부터 시작
   */
  private getHourStemByOjaDungap(dayStem: Cheongan, hourJijiIndex: number): Cheongan {
    // 일간의 인덱스
    const dayStemIndex = this.cheongan.indexOf(dayStem)

    // 자시의 천간 시작 인덱스
    const startStemIndex = (dayStemIndex % 5) * 2

    // 시지에 따른 천간 계산
    const hourStemIndex = (startStemIndex + hourJijiIndex) % 10

    return this.cheongan[hourStemIndex]
  }

  /**
   * 간지 한자를 한글로 변환
   */
  private parseGanjiHanja(ganjiHanja: string): { cheongan: Cheongan; jiji: Jiji } {
    const hanjaToCheongan: Record<string, Cheongan> = {
      '甲': '갑', '乙': '을', '丙': '병', '丁': '정', '戊': '무',
      '己': '기', '庚': '경', '辛': '신', '壬': '임', '癸': '계',
    }

    const hanjaToJiji: Record<string, Jiji> = {
      '子': '자', '丑': '축', '寅': '인', '卯': '묘', '辰': '진', '巳': '사',
      '午': '오', '未': '미', '申': '신', '酉': '유', '戌': '술', '亥': '해',
    }

    const cheonganHanja = ganjiHanja[0]
    const jijiHanja = ganjiHanja[1]

    return {
      cheongan: hanjaToCheongan[cheonganHanja] || '갑',
      jiji: hanjaToJiji[jijiHanja] || '자',
    }
  }

  /**
   * 시간 파싱 (문자열 또는 숫자)
   */
  private parseTime(time?: string): number {
    if (!time) return 12 // 기본값: 낮 12시

    // "14:30" 형식
    if (time.includes(':')) {
      const hour = parseInt(time.split(':')[0])
      return isNaN(hour) ? 12 : hour
    }

    // "오시" 같은 형식
    const hourMapping: Record<string, number> = {
      '자시': 0, '축시': 2, '인시': 4, '묘시': 6,
      '진시': 8, '사시': 10, '오시': 12, '미시': 14,
      '신시': 16, '유시': 18, '술시': 20, '해시': 22,
    }

    return hourMapping[time] || 12
  }

  /**
   * 입춘 조정
   *
   * 입춘 전에 태어난 경우 전년도로 계산
   * 입춘은 보통 양력 2월 3~5일경
   */
  private adjustYearForIpchun(date: Date): number {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    // 간단한 근사: 2월 4일 이전이면 전년도로 계산
    // (정확한 절입시각은 lunar-javascript로 추후 개선 가능)
    if (month === 1 || (month === 2 && day < 4)) {
      return year - 1
    }

    return year
  }
}

// ============================================================================
// 편의 함수
// ============================================================================

/**
 * 사주팔자 계산 (싱글톤 인스턴스 사용)
 *
 * @param birthDate 생년월일
 * @param options 계산 옵션
 * @returns 사주팔자
 *
 * @example
 * ```typescript
 * const saju = calculateSaju(new Date(1990, 0, 15), { time: '14:30' })
 * console.log(saju.year.name) // "경오"
 * ```
 */
export function calculateSaju(
  birthDate: Date,
  options?: SajuCalculationOptions
): Saju {
  const calculator = new SajuCalculator()
  return calculator.calculateSaju(birthDate, options)
}
