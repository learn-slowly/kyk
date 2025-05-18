"use client";

import React, { createContext, useReducer, useContext, ReactNode, useCallback, useMemo } from 'react';
import { 
  SctiTestState, 
  SctiTestAction, 
  SctiTestContextType,
  UserResponse,
  TestResult
} from '../types';
import { characters as charactersData } from '@/app/data/scti/characters';
import { questions as questionsData } from '@/app/data/scti/questions';
import { calculateResults } from '../utils/calculateResults';
import { useRouter } from 'next/navigation';

const initialState: SctiTestState = {
  currentStep: 'intro',
  currentQuestionIndex: 0,
  responses: [],
  testResult: null,
  detailedCharacterId: null,
};

const SctiTestContext = createContext<SctiTestContextType | undefined>(undefined);

function testReducer(state: SctiTestState, action: SctiTestAction): SctiTestState {
  switch (action.type) {
    case 'START_TEST':
      return { ...initialState, currentStep: 'questions', responses: [], detailedCharacterId: null };
    case 'ANSWER_QUESTION':
      const existingResponseIndex = state.responses.findIndex(
        (r) => r.questionId === action.payload.questionId
      );
      const updatedResponses = [...state.responses];
      if (existingResponseIndex > -1) {
        updatedResponses[existingResponseIndex] = action.payload;
      } else {
        updatedResponses.push(action.payload);
      }
      return { ...state, responses: updatedResponses };
    case 'NAVIGATE_QUESTION':
      const nextIndex = state.currentQuestionIndex + (action.payload.direction === 'next' ? 1 : -1);
      if (nextIndex >= 0 && nextIndex < questionsData.length) {
        return { ...state, currentQuestionIndex: nextIndex };
      }
      if (nextIndex >= questionsData.length && state.responses.length === questionsData.length) {
         return { ...state, currentStep: 'results' };
      }
      return state;
    case 'SET_RESULTS':
        return { 
            ...state, 
            testResult: action.payload, 
            currentStep: 'results', 
            detailedCharacterId: action.payload.primaryCharacterId 
        };
    case 'RESET_TEST':
      return { ...initialState, responses: [], detailedCharacterId: null };
    case 'LOAD_STATE':
      return { ...state, ...action.payload };
    case 'SET_DETAILED_CHARACTER':
      return { ...state, detailedCharacterId: action.payload };
    default:
      return state;
  }
}

export function SctiTestProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(testReducer, initialState);
  const router = useRouter();

  const startTest = useCallback(() => dispatch({ type: 'START_TEST' }), []);
  
  const answerQuestion = useCallback((questionId: number, score: number) => {
    dispatch({ type: 'ANSWER_QUESTION', payload: { questionId, score } });
  }, []);

  const navigateToQuestion = useCallback((direction: 'next' | 'previous') => {
    dispatch({ type: 'NAVIGATE_QUESTION', payload: { direction } });
  }, []);

  const calculateAndSetResults = useCallback(() => {
    if (state.responses.length === questionsData.length) {
      const results = calculateResults(state.responses, charactersData, questionsData);
      dispatch({ type: 'SET_RESULTS', payload: results });
    } else {
      console.warn('모든 질문에 답변해야 결과를 볼 수 있습니다.');
    }
  }, [state.responses]);

  const resetTest = useCallback(() => {
    dispatch({ type: 'RESET_TEST' });
  }, []);
  
  const getCharacterById = useCallback((id: string) => {
    return charactersData.find(char => char.id === id);
  }, []);

  const loadState = useCallback((stateToLoad: Partial<SctiTestState>) => {
    dispatch({ type: 'LOAD_STATE', payload: stateToLoad });
  }, []);

  const setDetailedCharacterId = useCallback((characterId: string | null) => {
    dispatch({ type: 'SET_DETAILED_CHARACTER', payload: characterId });
  }, []);

  const value = useMemo(() => ({
    ...state,
    startTest,
    answerQuestion,
    navigateToQuestion,
    calculateAndSetResults,
    resetTest,
    totalQuestions: questionsData.length,
    getCharacterById,
    loadState,
    setDetailedCharacterId,
  }), [state, startTest, answerQuestion, navigateToQuestion, calculateAndSetResults, resetTest, getCharacterById, loadState, setDetailedCharacterId]);

  return (
    <SctiTestContext.Provider value={value}>
      {children}
    </SctiTestContext.Provider>
  );
}

// 커스텀 훅
export function useSctiTest(): SctiTestContextType {
  const context = useContext(SctiTestContext);
  if (context === undefined) {
    throw new Error('useSctiTest must be used within a SctiTestProvider');
  }
  return context;
} 