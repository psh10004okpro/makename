'use client'

/**
 * 작명 처리 중 로딩 프로그레스
 */

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { getNamingRequestStatus } from '@/app/actions/naming'
import { useRouter } from 'next/navigation'

interface LoadingProgressProps {
  requestId: string
}

const progressSteps = [
  { id: 1, label: '요청 접수 중...', icon: '📝', duration: 1000 },
  { id: 2, label: '사주팔자 분석 중...', icon: '🔮', duration: 3000 },
  { id: 3, label: '의미 있는 이름 생성 중...', icon: '🤖', duration: 5000 },
  { id: 4, label: '한자 조합 평가 중...', icon: '📚', duration: 3000 },
  { id: 5, label: '최종 검토 중...', icon: '✨', duration: 2000 },
]

export function LoadingProgress({ requestId }: LoadingProgressProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [status, setStatus] = useState<string>('PROCESSING')
  const [error, setError] = useState<string | null>(null)

  // 진행 상태 애니메이션
  useEffect(() => {
    let stepTimeout: NodeJS.Timeout

    const advanceStep = () => {
      setCurrentStep((prev) => {
        if (prev < progressSteps.length - 1) {
          const nextStep = prev + 1
          stepTimeout = setTimeout(advanceStep, progressSteps[nextStep].duration)
          return nextStep
        }
        return prev
      })
    }

    stepTimeout = setTimeout(advanceStep, progressSteps[0].duration)

    return () => {
      if (stepTimeout) clearTimeout(stepTimeout)
    }
  }, [])

  // 실제 상태 폴링 (5초마다)
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const result = await getNamingRequestStatus(requestId)

        if (result.status === 'COMPLETED' && result.result) {
          // 완료됨 - 결과 페이지로 이동
          router.push(`/result/${requestId}`)
        } else if (result.status === 'FAILED') {
          setStatus('FAILED')
          setError(result.error || '작명 처리 중 오류가 발생했습니다')
        } else if (result.status === 'NOT_FOUND') {
          setStatus('NOT_FOUND')
          setError('요청을 찾을 수 없습니다')
        } else {
          // 아직 처리 중
          setStatus(result.status)
        }
      } catch (err: any) {
        console.error('상태 확인 오류:', err)
        setError(err.message)
      }
    }

    // 즉시 한 번 확인
    checkStatus()

    // 5초마다 폴링
    const interval = setInterval(checkStatus, 5000)

    return () => clearInterval(interval)
  }, [requestId, router])

  // 에러 상태
  if (status === 'FAILED' || status === 'NOT_FOUND' || error) {
    return (
      <div className="max-w-2xl mx-auto mt-20">
        <Card className="p-8 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-2">오류가 발생했습니다</h2>
          <p className="text-gray-600 mb-6">{error || '알 수 없는 오류가 발생했습니다'}</p>
          <button
            onClick={() => router.push('/baby')}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            다시 시도
          </button>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto mt-20">
      <Card className="p-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">이름을 만들고 있습니다</h2>
          <p className="text-gray-600">
            소중한 이름을 정성껏 만들고 있으니 잠시만 기다려주세요
          </p>
        </div>

        {/* 프로그레스 바 */}
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-blue-500 h-full transition-all duration-1000 ease-out"
              style={{
                width: `${((currentStep + 1) / progressSteps.length) * 100}%`,
              }}
            />
          </div>
          <div className="text-center mt-2 text-sm text-gray-500">
            {Math.round(((currentStep + 1) / progressSteps.length) * 100)}% 완료
          </div>
        </div>

        {/* 단계별 상태 */}
        <div className="space-y-4">
          {progressSteps.map((step, index) => {
            const isActive = index === currentStep
            const isCompleted = index < currentStep
            const isPending = index > currentStep

            return (
              <div
                key={step.id}
                className={`
                  flex items-center p-4 rounded-lg transition-all
                  ${isActive ? 'bg-blue-50 border-2 border-blue-500' : ''}
                  ${isCompleted ? 'bg-green-50 border border-green-200' : ''}
                  ${isPending ? 'bg-gray-50 border border-gray-200 opacity-50' : ''}
                `}
              >
                {/* 아이콘 */}
                <div
                  className={`
                    text-3xl mr-4
                    ${isActive ? 'animate-bounce' : ''}
                  `}
                >
                  {step.icon}
                </div>

                {/* 레이블 */}
                <div className="flex-1">
                  <div
                    className={`
                      font-medium
                      ${isActive ? 'text-blue-700' : ''}
                      ${isCompleted ? 'text-green-700' : ''}
                      ${isPending ? 'text-gray-400' : ''}
                    `}
                  >
                    {step.label}
                  </div>
                </div>

                {/* 상태 표시 */}
                <div>
                  {isCompleted && (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                  )}
                  {isActive && (
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* 추가 안내 */}
        <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-gray-700 text-center">
            💡 이 페이지를 닫아도 작명은 계속 진행됩니다. 완료 후 마이페이지에서 확인할 수 있습니다.
          </p>
        </div>
      </Card>
    </div>
  )
}
