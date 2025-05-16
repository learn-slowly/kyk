'use client';

import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { HideDefaultFooter } from './StyledComponents';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  padding: 1.5rem;
  padding-top: calc(1.5rem + 85px);
  height: fit-content;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 1rem;
    padding-top: calc(1rem + 90px);
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
`;

const Section = styled(motion.div)<{ $color: string }>`
  aspect-ratio: 4/3;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border-radius: 8px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.$color};
    opacity: 0.85;
    z-index: 1;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.3) 100%);
    z-index: 2;
  }
`;

const Content = styled(motion.div)`
  position: relative;
  z-index: 3;
  padding: 1.5rem;
  text-align: center;
  color: white;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.75rem;
  font-family: 'GamtanRoad Gamtan', sans-serif;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
`;

const Description = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
  max-width: 280px;
  margin: 0 auto;
  line-height: 1.4;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    font-size: 1rem;
    max-width: 240px;
  }
`;

const AnimationContainer = styled(motion.div)`
  width: 80px;
  height: 80px;
  margin-bottom: 2rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
  }
`;

// 10대 공약 카드 애니메이션
const CardStack = styled(motion.div)`
  width: 40px;
  height: 56px;
  background: white;
  border-radius: 4px;
  position: absolute;
`;

// SCTI 테스트 길 애니메이션
const PathContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const Path = styled(motion.div)`
  width: 3px;
  height: 30px;
  background: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: bottom;
`;

// 정책 갤러리 애니메이션
const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
  width: 40px;
  height: 40px;
`;

const GridItem = styled(motion.div)`
  background: white;
  border-radius: 2px;
`;

export default function PoliciesMainPage() {
  const router = useRouter();

  const sections = [
    {
      title: '10대 공약',
      description: '권영국 후보의 세상을 바꾸는 10가지 방법',
      color: '#FF6B6B',
      path: '/policies/carousel',
      isDisabled: false,
      renderAnimation: () => (
        <AnimationContainer>
          {[0, 1, 2].map((i) => (
            <CardStack
              key={i}
              initial={{ x: 0, y: 0, rotate: 0 }}
              animate={{
                x: [-20 + (i * 10), 0],
                y: [10 - (i * 5), 0],
                rotate: [-10 + (i * 5), 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
                delay: i * 0.2,
              }}
              style={{
                zIndex: 3 - i,
                opacity: 1 - (i * 0.2),
              }}
            />
          ))}
        </AnimationContainer>
      )
    },
    {
      title: 'SCTI 테스트',
      description: '나의 사회대전환 유형은 무엇일까?',
      color: '#4ECDC4',
      path: '/policies/scti',
      isDisabled: true,
      renderAnimation: () => (
        <AnimationContainer>
          <PathContainer>
            {[-45, 0, 45].map((angle) => (
              <Path
                key={angle}
                initial={{ height: 0 }}
                animate={{ height: 30 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
                style={{
                  transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                }}
              />
            ))}
          </PathContainer>
        </AnimationContainer>
      )
    },
    {
      title: '정책 갤러리',
      description: '분야별 세부정책을 확인하세요',
      color: '#45B7D1',
      path: '/policies/gallery',
      isDisabled: false,
      renderAnimation: () => (
        <AnimationContainer>
          <GalleryGrid>
            {[0, 1, 2, 3].map((i) => (
              <GridItem
                key={i}
                initial={{ scale: 0.8, opacity: 0.6 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: i * 0.2,
                }}
              />
            ))}
          </GalleryGrid>
        </AnimationContainer>
      )
    }
  ];

  return (
    <HideDefaultFooter>
      <Container>
        <GridContainer>
          {sections.map((section, index) => (
            <Section
              key={index}
              $color={section.color}
              onClick={() => !section.isDisabled && router.push(section.path)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              whileHover={!section.isDisabled ? {
                scale: 1.05,
                transition: { duration: 0.3 }
              } : {}}
              style={{
                cursor: section.isDisabled ? 'default' : 'pointer',
                opacity: section.isDisabled ? 0.7 : 1
              }}
            >
              <Content>
                {section.renderAnimation()}
                <Title>{section.title}</Title>
                <Description>{section.description}</Description>
              </Content>
            </Section>
          ))}
        </GridContainer>
      </Container>
    </HideDefaultFooter>
  );
} 