'use client'

/**
 * 신생아 작명 메인 페이지
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useNamingFlowStore } from '@/lib/stores/naming-flow'
import { BabyInfoForm } from '@/components/forms/BabyInfoForm'
import { MethodSelector } from '@/components/forms/MethodSelector'
import { PreferencesForm } from '@/components/forms/PreferencesForm'
import { LoadingProgress } from '@/components/naming/LoadingProgress'
import { generateBabyNames } from '@/app/actions/naming'
import { Card } from '@/components/ui/card'

const TOTAL_STEPS = 4

export default function BabyNamingPage() {
  const router = useRouter()
  const { currentStep, setStep, babyInfo, method, preferences, requestId, setRequestId, setError } =
    useNamingFlowStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 단계별 제목
  const stepTitles = [
    '기본 정보',
    '작명 방법',
    '추가 선호사항',
    '이름 생성 중',
  ]

  const handleNext = () => {
    setStep(currentStep + 1)
  }

  const handlePrev = () => {
    setStep(currentStep - 1)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      if (!babyInfo.familyName || !babyInfo.gender || !babyInfo.birthDate || !method) {
        throw new Error('필수 정보를 모두 입력해주세요')
      }

      // Server Action 호출
      const result = await generateBabyNames({
        familyName: babyInfo.familyName,
        gender: babyInfo.gender,
        birthDate: babyInfo.birthDate,
        birthTime: babyInfo.birthTime,
        isLunar: babyInfo.isLunar,
        method,
        preferences,
      })

      if (result.error) {
        throw new Error(result.error)
      }

      // 요청 ID 저장
      setRequestId(result.requestId)

      // 로딩 단계로 이동
      setStep(4)
    } catch (error: any) {
      console.error('작명 요청 오류:', error)
      setError(error.message || '작명 요청 중 오류가 발생했습니다')
      alert(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 프로그레스 헤더 */}
      {currentStep < 4 && (
        <div className="mb-8">
          {/* 단계 표시 */}
          <div className="flex items-center justify-center mb-6">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-bold
                    ${
                      currentStep === step
                        ? 'bg-blue-500 text-white'
                        : currentStep > step
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }
                  `}
                >
                  {currentStep > step ? '✓' : step}
                </div>
                {step < 3 && (
                  <div
                    className={`
                      w-20 h-1 mx-2
                      ${currentStep > step ? 'bg-green-500' : 'bg-gray-200'}
                    `}
                  />
                )}
              </div>
            ))}
          </div>

          {/* 현재 단계 제목 */}
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">
              Step {currentStep}/{TOTAL_STEPS - 1}
            </p>
            <h1 className="text-2xl font-bold">{stepTitles[currentStep - 1]}</h1>
          </div>
        </div>
      )}

      {/* 단계별 폼 */}
      <div className="min-h-[500px]">
        {currentStep === 1 && <BabyInfoForm onNext={handleNext} />}

        {currentStep === 2 && (
          <MethodSelector onNext={handleNext} onPrev={handlePrev} />
        )}

        {currentStep === 3 && (
          <PreferencesForm
            onNext={handleSubmit}
            onPrev={handlePrev}
          />
        )}

        {currentStep === 4 && requestId && (
          <LoadingProgress requestId={requestId} />
        )}

        {currentStep === 4 && !requestId && (
          <Card className="p-8 text-center">
            <div className="text-6xl mb-4">⏳</div>
            <h2 className="text-2xl font-bold mb-2">요청 처리 중...</h2>
            <p className="text-gray-600">잠시만 기다려주세요</p>
          </Card>
        )}
      </div>

      {/* 제출 중 오버레이 */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-8 text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-lg font-medium">요청을 전송하고 있습니다...</p>
          </Card>
        </div>
      )}
    </div>
  )
}
