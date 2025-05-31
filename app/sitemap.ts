import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  // 여기에 웹사이트의 모든 페이지 경로를 추가합니다.
  // 예시: 정적 페이지
  const staticRoutes = [
    '/',
    // '/about',
    // '/policy',
    // ... 다른 정적 페이지들
  ];

  // 예시: 동적 페이지 (데이터베이스나 API에서 가져오는 경우)
  // const dynamicPosts = await fetch('https://.../posts').then((res) => res.json())
  // const postRoutes = dynamicPosts.map((post) => ({
  //   url: `https://www.xn--3e0b8b410h.com/posts/${post.slug}`,
  //   lastModified: new Date(post.updatedAt),
  //   changeFrequency: 'weekly',
  //   priority: 0.8,
  // }))

  return [
    ...staticRoutes.map((route) => ({
      url: `https://www.xn--3e0b8b410h.com${route}`,
      lastModified: new Date(),
      changeFrequency: 'yearly', // 또는 'monthly', 'weekly' 등 적절하게 설정
      priority: route === '/' ? 1 : 0.8, // 홈페이지 우선순위 높게
    })),
    // ...postRoutes, // 동적 페이지가 있다면 주석 해제
  ]
} 