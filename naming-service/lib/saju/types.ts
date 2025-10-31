/**
 * 사주팔자 계산을 위한 타입 정의
 *
 * 전통 명리학의 기본 개념들을 TypeScript 타입으로 정의합니다.
 */

// ============================================================================
// 천간 (天干) - Heavenly Stems
// ============================================================================

/**
 * 천간 (10개)
 * 갑(甲), 을(乙), 병(丙), 정(丁), 무(戊), 기(己), 경(庚), 신(辛), 임(壬), 계(癸)
 */
export type Cheongan = '갑' | '을' | '병' | '정' | '무' | '기' | '경' | '신' | '임' | '계'

/**
 * 천간 배열 (순서대로)
 */
export const CHEONGAN_LIST: Cheongan[] = [
  '갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'
]

/**
 * 천간 한자 매핑
 */
export const CHEONGAN_HANJA: Record<Cheongan, string> = {
  '갑': '甲',
  '을': '乙',
  '병': '丙',
  '정': '丁',
  '무': '戊',
  '기': '己',
  '경': '庚',
  '신': '辛',
  '임': '壬',
  '계': '癸',
}

// ============================================================================
// 지지 (地支) - Earthly Branches
// ============================================================================

/**
 * 지지 (12개)
 * 자(子), 축(丑), 인(寅), 묘(卯), 진(辰), 사(巳), 오(午), 미(未), 신(申), 유(酉), 술(戌), 해(亥)
 */
export type Jiji = '자' | '축' | '인' | '묘' | '진' | '사' | '오' | '미' | '신' | '유' | '술' | '해'

/**
 * 지지 배열 (순서대로)
 */
export const JIJI_LIST: Jiji[] = [
  '자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'
]

/**
 * 지지 한자 매핑
 */
export const JIJI_HANJA: Record<Jiji, string> = {
  '자': '子',
  '축': '丑',
  '인': '寅',
  '묘': '卯',
  '진': '辰',
  '사': '巳',
  '오': '午',
  '미': '未',
  '신': '申',
  '유': '酉',
  '술': '戌',
  '해': '亥',
}

/**
 * 지지의 띠(동물) 매핑
 */
export const JIJI_ANIMAL: Record<Jiji, string> = {
  '자': '쥐',
  '축': '소',
  '인': '호랑이',
  '묘': '토끼',
  '진': '용',
  '사': '뱀',
  '오': '말',
  '미': '양',
  '신': '원숭이',
  '유': '닭',
  '술': '개',
  '해': '돼지',
}

// ============================================================================
// 오행 (五行) - Five Elements
// ============================================================================

/**
 * 오행 (5개)
 * 목(木), 화(火), 토(土), 금(金), 수(水)
 */
export type Ohang = '목' | '화' | '토' | '금' | '수'

/**
 * 오행 배열 (상생 순서)
 */
export const OHANG_LIST: Ohang[] = ['목', '화', '토', '금', '수']

/**
 * 오행 한자 매핑
 */
export const OHANG_HANJA: Record<Ohang, string> = {
  '목': '木',
  '화': '火',
  '토': '土',
  '금': '金',
  '수': '水',
}

/**
 * 음양 구분
 */
export type Eumyang = '양' | '음'

// ============================================================================
// 십성 (十星) - Ten Stars
// ============================================================================

/**
 * 십성 (10가지 신)
 * 일간을 기준으로 다른 천간/지지와의 오행 관계를 나타냄
 */
export type Sipseong =
  | '비견' // 比肩 - 같은 오행, 같은 음양
  | '겁재' // 劫財 - 같은 오행, 다른 음양
  | '식신' // 食神 - 내가 생하는 오행, 같은 음양
  | '상관' // 傷官 - 내가 생하는 오행, 다른 음양
  | '편재' // 偏財 - 내가 극하는 오행, 같은 음양
  | '정재' // 正財 - 내가 극하는 오행, 다른 음양
  | '편관' // 偏官(七殺) - 나를 극하는 오행, 같은 음양
  | '정관' // 正官 - 나를 극하는 오행, 다른 음양
  | '편인' // 偏印(梟神) - 나를 생하는 오행, 같은 음양
  | '정인' // 正印 - 나를 생하는 오행, 다른 음양

/**
 * 십성 배열 (순서대로)
 */
export const SIPSEONG_LIST: Sipseong[] = [
  '비견', '겁재', '식신', '상관', '편재', '정재', '편관', '정관', '편인', '정인'
]

/**
 * 십성 한자 매핑
 */
export const SIPSEONG_HANJA: Record<Sipseong, string> = {
  '비견': '比肩',
  '겁재': '劫財',
  '식신': '食神',
  '상관': '傷官',
  '편재': '偏財',
  '정재': '正財',
  '편관': '偏官',
  '정관': '正官',
  '편인': '偏印',
  '정인': '正印',
}

