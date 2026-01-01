/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  // Optimize development performance
  swcMinify: true,
  // Reduce Fast Refresh overhead
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
  },
  // Skip static generation for pages that require database
  // This allows builds to succeed in CI without a database connection
  output: 'standalone',
}

module.exports = nextConfig

