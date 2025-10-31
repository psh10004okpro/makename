/**
 * 십성 분석 컴포넌트
 *
 * 십성(十星) 분석 결과를 시각화합니다.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Sipseong =
  | '비견'
  | '겁재'
  | '식신'
  | '상관'
  | '편재'
  | '정재'
  | '편관'
  | '정관'
  | '편인'
  | '정인'

interface SipseongCount {
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

interface SipseongAnalysisProps {
  count: SipseongCount
  strong: Sipseong[]
  weak: Sipseong[]
  missing: Sipseong[]
  personality: string[]
  talents: string[]
  warnings: string[]
}

const SIPSEONG_INFO: Record<
  Sipseong,
  {
    category: '비겁' | '식상' | '재성' | '관성' | '인성'
    color: string
    bgColor: string
    icon: string
    meaning: string
  }
> = {
  비견: {
    category: '비겁',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
    icon: '🤝',
    meaning: '자아, 독립심',
  },
  겁재: {
    category: '비겁',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
    icon: '⚡',
    meaning: '경쟁, 도전',
  },
  식신: {
    category: '식상',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    icon: '🎨',
    meaning: '표현, 창조',
  },
  상관: {
    category: '식상',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    icon: '💡',
    meaning: '재능, 개성',
  },
  편재: {
    category: '재성',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
    icon: '💰',
    meaning: '재물, 활동',
  },
  정재: {
    category: '재성',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
    icon: '💎',
    meaning: '재산, 안정',
  },
  편관: {
    category: '관성',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    icon: '⚔️',
    meaning: '권력, 추진력',
  },
  정관: {
    category: '관성',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    icon: '👑',
    meaning: '명예, 지위',
  },
  편인: {
    category: '인성',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    icon: '📚',
    meaning: '학문, 직관',
  },
  정인: {
    category: '인성',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    icon: '🎓',
    meaning: '지혜, 어머니',
  },
}

const CATEGORY_INFO = {
  비겁: { name: '비견/겁재', color: 'bg-purple-500', description: '자아와 독립성' },
  식상: { name: '식신/상관', color: 'bg-green-500', description: '표현과 창조력' },
  재성: { name: '편재/정재', color: 'bg-yellow-500', description: '재물과 경제력' },
  관성: { name: '편관/정관', color: 'bg-red-500', description: '명예와 지위' },
  인성: { name: '편인/정인', color: 'bg-blue-500', description: '학문과 지혜' },
}

export function SipseongAnalysis({
  count,
  strong,
  weak,
  missing,
  personality,
  talents,
  warnings,
}: SipseongAnalysisProps) {
  const total = Object.values(count).reduce((sum, val) => sum + val, 0)

  // 카테고리별 합계
  const categoryCount = {
    비겁: count.비견 + count.겁재,
    식상: count.식신 + count.상관,
    재성: count.편재 + count.정재,
    관성: count.편관 + count.정관,
    인성: count.편인 + count.정인,
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>⭐</span>
          <span>십성 분석 (十星)</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 카테고리별 분포 */}
        <div>
          <h4 className="font-semibold text-sm text-gray-700 mb-3">
            십성 5대 카테고리 분포
          </h4>
          <div className="space-y-2">
            {Object.entries(categoryCount).map(([category, cnt]) => {
              const info = CATEGORY_INFO[category as keyof typeof CATEGORY_INFO]
              const percentage = total > 0 ? (cnt / total) * 100 : 0

              return (
                <div key={category}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {info.name}
                    </span>
                    <span className="text-sm text-gray-600">
                      {cnt}개 ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${info.color} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {info.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* 십성 개별 분포 */}
        <div>
          <h4 className="font-semibold text-sm text-gray-700 mb-3">
            십성 개별 분포
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {(Object.keys(count) as Sipseong[]).map((sipseong) => {
              const info = SIPSEONG_INFO[sipseong]
              const cnt = count[sipseong]

              return (
                <div
                  key={sipseong}
                  className={`p-3 ${info.bgColor} border-2 border-transparent hover:border-gray-300 rounded-lg transition-all`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">{info.icon}</div>
                    <div className={`text-sm font-semibold ${info.color}`}>
                      {sipseong}
                    </div>
                    <div className="text-2xl font-bold text-gray-800 my-1">
                      {cnt}
                    </div>
                    <div className="text-xs text-gray-600">{info.meaning}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 강약 분석 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 강한 십성 */}
          {strong.length > 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-semibold text-sm text-red-800 mb-2">
                💪 강한 십성
              </h4>
              <div className="flex flex-wrap gap-2">
                {strong.map((sipseong) => (
                  <span
                    key={sipseong}
                    className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm font-medium"
                  >
                    {SIPSEONG_INFO[sipseong].icon} {sipseong}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 약한 십성 */}
          {weak.length > 0 && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-sm text-yellow-800 mb-2">
                📉 약한 십성
              </h4>
              <div className="flex flex-wrap gap-2">
                {weak.map((sipseong) => (
                  <span
                    key={sipseong}
                    className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-sm font-medium"
                  >
                    {SIPSEONG_INFO[sipseong].icon} {sipseong}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 결여된 십성 */}
          {missing.length > 0 && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-sm text-blue-800 mb-2">
                ⭕ 결여된 십성
              </h4>
              <div className="flex flex-wrap gap-2">
                {missing.map((sipseong) => (
                  <span
                    key={sipseong}
                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium"
                  >
                    {SIPSEONG_INFO[sipseong].icon} {sipseong}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 성격 특성 */}
        {personality.length > 0 && (
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h4 className="font-semibold text-sm text-purple-800 mb-3">
              🎯 성격 특성
            </h4>
            <ul className="space-y-2">
              {personality.map((trait, index) => (
                <li
                  key={index}
                  className="text-sm text-purple-700 flex items-start gap-2"
                >
                  <span className="text-purple-500 mt-0.5">•</span>
                  <span>{trait}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 재능 및 적성 */}
        {talents.length > 0 && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-sm text-green-800 mb-3">
              ✨ 재능 및 적성
            </h4>
            <div className="flex flex-wrap gap-2">
              {talents.map((talent, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                >
                  {talent}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 주의사항 */}
        {warnings.length > 0 && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h4 className="font-semibold text-sm text-amber-800 mb-3">
              ⚠️ 주의사항
            </h4>
            <ul className="space-y-2">
              {warnings.map((warning, index) => (
                <li
                  key={index}
                  className="text-sm text-amber-700 flex items-start gap-2"
                >
                  <span className="text-amber-500 mt-0.5">⚠</span>
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 설명 */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-sm text-gray-700 mb-2">
            💡 십성이란?
          </h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            십성은 일간(日干)을 기준으로 다른 천간/지지와의 관계를 10가지로
            분류한 것으로, 개인의 성격, 재능, 대인관계 경향을 분석하는 핵심
            도구입니다. 비겁(자아), 식상(표현), 재성(재물), 관성(명예),
            인성(학문)의 5대 카테고리로 나뉩니다.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
