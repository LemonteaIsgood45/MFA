"use client";

import { init, loadRemote } from "@module-federation/runtime";
import type { ComponentType } from "react";
import type { RemoteModuleProps } from "@mfa/shared-types";

const SERVICE_APP_URL = process.env.NEXT_PUBLIC_SERVICE_APP_URL ?? "http://localhost:5001";
const ANALYTICS_APP_URL = process.env.NEXT_PUBLIC_ANALYTICS_APP_URL ?? "http://localhost:5002";

let initialized = false;

function ensureInit() {
  if (initialized) return;
  initialized = true;

  init({
    name: "host",
    remotes: [
      // Vite-built remote (service-app) — exposes /assets/remoteEntry.js
      { name: "serviceApp", entry: `${SERVICE_APP_URL}/assets/remoteEntry.js` },
      // Webpack-built remote (analytics-app) — exposes /remoteEntry.js
      { name: "analyticsApp", entry: `${ANALYTICS_APP_URL}/remoteEntry.js` },
    ],
    shared: {
      react: {
        version: "18.3.1",
        scope: "default",
        lib: () => require("react"),
        shareConfig: { singleton: true, requiredVersion: "^18.3.1" },
      },
      "react-dom": {
        version: "18.3.1",
        scope: "default",
        lib: () => require("react-dom"),
        shareConfig: { singleton: true, requiredVersion: "^18.3.1" },
      },
    },
  });
}

/**
 * Loads a single exposed component from a remote, e.g.
 * loadRemoteComponent("serviceApp/ServiceList"). Shaped to match what
 * next/dynamic expects ({ default: Component }), so it can be passed
 * directly as the loader function to dynamic(..., { ssr: false }).
 */
export async function loadRemoteComponent<P = RemoteModuleProps>(
  remoteAndModule: string
): Promise<{ default: ComponentType<P> }> {
  ensureInit();
  const mod = await loadRemote<{ default: ComponentType<P> }>(remoteAndModule);
  if (!mod) {
    throw new Error(`Failed to load remote module: ${remoteAndModule}`);
  }
  return mod;
}
