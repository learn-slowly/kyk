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
import GlobalStyles from '../styles/GlobalStyles';

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

const HeaderContainer = styled.header`
  background: ${props => props.theme.colors.gradient};
`;

const MenuToggler = styled.button`
  padding: 0.25rem 0.5rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: ${props => props.theme.transitions.fast};

  &:focus {
    outline: none;
  }
  
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    display: none;
  }
`;

const NavLink = styled.a`
  display: block;
  padding: 0.5rem 1rem;
  color: ${props => props.theme.colors.text.white} !important;
  font-family: ${props => props.theme.fonts.primary};
  font-size: ${props => props.theme.fontSizes.lg};
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  transition: ${props => props.theme.transitions.fast};
  
  &:hover {
    color: ${props => props.theme.colors.primary.yellow} !important;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    padding: 0.75rem 1.25rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

const SubMenuItem = styled.li`
  width: 100%;
`;

const SubMenuLink = styled.a`
  display: block;
  padding: 0.5rem 1rem;
  color: ${props => props.theme.colors.text.white} !important;
  font-size: ${props => props.theme.fontSizes.sm};
  text-decoration: none;
  transition: ${props => props.theme.transitions.fast};
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    padding: 0.75rem 2rem;
    font-size: ${props => props.theme.fontSizes.md};
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

  const handleOutsideClick = (e: MouseEvent) => {
    const target = e.target as Node;
    const profileMenu = document.querySelector('.profile-menu');
    const policyMenu = document.querySelector('.policy-menu');
    const navMenu = document.querySelector('.navbar-menu');
    const toggler = document.querySelector('.menu-toggler');

    if (profileMenu && !profileMenu.contains(target)) {
      setIsProfileExpanded(false);
    }

    if (policyMenu && !policyMenu.contains(target)) {
      setIsPolicyExpanded(false);
    }

    if (navMenu && toggler && isMenuOpen && 
        !navMenu.contains(target) && !toggler.contains(target)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [isMenuOpen]);

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
    <>
      <GlobalStyles />
      <ClientBootstrap />
      <HeaderContainer className="sticky-header">
        <div className="container">
          <nav className="navbar navbar-expand-lg py-2">
            <NavbarContainer className="container-fluid">
              <Link href="/" className="navbar-brand">
                <div className="d-block">
                  <span className="d-block text-white site-title small">사회대전환 연대회의 대통령 후보</span>
                </div>
                <div className="d-flex align-items-center">
                  <div className="me-2">
                    <Image 
                      src="/images/header.png"
                      alt="권영국 후보 로고" 
                      width={240} 
                      height={35}
                      style={{ objectFit: 'contain' }}
                      priority
                    />
                  </div>
                  <span className="fs-1 text-white site-title">권영국</span>
                </div>
              </Link>
              
              <MenuToggler 
                className="menu-toggler navbar-toggler" 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span className={`navbar-toggler-icon ${isMenuOpen ? 'open' : ''}`}></span>
              </MenuToggler>
              
              <NavMenu className={`navbar-menu ${isMenuOpen ? 'show' : ''}`}>
                <NavItem className={`profile-menu ${isProfileExpanded ? 'open' : ''}`}>
                  <NavLink href="#" onClick={handleProfileToggle}>
                    소개
                    <i className={`bi bi-chevron-down ms-1 ${isProfileExpanded ? 'rotate-180' : ''}`}></i>
                  </NavLink>
                  <SubMenu className="dropdown-menu">
                    <SubMenuItem><Link href="/profile" legacyBehavior><SubMenuLink href="#">권영국 이야기</SubMenuLink></Link></SubMenuItem>
                    <SubMenuItem><Link href="/profile/history" legacyBehavior><SubMenuLink href="#">살아온 길</SubMenuLink></Link></SubMenuItem>
                    <SubMenuItem><Link href="/profile/people" legacyBehavior><SubMenuLink href="#">함께하는 사람들</SubMenuLink></Link></SubMenuItem>
                  </SubMenu>
                </NavItem>
                <NavItem className={`policy-menu ${isPolicyExpanded ? 'open' : ''}`}>
                  <NavLink href="#" onClick={handlePolicyToggle}>
                    정책
                    <i className={`bi bi-chevron-down ms-1 ${isPolicyExpanded ? 'rotate-180' : ''}`}></i>
                  </NavLink>
                  <SubMenu className="dropdown-menu">
                    <SubMenuItem><Link href="/policies/carousel" legacyBehavior><SubMenuLink href="#">10대 공약</SubMenuLink></Link></SubMenuItem>
                    <SubMenuItem><Link href="/policies/scti" legacyBehavior><SubMenuLink href="#">SCTI 테스트</SubMenuLink></Link></SubMenuItem>
                    <SubMenuItem><Link href="/policies/gallery" legacyBehavior><SubMenuLink href="#">정책 갤러리</SubMenuLink></Link></SubMenuItem>
                  </SubMenu>
                </NavItem>
                <NavItem>
                  <Link href="/posts" legacyBehavior><NavLink href="#">뉴스</NavLink></Link>
                </NavItem>
                <NavItem>
                  <Link href="/events" legacyBehavior><NavLink href="#">일정</NavLink></Link>
                </NavItem>
                <NavItem>
                  <Link href="/join" legacyBehavior><NavLink href="#">함께하기</NavLink></Link>
                </NavItem>
              </NavMenu>
            </NavbarContainer>
          </nav>
        </div>
      </HeaderContainer>
      <div className="header-spacer"></div>

      <main>
        {children}
      </main>

      <PolicyFooter />
      <Analytics />
    </>
  );
} 