/**
 * 대운(大運) 분석 시스템 테스트
 *
 * 대운 계산 및 분석 기능을 테스트합니다.
 */

import {
  analyzeDaeun,
  getDaeunDirection,
  analyzeDaeunInteraction,
} from './daeun'
import type { Saju } from './types'
import { SIPSEONG_HANJA } from './types'

/**
 * 대운 방향 결정 테스트
 */
function testDaeunDirection() {
  console.log('🧪 테스트 1: 대운 방향 결정\n')
  console.log('-'.repeat(60))

  const testCases = [
    { year: '갑', gender: 'MALE' as const, expected: '순행', reason: '남자 양년생' },
    { year: '을', gender: 'MALE' as const, expected: '역행', reason: '남자 음년생' },
    { year: '갑', gender: 'FEMALE' as const, expected: '역행', reason: '여자 양년생' },
    { year: '을', gender: 'FEMALE' as const, expected: '순행', reason: '여자 음년생' },
    { year: '병', gender: 'MALE' as const, expected: '순행', reason: '남자 양년생' },
    { year: '정', gender: 'FEMALE' as const, expected: '순행', reason: '여자 음년생' },
  ]

  testCases.forEach(({ year, gender, expected, reason }) => {
    const result = getDaeunDirection(year as any, gender)
    const pass = result === expected ? '✅' : '❌'
    console.log(`${pass} ${year}년생 ${gender === 'MALE' ? '남자' : '여자'}: ${result} (기대: ${expected})`)
    console.log(`   이유: ${reason}`)
  })

  console.log('\n')
}

/**
 * 대운 생성 테스트
 */
function testDaeunGeneration() {
  console.log('🧪 테스트 2: 대운 생성\n')
  console.log('-'.repeat(60))

  // 예시 사주 1: 1990년 5월 15일 출생
  const saju1: Saju = {
    year: {
      cheongan: '경',
      jiji: '오',
      name: '경오',
      hanja: '庚午',
    },
    month: {
      cheongan: '신',
      jiji: '사',
      name: '신사',
      hanja: '辛巳',
    },
    day: {
      cheongan: '갑',
      jiji: '인',
      name: '갑인',
      hanja: '甲寅',
    },
    hour: {
      cheongan: '경',
      jiji: '오',
      name: '경오',
      hanja: '庚午',
    },
    birthInfo: {
      date: new Date('1990-05-15'),
      isLunar: false,
    },
  }

  console.log('📅 사주: 경오년 신사월 갑인일 경오시 (남자)')
  console.log()

  const analysis = analyzeDaeun(saju1, 'MALE')

  console.log(`대운 방향: ${analysis.direction}`)
  console.log(`입운 연령: ${analysis.startAge}세`)
  console.log()

  console.log('대운 목록 (처음 5개):')
  analysis.cycles.slice(0, 5).forEach((cycle, i) => {
    console.log(`  ${i + 1}. ${cycle.hanja}(${cycle.name}) - ${cycle.startAge}-${cycle.endAge}세`)
    console.log(`     천간 십성: ${SIPSEONG_HANJA[cycle.sipseong.cheongan]}`)
    console.log(`     지지 십성: ${SIPSEONG_HANJA[cycle.sipseong.jiji]}`)
  })

  console.log()
  console.log(`설명: ${analysis.description}`)

  console.log('\n')
}

/**
 * 현재 대운 분석 테스트
 */
