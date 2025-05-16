# 정책 캐릭터 SCTI 테스트 컴포넌트 PRD (Next.js & Vercel)

## 프로젝트 개요
정책 캐릭터를 활용한 Social Change Type Index(SCTI) 테스트를 Next.js와 TypeScript를 사용하여 기존 웹사이트의 한 섹션으로 개발합니다. 이 테스트 컴포넌트는 사용자의 정책 선호도를 파악하고, 그에 맞는 정책 캐릭터를 소개하는 인터랙티브한 경험을 제공합니다.

## 기술 스택
- Frontend: Next.js, TypeScript
- 상태 관리: React Context API 또는 Next.js의 내장 상태 관리
- 스타일링: 기존 사이트의 스타일 시스템 활용 (Tailwind CSS, CSS Modules, Styled JSX 등)
- 차트: Recharts 또는 Chart.js
- 배포: Vercel

## Next.js 및 Vercel 특화 구조

### 파일 구조
```
/components
  /scti-test
    /SctiTestContainer.tsx       # 메인 컨테이너 컴포넌트
    /TestIntro.tsx               # 테스트 소개 컴포넌트
    /QuestionSection.tsx         # 질문 섹션
    /ResultSection.tsx           # 결과 섹션
    /types.ts                    # 타입 정의
    /hooks
      /useSctiTest.ts            # 테스트 로직 관련 커스텀 훅
    /utils
      /calculateResults.ts       # 결과 계산 유틸리티
    /context
      /SctiTestContext.tsx       # 테스트 상태 관리 컨텍스트

/data
  /scti
    /questions.ts                # 질문 데이터
    /characters.ts               # 캐릭터 데이터

/pages
  /some-existing-page.tsx        # 테스트가 포함될 기존 페이지
```

### Next.js 최적화 활용
- **Image 컴포넌트**: 캐릭터 이미지에 Next.js의 Image 컴포넌트 활용
- **Dynamic Imports**: 결과 차트 등 무거운 컴포넌트는 동적 임포트
- **SSG/ISR**: 질문 및 캐릭터 데이터는 정적 생성 활용
- **API Routes**: 필요시 결과 저장 등을 위한 API 라우트 활용

## 컴포넌트 구조 및 통합

### 컴포넌트 계층
```
SctiTestContainer (메인 컨테이너)
├── TestIntro
├── QuestionSection
│   ├── ProgressIndicator
│   ├── QuestionDisplay
│   │   └── AnswerScale (1-5 scale)
│   └── NavigationControls
├── ResultSection
│   ├── CharacterProfile
│   ├── MatchingCharacters
│   ├── ScoreVisualization
│   └── SharingOptions
└── TestReset
```

### 기존 Next.js 사이트 통합 고려사항
- 기존 사이트의 레이아웃 컴포넌트와 통합
- Next.js의 라우팅 시스템 활용 (쿼리 파라미터로 상태 관리)
- Vercel Analytics 활용 가능성 (테스트 완료율 등 추적)

## 주요 기능 요구사항

### 1. 테스트 인터페이스
- **시작 섹션**: 테스트 소개 및 시작 버튼
- **질문 섹션**: 
  - 40개 문항을 5점 척도로 응답
  - 진행 상태 표시 (간결한 형태)
  - 이전/다음 질문 이동 기능
- **응답 입력 방식**: 슬라이더 또는 라디오 버튼 (1-5점)

### 2. 결과 계산 로직
- 각 정책 캐릭터별 관련 문항 점수 합산
- 역채점 문항(37-39번) 처리
- 주요 성향(1위) 및 부성향(2위) 결정
- 가치관 문항(37-40번) 별도 분석

### 3. 결과 표시 섹션
- **주요 정책 캐릭터 소개**:
  - 캐릭터 이미지 (Next.js Image 컴포넌트 활용)
  - 캐릭터 설명 및 슬로건
- **정책 성향 그래프**:
  - 10개 캐릭터별 점수를 간결한 차트로 표시
- **추천 캐릭터**:
  - 주요 캐릭터와 잘 맞는 2개 캐릭터 소개
- **공유 기능**:
  - SNS 공유 버튼 (Next.js 동적 OG 이미지 활용 가능)

