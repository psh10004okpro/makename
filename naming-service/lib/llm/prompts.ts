/**
 * LLM 프롬프트 생성 함수
 *
 * Claude API에 전달할 시스템 프롬프트와 사용자 프롬프트를 생성합니다.
 */

import { NamingRequest, PromptContext } from './types'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { getActivePrompt } from './prompt-versions'

/**
 * 시스템 프롬프트 (버전 관리)
 *
 * 작명가의 역할과 작명 원칙을 정의합니다.
 * @deprecated 대신 getActivePrompt()를 사용하세요
 */
export const NAMING_SYSTEM_PROMPT_LEGACY = `당신은 30년 경력의 전문 작명가입니다.
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

    // 계절 조후 정보 (추가)
    if (saju.seasonalInfo) {
      parts.push('')
      parts.push('### 🌸 계절 조후 (調候)')
      parts.push('')
      parts.push(`**출생 계절**: ${saju.seasonalInfo.seasonName}`)
      parts.push(`**주도 오행**: ${saju.seasonalInfo.dominantElement} ← 이 계절은 ${saju.seasonalInfo.dominantElement} 기운이 왕성`)
      parts.push('')

      if (saju.seasonalInfo.adjustmentReason) {
        parts.push(`**조후 설명**: ${saju.seasonalInfo.adjustmentReason}`)
        parts.push('')
      }

      parts.push(`**계절 특성**:`)
      saju.seasonalInfo.characteristics?.forEach((char: string, i: number) => {
        parts.push(`  ${i + 1}. ${char}`)
      })
      parts.push('')

      parts.push(`✅ **선호 오행**: ${saju.seasonalInfo.preferredYongsin?.join(', ')} ← 계절 조후에 가장 적합`)
      parts.push(`⚠️ **주의 오행**: ${saju.seasonalInfo.avoidedElements?.join(', ')} ← 계절상 과도하므로 피할 것`)
      parts.push('')
      parts.push('💡 **계절 조후 작명 원칙**: 계절의 지나친 기운을 조절하고, 부족한 기운을 보완하는 한자를 사용하세요.')
    }

    // 십성 분석 정보 (추가)
    if (saju.sipseongInfo) {
      parts.push('')
      parts.push('### ⭐ 십성 (十星) 분석')
      parts.push('')
      parts.push(`**십성 분포**: ${saju.sipseongInfo.summary}`)
      parts.push('')

      if (saju.sipseongInfo.strong.length > 0) {
        parts.push(`**강한 십성**: ${saju.sipseongInfo.strong.join(', ')}`)
      }
      if (saju.sipseongInfo.weak.length > 0) {
        parts.push(`**약한 십성**: ${saju.sipseongInfo.weak.join(', ')}`)
      }
      if (saju.sipseongInfo.missing.length > 0) {
        parts.push(`**결여된 십성**: ${saju.sipseongInfo.missing.join(', ')}`)
      }
      parts.push('')

      if (saju.sipseongInfo.personality.length > 0) {
        parts.push('**성격 특성**:')
        saju.sipseongInfo.personality.forEach((trait, i) => {
          parts.push(`  ${i + 1}. ${trait}`)
        })
        parts.push('')
      }

      if (saju.sipseongInfo.talents.length > 0) {
        parts.push('**재능 및 적성**:')
        parts.push(`  ${saju.sipseongInfo.talents.join(', ')}`)
        parts.push('')
      }

      if (saju.sipseongInfo.warnings.length > 0) {
        parts.push('**주의사항**:')
        saju.sipseongInfo.warnings.forEach((warning, i) => {
          parts.push(`  ${i + 1}. ${warning}`)
        })
        parts.push('')
      }

      parts.push('💡 **십성 작명 원칙**: 십성 분석을 통해 파악된 성격과 재능을 고려하여, 부족한 부분을 보완하고 강점을 살리는 이름을 지어주세요.')
    }

    // 대운 분석 정보 (추가)
    if (saju.daeunInfo) {
      parts.push('')
      parts.push('### 🔮 대운 (大運) 분석')
      parts.push('')
      parts.push(`**대운 흐름**: ${saju.daeunInfo.direction}, ${saju.daeunInfo.startAge}세 입운`)
      parts.push(`**전체 요약**: ${saju.daeunInfo.summary}`)
      parts.push('')

      if (saju.daeunInfo.currentCycle) {
        const current = saju.daeunInfo.currentCycle
        parts.push('**현재 대운** (현재 진행 중):')
        parts.push(`  ${current.hanja}(${current.name}) 대운 - ${current.ageRange}`)
        parts.push(`  십성: ${current.sipseong}`)
        parts.push(`  ${current.flow}`)
        parts.push('')

        if (current.strengths.length > 0) {
          parts.push('  **이 시기의 강점**:')
          current.strengths.forEach((s, i) => {
            parts.push(`    ${i + 1}. ${s}`)
          })
          parts.push('')
        }

        if (current.warnings.length > 0) {
          parts.push('  **주의사항**:')
          current.warnings.forEach((w, i) => {
            parts.push(`    ${i + 1}. ${w}`)
          })
          parts.push('')
        }

        if (current.suitableActivities.length > 0) {
          parts.push('  **적합한 활동**:')
          parts.push(`    ${current.suitableActivities.join(', ')}`)
          parts.push('')
        }
      }

      if (saju.daeunInfo.nextCycle) {
        const next = saju.daeunInfo.nextCycle
        parts.push(`**다음 대운**: ${next.hanja}(${next.name}) ${next.ageRange}`)
        parts.push('')
      }

      parts.push('💡 **대운 작명 원칙**: 현재와 미래 대운을 고려하여, 앞으로의 운세 흐름에 도움이 되는 이름을 지어주세요.')
    }

    // 격국 분석 정보 (추가)
    if (saju.gyeokgukInfo) {
      parts.push('')
      parts.push('### 🏛️ 격국 (格局) 분석')
      parts.push('')
      parts.push(`**격국**: ${saju.gyeokgukInfo.gyeokguk} (${saju.gyeokgukInfo.category})`)
      parts.push(`**격국 강도**: ${saju.gyeokgukInfo.strength}`)
      parts.push(`**설명**: ${saju.gyeokgukInfo.description}`)
      parts.push('')

      if (saju.gyeokgukInfo.yongsin.length > 0) {
        parts.push(`**용신 (필요한 십성)**: ${saju.gyeokgukInfo.yongsin.join(', ')} ← 가장 필요`)
      }
      if (saju.gyeokgukInfo.heesin.length > 0) {
        parts.push(`**희신 (도움되는 십성)**: ${saju.gyeokgukInfo.heesin.join(', ')} ← 보조적 도움`)
      }
      if (saju.gyeokgukInfo.gisin.length > 0) {
        parts.push(`**기신 (해로운 십성)**: ${saju.gyeokgukInfo.gisin.join(', ')} ⚠️ 피할 것`)
      }
      parts.push('')

      if (saju.gyeokgukInfo.characteristics.length > 0) {
        parts.push('**성격 특성**:')
        saju.gyeokgukInfo.characteristics.forEach((char, i) => {
          parts.push(`  ${i + 1}. ${char}`)
        })
        parts.push('')
      }

      if (saju.gyeokgukInfo.careerSuitability.length > 0) {
        parts.push('**직업 적성**:')
        parts.push(`  ${saju.gyeokgukInfo.careerSuitability.join(', ')}`)
        parts.push('')
      }

      parts.push('**운세 평가**:')
      parts.push(`  재물운: ${saju.gyeokgukInfo.wealthLuck}`)
      parts.push(`  명예운: ${saju.gyeokgukInfo.fameLuck}`)
      parts.push(`  학업운: ${saju.gyeokgukInfo.academicLuck}`)
      parts.push('')

      if (saju.gyeokgukInfo.warnings.length > 0) {
        parts.push('**주의사항**:')
        saju.gyeokgukInfo.warnings.forEach((warning, i) => {
          parts.push(`  ${i + 1}. ${warning}`)
        })
        parts.push('')
      }

      parts.push('💡 **격국 작명 원칙**: 격국의 용신/희신에 해당하는 십성의 의미를 담은 한자를 사용하고, 기신 십성은 피하여 명식의 균형을 맞추세요.')
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

  // 사용자 정의 가중치
  if (request.preferences?.customWeights) {
    parts.push('## ⚙️ 사용자 정의 가중치\n')
    const weights = request.preferences.customWeights

    // 가중치 정규화 (합계 100으로)
    const total = (weights.saju || 0) + (weights.strokes || 0) +
                  (weights.phonetics || 0) + (weights.meaning || 0) +
                  (weights.modernity || 0) + (weights.uniqueness || 0)

    if (total > 0) {
      const normalize = (value: number | undefined) =>
        value ? Math.round((value / total) * 100) : 0

      parts.push('**⚠️ 중요: 아래 가중치를 반드시 준수하세요!**\n')

      if (weights.saju) {
        parts.push(`- 🎯 **사주 오행 조화**: ${normalize(weights.saju)}% (용신/기신 오행 일치도)`)
      }
      if (weights.strokes) {
        parts.push(`- 📏 **획수 길흉**: ${normalize(weights.strokes)}% (81수리, 오격 분석)`)
      }
      if (weights.phonetics) {
        parts.push(`- 🗣️ **발음 자연스러움**: ${normalize(weights.phonetics)}% (받침, 모음, 듣기 편함)`)
      }
      if (weights.meaning) {
        parts.push(`- 💡 **의미 적절성**: ${normalize(weights.meaning)}% (키워드 일치, 긍정적 의미)`)
      }
      if (weights.modernity) {
        parts.push(`- ✨ **현대적 감각**: ${normalize(weights.modernity)}% (트렌디, 세련됨)`)
      }
      if (weights.uniqueness) {
        parts.push(`- 🌟 **독창성**: ${normalize(weights.uniqueness)}% (흔하지 않음, 참신함)`)
      }

      parts.push('')
      parts.push('💡 **작명 시**: 위 가중치에 따라 각 항목의 중요도를 조절하세요.')
      parts.push('   예를 들어, 사주 40%면 전체 평가에서 사주를 가장 중시해야 합니다.')
      parts.push('')
    }
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
    CREATIVE: '창의적 작명 (독특하고 예술적인 이름)',
    INTERNATIONAL: '국제적 작명 (글로벌 통용 이름)',
  }
  return methodMap[method] || method
}

/**
 * 작명 방법별 가이드라인 생성
 */
function getMethodGuideline(method: string): string {
  const guidelines: Record<string, string> = {
    TRADITIONAL: `
