import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import ClientLayout from './components/ClientLayout'
import Providers from './providers'
import 'bootstrap-icons/font/bootstrap-icons.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    template: '%s | 권영국 후보',
    default: '권영국 후보 | 사회대전환 연대회의 대통령 후보',
  },
  description: '권영국 후보 공식 홈페이지 - 사회대전환 연대회의 대통령 후보 권영국의 정책 및 활동 소식을 전합니다. 일정, 뉴스, 정책 자료를 확인하세요.',
  keywords: ['권영국', '대통령 후보', '사회대전환', '대선', '선거', '정책', '민주노동당'],
  authors: [{ name: '권영국 후보 캠프' }],
  creator: '권영국 후보 캠프',
  publisher: '권영국 후보 캠프',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: '권영국 후보 | 사회대전환 연대회의 대통령 후보',
    description: '권영국 후보 공식 홈페이지 - 사회대전환 연대회의 대통령 후보 권영국의 정책 및 활동 소식을 전합니다. 일정, 뉴스, 정책 자료를 확인하세요.',
    url: 'https://www.xn--3e0b8b410h.com',
    siteName: '권영국 후보 공식 홈페이지',
    images: [
      {
        url: '/images/og-image.png',  // 이미지 파일은 public 폴더에 넣어주셔야 합니다
        width: 1200,
        height: 630,
        alt: '권영국 후보 대표 이미지',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '권영국 후보 | 사회대전환 연대회의 대통령 후보',
    description: '권영국 후보 공식 홈페이지 - 사회대전환 연대회의 대통령 후보 권영국의 정책 및 활동 소식을 전합니다.',
    images: ['/images/og-image.png'],
  },
  alternates: {
    canonical: 'https://www.xn--3e0b8b410h.com',
  },
  metadataBase: new URL('https://www.xn--3e0b8b410h.com'),
  verification: {
    google: 'google-site-verification-code', // 실제 구글 서치 콘솔 코드로 교체 필요
    naver: 'naver-site-verification-code', // 실제 네이버 서치어드바이저 코드로 교체 필요
  },
  category: '정치',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <meta name="google-site-verification" content="google-site-verification-code" /> {/* 구글 서치 콘솔 */}
        <meta name="naver-site-verification" content="naver-site-verification-code" /> {/* 네이버 서치어드바이저 */}
      </head>
      <body className={inter.className}>
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  )
} 