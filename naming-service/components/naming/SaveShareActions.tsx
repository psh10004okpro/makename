'use client'

/**
 * 저장 및 공유 액션 컴포넌트
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface SaveShareActionsProps {
  resultId: string
  name: string
}

export function SaveShareActions({ resultId, name }: SaveShareActionsProps) {
  const [isSaved, setIsSaved] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copied, setCopied] = useState(false)

  // 즐겨찾기 토글
  const toggleFavorite = async () => {
    try {
      // TODO: API 호출하여 즐겨찾기 저장
      // await fetch('/api/favorites', {
      //   method: 'POST',
      //   body: JSON.stringify({ resultId }),
      // })

      setIsSaved(!isSaved)

      // 로컬스토리지에 저장 (임시)
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
      if (!isSaved) {
        favorites.push(resultId)
      } else {
        const index = favorites.indexOf(resultId)
        if (index > -1) favorites.splice(index, 1)
      }
      localStorage.setItem('favorites', JSON.stringify(favorites))
    } catch (error) {
      console.error('즐겨찾기 오류:', error)
      alert('즐겨찾기 저장 중 오류가 발생했습니다.')
    }
  }

  // URL 복사
  const copyURL = async () => {
    try {
      const url = `${window.location.origin}/result/${resultId}`
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('URL 복사 오류:', error)
      alert('URL 복사 중 오류가 발생했습니다.')
    }
  }

  // 카카오톡 공유 (선택)
  const shareKakao = () => {
    // TODO: 카카오톡 SDK 연동
    alert('카카오톡 공유 기능은 준비 중입니다.')
  }

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">💾 저장 및 공유</h3>

        <div className="grid md:grid-cols-2 gap-3">
          {/* 즐겨찾기 */}
          <Button
            variant={isSaved ? 'default' : 'outline'}
            onClick={toggleFavorite}
            className="w-full"
          >
            {isSaved ? '⭐ 즐겨찾기 됨' : '☆ 즐겨찾기'}
          </Button>

          {/* 공유 메뉴 토글 */}
          <Button
            variant="outline"
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="w-full"
          >
            📤 공유하기
          </Button>
        </div>

        {/* 공유 옵션 */}
        {showShareMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t space-y-2"
          >
            {/* URL 복사 */}
            <Button
              variant="outline"
              onClick={copyURL}
              className="w-full justify-start"
            >
              {copied ? (
                <>
                  ✓ URL 복사됨
                </>
              ) : (
                <>
                  🔗 URL 복사
                </>
              )}
            </Button>

            {/* 카카오톡 공유 */}
            <Button
              variant="outline"
              onClick={shareKakao}
              className="w-full justify-start bg-yellow-50 hover:bg-yellow-100"
            >
              💬 카카오톡으로 공유
            </Button>

            {/* 이메일 공유 */}
            <Button
              variant="outline"
              onClick={() => {
                const subject = `작명 결과: ${name}`
                const body = `작명 결과를 확인해보세요:\n${window.location.origin}/result/${resultId}`
                window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
              }}
              className="w-full justify-start"
            >
              ✉️ 이메일로 공유
            </Button>
          </motion.div>
        )}
      </Card>

      {/* 저장된 항목 안내 */}
      {isSaved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-4 bg-blue-50 border-blue-200">
            <p className="text-sm text-blue-700">
              ✓ 이 이름이 즐겨찾기에 저장되었습니다. 마이페이지에서 다시 볼 수 있습니다.
            </p>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
