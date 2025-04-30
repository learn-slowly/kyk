import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">대선 후보자 페이지</h1>
      <nav className="space-y-4">
        <div>
          <Link href="/profile" className="text-blue-600 hover:underline">
            후보자 프로필
          </Link>
        </div>
        <div>
          <Link href="/policies" className="text-blue-600 hover:underline">
            공약
          </Link>
        </div>
      </nav>
    </main>
  )
} 