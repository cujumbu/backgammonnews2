/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.redd.it',
      },
      {
        protocol: 'https',
        hostname: 'i.redd.it',
      },
      {
        protocol: 'https',
        hostname: 'preview.redd.it',
      }
    ],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    formats: ['image/webp']
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    
    // Optimize build performance
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all',
          },
        },
      },
    };
    
    return config;
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  eslint: {
    dirs: ['app', 'components', 'lib', 'scripts']
  },
  typescript: {
    ignoreBuildErrors: false
  }
}
