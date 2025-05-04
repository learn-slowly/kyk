import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import 'bootstrap/dist/css/bootstrap.min.css'
import './globals.css'
import { useEffect } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '권영국 대선 후보',
  description: '권영국 대선 후보의 공식 웹사이트입니다.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 클라이언트 측에서만 부트스트랩 JS 로드 (Next.js SSR과 호환되도록)
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  return (
    <html lang="ko">
      <body className={inter.className}>
        <header className="sticky-top bg-white shadow-sm">
          <div className="container">
            <nav className="navbar navbar-expand-lg navbar-light">
              <div className="container-fluid">
                <Link href="/" className="navbar-brand fw-bold">권영국</Link>
                <button 
                  className="navbar-toggler" 
                  type="button" 
                  data-bs-toggle="collapse" 
                  data-bs-target="#navbarNav"
                >
                  <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                  <ul className="navbar-nav ms-auto">
                    <li className="nav-item">
                      <Link href="/profile" className="nav-link">소개</Link>
                    </li>
                    <li className="nav-item">
                      <Link href="/policies" className="nav-link">정책</Link>
                    </li>
                    <li className="nav-item">
                      <Link href="/news" className="nav-link">뉴스</Link>
                    </li>
                    <li className="nav-item">
                      <Link href="/schedule" className="nav-link">일정</Link>
                    </li>
                    <li className="nav-item">
                      <Link href="/join" className="nav-link">참여하기</Link>
                    </li>
                    <li className="nav-item">
                      <Link href="/contact" className="nav-link">연락처</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
          </div>
        </header>

        <main>
          {children}
        </main>

        <footer className="bg-dark text-white py-5">
          <div className="container">
            <div className="row">
              <div className="col-md-4 mb-4 mb-md-0">
                <h3 className="fs-4 fw-bold mb-3">권영국 선거 캠페인</h3>
                <p className="text-secondary">
                  대한민국의 새로운 미래를 위한 선택
                </p>
              </div>
              <div className="col-md-4 mb-4 mb-md-0">
                <h3 className="fs-5 fw-bold mb-3">바로가기</h3>
                <ul className="list-unstyled">
                  <li className="mb-2"><Link href="/profile" className="text-secondary text-decoration-none">소개</Link></li>
                  <li className="mb-2"><Link href="/policies" className="text-secondary text-decoration-none">정책</Link></li>
                  <li className="mb-2"><Link href="/join" className="text-secondary text-decoration-none">참여하기</Link></li>
                </ul>
              </div>
              <div className="col-md-4">
                <h3 className="fs-5 fw-bold mb-3">연락처</h3>
                <p className="text-secondary">
                  이메일: contact@kyk2027.kr<br />
                  전화: 02-123-4567<br />
                  서울특별시 종로구 1번지
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-top border-secondary text-center text-secondary">
              <p className="mb-0">© {new Date().getFullYear()} 권영국 선거 캠페인. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
} 