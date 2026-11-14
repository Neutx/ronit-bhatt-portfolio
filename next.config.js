/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    // Static export has no optimisation server. Card thumbnails get a srcset
    // from pre-built variants via this loader; every other <Image> sets
    // `unoptimized` and is served as-is.
    loader: 'custom',
    loaderFile: './src/lib/imageLoader.ts',
    // 480 is the only pre-built thumbnail variant; larger widths map to the original.
    imageSizes: [480],
    // Only the card thumbnails use the loader; 720 is their original width.
    deviceSizes: [720],
  },
  // Compression (gzip/brotli) is handled by Vercel's edge for the static export.
  compress: true,
  // Cache headers are configured in vercel.json.
}

module.exports = nextConfig
