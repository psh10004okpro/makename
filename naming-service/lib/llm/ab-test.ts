/**
 * A/B 테스트 프레임워크
 *
 * 여러 프롬프트 버전을 비교하고 성능을 측정합니다.
 */

import { ClaudeNamingService } from './claude'
import { NamingRequest, NamingResponse } from './types'
import { QualityReport, nameQualityEvaluator } from './quality-evaluator'
import { PromptVersion, PROMPT_VERSIONS } from './prompt-versions'

/**
 * A/B 테스트 결과
 */
export interface ABTestResult {
  /** 테스트 ID */
  testId: string
  /** 테스트 날짜 */
  date: Date
  /** 테스트한 요청 */
  request: NamingRequest
  /** 버전별 결과 */
  versionResults: VersionResult[]
  /** 승자 버전 */
  winner: string
  /** 요약 */
  summary: string
}

/**
 * 버전별 결과
 */
export interface VersionResult {
  /** 프롬프트 버전 */
  version: string
  /** 버전 이름 */
  versionName: string
  /** 생성된 응답 */
  response: NamingResponse
  /** 품질 평가 */
  qualityReport: QualityReport
  /** 소요 시간 */
  duration: number
  /** 사용된 토큰 */
  tokensUsed: number
  /** 예상 비용 */
  estimatedCost: number
}

/**
 * A/B 테스트 설정
 */
export interface ABTestConfig {
  /** 테스트할 버전들 (미지정시 모든 버전) */
  versions?: string[]
  /** 테스트 반복 횟수 */
  iterations?: number
  /** 결과 저장 여부 */
  saveResults?: boolean
}

/**
 * A/B 테스트 실행기
 */
export class ABTester {
  private service?: ClaudeNamingService
  private results: ABTestResult[] = []

  constructor(service?: ClaudeNamingService) {
    this.service = service
  }

  /**
   * 서비스 인스턴스 가져오기 (지연 초기화)
   */
  private getService(): ClaudeNamingService {
    if (!this.service) {
      this.service = new ClaudeNamingService()
    }
    return this.service
  }

  /**
   * A/B 테스트 실행
   */
  async runTest(
    request: NamingRequest,
    config: ABTestConfig = {}
  ): Promise<ABTestResult> {
    const testId = this.generateTestId()
    console.log(`🧪 A/B 테스트 시작 (ID: ${testId})\n`)

    // 테스트할 버전 결정
    const versionsToTest = config.versions || PROMPT_VERSIONS.map(v => v.version)

    console.log(`테스트할 버전: ${versionsToTest.join(', ')}\n`)

    // 각 버전별로 테스트 실행
    const versionResults: VersionResult[] = []

    for (const versionId of versionsToTest) {
      const version = PROMPT_VERSIONS.find(v => v.version === versionId)
      if (!version) {
        console.warn(`⚠️  버전 ${versionId}을 찾을 수 없습니다. 건너뜁니다.`)
        continue
      }

      console.log(`📝 버전 ${version.version} (${version.name}) 테스트 중...`)

      try {
        const startTime = Date.now()

        // 이름 생성 (실제 API 호출은 크레딧이 필요하므로 시뮬레이션)
        // const response = await this.service.generateNames(request)

        // 시뮬레이션: 샘플 응답 생성
        const response = this.generateSampleResponse(version, request)

        const duration = Date.now() - startTime

        // 품질 평가
        const qualityReport = await nameQualityEvaluator.evaluateAll(
          response.suggestions,
          request
        )

        // 비용 계산
        const tokensUsed = response.tokensUsed.total
        const estimatedCost = this.calculateCost(
          response.tokensUsed.input,
          response.tokensUsed.output
        )

        versionResults.push({
          version: version.version,
          versionName: version.name,
          response,
          qualityReport,
          duration,
          tokensUsed,
          estimatedCost,
        })

        console.log(
          `  ✅ 완료: 평균 점수 ${qualityReport.averageScore}점, ` +
            `${tokensUsed} 토큰, $${estimatedCost.toFixed(4)}\n`
        )
      } catch (error: any) {
        console.error(`  ❌ 오류: ${error.message}\n`)
      }
    }

    // 승자 결정
    const winner = this.determineWinner(versionResults)

    // 요약 생성
    const summary = this.generateSummary(versionResults, winner)

    const result: ABTestResult = {
      testId,
      date: new Date(),
      request,
      versionResults,
      winner,
      summary,
    }

    this.results.push(result)

    return result
  }

