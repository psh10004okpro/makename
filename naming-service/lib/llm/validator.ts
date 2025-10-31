/**
 * LLM 응답 검증
 *
 * Zod 스키마를 사용하여 Claude API 응답을 검증하고 정제합니다.
 */

import { z } from 'zod'
import { LLMError, LLMRawResponse, NameSuggestion } from './types'

/**
 * 한자 옵션 스키마
 */
const HanjaOptionSchema = z.object({
  characters: z.string().min(1).max(10),
  meanings: z.array(z.string()).min(1),
  strokes: z.array(z.number().int().positive()).min(1),
  ohang: z.array(z.string()).min(1),
})

/**
 * 궁합도 점수 스키마
 */
const CompatibilityScoresSchema = z.object({
  saju: z.number().min(0).max(100).optional(),
  ohang: z.number().min(0).max(100).optional(),
  strokes: z.number().min(0).max(100).optional(),
  phonetics: z.number().min(0).max(100).optional(),
  total: z.number().min(0).max(100),
})

/**
 * 이름 제안 스키마
 */
const NameSuggestionSchema = z.object({
  name: z.string().min(1).max(20),
  hanjaOptions: z.array(HanjaOptionSchema).optional(),
  pronunciation: z.string().min(1),
  meaning: z.string().min(1),
  phonetics: z.string().min(1),
  compatibility: CompatibilityScoresSchema,
  reasoning: z.string().min(10),
})

/**
 * LLM 응답 스키마
 */
const LLMResponseSchema = z.object({
  suggestions: z.array(NameSuggestionSchema).min(1).max(30),
})

/**
 * LLM 응답 검증
 *
 * @param data 파싱된 JSON 데이터
 * @returns 검증된 응답
 * @throws LLMError 검증 실패시
 */
export function validateLLMResponse(data: unknown): LLMRawResponse {
  try {
    const result = LLMResponseSchema.parse(data)
    return result as LLMRawResponse
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors
        .map(e => `${e.path.join('.')}: ${e.message}`)
        .join(', ')
      throw new LLMError(
        `응답 검증 실패: ${errorMessages}`,
        'VALIDATION_ERROR',
        undefined,
        error
      )
    }
    throw new LLMError(
      '알 수 없는 검증 오류',
      'VALIDATION_ERROR',
      undefined,
      error as Error
    )
  }
}

/**
 * JSON 추출 및 파싱
 *
 * LLM 응답에서 JSON 부분만 추출하여 파싱합니다.
 * 마크다운 코드 블록(```json)이나 기타 텍스트를 제거합니다.
 *
 * @param text LLM이 생성한 텍스트
 * @returns 파싱된 JSON 객체
 * @throws LLMError 파싱 실패시
 */
export function extractAndParseJSON(text: string): unknown {
  try {
    // 1. 마크다운 코드 블록 제거
    let jsonText = text.trim()

    // ```json ... ``` 형태 제거
    const codeBlockMatch = jsonText.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/)
    if (codeBlockMatch) {
      jsonText = codeBlockMatch[1].trim()
    }

    // 2. 앞뒤 공백 및 불필요한 문자 제거
    jsonText = jsonText.trim()

    // 3. JSON 파싱
    const parsed = JSON.parse(jsonText)

    return parsed
  } catch (error) {
    // 파싱 실패시 더 자세한 정보 제공
    const preview = text.substring(0, 200)
    throw new LLMError(
      `JSON 파싱 실패. 응답 미리보기: ${preview}...`,
      'PARSING_ERROR',
      undefined,
      error as Error
    )
  }
}

/**
 * 이름 제안 정제
 *
 * 검증된 이름 제안을 정제하고 보완합니다.
 *
 * @param suggestions 원본 제안
 * @returns 정제된 제안
 */
export function refineSuggestions(
  suggestions: NameSuggestion[]
): NameSuggestion[] {
  return suggestions.map(suggestion => {
    // 1. name 정제 (공백 제거, 소문자 변환 등)
    const refinedName = suggestion.name.trim()

    // 2. compatibility.total 자동 계산 (없는 경우)
    let compatibility = { ...suggestion.compatibility }
    if (!compatibility.total || compatibility.total === 0) {
      // total이 0이거나 없으면 다른 점수들의 평균으로 계산
      const scores = [
        compatibility.saju,
        compatibility.ohang,
        compatibility.strokes,
        compatibility.phonetics,
      ].filter((score): score is number => score !== undefined && score > 0)

      if (scores.length > 0) {
        compatibility.total = Math.round(
          scores.reduce((sum, score) => sum + score, 0) / scores.length
        )
      } else {
        compatibility.total = 70 // 기본값
      }
    }

    // 3. pronunciation 정제 (괄호 안 영문 확인)
    let pronunciation = suggestion.pronunciation.trim()
    if (!pronunciation.includes('(') && refinedName) {
      // 영문 표기가 없으면 자동 추가
      pronunciation = `${refinedName} (${romanize(refinedName)})`
    }

    // 4. hanjaOptions 정제
    const hanjaOptions = suggestion.hanjaOptions?.map(option => ({
      ...option,
      characters: option.characters.trim(),
      meanings: option.meanings.map(m => m.trim()),
    }))

    return {
      ...suggestion,
      name: refinedName,
      pronunciation,
      compatibility,
      hanjaOptions,
    }
  })
}

