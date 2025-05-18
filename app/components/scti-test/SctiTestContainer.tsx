"use client";
import React from 'react';
import { useSctiTest } from './context/SctiTestContext';
import TestIntro from './TestIntro';
import QuestionSection from './QuestionSection';
import ResultSection from './ResultSection';
import { TestResult } from './types'; // TestResult 타입을 가져옵니다.

interface SctiTestContainerProps {
  containerId?: string;
  onTestComplete?: (result: TestResult) => void; // TestResult 타입 사용
  className?: string;
}

export default function SctiTestContainer({
  containerId,
  onTestComplete,
  className,
}: SctiTestContainerProps) {
  const { currentStep, testResult } = useSctiTest();

  // onTestComplete 콜백 호출 로직 (결과가 있고, 콜백 함수가 제공되었을 때)
  React.useEffect(() => {
    if (currentStep === 'results' && testResult && onTestComplete) {
      onTestComplete(testResult);
    }
  }, [currentStep, testResult, onTestComplete]);

  return (
    <div id={containerId} className={className}>
      {currentStep === 'intro' && <TestIntro />}
      {currentStep === 'questions' && <QuestionSection />}
      {currentStep === 'results' && <ResultSection />}
    </div>
  );
} 