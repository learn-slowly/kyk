'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import * as reactPdf from 'react-pdf';
import 'react-pdf/dist/cjs/Page/AnnotationLayer.css';
import 'react-pdf/dist/cjs/Page/TextLayer.css';

const { Document, Page, pdfjs } = reactPdf;

// PDF.js worker 설정
if (typeof window !== 'undefined' && pdfjs) {
  pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
}

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background: #2a2a2a;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding-bottom: 100px;
  box-sizing: border-box;
`;

const BookWrapper = styled.div`
  position: relative;
  width: 90%;
  max-width: 1400px;
  height: calc(80vh - 100px); /* 컨트롤을 위한 공간 확보 */
  perspective: 3000px;
  transform-style: preserve-3d;
`;

const Book = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PageContainer = styled(motion.div)<{ $side: 'left' | 'right' }>`
  position: absolute;
  width: 50%;
  height: 100%;
  ${props => props.$side === 'left' ? 'left: 0;' : 'right: 0;'}
  transform-style: preserve-3d;
  transform-origin: ${props => props.$side === 'left' ? 'right center' : 'left center'};
`;

const PageFace = styled.div<{ $face: 'front' | 'back' }>`
  position: absolute;
  width: 100%;
  height: 100%;
  background: white;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: ${props => props.$face === 'front' 
    ? 'inset -10px 0 30px rgba(0,0,0,0.1)' 
    : 'inset 10px 0 30px rgba(0,0,0,0.1)'};
  transform: ${props => props.$face === 'back' ? 'rotateY(180deg)' : 'rotateY(0deg)'};
  
  .react-pdf__Page {
    max-width: 100%;
    max-height: 100%;
    
    canvas {
      max-width: 100% !important;
      height: auto !important;
    }
  }
`;

const Controls = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 20px;
  align-items: center;
  background: rgba(0, 0, 0, 0.8);
  padding: 12px 24px;
  border-radius: 40px;
  backdrop-filter: blur(10px);
  z-index: 100;
  
  @media (max-width: 768px) {
    gap: 15px;
    padding: 8px 16px;
    bottom: 15px;
  }
`;

const NavButton = styled.button`
  background: transparent;
  border: 2px solid white;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover:not(:disabled) {
    background: white;
    color: black;
    transform: scale(1.1);
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    width: 35px;
    height: 35px;
    font-size: 16px;
    border-width: 1.5px;
  }
`;

const PageIndicator = styled.div`
  color: white;
  font-size: 16px;
  min-width: 100px;
  text-align: center;
  font-weight: 300;
  
  @media (max-width: 768px) {
    font-size: 14px;
    min-width: 80px;
  }
`;

const TouchArea = styled.div<{ $side: 'left' | 'right' }>`
  position: absolute;
  top: 0;
  ${props => props.$side === 'left' ? 'left: 0' : 'right: 0'};
  width: 50%;
  height: 100%;
  cursor: pointer;
  z-index: 10;
  background: transparent;
`;

const LoadingMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  font-size: 24px;
`;

const LoadingIcon = styled(motion.div)`
  display: inline-block;
  margin-bottom: 20px;
  font-size: 48px;
