'use client';

import { useState, useRef, useEffect } from 'react';
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
    message: '원내 정당의 관성을 버리고 민중의 곁으로 돌아가는 정치'
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
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
    setAnimationKey(prev => prev + 1);
  };

  // 이전 이미지로 이동
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
    setAnimationKey(prev => prev + 1);
  };

  // 특정 이미지로 이동
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setAnimationKey(prev => prev + 1);
  };

  // 스크롤 이벤트 처리
  const handleWheel = (e: WheelEvent) => {
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
  };
  
  // 터치 이벤트 처리를 위한 변수
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);
  
  // 터치 시작 위치 기록
  const handleTouchStart = (e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };
  
  // 터치 이동 감지
  const handleTouchMove = (e: TouchEvent) => {
    touchEndY.current = e.touches[0].clientY;
  };
  
  // 터치 종료 시 방향 판단 및 슬라이드 전환
  const handleTouchEnd = () => {
    if (scrolling.current) return;
    
    const diff = touchStartY.current - touchEndY.current;
    // 충분한 스와이프 거리가 있을 때만 슬라이드 전환
    if (Math.abs(diff) > 50) {
      scrolling.current = true;
      
      if (diff > 0) {
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
  };

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
  }, []);
  
  // 스크롤 이벤트 리스너 등록
  useEffect(() => {
    const slider = sliderRef.current;
    
    if (slider) {
      slider.addEventListener('wheel', handleWheel, { passive: false });
      slider.addEventListener('touchstart', handleTouchStart as EventListener);
      slider.addEventListener('touchmove', handleTouchMove as EventListener);
      slider.addEventListener('touchend', handleTouchEnd as EventListener);
    }
    
    return () => {
      if (slider) {
        slider.removeEventListener('wheel', handleWheel);
        slider.removeEventListener('touchstart', handleTouchStart as EventListener);
        slider.removeEventListener('touchmove', handleTouchMove as EventListener);
        slider.removeEventListener('touchend', handleTouchEnd as EventListener);
      }
      
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

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
                          <p>2014년 11월 13일 쌍용차 정리해고 사건에서 노동자들에게 패배를 안긴 대법원 판결은 변호사 권영국을 현실 정치로 이끌었다. 판결을 통해 세상을 바꿔보겠다는 생각은 고상한 환상이라는 것을, 대법원의 판결은 기득권 질서를 비호하고 정당화하는 제도적 폭력임을 깨닫는 순간이었다. 그리고 기울어진 운동장을 바꾸기 위해 정치의 주인으로서 용기 있는 발걸음을 내딛었다. (&lsquo;거리에 핀 정의&rsquo; 책소개 중에서)</p>
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
                    <div className="n-layout" style={{ marginTop: "-5%" }}>
                      <div className="quote-text-container">
                        <div className="quote-text">
                          <p>현실정치를 고민하며 노동자를 대변할 정치권력으로 정의당을 선택, 입당한다.</p>
                        </div>
                      </div>
                      <div className="bio-text-container">
                        <div className="bio-text">
                          <p>&ldquo;헌법을 유린한 국정 농단 사태에 저항하며 광장으로 나선 촛불 시민들은 불평등한 사회 대개혁을 요구하며 평등하고 정의로운 시대의 도래를 희망했습니다. 하지만 아무리 광장의 불꽃이 타오른다 하여도 그 불꽃이 정치권력의 변화를 수반해내지 못하는 한 촛불은 언제든 배반당할 수 있음을 우리는 목격하고 있습니다. 노동자와 민중이 자신을 대변할 정치권력을 갖지 못하는 이상, 광장민주주의만으로 우리 삶을 변화시키지 못한다는 사실을 뼈저리게 확인하고 있습니다. 해고된 노동자와 그 가족의 고통, 차별받는 비정규직 노동자의 한숨, 위험의 외주화로 죽어가는 하청 노동자의 죽음의 행렬, 끊임없이 반복되는 비인간적인 노동현실을 멈추게 하려면 어떻게 해야 할 것인지에 대한 제 고민은 매우 절박하고 간절한 것이었습니다.&rdquo; (2019년 10월 28일, 정의당 입당의 변)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : index === 6 ? (
                  <div key={animationKey} className="special-overlay black-overlay">
                    <div className="giant-text-container">
                      <div className="giant-text-stroke">
                        <div className="giant-text seventh-char black-text">
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
                    <div className="n-layout reverse-layout">
                      <div className="quote-text-container top-quote">
                        <div className="quote-text black-simple-text">
                          <p>광장의 목소리를 지키기 위해</p>
                        </div>
                      </div>
                      <div className="bio-text-container top-bio">
                        <div className="bio-text black-simple-text">
                          <p>우리에겐 우리가 지켜야 할 시민들의 삶이 있습니다. 우리가 마주하고 싶은 변화된 세상을 향한 꿈이 있습니다. 진보가 지켜내야 할 그 존재들이 있음을 알기에 용기를 내어 대선에 나섰습니다. 우리에게 주어진 역할을 단단히 붙들고 6월 3일로 나아가겠습니다. (2025년 5월 5일, 민주노동당으로의 당명 개정 및 대선 후보 선출에 붙여)</p>
                        </div>
                      </div>
                      <div className="bottom-giant-text">
                        <div className="giant-text-stroke">
                          <div className="giant-text eighth-char white-clean-text">
                            <span className="vertical-text eighth-text">광장</span>
                          </div>
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
          background-color: rgba(0, 180, 0, 0.7);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 2;
          background-image: url(/images/about01.jpg);
          background-blend-mode: multiply;
          background-size: cover;
          background-position: center center;
        }
        
        .black-overlay {
          background-color: rgba(0, 0, 0, 0.8);
          background-image: url(/images/about11.jpg);
          background-blend-mode: multiply;
          background-size: cover;
          background-position: center center;
        }
        
        .skyblue-overlay {
          background-color: rgba(0, 150, 230, 0.7);
          background-image: url(/images/about06.jpg);
          background-blend-mode: multiply;
          background-size: cover;
          background-position: center center;
        }
        
        .red-overlay {
          background-color: rgba(220, 0, 0, 0.7);
          background-image: url(/images/about10.jpg);
          background-blend-mode: multiply;
          background-size: cover;
          background-position: center center;
        }
        
        .yellow-overlay {
          background-color: rgba(255, 200, 0, 0.7);
          background-image: url(/images/about17.jpg);
          background-blend-mode: multiply;
          background-size: cover;
          background-position: center center;
        }
        
        .purple-overlay {
          background-color: rgba(255, 105, 180, 0.7);
          background-image: url(/images/about12.jpg);
          background-blend-mode: multiply;
          background-size: cover;
          background-position: center center;
        }
        
        .navy-overlay {
          background-color: rgba(65, 105, 225, 0.7); /* 옅은 남색 */
          background-image: url(/images/about19.jpg);
          background-blend-mode: multiply;
          background-size: cover;
          background-position: center center;
          padding-top: 5%;
        }
        
        .second-char {
          background: url(/images/about06.jpg) no-repeat center center !important;
          background-size: cover !important;
          background-position: center center !important;
          background-clip: text !important;
          -webkit-background-clip: text !important;
        }
        
        .third-char {
          background: url(/images/about10.jpg) no-repeat center center !important;
          background-size: cover !important;
          background-position: center center !important;
          background-clip: text !important;
          -webkit-background-clip: text !important;
        }
        
        .fourth-char {
          background: url(/images/about17.jpg) no-repeat center center !important;
          background-size: cover !important;
          background-position: center center !important;
          background-clip: text !important;
          -webkit-background-clip: text !important;
        }
        
        .fifth-char {
          background: url(/images/about12.jpg) no-repeat center center !important;
          background-size: cover !important;
          background-position: center center !important;
          background-clip: text !important;
          -webkit-background-clip: text !important;
        }
        
        .sixth-char {
          background: url(/images/about19.jpg) no-repeat center center !important;
          background-size: cover !important;
          background-position: 60% center !important;
          background-clip: text !important;
          -webkit-background-clip: text !important;
        }
        
        .seventh-char {
          background: url(/images/about11.jpg) no-repeat center center !important;
          background-size: cover !important;
          background-position: center center !important;
          background-clip: text !important;
          -webkit-background-clip: text !important;
        }
        
        .eighth-char {
          background: url(/images/about13.jpg) no-repeat center center !important;
          background-size: cover !important;
          background-position: center center !important;
          background-clip: text !important;
          -webkit-background-clip: text !important;
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
          font-size: 30vw;
        }
        
        .eighth-text {
          font-size: 30vw;
        }
        
        .giant-text-stroke {
          position: relative;
          opacity: 0;
          animation: fadeIn 0.5s ease forwards 0.8s;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
        }
        
        .giant-text {
          font-size: 40vw;
          font-weight: normal;
          color: rgba(0, 0, 0, 0);
          position: relative;
          font-family: 'SBAggroB', sans-serif;
          z-index: 3;
          -webkit-mask-image: linear-gradient(#ffffff, #ffffff);
          -webkit-mask-size: 100%;
          mask-image: linear-gradient(#ffffff, #ffffff);
          mask-size: 100%;
          mix-blend-mode: screen;
          background: url(/images/about01.jpg) no-repeat center center;
          background-size: cover;
          background-position: center center;
          background-clip: text;
          -webkit-background-clip: text;
          opacity: 0.8;
          filter: brightness(0.8);
          clip-path: polygon(0 0, 0 0, 0 100%, 0% 100%);
          animation: revealChar 1s ease forwards 1s;
        }
        
        .first-char {
          font-size: 30vw;
        }
        
        .vertical-text {
          display: inline-block;
        }
        
        .quote-text-container {
          width: 100%;
          display: flex;
          justify-content: flex-start;
          padding-left: 10%;
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
          animation: fadeInUp 1s forwards 2.1s;
          line-height: 1.2;
          margin-bottom: 2rem;
        }
        
        .bio-text-container {
          width: 100%;
          display: flex;
          justify-content: flex-end;
          padding-right: 10%;
        }
        
        .bio-text {
          width: 50%;
          text-align: right;
          color: white;
          font-size: 1.1rem;
          font-weight: 400;
          text-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
          opacity: 0;
          animation: fadeInUp 1s forwards 2.6s;
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
          justify-content: center;
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
            font-size: 70vw;
          }
          
          .first-char {
            font-size: 24vw;
          }
          
          .vertical-text {
            writing-mode: vertical-lr;
            text-orientation: upright;
            letter-spacing: -0.5rem;
            font-size: 40vw;
          }
          
          .second-text {
            writing-mode: vertical-lr;
            text-orientation: upright;
            letter-spacing: -0.3rem;
            font-size: 40vw;
          }
          
          .third-text {
            writing-mode: vertical-lr;
            text-orientation: upright;
            letter-spacing: -0.3rem;
            font-size: 40vw;
          }
          
          .fourth-text {
            writing-mode: vertical-lr;
            text-orientation: upright;
            letter-spacing: -0.3rem;
            font-size: 40vw;
          }
          
          .fifth-text {
            writing-mode: vertical-lr;
            text-orientation: upright;
            letter-spacing: -0.3rem;
            font-size: 40vw;
          }
          
          .sixth-text {
            writing-mode: vertical-lr;
            text-orientation: upright;
            letter-spacing: -0.3rem;
            font-size: 40vw;
          }
          
          .seventh-text {
            writing-mode: vertical-lr;
            text-orientation: upright;
            letter-spacing: -0.3rem;
            font-size: 40vw;
          }
          
          .eighth-text {
            writing-mode: vertical-lr;
            text-orientation: upright;
            letter-spacing: -0.3rem;
            font-size: 40vw;
          }
          
          /* 태블릿에서의 배경 이미지 위치 조정 */
          .special-overlay {
            background-position: 60% center !important;
          }
          
          .giant-text {
            background-position: 60% center !important;
          }
          
          .second-char {
            background-position: 60% center !important;
          }
          
          .third-char {
            background-position: 60% center !important;
          }
          
          .fourth-char {
            background-position: 60% center !important;
          }
          
          .fifth-char {
            background-position: 60% center !important;
          }
          
          .sixth-char {
            background-position: 60% center !important;
          }
          
          .seventh-char {
            background-position: 60% center !important;
          }
          
          .eighth-char {
            background-position: 60% center !important;
          }
          
          .quote-text {
            font-size: 2rem;
            width: 70%;
          }
          
          .bio-text {
            font-size: 1rem;
            width: 60%;
          }
        }
        
        @media (max-width: 480px) {
          .giant-text {
            font-size: 90vw;
          }
          
          .first-char {
            font-size: 40vw;
          }
          
          .vertical-text {
            writing-mode: vertical-lr;
            text-orientation: upright;
            letter-spacing: -1.5rem;
            font-size: 60vw;
            line-height: 0.8;
          }
          
          .second-text {
            writing-mode: vertical-lr;
            text-orientation: upright;
            letter-spacing: -1rem;
            font-size: 60vw;
            line-height: 0.8;
          }
          
          .third-text {
            writing-mode: vertical-lr;
            text-orientation: upright;
            letter-spacing: -1rem;
            font-size: 60vw;
            line-height: 0.8;
          }
          
          .fourth-text {
            writing-mode: vertical-lr;
            text-orientation: upright;
            letter-spacing: -1rem;
            font-size: 60vw;
            line-height: 0.8;
          }
          
          .fifth-text {
            writing-mode: vertical-lr;
            text-orientation: upright;
            letter-spacing: -1rem;
            font-size: 60vw;
            line-height: 0.8;
          }
          
          .sixth-text {
            writing-mode: vertical-lr;
            text-orientation: upright;
            letter-spacing: -1rem;
            font-size: 50vw; /* 약간 작게 설정 (긴 텍스트) */
            line-height: 0.8;
          }
          
          .seventh-text {
            writing-mode: vertical-lr;
            text-orientation: upright;
            letter-spacing: -1rem;
            font-size: 60vw;
            line-height: 0.8;
          }
          
          .eighth-text {
            writing-mode: vertical-lr;
            text-orientation: upright;
            letter-spacing: -1rem;
            font-size: 60vw;
            line-height: 0.8;
          }
          
          /* 모바일에서의 배경 이미지 위치 조정 */
          .special-overlay {
            background-position: 60% center !important;
          }
          
          .skyblue-overlay {
            background-position: 60% center !important;
          }
          
          .red-overlay {
            background-position: 60% center !important;
          }
          
          .yellow-overlay {
            background-position: 60% center !important;
          }
          
          .purple-overlay {
            background-position: 60% center !important;
          }
          
          .navy-overlay {
            background-position: 60% center !important;
            padding-top: 5% !important;
          }
          
          .black-overlay {
            background-position: 60% center !important;
          }
          
          .giant-text {
            background-position: 60% center !important;
          }
          
          .second-char {
            background-position: 60% center !important;
          }
          
          .third-char {
            background-position: 60% center !important;
          }
          
          .fourth-char {
            background-position: 60% center !important;
          }
          
          .fifth-char {
            background-position: 60% center !important;
          }
          
          .sixth-char {
            background-position: 60% center !important;
          }
          
          .seventh-char {
            background-position: 60% center !important;
          }
          
          .eighth-char {
            background-position: 60% center !important;
          }
          
          .n-layout {
            justify-content: flex-start;
            padding-top: 25%;
          }
          
          /* 여섯 번째 슬라이드(정의당) 텍스트 위치 조정 */
          .navy-overlay .n-layout {
            padding-top: 15%;
            margin-top: -8% !important;
          }
          
          /* 모바일에서 여섯 번째 슬라이드 텍스트 줄이기 */
          .navy-overlay .bio-text {
            font-size: 0.95rem;
            max-height: 50vh;
            overflow-y: auto;
          }
          
          .quote-text {
            font-size: 2rem;
            width: 85%;
            line-height: 1.3;
          }
          
          .bio-text-container {
            padding-right: 15%;
            justify-content: flex-start;
            padding-left: 10%;
            margin-top: 1.5rem;
          }
          
          .bio-text {
            font-size: 1.1rem;
            width: 80%;
            text-align: left;
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
          color: white !important; /* 100% 흰색 텍스트 */
          mix-blend-mode: difference;
          text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
        }
        
        .white-pure-text {
          color: white !important; /* 100% 흰색 텍스트 */
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
          color: white !important; /* 100% 흰색 텍스트 */
          position: relative;
          z-index: 5; /* 검은색 텍스트보다 낮은 z-index */
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

        .image-background {
          background-image: url(/images/about13.jpg);
          background-size: cover;
          background-position: center center;
          position: relative;
        }

        .white-overlay-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(255, 255, 255, 0.4);
          z-index: 2;
        }

        .white-simple-overlay {
          background-color: rgba(255, 255, 255, 0.7);
          background-image: url(/images/about13.jpg);
          background-blend-mode: normal;
          background-size: cover;
          background-position: center center;
        }
      `}</style>
    </div>
  );
} 