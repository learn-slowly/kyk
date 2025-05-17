/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ['cdn.sanity.io'],
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