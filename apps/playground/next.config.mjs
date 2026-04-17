/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@dp/ui', '@dp/tokens'],
  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;
