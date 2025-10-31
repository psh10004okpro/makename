/**
 * Rate Limiting 미들웨어
 * - IP 주소 또는 사용자 ID 기반으로 요청 제한
 * - 슬라이딩 윈도우 알고리즘 사용
 */

import { NextRequest, NextResponse } from 'next/server'
import { getCache, CacheKeys, CacheTTL } from '@/lib/cache'

export interface RateLimitConfig {
  // 시간 윈도우 (초)
  windowSeconds: number
  // 윈도우 내 최대 요청 수
  maxRequests: number
  // 엔드포인트 식별자
  endpoint: string
  // 에러 메시지
  message?: string
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: Date
  total: number
}

/**
 * Rate limit 체크
 */
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const cache = getCache()
  const key = CacheKeys.rateLimit(identifier, config.endpoint)

  // 현재 요청 수 가져오기
  const current = (await cache.get<number>(key)) || 0

  // 제한 확인
  if (current >= config.maxRequests) {
    // TTL 확인하여 resetAt 계산
    const resetAt = new Date(Date.now() + config.windowSeconds * 1000)

    return {
      allowed: false,
      remaining: 0,
      resetAt,
      total: config.maxRequests,
    }
  }

  // 요청 수 증가
  const newCount = current + 1
  await cache.set(key, newCount, config.windowSeconds)

  const resetAt = new Date(Date.now() + config.windowSeconds * 1000)

  return {
    allowed: true,
    remaining: config.maxRequests - newCount,
    resetAt,
    total: config.maxRequests,
  }
}

/**
 * IP 주소 추출
 */
function getClientIdentifier(req: NextRequest): string {
  // 1. X-Forwarded-For 헤더 확인 (프록시 뒤에 있을 경우)
  const forwardedFor = req.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  // 2. X-Real-IP 헤더 확인
  const realIp = req.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  // 3. RemoteAddr 사용
  const remoteAddr = req.headers.get('x-remote-addr')
  if (remoteAddr) {
    return remoteAddr
  }

  // 4. 기본값
  return 'unknown'
}

/**
 * Rate limiting 미들웨어 팩토리
 */
export function withRateLimit(
  handler: (req: NextRequest) => Promise<Response>,
  config: RateLimitConfig
) {
  return async (req: NextRequest): Promise<Response> => {
    // 클라이언트 식별
    const identifier = getClientIdentifier(req)

    // Rate limit 체크
    const result = await checkRateLimit(identifier, config)

    // 헤더 추가
    const headers = new Headers()
    headers.set('X-RateLimit-Limit', result.total.toString())
    headers.set('X-RateLimit-Remaining', result.remaining.toString())
    headers.set('X-RateLimit-Reset', result.resetAt.toISOString())

    // 제한 초과 시
    if (!result.allowed) {
      return NextResponse.json(
        {
          error: config.message || 'Too many requests. Please try again later.',
          retryAfter: result.resetAt.toISOString(),
        },
        {
          status: 429,
          headers,
        }
      )
    }

    // 핸들러 실행
    const response = await handler(req)

    // 응답에 헤더 추가
    Object.entries(Object.fromEntries(headers)).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  }
}

/**
 * 사전 정의된 Rate limit 설정
 */
export const RateLimitPresets = {
  // 사주 분석: 분당 10회
  SAJU_ANALYSIS: {
    windowSeconds: 60,
    maxRequests: 10,
    endpoint: 'saju-analysis',
    message: '사주 분석 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
  } as RateLimitConfig,

  // AI 작명: 분당 5회 (LLM 호출 비용 고려)
  AI_NAMING: {
    windowSeconds: 60,
    maxRequests: 5,
    endpoint: 'ai-naming',
    message: 'AI 작명 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
  } as RateLimitConfig,

  // 통합 분석: 분당 3회 (가장 무거운 작업)
  INTEGRATED_ANALYSIS: {
    windowSeconds: 60,
    maxRequests: 3,
    endpoint: 'integrated-analysis',
    message: '통합 분석 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
  } as RateLimitConfig,

  // 일반 API: 분당 30회
  GENERAL: {
    windowSeconds: 60,
    maxRequests: 30,
    endpoint: 'general',
    message: 'API 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
  } as RateLimitConfig,
} as const

/**
 * LLM API Rate Limiter (전역)
 * - LLM API 호출을 제한하여 비용 관리
 */
export class LLMRateLimiter {
  private static lastCallTime: number = 0
  private static minIntervalMs: number = 1000 // 최소 1초 간격

  /**
   * LLM API 호출 전 대기
   */
  static async waitForNextCall(): Promise<void> {
    const now = Date.now()
    const timeSinceLastCall = now - this.lastCallTime

    if (timeSinceLastCall < this.minIntervalMs) {
      const waitTime = this.minIntervalMs - timeSinceLastCall
      await new Promise((resolve) => setTimeout(resolve, waitTime))
    }

    this.lastCallTime = Date.now()
  }

  /**
   * 최소 간격 설정
   */
  static setMinInterval(ms: number): void {
    this.minIntervalMs = ms
  }
}
