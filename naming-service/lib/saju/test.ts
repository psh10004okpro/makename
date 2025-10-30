/**
 * 사주팔자 계산 엔진 테스트
 *
 * 다양한 생년월일로 사주 계산을 테스트합니다.
 */

import {
  calculateSaju,
  analyzeOhangBalance,
  evaluateNameCompatibility,
  generateNamingRecommendation,
  formatSaju,
  getSajuInfo,
  solarToLunar,
  lunarToSolar,
} from './index'

console.log('='.repeat(80))
console.log('사주팔자 계산 엔진 테스트')
console.log('='.repeat(80))

// ============================================================================
// 테스트 1: 사주 계산
// ============================================================================

console.log('\n【테스트 1】 사주 계산 - 1990년 1월 15일 오후 2시 30분')
console.log('-'.repeat(80))

const birthDate1 = new Date(1990, 0, 15) // 1990년 1월 15일
const saju1 = calculateSaju(birthDate1, { time: '14:30', isLunar: false })

console.log('생년월일시:', birthDate1.toLocaleDateString('ko-KR'))
console.log('\n사주팔자:')
console.log('  년주:', saju1.year.name, `(${saju1.year.hanja})`)
console.log('  월주:', saju1.month.name, `(${saju1.month.hanja})`)
console.log('  일주:', saju1.day.name, `(${saju1.day.hanja})`)
console.log('  시주:', saju1.hour.name, `(${saju1.hour.hanja})`)
console.log('\n사주 문자열:', formatSaju(saju1))
console.log('사주 한자:', formatSaju(saju1, true))

const info1 = getSajuInfo(saju1)
console.log('\n상세 정보:')
console.log('  띠:', info1.yearAnimal)
console.log('  일간:', info1.ilgan, `(${info1.ilganOhang})`)

// ============================================================================
// 테스트 2: 오행 분석
// ============================================================================

console.log('\n【테스트 2】 오행 분석')
console.log('-'.repeat(80))

const analysis1 = analyzeOhangBalance(saju1)

console.log('오행 개수:')
console.log('  목:', analysis1.count.목)
console.log('  화:', analysis1.count.화)
console.log('  토:', analysis1.count.토)
console.log('  금:', analysis1.count.금)
console.log('  수:', analysis1.count.수)

console.log('\n오행 분석:')
console.log('  강한 오행:', analysis1.strong.join(', ') || '없음')
console.log('  약한 오행:', analysis1.weak.join(', ') || '없음')
console.log('  없는 오행:', analysis1.missing.join(', ') || '없음')
console.log('  용신(필요한 오행):', analysis1.yongsin.join(', '))
console.log('  기신(피해야 할 오행):', analysis1.gisin.join(', ') || '없음')
console.log('  사주 강약:', analysis1.strength)

console.log('\n분석 설명:')
console.log('  ', analysis1.description)

// ============================================================================
// 테스트 3: 이름 궁합 평가
// ============================================================================

console.log('\n【테스트 3】 이름 궁합 평가')
console.log('-'.repeat(80))

const testNames = [
  { name: '화 오행 이름', ohang: '화' as const, strokes: 15 },
  { name: '목 오행 이름', ohang: '목' as const, strokes: 23 },
  { name: '토 오행 이름', ohang: '토' as const, strokes: 8 },
]

testNames.forEach((testName) => {
  const score = evaluateNameCompatibility(saju1, testName.ohang, testName.strokes)

  console.log(`\n${testName.name} (${testName.ohang}, ${testName.strokes}획):`)
  console.log('  총점:', score.total, `(${score.grade})`)
  console.log('  오행 조화:', score.ohangHarmony)
  console.log('  음양 균형:', score.eumyangBalance)
  console.log('  획수 점수:', score.strokeScore)
  console.log('  상세 평가:')
  score.details.forEach((detail) => {
    console.log('    -', detail)
  })
})

// ============================================================================
// 테스트 4: 작명 추천
// ============================================================================

console.log('\n【테스트 4】 작명 추천')
console.log('-'.repeat(80))

const recommendation1 = generateNamingRecommendation(saju1)

console.log('추천 오행:', recommendation1.recommendedOhang.join(', '))
console.log('피해야 할 오행:', recommendation1.avoidOhang.join(', ') || '없음')
console.log('추천 획수:', recommendation1.recommendedStrokes?.slice(0, 10).join(', '), '...')
console.log('\n추천 이유:')
console.log('  ', recommendation1.reason)

// ============================================================================
// 테스트 5: 음력/양력 변환
// ============================================================================

console.log('\n【테스트 5】 음력/양력 변환')
console.log('-'.repeat(80))

const solarDate = new Date(1990, 0, 15)
const lunarInfo = solarToLunar(solarDate)

console.log('양력:', solarDate.toLocaleDateString('ko-KR'))
console.log('음력:', `${lunarInfo.year}년 ${lunarInfo.month}월 ${lunarInfo.day}일`, lunarInfo.isLeapMonth ? '(윤달)' : '')

const convertedSolar = lunarToSolar(lunarInfo.year, lunarInfo.month, lunarInfo.day, lunarInfo.isLeapMonth)
console.log('다시 양력으로:', convertedSolar.toLocaleDateString('ko-KR'))

// ============================================================================
// 테스트 6: 다양한 생년월일 테스트
// ============================================================================

console.log('\n【테스트 6】 다양한 생년월일로 사주 계산')
console.log('-'.repeat(80))

const testDates = [
  { date: new Date(2000, 0, 1), desc: '2000년 1월 1일' },
  { date: new Date(1985, 5, 15), desc: '1985년 6월 15일' },
  { date: new Date(2024, 1, 10), desc: '2024년 2월 10일 (입춘 전후)' },
]

testDates.forEach((test) => {
  const saju = calculateSaju(test.date, { time: '12:00' })
  const analysis = analyzeOhangBalance(saju)

  console.log(`\n${test.desc}:`)
  console.log('  사주:', formatSaju(saju))
  console.log('  용신:', analysis.yongsin.join(', '))
})

console.log('\n' + '='.repeat(80))
console.log('테스트 완료!')
console.log('='.repeat(80))
