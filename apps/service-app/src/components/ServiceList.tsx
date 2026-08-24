import { useEffect, useState } from "react";
import type { RemoteModuleProps } from "@mfa/shared-types";
import { getProducts, getPromoBanners } from "@/api/catalog";
import type { PromoBanner } from "@/api/catalog";
import type { Product } from "@/types/product";
import ProductListPage from "./ProductListPage";
import ProductDetailPage from "./ProductDetailPage";
import "../index.css";

type View = { name: "list" } | { name: "detail"; productId: string };

export default function ServiceList(props: RemoteModuleProps) {
  const [view, setView] = useState<View>({ name: "list" });
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<PromoBanner[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getProducts(), getPromoBanners()])
      .then(([loadedProducts, loadedBanners]) => {
        setProducts(loadedProducts);
        setBanners(loadedBanners);
      })
      .catch((loadError: unknown) => {
        setError(loadError instanceof Error ? loadError.message : "Could not load catalogue data.");
      });
  }, []);

  return (
    <div className={props.theme === "dark" ? "dark" : undefined}>
      <div className="min-h-screen bg-white text-gray-900 dark:bg-slate-900 dark:text-slate-100">
        {error ? (
          <p className="p-6 text-sm text-red-600">{error}</p>
        ) : products.length === 0 ? (
          <p className="p-6 text-sm text-gray-500 dark:text-slate-400">Đang tải sản phẩm...</p>
        ) : view.name === "list" ? (
          <ProductListPage
            products={products}
            banners={banners}
            onSelectProduct={(productId) => setView({ name: "detail", productId })}
          />
        ) : (
          <ProductDetailPage
            product={products.find((product) => product.id === view.productId)}
            onBack={() => setView({ name: "list" })}
          />
        )}
      </div>
    </div>
  );
}
