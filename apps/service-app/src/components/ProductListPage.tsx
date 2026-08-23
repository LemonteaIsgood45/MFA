import { useMemo, useState } from "react";
import PromoBanner from "./PromoBanner";
import CarrierTabs from "./CarrierTabs";
import HorizontalScroller from "./HorizontalScroller";
import PlanCard from "./PlanCard";
import OtherProductCard from "./OtherProductCard";
import { CARRIERS, esimPlans, accessories } from "@/data/products";

interface ProductListPageProps {
  onSelectProduct: (productId: string) => void;
}

export default function ProductListPage({ onSelectProduct }: ProductListPageProps) {
  const [activeCarrier, setActiveCarrier] = useState("Tất cả");

  const visiblePlans = useMemo(
    () =>
      activeCarrier === "Tất cả"
        ? esimPlans
        : esimPlans.filter((plan) => plan.carrier === activeCarrier),
    [activeCarrier]
  );

  return (
    <div className="p-6">
      <PromoBanner />
      <CarrierTabs carriers={CARRIERS} active={activeCarrier} onChange={setActiveCarrier} />

      <HorizontalScroller title="Gói eSIM nổi bật">
        {visiblePlans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} onSelect={onSelectProduct} />
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
