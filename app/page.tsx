import { Metadata } from 'next';
import HomeClient from '@/components/HomeClient';

// 메타데이터 정의
export const metadata: Metadata = {
  title: '권영국 후보 | 사회대전환 연대회의 대통령 후보',
  description: '권영국 후보 공식 홈페이지입니다. 사회대전환 연대회의 대통령 후보 권영국의 정책과 비전, 일정, 뉴스 등 다양한 정보를 제공합니다.',
  keywords: ['권영국', '대통령 후보', '공식 홈페이지', '민주노동당', '사회대전환', '2025 대선'],
  alternates: {
    canonical: 'https://www.xn--3e0b8b410h.com/',
  },
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
export default function Home() {
  // 클라이언트 컴포넌트 렌더링
  return <HomeClient />;
} 