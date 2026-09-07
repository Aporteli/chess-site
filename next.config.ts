import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "*.googleusercontent.com" },
    ],
  },
  headers: async () => [
    {
      source: "/:file*.wasm",
      headers: [{ key: "Content-Type", value: "application/wasm" }],
    },
  ],
};

export default nextConfig;
