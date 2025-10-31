/**
 * 대운 타임라인 컴포넌트
 *
 * 10년 단위 대운을 타임라인 형태로 시각화합니다.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Daeun {
  cheongan: string
  jiji: string
  name: string
  hanja: string
  startAge: number
  endAge: number
  ohang: {
    cheongan: string
    jiji: string
  }
  sipseong: {
    cheongan: string
    jiji: string
  }
}

interface DaeunTimelineProps {
  direction: '순행' | '역행'
  startAge: number
  cycles: Daeun[]
  currentCycle?: Daeun
  nextCycle?: Daeun
  currentAge?: number
}

export function DaeunTimeline({
  direction,
  startAge,
  cycles,
  currentCycle,
  nextCycle,
  currentAge,
}: DaeunTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>🔮</span>
          <span>대운 분석 (大運)</span>
        </CardTitle>
        <p className="text-sm text-gray-600">
          {direction} • {startAge}세 입운
          {currentAge && ` • 현재 ${currentAge}세`}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 현재/다음 대운 요약 */}
        {(currentCycle || nextCycle) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 현재 대운 */}
            {currentCycle && (
              <div className="p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
                <h4 className="font-semibold text-sm text-blue-800 mb-3">
                  🎯 현재 대운
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-900">
                      {currentCycle.hanja}
                    </span>
                    <span className="text-sm text-blue-700">
                      {currentCycle.name}
                    </span>
                  </div>
                  <div className="text-sm text-blue-800">
                    {currentCycle.startAge}세 - {currentCycle.endAge}세 (10년)
                  </div>
                  <div className="flex gap-2 text-xs">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                      천간: {currentCycle.sipseong.cheongan}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                      지지: {currentCycle.sipseong.jiji}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 다음 대운 */}
            {nextCycle && (
              <div className="p-4 bg-green-50 border-2 border-green-300 rounded-lg">
                <h4 className="font-semibold text-sm text-green-800 mb-3">
                  ⏭️ 다음 대운
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-900">
                      {nextCycle.hanja}
                    </span>
                    <span className="text-sm text-green-700">
                      {nextCycle.name}
                    </span>
                  </div>
                  <div className="text-sm text-green-800">
                    {nextCycle.startAge}세 - {nextCycle.endAge}세 (10년)
                  </div>
                  <div className="flex gap-2 text-xs">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                      천간: {nextCycle.sipseong.cheongan}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                      지지: {nextCycle.sipseong.jiji}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 대운 타임라인 */}
        <div>
          <h4 className="font-semibold text-sm text-gray-700 mb-4">
            전체 대운 타임라인 (100세까지)
          </h4>

          {/* 데스크톱 뷰 */}
          <div className="hidden md:block overflow-x-auto">
            <div className="flex gap-2 min-w-max pb-4">
              {cycles.slice(0, 10).map((cycle, index) => {
                const isCurrent =
                  currentCycle &&
                  cycle.startAge === currentCycle.startAge

                return (
                  <div
                    key={index}
                    className={`flex-shrink-0 w-32 p-3 rounded-lg border-2 transition-all ${
                      isCurrent
                        ? 'bg-blue-100 border-blue-400 shadow-lg scale-105'
                        : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center space-y-2">
                      {/* 간지 */}
                      <div
                        className={`text-xl font-bold ${
                          isCurrent ? 'text-blue-900' : 'text-gray-800'
                        }`}
                      >
                        {cycle.hanja}
                      </div>

                      {/* 나이 */}
                      <div
                        className={`text-sm font-medium ${
                          isCurrent ? 'text-blue-700' : 'text-gray-600'
                        }`}
                      >
                        {cycle.startAge}-{cycle.endAge}세
                      </div>

                      {/* 십성 */}
                      <div className="space-y-1">
                        <div className="text-xs bg-white rounded px-2 py-1 border">
                          <span className="text-gray-500">천:</span>{' '}
                          <span className="font-medium">
                            {cycle.sipseong.cheongan}
                          </span>
                        </div>
                        <div className="text-xs bg-white rounded px-2 py-1 border">
                          <span className="text-gray-500">지:</span>{' '}
                          <span className="font-medium">
                            {cycle.sipseong.jiji}
                          </span>
                        </div>
                      </div>

                      {/* 현재 표시 */}
                      {isCurrent && (
                        <div className="mt-2">
                          <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full font-medium">
                            현재
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 모바일 뷰 */}
          <div className="md:hidden space-y-3">
            {cycles.slice(0, 10).map((cycle, index) => {
              const isCurrent =
                currentCycle &&
                cycle.startAge === currentCycle.startAge

              return (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-2 ${
                    isCurrent
                      ? 'bg-blue-100 border-blue-400 shadow-lg'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {/* 간지와 나이 */}
                    <div>
                      <div
                        className={`text-lg font-bold ${
                          isCurrent ? 'text-blue-900' : 'text-gray-800'
                        }`}
                      >
                        {cycle.hanja} ({cycle.name})
                      </div>
                      <div
                        className={`text-sm ${
                          isCurrent ? 'text-blue-700' : 'text-gray-600'
                        }`}
                      >
                        {cycle.startAge}-{cycle.endAge}세
                      </div>
                    </div>

                    {/* 십성 */}
                    <div className="flex gap-2">
                      <div className="text-xs bg-white rounded px-2 py-1 border">
                        <div className="text-gray-500">천간</div>
                        <div className="font-medium">
                          {cycle.sipseong.cheongan}
                        </div>
                      </div>
                      <div className="text-xs bg-white rounded px-2 py-1 border">
                        <div className="text-gray-500">지지</div>
                        <div className="font-medium">
                          {cycle.sipseong.jiji}
                        </div>
                      </div>
                    </div>

                    {/* 현재 표시 */}
                    {isCurrent && (
                      <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full font-medium">
                        현재
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 설명 */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-sm text-gray-700 mb-2">
            💡 대운이란?
          </h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            대운(大運)은 10년 단위로 변하는 운세의 흐름입니다. {direction} 방향으로
            진행되며, {startAge}세부터 본격적으로 영향을 받기 시작합니다. 각
            대운마다 천간과 지지의 십성이 달라 운세의 흐름이 변화합니다.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
