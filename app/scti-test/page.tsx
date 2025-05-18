"use client";
import React from 'react';
import { SctiTestProvider } from '@/app/components/scti-test/context/SctiTestContext';
import SctiTestContainer from '@/app/components/scti-test/SctiTestContainer';
import Link from 'next/link';
import { TestResult } from '@/app/components/scti-test/types';

export default function SctiTestPage() {

  const handleTestComplete = (result: TestResult) => {
    console.log('SCTI Test Completed:', result);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sctiTestResult', JSON.stringify(result));
    }
  };

  return (
    <SctiTestProvider>
      <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '20px auto', padding: '20px', border: '1px solid #eee', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
          <h1 style={{ fontSize: '2rem', color: '#2c3e50', fontWeight: '600' }}>
            나의 사회변화 유형 검사
          </h1>
          <Link href="/policies/scti" passHref>
            <button style={{
              padding: '8px 16px',
              fontSize: '0.85rem',
              color: '#3498db',
              backgroundColor: 'transparent',
              border: '1px solid #3498db',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f0f8ff'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >소개 페이지로 돌아가기</button>
          </Link>
        </div>
        <SctiTestContainer 
          className="scti-test-wrapper" 
          onTestComplete={handleTestComplete} 
        />
      </div>
    </SctiTestProvider>
  );
} 