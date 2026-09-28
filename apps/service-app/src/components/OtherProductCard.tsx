import type { Product } from "@/types/product";

interface OtherProductCardProps {
  product: Product;
  onSelect: (productId: string) => void;
}

export default function OtherProductCard({ product, onSelect }: OtherProductCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(product.id)}
      className="w-64 flex-shrink-0 rounded-lg border border-gray-200 bg-white p-3 text-left dark:border-slate-700 dark:bg-slate-800"
    >
      <img
        src={product.images[0]?.url}
        alt={product.images[0]?.alt ?? product.name}
        className="h-40 w-full rounded-md bg-gray-100 object-cover dark:bg-slate-700"
      />
      <p className="mt-2 line-clamp-2 text-sm">{product.name}</p>
      <p className="text-xs text-gray-400 dark:text-slate-500">{product.stock > 0 ? "Còn hàng" : "Hết hàng"}</p>
      <p className="mt-1 text-sm font-bold text-red-600">
        {product.basePrice.toLocaleString("vi-VN")}đ
      </p>
    </button>
  );
}
