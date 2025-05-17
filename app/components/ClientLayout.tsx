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
import styled from 'styled-components';

const HeaderLogo = styled(Image)`
  @media (max-width: 480px) {
    width: 180px !important;
    height: 26px !important;
  }

  @media (max-width: 360px) {
    width: 150px !important;
    height: 22px !important;
  }
`;

const LogoContainer = styled.div`
  @media (max-width: 991px) {
    margin-left: 1rem;
  }

  @media (min-width: 992px) {
    margin-left: 1rem;
  }
`;

const BrandText = styled.span`
  font-size: 2rem;
  font-family: 'GamtanRoad Gamtan', sans-serif;

  &.subtitle {
    font-size: 0.9rem;
    opacity: 0.9;
  }

  @media (max-width: 480px) {
    font-size: 1.3rem;

    &.subtitle {
      font-size: 0.75rem;
    }
  }

  @media (max-width: 360px) {
    font-size: 1.1rem;

    &.subtitle {
      font-size: 0.7rem;
    }
  }
`;

const NavbarToggler = styled.button`
  padding: 2px 6px;
  margin-left: 4px;
  position: relative;
  
  @media (max-width: 991px) {
    margin-right: 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 0px 4px;
  }
`;

const MenuIcon = styled.div`
  width: 24px;
  height: 20px;
  position: relative;
  transform: rotate(0deg);
  transition: .5s ease-in-out;
  cursor: pointer;

  @media (max-width: 480px) {
    width: 20px;
    height: 16px;
  }

  span {
    display: block;
    position: absolute;
    height: 2px;
    width: 100%;
    background: white;
    border-radius: 2px;
    opacity: 1;
    left: 0;
    transform: rotate(0deg);
    transition: .25s ease-in-out;

    &:nth-child(1) {
      top: 0px;
    }

    &:nth-child(2) {
      top: 9px;
      @media (max-width: 480px) {
        top: 7px;
      }
    }

    &:nth-child(3) {
      top: 18px;
      @media (max-width: 480px) {
        top: 14px;
      }
    }
  }

  &.open span {
    &:nth-child(1) {
      top: 9px;
      transform: rotate(135deg);
      @media (max-width: 480px) {
        top: 7px;
      }
    }

    &:nth-child(2) {
      opacity: 0;
      left: -60px;
    }

    &:nth-child(3) {
      top: 9px;
      transform: rotate(-135deg);
      @media (max-width: 480px) {
        top: 7px;
      }
    }
  }
`;

const NavbarCollapse = styled.div`
  @media (max-width: 991px) {
    background: none !important;
    border: none !important;
  }
`;

const NavMenu = styled.ul`
  margin-left: auto;
  width: 100%;
  max-width: 240px;
  padding: 0;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: 1rem;
  align-items: center;

  @media (min-width: 992px) {
    max-width: none;
    gap: 2.5rem;
    margin-right: 1.5rem;
  }

  @media (max-width: 991px) {
    flex-direction: column;
    align-items: stretch;
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(10px);
    border-radius: 8px;
    margin-top: 1rem;
    margin-right: 0.5rem;
    margin-left: 0.5rem;
    width: calc(100% - 1rem);
    max-width: none;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  }

  .nav-link {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1rem;
    transition: all 0.2s ease;
    font-size: 1.1rem !important;
    font-weight: 500 !important;
    color: rgba(255, 255, 255, 0.95) !important;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    white-space: nowrap;
    border-radius: 4px;
    gap: 0.35rem;

    @media (min-width: 992px) {
      padding: 0.5rem;
      font-size: 1.15rem !important;
      font-weight: 600 !important;

      &:hover {
        background: rgba(255, 255, 255, 0.15);
        color: white !important;
      }
    }

    @media (max-width: 991px) {
      &:hover {
        background: rgba(255, 255, 255, 0.15);
        color: white !important;
      }
    }
  }

  .policy-arrow {
    margin-left: 0.5rem;
    font-size: 0.8em;
    opacity: 0.8;
    transition: transform 0.2s ease;

    @media (min-width: 992px) {
      font-size: 0.7em;
      margin-left: 0.25rem;
      margin-top: 2px;
    }
  }
`;

const SubMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  background: rgba(0, 0, 0, 0.3);
  
  @media (min-width: 992px) {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(10px);
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    min-width: 240px;
    display: none;
    padding: 0.25rem;
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 0.2rem;
  }
  
  li {
    margin: 0;

    a {
      padding: 0.75rem 1.5rem !important;
      font-size: 1rem !important;
      font-weight: 400 !important;
      color: rgba(255, 255, 255, 0.9) !important;
      display: block;
      text-align: left;

      @media (min-width: 992px) {
        padding: 0.25rem 0.5rem !important;
        text-align: center;
        font-size: 0.75rem !important;
        font-weight: 300 !important;
        letter-spacing: 0;
        white-space: nowrap;
        border-radius: 3px;
        
        &:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white !important;
        }
      }
    }
  }
`;

const NavItem = styled.li`
  @media (min-width: 992px) {
    position: relative;

    &.policy-menu-open {
      ${SubMenu} {
        display: flex;
      }
      .policy-arrow {
        transform: rotate(180deg);
        opacity: 1;
      }
    }
  }
`;

const NavbarContainer = styled.div`
  padding: 0 2rem;
  
  @media (min-width: 992px) {
    padding: 0 3rem 0 4rem;
  }
  
  @media (max-width: 991px) {
    padding: 0 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 0 1rem;
  }
