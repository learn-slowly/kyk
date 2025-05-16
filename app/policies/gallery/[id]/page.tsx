'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { client } from '@/sanity/lib/client';
import { urlForImage } from '@/sanity/lib/image';
import { useParams, useRouter } from 'next/navigation';

const Container = styled.div`
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 1rem;
  color: #666;
  cursor: pointer;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: #333;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: #333;
`;

const Description = styled.p`
  font-size: 1.125rem;
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 2rem;
`;

const ImageWrapper = styled(motion.div)`
  width: 100%;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;

const NavButton = styled.button<{ $disabled?: boolean }>`
  background: ${props => props.$disabled ? '#f0f0f0' : '#333'};
  color: ${props => props.$disabled ? '#999' : 'white'};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  
  &:hover {
    background: ${props => props.$disabled ? '#f0f0f0' : '#444'};
  }
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;

const Tag = styled.span`
  background: #f0f0f0;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.875rem;
  color: #666;
`;

const DateText = styled.p`
  font-size: 0.875rem;
  color: #999;
  margin-bottom: 2rem;
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

export default function CardNewsDetailPage() {
  const [cardNews, setCardNews] = useState<CardNews | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchCardNews = async () => {
      const query = `*[_type == "cardNews" && _id == $id][0] {
        _id,
        title,
        description,
        images,
        publishedAt,
        tags
      }`;
      
      const result = await client.fetch(query, { id: params.id });
      setCardNews(result);
    };

    if (params.id) {
      fetchCardNews();
    }
  }, [params.id]);

  if (!cardNews) {
    return <Container>Loading...</Container>;
  }

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      (prev < (cardNews.images?.length || 0) - 1 ? prev + 1 : prev)
    );
  };

  return (
    <Container>
      <BackButton onClick={() => router.back()}>
        ← 목록으로 돌아가기
      </BackButton>
      <Title>{cardNews.title}</Title>
      <DateText>
        {new Date(cardNews.publishedAt).toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </DateText>
      {cardNews.tags && cardNews.tags.length > 0 && (
        <TagContainer>
          {cardNews.tags.map((tag, index) => (
            <Tag key={index}>{tag}</Tag>
          ))}
        </TagContainer>
      )}
      <Description>{cardNews.description}</Description>
      <ImageContainer>
        <AnimatePresence mode="wait">
          <ImageWrapper
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={urlForImage(cardNews.images[currentImageIndex]).url()}
              alt={`${cardNews.title} - 이미지 ${currentImageIndex + 1}`}
            />
          </ImageWrapper>
        </AnimatePresence>
      </ImageContainer>
      <NavigationButtons>
        <NavButton
          onClick={handlePrevImage}
          $disabled={currentImageIndex === 0}
        >
          이전
        </NavButton>
        <NavButton
          onClick={handleNextImage}
          $disabled={currentImageIndex === (cardNews.images?.length || 0) - 1}
        >
          다음
        </NavButton>
      </NavigationButtons>
    </Container>
  );
} 