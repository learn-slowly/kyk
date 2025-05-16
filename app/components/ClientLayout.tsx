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

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const isStudioRoute = pathname?.startsWith('/studio');

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
                  <li className="nav-item">
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