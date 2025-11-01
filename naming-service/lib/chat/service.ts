/**
 * 대화형 작명 챗봇 서비스
 */

import Anthropic from '@anthropic-ai/sdk'
import { ChatSession, ChatRequest, ChatResponse, NamingContext } from './types'
import {
  getSessionStore,
  createNewSession,
  addMessage,
  updateContext,
  updateStage,
} from './session-store'
import {
  NAMING_EXPERT_SYSTEM_PROMPT,
  createContextPrompt,
  formatMessagesForClaude,
} from './prompts'
import { LLMRateLimiter } from '@/lib/middleware/rate-limit'

/**
 * Claude 클라이언트
 */
function getClaudeClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY가 설정되지 않았습니다.')
  }

  return new Anthropic({
    apiKey,
    timeout: 120000, // 2분
  })
}

/**
 * 채팅 처리 메인 함수
 */
export async function processChat(request: ChatRequest): Promise<ChatResponse> {
  const store = getSessionStore()

  // 1. 세션 가져오기 또는 생성
  let session: ChatSession
  if (request.sessionId) {
    const existingSession = await store.get(request.sessionId)
    if (existingSession) {
      session = existingSession
    } else {
      // 세션이 만료되었거나 없음 - 새로 생성
      session = createNewSession(request.userId)
    }
  } else {
    // 새 세션 생성
    session = createNewSession(request.userId)
  }

  // 2. 사용자 메시지 추가
  session = await addMessage(session.sessionId, 'user', request.message)

  // 3. Claude API 호출
  const assistantMessage = await callClaudeAPI(session)

  // 4. 어시스턴트 메시지 추가
  session = await addMessage(session.sessionId, 'assistant', assistantMessage)

  // 5. 컨텍스트 분석 및 업데이트
  session = await analyzeAndUpdateContext(session, request.message, assistantMessage)

  // 6. 응답 생성
  const response: ChatResponse = {
    sessionId: session.sessionId,
    message: assistantMessage,
    stage: session.stage,
    context: session.context,
  }

  return response
}

/**
 * Claude API 호출
 */
async function callClaudeAPI(session: ChatSession): Promise<string> {
  const client = getClaudeClient()

  // Rate limiting
  await LLMRateLimiter.waitForNextCall()

  // 시스템 프롬프트 구성
  const systemPrompt = `${NAMING_EXPERT_SYSTEM_PROMPT}

${createContextPrompt(session.context)}

현재 대화 단계: ${session.stage}`

  // 메시지 준비
  const messages = formatMessagesForClaude(session)

  console.log('🤖 Claude API 호출 시작')
  console.log('메시지 수:', messages.length)
  console.log('단계:', session.stage)

  // API 호출
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    temperature: 0.8, // 창의적인 이름 제안을 위해 약간 높게
    system: systemPrompt,
    messages,
  })

  // 응답 추출
  const content = response.content
    .filter((block) => block.type === 'text')
    .map((block) => (block as { type: 'text'; text: string }).text)
    .join('\n')

  console.log('✅ Claude API 응답 받음')
  console.log('토큰 사용:', response.usage.input_tokens, '/', response.usage.output_tokens)

  return content
}

/**
 * 컨텍스트 분석 및 업데이트
 * 사용자 메시지와 어시스턴트 응답을 분석하여 컨텍스트를 자동으로 업데이트
 */
async function analyzeAndUpdateContext(
  session: ChatSession,
  userMessage: string,
  assistantMessage: string
): Promise<ChatSession> {
  const contextUpdates: Partial<NamingContext> = {}

  // 작명 대상 감지
  if (!session.context.target) {
    if (
      userMessage.match(/아기|아이|신생아|태어|출산/i) ||
      assistantMessage.match(/아기 이름/)
    ) {
      contextUpdates.target = 'baby'
      contextUpdates.collectedInfo = {
        ...session.context.collectedInfo,
        target: true,
      }
    } else if (userMessage.match(/회사|브랜드|상호|기업|스타트업/i)) {
      contextUpdates.target = 'company'
      contextUpdates.collectedInfo = {
        ...session.context.collectedInfo,
        target: true,
      }
    } else if (userMessage.match(/반려동물|강아지|고양이|애완동물|펫/i)) {
      contextUpdates.target = 'pet'
      contextUpdates.collectedInfo = {
        ...session.context.collectedInfo,
        target: true,
      }
    }
  }

  // 성별 감지
  if (session.context.target === 'baby' && !session.context.gender) {
    if (userMessage.match(/아들|남자|남아/i)) {
      contextUpdates.gender = 'male'
    } else if (userMessage.match(/딸|여자|여아/i)) {
      contextUpdates.gender = 'female'
    } else if (userMessage.match(/중성|상관없|남녀 공용/i)) {
      contextUpdates.gender = 'neutral'
    }
  }

  // 성씨 감지 (1-2글자 + "씨" 또는 "성은")
  if (session.context.target === 'baby' && !session.context.familyName) {
    const familyNameMatch = userMessage.match(
      /(김|이|박|최|정|강|조|윤|장|임|한|오|서|신|권|황|안|송|류|전|홍|고|문|손|배|조|백|허|유|남|심|노|하|곽|성|차|주|우|구|신|임|라|전|민|석|선|설|마|길|연|방|원|염|옥|도|소|양|변|빈|사|승|여|은|편|호)([가-힣]{0,1})(씨|성은|성|입니다)/i
    )
    if (familyNameMatch) {
      contextUpdates.familyName = familyNameMatch[1] + (familyNameMatch[2] || '')
    }
  }

  // 스타일 감지
  if (!session.context.style) {
    if (userMessage.match(/전통|고전|한자|고풍/i)) {
      contextUpdates.style = 'traditional'
    } else if (userMessage.match(/현대|모던|세련|트렌디|요즘/i)) {
      contextUpdates.style = 'modern'
    } else if (userMessage.match(/독특|유니크|특별|개성/i)) {
      contextUpdates.style = 'unique'
    }
  }

  // 대화 단계 업데이트
  let newStage = session.stage

  // 인사 단계에서 작명 대상이 파악되면 기본 정보 수집으로
  if (session.stage === 'greeting' && contextUpdates.target) {
    newStage = 'collecting_basic'
  }

  // 기본 정보가 어느 정도 모이면 선호도 수집으로
  if (
    session.stage === 'collecting_basic' &&
    session.context.target &&
    (session.context.familyName || session.context.industry || session.context.petType)
  ) {
    newStage = 'collecting_preferences'
  }

  // 이름 추천이 시작되었는지 감지
  if (
    assistantMessage.match(/추천|제안|이름을 지어|어떠세요/i) &&
    assistantMessage.match(/\*\*\d+\.|1\.|①/)
  ) {
    newStage = 'suggesting_names'
  }

  // 컨텍스트 업데이트
  if (Object.keys(contextUpdates).length > 0) {
    session = await updateContext(session.sessionId, contextUpdates)
  }

  // 단계 업데이트
  if (newStage !== session.stage) {
    session = await updateStage(session.sessionId, newStage)
  }

  return session
}

/**
 * 세션 가져오기
 */
export async function getSession(sessionId: string): Promise<ChatSession | null> {
  const store = getSessionStore()
  return store.get(sessionId)
}

/**
 * 세션 삭제
 */
export async function deleteSession(sessionId: string): Promise<void> {
  const store = getSessionStore()
  await store.delete(sessionId)
}
