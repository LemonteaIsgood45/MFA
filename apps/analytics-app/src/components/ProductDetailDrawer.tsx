import { useState } from "react";
import type { AdminProduct } from "@/types/product";
import { apiFetch } from "@/lib/api";

interface ProductDetailDrawerProps {
  product: AdminProduct;
  token: string | null | undefined;
  onClose: () => void;
  onUpdated: (updated: AdminProduct) => void;
}

export default function ProductDetailDrawer({
  product,
  token,
  onClose,
  onUpdated,
}: ProductDetailDrawerProps) {
  const [name, setName] = useState(product.name);
  const [basePrice, setBasePrice] = useState(product.basePrice);
  const [description, setDescription] = useState(product.description);
  const [stockDelta, setStockDelta] = useState(0);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSaveDetails() {
    setSaving(true);
    setMessage(null);
    try {
      await apiFetch(`/api/products/${product.id}`, token, {
        method: "PATCH",
        body: JSON.stringify({ name, basePrice, description }),
      });
      onUpdated({ ...product, name, basePrice, description });
      setMessage("Đã lưu thay đổi.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Lỗi khi lưu.");
    } finally {
      setSaving(false);
    }
  }

  async function handleAdjustStock() {
    if (stockDelta === 0) return;
    setSaving(true);
    setMessage(null);
    try {
      const result = await apiFetch<{ stock: number }>(
        `/api/products/${product.id}/stock`,
        token,
        {
          method: "POST",
          body: JSON.stringify({ delta: stockDelta }),
        },
      );
      onUpdated({
        ...product,
        name,
        basePrice,
        description,
        stock: result.stock,
      });
      setStockDelta(0);
      setMessage("Đã cập nhật tồn kho.");
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "Lỗi khi cập nhật tồn kho.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-20 flex justify-end bg-black/30"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="h-full w-full max-w-md overflow-y-auto bg-white p-6 dark:bg-slate-900"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Chi tiết sản phẩm</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 dark:hover:text-slate-200"
          >
            ✕
          </button>
        </div>

        {product.images[0] && (
          <img
            src={product.images[0].url}
            alt={product.images[0].alt}
            className="mt-4 h-40 w-full rounded-md object-cover"
          />
        )}

        <div className="mt-4 space-y-3">
          <div>
            <label className="text-xs text-gray-500 dark:text-slate-400">
              Tên sản phẩm
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-800"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 dark:text-slate-400">
              Giá (đ)
            </label>
            <input
              type="number"
              value={basePrice}
              onChange={(e) => setBasePrice(Number(e.target.value))}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-800"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 dark:text-slate-400">
              Mô tả
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-800"
            />
          </div>
          <button
            type="button"
            onClick={handleSaveDetails}
            disabled={saving}
            className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            Lưu thay đổi
          </button>
        </div>

        <div className="mt-6 rounded-md border border-gray-200 p-3 dark:border-slate-700">
          <p className="text-sm font-medium">
            Tồn kho hiện tại: {product.stock}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <input
              type="number"
              value={stockDelta}
              onChange={(e) => setStockDelta(Number(e.target.value))}
              placeholder="+10 hoặc -5"
              className="w-28 rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-800"
            />
            <button
              type="button"
              onClick={handleAdjustStock}
              disabled={saving || stockDelta === 0}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-100 disabled:opacity-50 dark:border-slate-600 dark:hover:bg-slate-700"
            >
              Cập nhật tồn kho
            </button>
          </div>
        </div>

        {message && (
          <p className="mt-3 rounded-md bg-gray-50 px-3 py-2 text-sm dark:bg-slate-800">
            {message}
          </p>
        )}

        {product.variantGroups.length > 0 && (
          <div className="mt-6">
            <p className="text-sm font-medium">Biến thể</p>
            {product.variantGroups.map((group) => (
              <div
                key={group.id}
                className="mt-1 text-sm text-gray-500 dark:text-slate-400"
              >
                {group.label}: {group.options.map((o) => o.label).join(", ")}
              </div>
            ))}
          </div>
        )}

        {product.detailRows.length > 0 && (
          <div className="mt-6">
            <p className="text-sm font-medium">Thông số</p>
            <table className="mt-1 w-full text-sm">
              <tbody>
                {product.detailRows.map((row) => (
                  <tr
                    key={row.label}
                    className="border-b border-gray-100 last:border-0 dark:border-slate-800"
                  >
                    <td className="py-1.5 text-gray-500 dark:text-slate-400">
                      {row.label}
                    </td>
                    <td className="py-1.5">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
