/**
 * Claude API 작명 서비스
 *
 * Anthropic의 Claude API를 사용하여 AI 작명을 수행합니다.
 */

import Anthropic from '@anthropic-ai/sdk'
import {
  NamingRequest,
  NamingResponse,
  ClaudeConfig,
  LLMError,
  RetryOptions,
  UsageStats,
  CostTracking,
  PromptContext,
} from './types'
import { createFullPrompt, createRetryPrompt } from './prompts'
import { validateAndRefineLLMResponse } from './validator'
import { LLMRateLimiter } from '@/lib/middleware/rate-limit'

/**
 * 기본 설정
 */
const DEFAULT_CONFIG: Partial<ClaudeConfig> = {
  model: 'claude-sonnet-4-20250514',
  maxTokens: 4000,
  temperature: 0.7,
  timeout: 120000, // 2분
  retry: {
    maxRetries: 3,
    initialDelay: 1000,
    multiplier: 2,
    maxDelay: 10000,
  },
}

/**
 * Claude Sonnet 4 가격 (USD)
 * 2025년 5월 기준
 */
const PRICING = {
  inputTokensPer1M: 3.0, // $3.00 per 1M input tokens
  outputTokensPer1M: 15.0, // $15.00 per 1M output tokens
}

/**
 * 비용 계산
 */
function calculateCost(inputTokens: number, outputTokens: number): number {
  const inputCost = (inputTokens / 1_000_000) * PRICING.inputTokensPer1M
  const outputCost = (outputTokens / 1_000_000) * PRICING.outputTokensPer1M
  return inputCost + outputCost
}

/**
 * Claude 작명 서비스 클래스
 */
export class ClaudeNamingService {
  private client: Anthropic
  private config: ClaudeConfig
  private costTracking: CostTracking[] = []

  constructor(config?: Partial<ClaudeConfig>) {
    const apiKey = config?.apiKey || process.env.ANTHROPIC_API_KEY

    if (!apiKey) {
      throw new LLMError(
        'ANTHROPIC_API_KEY가 설정되지 않았습니다. 환경 변수를 확인해주세요.',
        'API_KEY_MISSING'
      )
    }

    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
      apiKey,
    } as ClaudeConfig

