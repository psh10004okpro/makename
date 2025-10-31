/**
 * 십성(十星) 분석 시스템 테스트
 *
 * 십성 계산 및 분석 기능을 테스트합니다.
 */

import {
  analyzeSipseong,
  calculateSipseong,
  SIPSEONG_MEANING,
  analyzeSipseongCombination,
} from './sipseong'
import type { Saju, Sipseong } from './types'
import { SIPSEONG_HANJA } from './types'
import { CHEONGAN_OHANG, JIJI_OHANG, CHEONGAN_EUMYANG, JIJI_EUMYANG } from './ohang'

/**
 * 십성 계산 기본 테스트
 */
function testBasicSipseongCalculation() {
  console.log('🧪 테스트 1: 십성 계산 기본 로직\n')
  console.log('-'.repeat(60))

  // 갑목일간 기준 테스트
  const ilgan = '갑' // 양목
  const ilganOhang = CHEONGAN_OHANG[ilgan]
  const ilganEumyang = CHEONGAN_EUMYANG[ilgan]

  const testCases: Array<{
    target: string
    targetType: '천간' | '지지'
    expected: Sipseong
    reason: string
  }> = [
    { target: '갑', targetType: '천간', expected: '비견', reason: '같은 오행, 같은 음양' },
    { target: '을', targetType: '천간', expected: '겁재', reason: '같은 오행, 다른 음양' },
    { target: '병', targetType: '천간', expected: '식신', reason: '내가 생하는 오행, 같은 음양' },
    { target: '정', targetType: '천간', expected: '상관', reason: '내가 생하는 오행, 다른 음양' },
    { target: '무', targetType: '천간', expected: '편재', reason: '내가 극하는 오행, 같은 음양' },
    { target: '기', targetType: '천간', expected: '정재', reason: '내가 극하는 오행, 다른 음양' },
    { target: '경', targetType: '천간', expected: '편관', reason: '나를 극하는 오행, 같은 음양' },
    { target: '신', targetType: '천간', expected: '정관', reason: '나를 극하는 오행, 다른 음양' },
    { target: '임', targetType: '천간', expected: '편인', reason: '나를 생하는 오행, 같은 음양' },
    { target: '계', targetType: '천간', expected: '정인', reason: '나를 생하는 오행, 다른 음양' },
  ]

  console.log(`일간: 갑(甲) - ${ilganOhang}, ${ilganEumyang}\n`)

  testCases.forEach(({ target, targetType, expected, reason }) => {
    const targetOhang = CHEONGAN_OHANG[target as keyof typeof CHEONGAN_OHANG]
    const targetEumyang = CHEONGAN_EUMYANG[target as keyof typeof CHEONGAN_EUMYANG]

    const result = calculateSipseong(
      ilgan,
      ilganEumyang,
      ilganOhang,
      target as any,
      targetEumyang,
      targetOhang
    )

    const pass = result === expected ? '✅' : '❌'
    console.log(`${pass} ${target}(${targetOhang}, ${targetEumyang}) → ${SIPSEONG_HANJA[result]} (기대: ${SIPSEONG_HANJA[expected]})`)
    console.log(`   이유: ${reason}`)
  })

  console.log()
}

/**
 * 실제 사주 분석 테스트
 */
