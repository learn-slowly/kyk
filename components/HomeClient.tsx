'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Schedule } from '../app/page';

// 정적 데이터와 동적 데이터를 처리하기 위한 클라이언트 컴포넌트
export default function HomeClient({ schedules }: { schedules: Schedule[] }) {
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
        const opacity = Math.max(0, 1 - window.scrollY / window.innerHeight);
        overlayRef.current.style.opacity = opacity.toString();
        if (opacity === 0) {
          overlayRef.current.style.pointerEvents = 'none';
        } else {
          overlayRef.current.style.pointerEvents = 'all';
        }
        
        // 이미지가 스케일업 되면서 사라지는 효과
        if (overlayImageRef.current) {
          overlayImageRef.current.style.opacity = opacity.toString();
          // 스크롤에 따라 약간씩 확대되는 효과 (1.0 ~ 1.2)
          const scale = 1 + ((1 - opacity) * 0.2);
          overlayImageRef.current.style.transform = `scale(${scale})`;
        }
        
        // 히어로 섹션 표시 설정 - 완전히 화면 아래에서 올라오게 함
        if (heroSectionRef.current) {
          // 오버레이가 더 사라진 시점(90%)부터 히어로 섹션이 올라오기 시작하도록 조정
          // 속도를 훨씬 느리게 조정 (2.5 -> 1.2)
          const heroProgress = Math.max(0, Math.min(1, (1 - opacity - 0.1) * 1.2));
          
          // 스크롤 위치에 따른 특별한 위치 계산
          // 진행도에 따라 자연스럽게 멈추는 지점 구현
          let translateY;
          
          // 진행도가 0.3~0.7 사이일 때 (약 30%~70% 진행) 상단 30% 지점에서 멈추게 함
          // 멈추는 구간을 0.4로 확장하여 더 오래 멈추도록 함
          if (heroProgress > 0.3 && heroProgress < 0.7) {
            // 화면 상단에서 30% 위치 (viewportHeight의 0.3)
            translateY = viewportHeight * 0.3; 
          } else if (heroProgress <= 0.3) {
            // 초기 진행 - 화면 아래에서 상단 30% 지점으로 올라옴
            translateY = viewportHeight * (1 - (heroProgress / 0.3) * 0.7);
          } else {
            // 후기 진행 - 상단 30% 지점에서 최종 위치(0)로 올라감
            const lateProgress = (heroProgress - 0.7) / 0.3; // 0.7~1.0 범위를 0~1로 정규화
            translateY = viewportHeight * 0.3 * (1 - lateProgress);
          }
          
          // 투명도도 같이 조절
          heroSectionRef.current.style.opacity = heroProgress.toString();
          heroSectionRef.current.style.transform = `translateY(${translateY}px)`;
        }
        
        // 큰 메시지 섹션도 히어로 섹션과 함께 자연스럽게 등장하도록 조정
        const bigMessageSection = document.querySelector('.big-message');
        if (bigMessageSection) {
          // 히어로 섹션보다 약간 늦게 시작하도록 조정
          const messageProgress = Math.max(0, Math.min(1, (1 - opacity - 0.15) * 1.5));
          const translateY = 100 * (1 - messageProgress);
          
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
          heroTextRef.current.style.transform = `translateY(${scrollY * 0.2}px)`;
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
          
          circle.style.transform = `${baseTransform} translateX(${moveX}px)`;
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
      text: '"정권교체를 넘어 사회대개혁으로! 불평등을 넘어 함께 사는 사회로!"',
      align: 'left',
      highlight: true
    },
    {
      text: '차별 없는 나라, 함께 사는 대한민국!',
      align: 'right',
      highlight: false
    },
    {
      text: '우리를 지키는 진보 대통령이 되기 위해 21대 대통령 선거에 출마합니다.',
      align: 'left',
      highlight: false
    },
    {
      text: '사회대전환을 꿈꾸는 모든 시민들의 염원을 담아 독자적 진보정치의 대선 여정을 시작합니다.',
      align: 'right',
      highlight: false
    },
    {
      text: '간절히 기다렸던 윤석열 파면 이후 많은 시민들은 소중한 일상으로 되돌아갔습니다. 그러나 저는 그럴 수 없었습니다.',
      align: 'left',
      highlight: true
    },
    {
      text: '돌아가야 할 일상이 계엄과 다름없는 시민들이 여전히 광장에, 고공에, 거리에 남아있음을 알기에',
      align: 'right',
      highlight: false
    },
    {
      text: '정권교체를 향한 민심은 이미 압도적입니다. 그러나 정권교체만으로는 부족합니다.',
      align: 'left',
      highlight: false
    },
    {
      text: '이번에야말로 정권교체와 함께 사회대전환, 그리고 정치개혁을 반드시 이뤄내야 합니다.',
      align: 'right',
      highlight: true
    },
    {
      text: '양극단 진영정치로 갈라진 대한민국을 광장을 닮은 다양성의 정치로 치유하고 통합해야 합니다.',
      align: 'left',
      highlight: false
    },
    {
      text: '이것이 바로 우리가 꿈꾸는 진정한 정치교체이자 내란청산입니다.',
      align: 'right',
      highlight: false
    },
    {
      text: '진보는 사회의 방향을 바꾸는 것입니다.',
      align: 'left',
      highlight: true
    },
    {
      text: '싸우는 노동자가 이를 악물고 고공에 오르는 세상을 바꾸어 모든 고공농성 노동자가 땅으로 내려올 수 있게 하는 것이 진보입니다.',
      align: 'right',
      highlight: false
    },
    {
      text: '여성이 여성이라는 이유로 다치고 죽어가는 세상을 바꾸어 모든 여성이 안전하게 살아갈 수 있게 하는 것이 진보입니다.',
      align: 'left',
      highlight: false
    },
    {
      text: '성소수자, 장애인, 이주민을 차별하고 억압하는 세상을 바꾸어 모든 사회적 소수자가 존재하는 그대로 존중받게 하는 것이 진보입니다.',
      align: 'right',
      highlight: true
    },
    {
      text: '말로는 기후위기를 이야기하지만 화석연료 중독을 끊어내지 못하는 세상을 바꾸어 지구온도 상승을 기어코 멈추어내는 것이 진보입니다.',
      align: 'left',
      highlight: false
    },
    {
      text: '우리가 지켜야 할 시민들의 삶이 있습니다. 우리가 마주하고 싶은 변화된 세상을 향한 꿈이 있습니다.',
      align: 'right',
      highlight: false
    },
    {
      text: '진보가 지켜내야 할 그 존재들이 있기 때문에 저 권영국, 수많은 동지들과 함께 다시 한 번 용기를 내겠습니다.',
      align: 'left',
      highlight: true
    },
    {
      text: '그 꿈이 이루질 때까지는 언제나 불가능해보입니다. 그러나 꿈을 꾸는 자에게만 그 꿈이 현실이 될 것입니다.',
      align: 'right',
      highlight: true
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
        <img 
          ref={overlayImageRef}
          src="/images/6.png" 
          alt="권영국 후보" 
          className="overlay-image"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            transition: 'transform 0.5s ease, opacity 0.5s ease',
            opacity: 1,
            transformOrigin: 'center center'
          }}
        />
        
        {/* 오버레이 내부 텍스트 내용 */}
        <div className="overlay-content">
          <div className="container h-100 d-flex flex-column justify-content-end align-items-center" style={{ paddingBottom: '15vh' }}>
            <h2 className="overlay-title">정권교체를 넘어 사회대개혁으로</h2>
            <p className="overlay-subtitle">불평등을 넘어 함께 사는 사회로!</p>
            <p className="overlay-scroll-hint">아래로 스크롤하여 더 알아보세요</p>
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
          transition: 'opacity 3.5s cubic-bezier(0.16, 1, 0.3, 1), transform 4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          paddingBottom: '5vh' // 아래 여백 줄여서 다음 섹션과 가까워지게
        }}
      >
        <div className={`hero-content ${isLoaded ? 'loaded' : ''}`}>
          <h1 ref={heroTextRef} className="interactive-text">권영국</h1>
          <p className="subtitle">사회대전환 연대회의 대통령 후보</p>
        </div>
      </section>

      {/* 큰 메시지 섹션 */}
      <section className="big-message" style={{
        opacity: 0,
        transform: 'translateY(100px)',
        transition: 'opacity 2.5s cubic-bezier(0.16, 1, 0.3, 1), transform 2.5s cubic-bezier(0.16, 1, 0.3, 1)',
        paddingTop: '5vh' // 위 여백 줄여서 이전 섹션과 가까워지게
      }}>
        <div className="container">
          <p className="big-text scroll-reveal">
            {splitWords('사회대전환을 꿈꾸는 모든 시민들의 염원을 담아')}
          </p>
          <p className="big-text-right scroll-reveal">
            {splitWords('21대 대통령 선거에 출마합니다.')}
          </p>
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
                className={`statement-content scroll-reveal ${statement.highlight ? 'highlight' : ''}`}
                ref={el => { statementRefs.current[index] = el; }}
                style={{
                  transitionDelay: `${index * 0.05}s`,
                  transform: `translateY(${statement.align === 'right' ? '50px' : '30px'})`,
                }}
              >
                <p>{statement.text}</p>
                {statement.highlight && (
                  <div className="highlight-bar" style={{ 
                    width: statement.align === 'right' ? '80%' : '60%',
                    left: statement.align === 'right' ? 'auto' : '0',
                    right: statement.align === 'right' ? '0' : 'auto',
                  }}></div>
                )}
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* 최종 CTA 섹션 */}
      <section className="cta-section">
        <div className="container">
          <h2 className="scroll-reveal interactive-text">권영국과 함께<br />변화를 만들어 갑시다</h2>
          <div className="cta-button scroll-reveal">
            <Link href="/join" className="btn-hover-effect">함께하기</Link>
          </div>
        </div>
        
        {/* 애니메이션 원 */}
        <div className="animated-circles">
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
          <div className="circle circle-3"></div>
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
          transition: opacity 1s ease, transform 1s ease;
        }
        
        .hero-content.loaded {
          opacity: 1;
          transform: translateY(0);
        }
        
        .interactive-text {
          font-size: 5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          letter-spacing: -0.02em;
          color: #0b365f;
          position: relative;
          display: inline-block;
          transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
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
          transition: transform 0.8s cubic-bezier(0.23, 1, 0.32, 1);
        }
        
        .loaded .interactive-text::after {
          transform: scaleX(1);
        }
        
        .subtitle {
          font-size: 1.8rem;
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
          font-size: 3rem;
          font-weight: 700;
          line-height: 1.3;
          margin-bottom: 5vh;
          word-break: keep-all;
          color: #0b365f;
          max-width: 70%;
        }
        
        .big-text-right {
          font-size: 3rem;
          font-weight: 700;
          line-height: 1.3;
          margin-bottom: 5vh;
          word-break: keep-all;
          color: #0b365f;
          max-width: 70%;
          margin-left: auto;
          text-align: right;
        }
        
        .word {
          display: inline-block;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.5s ease, transform 0.5s ease;
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
          font-size: 1.8rem;
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
            font-size: 3.5rem;
          }
          
          .big-text, .big-text-right {
            font-size: 2rem;
            max-width: 100%;
          }
          
          .statement-content {
            max-width: 100%;
          }
          
          .statement-content p {
            font-size: 1.5rem;
          }
          
          .cta-section h2 {
            font-size: 2.5rem;
          }
          
          .cursor-effect {
            display: none;
          }
        }

        /* 오버레이 콘텐츠 스타일 */
        .overlay-content {
          position: relative;
          height: 100%;
          width: 100%;
          z-index: 2;
          color: white;
          text-align: center;
        }
        
        .overlay-title {
          font-size: 3.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
        }
        
        .overlay-subtitle {
          font-size: 2rem;
          margin-bottom: 2rem;
          text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
        }
        
        .overlay-scroll-hint {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          font-size: 1rem;
          opacity: 0.8;
          animation: bounce 2s infinite;
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0) translateX(-50%);
          }
          40% {
            transform: translateY(-20px) translateX(-50%);
          }
          60% {
            transform: translateY(-10px) translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
} 