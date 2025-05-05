import { getUpcomingSchedules, getPastSchedules, getHighlightedSchedules } from '../lib/sanity'
import dynamic from 'next/dynamic'

// 클라이언트 컴포넌트를 동적으로 불러옵니다
const CalendarWithDataSources = dynamic(() => import('../components/CalendarWithDataSources'))

// Sanity 일정 데이터의 타입을 정의합니다
type SanitySchedule = {
  _id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  type: string;
  description?: string;
  isPast: boolean;
  isHighlighted: boolean;
  calendarEvent?: {
    start: string;
    end: string;
  };
}

export default async function SchedulePage() {
  // Sanity에서 일정 데이터 가져오기
  const upcomingSchedules: SanitySchedule[] = await getUpcomingSchedules()
  const pastSchedules: SanitySchedule[] = await getPastSchedules()
  const highlightedSchedules: SanitySchedule[] = await getHighlightedSchedules()

  // Sanity 일정 데이터를 캘린더 이벤트 형식으로 변환
  const sanityEvents = [...upcomingSchedules, ...pastSchedules].map(schedule => {
    const startDate = new Date(schedule.date);
    const [startHours, startMinutes] = schedule.startTime.split(':').map(Number);
    startDate.setHours(startHours, startMinutes);
    
    const endDate = new Date(schedule.date);
    const [endHours, endMinutes] = schedule.endTime.split(':').map(Number);
    endDate.setHours(endHours, endMinutes);
    
    return {
      id: schedule._id,
      title: schedule.title,
      start: startDate,
      end: endDate,
      location: schedule.location,
      description: schedule.description,
      type: schedule.type,
      isHighlighted: schedule.isHighlighted,
    }
  });

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">선거 캠페인 일정</h1>
        
        <div className="bg-white rounded-xl shadow-sm p-8 mb-10">
          <p className="text-xl text-center text-gray-700 mb-4">
            권영국 후보의 캠페인 및 유세 일정을 확인하세요.
          </p>
        </div>

        {/* 커스텀 캘린더 */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6 text-center">캠페인 일정 캘린더</h2>
          <p className="text-center text-gray-600 mb-6">아래 캘린더에서 모든 캠페인 일정을 확인할 수 있습니다.</p>
          
          <CalendarWithDataSources sanityEvents={sanityEvents} />
          
          <div className="mt-6 text-center">
            <a 
              href="https://calendar.google.com/calendar/u/0?cid=a3lrMjAyN0BnbWFpbC5jb20" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              내 구글 캘린더에 추가하기
            </a>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-6 text-center">주요 일정</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-6">다가오는 일정</h2>
            <div className="space-y-6">
              {upcomingSchedules.length > 0 ? (
                upcomingSchedules.map((schedule) => (
                  <ScheduleItem 
                    key={schedule._id}
                    title={schedule.title} 
                    date={formatDate(schedule.date)}
                    time={`${schedule.startTime} - ${schedule.endTime}`}
                    location={schedule.location}
                    type={getTypeLabel(schedule.type)}
                    calendarEvent={schedule.calendarEvent ? {
                      title: schedule.title,
                      start: schedule.calendarEvent.start,
                      end: schedule.calendarEvent.end,
                      location: schedule.location,
                      description: schedule.description || `${schedule.title} - ${schedule.location}`
                    } : undefined}
                  />
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">현재 예정된 일정이 없습니다.</p>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-6">주요 캠페인 일정</h2>
            <div className="space-y-4">
              {highlightedSchedules.length > 0 ? (
                highlightedSchedules.map((schedule) => (
                  <div key={schedule._id} className="mb-6 pb-6 border-b last:border-0">
                    <h3 className="text-xl font-semibold">{schedule.title}</h3>
                    <p className="text-gray-700 mb-2">{formatDate(schedule.date)}, {schedule.startTime}</p>
                    <p className="text-gray-700">{schedule.description || '설명이 없습니다.'}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">현재 주요 캠페인 일정이 없습니다.</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-8 mb-10">
          <h2 className="text-2xl font-bold mb-6">지난 일정</h2>
          <div className="space-y-6">
            {pastSchedules.length > 0 ? (
              pastSchedules.map((schedule) => (
                <ScheduleItem 
                  key={schedule._id}
                  title={schedule.title} 
                  date={formatDate(schedule.date)}
                  time={`${schedule.startTime} - ${schedule.endTime}`}
                  location={schedule.location}
                  type={getTypeLabel(schedule.type)}
                  isPast={true}
                />
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">지난 일정이 없습니다.</p>
            )}
          </div>
        </div>
        
        <div className="text-center mt-12">
          <a 
            href="https://calendar.google.com/calendar/render?action=TEMPLATE&dates=20250501%2F20250831&text=권영국%20후보%20캠페인%20일정&details=권영국%20후보의%20주요%20선거%20캠페인%20일정을%20구글%20캘린더에서%20확인하세요.&location=대한민국" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              background: 'linear-gradient(90deg, #FF0000 0%, #FFed00 50%, #00a366 100%)',
              color: 'white',
              padding: '0.75rem 2rem',
              borderRadius: '9999px',
              fontWeight: 'bold',
              fontSize: '1.125rem',
            }}
            className="hover:opacity-90"
          >
            전체 일정 구글 캘린더에서 보기
          </a>
        </div>
      </div>
    </main>
  )
}

// 날짜 포맷팅 함수
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

// 일정 유형에 따른 레이블 반환 함수
function getTypeLabel(type: string) {
  const typeMap: Record<string, string> = {
    'speech': '공개 연설',
    'policy': '정책 간담회',
    'youth': '청년 포럼',
    'announcement': '출마 선언',
    'policyAnnouncement': '정책 발표',
    'google': '구글 캘린더 일정',
    'other': '기타'
  };
  return typeMap[type] || '기타';
}

type CalendarEvent = {
  title: string;
  start: string;
  end: string;
  location: string;
  description: string;
}

function ScheduleItem({ 
  title, 
  date, 
  time, 
  location, 
  type, 
  isPast = false,
  calendarEvent
}: { 
  title: string; 
  date: string; 
  time: string;
  location: string;
  type: string;
  isPast?: boolean;
  calendarEvent?: CalendarEvent;
}) {
  // 구글 캘린더 링크 생성 함수
  const createGoogleCalendarLink = (event: CalendarEvent) => {
    const startDate = event.start.replace(/-|:|\.\d+/g, '');
    const endDate = event.end.replace(/-|:|\.\d+/g, '');
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
  };
  
  // 애플 캘린더 링크 생성 함수 (iCal 형식)
  const createAppleCalendarLink = (event: CalendarEvent) => {
    return `data:text/calendar;charset=utf-8,BEGIN:VCALENDAR%0AVERSION:2.0%0ABEGIN:VEVENT%0ADTSTART:${event.start.replace(/-|:|\.\d+/g, '')}%0ADTEND:${event.end.replace(/-|:|\.\d+/g, '')}%0ASUMMARY:${encodeURIComponent(event.title)}%0ADESCRIPTION:${encodeURIComponent(event.description)}%0ALOCATION:${encodeURIComponent(event.location)}%0AEND:VEVENT%0AEND:VCALENDAR`;
  };

  return (
    <div className={`p-4 border-l-4 ${isPast ? 'border-gray-300 bg-gray-50' : 'border-green-500 bg-green-50'}`}>
      <div className="flex justify-between mb-2">
        <span className={`text-sm font-medium px-2 py-1 rounded ${isPast ? 'bg-gray-200 text-gray-700' : 'bg-green-200 text-green-800'}`}>
          {type}
        </span>
        <span className="text-gray-500 text-sm">{date}</span>
      </div>
      <h3 className={`text-xl font-bold mb-2 ${isPast ? 'text-gray-600' : 'text-gray-900'}`}>{title}</h3>
      <div className="flex items-center text-gray-600 mb-1">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{time}</span>
      </div>
      <div className="flex items-center text-gray-600 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>{location}</span>
      </div>
      
      {!isPast && calendarEvent && (
        <div className="flex flex-wrap gap-2 mt-2">
          <a 
            href={createGoogleCalendarLink(calendarEvent)} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-100"
          >
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10.5 21l-.5-1h-3.5v-1.25c0-.97.78-1.75 1.75-1.75h1.5c.69 0 1.25-.56 1.25-1.25v-1.5c0-.97.78-1.75 1.75-1.75h1.5c.69 0 1.25-.56 1.25-1.25v-1.5c0-.97.78-1.75 1.75-1.75h1.5v1h-1.5c-.4 0-.75.35-.75.75v1.5c0 1.26-1.03 2.25-2.25 2.25h-1.5c-.4 0-.75.35-.75.75v1.5c0 1.26-1.03 2.25-2.25 2.25h-1.5c-.4 0-.75.35-.75.75v2.25h4.25l.5 1h-5.75z"></path><path d="M12 9v-3l4 4-4 4v-3h-4v-2h4z"></path>
            </svg>
            구글 캘린더에 추가
          </a>
          <a 
            href={createAppleCalendarLink(calendarEvent)} 
            download={`${title}.ics`}
            className="inline-flex items-center text-sm bg-gray-50 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-100"
          >
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"></path>
            </svg>
            애플 캘린더에 추가
          </a>
        </div>
      )}
    </div>
  )
} 