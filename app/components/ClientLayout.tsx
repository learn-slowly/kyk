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
  display: flex;
  margin: 0;
  padding: 0;
  list-style: none;
  
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    flex-direction: row;
    gap: 2.5rem;
    align-items: center;
    margin-right: 2rem;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    flex-direction: column;
    background-color: ${props => props.theme.colors.background.overlay};
    position: absolute;
    top: 100%;
    right: 0;
    width: 200px;
    border-radius: 4px;
    padding: 0.5rem 0;
    box-shadow: ${props => props.theme.shadows.md};
    display: none;
    
    &.show {
      display: block;
    }
  }
`;

const NavItem = styled.li`
  position: relative;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    width: 100%;
  }
`;

const SubMenu = styled.ul`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${props => props.theme.colors.background.overlay};
  min-width: 180px;
  padding: 0.5rem 0;
  border-radius: 4px;
  box-shadow: ${props => props.theme.shadows.md};
  list-style: none;
  z-index: ${props => props.theme.zIndices.dropdown};
  display: none;
  backdrop-filter: blur(8px);
  
  ${NavItem}:hover & {
    display: block;
  }
  
  ${NavItem}.open & {
    display: block;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    position: static;
    transform: none;
    min-width: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    box-shadow: none;
    border-radius: 0;
    padding: 0;
    margin-top: 0;
    
    ${NavItem}:hover & {
      display: none;
    }
    
    ${NavItem}.open & {
      display: block;
    }
  }
`;

const NavbarContainer = styled.div`
  padding: 0 2rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    padding: 0 3rem;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: 0 1.5rem;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
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
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    font-size: 1.2rem;
    padding: 0.5rem;
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

// 메인 타이틀
const MainTitle = styled.span`
  font-size: 2.5rem;
  font-family: ${props => props.theme.fonts.primary};
  color: white;
  white-space: nowrap;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 2.2rem;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 1.9rem;
  }
`;

// 서브타이틀
const SubTitle = styled.span`
  display: block;
  font-family: ${props => props.theme.fonts.primary};
  color: white;
  margin-bottom: 5px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  font-weight: normal;
  line-height: 1.2;
  font-size: 1.3rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 1.2rem;
    margin-bottom: 4px;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 1.1rem;
    margin-bottom: 3px;
  }
`;

// 브랜드 로고 컨테이너
const BrandContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 400px;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: 0.1rem 0;
    max-width: none;
  }
`;

// 로고 컨테이너
const LogoImageContainer = styled.div`
  margin-right: 0.7rem;
  flex-shrink: 0;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    margin-right: 0.5rem;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    margin-right: 0.4rem;
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
            <NavbarContainer className="container-fluid d-flex justify-content-between align-items-center">
              <Link href="/" className="navbar-brand me-0">
                <BrandContainer>
                  <SubTitle className="site-subtitle">사회대전환 연대회의 대통령 후보</SubTitle>
                  <div className="d-flex align-items-center" style={{ flexWrap: 'nowrap', minWidth: '300px' }}>
                    <LogoImageContainer>
                      <Image 
                        src="/images/header.png"
                        alt="권영국 후보 로고" 
                        width={200} 
                        height={30}
                        style={{ objectFit: 'contain' }}
                        priority
                      />
                    </LogoImageContainer>
                    <MainTitle>권영국</MainTitle>
                  </div>
                </BrandContainer>
              </Link>
              
              <div className="d-flex align-items-center">
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
                      <SubMenuItem><Link href="/profile" className="submenu-link">권영국 이야기</Link></SubMenuItem>
                      <SubMenuItem><Link href="/profile/history" className="submenu-link">살아온 길</Link></SubMenuItem>
                      <SubMenuItem><Link href="/profile/people" className="submenu-link">함께하는 사람들</Link></SubMenuItem>
                    </SubMenu>
                  </NavItem>
                  <NavItem className={`policy-menu ${isPolicyExpanded ? 'open' : ''}`}>
                    <NavLink href="#" onClick={handlePolicyToggle}>
                      정책
                      <i className={`bi bi-chevron-down ms-1 ${isPolicyExpanded ? 'rotate-180' : ''}`}></i>
                    </NavLink>
                    <SubMenu className="dropdown-menu">
                      <SubMenuItem><Link href="/policies/carousel" className="submenu-link">10대 공약</Link></SubMenuItem>
                      <SubMenuItem><Link href="/policies/scti" className="submenu-link">SCTI 테스트</Link></SubMenuItem>
                      <SubMenuItem><Link href="/policies/gallery" className="submenu-link">정책 갤러리</Link></SubMenuItem>
                    </SubMenu>
                  </NavItem>
                  <NavItem>
                    <Link href="/posts" className="nav-link">뉴스</Link>
                  </NavItem>
                  <NavItem>
                    <Link href="/events" className="nav-link">일정</Link>
                  </NavItem>
                  <NavItem>
                    <Link href="/join" className="nav-link">함께하기</Link>
                  </NavItem>
                </NavMenu>
              </div>
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