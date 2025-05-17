'use client';

import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

const Container = styled.div`
  padding: 2rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
`;

const Title = styled.h1`
  font-size: 2.8rem;
  font-weight: normal;
  text-align: center;
  margin-bottom: 3rem;
  color: #333;
  position: relative;
  padding: 1rem;
  z-index: 10;
  font-family: 'GamtanRoad Gamtan', sans-serif;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 200px;
    height: 5px;
    background: linear-gradient(to right, #FF0000, #FFed00, #00a366);
  }
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
    margin-bottom: 2rem;
    
    &::after {
      width: 150px;
    }
  }
`;

const Timeline = styled.div`
  position: relative;
  max-width: 1000px;
  margin: 0 auto;
  padding-top: 2rem;
  
  &::after {
    content: '';
    position: absolute;
    width: 2px;
    background: linear-gradient(to bottom, #FF0000, #FFed00, #00a366);
    top: 0;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    
    @media (max-width: 768px) {
      left: 30px;
    }
  }
`;

const TimelineItem = styled(motion.div)<{ $isEven: boolean }>`
  display: flex;
  justify-content: ${props => props.$isEven ? 'flex-start' : 'flex-end'};
  padding: 1rem;
  margin-bottom: 2rem;
  width: 100%;
  position: relative;

  @media (max-width: 768px) {
    justify-content: flex-end;
    padding-left: 45px;
  }
`;

const TimelineContent = styled(motion.div)<{ $isImportant: boolean, $isEven?: boolean }>`
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: ${props => props.$isImportant ? 
    '0 4px 20px rgba(255, 0, 0, 0.15)' : 
    '0 2px 10px rgba(0, 0, 0, 0.1)'};
  position: relative;
  width: 45%;
  border-left: ${props => props.$isImportant ? 
    '4px solid #FF0000' : 
    '4px solid #ddd'};
  
  @media (max-width: 768px) {
    width: calc(100% - 45px);
  }

  &::before {
    content: '';
    position: absolute;
    width: ${props => props.$isImportant ? '16px' : '12px'};
    height: ${props => props.$isImportant ? '16px' : '12px'};
    background: ${props => props.$isImportant ? '#FF0000' : '#fff'};
    border: 2px solid ${props => props.$isImportant ? '#FF0000' : '#ddd'};
    border-radius: 50%;
    top: 50%;
    
    ${props => props.$isImportant && `
      box-shadow: 0 0 0 4px rgba(255, 0, 0, 0.2);
    `}

    @media (min-width: 769px) {
      left: ${props => props.$isEven ? '-44px' : 'auto'};
      right: ${props => props.$isEven ? 'auto' : '-44px'};
    }

    @media (max-width: 768px) {
      left: -40px;
    }
  }
`;

const Year = styled.h3<{ $isImportant: boolean }>`
  font-size: ${props => props.$isImportant ? '1.4rem' : '1.2rem'};
  font-weight: bold;
  color: ${props => props.$isImportant ? '#FF0000' : '#333'};
  margin-bottom: 0.5rem;
`;

const Description = styled.p<{ $isImportant: boolean }>`
  margin: 0;
  color: ${props => props.$isImportant ? '#333' : '#666'};
  line-height: 1.6;
  font-size: ${props => props.$isImportant ? '1.1rem' : '1rem'};
`;

// 중요한 사건들을 정의
const importantYears = [
  '1963년 1월 28일',  // 출생
  '1985년 2월',      // 서울대 졸업
  '1989년 1월',      // 첫 구속
  '1999년 11월',     // 사법시험 합격
  '2006년 2월',      // 해우법률사무소 설립
  '2014년 5월',      // 세월호 특별위원회
  '2019년 10월',     // 정의당 입당
  '2025년 5월',      // 대선 후보
];

