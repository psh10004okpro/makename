/**
 * 작명 결과 페이지
 */

import { notFound, redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ResultPageClient } from '@/components/naming/ResultPageClient'

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
  const request = await prisma.namingRequest.findUnique({
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

      {/* 클라이언트 컴포넌트로 전체 결과 UI 렌더링 */}
      <ResultPageClient
        requestId={request.id}
        familyName={request.familyName}
        gender={request.gender}
        method={request.method}
        suggestions={suggestions}
        sajuAnalysis={sajuAnalysis}
      />
    </div>
  )
}