`;

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const isStudioRoute = pathname?.startsWith('/studio');
  const [isPolicyExpanded, setIsPolicyExpanded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 992);
    };
    
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // 페이지 변경 시 메뉴 닫기
  useEffect(() => {
    setIsMenuOpen(false);
    setIsPolicyExpanded(false);
    
    const navbar = document.getElementById('navbarNav');
    if (navbar?.classList.contains('show')) {
      if (typeof window !== 'undefined' && (window as any).bootstrap?.Collapse) {
        const bsCollapse = new (window as any).bootstrap.Collapse(navbar);
        bsCollapse.hide();
      } else {
        navbar.classList.remove('show');
      }
    }
  }, [pathname]);

  // 메뉴 외부 클릭 시 닫기 처리
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const navbar = document.getElementById('navbarNav');
      const toggler = document.querySelector('.navbar-toggler');
      const policyMenu = document.querySelector('.policy-menu');
      const target = event.target as Node;
      
      // 정책 메뉴 외부 클릭 시 닫기
      if (policyMenu && !policyMenu.contains(target)) {
        setIsPolicyExpanded(false);
      }

      if (navbar?.classList.contains('show') && 
          !navbar.contains(target) && 
          !toggler?.contains(target)) {
        if (typeof window !== 'undefined' && (window as any).bootstrap?.Collapse) {
          const bsCollapse = new (window as any).bootstrap.Collapse(navbar);
          bsCollapse.hide();
          setIsMenuOpen(false);
        } else {
          navbar.classList.remove('show');
          setIsMenuOpen(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside, true);
    document.addEventListener('touchstart', handleClickOutside, true);

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
      document.removeEventListener('touchstart', handleClickOutside, true);
    };
  }, []);

  useEffect(() => {
    const navbar = document.getElementById('navbarNav');
    if (navbar) {
      navbar.addEventListener('show.bs.collapse', () => setIsMenuOpen(true));
      navbar.addEventListener('hide.bs.collapse', () => setIsMenuOpen(false));
    }
    return () => {
      if (navbar) {
        navbar.removeEventListener('show.bs.collapse', () => setIsMenuOpen(true));
        navbar.removeEventListener('hide.bs.collapse', () => setIsMenuOpen(false));
      }
    };
  }, []);

  // 정책 메뉴 토글 함수
  const togglePolicyMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPolicyExpanded(!isPolicyExpanded);
  };

  // 메뉴 닫기 함수
  const closeMenu = () => {
    const navbar = document.getElementById('navbarNav');
    if (navbar) {
      if (typeof window !== 'undefined' && (window as any).bootstrap?.Collapse) {
        const bsCollapse = new (window as any).bootstrap.Collapse(navbar);
        bsCollapse.hide();
      } else {
        navbar.classList.remove('show');
      }
      setIsPolicyExpanded(false);
    }
  };

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
        <nav className="navbar navbar-expand-lg py-1">
          <NavbarContainer className="container-fluid p-0">
            <Link href="/" className="navbar-brand text-white pe-0">
              <LogoContainer>
                <div className="subtitle-container">
                  <BrandText className="subtitle d-block brand-text">사회대전환 연대회의 대통령 후보</BrandText>
                </div>
                <div className="d-flex align-items-center">
                  <div className="logo-container">
                    <HeaderLogo 
                      src="/images/header.png"
                      alt="민주노동당 권영국 후보 로고" 
                      width={280} 
                      height={40} 
                      className="header-logo"
                      style={{ marginRight: '4px', objectFit: 'contain' }}
                      priority
                    />
                  </div>
                  <BrandText className="brand-text">권영국</BrandText>
                </div>
              </LogoContainer>
            </Link>
            <NavbarToggler 
              className="navbar-toggler" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#navbarNav"
              style={{
                borderColor: 'rgba(255,255,255,0.5)'
              }}
            >
              <MenuIcon className={isMenuOpen ? 'open' : ''}>
                <span></span>
                <span></span>
                <span></span>
              </MenuIcon>
            </NavbarToggler>
            <NavbarCollapse className="collapse navbar-collapse" id="navbarNav">
              <NavMenu className="navbar-nav">
                <li className="nav-item d-lg-none">
                  <Link 
                    href="/" 
                    className="nav-link nav-button text-white fw-normal fs-5 site-title"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    처음으로
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    href="/profile" 
                    className="nav-link nav-button text-white fw-normal fs-5 site-title"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    소개
                  </Link>
                </li>
                <NavItem 
                  className={`nav-item policy-menu ${isPolicyExpanded ? 'policy-menu-open' : ''}`}
                >
                  <a 
                    href="#"
                    className="nav-link nav-button text-white fw-normal fs-5 site-title"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsPolicyExpanded(prev => !prev);
                    }}
                  >
                    정책
                    <i className="bi bi-chevron-down policy-arrow"></i>
                  </a>
                  {isPolicyExpanded && (
                    <SubMenu>
                      <li>
                        <Link 
                          href="/policies/carousel" 
                          className="nav-link nav-button text-white fw-normal site-title"
                          onClick={() => {
                            setIsMenuOpen(false);
                            setIsPolicyExpanded(false);
                          }}
                        >
                          10대 공약
                        </Link>
                      </li>
                      <li>
                        <Link 
                          href="/policies/scti" 
                          className="nav-link nav-button text-white fw-normal site-title"
                          onClick={() => {
                            setIsMenuOpen(false);
                            setIsPolicyExpanded(false);
                          }}
                        >
                          SCTI 테스트
                        </Link>
                      </li>
                      <li>
                        <Link 
                          href="/policies/gallery" 
                          className="nav-link nav-button text-white fw-normal site-title"
                          onClick={() => {
                            setIsMenuOpen(false);
                            setIsPolicyExpanded(false);
                          }}
                        >
                          정책 갤러리
                        </Link>
                      </li>
                    </SubMenu>
                  )}
                </NavItem>
                <li className="nav-item">
                  <Link 
                    href="/posts" 
                    className="nav-link nav-button text-white fw-normal fs-5 site-title"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    뉴스
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    href="/events" 
                    className="nav-link nav-button text-white fw-normal fs-5 site-title"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    일정
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    href="/join" 
                    className="nav-link nav-button text-white fw-normal fs-5 site-title"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    함께하기
                  </Link>
                </li>
              </NavMenu>
            </NavbarCollapse>
          </NavbarContainer>
        </nav>
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