'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { PolicyCharacter } from './types';

interface SlotMachineProps {
  characters: PolicyCharacter[];
  duration?: number; // 애니메이션 지속 시간 (ms)
  finalCharacter?: PolicyCharacter | null; // 최종적으로 표시할 캐릭터 (결과 페이지용)
  onComplete?: () => void; // 애니메이션 완료 후 콜백
  size?: 'small' | 'medium' | 'large'; // 크기 옵션
}

export default function SlotMachine({ 
  characters, 
  duration = 3000, 
  finalCharacter = null,
  onComplete,
  size = 'medium'
}: SlotMachineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpinning, setIsSpinning] = useState(true);
  const [spinSpeed, setSpinSpeed] = useState(100); // 초기 스핀 속도 (ms)
  
  // 크기에 따른 픽셀 값 직접 지정
  const sizeValues = {
    small: 32,
    medium: 60,
    large: 72
  };
  
  const pixelSize = sizeValues[size];
  
  useEffect(() => {
    let spinInterval: NodeJS.Timeout;
    let speedChangeTimeout: NodeJS.Timeout;
    let totalTime = 0;
    
    // 스핀 간격 설정
    const startSpinning = () => {
      spinInterval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % characters.length);
      }, spinSpeed);
    };
    
    // 속도 점진적으로 늦추기
    const slowDownGradually = () => {
      speedChangeTimeout = setTimeout(() => {
        totalTime += spinSpeed;
        
        if (totalTime < duration * 0.7) {
          // 처음 70% 시간 동안은 빠른 속도 유지
          startSpinning();
          slowDownGradually();
        } else if (spinSpeed < 500) {
          // 속도 점점 늦추기
          const newSpeed = spinSpeed * 1.5;
          setSpinSpeed(newSpeed);
          clearInterval(spinInterval);
          startSpinning();
          slowDownGradually();
        } else {
          // 최종 캐릭터 표시
          clearInterval(spinInterval);
          
          if (finalCharacter) {
            const finalIndex = characters.findIndex(char => char.id === finalCharacter.id);
            if (finalIndex !== -1) {
              setCurrentIndex(finalIndex);
            }
          }
          
          setIsSpinning(false);
          if (onComplete) onComplete();
        }
      }, spinSpeed);
    };
    
    startSpinning();
    slowDownGradually();
    
    return () => {
      clearInterval(spinInterval);
      clearTimeout(speedChangeTimeout);
    };
  }, [characters, duration, finalCharacter, spinSpeed, onComplete]);
  
  return (
    <div 
      className="relative rounded-full overflow-hidden border-4 border-blue-600 shadow-lg"
      style={{ 
        width: `${pixelSize}px`, 
        height: `${pixelSize}px`,
        maxWidth: `${pixelSize}px`,
        maxHeight: `${pixelSize}px`,
      }}
    >
      <div 
        className="absolute inset-0 transition-transform"
        style={{ 
          transform: `scale(1.1)`, 
          transitionDuration: `${spinSpeed}ms`
        }}
      >
        <Image
          src={characters[currentIndex].imageUrl}
          alt={characters[currentIndex].name}
          fill
          sizes={`${pixelSize}px`}
          className="object-cover"
          quality={100}
          unoptimized
        />
      </div>
      
      {/* 슬롯머신 효과를 위한 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-blue-100/30 pointer-events-none"></div>
      
      {/* 반짝이는 효과 */}
      {isSpinning && (
        <div className="absolute top-0 right-0 w-4 h-4 bg-white rounded-full opacity-30 animate-pulse"></div>
      )}
    </div>
  );
} 