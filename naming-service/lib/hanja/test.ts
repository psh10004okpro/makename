/**
 * 한자 분석 시스템 테스트
 *
 * 한자 데이터, 획수 분석, 오격 분석, 조합 평가 등을 테스트합니다.
 * 실행 방법: npm run test:hanja
 */

import { HanjaAnalyzer } from './analyzer'
import { findHanjaByKorean, searchHanja } from './data'
import { getStrokeInfo } from './strokes'

/**
 * 테스트 실행 함수
 */
async function runTests() {
  console.log('🧪 한자 분석 시스템 테스트 시작\n')
  console.log('='.repeat(60))

  const analyzer = new HanjaAnalyzer()

  // ============================================================================
  // 테스트 1: 한자 데이터 검색
  // ============================================================================
  console.log('\n📚 테스트 1: 한자 데이터 검색')
  console.log('-'.repeat(60))

  const jiHanjas = findHanjaByKorean('지')
  console.log(`\n"지" 음을 가진 한자: ${jiHanjas.length}개`)
  jiHanjas.slice(0, 5).forEach(h => {
    console.log(`  ${h.character}(${h.korean}): ${h.meaning} [${h.strokes}획, ${h.ohang}]`)
  })

  const fireHanjas = searchHanja({
    ohang: '화',
    gender: 'FEMALE',
    positiveOnly: true,
    strokesMin: 10,
    strokesMax: 15,
  })
  console.log(`\n화(火) 오행, 여성용, 10-15획 한자: ${fireHanjas.length}개`)
  fireHanjas.slice(0, 5).forEach(h => {
    console.log(`  ${h.character}(${h.korean}): ${h.meaning} [${h.strokes}획]`)
  })

  // ============================================================================
  // 테스트 2: 획수 길흉 분석 (81수리)
  // ============================================================================
  console.log('\n\n🎲 테스트 2: 획수 길흉 분석 (81수리)')
  console.log('-'.repeat(60))

  const testStrokes = [1, 13, 23, 33, 81]
  testStrokes.forEach(strokes => {
    const result = analyzer.calculateStrokeLuck(strokes)
    console.log(`\n${strokes}획: ${result.info.luck} (${result.score}점)`)
    console.log(`  의미: ${result.info.meaning}`)
    console.log(`  설명: ${result.info.description.substring(0, 50)}...`)
  })

  // ============================================================================
  // 테스트 3: 오격 분석
  // ============================================================================
  console.log('\n\n🔮 테스트 3: 오격 분석')
  console.log('-'.repeat(60))

  // 예시: 김지혜 (金智慧)
  const familyNameStrokes = HanjaAnalyzer.getFamilyNameStrokes('김') // [8]
  const givenNameStrokes = [12, 15] // 智(12획) + 慧(15획)

  console.log('\n이름: 김지혜 (金智慧)')
  console.log(`성씨 획수: ${familyNameStrokes.join('+')}`)
  console.log(`이름 획수: ${givenNameStrokes.join('+')}`)

  const ogyeok = analyzer.analyzeOgyeok(familyNameStrokes, givenNameStrokes)

  console.log(`\n[오격 분석 결과]`)
  console.log(`천격(天格): ${ogyeok.cheongyeok.strokes}획 - ${ogyeok.cheongyeok.info.luck} (${ogyeok.cheongyeok.score}점)`)
  console.log(`  ${ogyeok.cheongyeok.info.meaning}`)
  console.log(`인격(人格): ${ogyeok.ingyeok.strokes}획 - ${ogyeok.ingyeok.info.luck} (${ogyeok.ingyeok.score}점)`)
  console.log(`  ${ogyeok.ingyeok.info.meaning}`)
  console.log(`지격(地格): ${ogyeok.jigyeok.strokes}획 - ${ogyeok.jigyeok.info.luck} (${ogyeok.jigyeok.score}점)`)
  console.log(`  ${ogyeok.jigyeok.info.meaning}`)
  console.log(`외격(外格): ${ogyeok.oegyeok.strokes}획 - ${ogyeok.oegyeok.info.luck} (${ogyeok.oegyeok.score}점)`)
  console.log(`  ${ogyeok.oegyeok.info.meaning}`)
  console.log(`총격(總格): ${ogyeok.chonggyeok.strokes}획 - ${ogyeok.chonggyeok.info.luck} (${ogyeok.chonggyeok.score}점)`)
  console.log(`  ${ogyeok.chonggyeok.info.meaning}`)
  console.log(`\n종합 평가: ${ogyeok.grade} (${ogyeok.averageScore.toFixed(1)}점)`)

  // ============================================================================
  // 테스트 4: 한자 조합 종합 평가
  // ============================================================================
  console.log('\n\n⭐ 테스트 4: 한자 조합 종합 평가')
  console.log('-'.repeat(60))

  // 추천 오행: 목(木), 수(水) - 사주에서 필요한 오행이라고 가정
  const recommendedOhang = ['목', '수'] as const

  // 테스트할 한자 조합 찾기
  const character1 = findHanjaByKorean('지').find(h => h.character === '智') // 智 (화)
  const character2 = findHanjaByKorean('혜').find(h => h.character === '慧') // 慧 (수)

  if (character1 && character2) {
    console.log(`\n조합 1: ${character1.character}${character2.character} (${character1.korean}${character2.korean})`)
    console.log(`  ${character1.character}: ${character1.meaning} [${character1.strokes}획, ${character1.ohang}]`)
    console.log(`  ${character2.character}: ${character2.meaning} [${character2.strokes}획, ${character2.ohang}]`)

    const evaluation1 = analyzer.evaluateCombination(
      '김',
      familyNameStrokes,
      [character1, character2],
      recommendedOhang
    )

    console.log(`\n[평가 결과]`)
    console.log(`총점: ${evaluation1.total}점 (${evaluation1.grade})`)
    console.log(`  - 오행 조화: ${evaluation1.ohangHarmony}점/40점`)
    console.log(`  - 오격 점수: ${evaluation1.ogyeokScore}점/40점`)
    console.log(`  - 의미 적합성: ${evaluation1.meaningScore}점/20점`)
    console.log(`\n[상세 설명]`)
    evaluation1.details.forEach(detail => {
      console.log(`  ${detail}`)
    })
  }

  // 다른 조합도 테스트
  const character3 = findHanjaByKorean('서').find(h => h.character === '瑞') // 瑞 (금)
  const character4 = findHanjaByKorean('연').find(h => h.character === '淵') // 淵 (수)

  if (character3 && character4) {
    console.log(`\n\n조합 2: ${character3.character}${character4.character} (${character3.korean}${character4.korean})`)
    console.log(`  ${character3.character}: ${character3.meaning} [${character3.strokes}획, ${character3.ohang}]`)
    console.log(`  ${character4.character}: ${character4.meaning} [${character4.strokes}획, ${character4.ohang}]`)

    const evaluation2 = analyzer.evaluateCombination(
      '김',
      familyNameStrokes,
      [character3, character4],
      recommendedOhang
    )

    console.log(`\n[평가 결과]`)
    console.log(`총점: ${evaluation2.total}점 (${evaluation2.grade})`)
    console.log(`  - 오행 조화: ${evaluation2.ohangHarmony}점/40점`)
    console.log(`  - 오격 점수: ${evaluation2.ogyeokScore}점/40점`)
    console.log(`  - 의미 적합성: ${evaluation2.meaningScore}점/20점`)
  }

  // ============================================================================
  // 테스트 5: 복성 테스트
  // ============================================================================
  console.log('\n\n👥 테스트 5: 복성 테스트')
  console.log('-'.repeat(60))

  const namgungStrokes = HanjaAnalyzer.getFamilyNameStrokes('남궁') // [5, 10]
  console.log(`\n성씨: 남궁 (획수: ${namgungStrokes.join(' + ')})`)

  if (character1 && character2) {
    const ogyeok2 = analyzer.analyzeOgyeok(namgungStrokes, [character1.strokes, character2.strokes])
    console.log(`이름: ${character1.character}${character2.character}`)
    console.log(`종합 평가: ${ogyeok2.grade} (${ogyeok2.averageScore.toFixed(1)}점)`)
    console.log(`  인격: ${ogyeok2.ingyeok.strokes}획 (${ogyeok2.ingyeok.info.luck})`)
    console.log(`  지격: ${ogyeok2.jigyeok.strokes}획 (${ogyeok2.jigyeok.info.luck})`)
    console.log(`  총격: ${ogyeok2.chonggyeok.strokes}획 (${ogyeok2.chonggyeok.info.luck})`)
  }

  // ============================================================================
  // 테스트 완료
  // ============================================================================
  console.log('\n' + '='.repeat(60))
  console.log('✅ 모든 테스트 완료!\n')
}

/**
 * 메인 실행
 */
async function main() {
  try {
    await runTests()
  } catch (error) {
    console.error('❌ 테스트 실패:', error)
    process.exit(1)
  }
}

// 스크립트 직접 실행시
if (require.main === module) {
  main()
}

export { runTests }
