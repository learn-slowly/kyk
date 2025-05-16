'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const Container = styled.div`
  min-height: 100vh;
  width: 100vw;
  display: flex;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
    height: 100vh;
    overflow-y: hidden;
  }
`;

const Section = styled(motion.div)<{ $bgColor: string }>`
  flex: 1;
  height: 100vh;
  background: ${props => props.$bgColor};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  padding: 2rem;

  @media (max-width: 768px) {
    height: 33.333vh;
    min-height: unset;
    padding: 1rem;
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover:before {
    opacity: 1;
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  text-align: center;
  color: white;
  max-width: 400px;
`;

const Title = styled.h2`
  font-size: 2rem;
  margin: 0 0 1rem;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Description = styled.p`
  font-size: 1.1rem;
  margin: 0;
  opacity: 0.9;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const PreviewAnimation = styled(motion.div)`
  margin-bottom: 2rem;
`;

export default function PoliciesPage() {
  const [transitioning, setTransitioning] = useState(false);
  const [selectedSection, setSelectedSection] = useState<number | null>(null);
  const router = useRouter();

  const sections = [
    {
      title: '세상을 바꾸는 10가지 방법',
      description: '권영국의 핵심 정책을 3D 카드로 확인해보세요',
      path: '/policies/main',
      bgColor: 'linear-gradient(135deg, #FF6B6B 0%, #FF8787 100%)',
      preview: (
        <PreviewAnimation>
          <div style={{ position: 'relative', perspective: '1000px' }}>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                style={{
                  width: '80px',
                  height: '120px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  position: 'absolute',
                  top: 0,
                  left: `${-40 + i * 40}px`,
                  transformOrigin: 'center',
                  transform: `rotate(${i * 15 - 15}deg)`,
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
                animate={{
                  y: [0, -10, 0],
                  boxShadow: [
                    '0 4px 15px rgba(0, 0, 0, 0.2)',
                    '0 8px 25px rgba(0, 0, 0, 0.3)',
                    '0 4px 15px rgba(0, 0, 0, 0.2)',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </PreviewAnimation>
      ),
    },
    {
      title: 'SCTI 테스트',
      description: '나와 가장 잘 맞는 사회대전환 캐릭터를 찾아보세요',
      path: '/policies/scti',
      bgColor: 'linear-gradient(135deg, #FFD43B 0%, #FFF3BF 100%)',
      preview: (
        <PreviewAnimation>
          <motion.div
            style={{
              width: '160px',
              height: '100px',
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '15px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '15px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            }}
            animate={{
              scale: [1, 1.05, 1],
              boxShadow: [
                '0 4px 15px rgba(0, 0, 0, 0.1)',
                '0 8px 25px rgba(0, 0, 0, 0.2)',
                '0 4px 15px rgba(0, 0, 0, 0.1)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div style={{ fontSize: '24px' }}>🎯</div>
            <div style={{ 
              width: '80%', 
              height: '8px', 
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '4px',
              overflow: 'hidden',
              boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
            }}>
              <motion.div
                style={{
                  width: '30%',
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.5)',
                  borderRadius: '4px',
                }}
                animate={{
                  x: ['0%', '170%'],
                  backgroundColor: [
                    'rgba(255, 255, 255, 0.5)',
                    'rgba(255, 255, 255, 0.7)',
                    'rgba(255, 255, 255, 0.5)',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>
          </motion.div>
        </PreviewAnimation>
      ),
    },
    {
      title: '분야별 세부 정책',
      description: '권영국의 모든 정책을 자세히 살펴보세요',
      path: '/policies/gallery',
      bgColor: 'linear-gradient(135deg, #69DB7C 0%, #B2F2BB 100%)',
      preview: (
        <PreviewAnimation>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '10px',
          }}>
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                style={{
                  width: '40px',
                  height: '40px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                }}
                animate={{
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    '0 4px 15px rgba(0, 0, 0, 0.1)',
                    '0 8px 25px rgba(0, 0, 0, 0.2)',
                    '0 4px 15px rgba(0, 0, 0, 0.1)',
                  ],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        </PreviewAnimation>
      ),
    },
  ];

  const handleSectionClick = async (index: number) => {
    if (transitioning) return;
    
    setTransitioning(true);
    setSelectedSection(index);

    // 애니메이션 후 페이지 전환
    await new Promise(resolve => setTimeout(resolve, 500));
    router.push(sections[index].path);
  };

  return (
    <Container>
      <AnimatePresence>
        {sections.map((section, index) => (
          <Section
            key={index}
            $bgColor={section.bgColor}
            onClick={() => handleSectionClick(index)}
            initial={false}
            animate={{
              height: selectedSection === index ? '100vh' : '33.333vh',
              opacity: selectedSection === null || selectedSection === index ? 1 : 0,
            }}
            transition={{
              height: { duration: 0.5, ease: 'easeInOut' },
              opacity: { duration: 0.3 },
            }}
          >
            <Content>
              {section.preview}
              <Title>{section.title}</Title>
              <Description>{section.description}</Description>
            </Content>
          </Section>
        ))}
      </AnimatePresence>
    </Container>
  );
} 