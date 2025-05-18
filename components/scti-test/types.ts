// 정책 캐릭터 타입
export interface PolicyCharacter {
  id: string;
  name: string;
  slogan: string;
  description: string;
  imageUrl: string;
  traits: string[];
  goodMatches: string[]; // 잘 맞는 캐릭터 ID 목록
}

// 질문 타입
export interface Question {
  id: number;
  text: string;
  category: string;
  relatedCharacter: string; // 관련 캐릭터 ID
  isReversed: boolean; // 역채점 여부
}

// 사용자 응답 타입
export interface UserResponse {
  questionId: number;
  score: number; // 1-5
}

// 테스트 결과 타입
export interface TestResult {
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