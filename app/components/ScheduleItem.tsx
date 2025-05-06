'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// AddToCalendarButton 컴포넌트를 동적으로 불러옵니다
const AddToCalendarButton = dynamic(() => import('./AddToCalendarButton'), { ssr: false });

export type CalendarEvent = {
  title: string;
  start: string;
  end: string;
  location: string;
  description: string;
}

interface ScheduleItemProps {
  title: string; 
  date: string; 
  time: string;
  location: string;
  type: string;
  isPast?: boolean;
  calendarEvent?: CalendarEvent;
}

export default function ScheduleItem({
  title, 
  date, 
  time, 
  location, 
  type, 
  isPast = false,
  calendarEvent
}: ScheduleItemProps) {
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
        <div className="flex mt-2">
          <AddToCalendarButton 
            name={title}
            startDate={calendarEvent.start.split('T')[0]}
            endDate={calendarEvent.end.split('T')[0]}
            startTime={calendarEvent.start.includes('T') ? calendarEvent.start.split('T')[1].substring(0, 5) : ""}
            endTime={calendarEvent.end.includes('T') ? calendarEvent.end.split('T')[1].substring(0, 5) : ""}
            location={location}
            description={calendarEvent.description}
            options={['Apple', 'Google', 'Outlook.com']}
            timeZone="Asia/Seoul"
            label="캘린더에 추가"
          />
        </div>
      )}
    </div>
  );
} 