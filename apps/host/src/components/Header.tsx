import React from "react";
import { useCurrentUser, useGlobalStore } from "@mfa/shared-store";

export default function Header() {
  const user = useCurrentUser();
  const logout = useGlobalStore((s) => s.logout);
  const theme = useGlobalStore((s) => s.theme);
  const setTheme = useGlobalStore((s) => s.setTheme);

  return (
    <header className="flex items-center justify-between border-b border-gray-200 px-6 py-3 dark:border-slate-700">
      <strong className="text-lg">MFA Console</strong>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="rounded-md border border-gray-300 px-3 py-1.5 hover:bg-gray-100 dark:border-slate-600 dark:hover:bg-slate-800"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
        {user ? (
          <>
            <span>{user.name}</span>
            <button
              onClick={logout}
              className="rounded-md border border-gray-300 px-3 py-1.5 hover:bg-gray-100 dark:border-slate-600 dark:hover:bg-slate-800"
            >
              Đăng xuất
            </button>
          </>
        ) : (
          <span className="text-gray-400">Chưa đăng nhập</span>
        )}
      </div>
    </header>
  );
}
