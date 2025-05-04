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
  const [isLoaded, setIsLoaded] = useState(false);
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
    
    // 초기 로딩 애니메이션 효과
    setTimeout(() => {
      setIsLoaded(true);
    }, 200);
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
        const subtitleOpacity = Math.max(0, 1 - window.scrollY / (window.innerHeight * 2.5));
        (subtitleEl as HTMLElement).style.opacity = subtitleOpacity.toString();
        
        // Y축 이동도 천천히 하도록 조정 (큰 메시지 섹션까지 내려오도록)
        const bigMessageTop = document.querySelector('.big-message')?.getBoundingClientRect().top;
        const targetY = bigMessageTop && bigMessageTop > 0 ? 
          Math.min(scrollY * 0.5, bigMessageTop - viewportHeight * 0.3) : scrollY * 0.5;
        
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
        
        // 요소에 그림자 효과 변경 - 더 강하게 변경
        (el as HTMLElement).style.textShadow = `
          ${distanceX * -1}px ${distanceY * -1}px 5px rgba(255, 0, 0, 0.4),
          ${distanceX}px ${distanceY}px 5px rgba(0, 163, 102, 0.4)
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

  // 중요 문구 배열
  const statements = [
    {
      text: '간절히 기다렸던 윤석열 파면 이후 많은 시민들은 소중한 일상으로 되돌아갔습니다. 그러나 저는 그럴 수 없었습니다.',
      align: 'left',
      highlight: true,
      effect: 'scale', // 확대/축소 효과
      fontSize: '3rem', // 폰트 크기
      color: '#0b365f', // 폰트 색상
      textShadow: '1px 1px 3px rgba(0, 0, 0, 0.2)', // 텍스트 그림자
      fontWeight: 800, // 더 굵은 글씨 (700은 bold, 800은 extra-bold, 900은 black)
      lineHeight: 1.2 // 좁은 행간 (기본값보다 더 좁게)
    },
    {
      text: '돌아가야 할 일상이 계엄과 다름없는 시민들이 여전히',
      secondPart: '남아있음을 알기에',
      align: 'right',
      highlight: false,
      effect: 'custom-drop', // 커스텀 드롭 효과
      fontSize: '2.2rem',
      color: '#333',
      dropWords: ['광장에,', '고공에,', '거리에'] // 떨어지는 효과가 적용될 단어들
    },
    {
      text: '정권교체를 향한 민심은 이미 압도적입니다. 그러나,',
      secondPart: '정권교체만으로는 부족합니다.',
      thirdPart: '이번에야말로 정권교체와 함께 사회대전환, 그리고 정치개혁을 반드시 이뤄내야 합니다. 양극단 진영정치로 갈라진 대한민국을 광장을 닮은 [다양성]의 정치로 치유하고 통합해야 합니다.',
      fourthPart: '이것이 바로 우리가 꿈꾸는 진정한 정치교체이자 내란청산입니다.',
      align: 'left',
      highlight: false,
      effect: 'manifesto-group', // 새로운 효과 타입
      fontSize: '2.2rem',
      color: '#333',
      secondPartHighlight: true,
      secondPartFontSize: '3rem',
      secondPartColor: '#0b365f',
      secondPartEffect: 'glow',
      highlightWords: {
        '[다양성]': 'gradient' // 그라데이션 효과로 처리
      },
      gradientColors: ['#FF0000', '#FFed00', '#00a366'] // 빨강, 노랑, 녹색 그라데이션
    },
    {
      text: '진보는 사회의 방향을 바꾸는 것입니다.',
      align: 'left',
      highlight: true,
      effect: 'rotate', // 회전 효과
      fontSize: '2.8rem',
      color: '#FF0000',
      fontWeight: 700
    },
    {
      text: '싸우는 노동자가 이를 악물고 고공에 오르는 세상을 바꾸어 모든 고공농성 노동자가 땅으로 내려올 수 있게 하는 것이 진보입니다.',
      align: 'right',
      highlight: false,
      effect: 'slide',
      fontSize: '2.2rem',
      color: '#333'
    },
    {
      text: '여성이 여성이라는 이유로 다치고 죽어가는 세상을 바꾸어 모든 여성이 안전하게 살아갈 수 있게 하는 것이 진보입니다.',
      align: 'left',
      highlight: false,
      effect: 'fade',
      fontSize: '2.2rem',
      color: '#333'
    },
    {
      text: '성소수자, 장애인, 이주민을 차별하고 억압하는 세상을 바꾸어 모든 사회적 소수자가 존재하는 그대로 존중받게 하는 것이 진보입니다.',
      align: 'right',
      highlight: true,
      effect: 'scale',
      fontSize: '2.4rem',
      color: '#00a366',
      textShadow: '1px 1px 3px rgba(0, 163, 102, 0.2)'
    },
    {
      text: '말로는 기후위기를 이야기하지만 화석연료 중독을 끊어내지 못하는 세상을 바꾸어 지구온도 상승을 기어코 멈추어내는 것이 진보입니다.',
      align: 'left',
      highlight: false,
      effect: 'stagger',
      fontSize: '2.2rem',
      color: '#333'
    },
    {
      text: '우리가 지켜야 할 시민들의 삶이 있습니다. 우리가 마주하고 싶은 변화된 세상을 향한 꿈이 있습니다.',
      align: 'right',
      highlight: false,
      effect: 'blur',
      fontSize: '2.2rem',
      color: '#333'
    },
    {
      text: '진보가 지켜내야 할 그 존재들이 있기 때문에 저 권영국, 수많은 동지들과 함께 다시 한 번 용기를 내겠습니다.',
      align: 'left',
      highlight: true,
      effect: 'glow',
      fontSize: '2.5rem',
      color: '#FF0000',
      textShadow: '0 0 10px rgba(255, 0, 0, 0.3)'
    },
    {
      text: '그 꿈이 이루질 때까지는 언제나 불가능해보입니다. 그러나 꿈을 꾸는 자에게만 그 꿈이 현실이 될 것입니다.',
      align: 'right',
      highlight: true,
      effect: 'rainbow', // 무지개 색상 효과
      fontSize: '2.6rem',
      color: 'transparent',
      background: 'linear-gradient(90deg, #FF0000, #FFed00, #00a366)',
      backgroundClip: 'text',
      fontWeight: 700
    }
  ];
  
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
        <div className={`hero-content ${isLoaded ? 'loaded' : ''}`}>
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

      {/* 선언문 섹션들 */}
      <div className="statements-container">
        {statements.map((statement, index) => (
          <section 
            key={index}
            className={`statement-section ${statement.align === 'right' ? 'right' : 'left'}`}
          >
            <div className="container">
              <div 
                className={`statement-content scroll-reveal ${statement.highlight ? 'highlight' : ''} effect-${statement.effect}`}
                ref={el => { statementRefs.current[index] = el; }}
                style={{
                  transitionDelay: `${index * 0.05}s`,
                  transform: `translateY(${statement.align === 'right' ? '50px' : '30px'})`,
                }}
              >
                <div style={{
                  fontSize: statement.fontSize || '2.2rem',
                  color: statement.color || '#333',
                  textShadow: statement.textShadow || 'none',
                  background: statement.background || 'none',
                  WebkitBackgroundClip: statement.backgroundClip === 'text' ? 'text' : 'none',
                  backgroundClip: statement.backgroundClip === 'text' ? 'text' : 'none',
                  fontWeight: statement.fontWeight || 'inherit',
                  lineHeight: statement.lineHeight || 'normal'
                }}>
                  {statement.effect === 'stagger' 
                    ? statement.text.split(' ').map((word, i) => (
                        <span key={i} className="stagger-word" style={{ transitionDelay: `${i * 0.08}s` }}>
                          {word}{' '}
                        </span>
                      ))
                    : statement.effect === 'word-drop'
                    ? statement.text.split(' ').map((word, i) => {
                        // 특별한 단어들에 드롭 애니메이션 적용
                        const isSpecialWord = (statement as any).specialWords && (statement as any).specialWords.includes(word);
                        return (
                          <span key={i} 
                            className={isSpecialWord ? "drop-word" : ""} 
                            style={{ 
                              display: 'inline-block',
                              animationDelay: isSpecialWord 
                                ? `${(statement as any).specialWords.indexOf(word) * 0.5 + 0.5}s` 
                                : '0s'
                            }}
                          >
                            {word}{' '}
                          </span>
                        );
                      })
                    : statement.effect === 'custom-drop'
                    ? (
                        <>
                          {statement.text}
                          {' '}
                          {(statement as any).dropWords && (statement as any).dropWords.map((word: string, i: number) => (
                            <span key={i} 
                              className="drop-word"
                              style={{ 
                                animationDelay: `${i * 0.5 + 0.5}s`,
                                display: 'inline-block'
                              }}
                            >
                              {word}{' '}
                            </span>
                          ))}
                          <br />
                          <span style={{ marginLeft: '3rem', display: 'inline-block', marginTop: '0.5rem' }}>
                            {(statement as any).secondPart}
                          </span>
                        </>
                      )
                    : statement.effect === 'combined'
                    ? (
                        <>
                          <span style={{ display: 'inline-block', wordSpacing: '0.2em' }}>
                            {statement.text.split(' ').map((word, i) => (
                              <span key={i} className="stagger-word" style={{ 
                                transitionDelay: `${i * 0.08}s`,
                                margin: '0 0.1em'
                              }}>
                                {word}{' '}
                              </span>
                            ))}
                          </span>
                          {' '}
                          <span style={{ 
                            display: 'inline-block', 
                            wordSpacing: '0.3em',
                            marginLeft: '0.3em'
                          }}>
                            {(statement as any).highlightWords 
                              ? (statement as any).secondPart.split(/(\[[^\]]+\])/).map((part: string, i: number) => {
                                  // 하이라이트 단어 체크
                                  if ((statement as any).highlightWords[part]) {
                                    // 그라데이션 효과가 적용되는 경우
                                    if ((statement as any).highlightWords[part] === 'gradient' && (statement as any).gradientColors) {
                                      const text = part.replace(/\[|\]/g, '');
                                      const chars = text.split('');
                                      
                                      if (chars.length === 3 && (statement as any).gradientColors.length === 3) {
                                        return (
                                          <span key={i} style={{ 
                                            display: 'inline-flex',
                                            fontWeight: 800,
                                            fontSize: '110%'
                                          }}>
                                            <span style={{ 
                                              color: (statement as any).gradientColors[0], 
                                              textShadow: `0 0 8px ${(statement as any).gradientColors[0]}40` 
                                            }}>{chars[0]}</span>
                                            <span style={{ 
                                              color: (statement as any).gradientColors[1], 
                                              textShadow: `0 0 8px ${(statement as any).gradientColors[1]}40` 
                                            }}>{chars[1]}</span>
                                            <span style={{ 
                                              color: (statement as any).gradientColors[2], 
                                              textShadow: `0 0 8px ${(statement as any).gradientColors[2]}40` 
                                            }}>{chars[2]}</span>
                                          </span>
                                        );
                                      }
                                    }
                                    
                                    // 기본 강조 스타일
                                    return (
                                      <span 
                                        key={i} 
                                        style={{
                                          color: (statement as any).highlightWords[part],
                                          fontWeight: 800,
                                          textShadow: `0 0 8px ${(statement as any).highlightWords[part]}40`,
                                          fontSize: '110%',
                                          margin: '0'
                                        }}
                                      >
                                        {part.replace(/\[|\]/g, '')}
                                      </span>
                                    )
                                  }
                                  return part;
                                })
                              : (statement as any).secondPart
                            }
                          </span>
                        </>
                      )
                    : statement.effect === 'manifesto-group'
                    ? (
                        <div className="manifesto-group">
                          <div className="manifesto-line">
                            <span style={{ display: 'inline-block', wordSpacing: '0.2em' }}>
                              {statement.text}
                            </span>
                            {' '}
                            <span 
                              className={(statement as any).secondPartHighlight ? "highlight-text" : ""}
                              style={{
                                fontSize: (statement as any).secondPartFontSize || statement.fontSize,
                                color: (statement as any).secondPartColor || statement.color,
                                fontWeight: (statement as any).secondPartHighlight ? 700 : 'inherit',
                                display: 'inline',
                                textShadow: (statement as any).secondPartEffect === 'glow' 
                                  ? '0 0 15px rgba(255, 237, 0, 0.5), 0 0 10px rgba(0, 163, 102, 0.3)'
                                  : 'none'
                              }}
                            >
                              {(statement as any).secondPart}
                            </span>
                          </div>
                          
                          <div className="manifesto-line" style={{ 
                            marginTop: '1.5rem', 
                            marginBottom: '1.5rem',
                            fontSize: '2.3rem',
                            fontWeight: 600
                          }}>
                            {(statement as any).thirdPart && 
                              (statement as any).thirdPart.split(/(\[[^\]]+\])/).map((part: string, i: number) => {
                                // 하이라이트 단어 체크
                                if ((statement as any).highlightWords && (statement as any).highlightWords[part]) {
                                  // 그라데이션 효과가 적용되는 경우
                                  if ((statement as any).highlightWords[part] === 'gradient' && (statement as any).gradientColors) {
                                    const text = part.replace(/\[|\]/g, '');
                                    const chars = text.split('');
                                    
                                    if (chars.length === 3 && (statement as any).gradientColors.length === 3) {
                                      return (
                                        <span key={i} style={{ 
                                          display: 'inline-flex',
                                          fontWeight: 800,
                                          fontSize: '110%'
                                        }}>
                                          <span style={{ 
                                            color: (statement as any).gradientColors[0], 
                                            textShadow: `0 0 8px ${(statement as any).gradientColors[0]}40` 
                                          }}>{chars[0]}</span>
                                          <span style={{ 
                                            color: (statement as any).gradientColors[1], 
                                            textShadow: `0 0 8px ${(statement as any).gradientColors[1]}40` 
                                          }}>{chars[1]}</span>
                                          <span style={{ 
                                            color: (statement as any).gradientColors[2], 
                                            textShadow: `0 0 8px ${(statement as any).gradientColors[2]}40` 
                                          }}>{chars[2]}</span>
                                        </span>
                                      );
                                    }
                                  }
                                  
                                  // 기본 강조 스타일
                                  return (
                                    <span 
                                      key={i} 
                                      style={{
                                        color: (statement as any).highlightWords[part],
                                        fontWeight: 800,
                                        textShadow: `0 0 8px ${(statement as any).highlightWords[part]}40`,
                                        fontSize: '110%',
                                        margin: '0'
                                      }}
                                    >
                                      {part.replace(/\[|\]/g, '')}
                                    </span>
                                  )
                                }
                                return part;
                              })
                            }
                          </div>
                          
                          <div className="manifesto-line" style={{ 
                            fontSize: '2.4rem',
                            fontWeight: 700,
                            color: '#0b365f',
                            textAlign: 'center',
                            marginTop: '2rem',
                            fontStyle: 'italic',
                            textShadow: '0 0 10px rgba(11, 54, 95, 0.2)'
                          }}>
                            {(statement as any).fourthPart}
                          </div>
                        </div>
                      )
                    : (statement as any).secondPart && !(statement as any).highlightWords
                    ? (
                        <>
                          {statement.text}
                          {' '}
                          <span 
                            className={(statement as any).secondPartHighlight ? "highlight-text" : ""}
                            style={{
                              fontSize: (statement as any).secondPartFontSize || statement.fontSize,
                              color: (statement as any).secondPartColor || statement.color,
                              fontWeight: (statement as any).secondPartHighlight ? 700 : 'inherit'
                            }}
                          >
                            {(statement as any).secondPart}
                          </span>
                        </>
                      )
                    : statement.text
                  }
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
} 