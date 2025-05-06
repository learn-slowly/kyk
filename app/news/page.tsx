'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchSanityData } from '../lib/sanity';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

interface NewsItem {
  _id: string;
  title: string;
  slug: { current: string };
  type: 'news' | 'press' | 'speech' | 'media';
  publishedAt: string;
  mainImage?: { 
    asset: { 
      _ref: string;
      url: string;
    } 
  };
  summary?: string;
}

export default function NewsPage() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [pressItems, setPressItems] = useState<NewsItem[]>([]);
  const [speechItems, setSpeechItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    async function fetchData() {
      try {
        const query = `*[_type == "news"] | order(publishedAt desc) {
          _id,
          title,
          slug,
          type,
          publishedAt,
          mainImage {
            asset-> {
              _ref,
              url
            }
          },
          summary
        }`;
        
        const data = await fetchSanityData<NewsItem[]>(query);
        
        if (data && Array.isArray(data)) {
          // 뉴스 타입별로 분류
          setNewsItems(data.filter(item => item && item.type === 'news') || []);
          setPressItems(data.filter(item => item && item.type === 'press') || []);
          setSpeechItems(data.filter(item => item && item.type === 'speech') || []);
        } else {
          console.error('Sanity에서 받은 데이터가 배열 형식이 아닙니다:', data);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('뉴스를 불러오는데 실패했습니다:', error);
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, []);
  
  // 현재 탭에 따라 표시할 뉴스 아이템 필터링
  const displayItems = () => {
    switch(activeTab) {
      case 'news':
        return newsItems;
      case 'press':
        return pressItems;
      case 'speech':
        return speechItems;
      default:
        // 모든 아이템을 최신순으로 정렬
        return [...newsItems, ...pressItems, ...speechItems]
          .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    }
  };
  
  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    try {
      // 날짜 문자열이 ISO 형식('YYYY-MM-DD')이 아닐 경우를 대비한 안전한 파싱
      const parsedDate = parseISO(dateString);
      // 유효한 날짜인지 확인
      if (isNaN(parsedDate.getTime())) {
        throw new Error('Invalid date');
      }
      return format(parsedDate, 'yyyy년 MM월 dd일', { locale: ko });
    } catch (error) {
      console.error('날짜 형식 오류:', dateString, error);
      // 오류 발생 시 포맷팅할 수 없음을 표시
      return '날짜 정보 없음';
    }
  };
  
  // 아이템 타입에 따른 라벨 반환
  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      news: '뉴스',
      press: '보도자료',
      speech: '연설문',
      media: '미디어 출연'
    };
    return labels[type] || type;
  };

  return (
    <div className="min-vh-100 py-5">
      <div className="container">
        {/* 헤더 섹션 */}
        <div className="row mb-5">
          <div className="col-lg-8 mx-auto text-center">
            <h1 className="display-4 fw-bold mb-4">뉴스 & 미디어</h1>
            <p className="lead text-muted">
              권영국 후보의 최신 뉴스와 미디어 자료를 확인하세요.
            </p>
          </div>
        </div>
        
        {/* 필터 탭 */}
        <div className="row mb-4">
          <div className="col-12">
            <ul className="nav nav-pills justify-content-center">
              <li className="nav-item mx-1">
                <button 
                  className={`nav-link px-4 ${activeTab === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveTab('all')}
                >
                  전체
                </button>
              </li>
              <li className="nav-item mx-1">
                <button 
                  className={`nav-link px-4 ${activeTab === 'news' ? 'active' : ''}`}
                  onClick={() => setActiveTab('news')}
                >
                  뉴스
                </button>
              </li>
              <li className="nav-item mx-1">
                <button 
                  className={`nav-link px-4 ${activeTab === 'press' ? 'active' : ''}`}
                  onClick={() => setActiveTab('press')}
                >
                  보도자료
                </button>
              </li>
              <li className="nav-item mx-1">
                <button 
                  className={`nav-link px-4 ${activeTab === 'speech' ? 'active' : ''}`}
                  onClick={() => setActiveTab('speech')}
                >
                  연설문
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        {/* 콘텐츠 영역 */}
        <div className="row g-4">
          {isLoading ? (
            // 로딩 상태 표시
            <div className="col-12 text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">로딩 중...</span>
              </div>
              <p className="mt-3">뉴스를 불러오는 중입니다...</p>
            </div>
          ) : displayItems().length > 0 ? (
            // 뉴스 아이템 목록
            displayItems().map(item => (
              <div className="col-md-6 col-lg-4" key={item._id}>
                <div className="card h-100 shadow-sm border-0 hover-translate-up">
                  {/* 대표 이미지 */}
                  <div className="card-img-top position-relative overflow-hidden" style={{ height: '200px' }}>
                    {item.mainImage?.asset?.url ? (
                      <Image 
                        src={item.mainImage.asset.url} 
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-fit-cover"
                      />
                    ) : (
                      <div className="bg-light w-100 h-100 d-flex align-items-center justify-content-center">
                        <i className="bi bi-image text-muted" style={{ fontSize: '2rem' }}></i>
                      </div>
                    )}
                    <div className="position-absolute top-0 start-0 m-3">
                      <span className="badge bg-primary">{getTypeLabel(item.type)}</span>
                    </div>
                  </div>
                  
                  {/* 콘텐츠 */}
                  <div className="card-body d-flex flex-column">
                    <div className="small text-muted mb-2">{formatDate(item.publishedAt)}</div>
                    <h3 className="card-title h5 fw-bold">{item.title}</h3>
                    <p className="card-text text-muted flex-grow-1">
                      {item.summary ? 
                        (item.summary.length > 100 ? `${item.summary.substring(0, 100)}...` : item.summary) 
                        : '내용 없음'}
                    </p>
                    <Link 
                      href={`/news/${item.slug.current}`} 
                      className="btn btn-outline-primary mt-3"
                    >
                      자세히 보기 <i className="bi bi-arrow-right ms-1"></i>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // 데이터가 없는 경우
            <div className="col-12 text-center py-5">
              <div className="py-5 my-5">
                <i className="bi bi-inbox text-muted" style={{ fontSize: '3rem' }}></i>
                <h4 className="mt-3">게시된 콘텐츠가 없습니다</h4>
                <p className="text-muted">곧 새로운 소식으로 찾아뵙겠습니다.</p>
              </div>
            </div>
          )}
        </div>
        
        {/* 인터랙티브 CMS 배너 */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="card bg-gradient-primary text-white shadow rounded-3 border-0 overflow-hidden">
              <div className="card-body p-0">
                <div className="row g-0">
                  <div className="col-lg-8 p-5">
                    <h3 className="card-title mb-3">콘텐츠 관리 시스템</h3>
                    <p className="card-text mb-4">
                      권영국 캠페인 관계자를 위한 편리한 콘텐츠 관리 시스템을 이용해보세요.
                      쉽고 간편하게 뉴스와 미디어 자료를 업로드하고 관리할 수 있습니다.
                    </p>
                    <Link href="/studio" className="btn btn-light">
                      CMS 관리자 페이지 <i className="bi bi-box-arrow-up-right ms-1"></i>
                    </Link>
                  </div>
                  <div className="col-lg-4 d-none d-lg-block">
                    <div className="position-relative h-100">
                      <div 
                        className="position-absolute top-0 end-0 w-100 h-100 bg-dark opacity-10"
                        style={{ 
                          backgroundImage: 'url("https://images.unsplash.com/photo-1554774853-aae0a22c8aa4")', 
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .hover-translate-up {
          transition: transform 0.3s ease;
        }
        .hover-translate-up:hover {
          transform: translateY(-5px);
        }
        .bg-gradient-primary {
          background: linear-gradient(90deg, #FF0000 0%, #FFFF00 50%, #00FF00 100%);
        }
      `}</style>
    </div>
  );
} 