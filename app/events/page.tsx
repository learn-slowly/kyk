import { client } from '../lib/sanity';
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
  description: string;
  start: string;
  end: string;
  location: string;
  isImportant: boolean;
};

export default async function EventsPage() {
  // 서버에서 데이터 가져오기
  const events = await client.fetch<Event[]>(
    `*[_type == "event"] | order(start asc)`
  );

  return (
    <>
      <EventsClient events={events} />
    </>
  );
}