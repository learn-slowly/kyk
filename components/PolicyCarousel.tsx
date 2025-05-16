'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import styled from 'styled-components';
import { Policy } from '@/types/policy';
import ReactMarkdown from 'react-markdown';

interface PolicyCarouselProps {
  policies: Policy[];
  onTestClick?: () => void;
}

interface CardProps {
  $index: number;
  $color: string;
  $isExpanded: boolean;
  $total: number;
}

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  padding-top: 85px;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
  overflow-x: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
    z-index: -1;
  }

  @media (max-width: 768px) {
    padding-top: 90px;
  }

  @media (max-width: 480px) {
    padding-top: 80px;
  }
`;

const Title = styled.h1`
  color: white;
  font-size: 2rem;
  padding: 0.5rem;
  margin: 0;
  font-weight: 400;
  text-align: center;
  opacity: 0.9;
  letter-spacing: -0.03em;
  font-family: 'GamtanRoad Gamtan', sans-serif;
  position: relative;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 5px;
    left: 50%;
    transform: translateX(-50%);
    width: 90px;
    height: 3px;
    background: #FF4B4B;
    border-radius: 2px;
    box-shadow: 30px 0 0 #FFD700, 60px 0 0 #4CAF50;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
    height: 40px;
    padding: 0 1rem;
    word-break: keep-all;
    margin-top: 1rem;
  }
`;

const LoadingContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #1a1a1a;
  color: white;
  font-size: 1.5rem;
`;

const CarouselContainer = styled.div<{ $isExpanded: boolean }>`
  flex: 1;
  width: 100%;
  max-width: 100vw;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  perspective: 2000px;
  overflow: visible;
  padding: 0 20px;
  position: relative;
  margin-top: 70px;
  padding-bottom: ${props => props.$isExpanded ? '100px' : '0'};

  @media (max-width: 768px) {
    padding: 0 10px;
    margin-top: 40px;
    padding-bottom: ${props => props.$isExpanded ? '80px' : '0'};
  }
`;

const CardsContainer = styled(motion.div)`
  position: relative;
  width: 300px;
  height: 400px;
  transform-style: preserve-3d;
  margin: 0 auto;
  perspective: 2000px;
`;

const DetailPolicies = styled(motion.div)`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow: visible;
`;

const DetailPolicy = styled(motion.div)`
  margin-bottom: 10px;
  border-radius: 8px;
  overflow: visible;

  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailPolicyHeader = styled.button`
  width: 100%;
  padding: 12px 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  user-select: none;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  h3 {
    font-size: 16px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.95);
    margin: 0;
    text-align: left;
  }

  svg {
    width: 16px;
    height: 16px;
    transform-origin: center;
    transition: transform 0.2s ease;
    margin-left: 10px;
    flex-shrink: 0;

    &.expanded {
      transform: rotate(180deg);
    }
  }
