"use client";
import React from 'react';
import { useSctiTest } from './context/SctiTestContext';

export default function TestIntro() {
  const { startTest } = useSctiTest();

  return (
    <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: '#f9f9f9', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
      <h2 style={{ fontSize: '2.5rem', color: '#333', marginBottom: '20px', fontWeight: 'bold' }}>
        나의 사회변화 유형 찾기 (SCTI 테스트)
      </h2>
      <p style={{ fontSize: '1.1rem', color: '#555', marginBottom: '30px', lineHeight: '1.7' }}>
        간단한 질문에 답변하고 당신의 정책 성향과 가장 잘 맞는 사회변화 캐릭터를 알아보세요!
        <br />
        이 테스트는 당신이 어떤 가치를 중요하게 생각하는지, 그리고 어떤 방식으로 사회 변화에 기여하고 싶은지 탐색하는 데 도움을 줄 수 있습니다.
      </p>
      <button 
        onClick={startTest} 
        style={{
          padding: '15px 30px',
          fontSize: '1.2rem',
          color: 'white',
          backgroundColor: '#0070f3', // 파란색 계열
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold',
          boxShadow: '0 2px 8px rgba(0,112,243,0.3)',
          transition: 'background-color 0.2s ease, transform 0.2s ease'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#005bb5'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0070f3'}
        onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
        onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        테스트 시작하기
      </button>
      <p style={{ fontSize: '0.9rem', color: '#777', marginTop: '30px' }}>
        총 {useSctiTest().totalQuestions}개의 문항으로 구성되어 있으며, 약 5-10분 소요됩니다.
      </p>
    </div>
  );
} 