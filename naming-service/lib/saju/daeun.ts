/**
 * 대운(大運) 분석 엔진
 *
 * 10년 단위로 변하는 운세인 대운을 계산하고 분석합니다.
 */

import type {
  Saju,
  Daeun,
  DaeunDirection,
  DaeunAnalysis,
  DaeunRelation,
  DaeunInteraction,
  Cheongan,
  Jiji,
  Ohang,
  Sipseong,
} from './types'
import {
  CHEONGAN_LIST,
  JIJI_LIST,
  CHEONGAN_HANJA,
  JIJI_HANJA,
} from './types'
import {
  CHEONGAN_OHANG,
  JIJI_OHANG,
  CHEONGAN_EUMYANG,
  JIJI_EUMYANG,
} from './ohang'
import { calculateSipseong } from './sipseong'

// ============================================================================
// 60갑자 순환
// ============================================================================

/**
 * 60갑자 배열 생성
 */
function get60Gapja(): Array<{ cheongan: Cheongan; jiji: Jiji }> {
  const gapja: Array<{ cheongan: Cheongan; jiji: Jiji }> = []

  for (let i = 0; i < 60; i++) {
    const cheongan = CHEONGAN_LIST[i % 10]
    const jiji = JIJI_LIST[i % 12]
    gapja.push({ cheongan, jiji })
  }

  return gapja
}

const GAPJA_60 = get60Gapja()

/**
 * 천간지지 조합의 60갑자 인덱스 찾기
 */
function findGapjaIndex(cheongan: Cheongan, jiji: Jiji): number {
  return GAPJA_60.findIndex(
    (g) => g.cheongan === cheongan && g.jiji === jiji
  )
}

/**
 * 다음 갑자 가져오기 (순행)
 */
function getNextGapja(cheongan: Cheongan, jiji: Jiji): { cheongan: Cheongan; jiji: Jiji } {
  const index = findGapjaIndex(cheongan, jiji)
  const nextIndex = (index + 1) % 60
  return GAPJA_60[nextIndex]
}

/**
 * 이전 갑자 가져오기 (역행)
 */
function getPrevGapja(cheongan: Cheongan, jiji: Jiji): { cheongan: Cheongan; jiji: Jiji } {
  const index = findGapjaIndex(cheongan, jiji)
  const prevIndex = (index - 1 + 60) % 60
  return GAPJA_60[prevIndex]
}

// ============================================================================
// 대운 방향 결정
// ============================================================================

/**
 * 대운 방향 결정 (순행/역행)
 *
 * @param yearCheongan 년간
 * @param gender 성별 ('MALE' | 'FEMALE')
 * @returns 대운 방향
 *
 * 규칙:
 * - 남자 양년생(갑병무경임): 순행
 * - 남자 음년생(을정기신계): 역행
 * - 여자 양년생(갑병무경임): 역행
 * - 여자 음년생(을정기신계): 순행
 */
export function getDaeunDirection(
  yearCheongan: Cheongan,
  gender: 'MALE' | 'FEMALE'
): DaeunDirection {
  const eumyang = CHEONGAN_EUMYANG[yearCheongan]

  if (gender === 'MALE') {
    return eumyang === '양' ? '순행' : '역행'
  } else {
    return eumyang === '양' ? '역행' : '순행'
  }
}

// ============================================================================
// 입운 연령 계산
// ============================================================================

/**
 * 입운 연령 계산
 *
 * 실제로는 절입일과 생일의 차이를 계산하지만,
 * 간단히 평균적인 입운 나이를 반환합니다.
 *
 * @param direction 대운 방향
 * @param birthMonth 출생 월
 * @returns 입운 연령
 */
export function calculateStartAge(
  direction: DaeunDirection,
  birthMonth: number
): number {
  // 간단한 계산: 평균적으로 5-8세에 입운
  // 실제로는 절기와 생일의 일수 차이를 3으로 나눔
  // 여기서는 간략화된 버전 사용
  return 5 + Math.floor(Math.random() * 4) // 5-8세 랜덤 (실제로는 정확히 계산해야 함)
}

/**
 * 간략한 입운 연령 계산 (월 기준)
 */
export function getApproximateStartAge(birthMonth: number): number {
  // 절기 근처 출생 여부에 따라 달라지지만, 평균 6세로 고정
  return 6
}

// ============================================================================
// 대운 생성
// ============================================================================

/**
 * 대운 목록 생성
 *
 * @param saju 사주팔자
 * @param gender 성별
 * @param currentAge 현재 나이 (선택사항)
 * @returns 대운 분석 결과
 */
