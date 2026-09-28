import type { Product } from "@/types/product";

interface PlanCardProps {
  plan: Product;
  onSelect: (productId: string) => void;
}

export default function PlanCard({ plan, onSelect }: PlanCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(plan.id)}
      className="w-64 flex-shrink-0 rounded-lg border border-gray-200 bg-white text-left shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
    >
      <div className="relative">
        <img
          src={plan.images[0]?.url}
          alt={plan.images[0]?.alt ?? plan.name}
          className="h-40 w-full rounded-t-lg bg-gray-100 object-cover dark:bg-slate-700"
        />
        {plan.badge && (
          <span className="absolute right-3 top-3 rounded bg-white px-2 py-0.5 text-[11px] font-semibold text-red-600 shadow dark:bg-slate-900">
            {plan.badge}
          </span>
        )}
      </div>

      <div className="space-y-2 p-4">
        <div className="text-sm font-semibold">{plan.name}</div>
        <ul className="space-y-1 text-xs text-gray-600 dark:text-slate-300">
          {(plan.highlights ?? []).map((highlight) => (
            <li key={highlight}>✓ {highlight}</li>
          ))}
        </ul>
        <p className="pt-1 text-sm">
          Giá từ:{" "}
          <span className="text-base font-bold text-red-600">
            {plan.basePrice.toLocaleString("vi-VN")}đ
          </span>
        </p>
      </div>
    </button>
  );
}
