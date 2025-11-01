/**
 * 대화형 작명 챗봇 타입 정의
 */

export type MessageRole = 'user' | 'assistant' | 'system'

export interface ChatMessage {
  role: MessageRole
  content: string
  timestamp: Date
}

export type NamingTarget = 'baby' | 'company' | 'pet' | 'other'
export type NamingStyle = 'traditional' | 'modern' | 'unique' | 'neutral'
export type Gender = 'male' | 'female' | 'neutral'

/**
 * 작명 컨텍스트 - 대화를 통해 수집된 정보
 */
export interface NamingContext {
  // 공통 정보
  target?: NamingTarget
  style?: NamingStyle
  desiredMeaning?: string[] // 담고 싶은 의미
  specialRequests?: string // 특별 요청사항

  // 아기 이름
  familyName?: string
  gender?: Gender
  birthDate?: string
  birthTime?: string
  isLunar?: boolean
  generationChar?: string // 항렬자
  useHanja?: boolean
  avoidChars?: string[] // 피해야 할 한자/발음
  avoidSounds?: string[] // 피해야 할 발음

  // 회사/브랜드명
  industry?: string // 업종
  targetAudience?: string // 타겟 고객
  brandConcept?: string // 브랜드 컨셉
  languagePreference?: 'korean' | 'english' | 'mixed' // 언어 선호
  needDomain?: boolean // 도메인 필요 여부

  // 반려동물 이름
  petType?: string // 동물 종류
  petBreed?: string // 품종
  petGender?: Gender
  petCharacteristics?: string // 특징

  // 사주팔자 정보 (요청 시)
  sajuAnalysis?: any

  // 수집 진행도
  collectedInfo: {
    target: boolean
    basicInfo: boolean
    preferences: boolean
    specialRequests: boolean
  }

  // 추천된 이름들
  suggestedNames?: Array<{
    name: string
    hanja?: string
    meaning: string
    pronunciation?: string
    sajuCompatibility?: string
    modernFeeling?: string
    reason: string
  }>

  // 사용자 피드백
  userFeedback?: {
    likedNames: string[]
    dislikedNames: string[]
    feedbackComments: string[]
  }
}

/**
 * 채팅 세션
 */
export interface ChatSession {
  sessionId: string
  userId?: string
  messages: ChatMessage[]
  context: NamingContext
  stage: ChatStage
  createdAt: Date
  updatedAt: Date
  expiresAt: Date
}

/**
 * 대화 단계
 */
export type ChatStage =
  | 'greeting' // 인사 및 작명 대상 파악
  | 'collecting_basic' // 기본 정보 수집
  | 'collecting_preferences' // 선호도 수집
  | 'suggesting_names' // 이름 추천
  | 'refining' // 수정 및 개선
  | 'finalizing' // 최종 확정
  | 'completed' // 완료

/**
 * 채팅 요청
 */
export interface ChatRequest {
  sessionId?: string // 없으면 새 세션 생성
  message: string
  userId?: string
}

/**
 * 채팅 응답
 */
export interface ChatResponse {
  sessionId: string
  message: string
  suggestions?: Array<{
    name: string
    hanja?: string
    meaning: string
    details: string
  }>
  stage: ChatStage
  nextQuestions?: string[] // 다음 질문 제안
  context: NamingContext
}

/**
 * 세션 저장소 인터페이스
 */
export interface SessionStore {
  get(sessionId: string): Promise<ChatSession | null>
  set(session: ChatSession): Promise<void>
  delete(sessionId: string): Promise<void>
  cleanup(): Promise<void> // 만료된 세션 정리
}
