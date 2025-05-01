'use client';

import { useState } from 'react';

type DataSource = 'all' | 'sanity' | 'google';

type DataSourceSelectorProps = {
  onChange: (source: DataSource) => void;
  currentSource: DataSource;
};

export default function DataSourceSelector({ onChange, currentSource = 'all' }: DataSourceSelectorProps) {
  const buttons = [
    { id: 'all', label: '모든 일정 (준비중)', disabled: true },
    { id: 'sanity', label: '후보 등록 일정', disabled: false },
    { id: 'google', label: '구글 캘린더 일정 (준비중)', disabled: true },
  ];

  return (
    <div className="inline-flex bg-white rounded-lg shadow-sm">
      {buttons.map(button => (
        <button
          key={button.id}
          onClick={() => !button.disabled && onChange(button.id as DataSource)}
          disabled={button.disabled}
          className={`
            px-4 py-2 text-sm font-medium 
            ${currentSource === button.id ? 
              'bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 text-white' : 
              button.disabled ?
                'text-gray-400 bg-gray-100 cursor-not-allowed' :
                'text-gray-700 hover:bg-gray-50'
            }
            ${button.id === 'all' ? 'rounded-l-lg' : ''}
            ${button.id === 'google' ? 'rounded-r-lg' : ''}
            transition-colors
          `}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
} 