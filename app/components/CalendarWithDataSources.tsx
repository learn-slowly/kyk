'use client';

import { useState, useEffect } from 'react';
import { CalendarEvent } from './CustomCalendar';
import DataSourceSelector from './DataSourceSelector';
import CustomCalendar from './CustomCalendar';

type DataSource = 'all' | 'sanity' | 'google';

interface CalendarWithDataSourcesProps {
  sanityEvents: CalendarEvent[];
}

export default function CalendarWithDataSources({ sanityEvents }: CalendarWithDataSourcesProps) {
  const [dataSource, setDataSource] = useState<DataSource>('sanity');
  const [googleEvents, setGoogleEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 구글 캘린더 데이터 로드
  useEffect(() => {
    async function loadGoogleEvents() {
      try {
        setIsLoading(true);
        setError(null);
        
        // 서버 액션 직접 호출 대신 API 라우트 사용
        const response = await fetch('/api/calendar');
        if (!response.ok) {
          throw new Error('Failed to fetch calendar data');
        }
        
        const events = await response.json();
        setGoogleEvents(events);
      } catch (err) {
        console.error('Error loading Google Calendar events:', err);
        setError('구글 캘린더 이벤트를 불러오는 중 오류가 발생했습니다. 관리자에게 문의해주세요.');
      } finally {
        setIsLoading(false);
      }
    }

    if (dataSource === 'all' || dataSource === 'google') {
      loadGoogleEvents();
    }
  }, [dataSource]);

  // 데이터 소스에 따른 표시할 이벤트 필터링
  const eventsToDisplay = (() => {
    switch (dataSource) {
      case 'sanity':
      case 'all':
      default:
        return sanityEvents;
      case 'google':
        return googleEvents;
    }
  })();

  // 데이터 소스 변경 핸들러
  const handleSourceChange = (source: DataSource) => {
    if (source === 'all') {
      setDataSource('sanity');
    } else {
      setDataSource(source);
    }
  };

  return (
    <div>
      <div className="flex justify-center mb-6">
        <DataSourceSelector
          currentSource={dataSource}
          onChange={handleSourceChange}
        />
      </div>
      
      {isLoading && (
        <div className="text-center p-4">
          <p className="text-gray-500">구글 캘린더 데이터를 불러오는 중...</p>
        </div>
      )}
      
      {error && (
        <div className="text-center p-4 mb-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
          <p className="text-gray-600 mt-2">현재 구글 캘린더 연동 기능이 임시로 비활성화되었습니다. 관리자가 인증 설정을 진행 중입니다.</p>
        </div>
      )}
      
      <CustomCalendar
        events={eventsToDisplay}
        onSelectEvent={(event) => console.log('선택된 이벤트:', event)}
      />
    </div>
  );
} 