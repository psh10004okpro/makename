/**
 * 작명 방법(method) 테스트
 *
 * TRADITIONAL, MODERN, HYBRID 각 방법에 따라
 * 프롬프트가 어떻게 달라지는지 테스트합니다.
 */

import { createFullPrompt, createTestPrompt } from './prompts'
import { NamingRequest } from './types'

/**
 * 작명 방법별 프롬프트 생성 및 출력
 */
function testNamingMethods() {
  console.log('🧪 작명 방법(Method) 테스트\n')
  console.log('='.repeat(80))

  const baseRequest: NamingRequest = {
    familyName: '김',
    gender: 'FEMALE',
    birthDate: new Date('2023-05-15'),
    method: 'HYBRID', // 기본값
    preferences: {
      meaningKeywords: ['지혜', '사랑', '평화'],
      preferredLength: 2,
    },
    sajuAnalysis: {
      year: '계묘년',
      month: '정사월',
      day: '경진일',
      hour: '병오시',
      weakElements: ['목'],
      strongElements: ['화'],
      missingElements: [],
      yongsin: ['목', '수'],
      gisin: ['화'],
    },
  }

  const methods = ['TRADITIONAL', 'MODERN', 'HYBRID'] as const

  methods.forEach((method, index) => {
    console.log(`\n${index + 1}. ${getMethodEmoji(method)} ${getMethodName(method)} 작명\n`)
    console.log('-'.repeat(80))

    const request = { ...baseRequest, method }
    const context = { request, currentDate: new Date() }
    const prompt = createFullPrompt(context)

    // 시스템 프롬프트 중 method 관련 부분만 출력
    const methodSection = extractMethodSection(prompt.system, method)

    console.log('📋 적용된 가이드라인:\n')
    console.log(methodSection)
    console.log('\n' + '='.repeat(80))
  })

  console.log('\n✅ 작명 방법별 프롬프트 생성 테스트 완료!\n')
  console.log('💡 각 방법의 차이점:\n')
  console.log('  🏛️  TRADITIONAL: 사주/오행/획수 중심 (전통 90%, 발음 10%)')
  console.log('  🌟 MODERN: 발음/의미/현대성 중심 (현대 85%, 사주 10%)')
  console.log('  ⚖️  HYBRID: 전통과 현대의 균형 (전통 35%, 현대 35%, 조화 30%)')
  console.log()
}

/**
 * 프롬프트에서 method 관련 섹션만 추출
 */
function extractMethodSection(systemPrompt: string, method: string): string {
  const methodMarkers: Record<string, string> = {
    TRADITIONAL: '🏛️ 전통 작명 방식',
    MODERN: '🌟 현대 작명 방식',
    HYBRID: '⚖️ 혼합 작명 방식',
  }

  const marker = methodMarkers[method]
  const startIndex = systemPrompt.indexOf(marker)

  if (startIndex === -1) {
    return '(Method 가이드라인을 찾을 수 없습니다)'
  }

  // 다음 ## 또는 --- 까지 추출
  let endIndex = systemPrompt.indexOf('\n---', startIndex)
  if (endIndex === -1) {
    endIndex = systemPrompt.length
  }

  return systemPrompt.substring(startIndex, endIndex).trim()
}

/**
 * Method 이름 가져오기
 */
function getMethodName(method: string): string {
  const names: Record<string, string> = {
    TRADITIONAL: '전통 작명',
    MODERN: '현대 작명',
    HYBRID: '혼합 작명',
  }
  return names[method] || method
}

/**
 * Method 이모지 가져오기
 */
function getMethodEmoji(method: string): string {
  const emojis: Record<string, string> = {
    TRADITIONAL: '🏛️',
    MODERN: '🌟',
    HYBRID: '⚖️',
  }
  return emojis[method] || '📝'
}

/**
 * 비교 테스트 - 같은 요청에 대한 3가지 방법 비교
 */
