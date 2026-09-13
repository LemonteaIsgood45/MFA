import type { User } from "@mfa/shared-types";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

interface AuthResponse {
  token: string;
  expiresAt: number;
  user: User;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Đăng nhập thất bại");
  }

  return res.json();
}

export async function register(name: string, email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "Đăng ký thất bại");
  }

  return res.json();
}