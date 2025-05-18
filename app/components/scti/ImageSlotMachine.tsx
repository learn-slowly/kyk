"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';

interface ImageSlotMachineProps {
  imagePaths: string[];
  viewportWidth?: number;
  viewportHeight?: number;
  imageHeight?: number;
}

const ImageSlotMachine: React.FC<ImageSlotMachineProps> = ({
  imagePaths,
  viewportWidth = 200, // 뷰포트 너비
  viewportHeight = 200, // 뷰포트 높이 (동그라미이므로 너비와 동일하게 사용)
  imageHeight = 180, // 각 이미지의 높이
}) => {
  const [shuffledImages, setShuffledImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 이미지 목록을 섞는 함수
  const shuffleArray = (array: string[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  useEffect(() => {
    setShuffledImages(shuffleArray(imagePaths));
  }, [imagePaths]);

  useEffect(() => {
    if (shuffledImages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % shuffledImages.length);
    }, 800); // 이미지가 바뀌는 간격 (ms) - 1500ms에서 800ms로 수정

    return () => clearInterval(interval);
  }, [shuffledImages]);

  // 애니메이션을 위해 이미지 목록을 확장 (앞뒤로 요소를 추가하여 끊김 없는 효과)
  const extendedImages = useMemo(() => {
    if (shuffledImages.length === 0) return [];
    // 최소 5개 이미지는 있어야 부드러운 순환이 가능
    const neededImages = Math.max(5, shuffledImages.length);
    const repeatedImages = [];
    while (repeatedImages.length < neededImages * 3) { // 3배수로 확장하여 루프 효과
        repeatedImages.push(...shuffledImages);
    }
    return repeatedImages;
  }, [shuffledImages]);


  if (extendedImages.length === 0) {
    return <div>이미지를 불러오는 중입니다...</div>;
  }
  
  // 현재 보여줘야 할 이미지 세그먼트의 시작 인덱스 계산
  // 중앙 이미지를 기준으로 위아래 이미지가 보이도록
  const displayWindowSize = 3; // 한 번에 뷰포트 주변에 로드할 이미지 수 (중앙 포함)
  const middleImageLogicalIndex = currentIndex % shuffledImages.length;


  // 실제 translateY를 위한 인덱스. extendedImages의 중앙 세그먼트를 기준으로 함
  const animationIndex = shuffledImages.length + middleImageLogicalIndex;


  const slotStyle: React.CSSProperties = {
    width: `${viewportWidth}px`,
    height: `${viewportHeight}px`,
    borderRadius: '50%', // 동그란 구멍
    overflow: 'hidden',
    position: 'relative',
    border: '1px solid #f0f0f0', // 이전 밝은 테두리 색상
    backgroundColor: '#ffffff', // 이전 밝은 배경색 (흰색)
    margin: '0 auto',
  };

  const imageStripStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'transform 0.5s ease-in-out', // 0.8s에서 0.5s로 수정
    // animationIndex를 기반으로 translateY 계산
    // 각 이미지의 높이만큼 이동하고, 중앙 이미지가 뷰포트 중앙에 오도록 조정
    transform: `translateY(calc(-${animationIndex * imageHeight}px + ${viewportHeight / 2}px - ${imageHeight / 2}px))`,
  };

  const imageContainerStyle: React.CSSProperties = {
    width: `${imageHeight}px`, // 이미지 컨테이너 너비 (정사각형 이미지 가정)
    height: `${imageHeight}px`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '0px', // 이미지 간 간격 - 10px에서 1px로 수정
  };

  const imageStyle: React.CSSProperties = {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
  };

  return (
    <div style={{
        width: `${viewportWidth + 32}px`,
        padding: '16px',
        boxShadow: '0px 6px 18px rgba(0, 0, 0, 0.3)', // 그림자 강조
        borderRadius: '16px',
        margin: '0 auto',
        backgroundColor: '#2D3748' // 어두운 회색/남색 계열로 변경 (예: Tailwind Gray 800)
    }}>
      <div style={slotStyle}>
        <div style={imageStripStyle}>
          {extendedImages.map((src, index) => (
            <div key={index} style={imageContainerStyle}>
              <Image src={src} alt={`SCTI Character ${index % shuffledImages.length + 1}`} width={imageHeight} height={imageHeight} style={imageStyle} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageSlotMachine; 