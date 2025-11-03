'use server'

/**
 * 작명 Server Actions
 */

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { calculateSaju } from '@/lib/saju/calculator'
import { analyzeOhangBalance } from '@/lib/saju/ohang'
import { analyzeSipseong } from '@/lib/saju/sipseong'
import { analyzeDaeun } from '@/lib/saju/daeun'
import { analyzeGyeokguk } from '@/lib/saju/gyeokguk'
import { getSeasonInfo } from '@/lib/saju/johoo'
import { generateNames } from '@/lib/llm'

export interface BabyNamingInput {
  familyName: string
  gender: 'MALE' | 'FEMALE' | 'NEUTRAL'
  birthDate: Date
  birthTime?: string | null
  isLunar: boolean
  method: 'TRADITIONAL' | 'MODERN' | 'HYBRID'
  preferences: {
    meaningKeywords: string[]
    preferredHanja: string[]
    avoidChars: string[]
    nameLength: number | null
    specialRequests: string
  }
}

/**
 * 작명 요청 생성 및 처리 시작
 */
export async function generateBabyNames(
  formData: BabyNamingInput
): Promise<{ requestId: string; error?: string }> {
  try {
    // 1. 인증 확인
    const session = await auth()
    if (!session?.user?.id) {
      return { requestId: '', error: '로그인이 필요합니다' }
    }

    // 2. DB에 요청 저장
    const request = await prisma.namingRequest.create({
      data: {
        userId: session.user.id,
        type: 'BABY',
        familyName: formData.familyName,
        gender: formData.gender,
        birthDate: formData.birthDate,
        birthTime: formData.birthTime,
        isLunar: formData.isLunar,
        method: formData.method,
        preferences: formData.preferences as any,
        status: 'PROCESSING',
      },
    })

    // 3. 비동기 처리 시작 (별도 함수)
    processNamingRequest(request.id).catch((error) => {
      console.error('작명 처리 오류:', error)
    })

    return { requestId: request.id }
  } catch (error: any) {
    console.error('작명 요청 생성 오류:', error)
    return { requestId: '', error: error.message || '요청 생성 중 오류가 발생했습니다' }
  }
}

/**
 * 작명 요청 처리 (비동기)
 */
