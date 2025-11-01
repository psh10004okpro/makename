/**
 * 대화 세션 저장소
 * - 캐시 기반으로 세션을 저장하고 관리합니다
 */

import { getCache } from '@/lib/cache'
import { ChatSession, SessionStore, NamingContext, ChatStage } from './types'

/**
 * 세션 TTL: 1시간 (3600초)
 */
const SESSION_TTL = 3600

/**
 * 캐시 기반 세션 저장소
 */
export class CacheSessionStore implements SessionStore {
  private cache = getCache()

  private getKey(sessionId: string): string {
    return `chat:session:${sessionId}`
  }

  async get(sessionId: string): Promise<ChatSession | null> {
    const key = this.getKey(sessionId)
    const data = await this.cache.get<any>(key)

    if (!data) {
      return null
    }

    // Date 객체 복원
    return {
      ...data,
      messages: data.messages.map((m: any) => ({
        ...m,
        timestamp: new Date(m.timestamp),
      })),
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      expiresAt: new Date(data.expiresAt),
    }
  }

  async set(session: ChatSession): Promise<void> {
    const key = this.getKey(session.sessionId)
    await this.cache.set(key, session, SESSION_TTL)
  }

  async delete(sessionId: string): Promise<void> {
    const key = this.getKey(sessionId)
    await this.cache.del(key)
  }

  async cleanup(): Promise<void> {
    // 캐시 시스템이 자동으로 만료된 항목을 처리함
    console.log('세션 정리 완료 (TTL 기반 자동 만료)')
  }
}

/**
 * 싱글톤 인스턴스
 */
let _store: SessionStore | null = null

export function getSessionStore(): SessionStore {
  if (!_store) {
    _store = new CacheSessionStore()
  }
  return _store
}

/**
 * 새 세션 생성
 */
export function createNewSession(userId?: string): ChatSession {
  const now = new Date()
  const expiresAt = new Date(now.getTime() + SESSION_TTL * 1000)

  const session: ChatSession = {
    sessionId: generateSessionId(),
    userId,
    messages: [],
    context: {
      collectedInfo: {
        target: false,
        basicInfo: false,
        preferences: false,
        specialRequests: false,
      },
    },
    stage: 'greeting',
    createdAt: now,
    updatedAt: now,
    expiresAt,
  }

  return session
}

/**
 * 세션 ID 생성
 */
function generateSessionId(): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)
  return `chat_${timestamp}_${random}`
}

/**
 * 세션 업데이트 헬퍼
 */
export async function updateSession(
  sessionId: string,
  updates: Partial<ChatSession>
): Promise<ChatSession> {
  const store = getSessionStore()
  const session = await store.get(sessionId)

  if (!session) {
    throw new Error(`세션을 찾을 수 없습니다: ${sessionId}`)
  }

  const updatedSession: ChatSession = {
    ...session,
    ...updates,
    updatedAt: new Date(),
  }

  await store.set(updatedSession)
  return updatedSession
}

/**
 * 메시지 추가
 */
export async function addMessage(
  sessionId: string,
  role: 'user' | 'assistant',
  content: string
): Promise<ChatSession> {
  const store = getSessionStore()
  const session = await store.get(sessionId)

  if (!session) {
    throw new Error(`세션을 찾을 수 없습니다: ${sessionId}`)
  }

  const newMessage = {
    role,
    content,
    timestamp: new Date(),
  }

  const updatedSession: ChatSession = {
    ...session,
    messages: [...session.messages, newMessage],
    updatedAt: new Date(),
  }

  await store.set(updatedSession)
  return updatedSession
}

/**
 * 컨텍스트 업데이트
 */
export async function updateContext(
  sessionId: string,
  contextUpdates: Partial<NamingContext>
): Promise<ChatSession> {
  const store = getSessionStore()
  const session = await store.get(sessionId)

  if (!session) {
    throw new Error(`세션을 찾을 수 없습니다: ${sessionId}`)
  }

  const updatedSession: ChatSession = {
    ...session,
    context: {
      ...session.context,
      ...contextUpdates,
    },
    updatedAt: new Date(),
  }

  await store.set(updatedSession)
  return updatedSession
}

/**
 * 단계 업데이트
 */
export async function updateStage(
  sessionId: string,
  stage: ChatStage
): Promise<ChatSession> {
  return updateSession(sessionId, { stage })
}
