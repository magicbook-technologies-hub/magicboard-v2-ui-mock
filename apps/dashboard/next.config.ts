import type { NextConfig } from 'next';
import path from 'path';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4100';

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, '../..'),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  transpilePackages: ['@magicboard/schema'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${API}/:path*`,
      },
    ];
  },
};

export default nextConfig;
