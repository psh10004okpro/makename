/**
 * 81수리 길흉 데이터
 *
 * 전통 작명학에서 사용되는 81수리의 길흉을 정의합니다.
 * 이름의 총 획수를 81로 나눈 나머지로 길흉을 판단합니다.
 *
 * 출처: 전통 성명학 이론 (姓名學 81數理)
 */

export type StrokeLuck = '대길' | '길' | '중길' | '평' | '흉' | '대흉'

export interface StrokeInfo {
  /** 길흉 */
  luck: StrokeLuck
  /** 의미 */
  meaning: string
  /** 상세 설명 */
  description: string
}

/**
 * 81수리 길흉표
 *
 * 1부터 81까지의 획수별 길흉과 의미를 정의합니다.
 */
export const STROKE_81: Record<number, StrokeInfo> = {
  1: {
    luck: '대길',
    meaning: '만물의 시작, 명예와 부귀',
    description: '만사형통하여 명예와 부귀를 누림. 리더십이 뛰어남.',
  },
  2: {
    luck: '흉',
    meaning: '분리와 좌절',
    description: '분산과 이별을 의미. 고독하고 불안정함.',
  },
  3: {
    luck: '대길',
    meaning: '명성과 권력',
    description: '지혜와 재능이 뛰어나며 명성을 얻음. 성공운.',
  },
  4: {
    luck: '흉',
    meaning: '파괴와 불화',
    description: '재난과 고난이 많음. 불안정하고 불화함.',
  },
  5: {
    luck: '대길',
    meaning: '온화와 조화',
    description: '온화하고 조화로움. 복록이 넉넉하고 장수함.',
  },
  6: {
    luck: '대길',
    meaning: '덕망과 존경',
    description: '덕망이 높아 존경받음. 천복을 받음.',
  },
  7: {
    luck: '대길',
    meaning: '강인과 독립',
    description: '강인한 의지로 독립하여 성공함. 진취적.',
  },
  8: {
    luck: '대길',
    meaning: '노력과 성취',
    description: '노력하여 목표를 달성함. 의지가 강함.',
  },
  9: {
    luck: '흉',
    meaning: '재난과 실패',
    description: '재난이 많고 고립됨. 불완전함.',
  },
  10: {
    luck: '흉',
    meaning: '공허와 멸망',
    description: '공허하고 위태로움. 재난이 있음.',
  },
  11: {
    luck: '대길',
    meaning: '부흥과 발전',
    description: '만물이 소생하고 발전함. 가운이 번창함.',
  },
  12: {
    luck: '흉',
    meaning: '의지박약',
    description: '의지가 약하고 재난이 많음. 불안정함.',
  },
  13: {
    luck: '대길',
    meaning: '재능과 성공',
    description: '재능이 뛰어나 성공함. 학문과 예술에 능함.',
  },
  14: {
    luck: '흉',
    meaning: '파란과 고독',
    description: '파란만장하고 고독함. 실패가 많음.',
  },
  15: {
    luck: '대길',
    meaning: '온후와 복덕',
    description: '온후하고 복덕이 많음. 장수하고 번영함.',
  },
  16: {
    luck: '대길',
    meaning: '두령과 존귀',
    description: '두령이 되어 존귀함. 재산과 명예를 얻음.',
  },
  17: {
    luck: '대길',
    meaning: '강건과 돌파',
    description: '강건하여 난관을 돌파함. 성공운이 강함.',
  },
  18: {
    luck: '대길',
    meaning: '권위와 달성',
    description: '권위가 있어 목적을 달성함. 명예가 있음.',
  },
  19: {
    luck: '흉',
    meaning: '풍운과 재난',
    description: '풍파가 많고 재난이 있음. 불안정함.',
  },
  20: {
    luck: '흉',
    meaning: '공허와 멸망',
    description: '공허하고 재난이 많음. 좌절이 있음.',
  },
  21: {
    luck: '대길',
    meaning: '명예와 지도력',
    description: '명예와 지도력이 뛰어남. 만사형통함.',
  },
  22: {
    luck: '흉',
    meaning: '고독과 역경',
    description: '고독하고 역경이 많음. 의지가 약함.',
  },
  23: {
    luck: '대길',
    meaning: '융성과 발전',
    description: '융성하여 발전함. 명성과 지위를 얻음.',
  },
  24: {
    luck: '대길',
    meaning: '부귀와 번영',
    description: '부귀와 번영이 있음. 재물운이 좋음.',
  },
  25: {
    luck: '대길',
    meaning: '영민과 성공',
    description: '영민하여 성공함. 지략이 뛰어남.',
  },
  26: {
    luck: '흉',
    meaning: '변괴와 재난',
    description: '변괴가 많고 재난이 있음. 불안정함.',
  },
  27: {
    luck: '중길',
    meaning: '인내와 성취',
    description: '인내하면 성취함. 중년 이후 발복함.',
  },
  28: {
    luck: '흉',
    meaning: '고난과 이별',
    description: '고난이 많고 이별이 있음. 불우함.',
  },
  29: {
    luck: '대길',
    meaning: '지략과 재능',
    description: '지략과 재능이 뛰어남. 큰 성공을 거둠.',
  },
  30: {
    luck: '중길',
    meaning: '부침과 변화',
    description: '부침이 있으나 재능이 있음. 기복이 있음.',
  },
  31: {
    luck: '대길',
    meaning: '지혜와 용기',
    description: '지혜와 용기가 있어 성공함. 덕망이 높음.',
  },
  32: {
    luck: '대길',
    meaning: '행운과 희망',
    description: '행운이 따르고 희망이 있음. 귀인의 도움.',
  },
  33: {
    luck: '대길',
    meaning: '용승과 융성',
    description: '용맹하게 승진하고 융성함. 명예로움.',
  },
  34: {
    luck: '흉',
    meaning: '파멸과 재난',
    description: '파멸과 재난이 많음. 불운함.',
  },
  35: {
    luck: '대길',
    meaning: '안정과 평화',
    description: '안정되고 평화로움. 학문과 예술에 능함.',
  },
  36: {
    luck: '흉',
    meaning: '파란과 고난',
    description: '파란이 많고 고난이 있음. 불안정함.',
  },
  37: {
    luck: '대길',
    meaning: '권위와 충실',
    description: '권위가 있고 충실함. 신용과 명예를 얻음.',
  },
  38: {
    luck: '중길',
    meaning: '학문과 재능',
    description: '학문과 재능이 있음. 평범하나 안정적.',
  },
  39: {
    luck: '대길',
    meaning: '부귀와 영화',
    description: '부귀와 영화를 누림. 권세가 있음.',
  },
  40: {
    luck: '흉',
    meaning: '침체와 좌절',
    description: '침체되고 좌절함. 기복이 심함.',
  },
  41: {
    luck: '대길',
    meaning: '순조와 발전',
    description: '만사가 순조롭고 발전함. 복덕이 많음.',
  },
  42: {
    luck: '흉',
    meaning: '정체와 곤란',
    description: '정체되고 곤란함. 고난이 많음.',
  },
  43: {
    luck: '흉',
    meaning: '산란과 분산',
    description: '산란하고 분산됨. 집중력이 부족함.',
  },
  44: {
    luck: '흉',
    meaning: '파멸과 번뇌',
    description: '파멸과 번뇌가 많음. 불길함.',
  },
  45: {
    luck: '대길',
    meaning: '순풍과 성공',
    description: '순풍을 만나 성공함. 만사형통함.',
  },
  46: {
    luck: '흉',
    meaning: '고난과 재난',
    description: '고난과 재난이 많음. 불운함.',
  },
  47: {
    luck: '대길',
    meaning: '권위와 성취',
    description: '권위가 있어 성취함. 명예롭고 존귀함.',
  },
  48: {
    luck: '대길',
    meaning: '덕망과 성공',
    description: '덕망이 높아 성공함. 참모역에 적합함.',
  },
  49: {
    luck: '중길',
    meaning: '변화와 기복',
    description: '변화가 많고 기복이 있음. 길흉이 혼재함.',
  },
  50: {
    luck: '중길',
    meaning: '일성일패',
    description: '한번 성공하고 한번 실패함. 기복이 심함.',
  },
  51: {
    luck: '중길',
    meaning: '성쇠가 교차',
    description: '성하고 쇠함이 교차함. 기복이 있음.',
  },
  52: {
    luck: '대길',
    meaning: '선견과 성공',
    description: '선견지명이 있어 성공함. 통찰력이 뛰어남.',
  },
  53: {
    luck: '중길',
    meaning: '인내와 성취',
    description: '인내하면 성취함. 노력이 필요함.',
  },
  54: {
    luck: '흉',
    meaning: '고난과 실패',
    description: '고난이 많고 실패함. 불운함.',
  },
  55: {
    luck: '중길',
    meaning: '외강내유',
    description: '겉으로는 강하나 속은 유함. 길흉이 혼재함.',
  },
  56: {
    luck: '흉',
    meaning: '고초와 재난',
    description: '고초가 많고 재난이 있음. 불안정함.',
  },
  57: {
    luck: '대길',
    meaning: '노력과 달성',
    description: '노력하여 달성함. 명예와 재물을 얻음.',
  },
  58: {
    luck: '중길',
    meaning: '만년운',
    description: '초반은 어려우나 만년에 운이 트임.',
  },
  59: {
    luck: '흉',
    meaning: '우유부단',
    description: '우유부단하여 실패함. 의지가 약함.',
  },
  60: {
    luck: '흉',
    meaning: '공허와 멸망',
    description: '공허하고 멸망함. 재난이 있음.',
  },
  61: {
    luck: '대길',
    meaning: '명예와 부귀',
    description: '명예와 부귀를 얻음. 융성하고 번영함.',
  },
  62: {
    luck: '흉',
    meaning: '쇠약과 곤란',
    description: '쇠약하고 곤란함. 불운함.',
  },
  63: {
    luck: '대길',
    meaning: '부귀와 안락',
    description: '부귀와 안락을 누림. 만사순조로움.',
  },
  64: {
    luck: '흉',
    meaning: '이별과 고독',
    description: '이별과 고독이 있음. 재난이 많음.',
  },
  65: {
    luck: '대길',
    meaning: '부귀와 장수',
    description: '부귀와 장수를 누림. 복록이 많음.',
  },
  66: {
    luck: '흉',
    meaning: '내외불화',
    description: '내외가 불화함. 고난이 있음.',
  },
  67: {
    luck: '대길',
    meaning: '통달과 성공',
    description: '통달하여 성공함. 만사형통함.',
  },
  68: {
    luck: '대길',
    meaning: '발명과 창조',
    description: '발명과 창조력이 뛰어남. 명예를 얻음.',
  },
  69: {
    luck: '흉',
    meaning: '불안과 동요',
    description: '불안하고 동요함. 불안정함.',
  },
  70: {
    luck: '흉',
    meaning: '공허와 쇠퇴',
    description: '공허하고 쇠퇴함. 불길함.',
  },
  71: {
    luck: '중길',
    meaning: '실속과 성취',
    description: '실속 있게 성취함. 착실히 발전함.',
  },
  72: {
    luck: '흉',
    meaning: '우환과 고난',
    description: '우환과 고난이 많음. 불운함.',
  },
  73: {
    luck: '중길',
    meaning: '평안과 행복',
    description: '평안하고 행복함. 무난한 삶.',
  },
  74: {
    luck: '흉',
    meaning: '쇠퇴와 좌절',
    description: '쇠퇴하고 좌절함. 불운함.',
  },
  75: {
    luck: '중길',
    meaning: '수성과 안정',
    description: '지키고 안정됨. 수성하면 길함.',
  },
  76: {
    luck: '흉',
    meaning: '불화와 재난',
    description: '불화하고 재난이 있음. 불길함.',
  },
  77: {
    luck: '중길',
    meaning: '선후길흉',
    description: '앞은 좋으나 뒤가 나쁨. 길흉이 혼재함.',
  },
  78: {
    luck: '중길',
    meaning: '후박선후',
    description: '뒤가 두터우나 앞이 얇음. 중년 이후 발복.',
  },
  79: {
    luck: '흉',
    meaning: '정신노고',
    description: '정신적 노고가 많음. 고생이 많음.',
  },
  80: {
    luck: '흉',
    meaning: '일장춘몽',
    description: '한바탕 봄꿈. 공허하고 허무함.',
  },
  81: {
    luck: '대길',
    meaning: '환원과 부귀',
    description: '근본으로 돌아감. 부귀와 명예를 얻음.',
  },
}

/**
 * 획수의 길흉 판단
 *
 * @param strokes 획수
 * @returns 81수리 정보
 *
 * @example
 * ```typescript
 * const info = getStrokeInfo(15)
 * console.log(info.luck)     // "대길"
 * console.log(info.meaning)  // "온후와 복덕"
 * ```
 */
export function getStrokeInfo(strokes: number): StrokeInfo {
  // 81로 나눈 나머지 (0이면 81로 처리)
  const remainder = strokes % 81 || 81
  return STROKE_81[remainder]
}

/**
 * 길한 획수 목록 (대길, 길)
 */
export const AUSPICIOUS_STROKES = Object.entries(STROKE_81)
  .filter(([_, info]) => info.luck === '대길' || info.luck === '길')
  .map(([num, _]) => parseInt(num))

/**
 * 흉한 획수 목록 (흉, 대흉)
 */
export const INAUSPICIOUS_STROKES = Object.entries(STROKE_81)
  .filter(([_, info]) => info.luck === '흉' || info.luck === '대흉')
  .map(([num, _]) => parseInt(num))
