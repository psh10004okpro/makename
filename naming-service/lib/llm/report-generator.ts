/**
 * 품질 평가 리포트 생성
 *
 * 이름 품질 평가 결과를 보기 좋은 형식으로 출력합니다.
 */

import { QualityReport, QualityAssessment } from './quality-evaluator'
import { ABTestResult } from './ab-test'

/**
 * 품질 리포트를 콘솔에 출력
 */
export function printQualityReport(report: QualityReport): void {
  console.log('\n' + '='.repeat(80))
  console.log('📊 이름 품질 평가 리포트')
  console.log('='.repeat(80))

  // 요약 정보
  console.log('\n## 요약')
  console.log(`  총 평가 이름: ${report.assessments.length}개`)
  console.log(`  평균 점수: ${report.averageScore}점`)
  console.log(`  최고 점수: ${report.bestScore}점`)
  console.log(`  최저 점수: ${report.worstScore}점`)

  // 등급 분포
  console.log('\n## 등급 분포')
  console.log(`  S급: ${report.distribution.S}개`)
  console.log(`  A급: ${report.distribution.A}개`)
  console.log(`  B급: ${report.distribution.B}개`)
  console.log(`  C급: ${report.distribution.C}개`)
  console.log(`  D급: ${report.distribution.D}개`)
  console.log(`  F급: ${report.distribution.F}개`)

  // 전체 강점
  if (report.overallStrengths.length > 0) {
    console.log('\n## 주요 강점')
    report.overallStrengths.forEach((strength, i) => {
      console.log(`  ${i + 1}. ${strength}`)
    })
  }

  // 전체 약점
  if (report.overallWeaknesses.length > 0) {
    console.log('\n## 주요 약점')
    report.overallWeaknesses.forEach((weakness, i) => {
      console.log(`  ${i + 1}. ${weakness}`)
    })
  }

  // 프롬프트 개선 제안
  if (report.promptImprovements.length > 0) {
    console.log('\n## 🔧 프롬프트 개선 제안')
    report.promptImprovements.forEach((improvement, i) => {
      console.log(`  ${i + 1}. ${improvement}`)
    })
  }

  // 상위 이름 목록
  console.log('\n## 🏆 상위 5개 이름')
  const topAssessments = [...report.assessments]
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, 5)

  topAssessments.forEach((assessment, i) => {
    printAssessmentSummary(assessment, i + 1)
  })

  console.log('\n' + '='.repeat(80) + '\n')
}

/**
 * 개별 평가 요약 출력
 */
function printAssessmentSummary(
  assessment: QualityAssessment,
  rank?: number
): void {
  const rankPrefix = rank ? `${rank}. ` : ''
  console.log(
    `\n${rankPrefix}${assessment.suggestion.name} - ${assessment.grade}등급 (${assessment.overallScore}점)`
  )
  console.log(`  의미: ${assessment.suggestion.meaning}`)
  console.log(`  발음: ${assessment.suggestion.pronunciation}`)

  console.log('  평가:')
  console.log(`    의미 적절성: ${assessment.criteria.meaningRelevance}점`)
  console.log(`    발음 자연스러움: ${assessment.criteria.pronunciationNaturalness}점`)
  if (assessment.criteria.hanjaAppropriateness) {
    console.log(
      `    한자 적절성: ${assessment.criteria.hanjaAppropriateness}점`
    )
  }
  console.log(`    현대성: ${assessment.criteria.modernity}점`)
  console.log(`    독창성: ${assessment.criteria.uniqueness}점`)

  if (assessment.strengths.length > 0) {
    console.log(`  강점: ${assessment.strengths.join(', ')}`)
  }
  if (assessment.weaknesses.length > 0) {
    console.log(`  약점: ${assessment.weaknesses.join(', ')}`)
  }
}

/**
 * 상세한 평가 결과 출력
 */