/**
 * 십성 별칭 (다른 이름)
 */
export const SIPSEONG_ALIAS: Record<Sipseong, string[]> = {
  '비견': ['比肩'],
  '겁재': ['劫財'],
  '식신': ['食神'],
  '상관': ['傷官'],
  '편재': ['偏財'],
  '정재': ['正財'],
  '편관': ['七殺', '칠살'],
  '정관': ['正官'],
  '편인': ['梟神', '효신', '도식'],
  '정인': ['正印'],
}

/**
 * 십성 분류 (5가지 그룹)
 */
export type SipseongCategory = '비겁' | '식상' | '재성' | '관성' | '인성'

/**
 * 십성 카테고리 매핑
 */
export const SIPSEONG_CATEGORY: Record<Sipseong, SipseongCategory> = {
  '비견': '비겁',
  '겁재': '비겁',
  '식신': '식상',
  '상관': '식상',
  '편재': '재성',
  '정재': '재성',
  '편관': '관성',
  '정관': '관성',
  '편인': '인성',
  '정인': '인성',
}

/**
 * 십성 개수
 */
export interface SipseongCount {
  비견: number
  겁재: number
  식신: number
  상관: number
  편재: number
  정재: number
  편관: number
  정관: number
  편인: number
  정인: number
}

/**
 * 십성 분석 결과
 */
export interface SipseongAnalysis {
  /** 일간 */
  ilgan: Cheongan
  /** 일간 오행 */
  ilganOhang: Ohang
  /** 일간 음양 */
  ilganEumyang: Eumyang
  /** 사주 8글자의 십성 */
  pillars: {
    year: { cheongan: Sipseong; jiji: Sipseong }
    month: { cheongan: Sipseong; jiji: Sipseong }
    day: { cheongan: Sipseong; jiji: Sipseong } // 일간은 제외, 일지만 포함
    hour: { cheongan: Sipseong; jiji: Sipseong }
  }
  /** 십성 개수 통계 */
  count: SipseongCount
  /** 강한 십성 (3개 이상) */
  strong: Sipseong[]
  /** 약한 십성 (1개) */
  weak: Sipseong[]
  /** 없는 십성 (0개) */
  missing: Sipseong[]
  /** 십성 균형 설명 */
  description: string
  /** 성격 특성 */
  personality: string[]
  /** 재능 및 적성 */
  talents: string[]
  /** 주의사항 */
  warnings: string[]
}

// ============================================================================
// 대운 (大運) - Major Cycles
// ============================================================================

/**
 * 대운 (大運)
 * 10년 단위로 변하는 운세
 */
export interface Daeun {
  /** 천간 */
  cheongan: Cheongan
  /** 지지 */
  jiji: Jiji
  /** 대운 이름 (예: "갑자") */
  name: string
  /** 한자 표기 (예: "甲子") */
  hanja: string
  /** 시작 나이 */
  startAge: number
  /** 종료 나이 */
  endAge: number
  /** 대운 오행 */
  ohang: {
    cheongan: Ohang
    jiji: Ohang
  }
  /** 대운 십성 */
  sipseong: {
    cheongan: Sipseong
    jiji: Sipseong
  }
}

/**
 * 대운 방향
 */
export type DaeunDirection = '순행' | '역행'

/**
 * 대운 분석 결과
 */
export interface DaeunAnalysis {
  /** 대운 방향 (순행/역행) */
  direction: DaeunDirection
  /** 입운 연령 */
  startAge: number
  /** 대운 목록 (보통 10개, 100세까지) */
  cycles: Daeun[]
  /** 현재 대운 (나이 기준) */
  currentCycle?: Daeun
  /** 다음 대운 */
  nextCycle?: Daeun
  /** 현재 대운의 특성 */
  currentCharacteristics?: {
    /** 운세 흐름 */
    flow: string
    /** 강점 */
    strengths: string[]
    /** 주의사항 */
    warnings: string[]
    /** 적합한 활동 */
    suitableActivities: string[]
  }
  /** 대운 설명 */
  description: string
}

/**
 * 대운과 사주의 관계
 */
export type DaeunRelation = '충' | '합' | '형' | '파' | '해' | '원진' | '중립'

/**
 * 대운 상호작용 분석
 */
export interface DaeunInteraction {
  /** 대운 기둥 */
  daeun: Daeun
  /** 사주와의 관계 */
  relations: {
    withYear: DaeunRelation
    withMonth: DaeunRelation
    withDay: DaeunRelation
    withHour: DaeunRelation
  }
  /** 긍정 요소 */
  positive: string[]
  /** 부정 요소 */
  negative: string[]
  /** 종합 평가 */
  overallRating: '매우 좋음' | '좋음' | '보통' | '주의' | '매우 주의'
}