function testRealSajuAnalysis() {
  console.log('🧪 테스트 2: 실제 사주 십성 분석\n')
  console.log('-'.repeat(60))

  // 예시 사주 1: 1990년 5월 15일 오시 생
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

  console.log('📅 예시 사주 1: 경오년 신사월 갑인일 경오시\n')

  const analysis1 = analyzeSipseong(saju1)

  console.log(`일간: ${analysis1.ilgan}(${analysis1.ilganOhang}, ${analysis1.ilganEumyang})`)
  console.log()

  console.log('사주 8글자의 십성:')
  console.log(`  년주: ${SIPSEONG_HANJA[analysis1.pillars.year.cheongan]}(${saju1.year.cheongan}) ${SIPSEONG_HANJA[analysis1.pillars.year.jiji]}(${saju1.year.jiji})`)
  console.log(`  월주: ${SIPSEONG_HANJA[analysis1.pillars.month.cheongan]}(${saju1.month.cheongan}) ${SIPSEONG_HANJA[analysis1.pillars.month.jiji]}(${saju1.month.jiji})`)
  console.log(`  일주: ${saju1.day.cheongan}(일간) ${SIPSEONG_HANJA[analysis1.pillars.day.jiji]}(${saju1.day.jiji})`)
  console.log(`  시주: ${SIPSEONG_HANJA[analysis1.pillars.hour.cheongan]}(${saju1.hour.cheongan}) ${SIPSEONG_HANJA[analysis1.pillars.hour.jiji]}(${saju1.hour.jiji})`)
  console.log()

  console.log('십성 분석 결과:')
  console.log(`  ${analysis1.description}`)
  console.log()

  if (analysis1.strong.length > 0) {
    console.log('  강한 십성:')
    analysis1.strong.forEach((s) => {
      console.log(`    - ${SIPSEONG_HANJA[s]}(${s}): ${analysis1.count[s]}개`)
    })
  }

  if (analysis1.missing.length > 0) {
    console.log('  결여된 십성:')
    analysis1.missing.forEach((s) => {
      console.log(`    - ${SIPSEONG_HANJA[s]}(${s})`)
    })
  }

  console.log()
  console.log('성격 특성:')
  analysis1.personality.forEach((p, i) => {
    console.log(`  ${i + 1}. ${p}`)
  })

  console.log()
  console.log('재능 및 적성:')
  analysis1.talents.forEach((t, i) => {
    console.log(`  ${i + 1}. ${t}`)
  })

  console.log()
  console.log('주의사항:')
  analysis1.warnings.forEach((w, i) => {
    console.log(`  ${i + 1}. ${w}`)
  })

  console.log('\n')
}

/**
 * 십성 개수 통계 테스트
 */
function testSipseongCount() {
  console.log('🧪 테스트 3: 십성 개수 통계\n')
  console.log('-'.repeat(60))

  // 다양한 사주 패턴 테스트
  const testSajus: Array<{
    name: string
    saju: Saju
    expectedPattern: string
  }> = [
    {
      name: '비겁 과다형',
      saju: {
        year: { cheongan: '갑', jiji: '인', name: '갑인', hanja: '甲寅' },
        month: { cheongan: '을', jiji: '묘', name: '을묘', hanja: '乙卯' },
        day: { cheongan: '갑', jiji: '자', name: '갑자', hanja: '甲子' },
        hour: { cheongan: '갑', jiji: '인', name: '갑인', hanja: '甲寅' },
        birthInfo: { date: new Date(), isLunar: false },
      },
      expectedPattern: '비견/겁재가 많음',
    },
    {
      name: '식상 과다형',
      saju: {
        year: { cheongan: '병', jiji: '오', name: '병오', hanja: '丙午' },
        month: { cheongan: '정', jiji: '사', name: '정사', hanja: '丁巳' },
        day: { cheongan: '갑', jiji: '오', name: '갑오', hanja: '甲午' },
        hour: { cheongan: '병', jiji: '사', name: '병사', hanja: '丙巳' },
        birthInfo: { date: new Date(), isLunar: false },
      },
      expectedPattern: '식신/상관이 많음',
    },
  ]

  testSajus.forEach(({ name, saju, expectedPattern }) => {
    console.log(`\n📋 ${name}`)
    console.log(`   ${saju.year.name} ${saju.month.name} ${saju.day.name} ${saju.hour.name}`)

    const analysis = analyzeSipseong(saju)

    console.log(`   ${analysis.description}`)
    console.log(`   예상 패턴: ${expectedPattern}`)

    // 카테고리별 합계 계산
    const bigeop = analysis.count.비견 + analysis.count.겁재
    const siksang = analysis.count.식신 + analysis.count.상관
    const jaeseong = analysis.count.편재 + analysis.count.정재
    const gwanseong = analysis.count.편관 + analysis.count.정관
    const inseong = analysis.count.편인 + analysis.count.정인

    console.log(`   비겁: ${bigeop}, 식상: ${siksang}, 재성: ${jaeseong}, 관성: ${gwanseong}, 인성: ${inseong}`)
  })

  console.log('\n')
}

