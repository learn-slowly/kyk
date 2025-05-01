export default function ContactPage() {
  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">연락처</h1>
        
        <div className="bg-white rounded-xl shadow-sm p-8 mb-10">
          <p className="text-xl text-center text-gray-700 mb-4">
            권영국 캠페인에 연락하거나 문의사항을 보내주세요.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-8 h-full">
              <h2 className="text-2xl font-bold mb-6">캠페인 본부 정보</h2>
              
              <div className="space-y-6">
                <ContactInfo 
                  title="주소" 
                  info={["서울특별시 종로구 1번지", "권영국 선거 캠페인 본부"]}
                />
                <ContactInfo 
                  title="전화번호" 
                  info={["02-123-4567", "평일 09:00 - 18:00"]}
                />
                <ContactInfo 
                  title="이메일" 
                  info={["contact@kyk2027.kr", "24시간 접수 가능"]}
                />
                <ContactInfo 
                  title="팩스" 
                  info={["02-123-4568"]}
                />
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">소셜 미디어</h3>
                <div className="flex space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-6">문의하기</h2>
              <form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
                      이름
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="이름을 입력하세요"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
                      이메일
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="이메일을 입력하세요"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="subject">
                    제목
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="제목을 입력하세요"
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="message">
                    메시지
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="메시지를 입력하세요"
                  ></textarea>
                </div>
                
                <div className="mb-6">
                  <label className="flex items-center">
                    <input type="checkbox" className="h-5 w-5 text-green-500 rounded" />
                    <span className="ml-2 text-gray-700">개인정보 수집 및 이용에 동의합니다</span>
                  </label>
                </div>
                
                <button 
                  type="submit" 
                  className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 text-white px-6 py-3 rounded-md font-bold text-lg hover:opacity-90"
                >
                  보내기
                </button>
              </form>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-8 mb-10">
          <h2 className="text-2xl font-bold mb-6 text-center">캠페인 사무소 위치</h2>
          <div className="h-96 bg-gray-200 rounded-lg">
            {/* 지도가 들어갈 자리 */}
          </div>
          <div className="mt-6 text-center">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700">
              길찾기
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

function ContactInfo({ title, info }: { title: string; info: string[] }) {
  return (
    <div className="flex">
      <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0">
        {/* 아이콘 자리 */}
      </div>
      <div className="ml-4">
        <h4 className="text-lg font-semibold">{title}</h4>
        {info.map((item, index) => (
          <p key={index} className="text-gray-600">{item}</p>
        ))}
      </div>
    </div>
  )
} 