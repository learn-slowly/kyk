'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function JoinContactPage() {
  const [activeTab, setActiveTab] = useState('join');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 폼 입력 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // 에러 상태 초기화
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 간단한 유효성 검사
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = '이름을 입력해주세요';
    }
    
    if (!formData.email.trim()) {
      errors.email = '이메일을 입력해주세요';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = '유효한 이메일 주소를 입력해주세요';
    }
    
    if (!formData.message.trim()) {
      errors.message = '문의 내용을 입력해주세요';
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // 폼 제출 시뮬레이션
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setFormSubmitted(true);
      
      // 폼 초기화
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 1500);
  };

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* 페이지 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">참여하기 / 연락처</h1>
          <p className="text-xl text-gray-700">
            권영국 후보의 캠페인에 다양한 방법으로 참여하고 연락하세요
          </p>
        </div>
        
        {/* 탭 네비게이션 */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              className={`px-6 py-3 text-lg rounded-l-lg ${activeTab === 'join' 
                ? 'bg-blue-600 text-white font-bold' 
                : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setActiveTab('join')}
            >
              참여하기
            </button>
            <button
              className={`px-6 py-3 text-lg rounded-r-lg ${activeTab === 'contact' 
                ? 'bg-blue-600 text-white font-bold' 
                : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setActiveTab('contact')}
            >
              연락처
            </button>
          </div>
        </div>
        
        {/* 참여하기 탭 내용 */}
        {activeTab === 'join' && (
          <div>
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
                  <button 
                    className="text-white px-6 py-2 rounded-full font-bold hover:opacity-90"
                    style={{
                      background: 'linear-gradient(90deg, #FF0000 0%, #FFed00 50%, #00a366 100%)'
                    }}
                  >
                    지원서 작성하기
                  </button>
                </div>
                <div className="bg-gray-100 flex items-center justify-center">
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
          </div>
        )}
        
        {/* 연락처 탭 내용 */}
        {activeTab === 'contact' && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* 연락처 정보 */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm h-full p-6">
                <h2 className="text-2xl font-bold mb-6">캠페인 본부 정보</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-blue-600 text-white rounded-full p-3 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">주소</h3>
                      <p className="text-gray-600">서울특별시 종로구 세종대로 178<br />권영국 캠페인 본부</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-600 text-white rounded-full p-3 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">전화</h3>
                      <p className="text-gray-600">02-123-4567</p>
                      <p className="text-gray-500 text-sm">평일 09:00 - 18:00</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-600 text-white rounded-full p-3 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">이메일</h3>
                      <p className="text-gray-600">contact@kyk2027.kr</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-600 text-white rounded-full p-3 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">일정 문의</h3>
                      <p className="text-gray-600">schedule@kyk2027.kr</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 mt-8 pt-8">
                  <h3 className="text-lg font-semibold mb-4">소셜 미디어</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="bg-gray-100 hover:bg-blue-100 text-blue-600 p-3 rounded-full transition duration-300">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a href="#" className="bg-gray-100 hover:bg-blue-100 text-blue-600 p-3 rounded-full transition duration-300">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                    <a href="#" className="bg-gray-100 hover:bg-blue-100 text-blue-600 p-3 rounded-full transition duration-300">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a href="#" className="bg-gray-100 hover:bg-blue-100 text-blue-600 p-3 rounded-full transition duration-300">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 문의 폼 */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-sm h-full p-6">
                <h2 className="text-2xl font-bold mb-6">문의하기</h2>
                
                {formSubmitted ? (
                  <div className="text-center py-12">
                    <div className="text-green-500 text-6xl mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">문의가 성공적으로 접수되었습니다</h3>
                    <p className="text-gray-600 mb-6">빠른 시일 내에 답변 드리겠습니다.</p>
                    <button 
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                      onClick={() => setFormSubmitted(false)}
                    >
                      다른 문의하기
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-gray-700 font-medium mb-2">이름 *</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="홍길동"
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                        {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">이메일 *</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="example@email.com"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                        {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">연락처</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="010-1234-5678"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">문의 유형</label>
                        <select
                          id="subject"
                          name="subject"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={formData.subject}
                          onChange={handleInputChange}
                        >
                          <option value="">선택해주세요</option>
                          <option value="general">일반 문의</option>
                          <option value="policy">정책 관련 문의</option>
                          <option value="schedule">일정 문의</option>
                          <option value="media">언론 보도 문의</option>
                          <option value="donation">후원 문의</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-gray-700 font-medium mb-2">문의 내용 *</label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.message ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="문의사항을 입력해주세요"
                        value={formData.message}
                        onChange={handleInputChange}
                      ></textarea>
                      {formErrors.message && <p className="text-red-500 text-sm mt-1">{formErrors.message}</p>}
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="privacy"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        required
                      />
                      <label htmlFor="privacy" className="ml-2 block text-gray-700">
                        개인정보 수집 및 이용에 동의합니다
                      </label>
                    </div>
                    
                    <div className="text-center">
                      <button
                        type="submit"
                        className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            전송 중...
                          </span>
                        ) : '문의하기'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
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
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border-b pb-6">
      <h3 className="text-lg font-bold mb-3">{question}</h3>
      <p className="text-gray-600">{answer}</p>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );
} 