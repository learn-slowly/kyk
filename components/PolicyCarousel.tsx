'use client';

import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useState, Fragment, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Policy } from '@/types/policy';
import ReactMarkdown from 'react-markdown';
import { PageTitle } from '@/app/components/CommonStyles';

interface PolicyCarouselProps {
  policies: Policy[];
}

interface CardProps {
  $index: number;
  $color: string;
  $isExpanded: boolean;
  $total: number;
  $isCenter: boolean;
}

// blockContent를 문자열로 변환하는 함수
interface BlockContent {
  _type?: string;
  children?: Array<{
    text?: string;
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
}

const blockContentToString = (content: BlockContent | BlockContent[] | string | null | undefined | unknown): string => {
  if (!content) return '';
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content
      .map(block => {
        if (!block) return '';
        if (typeof block === 'string') return block;
        if (typeof block === 'object' && block !== null && '_type' in block && block._type === 'block') {
          const blockObj = block as BlockContent;
          if (!blockObj.children) return '';
          return blockObj.children
            .map((child) => {
              if (!child) return '';
              if (typeof child === 'string') return child;
              return child.text || '';
            })
            .filter(Boolean)
            .join('');
        }
        return '';
      })
      .filter(Boolean)
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

// PageTitle에서 상속받아 색상만 변경
const Title = styled(PageTitle)`
  color: white;
  opacity: 0.9;
  margin: 0;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::after {
    bottom: -10px; /* 밑줄과 글씨 사이 간격 늘림 */
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
  height: 450px;
  transform-style: preserve-3d;
  margin: 0 auto;
  perspective: 2000px;

  @media (max-width: 768px) {
    width: 260px;
    height: 410px;
  }
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
    font-weight: 400;
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
  top: 20%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.15);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  color: white;
  cursor: pointer;
  z-index: 2;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-50%) scale(1.1);
    border-color: rgba(255, 255, 255, 0.3);
  }
  
  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  &:disabled {
    opacity: 0;
    cursor: default;
    pointer-events: none;
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
    font-size: 1.2rem;
    top: 20%;
    
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
  height: 100%;
  
  .header {
    padding: 25px 25px 15px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .content {
    padding: 20px 25px;
    overflow-y: auto;
    flex: 1;
    display: flex;
    flex-direction: column;
    
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
    font-weight: 400;
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
    flex: 1;
    min-height: 0;
    overflow-y: auto;

    @media (max-width: 768px) {
      font-size: 14px;
    }
  }
`;

const ViewMoreButton = styled.div`
  text-align: center;
  padding: 10px;
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.9rem;
  opacity: 0.8;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  transition: opacity 0.2s ease;
  background: inherit;

  &:hover {
    opacity: 1;
  }

  i {
    font-size: 1.1rem;
  }

  @media (max-width: 768px) {
    padding: 8px;
    font-size: 0.8rem;
  }
`;

const Card = styled(motion.div)<CardProps>`
  position: absolute;
  width: 300px;
  height: ${(props: CardProps) => props.$isExpanded ? 'auto' : '450px'};
  min-height: 450px;
  transform-origin: ${props => props.$isExpanded ? 'center top' : 'center center'};
  will-change: transform;
  z-index: ${(props: CardProps) => props.$isExpanded ? 10 : 'auto'};
  overflow: visible;
  opacity: 1;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  background: ${(props: CardProps) => props.$color};
  padding: 0;
  cursor: pointer;
  box-shadow: ${props => props.$isCenter ? `
    0 15px 35px rgba(0, 0, 0, 0.4),
    0 3px 10px rgba(0, 0, 0, 0.3),
    -10px 0 20px rgba(0, 0, 0, 0.2),
    10px 0 20px rgba(0, 0, 0, 0.2)
  ` : '0 10px 30px rgba(0, 0, 0, 0.3)'};
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.3s ease;

  @media (max-width: 768px) {
    width: 260px;
    height: ${(props: CardProps) => props.$isExpanded ? 'auto' : '410px'};
    min-height: 410px;
  }

  ${props => props.$isExpanded && `
    position: fixed;
    transform: translate(-50%, -20%) !important; /* 상단 20%에 위치하도록 조정 */
    top: 20%;
    left: 50%;
    height: auto;
    max-height: 75vh;
    overflow-y: auto;
    box-shadow: 
      0 20px 60px rgba(0, 0, 0, 0.5),
      0 10px 30px rgba(0, 0, 0, 0.3),
      -15px 0 30px rgba(0, 0, 0, 0.2),
      15px 0 30px rgba(0, 0, 0, 0.2);
    margin: 0;
    z-index: 1000;

    @media (max-width: 768px) {
      width: 90%;
      max-width: 320px;
      transform: translate(-50%, -15%) !important; /* 모바일에서 더 위쪽에 위치 */
      top: 15%;
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
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 모바일 여부 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isExpanded && containerRef.current) {
        const expandedCard = containerRef.current.querySelector('[data-expanded="true"]');
        if (expandedCard && !expandedCard.contains(event.target as Node)) {
          handleClose();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  // 터치 이벤트 핸들러
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diff = touchStartX.current - touchEndX.current;
      const threshold = 50; // 스와이프 감지 임계값

      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          // 왼쪽으로 스와이프
          rotateRight();
        } else {
          // 오른쪽으로 스와이프
          rotateLeft();
        }
      }
    }
    
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const toggleDetail = (e: React.MouseEvent, detailKey: string) => {
    e.stopPropagation();
    setExpandedDetails(prev => 
      prev.includes(detailKey) 
        ? prev.filter(key => key !== detailKey)
        : [...prev, detailKey]
    );
  };

