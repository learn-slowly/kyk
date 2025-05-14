// 서버 컴포넌트 (기본값)
import { client, urlFor } from '../lib/sanity';
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
  imageUrl?: string; // 프론트엔드에서 사용할 URL
};

export default async function PostsPage() {
  // 서버에서 데이터 가져오기
  // post 타입과 statement 타입 모두 가져오도록 수정
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
      thumbnail
    }`,
    {}, // params (현재는 빈 객체)
    { cache: 'no-store' } // next: { revalidate: 10 } 에서 변경
  );

  console.log('Fetched posts:', posts.length, 'items');

  // 이미지 URL 추가
  const postsWithImageUrls: ClientPost[] = posts.map(post => {
    if (post.thumbnail?.asset?._ref) {
      return {
        ...post,
        imageUrl: urlFor(post.thumbnail).url()
      };
    }
    return post;
  });

  console.log('Posts with image URLs:', postsWithImageUrls.length, 'items');

  return <PostsClient posts={postsWithImageUrls} />;
}