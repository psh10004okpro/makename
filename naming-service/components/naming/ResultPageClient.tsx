'use client'

/**
 * 결과 페이지 클라이언트 컴포넌트
 * Phase 7 모든 UI 컴포넌트 통합
 */

import { useState } from 'react'
import { ResultList } from './ResultList'
import { DetailDialog } from './DetailDialog'
import { ComparisonView } from './ComparisonView'
import { ReportGenerator } from './ReportGenerator'
import { SaveShareActions } from './SaveShareActions'
import { HanjaSelector } from './HanjaSelector'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

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
  sajuAnalysis?: any
}

interface ResultPageClientProps {
  requestId: string
  familyName: string
  gender: string
  method: string
  suggestions: NameSuggestion[]
  sajuAnalysis?: any
}

type ViewMode = 'list' | 'comparison'

export function ResultPageClient({
  requestId,
  familyName,
  gender,
  method,
  suggestions,
  sajuAnalysis,
}: ResultPageClientProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedForDetail, setSelectedForDetail] = useState<NameSuggestion | null>(null)
  const [selectedForComparison, setSelectedForComparison] = useState<NameSuggestion[]>([])
  const [selectedForReport, setSelectedForReport] = useState<NameSuggestion | null>(null)
  const [selectedForHanja, setSelectedForHanja] = useState<NameSuggestion | null>(null)

  // 상세보기 핸들러
  const handleViewDetail = (suggestion: NameSuggestion) => {
    setSelectedForDetail(suggestion)
  }

  // 비교 모드 토글
  const handleToggleComparison = (suggestions: NameSuggestion[]) => {
    if (suggestions.length > 0) {
      setSelectedForComparison(suggestions)
      setViewMode('comparison')
    } else {
      setViewMode('list')
    }
  }

  // 비교 모드에서 선택
  const handleSelectFromComparison = (suggestion: NameSuggestion) => {
    setSelectedForDetail(suggestion)
    setViewMode('list')
  }

  // 리포트 생성
  const handleGenerateReport = (suggestion: NameSuggestion) => {
    setSelectedForReport(suggestion)
  }

  // 한자 선택
  const handleSelectHanja = (suggestion: NameSuggestion) => {
    setSelectedForHanja(suggestion)
  }

  // 한자 변경 핸들러
  const handleHanjaChange = (newHanja: string, position: number, character: string) => {
    console.log('한자 변경:', { newHanja, position, character })
    // TODO: API 호출하여 새로운 궁합 점수 계산
  }

  return (
    <div className="space-y-8">
      {/* 사주 분석 정보 */}
      {sajuAnalysis && (
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">📜 사주팔자 분석</h2>
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <div>
              <div className="text-sm text-gray-500">년주</div>
              <div className="font-bold text-lg">{sajuAnalysis.saju?.year}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">월주</div>
              <div className="font-bold text-lg">{sajuAnalysis.saju?.month}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">일주</div>
              <div className="font-bold text-lg">{sajuAnalysis.saju?.day}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">시주</div>
              <div className="font-bold text-lg">{sajuAnalysis.saju?.hour}</div>
            </div>
          </div>

          {sajuAnalysis.ohang && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold mb-2">오행 분석</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                {sajuAnalysis.ohang.yongsin && (
                  <div>
                    <span className="text-gray-600">용신:</span>{' '}
                    <span className="font-medium">{sajuAnalysis.ohang.yongsin.join(', ')}</span>
                  </div>
                )}
                {sajuAnalysis.ohang.weakElements && sajuAnalysis.ohang.weakElements.length > 0 && (
                  <div>
                    <span className="text-gray-600">약한 오행:</span>{' '}
                    <span className="font-medium">{sajuAnalysis.ohang.weakElements.join(', ')}</span>
                  </div>
                )}
                {sajuAnalysis.ohang.strongElements && sajuAnalysis.ohang.strongElements.length > 0 && (
                  <div>
                    <span className="text-gray-600">강한 오행:</span>{' '}
                    <span className="font-medium">{sajuAnalysis.ohang.strongElements.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* 뷰 모드 전환 */}
      {viewMode === 'list' ? (
        <>
          {/* 결과 리스트 */}
          <ResultList
            suggestions={suggestions}
            familyName={familyName}
            onViewDetail={handleViewDetail}
            onCompare={handleToggleComparison}
            onGenerateReport={handleGenerateReport}
            onSelectHanja={handleSelectHanja}
          />

          {/* 저장 및 공유 */}
          <SaveShareActions
            resultId={requestId}
            name={suggestions[0]?.givenName || ''}
          />
        </>
      ) : (
        <>
          {/* 비교 뷰 */}
          <ComparisonView
            suggestions={selectedForComparison}
            familyName={familyName}
            onClose={() => setViewMode('list')}
            onSelect={handleSelectFromComparison}
          />

          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => setViewMode('list')}
              size="lg"
            >
              목록으로 돌아가기
            </Button>
          </div>
        </>
      )}

      {/* 상세 다이얼로그 */}
      <DetailDialog
        open={!!selectedForDetail}
        onOpenChange={(open) => !open && setSelectedForDetail(null)}
        suggestion={selectedForDetail}
        familyName={familyName}
      />

      {/* 리포트 생성 다이얼로그 */}
      {selectedForReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">작명 결과 리포트</h2>
              <Button
                variant="outline"
                onClick={() => setSelectedForReport(null)}
              >
                닫기
              </Button>
            </div>
            <ReportGenerator
              suggestion={selectedForReport}
              familyName={familyName}
              sajuAnalysis={sajuAnalysis}
            />
          </div>
        </div>
      )}

      {/* 한자 선택 다이얼로그 */}
      {selectedForHanja && selectedForHanja.hanja && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">한자 선택</h2>
              <Button
                variant="outline"
                onClick={() => setSelectedForHanja(null)}
              >
                닫기
              </Button>
            </div>

            <HanjaSelector
              givenName={selectedForHanja.givenName}
              initialHanja={selectedForHanja.hanja}
              hanjaPositions={
                // 예시 데이터 - 실제로는 API에서 가져와야 함
                selectedForHanja.givenName.split('').map((char, index) => ({
                  index,
                  currentCharacter: selectedForHanja.hanja![index],
                  alternatives: [
                    {
                      character: selectedForHanja.hanja![index],
                      meaning: selectedForHanja.hanjaDetails?.[index]?.meaning || '',
                      strokes: selectedForHanja.hanjaDetails?.[index]?.strokes || 0,
                      pronunciation: char,
                    },
                    // 임시 대체 한자 예시
                    {
                      character: '準',
                      meaning: '준할 준',
                      strokes: 13,
                      pronunciation: char,
                    },
                    {
                      character: '俊',
                      meaning: '뛰어날 준',
                      strokes: 9,
                      pronunciation: char,
                    },
                  ],
                }))
              }
              onHanjaChange={handleHanjaChange}
              onScoreRecalculate={(newScore) => {
                console.log('새 점수:', newScore)
                // TODO: 선택된 이름의 점수 업데이트
              }}
            />
          </div>
        </div>
      )}

      {/* 액션 버튼 */}
      <div className="flex gap-4 justify-center pt-8 border-t">
        <Link href="/baby">
          <Button variant="outline" size="lg">
            다시 작명하기
          </Button>
        </Link>
        <Button
          size="lg"
          variant="outline"
          onClick={() => window.print()}
        >
          결과 인쇄
        </Button>
      </div>
    </div>
  )
}
