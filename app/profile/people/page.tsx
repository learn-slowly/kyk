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
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin: 0 auto;
  max-width: 1000px;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-5px);
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

const Role = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 1rem;
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
          <Card key={index}>
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
              <Role>{person.role}</Role>
              <Description>{person.description}</Description>
            </Content>
          </Card>
        ))}
      </Grid>
    </Container>
  );
} 