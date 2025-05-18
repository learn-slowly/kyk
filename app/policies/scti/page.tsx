"use client";

import React, { useState } from 'react';
import ImageSlotMachine from '@/app/components/scti/ImageSlotMachine';
// import Link from 'next/link'; // Link는 더 이상 필요 없음

// SCTI 테스트 관련 컴포넌트 및 컨텍스트 import
import { SctiTestProvider, useSctiTest } from '@/app/components/scti-test/context/SctiTestContext';
import SctiTestContainer from '@/app/components/scti-test/SctiTestContainer';
import { TestResult } from '@/app/components/scti-test/types';

// 페이지 콘텐츠와 테스트를 분리하기 위한 내부 컴포넌트
const SCTIPageContent = () => {
  const { startTest, currentStep } = useSctiTest(); // useSctiTest를 여기서 호출
  const [showTest, setShowTest] = useState(false);

  const sctiImagePaths = [
    '/images/scti/char01.png',
    '/images/scti/char02.png',
    '/images/scti/char03.png',
    '/images/scti/char04.png',
    '/images/scti/char05.png',
    '/images/scti/char06.png',
    '/images/scti/char07.png',
    '/images/scti/char08.png',
    '/images/scti/char09.png',
    '/images/scti/char10.png',
  ];

  const handleStartTestClick = () => {
    setShowTest(true); // 테스트 UI를 보이도록 상태 변경
    startTest(); // 실제 컨텍스트의 테스트 시작 함수 호출
  };
  
  const handleTestComplete = (result: TestResult) => {
    console.log('SCTI Test Completed on page:', result);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sctiPoliciesPageTestResult', JSON.stringify(result));
    }
    // 필요하다면 setShowTest(false) 등으로 테스트 UI를 다시 숨길 수 있음
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', minHeight: '100vh', padding: '20px', boxSizing: 'border-box', gap: '12px' }}>
      {!showTest && currentStep ==='intro' && (
        <>
          <h1 className="page-title" style={{ marginBottom: '12px', marginTop: '2rem' }}>
            <span>S</span><span style={{ fontSize: '50%' }}>ocial</span>{' '}
            <span>C</span><span style={{ fontSize: '50%' }}>hange</span>{' '}
            <span>T</span><span style={{ fontSize: '50%' }}>ype</span>{' '}
            <span>I</span><span style={{ fontSize: '50%' }}>ndex</span>
          </h1>
          <p style={{ textAlign: 'center', fontSize: '18px' }}>
            나는 어떤 사회대전환 캐릭터일까?
          </p>
          <ImageSlotMachine imagePaths={sctiImagePaths} viewportWidth={220} viewportHeight={220} imageHeight={230} />
          <p style={{
              textAlign: 'center',
              fontSize: '1rem',
              color: '#444',
              maxWidth: '600px',
              paddingLeft: '20px',
              paddingRight: '20px',
              lineHeight: '1.6'
            }}>
            세상을 바꾸는 10가지 정책 캐릭터 중에 나와 가장 잘 맞는 캐릭터를 찾아봐요. 간단한 질문에 답변하고 당신의 정책 성향과 가장 잘 맞는 사회변화 캐릭터를 알아보세요! 이 테스트는 당신이 어떤 가치를 중요하게 생각하는지, 그리고 어떤 방식으로 사회 변화에 기여하고 싶은지 탐색하는 데 도움을 줄 수 있습니다. 총 39개의 문항이 준비되어 있습니다.
          </p>
          <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '40px' }}>
            <button 
              onClick={handleStartTestClick} // Link 대신 onClick으로 테스트 시작
              style={{
                padding: '15px 35px',
                fontSize: '1.2rem',
                color: 'white',
                backgroundColor: '#0070f3',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                boxShadow: '0 3px 10px rgba(0,112,243,0.3)',
                transition: 'background-color 0.2s ease, transform 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#005bb5'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0070f3'}
              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.97)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              나의 사회변화 유형 테스트 시작하기!
            </button>
          </div>
        </>
      )}

      {(showTest || currentStep !== 'intro') && (
        <div style={{width: '100%', marginTop: '2rem'}}>
            <SctiTestContainer 
                className="scti-test-wrapper-on-page" 
                onTestComplete={handleTestComplete} 
            />
        </div>
      )}
    </div>
  );
}

// SctiTestProvider를 최상위에서 사용하도록 export default 컴포넌트 수정
export default function PoliciesSCTIPage() {
  return (
    <SctiTestProvider>
      <SCTIPageContent />
    </SctiTestProvider>
  );
} 