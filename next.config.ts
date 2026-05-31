import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  api: {
    // For pages router API routes – safe to add even if you mainly use app router
    bodyParser: {
      sizeLimit: "50mb",
    },
  },
};

export default nextConfig;
