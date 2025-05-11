'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';

const slides = [
  {
    image: '/images/about01.jpg',
    title: '권영국의 길',
    message: '변호사에서 대선 후보까지, 시민과 함께하는 정치의 길'
  },
  {
    image: '/images/about06.jpg',
    title: '정의당의 새 얼굴',
    message: '진보정치의 새로운 아이콘, 사회대전환의 리더'
  },
  {
    image: '/images/about10.jpg',
    title: '새로운 시작',
    message: '정권교체를 넘어 사회대개혁으로, 불평등을 넘어 함께 사는 사회로'
  },
  {
    image: '/images/about17.jpg',
    title: '사회안전망 강화',
    message: '누구도 소외되지 않는 든든한 사회안전망으로 모두가 안심하는 사회'
  },
  {
    image: '/images/about12.jpg',
    title: '매화의 기개',
    message: '추위에도 향기를 잃지 않는 매화처럼, 어려움 속에서도 원칙을 지켜온 삶'
  },
  {
    image: '/images/about19.jpg',
    title: '정의당의 선택',
    message: '노동자와 민중을 대변하는 정치권력을 향한 실천적 선택'
  },
  {
    image: '/images/about11.jpg',
    title: '광야의 외침',
    message: '원내 정당의 관성을 버리고 광야로 나갈 각오를 다지겠다'
  },
  {
    image: '/images/about13.jpg',
    title: '광장의 정치',
    message: '광장의 목소리를 지키기 위해 광장의 정치를 실현하겠습니다'
  }
];

