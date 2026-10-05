import { useState } from "react";
import { addToCart } from "@/lib/cart";
import type { Product } from "@/types/product";

interface PlanCardProps {
  plan: Product;
  onSelect: (productId: string) => void;
  token?: string | null;
}

export default function PlanCard({ plan, onSelect, token }: PlanCardProps) {
  const [feedback, setFeedback] = useState<string | null>(null);

  async function handleAddToCart() {
    const selections = Object.fromEntries(
      plan.variantGroups.flatMap((group) =>
        group.options[0] ? [[group.id, group.options[0].id]] : [],
      ),
    );
    const unitPrice =
      plan.basePrice +
      plan.variantGroups.reduce(
        (sum, group) => sum + (group.options[0]?.priceDelta ?? 0),
        0,
      );

    try {
      await addToCart(plan.id, selections, 1, unitPrice, token);
      setFeedback(`Đã thêm "${plan.name}" vào giỏ hàng.`);
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Có lỗi xảy ra.");
    }
  }

  return (
    <article className="w-64 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
      <div className="relative">
        <img
          src={plan.images[0]?.url}
          alt={plan.images[0]?.alt ?? plan.name}
          className="h-40 w-full bg-gray-100 object-cover dark:bg-slate-700"
        />
        {plan.badge && (
          <span className="absolute right-3 top-3 rounded bg-white px-2 py-0.5 text-[11px] font-semibold text-red-600 shadow dark:bg-slate-900">
            {plan.badge}
          </span>
        )}
      </div>

      <div className="space-y-2 p-4">
        <h3 className="text-sm font-semibold">{plan.name}</h3>
        <ul className="space-y-1 text-xs text-gray-600 dark:text-slate-300">
          {(plan.highlights ?? []).map((highlight) => (
            <li key={highlight}>✓ {highlight}</li>
          ))}
        </ul>
        <p className="pt-1 text-sm">
          Giá từ:{" "}
          <span className="text-base font-bold text-red-600">
            {plan.basePrice.toLocaleString("vi-VN")}₫
          </span>
        </p>
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={() => onSelect(plan.id)}
            className="flex-1 rounded-md border border-gray-300 px-2 py-2 text-xs font-semibold hover:bg-gray-50 dark:border-slate-600 dark:hover:bg-slate-700"
          >
            Xem chi tiết
          </button>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!token}
            className="flex-1 rounded-md bg-red-600 px-2 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Thêm vào giỏ
          </button>
        </div>
        {feedback && (
          <p aria-live="polite" className="text-xs text-gray-600 dark:text-slate-300">
            {feedback}
          </p>
        )}
      </div>
    </article>
  );
}
