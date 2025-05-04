// 서버 컴포넌트
import { getUpcomingSchedules } from '../sanity/lib/client';
import HomeClient from '../components/HomeClient';

// 일정 타입 정의 (여기에서 export하여 HomeClient에서 임포트할 수 있게 함)
export type Schedule = {
  _id: string;
  title: string;
  date: string;
  location: string;
  startTime?: string;
  endTime?: string;
};

// 서버 컴포넌트에서 데이터 가져오기
export default async function Home() {
  // Sanity에서 일정 데이터 가져오기 (최대 3개)
  const schedules = await getUpcomingSchedules();
  
  // 클라이언트 컴포넌트에 데이터 전달
  return <HomeClient schedules={schedules} />;
} 