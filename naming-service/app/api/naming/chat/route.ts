/**
 * 대화형 작명 챗봇 API 엔드포인트
 *
 * POST /api/naming/chat
 * - 사용자와 대화하며 이름을 추천하는 챗봇
 */

import { NextRequest, NextResponse } from 'next/server'
import { processChat, getSession, deleteSession } from '@/lib/chat/service'
import { ChatRequest, ChatResponse } from '@/lib/chat/types'
import { withRateLimit, RateLimitPresets } from '@/lib/middleware/rate-limit'

interface ChatApiRequest {
  /** 세션 ID (없으면 새 세션 생성) */
  sessionId?: string
  /** 사용자 메시지 */
  message: string
  /** 사용자 ID (선택사항) */
  userId?: string
}

interface ChatApiResponse {
  success: boolean
  data?: ChatResponse
  error?: string
}

async function handlePOST(request: NextRequest): Promise<NextResponse<ChatApiResponse>> {
  try {
    const body: ChatApiRequest = await request.json()

    // 필수 파라미터 검증
    if (!body.message || body.message.trim() === '') {
      return NextResponse.json(
        {
          success: false,
          error: '메시지(message)는 필수입니다.',
        },
        { status: 400 }
      )
    }

    // 채팅 요청 구성
    const chatRequest: ChatRequest = {
      sessionId: body.sessionId,
      message: body.message.trim(),
      userId: body.userId,
    }

    console.log('💬 채팅 요청:', {
      sessionId: chatRequest.sessionId || '(새 세션)',
      messageLength: chatRequest.message.length,
    })

    // 채팅 처리
    const response = await processChat(chatRequest)

    console.log('✅ 채팅 응답 생성:', {
      sessionId: response.sessionId,
      stage: response.stage,
      messageLength: response.message.length,
    })

    return NextResponse.json({
      success: true,
      data: response,
    })
  } catch (error: any) {
    console.error('채팅 API 오류:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || '채팅 처리 중 오류가 발생했습니다.',
      },
      { status: 500 }
    )
  }
}

/**
 * GET: 세션 정보 조회
 */
async function handleGET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json(
        {
          success: false,
          error: 'sessionId 파라미터가 필요합니다.',
        },
        { status: 400 }
      )
    }

    const session = await getSession(sessionId)

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: '세션을 찾을 수 없습니다.',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        sessionId: session.sessionId,
        messages: session.messages,
        context: session.context,
        stage: session.stage,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
      },
    })
  } catch (error: any) {
    console.error('세션 조회 오류:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || '세션 조회 중 오류가 발생했습니다.',
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE: 세션 삭제
 */
async function handleDELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json(
        {
          success: false,
          error: 'sessionId 파라미터가 필요합니다.',
        },
        { status: 400 }
      )
    }

    await deleteSession(sessionId)

    return NextResponse.json({
      success: true,
      message: '세션이 삭제되었습니다.',
    })
  } catch (error: any) {
    console.error('세션 삭제 오류:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || '세션 삭제 중 오류가 발생했습니다.',
      },
      { status: 500 }
    )
  }
}

// Rate limiting 적용 (AI 작명과 동일하게 5회/분)
export const POST = withRateLimit(handlePOST, RateLimitPresets.AI_NAMING)
export const GET = handleGET
export const DELETE = handleDELETE
