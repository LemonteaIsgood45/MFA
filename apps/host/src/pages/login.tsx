import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { login } from "@/lib/auth";
import { useGlobalStore } from "@mfa/shared-store";
export default function LoginPage() {
  const router = useRouter();
  const setUser = useGlobalStore((s) => s.setUser);
  const setAuth = useGlobalStore((s) => s.setAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      const result = await login(email, password);
      setUser(result.user);
      setAuth({ token: result.token, expiresAt: result.expiresAt });
      const next = typeof router.query.next === "string" ? router.query.next : "/";
      await router.replace(next.startsWith("/") && !next.startsWith("//") ? next : "/");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Đã có lỗi xảy ra");
    }
  }
  return (
    <div className="grid min-h-screen place-items-center">
      <form onSubmit={submit} className="flex w-80 flex-col gap-3">
        <h1 className="text-xl font-semibold">Đăng nhập MFA Store</h1>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          required
          className="rounded-md border border-gray-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-800"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mật khẩu"
          type="password"
          required
          className="rounded-md border border-gray-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-800"
        />
        {error && <span className="text-red-600">{error}</span>}
        <button className="rounded-md bg-indigo-600 px-3 py-2 text-white">
          Đăng nhập
        </button>
        <p className="text-sm text-gray-500 dark:text-slate-400">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="text-indigo-600 hover:underline">
            Đăng ký
          </Link>
        </p>
      </form>
    </div>
  );
}