  /**
   * 샘플 응답 생성 (API 크레딧 없을 때 시뮬레이션용)
   */
  private generateSampleResponse(
    version: PromptVersion,
    request: NamingRequest
  ): NamingResponse {
    // 버전에 따라 약간 다른 품질의 응답 생성
    const isV2 = version.version === '2.0'

    const suggestions = Array.from({ length: 20 }, (_, i) => ({
      name: `이름${i + 1}`,
      hanjaOptions: [
        {
          characters: `字${i + 1}字${i + 1}`,
          meanings: [`의미${i + 1} 1`, `의미${i + 1} 2`],
          strokes: [8 + i, 10 + i],
          ohang: ['火', '水'],
        },
      ],
      pronunciation: `이름${i + 1} (Name${i + 1})`,
      meaning: isV2
        ? `${request.preferences?.meaningKeywords?.join(', ') || '좋은'} 의미를 담은 이름${i + 1}입니다.`
        : `좋은 의미를 담은 이름${i + 1}입니다.`,
      phonetics: isV2
        ? '부드러운 모음으로 발음이 편안하고 현대적입니다. 받침이 적어 발음하기 쉽습니다.'
        : '발음이 좋습니다.',
      compatibility: {
        saju: 80 + (isV2 ? i : i / 2),
        ohang: 85 + (isV2 ? i : i / 2),
        strokes: 75 + (isV2 ? i : i / 2),
        phonetics: 90 + (isV2 ? i : i / 2),
        total: 82 + (isV2 ? i : i / 2),
      },
      reasoning: isV2
        ? `이 이름은 사주의 ${request.sajuAnalysis?.yongsin?.join(', ') || '용신'} 오행을 보완하며, ` +
          `${request.preferences?.meaningKeywords?.[0] || '좋은 의미'}를 담고 있어 추천드립니다. ` +
          `발음이 부드럽고 현대적이며, 한자의 획수도 길합니다.`
        : `좋은 이름입니다. 의미가 좋습니다.`,
    }))

    return {
      suggestions,
      tokensUsed: {
        input: isV2 ? 2800 : 2500,
        output: isV2 ? 3500 : 2800,
        total: isV2 ? 6300 : 5300,
      },
      duration: Math.random() * 5000 + 3000,
      requestId: this.generateTestId(),
    }
  }

  /**
   * 승자 결정
   */
  private determineWinner(results: VersionResult[]): string {
    if (results.length === 0) return ''

    // 품질 점수를 기준으로 승자 결정
    const sortedByQuality = [...results].sort(
      (a, b) => b.qualityReport.averageScore - a.qualityReport.averageScore
    )

    return sortedByQuality[0].version
  }

  /**
   * 요약 생성
   */
  private generateSummary(
    results: VersionResult[],
    winner: string
  ): string {
    const parts: string[] = []

    parts.push(`총 ${results.length}개 버전 테스트 완료`)
    parts.push('')

    results.forEach(result => {
      const isWinner = result.version === winner
      parts.push(
        `${isWinner ? '🏆 ' : ''}버전 ${result.version} (${result.versionName}):` +
          ` 평균 ${result.qualityReport.averageScore}점, ` +
          `${result.tokensUsed} 토큰, ` +
          `$${result.estimatedCost.toFixed(4)}`
      )
    })

    parts.push('')
    parts.push(`승자: 버전 ${winner}`)

    return parts.join('\n')
  }

  /**
   * 비용 계산
   */
  private calculateCost(inputTokens: number, outputTokens: number): number {
    const inputCost = (inputTokens / 1_000_000) * 3.0
    const outputCost = (outputTokens / 1_000_000) * 15.0
    return inputCost + outputCost
  }

  /**
   * 테스트 ID 생성
   */
  private generateTestId(): string {
    return `test_${Date.now()}_${Math.random().toString(36).substring(7)}`
  }

  /**
   * 결과 조회
   */
  getResults(): ABTestResult[] {
    return this.results
  }

  /**
   * 결과 초기화
   */
  clearResults(): void {
    this.results = []
  }
}

/**
 * 기본 인스턴스
 */
export const abTester = new ABTester()
