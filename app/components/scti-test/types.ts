export interface PolicyCharacter {
  id: string;
  name: string;
  slogan: string;
  description: string;
  imageUrl: string;
  traits: string[];
  goodMatches: string[]; // 잘 맞는 캐릭터 ID 목록
  relatedPledges?: string[]; // 관련 공약 내용을 담을 필드 추가
}

export interface Question {
  id: number;
  text: string;
  category: string; // 문항 카테고리 (예: economy, labor, environment...)
  relatedCharacter: string; // 관련 캐릭터 ID 또는 가치관 ID
  isReversed: boolean; // 역채점 여부
}

export interface UserResponse {
  questionId: number;
  score: number; // 1-5점
}

export interface ValueScores {
  individualVsCollective: number;
  economyVsEnvironment: number;
  securityVsFreedom: number;
  shortTermVsLongTerm: number;
}

export interface TestResult {
  primaryCharacterId: string; // 주요 캐릭터 ID
  secondaryCharacterId: string; // 부성향 캐릭터 ID
  characterScores: {
    [characterId: string]: number; // 각 캐릭터별 점수
  };
  valueScores: ValueScores; // 가치관 점수
  timestamp?: number; // 테스트 완료 시각 (선택적)
}

// 테스트 진행 단계 타입
export type TestStep = 'intro' | 'questions' | 'results';

// 컨텍스트 상태 타입
export interface SctiTestState {
  currentStep: TestStep;
  currentQuestionIndex: number;
  responses: UserResponse[];
  testResult: TestResult | null;
  detailedCharacterId: string | null; // 상세 보기할 캐릭터 ID 추가
}

// 컨텍스트 액션 타입
export type SctiTestAction = 
  | { type: 'START_TEST' }
  | { type: 'ANSWER_QUESTION'; payload: { questionId: number; score: number } }
  | { type: 'NAVIGATE_QUESTION'; payload: { direction: 'next' | 'previous' } }
  | { type: 'CALCULATE_RESULTS'; payload: { characters: PolicyCharacter[]; questions: Question[] } }
  | { type: 'SET_RESULTS'; payload: TestResult }
  | { type: 'RESET_TEST' }
  | { type: 'LOAD_STATE'; payload: Partial<SctiTestState> }
  | { type: 'SET_DETAILED_CHARACTER'; payload: string | null }; // 액션 추가


// SctiTestContext에서 제공할 값의 타입
export interface SctiTestContextType extends SctiTestState {
  startTest: () => void;
  answerQuestion: (questionId: number, score: number) => void;
  navigateToQuestion: (direction: 'next' | 'previous') => void;
  calculateAndSetResults: () => void;
  resetTest: () => void;
  totalQuestions: number;
  getCharacterById: (id: string) => PolicyCharacter | undefined;
  loadState: (stateToLoad: Partial<SctiTestState>) => void;
  setDetailedCharacterId: (characterId: string | null) => void; // 함수 타입 추가
} 