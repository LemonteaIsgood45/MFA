export interface RevenueMonth {
  month: string;
  revenue: number;
}

export interface OrderStatusCount {
  status: "completed" | "pending" | "cancelled";
  count: number;
}

export interface TopProduct {
  id: string;
  name: string;
  unitsSold: number;
  revenue: number;
}

export interface SalesData {
  revenueByMonth: RevenueMonth[];
  orderStatusBreakdown: OrderStatusCount[];
  topProducts: TopProduct[];
  totalOrders: number;
  totalRevenue: number;
}