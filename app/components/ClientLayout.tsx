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
      font-size: 1.3rem !important;
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
  padding: 0.5rem 0;
  margin: 0;
  background: rgba(0, 0, 0, 0.3);
  display: none;
  width: 100%;
  z-index: 1000;

  @media (min-width: 992px) {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.65);
    backdrop-filter: blur(8px);
    border-radius: 3px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.12);
    min-width: 170px;
    padding: 0.1rem;
    width: auto;
  }
  
  li {
    margin: 0;
    a, Link {
      padding: 0.75rem 1.5rem !important;
      font-size: 1rem !important;
      font-weight: 400 !important;
      color: rgba(255, 255, 255, 0.9) !important;
      display: block;
      text-align: left;
      text-decoration: none;

      @media (min-width: 992px) {
        padding: 0.3rem 0.7rem !important;
        text-align: center;
        font-size: 0.5rem !important;
        font-weight: 100 !important;
        font-family: 'Pretendard', sans-serif;
        letter-spacing: 0.01em;
        color: rgba(255, 255, 255, 0.6) !important;
        transition: all 0.15s ease;
        opacity: 0.9;
      }

      @media (max-width: 991px) {
        padding: 0.75rem 2rem !important;
        background-color: rgba(255,255,255,0.05);
      }
        
      &:hover {
        background: rgba(255, 255, 255, 0.1);
        color: white !important;

        @media (min-width: 992px) {
          background: rgba(255, 255, 255, 0.05);
          transform: translateY(-1px);
          color: rgba(255, 255, 255, 0.95) !important;
        }
      }
    }
  }
