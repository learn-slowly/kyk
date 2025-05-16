'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { client } from '@/sanity/lib/client';
import { urlForImage } from '@/sanity/lib/image';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const Container = styled.div`
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

const Grid = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    padding: 0 1rem;
    gap: 1rem;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
`;

const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  overflow: hidden;
`;

const CardContent = styled.div`
  padding: 1rem;
  color: white;
`;

const CardTitle = styled.h2`
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: rgba(255, 255, 255, 0.9);
  font-family: 'GamtanRoad Gamtan', sans-serif;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: keep-all;
  line-height: 1.4;
`;

const CardDescription = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.75rem;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: keep-all;
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Tag = styled.span`
  background: rgba(255, 255, 255, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const DateText = styled.p`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
`;

interface CardNews {
  _id: string;
  title: string;
  description: string;
  images: any[];
  publishedAt: string;
  tags: string[];
}

export default function GalleryPage() {
  const [cardNews, setCardNews] = useState<CardNews[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCardNews = async () => {
      const query = `*[_type == "cardNews"] | order(publishedAt desc) {
        _id,
        title,
        description,
        images,
        publishedAt,
        tags
      }`;
      
      const result = await client.fetch(query);
      setCardNews(result);
    };

    fetchCardNews();
  }, []);

  const handleCardClick = (id: string) => {
    router.push(`/policies/gallery/${id}`);
  };

  return (
    <Container>
      <Title>정책 갤러리</Title>
      <Grid>
        {cardNews.map((card) => (
          <Card
            key={card._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => handleCardClick(card._id)}
          >
            <ImageWrapper>
              {card.images?.[0] && (
                <Image
                  src={urlForImage(card.images[0]).url()}
                  alt={card.title}
                  fill
                  sizes="(max-width: 768px) 250px, 280px"
                  style={{ 
                    objectFit: 'cover',
                    position: 'absolute',
                  }}
                  priority
                />
              )}
            </ImageWrapper>
            <CardContent>
              <CardTitle>{card.title}</CardTitle>
              <CardDescription>
                {card.description.length > 50
                  ? `${card.description.slice(0, 50)}...`
                  : card.description}
              </CardDescription>
              {card.tags && card.tags.length > 0 && (
                <TagContainer>
                  {card.tags.slice(0, 2).map((tag, index) => (
                    <Tag key={index}>{tag}</Tag>
                  ))}
                </TagContainer>
              )}
              <DateText>
                {new Date(card.publishedAt).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </DateText>
            </CardContent>
          </Card>
        ))}
      </Grid>
    </Container>
  );
} 