/** @type {import("next").NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  transpilePackages: ["@fitness-app/ui"],
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig; 