/**
 * 신살/육친 분석 시스템 테스트
 */

import { analyzeSinsal } from './sinsal'
import { analyzeYukchin } from './yukchin'
import type { Saju } from './types'

/**
 * 신살 분석 테스트
 */
function testSinsalAnalysis() {
  console.log('🧪 신살(神殺) 분석 테스트\n')
  console.log('='.repeat(60))

  const testSaju: Saju = {
    year: { cheongan: '경', jiji: '오', name: '경오', hanja: '庚午' },
    month: { cheongan: '신', jiji: '사', name: '신사', hanja: '辛巳' },
    day: { cheongan: '갑', jiji: '인', name: '갑인', hanja: '甲寅' },
    hour: { cheongan: '경', jiji: '오', name: '경오', hanja: '庚午' },
    birthInfo: { date: new Date('1990-05-15'), isLunar: false },
  }

  console.log('\n📅 사주: 경오년 신사월 갑인일 경오시\n')

  const result = analyzeSinsal(testSaju)

  console.log(`✨ 출현 신살: ${result.sinsals.length}개\n`)

  if (result.sinsals.length > 0) {
    result.sinsals.forEach((sinsal, index) => {
      console.log(`${index + 1}. ${sinsal.hanja}(${sinsal.name})`)
      console.log(`   위치: ${sinsal.location.join(', ')}`)
      console.log(`   의미: ${sinsal.meaning}`)
      if (sinsal.positive.length > 0) {
        console.log(`   긍정: ${sinsal.positive.join(', ')}`)
      }
      if (sinsal.negative.length > 0) {
        console.log(`   부정: ${sinsal.negative.join(', ')}`)
      }
      console.log(`   작명: ${sinsal.namingGuide}`)
      console.log()
    })
  }

  console.log(`✅ 좋은 신살: ${result.goodSinsals.length}개`)
  if (result.goodSinsals.length > 0) {
    result.goodSinsals.forEach((s) => console.log(`   - ${s.name}`))
  }
  console.log()

  console.log(`⚠️ 나쁜 신살: ${result.badSinsals.length}개`)
  if (result.badSinsals.length > 0) {
    result.badSinsals.forEach((s) => console.log(`   - ${s}`))
  }
  console.log()

  console.log(`💼 직업 적성 (${result.careerRecommendations.length}개):`)
  if (result.careerRecommendations.length > 0) {
    console.log(`   ${result.careerRecommendations.join(', ')}`)
  }
  console.log()

  console.log(`🎯 성격 특성 (${result.personality.length}개):`)
  if (result.personality.length > 0) {
    result.personality.slice(0, 5).forEach((p) => console.log(`   - ${p}`))
  }
  console.log()

  console.log(`📝 작명 가이드 (${result.namingRecommendations.length}개):`)
  if (result.namingRecommendations.length > 0) {
    result.namingRecommendations.forEach((r, i) => console.log(`   ${i + 1}. ${r}`))
  }
  console.log()
}

/**
 * 육친 분석 테스트
 */
function testYukchinAnalysis() {
  console.log('\n🧪 육친(六親) 분석 테스트\n')
  console.log('='.repeat(60))

  const testSaju: Saju = {
    year: { cheongan: '경', jiji: '오', name: '경오', hanja: '庚午' },
    month: { cheongan: '신', jiji: '사', name: '신사', hanja: '辛巳' },
    day: { cheongan: '갑', jiji: '인', name: '갑인', hanja: '甲寅' },
    hour: { cheongan: '경', jiji: '오', name: '경오', hanja: '庚午' },
    birthInfo: { date: new Date('1990-05-15'), isLunar: false },
  }

  console.log('\n📅 사주: 경오년 신사월 갑인일 경오시')
  console.log('성별: 여자\n')

  const result = analyzeYukchin(testSaju, 'FEMALE')

  console.log('👨‍👩‍👧 부모운')
  console.log(`   운세: ${result.parents.luck}`)
  console.log(`   십성: ${result.parents.sipseong.join(', ')} (${result.parents.count}개)`)
  console.log(`   설명: ${result.parents.description}`)
  console.log(`   추천: ${result.parents.recommendations.join(' / ')}`)
  console.log()

  console.log('👫 형제자매운')
  console.log(`   운세: ${result.siblings.luck}`)
  console.log(`   십성: ${result.siblings.sipseong.join(', ')} (${result.siblings.count}개)`)
  console.log(`   설명: ${result.siblings.description}`)
  console.log(`   추천: ${result.siblings.recommendations.join(' / ')}`)
  console.log()

  console.log('👶 자녀운')
  console.log(`   운세: ${result.children.luck}`)
  console.log(`   십성: ${result.children.sipseong.join(', ')} (${result.children.count}개)`)
  console.log(`   설명: ${result.children.description}`)
  console.log(`   추천: ${result.children.recommendations.join(' / ')}`)
  console.log()

  console.log('💑 배우자운')
  console.log(`   운세: ${result.spouse.luck}`)
  console.log(`   십성: ${result.spouse.sipseong.join(', ')} (${result.spouse.count}개)`)
  console.log(`   설명: ${result.spouse.description}`)
  console.log(`   추천: ${result.spouse.recommendations.join(' / ')}`)
  console.log()

  console.log('💰 재물운')
  console.log(`   운세: ${result.wealth.luck}`)
  console.log(`   십성: ${result.wealth.sipseong.join(', ')} (${result.wealth.count}개)`)
  console.log(`   설명: ${result.wealth.description}`)
  console.log(`   추천: ${result.wealth.recommendations.join(' / ')}`)
  console.log()

  console.log('📊 종합 평가')
  console.log(`   강한 영역: ${result.overall.strongAreas.join(', ') || '없음'}`)
  console.log(`   약한 영역: ${result.overall.weakAreas.join(', ') || '없음'}`)
  console.log(`   작명 가이드: ${result.overall.namingGuide}`)
  console.log()
}

/**
 * 메인 테스트 실행
 */
async function main() {
  console.log('🏛️ 신살/육친 분석 시스템 테스트')
  console.log('='.repeat(60))

  try {
    testSinsalAnalysis()
    testYukchinAnalysis()

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

export { main as runSinsalYukchinTests }
