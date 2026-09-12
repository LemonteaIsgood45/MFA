import type { AppProps } from "next/app";
import React, { useEffect } from "react";
import { hydrateSession, useTheme } from "@mfa/shared-store";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  const theme = useTheme();
  useEffect(() => hydrateSession(), []);

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <Component {...pageProps} />
    </div>
  );
}
