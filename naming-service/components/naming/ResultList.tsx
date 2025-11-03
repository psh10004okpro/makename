'use client'

/**
 * 작명 결과 목록 컴포넌트
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface NameSuggestion {
  givenName: string
  hanja?: string
  meaning?: string
  pronunciation?: string
  compatibility?: {
    overall: number
    saju?: number
    phonetics?: number
    meaning?: number
    strokes?: number
  }
  hanjaDetails?: Array<{
    character: string
    meaning: string
    reading?: string
    strokes?: number
  }>
}

interface ResultListProps {
  suggestions: NameSuggestion[]
  familyName: string
  onSelectName?: (suggestion: NameSuggestion) => void
  onCompare?: (suggestions: NameSuggestion[]) => void
  onViewDetail?: (suggestion: NameSuggestion) => void
  onGenerateReport?: (suggestion: NameSuggestion) => void
  onSelectHanja?: (suggestion: NameSuggestion) => void
}

type SortOption = 'score' | 'name'
type FilterOption = 'all' | '2char' | '3char'

export function ResultList({
  suggestions,
  familyName,
  onSelectName,
  onCompare,
  onViewDetail,
}: ResultListProps) {
  const [sortBy, setSortBy] = useState<SortOption>('score')
  const [filterBy, setFilterBy] = useState<FilterOption>('all')
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set())

  // 정렬 및 필터링
  const processedSuggestions = suggestions
    .filter((suggestion) => {
      if (filterBy === '2char') return suggestion.givenName.length === 2
      if (filterBy === '3char') return suggestion.givenName.length === 3
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'score') {
        const scoreA = a.compatibility?.overall || 0
        const scoreB = b.compatibility?.overall || 0
        return scoreB - scoreA
      } else {
        return a.givenName.localeCompare(b.givenName, 'ko')
      }
    })

  // 별점 렌더링
  const renderStars = (score: number) => {
    const stars = Math.round((score / 100) * 5)
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`text-lg ${i < stars ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ⭐
          </span>
        ))}
      </div>
    )
  }

  // 선택 토글
  const toggleSelection = (index: number) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      if (newSelected.size < 3) {
        newSelected.add(index)
      } else {
        alert('최대 3개까지 선택할 수 있습니다')
      }
    }
    setSelectedItems(newSelected)
  }

  return (
    <div className="space-y-6">
      {/* 컨트롤 */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-gray-50 p-4 rounded-lg">
        {/* 정렬 */}
        <div className="flex gap-2 items-center">
          <span className="text-sm font-medium text-gray-700">정렬:</span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={sortBy === 'score' ? 'default' : 'outline'}
              onClick={() => setSortBy('score')}
            >
              궁합도순
            </Button>
            <Button
              size="sm"
              variant={sortBy === 'name' ? 'default' : 'outline'}
              onClick={() => setSortBy('name')}
            >
              가나다순
            </Button>
          </div>
        </div>

        {/* 필터 */}
        <div className="flex gap-2 items-center">
          <span className="text-sm font-medium text-gray-700">필터:</span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={filterBy === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterBy('all')}
            >
              전체
            </Button>
            <Button
              size="sm"
              variant={filterBy === '2char' ? 'default' : 'outline'}
              onClick={() => setFilterBy('2char')}
            >
              2글자
            </Button>
            <Button
              size="sm"
              variant={filterBy === '3char' ? 'default' : 'outline'}
              onClick={() => setFilterBy('3char')}
            >
              3글자
            </Button>
          </div>
        </div>

        {/* 선택된 항목 */}
        {selectedItems.size > 0 && (
          <div className="text-sm text-gray-600">
            {selectedItems.size}개 선택됨
          </div>
        )}
      </div>

      {/* 이름 카드 그리드 */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {processedSuggestions.map((suggestion, index) => {
          const originalIndex = suggestions.indexOf(suggestion)
          const isSelected = selectedItems.has(originalIndex)

          return (
            <motion.div
              key={originalIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={`
                  p-6 cursor-pointer transition-all hover:shadow-lg
                  ${isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''}
                `}
                onClick={() => toggleSelection(originalIndex)}
              >
                {/* 순번 */}
                <div className="flex items-start justify-between mb-3">
                  <div className="text-sm font-bold text-gray-500">
                    {index + 1}번
                  </div>
                  {suggestion.compatibility && (
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-500">
                        {suggestion.compatibility.overall}점
                      </div>
                    </div>
                  )}
                </div>

                {/* 이름 */}
                <div className="mb-3">
                  <h3 className="text-3xl font-bold mb-1">
                    {familyName}
                    {suggestion.givenName}
                  </h3>
                  {suggestion.hanja && (
                    <p className="text-xl text-gray-600">
                      {familyName} {suggestion.hanja}
                    </p>
                  )}
                </div>

                {/* 별점 */}
                {suggestion.compatibility && (
                  <div className="mb-3">{renderStars(suggestion.compatibility.overall)}</div>
                )}

                {/* 의미 */}
                {suggestion.meaning && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {suggestion.meaning}
                    </p>
                  </div>
                )}

                {/* 발음 */}
                {suggestion.pronunciation && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500">
                      발음: {suggestion.pronunciation}
                    </p>
                  </div>
                )}

                {/* 상세 점수 */}
                {suggestion.compatibility && (
                  <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                    {suggestion.compatibility.saju !== undefined && (
                      <div className="bg-blue-50 p-2 rounded">
                        <div className="text-gray-600">사주</div>
                        <div className="font-bold">{suggestion.compatibility.saju}점</div>
                      </div>
                    )}
                    {suggestion.compatibility.phonetics !== undefined && (
                      <div className="bg-green-50 p-2 rounded">
                        <div className="text-gray-600">발음</div>
                        <div className="font-bold">{suggestion.compatibility.phonetics}점</div>
                      </div>
                    )}
                    {suggestion.compatibility.meaning !== undefined && (
                      <div className="bg-purple-50 p-2 rounded">
                        <div className="text-gray-600">의미</div>
                        <div className="font-bold">{suggestion.compatibility.meaning}점</div>
                      </div>
                    )}
                    {suggestion.compatibility.strokes !== undefined && (
                      <div className="bg-yellow-50 p-2 rounded">
                        <div className="text-gray-600">획수</div>
                        <div className="font-bold">{suggestion.compatibility.strokes}점</div>
                      </div>
                    )}
                  </div>
                )}

                {/* 버튼 */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      onViewDetail?.(suggestion)
                    }}
                  >
                    상세보기
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectName?.(suggestion)
                    }}
                  >
                    선택하기
                  </Button>
                </div>

                {/* 선택 표시 */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">✓</span>
                  </div>
                )}
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* 결과 없음 */}
      {processedSuggestions.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          해당 조건에 맞는 이름이 없습니다.
        </div>
      )}

      {/* 비교하기 버튼 */}
      {selectedItems.size >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-8 right-8"
        >
          <Button
            size="lg"
            onClick={() => {
              const selected = Array.from(selectedItems).map((i) => suggestions[i])
              onCompare?.(selected)
            }}
            className="shadow-lg"
          >
            선택한 이름 비교하기 ({selectedItems.size}개)
          </Button>
        </motion.div>
      )}
    </div>
  )
}
