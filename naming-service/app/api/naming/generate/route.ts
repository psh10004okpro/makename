/**
 * AI 작명 API 엔드포인트
 *
 * POST /api/naming/generate
 * - 사주 분석 결과를 포함하여 AI가 이름을 생성합니다.
 */

import { NextRequest, NextResponse } from 'next/server'
import { generateNames } from '@/lib/llm'
import type { NamingRequest, NamingResponse } from '@/lib/llm'
import { withRateLimit, RateLimitPresets } from '@/lib/middleware/rate-limit'

interface GenerateNamesApiRequest {
  /** 성씨 */
  familyName: string
  /** 성별 */
  gender: 'MALE' | 'FEMALE'
  /** 생년월일 (ISO 8601 형식) */
  birthDate?: string
  /** 출생 시간 */
  birthTime?: string
  /** 음력 여부 */
  isLunar?: boolean
  /** 작명 방법 */
  method: 'TRADITIONAL' | 'MODERN' | 'HYBRID' | 'CREATIVE' | 'INTERNATIONAL'
  /** 사주 분석 결과 (선택사항) */
  sajuAnalysis?: {
    year: string
    month: string
    day: string
    hour: string
    weakElements: string[]
    strongElements: string[]
    missingElements: string[]
    yongsin: string[]
    gisin: string[]
    seasonalInfo?: any
    sipseongInfo?: any
    daeunInfo?: any
    gyeokgukInfo?: any
  }
  /** 선호도 */
  preferences?: {
    meaningKeywords?: string[]
    avoidCharacters?: string[]
    avoidSounds?: string[]
    preferredLength?: number
    koreanOnly?: boolean
    specialRequests?: string
    customWeights?: {
      saju?: number
      strokes?: number
      phonetics?: number
      meaning?: number
      modernity?: number
      uniqueness?: number
    }
  }
}

interface GenerateNamesApiResponse {
  success: boolean
  data?: NamingResponse
  error?: string
}

async function handlePOST(
  request: NextRequest
): Promise<NextResponse<GenerateNamesApiResponse>> {
  try {
    const body: GenerateNamesApiRequest = await request.json()

    // 필수 파라미터 검증
    if (!body.familyName) {
      return NextResponse.json(
        {
          success: false,
          error: '성씨(familyName)는 필수입니다.',
        },
        { status: 400 }
      )
    }

    if (!body.gender || !['MALE', 'FEMALE'].includes(body.gender)) {
      return NextResponse.json(
        {
          success: false,
          error: '성별(gender)은 MALE 또는 FEMALE이어야 합니다.',
        },
        { status: 400 }
      )
    }

    if (!body.method) {
      return NextResponse.json(
        {
          success: false,
          error: '작명 방법(method)은 필수입니다.',
        },
        { status: 400 }
      )
    }

    // NamingRequest 구성
    const namingRequest: NamingRequest = {
      familyName: body.familyName,
      gender: body.gender,
      method: body.method,
    }

    // 생년월일 정보 추가
    if (body.birthDate) {
      namingRequest.birthDate = new Date(body.birthDate)
      if (isNaN(namingRequest.birthDate.getTime())) {
        return NextResponse.json(
          {
            success: false,
            error: '유효하지 않은 날짜 형식입니다.',
          },
          { status: 400 }
        )
      }
    }

    if (body.birthTime) {
      namingRequest.birthTime = body.birthTime
    }

    if (body.isLunar !== undefined) {
      namingRequest.isLunar = body.isLunar
    }

    // 사주 분석 결과 추가
    if (body.sajuAnalysis) {
      namingRequest.sajuAnalysis = body.sajuAnalysis as any
    }

    // 선호도 추가
    if (body.preferences) {
      namingRequest.preferences = body.preferences
    }

    // AI 작명 생성
    const response = await generateNames(namingRequest)

    return NextResponse.json({
      success: true,
      data: response,
    })
  } catch (error: any) {
    console.error('AI 작명 API 오류:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'AI 작명 생성 중 오류가 발생했습니다.',
      },
      { status: 500 }
    )
  }
}

// Rate limiting 적용
export const POST = withRateLimit(handlePOST, RateLimitPresets.AI_NAMING)
