/**
 * 품질 평가 시스템 테스트
 *
 * 이름 품질 평가 및 A/B 테스트 기능을 테스트합니다.
 */

import { NamingRequest } from './types'
import { nameQualityEvaluator } from './quality-evaluator'
import { abTester } from './ab-test'
import {
  printQualityReport,
  printABTestResult,
  generateMarkdownReport,
} from './report-generator'

/**
 * 테스트 실행
 */
async function runQualityTests() {
  console.log('🧪 품질 평가 시스템 테스트 시작\n')
  console.log('='.repeat(60))

  // ============================================================================
  // 테스트 1: 개별 이름 품질 평가
  // ============================================================================
  console.log('\n📝 테스트 1: 개별 이름 품질 평가\n')
  console.log('-'.repeat(60))

  const request: NamingRequest = {
    familyName: '김',
    gender: 'FEMALE',
    birthDate: new Date('2023-05-15'),
    method: 'HYBRID',
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

  // 샘플 이름들
  const sampleNames = [
    {
      name: '지혜',
      hanjaOptions: [
        {
          characters: '智慧',
          meanings: ['지혜로울 지', '슬기로울 혜'],
          strokes: [12, 15],
          ohang: ['火', '水'],
        },
      ],
      pronunciation: '지혜 (Ji-hye)',
      meaning: '지혜롭고 슬기로운 사람이 되라는 뜻',
      phonetics: '부드러운 모음으로 발음이 편안합니다.',
      compatibility: {
        saju: 88,
        ohang: 85,
        strokes: 90,
        phonetics: 92,
        total: 89,
      },
      reasoning:
        '지혜와 슬기로움을 동시에 표현하는 이름입니다. 사주의 부족한 수(水) 오행을 慧(혜)자로 보완하며, 의미가 명확하고 발음이 부드럽습니다.',
    },
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
      phonetics: '부드러운 발음으로 현대적입니다.',
      compatibility: {
        saju: 92,
        ohang: 90,
        strokes: 88,
        phonetics: 95,
        total: 91,
      },
      reasoning:
        '상서로운 의미와 깊이를 함께 담은 이름입니다. 용신 오행인 수(水)를 淵(연)자로 보완하며, 발음이 매우 부드럽고 현대적입니다.',
    },
    {
      name: '민준',
      pronunciation: '민준 (Min-jun)',
      meaning: '민첩하고 준수한 사람',
      phonetics: '받침이 있어 약간 딱딱한 발음입니다.',
      compatibility: {
        total: 75,
      },
      reasoning: '좋은 의미를 담고 있습니다.',
    },
  ]

  console.log('샘플 이름 3개 평가 중...\n')

  const assessments = await Promise.all(
    sampleNames.map(name => nameQualityEvaluator.evaluate(name, request))
  )

  assessments.forEach((assessment, i) => {
    console.log(`${i + 1}. ${assessment.suggestion.name}`)
    console.log(`   등급: ${assessment.grade} (${assessment.overallScore}점)`)
    console.log(`   강점: ${assessment.strengths.join(', ') || '없음'}`)
    console.log(`   약점: ${assessment.weaknesses.join(', ') || '없음'}`)
    console.log()
  })

  // ============================================================================
  // 테스트 2: 전체 품질 리포트 생성
  // ============================================================================
  console.log('\n📝 테스트 2: 전체 품질 리포트 생성\n')
  console.log('-'.repeat(60))

  const report = await nameQualityEvaluator.evaluateAll(sampleNames, request)

  printQualityReport(report)

  // ============================================================================
  // 테스트 3: A/B 테스트 실행 (3가지 버전 비교)
  // ============================================================================
  console.log('\n📝 테스트 3: A/B 테스트 (버전 1.0 vs 2.0 vs 3.0)\n')
  console.log('-'.repeat(60))

  console.log('A/B 테스트를 실행합니다 (시뮬레이션)...\n')

  const abResult = await abTester.runTest(request, {
    versions: ['1.0', '2.0', '3.0'],
  })

  printABTestResult(abResult)

  // ============================================================================
  // 테스트 4: 마크다운 리포트 생성
  // ============================================================================
  console.log('\n📝 테스트 4: 마크다운 리포트 생성\n')
  console.log('-'.repeat(60))

  const markdown = generateMarkdownReport(report)
  console.log('마크다운 리포트 미리보기:\n')
  console.log(markdown.substring(0, 500))
  console.log('...(생략)...\n')

  // ============================================================================
  // 테스트 완료
  // ============================================================================
  console.log('='.repeat(60))
  console.log('✅ 모든 품질 평가 테스트 완료!\n')

  console.log('📊 주요 발견사항:')
  console.log(`  1. 평균 품질 점수: ${report.averageScore}점`)
  console.log(
    `  2. 가장 흔한 약점: ${report.overallWeaknesses[0] || '없음'}`
  )
  console.log(
    `  3. A/B 테스트 승자: 버전 ${abResult.winner}`
  )
  console.log()
}

/**
 * 메인 실행
 */
async function main() {
  try {
    await runQualityTests()
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

export { runQualityTests }
