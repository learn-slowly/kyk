import dynamic from 'next/dynamic';
import { PageContainer } from '@/app/components/CommonStyles';

// PDF 뷰어는 클라이언트 사이드에서만 작동하므로 dynamic import 사용
const PDFBookViewer = dynamic(() => import('@/app/components/PDFBookViewer'), {
  ssr: false,
  loading: () => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: '#1a1a1a',
      color: 'white',
      fontSize: '20px'
    }}>
      PDF 뷰어를 불러오는 중...
    </div>
  )
});

export default function PDFViewerPage() {
  // PDF 파일 경로 설정
  // 1. public 폴더에 있는 PDF: '/sample.pdf'
  // 2. 외부 URL: 'https://example.com/document.pdf'
  const pdfFile = '/sample.pdf'; // public 폴더에 sample.pdf 파일을 넣어주세요

  return (
    <PageContainer style={{ padding: 0 }}>
      <PDFBookViewer file={pdfFile} startPage={1} />
    </PageContainer>
  );
} 