## 데이터 구조

### 1. 정책 캐릭터 데이터
```typescript
interface PolicyCharacter {
  id: string;
  name: string;
  slogan: string;
  description: string;
  imageUrl: string;
  traits: string[];
  goodMatches: string[]; // 잘 맞는 캐릭터 ID 목록
}
```

### 2. 질문 데이터
```typescript
interface Question {
  id: number;
  text: string;
  category: string;
  relatedCharacter: string; // 관련 캐릭터 ID
  isReversed: boolean; // 역채점 여부
}
```

### 3. 사용자 응답 데이터
```typescript
interface UserResponse {
  questionId: number;
  score: number; // 1-5
}
```

### 4. 결과 데이터
```typescript
interface TestResult {
  primaryCharacter: string; // 주요 캐릭터 ID
  secondaryCharacter: string; // 부성향 캐릭터 ID
  characterScores: {
    [characterId: string]: number; // 각 캐릭터별 점수
  };
  valueScores: {
    individualVsCollective: number;
    economyVsEnvironment: number;
    securityVsFreedom: number;
    shortTermVsLongTerm: number;
  };
}
```

## 기술적 구현 상세

### 1. 상태 관리 (React Context + Next.js)
```typescript
// 테스트 컨텍스트
interface SctiTestContextType {
  currentStep: 'intro' | 'questions' | 'results';
  currentQuestionIndex: number;
  responses: UserResponse[];
  testResult: TestResult | null;
  
  // 액션
  startTest: () => void;
  answerQuestion: (questionId: number, score: number) => void;
  goToNextQuestion: () => void;
  goToPreviousQuestion: () => void;
  calculateResults: () => void;
  resetTest: () => void;
}

// 컨텍스트 구현
export const SctiTestContext = createContext<SctiTestContextType | undefined>(undefined);

export function SctiTestProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, dispatch] = useReducer(testReducer, initialState);
  
  // URL 쿼리 파라미터와 상태 동기화
  useEffect(() => {
    // 쿼리 파라미터에서 상태 복원
    if (router.query.step) {
      // 상태 복원 로직
    }
  }, [router.query]);
  
  // 상태 변경 시 URL 업데이트 (선택적)
  useEffect(() => {
    router.push({
      pathname: router.pathname,
      query: { 
        ...router.query,
        step: state.currentStep,
        q: state.currentQuestionIndex
      }
    }, undefined, { shallow: true });
  }, [state.currentStep, state.currentQuestionIndex]);
  
  // 값 및 액션 제공
  const value = {
    ...state,
    startTest: () => dispatch({ type: 'START_TEST' }),
    // 기타 액션 구현
  };
  
  return (
    <SctiTestContext.Provider value={value}>
      {children}
    </SctiTestContext.Provider>
  );
}

// 커스텀 훅
export function useSctiTest() {
  const context = useContext(SctiTestContext);
  if (context === undefined) {
    throw new Error('useSctiTest must be used within a SctiTestProvider');
  }
  return context;
}
```

### 2. 주요 컴포넌트 명세

#### SctiTestContainer
```typescript
interface SctiTestContainerProps {
  containerId?: string;
  onTestComplete?: (result: TestResult) => void;
  className?: string;
}

export default function SctiTestContainer({ 
  containerId, 
  onTestComplete,
  className 
}: SctiTestContainerProps) {
  const { currentStep } = useSctiTest();
  
  return (
    <div id={containerId} className={className}>
      {currentStep === 'intro' && <TestIntro />}
      {currentStep === 'questions' && <QuestionSection />}
      {currentStep === 'results' && <ResultSection onComplete={onTestComplete} />}
    </div>
  );
}
```

#### QuestionSection
```typescript
export default function QuestionSection() {
  const { 
    currentQuestionIndex, 
    responses, 
    answerQuestion,
    goToNextQuestion,
    goToPreviousQuestion
  } = useSctiTest();
  
  const question = questions[currentQuestionIndex];
  const currentResponse = responses.find(r => r.questionId === question.id)?.score || null;
  
  return (
    <div className="question-section">
      <ProgressIndicator 
        current={currentQuestionIndex + 1} 
        total={questions.length} 
      />
      
      <QuestionDisplay 
        question={question}
        currentResponse={currentResponse}
        onAnswer={(score) => answerQuestion(question.id, score)}
      />
      
      <NavigationControls
        onPrevious={currentQuestionIndex > 0 ? goToPreviousQuestion : undefined}
        onNext={goToNextQuestion}
        isLastQuestion={currentQuestionIndex === questions.length - 1}
      />
    </div>
  );
}
```