## 🏛️ 전통 작명 방식 적용

**이번 작명은 전통 사주명리학 기반 작명입니다.**

### 우선순위 (가중치)
1. **사주 오행 조화** (40%) - 가장 중요
   - 용신 오행에 해당하는 한자 100% 사용
   - 기신 오행 한자는 절대 사용 금지
   - 오행 상생 관계를 우선 고려

2. **획수 길흉** (30%) - 매우 중요
   - 81수리 기준 대길수 우선
   - 인격/지격/총격이 모두 길수인 조합 선호
   - 흉수는 절대 피할 것

3. **오격 분석** (20%) - 중요
   - 천격/인격/지격/외격/총격 종합 평가
   - 주운(인격), 기초운(지격) 특히 중시

4. **의미와 발음** (10%) - 보조적
   - 전통적 의미를 지닌 한자 선호
   - 발음은 부차적 고려사항

### 작명 스타일
- **전통적 이름 15개** (예: 성현, 지혜, 예린 등)
- 균형잡힌 이름 5개
- 한자는 반드시 포함 (한글 전용 요청이 아닌 한)
- 각 이름마다 3개 이상의 한자 옵션 제공

### 궁합도 점수 산정
- saju: 95점 이상 목표 (용신 오행 완벽 일치)
- ohang: 90점 이상 목표 (상생 관계)
- strokes: 90점 이상 목표 (대길수)
- phonetics: 70점 이상 (보조적)
- total: 90점 이상 목표
`,
    MODERN: `
