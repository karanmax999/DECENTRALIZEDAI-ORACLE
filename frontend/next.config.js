/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Output as static site
  output: 'export',
  // Optional: Configure image domains if using Next.js Image
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
