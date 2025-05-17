'use client';

import React from 'react';
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
  z-index: 1; /* z-index 추가 */
`;

export default function PeopleMapWrapper() {
  return (
    <MapContainer>
      <PeopleMap />
    </MapContainer>
  );
} 