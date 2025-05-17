'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { PageTitle } from '@/app/components/CommonStyles';
import PeopleMapWrapper from '@/app/components/PeopleMapWrapper';
import Image from 'next/image';

const Container = styled.div`
  padding: 4rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 2rem 0.5rem;
  }
`;

const Title = styled(PageTitle)`
  color: #333;
  margin-bottom: 1rem;
  
  &::after {
    bottom: -10px; /* 밑줄과 글씨 사이 간격 늘림 */
  }
`;

const Description = styled.p`
  text-align: center;
  max-width: 800px;
  margin: 0 auto 2rem;
  color: #555;
  line-height: 1.6;
  font-size: 1.1rem;
`;

const HelpSection = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 3rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
`;

const IntroSection = styled.div`
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }
`;

const HelpTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
  position: relative;
  padding-left: 1.5rem;
  
  &::before {
    content: "💡";
    position: absolute;
    left: 0;
    top: 0;
  }
`;

const HelpList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  
  li {
    padding: 0.5rem 0 0.5rem 1.5rem;
    position: relative;
    
    &::before {
      content: "•";
      position: absolute;
      left: 0;
      color: #4a90e2;
      font-weight: bold;
    }
  }
`;

const ToggleButton = styled.button`
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 0.5rem 1.5rem;
  font-size: 0.9rem;
  cursor: pointer;
  margin: 0 auto 1rem;
  display: block;
  transition: all 0.2s ease;
  
  &:hover {
    background: #3a80d2;
  }
`;

const MapContainer = styled.div`
  position: relative;
`;

const MapOverlay = styled.div<{ $visible: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: ${props => props.$visible ? 'flex' : 'none'};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  z-index: 5;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
`;

const OverlayTitle = styled.h2`
  font-size: 2rem;
  color: #333;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const OverlayDescription = styled.p`
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 2rem;
  max-width: 600px;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const StartButton = styled.button`
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 30px;
  padding: 0.8rem 2.5rem;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(74, 144, 226, 0.3);
  
  &:hover {
    background: #3a80d2;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(74, 144, 226, 0.4);
  }

  @media (max-width: 768px) {
    padding: 0.7rem 1.8rem;
    font-size: 1rem;
  }
`;

export default function PeoplePage() {
  const [showHelp, setShowHelp] = useState<boolean>(true);
  const [introOverlay, setIntroOverlay] = useState<boolean>(true);

  const startExploring = () => {
    setIntroOverlay(false);
  };

  return (
    <Container>
      <IntroSection>
        <Title>권영국과 함께하는 사람들</Title>
        <Description>
          대한민국의 미래를 함께 만들어갈 선거대책위원회 멤버들과 그들 사이의 관계를 살펴보세요.
          각 인물을 클릭하면 상세 정보를 확인할 수 있습니다.
        </Description>
        
        <ToggleButton onClick={() => setShowHelp(!showHelp)}>
          {showHelp ? '사용 안내 숨기기 ▲' : '사용 안내 보기 ▼'}
        </ToggleButton>
        
        {showHelp && (
          <HelpSection>
            <HelpTitle>관계도 사용 방법</HelpTitle>
            <HelpList>
              <li><strong>인물 클릭</strong>: 해당 인물의 상세 정보를 확인할 수 있습니다.</li>
              <li><strong>드래그</strong>: 관계도를 이동할 수 있습니다.</li>
              <li><strong>확대/축소</strong>: 마우스 휠이나 두 손가락 제스처로 확대/축소할 수 있습니다.</li>
              <li><strong>필터링</strong>: 상단의 필터 버튼을 사용하여 직책별로 인물을 필터링할 수 있습니다.</li>
              <li><strong>개요 보기</strong>: 모든 인물을 한눈에 볼 수 있는 개요 모드로 전환됩니다.</li>
            </HelpList>
          </HelpSection>
        )}
      </IntroSection>
      
      <MapContainer>
        <PeopleMapWrapper />
        
        <MapOverlay $visible={introOverlay}>
          <OverlayTitle>권영국 후보와 함께하는 사람들</OverlayTitle>
          <OverlayDescription>
            권영국 후보를 중심으로 연결된 선거대책위원회 주요 인사들의 관계도입니다.
            인물을 클릭하여 더 자세한 정보를 알아보세요.
          </OverlayDescription>
          <StartButton onClick={startExploring}>
            관계도 살펴보기
          </StartButton>
        </MapOverlay>
      </MapContainer>
    </Container>
  );
} 