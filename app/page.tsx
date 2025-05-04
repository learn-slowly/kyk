'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // 스크롤 이벤트 핸들러
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // 초기 로딩 애니메이션 효과
    setTimeout(() => {
      setIsLoaded(true);
    }, 200);

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 스크롤 위치에 따른 요소 표시 여부
  const isVisible = (elementPosition: number) => {
    return scrollY > elementPosition;
  };

  return (
    <div className="home-page">
      {/* 히어로 섹션 */}
      <section 
        className="hero position-relative overflow-hidden text-center bg-gradient-primary py-5" 
        style={{
          minHeight: '90vh',
          background: 'linear-gradient(90deg, #FF0000 0%, #FFFF00 50%, #00FF00 100%)',
        }}
      >
        <div 
          className={`container d-flex flex-column justify-content-center align-items-center h-100 pt-5 ${isLoaded ? 'fade-in-up' : 'opacity-0'}`}
          style={{ minHeight: '80vh', transition: 'all 1s ease' }}
        >
          <div className="row justify-content-center">
            <div className="col-md-10">
              <div className="position-relative mb-5">
                <div 
                  className="rounded-circle shadow bg-light d-flex align-items-center justify-content-center mx-auto overflow-hidden"
                  style={{ width: '300px', height: '300px' }}
                >
                  <div className="fs-1 text-primary">권영국</div>
                </div>
                <div className="gradient-overlay"></div>
              </div>
              
              <h1 
                className="display-2 fw-bold text-white mb-3 animate-text"
                style={{ 
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  transform: `translateY(${scrollY * 0.1}px)` 
                }}
              >
                권영국과 함께하는 <br />새로운 대한민국
              </h1>
              
              <p 
                className="lead fs-4 text-white mb-5"
                style={{ 
                  maxWidth: '800px', 
                  margin: '0 auto',
                  opacity: 0.9,
                  transform: `translateY(${scrollY * 0.05}px)` 
                }}
              >
                국민의 삶을 바꾸는 진정한 변화, <br />
                함께 만들어가는 혁신적인 미래
              </p>
              
              <div className="d-grid gap-3 d-sm-flex justify-content-sm-center mb-5">
                <Link 
                  href="/policies" 
                  className="btn btn-primary btn-lg px-4 me-sm-3 shadow-sm hover-scale"
                >
                  정책 알아보기
                </Link>
                <Link 
                  href="/join" 
                  className="btn btn-outline-light btn-lg px-4 shadow-sm hover-scale"
                >
                  캠페인 참여하기
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* 스크롤 인디케이터 */}
        <div className="scroll-indicator position-absolute bottom-0 start-50 translate-middle-x mb-4">
          <div className="mouse">
            <div className="wheel"></div>
          </div>
          <p className="text-white small">스크롤하여 더 알아보기</p>
        </div>
      </section>

      {/* 핵심 정책 섹션 */}
      <section className="py-5 bg-light">
        <div className="container py-5">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8 text-center">
              <h2 
                className={`display-5 fw-bold mb-4 ${isVisible(100) ? 'fade-in-up visible' : 'invisible'}`}
                style={{ transition: 'all 0.6s ease' }}
              >
                핵심 정책 미리보기
              </h2>
              <p 
                className={`lead ${isVisible(150) ? 'fade-in-up visible' : 'invisible'}`}
                style={{ transition: 'all 0.8s ease' }}
              >
                권영국 후보가 약속하는 대한민국의 미래를 위한 핵심 정책입니다.
              </p>
            </div>
          </div>
          
          <div className="row g-4">
            {[
              { 
                title: '경제 활성화',
                icon: '💼',
                desc: '기업 혁신과 일자리 창출을 통한 경제 활력 회복'
              },
              { 
                title: '사회 안전망 강화',
                icon: '🛡️',
                desc: '모든 국민이 안심하고 살 수 있는 복지 체계 구축'
              },
              { 
                title: '디지털 혁신',
                icon: '💻',
                desc: '미래 산업 육성과 디지털 전환 가속화'
              },
            ].map((policy, index) => (
              <div 
                className="col-md-4" 
                key={index}
              >
                <div 
                  className={`card h-100 border-0 shadow-sm hover-float ${isVisible(200 + index * 50) ? 'fade-in-up visible' : 'invisible'}`}
                  style={{ transition: `all ${0.4 + index * 0.2}s ease` }}
                >
                  <div className="card-body text-center p-5">
                    <div className="mb-4 fs-1">{policy.icon}</div>
                    <h3 className="card-title mb-3">{policy.title}</h3>
                    <p className="card-text">{policy.desc}</p>
                    <Link href="/policies" className="btn btn-sm btn-outline-primary mt-3">
                      자세히 보기
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 최근 일정 섹션 */}
      <section className="py-5 bg-white">
        <div className="container py-5">
          <div className="row align-items-center">
            <div 
              className={`col-lg-6 mb-5 mb-lg-0 ${isVisible(500) ? 'fade-in-left visible' : 'invisible'}`}
              style={{ transition: 'all 0.8s ease' }}
            >
              <h2 className="display-5 fw-bold mb-4">다가오는 주요 일정</h2>
              <p className="lead mb-4">권영국 후보의 주요 캠페인 일정과 공약 발표 일정을 확인하세요.</p>
              <Link href="/schedule" className="btn btn-primary btn-lg">
                전체 일정 보기
              </Link>
            </div>
            <div 
              className={`col-lg-6 ${isVisible(550) ? 'fade-in-right visible' : 'invisible'}`}
              style={{ transition: 'all 1s ease' }}
            >
              <div className="card shadow-sm border-0">
                <div className="card-body p-4">
                  <div className="list-group list-group-flush">
                    {[
                      {
                        date: '2024년 5월 15일',
                        title: '경제 정책 대국민 발표회',
                        location: '서울 프레스센터'
                      },
                      {
                        date: '2024년 5월 18일',
                        title: '부산 유세 및 시민과의 대화',
                        location: '부산 시민공원'
                      },
                      {
                        date: '2024년 5월 20일',
                        title: '청년 일자리 정책 간담회',
                        location: '서울대학교 문화관'
                      }
                    ].map((event, index) => (
                      <div 
                        key={index} 
                        className="list-group-item d-flex align-items-center border-bottom py-3 hover-bg-light"
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="me-4 text-center">
                          <div className="badge bg-primary rounded-pill px-3 py-2">
                            {event.date.split(' ')[1]}
                          </div>
                        </div>
                        <div>
                          <h5 className="mb-1">{event.title}</h5>
                          <p className="small text-muted mb-0">
                            <i className="bi bi-geo-alt me-1"></i> {event.location}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CSS 스타일 */}
      <style jsx>{`
        .fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .fade-in-left.visible {
          animation: fadeInLeft 0.8s ease-out forwards;
        }
        
        .fade-in-right.visible {
          animation: fadeInRight 0.8s ease-out forwards;
        }
        
        .hover-scale {
          transition: transform 0.3s ease;
        }
        
        .hover-scale:hover {
          transform: scale(1.05);
        }
        
        .hover-float:hover {
          transform: translateY(-10px);
          transition: transform 0.3s ease;
        }
        
        .hover-bg-light:hover {
          background-color: rgba(0,0,0,0.03);
        }
        
        .animate-text {
          background-clip: text;
          -webkit-background-clip: text;
        }
        
        .mouse {
          width: 26px;
          height: 40px;
          border: 2px solid #fff;
          border-radius: 14px;
          margin: 0 auto;
          position: relative;
        }
        
        .wheel {
          width: 4px;
          height: 8px;
          background: #fff;
          border-radius: 2px;
          position: absolute;
          top: 6px;
          left: 50%;
          transform: translateX(-50%);
          animation: wheel 1.5s infinite;
        }
        
        @keyframes wheel {
          0% {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateX(-50%) translateY(15px);
            opacity: 0;
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .gradient-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, rgba(255,0,0,0.3) 0%, rgba(255,255,0,0.3) 50%, rgba(0,255,0,0.3) 100%);
          pointer-events: none;
          border-radius: 50%;
          width: 300px;
          height: 300px;
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
} 