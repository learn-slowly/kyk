// 서버 컴포넌트 (기본값)
import { client, previewClient, urlFor } from '../lib/sanity';
import PostsClient from './PostsClient';

// 메타데이터 추가
export const metadata = {
  title: '권영국 후보 뉴스 | 민주노동당',
  description: '권영국 후보의 성명서, 일상 및 언론 보도를 확인하세요.',
};

// 원본 데이터 타입
type SanityPost = {
  _id: string;
  title: string;
  slug?: { current: string };
  category: 'statement' | 'today' | 'media';
  publishedAt: string;
  body: string;
  summary?: string;
  source?: string;
  thumbnail?: { 
    asset?: { 
      _ref: string;
    } 
  };
  author?: string;
};

// 클라이언트에 전달할 타입
export type ClientPost = {
  _id: string;
  title: string;
  slug?: { current: string };
  category: 'statement' | 'today' | 'media';
  publishedAt: string;
  body: string;
  summary?: string;
  source?: string;
  thumbnail?: { 
    asset?: { 
      _ref: string;
    } 
  };
  author?: string;
  imageUrl?: string; // 프론트엔드에서 사용할 URL
};

export default async function PostsPage() {
  // 서버에서 데이터 가져오기 - client를 사용해 발행된 데이터만 가져오기
  const posts = await client.fetch<SanityPost[]>(
    `*[_type == "post" || _type == "statement"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      category,
      publishedAt,
      body,
      summary,
      source,
      thumbnail,
      author
    }`,
    {}, // params (빈 객체)
    { cache: 'no-store' } // 캐시 비활성화로 항상 최신 데이터를 가져옴
  );

  console.log('Fetched posts:', posts.length, 'items');

  // 이미지 URL 추가 및 author 필드 포함
  const postsWithImageUrls: ClientPost[] = posts.map(post => {
    const clientPostData: SanityPost & { imageUrl?: string } = { ...post };
    if (post.thumbnail?.asset?._ref) {
      clientPostData.imageUrl = urlFor(post.thumbnail).url();
    }
    // SanityPost는 이미 author를 포함할 수 있으므로, ClientPost 타입 단언만으로 충분
    return clientPostData as ClientPost; 
  });

  console.log('Posts with image URLs:', postsWithImageUrls.length, 'items');

  return <PostsClient posts={postsWithImageUrls} />;
}