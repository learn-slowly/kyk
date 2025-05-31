'use client';

import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import styled from 'styled-components';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// PDF.js worker 설정
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
  console.log('PDF.js worker path:', pdfjs.GlobalWorkerOptions.workerSrc);
}

const ViewerContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #1a1a1a;
  position: relative;
  overflow: hidden;
  padding-bottom: 100px;
  box-sizing: border-box;
`;

const BookContainer = styled.div`
  position: relative;
  width: 90%;
  max-width: 1200px;
  height: calc(80vh - 100px); /* 컨트롤을 위한 공간 확보 */
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 2000px;
`;

const PageWrapper = styled.div<{ $isActive: boolean; $position: 'left' | 'right' | 'hidden' }>`
  position: absolute;
  width: 45%;
  height: 100%;
  background: white;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);
  transition: all 0.6s cubic-bezier(0.645, 0.045, 0.355, 1);
  transform-style: preserve-3d;
  
  ${props => {
    if (props.$position === 'left') {
      return `
        left: 5%;
        transform: rotateY(0deg);
        z-index: 2;
      `;
    } else if (props.$position === 'right') {
      return `
        right: 5%;
        transform: rotateY(0deg);
        z-index: 2;
      `;
    } else {
      return `
        opacity: 0;
        transform: rotateY(90deg);
        z-index: 1;
      `;
    }
  }}
  
  @media (max-width: 768px) {
    width: 90%;
    ${props => props.$position === 'left' && 'left: 5%;'}
    ${props => props.$position === 'right' && 'right: 5%; display: none;'}
  }
`;

const PageContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  
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
  background: rgba(0, 0, 0, 0.7);
  padding: 15px 30px;
  border-radius: 50px;
  backdrop-filter: blur(10px);
  z-index: 100;
`;

const Button = styled.button`
  background: transparent;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 10px;
  border-radius: 50%;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
    transform: scale(1.1);
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const PageInfo = styled.span`
  color: white;
  font-size: 16px;
  min-width: 100px;
  text-align: center;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  font-size: 20px;
`;

interface PDFBookViewerProps {
  file: string; // PDF 파일 URL 또는 파일 객체
  startPage?: number;
}

export default function PDFBookViewer({ file, startPage = 1 }: PDFBookViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(startPage);
  const [loading, setLoading] = useState(true);
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // 화면 크기에 따라 스케일 조정
    const updateScale = () => {
      const containerWidth = window.innerWidth * 0.9;
      const maxPageWidth = isMobile ? containerWidth * 0.9 : containerWidth * 0.45;
      const baseScale = maxPageWidth / 600; // 600px을 기준으로 스케일 계산
      setScale(Math.min(baseScale, 1.5));
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [isMobile]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('PDF 로드 에러:', error);
    setError(`PDF 파일을 불러올 수 없습니다: ${error.message}`);
    setLoading(false);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - (isMobile ? 1 : 2));
    }
  };

  const goToNextPage = () => {
    if (numPages && currentPage < numPages) {
      setCurrentPage(currentPage + (isMobile ? 1 : 2));
    }
  };

  // 키보드 네비게이션
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevPage();
      } else if (e.key === 'ArrowRight') {
        goToNextPage();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, numPages]);

  const renderPage = (pageNumber: number) => {
    if (!numPages || pageNumber > numPages || pageNumber < 1) return null;

    return (
      <Page
        pageNumber={pageNumber}
        scale={scale}
        renderTextLayer={false}
        renderAnnotationLayer={false}
      />
    );
  };

  return (
    <ViewerContainer>
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading={<LoadingOverlay>PDF를 불러오는 중...</LoadingOverlay>}
        error={
          <LoadingOverlay>
            <div style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: '20px', fontSize: '24px' }}>⚠️</div>
              <div>{error || 'PDF 파일을 불러올 수 없습니다.'}</div>
              <div style={{ marginTop: '10px', fontSize: '14px', opacity: 0.7 }}>
                파일 경로: {file}
              </div>
            </div>
          </LoadingOverlay>
        }
      >
        <BookContainer>
          {/* 왼쪽 페이지 */}
          <PageWrapper 
            $isActive={true} 
            $position={currentPage > 0 ? 'left' : 'hidden'}
          >
            <PageContent>
              {renderPage(currentPage)}
            </PageContent>
          </PageWrapper>

          {/* 오른쪽 페이지 (모바일에서는 숨김) */}
          {!isMobile && (
            <PageWrapper 
              $isActive={true} 
              $position={currentPage < (numPages || 0) ? 'right' : 'hidden'}
            >
              <PageContent>
                {renderPage(currentPage + 1)}
              </PageContent>
            </PageWrapper>
          )}
        </BookContainer>
      </Document>

      <Controls>
        <Button 
          onClick={goToPrevPage} 
          disabled={currentPage <= 1}
          title="이전 페이지"
        >
          ◀
        </Button>
        
        <PageInfo>
          {currentPage} {!isMobile && currentPage < (numPages || 0) && `- ${currentPage + 1}`} / {numPages || '...'}
        </PageInfo>
        
        <Button 
          onClick={goToNextPage} 
          disabled={currentPage >= (numPages || 0)}
          title="다음 페이지"
        >
          ▶
        </Button>
      </Controls>
    </ViewerContainer>
  );
} 