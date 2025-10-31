/**
 * LLM 프롬프트 생성 함수
 *
 * Claude API에 전달할 시스템 프롬프트와 사용자 프롬프트를 생성합니다.
 */

import { NamingRequest, PromptContext } from './types'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

/**
 * 시스템 프롬프트
 *
 * 작명가의 역할과 작명 원칙을 정의합니다.
 */
export const NAMING_SYSTEM_PROMPT = `당신은 30년 경력의 전문 작명가입니다.
한국의 전통 성명학, 사주명리학, 그리고 현대 언어학을 모두 마스터했습니다.

## 작명 철학

좋은 이름은 다음 5가지 요소가 조화를 이루어야 합니다:

1. **음운의 조화** - 발음이 부드럽고 듣기 좋아야 합니다
   - 받침이 너무 많지 않은 부드러운 발음
   - 성씨와 이름의 자연스러운 연결
   - 외국인도 발음하기 쉬운 이름 (국제화 시대)

2. **의미의 긍정성** - 좋고 아름다운 뜻을 담아야 합니다
   - 희망, 성장, 지혜, 사랑 등 긍정적 의미
   - 시대를 초월하는 보편적 가치
   - 부모의 소망이 담긴 의미

3. **한자의 조화** (한자 이름인 경우)
   - 획수 길흉 (81수리)
   - 오행 조화 (목화토금수)
   - 오격 분석 (천격/인격/지격/외격/총격)

4. **시대적 감각** - 현대적이면서도 품위있어야 합니다
   - 너무 오래된 느낌이 아닌 세련된 이름
   - 너무 유행을 따르지 않는 안정적인 이름
   - 다양한 세대가 공감할 수 있는 이름

5. **성씨와의 조화** - 성과 이름이 자연스럽게 어우러져야 합니다
   - 성씨의 특성을 고려한 이름
   - 전체적인 균형감과 리듬감
   - 동명이인이 너무 많지 않은 독특함

## 응답 형식

반드시 다음 JSON 형식으로만 응답하세요. 다른 텍스트는 포함하지 마세요:

\`\`\`json
{
  "suggestions": [
    {
      "name": "지우",
      "hanjaOptions": [
        {
          "characters": "智優",
          "meanings": ["지혜로울 지", "뛰어날 우"],
          "strokes": [12, 17],
          "ohang": ["火", "土"]
        },
        {
          "characters": "知祐",
          "meanings": ["알 지", "도울 우"],
          "strokes": [8, 9],
          "ohang": ["火", "土"]
        }
      ],
      "pronunciation": "지우 (Ji-woo)",
      "meaning": "지혜롭고 뛰어난 사람이 되라는 뜻",
      "phonetics": "부드러운 모음 'ㅣ'와 'ㅜ'의 조화로 발음이 편안하고 현대적입니다.",
      "compatibility": {
        "saju": 95,
        "ohang": 90,
        "strokes": 88,
        "phonetics": 92,
        "total": 91
      },
      "reasoning": "지혜와 우수함을 동시에 표현하는 이름입니다. 사주의 부족한 화(火) 오행을 보완하며, 발음이 부드럽고 현대적입니다. 특히 '智優' 조합은 학문적 성취와 인격적 우수함을 모두 담고 있어 부모의 기대를 잘 반영합니다."
    }
  ]
}
\`\`\`

## 작명 가이드라인

- 총 20개의 다양한 이름을 제안하세요
- 각 이름마다 1-3개의 한자 옵션을 제공하세요 (한자 이름인 경우)
- 현대적인 이름 5개, 전통적인 이름 5개, 균형잡힌 이름 10개로 구성하세요
- 발음이 2음절인 이름을 기본으로 하되, 3음절 이름도 일부 포함하세요
- compatibility 점수는 실제 사주/오행 분석을 바탕으로 합리적으로 산정하세요
- reasoning은 구체적이고 설득력있게 작성하세요 (최소 2-3문장)

## 주의사항

- 부정적 의미나 불길한 연상을 주는 글자는 절대 사용하지 마세요
- 발음이 어렵거나 복잡한 이름은 피하세요
- 너무 흔한 이름보다는 개성있는 이름을 권장하세요
- 한자 이름의 경우 각 글자의 획수와 오행이 조화로운지 확인하세요
- 성별에 맞는 이름을 제안하세요 (중성적 이름도 일부 포함 가능)`

/**
 * 사용자 프롬프트 생성
 *
 * 사용자의 요청 정보를 바탕으로 프롬프트를 생성합니다.
 */
