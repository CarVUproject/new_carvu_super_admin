import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */

  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true,
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8020',
        pathname: '/**',
      },
    ],
  },
  output: 'standalone',
};

export default nextConfig;