## 🌟 현대 작명 방식 적용

**이번 작명은 현대적 감각과 발음 중심 작명입니다.**

### 우선순위 (가중치)
1. **발음 자연스러움** (40%) - 가장 중요
   - 받침 없는 부드러운 이름 우선
   - ㅓ, ㅕ, ㅜ, ㅠ, ㅣ 등 밝은 모음 적극 사용
   - 2음절 이름 기본, 듣기 편한 발음

2. **의미의 긍정성** (30%) - 매우 중요
   - 사용자 요청 키워드 100% 반영
   - 현대적이고 세련된 의미
   - 긍정적이고 희망찬 뜻

3. **현대적 감각** (20%) - 중요
   - 2025년 기준 트렌디한 이름
   - 독창적이되 부담스럽지 않은 이름
   - 흔한 이름 절대 회피

4. **사주 조화** (10%) - 보조적
   - 오행 조화는 참고 사항
   - 획수는 크게 고려하지 않음
   - 한글 전용 이름도 적극 고려

### 작명 스타일
- **현대적 이름 15개** (예: 서아, 하윤, 이준, 유진 등)
- 균형잡힌 이름 5개
- 한글 전용 이름 5-10개 포함 가능
- 받침 없는 이름 비율 높게

### 궁합도 점수 산정
- phonetics: 95점 이상 목표 (발음 최우선)
- 의미: 사용자 키워드 100% 포함
- saju: 70점 이상 (참고)
- ohang: 70점 이상 (참고)
- strokes: 70점 이상 (참고)
- total: 85점 이상 목표
`,
    HYBRID: `