`;

const DetailPolicyContent = styled(motion.div)`
  padding: 15px;
  font-size: 14px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.05);
  margin-top: 1px;
  border-radius: 0 0 8px 8px;
  transform-origin: top;

  /* 마크다운 스타일링 */
  h1, h2, h3, h4, h5, h6 {
    color: white;
    margin: 1em 0 0.5em;
  }

  p {
    margin: 0.5em 0;
  }

  ul, ol {
    margin: 0.5em 0;
    padding-left: 1.5em;
  }

  li {
    margin: 0.3em 0;
  }

  blockquote {
    margin: 1em 0;
    padding-left: 1em;
    border-left: 3px solid rgba(255, 255, 255, 0.2);
    font-style: italic;
  }

  a {
    color: #4A90E2;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  code {
    background: rgba(255, 255, 255, 0.1);
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-size: 0.9em;
  }

  pre {
    background: rgba(255, 255, 255, 0.1);
    padding: 1em;
    border-radius: 5px;
    overflow-x: auto;
    code {
      background: none;
      padding: 0;
    }
  }
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  color: white;
  cursor: pointer;
  z-index: 2;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-50%) scale(1.1);
  }
  
  &:active {
    transform: translateY(-50%) scale(0.95);
  }
  
  &.left {
    left: 30px;
  }
  
  &.right {
    right: 30px;
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    
    &.left {
      left: 15px;
    }
    
    &.right {
      right: 15px;
    }
  }
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 20px;
  right: 0;
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  padding: 0;
  transition: all 0.2s ease;
  
  &:hover {
    color: rgba(255, 255, 255, 1);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const TestButton = styled(motion.button)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 15px 25px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  backdrop-filter: blur(10px);
  font-family: 'GamtanRoad Gamtan', sans-serif;
  z-index: 1;
  
  @media (max-width: 768px) {
    bottom: 20px;
    right: 20px;
    padding: 12px 20px;
    font-size: 14px;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const CardContent = styled.div`
  color: white;
  text-align: center;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  flex: 1;
  
  h2 {
    font-size: 24px;
    margin-bottom: 15px;
    font-weight: 600;
    position: relative;
    display: inline-block;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    
    &:after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      right: 0;
      height: 2px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 1px;
    }
  }
  
  p {
    font-size: 16px;
    line-height: 1.6;
    white-space: pre-wrap;
    word-break: keep-all;
    word-wrap: break-word;
    opacity: 0.95;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
`;

const Card = styled(motion.div)<CardProps>`
  position: absolute;
  width: 300px;
  height: ${(props: CardProps) => props.$isExpanded ? 'auto' : '400px'};
  min-height: 400px;
  transform-origin: center top;
  will-change: transform;
  z-index: ${(props: CardProps) => props.$isExpanded ? 2 : 'auto'};
  overflow: visible;
  opacity: 1;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 25px;
  background: ${(props: CardProps) => props.$color};
  padding: 25px;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;

  ${props => props.$isExpanded && `
    height: auto;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);

    @media (max-width: 768px) {
      width: calc(100vw - 40px);
      left: 50%;
      transform: translateX(-50%) !important;
    }

    @media (max-width: 480px) {
      width: calc(100vw - 20px);
    }

    /* 스크롤바 스타일링 */
    &::-webkit-scrollbar {
      width: 8px;
    }
    
    &::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 4px;
      
      &:hover {
        background: rgba(255, 255, 255, 0.3);
      }
    }
  `}

  // 호버 효과 추가
  &:hover {
    ${props => !props.$isExpanded && `
      transform: scale(1.02) !important;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.35);
    `}
  }
`;

