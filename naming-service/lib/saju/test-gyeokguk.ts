/**
 * 격국(格局) 분석 시스템 테스트
 *
 * 격국 판단 및 분석 기능을 테스트합니다.
 */

import { analyzeGyeokguk } from './gyeokguk'
import { analyzeSipseong } from './sipseong'
import type { Saju } from './types'

/**
 * 정격 판단 테스트
 */
function testJeongGyeokguk() {
  console.log('🧪 테스트 1: 정격(正格) 판단\n')
  console.log('-'.repeat(60))

  // 정관격 테스트 (월지 십성이 정관)
  const jeongGwanSaju: Saju = {
    year: {
      cheongan: '갑',
      jiji: '인',
      name: '갑인',
      hanja: '甲寅',
    },
    month: {
      cheongan: '신',
      jiji: '유',
      name: '신유',
      hanja: '辛酉',
    },
    day: {
      cheongan: '갑',
      jiji: '자',
      name: '갑자',
      hanja: '甲子',
    },
    hour: {
      cheongan: '병',
      jiji: '인',
      name: '병인',
      hanja: '丙寅',
    },
    birthInfo: {
      date: new Date('1990-10-15'),
      isLunar: false,
    },
  }

  console.log('📅 사주: 갑인년 신유월 갑자일 병인시')
  const result1 = analyzeGyeokguk(jeongGwanSaju)
  console.log(`격국: ${result1.gyeokguk}`)
  console.log(`분류: ${result1.category}`)
  console.log(`강도: ${result1.strength}`)
  console.log(`설명: ${result1.description}`)
  console.log()

  // 편재격 테스트 (월지 십성이 편재)
  const pyeonjaeSaju: Saju = {
    year: {
      cheongan: '을',
      jiji: '축',
      name: '을축',
      hanja: '乙丑',
    },
    month: {
      cheongan: '무',
      jiji: '진',
      name: '무진',
      hanja: '戊辰',
    },
    day: {
      cheongan: '갑',
      jiji: '술',
      name: '갑술',
      hanja: '甲戌',
    },
    hour: {
      cheongan: '기',
      jiji: '사',
      name: '기사',
      hanja: '己巳',
    },
    birthInfo: {
      date: new Date('1985-04-15'),
      isLunar: false,
    },
  }

  console.log('📅 사주: 을축년 무진월 갑술일 기사시')
  const result2 = analyzeGyeokguk(pyeonjaeSaju)
  console.log(`격국: ${result2.gyeokguk}`)
  console.log(`분류: ${result2.category}`)
  console.log(`용신: ${result2.yongsin.join(', ')}`)
  console.log(`희신: ${result2.heesin.join(', ')}`)
  console.log(`기신: ${result2.gisin.join(', ')}`)
  console.log()

  console.log('\n')
}

/**
 * 외격(종격) 판단 테스트
 */
function testOeGyeokguk() {
  console.log('🧪 테스트 2: 외격(外格) - 종격 판단\n')
  console.log('-'.repeat(60))

  // 종재격 테스트 (재성 5개 이상, 비겁 1개 이하)
  const jongjaeSaju: Saju = {
    year: {
      cheongan: '무',
      jiji: '진',
      name: '무진',
      hanja: '戊辰',
    },
    month: {
      cheongan: '기',
      jiji: '축',
      name: '기축',
      hanja: '己丑',
    },
    day: {
      cheongan: '갑',
      jiji: '진',
      name: '갑진',
      hanja: '甲辰',
    },
    hour: {
      cheongan: '무',
      jiji: '술',
      name: '무술',
      hanja: '戊戌',
    },
    birthInfo: {
      date: new Date('1988-01-20'),
      isLunar: false,
    },
  }

  console.log('📅 사주: 무진년 기축월 갑진일 무술시')
  console.log('(재성 5개, 비겁 1개 → 종재격 가능성)')
  const result = analyzeGyeokguk(jongjaeSaju)
  console.log()
  console.log(`격국: ${result.gyeokguk}`)
  console.log(`분류: ${result.category}`)
  console.log(`강도: ${result.strength}`)
  console.log(`설명: ${result.description}`)
  console.log()

  if (result.characteristics.length > 0) {
    console.log('성격 특성:')
    result.characteristics.forEach((char, i) => {
      console.log(`  ${i + 1}. ${char}`)
    })
  }
  console.log()

  console.log('\n')
}

/**
 * 격국 강도 분석 테스트
 */
