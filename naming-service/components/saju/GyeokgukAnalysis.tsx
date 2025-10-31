/**
 * 격국 분석 컴포넌트
 *
 * 격국(格局) 분석 결과를 시각화합니다.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface GyeokgukAnalysisProps {
  gyeokguk: string
  category: '정격' | '외격' | '기타'
  strength: '강' | '중' | '약' | '파격'
  yongsin: string[]
  heesin: string[]
  gisin: string[]
  description: string
  characteristics: string[]
  careerSuitability: string[]
  wealthLuck: '매우 좋음' | '좋음' | '보통' | '약함'
  fameLuck: '매우 좋음' | '좋음' | '보통' | '약함'
  academicLuck: '매우 좋음' | '좋음' | '보통' | '약함'
  warnings: string[]
}

const CATEGORY_INFO = {
  정격: {
    color: 'bg-blue-500',
    textColor: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
    icon: '🏛️',
    description: '일반 격국 (8가지)',
  },
  외격: {
    color: 'bg-purple-500',
    textColor: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-300',
    icon: '⭐',
    description: '특수 격국 (종격 등)',
  },
  기타: {
    color: 'bg-gray-500',
    textColor: 'text-gray-700',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-300',
    icon: '📋',
    description: '기타 격국',
  },
}

const STRENGTH_INFO = {
  강: { color: 'bg-green-500', text: '강함', icon: '💪' },
  중: { color: 'bg-yellow-500', text: '중간', icon: '⚖️' },
  약: { color: 'bg-orange-500', text: '약함', icon: '📉' },
  파격: { color: 'bg-red-500', text: '파격', icon: '⚠️' },
}

const LUCK_INFO = {
  '매우 좋음': { color: 'bg-green-500', icon: '🌟' },
  좋음: { color: 'bg-blue-500', icon: '✨' },
  보통: { color: 'bg-yellow-500', icon: '⭐' },
  약함: { color: 'bg-gray-500', icon: '💫' },
}

export function GyeokgukAnalysis({
  gyeokguk,
  category,
  strength,
  yongsin,
  heesin,
  gisin,
  description,
  characteristics,
  careerSuitability,
  wealthLuck,
  fameLuck,
  academicLuck,
  warnings,
}: GyeokgukAnalysisProps) {
  const categoryInfo = CATEGORY_INFO[category]
  const strengthInfo = STRENGTH_INFO[strength]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>🏛️</span>
          <span>격국 분석 (格局)</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 격국 정보 */}
        <div className={`p-6 ${categoryInfo.bgColor} border-2 ${categoryInfo.borderColor} rounded-lg`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{categoryInfo.icon}</span>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{gyeokguk}</h3>
                <p className="text-sm text-gray-600">
                  {categoryInfo.description}
                </p>
              </div>
            </div>

            {/* 격국 강도 */}
            <div className="text-center">
              <div className="text-3xl mb-1">{strengthInfo.icon}</div>
              <div className={`px-4 py-2 ${strengthInfo.color} text-white rounded-lg font-semibold`}>
                {strengthInfo.text}
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-700 leading-relaxed">{description}</p>
        </div>

        {/* 용신/희신/기신 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 용신 */}
          {yongsin.length > 0 && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-sm text-green-800 mb-3">
                ✅ 용신 (필요한 십성)
              </h4>
              <div className="flex flex-wrap gap-2">
                {yongsin.map((item, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <p className="text-xs text-green-700 mt-2">
                가장 필요한 십성
              </p>
            </div>
          )}

          {/* 희신 */}
          {heesin.length > 0 && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-sm text-blue-800 mb-3">
                ✨ 희신 (도움되는 십성)
              </h4>
              <div className="flex flex-wrap gap-2">
                {heesin.map((item, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <p className="text-xs text-blue-700 mt-2">
                보조적으로 도움
              </p>
            </div>
          )}

          {/* 기신 */}
          {gisin.length > 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-semibold text-sm text-red-800 mb-3">
                ⚠️ 기신 (해로운 십성)
              </h4>
              <div className="flex flex-wrap gap-2">
                {gisin.map((item, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-sm font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <p className="text-xs text-red-700 mt-2">
                피해야 할 십성
              </p>
            </div>
          )}
        </div>

        {/* 성격 특성 */}
        {characteristics.length > 0 && (
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h4 className="font-semibold text-sm text-purple-800 mb-3">
              🎯 성격 특성
            </h4>
            <ul className="space-y-2">
              {characteristics.map((char, index) => (
                <li
                  key={index}
                  className="text-sm text-purple-700 flex items-start gap-2"
                >
                  <span className="text-purple-500 mt-0.5">•</span>
                  <span>{char}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 직업 적성 */}
        {careerSuitability.length > 0 && (
          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
            <h4 className="font-semibold text-sm text-indigo-800 mb-3">
              💼 직업 적성
            </h4>
            <div className="flex flex-wrap gap-2">
              {careerSuitability.map((career, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                >
                  {career}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 운세 평가 */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <h4 className="font-semibold text-sm text-amber-800 mb-4">
            📊 운세 평가
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 재물운 */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">💰</span>
                <span className="text-sm font-medium text-gray-700">
                  재물운
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">{LUCK_INFO[wealthLuck].icon}</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${LUCK_INFO[wealthLuck].color} transition-all`}
                    style={{
                      width:
                        wealthLuck === '매우 좋음'
                          ? '100%'
                          : wealthLuck === '좋음'
                          ? '75%'
                          : wealthLuck === '보통'
                          ? '50%'
                          : '25%',
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {wealthLuck}
                </span>
              </div>
            </div>

            {/* 명예운 */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">👑</span>
                <span className="text-sm font-medium text-gray-700">
                  명예운
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">{LUCK_INFO[fameLuck].icon}</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${LUCK_INFO[fameLuck].color} transition-all`}
                    style={{
                      width:
                        fameLuck === '매우 좋음'
                          ? '100%'
                          : fameLuck === '좋음'
                          ? '75%'
                          : fameLuck === '보통'
                          ? '50%'
                          : '25%',
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {fameLuck}
                </span>
              </div>
            </div>

            {/* 학업운 */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">📚</span>
                <span className="text-sm font-medium text-gray-700">
                  학업운
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">{LUCK_INFO[academicLuck].icon}</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${LUCK_INFO[academicLuck].color} transition-all`}
                    style={{
                      width:
                        academicLuck === '매우 좋음'
                          ? '100%'
                          : academicLuck === '좋음'
                          ? '75%'
                          : academicLuck === '보통'
                          ? '50%'
                          : '25%',
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {academicLuck}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 주의사항 */}
        {warnings.length > 0 && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="font-semibold text-sm text-red-800 mb-3">
              ⚠️ 주의사항
            </h4>
            <ul className="space-y-2">
              {warnings.map((warning, index) => (
                <li
                  key={index}
                  className="text-sm text-red-700 flex items-start gap-2"
                >
                  <span className="text-red-500 mt-0.5">⚠</span>
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 설명 */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-sm text-gray-700 mb-2">
            💡 격국이란?
          </h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            격국(格局)은 사주의 전체적인 구조와 패턴을 나타냅니다. 정격 8가지와
            외격(종격) 등으로 분류되며, 격국에 따라 용신(필요한 십성), 희신(도움되는
            십성), 기신(해로운 십성)이 달라집니다. 격국에 맞는 이름을 짓는 것이
            중요합니다.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
