'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import styled from 'styled-components';

// ReactFlow를 동적으로 import하여 SSR 문제를 방지합니다
const PeopleMap = dynamic(() => import('./PeopleMap'), {
  ssr: false, // 서버 사이드 렌더링 비활성화
  loading: () => <LoadingContainer>관계도를 불러오는 중입니다...</LoadingContainer>
});

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  font-size: 1.2rem;
  color: #666;
`;

const MapContainer = styled.div`
  width: 100%;
  height: 80vh;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    height: calc(100vh - 120px);
  }
`;

const MobileNotice = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
    background-color: #f5f5f5;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 12px;
    font-size: 0.9rem;
    color: #666;
    text-align: center;
  }
`;

export default function PeopleMapWrapper() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  return (
    <>
      {isMobile && (
        <MobileNotice>
          모바일 환경에서는 일부 기능이 제한될 수 있습니다. 
          더 나은 경험을 위해 데스크톱 환경을 권장합니다.
        </MobileNotice>
      )}
      <MapContainer>
        <PeopleMap />
      </MapContainer>
    </>
  );
} 