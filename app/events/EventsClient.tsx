'use client';

import { useState } from 'react';
import Calendar from 'react-calendar';
import { format, isSameDay } from 'date-fns';
import 'react-calendar/dist/Calendar.css';

// 타입 정의
type Event = {
  _id: string;
  title: string;
  description: string;
  start: string;
  end: string;
  location: string;
  isImportant: boolean;
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
    // iCalendar 콘텐츠 생성
    const icalContent = generateICalEvent(event);
    
    // 애플 기기(iOS/macOS)인지 확인
    const isAppleDevice = /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent);
    
    // 방법 1: webcal:// 프로토콜 시도 (일부 브라우저에서만 작동)
    if (isAppleDevice) {
      try {
        // Blob 생성
        const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        // 1초 후에 "애플 캘린더에 추가 중..." 알림 표시
        const addingMsg = alert("애플 캘린더에 추가 중입니다...");
        
        // webcal:// 프로토콜로 열기 시도
        window.location.href = "webcal:" + url.substring(5);  // "blob:" 제거
        
        // 사용자에게 안내 메시지 (지연 시간을 두어 이벤트 처리)
        setTimeout(() => {
          const shouldDownload = confirm('캘린더 앱이 열리지 않으면, ICS 파일을 다운로드 하시겠습니까?');
          if (shouldDownload) {
            // 방법 2: 다운로드 방식으로 대체
            downloadICS();
          }
          
          // 메모리 해제
          URL.revokeObjectURL(url);
        }, 2000);
      } catch (e) {
        console.error("애플 캘린더 직접 추가 오류:", e);
        // 바로 다운로드 방식으로 대체
        downloadICS();
      }
    } else {
      // 비 애플 기기는 바로 다운로드
      downloadICS();
    }
    
    // ICS 파일 다운로드 함수
    function downloadICS() {
      const link = document.createElement('a');
      link.href = getAppleCalendarUrl(event);
      link.download = `${event.title}.ics`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (error) {
    console.error('캘린더 추가 오류:', error);
    alert('캘린더에 추가하는 중 오류가 발생했습니다. 다시 시도해주세요.');
    
    // 오류 발생 시 기존 방식으로 다운로드
    const link = document.createElement('a');
    link.href = getAppleCalendarUrl(event);
    link.download = `${event.title}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// SNS 공유 URL 생성 함수
const getSocialShareUrl = (event: Event, platform: 'twitter' | 'facebook' | 'instagram' | 'kakaotalk' | 'telegram' | 'sms'): string => {
  // 클라이언트 사이드에서만 작동하도록 확인
  if (typeof window === 'undefined') return '#';
  
  const title = `[권영국 후보 일정] ${event.title}`;
  const eventTime = new Date(event.start).toLocaleString('ko-KR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  const text = `${title}\n📅 ${eventTime}\n📍 ${event.location}\n\n${event.description || ''}`;
  const shortText = `${title} - ${eventTime}, ${event.location}`;
  const url = window.location.href;
  
  if (platform === 'twitter') {
    // 트위터는 현재 X로 리브랜딩 되었지만 공유 URL은 여전히 twitter.com 도메인 사용
    const params = new URLSearchParams({
      text: shortText,
      url: url
    });
    return `https://twitter.com/intent/tweet?${params.toString()}`;
  } else if (platform === 'facebook') {
    const params = new URLSearchParams({
      u: url,
      quote: text
    });
    return `https://www.facebook.com/sharer/sharer.php?${params.toString()}`;
  } else if (platform === 'instagram') {
    // 인스타그램은 직접 공유를 위한 URL 스키마가 없어 클립보드에 복사 안내를 위한 사용자 경험을 제공
    // 실제로는 모바일에서 Instagram Stories를 통해 공유하는 방법이 있지만 웹에서는 제한적임
    // 여기서는 클립보드에 복사하는 기능으로 대체
    copyEventToClipboard(event);
    return '#instagram';
  } else if (platform === 'kakaotalk') {
    // 카카오톡은 기본적으로 카카오 SDK가 필요하지만, 카카오스토리로 공유는 URL로 가능
    const params = new URLSearchParams({
      url: url,
      text: text
    });
    return `https://story.kakao.com/share?${params.toString()}`;
  } else if (platform === 'telegram') {
    const params = new URLSearchParams({
      url: url,
      text: text
    });
    return `https://t.me/share/url?${params.toString()}`;
  } else if (platform === 'sms') {
    // SMS는 모바일에서만 작동
    return `sms:?&body=${encodeURIComponent(shortText + ' ' + url)}`;
  }
  
  return '#';
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

// 특정 플랫폼에 대한 공유 처리 함수
const handleShare = (event: Event, platform: 'twitter' | 'facebook' | 'instagram' | 'kakaotalk' | 'telegram' | 'sms') => {
  if (platform === 'instagram') {
    copyEventToClipboard(event);
    alert('인스타그램에는 직접 공유할 수 없습니다. 일정 정보가 클립보드에 복사되었습니다. 인스타그램 앱에 붙여넣기 해주세요.');
    return;
  }
  
  const url = getSocialShareUrl(event, platform);
  if (url !== '#') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
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
  
  // 카테고리 토글 함수
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };
  
  // 필터링된 이벤트 목록
  const filteredEvents = selectedCategories.length === 0 
    ? events 
    : events.filter(event => !event.category || selectedCategories.includes(event.category));
  
  // 일정을 날짜별로 그룹화 (필터링 적용)
  const groupedEvents = filteredEvents.reduce((acc, event) => {
    const date = new Date(event.start).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {} as Record<string, Event[]>);
  
  // 날짜 목록 정렬
  const sortedDates = Object.keys(groupedEvents).sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime();
  });
  
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
      {/* 드롭다운 메뉴를 위한 전역 스타일 추가 */}
      <style jsx global>{`
        /* 매우 높은 z-index와 강력한 CSS 선택자로 적용 */
        .dropdown-menu.dropdown-menu.dropdown-menu {
          z-index: 9999 !important; 
          position: fixed !important; /* absolute 대신 fixed 사용 */
          margin-top: 0 !important;
          transform: none !important;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 5px 15px rgba(0,0,0,0.2) !important;
          border: 1px solid rgba(0,0,0,0.1) !important;
        }
        
        /* 드롭업 메뉴 스타일 (항상 위로 표시) */
        .dropup-menu.dropup-menu.dropup-menu {
          bottom: auto !important;
          top: auto !important;
          transform: translate3d(0, -100%, 0) !important;
          margin-top: -5px !important;
          margin-bottom: 0 !important;
        }
        
        /* 드롭다운 컨테이너 스타일 강화 */
        .dropdown.dropdown {
          position: static !important; /* relative 대신 static 사용 */
          z-index: 9999 !important;
          display: inline-block !important;
        }
        
        /* 드롭다운 메뉴를 body의 자식으로 만들기 위한 스타일 */
        body .dropdown-menu.show {
          display: block !important;
          opacity: 1 !important;
          visibility: visible !important;
          pointer-events: auto !important;
        }
        
        /* 연속된 드롭다운 겹침 방지 */
        .dropdown-menu .dropdown-item {
          z-index: 10000 !important;
          position: relative !important;
        }
        
        /* 타임라인 이벤트의 오버플로우 제거 */
        .timeline-event {
          z-index: 1 !important;
          overflow: visible !important;
        }
        
        /* 특히 목록 뷰에서의 드롭다운 메뉴 위치 조정 */
        .timeline-event .dropdown-menu {
          position: fixed !important;
          top: auto !important;
          left: auto !important;
          transform: translate3d(0, -100%, 0) !important;
        }
        
        /* 다른 요소들 뒤로 보내기 */
        .timeline-events, .event-item, .calendar-container {
          z-index: 1 !important;
        }
        
        /* Bootstrap 포퍼 위치 조정 무시 */
        .bs-popover-auto[data-popper-placement], 
        .dropdown-menu[data-popper-placement] {
          position: fixed !important;
          inset: auto !important;
        }
        
        /* 모바일 최적화 */
        @media (max-width: 768px) {
          .dropdown-menu.dropdown-menu.dropdown-menu {
            max-width: 90vw;
            max-height: 50vh;
          }
        }
      `}</style>
      
      <div className="row mb-4">
        <div className="col-12">
          <p className="lead mb-4 text-secondary">대선 캠페인 공식 일정과 주요 행사를 확인하세요.</p>
          
          {/* 뷰 모드 선택 - 미니멀한 디자인의 버튼 그룹 */}
          <div className="d-flex mb-4">
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
        </div>
      </div>
      
      {/* 목록 뷰 - 타임라인 형태 */}
      {viewMode === 'list' && (
        <div className="timeline-container position-relative pb-5">
          {sortedDates.length > 0 ? (
            sortedDates.map((date, index) => (
              <div key={date} className="timeline-day mb-4 fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
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
                    <span className="fw-bold fs-4" style={{color: accentColor}}>{new Date(date).getDate()}</span>
                    <span className="small text-secondary" style={{fontSize: '0.7rem'}}>
                      {new Date(date).toLocaleDateString('ko-KR', { month: 'short' })}
                    </span>
                  </div>
                  <div>
                    <h4 className="mb-0 fs-5 fw-bold">{new Date(date).toLocaleDateString('ko-KR', { weekday: 'long' })}</h4>
                    <p className="text-secondary mb-0 small">{new Date(date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
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
                  {groupedEvents[date]
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
                            title="애플 캘린더에 추가"
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
                              data-bs-popper-config='{"placement": "top-end", "strategy": "fixed"}'
                              aria-expanded="false"
                              title="SNS로 공유하기"
                              style={{
                                fontSize: '0.75rem',
                                borderRadius: '4px'
                              }}
                            >
                              <i className="bi bi-share me-1"></i> 공유
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end dropup-menu">
                              <li>
                                <a 
                                  className="dropdown-item" 
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if (typeof window !== 'undefined') {
                                      const url = window.location.href;
                                      const text = `[권영국 후보 일정] ${event.title} - ${new Date(event.start).toLocaleString('ko-KR')}, ${event.location}`;
                                      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer');
                                    }
                                  }}
                                >
                                  <i className="bi bi-twitter me-2"></i> 트위터
                                </a>
                              </li>
                              <li>
                                <a 
                                  className="dropdown-item" 
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if (typeof window !== 'undefined') {
                                      const url = window.location.href;
                                      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer');
                                    }
                                  }}
                                >
                                  <i className="bi bi-facebook me-2"></i> 페이스북
                                </a>
                              </li>
                              <li>
                                <button 
                                  className="dropdown-item"
                                  onClick={() => {
                                    if (typeof window !== 'undefined') {
                                      const text = `[권영국 후보 일정] ${event.title}\n📅 ${new Date(event.start).toLocaleString('ko-KR')}\n📍 ${event.location}\n\n${event.description || ''}`;
                                      navigator.clipboard.writeText(text)
                                        .then(() => alert('인스타그램에는 직접 공유할 수 없습니다. 일정 정보가 클립보드에 복사되었습니다. 인스타그램 앱에 붙여넣기 해주세요.'))
                                        .catch(err => console.error('클립보드 복사 실패:', err));
                                    }
                                  }}
                                >
                                  <i className="bi bi-instagram me-2"></i> 인스타그램
                                </button>
                              </li>
                              <li>
                                <a 
                                  className="dropdown-item" 
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if (typeof window !== 'undefined') {
                                      const url = window.location.href;
                                      window.open(`https://story.kakao.com/share?url=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer');
                                    }
                                  }}
                                >
                                  <i className="bi bi-chat-fill me-2"></i> 카카오톡
                                </a>
                              </li>
                              <li>
                                <a 
                                  className="dropdown-item" 
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if (typeof window !== 'undefined') {
                                      const url = window.location.href;
                                      const text = `[권영국 후보 일정] ${event.title} - ${new Date(event.start).toLocaleString('ko-KR')}, ${event.location}`;
                                      window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
                                    }
                                  }}
                                >
                                  <i className="bi bi-telegram me-2"></i> 텔레그램
                                </a>
                              </li>
                              <li>
                                <a 
                                  className="dropdown-item" 
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if (typeof window !== 'undefined') {
                                      const text = `[권영국 후보 일정] ${event.title} - ${new Date(event.start).toLocaleString('ko-KR')}, ${event.location} ${window.location.href}`;
                                      window.location.href = `sms:?&body=${encodeURIComponent(text)}`;
                                    }
                                  }}
                                >
                                  <i className="bi bi-chat-text me-2"></i> 문자메시지
                                </a>
                              </li>
                              <li><hr className="dropdown-divider" /></li>
                              <li>
                                <button 
                                  className="dropdown-item" 
                                  onClick={() => {
                                    if (typeof window !== 'undefined') {
                                      const text = `[권영국 후보 일정] ${event.title}\n📅 ${new Date(event.start).toLocaleString('ko-KR')}\n📍 ${event.location}\n\n${event.description || ''}`;
                                      navigator.clipboard.writeText(text)
                                        .then(() => alert('일정 정보가 클립보드에 복사되었습니다.'))
                                        .catch(err => console.error('클립보드 복사 실패:', err));
                                    }
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
            ))
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
      
      {/* 달력 뷰 - iOS 스타일 적용 */}
      {viewMode === 'month' && (
        <div className="row">
          {/* 카테고리 필터 및 범례 */}
          <div className="col-12 mb-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center bg-white p-3 rounded-3 shadow-sm">
              <div className="d-flex gap-2 flex-wrap mb-2 mb-md-0">
                <span className="text-secondary me-2">카테고리 필터:</span>
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <div key={key} className="form-check form-check-inline" style={{ marginBottom: 0 }}>
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id={`category-${key}`} 
                      checked={selectedCategories.includes(key)}
                      onChange={() => toggleCategory(key)}
                      style={{ 
                        borderColor: categoryColors[key as keyof typeof categoryColors],
                        backgroundColor: selectedCategories.includes(key) ? categoryColors[key as keyof typeof categoryColors] : 'transparent',
                      }}
                    />
                    <label className="form-check-label" htmlFor={`category-${key}`}>
                      <span style={{ color: categoryColors[key as keyof typeof categoryColors], fontWeight: 500 }}>
                        {label}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
              
              <button 
                className="btn btn-sm btn-outline-secondary" 
                onClick={() => selectedCategories.length === Object.keys(categoryLabels).length 
                  ? setSelectedCategories([]) 
                  : setSelectedCategories(Object.keys(categoryLabels))
                }
              >
                {selectedCategories.length === Object.keys(categoryLabels).length 
                  ? '모두 해제' 
                  : '모두 선택'}
              </button>
            </div>
          </div>
          
          <div className="col-md-8">
            <div className="calendar-container rounded-3 p-4 bg-white fade-in" style={{
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              border: '1px solid #f1f3f5'
            }}>
              <style dangerouslySetInnerHTML={{ __html: `
                .react-calendar {
                  width: 100%;
                  border: none;
                  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
                }
                .react-calendar__tile {
                  height: 80px;
                  padding: 0;
                  position: relative;
                  overflow: visible;
                }
                .react-calendar__tile:hover {
                  background: rgba(0, 122, 255, 0.08);
                }
                .react-calendar__tile--now {
                  background: rgba(0, 122, 255, 0.1);
                  border-radius: 8px;
                }
                .react-calendar__tile--active {
                  background: rgba(0, 122, 255, 0.15) !important;
                  color: black;
                  border-radius: 8px;
                }
                .react-calendar__tile--active:enabled:hover,
                .react-calendar__tile--active:enabled:focus {
                  background: rgba(0, 122, 255, 0.25) !important;
                }
                .react-calendar__tile--hasEvent {
                  position: relative;
                }
                .react-calendar__tile--hasEvent::after {
                  content: '';
                  position: absolute;
                  top: 8px;
                  right: 8px;
                  width: 8px;
                  height: 8px;
                  background: #007aff;
                  border-radius: 50%;
                }
                .react-calendar__navigation {
                  margin-bottom: 15px;
                }
                .react-calendar__navigation button {
                  min-width: 44px;
                  background: none;
                  font-size: 16px;
                  border-radius: 8px;
                }
                .react-calendar__navigation button:enabled:hover,
                .react-calendar__navigation button:enabled:focus {
                  background-color: rgba(0, 122, 255, 0.08);
                }
                .react-calendar__month-view__weekdays {
                  text-align: center;
                  font-weight: 500;
                  font-size: 0.9em;
                  color: #666;
                }
                .react-calendar__month-view__days__day--weekend {
                  color: #ff3b30;
                }
                .react-calendar__year-view .react-calendar__tile,
                .react-calendar__decade-view .react-calendar__tile,
                .react-calendar__century-view .react-calendar__tile {
                  padding: 12px 10px;
                  border-radius: 8px;
                }
                .has-events {
                  background-color: rgba(0, 122, 255, 0.05);
                }
                .custom-tile-content {
                  width: 100%;
                  height: 100%;
                  display: flex;
                  flex-direction: column;
                  padding: 8px;
                  position: relative;
                }
                .day-number {
                  font-size: 14px;
                  font-weight: 500;
                  margin-bottom: auto;
                  text-align: center;
                  line-height: 1;
                  padding-top: 4px;
                }
                .react-calendar__month-view__days__day--weekend .day-number {
                  color: #ff3b30;
                }
                .react-calendar__tile--now .day-number {
                  background-color: #007aff;
                  color: white;
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  margin: 0 auto;
                }
                .date-selected-bar {
                  position: absolute;
                  top: 34px;
                  left: 8px;
                  right: 8px;
                  height: 3px;
                  background-color: #007aff;
                  border-radius: 1px;
                }
                .event-dots-container {
                  position: absolute;
                  bottom: 12px;
                  left: 0;
                  right: 0;
                  display: flex;
                  gap: 3px;
                  justify-content: center;
                  align-items: center;
                }
                .event-dot {
                  width: 5px;
                  height: 5px;
                  border-radius: 50%;
                }
                .event-more {
                  font-size: 8px;
                  color: #666;
                  margin-left: 2px;
                }
                
                /* 모바일 최적화 */
                @media (max-width: 768px) {
                  .react-calendar__tile {
                    height: 60px;
                  }
                  
                  .custom-tile-content {
                    padding: 4px;
                  }
                  
                  .day-number {
                    font-size: 12px;
                  }
                  
                  .react-calendar__tile--now .day-number {
                    width: 20px;
                    height: 20px;
                  }
                  
                  .date-selected-bar {
                    top: 28px;
                  }
                  
                  .event-dots-container {
                    bottom: 8px;
                  }
                }
                
                /* 이벤트 카테고리 색상 */
                .event-dot-candidate {
                  background-color: ${categoryColors.candidate};
                }
                .event-dot-election {
                  background-color: ${categoryColors.election};
                }
                .event-dot-media {
                  background-color: ${categoryColors.media};
                }
              `}} />
              
              <Calendar 
                onChange={handleDateClick}
                value={date}
                locale="ko-KR"
                tileClassName={({ date, view }) => 
                  getEventsOnDay(date).length > 0 ? 'has-events' : null
                }
                formatDay={() => ''}
                tileContent={({ date: tileDate, view }) => {
                  const day = tileDate.getDate();
                  const eventsOnDay = getEventsOnDay(tileDate);
                  const isSelected = !Array.isArray(date) && date instanceof Date && 
                    tileDate.getFullYear() === date.getFullYear() && 
                    tileDate.getMonth() === date.getMonth() && 
                    tileDate.getDate() === date.getDate();
                  
                  return (
                    <div className="custom-tile-content">
                      <div className="day-number">{day}</div>
                      
                      {/* 선택된 날짜에만 바 표시 */}
                      {isSelected && (
                        <div className="date-selected-bar"></div>
                      )}
                      
                      {/* 이벤트가 있는 날짜는 항상 점으로 표시 */}
                      {eventsOnDay.length > 0 && (
                        <div className="event-dots-container">
                          {[...Array(Math.min(eventsOnDay.length, 3))].map((_, i) => (
                            <div 
                              key={i}
                              className="event-dot"
                             style={{
                                backgroundColor: eventsOnDay[i].isImportant ? '#ff3b30' : 
                                                eventsOnDay[i].category ? categoryColors[eventsOnDay[i].category] : '#007aff'
                              }}
                            ></div>
                          ))}
                          {eventsOnDay.length > 3 && (
                            <span className="event-more">+{eventsOnDay.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                }}
              />
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="event-details-container p-4 bg-white rounded-3 fade-in-up" style={{
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)', 
              border: '1px solid #f1f3f5',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              overflow: 'auto'
            }}>
              {date && !Array.isArray(date) ? (
                <>
                    <div className="mb-3">
                    <small className="text-secondary d-block mb-1">{date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</small>
                    <h4 className="mb-0">{date.toLocaleDateString('ko-KR', { weekday: 'long' })}</h4>
                  </div>
                  
                  {(() => {
                    const eventsOnSelectedDay = getEventsOnDay(date);
                    
                    if (eventsOnSelectedDay.length > 0) {
                      return (
                  <div>
                          <p className="text-secondary mb-3 small">{eventsOnSelectedDay.length}개의 일정</p>
                          {eventsOnSelectedDay
                            .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
                        .map(event => (
                              <div 
                                key={event._id} 
                                className="event-item mb-3 p-3 rounded-3 shadow-sm"
                                style={{
                                  border: '1px solid #f1f3f5',
                                  backgroundColor: selectedEvent?._id === event._id ? 'rgba(0, 122, 255, 0.05)' : 'white',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s'
                                }}
                              onClick={() => setSelectedEvent(event)}
                              >
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                  <h5 className="event-title mb-1 fs-5">
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
                                
                                <div className="d-flex align-items-center text-muted small mb-2">
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
                                
                                {selectedEvent?._id === event._id && (
                                  <p className="text-secondary small mt-2 mb-0">{event.description}</p>
                                )}
                                
                                {/* 선택된 이벤트에만 캘린더 추가 버튼 표시 */}
                                {selectedEvent?._id === event._id && (
                                  <div className="d-flex mt-3 gap-2 flex-wrap">
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
                                      title="애플 캘린더에 추가"
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
                                        data-bs-popper-config='{"placement": "top-end", "strategy": "fixed"}'
                                        aria-expanded="false"
                                        title="SNS로 공유하기"
                                        style={{
                                          fontSize: '0.75rem',
                                          borderRadius: '4px'
                                        }}
                                      >
                                        <i className="bi bi-share me-1"></i> 공유
                                      </button>
                                      <ul className="dropdown-menu dropdown-menu-end dropup-menu">
                                        <li>
                                          <a 
                                            className="dropdown-item" 
                                            href="#"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              if (typeof window !== 'undefined') {
                                                const url = window.location.href;
                                                const text = `[권영국 후보 일정] ${event.title} - ${new Date(event.start).toLocaleString('ko-KR')}, ${event.location}`;
                                                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer');
                                              }
                                            }}
                                          >
                                            <i className="bi bi-twitter me-2"></i> 트위터
                                          </a>
                                        </li>
                                        <li>
                                          <a 
                                            className="dropdown-item" 
                                            href="#"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              if (typeof window !== 'undefined') {
                                                const url = window.location.href;
                                                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer');
                                              }
                                            }}
                                          >
                                            <i className="bi bi-facebook me-2"></i> 페이스북
                                          </a>
                                        </li>
                                        <li>
                                          <button 
                                            className="dropdown-item"
                                            onClick={() => {
                                              if (typeof window !== 'undefined') {
                                                const text = `[권영국 후보 일정] ${event.title}\n📅 ${new Date(event.start).toLocaleString('ko-KR')}\n📍 ${event.location}\n\n${event.description || ''}`;
                                                navigator.clipboard.writeText(text)
                                                  .then(() => alert('인스타그램에는 직접 공유할 수 없습니다. 일정 정보가 클립보드에 복사되었습니다. 인스타그램 앱에 붙여넣기 해주세요.'))
                                                  .catch(err => console.error('클립보드 복사 실패:', err));
                                              }
                                            }}
                                          >
                                            <i className="bi bi-instagram me-2"></i> 인스타그램
                                          </button>
                                        </li>
                                        <li>
                                          <a 
                                            className="dropdown-item" 
                                            href="#"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              if (typeof window !== 'undefined') {
                                                const url = window.location.href;
                                                window.open(`https://story.kakao.com/share?url=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer');
                                              }
                                            }}
                                          >
                                            <i className="bi bi-chat-fill me-2"></i> 카카오톡
                                          </a>
                                        </li>
                                        <li>
                                          <a 
                                            className="dropdown-item" 
                                            href="#"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              if (typeof window !== 'undefined') {
                                                const url = window.location.href;
                                                const text = `[권영국 후보 일정] ${event.title} - ${new Date(event.start).toLocaleString('ko-KR')}, ${event.location}`;
                                                window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
                                              }
                                            }}
                                          >
                                            <i className="bi bi-telegram me-2"></i> 텔레그램
                                          </a>
                                        </li>
                                        <li>
                                          <a 
                                            className="dropdown-item" 
                                            href="#"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              if (typeof window !== 'undefined') {
                                                const text = `[권영국 후보 일정] ${event.title} - ${new Date(event.start).toLocaleString('ko-KR')}, ${event.location} ${window.location.href}`;
                                                window.location.href = `sms:?&body=${encodeURIComponent(text)}`;
                                              }
                                            }}
                                          >
                                            <i className="bi bi-chat-text me-2"></i> 문자메시지
                                          </a>
                                        </li>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li>
                                          <button 
                                            className="dropdown-item" 
                                            onClick={() => {
                                              if (typeof window !== 'undefined') {
                                                const text = `[권영국 후보 일정] ${event.title}\n📅 ${new Date(event.start).toLocaleString('ko-KR')}\n📍 ${event.location}\n\n${event.description || ''}`;
                                                navigator.clipboard.writeText(text)
                                                  .then(() => alert('일정 정보가 클립보드에 복사되었습니다.'))
                                                  .catch(err => console.error('클립보드 복사 실패:', err));
                                              }
                                            }}
                                          >
                                            <i className="bi bi-clipboard me-2"></i> 클립보드에 복사
                                          </button>
                        </li>
                  </ul>
                </div>
              </div>
            )}
                              </div>
                            ))
                          }
                        </div>
                      );
                    } else {
                      return (
                        <div className="text-center text-secondary">
                          <i className="bi bi-calendar-x fs-1 mb-3"></i>
                          <p>이 날짜에는 일정이 없습니다.</p>
                        </div>
                      );
                    }
                  })()}
                </>
              ) : (
                <div className="text-center text-secondary">
                  <i className="bi bi-calendar-event fs-1 mb-3" style={{ color: accentColor }}></i>
                  <p>일정을 확인하려면 달력에서 날짜를 선택하세요.</p>
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
      `}</style>
    </div>
  );
}