/**
 * 작명 결과 페이지
 */

import { notFound, redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface ResultPageProps {
  params: {
    id: string
  }
}

export default async function ResultPage({ params }: ResultPageProps) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/auth/signin?callbackUrl=/result/' + params.id)
  }

  // 요청 조회
  const request = await db.namingRequest.findUnique({
    where: {
      id: params.id,
    },
    include: {
      results: {
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      },
    },
  })

  if (!request) {
    notFound()
  }

  // 권한 확인
  if (request.userId !== session.user.id) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-2xl">
        <Card className="p-8 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold mb-2">접근 권한이 없습니다</h2>
          <p className="text-gray-600">본인의 작명 결과만 확인할 수 있습니다</p>
        </Card>
      </div>
    )
  }

  // 아직 처리 중
  if (request.status === 'PROCESSING') {
    return (
      <div className="container mx-auto px-4 py-20 max-w-2xl">
        <Card className="p-8 text-center">
          <div className="text-6xl mb-4 animate-bounce">⏳</div>
          <h2 className="text-2xl font-bold mb-2">아직 처리 중입니다</h2>
          <p className="text-gray-600 mb-6">
            작명이 진행 중입니다. 잠시 후 다시 확인해주세요.
          </p>
          <Button onClick={() => window.location.reload()}>새로고침</Button>
        </Card>
      </div>
    )
  }

  // 실패
  if (request.status === 'FAILED') {
    return (
      <div className="container mx-auto px-4 py-20 max-w-2xl">
        <Card className="p-8 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-2">오류가 발생했습니다</h2>
          <p className="text-gray-600 mb-6">
            작명 처리 중 오류가 발생했습니다. 다시 시도해주세요.
          </p>
          <Link href="/baby">
            <Button>다시 시도</Button>
          </Link>
        </Card>
      </div>
    )
  }

  const result = request.results[0]

  if (!result) {
    notFound()
  }

  const suggestions = result.suggestions as any[]
  const sajuAnalysis = result.sajuAnalysis as any

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          {request.familyName}씨 아기 이름 추천
        </h1>
        <p className="text-gray-600">
          {request.gender === 'MALE' ? '남자' : request.gender === 'FEMALE' ? '여자' : '중성'}{' '}
          아이 • {request.method === 'TRADITIONAL' ? '전통 방식' : request.method === 'MODERN' ? '현대 방식' : '종합 방식'}
        </p>
      </div>

      {/* 사주 분석 정보 (전통/종합 방식인 경우) */}
      {sajuAnalysis && (
        <Card className="p-6 mb-8">
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

      {/* 이름 추천 목록 */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">✨ 추천 이름 ({suggestions.length}개)</h2>

        {suggestions.map((suggestion, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-3xl font-bold mb-2">
                  {request.familyName}
                  {suggestion.givenName}
                </h3>
                {suggestion.hanja && (
                  <p className="text-xl text-gray-600">
                    {request.familyName} {suggestion.hanja}
                  </p>
                )}
              </div>
              {suggestion.compatibility && (
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-500">
                    {suggestion.compatibility.overall}점
                  </div>
                  <div className="text-sm text-gray-500">종합 점수</div>
                </div>
              )}
            </div>

            {/* 의미 */}
            {suggestion.meaning && (
              <div className="mb-4">
                <h4 className="font-bold text-sm text-gray-500 mb-1">의미</h4>
                <p className="text-gray-700">{suggestion.meaning}</p>
              </div>
            )}

            {/* 한자별 설명 */}
            {suggestion.hanjaDetails && suggestion.hanjaDetails.length > 0 && (
              <div className="mb-4">
                <h4 className="font-bold text-sm text-gray-500 mb-2">한자 상세</h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {suggestion.hanjaDetails.map((detail: any, idx: number) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded">
                      <div className="font-bold text-lg mb-1">
                        {detail.character} ({detail.meaning})
                      </div>
                      {detail.reading && (
                        <div className="text-sm text-gray-600">
                          음: {detail.reading}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 궁합 점수 상세 */}
            {suggestion.compatibility && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                {suggestion.compatibility.saju !== undefined && (
                  <div>
                    <div className="text-gray-500">사주 궁합</div>
                    <div className="font-bold">{suggestion.compatibility.saju}점</div>
                  </div>
                )}
                {suggestion.compatibility.phonetics !== undefined && (
                  <div>
                    <div className="text-gray-500">발음</div>
                    <div className="font-bold">{suggestion.compatibility.phonetics}점</div>
                  </div>
                )}
                {suggestion.compatibility.meaning !== undefined && (
                  <div>
                    <div className="text-gray-500">의미</div>
                    <div className="font-bold">{suggestion.compatibility.meaning}점</div>
                  </div>
                )}
                {suggestion.compatibility.strokes !== undefined && (
                  <div>
                    <div className="text-gray-500">획수</div>
                    <div className="font-bold">{suggestion.compatibility.strokes}점</div>
                  </div>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* 액션 버튼 */}
      <div className="mt-8 flex gap-4 justify-center">
        <Link href="/baby">
          <Button variant="outline" size="lg">
            다시 작명하기
          </Button>
        </Link>
        <Button size="lg" onClick={() => window.print()}>
          결과 인쇄
        </Button>
      </div>
    </div>
  )
}
