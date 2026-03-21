import type { NextConfig } from "next";
import { fileURLToPath } from "url";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  turbopack: {
    root: fileURLToPath(new URL("..", import.meta.url)),
  },
};

export default nextConfig;
