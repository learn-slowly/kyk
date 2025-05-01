import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* 히어로 섹션 */}
      <section className="h-[80vh] bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 flex flex-col justify-center items-center text-white p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">권영국</h1>
          <p className="text-2xl md:text-3xl mb-8">대한민국의 새로운 미래를 위한 선택</p>
          <div className="w-32 h-32 md:w-48 md:h-48 bg-white/20 rounded-full mx-auto mb-8">
            {/* 후보 이미지 자리 */}
          </div>
          <button className="bg-white text-black px-8 py-3 rounded-full font-bold text-lg hover:bg-opacity-90">
            자세히 알아보기
          </button>
        </div>
      </section>

      {/* 주요 섹션 네비게이션 */}
      <section className="py-12 px-8 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <NavCard 
            title="후보자 소개" 
            description="권영국 후보의 약력, 비전, 가치관을 알아보세요."
            link="/profile"
          />
          <NavCard 
            title="정책" 
            description="더 나은 대한민국을 위한 주요 정책을 확인하세요."
            link="/policies"
          />
          <NavCard 
            title="뉴스 & 미디어" 
            description="최신 보도자료와 언론 보도를 확인하세요."
            link="/news"
          />
        </div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <NavCard 
            title="선거 일정" 
            description="캠페인 및 유세 일정을 확인하세요."
            link="/schedule"
          />
          <NavCard 
            title="참여하기" 
            description="캠페인에 동참하고 자원봉사 신청을 해보세요."
            link="/join"
          />
          <NavCard 
            title="연락처" 
            description="캠페인 본부 정보와 문의 방법을 확인하세요."
            link="/contact"
          />
        </div>
      </section>

      {/* 소셜 미디어 섹션 */}
      <section className="py-10 bg-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6">소셜 미디어에서 만나보세요</h2>
          <div className="flex justify-center space-x-8">
            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </section>
    </main>
  )
}

// 네비게이션 카드 컴포넌트
function NavCard({ title, description, link }: { title: string; description: string; link: string }) {
  return (
    <Link href={link} className="block bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <span className="text-blue-600 font-medium">자세히 보기 &rarr;</span>
    </Link>
  )
} 