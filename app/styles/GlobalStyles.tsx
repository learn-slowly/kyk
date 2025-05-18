'use client';

import { createGlobalStyle } from 'styled-components';
import theme from '@/app/lib/theme';

const GlobalStyles = createGlobalStyle`
  /* Tailwind 기본 스타일 */
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  /* 전역 변수 */
  :root {
    --primary-red: ${theme.colors.primary.red};
    --primary-yellow: ${theme.colors.primary.yellow};
    --primary-green: ${theme.colors.primary.green};
    --gradient: ${theme.colors.gradient};
  }

  /* 기본 요소 스타일 */
  body {
    color: ${theme.colors.text.primary};
    background: ${theme.colors.background.white};
    font-family: ${theme.fonts.secondary};
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${theme.fonts.primary};
    font-weight: ${theme.fontWeights.normal};
    letter-spacing: -0.03em;
  }

  /* 폰트 설정 */
  @font-face {
    font-family: 'GamtanRoad Gamtan';
    font-weight: normal;
    font-style: normal;
    font-display: swap;
    src: url('https://cdn.jsdelivr.net/gh/fonts-archive/GamtanRoadGamtan/GamtanRoadGamtan.woff2') format('woff2'),
        url('https://cdn.jsdelivr.net/gh/fonts-archive/GamtanRoadGamtan/GamtanRoadGamtan.woff') format('woff'),
        url('https://cdn.jsdelivr.net/gh/fonts-archive/GamtanRoadGamtan/GamtanRoadGamtan.otf') format('opentype'),
        url('https://cdn.jsdelivr.net/gh/fonts-archive/GamtanRoadGamtan/GamtanRoadGamtan.ttf') format('truetype');
  }

  @font-face {
    font-family: 'Pretendard Variable';
    font-weight: 45 920;
    font-style: normal;
    font-display: swap;
    src: url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.woff2') format('woff2');
  }

  @font-face {
    font-family: 'Pretendard';
    font-weight: 400;
    font-style: normal;
    font-display: swap;
    src: url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-regular.woff2') format('woff2');
  }

  @font-face {
    font-family: 'Pretendard';
    font-weight: 500;
    font-style: normal;
    font-display: swap;
    src: url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-medium.woff2') format('woff2');
  }

  @font-face {
    font-family: 'Pretendard';
    font-weight: 600;
    font-style: normal;
    font-display: swap;
    src: url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-semibold.woff2') format('woff2');
  }

  @font-face {
    font-family: 'Pretendard';
    font-weight: 700;
    font-style: normal;
    font-display: swap;
    src: url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-bold.woff2') format('woff2');
  }

  /* 헤더 공통 스타일 */
  .sticky-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    z-index: ${theme.zIndices.sticky};
    background: ${theme.colors.gradient} !important;
    box-shadow: ${theme.shadows.sm};
  }

  .header-spacer {
    height: 85px;
    
    @media (max-width: ${theme.breakpoints.md}) {
      height: 90px;
    }
    
    @media (max-width: ${theme.breakpoints.sm}) {
      height: 80px;
    }
  }

  /* 네비게이션 스타일 */
  .site-title, .brand-text { 
    font-family: ${theme.fonts.primary};
    letter-spacing: -0.03em;
  }

  .navbar-nav .nav-item {
    position: relative;
  }

  .navbar-nav .nav-item .nav-link {
    color: ${theme.colors.text.white} !important;
    transition: ${theme.transitions.fast};
  }

  /* 링크 스타일 */
  .nav-link {
    display: block;
    padding: 0.5rem 1rem;
    color: ${theme.colors.text.white} !important;
    font-family: ${theme.fonts.primary};
    font-size: ${theme.fontSizes.lg};
    text-decoration: none;
    white-space: nowrap;
    cursor: pointer;
    transition: ${theme.transitions.fast};
    
    &:hover {
      color: ${theme.colors.primary.yellow} !important;
    }
    
    @media (max-width: ${theme.breakpoints.lg}) {
      padding: 0.75rem 1.25rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
  }

  .submenu-link {
    display: block;
    padding: 0.5rem 1rem;
    color: ${theme.colors.text.white} !important;
    font-size: ${theme.fontSizes.sm};
    text-decoration: none;
    transition: ${theme.transitions.fast};
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
      color: ${theme.colors.text.white} !important;
    }
    
    @media (max-width: ${theme.breakpoints.lg}) {
      padding: 0.75rem 2rem;
      font-size: ${theme.fontSizes.md};
    }
  }

  /* 서브메뉴 스타일 */
  .navbar-nav .nav-item ul.dropdown-menu {
    display: none;
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    min-width: 170px;
    background: ${theme.colors.background.overlay};
    backdrop-filter: blur(8px);
    border-radius: 3px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: ${theme.shadows.sm};
    padding: 0.1rem;
    z-index: ${theme.zIndices.dropdown};

    @media (max-width: ${theme.breakpoints.lg}) {
      position: static;
      transform: none;
      width: 100%;
      margin: 0;
      background: rgba(0, 0, 0, 0.3);
    }
  }

  .navbar-nav .nav-item:hover > ul.dropdown-menu,
  .navbar-nav .nav-item.menu-open > ul.dropdown-menu {
    display: block;
  }

  .navbar-nav .nav-item ul.dropdown-menu li a {
    padding: 0.3rem 0.7rem !important;
    font-size: ${theme.fontSizes.sm} !important;
    color: rgba(255, 255, 255, 0.8) !important;
    text-align: center;
    display: block;
    transition: ${theme.transitions.fast};

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: ${theme.colors.text.white} !important;
      transform: translateY(-1px);
    }

    @media (max-width: ${theme.breakpoints.lg}) {
      padding: 0.75rem 2rem !important;
      text-align: left;
      background-color: rgba(255,255,255,0.05);
      font-size: ${theme.fontSizes.md} !important;
    }
  }

  /* 토글러 아이콘 스타일 */
  .navbar-toggler-icon {
    transition: all 0.3s ease;
    background-image: none !important;
    position: relative;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 24px !important;
    height: 24px !important;
    background-color: transparent;
    background-image: linear-gradient(transparent 11px, white 11px, white 13px, transparent 13px) !important;
  }
  
  .navbar-toggler-icon::before,
  .navbar-toggler-icon::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    background-color: white;
    left: 0;
    transition: all 0.3s ease;
  }
  
  .navbar-toggler-icon::before {
    top: 4px;
  }
  
  .navbar-toggler-icon::after {
    bottom: 4px;
  }
  
  .navbar-toggler-icon.open::before {
    top: 50%;
    transform: rotate(45deg) translate(0, -50%);
  }
  
  .navbar-toggler-icon.open::after {
    bottom: 50%;
    transform: rotate(-45deg) translate(0, 50%);
  }
  
  .navbar-toggler-icon.open {
    background-image: none !important;
  }
  
  /* 추가적인 유틸리티 스타일 */
  .rotate-180 {
    transform: rotate(180deg);
  }
  
  /* 커스텀 레이아웃 스타일 */
  .custom-row {
    display: flex;
    width: 100%;
    gap: 0;
    
    @media (max-width: ${theme.breakpoints.md}) {
      flex-direction: column;
    }
  }

  .custom-col {
    flex: 1 1 0;
    width: 50%;
    
    @media (max-width: ${theme.breakpoints.md}) {
      width: 100%;
    }
  }
  
  /* 페이지 컨테이너 스타일 */
  .page-container {
    padding: 2rem 1rem;
    max-width: 1200px;
    margin: 0 auto;
    min-height: 100vh;
  }
  
  /* 페이지 타이틀 스타일 */
  .page-title {
    font-size: 2.8rem;
    font-weight: normal;
    text-align: center;
    margin-bottom: 3rem;
    color: #333;
    position: relative;
    padding: 1rem;
    z-index: 10;
    font-family: ${theme.fonts.primary};
  }
  
  .page-title::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 200px;
    height: 5px;
    background: ${theme.colors.gradient};
  }
  
  @media (max-width: ${theme.breakpoints.md}) {
    .page-title {
      font-size: 2.2rem;
      margin-bottom: 2rem;
    }
    
    .page-title::after {
      width: 150px;
    }
  }
  
  /* 타임라인 컴포넌트 공통 스타일 */
  .timeline-container {
    position: relative;
    max-width: 1000px;
    margin: 0 auto;
    padding-top: 2rem;
  }
  
  .timeline-container::after {
    content: '';
    position: absolute;
    width: 2px;
    background: ${theme.colors.gradient};
    top: 0;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }
  
  @media (max-width: ${theme.breakpoints.md}) {
    .timeline-container::after {
      left: 30px;
    }
  }
`;

export default GlobalStyles; 