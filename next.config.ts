import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.ctfassets.net" }, // Contentful
      { protocol: "https", hostname: "img.youtube.com" },      // used elsewhere
      { protocol: "https", hostname: "via.placeholder.com" },  // <-- add this for your dummy images
    ],
  },
};

export default nextConfig;

