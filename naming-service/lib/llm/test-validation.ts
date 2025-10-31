/**
 * LLM 검증 시스템 테스트 (API 호출 없음)
 *
 * API 크레딧을 사용하지 않고 검증 로직을 테스트합니다.
 */

import {
  validateLLMResponse,
  extractAndParseJSON,
  refineSuggestions,
  validateResponseQuality,
} from './validator'
import { NAMING_SYSTEM_PROMPT, createUserPrompt } from './prompts'
import { PromptContext } from './types'

/**
 * 테스트 실행 함수
 */
async function runValidationTests() {
  console.log('🧪 LLM 검증 시스템 테스트 시작 (API 호출 없음)\n')
  console.log('='.repeat(60))

  let passedTests = 0
  let failedTests = 0

  try {
    // ============================================================================
    // 테스트 1: JSON 추출 및 파싱
    // ============================================================================
    console.log('\n📝 테스트 1: JSON 추출 및 파싱\n')
    console.log('-'.repeat(60))

    const mockResponse = `
여기는 설명 텍스트입니다.

\`\`\`json
{
  "suggestions": [
    {
      "name": "지혜",
      "hanjaOptions": [
        {
          "characters": "智慧",
          "meanings": ["지혜로울 지", "슬기로울 혜"],
          "strokes": [12, 15],
          "ohang": ["火", "水"]
        }
      ],
      "pronunciation": "지혜 (Ji-hye)",
      "meaning": "지혜롭고 슬기로운 사람",
      "phonetics": "부드럽고 현대적인 발음",
      "compatibility": {
        "saju": 90,
        "ohang": 85,
        "strokes": 88,
        "phonetics": 92,
        "total": 89
      },
      "reasoning": "지혜와 슬기로움을 동시에 표현하는 이름으로, 부모의 기대를 잘 담고 있습니다."
    }
  ]
}
\`\`\`

추가 설명입니다.
`

    try {
      const parsed = extractAndParseJSON(mockResponse)
      console.log('✅ JSON 추출 성공')
      console.log('   파싱된 데이터:', JSON.stringify(parsed).substring(0, 100) + '...')
      passedTests++
    } catch (error: any) {
      console.error('❌ JSON 추출 실패:', error.message)
      failedTests++
    }

    // ============================================================================
    // 테스트 2: 응답 스키마 검증
    // ============================================================================
    console.log('\n📝 테스트 2: 응답 스키마 검증\n')
    console.log('-'.repeat(60))

    const validData = {
      suggestions: [
        {
          name: '서연',
          hanjaOptions: [
            {
              characters: '瑞淵',
              meanings: ['상서로울 서', '깊을 연'],
              strokes: [13, 11],
              ohang: ['金', '水'],
            },
          ],
          pronunciation: '서연 (Seo-yeon)',
          meaning: '상서롭고 깊은 지혜를 지닌 사람',
          phonetics: '부드러운 발음으로 현대적이면서도 우아합니다',
          compatibility: {
            saju: 92,
            ohang: 88,
            strokes: 90,
            phonetics: 95,
            total: 91,
          },
          reasoning: '상서로운 의미와 깊이를 함께 담은 이름입니다.',
        },
      ],
    }

    try {
      const validated = validateLLMResponse(validData)
      console.log('✅ 스키마 검증 성공')
      console.log(`   검증된 이름 개수: ${validated.suggestions.length}`)
      passedTests++
    } catch (error: any) {
      console.error('❌ 스키마 검증 실패:', error.message)
      failedTests++
    }

    // ============================================================================
    // 테스트 3: 이름 제안 정제
    // ============================================================================
    console.log('\n📝 테스트 3: 이름 제안 정제\n')
    console.log('-'.repeat(60))

    const rawSuggestions = [
      {
        name: '  예린  ', // 공백 포함
        pronunciation: '예린', // 영문 표기 없음
        meaning: '예쁘고 아름다운 사람',
        phonetics: '부드러운 발음',
        compatibility: {
          total: 0, // total이 0
          saju: 85,
          ohang: 88,
        },
        reasoning: '예쁘고 아름다운 의미를 담은 이름입니다.',
      },
    ]

    try {
      const refined = refineSuggestions(rawSuggestions as any)
      console.log('✅ 정제 성공')
      console.log(`   정제 전 name: "${rawSuggestions[0].name}"`)
      console.log(`   정제 후 name: "${refined[0].name}"`)
      console.log(`   정제 전 total: ${rawSuggestions[0].compatibility.total}`)
      console.log(`   정제 후 total: ${refined[0].compatibility.total}`)
      console.log(`   정제 후 pronunciation: ${refined[0].pronunciation}`)
      passedTests++
    } catch (error: any) {
      console.error('❌ 정제 실패:', error.message)
      failedTests++
    }

    // ============================================================================
    // 테스트 4: 응답 품질 검증
    // ============================================================================
    console.log('\n📝 테스트 4: 응답 품질 검증\n')
    console.log('-'.repeat(60))

    const goodResponse = {
      suggestions: Array.from({ length: 10 }, (_, i) => ({
        name: `이름${i + 1}`,
        pronunciation: `이름${i + 1}`,
        meaning: '좋은 의미를 담은 이름입니다',
        phonetics: '부드러운 발음',
        compatibility: {
          total: 85 + i,
        },
        reasoning: '이 이름은 좋은 의미와 발음을 갖추고 있어 추천드립니다. 특히 성씨와의 조화가 뛰어납니다.',
      })),
    }

    const badResponse = {
      suggestions: [
        {
          name: '이름',
          pronunciation: '이름',
          meaning: '의미',
          phonetics: '발음',
          compatibility: { total: 0 }, // 점수 0
          reasoning: '짧음', // reasoning 너무 짧음
        },
      ],
    }

    try {
      const isGoodQuality = validateResponseQuality(goodResponse as any)
      const isBadQuality = validateResponseQuality(badResponse as any)

      console.log(`✅ 품질 검증 성공`)
      console.log(`   좋은 응답 품질: ${isGoodQuality ? '통과' : '실패'}`)
      console.log(`   나쁜 응답 품질: ${isBadQuality ? '통과 (문제!)' : '실패 (정상)'}`)

      if (isGoodQuality && !isBadQuality) {
        passedTests++
      } else {
        failedTests++
      }
    } catch (error: any) {
      console.error('❌ 품질 검증 실패:', error.message)
      failedTests++
    }

    // ============================================================================
    // 테스트 5: 프롬프트 생성
    // ============================================================================
    console.log('\n📝 테스트 5: 프롬프트 생성\n')
    console.log('-'.repeat(60))

    const context: PromptContext = {
      request: {
        familyName: '김',
        gender: 'FEMALE',
        birthDate: new Date('2023-05-15'),
        method: 'HYBRID',
        preferences: {
          meaningKeywords: ['지혜', '아름다움'],
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
      },
      currentDate: new Date(),
    }

    try {
      const systemPrompt = NAMING_SYSTEM_PROMPT
      const userPrompt = createUserPrompt(context)

      console.log('✅ 프롬프트 생성 성공')
      console.log(`   시스템 프롬프트 길이: ${systemPrompt.length} 글자`)
      console.log(`   사용자 프롬프트 길이: ${userPrompt.length} 글자`)
      console.log('\n   사용자 프롬프트 미리보기:')
      console.log('   ' + userPrompt.substring(0, 200).replace(/\n/g, '\n   ') + '...')
      passedTests++
    } catch (error: any) {
      console.error('❌ 프롬프트 생성 실패:', error.message)
      failedTests++
    }

    // ============================================================================
    // 테스트 완료
    // ============================================================================
    console.log('\n' + '='.repeat(60))
    console.log('\n📊 테스트 결과:')
    console.log(`   통과: ${passedTests}개`)
    console.log(`   실패: ${failedTests}개`)
    console.log(`   성공률: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(1)}%`)

    if (failedTests === 0) {
      console.log('\n✅ 모든 검증 테스트 통과!\n')
    } else {
      console.log('\n⚠️  일부 테스트 실패\n')
      process.exit(1)
    }
  } catch (error: any) {
    console.error('\n❌ 테스트 실행 중 오류:', error.message)
    process.exit(1)
  }
}

/**
 * 메인 실행
 */
async function main() {
  try {
    await runValidationTests()
  } catch (error) {
    console.error('테스트 실행 실패:', error)
    process.exit(1)
  }
}

// 스크립트 직접 실행시
if (require.main === module) {
  main()
}

export { runValidationTests }
