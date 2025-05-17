'use client';// 빌드 오류 수정 - ref 콜백이 올바른 타입을 반환하도록 수정

import { useState, useEffect, useRef } from 'react';import styled from 'styled-components';import { motion } from 'framer-motion';import { client, previewClient } from '@/app/president2025/config/lib/client';
import { urlForImage } from '@/app/president2025/config/lib/image';
import { useRouter } from 'next/navigation';import Image from 'next/image';import { PageTitle } from '@/app/components/CommonStyles';

const Container = styled.div`
  width: 100%;
  min-height: calc(100vh - 85px);
  padding-top: 85px;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
  overflow-x: hidden;
  overflow-y: auto;
  background: transparent;
  box-sizing: border-box;
  padding-bottom: 4rem;

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
    padding-left: 0;
    padding-right: 0;
    min-height: calc(100vh - 90px);
    height: auto;
    max-width: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 3rem;
  }
`;

// PageTitle에서 상속받아 색상만 변경
const Title = styled(PageTitle)`
  color: white;
  opacity: 0.9;
`;

const Grid = styled.div`
  width: 100%;
  max-width: 500px;
  margin: 2rem auto;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  align-items: center;
  
  @media (max-width: 768px) {
    gap: 2rem;
  }
  
  @media (max-width: 480px) {
    gap: 1.5rem;
    width: calc(100% - 2rem);
  }
`;

