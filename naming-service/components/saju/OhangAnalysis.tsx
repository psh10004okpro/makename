/**
 * 오행 분석 컴포넌트
 *
 * 오행(목화토금수)의 분포와 강약을 시각화합니다.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Ohang = '목' | '화' | '토' | '금' | '수'

interface OhangCount {
  목: number
  화: number
  토: number
  금: number
  수: number
}

interface OhangAnalysisProps {
  count: OhangCount
  weakElements: Ohang[]
  strongElements: Ohang[]
  missingElements: Ohang[]
  yongsin?: Ohang[]
  gisin?: Ohang[]
  seasonalInfo?: {
    season: string
    seasonName: string
    dominantElement: Ohang
    preferredYongsin: Ohang[]
    avoidedElements: Ohang[]
    description: string
  }
}

const OHANG_INFO: Record<
  Ohang,
  {
    color: string
    bgColor: string
    borderColor: string
    icon: string
    meaning: string
  }
> = {
  목: {
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-300',
    icon: '🌳',
    meaning: '성장, 발전',
  },
  화: {
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-300',
    icon: '🔥',
    meaning: '열정, 활력',
  },
  토: {
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-300',
    icon: '⛰️',
    meaning: '안정, 신뢰',
  },
  금: {
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-300',
    icon: '⚙️',
    meaning: '강인함, 결단',
  },
  수: {
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-300',
    icon: '💧',
    meaning: '지혜, 유연함',
  },
}

export function OhangAnalysis({
  count,
  weakElements,
  strongElements,
  missingElements,
  yongsin,
  gisin,
  seasonalInfo,
}: OhangAnalysisProps) {
  const total = Object.values(count).reduce((sum, val) => sum + val, 0)
  const maxCount = Math.max(...Object.values(count))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>⚖️</span>
          <span>오행 분석 (五行)</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 오행 바 차트 */}
        <div className="space-y-3">
          {(Object.keys(count) as Ohang[]).map((ohang) => {
            const info = OHANG_INFO[ohang]
            const percentage = total > 0 ? (count[ohang] / total) * 100 : 0
            const barWidth = maxCount > 0 ? (count[ohang] / maxCount) * 100 : 0

            return (
              <div key={ohang}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{info.icon}</span>
                    <span className={`font-medium ${info.color}`}>{ohang}</span>
                    <span className="text-xs text-gray-500">{info.meaning}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700">
                      {count[ohang]}개
                    </span>
                    <span className="text-xs text-gray-500">
                      ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                </div>
                <div className="h-8 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${info.bgColor} ${info.borderColor} border-r-2 transition-all duration-500`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* 오행 분석 결과 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 강한 오행 */}
          {strongElements.length > 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-semibold text-sm text-red-800 mb-2">
                🔴 강한 오행
              </h4>
              <div className="flex flex-wrap gap-2">
                {strongElements.map((ohang) => (
                  <span
                    key={ohang}
                    className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm font-medium"
                  >
                    {OHANG_INFO[ohang].icon} {ohang}
                  </span>
                ))}
              </div>
              <p className="text-xs text-red-700 mt-2">
                과도하여 피해야 할 오행
              </p>
            </div>
          )}

          {/* 약한 오행 */}
          {weakElements.length > 0 && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-sm text-yellow-800 mb-2">
                🟡 약한 오행
              </h4>
              <div className="flex flex-wrap gap-2">
                {weakElements.map((ohang) => (
                  <span
                    key={ohang}
                    className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-sm font-medium"
                  >
                    {OHANG_INFO[ohang].icon} {ohang}
                  </span>
                ))}
              </div>
              <p className="text-xs text-yellow-700 mt-2">
                보완이 필요한 오행
              </p>
            </div>
          )}

          {/* 결여된 오행 */}
          {missingElements.length > 0 && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-sm text-blue-800 mb-2">
                🔵 결여된 오행
              </h4>
              <div className="flex flex-wrap gap-2">
                {missingElements.map((ohang) => (
                  <span
                    key={ohang}
                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium"
                  >
                    {OHANG_INFO[ohang].icon} {ohang}
                  </span>
                ))}
              </div>
              <p className="text-xs text-blue-700 mt-2">
                반드시 보완해야 할 오행
              </p>
            </div>
          )}
        </div>

        {/* 용신/기신 */}
        {(yongsin || gisin) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {yongsin && yongsin.length > 0 && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-sm text-green-800 mb-2">
                  ✅ 용신 (도움되는 오행)
                </h4>
                <div className="flex flex-wrap gap-2">
                  {yongsin.map((ohang) => (
                    <span
                      key={ohang}
                      className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                    >
                      {OHANG_INFO[ohang].icon} {ohang}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-green-700 mt-2">
                  이름에 우선적으로 사용할 오행
                </p>
              </div>
            )}

            {gisin && gisin.length > 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-semibold text-sm text-red-800 mb-2">
                  ⚠️ 기신 (해로운 오행)
                </h4>
                <div className="flex flex-wrap gap-2">
                  {gisin.map((ohang) => (
                    <span
                      key={ohang}
                      className="px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-sm font-medium"
                    >
                      {OHANG_INFO[ohang].icon} {ohang}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-red-700 mt-2">
                  이름에 피해야 할 오행
                </p>
              </div>
            )}
          </div>
        )}

        {/* 계절 조후 정보 */}
        {seasonalInfo && (
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h4 className="font-semibold text-sm text-purple-800 mb-2">
              🌸 계절 조후 (調候)
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">
                  <strong>출생 계절:</strong> {seasonalInfo.seasonName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">
                  <strong>주도 오행:</strong>{' '}
                  {OHANG_INFO[seasonalInfo.dominantElement].icon}{' '}
                  {seasonalInfo.dominantElement}
                </span>
              </div>
              <p className="text-xs text-purple-700 leading-relaxed">
                {seasonalInfo.description}
              </p>
              <div className="flex gap-2 flex-wrap mt-2">
                <span className="text-xs text-purple-800 font-medium">
                  선호 오행:
                </span>
                {seasonalInfo.preferredYongsin.map((ohang) => (
                  <span
                    key={ohang}
                    className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs"
                  >
                    {OHANG_INFO[ohang].icon} {ohang}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 설명 */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-sm text-gray-700 mb-2">
            💡 오행 균형의 중요성
          </h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            오행(木火土金水)은 서로 생성(相生)하고 극복(相剋)하는 관계로,
            균형이 중요합니다. 약하거나 결여된 오행을 이름을 통해 보완하면
            운세가 좋아질 수 있습니다.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
