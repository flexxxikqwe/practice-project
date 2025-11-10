/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: '/ecosystem-alpha-practice',
  assetPrefix: '/ecosystem-alpha-practice/',
  typescript: {
    ignoreBuildErrors: true,
  }
}

module.exports = nextConfig