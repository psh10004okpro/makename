'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type NamingMethod = 'TRADITIONAL' | 'MODERN' | 'HYBRID' | 'CREATIVE' | 'INTERNATIONAL'

interface CustomWeights {
  saju: number
  strokes: number
  phonetics: number
  meaning: number
  modernity: number
  uniqueness: number
}

export default function TestNamingPage() {
  const [method, setMethod] = useState<NamingMethod>('HYBRID')
  const [weights, setWeights] = useState<CustomWeights>({
    saju: 20,
    strokes: 15,
    phonetics: 25,
    meaning: 20,
    modernity: 10,
    uniqueness: 10,
  })

  // 가중치 정규화 (합계 100으로)
  const normalizeWeights = (w: CustomWeights) => {
    const total = w.saju + w.strokes + w.phonetics + w.meaning + w.modernity + w.uniqueness
    if (total === 0) return w

    return {
      saju: Math.round((w.saju / total) * 100),
      strokes: Math.round((w.strokes / total) * 100),
      phonetics: Math.round((w.phonetics / total) * 100),
      meaning: Math.round((w.meaning / total) * 100),
      modernity: Math.round((w.modernity / total) * 100),
      uniqueness: Math.round((w.uniqueness / total) * 100),
    }
  }

  const normalized = normalizeWeights(weights)

  const updateWeight = (key: keyof CustomWeights, value: number) => {
    setWeights(prev => ({ ...prev, [key]: value }))
  }

  const methodInfo: Record<NamingMethod, { emoji: string; name: string; description: string }> = {
    TRADITIONAL: {
      emoji: '🏛️',
      name: '전통 작명',
      description: '사주명리학 기반 (사주 40%, 획수 30%)',
    },
    MODERN: {
      emoji: '🌟',
      name: '현대 작명',
      description: '발음/의미 중심 (발음 40%, 의미 30%)',
    },
    HYBRID: {
      emoji: '⚖️',
      name: '혼합 작명',
      description: '전통과 현대의 균형 (발음+의미 35%, 사주 35%)',
    },
    CREATIVE: {
      emoji: '🎨',
      name: '창의적 작명',
      description: '독창성/의미 깊이 중심 (독창성 50%, 의미 30%)',
    },
    INTERNATIONAL: {
      emoji: '🌍',
      name: '국제적 작명',
      description: '국제 발음/글로벌 이미지 (발음 45%, 이미지 30%)',
    },
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">작명 방법 테스트</h1>
      <p className="text-gray-600 mb-8">
        다양한 작명 방법과 사용자 정의 가중치를 테스트해보세요
      </p>

      {/* 작명 방법 선택 */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow">
        <Label className="text-lg font-semibold mb-4 block">작명 방법 선택</Label>

        <Select value={method} onValueChange={(value) => setMethod(value as NamingMethod)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(methodInfo).map(([key, info]) => (
              <SelectItem key={key} value={key}>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{info.emoji}</span>
                  <div>
                    <div className="font-semibold">{info.name}</div>
                    <div className="text-xs text-gray-500">{info.description}</div>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="mt-4 p-4 bg-blue-50 rounded">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{methodInfo[method].emoji}</span>
            <h3 className="font-semibold text-lg">{methodInfo[method].name}</h3>
          </div>
          <p className="text-sm text-gray-700">{methodInfo[method].description}</p>
        </div>
      </div>

      {/* 사용자 정의 가중치 */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow">
        <Label className="text-lg font-semibold mb-4 block">사용자 정의 가중치</Label>
        <p className="text-sm text-gray-600 mb-6">
          각 항목의 중요도를 조절하세요. 자동으로 합계 100%로 정규화됩니다.
        </p>

        <div className="space-y-6">
          {/* 사주 오행 조화 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label className="text-sm font-medium">
                🎯 사주 오행 조화
              </Label>
              <span className="text-sm font-semibold text-blue-600">
                {normalized.saju}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={weights.saju}
              onChange={(e) => updateWeight('saju', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-1">용신/기신 오행 일치도</p>
          </div>

          {/* 획수 길흉 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label className="text-sm font-medium">
                📏 획수 길흉
              </Label>
              <span className="text-sm font-semibold text-blue-600">
                {normalized.strokes}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={weights.strokes}
              onChange={(e) => updateWeight('strokes', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-1">81수리, 오격 분석</p>
          </div>

          {/* 발음 자연스러움 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label className="text-sm font-medium">
                🗣️ 발음 자연스러움
              </Label>
              <span className="text-sm font-semibold text-blue-600">
                {normalized.phonetics}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={weights.phonetics}
              onChange={(e) => updateWeight('phonetics', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-1">받침, 모음, 듣기 편함</p>
          </div>

          {/* 의미 적절성 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label className="text-sm font-medium">
                💡 의미 적절성
              </Label>
              <span className="text-sm font-semibold text-blue-600">
                {normalized.meaning}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={weights.meaning}
              onChange={(e) => updateWeight('meaning', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-1">키워드 일치, 긍정적 의미</p>
          </div>

          {/* 현대적 감각 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label className="text-sm font-medium">
                ✨ 현대적 감각
              </Label>
              <span className="text-sm font-semibold text-blue-600">
                {normalized.modernity}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={weights.modernity}
              onChange={(e) => updateWeight('modernity', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-1">트렌디, 세련됨</p>
          </div>

          {/* 독창성 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label className="text-sm font-medium">
                🌟 독창성
              </Label>
              <span className="text-sm font-semibold text-blue-600">
                {normalized.uniqueness}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={weights.uniqueness}
              onChange={(e) => updateWeight('uniqueness', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-1">흔하지 않음, 참신함</p>
          </div>
        </div>

        {/* 가중치 합계 표시 */}
        <div className="mt-6 p-4 bg-gray-50 rounded">
          <div className="text-sm text-gray-700">
            <strong>정규화된 가중치 (합계 100%):</strong>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              사주: {normalized.saju}%
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
              획수: {normalized.strokes}%
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              발음: {normalized.phonetics}%
            </span>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
              의미: {normalized.meaning}%
            </span>
            <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm">
              현대성: {normalized.modernity}%
            </span>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
              독창성: {normalized.uniqueness}%
            </span>
          </div>
        </div>
      </div>

      {/* 결과 미리보기 */}
      <div className="p-6 bg-green-50 rounded-lg">
        <h3 className="font-semibold text-lg mb-4">🎯 API 호출 시 전달될 데이터</h3>
        <pre className="bg-white p-4 rounded text-sm overflow-auto">
          {JSON.stringify(
            {
              method,
              preferences: {
                customWeights: normalized,
              },
            },
            null,
            2
          )}
        </pre>
      </div>
    </div>
  )
}
