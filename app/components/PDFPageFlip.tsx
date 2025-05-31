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
  padding: 20px 20px 100px 20px;
  box-sizing: border-box;
`;

const FlipBookContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: calc(100vh - 140px); /* 컨트롤 영역을 위한 공간 확보 */
  overflow: hidden;
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

const MobilePage = styled.div`
  background-color: white;
  width: 90%;
  max-width: 600px;
  height: calc(100vh - 180px);
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  overflow: hidden;
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
  const [isMobile, setIsMobile] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 600, height: 800 });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    const calculateDimensions = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      
      if (window.innerWidth <= 768) {
        // 모바일: 화면의 90% 너비 사용
        setDimensions({
          width: Math.min(screenWidth * 0.9, 500),
          height: (screenHeight - 180) * 0.9
        });
      } else {
        // PC: 화면 높이에 맞춰서 조정
        const maxHeight = (screenHeight - 140) * 0.8; // 화면 높이의 80%
        const maxWidth = screenWidth * 0.4; // 한 페이지가 화면 너비의 40%
        const aspectRatio = 210 / 297; // A4 비율
        
        if (maxHeight * aspectRatio > maxWidth) {
          // 너비 기준으로 조정
          setDimensions({
            width: maxWidth,
            height: maxWidth / aspectRatio
          });
        } else {
          // 높이 기준으로 조정
          setDimensions({
            width: maxHeight * aspectRatio,
            height: maxHeight
          });
        }
      }
    };
    
    checkMobile();
    calculateDimensions();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('resize', calculateDimensions);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('resize', calculateDimensions);
    };
  }, []);

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
              const scale = isMobile ? 1.5 : 2.0; // 모바일에서는 스케일 줄임
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
  }, [file, isMobile]);

  const goToPrevPage = () => {
    if (isMobile) {
      setCurrentPage(prev => Math.max(0, prev - 1));
    } else {
      flipBook.current?.pageFlip().flipPrev();
    }
  };

  const goToNextPage = () => {
    if (isMobile) {
      setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
    } else {
      flipBook.current?.pageFlip().flipNext();
    }
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
  }, [isMobile, totalPages]);

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
        {isMobile ? (
          // 모바일: 한 페이지만 표시
          <MobilePage>
            <PageContent 
              src={pages[currentPage]?.src} 
              alt={`Page ${currentPage + 1}`} 
            />
          </MobilePage>
        ) : (
          // PC: 플립북 표시
          <HTMLFlipBook
            ref={flipBook}
            width={dimensions.width}
            height={dimensions.height}
            minWidth={300}
            maxWidth={1000}
            minHeight={400}
            maxHeight={1200}
            maxShadowOpacity={0.5}
            showCover={true}
            mobileScrollSupport={false}
            onFlip={onFlip}
            className="flipbook"
            style={{}}
            startPage={currentPage}
            size="fixed"
            drawShadow={true}
            flippingTime={1000}
            usePortrait={false}
            startZIndex={0}
            autoSize={false}
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
        )}
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