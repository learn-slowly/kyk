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
};

type CalendarValue = Date | [Date | null, Date | null] | null;

export default function EventsClient({ events }: { events: Event[] }) {
  const [viewMode, setViewMode] = useState<'list' | 'month'>('list');
  const [date, setDate] = useState<CalendarValue>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  
  // 일정을 날짜별로 그룹화
  const groupedEvents = events.reduce((acc, event) => {
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
  
  // 달력에 표시할 날짜에 이벤트가 있는지 확인하는 함수
  const hasEventOnDay = (date: Date) => {
    return events.some(event => 
      isSameDay(new Date(event.start), date)
    );
  };
  
  // 날짜 클릭 시 해당 날짜의 이벤트 표시
  const handleDateClick = (value: CalendarValue) => {
    if (!value || Array.isArray(value)) return;
    
    const clickedDate = value;
    const eventsOnDay = events.filter(event => 
      isSameDay(new Date(event.start), clickedDate)
    );
    
    if (eventsOnDay.length > 0) {
      setSelectedEvent(eventsOnDay[0]);
    } else {
      setSelectedEvent(null);
    }
  };
  
  // 그라데이션 색상 스타일
  const gradientStyle = {
    background: 'linear-gradient(90deg, #FF0000 0%, #FFed00 50%, #00a366 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  };
  
  // 버튼 그라데이션 스타일
  const gradientButtonStyle = {
    background: 'linear-gradient(90deg, #FF0000 0%, #FFed00 50%, #00a366 100%)',
    border: 'none',
    color: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };
  
  return (
    <div className="container py-5">
      <div className="row mb-5">
        <div className="col-12">
          <h1 className="display-4 fw-bold mb-4" style={gradientStyle}>
            권영국 후보 일정
          </h1>
          <p className="lead mb-5">대선 캠페인 공식 일정과 주요 행사를 확인하세요.</p>
          
          {/* 뷰 모드 선택 */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="btn-group shadow-sm">
              <button 
                className={`btn ${viewMode === 'list' ? 'text-white' : 'btn-outline-primary'}`}
                onClick={() => setViewMode('list')}
                style={viewMode === 'list' ? gradientButtonStyle : {}}
              >
                <i className="bi bi-list-ul me-2"></i> 목록보기
              </button>
              <button 
                className={`btn ${viewMode === 'month' ? 'text-white' : 'btn-outline-primary'}`}
                onClick={() => setViewMode('month')}
                style={viewMode === 'month' ? gradientButtonStyle : {}}
              >
                <i className="bi bi-calendar3 me-2"></i> 달력보기
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* 목록 뷰 */}
      {viewMode === 'list' && (
        <div className="timeline position-relative pb-5">
          {sortedDates.length > 0 ? (
            sortedDates.map((date, index) => (
              <div key={date} className="row g-0 mb-4 fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="col-md-2 text-md-end pe-md-4 mb-3 mb-md-0">
                  <div className="p-3 bg-white rounded shadow-sm text-center position-relative" style={{overflow: 'hidden'}}>
                    {/* 날짜 배경 장식 */}
                    <div 
                      className="position-absolute top-0 start-0 w-100" 
                      style={{
                        height: '4px', 
                        background: 'linear-gradient(90deg, #FF0000 0%, #FFed00 50%, #00a366 100%)'
                      }}
                    ></div>
                    <h5 className="mb-0">{new Date(date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}</h5>
                    <small className="text-muted">{new Date(date).toLocaleDateString('ko-KR', { weekday: 'long' })}</small>
                  </div>
                </div>
                <div className="col-md-10">
                  {groupedEvents[date].map((event, eventIndex) => (
                    <div 
                      key={event._id} 
                      className={`card mb-3 border-0 shadow-sm hover-card fade-in-up`}
                      style={{
                        animationDelay: `${(index * 0.1) + (eventIndex * 0.05)}s`,
                        borderRadius: '12px',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        background: event.isImportant 
                          ? 'linear-gradient(135deg, rgba(255,0,0,0.03) 0%, rgba(255,237,0,0.03) 50%, rgba(0,163,102,0.03) 100%)' 
                          : 'white',
                        borderLeft: event.isImportant 
                          ? '4px solid #FF0000' 
                          : 'none'
                      }}
                    >
                      <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h5 className="card-title mb-0 fs-4">
                            {event.isImportant && <i className="bi bi-star-fill text-danger me-2"></i>}
                            {event.title}
                          </h5>
                          <span className="badge" style={{
                            background: 'linear-gradient(90deg, #FF0000 0%, #FFed00 50%, #00a366 100%)',
                            color: 'white',
                            padding: '0.5rem 0.75rem',
                            borderRadius: '20px'
                          }}>
                            {new Date(event.start).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                            ~
                            {new Date(event.end).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="card-text mb-3 text-secondary">{event.description}</p>
                        <div className="d-flex align-items-center text-muted">
                          <i className="bi bi-geo-alt-fill me-2"></i>
                          <span>{event.location}</span>
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
      
      {/* 달력 뷰 */}
      {viewMode === 'month' && (
        <div className="row">
          <div className="col-md-8">
            <div className="calendar-container shadow rounded p-4 bg-white fade-in">
              <style jsx global>{`
                .react-calendar {
                  width: 100%;
                  border: none;
                  font-family: inherit;
                }
                .react-calendar__tile {
                  height: 90px;
                  display: flex;
                  flex-direction: column;
                  justify-content: flex-start;
                  align-items: flex-start;
                  padding: 8px;
                  transition: all 0.2s ease;
                }
                .react-calendar__tile:hover {
                  background: rgba(0, 163, 102, 0.08);
                }
                .react-calendar__tile--now {
                  background: rgba(255, 237, 0, 0.15);
                  border-radius: 8px;
                }
                .react-calendar__tile--active {
                  background: rgba(0, 163, 102, 0.15) !important;
                  color: black;
                  border-radius: 8px;
                }
                .react-calendar__tile--active:enabled:hover,
                .react-calendar__tile--active:enabled:focus {
                  background: rgba(0, 163, 102, 0.25) !important;
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
                  background: linear-gradient(90deg, #FF0000, #FFed00, #00a366);
                  border-radius: 50%;
                }
                .react-calendar__month-view__weekdays__weekday {
                  padding: 1em;
                  font-weight: bold;
                  text-transform: uppercase;
                  font-size: 0.8em;
                  color: #666;
                }
                .react-calendar__month-view__weekdays__weekday abbr {
                  text-decoration: none;
                }
                .react-calendar__navigation {
                  margin-bottom: 1em;
                }
                .react-calendar__navigation button {
                  min-width: 44px;
                  padding: 0.5em;
                  border-radius: 8px;
                  transition: background-color 0.2s ease;
                }
                .react-calendar__navigation button:enabled:hover,
                .react-calendar__navigation button:enabled:focus {
                  background-color: rgba(0, 163, 102, 0.1);
                }
                .has-event {
                  font-weight: bold;
                }
                .fade-in {
                  animation: fadeIn 0.5s ease-in-out;
                }
                .fade-in-up {
                  animation: fadeInUp 0.5s ease-in-out forwards;
                  opacity: 0;
                }
                @keyframes fadeIn {
                  from { opacity: 0; }
                  to { opacity: 1; }
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
                .hover-card:hover {
                  transform: translateY(-3px);
                  box-shadow: 0 8px 15px rgba(0,0,0,0.1) !important;
                }
              `}</style>
              
              <Calendar 
                onChange={handleDateClick}
                value={date}
                locale="ko"
                formatDay={(locale, date) => format(date, 'd')}
                tileClassName={({ date, view }) => 
                  view === 'month' && hasEventOnDay(date) ? 'has-event' : null
                }
                tileContent={({ date, view }) => {
                  if (view !== 'month') return null;
                  
                  const matchingEvents = events.filter(event => 
                    isSameDay(new Date(event.start), date)
                  );
                  
                  return (
                    <div className="w-100 text-start mt-2">
                      {matchingEvents.slice(0, 2).map((event, i) => (
                        <div key={i} className="small text-truncate mb-1 py-1 px-2 rounded" 
                             style={{
                               fontSize: '0.7rem', 
                               backgroundColor: event.isImportant ? 'rgba(255, 0, 0, 0.1)' : 'rgba(0, 163, 102, 0.05)',
                               color: event.isImportant ? '#d63031' : '#2d3436',
                               borderLeft: event.isImportant ? '3px solid #ff0000' : 'none',
                             }}>
                          {event.isImportant && <i className="bi bi-star-fill me-1"></i>}
                          {event.title}
                        </div>
                      ))}
                      {matchingEvents.length > 2 && (
                        <div className="small text-muted mt-1" style={{fontSize: '0.7rem'}}>
                          <span className="badge bg-secondary">+{matchingEvents.length - 2}개</span>
                        </div>
                      )}
                    </div>
                  );
                }}
              />
            </div>
          </div>
          
          <div className="col-md-4 mt-4 mt-md-0">
            <div className="card shadow border-0 rounded-3 mb-4 fade-in" style={{animationDelay: '0.2s'}}>
              <div className="card-header bg-white p-3 border-0">
                <h5 className="mb-0 fw-bold">
                  {date instanceof Date
                    ? format(date, 'yyyy년 MM월 dd일')
                    : '일정 상세보기'}
                </h5>
              </div>
              <div className="card-body">
                {selectedEvent ? (
                  <div className="fade-in-up">
                    <h4 className="card-title mb-3">
                      {selectedEvent.isImportant && <i className="bi bi-star-fill text-danger me-2"></i>}
                      {selectedEvent.title}
                    </h4>
                    <div className="mb-4 p-3 bg-light rounded">
                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-clock me-2 text-primary"></i>
                        <span>{new Date(selectedEvent.start).toLocaleString('ko-KR')}</span>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-clock-fill me-2 text-primary"></i>
                        <span>{new Date(selectedEvent.end).toLocaleString('ko-KR')}</span>
                      </div>
                      <div className="d-flex align-items-center">
                        <i className="bi bi-geo-alt-fill me-2 text-primary"></i>
                        <span>{selectedEvent.location}</span>
                      </div>
                    </div>
                    <p className="card-text">{selectedEvent.description}</p>
                    
                    {/* 공유 버튼 */}
                    <div className="mt-4 d-flex gap-2">
                      <button className="btn btn-sm btn-outline-primary">
                        <i className="bi bi-calendar-plus me-1"></i> 내 캘린더에 추가
                      </button>
                      <button className="btn btn-sm btn-outline-secondary">
                        <i className="bi bi-share me-1"></i> 공유하기
                      </button>
                    </div>
                  </div>
                ) : date instanceof Date && hasEventOnDay(date) ? (
                  <div>
                    <p className="mb-3 text-secondary">이 날의 일정을 확인하세요:</p>
                    <ul className="list-group list-group-flush">
                      {events
                        .filter(event => isSameDay(new Date(event.start), date))
                        .map(event => (
                          <li key={event._id} 
                              className="list-group-item px-0 py-3 border-bottom hover-card" 
                              onClick={() => setSelectedEvent(event)}
                              style={{
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                borderRadius: '8px',
                                margin: '0 0 8px 0'
                              }}>
                            <div className="d-flex align-items-center">
                              <div className="text-center me-3" 
                                  style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    background: 'linear-gradient(90deg, rgba(255,0,0,0.1), rgba(255,237,0,0.1), rgba(0,163,102,0.1))'
                                  }}>
                                <small className="text-muted">
                                  {new Date(event.start).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                                </small>
                              </div>
                              <div>
                                <span className={event.isImportant ? 'fw-bold' : ''}>
                                  {event.isImportant && <i className="bi bi-star-fill text-danger me-2"></i>}
                                  {event.title}
                                </span>
                                <small className="d-block text-muted mt-1">{event.location}</small>
                              </div>
                            </div>
                          </li>
                        ))}
                    </ul>
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <div className="mb-3">
                      <i className="bi bi-calendar-check fs-1 text-muted"></i>
                    </div>
                    <p className="text-secondary">
                      선택한 날짜에 일정이 없습니다.<br />
                      일정이 있는 날짜를 선택해 주세요.
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {events.filter(event => event.isImportant).length > 0 && (
              <div className="card shadow border-0 rounded-3 mt-4 fade-in" style={{animationDelay: '0.3s'}}>
                <div className="card-header border-0" style={{
                  background: 'linear-gradient(90deg, #FF0000 0%, #FFed00 50%, #00a366 100%)',
                  color: 'white'
                }}>
                  <h5 className="mb-0 fw-bold"><i className="bi bi-star-fill me-2"></i>중요 일정</h5>
                </div>
                <div className="card-body p-0">
                  <ul className="list-group list-group-flush">
                    {events
                      .filter(event => event.isImportant)
                      .slice(0, 3)
                      .map((event, idx) => (
                        <li key={event._id} 
                            className="list-group-item px-3 py-3 hover-card fade-in-up"
                            style={{
                              cursor: 'pointer',
                              animationDelay: `${0.4 + (idx * 0.1)}s`,
                              transition: 'all 0.2s'
                            }}
                            onClick={() => {
                              setDate(new Date(event.start));
                              setSelectedEvent(event);
                            }}>
                          <span className="badge bg-danger float-end">중요</span>
                          <small className="text-muted d-block mb-1">
                            {new Date(event.start).toLocaleDateString('ko-KR')}
                          </small>
                          <span className="fw-bold">{event.title}</span>
                          <small className="d-block text-muted mt-1">{event.location}</small>
                        </li>
                      ))}
                  </ul>
                </div>
                {events.filter(event => event.isImportant).length > 3 && (
                  <div className="card-footer bg-white text-center border-0 py-3">
                    <button className="btn btn-sm" style={gradientButtonStyle}>
                      더 보기 <i className="bi bi-chevron-right"></i>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}