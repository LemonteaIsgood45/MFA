import path from "path";
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
        react: "react",
        "react-dom": "react-dom",
        zustand: "zustand",
        "@mfa/shared-store": "@mfa/shared-store",
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
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
