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
      {
        name: "serviceApp",
        entry: `${SERVICE_APP_URL.replace(/\/$/, "")}/assets/remoteEntry.js`,
        type: "module",
      },
      {
        name: "analyticsApp",
        entry: `${ANALYTICS_APP_URL.replace(/\/$/, "")}/remoteEntry.js`,
      },
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
