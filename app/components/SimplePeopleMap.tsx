'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Image from 'next/image';

// 스타일 컴포넌트
const Container = styled.div`
  width: 100%;
  height: 80vh;
  position: relative;
  background: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
`;

const PeopleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const PersonCard = styled.div<{ $isCandidate?: boolean }>`
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${props => props.$isCandidate 
    ? '0 5px 15px rgba(0, 0, 0, 0.2)' 
    : '0 2px 4px rgba(0, 0, 0, 0.1)'};
  border: ${props => props.$isCandidate ? '2px solid #FFD700' : 'none'};
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 220px;
  background: #f5f5f5;
`;

const Content = styled.div`
  padding: 1rem;
`;

const Name = styled.h3`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #333;
  text-align: center;
`;

const Role = styled.p<{ $isCandidate?: boolean }>`
  font-size: ${props => props.$isCandidate ? '1.2rem' : '1rem'};
  color: ${props => props.$isCandidate ? '#D4AF37' : '#666'};
  margin-bottom: 0.8rem;
  font-weight: ${props => props.$isCandidate ? 'bold' : 'normal'};
  text-align: center;
`;

const Description = styled.p`
  font-size: 0.9rem;
  color: #777;
  line-height: 1.5;
  margin: 0;
  max-height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const FilterBar = styled.div`
  background: white;
  padding: 1rem 2rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const FilterButton = styled.button<{ $active?: boolean }>`
  background: ${props => props.$active ? '#4a90e2' : '#f0f0f0'};
  color: ${props => props.$active ? 'white' : '#333'};
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.$active ? '#3a80d2' : '#e0e0e0'};
  }
`;

const LoadingMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  font-size: 1.2rem;
  color: #666;
`;

// 기본 백업 데이터
const fallbackPeople = [
  {
    id: '1',
    name: '권영국',
    role: '후보',
    description: '대한민국의 변화를 이끌고 국민의 목소리를 대변하는 대통령 후보입니다.',
    image: '/images/placeholder.jpg',
    isCandidate: true
  },
  {
    id: '2',
    name: '김00',
    role: '선거대책본부장',
    description: '20년간의 선거 운동 경험을 바탕으로 권영국 후보의 선거를 이끌고 있습니다.',
    image: '/images/placeholder.jpg',
    isCandidate: false
  },
  {
    id: '3',
    name: '이00',
    role: '정책위원장',
    description: '사회정책 전문가로서 권영국 후보의 정책을 설계하고 발전시키는 역할을 담당합니다.',
    image: '/images/placeholder.jpg',
    isCandidate: false
  },
  {
    id: '4',
    name: '박00',
    role: '대변인',
    description: '언론인 출신으로 권영국 후보의 메시지를 국민들에게 전달하는 역할을 수행합니다.',
    image: '/images/placeholder.jpg',
    isCandidate: false
  },
  {
    id: '5',
    name: '최00',
    role: '시민사회 자문위원',
    description: '시민단체 활동가로서 현장의 목소리를 정책에 반영하는 역할을 합니다.',
    image: '/images/placeholder.jpg',
    isCandidate: false
  }
];

export default function SimplePeopleMap() {
  const [people, setPeople] = useState<any[]>(fallbackPeople);
  const [loading, setLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Sanity API에 연결 문제가 있어 백업 데이터를 바로 사용합니다
  // useEffect(() => {
  //   const fetchPeople = async () => {
  //     try {
  //       // Sanity 데이터 가져오기 시도
  //       const { getPeopleForMap } = await import('@/lib/sanity');
  //       const data = await getPeopleForMap();
  //       
  //       if (data && data.length > 0) {
  //         setPeople(data);
  //       } else {
  //         console.warn('데이터를 가져오지 못했습니다. 기본 데이터를 사용합니다.');
  //         setPeople(fallbackPeople);
  //       }
  //     } catch (err) {
  //       console.error('데이터 로딩 중 오류 발생:', err);
  //       setPeople(fallbackPeople);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   
  //   fetchPeople();
  // }, []);

  const toggleFilter = (role: string) => {
    setActiveFilters(prev => 
      prev.includes(role) 
        ? prev.filter(f => f !== role)
        : [...prev, role]
    );
  };

  // 필터링된 인물 목록
  const filteredPeople = activeFilters.length > 0
    ? people.filter(person => activeFilters.includes(person.role))
    : people;

  // 역할 목록
  const roles = Array.from(new Set(people.map(p => p.role)));

  if (loading) {
    return <LoadingMessage>데이터를 불러오는 중입니다...</LoadingMessage>;
  }

  return (
    <Container>
      <FilterBar>
        {roles.map(role => (
          <FilterButton
            key={role}
            $active={activeFilters.includes(role)}
            onClick={() => toggleFilter(role)}
          >
            {role}
          </FilterButton>
        ))}
      </FilterBar>
      
      <PeopleGrid>
        {filteredPeople.map(person => (
          <PersonCard key={person.id} $isCandidate={person.isCandidate}>
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
              <Role $isCandidate={person.isCandidate}>{person.role}</Role>
              <Description>{person.description}</Description>
            </Content>
          </PersonCard>
        ))}
      </PeopleGrid>
    </Container>
  );
} 