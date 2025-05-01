export default function ProfilePage() {
  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">권영국 후보 소개</h1>
        
        <div className="bg-white rounded-xl shadow-sm p-8 mb-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-40 h-40 md:w-64 md:h-64 bg-gray-200 rounded-full flex-shrink-0">
              {/* 후보 이미지 자리 */}
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">권영국</h2>
              <p className="text-xl text-gray-600 mb-6">대한민국의 새로운 미래를 위한 대선 후보</p>
              <div className="space-y-4 text-gray-700">
                <p>
                  권영국 후보는 [간략한 소개 텍스트]
                </p>
                <p>
                  [추가 소개 텍스트]
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <ProfileSection 
            title="학력 및 경력" 
            items={[
              "XXXX년 - XXXX년: 직위/소속",
              "XXXX년 - XXXX년: 직위/소속",
              "XXXX년 - XXXX년: 직위/소속",
              "XXXX년 - XXXX년: 직위/소속",
            ]} 
          />
          <ProfileSection 
            title="주요 활동" 
            items={[
              "주요 활동 1",
              "주요 활동 2",
              "주요 활동 3",
              "주요 활동 4",
            ]} 
          />
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-8 mb-10">
          <h2 className="text-2xl font-bold mb-6">비전과 가치</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              [비전과 가치 설명 텍스트]
            </p>
            <p>
              [추가 비전과 가치 설명 텍스트]
            </p>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 text-white px-8 py-3 rounded-full font-bold text-lg hover:opacity-90">
            정책 살펴보기
          </button>
        </div>
      </div>
    </main>
  )
}

function ProfileSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start">
            <span className="text-green-500 mr-2">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
} 