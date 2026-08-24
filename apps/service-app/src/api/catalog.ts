import type { Product } from "@/types/product";

export interface PromoBanner {
  imageUrl: string;
}

const backendUrl = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:4000";

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${backendUrl}${path}`);

  if (!response.ok) {
    throw new Error(`Could not load catalogue data (${response.status}).`);
  }

  return response.json() as Promise<T>;
}

export function getProducts(): Promise<Product[]> {
  return getJson<Product[]>("/api/catalog/products");
}

export function getPromoBanners(): Promise<PromoBanner[]> {
  return getJson<PromoBanner[]>("/api/catalog/banners");
}
