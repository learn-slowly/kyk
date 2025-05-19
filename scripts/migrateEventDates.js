// 이벤트 데이터 마이그레이션 스크립트
// start/end 필드를 startDateTime/endDateTime 필드로 변환합니다.

// Sanity 클라이언트 설정
const { createClient } = require('@sanity/client');

// 환경변수 설정 (.env 파일 사용 시)
require('dotenv').config();

const client = createClient({
  projectId: 'qpvtzhxq', // 프로젝트 ID
  dataset: 'production',
  apiVersion: '2025-05-05',
  token: process.env.SANITY_API_TOKEN, // 토큰은 환경변수에서 가져옴
  useCdn: false
});

async function migrateEventDates() {
  try {
    // 이전 형식의 이벤트 데이터 쿼리
    const events = await client.fetch(`
      *[_type == "event" && defined(start) && !defined(startDateTime)] {
        _id,
        _rev,
        start,
        end
      }
    `);

    console.log(`Found ${events.length} events to migrate.`);

    // 각 이벤트에 대해 변환 수행
    for (const event of events) {
      console.log(`Migrating event: ${event._id}`);
      
      // 업데이트할 데이터
      const patch = {
        startDateTime: event.start,
        endDateTime: event.end || null
      };

      // Sanity 문서 패치
      await client
        .patch(event._id)
        .set(patch)
        .commit();

      console.log(`Successfully migrated event: ${event._id}`);
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// 스크립트 실행
migrateEventDates(); 