import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Meta calls the webhook as /wp/callback/ (trailing slash) and does not follow redirects.
  skipTrailingSlashRedirect: true,
  images: {
    loader: "custom",
    loaderFile: "./lib/imageLoader.ts",
    remotePatterns: [{ protocol: "https", hostname: "m.media-amazon.com" }],
  },
  experimental: {
    // Keep visited pages in the browser's router cache so switching language / going back is instant.
    staleTimes: { dynamic: 60, static: 300 },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
