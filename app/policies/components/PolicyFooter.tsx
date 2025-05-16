'use client';

import Image from 'next/image';
import styled from 'styled-components';

const Footer = styled.footer`
  position: relative;
  color: white;
  padding: 2rem 0;
  overflow: hidden;
  background: #0a355e;
  margin-top: auto;
  width: 100%;
`;

const BackgroundImage = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 150px;
  background-image: url('/images/bottom.png');
  background-size: auto 150px;
  background-position: center bottom;
  background-repeat: repeat-x;
  opacity: 0.8;
  z-index: 1;
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  background: #0a355e;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const RightColumn = styled.div`
  text-align: right;
  font-size: 0.9rem;
  line-height: 1.6;
  opacity: 0.8;

  @media (max-width: 768px) {
    text-align: left;
  }
`;

const Title = styled.div`
  font-size: 1rem;
  margin-bottom: 0.5rem;
  font-family: 'GamtanRoad Gamtan', sans-serif;
  opacity: 0.8;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const LogoText = styled.span`
  font-size: 2rem;
  font-family: 'GamtanRoad Gamtan', sans-serif;
  margin-left: 8px;
`;

const Copyright = styled.div`
  text-align: center;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.9rem;
  opacity: 0.5;
`;

export default function PolicyFooter() {
  return (
    <Footer>
      <BackgroundImage />
      <Content>
        <LeftColumn>
          <Title>사회대전환 연대회의 대통령 후보</Title>
          <LogoContainer>
            <Image 
              src="/images/header.png" 
              alt="민주노동당 권영국 후보 로고" 
              width={200} 
              height={30} 
              style={{ marginRight: '8px' }} 
            />
            <LogoText>권영국</LogoText>
          </LogoContainer>
        </LeftColumn>
        <RightColumn>
          이메일: admin@justice21.org<br />
          전화: 02-2038-0103<br />
          FAX: 02-761-0103<br />
          주소: (08376) 서울특별시 구로구 디지털로33길 55, 이앤씨벤처드림타워2차 1011호
        </RightColumn>
      </Content>
      <Copyright>
        © {new Date().getFullYear()} 민주노동당 권영국. All rights reserved.
      </Copyright>
    </Footer>
  );
} 