import type { AppProps } from "next/app";
import React, { useEffect, startTransition } from "react";
import { fetchCart } from "@/lib/cart";
import {
  hydrateSession,
  useAuthToken,
  useGlobalStore,
  useTheme,
} from "@mfa/shared-store";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  const theme = useTheme();
  const token = useAuthToken();
  const setCart = useGlobalStore((s) => s.setCart);

  // Wrap hydration in startTransition to prevent breaking active Suspense hydration
  useEffect(() => {
    startTransition(() => {
      hydrateSession();
    });
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    if (!token) return;
    fetchCart(token)
      .then(setCart)
      .catch(() => {});
  }, [token, setCart]);

  return <Component {...pageProps} />;
}
