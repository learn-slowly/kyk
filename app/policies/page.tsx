'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function PoliciesPage() {
  // 페이지 제목 설정
  useEffect(() => {
    document.title = '정책 공약 | 권영국 후보';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-lg">
        <h1 className="text-3xl font-bold mb-6">🚧 페이지 준비 중 🚧</h1>
        <p className="text-xl mb-4">권영국 후보의 정책 공약 페이지를 준비하고 있습니다.</p>
        <p className="text-lg text-gray-600 mb-8">빠른 시일 내에 완성된 페이지로 찾아뵙겠습니다.</p>
        <Link href="/" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
} 