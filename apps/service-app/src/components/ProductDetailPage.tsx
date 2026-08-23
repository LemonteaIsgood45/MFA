import { useState } from "react";
import QuantitySelector from "./QuantitySelector";
import { getProductById } from "@/data/products";

interface ProductDetailPageProps {
  productId: string;
  onBack: () => void;
}

export default function ProductDetailPage({ productId, onBack }: ProductDetailPageProps) {
  const product = getProductById(productId);

  // One selected option per variant group, e.g. { duration: "v3" } for an
  // eSIM plan, or { color: "black", capacity: "20000" } for a product that
  // declares two groups. Seeded with each group's first option.
  const [selections, setSelections] = useState<Record<string, string>>(() =>
    Object.fromEntries((product?.variantGroups ?? []).map((group) => [group.id, group.options[0]?.id]))
  );
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!product) {
    return (
      <div className="p-6">
        <button onClick={onBack} className="text-sm text-red-600 hover:underline">
          ← Quay lại
        </button>
        <p className="mt-4">Không tìm thấy sản phẩm.</p>
      </div>
    );
  }

  const totalDelta = product.variantGroups.reduce((sum, group) => {
    const chosen = group.options.find((opt) => opt.id === selections[group.id]);
    return sum + (chosen?.priceDelta ?? 0);
  }, 0);
  const unitPrice = product.basePrice + totalDelta;
  const totalPrice = unitPrice * quantity;

  function handleAction(label: string) {
    const chosenLabels = product!.variantGroups
      .map((group) => group.options.find((opt) => opt.id === selections[group.id])?.label)
      .filter(Boolean)
      .join(", ");
    setFeedback(`${label}: ${quantity} × "${product!.name}"${chosenLabels ? ` (${chosenLabels})` : ""}`);
    window.setTimeout(() => setFeedback(null), 3000);
  }

  return (
    <div className="p-6">
      <button onClick={onBack} className="text-sm text-red-600 hover:underline">
        ← Quay lại danh sách
      </button>

      <div className="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Image gallery */}
        <div>
          <div className="flex h-72 w-full items-center justify-center rounded-lg bg-gray-100 text-7xl dark:bg-slate-800">
            {product.icon}
          </div>
          <div className="mt-3 flex gap-2">
            {["Ảnh 1", "Ảnh 2", "Ảnh 3"].map((label) => (
              <div
                key={label}
                className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-md border border-gray-200 text-center text-[10px] text-gray-500 dark:border-slate-600 dark:text-slate-400"
              >
                <span className="text-xl">🖼️</span>
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Info panel */}
        <div>
          <h1 className="text-xl font-semibold">{product.name}</h1>
          <p className="mt-2 text-2xl font-bold text-red-600">
            {totalPrice.toLocaleString("vi-VN")}đ
          </p>

          {/* Every variant group a product declares gets its own selector
              section — a product can have one (e.g. an eSIM plan's "Kỳ hạn
              gói") or several (e.g. a power bank's "Màu sắc" + "Dung lượng"). */}
          {product.variantGroups.map((group) => (
            <div key={group.id}>
              <p className="mt-4 text-sm font-medium">{group.label}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {group.options.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelections((prev) => ({ ...prev, [group.id]: option.id }))}
                    className={`rounded-md border px-3 py-1.5 text-sm ${
                      selections[group.id] === option.id
                        ? "border-red-600 bg-red-50 text-red-600 dark:bg-red-500/10"
                        : "border-gray-300 text-gray-700 hover:border-gray-400 dark:border-slate-600 dark:text-slate-200"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <p className="mt-4 text-sm font-medium">Số lượng</p>
          <div className="mt-2 flex items-center gap-3">
            <QuantitySelector value={quantity} onChange={setQuantity} />
            <span className="text-sm text-gray-400">{product.stock}</span>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => handleAction("Đã thêm vào giỏ hàng")}
              className="flex-1 rounded-md border border-red-600 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
            >
              🛒 Thêm vào giỏ hàng
            </button>
            <button
              type="button"
              onClick={() => handleAction("Đặt mua thành công")}
              className="flex-1 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Mua ngay
            </button>
          </div>

          {feedback && (
            <p className="mt-3 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-500/10 dark:text-green-400">
              {feedback}
            </p>
          )}
        </div>
      </div>

      {/* Spec table — driven entirely by product.detailRows, so it fits
          any product category without per-category branching */}
      <div className="mt-10 rounded-lg border border-gray-200 dark:border-slate-700">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold dark:border-slate-700 dark:bg-slate-800">
          Chi tiết sản phẩm
        </div>
        <table className="w-full text-sm">
          <tbody>
            {product.detailRows.map((row) => (
              <tr key={row.label} className="border-b border-gray-100 last:border-0 dark:border-slate-700">
                <td className="w-56 px-4 py-2.5 text-gray-500 dark:text-slate-400">{row.label}</td>
                <td className="px-4 py-2.5">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm text-gray-500 dark:text-slate-400">{product.description}</p>
    </div>
  );
}
