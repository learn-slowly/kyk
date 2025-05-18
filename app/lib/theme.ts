/**
 * styled-components 테마 설정
 */

export const theme = {
  colors: {
    primary: {
      red: '#FF0000',
      yellow: '#FFed00',
      green: '#00a366',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
      white: '#FFFFFF',
      lightWhite: 'rgba(255, 255, 255, 0.85)',
    },
    background: {
      white: '#FFFFFF',
      black: '#000000',
      overlay: 'rgba(0, 0, 0, 0.75)',
      lightOverlay: 'rgba(255, 255, 255, 0.15)',
    },
    gradient: 'linear-gradient(90deg, #FF0000 0%, #FFed00 50%, #00a366 100%)',
  },
  fonts: {
    primary: "'GamtanRoad Gamtan', sans-serif",
    secondary: "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif",
  },
  fontSizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    md: '1rem',       // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
  },
  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  breakpoints: {
    sm: '480px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
  },
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
  },
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.12)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  },
  transitions: {
    fast: '0.15s ease',
    normal: '0.3s ease',
    slow: '0.5s ease',
  },
  zIndices: {
    dropdown: 1000,
    sticky: 1100,
    fixed: 1200, 
    modal: 1400,
    tooltip: 1600,
  },
};

export type Theme = typeof theme;
export default theme; 