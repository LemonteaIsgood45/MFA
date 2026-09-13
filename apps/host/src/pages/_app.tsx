import type { AppProps } from "next/app";
import React, { useEffect } from "react";
import { useTheme } from "@mfa/shared-store";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  const theme = useTheme();

  // Toggling the class on <html> (not a wrapper div inside <body>) means
  // <body> itself — an ancestor of any wrapper we could render — is a
  // DESCENDANT of html.dark, so its own `@apply bg-bg text-text-primary`
  // rule in globals.css correctly resolves the .dark variable overrides.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return <Component {...pageProps} />;
}