### 3. Next.js 페이지 통합 예시
```typescript
// pages/policy-test.tsx 또는 기존 페이지 내에 통합
import { SctiTestProvider } from '../components/scti-test/context/SctiTestContext';
import SctiTestContainer from '../components/scti-test/SctiTestContainer';
import Layout from '../components/Layout';

export default function PolicyTestPage() {
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">정책 캐릭터 테스트</h1>
        
        <SctiTestProvider>
          <SctiTestContainer className="bg-white rounded-lg shadow-md p-6" />
        </SctiTestProvider>
      </div>
    </Layout>
  );
}
```

### 4. 결과 계산 및 저장 (Vercel 활용)
```typescript
// API 라우트를 통한 결과 저장 (선택 사항)
// pages/api/scti-results.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    const result = req.body;
    
    // 결과 저장 로직 (Vercel KV, Postgres 등)
    // const { kv } = require('@vercel/kv');
    // await kv.hset('scti_results', { [Date.now()]: result });
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error saving result:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
```

## 사용자 경험 최적화

### 1. 테스트 진행 중 상태 저장
- localStorage 또는 sessionStorage에 진행 상태 저장
- URL 쿼리 파라미터를 통한 상태 공유 가능성

```typescript
// 상태 저장 로직
useEffect(() => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('scti_responses', JSON.stringify(responses));
    localStorage.setItem('scti_step', currentStep);
    localStorage.setItem('scti_question', String(currentQuestionIndex));
  }
}, [responses, currentStep, currentQuestionIndex]);

// 상태 복원 로직
useEffect(() => {
  if (typeof window !== 'undefined') {
    const savedResponses = localStorage.getItem('scti_responses');
    const savedStep = localStorage.getItem('scti_step');
    const savedQuestion = localStorage.getItem('scti_question');
    
    if (savedResponses && savedStep) {
      // 상태 복원 로직
    }
  }
}, []);
```

### 2. 반응형 디자인 최적화
```typescript
// 반응형 디자인을 위한 커스텀 훅
function useResponsiveLayout() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return { isMobile };
}
```

### 3. 성능 최적화
```typescript
// 동적 임포트 예시
import dynamic from 'next/dynamic';

const DynamicChart = dynamic(
  () => import('../components/scti-test/ScoreChart'),
  { 
    loading: () => <p>차트 로딩 중...</p>,
    ssr: false // 클라이언트 사이드에서만 렌더링
  }
);
```

## Vercel 배포 및 최적화 고려사항

### 1. Vercel 배포 최적화
- **Edge Functions**: 간단한 API 요청 처리
- **ISR (Incremental Static Regeneration)**: 캐릭터 데이터 등 정적 콘텐츠 최적화
- **Vercel Analytics**: 사용자 행동 추적 및 성능 모니터링
- **Vercel KV**: 테스트 결과 저장 (필요시)

### 2. 이미지 최적화
```typescript
import Image from 'next/image';

export function CharacterImage({ character }: { character: PolicyCharacter }) {
  return (
    <div className="relative h-48 w-48">
      <Image
        src={character.imageUrl}
        alt={character.name}
        layout="fill"
        objectFit="contain"
        priority={true}
        quality={85}
      />
    </div>
  );
}
```

### 3. OG 이미지 동적 생성 (결과 공유용)
```typescript
// pages/api/og-image.tsx
import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const characterId = searchParams.get('character');
  
  // 캐릭터 데이터 가져오기
  const character = getCharacterById(characterId);
  
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          fontSize: 40,
          color: 'black',
          background: 'white',
          width: '100%',
          height: '100%',
          padding: 40,
          textAlign: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div>
          <h1>내 정책 캐릭터는 {character.name}입니다</h1>
          <p>{character.slogan}</p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
```

