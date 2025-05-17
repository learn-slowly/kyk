'use client';

import React from 'react';
import styled from 'styled-components';
import { PageTitle } from '@/app/components/CommonStyles';
// import PeopleMap from '@/app/components/PeopleMap';

const Container = styled.div`
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const Title = styled(PageTitle)`
  color: #333;
  margin-bottom: 3rem;
  
  &::after {
    bottom: -10px; /* 밑줄과 글씨 사이 간격 늘림 */
  }
`;

const Description = styled.p`
  text-align: center;
  max-width: 800px;
  margin: 0 auto 3rem;
  color: #555;
  line-height: 1.6;
  font-size: 1.1rem;
`;

const ComingSoon = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin: 2rem auto;
  max-width: 800px;
  
  h3 {
    margin-bottom: 1rem;
    color: #0b365f;
  }
`;

export default function PeoplePage() {
  return (
    <Container>
      <Title>권영국과 함께하는 사람들</Title>
      <Description>
        대한민국의 미래를 함께 만들어갈 선거대책위원회 멤버들을 소개합니다.
      </Description>
      <ComingSoon>
        <h3>인터랙티브 관계도</h3>
        <p>선거대책위원회 멤버 관계도가 준비 중입니다. 조금만 기다려주세요!</p>
      </ComingSoon>
    </Container>
  );
} 