function testGyeokgukStrength() {
  console.log('🧪 테스트 3: 격국 강도 분석\n')
  console.log('-'.repeat(60))

  const testCases: Array<{
    name: string
    saju: Saju
  }> = [
    {
      name: '강한 정관격',
      saju: {
        year: { cheongan: '갑', jiji: '인', name: '갑인', hanja: '甲寅' },
        month: { cheongan: '신', jiji: '유', name: '신유', hanja: '辛酉' },
        day: { cheongan: '갑', jiji: '자', name: '갑자', hanja: '甲子' },
        hour: { cheongan: '계', jiji: '해', name: '계해', hanja: '癸亥' },
        birthInfo: { date: new Date('1990-10-15'), isLunar: false },
      },
    },
    {
      name: '약한 식신격',
      saju: {
        year: { cheongan: '경', jiji: '오', name: '경오', hanja: '庚午' },
        month: { cheongan: '병', jiji: '오', name: '병오', hanja: '丙午' },
        day: { cheongan: '갑', jiji: '인', name: '갑인', hanja: '甲寅' },
        hour: { cheongan: '경', jiji: '오', name: '경오', hanja: '庚午' },
        birthInfo: { date: new Date('1990-06-15'), isLunar: false },
      },
    },
  ]

  testCases.forEach(({ name, saju }) => {
    console.log(`📊 ${name}`)
    const result = analyzeGyeokguk(saju)
    console.log(`   격국: ${result.gyeokguk}`)
    console.log(`   강도: ${result.strength}`)
    console.log(`   재물운: ${result.wealthLuck}`)
    console.log(`   명예운: ${result.fameLuck}`)
    console.log(`   학업운: ${result.academicLuck}`)
    console.log()
  })

  console.log('\n')
}

/**
 * 용신/희신/기신 도출 테스트
 */
function testYongsinDerivation() {
  console.log('🧪 테스트 4: 용신/희신/기신 도출\n')
  console.log('-'.repeat(60))

  const saju: Saju = {
    year: {
      cheongan: '갑',
      jiji: '인',
      name: '갑인',
      hanja: '甲寅',
    },
    month: {
      cheongan: '신',
      jiji: '유',
      name: '신유',
      hanja: '辛酉',
    },
    day: {
      cheongan: '갑',
      jiji: '자',
      name: '갑자',
      hanja: '甲子',
    },
    hour: {
      cheongan: '계',
      jiji: '해',
      name: '계해',
      hanja: '癸亥',
    },
    birthInfo: {
      date: new Date('1990-10-15'),
      isLunar: false,
    },
  }

  console.log('📅 사주: 갑인년 신유월 갑자일 계해시\n')

  const result = analyzeGyeokguk(saju)

  console.log(`격국: ${result.gyeokguk} (${result.category})`)
  console.log()

  console.log('✅ 용신 (가장 필요한 십성):')
  result.yongsin.forEach((y, i) => {
    console.log(`   ${i + 1}. ${y}`)
  })
  console.log()

  console.log('✨ 희신 (도움되는 십성):')
  result.heesin.forEach((h, i) => {
    console.log(`   ${i + 1}. ${h}`)
  })
  console.log()

  console.log('⚠️ 기신 (해로운 십성):')
  result.gisin.forEach((g, i) => {
    console.log(`   ${i + 1}. ${g}`)
  })
  console.log()

  console.log('\n')
}

/**
 * 격국 특성 분석 테스트
 */
function testGyeokgukCharacteristics() {
  console.log('🧪 테스트 5: 격국 특성 분석\n')
  console.log('-'.repeat(60))

  const saju: Saju = {
    year: {
      cheongan: '을',
      jiji: '축',
      name: '을축',
      hanja: '乙丑',
    },
    month: {
      cheongan: '무',
      jiji: '진',
      name: '무진',
      hanja: '戊辰',
    },
    day: {
      cheongan: '갑',
      jiji: '술',
      name: '갑술',
      hanja: '甲戌',
    },
    hour: {
      cheongan: '기',
      jiji: '사',
      name: '기사',
      hanja: '己巳',
    },
    birthInfo: {
      date: new Date('1985-04-15'),
      isLunar: false,
    },
  }

  console.log('📅 사주: 을축년 무진월 갑술일 기사시\n')

  const result = analyzeGyeokguk(saju)

  console.log(`격국: ${result.gyeokguk}`)
  console.log(`설명: ${result.description}`)
  console.log()

  if (result.characteristics.length > 0) {
    console.log('🎯 성격 특성:')
    result.characteristics.forEach((char, i) => {
      console.log(`   ${i + 1}. ${char}`)
    })
    console.log()
  }

  if (result.careerSuitability.length > 0) {
    console.log('💼 직업 적성:')
    console.log(`   ${result.careerSuitability.join(', ')}`)
    console.log()
  }

  console.log('📊 운세 평가:')
  console.log(`   재물운: ${result.wealthLuck}`)
  console.log(`   명예운: ${result.fameLuck}`)
  console.log(`   학업운: ${result.academicLuck}`)
  console.log()

  if (result.warnings.length > 0) {
    console.log('⚠️ 주의사항:')
    result.warnings.forEach((warning, i) => {
      console.log(`   ${i + 1}. ${warning}`)
    })
  }

  console.log('\n')
}

/**
 * 실제 사주 격국 판단 테스트
 */
