/**
 * 사주 분석 + AI 작명 통합 API 엔드포인트
 *
 * POST /api/naming/analyze-and-generate
 * - 한 번의 API 호출로 사주 분석과 AI 작명을 모두 수행합니다.
 */

import { NextRequest, NextResponse } from 'next/server'
import { calculateSaju } from '@/lib/saju/calculator'
import { analyzeOhang } from '@/lib/saju/ohang'
import { analyzeSipseong } from '@/lib/saju/sipseong'
import { analyzeDaeun } from '@/lib/saju/daeun'
import { analyzeGyeokguk } from '@/lib/saju/gyeokguk'
import { getSeasonalYongsin } from '@/lib/saju/johoo'
import { generateNames } from '@/lib/llm'
import type { NamingRequest, NamingResponse } from '@/lib/llm'
import { Gender, NamingMethod } from '@prisma/client'
import { withRateLimit, RateLimitPresets } from '@/lib/middleware/rate-limit'

interface AnalyzeAndGenerateRequest {
  /** 성씨 */
  familyName: string
  /** 생년월일 (ISO 8601 형식) */
  birthDate: string
  /** 출생 시간 (HH:mm 형식) */
  birthTime?: string
  /** 음력 여부 */
  isLunar?: boolean
  /** 성별 */
  gender: 'MALE' | 'FEMALE'
  /** 현재 나이 (대운 분석용) */
  currentAge?: number
  /** 작명 방법 */
  method: 'TRADITIONAL' | 'MODERN' | 'HYBRID' | 'CREATIVE' | 'INTERNATIONAL'
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

interface AnalyzeAndGenerateResponse {
  success: boolean
  data?: {
    // 사주 분석 결과
    saju: any
    ohang: any
    sipseong: any
    daeun: any
    gyeokguk: any
    // AI 작명 결과
    naming: NamingResponse
  }
  error?: string
}

async function handlePOST(
  request: NextRequest
): Promise<NextResponse<AnalyzeAndGenerateResponse>> {
  try {
    const body: AnalyzeAndGenerateRequest = await request.json()

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

    if (!body.birthDate) {
      return NextResponse.json(
        {
          success: false,
          error: '생년월일(birthDate)은 필수입니다.',
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

    // 날짜 파싱
    const birthDate = new Date(body.birthDate)
    if (isNaN(birthDate.getTime())) {
      return NextResponse.json(
        {
          success: false,
          error: '유효하지 않은 날짜 형식입니다.',
        },
        { status: 400 }
      )
    }

    // =================================================================
    // STEP 1: 사주 분석
    // =================================================================

    // 1. 사주 계산
    const saju = calculateSaju(birthDate, {
      isLunar: body.isLunar || false,
      time: body.birthTime,
    })

    // 2. 오행 분석
    const ohangAnalysis = analyzeOhang(saju)

    // 3. 계절 조후 용신 분석
    const seasonalInfo = getSeasonalYongsin(birthDate, body.isLunar || false)

    // 4. 십성 분석
    const sipseongAnalysis = analyzeSipseong(saju)

    // 5. 대운 분석
    const daeunAnalysis = analyzeDaeun(saju, body.gender, body.currentAge)

    // 6. 격국 분석
    const gyeokgukAnalysis = analyzeGyeokguk(saju)

    // 사주 분석 결과 구성
    const sajuData = {
      year: saju.year,
      month: saju.month,
      day: saju.day,
      hour: saju.hour,
      birthInfo: {
        date: birthDate.toISOString(),
        isLunar: body.isLunar || false,
      },
    }

    const ohangData = {
      count: ohangAnalysis.count,
      weakElements: ohangAnalysis.weakElements,
      strongElements: ohangAnalysis.strongElements,
      missingElements: ohangAnalysis.missingElements,
      yongsin: ohangAnalysis.yongsin,
      gisin: ohangAnalysis.gisin,
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
    }

    const sipseongData = {
      count: sipseongAnalysis.count,
      strong: sipseongAnalysis.strong,
      weak: sipseongAnalysis.weak,
      missing: sipseongAnalysis.missing,
      personality: sipseongAnalysis.personality,
      talents: sipseongAnalysis.talents,
      warnings: sipseongAnalysis.warnings,
    }

    const daeunData = {
      direction: daeunAnalysis.direction,
      startAge: daeunAnalysis.startAge,
      cycles: daeunAnalysis.cycles,
      currentCycle: daeunAnalysis.currentCycle,
      nextCycle: daeunAnalysis.nextCycle,
      currentAge: body.currentAge,
    }

    const gyeokgukData = {
      gyeokguk: gyeokgukAnalysis.gyeokguk,
      category: gyeokgukAnalysis.category,
      strength: gyeokgukAnalysis.strength,
      yongsin: gyeokgukAnalysis.yongsin,
      heesin: gyeokgukAnalysis.heesin,
      gisin: gyeokgukAnalysis.gisin,
      description: gyeokgukAnalysis.description,
      characteristics: gyeokgukAnalysis.characteristics,
      careerSuitability: gyeokgukAnalysis.careerSuitability,
      wealthLuck: gyeokgukAnalysis.wealthLuck,
      fameLuck: gyeokgukAnalysis.fameLuck,
      academicLuck: gyeokgukAnalysis.academicLuck,
      warnings: gyeokgukAnalysis.warnings,
    }

    // =================================================================
    // STEP 2: AI 작명
    // =================================================================

    // LLM용 사주 분석 요약 생성
    const sajuAnalysisSummary = {
      year: `${saju.year.hanja}(${saju.year.name})`,
      month: `${saju.month.hanja}(${saju.month.name})`,
      day: `${saju.day.hanja}(${saju.day.name})`,
      hour: `${saju.hour.hanja}(${saju.hour.name})`,
      weakElements: ohangAnalysis.weakElements,
      strongElements: ohangAnalysis.strongElements,
      missingElements: ohangAnalysis.missingElements,
      yongsin: ohangAnalysis.yongsin,
      gisin: ohangAnalysis.gisin,
      seasonalInfo: seasonalInfo
        ? {
            season: seasonalInfo.season,
            seasonName: seasonalInfo.seasonName,
            dominantElement: seasonalInfo.dominantElement,
            preferredYongsin: seasonalInfo.preferredYongsin,
            avoidedElements: seasonalInfo.avoidedElements,
            description: seasonalInfo.description,
            characteristics: seasonalInfo.characteristics,
            adjustmentReason: seasonalInfo.adjustmentReason,
            priority: seasonalInfo.priority,
          }
        : undefined,
      sipseongInfo: {
        strong: sipseongAnalysis.strong,
        weak: sipseongAnalysis.weak,
        missing: sipseongAnalysis.missing,
        personality: sipseongAnalysis.personality,
        talents: sipseongAnalysis.talents,
        warnings: sipseongAnalysis.warnings,
        summary: `강한 십성: ${sipseongAnalysis.strong.join(', ')}, 약한 십성: ${sipseongAnalysis.weak.join(', ')}`,
      },
      daeunInfo: daeunAnalysis.currentCycle
        ? {
            direction: daeunAnalysis.direction,
            startAge: daeunAnalysis.startAge,
            currentCycle: {
              name: daeunAnalysis.currentCycle.name,
              hanja: daeunAnalysis.currentCycle.hanja,
              ageRange: `${daeunAnalysis.currentCycle.startAge}-${daeunAnalysis.currentCycle.endAge}세`,
              sipseong: `천간: ${daeunAnalysis.currentCycle.sipseong.cheongan}, 지지: ${daeunAnalysis.currentCycle.sipseong.jiji}`,
              flow: '현재 진행 중인 대운',
              strengths: [],
              warnings: [],
              suitableActivities: [],
            },
            nextCycle: daeunAnalysis.nextCycle
              ? {
                  name: daeunAnalysis.nextCycle.name,
                  hanja: daeunAnalysis.nextCycle.hanja,
                  ageRange: `${daeunAnalysis.nextCycle.startAge}-${daeunAnalysis.nextCycle.endAge}세`,
                }
              : undefined,
            summary: `${daeunAnalysis.direction}, ${daeunAnalysis.startAge}세 입운`,
          }
        : undefined,
      gyeokgukInfo: {
        gyeokguk: gyeokgukAnalysis.gyeokguk,
        category: gyeokgukAnalysis.category,
        strength: gyeokgukAnalysis.strength,
        yongsin: gyeokgukAnalysis.yongsin,
        heesin: gyeokgukAnalysis.heesin,
        gisin: gyeokgukAnalysis.gisin,
        description: gyeokgukAnalysis.description,
        characteristics: gyeokgukAnalysis.characteristics,
        careerSuitability: gyeokgukAnalysis.careerSuitability,
        wealthLuck: gyeokgukAnalysis.wealthLuck,
        fameLuck: gyeokgukAnalysis.fameLuck,
        academicLuck: gyeokgukAnalysis.academicLuck,
        warnings: gyeokgukAnalysis.warnings,
      },
    }

    // NamingRequest 구성
    const namingRequest: NamingRequest = {
      familyName: body.familyName,
      gender: body.gender as Gender,
      birthDate: birthDate,
      birthTime: body.birthTime,
      isLunar: body.isLunar || false,
      method: body.method as NamingMethod,
      sajuAnalysis: sajuAnalysisSummary as any,
      preferences: body.preferences,
    }

    // AI 작명 생성
    const namingResponse = await generateNames(namingRequest)

    // 최종 응답
    return NextResponse.json({
      success: true,
      data: {
        saju: sajuData,
        ohang: ohangData,
        sipseong: sipseongData,
        daeun: daeunData,
        gyeokguk: gyeokgukData,
        naming: namingResponse,
      },
    })
  } catch (error: any) {
    console.error('통합 API 오류:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || '사주 분석 및 AI 작명 중 오류가 발생했습니다.',
      },
      { status: 500 }
    )
  }
}

// Rate limiting 적용
export const POST = withRateLimit(handlePOST, RateLimitPresets.INTEGRATED_ANALYSIS)
