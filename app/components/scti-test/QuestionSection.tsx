"use client";
import React from 'react';
import { useSctiTest } from './context/SctiTestContext';
import { questions as questionsData } from '@/app/data/scti/questions';

// 임시 ProgressIndicator, QuestionDisplay, AnswerScale, NavigationControls
const ProgressIndicator: React.FC<{ current: number; total: number }> = ({ current, total }) => (
  <div style={{ marginBottom: '20px', fontSize: '0.9rem', color: '#666' }}>
    질문 {current} / {total}
    <div style={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: '4px', marginTop: '5px' }}>
      <div style={{ width: `${(current / total) * 100}%`, backgroundColor: '#0070f3', height: '8px', borderRadius: '4px', transition: 'width 0.3s ease' }} />
    </div>
  </div>
);

const QuestionDisplay: React.FC<{ questionText: string }> = ({ questionText }) => (
  <h3 style={{ fontSize: '1.5rem', color: '#333', marginBottom: '30px', minHeight: '80px' }}>{questionText}</h3>
);

interface AnswerScaleProps {
  questionId: number;
  currentResponse: number | null;
  onAnswer: (score: number) => void;
}

const AnswerScale: React.FC<AnswerScaleProps> = ({ questionId, currentResponse, onAnswer }) => {
  const options = [
    { score: 1, label: '매우 동의하지 않음' },
    { score: 2, label: '동의하지 않음' },
    { score: 3, label: '중립' },
    { score: 4, label: '동의함' },
    { score: 5, label: '매우 동의함' },
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', flexWrap: 'nowrap' }}>
      {options.map(opt => (
        <button 
          key={opt.score} 
          onClick={() => onAnswer(opt.score)}
          style={{
            padding: '10px 5px',
            margin: '0 3px',
            fontSize: '0.85rem',
            color: currentResponse === opt.score ? 'white' : '#0070f3',
            backgroundColor: currentResponse === opt.score ? '#0070f3' : 'white',
            border: `1px solid ${currentResponse === opt.score ? '#0070f3' : '#ddd'}`,
            borderRadius: '6px',
            cursor: 'pointer',
            flex: 1,
            textAlign: 'center',
            transition: 'all 0.2s ease',
            whiteSpace: 'normal',
            lineHeight: '1.3'
          }}
          onMouseOver={(e) => { if (currentResponse !== opt.score) e.currentTarget.style.borderColor = '#0070f3'; }}
          onMouseOut={(e) => { if (currentResponse !== opt.score) e.currentTarget.style.borderColor = '#ddd'; }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};

interface NavigationControlsProps {
  onPrevious?: () => void;
  onNext: () => void;
  isLastQuestion: boolean;
  canProceed: boolean; // 다음으로 넘어갈 수 있는지 (현재 질문에 답변했는지)
  onSubmit?: () => void; // 마지막 질문에서 제출하는 함수
}

const NavigationControls: React.FC<NavigationControlsProps> = ({ onPrevious, onNext, isLastQuestion, canProceed, onSubmit }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
    <button 
      onClick={onPrevious}
      disabled={!onPrevious}
      style={{
        padding: '12px 25px',
        fontSize: '1rem',
        color: onPrevious ? '#333' : '#aaa',
        backgroundColor: onPrevious ? '#f0f0f0' : '#e9e9e9',
        border: `1px solid ${onPrevious ? '#ccc' : '#ddd'}`,
        borderRadius: '6px',
        cursor: onPrevious ? 'pointer' : 'not-allowed'
      }}
    >
      이전
    </button>
    <button 
      onClick={isLastQuestion ? onSubmit : onNext}
      disabled={!canProceed} // 현재 질문에 답해야 다음 또는 제출 가능
      style={{
        padding: '12px 25px',
        fontSize: '1rem',
        color: 'white',
        backgroundColor: canProceed ? (isLastQuestion ? '#28a745' : '#0070f3') : '#a0cfff',
        border: 'none',
        borderRadius: '6px',
        cursor: canProceed ? 'pointer' : 'not-allowed',
        fontWeight: 'bold'
      }}
    >
      {isLastQuestion ? '결과 보기' : '다음'}
    </button>
  </div>
);

export default function QuestionSection() {
  const { 
    currentQuestionIndex, 
    responses, 
    answerQuestion,
    navigateToQuestion,
    totalQuestions,
    calculateAndSetResults // 결과 계산 및 상태 설정 함수
  } = useSctiTest();
  
  const question = questionsData[currentQuestionIndex];
  const currentResponse = responses.find(r => r.questionId === question.id)?.score || null;

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      navigateToQuestion('next');
    } else {
      // 마지막 질문이면 결과 계산 (모든 질문에 답했는지 확인 후)
      if (responses.length === totalQuestions) {
        calculateAndSetResults();
      }
    }
  };

  const handleSubmit = () => {
    if (responses.length === totalQuestions) {
      calculateAndSetResults();
    } else {
      alert('모든 질문에 답변해주세요.');
    }
  };

  return (
    <div style={{ padding: '30px 20px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', maxWidth: '700px', margin: 'auto' }}>
      <ProgressIndicator 
        current={currentQuestionIndex + 1} 
        total={totalQuestions} 
      />
      
      <QuestionDisplay 
        questionText={question.text}
      />

      <AnswerScale 
        questionId={question.id}
        currentResponse={currentResponse}
        onAnswer={(score) => answerQuestion(question.id, score)}
      />
      
      <NavigationControls
        onPrevious={currentQuestionIndex > 0 ? () => navigateToQuestion('previous') : undefined}
        onNext={handleNext}
        isLastQuestion={currentQuestionIndex === totalQuestions - 1}
        canProceed={currentResponse !== null} // 현재 질문에 답변했는지 여부
        onSubmit={handleSubmit} // 마지막 질문에서 제출 함수
      />
    </div>
  );
} 