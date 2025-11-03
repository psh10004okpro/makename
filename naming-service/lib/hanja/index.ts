/**
 * 한자 분석 시스템 통합 모듈
 *
 * 한자 데이터, 획수 분석, 한자 분석기를 통합하여 제공합니다.
 */

// 데이터
export {
  COMMON_HANJA,
  type HanjaData,
  type HanjaSearchOptions,
  findHanjaByKorean,
  findHanjaByOhang,
  findHanjaByStrokes,
  findHanjaByGender,
  findHanjaByTag,
  getPositiveHanja,
  searchHanja,
} from './data'

// 획수 (81수리)
export {
  STROKE_81,
  type StrokeInfo,
  type StrokeLuck,
  getStrokeInfo,
} from './strokes'

// 분석기
export {
  HanjaAnalyzer,
  type OgyeokAnalysis,
  type CombinationScore,
} from './analyzer'

import { HanjaAnalyzer as HanjaAnalyzerClass } from './analyzer'

// 시딩
export { seedHanja } from './seed'

/**
 * 간편 사용을 위한 기본 인스턴스
 */
export const hanjaAnalyzer = new HanjaAnalyzerClass()

/**
 * 전체 시스템 사용 예시
 *
 * @example
 * ```typescript
 * import { hanjaAnalyzer, HanjaAnalyzer } from '@/lib/hanja'
 *
 * // 1. 한자 검색
 * const candidates = await hanjaAnalyzer.findMatchingHanja({
 *   korean: '지',
 *   ohang: '화',
 *   gender: 'FEMALE',
 *   positiveOnly: true
 * })
 *
 * // 2. 획수 길흉 확인
 * const strokeLuck = hanjaAnalyzer.calculateStrokeLuck(23)
 * console.log(strokeLuck.info.meaning) // "진취적 기상, 성공운"
 *
 * // 3. 오격 분석
 * const ogyeok = hanjaAnalyzer.analyzeOgyeok(
 *   [8], // 김씨
 *   [12, 15] // 지혜
 * )
 * console.log(ogyeok.grade) // "A"
 *
 * // 4. 종합 평가
 * const evaluation = hanjaAnalyzer.evaluateCombination(
 *   '김',
 *   [8],
 *   candidates.slice(0, 2),
 *   ['목', '수'] // 추천 오행
 * )
 * console.log(evaluation.total) // 89
 * console.log(evaluation.grade) // "A"
 * ```
 */
