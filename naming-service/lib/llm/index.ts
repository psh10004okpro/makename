/**
 * LLM 작명 시스템 통합 모듈
 *
 * Claude API를 사용한 AI 작명 시스템의 모든 기능을 통합하여 제공합니다.
 */

// 타입
export type {
  NamingRequest,
  NamingResponse,
  NameSuggestion,
  HanjaOption,
  CompatibilityScores,
  SajuAnalysisSummary,
  NamingPreferences,
  ClaudeConfig,
  UsageStats,
  CostTracking,
  LLMErrorType,
  PromptContext,
  RetryOptions,
} from './types'

export { LLMError } from './types'

// Claude 서비스
export {
  ClaudeNamingService,
  generateNames,
  getClaudeNamingService,
  resetClaudeNamingService,
} from './claude'

// 프롬프트
export {
  NAMING_SYSTEM_PROMPT,
  createUserPrompt,
  createFullPrompt,
  createRetryPrompt,
  createTestPrompt,
} from './prompts'

// 검증
export {
  validateLLMResponse,
  validateAndRefineLLMResponse,
  extractAndParseJSON,
  refineSuggestions,
  validateResponseQuality,
} from './validator'

// 품질 평가
export {
  NameQualityEvaluator,
  nameQualityEvaluator,
  type QualityAssessment,
  type QualityReport,
  type QualityCriteria,
} from './quality-evaluator'

// 프롬프트 버전 관리
export {
  type PromptVersion,
  PROMPT_V1,
  PROMPT_V2,
  PROMPT_V3,
  PROMPT_VERSIONS,
  getActivePrompt,
  getPromptVersion,
  getLatestPrompt,
} from './prompt-versions'

// A/B 테스트
export {
  ABTester,
  abTester,
  type ABTestResult,
  type VersionResult,
  type ABTestConfig,
} from './ab-test'

// 리포트 생성
export {
  printQualityReport,
  printDetailedAssessment,
  printABTestResult,
  generateMarkdownReport,
  generateCSV,
} from './report-generator'

/**
 * 기본 사용 예시
 *
 * @example
 * ```typescript
 * import { generateNames } from '@/lib/llm'
 *
 * const response = await generateNames({
 *   familyName: '김',
 *   gender: 'FEMALE',
 *   birthDate: new Date('1990-01-15'),
 *   method: 'HYBRID',
 *   preferences: {
 *     meaningKeywords: ['지혜', '아름다움'],
 *   },
 *   sajuAnalysis: {
 *     year: '기사년',
 *     month: '정축월',
 *     day: '경진일',
 *     hour: '계미시',
 *     weakElements: ['목'],
 *     strongElements: ['토'],
 *     missingElements: [],
 *     yongsin: ['목', '수'],
 *     gisin: ['토'],
 *   },
 * })
 *
 * console.log(`${response.suggestions.length}개의 이름을 생성했습니다.`)
 * console.log(`사용 토큰: ${response.tokensUsed.total}`)
 * console.log(`소요 시간: ${response.duration}ms`)
 *
 * response.suggestions.forEach(suggestion => {
 *   console.log(`- ${suggestion.name}: ${suggestion.meaning}`)
 * })
 * ```
 *
 * @example 비용 추적
 * ```typescript
 * import { getClaudeNamingService } from '@/lib/llm'
 *
 * const service = getClaudeNamingService()
 *
 * // 오늘의 사용 통계
 * const todayStats = service.getTodayStats()
 * console.log(`오늘 사용량: ${todayStats.totalTokens} tokens`)
 * console.log(`예상 비용: $${todayStats.estimatedCost.toFixed(4)}`)
 *
 * // 이번 달 사용 통계
 * const monthlyStats = service.getMonthlyStats(2025, 11)
 * console.log(`11월 총 비용: $${monthlyStats.estimatedCost.toFixed(2)}`)
 * ```
 */
