import { UserResponse, Question, TestResult } from '../types';
import characters from '../data/characters';

// 테스트 결과 계산 함수
export function calculateResults(
  responses: UserResponse[],
  questions: Question[]
): TestResult {
  // 캐릭터별 점수 초기화
  const characterScores: { [characterId: string]: number } = {};
  characters.forEach(character => {
    characterScores[character.id] = 0;
  });
  
  // 가치관 점수 초기화
  const valueScores = {
    individualVsCollective: 0, // 37번 문항 (개인 vs 공동체)
    economyVsEnvironment: 0,   // 38번 문항 (경제 vs 환경)
    securityVsFreedom: 0,      // 39번 문항 (안보 vs 자유)
    shortTermVsLongTerm: 0,    // 40번 문항 (단기 vs 장기)
  };
  
  // 각 응답에 대해 점수 계산
  responses.forEach(response => {
    const question = questions.find(q => q.id === response.questionId);
    if (!question) return;
    
    let score = response.score;
    
    // 역채점 문항인 경우 점수 반전 (1→5, 2→4, 3→3, 4→2, 5→1)
    if (question.isReversed) {
      score = 6 - score; // 5점 척도 역채점
    }
    
    // 가치관 관련 문항인 경우 (문항 ID 37-40)
    if (question.id >= 37 && question.id <= 40) {
      switch (question.id) {
        case 37:
          valueScores.individualVsCollective = score;
          break;
        case 38:
          valueScores.economyVsEnvironment = score;
          break;
        case 39:
          valueScores.securityVsFreedom = score;
          break;
        case 40:
          valueScores.shortTermVsLongTerm = score;
          break;
      }
    } 
    // 일반 정책 문항인 경우
    else {
      // 관련 캐릭터 점수 증가
      if (characterScores.hasOwnProperty(question.relatedCharacter)) {
        characterScores[question.relatedCharacter] += score;
      }
    }
  });
  
  // 최고점 캐릭터 찾기 (동점인 경우 첫 번째 항목 선택)
  let primaryCharacter = '';
  let primaryScore = -1;
  let secondaryCharacter = '';
  let secondaryScore = -1;
  
  // 캐릭터 ID 배열 (점수 계산에 사용)
  const characterIds = Object.keys(characterScores);
  
  // 1위, 2위 캐릭터 찾기
  characterIds.forEach(charId => {
    const score = characterScores[charId];
    
    if (score > primaryScore) {
      // 기존 1위는 2위로 밀림
      secondaryCharacter = primaryCharacter;
      secondaryScore = primaryScore;
      
      // 새로운 1위
      primaryCharacter = charId;
      primaryScore = score;
    } 
    else if (score > secondaryScore && charId !== primaryCharacter) {
      // 새로운 2위
      secondaryCharacter = charId;
      secondaryScore = score;
    }
  });
  
  // 결과 반환
  return {
    primaryCharacter,
    secondaryCharacter,
    characterScores,
    valueScores,
  };
} 