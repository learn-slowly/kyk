'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ClientPost } from './page';

// 카테고리 표시명 매핑
const CATEGORY_LABELS = {
  'statement': '성명',
  'today': '오늘의 영국',
  'media': '언론 속 영국',
  'all': '전체'
};

// 카테고리별 색상
const CATEGORY_COLORS = {
  'statement': '#4CAF50', // 녹색
  'today': '#2196F3',     // 파란색
  'media': '#FF9800',     // 주황색
  'all': '#757575'        // 회색
};

export default function PostsClient({ posts }: { posts: ClientPost[] }) {
  const [filter, setFilter] = useState<'all' | 'statement' | 'today' | 'media'>('all');
  const [selectedPost, setSelectedPost] = useState<ClientPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageModalSrc, setImageModalSrc] = useState<string | null>(null);
  
  // 필터링된 게시글
  const filteredPosts = filter === 'all' 
    ? posts 
    : posts.filter(post => post.category === filter);
  
  // 모달 닫기 함수
  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedPost(null), 300); // 애니메이션 후 선택 포스트 제거
  };
  
  // 이미지 모달 열기
  const openImageModal = (src: string | undefined, e: React.MouseEvent) => {
    if (!src) return;
    e.stopPropagation(); // 부모 요소 클릭 이벤트 전파 중지
    setImageModalSrc(src);
  };
  
  // 이미지 모달 닫기
  const closeImageModal = () => {
    setImageModalSrc(null);
  };
  
  // 게시글 선택 함수
  const openPost = (post: ClientPost) => {
    console.log('Opening post with image:', post.imageUrl);
    setSelectedPost(post);
    setIsModalOpen(true);
  };
  
  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (imageModalSrc) {
          closeImageModal();
        } else if (isModalOpen) {
          closeModal();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, imageModalSrc]);
  
  return (
    <div className="container py-5">
      <div className="row mb-5">
        <div className="col-12">
          <h2 className="fw-bold mb-4">뉴스</h2>
          <p className="text-secondary mb-4">권영국 후보의 최신 소식과 언론 보도를 확인하세요.</p>
          
          {/* 카테고리 필터 - 미니멀 디자인 */}
          <div className="d-flex flex-wrap gap-2 mb-4">
            {(['all', 'statement', 'today', 'media'] as const).map(category => (
              <button 
                key={category}
                onClick={() => setFilter(category)}
                className={`btn btn-sm ${filter === category ? 'active' : ''}`}
                style={{
                  borderRadius: '20px',
                  padding: '8px 16px',
                  fontWeight: 500,
                  backgroundColor: filter === category ? CATEGORY_COLORS[category] : 'transparent',
                  color: filter === category ? 'white' : CATEGORY_COLORS[category],
                  border: `1px solid ${CATEGORY_COLORS[category]}`,
                  transition: 'all 0.2s ease'
                }}
              >
                {CATEGORY_LABELS[category]}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* 게시글 목록 - 미니멀 디자인 */}
      <div className="row g-4">
        {filteredPosts.map((post) => {
          // 요약 텍스트 준비 (summary가 없으면 body에서 추출)
          const summaryText = post.summary || 
            (post.body?.length > 120 ? post.body.substring(0, 120) + '...' : post.body);
          
          return (
            <div key={post._id} className="col-md-6 col-lg-4">
              <div 
                className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden"
                style={{
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}
                onClick={() => openPost(post)}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                }}
              >
                {post.imageUrl && (
                  <div 
                    className="card-img-top position-relative" 
                    style={{ height: '180px', overflow: 'hidden' }}
                  >
                    <div 
                      className="image-overlay"
                      onClick={(e) => post.imageUrl && openImageModal(post.imageUrl, e)}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0,0,0,0)',
                        transition: 'background-color 0.3s ease',
                        zIndex: 10,
                        cursor: 'zoom-in',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        opacity: 0
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.3)';
                        e.currentTarget.style.opacity = '1';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0)';
                        e.currentTarget.style.opacity = '0';
                      }}
                    >
                      <span className="badge bg-dark bg-opacity-75 rounded-pill px-3 py-2">
                        <i className="bi bi-zoom-in me-1"></i> 이미지 확대
                      </span>
                    </div>
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{ 
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                      }}
                      className="hover-zoom"
                    />
                  </div>
                )}
                <div className="card-body p-4">
                  {/* 카테고리 배지 및 링크 */}
                  <div className="mb-2 d-flex align-items-center flex-wrap"> 
                    <span
                      className="badge rounded-pill me-2"
                      style={{
                        backgroundColor: CATEGORY_COLORS[post.category],
                        fontWeight: 'normal',
                        padding: '6px 12px'
                      }}
                    >
                      {CATEGORY_LABELS[post.category]}
                    </span>
                    {post.category === 'today' && post.source && (
                      <a
                        href={post.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-decoration-none small"
                        style={{ color: CATEGORY_COLORS.today, fontWeight: '500' }}
                      >
                        📸 사진 더 보기 <i className="bi bi-box-arrow-up-right" style={{ fontSize: '0.8em' }}></i>
                      </a>
                    )}
                    {post.category === 'media' && post.source && (
                      <a
                        href={post.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-decoration-none small"
                        style={{ color: CATEGORY_COLORS.media, fontWeight: '500' }}
                      >
                        📰 전문 보기 <i className="bi bi-box-arrow-up-right" style={{ fontSize: '0.8em' }}></i>
                      </a>
                    )}
                  </div>
                  
                  {/* 타이틀 및 날짜/글쓴이 */}
                  <h5 className="card-title mb-2" style={{ cursor: 'pointer' }} onClick={() => openPost(post)}>{post.title}</h5>
                  <div className="mb-3 text-secondary small">
                    {new Date(post.publishedAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                    {post.author && <span className="ms-2">| {post.author}</span>} 
                  </div>
                  
                  <p className="card-text text-secondary small" style={{ cursor: 'pointer' }} onClick={() => openPost(post)}>
                    {summaryText}
                  </p>
                  
                  <div className="text-end mt-2" style={{ cursor: 'pointer' }} onClick={() => openPost(post)}>
                    <span className="small text-primary d-inline-flex align-items-center">
                      자세히 보기 <i className="bi bi-arrow-right ms-1"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {/* 결과 없음 */}
        {filteredPosts.length === 0 && (
          <div className="col-12 text-center p-5">
            <div className="py-5 bg-light rounded-4">
              <i className="bi bi-inbox fs-1 text-secondary"></i>
              <p className="mt-3 mb-0">등록된 게시물이 없습니다.</p>
            </div>
          </div>
        )}
      </div>
      
      {/* 포스트 상세 모달 */}
      {selectedPost && (
        <div className={`modal fade ${isModalOpen ? 'show' : ''}`} 
             style={{
               display: isModalOpen ? 'block' : 'none',
               backgroundColor: 'rgba(0,0,0,0.5)'
             }}>
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 pb-0">
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body p-4 p-md-5">
                {/* 카테고리 배지 및 링크 */}
                <div className="mb-2 d-flex align-items-center flex-wrap">
                  <span
                    className="badge rounded-pill me-2"
                    style={{
                      backgroundColor: CATEGORY_COLORS[selectedPost.category],
                      fontWeight: 'normal',
                      padding: '6px 12px'
                    }}
                  >
                    {CATEGORY_LABELS[selectedPost.category]}
                  </span>
                  {selectedPost.category === 'today' && selectedPost.source && (
                    <a
                      href={selectedPost.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none small"
                      style={{ color: CATEGORY_COLORS.today, fontWeight: '500' }}
                    >
                      📸 사진 더 보기 <i className="bi bi-box-arrow-up-right" style={{ fontSize: '0.8em' }}></i>
                    </a>
                  )}
                  {selectedPost.category === 'media' && selectedPost.source && (
                    <a
                      href={selectedPost.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none small"
                      style={{ color: CATEGORY_COLORS.media, fontWeight: '500' }}
                    >
                      📰 전문 보기 <i className="bi bi-box-arrow-up-right" style={{ fontSize: '0.8em' }}></i>
                    </a>
                  )}
                </div>
                
                <h3 className="modal-title mb-3">{selectedPost.title}</h3>
                <p className="text-secondary mb-4">
                  {new Date(selectedPost.publishedAt).toLocaleDateString('ko-KR', {
                    year: 'numeric', month: 'long', day: 'numeric',
                    weekday: 'long', hour: '2-digit', minute: '2-digit'
                  })}
                </p>
                {selectedPost.author && (
                  <p className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>
                    <i className="bi bi-person-fill me-1"></i> {selectedPost.author} 
                  </p>
                )}
                
                {selectedPost.imageUrl && (
                  <div className="mb-4 text-center">
                    <div 
                      className="position-relative d-inline-block"
                      style={{ cursor: 'zoom-in' }}
                      onClick={(e) => selectedPost.imageUrl && openImageModal(selectedPost.imageUrl, e)}
                    >
                      <img 
                        src={selectedPost.imageUrl} 
                        alt={selectedPost.title}
                        className="img-fluid rounded-3"
                        style={{ maxHeight: '400px' }}
                      />
                      <div 
                        className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                        style={{ 
                          backgroundColor: 'rgba(0,0,0,0)',
                          transition: 'background-color 0.3s ease',
                          borderRadius: '0.5rem'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.3)'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0)'}
                      >
                        <span className="badge bg-dark bg-opacity-75 rounded-pill px-3 py-2 opacity-0 transition"
                              style={{ transition: 'opacity 0.3s ease' }}
                              onMouseOver={(e) => e.currentTarget.style.opacity = '1'}>
                          <i className="bi bi-zoom-in me-1"></i> 이미지 확대
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* 내용 - 줄바꿈 보존 */}
                <div className="mt-4" style={{ whiteSpace: 'pre-line' }}>
                  {selectedPost.body}
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button type="button" 
                        className="btn btn-secondary rounded-pill px-4" 
                        onClick={closeModal}>
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 이미지 모달 */}
      {imageModalSrc && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ 
            backgroundColor: 'rgba(0,0,0,0.9)', 
            zIndex: 1100,
            cursor: 'zoom-out'
          }}
          onClick={closeImageModal}
        >
          <div className="position-absolute top-0 end-0 p-4">
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={closeImageModal}
              aria-label="Close"
            ></button>
          </div>
          
          <div 
            className="text-center p-3"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '90%', maxHeight: '90vh' }}
          >
            <img 
              src={imageModalSrc} 
              alt="확대 이미지" 
              className="img-fluid" 
              style={{ maxHeight: '85vh', objectFit: 'contain' }}
            />
          </div>
        </div>
      )}
      
      {/* 스타일 */}
      <style jsx>{`
        .modal.show {
          animation: fadeIn 0.3s forwards;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .modal-dialog {
          animation: slideUp 0.3s forwards;
        }
        
        @keyframes slideUp {
          from { transform: translate(0, 30px); }
          to { transform: translate(0, 0); }
        }
        
        .hover-zoom:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}