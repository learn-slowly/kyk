/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-red': '#FF0000',
        'primary-yellow': '#FFed00',
        'primary-green': '#00a366',
      },
      fontFamily: {
        'gamtan': ['"GamtanRoad Gamtan"', 'sans-serif'],
        'pretendard': ['"Pretendard Variable"', 'Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'Roboto', '"Helvetica Neue"', '"Segoe UI"', '"Apple SD Gothic Neo"', '"Noto Sans KR"', '"Malgun Gothic"', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-rainbow': 'linear-gradient(90deg, #FF0000 0%, #FFed00 50%, #00a366 100%)',
      }
    },
    screens: {
      'sm': '480px',
      'md': '768px', 
      'lg': '992px',
      'xl': '1200px',
    },
  },
  plugins: [],
} 