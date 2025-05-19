import { client, previewClient } from '../lib/sanity';
import EventsClient from './EventsClient';

// 메타데이터 추가
export const metadata = {
  title: '권영국 후보 일정 | 민주노동당',
  description: '사회대개혁을 향한 권영국 후보의 선거 캠페인 일정을 확인하세요.',
};

// 타입 정의
type Event = {
  _id: string;
  title: string;
  description?: string;
  start: string;
  end?: string;
  location: string;
  isImportant?: boolean;
  category?: 'candidate' | 'election' | 'media';
};

export default async function EventsPage() {
  // 서버에서 데이터 가져오기
  // 이전 데이터와 새 데이터 형식 모두 지원
  const events = await client.fetch<Event[]>(
    `*[_type == "event"] {
      _id,
      title,
      description,
      "start": coalesce(startDateTime, start),
      "end": coalesce(endDateTime, end),
      location,
      isImportant,
      category
    } | order(start desc)`,
    {}, // params (현재는 빈 객체)
    { cache: 'no-store' } // 캐시 비활성화로 항상 최신 데이터를 가져옴
  );

  // 디버깅용 로그
  console.log('Fetched events:', events.length, 'items');
  
  // 만약 카테고리가 없는 이벤트가 있다면 기본값 설정
  const eventsWithDefaultCategory = events.map(event => {
    if (!event.category) {
      return {
        ...event,
        category: 'candidate' as const // 구체적인 타입으로 지정
      };
    }
    return event;
  });

  console.log('Events with default category:', eventsWithDefaultCategory.length, 'items');

  return (
    <>
      <EventsClient events={eventsWithDefaultCategory} />
    </>
  );
}