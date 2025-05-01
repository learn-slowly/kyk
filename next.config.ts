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
};

export default nextConfig;
