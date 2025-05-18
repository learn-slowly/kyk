'use client';

import { useState, useEffect } from 'react';
import { useSctiTest } from './context/SctiTestContext';
import questions from './data/questions';
import { TestResult } from './types';
import { calculateResults } from './utils/calculateResults';

interface QuestionSectionProps {
  onComplete: (result: TestResult) => void;
}

export default function QuestionSection({ onComplete }: QuestionSectionProps) {
  const { 
    currentQuestionIndex,
    responses,
    answerQuestion,
    goToNextQuestion,
    goToPreviousQuestion,
  } = useSctiTest();
  
  const [loading, setLoading] = useState(false);
  const question = questions[currentQuestionIndex];
  const currentResponse = responses.find(r => r.questionId === question.id)?.score || 0;
  
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  
  // 현재 문항에 응답 여부 (이전/다음 버튼 활성화용)
  const hasAnswered = responses.some(r => r.questionId === question.id);
  
  const handleOptionSelect = (score: number) => {
    answerQuestion(question.id, score);
  };
  
  const handleNext = () => {
    if (isLastQuestion) {
      setLoading(true);
      // 마지막 질문이면 결과 계산
      const allAnswered = questions.every(q => 
        responses.some(r => r.questionId === q.id)
      );
      
      if (allAnswered) {
        const result = calculateResults(responses, questions);
        onComplete(result);
      } else {
        // 모든 문항에 답변하지 않았다면 알림
        alert('모든 문항에 답변해주세요.');
        
        // 첫 번째 미응답 질문으로 이동
        const firstUnansweredIndex = questions.findIndex(q => 
          !responses.some(r => r.questionId === q.id)
        );
        
        if (firstUnansweredIndex !== -1) {
          // TODO: 해당 인덱스로 이동하는 로직 추가 (미구현)
        }
      }
      setLoading(false);
    } else {
      goToNextQuestion();
    }
  };
  
  return (
    <div className="flex flex-col max-w-2xl mx-auto">
      {/* 진행 상태 */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>문항 {currentQuestionIndex + 1} / {questions.length}</span>
          <span>{Math.round((currentQuestionIndex + 1) / questions.length * 100)}% 완료</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>
      
      {/* 질문 및 응답 옵션 */}
      <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
        <h3 className="text-xl font-medium mb-6 text-center">{question.text}</h3>
        
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between text-sm text-gray-600 w-full px-2">
            <span>전혀 동의하지 않음</span>
            <span>매우 동의함</span>
          </div>
          
          <div className="flex justify-between w-full">
            {[1, 2, 3, 4, 5].map((score) => (
              <button
                key={score}
                onClick={() => handleOptionSelect(score)}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all
                  ${currentResponse === score 
                    ? 'bg-blue-600 text-white shadow-md scale-110' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {score}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* 네비게이션 버튼 */}
      <div className="flex justify-between">
        <button
          onClick={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className={`px-4 py-2 rounded ${
            currentQuestionIndex === 0 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          이전
        </button>
        
        <button
          onClick={handleNext}
          disabled={!hasAnswered || loading}
          className={`px-6 py-2 rounded font-medium ${
            !hasAnswered 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isLastQuestion ? '결과 보기' : '다음'}
          {loading && ' ...'}
        </button>
      </div>
    </div>
  );
} 