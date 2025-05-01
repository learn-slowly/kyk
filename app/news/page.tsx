export default function NewsPage() {
  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">뉴스 & 미디어</h1>
        
        <div className="bg-white rounded-xl shadow-sm p-8 mb-10">
          <p className="text-xl text-center text-gray-700 mb-4">
            권영국 후보의 최신 뉴스와 미디어 자료를 확인하세요.
          </p>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">최신 뉴스</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <NewsCard 
              title="후보 출마 선언" 
              date="2025.04.15" 
              summary="권영국 후보가 대선 출마를 공식 선언했습니다." 
              imagePath="/images/news1.jpg"
            />
            <NewsCard 
              title="정책 발표회 개최" 
              date="2025.04.10" 
              summary="주요 정책 발표회를 성황리에 개최했습니다." 
              imagePath="/images/news2.jpg"
            />
            <NewsCard 
              title="전국 순회 캠페인 시작" 
              date="2025.04.05" 
              summary="전국 주요 도시 순회 캠페인을 시작했습니다." 
              imagePath="/images/news3.jpg"
            />
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">보도자료</h2>
          <div className="bg-white rounded-xl shadow-sm divide-y">
            <PressRelease 
              title="권영국 후보, 청년 일자리 창출 방안 발표" 
              date="2025.04.12" 
              summary="청년 실업 문제 해결을 위한 구체적인 정책 방안을 제시했습니다."
            />
            <PressRelease 
              title="권영국 후보, 저출산 대책 종합계획 발표" 
              date="2025.04.08" 
              summary="저출산 문제 해결을 위한 종합적인 정책 방안을 제시했습니다."
            />
            <PressRelease 
              title="권영국 후보, 지역 경제 활성화 방안 발표" 
              date="2025.04.03" 
              summary="지역 균형 발전을 위한 경제 활성화 정책을 발표했습니다."
            />
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">연설문</h2>
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="mb-8 pb-8 border-b">
              <h3 className="text-xl font-bold mb-2">대선 출마 선언 연설문</h3>
              <p className="text-gray-500 mb-4">2025년 4월 15일</p>
              <p className="text-gray-700">
                [연설문 내용 일부]
              </p>
              <button className="mt-4 text-blue-600 font-medium">전체 연설문 읽기 &rarr;</button>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">정책 발표회 기조연설</h3>
              <p className="text-gray-500 mb-4">2025년 4월 10일</p>
              <p className="text-gray-700">
                [연설문 내용 일부]
              </p>
              <button className="mt-4 text-blue-600 font-medium">전체 연설문 읽기 &rarr;</button>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 text-white px-8 py-3 rounded-full font-bold text-lg hover:opacity-90">
            더 많은 뉴스 보기
          </button>
        </div>
      </div>
    </main>
  )
}

function NewsCard({ title, date, summary, imagePath }: { title: string; date: string; summary: string; imagePath: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-48 bg-gray-200">
        {/* 뉴스 이미지 */}
      </div>
      <div className="p-6">
        <p className="text-gray-500 text-sm mb-2">{date}</p>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{summary}</p>
        <button className="text-blue-600 font-medium">자세히 보기 &rarr;</button>
      </div>
    </div>
  )
}

function PressRelease({ title, date, summary }: { title: string; date: string; summary: string }) {
  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <p className="text-gray-500 text-sm mb-2">{date}</p>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{summary}</p>
      <button className="text-blue-600 font-medium">자세히 보기 &rarr;</button>
    </div>
  )
} 