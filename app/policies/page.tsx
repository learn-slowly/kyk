export default function PoliciesPage() {
  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">권영국의 주요 정책</h1>
        
        <div className="bg-white rounded-xl shadow-sm p-8 mb-10">
          <p className="text-xl text-center text-gray-700 mb-4">
            대한민국의 새로운 미래를 위한 권영국의 주요 정책을 소개합니다.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <PolicyCard 
            id="economy"
            title="경제 정책" 
            summary="경제 성장과 일자리 창출을 위한 정책"
          />
          <PolicyCard 
            id="education"
            title="교육 정책" 
            summary="미래 인재 양성을 위한 교육 혁신"
          />
          <PolicyCard 
            id="welfare"
            title="복지 정책" 
            summary="모두가 행복한 사회 안전망 구축"
          />
          <PolicyCard 
            id="environment"
            title="환경 정책" 
            summary="지속가능한 발전과 환경 보전"
          />
          <PolicyCard 
            id="diplomacy"
            title="외교 안보 정책" 
            summary="평화로운 국제 관계와 국가 안보 강화"
          />
          <PolicyCard 
            id="culture"
            title="문화 정책" 
            summary="문화 다양성과 창의성 증진"
          />
        </div>
        
        <div id="economy" className="policy-detail bg-white rounded-xl shadow-sm p-8 mb-10">
          <h2 className="text-2xl font-bold mb-6 border-b pb-4">경제 정책</h2>
          <div className="space-y-4 text-gray-700">
            <h3 className="text-xl font-semibold">경제 활성화 방안</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>경제 정책 1</li>
              <li>경제 정책 2</li>
              <li>경제 정책 3</li>
            </ul>
            <h3 className="text-xl font-semibold mt-6">일자리 창출 방안</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>일자리 정책 1</li>
              <li>일자리 정책 2</li>
              <li>일자리 정책 3</li>
            </ul>
          </div>
        </div>
        
        <div id="education" className="policy-detail bg-white rounded-xl shadow-sm p-8 mb-10">
          <h2 className="text-2xl font-bold mb-6 border-b pb-4">교육 정책</h2>
          <div className="space-y-4 text-gray-700">
            <h3 className="text-xl font-semibold">교육 혁신 방안</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>교육 정책 1</li>
              <li>교육 정책 2</li>
              <li>교육 정책 3</li>
            </ul>
          </div>
        </div>
        
        {/* 나머지 정책 섹션 생략 */}
        
        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 text-white px-8 py-3 rounded-full font-bold text-lg hover:opacity-90">
            더 많은 정책 제안하기
          </button>
        </div>
      </div>
    </main>
  )
}

function PolicyCard({ id, title, summary }: { id: string; title: string; summary: string }) {
  return (
    <a href={`#${id}`} className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0">
          {/* 아이콘 자리 */}
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-gray-600">{summary}</p>
        </div>
      </div>
    </a>
  )
} 