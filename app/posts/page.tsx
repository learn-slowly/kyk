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
  // 서버에서 데이터 가져오기
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
    {},
    { cache: 'no-store' }
  );

  console.log('Fetched posts:', posts.length, 'items');

  const postsWithImageUrls: ClientPost[] = posts.map(post => {
    const clientPostData: SanityPost & { imageUrl?: string } = { ...post };
    if (post.thumbnail?.asset?._ref) {
      clientPostData.imageUrl = urlFor(post.thumbnail).url();
    }
    return clientPostData as ClientPost;
  });

  console.log('Posts with image URLs:', postsWithImageUrls.length, 'items');

  return <PostsClient posts={postsWithImageUrls} />;
}