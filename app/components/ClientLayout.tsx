'use client';

import Link from 'next/link';
import Image from 'next/image';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../globals.css';
import '../styles.css';
import ClientBootstrap from './ClientBootstrap';
import { usePathname } from 'next/navigation';
import { Analytics } from '@vercel/analytics/react';
import StyledComponentsRegistry from '../lib/registry';
import PolicyFooter from '@/app/components/PolicyFooter';
import { useState, useEffect } from 'react';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const isStudioRoute = pathname?.startsWith('/studio');
  const [isPolicyExpanded, setIsPolicyExpanded] = useState(false);

  // 메뉴 외부 클릭 시 닫기 처리
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const navbar = document.getElementById('navbarNav');
      const toggler = document.querySelector('.navbar-toggler');
      
      if (navbar?.classList.contains('show') && 
          !navbar.contains(event.target as Node) && 
          !toggler?.contains(event.target as Node)) {
        // Bootstrap의 collapse 인스턴스를 가져와서 닫기
        const bsCollapse = new (window as any).bootstrap.Collapse(navbar);
        bsCollapse.hide();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // 스튜디오 경로인 경우 헤더와 푸터 없이 그대로 렌더링
  if (isStudioRoute) {
    return (
      <>
        {children}
        <Analytics />
      </>
    );
  }

  return (
    <StyledComponentsRegistry>
      <ClientBootstrap />
      <header 
        className="sticky-header shadow-sm"
        style={{
          background: 'linear-gradient(90deg, #FF0000 0%, #FFed00 50%, #00a366 100%)'
        }}
      >
        <div className="container">
          <nav className="navbar navbar-expand-lg">
            <div className="container-fluid">
              <Link href="/" className="navbar-brand text-white">
                <div className="subtitle-container">
                  <span className="site-title subtitle d-block brand-text">사회대전환 연대회의 대통령 후보</span>
                </div>
                <div className="d-flex align-items-center">
                  <div className="logo-container">
                    <Image 
                      src="/images/header.png"
                      alt="민주노동당 권영국 후보 로고" 
                      width={280} 
                      height={40} 
                      className="header-logo"
                      style={{ marginRight: '8px', objectFit: 'contain' }}
                      priority
                    />
                  </div>
                  <span className="fs-1 site-title brand-text">권영국</span>
                </div>
              </Link>
              <button 
                className="navbar-toggler" 
                type="button" 
                data-bs-toggle="collapse" 
                data-bs-target="#navbarNav"
                style={{
                  borderColor: 'rgba(255,255,255,0.5)'
                }}
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                <button className="mobile-menu-close d-lg-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                  <i className="bi bi-x"></i>
                </button>
                <ul className="navbar-nav ms-auto">
                  <li className="nav-item d-lg-none">
                    <Link href="/" className="nav-link nav-button text-white fw-normal fs-5 px-2 py-1 site-title">
                      처음으로
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/profile" className="nav-link nav-button text-white fw-normal fs-5 px-2 py-1 site-title">소개</Link>
                  </li>
                  <li className="nav-item d-lg-none">
                    <button 
                      className="nav-link nav-button text-white fw-normal fs-5 px-2 py-1 site-title w-100 text-start border-0 bg-transparent d-flex justify-content-between align-items-center"
                      onClick={() => setIsPolicyExpanded(!isPolicyExpanded)}
                    >
                      정책
                      <i className={`bi bi-chevron-${isPolicyExpanded ? 'up' : 'down'} ms-2`}></i>
                    </button>
                    {isPolicyExpanded && (
                      <ul className="list-unstyled ms-3">
                        <li>
                          <Link 
                            href="/policies/carousel" 
                            className="nav-link text-white fw-normal fs-6 px-2 py-1"
                            onClick={() => {
                              const navbar = document.getElementById('navbarNav');
                              const bsCollapse = new (window as any).bootstrap.Collapse(navbar);
                              bsCollapse.hide();
                            }}
                          >
                            10대정책
                          </Link>
                        </li>
                        <li>
                          <Link 
                            href="/policies/scti" 
                            className="nav-link text-white fw-normal fs-6 px-2 py-1"
                            onClick={() => {
                              const navbar = document.getElementById('navbarNav');
                              const bsCollapse = new (window as any).bootstrap.Collapse(navbar);
                              bsCollapse.hide();
                            }}
                          >
                            유형테스트
                          </Link>
                        </li>
                        <li>
                          <Link 
                            href="/policies/gallery" 
                            className="nav-link text-white fw-normal fs-6 px-2 py-1"
                            onClick={() => {
                              const navbar = document.getElementById('navbarNav');
                              const bsCollapse = new (window as any).bootstrap.Collapse(navbar);
                              bsCollapse.hide();
                            }}
                          >
                            정책갤러리
                          </Link>
                        </li>
                      </ul>
                    )}
                  </li>
                  <li className="nav-item d-none d-lg-block">
                    <Link href="/policies/main" className="nav-link nav-button text-white fw-normal fs-5 px-2 py-1 site-title">정책</Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/posts" className="nav-link nav-button text-white fw-normal fs-5 px-2 py-1 site-title">뉴스</Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/events" className="nav-link nav-button text-white fw-normal fs-5 px-2 py-1 site-title">일정</Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/join" className="nav-link nav-button text-white fw-normal fs-5 px-2 py-1 site-title">함께하기</Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </header>
      <div className="header-spacer"></div>

      <main>
        {children}
      </main>

      <PolicyFooter />
      <Analytics />
    </StyledComponentsRegistry>
  );
} 