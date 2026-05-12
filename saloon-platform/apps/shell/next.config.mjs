/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        // Keep the /api prefix when proxying to the backend
        destination: 'http://localhost:8080/api/:path*', 
      },
    ];
  },
};

export default nextConfig;