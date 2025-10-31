/**
 * LLM 작명 시스템 타입 정의
 *
 * Claude API를 사용한 AI 작명 시스템의 타입을 정의합니다.
 */

import { Gender, NamingMethod } from '@prisma/client'
import { Saju, OhangAnalysis } from '../saju/types'
import { Ohang } from '../saju/types'

/**
 * 계절 조후 정보
 */
export interface SeasonalInfo {
  /** 계절 */
  season: 'SPRING' | 'SUMMER' | 'FALL' | 'WINTER'
  /** 계절 이름 (한글) */
  seasonName: string
  /** 주도 오행 */
  dominantElement: Ohang
  /** 약한 오행 */
  weakElements: Ohang[]
  /** 선호 용신 */
  preferredYongsin: Ohang[]
  /** 피해야 할 오행 */
  avoidedElements: Ohang[]
  /** 계절 설명 */
  description: string
  /** 계절 특성 */
  characteristics: string[]
  /** 조정 이유 */
  adjustmentReason?: string
  /** 조정 우선순위 */
  priority?: 'HIGH' | 'MEDIUM' | 'LOW'
}

/**
 * 십성 정보 (LLM 전달용)
 */
export interface SipseongInfo {
  /** 강한 십성 */
  strong: string[]
  /** 약한 십성 */
  weak: string[]
  /** 없는 십성 */
  missing: string[]
  /** 성격 특성 */
  personality: string[]
  /** 재능 및 적성 */
  talents: string[]
  /** 주의사항 */
  warnings: string[]
  /** 십성 개수 요약 */
  summary: string
}

/**
 * 대운 정보 (LLM 전달용)
 */
export interface DaeunInfo {
  /** 대운 방향 */
  direction: string
  /** 입운 연령 */
  startAge: number
  /** 현재 대운 */
  currentCycle?: {
    /** 대운 간지 */
    name: string
    /** 대운 한자 */
    hanja: string
    /** 시작-종료 나이 */
    ageRange: string
    /** 대운 십성 */
    sipseong: string
    /** 운세 흐름 */
    flow: string
    /** 강점 */
    strengths: string[]
    /** 주의사항 */
    warnings: string[]
    /** 적합한 활동 */
    suitableActivities: string[]
  }
  /** 다음 대운 */
  nextCycle?: {
    name: string
    hanja: string
    ageRange: string
  }
  /** 전체 대운 요약 */
  summary: string
}

/**
 * 격국 정보 (LLM 전달용)
 */
export interface GyeokgukInfo {
  /** 격국 이름 */
  gyeokguk: string
  /** 격국 분류 (정격/외격/기타) */
  category: '정격' | '외격' | '기타'
  /** 격국 강도 */
  strength: string
  /** 용신 (필요한 십성) */
  yongsin: string[]
  /** 희신 (도움되는 십성) */
  heesin: string[]
  /** 기신 (해로운 십성) */
  gisin: string[]
  /** 격국 설명 */
  description: string
  /** 성격 특성 */
  characteristics: string[]
  /** 직업 적성 */
  careerSuitability: string[]
  /** 재물운 */
  wealthLuck: string
  /** 명예운 */
  fameLuck: string
  /** 학업운 */
  academicLuck: string
  /** 주의사항 */
  warnings: string[]
}

/**
 * 사주 분석 요약 (LLM 전달용)
 */
export interface SajuAnalysisSummary {
  /** 년주 */
  year: string
  /** 월주 */
  month: string
  /** 일주 */
  day: string
  /** 시주 */
  hour: string
  /** 부족한 오행 */
  weakElements: Ohang[]
  /** 강한 오행 */
  strongElements: Ohang[]
  /** 결여된 오행 */
  missingElements: Ohang[]
  /** 용신 (도움이 되는 오행) */
  yongsin: Ohang[]
  /** 기신 (해로운 오행) */
  gisin: Ohang[]
  /** 계절 조후 정보 (선택사항) */
  seasonalInfo?: SeasonalInfo
  /** 십성 분석 정보 (선택사항) */
  sipseongInfo?: SipseongInfo
  /** 대운 분석 정보 (선택사항) */
  daeunInfo?: DaeunInfo
  /** 격국 분석 정보 (선택사항) */
  gyeokgukInfo?: GyeokgukInfo
}

/**
 * 사용자 정의 가중치
 */
export interface CustomWeights {
  /** 사주 오행 조화 가중치 (0-100) */
  saju?: number
  /** 획수 길흉 가중치 (0-100) */
  strokes?: number
  /** 발음 자연스러움 가중치 (0-100) */
  phonetics?: number
  /** 의미 적절성 가중치 (0-100) */
  meaning?: number
  /** 현대적 감각 가중치 (0-100) */
  modernity?: number
  /** 독창성 가중치 (0-100) */
  uniqueness?: number
}

/**
 * 작명 선호도
 */
export interface NamingPreferences {
  /** 원하는 의미 키워드 */
  meaningKeywords?: string[]
  /** 피할 글자 */
  avoidCharacters?: string[]
  /** 피할 발음 */
  avoidSounds?: string[]
  /** 선호하는 글자 수 (2자, 3자 등) */
  preferredLength?: number
  /** 한글 전용 여부 (한자 사용 안함) */
  koreanOnly?: boolean
  /** 특별한 요청사항 */
  specialRequests?: string
  /** 사용자 정의 가중치 (합계가 100이 되도록 자동 정규화) */
  customWeights?: CustomWeights
}