export function createUserPrompt(context: PromptContext): string {
  const { request } = context
  const parts: string[] = []

  // 기본 정보
  parts.push('# 작명 요청 정보\n')
  parts.push(`**성씨**: ${request.familyName}`)
  parts.push(`**성별**: ${getGenderText(request.gender)}`)

  // 생년월일 정보
  if (request.birthDate) {
    const dateStr = format(request.birthDate, 'yyyy년 M월 d일 (E)', { locale: ko })
    parts.push(`**생년월일**: ${dateStr}${request.isLunar ? ' (음력)' : ' (양력)'}`)

    if (request.birthTime) {
      parts.push(`**출생시간**: ${request.birthTime}`)
    }
  }

  parts.push(`**작명 방식**: ${getMethodText(request.method)}`)
  parts.push('')

  // 사주 분석 정보
  if (request.sajuAnalysis) {
    parts.push('## 사주팔자 분석\n')
    const saju = request.sajuAnalysis
    parts.push(`**년주**: ${saju.year}`)
    parts.push(`**월주**: ${saju.month}`)
    parts.push(`**일주**: ${saju.day}`)
    parts.push(`**시주**: ${saju.hour}`)
    parts.push('')

    if (saju.weakElements && saju.weakElements.length > 0) {
      parts.push(`**약한 오행**: ${saju.weakElements.join(', ')} ← 보완 필요`)
    }

    if (saju.missingElements && saju.missingElements.length > 0) {
      parts.push(`**결여된 오행**: ${saju.missingElements.join(', ')} ← 반드시 보완`)
    }

    if (saju.strongElements && saju.strongElements.length > 0) {
      parts.push(`**강한 오행**: ${saju.strongElements.join(', ')} ← 피할 것`)
    }

    if (saju.yongsin && saju.yongsin.length > 0) {
      parts.push(`**용신 (도움되는 오행)**: ${saju.yongsin.join(', ')} ⭐ 우선 사용`)
    }

    if (saju.gisin && saju.gisin.length > 0) {
      parts.push(`**기신 (해로운 오행)**: ${saju.gisin.join(', ')} ⚠️ 피할 것`)
    }

    parts.push('')
    parts.push('💡 **작명 지침**: 사주의 약한 오행(특히 결여된 오행)을 보완하고, 용신 오행을 가진 한자를 우선적으로 사용하세요. 강한 오행과 기신 오행은 피하세요.')
    parts.push('')
  }

  // 선호도 정보
  if (request.preferences) {
    parts.push('## 선호 사항\n')
    const prefs = request.preferences

    if (prefs.meaningKeywords && prefs.meaningKeywords.length > 0) {
      parts.push(`**원하는 의미**: ${prefs.meaningKeywords.join(', ')}`)
      parts.push('→ 이 의미들을 담은 이름을 우선적으로 고려해주세요.')
    }

    if (prefs.avoidCharacters && prefs.avoidCharacters.length > 0) {
      parts.push(`**피할 글자**: ${prefs.avoidCharacters.join(', ')}`)
    }

    if (prefs.avoidSounds && prefs.avoidSounds.length > 0) {
      parts.push(`**피할 발음**: ${prefs.avoidSounds.join(', ')}`)
    }

    if (prefs.preferredLength) {
      parts.push(`**선호 글자 수**: ${prefs.preferredLength}자`)
    }

    if (prefs.koreanOnly) {
      parts.push(`**한글 전용**: 예 (한자는 사용하지 마세요)`)
    }

    if (prefs.specialRequests) {
      parts.push(`**특별 요청**: ${prefs.specialRequests}`)
    }

    parts.push('')
  }

  // 작명 요청
  parts.push('---\n')
  parts.push('위 정보를 바탕으로 **20개의 좋은 이름**을 제안해주세요.')
  parts.push('')
  parts.push('각 이름에 대해:')
  parts.push('- 이름의 의미와 유래를 설명하세요')
  parts.push('- 한자 이름의 경우 여러 한자 조합을 제시하세요')
  parts.push('- 사주와의 궁합도를 정확히 계산하세요')
  parts.push('- 왜 이 이름을 추천하는지 구체적으로 설명하세요')
  parts.push('')
  parts.push('다양한 스타일(현대적/전통적/균형)의 이름을 골고루 제안해주세요.')

  return parts.join('\n')
}

/**
 * 성별 텍스트 변환
 */
function getGenderText(gender: string): string {
  const genderMap: Record<string, string> = {
    MALE: '남자',
    FEMALE: '여자',
    NEUTRAL: '중성 (성별 무관)',
  }
  return genderMap[gender] || gender
}

/**
 * 작명 방식 텍스트 변환
 */
function getMethodText(method: string): string {
  const methodMap: Record<string, string> = {
    TRADITIONAL: '전통 작명 (사주명리학 기반)',
    MODERN: '현대 작명 (의미와 발음 중심)',
    HYBRID: '혼합 작명 (전통과 현대의 조화)',
  }
  return methodMap[method] || method
}

/**
 * 프롬프트 전체 생성 (시스템 + 사용자)
 */
export function createFullPrompt(context: PromptContext): {
  system: string
  user: string
} {
  return {
    system: NAMING_SYSTEM_PROMPT,
    user: createUserPrompt(context),
  }
}

/**
 * 재시도용 프롬프트 생성
 *
 * 이전 응답이 실패했을 때 재시도하기 위한 프롬프트
 */
export function createRetryPrompt(
  originalContext: PromptContext,
  errorMessage: string
): string {
  return `${createUserPrompt(originalContext)}

---
⚠️ **이전 응답 오류**: ${errorMessage}

다시 한번 정확한 JSON 형식으로 응답해주세요. 반드시 \`\`\`json으로 시작하고 \`\`\`로 끝나야 합니다.`
}

/**
 * 간단한 테스트용 프롬프트
 */
export function createTestPrompt(): PromptContext {
  return {
    request: {
      familyName: '김',
      gender: 'FEMALE',
      birthDate: new Date('1990-01-15'),
      birthTime: '14:30',
      isLunar: false,
      method: 'HYBRID',
      preferences: {
        meaningKeywords: ['지혜', '아름다움'],
        preferredLength: 2,
      },
      sajuAnalysis: {
        year: '기사년 (己巳)',
        month: '정축월 (丁丑)',
        day: '경진일 (庚辰)',
        hour: '계미시 (癸未)',
        weakElements: ['목'],
        strongElements: ['토'],
        missingElements: [],
        yongsin: ['목', '수'],
        gisin: ['토'],
      },
    },
    currentDate: new Date(),
  }
}
