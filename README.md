# 대선 후보자 페이지

Next.js와 Sanity.io를 사용한 대선 후보자 프로필 및 공약 페이지입니다.

## 기술 스택

- Next.js 15.3.1
- Sanity.io
- TypeScript
- Tailwind CSS
- Vercel (배포)

## 시작하기

### 필수 요구사항

- Node.js 18.17.0 이상
- npm 또는 yarn
- Git

### 설치 방법

1. 저장소 클론
```bash
git clone https://github.com/learn-slowly/kyk.git
cd kyk
```

2. 의존성 패키지 설치
```bash
npm install
```

필요한 주요 패키지들:
```json
{
  "dependencies": {
    "@sanity/image-url": "^1.1.0",
    "@sanity/vision": "^3.87.0",
    "next": "15.3.1",
    "next-sanity": "^9.10.2",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "sanity": "^3.87.0",
    "styled-components": "^6.1.17",
    
    // 캘린더 기능을 위한 패키지
    "react-big-calendar": "^1.18.0",
    "@types/react-big-calendar": "^1.16.1",
    "moment": "^2.30.1",
    "date-fns": "^4.1.0",
    "date-fns-tz": "^3.2.0",
    "googleapis": "^148.0.0"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3",
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "15.3.1",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

3. 환경 변수 설정
`.env.local` 파일을 생성하고 다음 내용을 추가:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=qpvtzhxq
NEXT_PUBLIC_SANITY_DATASET=kyk

# 구글 캘린더 API 연동을 위한 환경 변수 (필요한 경우)
GOOGLE_API_KEY=your_api_key_here
```

4. 개발 서버 실행
```bash
npm run dev
```

## 프로젝트 구조

```
kyk/
├── app/                    # Next.js 앱 디렉토리
│   ├── page.tsx           # 메인 페이지
│   ├── profile/           # 후보자 프로필 페이지
│   ├── policies/          # 공약 페이지
│   ├── schedule/          # 일정 캘린더 페이지
│   └── studio/            # Sanity Studio
├── sanity/                # Sanity 설정
│   └── schemas/           # Sanity 스키마
│       ├── candidate.ts   # 후보자 프로필 스키마
│       ├── policy.ts      # 공약 스키마
│       ├── schedule.ts    # 일정 스키마
│       └── index.ts       # 스키마 인덱스
└── public/                # 정적 파일
```

## 주요 기능

- 후보자 프로필 관리
- 공약 관리
- 게시판 기능
- 정적 페이지 관리
- 캘린더 및 일정 관리 기능
  - 일간/주간/월간 뷰 지원
  - 반응형 레이아웃 (모바일/데스크탑)
  - 구글 캘린더 연동 준비 중

## 배포

이 프로젝트는 Vercel을 통해 배포됩니다. GitHub 저장소와 Vercel을 연결하면 자동으로 배포됩니다.

## Sanity Studio

Sanity Studio는 `/studio` 경로에서 접근할 수 있습니다. 콘텐츠 관리를 위해 다음 항목들을 관리할 수 있습니다:

- 후보자 프로필
- 공약
- 게시글
- 정적 페이지
- 일정 및 캠페인 이벤트

## 라이선스

MIT