    this.client = new Anthropic({
      apiKey: this.config.apiKey,
      timeout: this.config.timeout,
    })
  }

  /**
   * 이름 생성 (메인 메서드)
   *
   * @param request 작명 요청
   * @returns 이름 제안 응답
   */
  async generateNames(request: NamingRequest): Promise<NamingResponse> {
    const startTime = Date.now()
    const requestId = this.generateRequestId()

    try {
      // 프롬프트 생성
      const context: PromptContext = {
        request,
        currentDate: new Date(),
      }
      const { system, user } = createFullPrompt(context)

      // API 호출 (재시도 포함)
      const response = await this.callAPIWithRetry(system, user, context)

      // 응답 검증 및 정제
      const validated = validateAndRefineLLMResponse(response.content)

      // 사용 통계 계산
      const tokensUsed = {
        input: response.usage.input_tokens,
        output: response.usage.output_tokens,
        total: response.usage.input_tokens + response.usage.output_tokens,
      }

      // 비용 추적
      this.trackCost(requestId, tokensUsed.input, tokensUsed.output)

      // 응답 생성
      const duration = Date.now() - startTime

      return {
        suggestions: validated.suggestions,
        tokensUsed,
        duration,
        requestId,
      }
    } catch (error) {
      // 에러 처리
      if (error instanceof LLMError) {
        throw error
      }

      if (error instanceof Anthropic.APIError) {
        throw new LLMError(
          `Claude API 오류: ${error.message}`,
          'API_ERROR',
          error.status,
          error
        )
      }

      throw new LLMError(
        `알 수 없는 오류: ${(error as Error).message}`,
        'UNKNOWN',
        undefined,
        error as Error
      )
    }
  }

  /**
   * API 호출 (재시도 로직 포함)
   */
  private async callAPIWithRetry(
    system: string,
    user: string,
    context: PromptContext,
    retryCount = 0
  ): Promise<{
    content: string
    usage: { input_tokens: number; output_tokens: number }
  }> {
    try {
      // Rate limiting: LLM API 호출 제한 (최소 1초 간격)
      await LLMRateLimiter.waitForNextCall()

      const message = await this.client.messages.create({
        model: this.config.model!,
        max_tokens: this.config.maxTokens!,
        temperature: this.config.temperature!,
        system,
        messages: [
          {
            role: 'user',
            content: user,
          },
        ],
      })

      // 응답 텍스트 추출
      const content = message.content
        .filter(block => block.type === 'text')
        .map(block => (block as { type: 'text'; text: string }).text)
        .join('\n')

      return {
        content,
        usage: {
          input_tokens: message.usage.input_tokens,
          output_tokens: message.usage.output_tokens,
        },
      }
    } catch (error) {
      const retryOptions = this.config.retry!

      // 재시도 가능한 에러인지 확인
      const isRetryable = this.isRetryableError(error)

      if (isRetryable && retryCount < retryOptions.maxRetries) {
        // 대기 시간 계산 (exponential backoff)
        const delay = Math.min(
          retryOptions.initialDelay * Math.pow(retryOptions.multiplier, retryCount),
          retryOptions.maxDelay
        )

        console.log(`재시도 ${retryCount + 1}/${retryOptions.maxRetries} (${delay}ms 후)...`)
        await this.sleep(delay)

        // 재시도용 프롬프트 생성 (검증 오류인 경우)
        let retryUser = user
        if (error instanceof LLMError && error.type === 'VALIDATION_ERROR') {
          retryUser = createRetryPrompt(context, error.message)
        }

        return this.callAPIWithRetry(system, retryUser, context, retryCount + 1)
      }

      // 재시도 불가능하거나 최대 재시도 횟수 초과
      throw error
    }
  }

  /**
   * 재시도 가능한 에러인지 확인
   */
  private isRetryableError(error: unknown): boolean {
    if (error instanceof Anthropic.APIError) {
      // 429 (Rate Limit), 500, 502, 503, 504는 재시도 가능
      return [429, 500, 502, 503, 504].includes(error.status || 0)
    }

    if (error instanceof LLMError) {
      // VALIDATION_ERROR, PARSING_ERROR는 재시도 가능 (프롬프트 개선 후)
      return ['VALIDATION_ERROR', 'PARSING_ERROR'].includes(error.type)
    }

    return false
  }

  /**
   * 대기 (Promise)
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * 요청 ID 생성
   */
  private generateRequestId(): string {
    return `naming_${Date.now()}_${Math.random().toString(36).substring(7)}`
  }

  /**
   * 비용 추적
   */
  private trackCost(
    requestId: string,
    inputTokens: number,
    outputTokens: number,
    userId?: string
  ): void {
    const cost = calculateCost(inputTokens, outputTokens)

    const tracking: CostTracking = {
      requestId,
      timestamp: new Date(),
      inputTokens,
      outputTokens,
      totalTokens: inputTokens + outputTokens,
      estimatedCost: cost,
      userId,
      requestType: 'naming',
    }

    this.costTracking.push(tracking)

    // 메모리 관리 (최근 1000개만 유지)
    if (this.costTracking.length > 1000) {
      this.costTracking = this.costTracking.slice(-1000)
    }
  }

  /**
   * 사용 통계 조회
   *
   * @param startDate 시작 날짜
   * @param endDate 종료 날짜
   * @returns 사용 통계
   */
  getUsageStats(startDate?: Date, endDate?: Date): UsageStats {
    let filteredTracking = this.costTracking

    if (startDate) {
      filteredTracking = filteredTracking.filter(
        t => t.timestamp >= startDate
      )
    }

    if (endDate) {
      filteredTracking = filteredTracking.filter(
        t => t.timestamp <= endDate
      )
    }

    const totalInputTokens = filteredTracking.reduce(
      (sum, t) => sum + t.inputTokens,
      0
    )
    const totalOutputTokens = filteredTracking.reduce(
      (sum, t) => sum + t.outputTokens,
      0
    )
    const totalTokens = totalInputTokens + totalOutputTokens
    const estimatedCost = calculateCost(totalInputTokens, totalOutputTokens)

    return {
      inputTokens: totalInputTokens,
      outputTokens: totalOutputTokens,
      totalTokens,
      estimatedCost,
    }
  }

  /**
   * 비용 추적 기록 조회
   *
   * @param limit 최대 개수
   * @returns 비용 추적 기록
   */
  getCostTrackingHistory(limit: number = 100): CostTracking[] {
    return this.costTracking.slice(-limit)
  }

  /**
   * 비용 추적 초기화
   */
  clearCostTracking(): void {
    this.costTracking = []
  }

  /**
   * 월별 비용 통계
   *
   * @param year 연도
   * @param month 월 (1-12)
   * @returns 해당 월의 사용 통계
   */
  getMonthlyStats(year: number, month: number): UsageStats {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0, 23, 59, 59)

    return this.getUsageStats(startDate, endDate)
  }

  /**
   * 오늘의 비용 통계
   *
   * @returns 오늘의 사용 통계
   */
  getTodayStats(): UsageStats {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return this.getUsageStats(today)
  }
}

/**
 * 싱글톤 인스턴스 (편의용)
 */
let _instance: ClaudeNamingService | null = null

/**
 * ClaudeNamingService 인스턴스 가져오기
 *
 * 싱글톤 패턴으로 구현되어 있어, 여러 번 호출해도 동일한 인스턴스를 반환합니다.
 *
 * @param config 설정 (처음 호출시에만 적용)
 * @returns ClaudeNamingService 인스턴스
 */
export function getClaudeNamingService(
  config?: Partial<ClaudeConfig>
): ClaudeNamingService {
  if (!_instance) {
    _instance = new ClaudeNamingService(config)
  }
  return _instance
}

/**
 * 싱글톤 인스턴스 초기화
 */
export function resetClaudeNamingService(): void {
  _instance = null
}

/**
 * 간편 API: 이름 생성
 *
 * @param request 작명 요청
 * @returns 이름 제안 응답
 */
export async function generateNames(
  request: NamingRequest
): Promise<NamingResponse> {
  const service = getClaudeNamingService()
  return service.generateNames(request)
}
