// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      root: __dirname, // set Turbopack root to this project
    },
  },
};

module.exports = nextConfig;