  const getCardTransform = (index: number, total: number) => {
    const radius = isMobile ? 250 : 400;  // 모바일에서는 더 작은 반경 사용
    const angleRange = Math.PI / 2;
    const relativeIndex = ((index - currentIndex + total) % total);
    const theta = (relativeIndex / (total - 1) - 0.5) * angleRange;
    
    let xPos, zPos, rotateY;
    
    if (relativeIndex === 0) {
      xPos = 0;
      zPos = 100;
      rotateY = 0;
    } else {
      xPos = radius * Math.sin(theta);
      zPos = -Math.abs(radius * Math.cos(theta)) - (Math.abs(relativeIndex) * 20);
      rotateY = (theta * 180) / Math.PI;
    }
    
    const zIndex = relativeIndex === 0 ? 1000 : (90 - Math.abs(relativeIndex) * 5);
    
    return {
      x: xPos,
      y: 0,
      z: zPos,
      rotateY,
      scale: isMobile ? 0.85 : 1,  // 모바일에서는 카드를 약간 더 축소
      zIndex,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30,
        mass: 0.8,
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
      setTimeout(() => setIsRotating(false), 500); // 애니메이션 시간 단축
    }
  };

  const rotateRight = () => {
    if (!isExpanded && !isRotating && policies.length > 0) {
      setIsRotating(true);
      setCurrentIndex((prev) => (prev + 1) % policies.length);
      setTimeout(() => setIsRotating(false), 500); // 애니메이션 시간 단축
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
    <Container 
      $isExpanded={isExpanded}
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <Title>세상을 바꾸는 10가지 방법</Title>
      <CarouselContainer $isExpanded={isExpanded}>
        <NavigationButton 
          className="left" 
          onClick={rotateLeft}
          disabled={isExpanded || isRotating}
        >
          ‹
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
            const relativeIndex = ((index - currentIndex + policies.length) % policies.length);
            const isCenter = relativeIndex === 0;
            
            return (
              <Fragment key={policy._id}>
                <Card
                  $index={index}
                  $color={policy.color}
                  $isExpanded={isSelected && isExpanded}
                  $total={policies.length}
                  $isCenter={isCenter}
                  onClick={() => handleCardClick(policy)}
                  initial={false}
                  animate={getCardTransform(index, policies.length)}
                  data-expanded={isSelected && isExpanded}
                >
                  <CardContent>
                    <div className="header">
                      <h2>{policy.title}</h2>
                    </div>
                    <div className="content">
                      <div className="description">
                        <ReactMarkdown>{blockContentToString(policy.description)}</ReactMarkdown>
                      </div>
                      <ViewMoreButton>
                        <span>클릭해서 자세히 보기</span>
                        <i className="bi bi-arrow-right-circle"></i>
                      </ViewMoreButton>
                      
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
          disabled={isExpanded || isRotating}
        >
          ›
        </NavigationButton>
      </CarouselContainer>
    </Container>
  );
} 