function testCurrentDaeun() {
  console.log('🧪 테스트 3: 현재 대운 분석\n')
  console.log('-'.repeat(60))

  const saju: Saju = {
    year: {
      cheongan: '경',
      jiji: '오',
      name: '경오',
      hanja: '庚午',
    },
    month: {
      cheongan: '신',
      jiji: '사',
      name: '신사',
      hanja: '辛巳',
    },
    day: {
      cheongan: '갑',
      jiji: '인',
      name: '갑인',
      hanja: '甲寅',
    },
    hour: {
      cheongan: '경',
      jiji: '오',
      name: '경오',
      hanja: '庚午',
    },
    birthInfo: {
      date: new Date('1990-05-15'),
      isLunar: false,
    },
  }

  // 현재 나이 35세 (2025년 기준)
  const currentAge = 35

  console.log(`📅 사주: 경오년 신사월 갑인일 경오시`)
  console.log(`현재 나이: ${currentAge}세\n`)

  const analysis = analyzeDaeun(saju, 'MALE', currentAge)

  if (analysis.currentCycle) {
    console.log('✅ 현재 대운:')
    console.log(`   ${analysis.currentCycle.hanja}(${analysis.currentCycle.name}) 대운`)
    console.log(`   나이: ${analysis.currentCycle.startAge}-${analysis.currentCycle.endAge}세`)
    console.log(`   천간 십성: ${SIPSEONG_HANJA[analysis.currentCycle.sipseong.cheongan]}`)
    console.log(`   지지 십성: ${SIPSEONG_HANJA[analysis.currentCycle.sipseong.jiji]}`)
    console.log()

    if (analysis.currentCharacteristics) {
      console.log('현재 대운의 특성:')
      console.log(`   흐름: ${analysis.currentCharacteristics.flow}`)

      if (analysis.currentCharacteristics.strengths.length > 0) {
        console.log('   강점:')
        analysis.currentCharacteristics.strengths.forEach((s, i) => {
          console.log(`     ${i + 1}. ${s}`)
        })
      }

      if (analysis.currentCharacteristics.warnings.length > 0) {
        console.log('   주의사항:')
        analysis.currentCharacteristics.warnings.forEach((w, i) => {
          console.log(`     ${i + 1}. ${w}`)
        })
      }

      if (analysis.currentCharacteristics.suitableActivities.length > 0) {
        console.log('   적합한 활동:')
        console.log(`     ${analysis.currentCharacteristics.suitableActivities.join(', ')}`)
      }
    }
  }

  console.log()

  if (analysis.nextCycle) {
    console.log('📆 다음 대운:')
    console.log(`   ${analysis.nextCycle.hanja}(${analysis.nextCycle.name}) 대운`)
    console.log(`   나이: ${analysis.nextCycle.startAge}-${analysis.nextCycle.endAge}세`)
  }

  console.log('\n')
}

/**
 * 대운과 사주의 관계 분석 테스트
 */
function testDaeunInteraction() {
  console.log('🧪 테스트 4: 대운과 사주의 관계\n')
  console.log('-'.repeat(60))

  const saju: Saju = {
    year: {
      cheongan: '경',
      jiji: '오',
      name: '경오',
      hanja: '庚午',
    },
    month: {
      cheongan: '신',
      jiji: '사',
      name: '신사',
      hanja: '辛巳',
    },
    day: {
      cheongan: '갑',
      jiji: '자',
      name: '갑자',
      hanja: '甲子',
    },
    hour: {
      cheongan: '경',
      jiji: '오',
      name: '경오',
      hanja: '庚午',
    },
    birthInfo: {
      date: new Date('1990-05-15'),
      isLunar: false,
    },
  }

  const analysis = analyzeDaeun(saju, 'MALE', 25)

  if (analysis.currentCycle) {
    const interaction = analyzeDaeunInteraction(analysis.currentCycle, saju)

    console.log(`대운: ${interaction.daeun.hanja}(${interaction.daeun.name})`)
    console.log()

    console.log('사주와의 관계:')
    console.log(`  년주(${saju.year.jiji}): ${interaction.relations.withYear}`)
    console.log(`  월주(${saju.month.jiji}): ${interaction.relations.withMonth}`)
    console.log(`  일주(${saju.day.jiji}): ${interaction.relations.withDay}`)
    console.log(`  시주(${saju.hour.jiji}): ${interaction.relations.withHour}`)
    console.log()

    if (interaction.positive.length > 0) {
      console.log('긍정 요소:')
      interaction.positive.forEach((p, i) => {
        console.log(`  ${i + 1}. ${p}`)
      })
      console.log()
    }

    if (interaction.negative.length > 0) {
      console.log('부정 요소:')
      interaction.negative.forEach((n, i) => {
        console.log(`  ${i + 1}. ${n}`)
      })
      console.log()
    }

    console.log(`종합 평가: ${interaction.overallRating}`)
  }

  console.log('\n')
}

/**
 * 순행/역행 대운 비교 테스트
 */