export function printDetailedAssessment(assessment: QualityAssessment): void {
  console.log('\n' + '-'.repeat(80))
  console.log(
    `이름: ${assessment.suggestion.name} (${assessment.suggestion.pronunciation})`
  )
  console.log(`등급: ${assessment.grade} (${assessment.overallScore}점)`)
  console.log('-'.repeat(80))

  console.log('\n의미:')
  console.log(`  ${assessment.suggestion.meaning}`)

  console.log('\n발음 특징:')
  console.log(`  ${assessment.suggestion.phonetics}`)

  if (assessment.suggestion.hanjaOptions && assessment.suggestion.hanjaOptions.length > 0) {
    console.log('\n한자 옵션:')
    assessment.suggestion.hanjaOptions.forEach((option, i) => {
      console.log(`  ${i + 1}. ${option.characters}`)
      console.log(`     의미: ${option.meanings.join(', ')}`)
      console.log(`     획수: ${option.strokes.join(' + ')}`)
      console.log(`     오행: ${option.ohang.join(', ')}`)
    })
  }

  console.log('\n궁합도:')
  if (assessment.suggestion.compatibility.saju) {
    console.log(`  사주: ${assessment.suggestion.compatibility.saju}점`)
  }
  if (assessment.suggestion.compatibility.ohang) {
    console.log(`  오행: ${assessment.suggestion.compatibility.ohang}점`)
  }
  if (assessment.suggestion.compatibility.strokes) {
    console.log(`  획수: ${assessment.suggestion.compatibility.strokes}점`)
  }
  if (assessment.suggestion.compatibility.phonetics) {
    console.log(`  음운: ${assessment.suggestion.compatibility.phonetics}점`)
  }
  console.log(`  총점: ${assessment.suggestion.compatibility.total}점`)

  console.log('\n추천 이유:')
  console.log(`  ${assessment.suggestion.reasoning}`)

  console.log('\n품질 평가:')
  console.log(`  의미 적절성: ${assessment.criteria.meaningRelevance}점`)
  console.log(`  발음 자연스러움: ${assessment.criteria.pronunciationNaturalness}점`)
  if (assessment.criteria.hanjaAppropriateness) {
    console.log(
      `  한자 적절성: ${assessment.criteria.hanjaAppropriateness}점`
    )
  }
  console.log(`  현대성: ${assessment.criteria.modernity}점`)
  console.log(`  독창성: ${assessment.criteria.uniqueness}점`)
  console.log(`  궁합도 신뢰성: ${assessment.criteria.compatibilityReliability}점`)
  console.log(`  추천 이유 품질: ${assessment.criteria.reasoningQuality}점`)

  if (assessment.strengths.length > 0) {
    console.log('\n강점:')
    assessment.strengths.forEach(s => console.log(`  ✓ ${s}`))
  }

  if (assessment.weaknesses.length > 0) {
    console.log('\n약점:')
    assessment.weaknesses.forEach(w => console.log(`  ✗ ${w}`))
  }

  if (assessment.improvements.length > 0) {
    console.log('\n개선 제안:')
    assessment.improvements.forEach(i => console.log(`  → ${i}`))
  }

  console.log('\n' + '-'.repeat(80))
}

/**
 * A/B 테스트 결과 출력
 */
export function printABTestResult(result: ABTestResult): void {
  console.log('\n' + '='.repeat(80))
  console.log('🧪 A/B 테스트 결과')
  console.log('='.repeat(80))

  console.log(`\n테스트 ID: ${result.testId}`)
  console.log(`테스트 일시: ${result.date.toLocaleString('ko-KR')}`)

  console.log('\n## 버전별 결과\n')

  result.versionResults.forEach(vr => {
    const isWinner = vr.version === result.winner
    const icon = isWinner ? '🏆 ' : '  '

    console.log(`${icon}버전 ${vr.version} - ${vr.versionName}`)
    console.log(`  평균 점수: ${vr.qualityReport.averageScore}점`)
    console.log(`  최고 점수: ${vr.qualityReport.bestScore}점`)
    console.log(`  최저 점수: ${vr.qualityReport.worstScore}점`)
    console.log(`  등급 분포:`, Object.entries(vr.qualityReport.distribution)
      .filter(([_, count]) => count > 0)
      .map(([grade, count]) => `${grade}:${count}`)
      .join(', '))
    console.log(`  소요 시간: ${vr.duration.toFixed(0)}ms`)
    console.log(`  사용 토큰: ${vr.tokensUsed}`)
    console.log(`  예상 비용: $${vr.estimatedCost.toFixed(4)}`)
    console.log()
  })

  console.log('## 🎯 승자')
  const winnerResult = result.versionResults.find(vr => vr.version === result.winner)
  if (winnerResult) {
    console.log(`  버전 ${winnerResult.version} (${winnerResult.versionName})`)
    console.log(`  평균 점수 ${winnerResult.qualityReport.averageScore}점으로 1위`)
  }

  console.log('\n## 요약')
  console.log(result.summary.split('\n').map(line => '  ' + line).join('\n'))

  console.log('\n' + '='.repeat(80) + '\n')
}