`;

const NavItem = styled.li`
  position: relative;

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
    cursor: pointer;

    @media (min-width: 992px) {
      padding: 0.5rem;
      font-size: 1.3rem !important;
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

  &.policy-menu-open > ${SubMenu},
  &.profile-menu-open > ${SubMenu},
  &:hover > ${SubMenu} {
    @media (min-width: 992px) {
      display: flex !important;
      flex-direction: row;
      justify-content: center;
      gap: 0.2rem;
    }
  }
  
  &.policy-menu-open > ${SubMenu},
  &.profile-menu-open > ${SubMenu} {
    @media (max-width: 991px) {
      display: block;
    }
  }

  &.policy-menu-open .policy-arrow,
  &.profile-menu-open .policy-arrow {
    transform: rotate(180deg);
    opacity: 1;
  }
  
  @media (min-width: 992px) {
    &:hover .policy-arrow {
      transform: rotate(180deg);
      opacity: 1;
    }
  }

  @media (max-width: 991px) {
    width: 100%;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    &:last-child {
      border-bottom: none;
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
  const [isProfileExpanded, setIsProfileExpanded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const checkDesktop = () => {
      const desktop = window.innerWidth >= 992;
      setIsDesktop(desktop);
      if (desktop) {
        setIsPolicyExpanded(false);
        setIsProfileExpanded(false);
      }
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  useEffect(() => {
    console.log(`[Page Change Effect] Path: ${pathname}, IsDesktop: ${isDesktop}`);
    setIsMenuOpen(false);
    
    if (typeof window !== 'undefined' && (window as any).bootstrap?.Collapse) {
      const navbar = document.getElementById('navbarNav');
      if (navbar && navbar.classList.contains('show')) {
        const bsCollapse = new (window as any).bootstrap.Collapse(navbar);
        bsCollapse.hide();
      }
    }
    
    if (isDesktop === false) {
      if (!pathname.startsWith('/policies')) {
        setIsPolicyExpanded(false);
      }
      if (!pathname.startsWith('/profile')) {
        setIsProfileExpanded(false);
      }
    }
  }, [pathname, isDesktop]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const navbar = document.getElementById('navbarNav');
      const toggler = document.querySelector('.navbar-toggler');
      const policyMenu = document.querySelector('.policy-menu');
      const target = event.target as Node;
      
      if (policyMenu && !policyMenu.contains(target)) {
        setIsPolicyExpanded(false);
      }

      const profileMenu = document.querySelector('.profile-menu');
      if (profileMenu && !profileMenu.contains(target)) {
        setIsProfileExpanded(false);
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

  const handleProfileToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); 
    console.log('[Profile Toggle Clicked]');
    setIsProfileExpanded(prev => !prev);
    if (isDesktop === false) setIsPolicyExpanded(false); 
  };

  const handlePolicyToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); 
    console.log('[Policy Toggle Clicked]');
    setIsPolicyExpanded(prev => !prev);
    if (isDesktop === false) setIsProfileExpanded(false); 
  };

  const handleSubMenuItemClick = (targetPath: string) => {
    console.log(`[SubMenu Click] Target Path: ${targetPath}`);
    setIsMenuOpen(false);
    setIsPolicyExpanded(false);
    setIsProfileExpanded(false);
    
    if (typeof window !== 'undefined' && (window as any).bootstrap?.Collapse) {
      const navbar = document.getElementById('navbarNav');
      if (navbar && navbar.classList.contains('show')) {
        const bsCollapse = new (window as any).bootstrap.Collapse(navbar);
        bsCollapse.hide();
      }
    }
  };

  const handleDirectLinkClick = () => {
    console.log('[DirectLink Click]');
    setIsMenuOpen(false);
    setIsPolicyExpanded(false);
    setIsProfileExpanded(false);
    
    if (typeof window !== 'undefined') {
      const navbar = document.getElementById('navbarNav');
      if (navbar && navbar.classList.contains('show')) {
        navbar.classList.remove('show');
        navbar.classList.add('collapse');
        
        const toggler = document.querySelector('.navbar-toggler');
        if (toggler) {
          toggler.classList.add('collapsed');
          (toggler as HTMLElement).setAttribute('aria-expanded', 'false');
        }
      }
    }
  };

  if (isStudioRoute) {
    return (
      <>
        {children}
        <Analytics />
      </>
    );
  }

  if (isDesktop === null) {
    return (
      <header className="sticky-header shadow-sm" style={{
        height: '70px',
        background: 'linear-gradient(90deg, #FF0000 0%, #FFed00 50%, #00a366 100%)'
      }}>
      </header>
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
            <Link href="/" className="navbar-brand text-white pe-0" onClick={handleDirectLinkClick}>
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
              aria-controls="navbarNav" 
              aria-expanded={isMenuOpen} 
              aria-label="Toggle navigation"
              style={{ borderColor: 'rgba(255,255,255,0.5)' }}
              onClick={() => {
                console.log('[NavbarToggler Clicked]');
                setIsMenuOpen(!isMenuOpen);
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
                  <Link href="/" className="nav-link nav-button text-white fw-normal fs-5 site-title" onClick={handleDirectLinkClick}>처음으로</Link>
                </li>
                <NavItem 
                  className={`nav-item profile-menu ${isProfileExpanded && isDesktop !== null ? 'profile-menu-open' : ''}`}
                >
                  <a href="#" className="nav-link nav-button text-white fw-normal fs-5 site-title" onClick={handleProfileToggle}>
                    소개
                    <i className={`bi bi-chevron-down policy-arrow ${isProfileExpanded && isDesktop !== null ? 'open' : ''}`}></i>
                  </a>
                  <SubMenu>
                    <li><Link href="/profile" className="nav-link nav-button text-white fw-normal site-title" onClick={handleDirectLinkClick}>권영국 이야기</Link></li>
                    <li><Link href="/profile/history" className="nav-link nav-button text-white fw-normal site-title" onClick={handleDirectLinkClick}>살아온 길</Link></li>
                    <li><Link href="/profile/people" className="nav-link nav-button text-white fw-normal site-title" onClick={handleDirectLinkClick}>함께하는 사람들</Link></li>
                  </SubMenu>
                </NavItem>
                <NavItem 
                  className={`nav-item policy-menu ${isPolicyExpanded && isDesktop !== null ? 'policy-menu-open' : ''}`}
                >
                  <a href="#" className="nav-link nav-button text-white fw-normal fs-5 site-title" onClick={handlePolicyToggle}>
                    정책
                    <i className={`bi bi-chevron-down policy-arrow ${isPolicyExpanded && isDesktop !== null ? 'open' : ''}`}></i>
                  </a>
                  <SubMenu>
                    <li><Link href="/policies/carousel" className="nav-link nav-button text-white fw-normal site-title" onClick={handleDirectLinkClick}>10대 공약</Link></li>
                    <li><Link href="/policies/scti" className="nav-link nav-button text-white fw-normal site-title" onClick={handleDirectLinkClick}>SCTI 테스트</Link></li>
                    <li><Link href="/policies/gallery" className="nav-link nav-button text-white fw-normal site-title" onClick={handleDirectLinkClick}>정책 갤러리</Link></li>
                  </SubMenu>
                </NavItem>
                <li className="nav-item"><Link href="/posts" className="nav-link nav-button text-white fw-normal fs-5 px-2 py-1 site-title" onClick={handleDirectLinkClick}>뉴스</Link></li>
                <li className="nav-item"><Link href="/events" className="nav-link nav-button text-white fw-normal fs-5 px-2 py-1 site-title" onClick={handleDirectLinkClick}>일정</Link></li>
                <li className="nav-item"><Link href="/join" className="nav-link nav-button text-white fw-normal fs-5 px-2 py-1 site-title" onClick={handleDirectLinkClick}>함께하기</Link></li>
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