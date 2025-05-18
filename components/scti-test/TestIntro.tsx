'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import characters from './data/characters';
import SlotMachine from './SlotMachine';

interface TestIntroProps {
  onStart: () => void;
}

export default function TestIntro({ onStart }: TestIntroProps) {
  const [showSlot, setShowSlot] = useState(true);
  const [introComplete, setIntroComplete] = useState(false);
  
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">나의 정책 성향 찾기</h2>
        <p className="text-lg mb-4">
          40개의 질문에 답하면, 나의 정책 성향과 가장 잘 맞는 정책 캐릭터를 알려드립니다.
        </p>
        <p className="mb-6">
          각 문항에 동의하는 정도를 1~5점 사이로 선택해주세요.<br />
          테스트 소요 시간은 약 5~10분입니다.
        </p>
      </div>
      
      {/* 슬롯머신 효과 */}
      {showSlot && (
        <div className="mb-8">
          <SlotMachine 
            characters={characters} 
            duration={3000}
            size="medium"
            onComplete={() => {
              setTimeout(() => {
                setShowSlot(false);
                setIntroComplete(true);
              }, 500);
            }}
          />
          <p className="mt-4 text-blue-600 font-medium">
            당신의 정책 캐릭터는 무엇일까요?
          </p>
        </div>
      )}
      
      {/* 캐릭터 그리드 */}
      {!showSlot && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8 animate-fadeIn">
          {characters.map((character, index) => (
            <div key={character.id} className="flex flex-col items-center">
              <div 
                className="relative rounded-full mb-2 overflow-hidden flex-shrink-0" 
                style={{ 
                  width: '32px', 
                  height: '32px',
                  maxWidth: '32px',
                  maxHeight: '32px'
                }}
              >
                <Image 
                  src={character.imageUrl}
                  alt={character.name}
                  fill
                  sizes="40px"
                  className="object-cover"
                  quality={100}
                  unoptimized
                />
              </div>
              <span className="text-xs text-center">{character.name}</span>
            </div>
          ))}
        </div>
      )}
      
      <div className={`flex flex-col items-center ${introComplete ? 'animate-bounce' : ''}`}>
        <p className="mb-4 text-sm text-gray-600">
          테스트 결과로 기승정 권영국의 정책과 얼마나 일치하는지 확인해보세요!
        </p>
        <button 
          onClick={onStart}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors"
        >
          테스트 시작하기
        </button>
      </div>
    </div>
  );
} 