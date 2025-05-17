'use client';

import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';
import { PageTitle } from '@/app/components/CommonStyles';

const Container = styled.div`
  min-height: 100vh;
  background: white;
  position: relative;
  padding-top: 85px;
  overflow: hidden;
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
    gap: 1rem;
  }
`;

const ImageContainer = styled.div`
  flex: 1;
  position: relative;
  height: 600px;
  max-width: 500px;

  @media (max-width: 768px) {
    width: 100%;
    height: 400px;
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
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    height: 40px;
  }
`;

export default function JoinPage() {
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
          />
        </ImageContainer>
        <ImageContainer>
          <Link 
            href="https://docs.google.com/forms/d/e/1FAIpQLSfvzIqhazhg6NTzG3ptwAIkH-8osXiybjAZn1rNBoe2aZ_kxw/viewform"
            target="_blank"
            rel="noopener noreferrer"
          >
            <StyledImage
              src="/images/mbanner_3_5_20250515212954.png"
              alt="1만 선대위원 모집"
              fill
              priority
            />
          </Link>
        </ImageContainer>
      </Content>
    </Container>
  );
} 