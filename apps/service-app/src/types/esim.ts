// Local to service-app: this remote owns its own commerce domain model.
// (Kept separate from @mfa/shared-types, which covers cross-app contracts
// like auth/user — these eSIM types are internal to this micro-frontend.)

export interface EsimVariant {
  id: string;
  label: string; // e.g. "1 tháng", "3 tháng", "6 tháng"
  priceDelta: number; // added to the plan's basePrice
}

export interface EsimPlan {
  id: string;
  carrier: string;
  name: string;
  badge?: string;
  dataPerMonth: string;
  freePerks: string[];
  renewalFee: string;
  bonus?: string;
  basePrice: number;
  variants: EsimVariant[];
  stock: string;
  description: string;
}

export interface OtherProduct {
  id: string;
  name: string;
  price: number;
  stock: string;
}
