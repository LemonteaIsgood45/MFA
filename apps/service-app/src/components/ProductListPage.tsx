import { useMemo, useState } from "react";
import type { PromoBanner } from "@/api/catalog";
import type { Product } from "@/types/product";
import PromoBannerCarousel from "./PromoBanner";
import CarrierTabs from "./CarrierTabs";
import HorizontalScroller from "./HorizontalScroller";
import PlanCard from "./PlanCard";
import OtherProductCard from "./OtherProductCard";

interface ProductListPageProps {
  onSelectProduct: (productId: string) => void;
  products: Product[];
  banners: PromoBanner[];
  token?: string | null;
}

export default function ProductListPage({ onSelectProduct, products, banners, token }: ProductListPageProps) {
  const [activeCarrier, setActiveCarrier] = useState("Tất cả");
  const esimPlans = useMemo(() => products.filter((product) => product.category === "esim"), [products]);
  const accessories = useMemo(() => products.filter((product) => product.category === "accessory"), [products]);
  const carriers = useMemo(
    () => Array.from(new Set(esimPlans.flatMap((plan) => (plan.carrier ? [plan.carrier] : [])))),
    [esimPlans]
  );
  const visiblePlans = useMemo(
    () => (activeCarrier === "Tất cả" ? esimPlans : esimPlans.filter((plan) => plan.carrier === activeCarrier)),
    [activeCarrier, esimPlans]
  );

  return (
    <div className="p-6">
      <PromoBannerCarousel banners={banners} />
      <CarrierTabs carriers={carriers} active={activeCarrier} onChange={setActiveCarrier} />

      <HorizontalScroller title="Gói eSIM nổi bật">
        {visiblePlans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} onSelect={onSelectProduct} token={token} />
        ))}
      </HorizontalScroller>

      <HorizontalScroller title="Sản phẩm khác">
        {accessories.map((product) => (
          <OtherProductCard key={product.id} product={product} onSelect={onSelectProduct} />
        ))}
      </HorizontalScroller>
    </div>
  );
}
