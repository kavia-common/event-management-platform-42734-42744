import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Ensure SSR allowed; do not set output: "export"
};

export default nextConfig;
