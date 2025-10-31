/**
 * 사주 분석 UI 테스트 페이지
 *
 * 사주 분석 컴포넌트들을 테스트합니다.
 */

'use client'

import { SajuAnalysisResult, SajuAnalysisData } from '@/components/saju/SajuAnalysisResult'

// 테스트용 샘플 데이터
const sampleData: SajuAnalysisData = {
  saju: {
    year: {
      cheongan: '경',
      jiji: '오',
      name: '경오',
      hanja: '庚午',
    },
    month: {
      cheongan: '신',
      jiji: '사',
      name: '신사',
      hanja: '辛巳',
    },
    day: {
      cheongan: '갑',
      jiji: '인',
      name: '갑인',
      hanja: '甲寅',
    },
    hour: {
      cheongan: '경',
      jiji: '오',
      name: '경오',
      hanja: '庚午',
    },
    birthInfo: {
      date: new Date('1990-05-15'),
      isLunar: false,
    },
  },
  ohang: {
    count: {
      목: 2,
      화: 3,
      토: 0,
      금: 3,
      수: 0,
    },
    weakElements: ['목'],
    strongElements: ['화', '금'],
    missingElements: ['토', '수'],
    yongsin: ['수', '목'],
    gisin: ['금', '화'],
    seasonalInfo: {
      season: 'SUMMER',
      seasonName: '여름',
      dominantElement: '화',
      preferredYongsin: ['수', '금'],
      avoidedElements: ['화', '목'],
      description:
        '여름(巳月·午月·未月)은 화(火) 기운이 왕성하여 매우 뜨겁습니다. 더위를 식힐 수(水)가 가장 필요하며, 보조적으로 금(金)도 도움이 됩니다.',
    },
  },
  sipseong: {
    count: {
      비견: 1,
      겁재: 1,
      식신: 1,
      상관: 2,
      편재: 0,
      정재: 0,
      편관: 2,
      정관: 1,
      편인: 0,
      정인: 0,
    },
    strong: ['상관', '편관'],
    weak: ['비견', '식신'],
    missing: ['편재', '정재', '편인', '정인'],
    personality: [
      '독립적이고 자기 주관이 뚜렷함',
      '창의적이고 표현력이 풍부함',
      '리더십이 있으나 때로 강압적일 수 있음',
      '재능이 많으나 재물운이 부족함',
    ],
    talents: [
      '예술·창작 활동',
      '리더십 직책',
      '자유업',
      '전문직',
    ],
    warnings: [
      '재물 관리에 신경 써야 함',
      '대인관계에서 융통성 필요',
      '학업·정신적 성장 노력 필요',
    ],
  },
  gyeokguk: {
    gyeokguk: '식신격',
    category: '정격',
    strength: '약',
    yongsin: ['정재', '식신'],
    heesin: ['비견', '정인'],
    gisin: ['편관', '상관'],
    description: '식신을 격국의 중심으로 하는 사주. 표현력과 창조성이 뛰어나며 예술적 재능이 있음.',
    characteristics: [
      '온화하고 인자한 성품',
      '창의적이고 예술적',
      '표현력이 뛰어남',
      '섬세하고 배려심이 있음',
    ],
    careerSuitability: [
      '예술가',
      '디자이너',
      '작가',
      '요리사',
      '교육자',
      '상담가',
    ],
    wealthLuck: '좋음',
    fameLuck: '좋음',
    academicLuck: '보통',
    warnings: [
      '너무 느긋할 수 있음',
      '결단력 부족',
      '현실감각 필요',
    ],
  },
  daeun: {
    direction: '순행',
    startAge: 8,
    currentAge: 34,
    cycles: [
      {
        cheongan: '임',
        jiji: '오',
        name: '임오',
        hanja: '壬午',
        startAge: 8,
        endAge: 17,
        ohang: { cheongan: '수', jiji: '화' },
        sipseong: { cheongan: '편인', jiji: '상관' },
      },
      {
        cheongan: '계',
        jiji: '미',
        name: '계미',
        hanja: '癸未',
        startAge: 18,
        endAge: 27,
        ohang: { cheongan: '수', jiji: '토' },
        sipseong: { cheongan: '정인', jiji: '편재' },
      },
      {
        cheongan: '갑',
        jiji: '신',
        name: '갑신',
        hanja: '甲申',
        startAge: 28,
        endAge: 37,
        ohang: { cheongan: '목', jiji: '금' },
        sipseong: { cheongan: '비견', jiji: '편관' },
      },
      {
        cheongan: '을',
        jiji: '유',
        name: '을유',
        hanja: '乙酉',
        startAge: 38,
        endAge: 47,
        ohang: { cheongan: '목', jiji: '금' },
        sipseong: { cheongan: '겁재', jiji: '정관' },
      },
      {
        cheongan: '병',
        jiji: '술',
        name: '병술',
        hanja: '丙戌',
        startAge: 48,
        endAge: 57,
        ohang: { cheongan: '화', jiji: '토' },
        sipseong: { cheongan: '식신', jiji: '편재' },
      },
      {
        cheongan: '정',
        jiji: '해',
        name: '정해',
        hanja: '丁亥',
        startAge: 58,
        endAge: 67,
        ohang: { cheongan: '화', jiji: '수' },
        sipseong: { cheongan: '상관', jiji: '정인' },
      },
      {
        cheongan: '무',
        jiji: '자',
        name: '무자',
        hanja: '戊子',
        startAge: 68,
        endAge: 77,
        ohang: { cheongan: '토', jiji: '수' },
        sipseong: { cheongan: '편재', jiji: '정인' },
      },
      {
        cheongan: '기',
        jiji: '축',
        name: '기축',
        hanja: '己丑',
        startAge: 78,
        endAge: 87,
        ohang: { cheongan: '토', jiji: '토' },
        sipseong: { cheongan: '정재', jiji: '편재' },
      },
      {
        cheongan: '경',
        jiji: '인',
        name: '경인',
        hanja: '庚寅',
        startAge: 88,
        endAge: 97,
        ohang: { cheongan: '금', jiji: '목' },
        sipseong: { cheongan: '편관', jiji: '비견' },
      },
      {
        cheongan: '신',
        jiji: '묘',
        name: '신묘',
        hanja: '辛卯',
        startAge: 98,
        endAge: 107,
        ohang: { cheongan: '금', jiji: '목' },
        sipseong: { cheongan: '정관', jiji: '겁재' },
      },
    ],
    currentCycle: {
      cheongan: '갑',
      jiji: '신',
      name: '갑신',
      hanja: '甲申',
      startAge: 28,
      endAge: 37,
      ohang: { cheongan: '목', jiji: '금' },
      sipseong: { cheongan: '비견', jiji: '편관' },
    },
    nextCycle: {
      cheongan: '을',
      jiji: '유',
      name: '을유',
      hanja: '乙酉',
      startAge: 38,
      endAge: 47,
      ohang: { cheongan: '목', jiji: '금' },
      sipseong: { cheongan: '겁재', jiji: '정관' },
    },
  },
}

export default function TestSajuAnalysisPage() {
  return (
    <div className="container mx-auto max-w-6xl py-8 px-4">
      <SajuAnalysisResult data={sampleData} />
    </div>
  )
}
