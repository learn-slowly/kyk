'use client';

import { useState, useEffect } from 'react';
import TestIntro from './TestIntro';
import QuestionSection from './QuestionSection';
import ResultSection from './ResultSection';
import { SctiTestProvider } from './context/SctiTestContext';

interface SctiTestContainerProps {
  containerId?: string;
  onTestComplete?: (result: any) => void;
  className?: string;
}

export default function SctiTestContainer({ 
  containerId, 
  onTestComplete,
  className 
}: SctiTestContainerProps) {
  const [currentStep, setCurrentStep] = useState<'intro' | 'questions' | 'results'>('intro');
  const [testResult, setTestResult] = useState<any>(null);

  // URL 쿼리 파라미터와 상태 동기화 (추후 구현)
  useEffect(() => {
    // 로컬 스토리지에서 상태 복원
    const savedStep = localStorage.getItem('scti_step');
    if (savedStep && ['intro', 'questions', 'results'].includes(savedStep)) {
      setCurrentStep(savedStep as 'intro' | 'questions' | 'results');
    }
    
    // 결과가 있으면 결과도 복원
    const savedResult = localStorage.getItem('scti_result');
    if (savedResult && currentStep === 'results') {
      setTestResult(JSON.parse(savedResult));
    }
  }, []);
  
  // 상태 변경시 저장
  useEffect(() => {
    localStorage.setItem('scti_step', currentStep);
    if (testResult) {
      localStorage.setItem('scti_result', JSON.stringify(testResult));
    }
  }, [currentStep, testResult]);
  
  const handleStartTest = () => {
    setCurrentStep('questions');
  };
  
  const handleCompleteTest = (result: any) => {
    setTestResult(result);
    setCurrentStep('results');
    if (onTestComplete) {
      onTestComplete(result);
    }
  };
  
  const handleResetTest = () => {
    localStorage.removeItem('scti_responses');
    localStorage.removeItem('scti_step');
    localStorage.removeItem('scti_question');
    localStorage.removeItem('scti_result');
    setTestResult(null);
    setCurrentStep('intro');
  };
  
  return (
    <div id={containerId} className={className}>
      <SctiTestProvider>
        {currentStep === 'intro' && <TestIntro onStart={handleStartTest} />}
        {currentStep === 'questions' && <QuestionSection onComplete={handleCompleteTest} />}
        {currentStep === 'results' && <ResultSection result={testResult} onReset={handleResetTest} />}
      </SctiTestProvider>
    </div>
  );
} 