# 권영국 대선 후보 웹사이트

이 프로젝트는 권영국 대선 후보의 공식 웹사이트입니다. Next.js와 Sanity CMS를 활용하여 구축되었습니다.

## 주요 기술 스택

- **프론트엔드**: Next.js 14 (App Router)
- **스타일링**: CSS-in-JS (styled-jsx), 인라인 스타일
- **CMS**: Sanity.io
- **배포**: Vercel

## 프로젝트 구조

```
/
├── app/                      # Next.js App Router 디렉토리
│   ├── components/           # 앱 내부의 컴포넌트
│   ├── events/               # 일정 페이지
│   ├── lib/                  # 유틸리티 및 Sanity 클라이언트
│   ├── news/                 # 뉴스 페이지
│   ├── policies/             # 정책 페이지
│   ├── posts/                # 게시물 페이지
│   ├── president2025/        # Sanity CMS 스키마 정의
│   ├── profile/              # 프로필 페이지
│   ├── schedule/             # 스케줄 페이지
│   ├── studio/              # Sanity 스튜디오 마운트 포인트
│   ├── layout.tsx           # 루트 레이아웃
│   └── page.tsx             # 홈페이지
├── components/               # 공통 컴포넌트
│   ├── HomeClient.tsx        # 홈페이지 클라이언트 컴포넌트
│   └── ...
├── public/                   # 정적 파일
│   ├── images/               # 이미지 파일
│   └── ...
├── sanity.config.ts          # Sanity Studio 설정 (루트)
└── package.json              # 프로젝트 의존성
```

## Sanity CMS 설정

### 스키마 정의
스키마 정의 파일들은 `app/president2025/schemaTypes` 디렉토리에 있으며, 다음의 주요 스키마를 사용합니다:

- **event**: 일정 정보 (이벤트, 미팅, 등)
- **post**: 뉴스 및 블로그 글
- **schedule**: 캠페인 일정

### Sanity 설정 구조
- `app/lib/sanity.ts`: 프론트엔드에서 사용하는 Sanity 클라이언트 설정
- `sanity.config.ts`: Sanity Studio 설정 (루트 경로의 `/studio`에 마운트)
- `app/president2025/schemaTypes`: 콘텐츠 스키마 정의

### Sanity Studio 접근
Sanity Studio는 `/studio` 경로에서 접근할 수 있으며, `app/studio/[[...tool]]/page.tsx`에 마운트되어 있습니다.

## 데이터 흐름

1. 서버 컴포넌트에서 Sanity CMS로부터 데이터를 가져옵니다.
2. 가져온 데이터는 클라이언트 컴포넌트에 props로 전달됩니다.
3. 클라이언트 컴포넌트에서 데이터를 렌더링합니다.

예시:
```tsx
// 서버 컴포넌트 (app/page.tsx)
export default async function Home() {
  const schedules = await getUpcomingSchedules();
  return <HomeClient schedules={schedules} />;
}

// 클라이언트 컴포넌트 (components/HomeClient.tsx)
'use client';
export default function HomeClient({ schedules }: { schedules: Schedule[] }) {
  // 클라이언트 측에서 데이터 렌더링
}
```

## 디자인 원칙

웹사이트는 다음의 디자인 원칙을 따릅니다:

- **컬러 스키마**: 빨강(#FF0000), 노랑(#FFed00), 초록(#00a366) 그라데이션
- **레이아웃**: 모바일 우선 반응형 디자인
- **애니메이션**: 스크롤 기반 애니메이션으로 몰입감 향상
- **접근성**: 의미있는 HTML 구조와 대비 충족

## 로컬 개발 환경 설정

```bash
# 프로젝트 설치
npm install

# 개발 서버 실행
npm run dev

# Sanity 스튜디오 실행
npm run sanity:dev
```

접속 URL:
- 웹사이트: http://localhost:3000
- Sanity Studio: http://localhost:3000/studio

## 배포

이 프로젝트는 Vercel에 배포됩니다. main 브랜치에 푸시하면 자동으로 배포됩니다.