## 개발 단계

### 1단계: 컴포넌트 구조 설계 및 기본 구현
- Next.js 프로젝트 내 컴포넌트 구조 설정
- 테스트 섹션 컨테이너 구현
- 질문 및 응답 UI 구현
- 기본 상태 관리 구현

### 2단계: 로직 및 결과 표시 구현
- 점수 계산 알고리즘 구현
- 결과 표시 컴포넌트 구현
- 차트 및 시각화 구현
- Next.js Image 컴포넌트 최적화

### 3단계: 스타일링 및 UX 개선
- 기존 사이트 디자인과 통합
- 반응형 레이아웃 최적화
- 애니메이션 및 전환 효과 추가
- URL 기반 상태 관리 구현

### 4단계: 테스트 및 Vercel 배포 최적화
- 단위 테스트 및 통합 테스트
- Vercel 배포 및 성능 최적화
- Analytics 설정 및 모니터링
- 사용성 테스트 및 피드백 반영

## 예상 타임라인
- 컴포넌트 설계 및 기본 구현: 3일
- 로직 및 결과 표시 구현: 4일
- 스타일링 및 UX 개선: 3일
- 테스트 및 Vercel 최적화: 2일
- 총 예상 기간: 12일 (약 2.5주)

## 필요한 추가 리소스
- 캐릭터 일러스트레이션 (10개 캐릭터)
- 테스트 결과 해석 텍스트
- 기존 Next.js 사이트의 디자인 가이드 및 컴포넌트 라이브러리 문서

이 PRD를 바탕으로 Next.js 기반 웹사이트에 통합될 SCTI 테스트 컴포넌트를 개발하고 Vercel에 최적화하여 배포할 수 있습니다. 필요에 따라 세부 사항을 조정할 수 있습니다.

## 정책 캐릭터 설정 및 관계 문서

### 1. 세금 정의맨 (부자증세)
- **특징**: 저울을 들고 있는 슈퍼히어로 스타일의 캐릭터
- **슬로건**: "공정한 부담으로 더 나은 사회를"
- **성격**: 정의롭고 합리적이며 균형을 중시함
- **관계**:
  - **잘 맞는 캐릭터**:
    - 나눔이(분배 정책) - 세금 정의맨이 모은 재원을 나눔이가 효과적으로 분배하는 황금 콤비
    - 돌봄이(돌봄 정책) - 세금 정의맨이 확보한 재원으로 돌봄이가 복지 서비스를 제공
  - **잘 안 맞는 캐릭터**:
    - 헌법수호자(민주주의 강화) - 세부 실행 방법에서 종종 의견 충돌
    - 평화사절단(평화 외교) - 국내 재원 활용과 외교 우선순위에서 가끔 갈등

### 2. 노동이 권리다 (노동권 보장)
- **특징**: 다양한 직업의 사람들이 손을 맞잡고 있는 모습
- **슬로건**: "모든 일하는 사람들의 권리를 지킵니다"
- **성격**: 연대감이 강하고 포용적이며 단호함
- **관계**:
  - **잘 맞는 캐릭터**:
    - 다양성 수호자(차별없는 사회) - 모든 노동자의 권리와 다양성 존중에 함께 힘씀
    - 집지기(주거 보호) - 안정된 일자리와 주거는 기본권이라는 공통 가치
  - **잘 안 맞는 캐릭터**:
    - 배움이(행복 교육) - 교육과 노동 현장의 연계에서 가끔 의견 차이
    - 지구지킴이(기후위기 대응) - 일자리 보존과 환경 규제 사이에서 종종 긴장 관계

### 3. 나눔이 (분배 정책)
- **특징**: 파이를 공평하게 나누는 친근한 캐릭터
- **슬로건**: "함께 나누면 모두가 행복합니다"
- **성격**: 관대하고 배려심이 많으며 공동체 의식이 강함
- **관계**:
  - **잘 맞는 캐릭터**:
    - 세금 정의맨(부자증세) - 공정한 세금 마련과 효과적인 분배의 완벽한 파트너십
    - 돌봄이(돌봄 정책) - 사회적 약자를 돌보는 가치관 공유
  - **잘 안 맞는 캐릭터**:
    - 헌법수호자(민주주의 강화) - 제도적 절차와 즉각적 분배 사이에서 가끔 충돌
    - 평화사절단(평화 외교) - 국내 분배와 국제 협력 자원 배분에서 우선순위 갈등

