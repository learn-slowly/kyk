import 'styled-components';

// 테마 인터페이스 정의
interface CustomTheme {
  colors: {
    primary: {
      red: string;
      yellow: string;
      green: string;
    };
    text: {
      primary: string;
      secondary: string;
      white: string;
      lightWhite: string;
    };
    background: {
      white: string;
      black: string;
      overlay: string;
      lightOverlay: string;
    };
    gradient: string;
  };
  fonts: {
    primary: string;
    secondary: string;
  };
  fontSizes: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
  };
  fontWeights: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
  transitions: {
    fast: string;
    normal: string;
    slow: string;
  };
  zIndices: {
    dropdown: number;
    sticky: number;
    fixed: number;
    modal: number;
    tooltip: number;
  };
}

declare module 'styled-components' {
  // 빈 인터페이스 확장이 아닌 직접 인터페이스 정의
  export interface DefaultTheme {
    colors: CustomTheme['colors'];
    fonts: CustomTheme['fonts'];
    fontSizes: CustomTheme['fontSizes'];
    fontWeights: CustomTheme['fontWeights'];
    breakpoints: CustomTheme['breakpoints'];
    spacing: CustomTheme['spacing'];
    shadows: CustomTheme['shadows']; 
    transitions: CustomTheme['transitions'];
    zIndices: CustomTheme['zIndices'];
  }
} 