/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Temporary workaround for API routes
  skipMiddlewareUrlNormalize: true,
  skipTrailingSlashRedirect: true,
  // Ensure we're not using static export
  output: 'standalone',
};

module.exports = nextConfig;