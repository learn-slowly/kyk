import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import ClientLayout from './components/ClientLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    template: '%s | 권영국 후보',
    default: '권영국 후보 | 사회대전환 연대회의 대통령 후보',
  },
  description: '권영국 후보의 공식 홈페이지입니다.',
  openGraph: {
    title: '권영국 후보 | 사회대전환 연대회의 대통령 후보',
    description: '권영국 후보의 공식 홈페이지입니다.',
    url: 'https://kyk2025.com',
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
    description: '권영국 후보의 공식 홈페이지입니다.',
    images: ['/images/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
} 