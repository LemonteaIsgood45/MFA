import { useEffect, useMemo, useState } from "react";
import ProductFilterBar, {
  type CategoryFilter,
  type ProductSortKey,
} from "./ProductFilterBar";
import ProductTable from "./ProductTable";
import ProductDetailDrawer from "./ProductDetailDrawer";
import ProductMixPieChart from "./ProductMixPieChart";
import { apiFetch } from "@/lib/api";
import type { AdminProduct, ProductMixItem } from "@/types/product";

interface ProductsTabProps {
  token: string | null | undefined;
}

export default function ProductsTab({ token }: ProductsTabProps) {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [mix, setMix] = useState<ProductMixItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<AdminProduct | null>(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [sortKey, setSortKey] = useState<ProductSortKey>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  useEffect(() => { setPage(1); }, [search, category]);

  useEffect(() => {
    if (!token) return;
    apiFetch<AdminProduct[]>("/api/products", token)
      .then(setProducts)
      .catch((e) => setError(e.message));
    apiFetch<ProductMixItem[]>("/api/analytics/product-mix", token)
      .then(setMix)
      .catch((e) => setError(e.message));
  }, [token]);

  const visibleProducts = useMemo(() => {
    let list = products;
    if (category !== "all") list = list.filter((p) => p.category === category);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    const sorted = [...list].sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortKey === "name") return a.name.localeCompare(b.name) * dir;
      return (a[sortKey] - b[sortKey]) * dir;
    });
    return sorted;
  }, [products, category, search, sortKey, sortDir]);

  const pageCount = Math.max(1, Math.ceil(visibleProducts.length / pageSize));
  const pageProducts = visibleProducts.slice((page - 1) * pageSize, page * pageSize);

  function exportCsv() {
    const escape = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`;
    const rows = [
      ["ID", "Name", "Type", "Carrier", "Price", "Stock"],
      ...visibleProducts.map((product) => [product.id, product.name, product.category, product.carrier ?? "", product.basePrice, product.stock]),
    ];
    const csv = `\uFEFF${rows.map((row) => row.map(escape).join(",")).join("\r\n")}`;
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "products.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  if (!token) {
    return <p>Vui lòng đăng nhập để xem sản phẩm.</p>;
  }

  if (error) {
    return <p className="text-red-600">Lỗi tải dữ liệu: {error}</p>;
  }

  return (
    <div>
      <ProductFilterBar
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        sortKey={sortKey}
        onSortKeyChange={setSortKey}
        sortDir={sortDir}
        onToggleSortDir={() =>
          setSortDir((d) => (d === "asc" ? "desc" : "asc"))
        }
      />

      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="text-gray-500 dark:text-slate-400">{visibleProducts.length} sản phẩm</span>
        <button type="button" onClick={exportCsv} className="rounded-md border border-gray-300 px-3 py-1.5 hover:bg-gray-100 dark:border-slate-600 dark:hover:bg-slate-700">Xuất CSV</button>
      </div>

      <div className="mt-4 overflow-x-auto">
        <ProductTable products={pageProducts} onRowClick={setSelected} />
      </div>
      <div className="mt-3 flex items-center justify-end gap-3 text-sm">
        <button type="button" disabled={page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="rounded border border-gray-300 px-3 py-1.5 disabled:opacity-40 dark:border-slate-600">Trước</button>
        <span>Trang {Math.min(page, pageCount)} / {pageCount}</span>
        <button type="button" disabled={page >= pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))} className="rounded border border-gray-300 px-3 py-1.5 disabled:opacity-40 dark:border-slate-600">Tiếp</button>
      </div>

      <div className="mt-8">
        <h3 className="mb-2 text-sm font-semibold">Cơ cấu sản phẩm</h3>
        <ProductMixPieChart data={mix} />
      </div>

      {selected && (
        <ProductDetailDrawer
          product={selected}
          token={token}
          onClose={() => setSelected(null)}
          onUpdated={(updated) => {
            setProducts((prev) =>
              prev.map((p) => (p.id === updated.id ? updated : p)),
            );
            setSelected(updated);
          }}
        />
      )}
    </div>
  );
}
