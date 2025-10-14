// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { domains: ["images.unsplash.com"], unoptimized: true },
  // Abilita l'export statico SOLO quando vuoi buildare statico
  ...(process.env.NEXT_OUTPUT === "export" ? { output: "export" } : {})
};
module.exports = nextConfig;



