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
      className="w-48 flex-shrink-0 rounded-lg border border-gray-200 bg-white p-3 text-left dark:border-slate-700 dark:bg-slate-800"
    >
      <div className="flex h-32 w-full items-center justify-center rounded-md bg-gray-100 text-4xl dark:bg-slate-700">
        {product.icon}
      </div>
      <p className="mt-2 line-clamp-2 text-sm">{product.name}</p>
      <p className="text-xs text-gray-400">{product.stock}</p>
      <p className="mt-1 text-sm font-bold text-red-600">
        {product.basePrice.toLocaleString("vi-VN")}đ
      </p>
    </button>
  );
}
