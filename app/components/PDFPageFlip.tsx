'use client';

import React, { useState, useRef, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import styled from 'styled-components';

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
  padding: 40px 20px 120px 20px;
  box-sizing: border-box;
`;

const FlipBookContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const Page = styled.div`
  background-color: white;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
`;

const PageContent = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const Controls = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 30px;
  align-items: center;
  background: rgba(0, 0, 0, 0.8);
  padding: 20px 40px;
  border-radius: 60px;
  backdrop-filter: blur(10px);
  z-index: 100;
`;

const NavButton = styled.button`
  background: transparent;
  border: 2px solid white;
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
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
`;

const PageIndicator = styled.div`
  color: white;
  font-size: 18px;
  min-width: 120px;
  text-align: center;
  font-weight: 300;
`;

const LoadingMessage = styled.div`
  color: white;
  font-size: 24px;
  text-align: center;
`;

interface PDFPageFlipProps {
  file: string;
  startPage?: number;
}

interface PageData {
  src: string;
  pageNumber: number;
}

export default function PDFPageFlip({ file, startPage = 1 }: PDFPageFlipProps) {
  const flipBook = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(startPage - 1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pages, setPages] = useState<PageData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // PDF.js를 사용해서 각 페이지를 이미지로 변환
    const loadPDF = async () => {
      try {
        if (typeof window === 'undefined') return;
        
        const pdfjsLib = (window as any).pdfjsLib;
        if (!pdfjsLib) {
          console.error('PDF.js가 로드되지 않았습니다');
          return;
        }

        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
        
        const loadingTask = pdfjsLib.getDocument(file);
        const pdf = await loadingTask.promise;
        const numPages = pdf.numPages;
        setTotalPages(numPages);
        
        const pagePromises = [];
        for (let i = 1; i <= numPages; i++) {
          pagePromises.push(
            pdf.getPage(i).then(async (page: any) => {
              const scale = 2.0;
              const viewport = page.getViewport({ scale });
              
              const canvas = document.createElement('canvas');
              const context = canvas.getContext('2d');
              canvas.height = viewport.height;
              canvas.width = viewport.width;
              
              await page.render({
                canvasContext: context,
                viewport: viewport
              }).promise;
              
              return {
                src: canvas.toDataURL(),
                pageNumber: i
              };
            })
          );
        }
        
        const loadedPages = await Promise.all(pagePromises);
        setPages(loadedPages);
        setLoading(false);
      } catch (error) {
        console.error('PDF 로드 중 오류:', error);
        setLoading(false);
      }
    };

    // PDF.js 스크립트 로드
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.onload = () => loadPDF();
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [file]);

  const goToPrevPage = () => {
    flipBook.current?.pageFlip().flipPrev();
  };

  const goToNextPage = () => {
    flipBook.current?.pageFlip().flipNext();
  };

  const onFlip = (e: any) => {
    setCurrentPage(e.data);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrevPage();
      if (e.key === 'ArrowRight') goToNextPage();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (loading) {
    return (
      <Container>
        <LoadingMessage>PDF를 불러오는 중...</LoadingMessage>
      </Container>
    );
  }

  if (pages.length === 0) {
    return (
      <Container>
        <LoadingMessage>PDF 파일을 불러올 수 없습니다.</LoadingMessage>
      </Container>
    );
  }

  return (
    <Container>
      <FlipBookContainer>
        <HTMLFlipBook
          ref={flipBook}
          width={600}
          height={800}
          minWidth={300}
          maxWidth={1000}
          minHeight={400}
          maxHeight={1200}
          maxShadowOpacity={0.5}
          showCover={true}
          mobileScrollSupport={true}
          onFlip={onFlip}
          className="flipbook"
          style={{}}
          startPage={startPage - 1}
          size="stretch"
          drawShadow={true}
          flippingTime={1000}
          usePortrait={false}
          startZIndex={0}
          autoSize={true}
          clickEventForward={true}
          useMouseEvents={true}
          swipeDistance={30}
          showPageCorners={true}
          disableFlipByClick={false}
        >
          {pages.map((page) => (
            <Page key={page.pageNumber}>
              <PageContent src={page.src} alt={`Page ${page.pageNumber}`} />
            </Page>
          ))}
        </HTMLFlipBook>
      </FlipBookContainer>

      <Controls>
        <NavButton onClick={goToPrevPage} disabled={currentPage === 0}>
          ◀
        </NavButton>
        
        <PageIndicator>
          {currentPage + 1} / {totalPages}
        </PageIndicator>
        
        <NavButton onClick={goToNextPage} disabled={currentPage >= totalPages - 1}>
          ▶
        </NavButton>
      </Controls>
    </Container>
  );
} 