export function analyzeDaeun(
  saju: Saju,
  gender: 'MALE' | 'FEMALE',
  currentAge?: number
): DaeunAnalysis {
  // 대운 방향 결정
  const direction = getDaeunDirection(saju.year.cheongan, gender)

  // 입운 연령 (간략 계산)
  const startAge = getApproximateStartAge(saju.birthInfo.date.getMonth() + 1)

  // 월주부터 시작
  let currentCheongan = saju.month.cheongan
  let currentJiji = saju.month.jiji

  // 대운 목록 생성 (10개, 100세까지)
  const cycles: Daeun[] = []

  for (let i = 0; i < 10; i++) {
    // 순행 또는 역행
    if (i > 0) {
      if (direction === '순행') {
        const next = getNextGapja(currentCheongan, currentJiji)
        currentCheongan = next.cheongan
        currentJiji = next.jiji
      } else {
        const prev = getPrevGapja(currentCheongan, currentJiji)
        currentCheongan = prev.cheongan
        currentJiji = prev.jiji
      }
    }

    const cycleStartAge = startAge + i * 10
    const cycleEndAge = cycleStartAge + 9

    // 대운 오행
    const ohang = {
      cheongan: CHEONGAN_OHANG[currentCheongan],
      jiji: JIJI_OHANG[currentJiji],
    }

    // 대운 십성 (일간 기준)
    const ilgan = saju.day.cheongan
    const ilganOhang = CHEONGAN_OHANG[ilgan]
    const ilganEumyang = CHEONGAN_EUMYANG[ilgan]

    const sipseong = {
      cheongan: calculateSipseong(
        ilgan,
        ilganEumyang,
        ilganOhang,
        currentCheongan,
        CHEONGAN_EUMYANG[currentCheongan],
        CHEONGAN_OHANG[currentCheongan]
      ),
      jiji: calculateSipseong(
        ilgan,
        ilganEumyang,
        ilganOhang,
        currentJiji,
        JIJI_EUMYANG[currentJiji],
        JIJI_OHANG[currentJiji]
      ),
    }

    cycles.push({
      cheongan: currentCheongan,
      jiji: currentJiji,
      name: `${currentCheongan}${currentJiji}`,
      hanja: `${CHEONGAN_HANJA[currentCheongan]}${JIJI_HANJA[currentJiji]}`,
      startAge: cycleStartAge,
      endAge: cycleEndAge,
      ohang,
      sipseong,
    })
  }

  // 현재 대운 찾기
  let currentCycle: Daeun | undefined
  let nextCycle: Daeun | undefined

  if (currentAge !== undefined) {
    for (let i = 0; i < cycles.length; i++) {
      if (currentAge >= cycles[i].startAge && currentAge <= cycles[i].endAge) {
        currentCycle = cycles[i]
        nextCycle = cycles[i + 1]
        break
      }
    }
  }

  // 현재 대운 특성 분석
  let currentCharacteristics
  if (currentCycle) {
    currentCharacteristics = analyzeCycleCharacteristics(currentCycle, saju)
  }

  // 설명 생성
  const description = generateDaeunDescription(direction, startAge, cycles)

  return {
    direction,
    startAge,
    cycles,
    currentCycle,
    nextCycle,
    currentCharacteristics,
    description,
  }
}

/**
 * 대운 특성 분석
 */
function analyzeCycleCharacteristics(
  cycle: Daeun,
  saju: Saju
): DaeunAnalysis['currentCharacteristics'] {
  const flow = `${cycle.startAge}-${cycle.endAge}세, ${cycle.hanja} 대운`
  const strengths: string[] = []
  const warnings: string[] = []
  const suitableActivities: string[] = []

  // 십성 기반 특성
  const cheonganSipseong = cycle.sipseong.cheongan
  const jijiSipseong = cycle.sipseong.jiji

  // 비겁 대운
  if (cheonganSipseong === '비견' || cheonganSipseong === '겁재') {
    strengths.push('독립심과 자신감 증가')
    warnings.push('독단적 행동 주의, 재물 관리 신중')
    suitableActivities.push('창업', '독립', '자기주도적 사업')
  }

  // 식상 대운
  if (cheonganSipseong === '식신' || cheonganSipseong === '상관') {
    strengths.push('표현력과 창의력 향상')
    warnings.push('말실수 주의, 권위 충돌 가능')
    suitableActivities.push('예술', '창작', '교육', '자기표현 활동')
  }

  // 재성 대운
  if (cheonganSipseong === '편재' || cheonganSipseong === '정재') {
    strengths.push('재물운 상승, 경제 활동 활발')
    warnings.push('과로 주의, 물질 집착 경계')
    suitableActivities.push('사업 확장', '투자', '재테크', '영업')
  }

  // 관성 대운
  if (cheonganSipseong === '편관' || cheonganSipseong === '정관') {
    strengths.push('명예와 지위 상승, 책임감 증가')
    warnings.push('스트레스 증가, 압박감 주의')
    suitableActivities.push('승진', '자격증 취득', '공직 진출')
  }

  // 인성 대운
  if (cheonganSipseong === '편인' || cheonganSipseong === '정인') {
    strengths.push('학업운 상승, 정신적 성장')
    warnings.push('실천력 부족, 우유부단 경계')
    suitableActivities.push('학업', '연구', '자기계발', '정신수양')
  }

  return {
    flow,
    strengths,
    warnings,
    suitableActivities,
  }
}

