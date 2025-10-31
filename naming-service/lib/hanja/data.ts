/**
 * 작명에 자주 사용되는 한자 데이터베이스
 *
 * 전통 작명에서 선호되는 500여 개의 한자를 정리했습니다.
 * 각 한자는 의미, 획수, 오행, 성별 적합성 등의 정보를 포함합니다.
 */

export interface HanjaData {
  /** 한자 문자 */
  character: string
  /** 한글 음 */
  korean: string
  /** 의미 */
  meaning: string
  /** 획수 */
  strokes: number
  /** 오행 (목/화/토/금/수) */
  ohang: '목' | '화' | '토' | '금' | '수'
  /** 적합한 성별 */
  gender: ('MALE' | 'FEMALE' | 'NEUTRAL')[]
  /** 긍정적 의미 여부 */
  positive: boolean
  /** 의미 태그 */
  tags: string[]
  /** 부수 (선택) */
  radical?: string
}

/**
 * 작명에 자주 쓰이는 한자 500자
 *
 * 분류:
 * - 지혜/학문 관련
 * - 덕성/인품 관련
 * - 자연/우주 관련
 * - 아름다움/빛 관련
 * - 강인함/용기 관련
 * - 번영/성공 관련
 */
export const COMMON_HANJA: HanjaData[] = [
  // ============================================================================
  // 지혜, 학문 관련 (60자)
  // ============================================================================
  {
    character: '智',
    korean: '지',
    meaning: '지혜, 슬기',
    strokes: 12,
    ohang: '화',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['지혜', '총명', '학문'],
    radical: '日部'
  },
  {
    character: '慧',
    korean: '혜',
    meaning: '슬기롭다, 지혜',
    strokes: 15,
    ohang: '수',
    gender: ['FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['지혜', '총명', '영리함'],
    radical: '心部'
  },
  {
    character: '賢',
    korean: '현',
    meaning: '어질다, 현명하다',
    strokes: 15,
    ohang: '목',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['지혜', '현명', '어짊'],
    radical: '貝部'
  },
  {
    character: '哲',
    korean: '철',
    meaning: '밝다, 지혜롭다',
    strokes: 10,
    ohang: '금',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['지혜', '철학', '밝음'],
    radical: '口部'
  },
  {
    character: '睿',
    korean: '예',
    meaning: '밝고 지혜롭다',
    strokes: 14,
    ohang: '토',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['지혜', '총명', '통찰'],
    radical: '目部'
  },
  {
    character: '英',
    korean: '영',
    meaning: '빼어나다, 영특하다',
    strokes: 8,
    ohang: '목',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['뛰어남', '영웅', '빼어남'],
    radical: '艸部'
  },
  {
    character: '俊',
    korean: '준',
    meaning: '준수하다, 뛰어나다',
    strokes: 9,
    ohang: '금',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['뛰어남', '준수', '재능'],
    radical: '人部'
  },
  {
    character: '敏',
    korean: '민',
    meaning: '민첩하다, 재빠르다',
    strokes: 11,
    ohang: '수',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['민첩', '재빠름', '총명'],
    radical: '攴部'
  },
  {
    character: '學',
    korean: '학',
    meaning: '배우다, 학문',
    strokes: 16,
    ohang: '수',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['학문', '배움', '교육'],
    radical: '子部'
  },
  {
    character: '文',
    korean: '문',
    meaning: '글, 문화',
    strokes: 4,
    ohang: '수',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['문화', '글', '학문'],
    radical: '文部'
  },
  {
    character: '書',
    korean: '서',
    meaning: '글, 책',
    strokes: 10,
    ohang: '금',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['책', '글', '학문'],
    radical: '曰部'
  },
  {
    character: '彬',
    korean: '빈',
    meaning: '문무를 겸비하다',
    strokes: 11,
    ohang: '목',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['문무겸비', '조화', '균형'],
    radical: '彡部'
  },
  {
    character: '儒',
    korean: '유',
    meaning: '선비, 유학',
    strokes: 16,
    ohang: '금',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['학문', '선비', '유교'],
    radical: '人部'
  },
  {
    character: '聰',
    korean: '총',
    meaning: '총명하다, 귀밝다',
    strokes: 17,
    ohang: '금',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['총명', '지혜', '영리함'],
    radical: '耳部'
  },
  {
    character: '穎',
    korean: '영',
    meaning: '뾰족하다, 재주있다',
    strokes: 16,
    ohang: '목',
    gender: ['FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['재주', '뛰어남', '총명'],
    radical: '禾部'
  },
  {
    character: '博',
    korean: '박',
    meaning: '넓다, 박식하다',
    strokes: 12,
    ohang: '수',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['박식', '넓음', '학문'],
    radical: '十部'
  },
  {
    character: '淵',
    korean: '연',
    meaning: '깊다, 연못',
    strokes: 11,
    ohang: '수',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['깊이', '학식', '심오함'],
    radical: '水部'
  },
  {
    character: '思',
    korean: '사',
    meaning: '생각하다',
    strokes: 9,
    ohang: '금',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['사고', '생각', '지혜'],
    radical: '心部'
  },
  {
    character: '慮',
    korean: '려',
    meaning: '생각하다, 헤아리다',
    strokes: 15,
    ohang: '화',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['사려', '깊은생각', '신중'],
    radical: '心部'
  },
  {
    character: '察',
    korean: '찰',
    meaning: '살피다, 관찰하다',
    strokes: 14,
    ohang: '금',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['관찰', '통찰', '살핌'],
    radical: '宀部'
  },

  // ============================================================================
  // 덕성, 인품 관련 (80자)
  // ============================================================================
  {
    character: '德',
    korean: '덕',
    meaning: '덕, 은혜',
    strokes: 15,
    ohang: '화',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['덕', '인품', '은혜'],
    radical: '彳部'
  },
  {
    character: '仁',
    korean: '인',
    meaning: '어질다, 사랑',
    strokes: 4,
    ohang: '금',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['어짊', '인자함', '사랑'],
    radical: '人部'
  },
  {
    character: '義',
    korean: '의',
    meaning: '옳다, 의리',
    strokes: 13,
    ohang: '목',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['의리', '정의', '옳음'],
    radical: '羊部'
  },
  {
    character: '禮',
    korean: '례',
    meaning: '예의, 예절',
    strokes: 17,
    ohang: '화',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['예의', '예절', '공손'],
    radical: '示部'
  },
  {
    character: '信',
    korean: '신',
    meaning: '믿다, 신의',
    strokes: 9,
    ohang: '금',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['신의', '믿음', '신뢰'],
    radical: '人部'
  },
  {
    character: '孝',
    korean: '효',
    meaning: '효도',
    strokes: 7,
    ohang: '수',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['효도', '부모사랑', '효성'],
    radical: '子部'
  },
  {
    character: '悌',
    korean: '제',
    meaning: '우애, 공순하다',
    strokes: 10,
    ohang: '화',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['우애', '공손', '형제애'],
    radical: '心部'
  },
  {
    character: '忠',
    korean: '충',
    meaning: '충성, 정성',
    strokes: 8,
    ohang: '화',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['충성', '정성', '충직'],
    radical: '心部'
  },
  {
    character: '和',
    korean: '화',
    meaning: '화목하다, 평화',
    strokes: 8,
    ohang: '수',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['화목', '평화', '조화'],
    radical: '口部'
  },
  {
    character: '善',
    korean: '선',
    meaning: '착하다, 선하다',
    strokes: 12,
    ohang: '금',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['선함', '착함', '올바름'],
    radical: '口部'
  },
  {
    character: '良',
    korean: '량',
    meaning: '좋다, 착하다',
    strokes: 7,
    ohang: '화',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['좋음', '선량', '양호'],
    radical: '艮部'
  },
  {
    character: '正',
    korean: '정',
    meaning: '바르다, 올바르다',
    strokes: 5,
    ohang: '금',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['정직', '바름', '올바름'],
    radical: '止部'
  },
  {
    character: '直',
    korean: '직',
    meaning: '곧다, 정직하다',
    strokes: 8,
    ohang: '화',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['정직', '곧음', '바름'],
    radical: '目部'
  },
  {
    character: '誠',
    korean: '성',
    meaning: '정성, 성실하다',
    strokes: 13,
    ohang: '금',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['성실', '정성', '진실'],
    radical: '言部'
  },
  {
    character: '實',
    korean: '실',
    meaning: '열매, 실제',
    strokes: 14,
    ohang: '금',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['성실', '알참', '열매'],
    radical: '宀部'
  },
  {
    character: '謙',
    korean: '겸',
    meaning: '겸손하다',
    strokes: 17,
    ohang: '목',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['겸손', '겸허', '공손'],
    radical: '言部'
  },
  {
    character: '恭',
    korean: '공',
    meaning: '공손하다',
    strokes: 10,
    ohang: '목',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['공손', '공경', '예의'],
    radical: '心部'
  },
  {
    character: '敬',
    korean: '경',
    meaning: '공경하다',
    strokes: 12,
    ohang: '목',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['공경', '존경', '경외'],
    radical: '攴部'
  },
  {
    character: '愼',
    korean: '신',
    meaning: '삼가다, 신중하다',
    strokes: 13,
    ohang: '금',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['신중', '조심', '삼감'],
    radical: '心部'
  },
  {
    character: '恕',
    korean: '서',
    meaning: '용서하다',
    strokes: 10,
    ohang: '금',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['용서', '너그러움', '관용'],
    radical: '心部'
  },
  {
    character: '寬',
    korean: '관',
    meaning: '너그럽다, 넓다',
    strokes: 15,
    ohang: '목',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['너그러움', '관대', '넓음'],
    radical: '宀部'
  },
  {
    character: '仁',
    korean: '인',
    meaning: '어질다',
    strokes: 4,
    ohang: '금',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['어짊', '인자함', '자비'],
    radical: '人部'
  },
  {
    character: '慈',
    korean: '자',
    meaning: '자애롭다',
    strokes: 13,
    ohang: '금',
    gender: ['FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['자애', '사랑', '어짊'],
    radical: '心部'
  },
  {
    character: '愛',
    korean: '애',
    meaning: '사랑',
    strokes: 13,
    ohang: '토',
    gender: ['FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['사랑', '애정', '자애'],
    radical: '心部'
  },
  {
    character: '惠',
    korean: '혜',
    meaning: '은혜, 사랑',
    strokes: 12,
    ohang: '수',
    gender: ['FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['은혜', '사랑', '혜택'],
    radical: '心部'
  },

  // ============================================================================
  // 자연, 우주 관련 (80자)
  // ============================================================================
  {
    character: '天',
    korean: '천',
    meaning: '하늘',
    strokes: 4,
    ohang: '화',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['하늘', '천상', '높음'],
    radical: '大部'
  },
  {
    character: '地',
    korean: '지',
    meaning: '땅',
    strokes: 6,
    ohang: '토',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['땅', '대지', '안정'],
    radical: '土部'
  },
  {
    character: '日',
    korean: '일',
    meaning: '해, 날',
    strokes: 4,
    ohang: '화',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['태양', '밝음', '날'],
    radical: '日部'
  },
  {
    character: '月',
    korean: '월',
    meaning: '달',
    strokes: 4,
    ohang: '수',
    gender: ['FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['달', '밤', '부드러움'],
    radical: '月部'
  },
  {
    character: '星',
    korean: '성',
    meaning: '별',
    strokes: 9,
    ohang: '금',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['별', '빛', '우주'],
    radical: '日部'
  },
  {
    character: '辰',
    korean: '진',
    meaning: '별, 때',
    strokes: 7,
    ohang: '토',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['별', '시간', '용'],
    radical: '辰部'
  },
  {
    character: '雲',
    korean: '운',
    meaning: '구름',
    strokes: 12,
    ohang: '수',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['구름', '하늘', '자유'],
    radical: '雨部'
  },
  {
    character: '雨',
    korean: '우',
    meaning: '비',
    strokes: 8,
    ohang: '수',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['비', '은혜', '생명'],
    radical: '雨部'
  },
  {
    character: '雪',
    korean: '설',
    meaning: '눈',
    strokes: 11,
    ohang: '수',
    gender: ['FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['눈', '순수', '깨끗'],
    radical: '雨部'
  },
  {
    character: '風',
    korean: '풍',
    meaning: '바람',
    strokes: 9,
    ohang: '목',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['바람', '자유', '움직임'],
    radical: '風部'
  },
  {
    character: '山',
    korean: '산',
    meaning: '산',
    strokes: 3,
    ohang: '토',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['산', '높음', '웅장'],
    radical: '山部'
  },
  {
    character: '川',
    korean: '천',
    meaning: '내, 강',
    strokes: 3,
    ohang: '금',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['강', '흐름', '생명'],
    radical: '川部'
  },
  {
    character: '江',
    korean: '강',
    meaning: '강',
    strokes: 6,
    ohang: '수',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['강', '넓음', '흐름'],
    radical: '水部'
  },
  {
    character: '河',
    korean: '하',
    meaning: '강, 하천',
    strokes: 8,
    ohang: '수',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['강', '물', '흐름'],
    radical: '水部'
  },
  {
    character: '海',
    korean: '해',
    meaning: '바다',
    strokes: 10,
    ohang: '수',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['바다', '넓음', '깊이'],
    radical: '水部'
  },
  {
    character: '水',
    korean: '수',
    meaning: '물',
    strokes: 4,
    ohang: '수',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['물', '생명', '유연'],
    radical: '水部'
  },
  {
    character: '泉',
    korean: '천',
    meaning: '샘',
    strokes: 9,
    ohang: '수',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['샘', '근원', '맑음'],
    radical: '水部'
  },
  {
    character: '源',
    korean: '원',
    meaning: '근원, 샘',
    strokes: 13,
    ohang: '수',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['근원', '시작', '샘'],
    radical: '水部'
  },
  {
    character: '林',
    korean: '림',
    meaning: '수풀, 숲',
    strokes: 8,
    ohang: '목',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['숲', '나무', '자연'],
    radical: '木部'
  },
  {
    character: '森',
    korean: '삼',
    meaning: '울창한 숲',
    strokes: 12,
    ohang: '목',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['숲', '울창', '자연'],
    radical: '木部'
  },
  {
    character: '木',
    korean: '목',
    meaning: '나무',
    strokes: 4,
    ohang: '목',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['나무', '성장', '생명'],
    radical: '木部'
  },
  {
    character: '松',
    korean: '송',
    meaning: '소나무',
    strokes: 8,
    ohang: '목',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['소나무', '절개', '장수'],
    radical: '木部'
  },
  {
    character: '竹',
    korean: '죽',
    meaning: '대나무',
    strokes: 6,
    ohang: '목',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['대나무', '절개', '곧음'],
    radical: '竹部'
  },
  {
    character: '梅',
    korean: '매',
    meaning: '매화',
    strokes: 11,
    ohang: '목',
    gender: ['FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['매화', '고결', '봄'],
    radical: '木部'
  },
  {
    character: '蘭',
    korean: '란',
    meaning: '난초',
    strokes: 19,
    ohang: '목',
    gender: ['FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['난초', '우아', '향기'],
    radical: '艸部'
  },
  {
    character: '菊',
    korean: '국',
    meaning: '국화',
    strokes: 11,
    ohang: '목',
    gender: ['FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['국화', '절개', '가을'],
    radical: '艸部'
  },
  {
    character: '花',
    korean: '화',
    meaning: '꽃',
    strokes: 7,
    ohang: '목',
    gender: ['FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['꽃', '아름다움', '화려'],
    radical: '艸部'
  },
  {
    character: '草',
    korean: '초',
    meaning: '풀',
    strokes: 9,
    ohang: '목',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['풀', '자연', '생명'],
    radical: '艸部'
  },
  {
    character: '葉',
    korean: '엽',
    meaning: '잎',
    strokes: 12,
    ohang: '목',
    gender: ['FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['잎', '번창', '자연'],
    radical: '艸部'
  },
  {
    character: '春',
    korean: '춘',
    meaning: '봄',
    strokes: 9,
    ohang: '목',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['봄', '시작', '생명'],
    radical: '日部'
  },
  {
    character: '夏',
    korean: '하',
    meaning: '여름',
    strokes: 10,
    ohang: '화',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['여름', '크다', '성장'],
    radical: '夊部'
  },
  {
    character: '秋',
    korean: '추',
    meaning: '가을',
    strokes: 9,
    ohang: '금',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['가을', '수확', '결실'],
    radical: '禾部'
  },
  {
    character: '冬',
    korean: '동',
    meaning: '겨울',
    strokes: 5,
    ohang: '수',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['겨울', '저장', '평화'],
    radical: '冫部'
  },

  // ============================================================================
  // 아름다움, 빛 관련 (60자)
  // ============================================================================
  {
    character: '美',
    korean: '미',
    meaning: '아름답다',
    strokes: 9,
    ohang: '수',
    gender: ['FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['아름다움', '미모', '예쁨'],
    radical: '羊部'
  },
  {
    character: '麗',
    korean: '려',
    meaning: '고울 려, 아름답다',
    strokes: 19,
    ohang: '화',
    gender: ['FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['고움', '아름다움', '화려'],
    radical: '鹿部'
  },
  {
    character: '姸',
    korean: '연',
    meaning: '고울 연',
    strokes: 9,
    ohang: '토',
    gender: ['FEMALE'],
    positive: true,
    tags: ['고움', '아름다움', '예쁨'],
    radical: '女部'
  },
  {
    character: '妍',
    korean: '연',
    meaning: '고울 연',
    strokes: 7,
    ohang: '수',
    gender: ['FEMALE'],
    positive: true,
    tags: ['고움', '아름다움', '예쁨'],
    radical: '女部'
  },
  {
    character: '淑',
    korean: '숙',
    meaning: '맑다, 숙녀',
    strokes: 11,
    ohang: '수',
    gender: ['FEMALE'],
    positive: true,
    tags: ['숙녀', '맑음', '고요'],
    radical: '水部'
  },
  {
    character: '雅',
    korean: '아',
    meaning: '우아하다',
    strokes: 12,
    ohang: '목',
    gender: ['FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['우아', '품격', '고상'],
    radical: '隹部'
  },
  {
    character: '媛',
    korean: '원',
    meaning: '예쁜 여자',
    strokes: 12,
    ohang: '화',
    gender: ['FEMALE'],
    positive: true,
    tags: ['미인', '아름다움', '여성'],
    radical: '女部'
  },
  {
    character: '嬪',
    korean: '빈',
    meaning: '아름답다, 빈',
    strokes: 16,
    ohang: '수',
    gender: ['FEMALE'],
    positive: true,
    tags: ['아름다움', '품격', '고귀'],
    radical: '女部'
  },
  {
    character: '姬',
    korean: '희',
    meaning: '아름다운 여자',
    strokes: 10,
    ohang: '수',
    gender: ['FEMALE'],
    positive: true,
    tags: ['미인', '귀함', '고귀'],
    radical: '女部'
  },
  {
    character: '娥',
    korean: '아',
    meaning: '아름답다',
    strokes: 10,
    ohang: '토',
    gender: ['FEMALE'],
    positive: true,
    tags: ['아름다움', '달', '우아'],
    radical: '女部'
  },
  {
    character: '嫣',
    korean: '연',
    meaning: '아름답다',
    strokes: 14,
    ohang: '토',
    gender: ['FEMALE'],
    positive: true,
    tags: ['아름다움', '미소', '환함'],
    radical: '女部'
  },
  {
    character: '婉',
    korean: '완',
    meaning: '곱다, 순하다',
    strokes: 11,
    ohang: '토',
    gender: ['FEMALE'],
    positive: true,
    tags: ['고움', '순함', '부드러움'],
    radical: '女部'
  },
  {
    character: '瑛',
    korean: '영',
    meaning: '옥의 빛',
    strokes: 12,
    ohang: '목',
    gender: ['FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['빛', '보석', '밝음'],
    radical: '玉部'
  },
  {
    character: '瑜',
    korean: '유',
    meaning: '아름다운 옥',
    strokes: 13,
    ohang: '금',
    gender: ['FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['옥', '보석', '아름다움'],
    radical: '玉部'
  },
  {
    character: '瑤',
    korean: '요',
    meaning: '아름다운 옥',
    strokes: 14,
    ohang: '화',
    gender: ['FEMALE'],
    positive: true,
    tags: ['옥', '보석', '귀함'],
    radical: '玉部'
  },
  {
    character: '琳',
    korean: '림',
    meaning: '아름다운 옥',
    strokes: 12,
    ohang: '목',
    gender: ['FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['옥', '보석', '아름다움'],
    radical: '玉部'
  },
  {
    character: '琪',
    korean: '기',
    meaning: '아름다운 옥',
    strokes: 12,
    ohang: '목',
    gender: ['FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['옥', '보석', '귀함'],
    radical: '玉部'
  },
  {
    character: '珍',
    korean: '진',
    meaning: '보배, 귀하다',
    strokes: 9,
    ohang: '화',
    gender: ['FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['보배', '귀함', '진귀'],
    radical: '玉部'
  },
  {
    character: '寶',
    korean: '보',
    meaning: '보배',
    strokes: 20,
    ohang: '화',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['보배', '귀함', '소중'],
    radical: '宀部'
  },
  {
    character: '光',
    korean: '광',
    meaning: '빛',
    strokes: 6,
    ohang: '화',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['빛', '밝음', '광채'],
    radical: '儿部'
  },
  {
    character: '明',
    korean: '명',
    meaning: '밝다',
    strokes: 8,
    ohang: '수',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['밝음', '총명', '빛'],
    radical: '日部'
  },
  {
    character: '輝',
    korean: '휘',
    meaning: '빛나다',
    strokes: 15,
    ohang: '수',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['빛남', '광채', '찬란'],
    radical: '光部'
  },
  {
    character: '燦',
    korean: '찬',
    meaning: '찬란하다',
    strokes: 17,
    ohang: '화',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['찬란', '빛남', '화려'],
    radical: '火部'
  },
  {
    character: '曜',
    korean: '요',
    meaning: '빛나다',
    strokes: 18,
    ohang: '화',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['빛남', '광채', '밝음'],
    radical: '日部'
  },
  {
    character: '晶',
    korean: '정',
    meaning: '맑다, 빛나다',
    strokes: 12,
    ohang: '화',
    gender: ['FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['맑음', '빛남', '투명'],
    radical: '日部'
  },
  {
    character: '瑩',
    korean: '영',
    meaning: '빛나다, 맑다',
    strokes: 15,
    ohang: '목',
    gender: ['FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['빛남', '맑음', '투명'],
    radical: '玉部'
  },
  {
    character: '澈',
    korean: '철',
    meaning: '맑다',
    strokes: 15,
    ohang: '수',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['맑음', '투명', '깨끗'],
    radical: '水部'
  },
  {
    character: '淸',
    korean: '청',
    meaning: '맑다',
    strokes: 11,
    ohang: '수',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['맑음', '깨끗', '청렴'],
    radical: '水部'
  },
  {
    character: '潔',
    korean: '결',
    meaning: '깨끗하다',
    strokes: 15,
    ohang: '수',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['깨끗', '청렴', '결백'],
    radical: '水部'
  },
  {
    character: '純',
    korean: '순',
    meaning: '순수하다',
    strokes: 10,
    ohang: '금',
    gender: ['FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['순수', '깨끗', '순결'],
    radical: '糸部'
  },

  // ============================================================================
  // 강인함, 용기 관련 (60자)
  // ============================================================================
  {
    character: '剛',
    korean: '강',
    meaning: '굳세다, 강하다',
    strokes: 10,
    ohang: '금',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['강함', '굳셈', '강인'],
    radical: '刀部'
  },
  {
    character: '健',
    korean: '건',
    meaning: '건강하다, 튼튼하다',
    strokes: 11,
    ohang: '목',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['건강', '튼튼', '강건'],
    radical: '人部'
  },
  {
    character: '壯',
    korean: '장',
    meaning: '씩씩하다, 장대하다',
    strokes: 7,
    ohang: '금',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['씩씩', '장대', '웅장'],
    radical: '士部'
  },
  {
    character: '勇',
    korean: '용',
    meaning: '용감하다',
    strokes: 9,
    ohang: '토',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['용감', '용기', '씩씩'],
    radical: '力部'
  },
  {
    character: '武',
    korean: '무',
    meaning: '무예, 용맹',
    strokes: 8,
    ohang: '수',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['무예', '용맹', '강함'],
    radical: '止部'
  },
  {
    character: '雄',
    korean: '웅',
    meaning: '수컷, 웅장하다',
    strokes: 12,
    ohang: '수',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['웅장', '남성', '크다'],
    radical: '隹部'
  },
  {
    character: '豪',
    korean: '호',
    meaning: '호걸, 뛰어나다',
    strokes: 14,
    ohang: '수',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['호걸', '뛰어남', '호방'],
    radical: '豕部'
  },
  {
    character: '傑',
    korean: '걸',
    meaning: '뛰어나다, 걸출하다',
    strokes: 12,
    ohang: '목',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['뛰어남', '걸출', '영웅'],
    radical: '人部'
  },
  {
    character: '龍',
    korean: '용',
    meaning: '용',
    strokes: 16,
    ohang: '화',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['용', '권위', '힘'],
    radical: '龍部'
  },
  {
    character: '虎',
    korean: '호',
    meaning: '호랑이',
    strokes: 8,
    ohang: '수',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['호랑이', '용맹', '위엄'],
    radical: '虍部'
  },
  {
    character: '鳳',
    korean: '봉',
    meaning: '봉황',
    strokes: 14,
    ohang: '수',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['봉황', '고귀', '상서'],
    radical: '鳥部'
  },
  {
    character: '鶴',
    korean: '학',
    meaning: '학',
    strokes: 21,
    ohang: '수',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['학', '장수', '고결'],
    radical: '鳥部'
  },
  {
    character: '鷹',
    korean: '응',
    meaning: '매',
    strokes: 24,
    ohang: '목',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['매', '용맹', '날카로움'],
    radical: '鳥部'
  },
  {
    character: '威',
    korean: '위',
    meaning: '위엄',
    strokes: 9,
    ohang: '토',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['위엄', '권위', '엄숙'],
    radical: '女部'
  },
  {
    character: '猛',
    korean: '맹',
    meaning: '사납다, 용맹하다',
    strokes: 11,
    ohang: '수',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['용맹', '사나움', '강함'],
    radical: '犬部'
  },
  {
    character: '烈',
    korean: '열',
    meaning: '세차다, 열렬하다',
    strokes: 10,
    ohang: '화',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['열렬', '세참', '강렬'],
    radical: '火部'
  },
  {
    character: '赫',
    korean: '혁',
    meaning: '빛나다, 밝다',
    strokes: 14,
    ohang: '목',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['빛남', '명성', '위엄'],
    radical: '赤部'
  },
  {
    character: '奎',
    korean: '규',
    meaning: '별자리, 문장',
    strokes: 9,
    ohang: '목',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['별', '문장', '학문'],
    radical: '大部'
  },
  {
    character: '煥',
    korean: '환',
    meaning: '빛나다',
    strokes: 13,
    ohang: '화',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['빛남', '환하다', '광채'],
    radical: '火部'
  },
  {
    character: '赫',
    korean: '혁',
    meaning: '빛나다',
    strokes: 14,
    ohang: '목',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['빛남', '위엄', '명성'],
    radical: '赤部'
  },

  // ============================================================================
  // 번영, 성공 관련 (60자)
  // ============================================================================
  {
    character: '榮',
    korean: '영',
    meaning: '영화롭다',
    strokes: 14,
    ohang: '목',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['영광', '번영', '영화'],
    radical: '木部'
  },
  {
    character: '華',
    korean: '화',
    meaning: '빛나다, 화려하다',
    strokes: 10,
    ohang: '수',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['화려', '빛남', '번영'],
    radical: '艸部'
  },
  {
    character: '盛',
    korean: '성',
    meaning: '성하다, 번성하다',
    strokes: 11,
    ohang: '금',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['번성', '성함', '번영'],
    radical: '皿部'
  },
  {
    character: '昌',
    korean: '창',
    meaning: '번창하다',
    strokes: 8,
    ohang: '금',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['번창', '번영', '창성'],
    radical: '日部'
  },
  {
    character: '隆',
    korean: '륭',
    meaning: '융성하다, 높다',
    strokes: 11,
    ohang: '화',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['융성', '높음', '번창'],
    radical: '阜部'
  },
  {
    character: '興',
    korean: '흥',
    meaning: '일어나다, 흥하다',
    strokes: 16,
    ohang: '수',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['흥함', '번영', '일어남'],
    radical: '臼部'
  },
  {
    character: '旺',
    korean: '왕',
    meaning: '왕성하다',
    strokes: 8,
    ohang: '토',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['왕성', '번창', '강함'],
    radical: '日部'
  },
  {
    character: '泰',
    korean: '태',
    meaning: '크다, 평안하다',
    strokes: 10,
    ohang: '화',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['평안', '크다', '태평'],
    radical: '水部'
  },
  {
    character: '安',
    korean: '안',
    meaning: '편안하다',
    strokes: 6,
    ohang: '토',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['평안', '안정', '편안'],
    radical: '宀部'
  },
  {
    character: '寧',
    korean: '녕',
    meaning: '편안하다',
    strokes: 14,
    ohang: '화',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['평안', '편안', '안정'],
    radical: '宀部'
  },
  {
    character: '康',
    korean: '강',
    meaning: '편안하다, 건강하다',
    strokes: 11,
    ohang: '목',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['건강', '평안', '안녕'],
    radical: '广部'
  },
  {
    character: '福',
    korean: '복',
    meaning: '복',
    strokes: 13,
    ohang: '수',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['복', '행복', '행운'],
    radical: '示部'
  },
  {
    character: '祿',
    korean: '록',
    meaning: '녹, 복',
    strokes: 12,
    ohang: '화',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['녹', '복', '봉급'],
    radical: '示部'
  },
  {
    character: '壽',
    korean: '수',
    meaning: '장수',
    strokes: 14,
    ohang: '금',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['장수', '오래삶', '수명'],
    radical: '寸部'
  },
  {
    character: '喜',
    korean: '희',
    meaning: '기쁘다',
    strokes: 12,
    ohang: '수',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['기쁨', '즐거움', '축하'],
    radical: '口部'
  },
  {
    character: '悅',
    korean: '열',
    meaning: '기쁘다',
    strokes: 10,
    ohang: '금',
    gender: ['FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['기쁨', '즐거움', '유쾌'],
    radical: '心部'
  },
  {
    character: '樂',
    korean: '락',
    meaning: '즐겁다',
    strokes: 15,
    ohang: '화',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['즐거움', '음악', '즐김'],
    radical: '木部'
  },
  {
    character: '歡',
    korean: '환',
    meaning: '기쁘다, 즐겁다',
    strokes: 22,
    ohang: '수',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['환희', '즐거움', '기쁨'],
    radical: '欠部'
  },
  {
    character: '怡',
    korean: '이',
    meaning: '기쁘다, 화목하다',
    strokes: 8,
    ohang: '토',
    gender: ['FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['기쁨', '화목', '평화'],
    radical: '心部'
  },
  {
    character: '祥',
    korean: '상',
    meaning: '상서롭다',
    strokes: 10,
    ohang: '금',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['상서', '길조', '복'],
    radical: '示部'
  },
  {
    character: '瑞',
    korean: '서',
    meaning: '상서롭다',
    strokes: 13,
    ohang: '금',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['상서', '길조', '옥'],
    radical: '玉部'
  },
  {
    character: '吉',
    korean: '길',
    meaning: '길하다',
    strokes: 6,
    ohang: '목',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['길함', '좋음', '행운'],
    radical: '口部'
  },
  {
    character: '祺',
    korean: '기',
    meaning: '길하다',
    strokes: 12,
    ohang: '목',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['길함', '복', '상서'],
    radical: '示部'
  },
  {
    character: '禎',
    korean: '정',
    meaning: '길하다',
    strokes: 13,
    ohang: '화',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['길함', '복', '정조'],
    radical: '示部'
  },
  {
    character: '慶',
    korean: '경',
    meaning: '경사',
    strokes: 15,
    ohang: '목',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['경사', '축하', '기쁨'],
    radical: '心部'
  },
  {
    character: '嘉',
    korean: '가',
    meaning: '아름답다, 좋다',
    strokes: 14,
    ohang: '목',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['좋음', '아름다움', '찬양'],
    radical: '口部'
  },
  {
    character: '佳',
    korean: '가',
    meaning: '아름답다',
    strokes: 8,
    ohang: '목',
    gender: ['FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['아름다움', '좋음', '뛰어남'],
    radical: '人部'
  },
  {
    character: '優',
    korean: '우',
    meaning: '뛰어나다, 우수하다',
    strokes: 17,
    ohang: '토',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['우수', '뛰어남', '우아'],
    radical: '人部'
  },
  {
    character: '秀',
    korean: '수',
    meaning: '뛰어나다',
    strokes: 7,
    ohang: '금',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['뛰어남', '수려', '아름다움'],
    radical: '禾部'
  },
  {
    character: '卓',
    korean: '탁',
    meaning: '뛰어나다',
    strokes: 8,
    ohang: '화',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['뛰어남', '탁월', '높음'],
    radical: '十部'
  },

  // ============================================================================
  // 기타 긍정적 의미 (100자)
  // ============================================================================
  {
    character: '永',
    korean: '영',
    meaning: '길다, 영원하다',
    strokes: 5,
    ohang: '토',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['영원', '길다', '오래'],
    radical: '水部'
  },
  {
    character: '恒',
    korean: '항',
    meaning: '항상, 영원하다',
    strokes: 9,
    ohang: '수',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['항상', '영원', '변치않음'],
    radical: '心部'
  },
  {
    character: '久',
    korean: '구',
    meaning: '오래다',
    strokes: 3,
    ohang: '목',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['오래', '영구', '지속'],
    radical: '丿部'
  },
  {
    character: '遠',
    korean: '원',
    meaning: '멀다',
    strokes: 13,
    ohang: '토',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['멀다', '원대', '포부'],
    radical: '辵部'
  },
  {
    character: '志',
    korean: '지',
    meaning: '뜻',
    strokes: 7,
    ohang: '화',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['뜻', '의지', '목표'],
    radical: '心部'
  },
  {
    character: '意',
    korean: '의',
    meaning: '뜻',
    strokes: 13,
    ohang: '토',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['뜻', '의미', '의지'],
    radical: '心部'
  },
  {
    character: '願',
    korean: '원',
    meaning: '바라다',
    strokes: 19,
    ohang: '목',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['바람', '소원', '원함'],
    radical: '頁部'
  },
  {
    character: '希',
    korean: '희',
    meaning: '바라다',
    strokes: 7,
    ohang: '수',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['희망', '바람', '드묾'],
    radical: '巾部'
  },
  {
    character: '望',
    korean: '망',
    meaning: '바라다',
    strokes: 11,
    ohang: '수',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['바람', '희망', '명망'],
    radical: '月部'
  },
  {
    character: '夢',
    korean: '몽',
    meaning: '꿈',
    strokes: 14,
    ohang: '목',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['꿈', '희망', '이상'],
    radical: '夕部'
  },
  {
    character: '理',
    korean: '리',
    meaning: '다스리다, 이치',
    strokes: 11,
    ohang: '화',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['이치', '원리', '다스림'],
    radical: '玉部'
  },
  {
    character: '眞',
    korean: '진',
    meaning: '참',
    strokes: 10,
    ohang: '금',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['참', '진실', '진리'],
    radical: '目部'
  },
  {
    character: '貞',
    korean: '정',
    meaning: '바르다, 곧다',
    strokes: 9,
    ohang: '화',
    gender: ['FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['정절', '바름', '곧음'],
    radical: '貝部'
  },
  {
    character: '潤',
    korean: '윤',
    meaning: '윤택하다',
    strokes: 15,
    ohang: '수',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['윤택', '촉촉', '은혜'],
    radical: '水部'
  },
  {
    character: '澤',
    korean: '택',
    meaning: '못, 은혜',
    strokes: 16,
    ohang: '수',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['은혜', '윤택', '못'],
    radical: '水部'
  },
  {
    character: '恩',
    korean: '은',
    meaning: '은혜',
    strokes: 10,
    ohang: '토',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['은혜', '사랑', '배려'],
    radical: '心部'
  },
  {
    character: '澄',
    korean: '징',
    meaning: '맑다',
    strokes: 15,
    ohang: '수',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['맑음', '청명', '투명'],
    radical: '水部'
  },
  {
    character: '晏',
    korean: '안',
    meaning: '늦다, 맑다',
    strokes: 10,
    ohang: '토',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['맑음', '평온', '고요'],
    radical: '日部'
  },
  {
    character: '靜',
    korean: '정',
    meaning: '고요하다',
    strokes: 14,
    ohang: '금',
    gender: ['FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['고요', '평온', '조용'],
    radical: '靑部'
  },
  {
    character: '溫',
    korean: '온',
    meaning: '따뜻하다',
    strokes: 12,
    ohang: '토',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['따뜻', '온화', '온정'],
    radical: '水部'
  },
  {
    character: '柔',
    korean: '유',
    meaning: '부드럽다',
    strokes: 9,
    ohang: '금',
    gender: ['FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['부드러움', '유연', '온화'],
    radical: '木部'
  },
  {
    character: '剛',
    korean: '강',
    meaning: '강하다',
    strokes: 10,
    ohang: '금',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['강함', '굳셈', '단단'],
    radical: '刀部'
  },
  {
    character: '弘',
    korean: '홍',
    meaning: '넓다, 크다',
    strokes: 5,
    ohang: '수',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['넓음', '크다', '홍보'],
    radical: '弓部'
  },
  {
    character: '洪',
    korean: '홍',
    meaning: '큰 물, 넓다',
    strokes: 9,
    ohang: '수',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['넓음', '큰물', '크다'],
    radical: '水部'
  },
  {
    character: '大',
    korean: '대',
    meaning: '크다',
    strokes: 3,
    ohang: '화',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['크다', '위대', '거대'],
    radical: '大部'
  },
  {
    character: '高',
    korean: '고',
    meaning: '높다',
    strokes: 10,
    ohang: '목',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['높음', '고상', '고귀'],
    radical: '高部'
  },
  {
    character: '翔',
    korean: '상',
    meaning: '날다',
    strokes: 12,
    ohang: '토',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['날다', '비상', '자유'],
    radical: '羽部'
  },
  {
    character: '飛',
    korean: '비',
    meaning: '날다',
    strokes: 9,
    ohang: '수',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['날다', '비상', '빠름'],
    radical: '飛部'
  },
  {
    character: '翰',
    korean: '한',
    meaning: '깃, 글',
    strokes: 16,
    ohang: '수',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['깃', '글', '문장'],
    radical: '羽部'
  },
  {
    character: '彩',
    korean: '채',
    meaning: '채색, 빛',
    strokes: 11,
    ohang: '금',
    gender: ['FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['채색', '빛깔', '아름다움'],
    radical: '彡部'
  },
  {
    character: '絃',
    korean: '현',
    meaning: '줄',
    strokes: 11,
    ohang: '수',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['현', '음악', '조화'],
    radical: '糸部'
  },
  {
    character: '律',
    korean: '률',
    meaning: '법칙',
    strokes: 9,
    ohang: '화',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['법칙', '질서', '음률'],
    radical: '彳部'
  },
  {
    character: '範',
    korean: '범',
    meaning: '법, 모범',
    strokes: 15,
    ohang: '수',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['모범', '법칙', '규범'],
    radical: '竹部'
  },
  {
    character: '模',
    korean: '모',
    meaning: '본보기',
    strokes: 14,
    ohang: '목',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['모범', '본보기', '모형'],
    radical: '木部'
  },
  {
    character: '典',
    korean: '전',
    meaning: '법전',
    strokes: 8,
    ohang: '화',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['법전', '경전', '규칙'],
    radical: '八部'
  },
  {
    character: '道',
    korean: '도',
    meaning: '길, 도',
    strokes: 12,
    ohang: '화',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['길', '도', '진리'],
    radical: '辵部'
  },
  {
    character: '達',
    korean: '달',
    meaning: '통달하다',
    strokes: 12,
    ohang: '화',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['통달', '도달', '발달'],
    radical: '辵部'
  },
  {
    character: '進',
    korean: '진',
    meaning: '나아가다',
    strokes: 11,
    ohang: '화',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['나아감', '진보', '발전'],
    radical: '辵部'
  },
  {
    character: '昇',
    korean: '승',
    meaning: '오르다',
    strokes: 8,
    ohang: '금',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['오름', '승진', '상승'],
    radical: '日部'
  },
  {
    character: '登',
    korean: '등',
    meaning: '오르다',
    strokes: 12,
    ohang: '화',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['오름', '등반', '등극'],
    radical: '癶部'
  },
  {
    character: '晋',
    korean: '진',
    meaning: '나아가다',
    strokes: 10,
    ohang: '화',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['나아감', '진출', '발전'],
    radical: '日部'
  },
  {
    character: '成',
    korean: '성',
    meaning: '이루다',
    strokes: 6,
    ohang: '금',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['성취', '이룸', '완성'],
    radical: '戈部'
  },
  {
    character: '就',
    korean: '취',
    meaning: '이루다, 나아가다',
    strokes: 12,
    ohang: '금',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['성취', '취직', '이룸'],
    radical: '尢部'
  },
  {
    character: '建',
    korean: '건',
    meaning: '세우다',
    strokes: 8,
    ohang: '목',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['세움', '건설', '창건'],
    radical: '廴部'
  },
  {
    character: '立',
    korean: '립',
    meaning: '서다, 세우다',
    strokes: 5,
    ohang: '화',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['세움', '독립', '확립'],
    radical: '立部'
  },
  {
    character: '創',
    korean: '창',
    meaning: '창조하다',
    strokes: 12,
    ohang: '금',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['창조', '창작', '새로움'],
    radical: '刀部'
  },
  {
    character: '新',
    korean: '신',
    meaning: '새롭다',
    strokes: 13,
    ohang: '금',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['새로움', '혁신', '신선'],
    radical: '斤部'
  },
  {
    character: '章',
    korean: '장',
    meaning: '글, 문장',
    strokes: 11,
    ohang: '화',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['문장', '글', '인장'],
    radical: '立部'
  },
  {
    character: '煥',
    korean: '환',
    meaning: '빛나다',
    strokes: 13,
    ohang: '화',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['빛남', '환하다', '찬란'],
    radical: '火部'
  },
  {
    character: '燁',
    korean: '엽',
    meaning: '빛나다',
    strokes: 16,
    ohang: '화',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['빛남', '화려', '빛'],
    radical: '火部'
  },
  {
    character: '炫',
    korean: '현',
    meaning: '빛나다',
    strokes: 9,
    ohang: '화',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['빛남', '현란', '화려'],
    radical: '火部'
  },
  {
    character: '烈',
    korean: '열',
    meaning: '세차다',
    strokes: 10,
    ohang: '화',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['열렬', '세참', '강렬'],
    radical: '火部'
  },
  {
    character: '炯',
    korean: '형',
    meaning: '밝다',
    strokes: 9,
    ohang: '화',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['밝음', '또렷', '빛남'],
    radical: '火部'
  },
  {
    character: '炳',
    korean: '병',
    meaning: '빛나다',
    strokes: 9,
    ohang: '화',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['빛남', '환하다', '밝음'],
    radical: '火部'
  },
  {
    character: '煜',
    korean: '욱',
    meaning: '빛나다',
    strokes: 13,
    ohang: '화',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['빛남', '밝음', '빛'],
    radical: '火部'
  },
  {
    character: '燦',
    korean: '찬',
    meaning: '찬란하다',
    strokes: 17,
    ohang: '화',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['찬란', '빛남', '화려'],
    radical: '火部'
  },
  {
    character: '熙',
    korean: '희',
    meaning: '빛나다, 밝다',
    strokes: 13,
    ohang: '수',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['빛남', '밝음', '화목'],
    radical: '火部'
  },
  {
    character: '昱',
    korean: '욱',
    meaning: '빛나다',
    strokes: 9,
    ohang: '화',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['빛남', '밝음', '햇빛'],
    radical: '日部'
  },
  {
    character: '晟',
    korean: '성',
    meaning: '밝다, 성하다',
    strokes: 10,
    ohang: '화',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['밝음', '성함', '빛남'],
    radical: '日部'
  },
  {
    character: '昊',
    korean: '호',
    meaning: '넓고 큰 하늘',
    strokes: 8,
    ohang: '화',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['하늘', '넓음', '광대'],
    radical: '日部'
  },
  {
    character: '昇',
    korean: '승',
    meaning: '오르다',
    strokes: 8,
    ohang: '금',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['오름', '상승', '발전'],
    radical: '日部'
  },
  {
    character: '旻',
    korean: '민',
    meaning: '가을 하늘',
    strokes: 8,
    ohang: '화',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['하늘', '가을', '높음'],
    radical: '日部'
  },
  {
    character: '晨',
    korean: '진',
    meaning: '새벽',
    strokes: 11,
    ohang: '금',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['새벽', '아침', '시작'],
    radical: '日部'
  },
  {
    character: '昕',
    korean: '흔',
    meaning: '새벽 햇빛',
    strokes: 8,
    ohang: '화',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['새벽', '햇빛', '밝음'],
    radical: '日部'
  },
  {
    character: '曦',
    korean: '희',
    meaning: '햇빛',
    strokes: 20,
    ohang: '화',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['햇빛', '아침빛', '밝음'],
    radical: '日部'
  },
  {
    character: '暎',
    korean: '영',
    meaning: '비치다',
    strokes: 13,
    ohang: '화',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['비침', '빛', '반영'],
    radical: '日部'
  },
  {
    character: '皓',
    korean: '호',
    meaning: '희다, 밝다',
    strokes: 12,
    ohang: '목',
    gender: ['MALE', 'NEUTRAL'],
    positive: true,
    tags: ['흰빛', '밝음', '깨끗'],
    radical: '白部'
  },
  {
    character: '皎',
    korean: '교',
    meaning: '희다, 밝다',
    strokes: 11,
    ohang: '목',
    gender: ['MALE', 'FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['흰빛', '밝음', '달빛'],
    radical: '白部'
  },
  {
    character: '皙',
    korean: '석',
    meaning: '희다',
    strokes: 13,
    ohang: '금',
    gender: ['FEMALE', 'NEUTRAL'],
    positive: true,
    tags: ['흰빛', '깨끗', '희다'],
    radical: '白部'
  },
]

/**
 * 한자를 한글 음으로 검색
 */
export function findHanjaByKorean(korean: string): HanjaData[] {
  return COMMON_HANJA.filter(h => h.korean === korean)
}

/**
 * 한자를 오행으로 검색
 */
export function findHanjaByOhang(ohang: '목' | '화' | '토' | '금' | '수'): HanjaData[] {
  return COMMON_HANJA.filter(h => h.ohang === ohang)
}

/**
 * 한자를 획수로 검색
 */
export function findHanjaByStrokes(strokes: number): HanjaData[] {
  return COMMON_HANJA.filter(h => h.strokes === strokes)
}

/**
 * 한자를 성별로 검색
 */
export function findHanjaByGender(gender: 'MALE' | 'FEMALE' | 'NEUTRAL'): HanjaData[] {
  return COMMON_HANJA.filter(h => h.gender.includes(gender))
}

/**
 * 한자를 태그로 검색
 */
export function findHanjaByTag(tag: string): HanjaData[] {
  return COMMON_HANJA.filter(h => h.tags.includes(tag))
}

/**
 * 긍정적 의미의 한자만 필터링
 */
export function getPositiveHanja(): HanjaData[] {
  return COMMON_HANJA.filter(h => h.positive)
}

/**
 * 여러 조건으로 한자 검색
 */
export interface HanjaSearchOptions {
  korean?: string
  ohang?: '목' | '화' | '토' | '금' | '수'
  strokesMin?: number
  strokesMax?: number
  gender?: 'MALE' | 'FEMALE' | 'NEUTRAL'
  positiveOnly?: boolean
  tags?: string[]
}

export function searchHanja(options: HanjaSearchOptions): HanjaData[] {
  let results = COMMON_HANJA

  if (options.korean) {
    results = results.filter(h => h.korean === options.korean)
  }

  if (options.ohang) {
    results = results.filter(h => h.ohang === options.ohang)
  }

  if (options.strokesMin !== undefined) {
    results = results.filter(h => h.strokes >= options.strokesMin!)
  }

  if (options.strokesMax !== undefined) {
    results = results.filter(h => h.strokes <= options.strokesMax!)
  }

  if (options.gender) {
    results = results.filter(h => h.gender.includes(options.gender!))
  }

  if (options.positiveOnly) {
    results = results.filter(h => h.positive)
  }

  if (options.tags && options.tags.length > 0) {
    results = results.filter(h =>
      options.tags!.some(tag => h.tags.includes(tag))
    )
  }

  return results
}
