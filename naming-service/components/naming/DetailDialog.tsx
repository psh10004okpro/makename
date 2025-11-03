'use client'

/**
 * 이름 상세 정보 Dialog
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
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
    reading?: string
    strokes?: number
    origin?: string
  }>
  sajuAnalysis?: {
    ohangBalance?: string
    luckyElements?: string[]
    warnings?: string[]
  }
}

interface DetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  suggestion: NameSuggestion | null
  familyName: string
}

export function DetailDialog({
  open,
  onOpenChange,
  suggestion,
  familyName,
}: DetailDialogProps) {
  const [activeTab, setActiveTab] = useState('basic')

  if (!suggestion) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        {/* 헤더 */}
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-4xl mb-2">
                {familyName}
                {suggestion.givenName}
              </DialogTitle>
              {suggestion.hanja && (
                <DialogDescription className="text-2xl">
                  {familyName} {suggestion.hanja}
                </DialogDescription>
              )}
            </div>
            {suggestion.compatibility && (
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-500">
                  {suggestion.compatibility.overall}점
                </div>
                <div className="text-sm text-gray-500">종합 점수</div>
              </div>
            )}
          </div>
        </DialogHeader>

        {/* 탭 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="basic">기본 정보</TabsTrigger>
            <TabsTrigger value="saju">사주 분석</TabsTrigger>
            <TabsTrigger value="hanja">한자 상세</TabsTrigger>
          </TabsList>

          {/* 기본 정보 탭 */}
          <TabsContent value="basic" className="space-y-4">
            {/* 의미 */}
            {suggestion.meaning && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-4">
                  <h3 className="font-bold mb-2 flex items-center gap-2">
                    <span className="text-2xl">📖</span>
                    의미
                  </h3>
                  <p className="text-gray-700">{suggestion.meaning}</p>
                </Card>
              </motion.div>
            )}

            {/* 발음 */}
            {suggestion.pronunciation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="p-4">
                  <h3 className="font-bold mb-2 flex items-center gap-2">
                    <span className="text-2xl">🔊</span>
                    발음 특징
                  </h3>
                  <p className="text-gray-700">{suggestion.pronunciation}</p>
                </Card>
              </motion.div>
            )}

            {/* 궁합 점수 상세 */}
            {suggestion.compatibility && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="p-4">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <span className="text-2xl">📊</span>
                    세부 점수
                  </h3>
                  <div className="space-y-3">
                    {suggestion.compatibility.saju !== undefined && (
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">사주 궁합</span>
                          <span className="text-sm font-bold">
                            {suggestion.compatibility.saju}점
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${suggestion.compatibility.saju}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {suggestion.compatibility.phonetics !== undefined && (
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">발음</span>
                          <span className="text-sm font-bold">
                            {suggestion.compatibility.phonetics}점
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all"
                            style={{ width: `${suggestion.compatibility.phonetics}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {suggestion.compatibility.meaning !== undefined && (
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">의미</span>
                          <span className="text-sm font-bold">
                            {suggestion.compatibility.meaning}점
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full transition-all"
                            style={{ width: `${suggestion.compatibility.meaning}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {suggestion.compatibility.strokes !== undefined && (
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">획수</span>
                          <span className="text-sm font-bold">
                            {suggestion.compatibility.strokes}점
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-500 h-2 rounded-full transition-all"
                            style={{ width: `${suggestion.compatibility.strokes}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}
          </TabsContent>

          {/* 사주 분석 탭 */}
          <TabsContent value="saju" className="space-y-4">
            {suggestion.sajuAnalysis ? (
              <>
                {suggestion.sajuAnalysis.ohangBalance && (
                  <Card className="p-4">
                    <h3 className="font-bold mb-2">오행 균형</h3>
                    <p className="text-gray-700">{suggestion.sajuAnalysis.ohangBalance}</p>
                  </Card>
                )}

                {suggestion.sajuAnalysis.luckyElements &&
                  suggestion.sajuAnalysis.luckyElements.length > 0 && (
                    <Card className="p-4 bg-green-50">
                      <h3 className="font-bold mb-2 text-green-700">✅ 좋은 점</h3>
                      <ul className="space-y-1">
                        {suggestion.sajuAnalysis.luckyElements.map((item, i) => (
                          <li key={i} className="text-sm text-gray-700">
                            • {item}
                          </li>
                        ))}
                      </ul>
                    </Card>
                  )}

                {suggestion.sajuAnalysis.warnings &&
                  suggestion.sajuAnalysis.warnings.length > 0 && (
                    <Card className="p-4 bg-yellow-50">
                      <h3 className="font-bold mb-2 text-yellow-700">⚠️ 참고사항</h3>
                      <ul className="space-y-1">
                        {suggestion.sajuAnalysis.warnings.map((item, i) => (
                          <li key={i} className="text-sm text-gray-700">
                            • {item}
                          </li>
                        ))}
                      </ul>
                    </Card>
                  )}
              </>
            ) : (
              <Card className="p-8 text-center text-gray-500">
                사주 분석 정보가 제공되지 않았습니다.
              </Card>
            )}
          </TabsContent>

          {/* 한자 상세 탭 */}
          <TabsContent value="hanja" className="space-y-4">
            {suggestion.hanjaDetails && suggestion.hanjaDetails.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {suggestion.hanjaDetails.map((hanja, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-6">
                      <div className="text-center mb-4">
                        <div className="text-6xl font-bold mb-2">{hanja.character}</div>
                        {hanja.reading && (
                          <div className="text-sm text-gray-500">음: {hanja.reading}</div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-bold text-gray-600">뜻:</span>
                          <p className="text-gray-700">{hanja.meaning}</p>
                        </div>

                        {hanja.strokes !== undefined && (
                          <div>
                            <span className="text-sm font-bold text-gray-600">획수:</span>
                            <span className="text-gray-700"> {hanja.strokes}획</span>
                          </div>
                        )}

                        {hanja.origin && (
                          <div>
                            <span className="text-sm font-bold text-gray-600">유래:</span>
                            <p className="text-sm text-gray-700">{hanja.origin}</p>
                          </div>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center text-gray-500">
                한자 상세 정보가 제공되지 않았습니다.
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* 액션 버튼 */}
        <div className="flex gap-3 mt-6">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
            닫기
          </Button>
          <Button className="flex-1">
            이 이름 선택하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
