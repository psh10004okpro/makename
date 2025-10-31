/**
 * 사주 분석 API 엔드포인트
 *
 * POST /api/saju/analyze
 * - 생년월일시를 받아서 사주팔자를 계산하고 종합 분석 결과를 반환합니다.
 */

import { NextRequest, NextResponse } from 'next/server'
import { calculateSaju } from '@/lib/saju/calculator'
import { analyzeOhang } from '@/lib/saju/ohang'
import { analyzeSipseong } from '@/lib/saju/sipseong'
import { analyzeDaeun } from '@/lib/saju/daeun'
import { analyzeGyeokguk } from '@/lib/saju/gyeokguk'
import { getSeasonalYongsin } from '@/lib/saju/johoo'

interface AnalyzeSajuRequest {
  /** 생년월일 (ISO 8601 형식) */
  birthDate: string
  /** 출생 시간 (HH:mm 형식, 예: "14:30") */
  birthTime?: string
  /** 음력 여부 */
  isLunar?: boolean
  /** 성별 */
  gender: 'MALE' | 'FEMALE'
  /** 현재 나이 (대운 분석용, 선택사항) */
  currentAge?: number
}

interface AnalyzeSajuResponse {
  success: boolean
  data?: {
    // 사주팔자
    saju: {
      year: { cheongan: string; jiji: string; name: string; hanja: string }
      month: { cheongan: string; jiji: string; name: string; hanja: string }
      day: { cheongan: string; jiji: string; name: string; hanja: string }
      hour: { cheongan: string; jiji: string; name: string; hanja: string }
      birthInfo: {
        date: string
        isLunar: boolean
      }
    }
    // 오행 분석
    ohang: any
    // 십성 분석
    sipseong: any
    // 대운 분석
    daeun: any
    // 격국 분석
    gyeokguk: any
  }
  error?: string
}

export async function POST(request: NextRequest): Promise<NextResponse<AnalyzeSajuResponse>> {
  try {
    const body: AnalyzeSajuRequest = await request.json()

    // 필수 파라미터 검증
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

    // 응답 데이터 구성
    const responseData = {
      saju: {
        year: saju.year,
        month: saju.month,
        day: saju.day,
        hour: saju.hour,
        birthInfo: {
          date: birthDate.toISOString(),
          isLunar: body.isLunar || false,
        },
      },
      ohang: {
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
      },
      sipseong: {
        count: sipseongAnalysis.count,
        strong: sipseongAnalysis.strong,
        weak: sipseongAnalysis.weak,
        missing: sipseongAnalysis.missing,
        personality: sipseongAnalysis.personality,
        talents: sipseongAnalysis.talents,
        warnings: sipseongAnalysis.warnings,
      },
      daeun: {
        direction: daeunAnalysis.direction,
        startAge: daeunAnalysis.startAge,
        cycles: daeunAnalysis.cycles,
        currentCycle: daeunAnalysis.currentCycle,
        nextCycle: daeunAnalysis.nextCycle,
        currentAge: body.currentAge,
      },
      gyeokguk: {
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

    return NextResponse.json({
      success: true,
      data: responseData,
    })
  } catch (error: any) {
    console.error('사주 분석 API 오류:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || '사주 분석 중 오류가 발생했습니다.',
      },
      { status: 500 }
    )
  }
}
