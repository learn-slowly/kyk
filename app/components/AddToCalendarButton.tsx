'use client';

import React, { useState } from 'react';

interface AddToCalendarButtonProps {
  name: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  description?: string;
  timeZone?: string;
  label?: string;
  options?: Array<'Apple' | 'Google' | 'Outlook.com' | 'Yahoo'>;
}

export default function AddToCalendarButton({
  name,
  startDate,
  endDate,
  startTime = '',
  endTime = '',
  location = '',
  description = '',
  timeZone = 'Asia/Seoul',
  label = '캘린더에 추가',
  options = ['Apple', 'Google', 'Outlook.com', 'Yahoo']
}: AddToCalendarButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  // 시작 및 종료 시간의 전체 ISO 문자열 생성
  const formatDate = (date: string, time = '') => {
    const fullDate = date.replace(/-/g, '');
    return time ? `${fullDate}T${time.replace(':', '')}00` : fullDate;
  };

  // 캘린더 링크 생성
  const calendarLinks = {
    Google: () => {
      const startDateTime = startTime 
        ? `${startDate}T${startTime}:00` 
        : startDate;
      const endDateTime = endTime 
        ? `${endDate}T${endTime}:00` 
        : endDate;
      
      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(name)}&dates=${formatDate(startDate, startTime)}/${formatDate(endDate, endTime)}&location=${encodeURIComponent(location)}&details=${encodeURIComponent(description)}&ctz=${encodeURIComponent(timeZone)}`;
    },
    Apple: () => {
      const startDateTime = startTime 
        ? `${startDate.replace(/-/g, '')}T${startTime.replace(':', '')}00` 
        : startDate.replace(/-/g, '');
      const endDateTime = endTime 
        ? `${endDate.replace(/-/g, '')}T${endTime.replace(':', '')}00` 
        : endDate.replace(/-/g, '');
      
      return `data:text/calendar;charset=utf-8,BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${startDateTime}
DTEND:${endDateTime}
SUMMARY:${name}
LOCATION:${location}
DESCRIPTION:${description}
END:VEVENT
END:VCALENDAR`.replace(/\n/g, '%0A');
    },
    'Outlook.com': () => {
      const startDateTime = startTime 
        ? `${startDate}T${startTime}:00` 
        : startDate;
      const endDateTime = endTime 
        ? `${endDate}T${endTime}:00` 
        : endDate;
      
      return `https://outlook.live.com/calendar/deeplink/compose?subject=${encodeURIComponent(name)}&startdt=${startDateTime}&enddt=${endDateTime}&location=${encodeURIComponent(location)}&body=${encodeURIComponent(description)}`;
    },
    Yahoo: () => {
      const startDateTime = startTime 
        ? `${startDate}T${startTime}:00` 
        : startDate;
      const endDateTime = endTime 
        ? `${endDate}T${endTime}:00` 
        : endDate;
      
      return `https://calendar.yahoo.com/?v=60&title=${encodeURIComponent(name)}&st=${formatDate(startDate, startTime)}&et=${formatDate(endDate, endTime)}&in_loc=${encodeURIComponent(location)}&desc=${encodeURIComponent(description)}`;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200 focus:outline-none flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {label}
      </button>
      
      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200">
          {options.map((option) => (
            <a
              key={option}
              href={calendarLinks[option]()}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              onClick={() => setIsOpen(false)}
            >
              {option}
            </a>
          ))}
        </div>
      )}
    </div>
  );
} 