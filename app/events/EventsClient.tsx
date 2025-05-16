'use client';

import { useState } from 'react';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import ko from 'date-fns/locale/ko';
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
      const dateStr = format(eventDate, 'yyyy-MM-dd'); // 로컬 시간대 기준으로 yyyy-MM-dd 형식 추출
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
    // 과거 일정일 경우 최근 날짜가 먼저 오도록 정렬 (내림차순)
    // 미래 일정은 이전과 동일하게 오름차순 정렬
    if (showPastEvents) {
      const dateA = new Date(a);
      const dateB = new Date(b);
      
      // 현재 날짜 기준으로 과거/미래 구분
      const isPastA = dateA < today;
      const isPastB = dateB < today;
      
      if (isPastA && isPastB) {
        // 둘 다 과거 날짜면 최신 날짜가 먼저 오도록 (내림차순)
        return dateB.getTime() - dateA.getTime();
      } else if (!isPastA && !isPastB) {
        // 둘 다 미래 날짜면 빠른 날짜가 먼저 오도록 (오름차순)
        return dateA.getTime() - dateB.getTime();
      } else {
        // 과거와 미래가 섞여있으면 미래가 먼저 오도록
        return isPastA ? 1 : -1;
      }
    } else {
      // 미래 일정만 표시할 경우 오름차순 정렬
      return new Date(a).getTime() - new Date(b).getTime();
    }
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
    
    // 달력 보기에서는 과거/미래 일정 모두 표시 (카테고리 필터만 적용)
    const eventsToFilter = viewMode === 'month' 
      ? events.filter(event => !event.category || selectedCategories.includes(event.category)) 
      : filteredEvents;
    
    return eventsToFilter.filter(event => {
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
          
          {/* 뷰 모드 선택 및 필터 버튼 */}
          <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap">
            <div className="mb-3 mb-md-0">
              <div className="btn-group">
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
            </div>
            
            <div className="d-flex flex-wrap gap-2">
              {/* 카테고리 필터 버튼 */}
              <div className="btn-group me-2 mb-2 mb-md-0">
                {Object.entries(categoryLabels).map(([category, label]) => (
                  <button
                    key={category}
                    className={`btn ${selectedCategories.includes(category) ? 'btn-outline-secondary active' : 'btn-outline-secondary'}`}
                    onClick={() => toggleCategory(category)}
                    style={{
                      borderColor: categoryColors[category as keyof typeof categoryColors],
                      color: selectedCategories.includes(category) ? 'white' : categoryColors[category as keyof typeof categoryColors],
                      backgroundColor: selectedCategories.includes(category) ? categoryColors[category as keyof typeof categoryColors] : 'transparent',
                      fontSize: '0.8rem',
                      padding: '6px 10px',
                      borderRadius: '4px',
                      marginRight: '4px'
                    }}
                  >
                    <i className="bi bi-tag-fill me-1"></i> {label}
                  </button>
                ))}
              </div>
              
              {/* 지난 일정 보기 토글 버튼 */}
              {pastEventsCount > 0 && (
                <button
                  className={`btn ${showPastEvents ? 'btn-secondary' : 'btn-outline-secondary'}`}
                  onClick={() => setShowPastEvents(!showPastEvents)}
                  style={{
                    fontSize: '0.8rem',
                    borderRadius: '4px',
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
                            <div className="d-flex mt-2 gap-2 justify-content-end flex-wrap">
                              <a 
                                href={getGoogleCalendarUrl(event)} 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-outline-secondary"
                                title="구글 캘린더에 추가"
                                style={{
                                  fontSize: '0.75rem',
                                  borderRadius: '4px',
                                  flex: '1 1 auto',
                                  minWidth: '100px'
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
                                  flex: '1 1 auto',
                                  minWidth: '100px'
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
      
      {/* 달력 뷰 - 과거 일정도 항상 표시 */}
      {viewMode === 'month' && (
        <div className="row">
          <div className="col-md-8 mb-4 mb-md-0">
            <div className="calendar-wrapper bg-white p-4 rounded-4 shadow-sm">
              <Calendar
                onChange={handleDateClick}
                value={date}
                locale="ko-KR"
                className="border-0 w-100"
                tileContent={({ date, view }) => {
                  if (view !== 'month') return null;
                  const eventsOnDay = getEventsOnDay(date);
                  if (eventsOnDay.length === 0) return null;
                  
                  // 이벤트 카테고리에 따른 색상 표시
                  const hasImportantEvent = eventsOnDay.some(e => e.isImportant);
                  const categoryDots = [...new Set(eventsOnDay.map(e => e.category))].filter(Boolean);
                  
                  return (
                    <div className="position-relative d-flex flex-column align-items-center">
                      {/* 다중 카테고리 표시용 점 */}
                      {categoryDots.length > 0 ? (
                        <div className="d-flex gap-1 mt-1 justify-content-center">
                          {categoryDots.map((category, idx) => (
                            <div 
                              key={idx}
                              style={{
                                height: '4px',
                                width: '4px',
                                borderRadius: '50%',
                                backgroundColor: categoryColors[category as keyof typeof categoryColors],
                              }}
                            />
                          ))}
                          {hasImportantEvent && (
                            <div 
                              style={{
                                height: '4px',
                                width: '4px',
                                borderRadius: '50%',
                                backgroundColor: '#ff3b30',
                              }}
                            />
                          )}
                        </div>
                      ) : (
                        <div 
                          className="mt-1"
                          style={{
                            height: '4px',
                            width: '4px',
                            borderRadius: '50%',
                            backgroundColor: hasImportantEvent ? '#ff3b30' : accentColor,
                          }}
                        />
                      )}
                      
                      {eventsOnDay.length > 1 && (
                        <span 
                          className="position-absolute badge" 
                          style={{
                            top: '-4px',
                            right: '-4px',
                            fontSize: '0.65rem',
                            padding: '1px 4px',
                            backgroundColor: accentColor,
                            color: 'white',
                            fontWeight: 'normal',
                            borderRadius: '4px',
                            opacity: 0.9,
                            minWidth: '16px',
                            textAlign: 'center'
                          }}
                        >
                          {eventsOnDay.length}
                        </span>
                      )}
                    </div>
                  );
                }}
                tileClassName={({ date, view }) => {
                  if (view !== 'month') return '';
                  const eventsOnDay = getEventsOnDay(date);
                  
                  // 오늘 날짜와 이벤트 있는 날짜에 다른 스타일 적용
                  let classes = '';
                  if (eventsOnDay.length > 0) classes += 'has-events ';
                  
                  return classes;
                }}
              />
            </div>
          </div>
          
          {/* 선택된 날짜의 일정 미리보기 */}
          <div className="col-md-4">
            <div className="event-preview p-4 h-100" 
                 style={{
                   backgroundColor: 'rgba(248, 249, 250, 0.5)',
                   backdropFilter: 'blur(10px)',
                   border: '1px solid rgba(0,0,0,0.05)'
                 }}>
              {selectedEvent ? (
                <div className="fade-in">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0 fw-bold" style={{color: '#333'}}>
                      {format(new Date(selectedEvent.start), 'yyyy년 MM월 dd일')}
                    </h5>
                    <span className="badge" style={{
                      backgroundColor: selectedEvent.category ? 
                        categoryColors[selectedEvent.category] : accentColor,
                      paddingLeft: '12px',
                      paddingRight: '12px'
                    }}>
                      {selectedEvent.category ? 
                        categoryLabels[selectedEvent.category] : '일정'}
                    </span>
                  </div>
                  
                  <div className="event-card bg-white p-4 mb-3 shadow-sm" 
                       style={{
                         borderLeft: `4px solid ${selectedEvent.category ? 
                           categoryColors[selectedEvent.category] : 
                           (selectedEvent.isImportant ? '#ff3b30' : accentColor)}`
                       }}>
                    <h5 className="fw-bold mb-3">{selectedEvent.title}</h5>
                    <div className="d-flex align-items-center mb-3 text-muted">
                      <i className="bi bi-clock me-2"></i>
                      <span className="fw-medium">
                        {format(new Date(selectedEvent.start), 'a h:mm', { locale: ko })}
                      </span>
                    </div>
                    {selectedEvent.description && (
                      <div className="mb-3 p-3" style={{
                        backgroundColor: '#f8f9fa',
                        fontSize: '0.9rem'
                      }}>
                        {selectedEvent.description}
                      </div>
                    )}
                    <div className="d-flex align-items-center text-muted">
                      <i className="bi bi-geo-alt me-2"></i>
                      <span>{selectedEvent.location}</span>
                    </div>
                    
                    <div className="mt-3 d-flex justify-content-between" style={{ gap: '4px' }}>
                      <a 
                        href={getGoogleCalendarUrl(selectedEvent)} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-secondary flex-grow-1"
                        style={{
                          padding: '4px 6px',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          boxShadow: 'none'
                        }}
                      >
                        <i className="bi bi-google me-1"></i> 구글
                      </a>
                      
                      {/* 애플 캘린더 추가 버튼 */}
                      <a 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          addToAppleCalendar(selectedEvent);
                        }}
                        className="btn btn-sm btn-outline-dark flex-grow-1"
                        style={{
                          padding: '4px 6px',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          boxShadow: 'none'
                        }}
                      >
                        <i className="bi bi-apple me-1"></i> 애플
                      </a>
                      
                      <button 
                        className="btn btn-sm btn-outline-primary flex-grow-1" 
                        onClick={() => copyEventToClipboard(selectedEvent)}
                        style={{
                          padding: '4px 6px',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          boxShadow: 'none'
                        }}
                      >
                        <i className="bi bi-clipboard me-1"></i> 복사
                      </button>
                    </div>
                  </div>
                  
                  {/* 같은 날 다른 일정 */}
                  {getEventsOnDay(new Date(selectedEvent.start)).length > 1 && (
                    <div>
                      <h6 className="mb-3 fw-bold">같은 날 다른 일정</h6>
                      {getEventsOnDay(new Date(selectedEvent.start))
                        .filter(e => e._id !== selectedEvent._id)
                        .map(otherEvent => (
                          <div 
                            key={otherEvent._id}
                            className="other-event p-3 bg-white mb-2 shadow-sm"
                            onClick={() => setSelectedEvent(otherEvent)}
                            style={{
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              borderLeft: `4px solid ${otherEvent.category ? 
                                categoryColors[otherEvent.category] : 
                                (otherEvent.isImportant ? '#ff3b30' : accentColor)}`
                            }}
                          >
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <div className="small fw-medium">{otherEvent.title}</div>
                                <div className="text-muted" style={{fontSize: '0.75rem'}}>
                                  <i className="bi bi-geo-alt-fill me-1"></i> 
                                  {otherEvent.location}
                                </div>
                              </div>
                              <span className="badge bg-light text-dark" 
                                    style={{ 
                                      fontSize: '0.7rem',
                                      padding: '4px 8px'
                                    }}>
                                {format(new Date(otherEvent.start), 'HH:mm')}
                              </span>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center p-5">
                  <div className="py-5">
                    <i className="bi bi-calendar3-event fs-1 text-muted opacity-50"></i>
                    <p className="mt-4 mb-0 lead text-secondary">
                      일정을 보려면 달력에서 날짜를 선택하세요.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
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
        
        /* 캘린더 커스텀 스타일 */
        :global(.react-calendar) {
          border: none;
          font-family: system-ui, -apple-system, sans-serif;
        }
        
        :global(.react-calendar__navigation) {
          margin-bottom: 16px;
        }
        
        :global(.react-calendar__navigation button) {
          color: #333;
          font-size: 1rem;
          font-weight: 500;
          min-width: 40px;
          background: none;
          border-radius: 8px;
        }
        
        :global(.react-calendar__navigation button:enabled:hover,
                .react-calendar__navigation button:enabled:focus) {
          background-color: #f0f7ff;
        }
        
        :global(.react-calendar__month-view__weekdays) {
          text-transform: none;
          font-weight: 500;
        }
        
        :global(.react-calendar__month-view__weekdays__weekday) {
          padding: 8px 0;
          text-decoration: none;
          font-size: 0.85rem;
          color: #555;
        }
        
        :global(.react-calendar__month-view__weekdays__weekday abbr) {
          text-decoration: none;
        }
        
        :global(.react-calendar__tile) {
          padding: 14px 8px;
          position: relative;
          font-size: 0.9rem;
          border-radius: 8px;
          color: #333;
          margin: 2px;
          max-width: calc(100% - 4px);
          transition: all 0.2s ease;
        }
        
        :global(.react-calendar__tile:enabled:hover,
                .react-calendar__tile:enabled:focus) {
          background: #f0f7ff;
          color: ${accentColor};
        }
        
        :global(.react-calendar__tile--active) {
          background: ${accentColor} !important;
          border-radius: 8px;
          color: white !important;
        }
        
        :global(.react-calendar__tile--now) {
          background: #e6f2ff;
          border-radius: 8px;
          font-weight: 500;
        }
        
        :global(.react-calendar__tile--now.react-calendar__tile--active) {
          background: ${accentColor} !important;
          color: white;
        }
        
        :global(.has-events) {
          font-weight: 500;
          color: #333;
        }
        
        /* 모바일 최적화 */
        @media (max-width: 768px) {
          :global(.react-calendar__tile) {
            padding: 12px 6px;
            font-size: 0.8rem;
          }
          
          :global(.react-calendar__navigation button) {
            font-size: 0.9rem;
          }
        }
        
        /* 다른 일정 호버 효과 */
        .other-event:hover {
          transform: translateY(-2px);
          box-shadow: 0 3px 10px rgba(0,0,0,0.08);
        }
      `}</style>
    </div>
  );
}