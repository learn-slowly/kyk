'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('bio');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 마우스 움직임 추적
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="profile-page">
      {/* 헤더 섹션 */}
      <section 
        className="position-relative py-5 bg-gradient-primary overflow-hidden"
        style={{
          background: 'linear-gradient(90deg, #FF0000 0%, #FFed00 50%, #00a366 100%)',
          minHeight: '40vh',
        }}
      >
        <div 
          className="position-absolute top-0 start-0 w-100 h-100 parallax-bg"
          style={{
            backgroundImage: 'url(/pattern-dots.png)',
            opacity: 0.1,
            transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        ></div>
        
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6 text-center text-lg-start mb-5 mb-lg-0">
              <h1 
                className="display-3 fw-bold text-white mb-4"
                style={{
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  transform: isScrolled ? 'translateY(-10px)' : 'translateY(0)',
                  transition: 'transform 0.5s ease'
                }}
              >
                권영국 후보
              </h1>
              <p 
                className="lead fs-4 text-white mb-4"
                style={{
                  maxWidth: '600px',
                  opacity: isScrolled ? 0.9 : 1,
                  transition: 'opacity 0.5s ease'
                }}
              >
                사회대전환을 위한 거리의 변호사, 정의당 제8대 당대표
              </p>
              <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-lg-start">
                <span className="badge bg-white text-primary fs-6 px-3 py-2 me-2 mb-2">거리의 변호사</span>
                <span className="badge bg-white text-primary fs-6 px-3 py-2 me-2 mb-2">거리의 당대표</span>
                <span className="badge bg-white text-primary fs-6 px-3 py-2 me-2 mb-2">물구나무 대장</span>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <div 
                className="position-relative profile-image-container"
                style={{
                  transform: `rotate(${isScrolled ? 0 : 5}deg) scale(${isScrolled ? 0.95 : 1})`,
                  transition: 'all 0.5s ease'
                }}
              >
                <Image
                  src="/placeholder-candidate-profile.jpg"
                  alt="권영국 후보 프로필"
                  width={400}
                  height={500}
                  className="img-fluid rounded-lg shadow-lg border border-5 border-white"
                  style={{ 
                    objectFit: 'cover',
                    maxHeight: '500px',
                    transform: `translate(${mousePosition.x * -10}px, ${mousePosition.y * -10}px)`,
                    transition: 'transform 0.1s ease-out'
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://via.placeholder.com/400x500?text=권영국+프로필";
                  }}
                />
                <div 
                  className="position-absolute top-0 start-0 w-100 h-100 bg-gradient-to-tr"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,0,0,0.2) 0%, rgba(255,237,0,0.1) 50%, rgba(0,163,102,0.2) 100%)',
                    borderRadius: 'inherit',
                    pointerEvents: 'none'
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 메인 콘텐츠 */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          {/* 탭 네비게이션 */}
          <div className="profile-tabs mb-5">
            <ul className="nav nav-pills nav-fill flex-column flex-sm-row mb-4">
              {[
                { id: 'bio', label: '소개' },
                { id: 'timeline', label: '약력' },
                { id: 'vision', label: '비전' },
                { id: 'trivia', label: '여담' }
              ].map(tab => (
                <li key={tab.id} className="nav-item" role="presentation">
                  <button 
                    className={`nav-link w-100 ${activeTab === tab.id ? 'active' : ''}`} 
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
            
            {/* 소개 탭 */}
            <div className={`tab-content ${activeTab === 'bio' ? 'd-block' : 'd-none'}`}>
              <div className="row">
                <div className="col-lg-8 mx-auto">
                  <h2 className="display-5 fw-bold mb-4 text-center">권영국 약력</h2>
                  <p className="lead mb-5 text-center">
                    가난한 광부의 아들이 거리의 변호사가 되고, 정의당 당대표를 거쳐 사회대전환 대통령 후보가 되기까지
                  </p>
                  
                  <div className="card shadow mb-5">
                    <div className="card-body p-4">
                      <h3 className="h4 mb-3">거리의 변호사, 권영국</h3>
                      <p className="mb-0">
                        &quot;SPC 노조파괴 의혹, 쿠팡 블랙리스트 의혹, 고 김용균 노동자 사망사건, 구의역 김군 사망사건···. 이들 사건에서 빼지지 않고 등장하는 이가 있다. &apos;거리의 변호사&apos; 권영국이다.&quot; - 한겨레 기사
                      </p>
                      <hr className="my-4" />
                      <p>
                        권영국은 1963년 강원도 태백에서 광부의 아들로 태어났습니다. 가난한 가정 형편 속에서도 배움에 대한 열정으로 포항제철공업고등학교를 거쳐 서울대학교 공과대학 금속공학과에 진학했습니다.
                      </p>
                      <p>
                        엔지니어로 근무하던 중 노동운동에 참여하며 노동자의 권리를 위해 싸우다 해고됐고, 4년간의 복직투쟁 이후 사법시험에 합격해 변호사가 되었습니다. 
                      </p>
                      <p>
                        &quot;헌법 12조에는 국민 누구나 평등하게 변호인의 조력을 받을 권리를 명시하고 있습니다. 돈이 없다는 이유로 그 억울함을 주장할 수 있는 권리를 박탈당해선 안 되지 않겠습니까. 돈은 있는 사람에게 벌면 됩니다.&quot;
                      </p>
                      <p>
                        쌍용자동차 정리해고, 용산 참사, 구의역 참사, 세월호 참사, 태안화력발전소 사고 등 굵직한 산업재해와 사회적 참사의 현장에서 변호사로 활동해왔습니다. 특히 해고노동자나 기초생활수급자 등 돈이 없는 이들에게 무료 변론을 제공하며 &apos;거리의 변호사&apos;라는 별명을 얻었습니다.
                      </p>
                      <p>
                        2015년 정계에 입문하여 시민혁명당 창당추진위원장, 2019년 정의당 입당 후 2024년 정의당 제8대 당대표로 선출되었습니다. 윤석열 대통령 탄핵으로 열린 제21대 대선에서 사회대전환 연대회의 후보로 나서 노동자와 시민의 권리를 지키고 불평등한 사회구조를 바꾸기 위해 출마했습니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 약력 타임라인 탭 */}
            <div className={`tab-content ${activeTab === 'timeline' ? 'd-block' : 'd-none'}`}>
              <div className="row">
                <div className="col-lg-8 mx-auto">
                  <h2 className="display-5 fw-bold mb-4 text-center">권영국의 약력 타임라인</h2>
                  <p className="lead mb-5 text-center">
                    권영국의 삶과 활동의 주요 이벤트와 중요한 경력
                  </p>
                  
                  <div className="timeline-wrapper">
                    <div className="timeline-badge">
                      <i className="bi bi-person-fill"></i>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-content">
                        <h3>거리의 변호사</h3>
                        <p>권영국이 거리의 변호사로 활동하기 시작한 시기</p>
                      </div>
                    </div>
                  </div>
                  <div className="timeline-wrapper">
                    <div className="timeline-badge">
                      <i className="bi bi-briefcase-fill"></i>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-content">
                        <h3>정의당 당대표</h3>
                        <p>2019년 정의당 입당 후 2024년까지 당대표로 활동</p>
                      </div>
                    </div>
                  </div>
                  <div className="timeline-wrapper">
                    <div className="timeline-badge">
                      <i className="bi bi-megaphone-fill"></i>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-content">
                        <h3>대통령 후보</h3>
                        <p>윤석열 대통령 탄핵으로 열린 제21대 대선에서 사회대전환 연대회의 후보로 나서기</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 비전 탭 */}
            <div className={`tab-content ${activeTab === 'vision' ? 'd-block' : 'd-none'}`}>
              <div className="row">
                <div className="col-lg-8 mx-auto text-center mb-5">
                  <h2 className="display-5 fw-bold mb-4">시민과 함께하는 사회대전환</h2>
                  <p className="lead">
                    노동자와 시민의 권리를 지키며 평등하고 정의로운 대한민국을 위한 진정한 변화
                  </p>
                </div>
              </div>

              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-5">
                {[
                  {
                    title: '노동권 보장',
                    icon: '✊',
                    content: '모든 노동자의 단결권, 단체교섭권, 단체행동권을 보장하고, 일하는 모든 시민에게 노동권을 확대하겠습니다.'
                  },
                  {
                    title: '산업안전 확대',
                    icon: '🛡️',
                    content: '중대재해처벌법 강화와 산업안전보건법 철저한 시행으로 노동자의 생명과 안전을 최우선으로 하는 사회를 구축하겠습니다.'
                  },
                  {
                    title: '차별과 불평등 해소',
                    icon: '⚖️',
                    content: '재벌 대기업의 경제력 집중을 해소하고, 모든 국민이 차별 없이 존중받는 사회를 만들겠습니다.'
                  },
                  {
                    title: '기후위기 대응',
                    icon: '🌱',
                    content: '탈핵과 정의로운 에너지 전환을 통해 미래세대가 살아갈 지속가능한 지구를 지키겠습니다.'
                  },
                  {
                    title: '정치 민주주의 확대',
                    icon: '✊',
                    content: '광장의 민주주의, 시민이 주인되는 정치로 권력기관 개혁과 정치혁신을 이루겠습니다.'
                  },
                  {
                    title: '사회 안전망 강화',
                    icon: '🏥',
                    content: '모든 시민이 건강하고 안전하게 살 수 있도록 의료, 주거, 교육의 공공성을 강화하고 보편적 복지 체계를 구축하겠습니다.'
                  },
                  {
                    title: '인권과 연대의 가치',
                    icon: '🤝',
                    content: '약자와 소수자의 인권을 보호하고, 국내외 모든 시민과의 연대로 더 나은 세상을 만들어가겠습니다.'
                  }
                ].map((item, index) => (
                  <div className="col-md-6 col-lg-4" key={index}>
                    <div className="card h-100 border-0 shadow-sm hover-float">
                      <div className="card-body p-4 text-center">
                        <div className="display-4 mb-3">{item.icon}</div>
                        <h3 className="h4 card-title mb-3">{item.title}</h3>
                        <p className="card-text">{item.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 여담 탭 */}
            <div className={`tab-content ${activeTab === 'trivia' ? 'd-block' : 'd-none'}`}>
              <div className="row">
                <div className="col-lg-8 mx-auto text-center mb-5">
                  <h2 className="display-5 fw-bold mb-4">권영국의 다양한 모습</h2>
                  <p className="lead">
                    대선 후보의 인간적인 면모와 특별한 이야기들
                  </p>
                </div>
              </div>
              
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="card h-100 shadow-sm hover-lift">
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center mb-3">
                        <div className="bg-light rounded-circle p-3 me-3">
                          <span className="fs-4">🤸</span>
                        </div>
                        <h3 className="h5 mb-0">물구나무 대장</h3>
                      </div>
                      <p>&apos;물구나무서기&apos;를 즐겨하는 권영국 후보</p>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="card h-100 shadow-sm hover-lift">
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center mb-3">
                        <div className="bg-light rounded-circle p-3 me-3">
                          <span className="fs-4">🎵</span>
                        </div>
                        <h3 className="h5 mb-0">K-POP 팬</h3>
                      </div>
                      <p>탄핵정국에서 이어진 집회에서 K-POP에 많은 관심을 보였으며, 거리 집회의 문화예술에 높은 흥미를 가지고 있습니다.</p>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="card h-100 shadow-sm hover-lift">
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center mb-3">
                        <div className="bg-light rounded-circle p-3 me-3">
                          <span className="fs-4">🗣️</span>
                        </div>
                        <h3 className="h5 mb-0">일본어 능통</h3>
                      </div>
                      <p>일본 도쿠시마대학에서 유학하며 일본어를 익혔고, 재일교포 후손들에게 한국어를 가르치는 봉사활동을 하기도 했습니다.</p>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="card h-100 shadow-sm hover-lift">
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center mb-3">
                        <div className="bg-light rounded-circle p-3 me-3">
                          <span className="fs-4">🎤</span>
                        </div>
                        <h3 className="h5 mb-0">노래 실력</h3>
                      </div>
                      <p>3월 19일 광화문 '파면을 부르는 광장 노래자랑'에 참여해 '행복의 나라로'를 열창하는 등 음악적 재능도 갖추고 있습니다.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 추가 섹션: 소셜 미디어 및 통계 */}
      <section className="py-5 bg-dark text-white">
        <div className="container py-4">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <h2 className="display-5 fw-bold mb-4">권영국과 함께하세요</h2>
              <p className="lead mb-4">소셜 미디어에서 권영국 후보의 실시간 소식을 만나보세요</p>
              
              <div className="d-flex gap-3 mb-4">
                <a href="#" className="btn btn-lg btn-outline-light rounded-circle social-btn">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="#" className="btn btn-lg btn-outline-light rounded-circle social-btn">
                  <i className="bi bi-twitter"></i>
                </a>
                <a href="#" className="btn btn-lg btn-outline-light rounded-circle social-btn">
                  <i className="bi bi-instagram"></i>
                </a>
                <a href="#" className="btn btn-lg btn-outline-light rounded-circle social-btn">
                  <i className="bi bi-youtube"></i>
                </a>
              </div>
            </div>
            
            <div className="col-lg-6">
              <div className="row g-4">
                {[
                  { number: '15+', label: '정치 경력(년)' },
                  { number: '3,500+', label: '법률 지원 사례' },
                  { number: '200+', label: '발의 법안' },
                  { number: '1백만+', label: '지지자' }
                ].map((stat, index) => (
                  <div className="col-6" key={index}>
                    <div className="card bg-primary bg-opacity-25 border-0 text-center h-100">
                      <div className="card-body p-4">
                        <h3 className="display-4 fw-bold mb-2">{stat.number}</h3>
                        <p className="mb-0">{stat.label}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 기자 간담회 인용구 */}
      <div className="col-md-6 mb-5 mb-md-0">
        <blockquote className="blockquote text-muted fs-5 p-4 mb-0 bg-light text-center rounded-3 border-start border-5 border-primary">
          &ldquo;저는 청년들의 목소리를 듣고 그들의 꿈을 지원하기 위해 항상 노력할 것입니다. 우리 청년들은 대한민국의 미래입니다.&rdquo;
          <footer className="blockquote-footer mt-3">
            <cite title="Source Title">권영국, 청년 정책 기자 간담회 중</cite>
          </footer>
        </blockquote>
      </div>

      {/* CSS 스타일 */}
      <style jsx>{`
        .timeline-badge {
          width: 60px;
          height: 60px;
          z-index: 1;
        }
        
        .timeline-wrapper::before {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          left: 30px;
          width: 2px;
          background-color: var(--bs-primary);
          opacity: 0.5;
        }
        
        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
        
        .hover-float {
          transition: transform 0.3s ease;
        }
        
        .hover-float:hover {
          transform: translateY(-10px);
        }
        
        .social-btn {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        
        .social-btn:hover {
          background-color: var(--bs-white);
          color: var(--bs-dark);
          transform: translateY(-5px);
        }
        
        .nav-tabs-wrapper {
          z-index: 10;
          top: 0;
        }
        
        .nav-link {
          transition: all 0.3s ease;
          white-space: nowrap;
        }
        
        .nav-link:not(.active):hover {
          background-color: rgba(var(--bs-primary-rgb), 0.1);
          color: var(--bs-primary);
        }
      `}</style>
    </div>
  );
} 