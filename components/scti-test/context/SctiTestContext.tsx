'use client';

import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { UserResponse, TestResult, Question } from '../types';

// 테스트 상태 타입
interface SctiTestState {
  currentStep: 'intro' | 'questions' | 'results';
  currentQuestionIndex: number;
  responses: UserResponse[];
  testResult: TestResult | null;
}

// 테스트 액션 타입
type SctiTestAction = 
  | { type: 'START_TEST' }
  | { type: 'ANSWER_QUESTION', questionId: number, score: number }
  | { type: 'GO_TO_NEXT_QUESTION' }
  | { type: 'GO_TO_PREVIOUS_QUESTION' }
  | { type: 'CALCULATE_RESULTS' }
  | { type: 'RESET_TEST' }
  | { type: 'SET_STEP', step: 'intro' | 'questions' | 'results' }
  | { type: 'RESTORE_STATE', state: Partial<SctiTestState> };

// 테스트 컨텍스트 타입
interface SctiTestContextType extends SctiTestState {
  // 액션
  startTest: () => void;
  answerQuestion: (questionId: number, score: number) => void;
  goToNextQuestion: () => void;
  goToPreviousQuestion: () => void;
  calculateResults: () => void;
  resetTest: () => void;
}

// 초기 상태
const initialState: SctiTestState = {
  currentStep: 'intro',
  currentQuestionIndex: 0,
  responses: [],
  testResult: null,
};

// 리듀서 함수
function sctiTestReducer(state: SctiTestState, action: SctiTestAction): SctiTestState {
  switch (action.type) {
    case 'START_TEST':
      return {
        ...state,
        currentStep: 'questions',
        currentQuestionIndex: 0,
        responses: [],
        testResult: null,
      };
    
    case 'ANSWER_QUESTION': {
      const existingResponseIndex = state.responses.findIndex(r => r.questionId === action.questionId);
      const newResponses = [...state.responses];
      
      if (existingResponseIndex !== -1) {
        // 기존 응답 업데이트
        newResponses[existingResponseIndex] = {
          ...newResponses[existingResponseIndex],
          score: action.score,
        };
      } else {
        // 새 응답 추가
        newResponses.push({
          questionId: action.questionId,
          score: action.score,
        });
      }
      
      return {
        ...state,
        responses: newResponses,
      };
    }
    
    case 'GO_TO_NEXT_QUESTION':
      // 최대 질문 인덱스를 넘지 않도록 함 (추후 실제 질문 개수로 조정)
      return {
        ...state,
        currentQuestionIndex: Math.min(state.currentQuestionIndex + 1, 39),
      };
    
    case 'GO_TO_PREVIOUS_QUESTION':
      return {
        ...state,
        currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0),
      };
    
    case 'CALCULATE_RESULTS':
      // 결과 계산 로직 (추후 구현)
      return {
        ...state,
        currentStep: 'results',
        testResult: {
          primaryCharacter: '가상 결과',
          secondaryCharacter: '가상 부결과',
          characterScores: {},
          valueScores: {
            individualVsCollective: 0,
            economyVsEnvironment: 0,
            securityVsFreedom: 0,
            shortTermVsLongTerm: 0,
          },
        },
      };
    
    case 'RESET_TEST':
      return initialState;
    
    case 'SET_STEP':
      return {
        ...state,
        currentStep: action.step,
      };
    
    case 'RESTORE_STATE':
      return {
        ...state,
        ...action.state,
      };
    
    default:
      return state;
  }
}

// 컨텍스트 생성
export const SctiTestContext = createContext<SctiTestContextType | undefined>(undefined);

// 컨텍스트 제공자
export function SctiTestProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(sctiTestReducer, initialState);
  
  // 로컬 스토리지 상태 복원
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedResponses = localStorage.getItem('scti_responses');
      const savedQuestion = localStorage.getItem('scti_question');
      
      if (savedResponses) {
        dispatch({
          type: 'RESTORE_STATE',
          state: {
            responses: JSON.parse(savedResponses),
            currentQuestionIndex: savedQuestion ? parseInt(savedQuestion, 10) : 0,
          },
        });
      }
    }
  }, []);
  
  // 상태 변경 시 로컬 스토리지 저장
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('scti_responses', JSON.stringify(state.responses));
      localStorage.setItem('scti_question', state.currentQuestionIndex.toString());
    }
  }, [state.responses, state.currentQuestionIndex]);
  
  // 컨텍스트 값 및 액션
  const value: SctiTestContextType = {
    ...state,
    startTest: () => dispatch({ type: 'START_TEST' }),
    answerQuestion: (questionId, score) => dispatch({ 
      type: 'ANSWER_QUESTION', 
      questionId, 
      score 
    }),
    goToNextQuestion: () => dispatch({ type: 'GO_TO_NEXT_QUESTION' }),
    goToPreviousQuestion: () => dispatch({ type: 'GO_TO_PREVIOUS_QUESTION' }),
    calculateResults: () => dispatch({ type: 'CALCULATE_RESULTS' }),
    resetTest: () => dispatch({ type: 'RESET_TEST' }),
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