`;

interface PDFFlipBookProps {
  file: string;
  startPage?: number;
}

export default function PDFFlipBook({ file, startPage = 1 }: PDFFlipBookProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(startPage);
  const [isFlipping, setIsFlipping] = useState(false);
  const [scale, setScale] = useState(1);
  const [error, setError] = useState<string | null>(null);
  
  // 페이지 상태 관리
  const [leftPage, setLeftPage] = useState(currentPage);
  const [rightPage, setRightPage] = useState(currentPage + 1);
  const [flipDirection, setFlipDirection] = useState<'forward' | 'backward'>('forward');

  // currentPage가 변경될 때 leftPage와 rightPage 동기화
  useEffect(() => {
    setLeftPage(currentPage);
    setRightPage(currentPage + 1);
  }, [currentPage]);

  useEffect(() => {
    const updateScale = () => {
      const containerWidth = window.innerWidth * 0.9;
      const pageWidth = containerWidth * 0.5;
      const baseScale = pageWidth / 600;
      setScale(Math.min(baseScale, 1.2));
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('PDF 로드 에러:', error);
    setError(`PDF 파일을 불러올 수 없습니다: ${error.message}`);
  };

  const flipForward = useCallback(() => {
    if (!numPages || currentPage >= numPages - 1 || isFlipping) return;
    
    setIsFlipping(true);
    setFlipDirection('forward');
    
    setTimeout(() => {
      setCurrentPage(prev => prev + 2);
      setIsFlipping(false);
    }, 600);
  }, [numPages, currentPage, isFlipping]);

  const flipBackward = useCallback(() => {
    if (currentPage <= 1 || isFlipping) return;
    
    setIsFlipping(true);
    setFlipDirection('backward');
    
    setTimeout(() => {
      setCurrentPage(prev => prev - 2);
      setIsFlipping(false);
    }, 600);
  }, [currentPage, isFlipping]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') flipBackward();
      if (e.key === 'ArrowRight') flipForward();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [flipBackward, flipForward]);

  const pageVariants = {
    initial: {
      rotateY: 0,
    },
    flip: {
      rotateY: -180,
      transition: {
        duration: 0.6,
        ease: [0.645, 0.045, 0.355, 1],
      }
    }
  };

  return (
    <Container>
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading={
          <LoadingMessage>
            <LoadingIcon
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              ⏳
            </LoadingIcon>
            PDF를 불러오는 중...
          </LoadingMessage>
        }
        error={
          <LoadingMessage>
            <div style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: '20px', fontSize: '48px' }}>⚠️</div>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>
                {error || 'PDF 파일을 불러올 수 없습니다.'}
              </div>
              <div style={{ fontSize: '16px', opacity: 0.7 }}>
                파일 경로: {file}
              </div>
            </div>
          </LoadingMessage>
        }
      >
        <BookWrapper>
          <Book>
            {/* 왼쪽 페이지 */}
            <PageContainer $side="left">
              <PageFace $face="front">
                {leftPage > 0 && leftPage <= (numPages || 0) && (
                  <Page
                    pageNumber={leftPage}
                    scale={scale}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                )}
              </PageFace>
            </PageContainer>

            {/* 오른쪽 페이지 (넘기는 페이지) */}
            <AnimatePresence>
              {isFlipping && flipDirection === 'forward' && (
                <PageContainer
                  $side="right"
                  as={motion.div}
                  initial="initial"
                  animate="flip"
                  exit="initial"
                  variants={pageVariants}
                  style={{ zIndex: 100 }}
                >
                  <PageFace $face="front">
                    {rightPage > 0 && rightPage <= (numPages || 0) && (
                      <Page
                        pageNumber={rightPage}
                        scale={scale}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                      />
                    )}
                  </PageFace>
                  <PageFace $face="back">
                    {rightPage + 1 > 0 && rightPage + 1 <= (numPages || 0) && (
                      <Page
                        pageNumber={rightPage + 1}
                        scale={scale}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                      />
                    )}
                  </PageFace>
                </PageContainer>
              )}
            </AnimatePresence>

            {/* 뒤로 넘기는 페이지 */}
            <AnimatePresence>
              {isFlipping && flipDirection === 'backward' && (
                <PageContainer
                  $side="left"
                  as={motion.div}
                  initial={{ rotateY: -180 }}
                  animate={{ rotateY: 0 }}
                  exit={{ rotateY: -180 }}
                  transition={{ duration: 0.6, ease: [0.645, 0.045, 0.355, 1] }}
                  style={{ zIndex: 100 }}
                >
                  <PageFace $face="front">
                    {leftPage - 2 > 0 && leftPage - 2 <= (numPages || 0) && (
                      <Page
                        pageNumber={leftPage - 2}
                        scale={scale}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                      />
                    )}
                  </PageFace>
                  <PageFace $face="back">
                    {leftPage - 1 > 0 && leftPage - 1 <= (numPages || 0) && (
                      <Page
                        pageNumber={leftPage - 1}
                        scale={scale}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                      />
                    )}
                  </PageFace>
                </PageContainer>
              )}
            </AnimatePresence>

            {/* 고정된 오른쪽 페이지 */}
            <PageContainer $side="right">
              <PageFace $face="front">
                {rightPage > 0 && rightPage <= (numPages || 0) && (
                  <Page
                    pageNumber={rightPage}
                    scale={scale}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                )}
              </PageFace>
            </PageContainer>

            {/* 터치 영역 */}
            <TouchArea $side="left" onClick={flipBackward} />
            <TouchArea $side="right" onClick={flipForward} />
          </Book>
        </BookWrapper>
      </Document>

      <Controls>
        <NavButton onClick={flipBackward} disabled={currentPage <= 1}>
          ◀
        </NavButton>
        
        <PageIndicator>
          {leftPage}-{rightPage} / {numPages || '...'}
        </PageIndicator>
        
        <NavButton onClick={flipForward} disabled={!numPages || currentPage >= numPages - 1}>
          ▶
        </NavButton>
      </Controls>
    </Container>
  );
} 