const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  cursor: pointer;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
  }
  
  @media (max-width: 480px) {
    max-width: 100%;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 500px;
  overflow: hidden;
  border-radius: 15px 15px 0 0;
  background-color: rgba(0, 0, 0, 0.05);
  
  @media (max-width: 480px) {
    height: calc(100vw - 2rem);
  }
`;

const ImageSlider = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease;
  cursor: grab;
  
  &:active {
    cursor: grabbing;
  }
`;

const ImageItem = styled.div`
  flex-shrink: 0;
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const DotsContainer = styled.div`
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 6px;
  z-index: 5;
  padding: 5px 0;
`;

const Dot = styled.div<{ $active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.$active ? 'white' : 'rgba(255, 255, 255, 0.4)'};
  transition: background-color 0.3s ease;
`;

const MultipleImagesIndicator = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border-radius: 12px;
  padding: 4px 8px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 4px;
  z-index: 5;
`;

const CardContent = styled.div`
  padding: 1.5rem;
  color: white;
  display: flex;
  flex-direction: column;
  min-height: 200px;
  position: relative;
`;

const CardTitle = styled.h2`
  font-size: 1.3rem;
  margin-bottom: 0.75rem;
  color: rgba(255, 255, 255, 0.9);
  font-family: 'GamtanRoad Gamtan', sans-serif;
  word-break: keep-all;
  line-height: 1.4;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const CardDescription = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 2rem;
  line-height: 1.6;
  word-break: keep-all;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  margin-top: auto;
  position: absolute;
  bottom: 2.5rem;
  left: 1.5rem;
  right: 1.5rem;
`;

const Tag = styled.span`
  background: rgba(255, 255, 255, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const DateText = styled.p`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
  position: absolute;
  bottom: 1.5rem;
  left: 1.5rem;
`;

// 모달 컴포넌트 스타일
const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
  overflow-y: auto;
`;

const ModalContent = styled(motion.div)`
  background: rgba(30, 30, 30, 0.95);
  border-radius: 15px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  @media (max-width: 768px) {
    max-width: 100%;
    max-height: 80vh;
  }
`;

const ModalHeader = styled.div`
  padding: 1rem;
  position: sticky;
  top: 0;
  background: rgba(30, 30, 30, 0.95);
  z-index: 10;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalClose = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ModalBody = styled.div`
  padding: 1rem;
`;

const ModalImageContainer = styled.div`
  width: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
`;

const ModalImageSlider = styled.div`
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding: 1rem;
  scroll-behavior: smooth;
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }
`;

const ModalImageWrapper = styled.div`
  flex-shrink: 0;
  width: 500px;
  height: 500px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  overflow: hidden;
  
  @media (max-width: 768px) {
    width: 300px;
    height: 300px;
  }
`;

// 화살표 버튼 스타일 컴포넌트 추가
const ArrowButton = styled.button<{ $direction: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${props => props.$direction === 'left' ? 'left: 10px;' : 'right: 10px;'}
  background: rgba(0, 0, 0, 0.5);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  z-index: 5;
  transition: all 0.2s ease;
  opacity: 0.7;
  
  &:hover {
    background: rgba(0, 0, 0, 0.7);
    opacity: 1;
  }
  
  &:focus {
    outline: none;
  }
  
  &::before {
    content: '';
    width: 0;
    height: 0;
    border-style: solid;
    ${props => props.$direction === 'left' 
      ? 'border-width: 6px 10px 6px 0; border-color: transparent white transparent transparent;' 
      : 'border-width: 6px 0 6px 10px; border-color: transparent transparent transparent white;'}
  }
  
  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
    ${props => props.$direction === 'left' ? 'left: 5px;' : 'right: 5px;'}
  }
  
  @media (max-width: 480px) {
    width: 24px;
    height: 24px;
  }
`;

// 모달 화살표 버튼도 모바일 대응
const ModalArrowButton = styled.button<{ $direction: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${props => props.$direction === 'left' ? 'left: 5px;' : 'right: 5px;'}
  background: rgba(0, 0, 0, 0.5);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  z-index: 10;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
  
  &:focus {
    outline: none;
  }
  
  &::before {
    content: '';
    width: 0;
    height: 0;
    border-style: solid;
    ${props => props.$direction === 'left' 
      ? 'border-width: 8px 12px 8px 0; border-color: transparent white transparent transparent;' 
      : 'border-width: 8px 0 8px 12px; border-color: transparent transparent transparent white;'}
  }
  
  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    
    &::before {
      ${props => props.$direction === 'left' 
        ? 'border-width: 6px 9px 6px 0;' 
        : 'border-width: 6px 0 6px 9px;'}
    }
  }
`;

interface CardNews {
  _id: string;
  title: string;
  description: string;
  images: {
    _type: string;
    asset: {
      _ref: string;
      url: string;
    };
  }[];
  publishedAt: string;
  tags: string[];
}

export default function GalleryPage() {
  const [cardNews, setCardNews] = useState<CardNews[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<CardNews | null>(null);
  const [currentImageIndices, setCurrentImageIndices] = useState<{ [key: string]: number }>({});
  const [startX, setStartX] = useState<{ [key: string]: number }>({});
  const slidersRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const router = useRouter();

  // 스크롤 위치에 따라 애니메이션 적용을 위한 상태
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());
  
  // Intersection Observer를 사용하여 화면에 보이는 카드 감지
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.getAttribute('data-id');
        if (id) {
          if (entry.isIntersecting) {
            setVisibleCards(prev => new Set(prev).add(id));
          }
        }
      });
    }, { threshold: 0.1 });
    
    const cards = document.querySelectorAll('.policy-card');
    cards.forEach(card => observer.observe(card));
    
    return () => {
      cards.forEach(card => observer.unobserve(card));
    };
  }, [cardNews]);

  const fetchCardNews = async () => {
    setIsLoading(true);
    try {
      const query = `*[_type == "cardNews"] | order(publishedAt desc) {
        _id,
        title,
        description,
        images,
        publishedAt,
        tags
      }`;
      
      // previewClient를 사용하여 항상 최신 데이터 가져오기
      const result = await previewClient.fetch(query);
      setCardNews(result);
      console.log('데이터 로드 완료:', result.length, '개의 게시물');
    } catch (error) {
      console.error("카드뉴스 로딩 오류:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 한 번만 데이터 가져오기
  useEffect(() => {
    fetchCardNews();
  }, []);

  const [modalCurrentImageIndex, setModalCurrentImageIndex] = useState(0);

  const handleModalImageScroll = (direction: 'left' | 'right') => {
    if (!selectedPost) return;
    
    const totalImages = selectedPost.images.length;
    let newIndex = modalCurrentImageIndex;
    
    if (direction === 'left' && modalCurrentImageIndex > 0) {
      newIndex = modalCurrentImageIndex - 1;
    } else if (direction === 'right' && modalCurrentImageIndex < totalImages - 1) {
      newIndex = modalCurrentImageIndex + 1;
    }
    
    setModalCurrentImageIndex(newIndex);
    
    const slider = document.querySelector('.modal-image-slider') as HTMLElement;
    if (slider) {
      const scrollAmount = newIndex * (500 + 16); // 이미지 너비 + 갭
      slider.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const openModal = (post: CardNews) => {
    setSelectedPost(post);
    setModalCurrentImageIndex(0);
    // 스크롤 막기
    document.body.style.overflow = 'hidden';
    
    // 모달 이미지 스크롤 초기화
    setTimeout(() => {
      const slider = document.querySelector('.modal-image-slider') as HTMLElement;
      if (slider) {
        slider.scrollTo({ left: 0, behavior: 'auto' });
      }
    }, 100);
  };

  const closeModal = () => {
    setSelectedPost(null);
    // 스크롤 원복
    document.body.style.overflow = 'auto';
  };

  // ESC 키 누르면 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedPost) {
        closeModal();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPost]);

  // 이미지 슬라이더 관련 함수들
  const handleTouchStart = (e: React.TouchEvent, postId: string) => {
    const touch = e.touches[0];
    setStartX({...startX, [postId]: touch.clientX});
  };

  const handleMouseDown = (e: React.MouseEvent, postId: string) => {
    setStartX({...startX, [postId]: e.clientX});
    
    const handleMouseMove = (e: MouseEvent) => {
      if (startX[postId]) {
        const slider = slidersRef.current[postId];
        if (!slider) return;
        
        const x = e.clientX;
        const diff = startX[postId] - x;
        
        if (Math.abs(diff) > 5) {
          e.preventDefault();
          handleSlide(diff, postId);
        }
      }
    };
    
    const handleMouseUp = () => {
      setStartX({...startX, [postId]: 0});
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchMove = (e: React.TouchEvent, postId: string) => {
    if (startX[postId]) {
      const touch = e.touches[0];
      const diff = startX[postId] - touch.clientX;
      
      if (Math.abs(diff) > 5) {
        handleSlide(diff, postId);
      }
    }
  };

  const handleTouchEnd = (postId: string) => {
    setStartX({...startX, [postId]: 0});
  };

  const handleSlide = (diff: number, postId: string) => {
    const post = cardNews.find(p => p._id === postId);
    if (!post) return;
    
    const totalImages = post.images.length;
    if (totalImages <= 1) return;
    
    const currentIndex = currentImageIndices[postId] || 0;
    
    if (diff > 50 && currentIndex < totalImages - 1) {
      // 왼쪽으로 스와이프 - 다음 이미지
      setCurrentImageIndices({...currentImageIndices, [postId]: currentIndex + 1});
    } else if (diff < -50 && currentIndex > 0) {
      // 오른쪽으로 스와이프 - 이전 이미지
      setCurrentImageIndices({...currentImageIndices, [postId]: currentIndex - 1});
    }
  };

  // 이미지 닷(인디케이터) 클릭 핸들러
  const handleDotClick = (e: React.MouseEvent, postId: string, index: number) => {
    e.stopPropagation(); // 카드 클릭 이벤트가 발생하지 않도록 방지
    setCurrentImageIndices({...currentImageIndices, [postId]: index});
  };

  // handlePrevImage와 handleNextImage 함수 추가
  const handlePrevImage = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    const currentIndex = currentImageIndices[postId] || 0;
    if (currentIndex > 0) {
      setCurrentImageIndices({...currentImageIndices, [postId]: currentIndex - 1});
    }
  };

  const handleNextImage = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    const post = cardNews.find(p => p._id === postId);
    if (!post) return;
    
    const currentIndex = currentImageIndices[postId] || 0;
    if (currentIndex < post.images.length - 1) {
      setCurrentImageIndices({...currentImageIndices, [postId]: currentIndex + 1});
    }
  };

  if (isLoading) {
    return (
      <Container>
        <Title>정책 갤러리</Title>
        <div style={{ color: 'white', textAlign: 'center', marginTop: '2rem' }}>
          로딩 중...
        </div>
      </Container>
    );
  }

  if (cardNews.length === 0) {
    return (
      <Container>
        <Title>정책 갤러리</Title>
        <div style={{ color: 'white', textAlign: 'center', marginTop: '2rem' }}>
          등록된 정책 이미지가 없습니다
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Title>정책 갤러리</Title>
      
      <Grid>
        {cardNews.map((post) => {
          const currentIndex = currentImageIndices[post._id] || 0;
          const isVisible = visibleCards.has(post._id);
          
          return (
            <Card 
              key={post._id}
              data-id={post._id}
              onClick={() => openModal(post)}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
              className="policy-card"
            >
              <ImageContainer>
                <ImageSlider
                  ref={(el) => {
                    slidersRef.current[post._id] = el;
                    return undefined;
                  }}
                  style={{
                    transform: `translateX(-${currentIndex * 100}%)`
                  }}
                  onTouchStart={(e) => handleTouchStart(e, post._id)}
                  onTouchMove={(e) => handleTouchMove(e, post._id)}
                  onTouchEnd={() => handleTouchEnd(post._id)}
                  onMouseDown={(e) => handleMouseDown(e, post._id)}
                >
                  {post.images.map((image, index) => (
                    <ImageItem key={index}>
                      <Image 
                        src={urlForImage(image).width(500).height(500).fit('crop').crop('center').url()}
                        alt={post.title}
                        width={500}
                        height={500}
                        priority={index === 0}
                        style={{ 
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </ImageItem>
                  ))}
                </ImageSlider>
                
                {post.images.length > 1 && (
                  <>
                    <ArrowButton 
                      $direction="left" 
                      onClick={(e) => handlePrevImage(e, post._id)}
                      style={{ display: currentIndex === 0 ? 'none' : 'flex' }}
                    />
                    <ArrowButton 
                      $direction="right" 
                      onClick={(e) => handleNextImage(e, post._id)}
                      style={{ display: currentIndex === post.images.length - 1 ? 'none' : 'flex' }}
                    />
                    <DotsContainer>
                      {post.images.map((_, index) => (
                        <Dot 
                          key={index} 
                          $active={currentIndex === index}
                          onClick={(e) => handleDotClick(e, post._id, index)}
                        />
                      ))}
                    </DotsContainer>
                  </>
                )}
              </ImageContainer>
              
              <CardContent>
                <CardTitle>{post.title}</CardTitle>
                <CardDescription>{post.description}</CardDescription>
                
                <TagContainer>
                  {post.tags?.slice(0, 3).map((tag, idx) => (
                    <Tag key={idx}>{tag}</Tag>
                  ))}
                  {post.tags?.length > 3 && (
                    <Tag>+{post.tags.length - 3}</Tag>
                  )}
                </TagContainer>
                
                <DateText>
                  {new Date(post.publishedAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </DateText>
              </CardContent>
            </Card>
          );
        })}
      </Grid>
      
      {/* 모달 */}
      {selectedPost && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
        >
          <ModalContent 
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <ModalHeader>
              <h2 style={{ margin: 0, fontSize: '1.3rem', color: 'white' }}>{selectedPost.title}</h2>
              <ModalClose onClick={closeModal}>×</ModalClose>
            </ModalHeader>
            
            <ModalBody>
              <ModalImageContainer>
                {selectedPost.images.length > 1 && (
                  <ModalArrowButton 
                    $direction="left" 
                    onClick={() => handleModalImageScroll('left')}
                    style={{ display: modalCurrentImageIndex === 0 ? 'none' : 'flex' }}
                  />
                )}
                <ModalImageSlider className="modal-image-slider">
                  {selectedPost.images.map((image, index) => (
                    <ModalImageWrapper key={index}>
                      <Image 
                        src={urlForImage(image).width(500).height(500).fit('max').url()}
                        alt={`${selectedPost.title} - 이미지 ${index + 1}`}
                        width={500}
                        height={500}
                        style={{ 
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    </ModalImageWrapper>
                  ))}
                </ModalImageSlider>
                {selectedPost.images.length > 1 && (
                  <ModalArrowButton 
                    $direction="right" 
                    onClick={() => handleModalImageScroll('right')}
                    style={{ display: modalCurrentImageIndex === selectedPost.images.length - 1 ? 'none' : 'flex' }}
                  />
                )}
              </ModalImageContainer>
              
              <div style={{ marginTop: '1rem', color: 'white' }}>
                <p style={{ fontSize: '1rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                  {selectedPost.description}
                </p>
                
                {selectedPost.tags?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                    {selectedPost.tags.map((tag, idx) => (
                      <Tag key={idx}>{tag}</Tag>
                    ))}
                  </div>
                )}
                
                <DateText>
                  {new Date(selectedPost.publishedAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </DateText>
              </div>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
} 