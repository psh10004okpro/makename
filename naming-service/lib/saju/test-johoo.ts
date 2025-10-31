/**
 * 계절 조후 (調候) 시스템 테스트
 *
 * 계절별 용신 조정 기능을 테스트합니다.
 */

import {
  getSeason,
  getSeasonInfo,
  adjustYongsinBySeason,
  getSeasonalHanjaScore,
  getSeasonalGuidance,
  getSeasonalHanjaCharacteristics,
} from './johoo'
import type { Ohang } from './types'

/**
 * 계절 판단 테스트
 */
function testSeasonDetermination() {
  console.log('🧪 테스트 1: 계절 판단\n')
  console.log('-'.repeat(60))

  const testCases = [
    { month: 1, expected: 'WINTER', name: '1월 (겨울)' },
    { month: 3, expected: 'SPRING', name: '3월 (봄)' },
    { month: 5, expected: 'SUMMER', name: '5월 (여름)' },
    { month: 6, expected: 'SUMMER', name: '6월 (여름)' },
    { month: 9, expected: 'FALL', name: '9월 (가을)' },
    { month: 11, expected: 'WINTER', name: '11월 (겨울)' },
    { month: 12, expected: 'WINTER', name: '12월 (겨울)' },
  ]

  testCases.forEach(({ month, expected, name }) => {
    const season = getSeason(month)
    const pass = season === expected ? '✅' : '❌'
    console.log(`${pass} ${name}: ${season} (기대: ${expected})`)
  })

  console.log()
}

/**
 * 계절 정보 테스트
 */
function testSeasonInfo() {
  console.log('🧪 테스트 2: 계절 정보 조회\n')
  console.log('-'.repeat(60))

  const months = [3, 6, 9, 12] // 봄, 여름, 가을, 겨울

  months.forEach((month) => {
    const info = getSeasonInfo(month)
    console.log(`\n📅 ${month}월 - ${info.seasonName}`)
    console.log(`   주도 오행: ${info.dominantElement}`)
    console.log(`   선호 용신: ${info.preferredYongsin.join(', ')}`)
    console.log(`   피할 오행: ${info.avoidedElements.join(', ')}`)
    console.log(`   설명: ${info.description}`)
  })

  console.log('\n')
}

/**
 * 용신 조정 테스트
 */
function testYongsinAdjustment() {
  console.log('🧪 테스트 3: 계절별 용신 조정\n')
  console.log('-'.repeat(60))

  const testCases: Array<{
    month: number
    original: Ohang[]
    seasonName: string
  }> = [
    { month: 3, original: ['목', '수'], seasonName: '봄' },
    { month: 5, original: ['화', '목'], seasonName: '여름' },
    { month: 9, original: ['금', '토'], seasonName: '가을' },
    { month: 12, original: ['수', '금'], seasonName: '겨울' },
  ]

  testCases.forEach(({ month, original, seasonName }) => {
    const adjustment = adjustYongsinBySeason(original, month)

    console.log(`\n${seasonName} (${month}월) 출생`)
    console.log(`  기존 용신: ${original.join(', ')}`)
    console.log(`  조정 용신: ${adjustment.adjustedYongsin.join(', ')}`)
    console.log(`  우선순위: ${adjustment.priority}`)
    console.log(`  조정 이유: ${adjustment.adjustmentReason}`)

    // 조정이 제대로 이루어졌는지 확인
    const hasPreferred = adjustment.adjustedYongsin.some((y) =>
      adjustment.season.preferredYongsin.includes(y)
    )
    const hasAvoided = adjustment.adjustedYongsin.some((y) =>
      adjustment.season.avoidedElements.includes(y)
    )

    if (hasPreferred) {
      console.log(`  ✅ 선호 오행 포함됨`)
    }
    if (hasAvoided) {
      console.log(`  ⚠️ 피해야 할 오행이 포함됨`)
    }
  })

  console.log('\n')
}

/**
 * 계절별 한자 점수 테스트
 */
