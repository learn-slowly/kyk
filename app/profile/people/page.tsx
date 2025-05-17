'use client';

import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { PageTitle } from '@/app/components/CommonStyles';

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
  
  &::after {
    bottom: -10px; /* 밑줄과 글씨 사이 간격 늘림 */
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin: 0 auto;
  max-width: 1000px;
`;

const Card = styled.div<{ $isCandidate?: boolean }>`
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${props => props.$isCandidate 
    ? '0 5px 15px rgba(0, 0, 0, 0.2)' 
    : '0 2px 4px rgba(0, 0, 0, 0.1)'};
  transition: transform 0.2s ease;
  border: ${props => props.$isCandidate ? '2px solid #FFD700' : 'none'};
  transform: ${props => props.$isCandidate ? 'scale(1.05)' : 'none'};
  
  &:hover {
    transform: ${props => props.$isCandidate 
      ? 'translateY(-5px) scale(1.05)' 
      : 'translateY(-5px)'};
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  padding-top: 100%;
  background: #f5f5f5;
`;

const Content = styled.div`
  padding: 1.5rem;
`;

const Name = styled.h3`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #333;
`;

const Role = styled.p<{ $isCandidate?: boolean }>`
  font-size: ${props => props.$isCandidate ? '1.2rem' : '1rem'};
  color: ${props => props.$isCandidate ? '#D4AF37' : '#666'};
  margin-bottom: 1rem;
  font-weight: ${props => props.$isCandidate ? 'bold' : 'normal'};
`;

const Description = styled.p`
  font-size: 0.9rem;
  color: #777;
  line-height: 1.6;
  margin: 0;
`;

export default function PeoplePage() {
  const people = [
    {
      name: '권영국',
      role: '후보',
      description: '대한민국의 변화를 이끌고 국민의 목소리를 대변하는 대통령 후보입니다.',
      image: '/images/kyk_profile.jpg'
    },
    {
      name: '김00',
      role: '선거대책본부장',
      description: '20년간의 선거 운동 경험을 바탕으로 권영국 후보의 선거를 이끌고 있습니다.',
      image: '/images/placeholder.jpg'
    },
    {
      name: '이00',
      role: '정책위원장',
      description: '사회정책 전문가로서 권영국 후보의 정책을 설계하고 발전시키는 역할을 담당합니다.',
      image: '/images/placeholder.jpg'
    },
    {
      name: '박00',
      role: '대변인',
      description: '언론인 출신으로 권영국 후보의 메시지를 국민들에게 전달하는 역할을 수행합니다.',
      image: '/images/placeholder.jpg'
    },
    {
      name: '최00',
      role: '시민사회 자문위원',
      description: '시민단체 활동가로서 현장의 목소리를 정책에 반영하는 역할을 합니다.',
      image: '/images/placeholder.jpg'
    }
  ];

  return (
    <Container>
      <Title>권영국과 함께하는 사람들</Title>
      <Grid>
        {people.map((person, index) => (
          <Card key={index} $isCandidate={person.role === '후보'}>
            <ImageContainer>
              <Image
                src={person.image}
                alt={person.name}
                fill
                style={{ objectFit: 'cover' }}
              />
            </ImageContainer>
            <Content>
              <Name>{person.name}</Name>
              <Role $isCandidate={person.role === '후보'}>{person.role}</Role>
              <Description>{person.description}</Description>
            </Content>
          </Card>
        ))}
      </Grid>
    </Container>
  );
} 