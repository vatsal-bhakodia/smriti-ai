import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["img.youtube.com"],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Handle pdf-parse webpack issues
      config.externals = config.externals || [];
      config.externals.push({
        canvas: 'canvas',
      });
      
      // Ignore test files that pdf-parse tries to access
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },
};

export default nextConfig;