/**
 * 한글을 로마자로 변환 (간단한 구현)
 *
 * 실제로는 더 정교한 변환이 필요하지만, 기본적인 변환만 제공합니다.
 */
function romanize(hangul: string): string {
  // 간단한 초성-중성 매핑 (실제 구현은 더 복잡함)
  const choseong = ['g', 'kk', 'n', 'd', 'tt', 'r', 'm', 'b', 'pp', 's', 'ss', '', 'j', 'jj', 'ch', 'k', 't', 'p', 'h']
  const jungseong = ['a', 'ae', 'ya', 'yae', 'eo', 'e', 'yeo', 'ye', 'o', 'wa', 'wae', 'oe', 'yo', 'u', 'wo', 'we', 'wi', 'yu', 'eu', 'ui', 'i']
  const jongseong = ['', 'g', 'kk', 'gs', 'n', 'nj', 'nh', 'd', 'l', 'lg', 'lm', 'lb', 'ls', 'lt', 'lp', 'lh', 'm', 'b', 'bs', 's', 'ss', 'ng', 'j', 'ch', 'k', 't', 'p', 'h']

  let result = ''
  for (let i = 0; i < hangul.length; i++) {
    const code = hangul.charCodeAt(i) - 0xAC00
    if (code >= 0 && code <= 11171) {
      const cho = Math.floor(code / 588)
      const jung = Math.floor((code % 588) / 28)
      const jong = code % 28

      result += choseong[cho]
      result += jungseong[jung]
      if (jong > 0) {
        result += jongseong[jong]
      }
    } else {
      result += hangul[i]
    }
  }

  // 첫 글자만 대문자로
  return result.charAt(0).toUpperCase() + result.slice(1).toLowerCase()
}

/**
 * 응답 품질 검증
 *
 * 검증된 응답이 실제로 사용 가능한 품질인지 추가 검증합니다.
 *
 * @param response 검증된 응답
 * @returns 품질이 충분한 경우 true
 */
export function validateResponseQuality(response: LLMRawResponse): boolean {
  const { suggestions } = response

  // 1. 최소 제안 개수 확인 (최소 5개 이상)
  if (suggestions.length < 5) {
    return false
  }

  // 2. 각 제안의 reasoning 길이 확인 (너무 짧으면 품질 낮음)
  const hasShortReasoning = suggestions.some(s => s.reasoning.length < 20)
  if (hasShortReasoning) {
    return false
  }

  // 3. 중복 이름 확인
  const names = suggestions.map(s => s.name)
  const uniqueNames = new Set(names)
  if (uniqueNames.size < names.length * 0.9) {
    // 10% 이상 중복이면 품질 낮음
    return false
  }

  // 4. 궁합도 점수가 모두 0이 아닌지 확인
  const hasZeroScore = suggestions.some(s => s.compatibility.total === 0)
  if (hasZeroScore) {
    return false
  }

  return true
}

/**
 * 전체 검증 파이프라인
 *
 * 파싱, 검증, 정제, 품질 확인을 모두 수행합니다.
 *
 * @param text LLM 응답 텍스트
 * @returns 검증 및 정제된 응답
 * @throws LLMError 검증 실패시
 */
export function validateAndRefineLLMResponse(text: string): LLMRawResponse {
  // 1. JSON 추출 및 파싱
  const parsed = extractAndParseJSON(text)

  // 2. 스키마 검증
  const validated = validateLLMResponse(parsed)

  // 3. 제안 정제
  const refined = refineSuggestions(validated.suggestions)

  // 4. 품질 검증
  const qualityCheck = validateResponseQuality({ suggestions: refined })
  if (!qualityCheck) {
    throw new LLMError(
      '응답 품질이 기준에 미달합니다. 재시도가 필요합니다.',
      'VALIDATION_ERROR'
    )
  }

  return { suggestions: refined }
}