/**
 * LLM 작명 요청 파라미터
 */
export interface NamingRequest {
  /** 성씨 */
  familyName: string
  /** 성별 */
  gender: Gender
  /** 생년월일 */
  birthDate?: Date
  /** 출생 시간 (24시간 형식, 예: "14:30") */
  birthTime?: string
  /** 음력 여부 */
  isLunar?: boolean
  /** 사주 분석 결과 */
  sajuAnalysis?: SajuAnalysisSummary
  /** 작명 방법 */
  method: NamingMethod
  /** 선호도 */
  preferences?: NamingPreferences
}

/**
 * 한자 옵션
 */
export interface HanjaOption {
  /** 한자 (예: "智優") */
  characters: string
  /** 각 글자의 의미 (예: ["지혜로울 지", "뛰어날 우"]) */
  meanings: string[]
  /** 각 글자의 획수 */
  strokes: number[]
  /** 각 글자의 오행 */
  ohang: string[]
}

/**
 * 궁합도 점수
 */
export interface CompatibilityScores {
  /** 사주 궁합 점수 (0-100) */
  saju?: number
  /** 오행 조화 점수 (0-100) */
  ohang?: number
  /** 획수 길흉 점수 (0-100) */
  strokes?: number
  /** 음운 조화 점수 (0-100) */
  phonetics?: number
  /** 종합 점수 (0-100) */
  total: number
}

/**
 * 이름 제안
 */
export interface NameSuggestion {
  /** 이름 (한글, 예: "지우") */
  name: string
  /** 한자 옵션들 (여러 한자 조합 가능) */
  hanjaOptions?: HanjaOption[]
  /** 발음 (로마자 표기 포함) */
  pronunciation: string
  /** 이름의 전체 의미 */
  meaning: string
  /** 음운학적 특징 설명 */
  phonetics: string
  /** 궁합도 점수 */
  compatibility: CompatibilityScores
  /** 추천 이유 */
  reasoning: string
}

/**
 * LLM 응답 (파싱 전 원시 데이터)
 */
export interface LLMRawResponse {
  /** 제안된 이름들 */
  suggestions: NameSuggestion[]
}

/**
 * LLM 작명 응답 (검증 및 보강 완료)
 */
export interface NamingResponse {
  /** 제안된 이름들 */
  suggestions: NameSuggestion[]
  /** 사용된 토큰 수 */
  tokensUsed: {
    input: number
    output: number
    total: number
  }
  /** 응답 생성 시간 (밀리초) */
  duration: number
  /** 요청 ID */
  requestId: string
}

/**
 * API 사용 통계
 */
export interface UsageStats {
  /** 입력 토큰 수 */
  inputTokens: number
  /** 출력 토큰 수 */
  outputTokens: number
  /** 총 토큰 수 */
  totalTokens: number
  /** 예상 비용 (USD) */
  estimatedCost: number
}

/**
 * 에러 타입
 */
export type LLMErrorType =
  | 'API_KEY_MISSING'
  | 'API_ERROR'
  | 'TIMEOUT'
  | 'RATE_LIMIT'
  | 'INVALID_RESPONSE'
  | 'PARSING_ERROR'
  | 'VALIDATION_ERROR'
  | 'UNKNOWN'

/**
 * LLM 에러
 */
export class LLMError extends Error {
  type: LLMErrorType
  statusCode?: number
  originalError?: Error

  constructor(
    message: string,
    type: LLMErrorType = 'UNKNOWN',
    statusCode?: number,
    originalError?: Error
  ) {
    super(message)
    this.name = 'LLMError'
    this.type = type
    this.statusCode = statusCode
    this.originalError = originalError
  }
}

/**
 * 프롬프트 컨텍스트 (프롬프트 생성에 필요한 모든 정보)
 */
export interface PromptContext {
  /** 요청 파라미터 */
  request: NamingRequest
  /** 현재 날짜 (컨텍스트용) */
  currentDate?: Date
}

/**
 * 재시도 옵션
 */
export interface RetryOptions {
  /** 최대 재시도 횟수 */
  maxRetries: number
  /** 초기 지연 시간 (밀리초) */
  initialDelay: number
  /** 지연 시간 배수 (exponential backoff) */
  multiplier: number
  /** 최대 지연 시간 (밀리초) */
  maxDelay: number
}

/**
 * Claude API 설정
 */
export interface ClaudeConfig {
  /** API 키 */
  apiKey: string
  /** 모델 */
  model?: string
  /** 최대 토큰 수 */
  maxTokens?: number
  /** Temperature (0-1) */
  temperature?: number
  /** 타임아웃 (밀리초) */
  timeout?: number
  /** 재시도 옵션 */
  retry?: RetryOptions
}

/**
 * 비용 추적 정보
 */
export interface CostTracking {
  /** 요청 ID */
  requestId: string
  /** 타임스탬프 */
  timestamp: Date
  /** 입력 토큰 */
  inputTokens: number
  /** 출력 토큰 */
  outputTokens: number
  /** 총 토큰 */
  totalTokens: number
  /** 예상 비용 (USD) */
  estimatedCost: number
  /** 사용자 ID (옵션) */
  userId?: string
  /** 요청 타입 */
  requestType: 'naming'
}
