import { useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { checkoutCart } from "@/lib/cart";
import { useAuthToken, useCart, useGlobalStore } from "@mfa/shared-store";

// Mock checkout: the "payment method" below is cosmetic only, there's no
// payment gateway involved. Confirming the order does write a real
// order + order_items row via /api/cart/checkout (see backend), so it
// shows up in the analytics Sales tab like any other order.
export default function CheckoutPage() {
  const router = useRouter();
  const token = useAuthToken();
  const cart = useCart();
  const clearCart = useGlobalStore((s) => s.clearCart);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    orderId: string;
    total: number;
  } | null>(null);

  const total = cart.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );

  async function handlePlaceOrder() {
    setPlacing(true);
    setError(null);
    try {
      const res = await checkoutCart(token);
      clearCart();
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Đặt hàng thất bại.");
    } finally {
      setPlacing(false);
    }
  }

  if (result) {
    return (
      <Layout>
        <div className="mx-auto max-w-md text-center">
          <h1 className="text-2xl font-semibold">Đặt hàng thành công 🎉</h1>
          <p className="mt-2 text-text-secondary">
            Mã đơn hàng: {result.orderId}
          </p>
          <p className="mt-1 text-text-secondary">
            Tổng thanh toán: {result.total.toLocaleString("vi-VN")}đ
          </p>
          <p className="mt-4 text-xs text-text-muted">
            Đây là luồng thanh toán giả lập — không có cổng thanh toán thực tế
            nào được gọi.
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-6 rounded-md bg-primary px-4 py-2 text-white hover:bg-primary-hover"
          >
            Về trang chủ
          </button>
        </div>
      </Layout>
    );
  }

  if (cart.length === 0) {
    return (
      <Layout>
        <p>Giỏ hàng đang trống, không có gì để thanh toán.</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-2xl font-semibold">Thanh toán</h1>
      <p className="mt-1 text-xs text-text-muted">
        Trang thanh toán giả lập cho mục đích demo — không xử lý thanh toán
        thật.
      </p>

      <div className="mt-4 space-y-2 rounded-md border border-border bg-surface p-4">
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>
              {item.productName ?? item.productId} × {item.quantity}
            </span>
            <span>
              {(item.unitPrice * item.quantity).toLocaleString("vi-VN")}đ
            </span>
          </div>
        ))}
        <div className="flex justify-between border-t border-border pt-2 font-semibold">
          <span>Tổng cộng</span>
          <span>{total.toLocaleString("vi-VN")}đ</span>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium">Phương thức thanh toán</p>
        <label className="mt-2 flex items-center gap-2 text-sm">
          <input type="radio" name="payment" defaultChecked /> Thanh toán khi
          nhận hàng (COD)
        </label>
      </div>

      {error && <p className="mt-3 text-danger">{error}</p>}

      <button
        onClick={handlePlaceOrder}
        disabled={placing}
        className="mt-6 w-full rounded-md bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-hover disabled:opacity-50"
      >
        {placing ? "Đang xử lý..." : "Đặt hàng"}
      </button>
    </Layout>
  );
}
