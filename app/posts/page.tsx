// 서버 컴포넌트 (기본값)
import { client } from '../lib/sanity';
import PostsClient from './PostsClient';

// 타입 정의
type Post = {
  _id: string;
  title: string;
  category: string;
  publishedAt: string;
  body: string;
};

export default async function PostsPage() {
  // 서버에서 데이터 가져오기
  const posts = await client.fetch<Post[]>(
    `*[_type == "post"] | order(publishedAt desc)`
  );

  return <PostsClient posts={posts} />;
}