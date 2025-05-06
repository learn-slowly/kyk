'use client'

import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <title>Sanity Studio - 권영국</title>
        <meta name="description" content="Content management for 권영국 website" />
      </head>
      <body style={{ margin: 0, padding: 0, height: '100vh', overflow: 'auto' }}>
        {children}
      </body>
    </html>
  )
} 