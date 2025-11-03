'use client'

/**
 * 추가 선호도 입력 폼
 */

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useNamingFlowStore } from '@/lib/stores/naming-flow'

interface PreferencesFormProps {
  onNext: () => void
  onPrev: () => void
}

export function PreferencesForm({ onNext, onPrev }: PreferencesFormProps) {
  const { preferences, setPreferences } = useNamingFlowStore()

  const [meaningKeyword, setMeaningKeyword] = useState('')
  const [preferredHanjaInput, setPreferredHanjaInput] = useState('')
  const [avoidCharInput, setAvoidCharInput] = useState('')

  const addKeyword = () => {
    if (meaningKeyword.trim()) {
      setPreferences({
        meaningKeywords: [...preferences.meaningKeywords, meaningKeyword.trim()],
      })
      setMeaningKeyword('')
    }
  }

  const removeKeyword = (index: number) => {
    setPreferences({
      meaningKeywords: preferences.meaningKeywords.filter((_, i) => i !== index),
    })
  }

  const addPreferredHanja = () => {
    if (preferredHanjaInput.trim()) {
      setPreferences({
        preferredHanja: [...preferences.preferredHanja, preferredHanjaInput.trim()],
      })
      setPreferredHanjaInput('')
    }
  }

  const removePreferredHanja = (index: number) => {
    setPreferences({
      preferredHanja: preferences.preferredHanja.filter((_, i) => i !== index),
    })
  }

  const addAvoidChar = () => {
    if (avoidCharInput.trim()) {
      setPreferences({
        avoidChars: [...preferences.avoidChars, avoidCharInput.trim()],
      })
      setAvoidCharInput('')
    }
  }

  const removeAvoidChar = (index: number) => {
    setPreferences({
      avoidChars: preferences.avoidChars.filter((_, i) => i !== index),
    })
  }

  const handleSubmit = () => {
    onNext()
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">추가 선호사항</h2>
        <p className="text-gray-600">
          원하는 이름의 느낌이나 특징을 알려주세요 (선택사항)
        </p>
      </div>

      <Card className="p-6 space-y-6">
        {/* 원하는 의미 키워드 */}
        <div>
          <label className="block text-sm font-medium mb-2">
            원하는 의미 키워드
          </label>
          <p className="text-sm text-gray-500 mb-3">
            예: 지혜, 용기, 평화, 건강, 행복, 사랑 등
          </p>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={meaningKeyword}
              onChange={(e) => setMeaningKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
              placeholder="키워드 입력"
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button type="button" onClick={addKeyword}>
              추가
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {preferences.meaningKeywords.map((keyword, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
              >
                {keyword}
                <button
                  onClick={() => removeKeyword(index)}
                  className="hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* 선호하는 한자 */}
        <div>
          <label className="block text-sm font-medium mb-2">
            선호하는 한자 <span className="text-gray-400">(선택)</span>
          </label>
          <p className="text-sm text-gray-500 mb-3">
            꼭 포함하고 싶은 한자가 있다면 입력해주세요
          </p>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={preferredHanjaInput}
              onChange={(e) => setPreferredHanjaInput(e.target.value)}
              onKeyPress={(e) =>
                e.key === 'Enter' && (e.preventDefault(), addPreferredHanja())
              }
              placeholder="예: 智, 賢, 德"
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button type="button" onClick={addPreferredHanja}>
              추가
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {preferences.preferredHanja.map((hanja, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
              >
                {hanja}
                <button
                  onClick={() => removePreferredHanja(index)}
                  className="hover:text-green-900"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* 피하고 싶은 글자 */}
        <div>
          <label className="block text-sm font-medium mb-2">
            피하고 싶은 글자 <span className="text-gray-400">(선택)</span>
          </label>
          <p className="text-sm text-gray-500 mb-3">
            사용하지 않았으면 하는 글자나 발음이 있다면 입력해주세요
          </p>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={avoidCharInput}
              onChange={(e) => setAvoidCharInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAvoidChar())}
              placeholder="예: 철, 순, 자"
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button type="button" onClick={addAvoidChar}>
              추가
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {preferences.avoidChars.map((char, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm"
              >
                {char}
                <button
                  onClick={() => removeAvoidChar(index)}
                  className="hover:text-red-900"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* 글자 수 선택 */}
        <div>
          <label className="block text-sm font-medium mb-2">
            선호하는 글자 수 <span className="text-gray-400">(선택)</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {([
              { value: null, label: '상관없음' },
              { value: 2, label: '2자 (예: 민수)' },
              { value: 3, label: '3자 (예: 지민수)' },
            ] as const).map((option) => (
              <label
                key={option.label}
                className={`
                  flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition
                  ${
                    preferences.nameLength === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }
                `}
              >
                <input
                  type="radio"
                  checked={preferences.nameLength === option.value}
                  onChange={() => setPreferences({ nameLength: option.value })}
                  className="sr-only"
                />
                <span className="font-medium">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 특별 요청사항 */}
        <div>
          <label className="block text-sm font-medium mb-2">
            특별 요청사항 <span className="text-gray-400">(선택)</span>
          </label>
          <textarea
            value={preferences.specialRequests}
            onChange={(e) => setPreferences({ specialRequests: e.target.value })}
            placeholder="기타 특별히 원하시는 사항을 자유롭게 작성해주세요"
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </Card>

      {/* 네비게이션 버튼 */}
      <div className="flex justify-between pt-6">
        <Button onClick={onPrev} variant="outline" size="lg">
          이전 단계
        </Button>
        <Button onClick={handleSubmit} size="lg" className="px-8">
          이름 생성 시작
        </Button>
      </div>
    </div>
  )
}
