'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Schedule } from '../app/page';

// 정적 데이터와 동적 데이터를 처리하기 위한 클라이언트 컴포넌트
interface HomeClientProps {
  schedules: Schedule[];
}

export default function HomeClient({ schedules }: HomeClientProps) {
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [viewportHeight, setViewportHeight] = useState(1000); // 기본값으로 1000px 설정
  const statementRefs = useRef<(HTMLElement | null)[]>([]);
  const overlayRef = useRef<HTMLDivElement>(null);
  const overlayImageRef = useRef<HTMLImageElement>(null);
  const circleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const heroTextRef = useRef<HTMLHeadingElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);

  // 클라이언트 측에서만 실행되는 초기화 로직
  useEffect(() => {
    // 뷰포트 높이 설정
    setViewportHeight(window.innerHeight);
    
    // 히어로 섹션 초기 위치 설정
    if (heroSectionRef.current) {
      heroSectionRef.current.style.transform = `translateY(${window.innerHeight}px)`;
    }
    
    // 초기 로딩 애니메이션 효과 (로딩 시간 단축)
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
  }, []);

  // 스크롤 이벤트 핸들러
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // 회색 오버레이와 배경 이미지 스크롤에 따라 투명해지는 효과
      if (overlayRef.current) {
        // 투명도 계산식 수정 - 더 빠르게 사라지도록 수정
        // 원래: const opacity = Math.max(0, 1 - window.scrollY / window.innerHeight);
        const opacity = Math.max(0, 1 - (window.scrollY / window.innerHeight) * 1.8);
        overlayRef.current.style.opacity = opacity.toString();
        if (opacity === 0) {
          overlayRef.current.style.pointerEvents = 'none';
        } else {
          overlayRef.current.style.pointerEvents = 'all';
        }
        
        // 이미지가 스케일업 되면서 사라지는 효과
        if (overlayImageRef.current) {
          // 이미지는 더 빠르게 페이드아웃
          const imageOpacity = Math.max(0, 1 - (window.scrollY / window.innerHeight) * 2.2);
          overlayImageRef.current.style.opacity = imageOpacity.toString();
          // 스크롤에 따라 약간씩 확대되는 효과 (1.0 ~ 1.3)
          const scale = 1 + ((1 - imageOpacity) * 0.3);
          overlayImageRef.current.style.transform = `scale(${scale})`;
        }
        
        // 히어로 섹션 표시 설정 - 완전히 화면 아래에서 올라오게 함
        if (heroSectionRef.current) {
          // 오버레이가 더 사라진 시점(90%)부터 히어로 섹션이 올라오기 시작하도록 조정
          const heroProgress = Math.max(0, Math.min(1, (1 - opacity - 0.1) * 1.2));
          
          // 스크롤 위치에 따른 특별한 위치 계산
          let translateY;
          
          // 오버레이가 완전히 사라질 때까지(opacity가 0이 될 때까지) 상단 20% 위치에 고정
          if (opacity > 0) {
            // 초기 진행 단계에서만 움직임 (heroProgress가 0.3 이하)
            if (heroProgress <= 0.3) {
              // 초기 진행 - 화면 아래에서 상단 20% 지점으로 올라옴
              translateY = viewportHeight * (1 - (heroProgress / 0.3) * 0.8);
            } else {
              // 중간 진행 - 상단 20% 위치에 고정
              translateY = viewportHeight * 0.2;
            }
          } else {
            // 오버레이가 완전히 사라진 후
            // 원 애니메이션 섹션까지 스크롤 할 때까지 히어로 섹션 유지
            const bigMessageSection = document.querySelector('.big-message');
            if (bigMessageSection) {
              const bigMessageTop = bigMessageSection.getBoundingClientRect().top;
              
              // 원 애니메이션 섹션이 화면 상단에 도달할 때까지 히어로 섹션 유지
              if (bigMessageTop > 0) {
                translateY = viewportHeight * 0.2 * (1 - (Math.min(1, window.scrollY / (window.innerHeight * 1.2))));
              } else {
                // 원 애니메이션 섹션이 화면 상단에 도달하면 히어로 섹션 서서히 사라짐
                const fadeOutProgress = Math.min(1, Math.abs(bigMessageTop) / (viewportHeight * 0.3));
                heroSectionRef.current.style.opacity = Math.max(0, 1 - fadeOutProgress).toString();
                translateY = viewportHeight * 0.2 * (1 - (Math.min(1, window.scrollY / (window.innerHeight * 1.2))));
              }
            } else {
              // 기존 동작 유지
              const scrollRatio = Math.min(1, window.scrollY / (window.innerHeight * 1.5));
              translateY = viewportHeight * 0.2 * (1 - scrollRatio);
            }
          }
          
          // 투명도도 같이 조절 (원 애니메이션 영역에 도달하기 전까지는 완전 불투명 유지)
          const bigMessageElement = document.querySelector('.big-message');
          if (bigMessageElement && bigMessageElement.getBoundingClientRect().top > 0) {
            heroSectionRef.current.style.opacity = '1';
          }
          
          heroSectionRef.current.style.transform = `translateY(${translateY}px)`;
        }
        
        // 큰 메시지 섹션도 히어로 섹션과 함께 자연스럽게 등장하도록 조정
        const bigMessageSection = document.querySelector('.big-message');
        if (bigMessageSection) {
          // 히어로 섹션보다 훨씬 늦게 시작하도록 조정
          // 계수를 1.5에서 0.8로 줄여서 더 천천히 진행되도록 함
          const messageProgress = Math.max(0, Math.min(1, (1 - opacity - 0.25) * 0.8));
          const translateY = 120 * (1 - messageProgress);
          
          (bigMessageSection as HTMLElement).style.opacity = messageProgress.toString();
          (bigMessageSection as HTMLElement).style.transform = `translateY(${translateY}px)`;
        }
      }
      
      // 부제목 텍스트는 더 오래 유지되도록 다른 속도로 변경
      const subtitleEl = document.querySelector('.subtitle');
      if (subtitleEl) {
        // 스크롤 양에 따라 불투명도 설정 (더 천천히 사라지도록)
        const subtitleOpacity = Math.max(0, 1 - window.scrollY / (window.innerHeight * 3.5));
        (subtitleEl as HTMLElement).style.opacity = subtitleOpacity.toString();
        
        // Y축 이동도 천천히 하도록 조정 (큰 메시지 섹션까지 내려오도록)
        const bigMessageTop = document.querySelector('.big-message')?.getBoundingClientRect().top;
        // 이동 속도를 줄임
        const targetY = bigMessageTop && bigMessageTop > 0 ? 
          Math.min(scrollY * 0.3, bigMessageTop - viewportHeight * 0.4) : scrollY * 0.3;
        
        (subtitleEl as HTMLElement).style.transform = `translateY(${targetY}px)`;
      }
      
      // 히어로 텍스트 패럴랙스 효과
      if (heroTextRef.current) {
        // 기존 코드는 유지하되, 이미 transform이 적용되어 있으므로 주의
        const baseTransform = heroTextRef.current.style.transform || '';
        if (!baseTransform.includes('translateY')) {
          heroTextRef.current.style.transform = `translateY(${scrollY * 0.02}px)`;
        }
      }
      
      // 원형 배경 요소 패럴랙스 효과
      circleRefs.current.forEach((circle, index) => {
        if (circle) {
          const speed = index % 2 === 0 ? -0.05 : 0.08;
          const rotation = scrollY * 0.02 * (index % 2 === 0 ? 1 : -1);
          circle.style.transform = `translateY(${scrollY * speed}px) rotate(${rotation}deg)`;
        }
      });

      // 요소들 가시성 체크
      document.querySelectorAll('.scroll-reveal').forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
          el.classList.add('visible');

          // 동영상 섹션일 경우 추가 애니메이션 효과
          if (el.classList.contains('video-section')) {
            const videoContainer = el.querySelector('.video-container');
            if (videoContainer && window.scrollY > 0) {
              const scrollProgress = Math.min(1, (window.innerHeight * 0.7 - rect.top) / (window.innerHeight * 0.5));
              if (scrollProgress > 0) {
                (videoContainer as HTMLElement).style.opacity = Math.min(1, scrollProgress).toString();
                (videoContainer as HTMLElement).style.transform = `scale(${0.95 + (scrollProgress * 0.05)})`;
              }
            }
          }
        }
      });
    };
    
    // 마우스 움직임 이벤트 핸들러
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // 하이라이트 텍스트 효과
      document.querySelectorAll('.highlight p').forEach((el) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // 마우스와 요소 중앙 사이의 거리 계산
        const distanceX = (e.clientX - centerX) / 40;
        const distanceY = (e.clientY - centerY) / 40;
        
        // 요소에 그림자 효과 변경
        (el as HTMLElement).style.textShadow = `
          ${distanceX * -1}px ${distanceY * -1}px 3px rgba(255, 0, 0, 0.3),
          ${distanceX}px ${distanceY}px 3px rgba(0, 163, 102, 0.3)
        `;
      });
      
      // 배경 원 요소 움직임
      circleRefs.current.forEach((circle, index) => {
        if (circle) {
          const speed = (index + 1) * 0.01;
          const moveX = (e.clientX - window.innerWidth / 2) * speed;
          const moveY = (e.clientY - window.innerHeight / 2) * speed;
          
          // 이미 적용된 패럴랙스 스크롤 효과와 함께 적용
          const currentTransform = circle.style.transform;
          const baseTransform = currentTransform.includes('translateY') 
            ? currentTransform.replace(/translateX\([^)]*\)/g, '') 
            : currentTransform;
          
          // moveY 변수도 활용하여 Y축 움직임 추가
          circle.style.transform = `${baseTransform} translateX(${moveX}px) translateY(${moveY}px)`;
        }
      });
      
      // 오버레이 이미지도 마우스 움직임에 약간 반응
      if (overlayImageRef.current && overlayRef.current?.style.opacity !== '0') {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.02;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.02;
        overlayImageRef.current.style.transform = `scale(1) translate(${moveX}px, ${moveY}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    // 초기 호출로 첫 로드 시 효과 적용
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [scrollY, viewportHeight]);
 
  // 단어 분리 함수 (강조 효과용)
  const splitWords = (text: string) => {
    return text.split(' ').map((word, i) => (
      <span key={i} className="word">
        {word}{' '}
      </span>
    ));
  };

  return (
    <div className="manifesto-page" style={{ backgroundColor: '#fff' }}>
      {/* 회색 오버레이 (스크롤에 따라 사라짐) */}
      <div 
        ref={overlayRef}
        className="gray-overlay" 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          zIndex: 100,
          transition: 'opacity 0.5s ease',
          pointerEvents: 'all',
          overflow: 'hidden'
        }}
      >
        {/* 오버레이 내부에 배경 이미지 추가 */}
        <Image 
          ref={overlayImageRef as any}
          src="/images/6.png" 
          alt="권영국 후보" 
          className="overlay-image"
          fill
          style={{
            position: 'absolute',
            objectFit: 'cover',
            objectPosition: 'center',
            transition: 'transform 0.5s ease, opacity 0.5s ease',
            opacity: 1,
            transformOrigin: 'center center'
          }}
        />
        
        {/* 오버레이 내부 텍스트 내용 */}
        <div className="overlay-content">
          <div className="container h-100" style={{ position: 'relative' }}>
            <div className="text-content" style={{ position: 'absolute', top: '75%', left: '0', right: '0', transform: 'translateY(-50%)', textAlign: 'center' }}>
              <h2 className="overlay-title">
                <span className="first-part">정권교체를 넘어 </span>
                <span className="second-part">사회대개혁으로</span>
              </h2>
              <p className="overlay-subtitle">불평등을 넘어 함께 사는 사회로!</p>
              <p className="overlay-scroll-hint">아래로 스크롤하여 더 알아보세요</p>
            </div>
          </div>
        </div>
      </div>

      {/* 배경 요소들 */}
      <div className="background-elements">
        <div className="circle-bg circle1" ref={el => { circleRefs.current[0] = el; }}></div>
        <div className="circle-bg circle2" ref={el => { circleRefs.current[1] = el; }}></div>
        <div className="circle-bg circle3" ref={el => { circleRefs.current[2] = el; }}></div>
      </div>

      {/* 히어로 섹션 */}
      <section 
        ref={heroSectionRef}
        className="hero-section" 
        style={{ 
          opacity: 0, 
          transform: 'translateY(1000px)',
          transition: 'opacity 8s cubic-bezier(0.16, 1, 0.3, 1), transform 10s cubic-bezier(0.34, 1.56, 0.64, 1)',
          paddingBottom: '5vh' // 아래 여백 줄여서 다음 섹션과 가까워지게
        }}
      >
        <div className={`hero-content ${isLoaded ? 'loaded' : ''}`} style={{ position: 'relative', zIndex: 10 }}>
          <h1 ref={heroTextRef} className="interactive-text">권영국</h1>
          <p className="subtitle">
            <span className="org-name">사회대전환 연대회의</span>
            <span className="candidate-title">대통령 후보</span>
          </p>
        </div>
      </section>

      {/* 큰 메시지 섹션 */}
      <section className="big-message" style={{
        opacity: 0,
        transform: 'translateY(100px)',
        transition: 'opacity 6s cubic-bezier(0.16, 1, 0.3, 1), transform 6s cubic-bezier(0.16, 1, 0.3, 1)',
        paddingTop: '5vh', // 위 여백 줄여서 이전 섹션과 가까워지게
        position: 'relative',
        zIndex: 2,
        height: '100vh', // 높이 확보
        backgroundColor: 'rgba(245, 245, 245, 0.3)',
        backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.5), rgba(245,245,245,0.6))',
        overflow: 'hidden'
      }}>
        {/* 부유하는 원 애니메이션 추가 */}
        <div className="floating-circles" style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%',
          zIndex: 1,
          pointerEvents: 'none'
        }}>
          {/* 빨간색 원들 */}
          <div className="floating-circle circle-red circle-small" style={{ left: '10%', animationDelay: '0s', animationDuration: '8s' }}></div>
          <div className="floating-circle circle-red circle-medium" style={{ left: '25%', animationDelay: '2s', animationDuration: '6s' }}></div>
          <div className="floating-circle circle-red circle-large" style={{ left: '65%', animationDelay: '1s', animationDuration: '10s' }}></div>
          <div className="floating-circle circle-red circle-small" style={{ left: '85%', animationDelay: '0.5s', animationDuration: '7s' }}></div>
          <div className="floating-circle circle-red circle-medium" style={{ left: '45%', animationDelay: '3.5s', animationDuration: '9s' }}></div>
          <div className="floating-circle circle-red circle-large" style={{ left: '15%', animationDelay: '4s', animationDuration: '11s' }}></div>
          
          {/* 노란색 원들 */}
          <div className="floating-circle circle-yellow circle-medium" style={{ left: '30%', animationDelay: '1.2s', animationDuration: '7s' }}></div>
          <div className="floating-circle circle-yellow circle-small" style={{ left: '70%', animationDelay: '0.7s', animationDuration: '6s' }}></div>
          <div className="floating-circle circle-yellow circle-large" style={{ left: '50%', animationDelay: '1.8s', animationDuration: '9s' }}></div>
          <div className="floating-circle circle-yellow circle-medium" style={{ left: '48%', animationDelay: '2.7s', animationDuration: '8s' }}></div>
          <div className="floating-circle circle-yellow circle-small" style={{ left: '90%', animationDelay: '3.2s', animationDuration: '6.5s' }}></div>
          <div className="floating-circle circle-yellow circle-large" style={{ left: '20%', animationDelay: '2.3s', animationDuration: '10s' }}></div>
          
          {/* 초록색 원들 */}
          <div className="floating-circle circle-green circle-large" style={{ left: '40%', animationDelay: '0.5s', animationDuration: '9s' }}></div>
          <div className="floating-circle circle-green circle-medium" style={{ left: '80%', animationDelay: '1.5s', animationDuration: '7s' }}></div>
          <div className="floating-circle circle-green circle-small" style={{ left: '55%', animationDelay: '0.3s', animationDuration: '6.5s' }}></div>
          <div className="floating-circle circle-green circle-small" style={{ left: '5%', animationDelay: '1.1s', animationDuration: '6s' }}></div>
          <div className="floating-circle circle-green circle-medium" style={{ left: '75%', animationDelay: '2.5s', animationDuration: '7.5s' }}></div>
          <div className="floating-circle circle-green circle-large" style={{ left: '35%', animationDelay: '3.8s', animationDuration: '10.5s' }}></div>
        </div>
        
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <p className="big-text scroll-reveal">
            {splitWords('사회대전환을 꿈꾸는 모든 시민들의 염원을 담아')}
          </p>
          <p className="big-text-right scroll-reveal">
            {splitWords('21대 대통령 선거에 출마합니다.')}
          </p>
        </div>
      </section>

      {/* 동영상 섹션 - 단순화된 버전 */}
      <section className="video-section" 
        style={{
          position: 'relative',
          padding: '10vh 0',
          backgroundColor: '#f5f5f5',
        }}
        ref={(sectionRef) => {
          if (sectionRef) {
            // Intersection Observer 추가
            const observer = new IntersectionObserver((entries) => {
              entries.forEach(entry => {
                if (entry.isIntersecting) {
                  // 섹션이 뷰포트에 들어오면 동영상 재생
                  const video = sectionRef.querySelector('video');
                  if (video) {
                    video.play().catch(err => console.log('자동재생 실패:', err));
                  }
                } else {
                  // 섹션이 뷰포트에서 벗어나면 동영상 일시 정지
                  const video = sectionRef.querySelector('video');
                  if (video) {
                    video.pause();
                  }
                }
              });
            }, { threshold: 0.3 });
            
            observer.observe(sectionRef);
            
            // 컴포넌트 언마운트 시 이벤트 정리를 위한 클린업 추가
            return () => {
              observer.unobserve(sectionRef);
            };
          }
        }}
      >
        <div className="container">
          <div style={{ 
            position: 'relative',
            width: '100%', 
            height: '0', 
            paddingBottom: '56.25%', 
            overflow: 'hidden',
            borderRadius: '12px 12px 0 0',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
            backgroundColor: '#000',
          }}>
            <video 
              muted
              playsInline
              controls
              preload="metadata"
              width="100%" 
              height="100%"
              poster="/images/6.png"
              style={{ 
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
              }}
            >
              <source src="/videos/60mins.mp4#t=0.1" type="video/mp4" />
              브라우저가 동영상을 지원하지 않습니다.
            </video>
          </div>
          
          <div style={{
            padding: '1.5rem',
            backgroundColor: 'white',
            borderRadius: '0 0 12px 12px',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
          }}>
            <h3 style={{ 
              fontSize: '1.5rem', 
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#0b365f'
            }}>KBS 추적60분 [1409회] 경선 밀착 취재, 대선 주자들을 만나다</h3>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              borderTop: '1px solid #eee',
              paddingTop: '1rem',
              color: '#888',
              fontSize: '0.9rem'
            }}>
              <span style={{ marginRight: '1.5rem', display: 'flex', alignItems: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '0.5rem' }}>
                  <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                  <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
                </svg>
                방송일: 2025년 5월 2일
              </span>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '0.5rem' }}>
                  <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383-4.708 2.825L15 11.105V5.383zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741zM1 11.105l4.708-2.897L1 5.383v5.722z"/>
                </svg>
                출처: KBS
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 새로운 Call to Action 섹션 - 이미지 참조 */}
      <section>
        <div>
          <div className="cta-banner">
            <h2 className="cta-description">간절히 기다렸던 윤석열 파면 이후 많은 시민들은 소중한 일상으로 되돌아갔습니다. 그러나 저는 그럴 수 없었습니다.</h2>
            
            <p className="cta-highlight">
            돌아가야 할 일상이 <span className="red-highlight">계엄</span>과 다름없는 시민들이 여전히<span className="black-box">광장에, 고공에, 거리에</span> 남아있음을 알기에
            </p>
            
            <div className="cta-highlight-container">
              <div className="cta-description">
                <p>정권교체를 향한 민심은 이미 압도적입니다. 그러나 <span className="black-box">정권교체만으로는 부족합니다.</span></p>
                <p>이번에야말로 정권교체와 함께 <span style={{whiteSpace: "nowrap"}}><span className="red-box">사회</span><span className="yellow-box">대</span><span className="green-box">전환</span></span>, 그리고 정치개혁을 반드시 이뤄내야 합니다.</p>
                <p>사회분열의 원인인 불평등과 차별을 해소해야 합니다. 탄핵세력의 부활과 내란세력 존속의 근원인 낡은 기득권 정치를 깨끗이 해체해야 합니다. 그래야 다시는 윤석열 같은 헌정파괴세력이 대한민국 정치를 함부로 넘볼 수 없게 될 것입니다. 그렇게 양극단 진영정치로 갈라진 대한민국을 광장을 닮은 <span className="red-box">다</span><span className="yellow-box">양</span><span className="green-box">성</span>의 정치로 치유하고 통합해야 합니다. 이것이 바로 우리가 꿈꾸는 진정한 정치교체이자 <span className="red-highlight">내란청산</span>입니다. </p>
                </div>
            </div>
            <div className="cta-highlight-container">
               <h2 className="shaking-text">진보는 사회의 방향을 바꾸는 것입니다.</h2>
               
               <div className="text-with-image">
                 <div className="progressive-text">
                   싸우는 노동자가 이를 악물고 고공에 오르는 세상을 바꾸어
                   모든 고공농성 노동자가 땅으로 내려올 수 있게 하는 것이 진보입니다.
                   여성이 여성이라는 이유로 다치고 죽어가는 세상을 바꾸어
                   모든 여성이 안전하게 살아갈 수 있게 하는 것이 진보입니다.
                   성소수자, 장애인, 이주민을 차별하고 억압하는 세상을 바꾸어
                   모든 사회적 소수자가 존재하는 그대로 존중받게 하는 것이 진보입니다.
                   말로는 기후위기를 이야기하지만
                   화석연료 중독을 끊어내지 못하는 세상을 바꾸어
                   지구온도 상승을 기어코 멈추어내는 것이 진보입니다.
                 </div>
                 <div className="updown-image">
                   <Image
                     src="/images/updown.png"
                     alt="거꾸로 선 사람"
                     width={200}
                     height={370}
                     style={{ objectFit: "contain" }}
                   />
                 </div>
               </div>
              </div>
            </div>
            <div className="cta-highlight-container">
              <div className="cta-highlight-80">
                <h2 className="cta-highlight">우리가 지켜야 할 시민들의 <span className="yellow-box">삶</span>이 있습니다. 우리가 마주하고 싶은 변화된 세상을 향한 <span className="green-box">꿈</span>이 있습니다.</h2>
              </div>
            </div>
            <div className="dream-text cta-highlight-80">
              <p>그 꿈이 이루질 때까지는 언제나 불가능해 보입니다. 그러나 꿈을 꾸는 자에게만 그 꿈이 현실이 될 것입니다.</p>
            </div>
          </div>
        </section>

      {/* 마우스 커서 효과 */}
      <div 
        className="cursor-effect"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
        }}
      ></div>

            {/* 최종 CTA 섹션 */}
            <section className="cta-section">
        <div className="container">
          <h2 className="scroll-reveal interactive-text">권영국과 함께<br />꿈을 현실로 만들어 갑시다</h2>
        </div>
        
        {/* 애니메이션 원 */}
        <div className="animated-circles">
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
          <div className="circle circle-3"></div>
        </div>
      </section>

      {/* CSS 스타일 */}
      <style jsx>{`
        /* 기본 스타일 */
        .manifesto-page {
          color: #333;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          overflow-x: hidden;
          position: relative;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          position: relative;
        }
        
        /* 배경 요소 */
        .background-elements {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          overflow: hidden;
        }
        
        .circle-bg {
          position: absolute;
          border-radius: 50%;
          opacity: 0.07;
          transition: transform 0.3s ease;
        }
        
        .circle1 {
          width: 70vw;
          height: 70vw;
          background: linear-gradient(to right, #FF0000, #FFed00);
          top: -20vw;
          right: -20vw;
        }
        
        .circle2 {
          width: 50vw;
          height: 50vw;
          background: linear-gradient(to right, #FFed00, #00a366);
          bottom: -20vw;
          left: -10vw;
        }
        
        .circle3 {
          width: 30vw;
          height: 30vw;
          background: linear-gradient(to right, #00a366, #FF0000);
          top: 50%;
          left: 60%;
        }
        
        /* 마우스 커서 효과 */
        .cursor-effect {
          position: fixed;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,0,0,0.3) 0%, rgba(0,163,102,0.3) 100%);
          transform: translate(-50%, -50%);
          pointer-events: none;
          mix-blend-mode: difference;
          z-index: 9999;
          opacity: 0.6;
          transition: width 0.2s, height 0.2s;
        }
        
        /* 히어로 섹션 */
        .hero-section {
          height: 80vh; /* 높이를 줄여서 다음 섹션과 더 붙게 함 (원래 100vh) */
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 0 20px;
          position: relative;
          overflow: hidden;
        }
        
        .hero-content {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 4s ease, transform 4s ease;
        }
        
        .hero-content.loaded {
          opacity: 1;
          transform: translateY(0);
        }
        
        .interactive-text {
          font-size: 7rem;
          font-weight: 700;
          margin-bottom: 1rem;
          letter-spacing: -0.02em;
          color: #0b365f;
          position: relative;
          display: inline-block;
          transition: transform 2.5s cubic-bezier(0.23, 1, 0.32, 1);
          animation: slowAppear 10s ease forwards;
          opacity: 0;
        }
        
        @keyframes slowAppear {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          40% {
            opacity: 0.3;
            transform: translateY(20px);
          }
          70% {
            opacity: 0.7;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .hero-content.loaded .interactive-text {
          animation-play-state: running;
        }

        .hero-content.loaded .subtitle {
          transition-delay: 1.5s;
        }
        
        .interactive-text::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 5px;
          background: linear-gradient(90deg, #FF0000, #FFed00, #00a366);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 4s cubic-bezier(0.23, 1, 0.32, 1);
        }
        
        .loaded .interactive-text::after {
          transform: scaleX(1);
          transition-delay: 3s;
        }
        
        .subtitle {
          font-size: 2.5rem;
          margin-bottom: 2rem;
          color: #0b365f;
          position: relative;
          display: inline-block;
          font-weight: 600;
          background: linear-gradient(90deg, #FF0000, #FFed00, #00a366);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: 0 1px 0 rgba(255,255,255,0.4);
          transition: transform 0.5s ease, opacity 0.5s ease;
          z-index: 10;
        }
        
        .subtitle::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          width: 100px;
          height: 3px;
          background: linear-gradient(90deg, #FF0000, #FFed00, #00a366);
          transform: translateX(-50%) scaleX(0);
          transition: transform 0.8s ease 0.3s;
        }
        
        .loaded .subtitle::after {
          transform: translateX(-50%) scaleX(1);
        }
        
        /* 부제목 깜빡이는 효과 추가 */
        @keyframes subtle-glow {
          0%, 100% {
            text-shadow: 0 0 5px rgba(255, 237, 0, 0.3);
          }
          50% {
            text-shadow: 0 0 15px rgba(255, 237, 0, 0.6), 0 0 20px rgba(255, 0, 0, 0.3);
          }
        }
        
        .subtitle {
          animation: subtle-glow 3s infinite ease-in-out;
        }
        
        /* 스크롤 가이드 */
        .scroll-guide {
          margin-top: 5rem;
          animation: fadeIn 1s ease 1.5s both;
        }
        
        .mouse {
          width: 26px;
          height: 42px;
          border: 2px solid #333;
          border-radius: 14px;
          position: relative;
          margin: 0 auto;
        }
        
        .wheel {
          width: 4px;
          height: 8px;
          background-color: #333;
          position: absolute;
          top: 6px;
          left: 50%;
          transform: translateX(-50%);
          border-radius: 2px;
          animation: scrollWheel 1.5s infinite;
        }
        
        @keyframes scrollWheel {
          0% {
            transform: translate(-50%, 0);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, 15px);
            opacity: 0;
          }
        }
        
        /* 큰 메시지 섹션 */
        .big-message {
          padding: 5vh 0; /* 패딩 줄임 (원래 15vh) */
          position: relative;
        }
        
        .big-text {
          font-size: 4.5rem;
          font-weight: 700;
          line-height: 1.3;
          margin-bottom: 5vh;
          word-break: keep-all;
          color: #0b365f;
          max-width: 70%;
          text-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        
        .big-text-right {
          font-size: 4.5rem;
          font-weight: 700;
          line-height: 1.3;
          margin-bottom: 5vh;
          word-break: keep-all;
          color: #0b365f;
          max-width: 70%;
          margin-left: auto;
          text-align: right;
          text-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        
        .word {
          display: inline-block;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 1.5s ease, transform 1.5s ease;
          transition-delay: calc(0.2s * var(--word-index, 0));
        }
        
        .scroll-reveal.visible .word {
          opacity: 1;
          transform: translateY(0);
        }
        
        .big-text .word:nth-child(odd) {
          color: #FF0000;
        }
        
        .big-text-right .word:nth-child(even) {
          color: #00a366;
        }
        
        /* 선언문 섹션 */
        .statement-section {
          padding: 10vh 0;
          position: relative;
        }
        
        .statement-content {
          max-width: 70%;
          margin-bottom: 2rem;
          position: relative;
          opacity: 0;
          transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.23, 1, 0.32, 1);
        }
        
        .statement-section.right .statement-content {
          margin-left: auto;
          text-align: right;
        }
        
        .statement-content p {
          font-size: 2.3rem;
          line-height: 1.5;
          font-weight: 500;
          word-break: keep-all;
          color: #333;
          position: relative;
          z-index: 1;
          transition: text-shadow 0.3s ease;
        }
        
        .statement-content.highlight p {
          font-weight: 700;
          color: #0b365f;
          font-size: 2.5rem;
        }
        
        .statement-content.visible {
          opacity: 1;
          transform: translateY(0) !important;
        }
        
        .highlight-bar {
          position: absolute;
          height: 8px;
          bottom: -10px;
          background: linear-gradient(90deg, #FF0000, #FFed00, #00a366);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.8s ease 0.2s;
        }
        
        .statement-content.visible .highlight-bar {
          transform: scaleX(1);
        }
        
        /* CTA 섹션 */
        .cta-section {
          padding: 15vh 0;
          text-align: center;
          background: linear-gradient(45deg, #FF0000, #FFed00, #00a366);
          margin-top: 10vh;
          position: relative;
          overflow: hidden;
        }
        
        .cta-section h2 {
          font-size: 3.5rem;
          font-weight: 700;
          color: white;
          margin-bottom: 3rem;
          line-height: 1.2;
          position: relative;
          z-index: 1;
        }
        
        .cta-button a {
          display: inline-block;
          font-size: 1.5rem;
          font-weight: 700;
          padding: 1rem 3rem;
          background-color: white;
          color: #333;
          text-decoration: none;
          border-radius: 50px;
          transition: transform 0.3s ease, box-shadow 0.3s ease, color 0.3s ease;
          position: relative;
          z-index: 1;
          overflow: hidden;
        }
        
        .btn-hover-effect {
          position: relative;
        }
        
        .btn-hover-effect::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, #FF0000, #FFed00, #00a366);
          z-index: -1;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }
        
        .btn-hover-effect:hover {
          color: white;
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }
        
        .btn-hover-effect:hover::before {
          transform: scaleX(1);
        }
        
        /* 애니메이션 원 */
        .animated-circles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        
        .circle {
          position: absolute;
          border-radius: 50%;
          opacity: 0.15;
          animation: pulse 8s infinite alternate ease-in-out;
        }
        
        .circle-1 {
          width: 200px;
          height: 200px;
          background-color: white;
          bottom: -50px;
          left: 10%;
          animation-duration: 12s;
        }
        
        .circle-2 {
          width: 150px;
          height: 150px;
          background-color: white;
          top: 30%;
          right: 5%;
          animation-duration: 10s;
          animation-delay: 2s;
        }
        
        .circle-3 {
          width: 100px;
          height: 100px;
          background-color: white;
          top: 20%;
          left: 30%;
          animation-duration: 8s;
          animation-delay: 1s;
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1) translate(0, 0);
          }
          50% {
            transform: scale(1.5) translate(20px, -20px);
          }
          100% {
            transform: scale(1) translate(0, 0);
          }
        }
        
        /* 스크롤 애니메이션 */
        .scroll-reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .scroll-reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        /* 반응형 스타일 */
        @media (max-width: 768px) {
          .interactive-text {
            font-size: 5rem;
          }
          
          .big-text, .big-text-right {
            font-size: 2.5rem;
            max-width: 100%;
          }
          
          .statement-content {
            max-width: 100%;
          }
          
          .statement-content p {
            font-size: 1.8rem;
          }
          
          .statement-content.highlight p {
            font-size: 2rem;
          }
          
          .cta-section h2 {
            font-size: 2.5rem;
          }
          
          .cursor-effect {
            display: none;
          }
          
          .container .overlay-title {
            font-size: 2.5rem;
          }
          
          .container .overlay-title .first-part,
          .container .overlay-title .second-part {
            display: block;
          }
          
          .container .overlay-subtitle {
            font-size: 1.3rem;
            white-space: nowrap;
          }
          
          /* 모바일에서 히어로 콘텐츠 레이아웃 변경 */
          .hero-content {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            text-align: left;
            width: 100%;
            gap: 15px;
          }
          
          .hero-content .interactive-text {
            font-size: 3.5rem;
            margin-bottom: 0;
            line-height: 1;
            text-align: right;
            flex: 0 0 auto;
          }
          
          .hero-content .subtitle {
            font-size: 1.4rem;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            text-align: left;
            margin-bottom: 0;
            line-height: 1.3;
          }
          
          .hero-content .subtitle .org-name,
          .hero-content .subtitle .candidate-title {
            display: block;
            white-space: nowrap;
          }
          
          /* 모바일에서 동영상 섹션 스타일 */
          .video-section .video-container {
            padding-bottom: 75% !important;
          }
          
          .video-section .video-overlay h3 {
            font-size: 1.5rem !important;
          }
          
          .video-section .video-overlay p {
            font-size: 1rem !important;
          }
          
          .video-section .video-overlay {
            padding: 1rem !important;
          }
        }

        /* 오버레이 콘텐츠 스타일 */
        .overlay-content {
          position: relative;
          height: 100%;
          width: 100%;
          z-index: 2;
          color: white;
        }
        
        .overlay-title {
          font-size: 3.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
        }
        
        .overlay-title .first-part,
        .overlay-title .second-part {
          display: inline;
        }
        
        .overlay-subtitle {
          font-size: 2rem;
          margin-bottom: 2.5rem;
          text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
          white-space: nowrap;
        }
        
        .overlay-scroll-hint {
          font-size: 1rem;
          opacity: 0.8;
          animation: bounce 2s infinite;
          margin-top: 2rem;
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }

        /* 부유하는 원 애니메이션 */
        .floating-circles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 1;
          pointer-events: none;
        }
        
        .floating-circle {
          position: absolute;
          bottom: -100px;
          border-radius: 50%;
          opacity: 0.7;
          animation: floatUp linear infinite;
          animation-duration: 6s; /* 기본값 */
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          filter: blur(0.5px);
        }
        
        .circle-red {
          background: radial-gradient(circle at 30% 30%, rgba(255, 80, 80, 0.95), rgba(255, 0, 0, 0.9));
          box-shadow: 0 2px 15px rgba(255, 0, 0, 0.5);
        }
        
        .circle-yellow {
          background: radial-gradient(circle at 30% 30%, rgba(255, 242, 100, 0.95), rgba(255, 237, 0, 0.9));
          box-shadow: 0 2px 15px rgba(255, 237, 0, 0.5);
        }
        
        .circle-green {
          background: radial-gradient(circle at 30% 30%, rgba(50, 200, 150, 0.95), rgba(0, 163, 102, 0.9));
          box-shadow: 0 2px 15px rgba(0, 163, 102, 0.5);
        }
        
        .circle-small {
          width: 30px;
          height: 30px;
        }
        
        .circle-medium {
          width: 60px;
          height: 60px;
        }
        
        .circle-large {
          width: 90px;
          height: 90px;
        }
        
        @keyframes floatUp {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0.7;
          }
          25% {
            transform: translateY(-25vh) translateX(15px);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-50vh) translateX(-20px);
            opacity: 0.9;
          }
          75% {
            transform: translateY(-75vh) translateX(10px);
            opacity: 0.8;
          }
          100% {
            transform: translateY(-100vh) translateX(-15px);
            opacity: 0.1;
          }
        }

        /* 애니메이션 효과들 */
        .fade-in-up.visible {
          animation: fadeInUp 1.2s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        
        .slide-in-right.visible {
          animation: slideInRight 1.2s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        
        .fade-in-zoom.visible {
          animation: fadeInZoom 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .slide-in-left.visible {
          animation: slideInLeft 1.2s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        
        .rotate-in.visible {
          animation: rotateIn 1.2s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        
        .bounce-in.visible {
          animation: bounceIn 1.2s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        
        .flip-in.visible {
          animation: flipIn 1.2s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        
        .scale-in.visible {
          animation: scaleIn 1.2s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        
        .fade-in-blur.visible {
          animation: fadeInBlur 1.2s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        
        .slide-in-bottom.visible {
          animation: slideInBottom 1.2s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        
        .fade-in.visible {
          animation: fadeIn 1.2s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        
        .slide-in-top.visible {
          animation: slideInTop 1.2s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        
        .glitch-in.visible {
          animation: glitchIn 1.5s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        
        .glow-in.visible {
          animation: glowIn 1.5s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInZoom {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes rotateIn {
          from {
            opacity: 0;
            transform: rotate(-5deg) scale(0.9);
          }
          to {
            opacity: 1;
            transform: rotate(0) scale(1);
          }
        }
        
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
          }
        }
        
        @keyframes flipIn {
          from {
            opacity: 0;
            transform: perspective(400px) rotateX(90deg);
          }
          to {
            opacity: 1;
            transform: perspective(400px) rotateX(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(1.2);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes fadeInBlur {
          from {
            opacity: 0;
            filter: blur(8px);
          }
          to {
            opacity: 1;
            filter: blur(0);
          }
        }
        
        @keyframes slideInBottom {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInTop {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes glitchIn {
          0% {
            opacity: 0;
            transform: translateX(-5px);
            text-shadow: 3px 0 #ff0000;
          }
          20% {
            transform: translateX(5px);
            text-shadow: -3px 0 #00a366;
          }
          40% {
            transform: translateX(-2px);
            text-shadow: 3px 0 #ff0000;
          }
          60% {
            transform: translateX(2px);
            text-shadow: -3px 0 #00a366;
          }
          80% {
            transform: translateX(0);
            text-shadow: 3px 0 #ffed00;
          }
          100% {
            opacity: 1;
            transform: translateX(0);
            text-shadow: none;
          }
        }
        
        @keyframes glowIn {
          0% {
            opacity: 0;
            text-shadow: 0 0 0 rgba(255, 0, 0, 0);
          }
          50% {
            opacity: 0.5;
            text-shadow: 0 0 20px rgba(255, 0, 0, 0.5), 0 0 30px rgba(255, 237, 0, 0.5);
          }
          100% {
            opacity: 1;
            text-shadow: 0 0 10px rgba(255, 0, 0, 0.3), 0 0 15px rgba(255, 237, 0, 0.3);
          }
        }

        /* 새로운 CTA 배너 스타일 */
        .cta-banner-section {
          padding: 8vh 0;
          background-color: #fff;
          margin: 6vh 0;
          position: relative;
        }
        
        .cta-banner {
          border-top: 3px solid #000;
          border-bottom: 3px solid #000;
          padding: 5vh 0;
          position: relative;
        }
        
        .cta-title {
          font-size: 3.8rem;
          font-weight: 700;
          line-height: 1.4;
          margin-bottom: 4vh;
          text-align: left;
        }
        
        .red-box {
          display: inline-block;
          background-color: #ff0000;
          color: white;
          padding: 0.1em 0.2em;
          margin: 0;
          position: relative;
        }

        .yellow-box {
          display: inline-block;
          background-color: #ffed00;
          color: black;
          padding: 0.1em 0.2em;
          margin: 0;
          position: relative;
        }

        .green-box {
          display: inline-block;
          background-color: #00a366;
          color: white;
          padding: 0.1em 0.2em;
          margin: 0;
          position: relative;
        }

        .black-box {
          display: inline-block;
          background-color: #000000;
          color: white;
          padding: 0.1em 0.2em 0.1em 0.1em;
          margin: 0 0.1em;
          position: relative;
        }
        
        .cta-description {
          font-size: 1.4rem;
          line-height: 1.6;
          margin-bottom: 5vh;
          text-align: justify;
          word-break: keep-all;
        }
        
        .cta-highlight-container {
          display: flex;
          justify-content: space-between;
          border-top: 1px solid #000;
          padding-top: 5vh;
          margin-top: 2vh;
          position: relative;
        }
        
        .cta-highlight {
          font-size: 3rem;
          font-weight: 900;
          line-height: 1.2;
          text-align: left;
          max-width: 100%;
        }
        
        .red-highlight {
          color: transparent;
          -webkit-text-stroke: 2px #ff0000;
          background: repeating-linear-gradient(45deg, #ff0000, #ff0000 2px, transparent 2px, transparent 4px);
          background-clip: text;
          -webkit-background-clip: text;
          text-decoration: none;
          padding: 0 0.1em;
        }
        
        .cta-button {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background-color: #ff0000;
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 2rem;
          font-weight: 900;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          box-shadow: 0 4px 10px rgba(255, 0, 0, 0.3);
        }
        
        .cta-button:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 15px rgba(255, 0, 0, 0.4);
        }
        
        @media (max-width: 768px) {
          .cta-title {
            font-size: 3.2rem;
          }
          
          .cta-description {
            font-size: 1.2rem;
            max-width: 100%;
          }
          
          .cta-highlight {
            font-size: 1.8rem;
            max-width: 100%;
          }
          
          .cta-button {
            width: 80px;
            height: 80px;
            font-size: 1.6rem;
          }
        }

        /* 기후 위기 섹션 스타일 */
        .climate-crisis-section-1 {
          padding: 12vh 0 6vh;
          position: relative;
          background-color: white;
        }
        
        .right-now-badge {
          position: absolute;
          top: 20px;
          left: 20px;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background-color: #000;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
          font-weight: 700;
          text-align: center;
          line-height: 1.2;
          transform: rotate(-10deg);
          z-index: 5;
        }
        
        .climate-title {
          font-size: 3.2rem;
          text-align: center;
          font-weight: 700;
          margin-bottom: 5vh;
          color: transparent;
          -webkit-text-stroke: 1px #555;
          text-stroke: 1px #555;
          letter-spacing: -0.03em;
        }
        
        .red-circle {
          position: relative;
          width: 600px;
          height: 600px;
          max-width: 90vw;
          max-height: 90vw;
          margin: 0 auto;
          background-color: #ff0000;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          color: white;
          padding: 40px;
          box-sizing: border-box;
        }
        
        .genocide-text {
          font-size: 5rem;
          font-weight: 900;
          line-height: 1;
          margin-bottom: 2vh;
          text-align: left;
          transform: rotate(-5deg);
          position: absolute;
          top: 80px;
          left: 70px;
        }
        
        .climate-warning {
          font-size: 2.4rem;
          font-weight: 700;
          line-height: 1.3;
          position: absolute;
          top: 240px;
          left: 50%;
          transform: translateX(-50%);
          width: 80%;
          text-align: center;
        }
        
        .red-box-text {
          display: inline-block;
          background-color: white;
          color: #ff0000;
          padding: 0.1em 0.3em;
          font-weight: 800;
        }

        .black-box-text {
          display: inline-block;
          background-color: white;
          color: #000000;
          padding: 0.1em 0.3em;
          font-weight: 800;
        }
        
        .climate-description {
          font-size: 1.05rem;
          line-height: 1.5;
          text-align: left;
          position: absolute;
          bottom: 60px;
          left: 50%;
          transform: translateX(-50%);
          width: 85%;
        }
        
        .climate-crisis-section-2 {
          padding: 10vh 0;
          position: relative;
          background-color: white;
        }
        
        .red-alert-text {
          font-size: 3.8rem;
          font-weight: 900;
          color: #ff0000;
          text-align: right;
          margin-bottom: 15vh;
          -webkit-text-stroke: 2px #ff0000;
          text-stroke: 2px #ff0000;
          color: transparent;
          line-height: 1.2;
        }
        
        .climate-question {
          font-size: 3.2rem;
          font-weight: 900;
          text-align: center;
          margin-bottom: 8vh;
          line-height: 1.3;
        }
        
        .climate-solution {
          max-width: 600px;
          margin: 0 auto;
          font-size: 1.4rem;
          line-height: 1.6;
          text-align: center;
        }
        
        @media (max-width: 768px) {
          .right-now-badge {
            width: 90px;
            height: 90px;
            font-size: 1.1rem;
          }
          
          .climate-title {
            font-size: 2.4rem;
            margin-top: 30px;
          }
          
          .genocide-text {
            font-size: 3rem;
            top: 60px;
            left: 40px;
          }
          
          .climate-warning {
            font-size: 1.8rem;
            top: 170px;
          }
          
          .climate-description {
            font-size: 0.9rem;
            bottom: 40px;
          }
          
          .red-alert-text {
            font-size: 2.6rem;
            margin-bottom: 8vh;
          }
          
          .climate-question {
            font-size: 2.2rem;
          }
          
          .climate-solution {
            font-size: 1.1rem;
          }
        }

        /* 흔들리는 애니메이션 추가 */
        @keyframes shake {
          0% { transform: translate(0, 0) rotate(0deg); }
          10% { transform: translate(-5px, -5px) rotate(-3deg); }
          20% { transform: translate(7px, -6px) rotate(3deg); }
          30% { transform: translate(-7px, 5px) rotate(-2deg); }
          40% { transform: translate(6px, 6px) rotate(2deg); }
          50% { transform: translate(-6px, -7px) rotate(-3deg); }
          60% { transform: translate(7px, -5px) rotate(2deg); }
          70% { transform: translate(-7px, 6px) rotate(-3deg); }
          80% { transform: translate(-5px, -5px) rotate(3deg); }
          90% { transform: translate(6px, 7px) rotate(-2deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }

        .shaking-text {
          display: block;
          width: 100%;
          font-size: 3.2rem;
          font-weight: 800;
          color: transparent;
          -webkit-text-stroke: 1px #555;
          text-stroke: 1px #555;
          text-align: center;
          margin: 3rem auto;
          padding: 1.5rem;
          border-radius: 8px;
          animation: shake 3s cubic-bezier(.36,.07,.19,.97) infinite;
          transform-origin: center;
          letter-spacing: -0.03em;
        }

        @media (max-width: 768px) {
          .shaking-text {
            font-size: 2.2rem;
            margin: 2rem auto;
            padding: 1rem;
          }
        }

        /* 새로운 CTA 배너 스타일 */
        .cta-banner-section {
          padding: 8vh 0;
          background-color: #fff;
          margin: 6vh 0;
          position: relative;
        }
        
        .cta-banner {
          border-top: 3px solid #000;
          border-bottom: 3px solid #000;
          padding: 5vh 0;
          position: relative;
        }
        
        .cta-title {
          font-size: 3.8rem;
          font-weight: 700;
          line-height: 1.4;
          margin-bottom: 4vh;
          text-align: left;
        }
        
        .red-box {
          display: inline-block;
          background-color: #ff0000;
          color: white;
          padding: 0.1em 0.2em;
          margin: 0;
          position: relative;
        }

        .yellow-box {
          display: inline-block;
          background-color: #ffed00;
          color: black;
          padding: 0.1em 0.2em;
          margin: 0;
          position: relative;
        }

        .green-box {
          display: inline-block;
          background-color: #00a366;
          color: white;
          padding: 0.1em 0.2em;
          margin: 0;
          position: relative;
        }

        .black-box {
          display: inline-block;
          background-color: #000000;
          color: white;
          padding: 0.1em 0.2em 0.1em 0.1em;
          margin: 0 0.1em;
          position: relative;
        }
        
        .cta-description {
          font-size: 1.4rem;
          line-height: 1.6;
          margin-bottom: 5vh;
          text-align: justify;
          word-break: keep-all;
        }
        
        .cta-highlight-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #000;
          padding-top: 5vh;
          margin-top: 2vh;
          position: relative;
        }
        
        .cta-highlight {
          font-size: 3rem;
          font-weight: 900;
          line-height: 1.2;
          text-align: left;
          max-width: 100%;
        }
        
        .red-highlight {
          color: transparent;
          -webkit-text-stroke: 2px #ff0000;
          background: repeating-linear-gradient(45deg, #ff0000, #ff0000 2px, transparent 2px, transparent 4px);
          background-clip: text;
          -webkit-background-clip: text;
          text-decoration: none;
          padding: 0 0.1em;
        }
        
        .cta-button {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background-color: #ff0000;
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 2rem;
          font-weight: 900;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          box-shadow: 0 4px 10px rgba(255, 0, 0, 0.3);
        }
        
        .cta-button:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 15px rgba(255, 0, 0, 0.4);
        }
        
        @media (max-width: 768px) {
          .cta-title {
            font-size: 3.2rem;
          }
          
          .cta-description {
            font-size: 1.2rem;
            max-width: 100%;
          }
          
          .cta-highlight {
            font-size: 1.8rem;
            max-width: 100%;
          }
          
          .cta-button {
            width: 80px;
            height: 80px;
            font-size: 1.6rem;
          }
        }

        /* 기후 위기 섹션 스타일 */
        .climate-crisis-section-1 {
          padding: 12vh 0 6vh;
          position: relative;
          background-color: white;
        }
        
        .right-now-badge {
          position: absolute;
          top: 20px;
          left: 20px;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background-color: #000;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
          font-weight: 700;
          text-align: center;
          line-height: 1.2;
          transform: rotate(-10deg);
          z-index: 5;
        }
        
        .climate-title {
          font-size: 3.2rem;
          text-align: center;
          font-weight: 700;
          margin-bottom: 5vh;
          color: transparent;
          -webkit-text-stroke: 1px #555;
          text-stroke: 1px #555;
          letter-spacing: -0.03em;
        }
        
        .red-circle {
          position: relative;
          width: 600px;
          height: 600px;
          max-width: 90vw;
          max-height: 90vw;
          margin: 0 auto;
          background-color: #ff0000;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          color: white;
          padding: 40px;
          box-sizing: border-box;
        }
        
        .genocide-text {
          font-size: 5rem;
          font-weight: 900;
          line-height: 1;
          margin-bottom: 2vh;
          text-align: left;
          transform: rotate(-5deg);
          position: absolute;
          top: 80px;
          left: 70px;
        }
        
        .climate-warning {
          font-size: 2.4rem;
          font-weight: 700;
          line-height: 1.3;
          position: absolute;
          top: 240px;
          left: 50%;
          transform: translateX(-50%);
          width: 80%;
          text-align: center;
        }
        
        .red-box-text {
          display: inline-block;
          background-color: white;
          color: #ff0000;
          padding: 0.1em 0.3em;
          font-weight: 800;
        }

        .black-box-text {
          display: inline-block;
          background-color: white;
          color: #000000;
          padding: 0.1em 0.3em;
          font-weight: 800;
        }
        
        .climate-description {
          font-size: 1.05rem;
          line-height: 1.5;
          text-align: left;
          position: absolute;
          bottom: 60px;
          left: 50%;
          transform: translateX(-50%);
          width: 85%;
        }
        
        .climate-crisis-section-2 {
          padding: 10vh 0;
          position: relative;
          background-color: white;
        }
        
        .red-alert-text {
          font-size: 3.8rem;
          font-weight: 900;
          color: #ff0000;
          text-align: right;
          margin-bottom: 15vh;
          -webkit-text-stroke: 2px #ff0000;
          text-stroke: 2px #ff0000;
          color: transparent;
          line-height: 1.2;
        }
        
        .climate-question {
          font-size: 3.2rem;
          font-weight: 900;
          text-align: center;
          margin-bottom: 8vh;
          line-height: 1.3;
        }
        
        .climate-solution {
          max-width: 600px;
          margin: 0 auto;
          font-size: 1.4rem;
          line-height: 1.6;
          text-align: center;
        }
        
        @media (max-width: 768px) {
          .right-now-badge {
            width: 90px;
            height: 90px;
            font-size: 1.1rem;
          }
          
          .climate-title {
            font-size: 2.4rem;
            margin-top: 30px;
          }
          
          .genocide-text {
            font-size: 3rem;
            top: 60px;
            left: 40px;
          }
          
          .climate-warning {
            font-size: 1.8rem;
            top: 170px;
          }
          
          .climate-description {
            font-size: 0.9rem;
            bottom: 40px;
          }
          
          .red-alert-text {
            font-size: 2.6rem;
            margin-bottom: 8vh;
          }
          
          .climate-question {
            font-size: 2.2rem;
          }
          
          .climate-solution {
            font-size: 1.1rem;
          }
        }

        /* 흔들리는 애니메이션 추가 */
        @keyframes shake {
          0% { transform: translate(0, 0) rotate(0deg); }
          10% { transform: translate(-5px, -5px) rotate(-3deg); }
          20% { transform: translate(7px, -6px) rotate(3deg); }
          30% { transform: translate(-7px, 5px) rotate(-2deg); }
          40% { transform: translate(6px, 6px) rotate(2deg); }
          50% { transform: translate(-6px, -7px) rotate(-3deg); }
          60% { transform: translate(7px, -5px) rotate(2deg); }
          70% { transform: translate(-7px, 6px) rotate(-3deg); }
          80% { transform: translate(-5px, -5px) rotate(3deg); }
          90% { transform: translate(6px, 7px) rotate(-2deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }

        .shaking-text {
          display: block;
          width: 100%;
          font-size: 3.2rem;
          font-weight: 800;
          color: transparent;
          -webkit-text-stroke: 1px #555;
          text-stroke: 1px #555;
          text-align: center;
          margin: 3rem auto;
          padding: 1.5rem;
          border-radius: 8px;
          animation: shake 3s cubic-bezier(.36,.07,.19,.97) infinite;
          transform-origin: center;
          letter-spacing: -0.03em;
        }

        @media (max-width: 768px) {
          .shaking-text {
            font-size: 2.2rem;
            margin: 2rem auto;
            padding: 1rem;
          }
        }

        /* 텍스트와 이미지 배치 스타일 */
        .text-with-image {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 2rem;
        }
        
        .progressive-text {
          flex: 1;
          white-space: pre-line;
          line-height: 1.8;
          font-size: 1.2rem;
        }
        
        .updown-image {
          flex: 0 0 300px;
          margin-left: 2rem;
          position: relative;
        }
        
        @media (max-width: 768px) {
          .text-with-image {
            flex-direction: column;
          }
          
          .updown-image {
            margin-left: 0;
            margin-top: 2rem;
            width: 100%;
            display: flex;
            justify-content: center;
          }
        }
        
        /* 추가 스타일 */
        .cta-banner {
          margin-top: 3rem;
          padding: 2rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          background-color: rgba(255, 255, 255, 0.8);
        }
        
        .cta-highlight {
          font-size: 1.8rem;
          font-weight: 700;
          line-height: 1.5;
          color: #0b365f;
          margin-bottom: 1rem;
        }
        
        .cta-highlight-container {
          margin: 2rem 0;
        }
        
        .cta-text {
          font-size: 1.2rem;
          line-height: 1.6;
          margin-top: 1rem;
          color: #333;
        }
        
        .dream-text {
          margin: 2.5rem 0;
          font-size: 1.4rem;
          line-height: 1.7;
          font-style: italic;
          color: #444;
          text-align: center;
        }
        
        .dream-text p {
          margin: 0.5rem 0;
        }
        
        @media (max-width: 768px) {
          .cta-highlight {
            font-size: 1.5rem;
          }
          
          .cta-text {
            font-size: 1.1rem;
          }
          
          .dream-text {
            font-size: 1.2rem;
          }
        }

        /* 이미 있는 스타일들 유지 */
        
        .cta-highlight-80 {
          width: 80%;
          margin-left: auto;
          margin-right: auto;
        }
      `}</style>
    </div>
  );
} 