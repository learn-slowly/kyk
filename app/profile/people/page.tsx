'use client';

import React from 'react';
import styled from 'styled-components';
import { PageTitle } from '@/app/components/CommonStyles';
import PeopleMap from '@/app/components/PeopleMap';

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

export default function PeoplePage() {
  return (
    <Container>
      <Title>권영국과 함께하는 사람들</Title>
      <Description>
        대한민국의 미래를 함께 만들어갈 선거대책위원회 멤버들을 소개합니다. 
        원하는 인물을 클릭하여 자세히 알아보고, 드래그하여 위치를 조정할 수 있습니다.
        각 직책별로 필터링도 가능합니다.
      </Description>
      <PeopleMap />
    </Container>
  );
} 