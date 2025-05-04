'use client';

import { useEffect } from 'react';

export default function ClientBootstrap() {
  // 클라이언트 측에서만 부트스트랩 JS 로드 (Next.js SSR과 호환되도록)
  useEffect(() => {
    require('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);
  return null;
} 