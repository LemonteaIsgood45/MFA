export type ProductSortKey = "name" | "basePrice" | "stock";
export type CategoryFilter = "all" | "esim" | "accessory";

interface ProductFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: CategoryFilter;
  onCategoryChange: (value: CategoryFilter) => void;
  sortKey: ProductSortKey;
  onSortKeyChange: (value: ProductSortKey) => void;
  sortDir: "asc" | "desc";
  onToggleSortDir: () => void;
}

export default function ProductFilterBar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  sortKey,
  onSortKeyChange,
  sortDir,
  onToggleSortDir,
}: ProductFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Tìm theo tên sản phẩm..."
        className="w-64 rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
      />

      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value as CategoryFilter)}
        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
      >
        <option value="all">Tất cả loại</option>
        <option value="esim">eSIM</option>
        <option value="accessory">Phụ kiện</option>
      </select>

      <select
        value={sortKey}
        onChange={(e) => onSortKeyChange(e.target.value as ProductSortKey)}
        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
      >
        <option value="name">Sắp xếp: Tên</option>
        <option value="basePrice">Sắp xếp: Giá</option>
        <option value="stock">Sắp xếp: Tồn kho</option>
      </select>

      <button
        type="button"
        onClick={onToggleSortDir}
        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-100 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-700"
        title="Đổi chiều sắp xếp"
      >
        {sortDir === "asc" ? "↑ Tăng dần" : "↓ Giảm dần"}
      </button>
    </div>
  );
}
