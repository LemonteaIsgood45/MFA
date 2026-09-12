export interface ProductImage {
  url: string;
  alt: string;
}

export interface VariantOption {
  id: string;
  label: string;
  priceDelta: number;
}

export interface VariantGroup {
  id: string;
  label: string;
  options: VariantOption[];
}

export interface DetailRow {
  label: string;
  value: string;
}

export type ProductCategory = "esim" | "accessory";

export interface AdminProduct {
  id: string;
  category: ProductCategory;
  carrier: string | null;
  name: string;
  badge: string | null;
  highlights: string[];
  basePrice: number;
  stock: number;
  description: string;
  variantGroups: VariantGroup[];
  detailRows: DetailRow[];
  images: ProductImage[];
}

export interface ProductMixItem {
  label: string;
  count: number;
}