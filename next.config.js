/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove static export since we're using server-side rendering
  images: { 
    domains: ['images.unsplash.com']
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    // Set this to false if you want production builds to abort if there's type errors
    ignoreBuildErrors: true,
  }
}

module.exports = nextConfig
