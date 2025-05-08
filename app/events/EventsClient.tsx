'use client';

import { useState } from 'react';
import Calendar from 'react-calendar';
import { format, isSameDay } from 'date-fns';
import 'react-calendar/dist/Calendar.css';

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

// iCalendar 포맷용 유틸리티 함수
const formatDateForCalendar = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toISOString().replace(/-|:|\.\d+/g, '');
};

// 일정을 iCalendar 형식으로 변환하는 함수
const generateICalEvent = (event: Event): string => {
  const startDate = formatDateForCalendar(event.start);
  // 종료 시간이 없으면 시작 시간에 1시간 추가
  const endDate = event.end 
    ? formatDateForCalendar(event.end) 
    : formatDateForCalendar(new Date(new Date(event.start).getTime() + 60 * 60 * 1000).toISOString());
  
  return `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${event.title}
DTSTART:${startDate}
DTEND:${endDate}
LOCATION:${event.location || ''}
DESCRIPTION:${event.description || ''}
END:VEVENT
END:VCALENDAR`;
};

// 구글 캘린더 URL 생성 함수
const getGoogleCalendarUrl = (event: Event): string => {
  const startTime = new Date(event.start);
  // 종료 시간이 없으면 시작 시간에 1시간 추가
  const endTime = event.end ? new Date(event.end) : new Date(startTime.getTime() + 60 * 60 * 1000);
  
  const startTimeISO = startTime.toISOString().replace(/-|:|\.\d+/g, '');
  const endTimeISO = endTime.toISOString().replace(/-|:|\.\d+/g, '');
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${startTimeISO}/${endTimeISO}`,
    details: event.description || '',
    location: event.location || '',
  });
  
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

// 애플 캘린더 URL 생성 함수 (iCal 형식)
const getAppleCalendarUrl = (event: Event): string => {
  // 서버 사이드에서는 항상 빈 URL 반환
  if (typeof window === 'undefined') {
    return '#';
  }
  
  try {
    const icalContent = generateICalEvent(event);
    
    // UTF-8을 Latin1 범위로 변환하는 함수
    const toBase64 = (str: string): string => {
      // UTF-8 문자열을 바이너리 배열로 변환
      const utf8Encoder = new TextEncoder();
      const bytes = utf8Encoder.encode(str);
      
      // 바이너리 배열을 Latin1 문자열로 변환
      let binary = '';
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      
      // Latin1 문자열을 Base64로 인코딩
      return btoa(binary);
    };
    
    // Base64 인코딩 (URL 안전 형식)
    const base64Data = toBase64(icalContent).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return `data:text/calendar;charset=utf8;base64,${base64Data}`;
  } catch (error) {
    console.error('캘린더 URL 생성 오류:', error);
    // 오류 발생 시 빈 URL 반환
    return '#';
  }
};

// 애플 캘린더 직접 추가 처리 함수
const addToAppleCalendar = (event: Event) => {
  if (typeof window === 'undefined') return;
  
  try {
    // ICS 파일 다운로드 
    const link = document.createElement('a');
    link.href = getAppleCalendarUrl(event);
    link.download = `${event.title}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('캘린더 추가 오류:', error);
    alert('캘린더에 추가하는 중 오류가 발생했습니다. 다시 시도해주세요.');
  }
};

