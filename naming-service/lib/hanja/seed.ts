/**
 * 한자 데이터베이스 시딩 스크립트
 *
 * Prisma 데이터베이스에 COMMON_HANJA 데이터를 삽입합니다.
 * 실행 방법: npm run seed
 */

import { PrismaClient } from '@prisma/client'
import { COMMON_HANJA } from './data'

// Lazy-loaded Prisma client
let prisma: PrismaClient | null = null
function getPrisma(): PrismaClient {
  if (!prisma) {
    prisma = new PrismaClient()
  }
  return prisma
}

/**
 * 한자 데이터베이스 시딩 메인 함수
 */
async function seedHanja() {
  console.log('🌱 한자 데이터 시딩 시작...\n')

  try {
    // 기존 데이터 삭제 여부 확인
    const db = getPrisma()
    const existingCount = await db.hanja.count()
    if (existingCount > 0) {
      console.log(`⚠️  기존 한자 데이터 ${existingCount}개 발견`)
      console.log('   기존 데이터를 모두 삭제하고 새로 추가합니다...\n')
      await db.hanja.deleteMany({})
      console.log('✅ 기존 데이터 삭제 완료\n')
    }

    // 한자 데이터 삽입
    console.log(`📝 ${COMMON_HANJA.length}개의 한자 데이터 삽입 중...`)

    let successCount = 0
    let errorCount = 0
    const errors: Array<{ character: string; error: string }> = []

    for (const hanja of COMMON_HANJA) {
      try {
        await db.hanja.create({
          data: {
            character: hanja.character,
            korean: hanja.korean,
            meaning: hanja.meaning,
            strokes: hanja.strokes,
            radical: hanja.radical,
            ohang: hanja.ohang,
            gender: hanja.gender,
            frequency: 0, // 초기 빈도는 0
            positive: hanja.positive,
            tags: hanja.tags,
          },
        })
        successCount++

        // 진행 상황 표시 (50개마다)
        if (successCount % 50 === 0) {
          console.log(`   ${successCount}개 완료...`)
        }
      } catch (error) {
        errorCount++
        errors.push({
          character: hanja.character,
          error: error instanceof Error ? error.message : String(error),
        })
      }
    }

    // 결과 출력
    console.log('\n' + '='.repeat(60))
    console.log('📊 시딩 결과')
    console.log('='.repeat(60))
    console.log(`✅ 성공: ${successCount}개`)
    console.log(`❌ 실패: ${errorCount}개`)
    console.log('='.repeat(60))

    // 에러가 있으면 상세 정보 출력
    if (errors.length > 0) {
      console.log('\n⚠️  에러 상세:')
      errors.forEach(({ character, error }) => {
        console.log(`   - ${character}: ${error}`)
      })
    }

    // 오행별 통계
    console.log('\n📈 오행별 한자 개수:')
    const ohangStats = await db.hanja.groupBy({
      by: ['ohang'],
      _count: {
        id: true,
      },
    })
    ohangStats.forEach(stat => {
      console.log(`   ${stat.ohang}: ${stat._count.id}개`)
    })

    // 성별별 통계 (배열 필드라 직접 계산)
    console.log('\n👥 성별별 사용 가능 한자:')
    const allHanja = await db.hanja.findMany({
      select: { gender: true },
    })
    const maleCount = allHanja.filter(h => h.gender.includes('MALE')).length
    const femaleCount = allHanja.filter(h => h.gender.includes('FEMALE')).length
    const neutralCount = allHanja.filter(h => h.gender.includes('NEUTRAL')).length
    console.log(`   남성(MALE): ${maleCount}개`)
    console.log(`   여성(FEMALE): ${femaleCount}개`)
    console.log(`   중성(NEUTRAL): ${neutralCount}개`)

    // 획수 범위
    const strokeStats = await db.hanja.aggregate({
      _min: { strokes: true },
      _max: { strokes: true },
      _avg: { strokes: true },
    })
    console.log('\n✏️  획수 통계:')
    console.log(`   최소: ${strokeStats._min.strokes}획`)
    console.log(`   최대: ${strokeStats._max.strokes}획`)
    console.log(`   평균: ${strokeStats._avg.strokes?.toFixed(1)}획`)

    // 긍정적 의미 한자 비율
    const positiveCount = await db.hanja.count({
      where: { positive: true },
    })
    const positiveRate = (positiveCount / successCount * 100).toFixed(1)
    console.log(`\n💚 긍정적 의미 한자: ${positiveCount}개 (${positiveRate}%)`)

    console.log('\n✨ 한자 데이터 시딩 완료!\n')
  } catch (error) {
    console.error('❌ 시딩 중 오류 발생:', error)
    throw error
  }
}

/**
 * 시딩 실행 및 정리
 */
async function main() {
  try {
    await seedHanja()
  } catch (error) {
    console.error('시딩 실패:', error)
    process.exit(1)
  } finally {
    if (prisma) {
      await prisma.$disconnect()
    }
  }
}

// 스크립트 직접 실행시
if (require.main === module) {
  main()
}

export { seedHanja }
