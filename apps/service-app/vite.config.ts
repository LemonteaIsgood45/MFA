import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "serviceApp",
      filename: "remoteEntry.js",
      exposes: {
        "./ServiceList": "./src/components/ServiceList.tsx",
      },
      shared: {
        react: { singleton: true, requiredVersion: "^18.3.1" },
        "react-dom": { singleton: true, requiredVersion: "^18.3.1" },
        zustand: { singleton: true, requiredVersion: "^4.5.4" },
        "@mfa/shared-store": { singleton: true },
      },
    }),
  ],
  server: {
    port: 5001,
    strictPort: true,
    cors: true,
  },
  preview: {
    port: 5001,
    strictPort: true,
    cors: true,
  },
  build: {
    target: "esnext", // required for Vite's federation build to emit ESM properly
    minify: false,
    cssCodeSplit: false,
  },
});
