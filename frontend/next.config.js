/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Configure image domains if using Next.js Image
  images: {
    domains: ['*'],
  },
}

module.exports = nextConfig
