/**
 * 캐싱 시스템
 * - Redis를 사용할 수 있으면 Redis 사용 (프로덕션)
 * - Redis가 없으면 in-memory cache 사용 (개발 환경)
 */

import Redis from 'ioredis'
import NodeCache from 'node-cache'

// 캐시 인터페이스
export interface Cache {
  get<T>(key: string): Promise<T | null>
  set(key: string, value: any, ttlSeconds?: number): Promise<void>
  del(key: string): Promise<void>
  clear(): Promise<void>
  has(key: string): Promise<boolean>
}

// Redis 캐시 구현
class RedisCache implements Cache {
  private client: Redis

  constructor(redisUrl: string) {
    this.client = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000)
        return delay
      },
      lazyConnect: true,
    })

    // 연결 이벤트 핸들링
    this.client.on('connect', () => {
      console.log('✅ Redis connected')
    })

    this.client.on('error', (err) => {
      console.error('❌ Redis error:', err.message)
    })

    // 연결 시도
    this.client.connect().catch((err) => {
      console.error('❌ Redis connection failed:', err.message)
    })
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(key)
      if (!value) return null
      return JSON.parse(value) as T
    } catch (error) {
      console.error('Redis get error:', error)
      return null
    }
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value)
      if (ttlSeconds) {
        await this.client.setex(key, ttlSeconds, serialized)
      } else {
        await this.client.set(key, serialized)
      }
    } catch (error) {
      console.error('Redis set error:', error)
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.client.del(key)
    } catch (error) {
      console.error('Redis del error:', error)
    }
  }

  async clear(): Promise<void> {
    try {
      await this.client.flushdb()
    } catch (error) {
      console.error('Redis clear error:', error)
    }
  }

  async has(key: string): Promise<boolean> {
    try {
      const exists = await this.client.exists(key)
      return exists === 1
    } catch (error) {
      console.error('Redis has error:', error)
      return false
    }
  }

  async close(): Promise<void> {
    await this.client.quit()
  }
}

// In-memory 캐시 구현
class MemoryCache implements Cache {
  private cache: NodeCache

  constructor() {
    this.cache = new NodeCache({
      stdTTL: 3600, // 기본 1시간
      checkperiod: 120, // 2분마다 만료된 키 체크
      useClones: false, // 성능 향상을 위해 클론 비활성화
    })

    console.log('✅ In-memory cache initialized')
  }

  async get<T>(key: string): Promise<T | null> {
    const value = this.cache.get<T>(key)
    return value !== undefined ? value : null
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      this.cache.set(key, value, ttlSeconds)
    } else {
      this.cache.set(key, value)
    }
  }

  async del(key: string): Promise<void> {
    this.cache.del(key)
  }

  async clear(): Promise<void> {
    this.cache.flushAll()
  }

  async has(key: string): Promise<boolean> {
    return this.cache.has(key)
  }
}

// 캐시 팩토리
function createCache(): Cache {
  const redisUrl = process.env.REDIS_URL

  if (redisUrl) {
    console.log('🔄 Using Redis cache')
    return new RedisCache(redisUrl)
  } else {
    console.log('🔄 Using in-memory cache (Redis not configured)')
    return new MemoryCache()
  }
}

// 싱글톤 캐시 인스턴스
let cacheInstance: Cache | null = null

export function getCache(): Cache {
  if (!cacheInstance) {
    cacheInstance = createCache()
  }
  return cacheInstance
}

// 캐시 키 생성 유틸리티
export class CacheKeys {
  // 사주 분석 결과 캐시 키
  static saju(
    birthDate: Date,
    birthTime: string | undefined,
    isLunar: boolean,
    gender: string
  ): string {
    const timeStr = birthTime || 'unknown'
    const dateStr = birthDate.toISOString().split('T')[0]
    return `saju:${dateStr}:${timeStr}:${isLunar}:${gender}`
  }

  // 십성 분석 결과 캐시 키
  static sipseong(sajuKey: string): string {
    return `sipseong:${sajuKey}`
  }

  // 대운 분석 결과 캐시 키
  static daeun(sajuKey: string, currentAge: number): string {
    return `daeun:${sajuKey}:${currentAge}`
  }

  // 격국 분석 결과 캐시 키
  static gyeokguk(sajuKey: string): string {
    return `gyeokguk:${sajuKey}`
  }

  // 신살 분석 결과 캐시 키
  static sinsal(sajuKey: string): string {
    return `sinsal:${sajuKey}`
  }

  // 육친 분석 결과 캐시 키
  static yukchin(sajuKey: string, gender: string): string {
    return `yukchin:${sajuKey}:${gender}`
  }

  // Rate limiting 키
  static rateLimit(identifier: string, endpoint: string): string {
    return `ratelimit:${endpoint}:${identifier}`
  }

  // LLM 응답 캐시 키 (동일한 요청에 대한 캐싱)
  static llmResponse(hash: string): string {
    return `llm:${hash}`
  }
}

// TTL (Time To Live) 상수
export const CacheTTL = {
  SAJU_ANALYSIS: 3600 * 24 * 7, // 7일 (사주는 변하지 않음)
  LLM_RESPONSE: 3600 * 24, // 1일 (AI 응답)
  RATE_LIMIT: 60, // 1분 (rate limiting window)
  HANJA_DATA: 3600 * 24 * 30, // 30일 (한자 데이터)
} as const
