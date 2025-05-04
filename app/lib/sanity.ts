import { createClient } from 'next-sanity';

// Sanity 프로젝트 정보 
// 실제 프로젝트 정보는 환경변수에서 가져오되, 개발 중에는 기본값을 사용
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'h3f5tvcj'; // 예시 ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production',
  // 개발 모드에서는 캐시를 비활성화하여 실시간 변경 사항 확인
  perspective: 'published',
});

// 안전한 데이터 페칭 함수
export async function fetchSanityData<T>(query: string, params = {}): Promise<T | null> {
  try {
    const data = await client.fetch<T>(query, params);
    return data;
  } catch (error) {
    console.error('Sanity 데이터 페칭 오류:', error);
    return null;
  }
}

// 이미지 URL 생성 헬퍼 함수
export function urlFor(source: any) {
  if (!source) return '';
  
  try {
    return `https://cdn.sanity.io/images/${projectId}/${dataset}/${source.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png').replace('-webp', '.webp')}`;
  } catch (error) {
    console.error('이미지 URL 생성 오류:', error);
    return '';
  }
} 