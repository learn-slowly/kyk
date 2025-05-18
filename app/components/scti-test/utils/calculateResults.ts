import { UserResponse, TestResult, PolicyCharacter, Question, ValueScores } from '../types';

export const calculateResults = (
  responses: UserResponse[],
  charactersData: PolicyCharacter[],
  questionsData: Question[]
): TestResult => {
  const characterScores: { [characterId: string]: number } = {};
  charactersData.forEach(char => characterScores[char.id] = 0);

  const valueScores: ValueScores = {
    individualVsCollective: 0,
    economyVsEnvironment: 0,
    securityVsFreedom: 0,
    shortTermVsLongTerm: 0,
  };

  // 각 캐릭터별 점수 합산 및 가치관 문항 점수 계산
  responses.forEach(response => {
    const question = questionsData.find(q => q.id === response.questionId);
    if (!question) return;

    let score = response.score;
    // 1-5점 척도를 0-4점으로 변환 (또는 필요에 따라 -2 ~ +2 등으로 변환)
    // 여기서는 일단 1-5점 그대로 사용하고, 역채점만 고려합니다.
    if (question.isReversed) {
      score = 6 - score; // 1->5, 2->4, 3->3, 4->2, 5->1
    }

    if (question.category === 'values') {
      // 가치관 문항 처리
      switch (question.relatedCharacter) {
        case 'value-individualVsCollective': // 사회 변화(집단) < 개인 자유 (역채점 시 개인자유 선호가 높음)
          valueScores.individualVsCollective += score; 
          break;
        case 'value-economyVsEnvironment': // 경제 성장 > 환경 보호 (역채점 시 환경보호 선호가 높음)
          valueScores.economyVsEnvironment += score; 
          break;
        case 'value-securityVsFreedom':    // 국가 안보 > 시민 자유 (역채점 시 시민자유 선호가 높음)
          valueScores.securityVsFreedom += score;
          break;
        case 'value-shortTermVsLongTerm':  // 단기 성과 < 장기 비전 (정채점 시 장기비전 선호가 높음)
          valueScores.shortTermVsLongTerm += score;
          break;
      }
    } else {
      // 일반 캐릭터 문항 처리
      if (characterScores[question.relatedCharacter] !== undefined) {
        characterScores[question.relatedCharacter] += score;
      }
    }
  });

  // 주요 성향 및 부성향 결정
  const sortedCharacters = Object.entries(characterScores)
    .sort(([, aScore], [, bScore]) => bScore - aScore);

  const primaryCharacterId = sortedCharacters[0] ? sortedCharacters[0][0] : 'unknown';
  const secondaryCharacterId = sortedCharacters[1] ? sortedCharacters[1][0] : 'unknown';

  return {
    primaryCharacterId,
    secondaryCharacterId,
    characterScores,
    valueScores,
    timestamp: Date.now(),
  };
}; 