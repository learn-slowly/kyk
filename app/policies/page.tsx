'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function PoliciesPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const categoriesRef = useRef<HTMLDivElement>(null);
  
  // 스크롤 이벤트 추적
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 정책 카테고리 데이터
  const categories = [
    { id: 'all', name: '모든 정책' },
    { id: 'economy', name: '경제' },
    { id: 'welfare', name: '복지' },
    { id: 'education', name: '교육' },
    { id: 'environment', name: '환경' },
    { id: 'diplomacy', name: '외교' },
    { id: 'tech', name: '과학기술' },
    { id: 'culture', name: '문화' }
  ];

  // 정책 카드 데이터
  const policies = [
    {
      id: 1,
      title: '정책1',
      category: 'economy',
      summary: '정책1 세부내용',
      icon: '💼',
      color: 'primary',
    },
    {
      id: 2,
      title: '정책2',
      category: 'environment',
      summary: '정책2 세부내용',
      icon: '🌱',
      color: 'success',
    },
    {
      id: 3,
      title: '정책3',
      category: 'education',
      summary: '정책3 세부내용',
      icon: '🎓',
      color: 'info',
    },
    {
      id: 4,
      title: '정책4',
      category: 'tech',
      summary: '정책4 세부내용',
      icon: '💻',
      color: 'warning',
    },
    {
      id: 5,
      title: '정책5',
      category: 'welfare',
      summary: '정책5 세부내용',
      icon: '🛡️',
      color: 'danger',
    },
    {
      id: 6,
      title: '정책6',
      category: 'culture',
      summary: '정책6 세부내용',
      icon: '🎨',
      color: 'secondary',
    },
    {
      id: 7,
      title: '정책7',
      category: 'diplomacy',
      summary: '정책7 세부내용',
      icon: '🕊️',
      color: 'primary',
    },
    {
      id: 8,
      title: '정책8',
      category: 'economy',
      summary: '정책8 세부내용',
      icon: '🏭',
      color: 'success',
    },
    {
      id: 9,
      title: '정책9',
      category: 'welfare',
      summary: '정책9 세부내용',
      icon: '🏠',
      color: 'info',
    }
  ];

  // 카테고리별 필터링된 정책
  const filteredPolicies = activeCategory === 'all' 
    ? policies 
    : policies.filter(policy => policy.category === activeCategory);

  // 카테고리 스크롤 핸들링
  const scrollCategories = (direction: 'left' | 'right') => {
    if (!categoriesRef.current) return;
    
    const scrollAmount = 200;
    const currentScroll = categoriesRef.current.scrollLeft;
    
    categoriesRef.current.scrollTo({
      left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <div className="policies-page">
      {/* 헤더 배너 */}
      <section 
        className="position-relative py-5 text-white"
        style={{
          background: 'linear-gradient(90deg, #FF0000 0%, #FFed00 50%, #00a366 100%)',
          overflow: 'hidden'
        }}
      >
        <div 
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: `url('/pattern-grid.png')`,
            opacity: 0.1,
            backgroundSize: '20px',
            transform: `translateY(${scrollY * 0.2}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        ></div>
        
        <div className="container py-5">
          <div className="row justify-content-center align-items-center">
            <div className="col-lg-6 text-lg-start text-center">
              <h1 className="display-3 fw-bold mb-4 position-relative">정책 공약</h1>
              <p className="lead fs-4 mb-0 d-inline-block" style={{ 
                fontWeight: 500,
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                padding: '5px 15px',
                borderRadius: '4px'
              }}>
                권영국 후보가 사회대전환을 위해 준비한 정책 공약을 소개합니다
              </p>
            </div>
            <div className="col-lg-6 text-center d-none d-lg-block">
              <img 
                src="/images/7.png" 
                alt="권영국 후보" 
                className="img-fluid rounded-3"
                style={{ 
                  maxHeight: '300px',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                  transform: `translateY(${scrollY * 0.05}px)`,
                  transition: 'transform 0.1s ease-out'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 정책 카테고리 필터 */}
      <section className="bg-light py-4 border-bottom sticky-top shadow-sm">
        <div className="container">
          <div className="d-flex align-items-center position-relative">
            <button 
              className="btn btn-sm btn-light border rounded-circle me-2 category-scroll-btn" 
              onClick={() => scrollCategories('left')}
              aria-label="이전 카테고리"
            >
              &lt;
            </button>
            
            <div 
              className="categories-wrapper overflow-auto d-flex flex-nowrap hide-scrollbar"
              ref={categoriesRef}
            >
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`btn ${activeCategory === category.id ? 'btn-primary' : 'btn-outline-primary'} rounded-pill me-2 flex-shrink-0`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
            
            <button 
              className="btn btn-sm btn-light border rounded-circle ms-2 category-scroll-btn" 
              onClick={() => scrollCategories('right')}
              aria-label="다음 카테고리"
            >
              &gt;
            </button>
          </div>
        </div>
      </section>

      {/* 정책 목록 */}
      <section className="py-5">
        <div className="container py-4">
          <div className="row g-4">
            {filteredPolicies.length > 0 ? (
              filteredPolicies.map((policy) => (
                <div 
                  className="col-md-6 col-lg-4" 
                  key={policy.id}
                  onMouseEnter={() => setHoveredCard(policy.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div 
                    className={`card policy-card h-100 border-0 shadow-sm ${hoveredCard === policy.id ? 'hovered' : ''}`}
                    style={{ 
                      transform: `perspective(1000px) rotateY(${hoveredCard === policy.id ? '5deg' : '0'}) rotateX(${hoveredCard === policy.id ? '-5deg' : '0'})`,
                      transition: 'all 0.5s ease',
                      opacity: hoveredCard !== null && hoveredCard !== policy.id ? 0.8 : 1
                    }}
                  >
                    <div className={`card-header bg-${policy.color} text-white p-4 text-center`}>
                      <div className="display-3 mb-2">{policy.icon}</div>
                      <h3 className="card-title h4 mb-0">{policy.title}</h3>
                    </div>
                    <div className="card-body p-4">
                      <p className="card-text">{policy.summary}</p>
                      <div className="mt-auto pt-3 text-end">
                        <Link href={`/policies/${policy.id}`} className="btn btn-outline-primary">
                          자세히 보기
                        </Link>
                      </div>
                    </div>
                    
                    {/* 3D 효과를 위한 하이라이트 오버레이 */}
                    {hoveredCard === policy.id && (
                      <div 
                        className="position-absolute top-0 start-0 w-100 h-100 card-highlight" 
                        style={{
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 100%)',
                          pointerEvents: 'none',
                          borderRadius: 'inherit'
                        }}
                      ></div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <p className="lead text-muted">선택한 카테고리에 해당하는 정책이 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 공약집 다운로드 섹션 */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <div className="row align-items-center">
            <div className="col-lg-7 mb-4 mb-lg-0">
              <h2 className="display-5 fw-bold mb-4">권영국 대선 공약집</h2>
              <p className="lead mb-4">
                권영국 후보의 모든 공약을 담은 공약집을 다운로드하여 자세히 살펴보세요.
                사회대전환을 위한 구체적이고 실현 가능한 정책들이 담겨있습니다.
              </p>
              <div className="d-flex gap-3">
                <button className="btn btn-primary btn-lg">
                  <i className="bi bi-file-pdf me-2"></i> PDF 다운로드
                </button>
                <button className="btn btn-outline-primary btn-lg">
                  <i className="bi bi-printer me-2"></i> 인쇄용 버전
                </button>
              </div>
            </div>
            <div className="col-lg-5 text-center">
              <div 
                className="policy-book-wrapper position-relative"
                style={{ 
                  transform: `rotate(${scrollY * 0.02}deg)`,
                  transition: 'transform 0.1s ease-out'
                }}
              >
                <div className="policy-book shadow-lg">
                  <img 
                    src="/images/7.png" 
                    alt="권영국 대선 공약집" 
                    className="img-fluid rounded-3 shadow-lg"
                    style={{ width: '100%', height: 'auto' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CSS 스타일 */}
      <style jsx>{`
        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        .policy-card {
          will-change: transform;
          transform-style: preserve-3d;
          backface-visibility: hidden;
        }
        
        .policy-card.hovered {
          box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
        }
        
        .categories-wrapper {
          max-width: calc(100% - 80px);
          padding: 0.5rem 0;
        }
        
        .category-scroll-btn {
          height: 32px;
          width: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
        }
        
        .policy-book {
          width: 300px;
          height: 400px;
          margin: 0 auto;
          perspective: 1000px;
        }
        
        .policy-book-cover {
          width: 100%;
          height: 100%;
          box-shadow: 5px 5px 20px rgba(0,0,0,0.2);
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        
        .gradient-bg {
          background: linear-gradient(135deg, #FF0000 0%, #FFed00 50%, #00a366 100%);
        }
        
        .policies-page .lead {
          font-weight: 500;
        }
        
        .position-relative {
          z-index: 1;
        }
      `}</style>
    </div>
  );
} 