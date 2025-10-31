/**
 * 사주팔자 표 컴포넌트
 *
 * 년주, 월주, 일주, 시주를 시각적으로 표시합니다.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Pillar {
  cheongan: string
  jiji: string
  name: string
  hanja: string
}

interface SajuChartProps {
  year: Pillar
  month: Pillar
  day: Pillar
  hour: Pillar
  birthInfo?: {
    date: Date
    isLunar: boolean
  }
}

export function SajuChart({ year, month, day, hour, birthInfo }: SajuChartProps) {
  const pillars = [
    { name: '시주', label: 'Hour', data: hour, color: 'bg-purple-100 border-purple-300' },
    { name: '일주', label: 'Day', data: day, color: 'bg-blue-100 border-blue-300' },
    { name: '월주', label: 'Month', data: month, color: 'bg-green-100 border-green-300' },
    { name: '년주', label: 'Year', data: year, color: 'bg-yellow-100 border-yellow-300' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>📅</span>
          <span>사주팔자 (四柱八字)</span>
        </CardTitle>
        {birthInfo && (
          <p className="text-sm text-gray-600">
            {birthInfo.date.toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}{' '}
            {birthInfo.isLunar ? '(음력)' : '(양력)'}
          </p>
        )}
      </CardHeader>
      <CardContent>
        {/* 데스크톱 뷰 */}
        <div className="hidden md:block">
          <div className="grid grid-cols-4 gap-4">
            {pillars.map((pillar) => (
              <div
                key={pillar.label}
                className={`border-2 rounded-lg p-4 ${pillar.color}`}
              >
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-600 mb-2">
                    {pillar.name}
                  </div>
                  <div className="space-y-3">
                    {/* 천간 */}
                    <div className="bg-white rounded p-3 border border-gray-200">
                      <div className="text-xs text-gray-500 mb-1">천간</div>
                      <div className="text-2xl font-bold text-gray-800">
                        {pillar.data.cheongan}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        天干
                      </div>
                    </div>
                    {/* 지지 */}
                    <div className="bg-white rounded p-3 border border-gray-200">
                      <div className="text-xs text-gray-500 mb-1">지지</div>
                      <div className="text-2xl font-bold text-gray-800">
                        {pillar.data.jiji}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        地支
                      </div>
                    </div>
                  </div>
                  {/* 한자 표기 */}
                  <div className="mt-3 text-lg font-semibold text-gray-700">
                    {pillar.data.hanja}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 모바일 뷰 */}
        <div className="md:hidden space-y-3">
          {pillars.map((pillar) => (
            <div
              key={pillar.label}
              className={`border-2 rounded-lg p-4 ${pillar.color}`}
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-600">
                  {pillar.name}
                </div>
                <div className="flex gap-4">
                  {/* 천간 */}
                  <div className="bg-white rounded px-3 py-2 border border-gray-200">
                    <div className="text-xs text-gray-500 mb-0.5">천간</div>
                    <div className="text-xl font-bold text-gray-800">
                      {pillar.data.cheongan}
                    </div>
                  </div>
                  {/* 지지 */}
                  <div className="bg-white rounded px-3 py-2 border border-gray-200">
                    <div className="text-xs text-gray-500 mb-0.5">지지</div>
                    <div className="text-xl font-bold text-gray-800">
                      {pillar.data.jiji}
                    </div>
                  </div>
                </div>
                {/* 한자 표기 */}
                <div className="text-lg font-semibold text-gray-700">
                  {pillar.data.hanja}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 설명 */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-sm text-gray-700 mb-2">💡 사주팔자란?</h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            사주팔자는 태어난 년(年), 월(月), 일(日), 시(時)의 천간(天干)과 지지(地支)를
            나타내는 8개의 글자로, 개인의 타고난 운명과 성격을 분석하는 기준이 됩니다.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