function testSeasonalHanjaScore() {
  console.log('🧪 테스트 4: 계절별 한자 점수 배율\n')
  console.log('-'.repeat(60))

  const testCases = [
    { month: 5, hanja: '智', ohang: '화' as Ohang, name: '여름 + 화(火)' },
    { month: 5, hanja: '淵', ohang: '수' as Ohang, name: '여름 + 수(水)' },
    { month: 12, hanja: '陽', ohang: '화' as Ohang, name: '겨울 + 화(火)' },
    { month: 12, hanja: '寒', ohang: '수' as Ohang, name: '겨울 + 수(水)' },
  ]

  testCases.forEach(({ month, hanja, ohang, name }) => {
    const score = getSeasonalHanjaScore(hanja, ohang, month)
    const emoji = score > 1 ? '✅' : score < 1 ? '⚠️' : '➖'
    console.log(
      `${emoji} ${name}: ${hanja}(${ohang}) → ${score}배 (${score > 1 ? '가점' : score < 1 ? '감점' : '중립'})`
    )
  })

  console.log('\n')
}

/**
 * 계절 가이던스 테스트
 */
function testSeasonalGuidance() {
  console.log('🧪 테스트 5: 계절 가이던스 생성\n')
  console.log('-'.repeat(60))

  const months = [3, 6, 9, 12]

  months.forEach((month) => {
    const guidance = getSeasonalGuidance(month)
    console.log(`\n${month}월 가이던스:`)
    console.log(guidance)
  })

  console.log('\n')
}

/**
 * 계절별 추천 한자 특성 테스트
 */
function testSeasonalHanjaCharacteristics() {
  console.log('🧪 테스트 6: 계절별 추천 한자 특성\n')
  console.log('-'.repeat(60))

  const months = [3, 6, 9, 12]

  months.forEach((month) => {
    const characteristics = getSeasonalHanjaCharacteristics(month)
    const seasonName = ['', '', '', '봄', '', '', '여름', '', '', '가을', '', '', '겨울'][month]

    console.log(`\n${seasonName} (${month}월)`)
    console.log(`✅ 추천 한자:`)
    characteristics.recommended.forEach((rec) => {
      console.log(`   - ${rec}`)
    })
    console.log(`⚠️ 피할 한자:`)
    characteristics.avoid.forEach((avoid) => {
      console.log(`   - ${avoid}`)
    })
  })

  console.log('\n')
}

/**
 * 실전 시나리오 테스트
 */
function testRealWorldScenarios() {
  console.log('🧪 테스트 7: 실전 시나리오\n')
  console.log('-'.repeat(60))

  const scenarios = [
    {
      name: '여름 출생, 화 과다',
      month: 6,
      originalYongsin: ['화', '목'],
      expected: '수(水)로 조정되어야 함',
    },
    {
      name: '겨울 출생, 수 과다',
      month: 12,
      originalYongsin: ['수', '금'],
      expected: '화(火), 목(木)으로 조정되어야 함',
    },
    {
      name: '봄 출생, 목 과다',
      month: 3,
      originalYongsin: ['목', '수'],
      expected: '금(金), 토(土)로 조정되어야 함',
    },
    {
      name: '가을 출생, 금 과다',
      month: 9,
      originalYongsin: ['금', '토'],
      expected: '화(火)로 조정되어야 함',
    },
  ]

  scenarios.forEach(({ name, month, originalYongsin, expected }) => {
    const adjustment = adjustYongsinBySeason(originalYongsin, month)

    console.log(`\n📋 시나리오: ${name}`)
    console.log(`   기존 용신: ${originalYongsin.join(', ')}`)
    console.log(`   조정 용신: ${adjustment.adjustedYongsin.join(', ')}`)
    console.log(`   우선순위: ${adjustment.priority}`)
    console.log(`   기대 결과: ${expected}`)

    const seasonInfo = adjustment.season
    const hasCorrectElements = adjustment.adjustedYongsin.some((y) =>
      seasonInfo.preferredYongsin.includes(y)
    )

    if (hasCorrectElements && adjustment.priority === 'HIGH') {
      console.log(`   ✅ 조정이 올바르게 이루어짐`)
    } else if (hasCorrectElements) {
      console.log(`   ✅ 적절한 오행 포함`)
    } else {
      console.log(`   ⚠️ 검토 필요`)
    }
  })

  console.log('\n')
}

/**
 * 메인 테스트 실행
 */
async function main() {
  console.log('🌸 계절 조후 (調候) 시스템 테스트')
  console.log('='.repeat(60))
  console.log()

  try {
    testSeasonDetermination()
    testSeasonInfo()
    testYongsinAdjustment()
    testSeasonalHanjaScore()
    testSeasonalGuidance()
    testSeasonalHanjaCharacteristics()
    testRealWorldScenarios()

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

export { main as runJohooTests }
