'use client'

/**
 * PDF 리포트 생성 컴포넌트
 */

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

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
    strokes?: number
  }>
}

interface ReportGeneratorProps {
  suggestion: NameSuggestion
  familyName: string
  sajuAnalysis?: any
}

export function ReportGenerator({
  suggestion,
  familyName,
  sajuAnalysis,
}: ReportGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const generatePDF = async () => {
    setIsGenerating(true)

    try {
      // 리포트 데이터 준비
      const reportData = {
        name: `${familyName}${suggestion.givenName}`,
        hanja: suggestion.hanja ? `${familyName} ${suggestion.hanja}` : undefined,
        meaning: suggestion.meaning,
        pronunciation: suggestion.pronunciation,
        compatibility: suggestion.compatibility,
        hanjaDetails: suggestion.hanjaDetails,
        sajuAnalysis,
        generatedAt: new Date().toLocaleDateString('ko-KR'),
      }

      // TODO: API 호출하여 PDF 생성
      // const response = await fetch('/api/generate-pdf', {
      //   method: 'POST',
      //   body: JSON.stringify(reportData),
      // })

      // 임시로 window.print() 사용
      window.print()

      alert('리포트 생성이 완료되었습니다!')
    } catch (error) {
      console.error('리포트 생성 오류:', error)
      alert('리포트 생성 중 오류가 발생했습니다.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-4">📄 작명 리포트</h3>
      <p className="text-gray-600 mb-4">
        선택한 이름의 상세 정보를 PDF로 저장할 수 있습니다.
      </p>

      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <h4 className="font-bold mb-2">리포트 포함 내용:</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>✓ 선택한 이름 정보 (한글, 한자)</li>
          <li>✓ 의미 및 발음 설명</li>
          <li>✓ 사주팔자 분석 결과</li>
          <li>✓ 한자 상세 정보</li>
          <li>✓ 궁합 점수 및 평가</li>
          <li>✓ 작명 근거 및 추천 이유</li>
        </ul>
      </div>

      <Button
        onClick={generatePDF}
        disabled={isGenerating}
        className="w-full"
        size="lg"
      >
        {isGenerating ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            생성 중...
          </>
        ) : (
          '📥 PDF 리포트 다운로드'
        )}
      </Button>

      <p className="text-xs text-gray-500 mt-2 text-center">
        리포트는 A4 용지 크기로 생성됩니다
      </p>
    </Card>
  )
}

/**
 * 인쇄용 스타일 (Print-friendly version)
 */
export function PrintableReport({
  suggestion,
  familyName,
  sajuAnalysis,
}: ReportGeneratorProps) {
  return (
    <div className="hidden print:block p-8 bg-white">
      {/* 제목 */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">작명 보고서</h1>
        <p className="text-gray-600">
          생성일: {new Date().toLocaleDateString('ko-KR')}
        </p>
      </div>

      {/* 선택한 이름 */}
      <div className="mb-8 border-2 border-blue-500 p-6 rounded-lg">
        <h2 className="text-3xl font-bold mb-4">
          {familyName}
          {suggestion.givenName}
        </h2>
        {suggestion.hanja && (
          <p className="text-2xl text-gray-600 mb-2">
            {familyName} {suggestion.hanja}
          </p>
        )}
        {suggestion.compatibility && (
          <p className="text-xl">
            <strong>종합 점수:</strong> {suggestion.compatibility.overall}점
          </p>
        )}
      </div>

      {/* 의미 */}
      {suggestion.meaning && (
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">의미</h3>
          <p className="text-gray-700">{suggestion.meaning}</p>
        </div>
      )}

      {/* 한자 상세 */}
      {suggestion.hanjaDetails && suggestion.hanjaDetails.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">한자 상세</h3>
          <div className="grid grid-cols-2 gap-4">
            {suggestion.hanjaDetails.map((hanja, index) => (
              <div key={index} className="border p-4 rounded">
                <div className="text-4xl font-bold mb-2">{hanja.character}</div>
                <p>
                  <strong>뜻:</strong> {hanja.meaning}
                </p>
                {hanja.strokes && (
                  <p>
                    <strong>획수:</strong> {hanja.strokes}획
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 궁합 점수 */}
      {suggestion.compatibility && (
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">궁합 점수</h3>
          <table className="w-full border">
            <tbody>
              {suggestion.compatibility.saju !== undefined && (
                <tr className="border-b">
                  <td className="p-2 font-bold">사주 궁합</td>
                  <td className="p-2 text-right">{suggestion.compatibility.saju}점</td>
                </tr>
              )}
              {suggestion.compatibility.phonetics !== undefined && (
                <tr className="border-b">
                  <td className="p-2 font-bold">발음</td>
                  <td className="p-2 text-right">
                    {suggestion.compatibility.phonetics}점
                  </td>
                </tr>
              )}
              {suggestion.compatibility.meaning !== undefined && (
                <tr className="border-b">
                  <td className="p-2 font-bold">의미</td>
                  <td className="p-2 text-right">
                    {suggestion.compatibility.meaning}점
                  </td>
                </tr>
              )}
              {suggestion.compatibility.strokes !== undefined && (
                <tr className="border-b">
                  <td className="p-2 font-bold">획수</td>
                  <td className="p-2 text-right">
                    {suggestion.compatibility.strokes}점
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 사주 분석 */}
      {sajuAnalysis && (
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">사주팔자 분석</h3>
          {sajuAnalysis.saju && (
            <div className="grid grid-cols-4 gap-2 mb-4">
              <div>
                <strong>년주:</strong> {sajuAnalysis.saju.year}
              </div>
              <div>
                <strong>월주:</strong> {sajuAnalysis.saju.month}
              </div>
              <div>
                <strong>일주:</strong> {sajuAnalysis.saju.day}
              </div>
              <div>
                <strong>시주:</strong> {sajuAnalysis.saju.hour}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 푸터 */}
      <div className="mt-12 pt-6 border-t text-center text-sm text-gray-500">
        <p>본 작명 보고서는 AI와 전통 작명법을 결합하여 생성되었습니다.</p>
        <p className="mt-2">
          작명소 • {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}
