import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: ["@luxly/config", "@luxly/types", "@luxly/storage"],
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
        pathname: "/luxly-bucket/**",
      },
      {
        protocol: "https",
        hostname: "i.pinimg.com",
        pathname: "/**",
      },
    ],
  },
  reactStrictMode: false,
  /* turbopack: {
    resolveAlias: {
      yjs: path.resolve(__dirname, "../../node_modules/yjs"),
    },
  }, */
};

export default nextConfig;
