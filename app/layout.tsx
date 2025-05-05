import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './globals.css'
import ClientBootstrap from './components/ClientBootstrap'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '민주노동당 대선후보 권영국',
  description: '민주노동당 대선후보 권영국 공식 웹사이트입니다.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <style>
          {`
            .nav-button {
              border: 3px solid white !important;
              border-radius: 20px !important;
              margin: 0 5px !important;
              position: relative;
              z-index: 1;
              overflow: hidden;
              transition: all 0.3s ease;
            }
            
            .nav-button::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: white;
              z-index: -1;
              opacity: 0;
              transition: opacity 0.3s ease;
            }
            
            .nav-button:hover {
              color: rgba(0, 0, 0, 0.3) !important;
            }
            
            .nav-button:hover::before {
              opacity: 1;
            }
            
            /* 모바일 메뉴 스타일 */
            @media (max-width: 991.98px) {
              .navbar-collapse {
                position: fixed;
                top: 70px; /* 헤더 아래에 위치 */
                left: auto;
                right: 0;
                width: auto; /* 필요한 만큼만 너비 차지 */
                min-width: 200px; /* 최소 너비 */
                max-width: 300px; /* 최대 너비 */
                height: auto; /* 내용물 크기에 맞춤 */
                max-height: calc(100vh - 80px); /* 헤더 아래 공간만 차지 */
                background-color: white;
                padding: 1.5rem;
                z-index: 1020; /* 헤더보다 낮은 z-index */
                transform: translateX(100%); /* 오른쪽에서 슬라이드 */
                transition: transform 0.3s ease;
                box-shadow: -2px 0 10px rgba(0,0,0,0.1);
                overflow-y: auto;
                border-bottom-left-radius: 15px;
                border-top-left-radius: 15px;
              }
              
              .navbar-collapse.show {
                transform: translateX(0);
              }
              
              .navbar-nav .nav-item {
                text-align: left;
                margin: 0;
              }
              
              .navbar-nav .nav-link {
                color: #333 !important;
                font-weight: 500 !important;
                border: none !important;
              }
              
              .nav-button {
                border: none !important;
                border-bottom: 1px solid #eee !important;
                border-radius: 0 !important;
                margin: 0 !important;
                padding: 1rem 0.5rem !important;
                text-align: center;
              }
              
              .nav-button::before {
                display: none;
              }
              
              .nav-button:hover {
                background-color: #f8f9fa !important;
                color: #000 !important;
              }
              
              .mobile-menu-close {
                position: absolute;
                top: 0.5rem;
                right: 0.5rem;
                background: none;
                border: none;
                font-size: 1.2rem;
                cursor: pointer;
                color: #333;
                padding: 0.2rem 0.5rem;
              }
            }

            .custom-row {
              display: flex;
              width: 100%;
              gap: 0;
            }
            .custom-col {
              flex: 1 1 0;
              width: 50%;
            }
            @media (max-width: 768px) {
              .custom-row {
                flex-direction: column;
              }
              .custom-col {
                width: 100%;
              }
            }
          `}
        </style>
      </head>
      <body className={inter.className}>
        <ClientBootstrap />
        <header 
          className="sticky-top shadow-sm"
          style={{
            background: 'linear-gradient(90deg, #FF0000 0%, #FFed00 50%, #00a366 100%)'
          }}
        >
          <div className="container">
            <nav className="navbar navbar-expand-lg">
              <div className="container-fluid">
                <Link href="/" className="navbar-brand fw-bolder text-white">
                  <div className="d-flex flex-column">
                    <small style={{ fontSize: '0.6em', fontWeight: 'normal', opacity: 0.9, lineHeight: '1' }}>사회대전환 연대회의 대통령 후보</small>
                    <span className="fs-1 fw-bolder">민주노동당 권영국</span>
                  </div>
                </Link>
                <button 
                  className="navbar-toggler" 
                  type="button" 
                  data-bs-toggle="collapse" 
                  data-bs-target="#navbarNav"
                  style={{
                    borderColor: 'rgba(255,255,255,0.5)'
                  }}
                >
                  <span className="navbar-toggler-icon" style={{ filter: 'brightness(0) invert(1)' }}></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                  <button className="mobile-menu-close d-lg-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <i className="bi bi-x"></i>
                  </button>
                  <ul className="navbar-nav ms-auto">
                    <li className="nav-item">
                      <Link href="/profile" className="nav-link nav-button text-white fw-bold fs-6 px-2 py-1">소개</Link>
                    </li>
                    <li className="nav-item">
                      <Link href="/policies" className="nav-link nav-button text-white fw-bold fs-6 px-2 py-1">정책</Link>
                    </li>
                    <li className="nav-item">
                      <Link href="/posts" className="nav-link nav-button text-white fw-bold fs-6 px-2 py-1">뉴스</Link>
                    </li>
                    <li className="nav-item">
                      <Link href="/events" className="nav-link nav-button text-white fw-bold fs-6 px-2 py-1">일정</Link>
                    </li>
                    <li className="nav-item">
                      <Link href="/join" className="nav-link nav-button text-white fw-bold fs-6 px-2 py-1">함께하기</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
          </div>
        </header>

        <main style={{ backgroundColor: '#f8f9fa' }}>
          {children}
        </main>

        <footer 
          className="text-white py-5 position-relative"
          style={{
            overflow: 'hidden'
          }}
        >
          {/* 배경 색상 */}
          <div 
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{
              backgroundColor: '#0b365f',
              zIndex: 0
            }}
          ></div>
          
          {/* 배경 이미지 */}
          <div 
            className="position-absolute bottom-0 start-0 w-100"
            style={{
              height: '150px',
              backgroundImage: 'url(/images/bottom.png)',
              backgroundSize: 'auto 150px',
              backgroundPosition: 'center bottom',
              backgroundRepeat: 'repeat-x',
              zIndex: 1
            }}
          ></div>
          
          {/* 푸터 내용 */}
          <div className="container position-relative" style={{ zIndex: 2 }}>
            <div className="custom-row">
              <div className="custom-col">
                <h3 className="fs-4 fw-bold mb-3">사회대전환 연대회의 대통령 후보<br />민주노동당 권영국</h3>
                <p className="text-light">
                  사회를 바꾸고 우리의 미래를 바꾸기 위한 선택
                </p>
              </div>
              <div className="custom-col">
                <h3 className="fs-5 fw-bold mb-3">연락처</h3>
                <p className="text-light">
                  이메일: contact@kyk2027.kr<br />
                  전화: 02-2038-0103<br />
                  FAX: 02-761-0103<br />
                  주소: (08376) 서울특별시 구로구 디지털로33길 55, 이앤씨벤처드림타워2차 1011호
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-top border-secondary text-center text-light">
              <p className="mb-0">© {new Date().getFullYear()} 민주노동당 권영국. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
} 