export default function HistoryPage() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const timeline = [
    {
      year: '1963년 1월 28일(음)',
      description: '태백시 장성읍 자미원 출생'
    },
    {
      year: '1975년 2월',
      description: '점촌중앙초등학교 졸업'
    },
    {
      year: '1978년 2월',
      description: '문경중학교 졸업'
    },
    {
      year: '1981년 2월',
      description: '포항제철공업고등학교 졸업'
    },
    {
      year: '1985년 2월',
      description: '서울대학교 공과대학 금속공학과 졸업'
    },
    {
      year: '1985년 1월',
      description: '풍산금속공업(주)[현 (주)풍산] 기술직 공채에 합격해 온산공장으로 발령'
    },
    {
      year: '1987년 10월',
      description: '노조위원장 불신임을 추진하다 풍산금속 안강공장으로 강제 전보 발령'
    },
    {
      year: '1988년 8월',
      description: '안강공장 폭발 사망사고와 관련한 유인물을 읍내에 붙였다는 이유로 1차 해고'
    },
    {
      year: '1988년 11월',
      description: '조합원들과 함께 서울 본사로 상경 9일간 점거 농성 투쟁을 벌여 안강공장에 복직'
    },
    {
      year: '1989년 1월',
      description: '안강공장 파업 지도부의 일원으로 구속되고(징역 1년 6개월 복역), 2차 해고'
    },
    {
      year: '1991년 2월',
      description: '풍산금속 동래공장 파업의 배후 조종으로 몰려 2차 구속(징역 2년 복역)'
    },
    {
      year: '1993년 2월',
      description: '만기 출소 후 전해투(전국구속수배해고원상회복투쟁위원회)에 참여하고 선전국장으로 활동'
    },
    {
      year: '1995년 11월',
      description: '포항에서 서울로 이사한 후 이듬해부터 사법시험 공부를 시작'
    },
    {
      year: '1999년 11월',
      description: '제41회 사법시험에 합격'
    },
    {
      year: '2002년 2월',
      description: '민주노총 법률원 설립에 참여하고 초대 법률원장을 맡아 4년가량 활동'
    },
    {
      year: '2006년 2월',
      description: '해우법률사무소를 세워 대표변호사를 맡음'
    },
    {
      year: '2008년 5월',
      description: '민주사회를 위한 변호사모임 노동위원장에 추대돼 6년에 걸쳐 활동'
    },
    {
      year: '2008년 6월',
      description: '국가인권위원회 사회권전문위원에 임명되어 3년간 활동'
    },
    {
      year: '2009년 1월',
      description: '용산철거민 사망사건 진상조사단 조사팀장을 맡고, 구속 철거민 공동변호인으로 활동'
    },
    {
      year: '2009년 6월',
      description: '쌍용자동차 희생자 추모 및 해고자 복직 범국민대책위원회 공동집행위원장을 맡음'
    },
    {
      year: '2009년 6월',
      description: '화물연대 대전집회 구속 노동자 변호를 맡아 열변을 토함'
    },
    {
      year: '2011년',
      description: '론스타게이트 책임자처벌 및 외환은행 불법매각 중단을 위한 공동대책위원회 법률단장으로 활동'
    },
    {
      year: '2011년 8월',
      description: '교사 공무원 정당 가입 사건 공동변호인으로 참여'
    },
    {
      year: '2013년 2월',
      description: '신세계이마트 불법사찰 및 불법파견 공동대책위원회 위원으로 참여'
    },
    {
      year: '2013년 7월',
      description: '삼성전자서비스 불법고용 근절 및 근로기준법 준수를 위한 공동대책위원회 소집권자를 맡음'
    },
    {
      year: '2013년 10월',
      description: '전교조 법외노조(노조설립반려) 사건 공동소송대리인으로 참여'
    },
    {
      year: '2013년 12월',
      description: '삼성전자서비스 고 최종범 열사 대책위원회 공동대표를 맡음'
    },
    {
      year: '2014년 2월',
      description: '공정사회파괴 노동인권유린 삼성바로잡기운동본부 공동대표로 활동'
    },
    {
      year: '2014년 5월',
      description: '민변 세월호 참사 진상규명과 법률지원 특별위원회 위원장을 맡음'
    },
    {
      year: '2015년 3월',
      description: '비정규직 확대 정책에 맞서 장그래살리기운동본부 상임공동본부장을 맡음'
    },
    {
      year: '2016년 6월',
      description: '구의역 김군 유족을 대리하고 구의역 사망재해 시민대책위 진상조사단 단장을 맡음'
    },
    {
      year: '2016년 11월',
      description: '박근혜정권퇴진 비상국민행동 법률팀장으로 활동'
    },
    {
      year: '2017년 1월',
      description: '국정농단 공범 삼성 이재용 부회장 구속 촉구 법률가 노숙농성을 주도'
    },
    {
      year: '2017년 7월',
      description: '경주에 해우법률사무소를 열고 대표변호사를 맡음'
    },
    {
      year: '2017년 9월',
      description: '경북노동인권센터를 열고 센터장을 맡음'
    },
    {
      year: '2017년 12월',
      description: '경상북도 장애인권익 옹호기관 학대판정위원'
    },
    {
      year: '2018년 5월',
      description: '경주다움 성폭력상담센터 운영위원장'
    },
    {
      year: '2018년 9월',
      description: '포스코 새노조(금속노조 포스코지회) 법률지원단을 조직하고 단장을 맡음'
    },
    {
      year: '2019년 4월',
      description: '고 김용균 사망사고 진상규명과 재발방지를 위한 석탄화력발전소 특별노동안전조사위원회 간사로 임명되어 활동'
    },
    {
      year: '2019년 10월',
      description: '정의당에 입당하고 정의당 노동인권안전특별위원회 위원장에 임명'
    },
    {
      year: '2019년 11월',
      description: '사학건전성 강화와 경주대 서라벌대 정상화를 위한 공동대책위원회 공동위원장으로 활동'
    },
    {
      year: '2024년 4월',
      description: '녹색정의당 총선 후보로 출마'
    },
    {
      year: '2024년 5월',
      description: '정의당 8기 당대표에 출마, 당선'
    },
    {
      year: '2025년 4월',
      description: '사회대전환 연대회의 대선후보 경선에 출마, 당선'
    },
    {
      year: '2025년 5월',
      description: '민주노동당 21대 대통령후보로 선출, 출마'
    }
  ];

  return (
    <Container ref={ref}>
      <Title>권영국의 살아온 길</Title>
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(to right, #FF0000, #FFed00, #00a366)',
          transformOrigin: '0%',
          scaleX,
          zIndex: 100
        }}
      />
      <Timeline>
        {timeline.map((item, index) => {
          const isImportant = importantYears.some(year => item.year.startsWith(year));
          return (
            <TimelineItem
              key={index}
              $isEven={index % 2 === 0}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <TimelineContent
                $isImportant={isImportant}
                $isEven={index % 2 === 0}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Year $isImportant={isImportant}>{item.year}</Year>
                <Description $isImportant={isImportant}>{item.description}</Description>
              </TimelineContent>
            </TimelineItem>
          );
        })}
      </Timeline>
    </Container>
  );
} 