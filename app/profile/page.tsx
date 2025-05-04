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
          background: 'linear-gradient(90deg, #FF0000 0%, #FFFF00 50%, #00FF00 100%)',
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
                국민의 삶을 바꾸는 진정한 변화를 이끌 차기 대통령 후보
              </p>
              <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-lg-start">
                <span className="badge bg-white text-primary fs-6 px-3 py-2 me-2 mb-2">정치인</span>
                <span className="badge bg-white text-primary fs-6 px-3 py-2 me-2 mb-2">법률가</span>
                <span className="badge bg-white text-primary fs-6 px-3 py-2 me-2 mb-2">경제 전문가</span>
                <span className="badge bg-white text-primary fs-6 px-3 py-2 mb-2">교육 개혁가</span>
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
                    background: 'linear-gradient(135deg, rgba(255,0,0,0.2) 0%, rgba(255,255,0,0.1) 50%, rgba(0,255,0,0.2) 100%)',
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
          {/* 네비게이션 탭 */}
          <div className="nav-tabs-wrapper mb-5 border-bottom sticky-top bg-light py-2 px-2 rounded shadow-sm">
            <ul className="nav nav-pills gap-1 flex-nowrap overflow-auto">
              {[
                { id: 'bio', label: '약력' },
                { id: 'vision', label: '비전' },
                { id: 'values', label: '가치관' },
                { id: 'education', label: '학력' },
                { id: 'career', label: '경력' },
                { id: 'achievements', label: '주요 성과' }
              ].map(tab => (
                <li className="nav-item" key={tab.id}>
                  <button
                    className={`nav-link px-4 py-2 ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* 약력 */}
          <div className={`tab-content ${activeTab === 'bio' ? 'd-block' : 'd-none'}`}>
            <div className="row">
              <div className="col-lg-8 mx-auto">
                <h2 className="display-5 fw-bold mb-4 text-center">권영국 약력</h2>
                <p className="lead mb-5 text-center">
                  대한민국의 미래를 위해 힘쓰는 정치인, 법률가, 경제 전문가
                </p>
                
                {/* 타임라인 */}
                <div className="timeline-wrapper position-relative">
                  {[
                    { 
                      year: '1970', 
                      title: '서울 출생',
                      content: '서울특별시 종로구에서 3남 1녀 중 둘째로 출생'
                    },
                    { 
                      year: '1993', 
                      title: '서울대학교 법학과 졸업',
                      content: '법학사 학위 취득 및 동대학원 진학'
                    },
                    { 
                      year: '1996', 
                      title: '변호사 자격 취득',
                      content: '제38회 사법시험 합격 및 사법연수원 28기 수료'
                    },
                    { 
                      year: '2000', 
                      title: '법무법인 정의 설립',
                      content: '시민의 권리 보호를 위한 법무법인 설립 및 대표변호사 취임'
                    },
                    { 
                      year: '2008', 
                      title: '국회의원 당선',
                      content: '제18대 국회의원 선거 당선 (서울 종로구)'
                    },
                    { 
                      year: '2012', 
                      title: '재선 성공',
                      content: '제19대 국회의원 재선 성공 및 법제사법위원회 활동'
                    },
                    { 
                      year: '2016', 
                      title: '경제정의특별위원회 위원장',
                      content: '경제정의 실현과 서민경제 활성화를 위한 특별위원회 위원장 역임'
                    },
                    { 
                      year: '2020', 
                      title: '민생당 원내대표',
                      content: '민생당 원내대표 및 정책위원회 의장 역임'
                    },
                    { 
                      year: '2023', 
                      title: '대선 출마 선언',
                      content: '더 나은 대한민국을 위한 대통령 선거 출마 선언'
                    }
                  ].map((item, index) => (
                    <div 
                      key={index} 
                      className="timeline-item position-relative mb-5 ps-5"
                      style={{
                        opacity: isScrolled ? 1 : 0.8,
                        transform: isScrolled ? 'translateY(0)' : 'translateY(10px)',
                        transition: `all 0.5s ease ${index * 0.1}s`
                      }}
                    >
                      <div className="timeline-badge position-absolute start-0 top-0 rounded-circle bg-primary text-white fw-bold d-flex align-items-center justify-content-center">
                        {item.year}
                      </div>
                      <div className="timeline-content bg-white p-4 rounded shadow-sm border-start border-5 border-primary hover-lift">
                        <h3 className="h4 mb-2">{item.title}</h3>
                        <p className="mb-0 text-muted">{item.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 비전 */}
          <div className={`tab-content ${activeTab === 'vision' ? 'd-block' : 'd-none'}`}>
            <div className="row">
              <div className="col-lg-8 mx-auto text-center mb-5">
                <h2 className="display-5 fw-bold mb-4">국민과 함께하는 비전</h2>
                <p className="lead">
                  변화와 혁신, 그리고 포용과 통합의 정신으로 국민과 함께 만드는 미래
                </p>
              </div>

              <div className="col-lg-10 mx-auto">
                <div className="row g-4">
                  {[
                    {
                      title: '경제 민주화',
                      icon: '💰',
                      content: '기업과 중소상공인이 상생하는 경제 생태계를 구축하고, 양극화 해소를 위한 경제 정책을 실현합니다.'
                    },
                    {
                      title: '일자리 창출',
                      icon: '👔',
                      content: '4차 산업혁명 시대에 맞는 미래 일자리 창출과 안정적인 고용 환경 조성에 힘쓰겠습니다.'
                    },
                    {
                      title: '복지 강화',
                      icon: '👪',
                      content: '아동부터 노인까지 생애주기별 맞춤형 복지 정책으로 모든 국민이 안심하고 살 수 있는 사회를 만들겠습니다.'
                    },
                    {
                      title: '교육 혁신',
                      icon: '🎓',
                      content: '창의적 인재 양성을 위한 교육 시스템 혁신과 평생학습 체계 구축을 통해 미래 사회에 대비합니다.'
                    },
                    {
                      title: '디지털 전환',
                      icon: '🌐',
                      content: '디지털 경제로의 전환을 가속화하고, 디지털 격차 해소를 위한 정책적 지원을 강화하겠습니다.'
                    },
                    {
                      title: '환경과 지속가능성',
                      icon: '🌱',
                      content: '탄소중립 사회로의 전환을 위한 정책을 추진하고, 미래 세대를 위한 지속가능한 발전을 추구합니다.'
                    }
                  ].map((vision, index) => (
                    <div className="col-md-6 col-lg-4" key={index}>
                      <div className="card h-100 border-0 shadow-sm hover-float">
                        <div className="card-body p-4 text-center">
                          <div className="display-4 mb-3">{vision.icon}</div>
                          <h3 className="h4 card-title mb-3">{vision.title}</h3>
                          <p className="card-text">{vision.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 다른 탭 콘텐츠 (간략히 표시) */}
          <div className={`tab-content ${activeTab !== 'bio' && activeTab !== 'vision' ? 'd-block' : 'd-none'}`}>
            <div className="text-center py-5">
              <h2 className="display-5 fw-bold mb-4">준비 중입니다</h2>
              <p className="lead">선택한 &ldquo;{activeTab === 'values' ? '가치관' : 
                                  activeTab === 'education' ? '학력' : 
                                  activeTab === 'career' ? '경력' : 
                                  '주요 성과'}&rdquo; 정보는 현재 준비 중입니다.</p>
              <div className="spinner-border text-primary mt-4" role="status">
                <span className="visually-hidden">로딩중...</span>
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