// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.unsplash.com"], // ✅ dominio corretto per le API di Unsplash
    unoptimized: true,                // ✅ utile per export statico
  },
  output: "export",                   // ✅ necessario per Cloudflare Pages
};

module.exports = nextConfig;



