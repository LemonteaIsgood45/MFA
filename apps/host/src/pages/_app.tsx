import type { AppProps } from "next/app";
import React, { useEffect, startTransition, useState } from "react";
import { useRouter } from "next/router";
import { fetchCart } from "@/lib/cart";
import {
  hydrateSession,
  useAuthToken,
  useCurrentUser,
  useGlobalStore,
  useTheme,
} from "@mfa/shared-store";
import { canViewAnalytics } from "@mfa/shared-types";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  const theme = useTheme();
  const token = useAuthToken();
  const user = useCurrentUser();
  const setCart = useGlobalStore((s) => s.setCart);
  const router = useRouter();
  const [sessionReady, setSessionReady] = useState(false);

  // Wrap hydration in startTransition to prevent breaking active Suspense hydration
  useEffect(() => {
    startTransition(() => {
      hydrateSession();
      setSessionReady(true);
    });
  }, []);

  useEffect(() => {
    if (!sessionReady || router.pathname === "/login" || router.pathname === "/register") return;
    if (!token) void router.replace(`/login?next=${encodeURIComponent(router.asPath)}`);
    else if (router.pathname === "/analytics" && !canViewAnalytics(user)) void router.replace("/");
  }, [sessionReady, token, user, router]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    if (!token) return;
    fetchCart(token)
      .then(setCart)
      .catch(() => {});
  }, [token, setCart]);

  if (!sessionReady && router.pathname !== "/login" && router.pathname !== "/register") return null;
  if (sessionReady && !token && router.pathname !== "/login" && router.pathname !== "/register") return null;
  return <Component {...pageProps} />;
}