/**
 * 대운 설명 생성
 */
function generateDaeunDescription(
  direction: DaeunDirection,
  startAge: number,
  cycles: Daeun[]
): string {
  const parts: string[] = []

  parts.push(`대운 ${direction}, ${startAge}세 입운`)
  parts.push(`10년 주기로 ${cycles.length}개 대운`)

  const cycleNames = cycles.slice(0, 5).map((c) => `${c.hanja}(${c.startAge}-${c.endAge}세)`)
  parts.push(`주요 대운: ${cycleNames.join(', ')}`)

  return parts.join('. ')
}

// ============================================================================
// 대운과 사주의 관계 분석
// ============================================================================

/**
 * 천간/지지 충 관계
 */
const CHUNG_PAIRS: Record<string, string> = {
  // 천간 충
  '갑': '경',
  '경': '갑',
  '을': '신',
  '신': '을',
  '병': '임',
  '임': '병',
  '정': '계',
  '계': '정',
  // 지지 충 (육충)
  '자': '오',
  '오': '자',
  '축': '미',
  '미': '축',
  '인': '신',
  '신': '인',
  '묘': '유',
  '유': '묘',
  '진': '술',
  '술': '진',
  '사': '해',
  '해': '사',
}

/**
 * 천간/지지 합 관계
 */
const HAP_PAIRS: Record<string, string> = {
  // 천간 합 (오합)
  '갑': '기',
  '기': '갑',
  '을': '경',
  '경': '을',
  '병': '신',
  '신': '병',
  '정': '임',
  '임': '정',
  '무': '계',
  '계': '무',
  // 지지 합 (육합)
  '자': '축',
  '축': '자',
  '인': '해',
  '해': '인',
  '묘': '술',
  '술': '묘',
  '진': '유',
  '유': '진',
  '사': '신',
  '신': '사',
  '오': '미',
  '미': '오',
}

/**
 * 두 글자의 관계 판단
 */
function getRelation(char1: string, char2: string): DaeunRelation {
  if (CHUNG_PAIRS[char1] === char2) {
    return '충'
  }
  if (HAP_PAIRS[char1] === char2) {
    return '합'
  }
  // 형, 파, 해, 원진은 복잡하므로 생략
  return '중립'
}

/**
 * 대운과 사주의 상호작용 분석
 */
export function analyzeDaeunInteraction(
  daeun: Daeun,
  saju: Saju
): DaeunInteraction {
  const relations = {
    withYear: getRelation(daeun.jiji, saju.year.jiji),
    withMonth: getRelation(daeun.jiji, saju.month.jiji),
    withDay: getRelation(daeun.jiji, saju.day.jiji),
    withHour: getRelation(daeun.jiji, saju.hour.jiji),
  }

  const positive: string[] = []
  const negative: string[] = []

  // 합이 있는 경우
  const hasHap = Object.values(relations).includes('합')
  if (hasHap) {
    positive.push('사주와 조화로운 합 관계')
    positive.push('인연운 상승, 협력 증가')
  }

  // 충이 있는 경우
  const hasChung = Object.values(relations).includes('충')
  if (hasChung) {
    negative.push('사주와 충돌 관계')
    negative.push('변화와 이동 가능성, 갈등 주의')
  }

  // 십성 기반 평가
  const cheonganSipseong = daeun.sipseong.cheongan

  if (cheonganSipseong === '비견' || cheonganSipseong === '겁재') {
    positive.push('자립심 강화 시기')
  }
  if (cheonganSipseong === '식신' || cheonganSipseong === '상관') {
    positive.push('재능 발현 시기')
  }
  if (cheonganSipseong === '편재' || cheonganSipseong === '정재') {
    positive.push('재물운 좋은 시기')
  }
  if (cheonganSipseong === '편관' || cheonganSipseong === '정관') {
    positive.push('명예 상승 시기')
  }
  if (cheonganSipseong === '편인' || cheonganSipseong === '정인') {
    positive.push('학업운 좋은 시기')
  }

  // 종합 평가
  let overallRating: DaeunInteraction['overallRating']
  if (hasChung) {
    overallRating = negative.length > 3 ? '매우 주의' : '주의'
  } else if (hasHap) {
    overallRating = positive.length > 3 ? '매우 좋음' : '좋음'
  } else {
    overallRating = '보통'
  }

  return {
    daeun,
    relations,
    positive,
    negative,
    overallRating,
  }
}
