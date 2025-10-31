# 성능 최적화 가이드

## 개요

이 문서는 한국어 작명 서비스의 성능 최적화에 대한 가이드입니다. 캐싱과 Rate Limiting을 통해 API 응답 속도를 개선하고 과도한 요청을 방지합니다.

## 주요 기능

### 1. 캐싱 시스템 (Caching)

동일한 요청에 대해 중복 계산을 방지하고 빠른 응답을 제공합니다.

#### 지원하는 캐싱 방식

- **Redis Cache** (프로덕션 환경 권장)
  - 분산 캐싱 지원
  - 여러 서버 간 캐시 공유 가능
  - 서버 재시작 후에도 캐시 유지

- **In-Memory Cache** (개발 환경)
  - Redis 설정 없이도 동작
  - 단일 서버 환경에서 빠른 성능
  - 서버 재시작 시 캐시 초기화

#### 캐시 적용 대상

| 대상 | TTL | 설명 |
|------|-----|------|
| 사주 분석 결과 | 7일 | 생년월일시는 변하지 않으므로 장기 캐싱 |
| LLM 응답 | 1일 | AI 작명 결과 (동일 요청에 대해) |
| Rate Limit 카운터 | 1분 | 요청 제한 추적 |
| 한자 데이터 | 30일 | 한자 정보 (거의 변경되지 않음) |

#### 캐시 키 구조

```typescript
// 사주 분석
saju:{date}:{time}:{isLunar}:{gender}

// 예시
saju:1990-05-15:14:30:false:FEMALE

// 대운 분석 (나이 포함)
saju:1990-05-15:14:30:false:FEMALE:age35

// 십성 분석
sipseong:{sajuKey}

// Rate limiting
ratelimit:{endpoint}:{ip}
```

### 2. Rate Limiting

API 엔드포인트별로 요청 횟수를 제한하여 서버 과부하를 방지합니다.

#### 엔드포인트별 제한

| 엔드포인트 | 제한 | 설명 |
|-----------|------|------|
| `/api/saju/analyze` | 10회/분 | 사주 분석 (계산 비용 중간) |
| `/api/naming/generate` | 5회/분 | AI 작명 (LLM 비용 고려) |
| `/api/naming/analyze-and-generate` | 3회/분 | 통합 분석 (가장 무거운 작업) |
| 기타 API | 30회/분 | 일반 API |

#### Rate Limit 응답 헤더

API 응답에 다음 헤더가 포함됩니다:

```http
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 2025-10-31T12:34:56.789Z
```

#### Rate Limit 초과 시

```json
{
  "error": "Too many requests. Please try again later.",
  "retryAfter": "2025-10-31T12:34:56.789Z"
}
```

HTTP Status: `429 Too Many Requests`

### 3. LLM API Rate Limiting

Claude API 호출을 제한하여 비용을 관리합니다.

- **최소 호출 간격**: 1초
- **자동 대기**: API 호출 전 자동으로 대기
- **재시도 로직**: 429 에러 발생 시 exponential backoff로 재시도

## 설정 방법

### 1. Redis 설정 (프로덕션)

#### Docker Compose로 Redis 실행

```bash
cd naming-service
docker-compose up -d redis
```

#### 환경 변수 설정

`.env` 파일에 추가:

```bash
REDIS_URL="redis://localhost:6379"
```

#### Redis Cloud 사용 (Upstash 등)

```bash
REDIS_URL="rediss://default:password@redis.upstash.io:6379"
```

### 2. In-Memory Cache (개발 환경)

Redis 설정 없이도 자동으로 in-memory cache 사용:

```bash
# .env 파일에 REDIS_URL 없음
# 또는 주석 처리
# REDIS_URL="redis://localhost:6379"
```

서버 시작 시 다음 메시지가 표시됩니다:

```
🔄 Using in-memory cache (Redis not configured)
✅ In-memory cache initialized
```

### 3. Rate Limiting 커스터마이징

`lib/middleware/rate-limit.ts`에서 설정 변경:

```typescript
export const RateLimitPresets = {
  SAJU_ANALYSIS: {
    windowSeconds: 60,
    maxRequests: 10,  // 이 값을 변경
    endpoint: 'saju-analysis',
  },
  // ...
}
```

또는 LLM 호출 간격 변경:

```typescript
import { LLMRateLimiter } from '@/lib/middleware/rate-limit'

// 최소 간격을 2초로 변경
LLMRateLimiter.setMinInterval(2000)
```

## 사용 예시

### 1. 캐시 직접 사용

```typescript
import { getCache, CacheKeys, CacheTTL } from '@/lib/cache'

const cache = getCache()

// 데이터 저장
await cache.set('myKey', { data: 'value' }, CacheTTL.SAJU_ANALYSIS)

// 데이터 조회
const result = await cache.get<MyType>('myKey')

// 데이터 삭제
await cache.del('myKey')

// 캐시 전체 삭제
await cache.clear()
```

