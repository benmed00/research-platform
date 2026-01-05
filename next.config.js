/** @type {import('next').NextConfig} */
const { withSentryConfig } = require("@sentry/nextjs");

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

