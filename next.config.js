/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove static export since we're using server-side rendering
  images: { 
    domains: ['images.unsplash.com']
  },
  eslint: {
    ignoreDuringBuilds: true
  }
}

module.exports = nextConfig