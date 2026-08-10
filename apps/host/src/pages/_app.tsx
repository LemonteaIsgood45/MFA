import type { AppProps } from "next/app";
import React from "react";
import { useTheme } from "@mfa/shared-store";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  const theme = useTheme();

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <Component {...pageProps} />
    </div>
  );
}
