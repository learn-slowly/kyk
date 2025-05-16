// 서버 컴포넌트
import { getEvents } from './lib/sanity';
import HomeClient from '../components/HomeClient';

// 이벤트 타입 정의
type Event = {
  _id: string;
  title: string;
  description?: string;
  start: string;
  end?: string;
  location?: string;
  isImportant?: boolean;
  category?: string;
};

// 일정 타입 정의 (여기에서 export하여 HomeClient에서 임포트할 수 있게 함)
export type Schedule = {
  _id: string;
  title: string;
  date?: string;
  location: string;
  startTime?: string;
  endTime?: string;
  start?: string; // event 타입 호환을 위해 추가
  end?: string;   // event 타입 호환을 위해 추가
};

// 서버 컴포넌트에서 데이터 가져오기
export default async function Home() {
  // 클라이언트 컴포넌트 렌더링
  return <HomeClient />;
} 