// 클립보드에 일정 정보 복사 함수
const copyEventToClipboard = (event: Event) => {
  if (typeof window === 'undefined') return;
  
  const eventTime = new Date(event.start).toLocaleString('ko-KR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  const text = `[권영국 후보 일정] ${event.title}\n📅 ${eventTime}\n📍 ${event.location}\n\n${event.description || ''}`;
  
  navigator.clipboard.writeText(text)
    .then(() => {
      alert('일정 정보가 클립보드에 복사되었습니다.');
    })
    .catch(err => {
      console.error('클립보드 복사 실패:', err);
    });
};

type CalendarValue = Date | [Date | null, Date | null] | null;

// 카테고리별 색상 설정
const categoryColors = {
  candidate: '#4CAF50', // 후보일정 - 녹색
  election: '#2196F3',  // 선거일정 - 파란색
  media: '#FF9800',     // 미디어 - 주황색
};

// 카테고리 표시명
const categoryLabels = {
  candidate: '후보일정',
  election: '선거일정', 
  media: '미디어',
};

export default function EventsClient({ events }: { events: Event[] }) {
  const [viewMode, setViewMode] = useState<'list' | 'month'>('list');
  const [date, setDate] = useState<CalendarValue>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    ['candidate', 'election', 'media']
  );
  const [showPastEvents, setShowPastEvents] = useState<boolean>(false);
  
  // 카테고리 토글 함수
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };
  
  // 날짜 기준으로 이벤트를 과거/미래로 분류
  const today = new Date();
  today.setHours(0, 0, 0, 0); // 오늘 날짜의 시작 시간으로 설정
  
  // 미래 일정만 필터링 (또는 showPastEvents가 true면 모든 일정 표시)
  const futureEvents = events.filter(event => {
    const eventDate = new Date(event.start);
    eventDate.setHours(0, 0, 0, 0); // 이벤트 날짜의 시작 시간으로 설정
    return showPastEvents || eventDate >= today;
  });
  
  // 필터링된 이벤트 목록
  const filteredEvents = selectedCategories.length === 0 
    ? futureEvents 
    : futureEvents.filter(event => !event.category || selectedCategories.includes(event.category));
  
  // 일정을 날짜별로 그룹화 (필터링 적용)
  const groupedEvents = filteredEvents.reduce((acc, event) => {
    // 날짜 문자열 대신 yyyy-MM-dd 형식으로 정규화
    const eventDate = new Date(event.start);
    if (!isNaN(eventDate.getTime())) { // 유효한 날짜인지 확인
      const dateStr = eventDate.toISOString().split('T')[0]; // yyyy-MM-dd 형식 추출
      if (!acc[dateStr]) {
        acc[dateStr] = [];
      }
      acc[dateStr].push(event);
    } else {
      console.error('Invalid date:', event.start, 'for event:', event.title);
    }
    return acc;
  }, {} as Record<string, Event[]>);
  
  // 날짜 목록 정렬
  const sortedDates = Object.keys(groupedEvents).sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime();
  });

  // 과거 일정 개수 계산
  const pastEventsCount = events.filter(event => {
    const eventDate = new Date(event.start);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate < today;
  }).length;
  
  // 달력에 표시할 날짜에 이벤트가 있는지 확인하는 함수 (필터링 적용)
  const getEventsOnDay = (date: Date) => {
    // 날짜 비교를 위해 년/월/일만 비교 (시간 정보 제거)
    const yearMonthDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    return filteredEvents.filter(event => {
      const eventDate = new Date(event.start);
      const eventYearMonthDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
      return yearMonthDay.getTime() === eventYearMonthDay.getTime();
    });
  };
  
  // 날짜 클릭 시 해당 날짜의 이벤트 표시
  const handleDateClick = (value: CalendarValue) => {
    if (!value || Array.isArray(value)) return;
    
    const clickedDate = value;
    // 항상 날짜를 업데이트
    setDate(clickedDate);
    
    const eventsOnDay = getEventsOnDay(clickedDate);
    
    if (eventsOnDay.length > 0) {
      setSelectedEvent(eventsOnDay[0]);
    } else {
      setSelectedEvent(null);
    }
  };
  
  // iOS 스타일 색상 체계
  const accentColor = '#007aff'; // iOS 블루 색상
  
  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col-12">
          <p className="lead mb-4 text-secondary">대선 캠페인 공식 일정과 주요 행사를 확인하세요.</p>
          
          {/* 뷰 모드 선택 - 미니멀한 디자인의 버튼 그룹 */}
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
            <div className="btn-group mb-2 mb-md-0">
              <button 
                className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setViewMode('list')}
                style={{
                  backgroundColor: viewMode === 'list' ? accentColor : 'transparent',
                  borderColor: accentColor,
                  color: viewMode === 'list' ? 'white' : accentColor,
                  boxShadow: 'none',
                  borderRadius: '8px 0 0 8px',
                  padding: '8px 16px',
                  fontSize: '0.9rem'
                }}
              >
                <i className="bi bi-list-ul me-2"></i> 목록보기
              </button>
              <button 
                className={`btn ${viewMode === 'month' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setViewMode('month')}
                style={{
                  backgroundColor: viewMode === 'month' ? accentColor : 'transparent',
                  borderColor: accentColor,
                  color: viewMode === 'month' ? 'white' : accentColor,
                  boxShadow: 'none',
                  borderRadius: '0 8px 8px 0',
                  padding: '8px 16px',
                  fontSize: '0.9rem'
                }}
              >
                <i className="bi bi-calendar3 me-2"></i> 달력보기
              </button>
            </div>
            
            {/* 지난 일정 보기 토글 버튼 */}
            {viewMode === 'list' && pastEventsCount > 0 && (
              <button
                className={`btn ${showPastEvents ? 'btn-secondary' : 'btn-outline-secondary'}`}
                onClick={() => setShowPastEvents(!showPastEvents)}
                style={{
                  fontSize: '0.9rem',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease'
                }}
              >
                <i className={`bi ${showPastEvents ? 'bi-eye-slash' : 'bi-clock-history'} me-2`}></i>
                {showPastEvents ? '앞으로의 일정만 보기' : `지난 일정 보기 (${pastEventsCount}개)`}
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* 목록 뷰 - 타임라인 형태 */}
      {viewMode === 'list' && (
        <div className="timeline-container position-relative pb-5">
          {sortedDates.length > 0 ? (
            sortedDates.map((dateStr, index) => {
              // 정규화된 ISO 문자열(yyyy-MM-dd)에서 Date 객체 생성
              const date = new Date(dateStr);
              return (
                <div key={dateStr} className="timeline-day mb-4 fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                  {/* 날짜 헤더 - 더 미니멀한 디자인 */}
                  <div className="date-header mb-3 d-flex align-items-center">
                    <div className="date-badge me-3 d-flex flex-column justify-content-center align-items-center" 
                         style={{
                           width: '50px',
                           height: '50px',
                           backgroundColor: '#f8f9fa',
                           borderRadius: '12px',
                           boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                         }}>
                      <span className="fw-bold fs-4" style={{color: accentColor}}>{date.getDate()}</span>
                      <span className="small text-secondary" style={{fontSize: '0.7rem'}}>
                        {date.toLocaleDateString('ko-KR', { month: 'short' })}
                      </span>
                    </div>
                    <div>
                      <h4 className="mb-0 fs-5 fw-bold">{date.toLocaleDateString('ko-KR', { weekday: 'long' })}</h4>
                      <p className="text-secondary mb-0 small">{date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  </div>
                  
                  {/* 타임라인 이벤트 */}
                  <div className="timeline-events position-relative ps-4 ms-3">
                    {/* 타임라인 라인 - 더 얇게 */}
                    <div className="timeline-line position-absolute top-0 bottom-0 start-0" 
                         style={{
                           width: '1px',
                           backgroundColor: '#e9ecef',
                           left: '25px'
                         }}>
                    </div>
                    
                    {/* 이벤트 항목들 */}
                    {groupedEvents[dateStr]
                      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
                      .map((event, eventIndex) => (
                        <div 
                          key={event._id} 
                          className="timeline-event mb-3 position-relative fade-in-up rounded-3 shadow-sm"
                          style={{
                            animationDelay: `${(index * 0.1) + (eventIndex * 0.05)}s`,
                            border: '1px solid #f1f3f5',
                            backgroundColor: 'white',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                          }}
                        >
                          {/* 타임라인 도트 */}
                          <div className="timeline-dot position-absolute"
                               style={{
                                 width: '10px',
                                 height: '10px',
                                 borderRadius: '50%',
                                 backgroundColor: event.isImportant ? '#ff3b30' : event.category ? categoryColors[event.category] : accentColor,
                                 border: '2px solid white',
                                 left: '-30px',
                                 top: '22px',
                                 zIndex: 2
                               }}>
                          </div>
                          
                          <div className="p-3">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <h5 className="event-title mb-0 fs-5">
                                {event.isImportant && <i className="bi bi-star-fill text-danger me-2 small"></i>}
                                {event.title}
                              </h5>
                              <span className="time-badge py-1 px-2 rounded-pill small" 
                                    style={{
                                      backgroundColor: '#f8f9fa',
                                      color: accentColor,
                                      fontSize: '0.75rem',
                                      fontWeight: '500'
                                    }}>
                                {new Date(event.start).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            
                            <p className="event-desc mb-2 text-secondary small">{event.description}</p>
                            
                            <div className="d-flex align-items-center text-muted small">
                              <i className="bi bi-geo-alt me-2"></i>
                              <span>{event.location}</span>
                              {event.category && (
                                <span className="ms-3 badge" style={{
                                  backgroundColor: event.category ? categoryColors[event.category] : '#757575',
                                  color: 'white',
                                  fontSize: '0.7rem',
                                  fontWeight: 'normal'
                                }}>
                                  {categoryLabels[event.category] || '기타'}
                                </span>
                              )}
                            </div>
                            
                            {/* 캘린더 추가 버튼들 */}
                            <div className="d-flex mt-2 gap-2 justify-content-end">
                              <a 
                                href={getGoogleCalendarUrl(event)} 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-outline-secondary"
                                title="구글 캘린더에 추가"
                                style={{
                                  fontSize: '0.75rem',
                                  borderRadius: '4px',
                                  flex: '1 1 auto'
                                }}
                              >
                                <i className="bi bi-google me-1"></i> 캘린더 추가
                              </a>
                              
                              {/* 애플 캘린더 - 하이드레이션 불일치 해결을 위해 클라이언트에서만 링크 생성 */}
                              <a 
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  addToAppleCalendar(event);
                                }}
                                className="btn btn-sm btn-outline-dark"
                                title="ICS 파일 다운로드"
                                style={{
                                  fontSize: '0.75rem',
                                  borderRadius: '4px',
                                  flex: '1 1 auto'
                                }}
                              >
                                <i className="bi bi-apple me-1"></i> 캘린더 추가
                              </a>
                              
                              {/* 공유 드롭다운 버튼 */}
                              <div className="dropdown">
                                <button 
                                  className="btn btn-sm btn-outline-primary dropdown-toggle"
                                  type="button"
                                  data-bs-toggle="dropdown"
                                  data-bs-auto-close="outside"
                                  data-bs-display="static"
                                  data-bs-offset="0,10"
                                  aria-expanded="false"
                                  title="SNS로 공유하기"
                                  style={{
                                    fontSize: '0.75rem',
                                    borderRadius: '4px'
                                  }}
                                >
                                  <i className="bi bi-share me-1"></i> 공유
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end">
                                  <li>
                                    <button 
                                      className="dropdown-item" 
                                      onClick={() => {
                                        copyEventToClipboard(event);
                                      }}
                                    >
                                      <i className="bi bi-clipboard me-2"></i> 클립보드에 복사
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center p-5 fade-in-up">
              <div className="py-5 bg-light rounded-3">
                <i className="bi bi-calendar-x fs-1 text-muted"></i>
                <p className="mt-3 mb-0 lead">예정된 일정이 없습니다.</p>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* 애니메이션 스타일 */}
      <style jsx>{`
        .fade-in-up {
          animation: fadeInUp 0.5s ease forwards;
          opacity: 0;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .fade-in {
          animation: fadeIn 0.5s ease forwards;
          opacity: 0;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        /* 타임라인 이벤트 호버 효과 */
        .timeline-event:hover {
          box-shadow: 0 3px 15px rgba(0, 122, 255, 0.15);
          transform: translateY(-2px);
          border-color: rgba(0, 122, 255, 0.3);
        }
      `}</style>
    </div>
  );
}