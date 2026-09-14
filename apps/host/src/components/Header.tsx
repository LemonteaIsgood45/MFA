import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  useCartCount,
  useCurrentUser,
  useGlobalStore,
} from "@mfa/shared-store";

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const user = useCurrentUser();
  const logout = useGlobalStore((state) => state.logout);
  const theme = useGlobalStore((state) => state.theme);
  const setTheme = useGlobalStore((state) => state.setTheme);
  const cartCount = useCartCount();

  // Wait until hydration completes on the client before reading session state
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="flex items-center justify-between border-b border-border bg-surface px-6 py-3 text-text-primary">
      <strong className="text-lg">MFA Store</strong>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="rounded-md border border-border px-3 py-1.5 hover:bg-surface-hover"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        {mounted && user && (
          <Link
            href="/cart"
            className="relative rounded-md border border-border px-3 py-1.5 hover:bg-surface-hover"
          >
            🛒
            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link>
        )}

        {mounted && user ? (
          <>
            <span className="text-text-secondary">{user.name}</span>
            <button
              onClick={logout}
              className="rounded-md border border-border px-3 py-1.5 hover:bg-surface-hover"
            >
              Đăng xuất
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="rounded-md bg-primary px-3 py-1.5 text-white no-underline hover:bg-primary-hover"
          >
            Đăng nhập
          </Link>
        )}
      </div>
    </header>
  );
}
