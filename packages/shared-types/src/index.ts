// Shared domain types used across host, service-app, analytics-app and backend.
// Keeping these in one package means all three micro-frontends agree on the same
// shapes even though they are built, versioned and deployed independently.

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "moderator" | "customer";
}

export type PrivilegedRole = "admin" | "moderator";

export const canViewAnalytics = (user: User | null | undefined): boolean =>
  user?.role === "admin" || user?.role === "moderator";

export interface AuthToken {
  token: string;
  expiresAt: number; // epoch ms
}

export type ServicePlanStatus = "active" | "suspended" | "cancelled";

export interface ServicePlan {
  id: string;
  name: string;
  description: string;
  price: number;
  status: ServicePlanStatus;
  subscriberCount: number;
}

export interface AnalyticsSummary {
  totalRevenue: number;
  totalSubscribers: number;
  churnRate: number;
  revenueByMonth: { month: string; revenue: number }[];
}

export type ThemeMode = "light" | "dark";

// Contract for the runtime-loaded remote components exposed via Module Federation.
export interface RemoteModuleProps {
  token?: string | null;
  theme?: ThemeMode;
}

export interface CartItem {
  id: string;
  productId: string;
  productName?: string;
  variantSelections: Record<string, string>;
  quantity: number;
  unitPrice: number;
}
