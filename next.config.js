/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  distDir: 'out',
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
};

module.exports = nextConfig;