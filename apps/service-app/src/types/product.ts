// One product model for the whole storefront (eSIM plans and accessories
// alike) so they can share the same detail page. A product can declare
// ANY number of variant groups — e.g. an eSIM plan has one group ("Kỳ hạn
// gói"), a cable might have two ("Chiều dài" + "Màu sắc") — the detail page
// just renders whatever groups.length happens to be.

export interface VariantOption {
  id: string;
  label: string; // e.g. "1 tháng", "Đen", "10.000mAh"
  priceDelta: number; // added to the product's basePrice when selected
}

export interface VariantGroup {
  id: string;
  label: string; // group heading shown above its option buttons
  options: VariantOption[];
}

export interface DetailRow {
  label: string;
  value: string;
}

export interface ProductImage {
  url: string;
  alt: string;
}

export type ProductCategory = "esim" | "accessory";

export interface Product {
  id: string;
  category: ProductCategory;
  name: string;
  images: ProductImage[];
  basePrice: number;
  stock: number;
  description: string;
  variantGroups: VariantGroup[];
  detailRows: DetailRow[];

  // eSIM-only display fields (used by PlanCard + carrier filter tabs)
  carrier?: string;
  badge?: string;
  highlights?: string[];
}
