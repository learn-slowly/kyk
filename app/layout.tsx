import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

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
  return (
    <html lang="ko">
      <body className={inter.className}>
        <header className="sticky top-0 z-50 bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link href="/" className="font-bold text-xl">권영국</Link>
              </div>
              <nav className="hidden md:flex space-x-8">
                <Link href="/profile" className="text-gray-700 hover:text-gray-900">소개</Link>
                <Link href="/policies" className="text-gray-700 hover:text-gray-900">정책</Link>
                <Link href="/news" className="text-gray-700 hover:text-gray-900">뉴스</Link>
                <Link href="/schedule" className="text-gray-700 hover:text-gray-900">일정</Link>
                <Link href="/join" className="text-gray-700 hover:text-gray-900">참여하기</Link>
                <Link href="/contact" className="text-gray-700 hover:text-gray-900">연락처</Link>
              </nav>
              <div className="md:hidden">
                <button className="text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {children}

        <footer className="bg-gray-800 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">권영국 선거 캠페인</h3>
                <p className="text-gray-300">
                  대한민국의 새로운 미래를 위한 선택
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-4">바로가기</h3>
                <ul className="space-y-2">
                  <li><Link href="/profile" className="text-gray-300 hover:text-white">소개</Link></li>
                  <li><Link href="/policies" className="text-gray-300 hover:text-white">정책</Link></li>
                  <li><Link href="/join" className="text-gray-300 hover:text-white">참여하기</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-4">연락처</h3>
                <p className="text-gray-300">
                  이메일: contact@kyk2027.kr<br />
                  전화: 02-123-4567<br />
                  서울특별시 종로구 1번지
                </p>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
              <p>© {new Date().getFullYear()} 권영국 선거 캠페인. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
} 