## ⚖️ 혼합 작명 방식 적용

**이번 작명은 전통과 현대의 균형잡힌 조화를 추구합니다.**

### 우선순위 (가중치)
1. **발음과 의미** (35%)
   - 부드럽고 현대적인 발음
   - 사용자 요청 의미 반영
   - 듣기 좋은 이름

2. **사주 오행 조화** (35%)
   - 용신 오행 우선 사용
   - 기신 오행 회피
   - 오행 균형 고려

3. **획수와 현대성** (30%)
   - 길수 선호하되 필수 아님
   - 현대적 감각 유지
   - 독창성과 전통의 조화

### 작명 스타일
- 현대적 이름 10개
- 전통적 이름 2개
- **균형잡힌 이름 8개** (추천)
- 한자와 한글 적절히 혼합

### 궁합도 점수 산정
- 모든 항목 80점 이상 목표
- saju: 85점 이상
- ohang: 85점 이상
- strokes: 80점 이상
- phonetics: 85점 이상
- total: 85점 이상 목표
`,
    CREATIVE: `
## 🎨 창의적 작명 방식 적용

**이번 작명은 독특하고 창의적인 이름을 추구합니다.**

### 우선순위 (가중치)
1. **독창성과 차별성** (50%) - 가장 중요
   - 기존에 없는 참신한 조합
   - 흔하지 않은 한자나 순우리말 활용
   - 예술적이고 문학적인 감각
   - 의외의 조합이지만 조화로운 이름

2. **의미의 깊이** (30%) - 매우 중요
   - 다층적이고 함축적인 의미
   - 이야기가 있는 이름
   - 철학적이거나 시적인 뜻
   - 사용자 요청 키워드를 창의적으로 해석

3. **발음 미학** (15%) - 중요
   - 음악적 리듬감
   - 독특하지만 발음하기 편함
   - 기억하기 쉬운 이름
   - 예술적 어감

4. **사주 조화** (5%) - 참고
   - 기본적인 오행 균형만 고려
   - 극단적인 불균형만 피함

### 작명 스타일
- **창의적 이름 18개** (예: 하늘, 달빛, 온새미로, 은솔 등)
- 전통적 이름 2개 (참고용)
- 순우리말 이름 적극 활용 (8-12개)
- 특이한 한자 조합 (5-8개)
- 3음절 이름도 자유롭게 포함

### 궁합도 점수 산정
- uniqueness: 95점 이상 목표 (독창성 최우선)
- meaningRelevance: 90점 이상 목표 (깊은 의미)
- phonetics: 80점 이상 (예술적 발음)
- saju: 60점 이상 (참고)
- total: 80점 이상 목표

### 창의적 작명 기법
- **순우리말**: 하늘, 바다, 이슬, 별, 온새미로, 다솜 등
- **신조어 조합**: 의미있는 글자의 새로운 결합
- **희귀 한자**: 잘 쓰이지 않지만 아름다운 한자 활용
- **문학적 표현**: 시적이고 예술적인 이름
- **자연 모티프**: 자연물에서 영감을 받은 이름

### 주의사항
⚠️ 창의적이되 너무 기이하지 않도록 주의
✅ 일상생활에서 사용 가능한 수준 유지
✅ 아이가 자라면서 좋아할 만한 이름
`,
    INTERNATIONAL: `
## 🌍 국제적 작명 방식 적용

**이번 작명은 국제적으로 통용되는 이름을 추구합니다.**

