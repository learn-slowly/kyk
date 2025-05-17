'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';

// 로딩 중 표시할 컴포넌트
const LoadingFallback = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  font-size: 1.2rem;
  color: #666;
  background-color: #f8f9fa;
  border-radius: 8px;
  
  .loader {
    border: 5px solid #f3f3f3;
    border-top: 5px solid #0b365f;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin-right: 20px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// ReactFlow 컴포넌트를 클라이언트 사이드에서만 로드하도록 설정
const PeopleMap = dynamic(() => import('./PeopleMap'), {
  ssr: false,
  loading: () => (
    <LoadingFallback>
      <div className="loader"></div>
      <div>관계도를 로딩 중입니다...</div>
    </LoadingFallback>
  )
});

export default function PeopleMapWrapper() {
  return <PeopleMap />;
} 