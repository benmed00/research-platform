/** @type {import('next').NextConfig} */
const { withSentryConfig } = require("@sentry/nextjs");

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Reduce Fast Refresh overhead
  // Note: swcMinify is deprecated in Next.js 13+, SWC is always enabled
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
  },
  // Skip static generation for pages that require database
  // This allows builds to succeed in CI without a database connection
  // Standalone output is required for Docker deployments (see Dockerfile)
  // Windows build warnings about file copying are harmless and don't affect Docker builds (Linux-based)
  output: process.env.SKIP_STANDALONE === 'true' ? undefined : 'standalone',
}

// Only wrap with Sentry if DSN is configured
const sentryOptions = {
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
};

module.exports = process.env.SENTRY_DSN
  ? withSentryConfig(nextConfig, sentryOptions)
  : nextConfig;