function testDirectionComparison() {
  console.log('🧪 테스트 5: 순행/역행 대운 비교\n')
  console.log('-'.repeat(60))

  const baseSaju: Saju = {
    year: {
      cheongan: '갑',
      jiji: '인',
      name: '갑인',
      hanja: '甲寅',
    },
    month: {
      cheongan: '병',
      jiji: '인',
      name: '병인',
      hanja: '丙寅',
    },
    day: {
      cheongan: '무',
      jiji: '진',
      name: '무진',
      hanja: '戊辰',
    },
    hour: {
      cheongan: '경',
      jiji: '신',
      name: '경신',
      hanja: '庚申',
    },
    birthInfo: {
      date: new Date('1974-02-15'),
      isLunar: false,
    },
  }

  console.log('📅 사주: 갑인년 병인월 무진일 경신시\n')

  // 남자 (순행)
  console.log('👨 남자 (순행):')
  const maleAnalysis = analyzeDaeun(baseSaju, 'MALE')
  console.log(`  방향: ${maleAnalysis.direction}`)
  console.log(`  입운: ${maleAnalysis.startAge}세`)
  console.log(`  대운 순서:`)
  maleAnalysis.cycles.slice(0, 5).forEach((c, i) => {
    console.log(`    ${i + 1}. ${c.hanja} (${c.startAge}-${c.endAge}세)`)
  })

  console.log()

  // 여자 (역행)
  console.log('👩 여자 (역행):')
  const femaleAnalysis = analyzeDaeun(baseSaju, 'FEMALE')
  console.log(`  방향: ${femaleAnalysis.direction}`)
  console.log(`  입운: ${femaleAnalysis.startAge}세`)
  console.log(`  대운 순서:`)
  femaleAnalysis.cycles.slice(0, 5).forEach((c, i) => {
    console.log(`    ${i + 1}. ${c.hanja} (${c.startAge}-${c.endAge}세)`)
  })

  console.log('\n')
}

/**
 * 대운 십성 분포 테스트
 */
function testDaeunSipseongDistribution() {
  console.log('🧪 테스트 6: 대운 십성 분포\n')
  console.log('-'.repeat(60))

  const saju: Saju = {
    year: {
      cheongan: '경',
      jiji: '오',
      name: '경오',
      hanja: '庚午',
    },
    month: {
      cheongan: '신',
      jiji: '사',
      name: '신사',
      hanja: '辛巳',
    },
    day: {
      cheongan: '갑',
      jiji: '인',
      name: '갑인',
      hanja: '甲寅',
    },
    hour: {
      cheongan: '경',
      jiji: '오',
      name: '경오',
      hanja: '庚午',
    },
    birthInfo: {
      date: new Date('1990-05-15'),
      isLunar: false,
    },
  }

  const analysis = analyzeDaeun(saju, 'MALE')

  console.log('📊 각 대운의 십성 분포:\n')

  analysis.cycles.slice(0, 10).forEach((cycle, i) => {
    console.log(`${i + 1}. ${cycle.hanja}(${cycle.startAge}-${cycle.endAge}세)`)
    console.log(`   천간: ${SIPSEONG_HANJA[cycle.sipseong.cheongan]}(${cycle.sipseong.cheongan})`)
    console.log(`   지지: ${SIPSEONG_HANJA[cycle.sipseong.jiji]}(${cycle.sipseong.jiji})`)
  })

  console.log('\n')
}

/**
 * 메인 테스트 실행
 */
async function main() {
  console.log('🔮 대운(大運) 분석 시스템 테스트')
  console.log('='.repeat(60))
  console.log()

  try {
    testDaeunDirection()
    testDaeunGeneration()
    testCurrentDaeun()
    testDaeunInteraction()
    testDirectionComparison()
    testDaeunSipseongDistribution()

    console.log('='.repeat(60))
    console.log('✅ 모든 테스트 완료!')
    console.log()
  } catch (error: any) {
    console.error('❌ 테스트 실패:', error.message)
    console.error(error.stack)
    process.exit(1)
  }
}

// 스크립트 직접 실행시
if (require.main === module) {
  main()
}

export { main as runDaeunTests }
