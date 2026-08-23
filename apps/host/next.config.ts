import type { NextConfig } from "next";

// No webpack customization needed here. Remotes are loaded at runtime by
// @module-federation/runtime (see src/lib/remotes.ts), which works as a
// plain client-side script loader and doesn't hook into Next's bundler
// internals at all — sidestepping the webpack-version coupling that
// @module-federation/nextjs-mf required (and which broke on this Next
// version — see README for details).
const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@mfa/shared-store", "@mfa/shared-types"],
  allowedDevOrigins: ["192.168.32.22"],
};

export default nextConfig;
