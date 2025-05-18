"use client";

import React, { useState, useEffect } from 'react';
import Modal from './Modal'; // 방금 만든 Modal 컴포넌트 import
// import { Schedule } from '../page'; // Schedule 타입이 필요하다면 주석 해제

// 기존 HomeClient 컴포넌트 내용이 있다면 여기에...
// 예시: const HomeClient: React.FC = () => { ... }

export default function HomeClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContentKey, setModalContentKey] = useState<string | null>(null); // 어떤 내용을 모달에 보여줄지 결정 (예: 'welcome')

  useEffect(() => {
    // 페이지 첫 방문 시 환영 모달을 띄우고, localStorage에 기록하여 다시 보지 않도록 함
    const welcomeModalShown = localStorage.getItem('welcomeModalShown');
    if (!welcomeModalShown) {
      setModalContentKey('welcome'); // 'welcome' 타입의 모달을 띄우도록 설정
      setIsModalOpen(true);
    }
  }, []);

  const handleCloseModal = (dontShowAgain?: boolean) => {
    setIsModalOpen(false);
    if (modalContentKey === 'welcome' && dontShowAgain) {
      localStorage.setItem('welcomeModalShown', 'true');
    }
    setModalContentKey(null); // 모달 내용 키 초기화
  };

  // 모달에 표시할 내용을 결정하는 함수 (여러 종류의 모달을 띄울 경우 유용)
  const renderModalContent = () => {
    switch (modalContentKey) {
      case 'welcome':
        return (
          <>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '20px' }}>
              저희 웹사이트에 오신 것을 환영합니다! 🎉
              <br />
              다양한 정책 정보와 소식을 확인해보세요.
            </p>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button 
                onClick={() => handleCloseModal(true)} 
                style={{ 
                  padding: '8px 15px', 
                  marginRight: '10px', 
                  border: '1px solid #ccc', 
                  borderRadius: '5px', 
                  cursor: 'pointer' 
                }}
              >
                알겠습니다 (다시 보지 않기)
              </button>
              <button 
                onClick={() => handleCloseModal(false)} 
                style={{ 
                  padding: '8px 15px', 
                  backgroundColor: '#0070f3', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '5px', 
                  cursor: 'pointer' 
                }}
              >
                닫기
              </button>
            </div>
          </>
        );
      // 다른 모달 케이스 추가 가능
      // case 'event':
      //   return <p>특별 이벤트 안내입니다!</p>;
      default:
        return null;
    }
  };

  return (
    <main style={{ padding: '20px' }}>
      {/* 기존 HomeClient의 페이지 내용이 여기에 들어갑니다. */}
      <h1>메인 페이지 콘텐츠</h1>
      <p>이곳에 홈페이지의 주요 내용이 표시됩니다.</p>
      <p>...</p>

      {/* 모달 컴포넌트 사용 */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => handleCloseModal(false)} // 기본 닫기는 다시 보지 않기 아님
        title={modalContentKey === 'welcome' ? "환영합니다!" : undefined} // 제목 설정
        showCloseButton={true} // X 버튼 표시 (modalContentKey가 welcome일 때는 내부 버튼으로 닫기 유도)
      >
        {renderModalContent()}
      </Modal>
    </main>
  );
} 