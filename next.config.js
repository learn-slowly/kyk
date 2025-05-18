/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '**',
      },
    ],
    // 이미지 크기 최적화 설정
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // 이미지 로딩 품질 설정
    formats: ['image/webp'],
  },
  reactStrictMode: true,
  webpack: (config) => {
    config.ignoreWarnings = [
      { message: /.*export .* was not found in.*/ }
    ];
    
    // Exclude the backup directory from the build process
    config.watchOptions = config.watchOptions || {};
    config.watchOptions.ignored = config.watchOptions.ignored || [];
    if (Array.isArray(config.watchOptions.ignored)) {
      config.watchOptions.ignored.push('**/backup/**');
    } else {
      config.watchOptions.ignored = ['**/backup/**'];
    }
    
    return config;
  }
}

module.exports = nextConfig 