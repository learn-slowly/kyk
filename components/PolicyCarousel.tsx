'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, Fragment } from 'react';
import styled from 'styled-components';
import { Policy } from '@/types/policy';
import ReactMarkdown from 'react-markdown';

interface PolicyCarouselProps {
  policies: Policy[];
}

interface CardProps {
  $index: number;
  $color: string;
  $isExpanded: boolean;
  $total: number;
}

// blockContent를 문자열로 변환하는 함수
const blockContentToString = (content: any): string => {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content
      .map(block => {
        if (block._type === 'block') {
          return block.children
            .map((child: any) => child.text)
            .join('');
        }
        return '';
      })
      .join('\n\n');
  }
  return '';
};

const Container = styled.div<{ $isExpanded: boolean }>`
  width: 100%;
  min-height: calc(100vh - 85px);
  padding-top: 85px;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
  overflow-x: hidden;
  overflow-y: visible;
  background: transparent;

  &:before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
    z-index: -1;
    pointer-events: none;
  }

  @media (max-width: 768px) {
    padding-top: 90px;
    min-height: calc(100vh - 90px);
  }

  @media (max-width: 480px) {
    padding-top: 80px;
    min-height: calc(100vh - 80px);
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
  margin-top: 100px;
  min-height: ${props => props.$isExpanded ? '120vh' : '100vh'};
  padding-bottom: ${props => props.$isExpanded ? '200px' : '100px'};  // 푸터와의 간격 조정
  z-index: 2;

  @media (max-width: 768px) {
    padding: 0 10px;
    margin-top: 80px;
    min-height: ${props => props.$isExpanded ? '110vh' : '100vh'};
    padding-bottom: ${props => props.$isExpanded ? '150px' : '80px'};
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
  max-height: 60vh;
  overflow-y: auto;

  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 30%;
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
    left: calc(50% - 200px);
  }
  
  &.right {
    right: calc(50% - 200px);
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    top: 45%;
    
    &.left {
      left: calc(50% - 180px);
    }
    
    &.right {
      right: calc(50% - 180px);
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

const CardContent = styled.div`
  color: white;
  text-align: left;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  flex: 1;
  
  .header {
    padding: 25px 25px 15px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .content {
    padding: 20px 25px;
    overflow-y: auto;
    flex: 1;
    
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
  }
  
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
  
  .description {
    font-size: 16px;
    line-height: 1.6;
    opacity: 0.95;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

    p {
      margin: 0 0 1em;
      &:last-child {
        margin-bottom: 0;
      }
    }

    ul, ol {
      margin: 0.5em 0;
      padding-left: 1.5em;
    }

    li {
      margin: 0.3em 0;
    }

    a {
      color: inherit;
      text-decoration: underline;
      opacity: 0.9;
      
      &:hover {
        opacity: 1;
      }
    }
  }
`;

const Card = styled(motion.div)<CardProps>`
  position: absolute;
  width: 300px;
  height: ${(props: CardProps) => props.$isExpanded ? 'auto' : '400px'};
  min-height: 400px;
  transform-origin: center top;
  will-change: transform;
  z-index: ${(props: CardProps) => props.$isExpanded ? 10 : 'auto'};
  overflow: visible;
  opacity: 1;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  background: ${(props: CardProps) => props.$color};
  padding: 0;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.3s ease;

  ${props => props.$isExpanded && `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) !important;
    height: auto;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 
      0 10px 50px rgba(0, 0, 0, 0.5),
      0 20px 100px rgba(0, 0, 0, 0.3);
    margin: 0;
    z-index: 1000;

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
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

export default function PolicyCarousel({ policies = [] }: PolicyCarouselProps) {
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

  const getCardTransform = (index: number, total: number) => {
    // 기본 설정
    const radius = 400;  // 원통의 반지름
    const angleRange = Math.PI / 2;  // 90도
    
    // 현재 인덱스를 기준으로 상대적 위치 계산
    const relativeIndex = ((index - currentIndex + total) % total);
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
    
    return {
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
  };

  const handleCardClick = (policy: Policy) => {
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
    <>
      <Container $isExpanded={isExpanded}>
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
            <AnimatePresence>
              {isExpanded && (
                <Overlay
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={handleClose}
                />
              )}
            </AnimatePresence>
            {policies.map((policy, index) => {
              const isSelected = policy._id === selectedPolicy?._id;
              
              return (
                <Fragment key={policy._id}>
                  <Card
                    $index={index}
                    $color={policy.color}
                    $isExpanded={isSelected && isExpanded}
                    $total={policies.length}
                    onClick={() => handleCardClick(policy)}
                    initial={false}
                    animate={getCardTransform(index, policies.length)}
                  >
                    <CardContent>
                      <div className="header">
                        <h2>{policy.title}</h2>
                      </div>
                      <div className="content">
                        <div className="description">
                          <ReactMarkdown>{blockContentToString(policy.description)}</ReactMarkdown>
                        </div>
                        
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
                                          <ReactMarkdown>{blockContentToString(detail.description)}</ReactMarkdown>
                                        </DetailPolicyContent>
                                      )}
                                    </AnimatePresence>
                                  </DetailPolicy>
                                ))}
                              </DetailPolicies>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    </CardContent>
                  </Card>
                </Fragment>
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
      </Container>
    </>
  );
} 