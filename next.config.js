// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',   // <-- nuova sintassi per static export
  images: {
    unoptimized: true, // utile se usi <Image> di Next
  },
};

module.exports = nextConfig;