### 2. API 엔드포인트에 Rate Limiting 적용

```typescript
import { withRateLimit, RateLimitPresets } from '@/lib/middleware/rate-limit'

async function handleGET(req: NextRequest) {
  // 핸들러 로직
  return NextResponse.json({ data: 'result' })
}

// Rate limiting 적용
export const GET = withRateLimit(handleGET, RateLimitPresets.GENERAL)
```

### 3. 커스텀 Rate Limit 설정

```typescript
export const POST = withRateLimit(handlePOST, {
  windowSeconds: 300,  // 5분
  maxRequests: 20,     // 20회
  endpoint: 'custom-endpoint',
  message: '커스텀 에러 메시지',
})
```

## 성능 모니터링

### 캐시 히트/미스 확인

서버 로그에서 확인 가능:

```
✅ 캐시 히트: saju:1990-05-15:14:30:false:FEMALE
❌ 캐시 미스: saju:1990-05-15:14:30:false:FEMALE
💾 캐시 저장: saju:1990-05-15:14:30:false:FEMALE
```

### LLM 비용 추적

```typescript
import { getClaudeNamingService } from '@/lib/llm/claude'

const service = getClaudeNamingService()

// 오늘의 사용량
const todayStats = service.getTodayStats()
console.log(`오늘의 비용: $${todayStats.estimatedCost.toFixed(4)}`)
console.log(`토큰 사용: ${todayStats.totalTokens}`)

// 월별 사용량
const monthlyStats = service.getMonthlyStats(2025, 10)
console.log(`10월 비용: $${monthlyStats.estimatedCost.toFixed(2)}`)
```

## 성능 개선 효과

### 사주 분석 API

- **캐시 미스**: ~100-200ms (계산 포함)
- **캐시 히트**: ~10-20ms (90% 성능 향상)
- **동시 요청**: Rate limiting으로 서버 부하 방지

### AI 작명 API

- **첫 요청**: ~5-10초 (LLM 호출)
- **Rate limiting**: 분당 5회로 비용 제어
- **LLM 호출 간격**: 최소 1초로 API 안정성 확보

### 통합 API

- **캐시 미스**: ~5-10초 (분석 + LLM)
- **부분 캐시 히트**: ~5초 (LLM만 호출)
- **완전 캐시 히트**: ~20ms (모두 캐시)

## 주의사항

### 1. Redis 연결 실패

Redis 연결 실패 시 자동으로 in-memory cache로 전환:

```
❌ Redis connection failed: ECONNREFUSED
🔄 Using in-memory cache (Redis not configured)
✅ In-memory cache initialized
```

### 2. 캐시 무효화

사주 분석 로직이 변경되면 캐시를 수동으로 삭제해야 합니다:

```bash
# Redis CLI
redis-cli FLUSHDB

# 또는 특정 패턴 삭제
redis-cli --scan --pattern 'saju:*' | xargs redis-cli DEL
```

### 3. Rate Limit 테스트

개발 중 rate limit이 불편하면 임시로 제한을 높이거나 비활성화:

```typescript
// lib/middleware/rate-limit.ts
export const RateLimitPresets = {
  SAJU_ANALYSIS: {
    windowSeconds: 60,
    maxRequests: 999999,  // 사실상 무제한 (개발용)
    endpoint: 'saju-analysis',
  },
}
```

## 프로덕션 체크리스트

- [ ] Redis 서버 설정 (`REDIS_URL` 환경 변수)
- [ ] Redis 백업 설정
- [ ] Rate limit 설정 확인 (트래픽에 맞게 조정)
- [ ] 캐시 TTL 확인 (데이터 특성에 맞게 조정)
- [ ] 모니터링 설정 (캐시 히트율, API 응답 시간)
- [ ] LLM 비용 추적 설정

## 문제 해결

### Q: 캐시가 작동하지 않는 것 같아요

A: 서버 로그에서 "캐시 히트/미스" 메시지를 확인하세요. 동일한 요청을 두 번 보냈을 때 두 번째는 "캐시 히트"가 표시되어야 합니다.

### Q: Rate limit이 너무 엄격해요

A: `lib/middleware/rate-limit.ts`에서 `RateLimitPresets`의 `maxRequests` 값을 증가시키세요.

### Q: Redis 연결이 안 돼요

A: `.env` 파일의 `REDIS_URL`을 확인하고, Redis 서버가 실행 중인지 확인하세요. Redis 없이도 in-memory cache로 동작합니다.

### Q: LLM API가 너무 느려요

A: 첫 호출은 항상 5-10초가 소요됩니다. 동일한 요청은 캐싱되어 빠르게 응답합니다. Rate limiting으로 인해 연속 호출 시 1초씩 대기합니다.

## 참고 자료

- [Redis 공식 문서](https://redis.io/documentation)
- [Node-Cache 문서](https://www.npmjs.com/package/node-cache)
- [ioredis 문서](https://github.com/redis/ioredis)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