### 우선순위 (가중치)
1. **국제 발음 용이성** (45%) - 가장 중요
   - 영어권에서 발음하기 쉬운 이름
   - 자음 'ㄱ, ㄴ, ㄷ, ㄹ, ㅁ, ㅅ, ㅇ' 위주
   - 모음 'ㅏ, ㅓ, ㅗ, ㅜ, ㅣ' 중심
   - 받침 최소화 (있어도 ㄴ, ㅇ 정도)
   - 2음절 기본, 3음절도 가능

2. **글로벌 이미지** (30%) - 매우 중요
   - 다국적 기업이나 국제무대에 어울림
   - 영어 이름과 유사한 느낌
   - 세련되고 모던한 이미지
   - 문화적 장벽 없는 이름

3. **의미의 보편성** (20%) - 중요
   - 전 세계적으로 긍정적인 의미
   - 특정 문화권에 국한되지 않음
   - 희망, 평화, 사랑 등 보편적 가치
   - 사용자 요청 키워드를 글로벌하게 해석

4. **사주 조화** (5%) - 참고
   - 기본적인 오행만 참고
   - 국제성이 우선

### 작명 스타일
- **국제적 이름 16개** (예: 리나, 민아, 지나, 유나, 안나 등)
- 전통적 이름 2개 (비교용)
- 균형잡힌 이름 2개
- 한글 이름 위주 (한자 옵션은 선택사항)
- 영어 표기가 간단한 이름

### 궁합도 점수 산정
- phonetics: 95점 이상 목표 (국제 발음 최우선)
- modernity: 90점 이상 목표 (글로벌 이미지)
- meaningRelevance: 85점 이상 (보편적 의미)
- saju: 60점 이상 (참고)
- total: 85점 이상 목표

### 영어 표기 친화적인 패턴
- **-na 종결**: 리나(Lina), 지나(Gina), 유나(Yuna), 미나(Mina)
- **-ah 종결**: 민아(Mina), 서아(Seoa), 예아(Yea)
- **-ra/ri 종결**: 서라(Sera), 유리(Yuri), 수리(Suri)
- **-an 종결**: 지안(Jian), 서안(Seoan)
- **-o 종결**: 유노(Yuno), 미오(Mio)

### 발음 가이드
✅ 좋은 예: 리나(Lina), 민아(Mina), 유진(Eugene)
❌ 피할 예: 경희(Kyung-hee 발음 어려움), 준혁(Jun-hyuk 받침 많음)

### 국제 이름 체크리스트
- [ ] 영어권에서 2초 안에 발음 가능한가?
- [ ] 영어 표기가 5-6자 이내인가?
- [ ] 특이한 발음(ㅆ, ㅉ, ㅃ 등) 없는가?
- [ ] 받침이 없거나 ㄴ, ㅇ만 있는가?
- [ ] 글로벌 기업 CEO 이름으로 어색하지 않은가?
`,
  }

  return guidelines[method] || guidelines.HYBRID
}

/**
 * 프롬프트 전체 생성 (시스템 + 사용자)
 *
 * @param context 프롬프트 컨텍스트
 * @param promptVersion 사용할 프롬프트 버전 (기본값: 활성화된 버전)
 */
export function createFullPrompt(
  context: PromptContext,
  promptVersion?: string
): {
  system: string
  user: string
  version: string
} {
  const activePrompt = promptVersion
    ? require('./prompt-versions').getPromptVersion(promptVersion)
    : getActivePrompt()

  if (!activePrompt) {
    throw new Error(`프롬프트 버전 ${promptVersion}을 찾을 수 없습니다`)
  }

  // 작명 방법에 따른 가이드라인 추가
  const methodGuideline = getMethodGuideline(context.request.method)
  const enhancedSystemPrompt = `${activePrompt.systemPrompt}

${methodGuideline}

---

**중요**: 위의 작명 방식(${getMethodText(context.request.method)})에 따라 우선순위와 가중치를 반드시 준수하세요.`

  return {
    system: enhancedSystemPrompt,
    user: createUserPrompt(context),
    version: activePrompt.version,
  }
}

/**
 * 시스템 프롬프트 가져오기 (현재 활성 버전)
 */
export const NAMING_SYSTEM_PROMPT = getActivePrompt().systemPrompt

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
