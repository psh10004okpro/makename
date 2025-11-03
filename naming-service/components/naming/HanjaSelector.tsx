'use client'

/**
 * 한자 선택 컴포넌트 (동음이의 한자 선택)
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface HanjaOption {
  character: string
  meaning: string
  strokes: number
  pronunciation?: string
}

interface HanjaPosition {
  index: number // 0 or 1 (for 2-character names) or 0, 1, 2 (for 3-character names)
  currentCharacter: string
  alternatives: HanjaOption[]
}

interface CompatibilityScore {
  overall: number
  saju?: number
  phonetics?: number
  meaning?: number
  strokes?: number
}

interface HanjaSelectorProps {
  givenName: string // 한글 이름
  initialHanja: string // 초기 한자 조합
  hanjaPositions: HanjaPosition[] // 각 글자별 대체 한자 옵션
  onHanjaChange: (newHanja: string, position: number, character: string) => void
  onScoreRecalculate?: (newScore: CompatibilityScore) => void
}

export function HanjaSelector({
  givenName,
  initialHanja,
  hanjaPositions,
  onHanjaChange,
  onScoreRecalculate,
}: HanjaSelectorProps) {
  const [selectedHanja, setSelectedHanja] = useState<string[]>(
    initialHanja.split('')
  )
  const [expandedPosition, setExpandedPosition] = useState<number | null>(null)
  const [isRecalculating, setIsRecalculating] = useState(false)

  // 한자 변경 처리
  const handleHanjaSelect = async (position: number, option: HanjaOption) => {
    const newHanja = [...selectedHanja]
    newHanja[position] = option.character
    setSelectedHanja(newHanja)

    // 콜백 호출
    onHanjaChange(newHanja.join(''), position, option.character)

    // 점수 재계산 (실제로는 API 호출)
    if (onScoreRecalculate) {
      setIsRecalculating(true)
      try {
        // TODO: API 호출하여 새로운 점수 계산
        // const response = await fetch('/api/naming/recalculate-score', {
        //   method: 'POST',
        //   body: JSON.stringify({
        //     givenName,
        //     hanja: newHanja.join('')
        //   }),
        // })
        // const newScore = await response.json()

        // 임시: 약간의 지연 후 랜덤 점수 반환
        await new Promise((resolve) => setTimeout(resolve, 500))
        const newScore: CompatibilityScore = {
          overall: Math.floor(Math.random() * 20) + 80,
          saju: Math.floor(Math.random() * 20) + 75,
          phonetics: Math.floor(Math.random() * 20) + 80,
          meaning: Math.floor(Math.random() * 20) + 85,
          strokes: Math.floor(Math.random() * 20) + 75,
        }

        onScoreRecalculate(newScore)
      } catch (error) {
        console.error('점수 재계산 오류:', error)
      } finally {
        setIsRecalculating(false)
      }
    }

    // 펼쳐진 패널 닫기
    setExpandedPosition(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">한자 선택</h3>
        {isRecalculating && (
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            점수 재계산 중...
          </div>
        )}
      </div>

      <Card className="p-4">
        {/* 현재 선택된 한자 표시 */}
        <div className="mb-6">
          <div className="text-sm text-gray-600 mb-2">현재 선택</div>
          <div className="flex items-center gap-2">
            {selectedHanja.map((char, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <div className="text-4xl font-bold text-gray-800">{char}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {givenName[index]}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 글자별 대체 한자 선택 */}
        <div className="space-y-4">
          {hanjaPositions.map((position) => (
            <div key={position.index} className="border rounded-lg p-4">
              {/* 헤더 */}
              <button
                onClick={() =>
                  setExpandedPosition(
                    expandedPosition === position.index ? null : position.index
                  )
                }
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-bold text-gray-700">
                    {selectedHanja[position.index]}
                  </div>
                  <div>
                    <div className="font-semibold">
                      "{givenName[position.index]}" 글자
                    </div>
                    <div className="text-sm text-gray-500">
                      {position.alternatives.length}개의 대체 한자
                    </div>
                  </div>
                </div>
                <div className="text-gray-400">
                  {expandedPosition === position.index ? '▲' : '▼'}
                </div>
              </button>

              {/* 대체 한자 옵션 */}
              <AnimatePresence>
                {expandedPosition === position.index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-4 pt-4 border-t"
                  >
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {position.alternatives.map((option, optionIndex) => {
                        const isSelected =
                          selectedHanja[position.index] === option.character

                        return (
                          <motion.button
                            key={optionIndex}
                            onClick={() =>
                              handleHanjaSelect(position.index, option)
                            }
                            className={`
                              p-4 rounded-lg border-2 text-left transition-all
                              ${
                                isSelected
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                              }
                            `}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {/* 한자 */}
                            <div className="flex items-start justify-between mb-2">
                              <div className="text-3xl font-bold text-gray-800">
                                {option.character}
                              </div>
                              {isSelected && (
                                <div className="text-blue-500 text-sm font-semibold">
                                  ✓ 선택됨
                                </div>
                              )}
                            </div>

                            {/* 발음 */}
                            {option.pronunciation && (
                              <div className="text-sm text-gray-600 mb-1">
                                {option.pronunciation}
                              </div>
                            )}

                            {/* 의미 */}
                            <div className="text-sm text-gray-700 mb-2 line-clamp-2">
                              {option.meaning}
                            </div>

                            {/* 획수 */}
                            <div className="flex items-center gap-2">
                              <div className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                                {option.strokes}획
                              </div>
                            </div>
                          </motion.button>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </Card>

      {/* 선택 안내 */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-2">
          <div className="text-blue-600 mt-0.5">💡</div>
          <div className="text-sm text-blue-700">
            <p className="font-semibold mb-1">한자 선택 팁</p>
            <ul className="space-y-1">
              <li>• 각 글자를 클릭하면 대체 가능한 한자 목록을 볼 수 있습니다</li>
              <li>• 한자를 변경하면 자동으로 궁합 점수가 재계산됩니다</li>
              <li>• 획수와 의미를 고려하여 가장 적합한 한자를 선택하세요</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
