import dynamic from 'next/dynamic';
import { PageContainer } from '@/app/components/CommonStyles';

// PDF 플립북은 클라이언트 사이드에서만 작동
const PDFFlipBook = dynamic(() => import('@/app/components/PDFFlipBook'), {
  ssr: false,
  loading: () => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: '#2a2a2a',
      color: 'white',
      fontSize: '20px'
    }}>
      PDF 뷰어를 불러오는 중...
    </div>
  )
});

export default function PDFFlipBookPage() {
  // PDF 파일 경로
  const pdfFile = '/sample.pdf'; // public 폴더에 sample.pdf 파일을 넣어주세요
  
  // 외부 PDF 사용 예시:
  // const pdfFile = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

  return (
    <PageContainer style={{ padding: 0 }}>
      <PDFFlipBook file={pdfFile} startPage={1} />
    </PageContainer>
  );
} 