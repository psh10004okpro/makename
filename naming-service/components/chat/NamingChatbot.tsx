'use client'

/**
 * 대화형 작명 챗봇 UI 컴포넌트
 */

import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatResponse {
  success: boolean
  data?: {
    sessionId: string
    message: string
    stage: string
    context: any
  }
  error?: string
}

export function NamingChatbot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [stage, setStage] = useState<string>('greeting')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 자동 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 첫 메시지 표시
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: `안녕하세요! 작명소에 오신 것을 환영합니다 😊
소중한 이름을 함께 고민하게 되어 기쁩니다.

어떤 이름을 찾고 계신가요?
1. 아기 이름
2. 회사/브랜드명
3. 반려동물 이름
4. 기타

편하게 말씀해주세요!`,
          timestamp: new Date(),
        },
      ])
    }
  }, [])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/naming/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          message: userMessage.content,
        }),
      })

      const data: ChatResponse = await response.json()

      if (!data.success || !data.data) {
        throw new Error(data.error || '응답을 받지 못했습니다.')
      }

      // 세션 ID 저장
      if (!sessionId) {
        setSessionId(data.data.sessionId)
      }

      // 단계 업데이트
      setStage(data.data.stage)

      // 어시스턴트 메시지 추가
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.data.message,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error: any) {
      console.error('채팅 오류:', error)

      // 에러 메시지 표시
      const errorMessage: Message = {
        role: 'assistant',
        content: `죄송합니다. 오류가 발생했습니다: ${error.message}\n다시 시도해주세요.`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleNewChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: `안녕하세요! 작명소에 오신 것을 환영합니다 😊
소중한 이름을 함께 고민하게 되어 기쁩니다.

어떤 이름을 찾고 계신가요?
1. 아기 이름
2. 회사/브랜드명
3. 반려동물 이름
4. 기타

편하게 말씀해주세요!`,
        timestamp: new Date(),
      },
    ])
    setSessionId(null)
    setInput('')
    setStage('greeting')
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h2 className="text-2xl font-bold">작명소 AI</h2>
          <p className="text-sm text-gray-500">
            단계: {stageNames[stage as keyof typeof stageNames] || stage}
          </p>
        </div>
        <Button onClick={handleNewChat} variant="outline" size="sm">
          새 대화
        </Button>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <Card
              className={`max-w-[80%] p-4 ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="whitespace-pre-wrap">
                {message.content.split('\n').map((line, i) => {
                  // 마크다운 굵은 글씨 처리
                  const parts = line.split(/(\*\*.*?\*\*)/g)
                  return (
                    <div key={i}>
                      {parts.map((part, j) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return (
                            <strong key={j}>
                              {part.slice(2, -2)}
                            </strong>
                          )
                        }
                        return <span key={j}>{part}</span>
                      })}
                    </div>
                  )
                })}
              </div>
              <div
                className={`text-xs mt-2 ${
                  message.role === 'user' ? 'text-blue-100' : 'text-gray-400'
                }`}
              >
                {message.timestamp.toLocaleTimeString('ko-KR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </Card>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <Card className="max-w-[80%] p-4 bg-white border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
              </div>
            </Card>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <div className="p-4 border-t bg-white">
        <div className="flex space-x-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하세요..."
            className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-6"
          >
            전송
          </Button>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Shift + Enter로 줄바꿈, Enter로 전송
        </p>
      </div>
    </div>
  )
}

const stageNames = {
  greeting: '인사',
  collecting_basic: '기본 정보 수집',
  collecting_preferences: '선호도 수집',
  suggesting_names: '이름 추천',
  refining: '수정 및 개선',
  finalizing: '최종 확정',
  completed: '완료',
}
