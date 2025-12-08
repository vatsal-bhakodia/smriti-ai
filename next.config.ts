import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.ctfassets.net" }, // Contentful
      { protocol: "https", hostname: "img.youtube.com" }, // used elsewhere
      { protocol: "https", hostname: "via.placeholder.com" }, // <-- add this for your dummy images
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ["pdf-parse"],
  },
  webpack: (config) => {
    // Ignore 'canvas' which is an optional dependency of pdf-parse
    // that fails to build in Vercel serverless functions
    config.resolve.alias.canvas = false;

    // Sometimes needed to prevent encoding errors
    config.resolve.alias.encoding = false;

    return config;
  },
};

export default nextConfig;