export default function ProfilePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const scrolling = useRef(false);
  const [animationKey, setAnimationKey] = useState(0);

  // 다음 이미지로 이동
  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
    setAnimationKey(prev => prev + 1);
  }, []);

  // 이전 이미지로 이동
  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
    setAnimationKey(prev => prev + 1);
  }, []);

  // 특정 이미지로 이동
  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
    setAnimationKey(prev => prev + 1);
  }, []);

  // 터치 이벤트 처리를 위한 변수
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  
  // 터치 시작 위치 기록
  const handleTouchStart = (e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };
  
  // 터치 이동 감지
  const handleTouchMove = (e: TouchEvent) => {
    touchEndY.current = e.touches[0].clientY;
    touchEndX.current = e.touches[0].clientX;
  };
  
  // 스크롤 이벤트 처리 - useCallback으로 감싸기
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault(); // 기본 스크롤 동작 방지
    
    if (scrolling.current) return; // 이미 스크롤 중이면 무시
    
    scrolling.current = true;
    
    if (e.deltaY > 0) {
      nextSlide();
    } else {
      prevSlide();
    }
    
    // 스크롤 디바운싱 (연속 스크롤 방지)
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
    
    scrollTimeout.current = setTimeout(() => {
      scrolling.current = false;
    }, 800); // 0.8초 동안 추가 스크롤 무시
  }, [nextSlide, prevSlide]);
  
  // 터치 종료 시 방향 판단 및 슬라이드 전환 - useCallback으로 감싸기
  const handleTouchEnd = useCallback(() => {
    if (scrolling.current) return;
    
    const diffY = touchStartY.current - touchEndY.current;
    const diffX = touchStartX.current - touchEndX.current;
    
    // 충분한 스와이프 거리가 있을 때만 슬라이드 전환
    const minSwipeDistance = 50;
    
    // 수직 스와이프가 수평 스와이프보다 크면 위/아래 이동
    if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > minSwipeDistance) {
      scrolling.current = true;
      
      if (diffY > 0) {
        nextSlide(); // 위로 스와이프
      } else {
        prevSlide(); // 아래로 스와이프
      }
      
      // 스크롤 디바운싱
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      
      scrollTimeout.current = setTimeout(() => {
        scrolling.current = false;
      }, 800);
    } 
    // 수평 스와이프가 수직 스와이프보다 크면 좌/우 이동
    else if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > minSwipeDistance) {
      scrolling.current = true;
      
      if (diffX > 0) {
        nextSlide(); // 오른쪽에서 왼쪽으로 스와이프
      } else {
        prevSlide(); // 왼쪽에서 오른쪽으로 스와이프
      }
      
      // 스크롤 디바운싱
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      
      scrollTimeout.current = setTimeout(() => {
        scrolling.current = false;
      }, 800);
    }
  }, [nextSlide, prevSlide]);

  // 키보드 이벤트 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      } else if (e.key === 'ArrowUp') {
        prevSlide();
      } else if (e.key === 'ArrowDown') {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [nextSlide, prevSlide]);
  
  // 스크롤 이벤트 리스너 등록
  useEffect(() => {
    const slider = sliderRef.current;
    const body = document.body;
    
    const wheelHandler = (e: WheelEvent) => {
      handleWheel(e);
    };
    
    if (slider) {
      slider.addEventListener('wheel', wheelHandler, { passive: false });
      slider.addEventListener('touchstart', handleTouchStart as EventListener);
      slider.addEventListener('touchmove', handleTouchMove as EventListener);
      slider.addEventListener('touchend', handleTouchEnd as EventListener);
      
      // body에도 이벤트 등록
      body.addEventListener('wheel', wheelHandler, { passive: false });
    }
    
    return () => {
      if (slider) {
        slider.removeEventListener('wheel', wheelHandler);
        slider.removeEventListener('touchstart', handleTouchStart as EventListener);
        slider.removeEventListener('touchmove', handleTouchMove as EventListener);
        slider.removeEventListener('touchend', handleTouchEnd as EventListener);
      }
      
      // body의 이벤트 리스너도 제거
      body.removeEventListener('wheel', wheelHandler);
      
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [handleWheel, handleTouchEnd]);

  return (
    <div className="profile-page">
      <div className="slider-container" ref={sliderRef}>
        <div className="slider">
          {slides.map((slide, index) => (
            <div 
              key={index} 
              className={`slide ${index === currentIndex ? 'active' : ''}`}
              style={{ transform: `translateX(${(index - currentIndex) * 100}%)` }}
            >
              <div className="image-container">
            <Image
                  src={slide.image}
                  alt={`권영국 후보 이미지 ${index + 1}`}
                  fill
                  sizes="100vw"
              style={{ objectFit: 'cover' }}
                  priority={index === currentIndex}
                />
                {index === 0 ? (
                  <div key={animationKey} className="special-overlay">
                    <div className="giant-text-container">
                      <div className="giant-text-stroke">
                        <div className="giant-text first-char">
                          <span className="vertical-text">노동자</span>
                        </div>
                      </div>
                    </div>
                    <div className="n-layout">
                      <div className="quote-text-container">
                        <div className="quote-text">
                          <p>아버지는 광산노동자였고, 나는 해고노동자였다</p>
                        </div>
                      </div>
                      <div className="bio-text-container">
                        <div className="bio-text">
                          <p>인문계에 가고싶었지만 집안 형편을 고려해 아버지의 권유에 따라 포항제철고등학교에 진학했다. 대학에서 금속공학을 전공해 풍산금속 기술직 공채에 합격했고, 안강공장 폭발 사망사고와 관련한 유인물을 붙였다는 이유로 1988년 해고된다.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : index === 1 ? (
                  <div key={animationKey} className="special-overlay skyblue-overlay">
                    <div className="giant-text-container">
                      <div className="giant-text-stroke">
                        <div className="giant-text second-char">
                          <span className="vertical-text second-text">여러분</span>
                        </div>
                      </div>
                    </div>
                    <div className="n-layout">
                      <div className="quote-text-container">
                        <div className="quote-text">
                          <p>&ldquo;여러분이 내게 가라고 하지 않는 한 내가 먼저 떠나지 않겠습니다&rdquo;</p>
                        </div>
                      </div>
                      <div className="bio-text-container">
                        <div className="bio-text">
                          <p>풍산금속에 있을 때 한 노동자가 그랬어요. &lsquo;당신은 대학 나온 사람 아니냐. 상황이 불리해지면 당신은 얼마든지 떠날 수 있다. 우리가 당신을 어떻게 믿고 따르겠느냐&rsquo; 그 말이 굉장히 가슴에 와서 꽂혔죠.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : index === 2 ? (
                  <div key={animationKey} className="special-overlay red-overlay">
                    <div className="giant-text-container">
                      <div className="giant-text-stroke">
                        <div className="giant-text third-char">
                          <span className="vertical-text third-text">동지</span>
                        </div>
                      </div>
                    </div>
                    <div className="n-layout">
                      <div className="quote-text-container">
                        <div className="quote-text">
                          <p>변호사가 된 후 &lsquo;변호사 동지&rsquo;라고 불렸을 때 기쁨을 느꼈다.</p>
                        </div>
                      </div>
                      <div className="bio-text-container">
                        <div className="bio-text">
                          <p>그렇게 거리의 변호사로 살아왔다. 변호사 동지를 버리지 않았다.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : index === 3 ? (
                  <div key={animationKey} className="special-overlay yellow-overlay">
                    <div className="giant-text-container">
                      <div className="giant-text-stroke">
                        <div className="giant-text fourth-char">
                          <span className="vertical-text fourth-text">정치</span>
                        </div>
                      </div>
                    </div>
                    <div className="n-layout">
                      <div className="quote-text-container">
                        <div className="quote-text">
                          <p>나는 노동자였고 변호사였으며 정치적 존재였다.</p>
                        </div>
                      </div>
                      <div className="bio-text-container">
                        <div className="bio-text">
                          <p>2014년 11월 13일 쌍용차 정리해고 사건에서 노동자들에게 패배를 안긴 대법원 판결은 변호사 권영국을 현실 정치로 이끌었다. 판결을 통해 세상을 바꿔보겠다는 생각은 고상한 환상이라는 것을, 대법원의 판결은 기득권 질서를 비호하고 정당화하는 제도적 폭력임을 깨닫는 순간이었다. (&lsquo;거리에 핀 정의&rsquo; 책소개 중에서)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : index === 4 ? (
                  <div key={animationKey} className="special-overlay purple-overlay">
                    <div className="giant-text-container">
                      <div className="giant-text-stroke">
                        <div className="giant-text fifth-char">
                          <span className="vertical-text fifth-text">매화</span>
                        </div>
                      </div>
                    </div>
                    <div className="n-layout">
                      <div className="quote-text-container">
                        <div className="quote-text">
                          <p>매화는 일생 추워도 향기를 팔지 않는다.</p>
                        </div>
                      </div>
                      <div className="bio-text-container">
                        <div className="bio-text">
                          <p>용산 참사, 쌍용차 정리해고 반대 파업 사건, 삼성바로잡기 운동본부, 이마트 불법파견, 세월호 참사 등. 있어야 할 곳을 마다하지 않았다. 어렵다고 피하지 않았다.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : index === 5 ? (
                  <div key={animationKey} className="special-overlay navy-overlay">
                    <div className="giant-text-container">
                      <div className="giant-text-stroke">
                        <div className="giant-text sixth-char">
                          <span className="vertical-text sixth-text">정의당</span>
                        </div>
                      </div>
                    </div>
                    <div className="n-layout">
                      <div className="quote-text-container">
                        <div className="quote-text">
                          <p>현실정치를 고민하며 노동자를 대변할 정치권력으로 정의당을 선택</p>
                        </div>
                      </div>
                      <div className="bio-text-container">
                        <div className="bio-text">
                          <p>&ldquo;하지만 아무리 광장의 불꽃이 타오른다 하여도 그 불꽃이 정치권력의 변화를 수반해내지 못하는 한 촛불은 언제든 배반당할 수 있음을 우리는 목격하고 있습니다. 해고된 노동자와 그 가족의 고통, 차별받는 비정규직 노동자의 한숨, 위험의 외주화로 죽어가는 하청 노동자의 죽음의 행렬, 끊임없이 반복되는 비인간적인 노동현실을 멈추게 하려면 어떻게 해야 할 것인지에 대한 제 고민은 매우 절박하고 간절한 것이었습니다.&rdquo; (2019년 10월 28일, 정의당 입당의 변)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : index === 6 ? (
                  <div key={animationKey} className="special-overlay black-overlay">
                    <div className="giant-text-container">
                      <div className="giant-text-stroke">
                        <div className="giant-text seventh-char">
                          <span className="vertical-text seventh-text">광야</span>
                        </div>
                      </div>
                    </div>
                    <div className="n-layout">
                      <div className="quote-text-container">
                        <div className="quote-text">
                          <p>원내 정당에서 길들여진 관념과 관성을 모두 버리고 광야로 나갈 각오를 다지겠다</p>
                        </div>
                      </div>
                      <div className="bio-text-container">
                        <div className="bio-text">
                          <p>2024년 녹색정의당의 뼈아픈 총선 실패 이후, 정의당을 다시 일으켜 세우기 위해 당대표로 출마한다. &ldquo;20년 동안 지속되었던 정의당의 원내정치는 실패했다. 하지만 정의당의 원내정치가 실패했다고 해서 진보정치가 실패한 것은 아닐 것이다. 정의당을 혁신하고 진보정치를 살려야 한다는 당원과 지지자분들의 간절함을 모아 용기를 내어 정의당 당대표 선거에 출마하게 되었다&rdquo; (2024년 05월 21일, SBS뉴스)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : index === 7 ? (
                  <div key={animationKey} className="special-overlay image-background">
                    <div className="white-overlay-layer"></div>
                    <div className="giant-text-container">
                      <div className="giant-text-stroke">
                        <div className="giant-text eighth-char">
                          <span className="vertical-text eighth-text">광장</span>
                        </div>
                      </div>
                    </div>
                    <div className="n-layout">
                      <div className="quote-text-container">
                        <div className="quote-text black-simple-text">
                          <p>광장의 목소리를 지키기 위해</p>
                        </div>
                      </div>
                      <div className="bio-text-container">
                        <div className="bio-text black-simple-text">
                          <p>우리에겐 우리가 지켜야 할 시민들의 삶이 있습니다. 우리가 마주하고 싶은 변화된 세상을 향한 꿈이 있습니다. 진보가 지켜내야 할 그 존재들이 있음을 알기에 용기를 내어 대선에 나섰습니다. 우리에게 주어진 역할을 단단히 붙들고 6월 3일로 나아가겠습니다. (2025년 5월 5일, 민주노동당으로의 당명 개정 및 대선 후보 선출에 붙여)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="overlay">
                    <div className="message-content">
                      <h2 className="slide-title">{slide.title}</h2>
                      <p className="slide-message">{slide.message}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="vertical-nav">
          <button className="nav-button up" onClick={prevSlide} aria-label="이전 슬라이드">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          </button>
          <div className="slide-indicator">
            {currentIndex + 1}/{slides.length}
          </div>
          <button className="nav-button down" onClick={nextSlide} aria-label="다음 슬라이드">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        </div>

        <div className="slider-navigation">
          <div className="slider-dots">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`slider-dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`슬라이드 ${index + 1}로 이동`}
              />
            ))}
          </div>
          
          <div className="instructions">
            <p>슬라이드를 넘기려면 스크롤하거나 화살표를 클릭하세요</p>
            <p className="key-instructions">또는 키보드 방향키를 사용하세요</p>
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        @font-face {
          font-family: 'SBAggroB';
          src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2108@1.1/SBAggroB.woff') format('woff');
          font-weight: normal;
          font-style: normal;
        }
        
        html, body {
          width: 100%;
          height: 100%;
          overflow: hidden;
          background-color: #000;
        }
      `}</style>

      <style jsx>{`
        .profile-page {
          width: 100vw;
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: #000;
          position: relative;
          overflow: hidden;
          margin: 0;
          padding: 0;
        }
        
        .slider-container {
          width: 100%;
          height: 100vh;
          position: relative;
          overflow: hidden;
        }
        
        .slider {
          width: 100%;
          height: 100%;
          position: relative;
        }
        
        .slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          transition: transform 0.5s ease-in-out;
        }
        
        .image-container {
          position: relative;
          width: 100%;
          height: 100%;
        }
        
        .special-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 180, 0, 0.4);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 2;
          background-image: url(/images/about01.jpg);
          background-blend-mode: soft-light;
          background-size: cover !important;
          background-position: 60% center !important;
          background-repeat: no-repeat;
          overflow: hidden;
        }
        
        .black-overlay {
          background-color: rgba(0, 0, 0, 0.3);
          background-image: url(/images/about11.jpg);
          background-blend-mode: soft-light;
          background-size: cover !important;
          background-position: center center !important;
          background-repeat: no-repeat;
        }
        
        .skyblue-overlay {
          background-color: rgba(0, 150, 230, 0.4);
          background-image: url(/images/about06.jpg);
          background-blend-mode: soft-light;
          background-size: cover !important;
          background-position: 60% center !important;
          background-repeat: no-repeat;
        }
        
        .red-overlay {
          background-color: rgba(220, 0, 0, 0.4);
          background-image: url(/images/about10.jpg);
          background-blend-mode: soft-light;
          background-size: cover !important;
          background-position: center center !important;
          background-repeat: no-repeat;
        }
        
        .yellow-overlay {
          background-color: rgba(255, 200, 0, 0.4);
          background-image: url(/images/about17.jpg);
          background-blend-mode: soft-light;
          background-size: cover !important;
          background-position: 60% center !important;
          background-repeat: no-repeat;
        }
        
        .purple-overlay {
          background-color: rgba(255, 105, 180, 0.4);
          background-image: url(/images/about12.jpg);
          background-blend-mode: soft-light;
          background-size: cover !important;
          background-position: center center !important;
          background-repeat: no-repeat;
        }
        
        .navy-overlay {
          background-color: rgba(65, 105, 225, 0.4);
          background-image: url(/images/about19.jpg);
          background-blend-mode: soft-light;
          background-size: cover !important;
          background-position: center center !important;
          background-repeat: no-repeat;
          padding-top: 5%;
        }
        
        .image-background {
          background-color: rgba(255, 255, 255, 0.4);
          background-image: url(/images/about13.jpg);
          background-blend-mode: soft-light;
          background-size: cover !important;
          background-position: center center !important;
          background-repeat: no-repeat;
        }
        
        .second-char {
          /* 배경 이미지 속성 제거 */
        }
        
        .third-char {
          /* 배경 이미지 속성 제거 */
        }
        
        .fourth-char {
          /* 배경 이미지 속성 제거 */
        }
        
        .fifth-char {
          /* 배경 이미지 속성 제거 */
        }
        
        .sixth-char {
          /* 배경 이미지 속성 제거 */
        }
        
        .seventh-char {
          /* 배경 이미지 속성 제거하고 특별 스타일만 유지 */
          color: rgba(0, 0, 0, 0.5) !important;
          opacity: 0.5 !important;
          text-shadow: none;
        }
        
        .eighth-char {
          /* 배경 이미지 속성 제거 */
        }
        
        .second-text {
          font-size: 30vw;
        }
        
        .third-text {
          font-size: 30vw;
        }
        
        .fourth-text {
          font-size: 30vw;
        }
        
        .fifth-text {
          font-size: 30vw;
        }
        
        .sixth-text {
          font-size: 30vw;
        }
        
        .seventh-text {
          font-size: 25vw;
          letter-spacing: -0.5rem;
          padding: 0 15px;
          color: rgba(0, 0, 0, 0.7);
          -webkit-text-fill-color: rgba(0, 0, 0, 0.7);
          -webkit-text-stroke: none;
          text-shadow: none;
          font-weight: 300;
        }
        
        .eighth-text {
          font-size: 25vw;
          letter-spacing: -0.5rem;
          padding: 0 15px;
          color: rgba(0, 0, 0, 0.7);
          -webkit-text-fill-color: rgba(0, 0, 0, 0.7);
          -webkit-text-stroke: none;
          text-shadow: none;
          font-weight: 300;
        }
        
        .giant-text-container {
          width: 90vw;
          max-width: 90vw;
          overflow: visible;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 70%;
          position: relative;
          padding: 0;
          margin: 0 auto;
        }
        
        .giant-text-stroke {
          position: relative;
          opacity: 0;
          animation: fadeIn 0.5s ease forwards 0.5s;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 90vw;
          max-width: 90vw;
          height: 100%;
          overflow: visible;
        }
        
        .giant-text {
          font-size: 35vw;
          font-weight: 300;
          color: rgba(0, 0, 0, 0.7);
          position: relative;
          font-family: 'SBAggroB', sans-serif;
          z-index: 3;
          text-shadow: none;
          opacity: 0.7;
          filter: brightness(1.2) contrast(1);
          clip-path: polygon(0 0, 0 0, 0 100%, 0% 100%);
          animation: revealChar 0.8s ease forwards 0.3s;
          white-space: nowrap;
          -webkit-text-fill-color: rgba(0, 0, 0, 0.7);
          -webkit-text-stroke: none;
          width: 90vw;
          text-align: center;
        }
        
        .first-char {
          font-size: 30vw;
          font-weight: 300;
          color: rgba(0, 0, 0, 0.7);
          text-shadow: 
            0 0 30px rgba(0, 0, 0, 0.6),
            3px 3px 5px rgba(0, 0, 0, 0.6),
            -2px -2px 0 rgba(0, 0, 0, 0.5),
            2px -2px 0 rgba(0, 0, 0, 0.5),
            -2px 2px 0 rgba(0, 0, 0, 0.5),
            2px 2px 0 rgba(0, 0, 0, 0.5);
          -webkit-text-fill-color: rgba(0, 0, 0, 0.7);
        }
        
        .vertical-text {
          display: inline-block;
          white-space: nowrap;
          padding: 0 10px;
          width: auto;
          max-width: none;
        }
        
        .quote-text-container {
          width: 100%;
          display: flex;
          justify-content: flex-start;
          padding-left: 10%;
          position: absolute;
          top: 10%;
          left: 0;
        }
        
        .quote-text {
          position: static;
          width: 60%;
          text-align: left;
          color: white;
          font-size: 2.5rem;
          font-weight: 300;
          text-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
          opacity: 0;
          animation: fadeInUp 0.8s forwards 1.2s;
          line-height: 1.2;
          margin-bottom: 2rem;
        }
        
        .bio-text-container {
          width: 100%;
          display: flex;
          justify-content: flex-start;
          padding-left: 40%;
          padding-right: 10%;
          position: absolute;
          top: 40%;
          left: 0;
        }
        
        .bio-text {
          width: 85%;
          text-align: left;
          color: white;
          font-size: 1.1rem;
          font-weight: 400;
          text-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
          opacity: 0;
          animation: fadeInUp 0.8s forwards 1.6s;
          line-height: 1.5;
        }
        
        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.7));
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }
        
        .message-content {
          text-align: center;
          color: white;
          max-width: 800px;
          padding: 20px;
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: 10px;
          backdrop-filter: blur(5px);
          transform: translateY(20px);
          opacity: 0;
          animation: fadeInUp 0.8s forwards 0.3s;
        }
        
        .slide-title {
          font-size: 3rem;
          font-weight: bold;
          margin-bottom: 15px;
          color: #FFed00;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }
        
        .slide-message {
          font-size: 1.5rem;
          line-height: 1.5;
        }
        
        .vertical-nav {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 10;
          background-color: rgba(0, 0, 0, 0.6);
          padding: 8px 4px;
          border-radius: 30px;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        .nav-button {
          background-color: transparent;
          color: white;
          border: none;
          width: 25px;
          height: 25px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 50%;
        }
        
        .nav-button:hover {
          background-color: rgba(255, 237, 0, 0.3);
          color: #FFed00;
        }
        
        .slide-indicator {
          color: white;
          font-size: 10px;
          margin: 5px 0;
          font-weight: bold;
        }
        
        .slider-navigation {
          position: absolute;
          bottom: 50px;
          left: 0;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 10;
        }
        
        .slider-dots {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .slider-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.5);
          border: none;
          margin: 0 5px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .slider-dot.active {
          background-color: #FFed00;
          transform: scale(1.2);
        }
        
        .instructions {
          color: white;
          font-size: 12px;
          text-align: center;
          opacity: 0.7;
          background-color: rgba(0, 0, 0, 0.5);
          padding: 8px 15px;
          border-radius: 20px;
          margin-bottom: 20px;
          backdrop-filter: blur(5px);
          max-width: 90%;
        }
        
        .key-instructions {
          margin-top: 5px;
          font-size: 10px;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .n-layout {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          padding-top: 10%;
          align-items: center;
        }
        
        @keyframes slideIn {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(0);
          }
        }
        
        @keyframes slideInFromRight {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(0);
          }
        }
        
        @keyframes revealChar {
          0% {
            clip-path: polygon(0 0, 0 0, 0 100%, 0% 100%);
          }
          20% {
            clip-path: polygon(0 0, 20% 0, 20% 100%, 0% 100%);
          }
          40% {
            clip-path: polygon(0 0, 40% 0, 40% 100%, 0% 100%);
          }
          60% {
            clip-path: polygon(0 0, 60% 0, 60% 100%, 0% 100%);
          }
          80% {
            clip-path: polygon(0 0, 80% 0, 80% 100%, 0% 100%);
          }
          100% {
            clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
          }
        }
        
        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        /* 모바일에서 글자 크기 키우기 */
        @media (max-width: 768px) {
          .giant-text {
            font-size: 45vw;
            white-space: nowrap;
            max-width: 90vw;
            overflow: visible;
            transform: none;
            transform-origin: center center;
            width: 90vw;
            text-align: center;
          }
          
          .vertical-text {
            writing-mode: vertical-lr;
            text-orientation: upright;
            letter-spacing: -1rem;
            font-size: 38vw;
            white-space: nowrap;
            width: auto;
            max-width: none;
            margin: 0 auto;
            padding: 0;
          }
          
          .first-char {
            font-size: 38vw;
            text-shadow: 
              0 0 30px rgba(0, 0, 0, 0.6),
              3px 3px 5px rgba(0, 0, 0, 0.6),
              -2px -2px 0 rgba(0, 0, 0, 0.5),
              2px -2px 0 rgba(0, 0, 0, 0.5),
              -2px 2px 0 rgba(0, 0, 0, 0.5),
              2px 2px 0 rgba(0, 0, 0, 0.5);
            -webkit-text-fill-color: rgba(0, 0, 0, 0.7);
          }
          
          .second-text, .third-text, .fourth-text, .fifth-text, .sixth-text {
            font-size: 38vw;
          }
          
          .seventh-text, .eighth-text {
            font-size: 32vw;
            letter-spacing: -0.5rem;
            padding: 0 15px;
            color: rgba(0, 0, 0, 0.7);
            -webkit-text-fill-color: rgba(0, 0, 0, 0.7);
            -webkit-text-stroke: none;
            text-shadow: none;
            font-weight: 300;
          }
          
          .giant-text-container {
            width: 90vw;
            max-width: 90vw;
            overflow: visible;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0;
            margin: 0 auto;
            transform: none;
          }
          
          .giant-text-stroke {
            width: 90vw;
            max-width: 90vw;
            height: 100%;
            overflow: visible;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          
          /* 특별히 iOS 사파리를 위한 조정 */
          @supports (-webkit-touch-callout: none) {
            .special-overlay {
              overflow: hidden;
              width: 100%;
              height: 100%;
              max-width: 100%;
              max-height: 100%;
            }
            
            .giant-text {
              font-size: 38vw;
              transform: none;
              margin: 0 auto;
              width: 90vw;
              max-width: 90vw;
              text-align: center;
              transform-origin: center center;
              max-height: 70vh;
              line-height: 1;
            }
            
            .vertical-text {
              font-size: 38vw;
              letter-spacing: -0.5rem;
              padding: 0;
              max-width: 90vw;
              width: auto;
              overflow: visible;
              transform: none;
              max-height: 70vh;
            }
            
            .giant-text-container {
              width: 90vw;
              max-width: 90vw;
              height: 70vh;
              max-height: 70vh;
              padding: 0;
              margin: 0 auto;
              overflow: visible;
              transform: none;
            }
            
            .giant-text-stroke {
              width: 90vw;
              max-width: 90vw;
              height: 70vh;
              max-height: 70vh;
              overflow: visible;
            }
            
            /* iOS 15 이상 Safari 버그 수정 */
            .seventh-text, .eighth-text {
              font-size: 32vw;
            }
          }
          
          /* 모바일에서 첫 문장 컨테이너 너비 확장 */
          .quote-text-container {
            padding-left: 5%;
            padding-right: 5%;
            width: 100%;
            position: relative;
            top: 0;
          }
          
          .quote-text {
            width: 90%;
            font-size: 2rem;
          }
          
          /* 모바일에서 두 번째 문단 조정 */
          .bio-text-container {
            padding-left: 5%;
            padding-right: 5%;
            position: relative;
            top: auto;
            margin-top: 20px;
          }
          
          .bio-text {
            width: 90%;
            font-size: 1rem;
          }
          
          /* n-layout 조정 - 첫 문장이 상단 10%에서 시작되도록 */
          .n-layout {
            padding-top: 10%;
          }
          
          /* 안드로이드용 특별 스타일 */
          @supports not (-webkit-touch-callout: none) {
            .vertical-text {
              letter-spacing: -2rem;
              text-orientation: upright;
              writing-mode: vertical-lr;
            }
          }
          
          .giant-text-container {
            width: 100%;
            max-width: 100%;
            overflow: visible;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          
          /* 모바일에서 8번째 슬라이드의 오버레이 조정 */
          .white-overlay-layer {
            background-color: rgba(255, 255, 255, 0.15);
          }
        }
        
        /* 더 작은 모바일 디바이스 */
        @media (max-width: 480px) {
          .giant-text {
            font-size: 40vw;
            white-space: nowrap;
            transform: none;
            width: 90vw;
            line-height: 1;
          }
          
          .vertical-text {
            writing-mode: vertical-lr;
            text-orientation: upright;
            letter-spacing: -0.8rem;
            font-size: 35vw;
            line-height: 0.9;
            padding: 0;
          }
          
          /* iOS 사파리 특화 스타일 - 작은 모바일 */
          @supports (-webkit-touch-callout: none) {
            .giant-text {
              font-size: 35vw;
              transform: none;
              line-height: 1;
              max-height: 70vh;
            }
            
            .vertical-text {
              font-size: 35vw;
              letter-spacing: -0.5rem;
              padding: 0;
              width: auto;
              max-width: 90vw;
              transform: none;
              max-height: 70vh;
              line-height: 0.9;
            }
            
            .giant-text-container, .giant-text-stroke {
              overflow: visible;
              width: 90vw;
              max-width: 90vw;
              height: 70vh;
              max-height: 70vh;
            }
            
            /* 특정 이슈가 있는 iOS 버전 대응 */
            @supports (padding: max(0px)) {
              .vertical-text {
                font-size: 30vw;
                letter-spacing: -0.3rem;
              }
              
              .giant-text {
                font-size: 30vw;
              }
              
              .seventh-text, .eighth-text {
                font-size: 28vw;
              }
            }
          }
          
          .seventh-text, .eighth-text {
            -webkit-text-stroke: none;
            text-shadow: none;
            color: rgba(0, 0, 0, 0.4);
            -webkit-text-fill-color: rgba(0, 0, 0, 0.4);
          }
        }

        .black-text {
          background: url(/images/about11.jpg) no-repeat center center !important;
        }
        
        .white-overlay {
          background-color: rgba(255, 255, 255, 0.7);
          background-image: url(/images/about13.jpg);
          background-blend-mode: multiply;
          background-size: cover;
          background-position: center center;
        }
        
        .transparent-overlay {
          background: none;
          background-image: url(/images/about13.jpg);
          background-size: cover;
          background-position: center center;
        }
        
        .white-overlay::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.8));
          z-index: 1;
        }
        
        .white-overlay .giant-text-container,
        .white-overlay .n-layout {
          position: relative;
          z-index: 2;
        }
        
        .white-text {
          background: url(/images/about13.jpg) no-repeat center center !important;
          color: white !important;
          mix-blend-mode: difference;
          text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
        }
        
        .white-pure-text {
          color: white !important;
          text-shadow: 0 0 10px rgba(0, 0, 0, 0.8), 0 0 15px rgba(0, 0, 0, 0.7);
        }
        
        .text-with-bg {
          background-color: rgba(255, 255, 255, 0.85);
          color: #000 !important;
          text-shadow: none;
          padding: 15px;
          border-radius: 5px;
          display: inline-block;
          max-width: 100%;
        }
        
        .black-quote {
          color: black !important;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }
        
        .black-bio {
          color: black !important;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }
        
        .white-simple-overlay {
          background-color: rgba(255, 255, 255, 0.7);
          background-image: url(/images/about13.jpg);
          background-blend-mode: normal;
          background-size: cover;
          background-position: center center;
        }
        
        .white-clean-text {
          color: white !important;
          position: relative;
          z-index: 5;
        }
        
        .black-simple-text {
          color: black !important;
          position: relative;
          z-index: 10;
        }

        .white-simple-overlay .n-layout {
          position: relative;
          z-index: 10;
        }

        .reverse-layout {
          display: flex;
          flex-direction: column;
          position: relative;
          height: 100%;
          padding-top: 10%;
        }

        .top-quote {
          padding-left: 10%;
          margin-bottom: 20px;
          z-index: 10;
        }

        .top-bio {
          padding-right: 10%;
          margin-bottom: 40px;
          z-index: 10;
        }

        .bottom-giant-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          text-align: center;
          z-index: 5;
        }

        .white-overlay-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(255, 255, 255, 0.15);
          z-index: 2;
        }

        .white-simple-overlay {
          background-color: rgba(255, 255, 255, 0.7);
          background-image: url(/images/about13.jpg);
          background-blend-mode: normal;
          background-size: cover;
          background-position: center center;
        }

        /* iOS 사파리에서 텍스트 렌더링 문제 해결을 위한 추가 스타일 */
        @supports (-webkit-touch-callout: none) {
          .giant-text {
            -webkit-text-stroke: none;
            color: rgba(0, 0, 0, 0.4) !important;
            -webkit-text-fill-color: rgba(0, 0, 0, 0.4) !important;
            opacity: 0.4 !important;
            text-shadow: none;
            font-weight: 300;
          }
          
          .first-char, .second-char, .third-char, .fourth-char,
          .fifth-char, .sixth-char {
            color: rgba(0, 0, 0, 0.4) !important;
            -webkit-text-fill-color: rgba(0, 0, 0, 0.4) !important;
            -webkit-text-stroke: none;
            text-shadow: none;
            font-weight: 300;
          }
          
          .seventh-char, .eighth-char {
            color: rgba(0, 0, 0, 0.4) !important;
            -webkit-text-fill-color: rgba(0, 0, 0, 0.4) !important;
            -webkit-text-stroke: none;
            text-shadow: none;
            font-weight: 300;
          }
        }

        /* iOS(아이폰) 관련 스타일 보완 */
        @media screen and (-webkit-min-device-pixel-ratio: 0) {
          .giant-text {
            -webkit-text-stroke: none;
            text-shadow: none;
            color: rgba(0, 0, 0, 0.4);
            opacity: 0.4;
            font-weight: 300;
          }
        }
      `}</style>
    </div>
  );
} 