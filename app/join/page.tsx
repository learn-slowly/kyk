export default function JoinPage() {
  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">함께 만드는 변화</h1>
        
        <div className="bg-white rounded-xl shadow-sm p-8 mb-10">
          <p className="text-xl text-center text-gray-700 mb-4">
            권영국 후보의 캠페인에 다양한 방법으로 참여하세요.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <JoinCard 
            title="자원봉사 신청" 
            description="캠페인 자원봉사자로 참여하여 새로운 미래를 함께 만들어가세요." 
            buttonText="자원봉사 신청하기"
          />
          <JoinCard 
            title="정책 제안하기" 
            description="더 나은 대한민국을 위한 정책 아이디어를 제안해 주세요." 
            buttonText="정책 제안하기"
          />
          <JoinCard 
            title="지지 서명하기" 
            description="권영국 후보를 지지하는 온라인 서명에 동참해 주세요." 
            buttonText="서명하기"
          />
        </div>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-6">자원봉사자 모집</h2>
              <p className="text-gray-700 mb-6">
                권영국 후보의 선거 캠페인을 도와주실 자원봉사자를 모집합니다. 
                다양한 분야에서 여러분의 재능을 발휘해보세요.
              </p>
              <h3 className="text-xl font-semibold mb-4">모집 분야</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-6">
                <li>온라인 홍보팀</li>
                <li>현장 캠페인 지원팀</li>
                <li>정책 연구팀</li>
                <li>유권자 소통팀</li>
                <li>행사 운영팀</li>
              </ul>
              <button className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 text-white px-6 py-2 rounded-full font-bold hover:opacity-90">
                지원서 작성하기
              </button>
            </div>
            <div className="bg-gray-200 flex items-center justify-center">
              <div className="text-center p-8">
                <h3 className="text-2xl font-bold mb-4">자원봉사자 혜택</h3>
                <ul className="space-y-3 text-left">
                  <li className="flex items-center">
                    <CheckIcon /> <span className="ml-2">캠페인 공식 활동 증명서 발급</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon /> <span className="ml-2">특별 행사 및 교육 참여 기회</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon /> <span className="ml-2">활동 우수자 표창장 수여</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon /> <span className="ml-2">캠페인 기념품 제공</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">자주 묻는 질문</h2>
          <div className="space-y-6 max-w-3xl mx-auto">
            <FaqItem 
              question="자원봉사는 어떻게 신청하나요?" 
              answer="웹사이트의 '자원봉사 신청하기' 버튼을 클릭하여 신청서를 작성하시면 됩니다. 신청 후 담당자가 연락드릴 예정입니다."
            />
            <FaqItem 
              question="활동 시간은 어떻게 되나요?" 
              answer="활동 분야에 따라 다르며, 주중/주말, 오전/오후 등 자원봉사자의 가능한 시간대를 고려하여 배정됩니다."
            />
            <FaqItem 
              question="특별한 자격이 필요한가요?" 
              answer="특별한 자격은 필요 없습니다. 열정과 참여 의지만 있으시면 누구나 지원 가능합니다."
            />
            <FaqItem 
              question="온라인으로만 참여할 수 있나요?" 
              answer="네, 온라인 홍보팀은 주로 온라인 활동을 하게 됩니다. 현장 참여가 어려운 분들도 충분히 기여하실 수 있습니다."
            />
          </div>
        </div>
        
        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold mb-6">지금 바로 함께하세요</h2>
          <button className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 text-white px-8 py-3 rounded-full font-bold text-lg hover:opacity-90">
            캠페인 참여하기
          </button>
        </div>
      </div>
    </main>
  )
}

function JoinCard({ title, description, buttonText }: { title: string; description: string; buttonText: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-8 text-center hover:shadow-md transition-shadow">
      <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-6">
        {/* 아이콘 자리 */}
      </div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700">
        {buttonText}
      </button>
    </div>
  )
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border-b pb-6">
      <h3 className="text-lg font-bold mb-3">{question}</h3>
      <p className="text-gray-600">{answer}</p>
    </div>
  )
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  )
} 