function compareMethodPrompts() {
  console.log('\n\n📊 작명 방법 비교 분석\n')
  console.log('='.repeat(80))

  const request: NamingRequest = {
    familyName: '박',
    gender: 'MALE',
    birthDate: new Date('2024-03-20'),
    method: 'HYBRID',
    preferences: {
      meaningKeywords: ['용기', '희망'],
    },
    sajuAnalysis: {
      year: '갑진년',
      month: '정묘월',
      day: '무인일',
      hour: '계축시',
      weakElements: ['금', '수'],
      strongElements: ['목'],
      missingElements: ['금'],
      yongsin: ['금', '수'],
      gisin: ['목'],
    },
  }

  console.log('📝 공통 요청 정보:')
  console.log(`  성씨: ${request.familyName}`)
  console.log(`  성별: ${request.gender}`)
  console.log(`  선호 의미: ${request.preferences?.meaningKeywords?.join(', ')}`)
  console.log(`  용신: ${request.sajuAnalysis?.yongsin?.join(', ')}`)
  console.log(`  기신: ${request.sajuAnalysis?.gisin?.join(', ')}`)
  console.log()

  const methods = ['TRADITIONAL', 'MODERN', 'HYBRID'] as const

  console.log('┌' + '─'.repeat(78) + '┐')
  console.log('│ ' + ' '.repeat(25) + '방법별 우선순위 비교' + ' '.repeat(26) + '│')
  console.log('├' + '─'.repeat(78) + '┤')

  // 표 헤더
  console.log(
    '│ 우선순위      │ TRADITIONAL (전통)  │ MODERN (현대)       │ HYBRID (혼합)       │'
  )
  console.log('├' + '─'.repeat(78) + '┤')

  // 항목별 비교
  const items = [
    { name: '사주 오행', trad: '40% (1순위)', modern: '10% (4순위)', hybrid: '35% (2순위)' },
    { name: '획수 길흉', trad: '30% (2순위)', modern: '- (참고)', hybrid: '30% 일부' },
    { name: '발음', trad: '10% (4순위)', modern: '40% (1순위)', hybrid: '35% (1순위)' },
    { name: '의미', trad: '10% (4순위)', modern: '30% (2순위)', hybrid: '35% (1순위)' },
    { name: '현대성', trad: '- (보조)', modern: '20% (3순위)', hybrid: '30% (3순위)' },
  ]

  items.forEach(item => {
    const row =
      `│ ${item.name.padEnd(13)} │ ` +
      `${item.trad.padEnd(19)} │ ` +
      `${item.modern.padEnd(19)} │ ` +
      `${item.hybrid.padEnd(19)} │`
    console.log(row)
  })

  console.log('└' + '─'.repeat(78) + '┘')
  console.log()

  console.log('📊 예상 결과 차이:\n')
  console.log('  🏛️  TRADITIONAL:')
  console.log('     - 한자 이름 위주 (20개 모두 한자)')
  console.log('     - 전통적 이름 75% (예: 성현, 예린, 지혜)')
  console.log('     - 사주 궁합도 90점 이상')
  console.log('     - 발음은 부차적 고려')
  console.log()

  console.log('  🌟 MODERN:')
  console.log('     - 한글 이름 포함 (5-10개)')
  console.log('     - 현대적 이름 75% (예: 서아, 하윤, 이준)')
  console.log('     - 발음 품질 95점 이상')
  console.log('     - 받침 없는 이름 많음')
  console.log()

  console.log('  ⚖️  HYBRID:')
  console.log('     - 한자와 한글 혼합')
  console.log('     - 균형잡힌 이름 40% (예: 지우, 서준, 예은)')
  console.log('     - 모든 항목 80-85점 균형')
  console.log('     - 전통과 현대 조화')
  console.log()
}

/**
 * 메인 실행
 */
async function main() {
  try {
    testNamingMethods()
    compareMethodPrompts()

    console.log('\n🎯 사용 방법:\n')
    console.log('```typescript')
    console.log("import { generateNames } from '@/lib/llm'")
    console.log()
    console.log('// 전통 작명')
    console.log('const traditional = await generateNames({')
    console.log("  familyName: '김',")
    console.log("  method: 'TRADITIONAL',  // 사주 중심")
    console.log('  // ...')
    console.log('})')
    console.log()
    console.log('// 현대 작명')
    console.log('const modern = await generateNames({')
    console.log("  familyName: '김',")
    console.log("  method: 'MODERN',  // 발음/의미 중심")
    console.log('  // ...')
    console.log('})')
    console.log()
    console.log('// 혼합 작명 (기본값)')
    console.log('const hybrid = await generateNames({')
    console.log("  familyName: '김',")
    console.log("  method: 'HYBRID',  // 균형")
    console.log('  // ...')
    console.log('})')
    console.log('```')
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

export { testNamingMethods, compareMethodPrompts }
