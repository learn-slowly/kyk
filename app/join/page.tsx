'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';
import { PageTitle } from '@/app/components/CommonStyles';

const Container = styled.div`
  min-height: 100vh;
  background: white;
  position: relative;
  padding-top: 85px;
  padding-bottom: 2rem;
  overflow-x: hidden;
  
  @media (max-width: 768px) {
    padding-top: 70px;
  }
`;

const BackgroundImage = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  width: 300px;
  height: 300px;
  background-image: url('/images/pi_bg.png');
  background-size: contain;
  background-position: bottom right;
  background-repeat: no-repeat;
  opacity: 0.8;
  z-index: 1;
  
  @media (max-width: 768px) {
    width: 150px;
    height: 150px;
    opacity: 0.3;
  }
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1rem;
    gap: 1.5rem;
  }
`;

const ImageContainer = styled.div`
  flex: 1;
  position: relative;
  height: 600px;
  max-width: 500px;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

  @media (max-width: 768px) {
    height: 350px;
    max-width: 100%;
    margin: 0 auto;
  }
`;

const StyledImage = styled(Image)`
  object-fit: contain;
`;

const Title = styled(PageTitle)`
  color: #333;
  padding: 0.5rem;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  
  &::after {
    bottom: -10px;
  }
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    height: 40px;
    margin-bottom: 1rem;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background: #ffffff;
`;

export default function JoinPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [windowLoaded, setWindowLoaded] = useState(false);

  // 윈도우 로드 완료 감지
  useEffect(() => {
    setWindowLoaded(true);
    
    // 이미지 로딩 타이머
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  if (!windowLoaded) {
    return <LoadingContainer>로딩 중...</LoadingContainer>;
  }

  return (
    <Container>
      <BackgroundImage />
      <Title>함께하기</Title>
      <Content>
        <ImageContainer>
          <StyledImage
            src="/images/mbanner_3_4_20250515094509.jpg"
            alt="권영국 후보 이미지"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 500px"
            onLoad={() => setIsLoading(false)}
          />
        </ImageContainer>
        <ImageContainer>
          <Link 
            href="https://docs.google.com/forms/d/e/1FAIpQLSfvzIqhazhg6NTzG3ptwAIkH-8osXiybjAZn1rNBoe2aZ_kxw/viewform"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'block', width: '100%', height: '100%' }}
          >
            <StyledImage
              src="/images/mbanner_3_5_20250515212954.png"
              alt="1만 선대위원 모집"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 500px"
            />
          </Link>
        </ImageContainer>
      </Content>
    </Container>
  );
} 