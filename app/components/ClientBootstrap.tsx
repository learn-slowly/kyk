'use client';

import { useEffect } from 'react';

// 부트스트랩 자바스크립트를 동적으로 불러옵니다.
const BootstrapClient = () => {
  useEffect(() => {
    // 클라이언트 측에서만 부트스트랩 JS 로드
    import('bootstrap/dist/js/bootstrap.bundle.min.js');

    // 네비게이션 토글 버튼 아이콘 변경 로직
    const handleNavbarToggle = () => {
      const navbarToggler = document.querySelector('.navbar-toggler');
      const togglerIcon = document.querySelector('.navbar-toggler-icon');
      
      if (navbarToggler && togglerIcon) {
        // 네비게이션 바 상태 감지
        const navbarCollapse = document.getElementById('navbarNav');
        
        if (navbarCollapse) {
          // 네비게이션 바가 열리고 닫힐 때 이벤트 리스너 추가
          navbarCollapse.addEventListener('show.bs.collapse', () => {
            // 햄버거 아이콘을 X 아이콘으로 변경
            togglerIcon.classList.add('nav-close-icon');
          });
          
          navbarCollapse.addEventListener('hide.bs.collapse', () => {
            // X 아이콘을 햄버거 아이콘으로 변경
            togglerIcon.classList.remove('nav-close-icon');
          });
        }
      }
    };

    // 스크롤 이벤트 처리 - 헤더 요소들이 투명해지는 것 방지
    const preventHeaderFading = () => {
      // 헤더와 관련된 모든 요소 선택
      const headerElements = document.querySelectorAll('.sticky-header, .navbar-brand, .subtitle, .subtitle-container, .brand-text, .logo-container');
      
      // 스크롤 이벤트 리스너 추가
      window.addEventListener('scroll', () => {
        // 모든 헤더 요소의 스타일을 강제로 불투명하게 설정
        headerElements.forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.opacity = '1';
            el.style.visibility = 'visible';
          }
        });
      });
    };

    // DOM이 완전히 로드된 후 실행
    setTimeout(() => {
      handleNavbarToggle();
      preventHeaderFading();
    }, 100);

    // 클린업 함수
    return () => {
      window.removeEventListener('scroll', () => {});
    };
  }, []);
  return null;
};

export default function ClientBootstrap() {
  return <BootstrapClient />;
} 