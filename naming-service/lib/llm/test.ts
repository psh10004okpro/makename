/**
 * LLM 작명 시스템 테스트
 *
 * Claude API를 사용한 AI 작명 기능을 테스트합니다.
 */

// .env 파일 로드
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(__dirname, '../../.env') })

import { generateNames, getClaudeNamingService } from './claude'
import { NamingRequest } from './types'

/**
 * 테스트 실행 함수
 */
async function runTests() {
  console.log('🧪 LLM 작명 시스템 테스트 시작\n')
  console.log('='.repeat(60))

  try {
    // ============================================================================
    // 테스트 1: 기본 작명 요청 (여자 아이)
    // ============================================================================
    console.log('\n📝 테스트 1: 기본 작명 요청 (여자 아이)\n')
    console.log('-'.repeat(60))

    const request1: NamingRequest = {
      familyName: '김',
      gender: 'FEMALE',
      birthDate: new Date('2023-05-15'),
      birthTime: '10:30',
      isLunar: false,
      method: 'HYBRID',
      preferences: {
        meaningKeywords: ['지혜', '사랑', '평화'],
        preferredLength: 2,
      },
    }

    console.log('요청 정보:')
    console.log(`  성씨: ${request1.familyName}`)
    console.log(`  성별: ${request1.gender}`)
    console.log(`  생년월일: ${request1.birthDate?.toLocaleDateString('ko-KR')}`)
    console.log(`  작명 방식: ${request1.method}`)
    console.log(`  선호 의미: ${request1.preferences?.meaningKeywords?.join(', ')}`)
    console.log('\n⏳ API 호출 중...\n')

    const startTime1 = Date.now()
    const response1 = await generateNames(request1)
    const duration1 = Date.now() - startTime1

    console.log('✅ 응답 성공!')
    console.log(`  생성된 이름: ${response1.suggestions.length}개`)
    console.log(`  사용 토큰: ${response1.tokensUsed.total} (입력: ${response1.tokensUsed.input}, 출력: ${response1.tokensUsed.output})`)
    console.log(`  소요 시간: ${duration1}ms`)
    console.log(`  요청 ID: ${response1.requestId}`)

    console.log('\n📋 생성된 이름 (상위 5개):\n')
    response1.suggestions.slice(0, 5).forEach((suggestion, index) => {
      console.log(`${index + 1}. ${suggestion.name} (${suggestion.pronunciation})`)
      console.log(`   의미: ${suggestion.meaning}`)
      console.log(`   궁합도: ${suggestion.compatibility.total}점`)
      if (suggestion.hanjaOptions && suggestion.hanjaOptions.length > 0) {
        const hanja = suggestion.hanjaOptions[0]
        console.log(`   한자: ${hanja.characters} (${hanja.meanings.join(', ')})`)
      }
      console.log(`   추천 이유: ${suggestion.reasoning.substring(0, 80)}...`)
      console.log()
    })

    // ============================================================================
    // 테스트 2: 사주 분석 포함 작명 (남자 아이)
    // ============================================================================
    console.log('\n📝 테스트 2: 사주 분석 포함 작명 (남자 아이)\n')
    console.log('-'.repeat(60))

    const request2: NamingRequest = {
      familyName: '이',
      gender: 'MALE',
      birthDate: new Date('2024-01-15'),
      birthTime: '14:30',
      isLunar: false,
      method: 'TRADITIONAL',
      sajuAnalysis: {
        year: '계묘년 (癸卯)',
        month: '을축월 (乙丑)',
        day: '경진일 (庚辰)',
        hour: '계미시 (癸未)',
        weakElements: ['화'],
        strongElements: ['수', '토'],
        missingElements: ['금'],
        yongsin: ['화', '목'],
        gisin: ['수'],
      },
      preferences: {
        meaningKeywords: ['용기', '성공', '리더십'],
      },
    }

    console.log('요청 정보:')
    console.log(`  성씨: ${request2.familyName}`)
    console.log(`  성별: ${request2.gender}`)
    console.log(`  사주: ${request2.sajuAnalysis?.year} ${request2.sajuAnalysis?.month}`)
    console.log(`  용신: ${request2.sajuAnalysis?.yongsin.join(', ')}`)
    console.log('\n⏳ API 호출 중...\n')

    const response2 = await generateNames(request2)

    console.log('✅ 응답 성공!')
    console.log(`  생성된 이름: ${response2.suggestions.length}개`)
    console.log(`  사용 토큰: ${response2.tokensUsed.total}`)

    console.log('\n📋 생성된 이름 (상위 3개):\n')
    response2.suggestions.slice(0, 3).forEach((suggestion, index) => {
      console.log(`${index + 1}. ${suggestion.name}`)
      console.log(`   의미: ${suggestion.meaning}`)
      console.log(`   궁합도: 사주 ${suggestion.compatibility.saju || 'N/A'}점, 오행 ${suggestion.compatibility.ohang || 'N/A'}점, 총점 ${suggestion.compatibility.total}점`)
      if (suggestion.hanjaOptions && suggestion.hanjaOptions.length > 0) {
        suggestion.hanjaOptions.forEach((hanja, idx) => {
          console.log(`   한자 옵션 ${idx + 1}: ${hanja.characters} (${hanja.meanings.join(', ')})`)
          console.log(`     오행: ${hanja.ohang.join(', ')}`)
        })
      }
      console.log()
    })

    // ============================================================================
    // 테스트 3: 현대식 작명 (한글 전용)
    // ============================================================================
    console.log('\n📝 테스트 3: 현대식 작명 (한글 전용)\n')
    console.log('-'.repeat(60))

    const request3: NamingRequest = {
      familyName: '박',
      gender: 'NEUTRAL',
      method: 'MODERN',
      preferences: {
        meaningKeywords: ['자유', '창의', '예술'],
        preferredLength: 2,
        koreanOnly: true,
      },
    }

    console.log('요청 정보:')
    console.log(`  성씨: ${request3.familyName}`)
    console.log(`  성별: 중성`)
    console.log(`  한글 전용: 예`)
    console.log('\n⏳ API 호출 중...\n')

    const response3 = await generateNames(request3)

    console.log('✅ 응답 성공!')
    console.log(`  생성된 이름: ${response3.suggestions.length}개`)

    console.log('\n📋 생성된 이름 (상위 5개):\n')
    response3.suggestions.slice(0, 5).forEach((suggestion, index) => {
      console.log(`${index + 1}. ${suggestion.name}`)
      console.log(`   의미: ${suggestion.meaning}`)
      console.log(`   발음 특징: ${suggestion.phonetics}`)
      console.log()
    })

    // ============================================================================
    // 테스트 4: 비용 추적
    // ============================================================================
    console.log('\n📊 테스트 4: 비용 추적\n')
    console.log('-'.repeat(60))

    const service = getClaudeNamingService()

    const todayStats = service.getTodayStats()
    console.log('오늘의 사용량:')
    console.log(`  입력 토큰: ${todayStats.inputTokens.toLocaleString()}`)
    console.log(`  출력 토큰: ${todayStats.outputTokens.toLocaleString()}`)
    console.log(`  총 토큰: ${todayStats.totalTokens.toLocaleString()}`)
    console.log(`  예상 비용: $${todayStats.estimatedCost.toFixed(4)}`)

    console.log('\n최근 요청 기록:')
    const history = service.getCostTrackingHistory(3)
    history.forEach((record, index) => {
      console.log(`  ${index + 1}. ${record.timestamp.toLocaleTimeString('ko-KR')}`)
      console.log(`     토큰: ${record.totalTokens}, 비용: $${record.estimatedCost.toFixed(4)}`)
    })

    // ============================================================================
    // 테스트 완료
    // ============================================================================
    console.log('\n' + '='.repeat(60))
    console.log('✅ 모든 테스트 완료!\n')
  } catch (error: any) {
    console.error('\n❌ 테스트 실패:', error.message)
    if (error.type) {
      console.error(`   에러 타입: ${error.type}`)
    }
    if (error.statusCode) {
      console.error(`   상태 코드: ${error.statusCode}`)
    }
    if (error.originalError) {
      console.error(`   원본 에러:`, error.originalError.message)
    }
    process.exit(1)
  }
}

/**
 * 메인 실행
 */
async function main() {
  try {
    await runTests()
  } catch (error) {
    console.error('테스트 실행 실패:', error)
    process.exit(1)
  }
}

// 스크립트 직접 실행시
if (require.main === module) {
  main()
}

export { runTests }