/**
 * 마크다운 형식으로 리포트 생성
 */
export function generateMarkdownReport(report: QualityReport): string {
  const lines: string[] = []

  lines.push('# 이름 품질 평가 리포트')
  lines.push('')
  lines.push(`생성 일시: ${new Date().toLocaleString('ko-KR')}`)
  lines.push('')

  lines.push('## 요약')
  lines.push('')
  lines.push(`- 총 평가 이름: ${report.assessments.length}개`)
  lines.push(`- 평균 점수: ${report.averageScore}점`)
  lines.push(`- 최고 점수: ${report.bestScore}점`)
  lines.push(`- 최저 점수: ${report.worstScore}점`)
  lines.push('')

  lines.push('## 등급 분포')
  lines.push('')
  lines.push('| 등급 | 개수 |')
  lines.push('|------|------|')
  Object.entries(report.distribution).forEach(([grade, count]) => {
    lines.push(`| ${grade} | ${count} |`)
  })
  lines.push('')

  if (report.overallStrengths.length > 0) {
    lines.push('## 주요 강점')
    lines.push('')
    report.overallStrengths.forEach(s => lines.push(`- ${s}`))
    lines.push('')
  }

  if (report.overallWeaknesses.length > 0) {
    lines.push('## 주요 약점')
    lines.push('')
    report.overallWeaknesses.forEach(w => lines.push(`- ${w}`))
    lines.push('')
  }

  if (report.promptImprovements.length > 0) {
    lines.push('## 프롬프트 개선 제안')
    lines.push('')
    report.promptImprovements.forEach(i => lines.push(`- ${i}`))
    lines.push('')
  }

  lines.push('## 상위 10개 이름')
  lines.push('')
  lines.push('| 순위 | 이름 | 등급 | 점수 | 의미 |')
  lines.push('|------|------|------|------|------|')

  const topAssessments = [...report.assessments]
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, 10)

  topAssessments.forEach((assessment, i) => {
    lines.push(
      `| ${i + 1} | ${assessment.suggestion.name} | ${assessment.grade} | ${assessment.overallScore} | ${assessment.suggestion.meaning.substring(0, 30)}... |`
    )
  })
  lines.push('')

  return lines.join('\n')
}

/**
 * CSV 형식으로 데이터 생성
 */
export function generateCSV(report: QualityReport): string {
  const lines: string[] = []

  // 헤더
  lines.push(
    'name,grade,overallScore,meaningRelevance,pronunciationNaturalness,hanjaAppropriateness,modernity,uniqueness,compatibilityReliability,reasoningQuality'
  )

  // 데이터
  report.assessments.forEach(a => {
    lines.push(
      [
        a.suggestion.name,
        a.grade,
        a.overallScore,
        a.criteria.meaningRelevance,
        a.criteria.pronunciationNaturalness,
        a.criteria.hanjaAppropriateness || 'N/A',
        a.criteria.modernity,
        a.criteria.uniqueness,
        a.criteria.compatibilityReliability,
        a.criteria.reasoningQuality,
      ].join(',')
    )
  })

  return lines.join('\n')
}
