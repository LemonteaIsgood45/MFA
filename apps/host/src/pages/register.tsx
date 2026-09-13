import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { register } from "@/lib/auth";
import { useGlobalStore } from "@mfa/shared-store";

// Same shape/styling as pages/index.tsx's login form on purpose — this is
// the same auth surface with one more field, not a different design.
export default function RegisterPage() {
  const router = useRouter();
  const setUser = useGlobalStore((s) => s.setUser);
  const setAuth = useGlobalStore((s) => s.setAuth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await register(name, email, password);
      setUser(res.user);
      setAuth({ token: res.token, expiresAt: res.expiresAt });
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra");
    }
  }

  return (
    <div className="grid min-h-screen place-items-center">
      <form onSubmit={handleSubmit} className="flex w-80 flex-col gap-3">
        <h2 className="text-xl font-semibold">Đăng ký tài khoản</h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Họ và tên"
          className="rounded-md border border-gray-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-800"
        />
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
          Đăng ký
        </button>
        <p className="text-sm text-gray-500 dark:text-slate-400">
          Đã có tài khoản?{" "}
          <Link href="/" className="text-indigo-600 hover:underline">
            Đăng nhập
          </Link>
        </p>
      </form>
    </div>
  );
}
