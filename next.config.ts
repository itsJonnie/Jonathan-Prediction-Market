import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Do not block builds on ESLint or type errors in this repo
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "placehold.co" },
    ],
  },
  // Alias optional CLIs that are not needed in the browser bundle
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve?.alias || {}),
      // Some third-party libs (via WalletConnect) attempt to require this.
      // It is a dev-time pretty-printer and not needed in the browser.
      "pino-pretty": false as unknown as string,
    };
    return config;
  },
};

export default nextConfig;
