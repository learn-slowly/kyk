'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';
import { PageTitle } from '@/app/components/CommonStyles';

// 배너 이미지 URL
const BANNER_IMAGE_1 = '/images/mbanner_3_4_20250515094509.jpg';
const BANNER_IMAGE_2 = '/images/mbanner_3_5_20250515212954.png';
const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfvzIqhazhg6NTzG3ptwAIkH-8osXiybjAZn1rNBoe2aZ_kxw/viewform';

// 이미지 ID 타입 정의
type ImageId = 'image1' | 'image2';

const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  background: white;
  position: relative;
  padding-top: 85px;
  padding-bottom: 2rem;
  
  @media (max-width: 768px) {
    padding-top: 70px;
    padding-bottom: 1rem;
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
  pointer-events: none;
  
  @media (max-width: 768px) {
    width: 150px;
    height: 150px;
    opacity: 0.2;
  }
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    padding: 1rem;
    width: 100%;
  }
`;

const ImagesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  width: 100%;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  aspect-ratio: 4/3;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

  @media (max-width: 768px) {
    aspect-ratio: 3/2;
    max-width: 100%;
  }
`;

const Title = styled(PageTitle)`
  color: #333;
  padding: 0.5rem;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  position: relative;
  z-index: 2;
  
  &::after {
    bottom: -10px;
  }
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    height: 40px;
    margin-bottom: 1rem;
  }
`;

const ImageFallback = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  color: #666;
  font-size: 1rem;
  text-align: center;
  padding: 1rem;
`;

export default function JoinPage() {
  const [imageErrors, setImageErrors] = useState({
    image1: false,
    image2: false
  });

  const handleImageError = (imageId: ImageId) => {
    setImageErrors(prev => ({
      ...prev,
      [imageId]: true
    }));
  };

  return (
    <Container>
      <BackgroundImage />
      <Content>
        <Title>함께하기</Title>
        <ImagesContainer>
          <ImageContainer>
            {imageErrors.image1 ? (
              <ImageFallback>
                권영국 후보 이미지를 불러올 수 없습니다.
              </ImageFallback>
            ) : (
              <Image
                src={BANNER_IMAGE_1}
                alt="권영국 후보 이미지"
                fill
                priority
                quality={70}
                style={{ objectFit: 'contain' }}
                sizes="(max-width: 768px) 100vw, 500px"
                onError={() => handleImageError('image1')}
              />
            )}
          </ImageContainer>
          
          <ImageContainer>
            <Link 
              href={FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'block', width: '100%', height: '100%' }}
            >
              {imageErrors.image2 ? (
                <ImageFallback>
                  1만 선대위원 모집 이미지를 불러올 수 없습니다.<br />
                  클릭하시면 신청 페이지로 이동합니다.
                </ImageFallback>
              ) : (
                <Image
                  src={BANNER_IMAGE_2}
                  alt="1만 선대위원 모집"
                  fill
                  priority
                  quality={70}
                  style={{ objectFit: 'contain' }}
                  sizes="(max-width: 768px) 100vw, 500px"
                  onError={() => handleImageError('image2')}
                />
              )}
            </Link>
          </ImageContainer>
        </ImagesContainer>
      </Content>
    </Container>
  );
} 