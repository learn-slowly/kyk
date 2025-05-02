'use client';

import { useState, useEffect, useMemo } from 'react';
import { Calendar, Views, View, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import 'moment/locale/ko';

// 한국어 설정
moment.locale('ko');

// Moment localizer 설정
const localizer = momentLocalizer(moment);

// 이벤트 타입 정의
export type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  location?: string;
  description?: string;
  type?: string; // 이벤트 타입 (speech, policy 등)
  isHighlighted?: boolean; // 주요 일정 여부
  allDay?: boolean; // 종일 일정 여부
};

type CustomCalendarProps = {
  events: CalendarEvent[];
  onSelectEvent?: (event: CalendarEvent) => void;
};

// 툴바 컴포넌트 타입 정의
interface ToolbarProps {
  date: Date;
  onNavigate: (action: 'PREV' | 'NEXT' | 'TODAY', date?: Date) => void;
  onView: (view: View) => void;
}

// 헤더 컴포넌트 타입 정의
interface HeaderProps {
  date?: Date;
  label: string;
  localizer?: {
    format: (date: Date, format: string) => string;
  };
}

// 날짜 셀 컴포넌트 타입 정의
interface DateCellProps {
  children: React.ReactNode;
  value: Date | { toDate(): Date };
}

export default function CustomCalendar({ events, onSelectEvent }: CustomCalendarProps) {
  // 뷰 설정
  const [view, setView] = useState<View>(Views.DAY);
  const [date, setDate] = useState(new Date());
  const [startDate, setStartDate] = useState<Date>(new Date()); // 현재 보여지는 시작일

  // 화면 크기에 따라 뷰 변경 및 날짜 초기화
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      // 모바일에서는 일간 뷰, 데스크탑에서는 주간 뷰
      setView(isMobile ? Views.DAY : Views.WEEK);
      resetStartDate(new Date()); // 오늘 날짜로 시작 날짜 재설정
    };

    // 초기 실행 및 리사이즈 이벤트 리스너 등록
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 추가: 컴포넌트 마운트 시 항상 오늘 날짜로 초기화
  useEffect(() => {
    resetStartDate(new Date());
  }, []);

  // 시작 날짜 설정 함수
  const resetStartDate = (date: Date) => {
    const newStartDate = new Date(date);
    setStartDate(newStartDate);
    setDate(newStartDate);
  };

  // 이벤트 스타일 적용
  const eventStyleGetter = (event: CalendarEvent) => {
    // 이벤트 타입에 따른 색상 변경
    let style: React.CSSProperties = {
      background: 'linear-gradient(90deg, #FF0000 0%, #FFFF00 50%, #00FF00 100%)',
      color: 'white',
      borderRadius: '4px',
      border: 'none',
      fontWeight: 'bold',
    };

    // 주요 일정은 더 강조
    if (event.isHighlighted) {
      style = {
        ...style,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.15)',
        transform: 'scale(1.02)',
        zIndex: 2,
      };
    }

    return {
      style,
    };
  };

  // 툴바 커스터마이징
  const CustomToolbar = (toolbar: ToolbarProps) => {
    const goToBack = () => {
      toolbar.onNavigate('PREV');
    };

    const goToNext = () => {
      toolbar.onNavigate('NEXT');
    };

    const goToCurrent = () => {
      const today = new Date();
      resetStartDate(today);
      toolbar.onNavigate('TODAY', today);
    };

    const labelClass = "text-xl font-bold";
    const buttonClass = "bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity";
    const todayButtonClass = "bg-white text-gray-800 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors ml-2";

    // 날짜 범위 표시
    const dateRangeLabel = 
      view === Views.DAY ? moment(toolbar.date).format('YYYY년 MM월 DD일 (ddd)') :
      view === Views.WEEK ? `${moment(toolbar.date).startOf('week').format('YYYY년 MM월 DD일')} - ${moment(toolbar.date).endOf('week').format('MM월 DD일')}` :
      moment(toolbar.date).format('YYYY년 MM월');

    return (
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex justify-between items-center flex-wrap">
          <div className={labelClass}>
            {dateRangeLabel}
          </div>
          <div className="flex space-x-2">
            <button onClick={goToBack} className={buttonClass}>
              이전
            </button>
            <button onClick={goToCurrent} className={todayButtonClass}>
              오늘
            </button>
            <button onClick={goToNext} className={buttonClass}>
              다음
            </button>
          </div>
        </div>
        
        {/* 뷰 선택 버튼 */}
        <div className="flex space-x-2 mt-2">
          <button
            onClick={() => {
              setView(Views.DAY);
              toolbar.onView(Views.DAY);
            }}
            className={`text-sm px-4 py-1 rounded ${view === Views.DAY ? 'bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            일간
          </button>
          <button
            onClick={() => {
              setView(Views.WEEK);
              toolbar.onView(Views.WEEK);
            }}
            className={`text-sm px-4 py-1 rounded ${view === Views.WEEK ? 'bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            주간
          </button>
          <button
            onClick={() => {
              setView(Views.MONTH);
              toolbar.onView(Views.MONTH);
            }}
            className={`text-sm px-4 py-1 rounded ${view === Views.MONTH ? 'bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            월간
          </button>
        </div>
      </div>
    );
  };

  // 주간 헤더 컴포넌트 커스터마이징
  const CustomWeekHeader = (props: HeaderProps) => {
    const { date, localizer } = props;
    
    if (!date || !localizer) return null;

    // 오늘 날짜와 비교
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const currentDate = new Date(date);
    currentDate.setHours(0, 0, 0, 0);
    
    const isToday = 
      currentDate.getDate() === today.getDate() && 
      currentDate.getMonth() === today.getMonth() && 
      currentDate.getFullYear() === today.getFullYear();
    
    // 표시할 날짜 포맷 (주간 뷰)
    return (
      <div className={`text-center py-2 font-semibold ${isToday ? 'bg-gradient-to-r from-red-50 via-yellow-50 to-green-50' : ''} border-b`}>
        <div className="text-base">{moment(date).format('MM/DD')}</div>
        <div className="text-xs text-gray-600">{localizer.format(date, 'ddd')}</div>
      </div>
    );
  };

  // 헤더 컴포넌트 커스터마이징
  const CustomHeader = ({ label }: { label: string }) => {
    // 일별 뷰일 때는 날짜 표시
    if (view === Views.DAY) {
      const today = new Date(date);
      
      return (
        <div className="text-center py-2 font-semibold bg-gradient-to-r from-red-50 via-yellow-50 to-green-50 border-b">
          <div className="text-base">{moment(today).format('MM/DD')}</div>
          <div className="text-xs text-gray-600">({moment(today).format('ddd')})</div>
        </div>
      );
    }
    
    // 월별 뷰에서는 월 이름만 표시
    if (view === Views.MONTH) {
      return (
        <div className="text-center py-2 font-semibold">
          {moment(new Date(date)).format('YYYY년 MM월')}
        </div>
      );
    }
    
    // 다른 뷰에서는 기본 레이블 표시
    return (
      <div className="text-center py-2 font-semibold bg-gradient-to-r from-red-50 via-yellow-50 to-green-50">
        {label}
      </div>
    );
  };

  // 날짜 셀 커스터마이징
  const CustomDateCell = (props: DateCellProps) => {
    // react-big-calendar에서 dateCellWrapper 컴포넌트의 props 구조
    const { children, value } = props;
    const today = new Date();
    
    // value는 moment 객체이므로 toDate()로 Date 객체로 변환
    // 혹은 value가 Date 객체인 경우를 대비하여 안전하게 처리
    const cellDate = typeof (value as { toDate?: () => Date }).toDate === 'function' 
      ? (value as { toDate(): Date }).toDate() 
      : value as Date;
    
    // 날짜가 유효한지 확인
    const isValidDate = cellDate instanceof Date && !isNaN(cellDate.getTime());
    
    // 오늘 날짜인지 확인
    const isToday = isValidDate && 
      cellDate.getDate() === today.getDate() && 
      cellDate.getMonth() === today.getMonth() && 
      cellDate.getFullYear() === today.getFullYear();
    
    return (
      <div className={`relative h-full ${isToday ? 'bg-gradient-to-r from-red-50 via-yellow-50 to-green-50' : ''}`}>
        {children}
      </div>
    );
  };

  // 시간 열 헤더 커스터마이징
  const CustomTimeGutterHeader = () => {
    return (
      <div className="text-center py-2 font-semibold bg-gray-100 border-b">
        시간
      </div>
    );
  };

  const { formats, messages } = useMemo(() => ({
    formats: {
      dayHeaderFormat: (date: Date) => moment(date).format('MM월 DD일 (ddd)'),
      dayRangeHeaderFormat: ({ start, end }: { start: Date, end: Date }) => {
        return `${moment(start).format('MM월 DD일')} - ${moment(end).format('MM월 DD일')}`;
      },
      timeGutterFormat: (date: Date) => moment(date).format('HH:mm'),
      eventTimeRangeFormat: ({ start, end }: { start: Date, end: Date }) => 
        `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`,
    },
    messages: {
      today: '오늘',
      previous: '이전',
      next: '다음',
      month: '월간',
      week: '주간',
      day: '일간',
      agenda: '일정',
      allDay: '종일',
      date: '날짜',
      time: '시간',
      event: '일정',
      noEventsInRange: '이 기간에 일정이 없습니다.',
    },
  }), [view]); // view에 따라 포맷이 달라질 수 있으므로 view 의존성 추가, startDate는 실제로 사용되지 않으므로 제거

  return (
    <div className="custom-calendar-container bg-white rounded-xl shadow-lg p-4 md:p-6">
      <style jsx global>{`
        .rbc-calendar {
          font-family: 'Noto Sans KR', sans-serif;
        }
        .rbc-header {
          padding: 8px;
          font-weight: bold;
          border-bottom: 1px solid #e5e7eb;
        }
        .rbc-today {
          background-color: rgba(255, 255, 0, 0.05);
        }
        .rbc-event {
          padding: 4px 6px;
        }
        .rbc-event-label {
          font-size: 12px;
        }
        .rbc-event-content {
          font-size: 14px;
        }
        /* 모바일에서의 캘린더 높이 조정 */
        @media (max-width: 768px) {
          .rbc-month-view, .rbc-time-view {
            height: 500px !important;
          }
        }
        /* 주간 뷰 간격 수정 */
        .rbc-time-slot {
          min-height: 24px;
        }
        /* 일정 목록 뷰 스타일링 */
        .rbc-agenda-view table.rbc-agenda-table {
          width: 100%;
        }
        .rbc-agenda-view table.rbc-agenda-table thead > tr > th {
          padding: 8px 4px;
          background-color: #f9fafb;
        }
        .rbc-agenda-view table.rbc-agenda-table tbody > tr > td {
          padding: 4px;
        }
        /* 종일 일정 영역 스타일링 */
        .rbc-allday-cell {
          position: relative;
        }
        /* 주간 뷰에서 요일 헤더 개선 */
        .rbc-time-view .rbc-header {
          min-height: 50px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
      `}</style>
      
      <Calendar
        localizer={localizer}
        events={events}
        defaultView={Views.DAY}
        view={view}
        views={[Views.DAY, Views.WEEK, Views.MONTH, Views.AGENDA]}
        step={30}
        timeslots={2}
        showMultiDayTimes
        startAccessor="start"
        endAccessor="end"
        style={{ height: view === Views.MONTH ? 650 : 550 }}
        onSelectEvent={onSelectEvent}
        eventPropGetter={eventStyleGetter}
        components={{
          toolbar: CustomToolbar,
          header: view === Views.WEEK ? CustomWeekHeader : CustomHeader,
          dateCellWrapper: CustomDateCell,
          month: {
            header: ({ date, label }) => {
              // 요일 헤더 (일~토) - 월별 뷰의 첫번째 행
              const isWeekday = ['일', '월', '화', '수', '목', '금', '토'].includes(label);
              return (
                <div className="text-center py-2 font-semibold">
                  {isWeekday ? label : moment(date).format('YYYY년 MM월')}
                </div>
              );
            }
          },
          timeGutterHeader: CustomTimeGutterHeader
        }}
        formats={{
          ...formats,
          dayHeaderFormat: (date: Date) => {
            // 일간 뷰의 헤더 포맷을 지정
            if (view === Views.DAY) {
              return moment(date).format('YYYY년 MM월 DD일 (ddd)');
            }
            return moment(date).format('MM월 DD일 (ddd)');
          },
          dayFormat: (date: Date) => moment(date).format('MM/DD (ddd)'),
        }}
        messages={messages}
        onView={(newView) => setView(newView)}
        onNavigate={(newDate) => {
          setDate(newDate);
          setStartDate(newDate);
        }}
        min={new Date(new Date().setHours(5, 0, 0))}
        max={new Date(new Date().setHours(23, 59, 59))}
        date={date}
      />
    </div>
  );
} 