export default function PolicyCarousel({ policies = [], onTestClick }: PolicyCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [expandedDetails, setExpandedDetails] = useState<string[]>([]);

  const toggleDetail = (e: React.MouseEvent, detailKey: string) => {
    e.stopPropagation();
    setExpandedDetails(prev => 
      prev.includes(detailKey) 
        ? prev.filter(key => key !== detailKey)
        : [...prev, detailKey]
    );
  };

  const getCardTransform = (index: number, total: number, isHovered: boolean = false) => {
    // 기본 설정
    const radius = 400;  // 원통의 반지름
    const angleRange = Math.PI / 2;  // 90도
    
    // 현재 인덱스를 기준으로 상대적 위치 계산 (순서를 반대로)
    const relativeIndex = ((total - index + currentIndex) % total);
    const theta = (relativeIndex / (total - 1) - 0.5) * angleRange;
    
    // 좌표 계산
    let xPos, zPos, rotateY;
    
    if (relativeIndex === 0) {
      // 현재 선택된 카드는 정중앙에 정면으로
      xPos = 0;
      zPos = 100;
      rotateY = 0;
    } else {
      // 나머지 카드들은 원형으로 배치
      xPos = radius * Math.sin(theta);
      zPos = -Math.abs(radius * Math.cos(theta)) - (Math.abs(relativeIndex) * 20);
      rotateY = (theta * 180) / Math.PI;
    }
    
    // z-index 계산
    const zIndex = relativeIndex === 0 ? 1000 : (90 - Math.abs(relativeIndex) * 5);
    
    const baseTransform = {
      x: xPos,
      y: 0,
      z: zPos,
      rotateY,
      scale: 1,
      zIndex,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    } as const;

    if (isHovered) {
      return {
        ...baseTransform,
        y: relativeIndex === 0 ? 0 : -5,
        z: zPos + (relativeIndex === 0 ? 20 : 30),
        scale: 1.05
      } as const;
    }

    return baseTransform;
  };

  const handleCardClick = (policy: Policy, index: number, e: React.MouseEvent) => {
    if (isRotating) return;
    
    // 현재 선택된 카드를 다시 클릭한 경우
    if (selectedPolicy?._id === policy._id) {
      setIsExpanded(prev => !prev);
      if (isExpanded) {
        setTimeout(() => {
          setSelectedPolicy(null);
          setExpandedDetails([]);
        }, 500);
      }
      return;
    }

    // 새로운 카드를 클릭한 경우
    setSelectedPolicy(policy);
    setExpandedDetails([]);
    setIsExpanded(true);
  };

  const rotateLeft = () => {
    if (!isExpanded && !isRotating && policies.length > 0) {
      setIsRotating(true);
      setCurrentIndex((prev) => (prev - 1 + policies.length) % policies.length);
      setTimeout(() => setIsRotating(false), 800);
    }
  };

  const rotateRight = () => {
    if (!isExpanded && !isRotating && policies.length > 0) {
      setIsRotating(true);
      setCurrentIndex((prev) => (prev + 1) % policies.length);
      setTimeout(() => setIsRotating(false), 800);
    }
  };

  const handleClose = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsExpanded(false);
    setTimeout(() => setSelectedPolicy(null), 500);
  };

  if (policies.length === 0) {
    return (
      <LoadingContainer>
        <div>정책을 불러오는 중입니다...</div>
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <Title>세상을 바꾸는 10가지 방법</Title>
      <CarouselContainer $isExpanded={isExpanded}>
        <NavigationButton 
          className="left" 
          onClick={rotateLeft}
          style={{ opacity: isExpanded || isRotating ? 0 : 1 }}
        >
          ←
        </NavigationButton>
        <CardsContainer>
          {policies.map((policy, index) => {
            const isSelected = policy._id === selectedPolicy?._id;
            
            return (
              <Card
                key={policy._id}
                $index={index}
                $color={policy.color}
                $isExpanded={isSelected && isExpanded}
                $total={policies.length}
                onClick={(e: React.MouseEvent) => handleCardClick(policy, index, e)}
                initial={false}
                animate={
                  isSelected && isExpanded
                    ? {
                        ...getCardTransform(index, policies.length),
                        transition: {
                          type: "spring",
                          stiffness: 400,
                          damping: 30
                        }
                      }
                    : getCardTransform(index, policies.length)
                }
                whileHover={
                  !isExpanded && !isSelected
                    ? getCardTransform(index, policies.length, true)
                    : {}
                }
              >
                <CardContent>
                  <h2>{policy.title}</h2>
                  <p>{policy.description}</p>
                  
                  <AnimatePresence>
                    {isSelected && isExpanded && (
                      <>
                        <CloseButton
                          onClick={handleClose}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                          transition={{ duration: 0.2 }}
                          title="카드 닫기"
                        >
                          ×
                        </CloseButton>
                        <DetailPolicies>
                          {policy.detailPolicies?.map((detail, idx) => (
                            <DetailPolicy
                              key={detail._key}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              transition={{ delay: idx * 0.05 }}
                            >
                              <DetailPolicyHeader 
                                onClick={(e) => toggleDetail(e, detail._key)}
                                title="클릭하여 세부내용 보기"
                              >
                                <h3>{detail.title}</h3>
                                <svg 
                                  viewBox="0 0 24 24"
                                  className={expandedDetails.includes(detail._key) ? 'expanded' : ''}
                                >
                                  <path 
                                    d="M7 10l5 5 5-5" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    strokeWidth="2"
                                  />
                                </svg>
                              </DetailPolicyHeader>
                              <AnimatePresence>
                                {expandedDetails.includes(detail._key) && (
                                  <DetailPolicyContent
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <ReactMarkdown>{detail.description}</ReactMarkdown>
                                  </DetailPolicyContent>
                                )}
                              </AnimatePresence>
                            </DetailPolicy>
                          ))}
                        </DetailPolicies>
                      </>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            );
          })}
        </CardsContainer>
        <NavigationButton 
          className="right" 
          onClick={rotateRight}
          style={{ opacity: isExpanded || isRotating ? 0 : 1 }}
        >
          →
        </NavigationButton>
      </CarouselContainer>
      <TestButton
        onClick={onTestClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{ 
          position: 'fixed',
          bottom: isExpanded ? '20px' : '40px',
          transition: 'bottom 0.3s ease'
        }}
      >
        나는 어떤 세상 바꾸미일까? →
      </TestButton>
    </Container>
  );
} 