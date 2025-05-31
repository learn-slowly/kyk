'use client';

import React, { useState } from 'react';
import PDF from 'react-pdf-js';
import styled from 'styled-components';

const ViewerContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #1a1a1a;
  padding: 20px;
  box-sizing: border-box;
`;

const PDFContainer = styled.div`
  max-width: 100%;
  max-height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`;

const Controls = styled.div`
  margin-top: 20px;
  display: flex;
  gap: 20px;
  align-items: center;
`;

const Button = styled.button`
  background: #333;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  
  &:hover:not(:disabled) {
    background: #555;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PageInfo = styled.span`
  color: white;
  font-size: 18px;
`;

interface SimplePDFViewerProps {
  file: string;
}

export default function SimplePDFViewer({ file }: SimplePDFViewerProps) {
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState<number | null>(null);

  const onDocumentComplete = (pages: number) => {
    setPages(pages);
  };

  const handlePrevious = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNext = () => {
    if (pages && page < pages) {
      setPage(page + 1);
    }
  };

  return (
    <ViewerContainer>
      <PDFContainer>
        <PDF
          file={file}
          page={page}
          onDocumentComplete={onDocumentComplete}
        />
      </PDFContainer>
      
      <Controls>
        <Button onClick={handlePrevious} disabled={page === 1}>
          이전
        </Button>
        
        <PageInfo>
          {page} / {pages || '...'}
        </PageInfo>
        
        <Button onClick={handleNext} disabled={!pages || page === pages}>
          다음
        </Button>
      </Controls>
    </ViewerContainer>
  );
} 