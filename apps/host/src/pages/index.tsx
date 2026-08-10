import React, { useState } from "react";
import Layout from "@/components/Layout";
import { login } from "@/lib/auth";
import { useCurrentUser, useGlobalStore } from "@mfa/shared-store";

export default function HomePage() {
  const user = useCurrentUser();
  const setUser = useGlobalStore((s) => s.setUser);
  const setAuth = useGlobalStore((s) => s.setAuth);

  const [email, setEmail] = useState("admin@mfa.dev");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await login(email, password);
      setUser(res.user);
      setAuth({ token: res.token, expiresAt: res.expiresAt });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra");
    }
  }

  if (!user) {
    return (
      <div className="grid min-h-screen place-items-center">
        <form onSubmit={handleSubmit} className="flex w-80 flex-col gap-3">
          <h2 className="text-xl font-semibold">Đăng nhập MFA Console</h2>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="rounded-md border border-gray-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-800"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu"
            type="password"
            className="rounded-md border border-gray-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-800"
          />
          {error && <span className="text-red-600">{error}</span>}
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-white hover:bg-indigo-700"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    );
  }

  return (
    <Layout>
      <h1 className="text-2xl font-semibold">Xin chào, {user.name} 👋</h1>
      <p className="mt-2 text-gray-600 dark:text-slate-400">
        Chọn <strong>Quản lý dịch vụ</strong> hoặc <strong>Thống kê</strong> ở thanh bên để tải
        module tương ứng qua Module Federation.
      </p>
    </Layout>
  );
}
