'use client'

/**
 * 이름 비교 뷰 (최대 3개)
 */

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
  }>
}

interface ComparisonViewProps {
  suggestions: NameSuggestion[]
  familyName: string
  onClose?: () => void
  onSelect?: (suggestion: NameSuggestion) => void
}

export function ComparisonView({
  suggestions,
  familyName,
  onClose,
  onSelect,
}: ComparisonViewProps) {
  if (suggestions.length === 0) return null

  // 비교 항목
  const comparisonItems = [
    { key: 'overall', label: '종합 점수', color: 'bg-blue-500' },
    { key: 'saju', label: '사주 궁합', color: 'bg-purple-500' },
    { key: 'phonetics', label: '발음', color: 'bg-green-500' },
    { key: 'meaning', label: '의미', color: 'bg-yellow-500' },
    { key: 'strokes', label: '획수', color: 'bg-red-500' },
  ]

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">이름 비교</h2>
          <p className="text-gray-600">{suggestions.length}개 이름을 비교합니다</p>
        </div>
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            비교 종료
          </Button>
        )}
      </div>

      {/* 이름 카드 */}
      <div className="grid md:grid-cols-3 gap-6">
        {suggestions.map((suggestion, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6">
              {/* 이름 */}
              <div className="text-center mb-6">
                <h3 className="text-3xl font-bold mb-2">
                  {familyName}
                  {suggestion.givenName}
                </h3>
                {suggestion.hanja && (
                  <p className="text-xl text-gray-600">
                    {familyName} {suggestion.hanja}
                  </p>
                )}
              </div>

              {/* 종합 점수 */}
              {suggestion.compatibility && (
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-blue-500 mb-1">
                    {suggestion.compatibility.overall}
                  </div>
                  <div className="text-sm text-gray-500">종합 점수</div>
                </div>
              )}

              {/* 의미 */}
              {suggestion.meaning && (
                <div className="mb-4">
                  <div className="text-sm font-bold text-gray-600 mb-1">의미</div>
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {suggestion.meaning}
                  </p>
                </div>
              )}

              {/* 한자 */}
              {suggestion.hanjaDetails && suggestion.hanjaDetails.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm font-bold text-gray-600 mb-2">한자</div>
                  <div className="space-y-1">
                    {suggestion.hanjaDetails.map((hanja, i) => (
                      <div key={i} className="text-sm text-gray-700">
                        <span className="font-bold">{hanja.character}</span>:{' '}
                        {hanja.meaning}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 선택 버튼 */}
              <Button
                className="w-full"
                onClick={() => onSelect?.(suggestion)}
              >
                이 이름 선택
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* 비교표 */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">상세 비교</h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-bold text-gray-700">항목</th>
                {suggestions.map((suggestion, index) => (
                  <th key={index} className="text-center py-3 px-4 font-bold">
                    {suggestion.givenName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonItems.map((item) => (
                <motion.tr
                  key={item.key}
                  className="border-b hover:bg-gray-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <td className="py-3 px-4 font-medium text-gray-700">
                    {item.label}
                  </td>
                  {suggestions.map((suggestion, index) => {
                    const score =
                      item.key === 'overall'
                        ? suggestion.compatibility?.overall
                        : (suggestion.compatibility as any)?.[item.key]

                    // 최고 점수 찾기
                    const maxScore = Math.max(
                      ...suggestions
                        .map((s) =>
                          item.key === 'overall'
                            ? s.compatibility?.overall
                            : (s.compatibility as any)?.[item.key]
                        )
                        .filter((s) => s !== undefined)
                    )

                    const isHighest = score === maxScore && score !== undefined

                    return (
                      <td key={index} className="py-3 px-4 text-center">
                        {score !== undefined ? (
                          <div className="flex flex-col items-center gap-1">
                            <span
                              className={`
                                text-lg font-bold
                                ${isHighest ? 'text-blue-600' : 'text-gray-700'}
                              `}
                            >
                              {score}점
                              {isHighest && ' 🏆'}
                            </span>
                            {/* 프로그레스 바 */}
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all ${
                                  isHighest ? 'bg-blue-500' : 'bg-gray-400'
                                }`}
                                style={{ width: `${score}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    )
                  })}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 장단점 분석 */}
      <div className="grid md:grid-cols-3 gap-6">
        {suggestions.map((suggestion, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
          >
            <Card className="p-6">
              <h4 className="font-bold mb-3 text-center">{suggestion.givenName}</h4>

              {/* 강점 */}
              <div className="mb-3">
                <div className="text-sm font-bold text-green-600 mb-2">✅ 강점</div>
                <ul className="space-y-1">
                  {comparisonItems
                    .filter((item) => {
                      const score =
                        item.key === 'overall'
                          ? suggestion.compatibility?.overall
                          : (suggestion.compatibility as any)?.[item.key]
                      return score !== undefined && score >= 80
                    })
                    .map((item, i) => (
                      <li key={i} className="text-xs text-gray-600">
                        • {item.label} 우수
                      </li>
                    ))}
                  {comparisonItems.filter((item) => {
                    const score =
                      item.key === 'overall'
                        ? suggestion.compatibility?.overall
                        : (suggestion.compatibility as any)?.[item.key]
                    return score !== undefined && score >= 80
                  }).length === 0 && (
                    <li className="text-xs text-gray-400">해당 없음</li>
                  )}
                </ul>
              </div>

              {/* 약점 */}
              <div>
                <div className="text-sm font-bold text-yellow-600 mb-2">
                  ⚠️ 보완 필요
                </div>
                <ul className="space-y-1">
                  {comparisonItems
                    .filter((item) => {
                      const score =
                        item.key === 'overall'
                          ? suggestion.compatibility?.overall
                          : (suggestion.compatibility as any)?.[item.key]
                      return score !== undefined && score < 70
                    })
                    .map((item, i) => (
                      <li key={i} className="text-xs text-gray-600">
                        • {item.label} 개선 가능
                      </li>
                    ))}
                  {comparisonItems.filter((item) => {
                    const score =
                      item.key === 'overall'
                        ? suggestion.compatibility?.overall
                        : (suggestion.compatibility as any)?.[item.key]
                    return score !== undefined && score < 70
                  }).length === 0 && (
                    <li className="text-xs text-gray-400">해당 없음</li>
                  )}
                </ul>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