async function processNamingRequest(requestId: string) {
  try {
    const request = await prisma.namingRequest.findUnique({
      where: { id: requestId },
    })

    if (!request) {
      throw new Error('요청을 찾을 수 없습니다')
    }

    // 4. 사주 계산 (전통/종합 방식인 경우)
    let sajuAnalysis: any = null

    if ((request.method === 'TRADITIONAL' || request.method === 'HYBRID') && request.birthDate) {
      console.log('🔮 사주 계산 시작...')

      // 사주 계산
      const saju = calculateSaju(request.birthDate, {
        isLunar: request.isLunar || false,
        time: request.birthTime || undefined,
      })

      // 오행 분석
      const ohangAnalysis = analyzeOhangBalance(saju)

      // 계절 조후 분석
      const birthMonth = request.birthDate.getMonth() + 1 // 1-12
      const seasonalInfo = getSeasonInfo(birthMonth)

      // 십성 분석
      const sipseongAnalysis = analyzeSipseong(saju)

      // 대운 분석
      const daeunAnalysis = analyzeDaeun(saju, request.gender as any, 0)

      // 격국 분석
      const gyeokgukAnalysis = analyzeGyeokguk(saju)

      // 종합 분석 결과
      sajuAnalysis = {
        saju: {
          year: `${saju.year.hanja}(${saju.year.name})`,
          month: `${saju.month.hanja}(${saju.month.name})`,
          day: `${saju.day.hanja}(${saju.day.name})`,
          hour: `${saju.hour.hanja}(${saju.hour.name})`,
        },
        ohang: {
          count: ohangAnalysis.count,
          weakElements: ohangAnalysis.weak,
          strongElements: ohangAnalysis.strong,
          missingElements: ohangAnalysis.missing,
          yongsin: ohangAnalysis.yongsin,
          gisin: ohangAnalysis.gisin,
        },
        seasonalInfo: seasonalInfo
          ? {
              season: seasonalInfo.season,
              seasonName: seasonalInfo.seasonName,
              dominantElement: seasonalInfo.dominantElement,
              preferredYongsin: seasonalInfo.preferredYongsin,
              avoidedElements: seasonalInfo.avoidedElements,
              description: seasonalInfo.description,
            }
          : undefined,
        sipseong: {
          count: sipseongAnalysis.count,
          strong: sipseongAnalysis.strong,
          weak: sipseongAnalysis.weak,
          missing: sipseongAnalysis.missing,
          personality: sipseongAnalysis.personality,
          talents: sipseongAnalysis.talents,
        },
        daeun: {
          direction: daeunAnalysis.direction,
          startAge: daeunAnalysis.startAge,
          cycles: daeunAnalysis.cycles.slice(0, 5), // 처음 5개만
        },
        gyeokguk: {
          gyeokguk: gyeokgukAnalysis.gyeokguk,
          category: gyeokgukAnalysis.category,
          strength: gyeokgukAnalysis.strength,
          yongsin: gyeokgukAnalysis.yongsin,
          description: gyeokgukAnalysis.description,
          characteristics: gyeokgukAnalysis.characteristics,
        },
      }

      console.log('✅ 사주 계산 완료')
    }

    // 5. LLM으로 이름 생성
    console.log('🤖 AI 작명 시작...')

    const namingResponse = await generateNames({
      familyName: request.familyName,
      gender: request.gender as any,
      birthDate: request.birthDate || undefined,
      birthTime: request.birthTime || undefined,
      isLunar: request.isLunar || false,
      method: request.method as any,
      sajuAnalysis: sajuAnalysis,
      preferences: {
        meaningKeywords: (request.preferences as any)?.meaningKeywords,
        avoidCharacters: (request.preferences as any)?.avoidChars,
        preferredLength: (request.preferences as any)?.nameLength,
        specialRequests: (request.preferences as any)?.specialRequests,
      },
    })

    console.log('✅ AI 작명 완료:', namingResponse.suggestions.length, '개')

    // 6. 결과 저장
    await prisma.namingResult.create({
      data: {
        requestId: request.id,
        suggestions: namingResponse.suggestions as any,
        sajuAnalysis: sajuAnalysis as any,
        metadata: {
          tokensUsed: namingResponse.tokensUsed,
          duration: namingResponse.duration,
        } as any,
      },
    })

    // 7. 요청 상태 업데이트
    await prisma.namingRequest.update({
      where: { id: requestId },
      data: { status: 'COMPLETED' },
    })

    console.log('✅ 작명 완료:', requestId)
  } catch (error: any) {
    console.error('❌ 작명 처리 오류:', error)

    // 에러 처리
    await prisma.namingRequest.update({
      where: { id: requestId },
      data: {
        status: 'FAILED',
        preferences: {
          ...(await prisma.namingRequest.findUnique({ where: { id: requestId } }))?.preferences,
          error: error.message,
        } as any,
      },
    })

    throw error
  }
}

/**
 * 작명 요청 상태 조회
 */
export async function getNamingRequestStatus(requestId: string) {
  try {
    const request = await prisma.namingRequest.findUnique({
      where: { id: requestId },
      include: {
        results: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    })

    if (!request) {
      return { status: 'NOT_FOUND', error: '요청을 찾을 수 없습니다' }
    }

    return {
      status: request.status,
      result: request.results[0] || null,
      request: {
        id: request.id,
        familyName: request.familyName,
        gender: request.gender,
        method: request.method,
        createdAt: request.createdAt,
      },
    }
  } catch (error: any) {
    console.error('상태 조회 오류:', error)
    return { status: 'ERROR', error: error.message }
  }
}
