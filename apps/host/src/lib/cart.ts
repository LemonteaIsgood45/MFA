import type { CartItem } from "@mfa/shared-types";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

async function request<T>(path: string, token: string | null | undefined, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed: ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const fetchCart = (token: string | null | undefined) => request<CartItem[]>("/api/cart", token);

export const updateCartItemQuantity = (id: string, quantity: number, token: string | null | undefined) =>
  request<CartItem>(`/api/cart/${id}`, token, { method: "PATCH", body: JSON.stringify({ quantity }) });

export const removeCartItem = (id: string, token: string | null | undefined) =>
  request<void>(`/api/cart/${id}`, token, { method: "DELETE" });

export const checkoutCart = (token: string | null | undefined) =>
  request<{ orderId: string; createdAt: string; total: number }>("/api/cart/checkout", token, {
    method: "POST",
  });