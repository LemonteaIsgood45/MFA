import Link from "next/link";
import React from "react";
import { useCurrentUser, useGlobalStore } from "@mfa/shared-store";

export default function Header() {
  const user = useCurrentUser();
  const logout = useGlobalStore((state) => state.logout);
  const theme = useGlobalStore((state) => state.theme);
  const setTheme = useGlobalStore((state) => state.setTheme);
  return <header className="flex items-center justify-between border-b border-gray-200 px-6 py-3 dark:border-slate-700"><strong className="text-lg">MFA Store</strong><div className="flex items-center gap-3"><button onClick={() => setTheme(theme === "light" ? "dark" : "light")} className="rounded-md border border-gray-300 px-3 py-1.5 hover:bg-gray-100 dark:border-slate-600 dark:hover:bg-slate-800">{theme === "light" ? "🌙" : "☀️"}</button>{user ? <><span>{user.name}</span><button onClick={logout} className="rounded-md border border-gray-300 px-3 py-1.5 hover:bg-gray-100 dark:border-slate-600 dark:hover:bg-slate-800">Đăng xuất</button></> : <Link href="/login" className="rounded-md bg-indigo-600 px-3 py-1.5 text-white no-underline hover:bg-indigo-700">Đăng nhập</Link>}</div></header>;
}
