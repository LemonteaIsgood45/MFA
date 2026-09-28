import type { AdminProduct } from "@/types/product";

interface ProductTableProps {
  products: AdminProduct[];
  onRowClick: (product: AdminProduct) => void;
}

function stockBadge(stock: number) {
  if (stock === 0) {
    return (
      <span className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-700 dark:bg-red-500/10 dark:text-red-400">
        Hết hàng
      </span>
    );
  }
  if (stock < 20) {
    return (
      <span className="rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
        Sắp hết
      </span>
    );
  }
  return (
    <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:bg-green-500/10 dark:text-green-400">
      Còn hàng
    </span>
  );
}

export default function ProductTable({
  products,
  onRowClick,
}: ProductTableProps) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-200 text-left text-gray-500 dark:border-slate-700 dark:text-slate-400">
          <th className="py-2">Sản phẩm</th>
          <th className="py-2">Loại</th>
          <th className="py-2">Giá</th>
          <th className="py-2">Tồn kho</th>
          <th className="py-2">Trạng thái</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr
            key={product.id}
            onClick={() => onRowClick(product)}
            className="cursor-pointer border-b border-gray-100 hover:bg-gray-50 dark:border-slate-800 dark:hover:bg-slate-800"
          >
            <td className="py-2.5">
              <div className="font-medium">{product.name}</div>
              {product.badge && (
                <div className="text-xs text-gray-400 dark:text-slate-500">{product.badge}</div>
              )}
            </td>
            <td className="py-2.5">
              {product.category === "esim"
                ? (product.carrier ?? "eSIM")
                : "Phụ kiện"}
            </td>
            <td className="py-2.5">
              {product.basePrice.toLocaleString("vi-VN")}đ
            </td>
            <td className="py-2.5">{product.stock}</td>
            <td className="py-2.5">{stockBadge(product.stock)}</td>
          </tr>
        ))}
        {products.length === 0 && (
          <tr>
            <td colSpan={5} className="py-6 text-center text-gray-400 dark:text-slate-500">
              Không có sản phẩm phù hợp.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