// ============================================================================
// 사주 기둥 (四柱) - Four Pillars
// ============================================================================

/**
 * 사주의 한 기둥 (천간 + 지지)
 */
export interface Pillar {
  /** 천간 */
  cheongan: Cheongan
  /** 지지 */
  jiji: Jiji
  /** 기둥 이름 (예: "갑자", "을축") */
  name: string
  /** 한자 표기 (예: "甲子", "乙丑") */
  hanja: string
}

/**
 * 사주팔자 (四柱八字)
 * 년(年), 월(月), 일(日), 시(時) 네 기둥
 */
export interface Saju {
  /** 년주 (Year Pillar) */
  year: Pillar
  /** 월주 (Month Pillar) */
  month: Pillar
  /** 일주 (Day Pillar) */
  day: Pillar
  /** 시주 (Hour Pillar) */
  hour: Pillar
  /** 생년월일시 정보 */
  birthInfo: BirthInfo
}

/**
 * 생년월일시 정보
 */
export interface BirthInfo {
  /** 양력/음력 날짜 */
  date: Date
  /** 음력 여부 */
  isLunar: boolean
  /** 시간 (예: "14:30", "오시") */
  time?: string
  /** 윤달 여부 */
  isLeapMonth?: boolean
}

// ============================================================================
// 오행 분석
// ============================================================================

/**
 * 오행 개수 및 비율
 */
export interface OhangCount {
  /** 목의 개수 */
  목: number
  /** 화의 개수 */
  화: number
  /** 토의 개수 */
  토: number
  /** 금의 개수 */
  금: number
  /** 수의 개수 */
  수: number
}

/**
 * 오행 분석 결과
 */
export interface OhangAnalysis {
  /** 오행 개수 */
  count: OhangCount
  /** 강한 오행 (과다한 오행) */
  strong: Ohang[]
  /** 약한 오행 (부족한 오행) */
  weak: Ohang[]
  /** 없는 오행 */
  missing: Ohang[]
  /** 용신 (필요한 오행) */
  yongsin: Ohang[]
  /** 기신 (피해야 할 오행) */
  gisin: Ohang[]
  /** 전체적인 사주 강약 */
  strength: '강' | '중' | '약'
  /** 분석 설명 */
  description: string
  /** 계절 조후 조정 정보 (선택사항) */
  johooAdjustment?: {
    season: {
      season: 'SPRING' | 'SUMMER' | 'FALL' | 'WINTER'
      seasonName: string
      dominantElement: Ohang
      weakElements: Ohang[]
      preferredYongsin: Ohang[]
      avoidedElements: Ohang[]
      description: string
      characteristics: string[]
    }
    originalYongsin: Ohang[]
    adjustedYongsin: Ohang[]
    adjustmentReason: string
    priority: 'HIGH' | 'MEDIUM' | 'LOW'
  }
}

// ============================================================================
// 궁합 평가
// ============================================================================

/**
 * 이름과 사주의 궁합 점수
 */
export interface CompatibilityScore {
  /** 총점 (0-100) */
  total: number
  /** 오행 조화 점수 */
  ohangHarmony: number
  /** 음양 균형 점수 */
  eumyangBalance: number
  /** 이름 획수 점수 */
  strokeScore: number
  /** 추천 등급 (A+, A, B+, B, C) */
  grade: string
  /** 상세 설명 */
  details: string[]
}

/**
 * 작명 추천 정보
 */
export interface NamingRecommendation {
  /** 추천 오행 */
  recommendedOhang: Ohang[]
  /** 피해야 할 오행 */
  avoidOhang: Ohang[]
  /** 추천 한자 */
  recommendedHanja?: string[]
  /** 추천 획수 */
  recommendedStrokes?: number[]
  /** 이유 설명 */
  reason: string
}

// ============================================================================
// 유틸리티 타입
// ============================================================================

/**
 * 간지 (천간 + 지지 조합)
 * 예: "갑자", "을축", "병인" 등 60갑자
 */
export type Ganji = `${Cheongan}${Jiji}`

/**
 * 절기 (節氣) - 24절기
 */
export type Jeolgi =
  | '입춘' | '우수' | '경칩' | '춘분' | '청명' | '곡우'
  | '입하' | '소만' | '망종' | '하지' | '소서' | '대서'
  | '입추' | '처서' | '백로' | '추분' | '한로' | '상강'
  | '입동' | '소설' | '대설' | '동지' | '소한' | '대한'

/**
 * 사주 계산 옵션
 */
export interface SajuCalculationOptions {
  /** 양력/음력 여부 */
  isLunar?: boolean
  /** 시간 (예: "14:30" 또는 "오시") */
  time?: string
  /** 윤달 여부 (음력인 경우) */
  isLeapMonth?: boolean
  /** 절입시각 자동 조정 여부 */
  adjustJeolip?: boolean
}