### 4. 다양성 수호자 (차별없는 사회)
- **특징**: 다양한 색상과 모양으로 이루어진 무지개 형태의 캐릭터
- **슬로건**: "모두가 존중받는 세상을 만듭니다"
- **성격**: 열린 마음을 가지고 있으며 포용적이고 진보적임
- **관계**:
  - **잘 맞는 캐릭터**:
    - 노동이 권리다(노동권 보장) - 모든 사람의 권리 존중이라는 가치 공유
    - 배움이(행복 교육) - 다양성을 존중하는 교육 환경 조성에 협력
  - **잘 안 맞는 캐릭터**:
    - 집지기(주거 보호) - 주거 정책의 우선순위 설정에서 가끔 의견 충돌
    - 헌법수호자(민주주의 강화) - 진보 속도와 제도적 변화의 균형에서 가끔 긴장

### 5. 지구지킴이 (기후위기 대응)
- **특징**: 지구를 품에 안고 있는 자연친화적 캐릭터
- **슬로건**: "우리의 미래, 지금 행동합니다"
- **성격**: 책임감이 강하고 미래지향적이며 실용적임
- **관계**:
  - **잘 맞는 캐릭터**:
    - 평화사절단(평화 외교) - 글로벌 문제 해결을 위한 국제 협력 중시
    - 배움이(행복 교육) - 미래세대를 위한 환경교육의 중요성 공유
  - **잘 안 맞는 캐릭터**:
    - 노동이 권리다(노동권 보장) - 환경 규제와 일자리 보존 사이의 균형점 찾기 어려움
    - 집지기(주거 보호) - 환경 규제와 주택 개발 사이에서 종종 갈등

### 6. 집지기 (주거 보호)
- **특징**: 안전한 집의 열쇠를 들고 있는 따뜻한 이미지의 캐릭터
- **슬로건**: "모두에게 안정된 보금자리를"
- **성격**: 안정감을 주고 신뢰할 수 있으며 보호자 기질이 있음
- **관계**:
  - **잘 맞는 캐릭터**:
    - 노동이 권리다(노동권 보장) - 일자리와 주거 안정은 삶의 기본 요소라는 공감대
1. 경제 성장보다 공정한 분배가 더 중요하다. (나눔이)
    - 돌봄이(돌봄 정책) - 안정된 주거 환경과 돌봄의 연계성 강조
  - **잘 안 맞는 캐릭터**:
    - 지구지킴이(기후위기 대응) - 주택 개발과 환경 보호 사이의 균형 문제
    - 다양성 수호자(차별없는 사회) - 주거 정책의 우선순위 설정에서 가끔 이견

### 7. 헌법수호자 (민주주의 강화)
- **특징**: 헌법책과 투표함을 들고 있는 위엄 있는 캐릭터
- **슬로건**: "더 강한 민주주의, 더 나은 공화국"
- **성격**: 원칙적이고 정의로우며 비전이 있음
- **관계**:
  - **잘 맞는 캐릭터**:
    - 평화사절단(평화 외교) - 민주주의 가치와 평화 외교의 원칙적 연계 강조
    - 다양성 수호자(차별없는 사회) - 헌법적 가치로서의 평등과 다양성 존중
  - **잘 안 맞는 캐릭터**:
    - 세금 정의맨(부자증세) - 세부 실행 방법에서 종종 의견 충돌
    - 나눔이(분배 정책) - 제도적 절차와 즉각적 분배 사이에서 가끔 긴장

### 8. 돌봄이 (돌봄 정책)
- **특징**: 아이부터 노인까지 다양한 세대를 감싸안는 따뜻한 캐릭터
- **슬로건**: "생애주기 전체를 함께 돌봅니다"
- **성격**: 따뜻하고 공감능력이 뛰어나며 헌신적임
- **관계**:
  - **잘 맞는 캐릭터**:
    - 나눔이(분배 정책) - 사회적 약자 보호라는 가치 공유
    - 세금 정의맨(부자증세) - 복지 재원 마련과 효과적 돌봄 서비스 제공의 시너지
  - **잘 안 맞는 캐릭터**:
    - 배움이(행복 교육) - 돌봄과 교육의 경계와 우선순위에서 가끔 의견 차이
    - 평화사절단(평화 외교) - 국내 돌봄과 국제 협력 자원 배분에서 우선순위 갈등

