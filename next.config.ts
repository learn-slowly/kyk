import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // 클라이언트 사이드 번들에서 서버 전용 패키지 제외
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        http2: false,
        os: false,
        path: false,
      };
    }
    return config;
  },
  
  // 이미지 호스트 설정 추가
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
