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

      <div className="mt-4 overflow-x-auto">
        <ProductTable products={visibleProducts} onRowClick={setSelected} />
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
