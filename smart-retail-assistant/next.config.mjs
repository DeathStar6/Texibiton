/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static exports for Vercel deployment
  output: 'standalone',
  
  // Optimize for production
  productionBrowserSourceMaps: false,
  
  // Ensure compatibility with Vercel
  reactStrictMode: true,
};

export default nextConfig;