### 9. 배움이 (행복 교육)
- **특징**: 책과 다양한 활동 도구를 가진 밝고 창의적인 캐릭터
- **슬로건**: "경쟁 대신 성장을, 행복한 배움의 시간"
- **성격**: 호기심이 많고 창의적이며 긍정적임
- **관계**:
  - **잘 맞는 캐릭터**:
    - 다양성 수호자(차별없는 사회) - 포용적 교육 환경 조성에 협력
    - 지구지킴이(기후위기 대응) - 미래세대를 위한 환경 교육의 중요성 공감
  - **잘 안 맞는 캐릭터**:
    - 노동이 권리다(노동권 보장) - 교육과 노동시장 연계에서 가끔 관점 차이
    - 돌봄이(돌봄 정책) - 교육과 돌봄의 경계와 역할 분담에서 가끔 이견

### 10. 평화사절단 (평화 외교)
- **특징**: 비둘기와 지구본을 들고 있는 외교관 스타일의 캐릭터
- **슬로건**: "대화와 협력으로 한반도의 평화를"
- **성격**: 중재자 기질이 있고 냉철하면서도 대화를 중시함
- **관계**:
  - **잘 맞는 캐릭터**:
    - 지구지킴이(기후위기 대응) - 글로벌 문제 해결을 위한 국제 협력 중시
    - 헌법수호자(민주주의 강화) - 민주주의 가치와 평화 외교의 원칙적 연계
  - **잘 안 맞는 캐릭터**:
    - 세금 정의맨(부자증세) - 국내 재원 활용과 외교 우선순위에서 가끔 갈등
    - 나눔이(분배 정책) - 국내 분배와 국제 협력 자원 배분에서 우선순위 차이

## SCTI 테스트 문항

## 응답 방식
각 문항에 대해 1-5점 척도로 응답:
1: 매우 동의하지 않음
2: 동의하지 않음
3: 중립
4: 동의함
5: 매우 동의함

## 테스트 문항

### 경제 및 세금 관련 문항
1. 고소득자와 대기업에 더 높은 세금을 부과하는 것이 공정한 사회를 만드는 데 필요하다. (세금 정의맨)
2. 부의 재분배는 사회 불평등을 해소하기 위해 필요하다. (나눔이)

3. 세금 정책은 사회 서비스 확대를 위한 핵심 수단이다. (세금 정의맨)
### 노동 관련 문항
1. 모든 노동자는 고용 형태와 상관없이 동등한 권리를 보장받아야 한다. (노동이 권리다)
2. 노동조합은 노동자의 권리를 보호하는 데 중요한 역할을 한다. (노동이 권리다)
3. 플랫폼 노동자(배달, 대리기사 등)도 전통적 노동자와 같은 권리를 가져야 한다. (노동이 권리다)
4. 일과 삶의 균형은 법적으로 보장되어야 한다. (노동이 권리다)

### 사회 다양성 및 평등 관련 문항
9. 사회는 모든 형태의 차별(성별, 인종, 장애, 성적 지향 등)을 적극적으로 해소해야 한다. (다양성 수호자)
10. 소수자 권리 보호를 위한 적극적 조치가 필요하다. (다양성 수호자)
11. 다양성은 사회의 강점이며 적극 장려되어야 한다. (다양성 수호자)
12. 혐오 표현은 법적으로 규제되어야 한다. (다양성 수호자)

### 환경 및 기후위기 관련 문항
13. 기후위기 대응은 현 세대의 가장 중요한 책임이다. (지구지킴이)
14. 환경 보호를 위해 개인의 불편함을 감수할 수 있다. (지구지킴이)
15. 화석연료 사용을 줄이고 재생에너지로 전환해야 한다. (지구지킴이)
16. 기업의 환경 규제는 더 강화되어야 한다. (지구지킴이)