function testRealSajuGyeokguk() {
  console.log('🧪 테스트 6: 실제 사주 격국 판단\n')
  console.log('-'.repeat(60))

  const testCases: Array<{
    name: string
    saju: Saju
    expectedCategory: '정격' | '외격' | '기타'
  }> = [
    {
      name: '1990년생 남자',
      expectedCategory: '정격',
      saju: {
        year: { cheongan: '경', jiji: '오', name: '경오', hanja: '庚午' },
        month: { cheongan: '신', jiji: '사', name: '신사', hanja: '辛巳' },
        day: { cheongan: '갑', jiji: '인', name: '갑인', hanja: '甲寅' },
        hour: { cheongan: '경', jiji: '오', name: '경오', hanja: '庚午' },
        birthInfo: { date: new Date('1990-05-15'), isLunar: false },
      },
    },
    {
      name: '1985년생 여자',
      expectedCategory: '정격',
      saju: {
        year: { cheongan: '을', jiji: '축', name: '을축', hanja: '乙丑' },
        month: { cheongan: '기', jiji: '묘', name: '기묘', hanja: '己卯' },
        day: { cheongan: '무', jiji: '진', name: '무진', hanja: '戊辰' },
        hour: { cheongan: '병', jiji: '진', name: '병진', hanja: '丙辰' },
        birthInfo: { date: new Date('1985-03-20'), isLunar: false },
      },
    },
    {
      name: '1974년생 남자',
      expectedCategory: '정격',
      saju: {
        year: { cheongan: '갑', jiji: '인', name: '갑인', hanja: '甲寅' },
        month: { cheongan: '병', jiji: '인', name: '병인', hanja: '丙寅' },
        day: { cheongan: '무', jiji: '진', name: '무진', hanja: '戊辰' },
        hour: { cheongan: '경', jiji: '신', name: '경신', hanja: '庚申' },
        birthInfo: { date: new Date('1974-02-15'), isLunar: false },
      },
    },
  ]

  testCases.forEach(({ name, saju, expectedCategory }, index) => {
    console.log(`${index + 1}. ${name}`)
    console.log(
      `   사주: ${saju.year.name} ${saju.month.name} ${saju.day.name} ${saju.hour.name}`
    )

    const result = analyzeGyeokguk(saju)

    console.log(`   격국: ${result.gyeokguk}`)
    console.log(`   분류: ${result.category}`)
    console.log(`   강도: ${result.strength}`)

    const categoryMatch = result.category === expectedCategory ? '✅' : '❌'
    console.log(`   예상 분류: ${expectedCategory} ${categoryMatch}`)
    console.log()

    // 간단한 요약
    console.log(`   용신: ${result.yongsin.join(', ')}`)
    console.log(`   재물운: ${result.wealthLuck}, 명예운: ${result.fameLuck}`)
    console.log()
  })

  console.log('\n')
}

/**
 * 8가지 정격 전체 테스트
 */
function testAllJeongGyeokguk() {
  console.log('🧪 테스트 7: 8가지 정격 전체\n')
  console.log('-'.repeat(60))

  const jeongGyeokList = [
    '정관격',
    '편관격',
    '정재격',
    '편재격',
    '식신격',
    '상관격',
    '정인격',
    '편인격',
  ]

  console.log('📋 정격(正格) 8가지:\n')
  jeongGyeokList.forEach((gyeok, i) => {
    console.log(`   ${i + 1}. ${gyeok}`)
  })

  console.log()
  console.log('💡 정격은 월지 십성을 기준으로 판단합니다.')
  console.log('   (월지가 비견/겁재인 경우 정격 불성립)')

  console.log('\n')
}

/**
 * 격국 판단 우선순위 테스트
 */
function testGyeokgukPriority() {
  console.log('🧪 테스트 8: 격국 판단 우선순위\n')
  console.log('-'.repeat(60))

  console.log('📐 격국 판단 우선순위:')
  console.log()
  console.log('1️⃣ 외격(종격) 우선 판단')
  console.log('   - 종재격: 재성 5개 이상, 비겁 1개 이하')
  console.log('   - 종살격: 관살 5개 이상, 비겁 1개 이하')
  console.log('   - 종아격: 식상 5개 이상, 비겁 1개 이하')
  console.log('   - 종왕격: 비겁 6개 이상')
  console.log('   - 종강격: 인성 5개 이상, 비겁 1개 이하')
  console.log('   - 기타 특수격')
  console.log()
  console.log('2️⃣ 외격 불성립 시 정격 판단')
  console.log('   - 월지 십성 기준으로 8가지 정격 판단')
  console.log('   - 월지가 비견/겁재면 정격 불성립')
  console.log()
  console.log('3️⃣ 정격도 불성립 시')
  console.log('   - "기타 격국"으로 분류')
  console.log('   - 일반 십성 분석에 따라 용신 결정')

  console.log('\n')
}

/**
 * 메인 테스트 실행
 */
async function main() {
  console.log('🏛️ 격국(格局) 분석 시스템 테스트')
  console.log('='.repeat(60))
  console.log()

  try {
    testJeongGyeokguk()
    testOeGyeokguk()
    testGyeokgukStrength()
    testYongsinDerivation()
    testGyeokgukCharacteristics()
    testRealSajuGyeokguk()
    testAllJeongGyeokguk()
    testGyeokgukPriority()

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

export { main as runGyeokgukTests }
