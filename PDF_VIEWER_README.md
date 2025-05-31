# PDF 뷰어 사용 가이드

## 개요
이 프로젝트에는 두 가지 스타일의 PDF 뷰어가 구현되어 있습니다.

## 뷰어 종류

### 1. PDFBookViewer (기본 뷰어)
- **경로**: `/pdf-viewer`
- **특징**: 
  - 심플한 디자인
  - 데스크톱에서 양쪽 페이지 동시 표시
  - 모바일 반응형 지원

### 2. PDFFlipBook (고급 뷰어)
- **경로**: `/pdf-flipbook`
- **특징**: 
  - 실제 책을 넘기는 듯한 3D 애니메이션
  - 페이지 앞뒤면 모두 렌더링
  - 더 몰입감 있는 독서 경험

## 사용 방법

### 1. PDF 파일 준비
```
public/
  └── sample.pdf  // 여기에 PDF 파일을 넣으세요
```

### 2. 파일 경로 설정
```typescript
// 로컬 파일 사용
const pdfFile = '/sample.pdf';

// 외부 URL 사용
const pdfFile = 'https://example.com/document.pdf';
```

### 3. 조작 방법
- **마우스**: 버튼 클릭 또는 페이지 클릭
- **키보드**: 
  - `←` : 이전 페이지
  - `→` : 다음 페이지
- **터치**: 모바일에서 스와이프 지원

## 커스터마이징

### 색상 변경
```typescript
// PDFBookViewer.tsx 또는 PDFFlipBook.tsx에서
const ViewerContainer = styled.div`
  background-color: #1a1a1a; // 배경색 변경
`;
```

### 크기 조정
```typescript
const BookContainer = styled.div`
  max-width: 1200px; // 최대 너비 조정
  height: 80vh; // 높이 조정
`;
```

## 주의사항
1. PDF 파일이 크면 로딩 시간이 길어질 수 있습니다
2. CORS 정책으로 인해 외부 PDF는 접근이 제한될 수 있습니다
3. 모바일에서는 데이터 사용량에 주의하세요

## 문제 해결

### PDF가 표시되지 않을 때
1. 콘솔에서 에러 메시지 확인
2. 파일 경로가 올바른지 확인
3. PDF 파일이 손상되지 않았는지 확인

### 성능 문제
1. PDF 파일 크기를 최적화
2. 이미지가 많은 PDF는 압축 고려
3. 필요시 페이지별로 로딩하도록 수정 