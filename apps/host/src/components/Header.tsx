import Link from "next/link";
import React from "react";
import { useCurrentUser, useGlobalStore } from "@mfa/shared-store";

export default function Header() {
  const user = useCurrentUser();
  const logout = useGlobalStore((state) => state.logout);
  const theme = useGlobalStore((state) => state.theme);
  const setTheme = useGlobalStore((state) => state.setTheme);

  return (
    <header className="flex items-center justify-between border-b border-border bg-surface px-6 py-3">
      <strong className="text-lg">MFA Store</strong>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="rounded-md border border-border px-3 py-1.5 hover:bg-surface-hover"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
        {user ? (
          <>
            <span>{user.name}</span>
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
