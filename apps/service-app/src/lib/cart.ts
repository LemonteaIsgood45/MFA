import { useGlobalStore } from "@mfa/shared-store";
import type { CartItem } from "@mfa/shared-types";

const API_BASE = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:4000";

export async function addToCart(
  productId: string,
  variantSelections: Record<string, string>,
  quantity: number,
  unitPrice: number,
  token: string | null | undefined
): Promise<void> {
  if (!token) throw new Error("Vui lòng đăng nhập để thêm vào giỏ hàng");

  const res = await fetch(`${API_BASE}/api/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ productId, variantSelections, quantity, unitPrice }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "Không thể thêm vào giỏ hàng");
  }

  const item: CartItem = await res.json();
  useGlobalStore.getState().upsertCartItem(item);
}