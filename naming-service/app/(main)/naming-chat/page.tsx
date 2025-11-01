/**
 * 대화형 작명 챗봇 테스트 페이지
 */

import { NamingChatbot } from '@/components/chat/NamingChatbot'

export default function NamingChatPage() {
  return (
    <div className="container mx-auto p-4 h-screen">
      <div className="h-full flex flex-col">
        <div className="mb-4">
          <h1 className="text-3xl font-bold">대화형 작명 챗봇</h1>
          <p className="text-gray-600">AI와 대화하며 완벽한 이름을 찾아보세요</p>
        </div>

        <div className="flex-1 bg-gray-50 rounded-lg shadow-lg overflow-hidden">
          <NamingChatbot />
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold mb-2">💡 사용 팁</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• 자연스럽게 대화하듯이 이야기해주세요</li>
            <li>• 원하는 느낌이나 의미를 구체적으로 말씀해주세요</li>
            <li>• 마음에 드는 이름이 나오면 "이거 좋아요"라고 피드백해주세요</li>
            <li>• "더 부드럽게", "좀 더 현대적으로" 같은 수정 요청도 가능합니다</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
