'use client';

import { useState } from 'react';

// 타입 정의
type Post = {
  _id: string;
  title: string;
  category: string;
  publishedAt: string;
  body: string;
  thumbnail?: { 
    asset?: { 
      url: string 
    } 
  };
};

export default function PostsClient({ posts }: { posts: Post[] }) {
  const [filter, setFilter] = useState<string>('all');
  
  // 필터링된 게시글
  const filteredPosts = filter === 'all' 
    ? posts 
    : posts.filter(post => post.category === filter);
  
  // 카테고리 목록 (중복 제거)
  const categories = ['all', ...Array.from(new Set(posts.map(post => post.category)))];
  
  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="display-5 fw-bold border-bottom pb-3 mb-4" 
              style={{
                backgroundImage: 'linear-gradient(90deg, #FF0000, #FFed00, #00a366)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
            뉴스 & 언론보도
          </h1>
          
          {/* 카테고리 필터 */}
          <div className="d-flex flex-wrap gap-2 mb-4">
            {categories.map(category => (
              <button 
                key={category}
                onClick={() => setFilter(category)}
                className={`btn ${filter === category 
                  ? 'btn-primary' 
                  : 'btn-outline-secondary'}`}
                style={{
                  borderRadius: '20px',
                  ...(filter === category ? {
                    background: 'linear-gradient(90deg, #FF0000, #FFed00, #00a366)',
                    border: 'none'
                  } : {})
                }}
              >
                {category === 'all' ? '전체' : category}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* 게시글 목록 */}
      <div className="row g-4">
        {filteredPosts.map((post) => (
          <div key={post._id} className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm border-0 rounded-3 overflow-hidden">
              {post.thumbnail?.asset?.url && (
                <div className="card-img-top" style={{
                  height: '180px',
                  backgroundImage: `url(${post.thumbnail.asset.url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}></div>
              )}
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="badge" style={{
                    background: 'linear-gradient(90deg, #FF0000, #FFed00, #00a366)',
                    color: 'white'
                  }}>
                    {post.category}
                  </span>
                  <small className="text-muted">
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </small>
                </div>
                <h5 className="card-title">{post.title}</h5>
                <p className="card-text text-muted">
                  {post.body.length > 100 
                    ? post.body.substring(0, 100) + '...' 
                    : post.body}
                </p>
                <button className="btn btn-sm btn-outline-primary mt-2"
                        style={{borderRadius: '15px'}}>
                  자세히 보기
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {/* 결과 없음 */}
        {filteredPosts.length === 0 && (
          <div className="col-12 text-center p-5">
            <div className="py-5 bg-light rounded-3">
              <i className="bi bi-inbox-fill fs-1 text-muted"></i>
              <p className="mt-3 mb-0">게시글이 없습니다.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}