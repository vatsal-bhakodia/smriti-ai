import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.ctfassets.net" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "via.placeholder.com" },
    ],
  },

  webpack: (config, { isServer }) => {
    if (isServer) {
      // Prevent canvas from being bundled
      config.resolve.alias = {
        ...config.resolve.alias,
        canvas: false,
        "@napi-rs/canvas": false,
      };
    }
    return config;
  },
};

export default nextConfig;
