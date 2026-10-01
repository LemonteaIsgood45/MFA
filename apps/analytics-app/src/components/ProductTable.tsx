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
  if (stock <= 30) {
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
          <th className="py-2">Nhà mạng</th>
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
                <div className="text-xs text-gray-400 dark:text-slate-500">
                  {product.badge}
                </div>
              )}
            </td>
            <td className="py-2.5">
              {product.category === "esim" ? "eSIM" : "Phụ kiện"}
            </td>
            <td className="py-2.5">
              {product.carrier ? (
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ${product.carrier === "GigaTel" ? "bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300" : product.carrier === "NovaMax" ? "bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300" : product.carrier === "SkyConnect" ? "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300" : "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"}`}
                >
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 rounded-full bg-current"
                  />
                  {product.carrier}
                </span>
              ) : (
                <span className="text-gray-400">—</span>
              )}
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
            <td
              colSpan={6}
              className="py-6 text-center text-gray-400 dark:text-slate-500"
            >
              Không có sản phẩm phù hợp.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
