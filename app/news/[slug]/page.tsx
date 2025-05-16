'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { fetchSanityData } from '../../lib/sanity';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { PortableTextContent } from './PortableTextComponent';
import { TypedObject } from '@portabletext/types';

interface NewsDetail {
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
  content?: TypedObject[];
  videoUrl?: string;
}

export default function NewsDetailPage() {
  const { slug } = useParams();
  const [newsItem, setNewsItem] = useState<NewsDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNewsDetail() {
      try {
        if (!slug) {
          setError('뉴스를 찾을 수 없습니다');
          setIsLoading(false);
          return;
        }

        const query = `*[_type == "news" && slug.current == $slug][0]{
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
          summary,
          content,
          videoUrl
        }`;
        
        const data = await fetchSanityData<NewsDetail>(query, { slug });
        
        if (!data) {
          setError('뉴스를 찾을 수 없습니다');
        } else {
          setNewsItem(data);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('뉴스 상세 정보를 불러오는 데 실패했습니다:', error);
        setError('뉴스를 불러오는 데 문제가 발생했습니다');
        setIsLoading(false);
      }
    }
    
    fetchNewsDetail();
  }, [slug]);
  
  // 뉴스 타입에 따른 라벨 반환
  const getTypeLabel = (type?: string) => {
    if (!type) return '';
    
    const labels: Record<string, string> = {
      news: '뉴스',
      press: '보도자료',
      speech: '연설문',
      media: '미디어 출연'
    };
    return labels[type] || type;
  };
  
  // 날짜 포맷팅
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
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

  if (isLoading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">로딩 중...</span>
          </div>
          <p className="mt-3">뉴스를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  if (error || !newsItem) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <div className="text-center">
          <i className="bi bi-exclamation-circle text-danger" style={{ fontSize: '3rem' }}></i>
          <h2 className="mt-3 mb-4">{error || '뉴스를 찾을 수 없습니다'}</h2>
          <Link href="/news" className="btn btn-primary">
            뉴스 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 py-5">
      <div className="container">
        {/* 상단 네비게이션 */}
        <div className="mb-4">
          <Link href="/news" className="text-decoration-none text-muted">
            <i className="bi bi-arrow-left me-1"></i> 뉴스 목록으로 돌아가기
          </Link>
        </div>
        
        {/* 상세 내용 */}
        <div className="row">
          <div className="col-lg-8 mx-auto">
            {/* 타입 및 날짜 */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="badge bg-primary">{getTypeLabel(newsItem.type)}</span>
              <small className="text-muted">{formatDate(newsItem.publishedAt)}</small>
            </div>
            
            {/* 제목 */}
            <h1 className="display-5 fw-bold mb-4">{newsItem.title}</h1>
            
            {/* 요약 */}
            {newsItem.summary && (
              <p className="lead border-start border-primary border-3 ps-3 py-2 bg-light">
                {newsItem.summary}
              </p>
            )}
            
            {/* 대표 이미지 */}
            {newsItem.mainImage?.asset?.url && (
              <div className="position-relative mt-4 mb-5 rounded overflow-hidden" style={{ height: '400px' }}>
                <Image 
                  src={newsItem.mainImage.asset.url} 
                  alt={newsItem.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="object-fit-cover"
                />
              </div>
            )}
            
            {/* 비디오 */}
            {newsItem.videoUrl && (
              <div className="ratio ratio-16x9 my-4">
                <iframe 
                  src={newsItem.videoUrl.replace('watch?v=', 'embed/')} 
                  title={newsItem.title}
                  allowFullScreen
                ></iframe>
              </div>
            )}
            
            {/* 콘텐츠 본문 */}
            <div className="mt-4 mb-5">
              {newsItem.content ? (
                <PortableTextContent content={newsItem.content} />
              ) : (
                <p className="fs-5 text-muted">
                  {newsItem.summary || '콘텐츠가 없습니다.'}
                </p>
              )}
            </div>
            
            {/* 공유 버튼 */}
            <div className="d-flex justify-content-center gap-3 my-5">
              <button className="btn btn-outline-primary rounded-circle">
                <i className="bi bi-facebook"></i>
              </button>
              <button className="btn btn-outline-primary rounded-circle">
                <i className="bi bi-twitter-x"></i>
              </button>
              <button className="btn btn-outline-primary rounded-circle">
                <i className="bi bi-link-45deg"></i>
              </button>
            </div>
          </div>
        </div>
        
        {/* CMS 관리자 링크 */}
        <div className="row mt-5">
          <div className="col-lg-8 mx-auto">
            <div className="alert bg-gradient-primary text-white">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h4 className="alert-heading">이 콘텐츠 수정하기</h4>
                  <p className="mb-0">관리자 권한이 있다면 CMS에서 이 콘텐츠를 수정할 수 있습니다.</p>
                </div>
                <Link 
                  href={`/studio/desk/news;${newsItem._id}`} 
                  className="btn btn-light"
                >
                  CMS에서 편집 <i className="bi bi-pencil ms-1"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .bg-gradient-primary {
          background: linear-gradient(90deg, #FF0000 0%, #FFFF00 50%, #00FF00 100%);
        }
      `}</style>
    </div>
  );
} 