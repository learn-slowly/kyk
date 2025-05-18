'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { TestResult } from './types';
import characters, { getKwonPolicies } from './data/characters';
import Link from 'next/link';
import SlotMachine from './SlotMachine';

interface ResultSectionProps {
  result: TestResult;
  onReset: () => void;
}

export default function ResultSection({ result, onReset }: ResultSectionProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [showSlot, setShowSlot] = useState(true);
  const [showContent, setShowContent] = useState(false);
  
  if (!result || !result.primaryCharacter) {
    return <div className="text-center p-8">결과를 계산하는 중입니다...</div>;
  }
  
  // 주요 캐릭터와 부가 캐릭터 정보
  const primaryCharacter = characters.find(c => c.id === result.primaryCharacter);
  const secondaryCharacter = characters.find(c => c.id === result.secondaryCharacter);
  
  // 잘 맞는 캐릭터들
  const matchingCharacters = primaryCharacter?.goodMatches
    .map(id => characters.find(c => c.id === id))
    .filter(Boolean) || [];
  
  // 권영국 정책 연결
  const kwonPolicies = getKwonPolicies(result.primaryCharacter);
  
  // SNS 공유 처리
  const handleShare = (platform: 'twitter' | 'facebook' | 'kakao') => {
    setIsSharing(true);
    
    const shareText = `나의 정책 캐릭터는 "${primaryCharacter?.name}"입니다! 당신의 정책 성향도 알아보세요.`;
    const shareUrl = window.location.href;
    
    try {
      switch (platform) {
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
          break;
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`, '_blank');
          break;
        case 'kakao':
          // 카카오톡 공유는 SDK가 필요하므로 미구현
          alert('카카오톡 공유는 준비 중입니다.');
          break;
      }
    } catch (error) {
      console.error('공유 중 오류 발생:', error);
    }
    
    setIsSharing(false);
  };
  
  if (!primaryCharacter) {
    return (
      <div className="text-center p-8">
        <p>결과를 불러올 수 없습니다.</p>
        <button 
          onClick={onReset}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          다시 테스트하기
        </button>
      </div>
    );
  }
  
  const handleSlotComplete = () => {
    setTimeout(() => {
      setShowSlot(false);
      setShowContent(true);
    }, 500);
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">나의 정책 캐릭터는</h2>
      
      {/* 슬롯머신 결과 표시 */}
      {showSlot && (
        <div className="flex flex-col items-center justify-center mb-10">
          <SlotMachine 
            characters={characters}
            duration={4000}
            finalCharacter={primaryCharacter}
            size="medium"
            onComplete={handleSlotComplete}
          />
          <p className="mt-4 text-xl font-bold animate-pulse">결과를 확인하는 중...</p>
        </div>
      )}
      
      {/* 주요 캐릭터 프로필 */}
      {showContent && (
        <div className="animate-fadeIn">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row items-center">
              <div 
                className="relative rounded-full mb-4 md:mb-0 md:mr-6 overflow-hidden flex-shrink-0" 
                style={{ 
                  width: '64px', 
                  height: '64px',
                  maxWidth: '64px',
                  maxHeight: '64px'
                }}
              >
                <Image
                  src={primaryCharacter.imageUrl}
                  alt={primaryCharacter.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                  priority
                  quality={100}
                  unoptimized
                />
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2">{primaryCharacter.name}</h3>
                <p className="text-blue-600 font-medium mb-4">"{primaryCharacter.slogan}"</p>
                <p className="text-gray-700 mb-4">{primaryCharacter.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
                  {primaryCharacter.traits.map((trait, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* 그래프 및 부가 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* 점수 그래프 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium mb-4">나의 정책 성향 점수</h3>
              <div className="space-y-3">
                {characters.map(character => {
                  const score = result.characterScores[character.id] || 0;
                  const maxPossible = 20; // 캐릭터당 문항 4개, 최대 5점
                  const percentage = Math.min(100, Math.round((score / maxPossible) * 100));
                  
                  return (
                    <div key={character.id} className="flex items-center">
                      <span className="w-24 text-sm">{character.name}</span>
                      <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all duration-1000"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="w-10 text-sm text-right ml-2">{percentage}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* 잘 맞는 캐릭터들 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium mb-4">당신과 잘 맞는 다른 캐릭터</h3>
              <div className="space-y-4">
                {matchingCharacters.map(character => character && (
                  <div key={character.id} className="flex items-start">
                    <div 
                      className="relative rounded-full mr-3 flex-shrink-0 overflow-hidden" 
                      style={{ 
                        width: '24px', 
                        height: '24px',
                        maxWidth: '24px',
                        maxHeight: '24px'
                      }}
                    >
                      <Image
                        src={character.imageUrl}
                        alt={character.name}
                        fill
                        sizes="24px"
                        className="object-cover"
                        quality={100}
                        unoptimized
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">{character.name}</h4>
                      <p className="text-sm text-gray-600">"{character.slogan}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* 기승정 권영국 정책 연결 */}
          <div className="bg-blue-50 rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-bold text-center mb-4">
              기승정 권영국의 이런 정책을 좋아하실 것 같아요
            </h3>
            
            <div className="space-y-4">
              {kwonPolicies.map((policy, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3 flex-shrink-0">
                    {index + 1}
                  </div>
                  <p>{policy}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <Link
                href="/policies"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium inline-block"
              >
                기승정 권영국의 모든 정책 보기
              </Link>
            </div>
          </div>
          
          {/* 공유 및 다시 테스트하기 */}
          <div className="text-center space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">결과 공유하기</h3>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => handleShare('twitter')}
                  disabled={isSharing}
                  className="bg-[#1DA1F2] text-white p-2 rounded-full w-10 h-10 flex items-center justify-center"
                >
                  T
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  disabled={isSharing}
                  className="bg-[#1877F2] text-white p-2 rounded-full w-10 h-10 flex items-center justify-center"
                >
                  F
                </button>
                <button
                  onClick={() => handleShare('kakao')}
                  disabled={isSharing}
                  className="bg-[#FEE500] text-black p-2 rounded-full w-10 h-10 flex items-center justify-center"
                >
                  K
                </button>
              </div>
            </div>
            
            <button
              onClick={onReset}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium"
            >
              다시 테스트하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 