import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { fetchCart, removeCartItem, updateCartItemQuantity } from "@/lib/cart";
import { useAuthToken, useCart, useGlobalStore } from "@mfa/shared-store";

export default function CartPage() {
  const router = useRouter();
  const token = useAuthToken();
  const cart = useCart();
  const setCart = useGlobalStore((s) => s.setCart);
  const upsertCartItem = useGlobalStore((s) => s.upsertCartItem);
  const removeCartItemLocal = useGlobalStore((s) => s.removeCartItemLocal);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    fetchCart(token)
      .then(setCart)
      .catch((e) => setError(e.message));
  }, [token]);

  async function handleQuantityChange(id: string, quantity: number) {
    if (quantity < 1) return;
    try {
      const updated = await updateCartItemQuantity(id, quantity, token);
      upsertCartItem(updated);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lỗi cập nhật số lượng.");
    }
  }

  async function handleRemove(id: string) {
    try {
      await removeCartItem(id, token);
      removeCartItemLocal(id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lỗi xoá sản phẩm.");
    }
  }

  const total = cart.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );

  if (!token) {
    return (
      <Layout>
        <p>Vui lòng đăng nhập để xem giỏ hàng.</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-2xl font-semibold">Giỏ hàng</h1>
      {error && <p className="mt-2 text-danger">{error}</p>}

      {cart.length === 0 ? (
        <p className="mt-4 text-text-secondary">Giỏ hàng đang trống.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-md border border-border bg-surface p-4"
            >
              <div>
                <p className="font-medium">
                  {item.productName ?? item.productId}
                </p>
                {Object.keys(item.variantSelections).length > 0 && (
                  <p className="text-xs text-text-muted">
                    {Object.entries(item.variantSelections)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(", ")}
                  </p>
                )}
                <p className="text-sm text-text-secondary">
                  {item.unitPrice.toLocaleString("vi-VN")}đ × {item.quantity}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-md border border-border">
                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity - 1)
                    }
                    className="px-2.5 py-1 hover:bg-surface-hover"
                  >
                    −
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity + 1)
                    }
                    className="px-2.5 py-1 hover:bg-surface-hover"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="rounded-md border border-border px-3 py-1.5 text-sm text-danger hover:bg-danger-bg"
                >
                  Xoá
                </button>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between border-t border-border pt-4">
            <span className="text-lg font-semibold">
              Tổng cộng: {total.toLocaleString("vi-VN")}đ
            </span>
            <button
              onClick={() => router.push("/checkout")}
              className="rounded-md bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-hover"
            >
              Tiến hành thanh toán
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}
