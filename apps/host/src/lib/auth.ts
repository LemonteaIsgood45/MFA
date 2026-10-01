import type { User } from "@mfa/shared-types";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

interface AuthResponse {
  token: string;
  expiresAt: number;
  user: User;
}

const AUTH_SESSION_KEY = "mfa-auth-session";

function persistAuthSession(session: AuthResponse): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({
      user: session.user,
      auth: { token: session.token, expiresAt: session.expiresAt },
    }));
  }
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

  const session: AuthResponse = await res.json();
  persistAuthSession(session);
  return session;
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

  const session: AuthResponse = await res.json();
  persistAuthSession(session);
  return session;
}