### 주거 관련 문항
17. 주거는 기본권이며 국가가 적극적으로 보장해야 한다. (집지기)
18. 세입자의 권리가 더 강화되어야 한다. (집지기)
19. 부동산 투기는 강력히 규제되어야 한다. (집지기)
20. 공공임대주택을 대폭 확대해야 한다. (집지기)

### 민주주의 및 정치 개혁 관련 문항
21. 현행 헌법은 시대 변화에 맞게 개정될 필요가 있다. (헌법수호자)
22. 국민의 직접 참여를 확대하는 정치 제도가 필요하다. (헌법수호자)
23. 권력 기관의 견제와 균형이 더 강화되어야 한다. (헌법수호자)
24. 지방분권과 자치권 확대가 필요하다. (헌법수호자)

### 돌봄 및 복지 관련 문항
25. 아동부터 노인까지 생애주기별 돌봄 체계가 구축되어야 한다. (돌봄이)
26. 돌봄 노동의 가치를 인정하고 적절히 보상해야 한다. (돌봄이)
27. 의료, 돌봄 서비스는 공공성이 강화되어야 한다. (돌봄이)
28. 취약계층을 위한 사회안전망이 확충되어야 한다. (돌봄이)

### 교육 관련 문항
29. 교육은 경쟁보다 협력과 성장에 중점을 두어야 한다. (배움이)
30. 입시 중심 교육에서 벗어나 다양한 재능을 키우는 교육이 필요하다. (배움이)
31. 공교육의 질을 높여 사교육 의존도를 낮춰야 한다. (배움이)
32. 평생교육 시스템이 강화되어야 한다. (배움이)

### 외교 및 평화 관련 문항
33. 한반도 평화를 위해 대화와 협력이 군사적 대응보다 효과적이다. (평화사절단)
34. 국제 문제 해결을 위한 다자간 협력이 중요하다. (평화사절단)
35. 외교 정책은 국익과 함께 인권과 민주주의 가치를 고려해야 한다. (평화사절단)
36. 평화 구축을 위한 시민사회의 역할이 중요하다. (평화사절단)

### 우선순위 관련 문항 (가치관 파악)
37. 사회 변화보다 개인의 자유와 선택이 더 중요하다. (역채점)
38. 경제 성장은 환경 보호보다 우선되어야 한다. (역채점)
39. 국가 안보는 시민의 자유보다 우선시되어야 한다. (역채점)
40. 단기적 성과보다 장기적 비전이 중요하다.

## 결과 해석 방식

1. 각 정책 캐릭터별로 관련 문항 점수를 합산
   - 세금 정의맨: 1, 4번 문항
   - 노동이 권리다: 5, 6, 7, 8번 문항
   - 나눔이: 2, 3번 문항
   - 다양성 수호자: 9, 10, 11, 12번 문항
   - 지구지킴이: 13, 14, 15, 16번 문항
   - 집지기: 17, 18, 19, 20번 문항
   - 헌법수호자: 21, 22, 23, 24번 문항
   - 돌봄이: 25, 26, 27, 28번 문항
   - 배움이: 29, 30, 31, 32번 문항
   - 평화사절단: 33, 34, 35, 36번 문항

2. 가장 높은 점수를 받은 정책 캐릭터가 응답자의 주요 성향
3. 두 번째로 높은 점수를 받은 정책 캐릭터는 부성향
4. 우선순위 관련 문항(37-40)은 응답자의 전반적인 가치관을 파악하는 데 활용

## 결과 표시 방식

1. 주요 정책 캐릭터 소개 및 설명
2. 해당 정책 캐릭터와 잘 맞는 다른 캐릭터 2개 소개
3. 응답자의 정책 성향 그래프 (각 캐릭터별 점수 비교)
4. 응답자와 비슷한 성향을 가진 사람들의 관심사 및 추천 활동

이 테스트를 통해 응답자는 자신의 정책 선호도를 재미있게 파악하고, 그에 맞는 정책 정보를 얻을 수 있습니다. 또한 테스트 결과를 SNS에 공유할 수 있는 기능을 추가하여 더 많은 사람들이 정책에 관심을 갖도록 유도할 수 있습니다.