/**
 * 십성 의미 설명 테스트
 */
function testSipseongMeanings() {
  console.log('🧪 테스트 4: 십성 의미 설명\n')
  console.log('-'.repeat(60))

  const categories = ['비겁', '식상', '재성', '관성', '인성'] as const

  categories.forEach((category) => {
    console.log(`\n📚 ${category.toUpperCase()} 계열`)

    Object.entries(SIPSEONG_MEANING).forEach(([key, info]) => {
      if (info.category === category) {
        console.log(`\n  ${info.hanja}(${info.name})`)
        console.log(`    긍정: ${info.positive.join(', ')}`)
        console.log(`    부정: ${info.negative.join(', ')}`)
        console.log(`    키워드: ${info.keywords.join(', ')}`)
      }
    })
  })

  console.log('\n')
}

/**
 * 특수 격국 판단 테스트
 */
function testSpecialPatterns() {
  console.log('🧪 테스트 5: 특수 격국 판단\n')
  console.log('-'.repeat(60))

  // 종재격 예시
  const jongjaeSaju: Saju = {
    year: { cheongan: '무', jiji: '진', name: '무진', hanja: '戊辰' },
    month: { cheongan: '기', jiji: '축', name: '기축', hanja: '己丑' },
    day: { cheongan: '갑', jiji: '술', name: '갑술', hanja: '甲戌' },
    hour: { cheongan: '무', jiji: '미', name: '무미', hanja: '戊未' },
    birthInfo: { date: new Date(), isLunar: false },
  }

  console.log('📋 종재격 가능성 테스트')
  console.log(`   사주: ${jongjaeSaju.year.name} ${jongjaeSaju.month.name} ${jongjaeSaju.day.name} ${jongjaeSaju.hour.name}`)

  const analysis = analyzeSipseong(jongjaeSaju)
  const pattern = analyzeSipseongCombination(analysis)

  if (pattern) {
    console.log(`   ✅ 특수 격국: ${pattern.type}`)
    console.log(`   설명: ${pattern.description}`)
  } else {
    console.log(`   일반 격국`)
  }

  console.log()
  console.log(`   재성 개수: ${analysis.count.편재 + analysis.count.정재}`)
  console.log(`   비겁 개수: ${analysis.count.비견 + analysis.count.겁재}`)

  console.log('\n')
}

/**
 * 성별에 따른 십성 해석 차이 테스트
 */
function testGenderDifferences() {
  console.log('🧪 테스트 6: 십성의 성별별 의미\n')
  console.log('-'.repeat(60))

  console.log('\n📘 남자 사주의 십성 의미:')
  console.log('  - 재성(財星): 아내, 재물, 이성')
  console.log('  - 관성(官星): 자식(아들), 명예, 직장')
  console.log('  - 식상(食傷): 재능, 표현, 자유')
  console.log('  - 인성(印星): 어머니, 학문, 명예')
  console.log('  - 비겁(比劫): 형제, 친구, 동업자')

  console.log('\n📙 여자 사주의 십성 의미:')
  console.log('  - 관성(官星): 남편, 명예, 직장')
  console.log('  - 재성(財星): 시부모, 재물, 활동력')
  console.log('  - 식상(食傷): 자식(딸), 재능, 표현')
  console.log('  - 인성(印星): 어머니, 학문, 안정')
  console.log('  - 비겁(比劫): 자매, 친구, 경쟁자')

  console.log('\n💡 작명 시 고려사항:')
  console.log('  - 남자: 재성과 관성의 균형이 중요 (재물과 명예)')
  console.log('  - 여자: 관성과 식상의 균형이 중요 (남편과 자식)')
  console.log('  - 공통: 비겁 과다는 독립심은 강하나 협력이 어려울 수 있음')

  console.log('\n')
}

/**
 * 메인 테스트 실행
 */
async function main() {
  console.log('⭐ 십성(十星) 분석 시스템 테스트')
  console.log('='.repeat(60))
  console.log()

  try {
    testBasicSipseongCalculation()
    testRealSajuAnalysis()
    testSipseongCount()
    testSipseongMeanings()
    testSpecialPatterns()
    testGenderDifferences()

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

export { main as runSipseongTests }
