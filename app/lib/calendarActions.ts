'use server';

import { google } from 'googleapis';
import { CalendarEvent } from '../components/CustomCalendar';

// 캘린더 ID 설정 (권영국 후보 공개 캘린더 ID)
const CALENDAR_ID = 'kyk2027@gmail.com';

// 구글 캘린더에서 이벤트 가져오기
export async function getGoogleCalendarEvents(): Promise<CalendarEvent[]> {
  try {
    // API 키 방식을 사용하여 인증 (공개 캘린더에만 접근 가능)
    const auth = new google.auth.GoogleAuth({
      apiKey: process.env.GOOGLE_API_KEY,
      scopes: ['https://www.googleapis.com/auth/calendar.readonly']
    });

    const calendar = google.calendar({ version: 'v3', auth });
    
    // 현재 날짜부터 6개월 후까지의 이벤트 조회
    const sixMonthsLater = new Date();
    sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
    
    const response = await calendar.events.list({
      calendarId: CALENDAR_ID,
      timeMin: new Date().toISOString(),
      timeMax: sixMonthsLater.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
      maxResults: 100
    });
    
    const events = response.data.items || [];
    
    // 구글 캘린더 이벤트를 CustomCalendar 컴포넌트 포맷으로 변환
    return events.map((event) => {
      const startDateTime = event.start?.dateTime 
        ? new Date(event.start.dateTime) 
        : event.start?.date 
          ? new Date(event.start.date)
          : new Date();
      
      const endDateTime = event.end?.dateTime 
        ? new Date(event.end.dateTime) 
        : event.end?.date 
          ? new Date(event.end.date)
          : new Date();
      
      return {
        id: event.id || `google-event-${Math.random().toString(36).substring(2, 9)}`,
        title: event.summary || '제목 없음',
        start: startDateTime,
        end: endDateTime,
        location: event.location || '',
        description: event.description || '',
        type: 'google', // 구글 캘린더에서 가져온 이벤트임을 표시
        isHighlighted: Boolean(event.colorId && parseInt(event.colorId) > 5) // 색상 ID가 높은 이벤트는 중요 이벤트로 간주
      };
    });
  } catch (error) {
    console.error('구글 캘린더 이벤트 조회 중 오류 발생:', error);
    return [];
  }
} 