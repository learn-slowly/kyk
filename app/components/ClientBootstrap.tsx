'use client';

import { useEffect } from 'react';

// 부트스트랩 자바스크립트를 동적으로 불러옵니다.
const BootstrapClient = () => {
  useEffect(() => {
    // 클라이언트 측에서만 부트스트랩 JS 로드
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);
  return null;
};

export default function ClientBootstrap() {
  return <BootstrapClient />;
} 