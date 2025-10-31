/**
 * 사주 분석 결과 통합 컴포넌트
 *
 * 모든 사주 분석 결과를 하나의 페이지에 통합 표시합니다.
 */

'use client'

import { SajuChart } from './SajuChart'
import { OhangAnalysis } from './OhangAnalysis'
import { SipseongAnalysis } from './SipseongAnalysis'
import { DaeunTimeline } from './DaeunTimeline'
import { GyeokgukAnalysis } from './GyeokgukAnalysis'

// 전체 사주 분석 결과 타입
export interface SajuAnalysisData {
  // 사주팔자
  saju: {
    year: {
      cheongan: string
      jiji: string
      name: string
      hanja: string
    }
    month: {
      cheongan: string
      jiji: string
      name: string
      hanja: string
    }
    day: {
      cheongan: string
      jiji: string
      name: string
      hanja: string
    }
    hour: {
      cheongan: string
      jiji: string
      name: string
      hanja: string
    }
    birthInfo: {
      date: Date
      isLunar: boolean
    }
  }

  // 오행 분석
  ohang: {
    count: {
      목: number
      화: number
      토: number
      금: number
      수: number
    }
    weakElements: ('목' | '화' | '토' | '금' | '수')[]
    strongElements: ('목' | '화' | '토' | '금' | '수')[]
    missingElements: ('목' | '화' | '토' | '금' | '수')[]
    yongsin?: ('목' | '화' | '토' | '금' | '수')[]
    gisin?: ('목' | '화' | '토' | '금' | '수')[]
    seasonalInfo?: {
      season: string
      seasonName: string
      dominantElement: '목' | '화' | '토' | '금' | '수'
      preferredYongsin: ('목' | '화' | '토' | '금' | '수')[]
      avoidedElements: ('목' | '화' | '토' | '금' | '수')[]
      description: string
    }
  }

  // 십성 분석
  sipseong: {
    count: {
      비견: number
      겁재: number
      식신: number
      상관: number
      편재: number
      정재: number
      편관: number
      정관: number
      편인: number
      정인: number
    }
    strong: string[]
    weak: string[]
    missing: string[]
    personality: string[]
    talents: string[]
    warnings: string[]
  }

  // 대운 분석
  daeun: {
    direction: '순행' | '역행'
    startAge: number
    cycles: Array<{
      cheongan: string
      jiji: string
      name: string
      hanja: string
      startAge: number
      endAge: number
      ohang: {
        cheongan: string
        jiji: string
      }
      sipseong: {
        cheongan: string
        jiji: string
      }
    }>
    currentCycle?: {
      cheongan: string
      jiji: string
      name: string
      hanja: string
      startAge: number
      endAge: number
      ohang: {
        cheongan: string
        jiji: string
      }
      sipseong: {
        cheongan: string
        jiji: string
      }
    }
    nextCycle?: {
      cheongan: string
      jiji: string
      name: string
      hanja: string
      startAge: number
      endAge: number
      ohang: {
        cheongan: string
        jiji: string
      }
      sipseong: {
        cheongan: string
        jiji: string
      }
    }
    currentAge?: number
  }

  // 격국 분석
  gyeokguk: {
    gyeokguk: string
    category: '정격' | '외격' | '기타'
    strength: '강' | '중' | '약' | '파격'
    yongsin: string[]
    heesin: string[]
    gisin: string[]
    description: string
    characteristics: string[]
    careerSuitability: string[]
    wealthLuck: '매우 좋음' | '좋음' | '보통' | '약함'
    fameLuck: '매우 좋음' | '좋음' | '보통' | '약함'
    academicLuck: '매우 좋음' | '좋음' | '보통' | '약함'
    warnings: string[]
  }
}

interface SajuAnalysisResultProps {
  data: SajuAnalysisData
  showSaju?: boolean
  showOhang?: boolean
  showSipseong?: boolean
  showDaeun?: boolean
  showGyeokguk?: boolean
}

export function SajuAnalysisResult({
  data,
  showSaju = true,
  showOhang = true,
  showSipseong = true,
  showDaeun = true,
  showGyeokguk = true,
}: SajuAnalysisResultProps) {
  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          사주 분석 결과
        </h1>
        <p className="text-gray-600">
          전통 사주명리학 기반 종합 분석
        </p>
      </div>

      {/* 사주팔자 */}
      {showSaju && (
        <SajuChart
          year={data.saju.year}
          month={data.saju.month}
          day={data.saju.day}
          hour={data.saju.hour}
          birthInfo={data.saju.birthInfo}
        />
      )}

      {/* 오행 분석 */}
      {showOhang && (
        <OhangAnalysis
          count={data.ohang.count}
          weakElements={data.ohang.weakElements}
          strongElements={data.ohang.strongElements}
          missingElements={data.ohang.missingElements}
          yongsin={data.ohang.yongsin}
          gisin={data.ohang.gisin}
          seasonalInfo={data.ohang.seasonalInfo}
        />
      )}

      {/* 십성 분석 */}
      {showSipseong && (
        <SipseongAnalysis
          count={data.sipseong.count}
          strong={data.sipseong.strong}
          weak={data.sipseong.weak}
          missing={data.sipseong.missing}
          personality={data.sipseong.personality}
          talents={data.sipseong.talents}
          warnings={data.sipseong.warnings}
        />
      )}

      {/* 격국 분석 */}
      {showGyeokguk && (
        <GyeokgukAnalysis
          gyeokguk={data.gyeokguk.gyeokguk}
          category={data.gyeokguk.category}
          strength={data.gyeokguk.strength}
          yongsin={data.gyeokguk.yongsin}
          heesin={data.gyeokguk.heesin}
          gisin={data.gyeokguk.gisin}
          description={data.gyeokguk.description}
          characteristics={data.gyeokguk.characteristics}
          careerSuitability={data.gyeokguk.careerSuitability}
          wealthLuck={data.gyeokguk.wealthLuck}
          fameLuck={data.gyeokguk.fameLuck}
          academicLuck={data.gyeokguk.academicLuck}
          warnings={data.gyeokguk.warnings}
        />
      )}

      {/* 대운 분석 */}
      {showDaeun && (
        <DaeunTimeline
          direction={data.daeun.direction}
          startAge={data.daeun.startAge}
          cycles={data.daeun.cycles}
          currentCycle={data.daeun.currentCycle}
          nextCycle={data.daeun.nextCycle}
          currentAge={data.daeun.currentAge}
        />
      )}

      {/* 푸터 */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg text-center">
        <p className="text-sm text-gray-700 mb-2">
          이 분석 결과는 전통 사주명리학을 기반으로 작성되었습니다.
        </p>
        <p className="text-xs text-gray-500">
          작명 시 이 분석 결과를 참고하여 최적의 이름을 제안합니다.
        </p>
      </div>
    </div>
  )
}
