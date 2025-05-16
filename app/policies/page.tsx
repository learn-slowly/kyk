'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`;

const Title = styled.h1`
  color: white;
  text-align: center;
  font-size: 2rem;
  margin: 2rem 0;
  opacity: 0.9;
  padding: 0 1rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin: 1.5rem 0;
  }
`;

const CardContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 2rem;
  position: relative;
  touch-action: pan-y pinch-zoom;

  @media (max-width: 768px) {
    padding: 1rem;
    flex-direction: column;
  }
`;

const PreviewCard = styled(motion.div)<{ $isActive: boolean }>`
  width: 300px;
  height: 400px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 0;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.2);

  ${props => props.$isActive && `
    border-color: rgba(255, 255, 255, 0.4);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  `}

  @media (max-width: 768px) {
    width: 280px;
    height: 380px;
  }
`;

const CardOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, 
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.7) 50%,
    rgba(0, 0, 0, 0.9) 100%
  );
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 2rem;
  color: white;
`;

const CardTitle = styled.h2`
  font-size: 1.5rem;
  margin: 0 0 0.5rem;
  font-weight: 600;
`;

const CardDescription = styled.p`
  font-size: 1rem;
  margin: 0;
  opacity: 0.8;
`;

const PreviewContent = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  height: 90%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function PoliciesPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();

  const sections = [
    {
      title: '세상을 바꾸는 10가지 방법',
      description: '권영국의 핵심 정책을 3D 카드로 확인해보세요',
      path: '/policies/main',
      preview: (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <div style={{ 
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-15deg)',
            perspective: '1000px'
          }}>
            {/* 미리보기용 작은 카드들 */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                style={{
                  width: '120px',
                  height: '160px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  transformOrigin: 'center',
                  transform: `rotate(${i * 30}deg) translateY(-${i * 10}px)`,
                }}
                animate={{
                  rotate: [i * 30, i * 30 + 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            ))}
          </div>
        </div>
      ),
    },
    {
      title: 'SCTI 테스트',
      description: '나와 가장 잘 맞는 정책 캐릭터를 찾아보세요',
      path: '/policies/scti',
      preview: (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <motion.div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80%',
              height: '60%',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '15px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              padding: '20px',
            }}
            animate={{
              scale: [1, 1.05, 1],
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
              height: '10px', 
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '5px',
              overflow: 'hidden',
            }}>
              <motion.div
                style={{
                  width: '30%',
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.5)',
                  borderRadius: '5px',
                }}
                animate={{
                  x: ['0%', '170%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>
          </motion.div>
        </div>
      ),
    },
    {
      title: '분야별 세부 정책',
      description: '8개 분야의 모든 정책을 자세히 살펴보세요',
      path: '/policies/gallery',
      preview: (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '10px',
            padding: '20px',
          }}>
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                style={{
                  width: '60px',
                  height: '60px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                }}
                animate={{
                  scale: [1, 1.1, 1],
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
        </div>
      ),
    },
  ];

  const handleCardClick = (index: number) => {
    router.push(sections[index].path);
  };

  return (
    <Container>
      <Title>정책 살펴보기</Title>
      <CardContainer>
        {sections.map((section, index) => (
          <PreviewCard
            key={index}
            $isActive={activeIndex === index}
            onClick={() => handleCardClick(index)}
            onHoverStart={() => setActiveIndex(index)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <PreviewContent>
              {section.preview}
            </PreviewContent>
            <CardOverlay>
              <CardTitle>{section.title}</CardTitle>
              <CardDescription>{section.description}</CardDescription>
            </CardOverlay>
          </PreviewCard>
        ))}
      </CardContainer>
    </Container>
  );
} 