'use client'

/**
 * 작명 방법 선택 컴포넌트
 */

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useNamingFlowStore, type NamingMethod } from '@/lib/stores/naming-flow'
import { useState } from 'react'

interface MethodOption {
  value: NamingMethod
  title: string
  icon: string
  description: string
  features: string[]
  badge?: string
}

const methods: MethodOption[] = [
  {
    value: 'TRADITIONAL',
    title: '전통 방식',
    icon: '📜',
    description: '사주팔자를 분석하여 오행을 보완하는 한자로 작명',
    features: [
      '사주팔자 오행 분석',
      '음양오행 균형 고려',
      '한자 획수 길흉 판단',
      '전통 작명법 적용',
    ],
  },
  {
    value: 'HYBRID',
    title: '종합 방식',
    icon: '⚖️',
    description: '전통과 현대를 조화롭게 결합한 작명',
    features: [
      '사주팔자 + 언어학 종합',
      '의미와 발음 모두 중시',
      '현대적 감각 반영',
      '가장 균형잡힌 추천',
    ],
    badge: '추천',
  },
  {
    value: 'MODERN',
    title: '현대 방식',
    icon: '✨',
    description: '발음과 의미, 현대적 감각을 중시한 작명',
    features: [
      '부르기 쉬운 발음',
      '긍정적인 의미',
      '트렌디한 감각',
      '국제적 활용도',
    ],
  },
]

interface MethodSelectorProps {
  onNext: () => void
  onPrev: () => void
}

export function MethodSelector({ onNext, onPrev }: MethodSelectorProps) {
  const { method, setMethod } = useNamingFlowStore()
  const [selectedMethod, setSelectedMethod] = useState<NamingMethod | null>(method)

  const handleSelect = (value: NamingMethod) => {
    setSelectedMethod(value)
    setMethod(value)
  }

  const handleNext = () => {
    if (!selectedMethod) {
      alert('작명 방법을 선택해주세요')
      return
    }
    onNext()
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">작명 방법 선택</h2>
        <p className="text-gray-600">
          어떤 방식으로 이름을 지어드릴까요?
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {methods.map((option) => (
          <Card
            key={option.value}
            className={`
              relative p-6 cursor-pointer transition-all
              ${
                selectedMethod === option.value
                  ? 'border-2 border-blue-500 shadow-lg scale-105'
                  : 'border-2 border-gray-200 hover:border-blue-300 hover:shadow-md'
              }
            `}
            onClick={() => handleSelect(option.value)}
          >
            {/* 추천 배지 */}
            {option.badge && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {option.badge}
                </span>
              </div>
            )}

            {/* 아이콘 */}
            <div className="text-4xl mb-4 text-center">{option.icon}</div>

            {/* 제목 */}
            <h3 className="text-xl font-bold text-center mb-3">{option.title}</h3>

            {/* 설명 */}
            <p className="text-sm text-gray-600 text-center mb-4">
              {option.description}
            </p>

            {/* 특징 */}
            <ul className="space-y-2">
              {option.features.map((feature, index) => (
                <li key={index} className="flex items-start text-sm">
                  <span className="text-blue-500 mr-2">✓</span>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            {/* 선택 표시 */}
            {selectedMethod === option.value && (
              <div className="absolute top-4 right-4">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* 네비게이션 버튼 */}
      <div className="flex justify-between pt-6">
        <Button onClick={onPrev} variant="outline" size="lg">
          이전 단계
        </Button>
        <Button
          onClick={handleNext}
          size="lg"
          className="px-8"
          disabled={!selectedMethod}
        >
          다음 단계
        </Button>
      </div>
    </div>
  )
}
