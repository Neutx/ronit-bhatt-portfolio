/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Enable compression (handled by Firebase Hosting)
  compress: true,
  // Note: Cache headers are configured in firebase.json for static export
}

module.exports = nextConfig

