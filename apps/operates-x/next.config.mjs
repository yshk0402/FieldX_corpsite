import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: __dirname,
  async redirects() {
    return [
      {
        source: "/blog",
        destination: "/article",
        permanent: true
      },
      {
        source: "/blog/:slug",
        destination: "/article/:slug",
        permanent: true
      }
    ];
  }
};

export default nextConfig;
