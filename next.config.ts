import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { hostname: "t3.ftcdn.net" },
      { hostname: "static.vecteezy.com" },
      { hostname: "picsum.photos" },
    ],
  },
};

export default nextConfig;
