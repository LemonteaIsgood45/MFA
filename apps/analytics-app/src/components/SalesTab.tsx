import { useEffect, useState } from "react";
import StatCard from "./StatCard";
import MonthlyRevenueChart from "./MonthlyRevenueChart";
import OrderStatusPieChart from "./OrderStatusPieChart";
import TopProductsChart from "./TopProductsChart";
import { apiFetch } from "@/lib/api";
import type { SalesData } from "@/types/sales";

interface SalesTabProps {
  token: string | null | undefined;
}

export default function SalesTab({ token }: SalesTabProps) {
  const [sales, setSales] = useState<SalesData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    apiFetch<SalesData>("/api/analytics/sales", token)
      .then(setSales)
      .catch((e) => setError(e.message));
  }, [token]);

  if (!token) {
    return <p>Vui lòng đăng nhập để xem doanh số.</p>;
  }

  if (error) {
    return <p className="text-red-600">Lỗi tải dữ liệu: {error}</p>;
  }

  if (!sales) {
    return <p>Đang tải dữ liệu doanh số...</p>;
  }

  return (
    <div>
      <div className="flex gap-4">
        <StatCard
          label="Tổng doanh thu"
          value={sales.totalRevenue.toLocaleString("vi-VN") + "đ"}
        />
        <StatCard
          label="Tổng đơn hàng"
          value={sales.totalOrders.toLocaleString("vi-VN")}
          hint="Không tính đơn đã hủy"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <h3 className="mb-2 text-sm font-semibold">Doanh thu theo tháng</h3>
          <MonthlyRevenueChart data={sales.revenueByMonth} />
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold">Trạng thái đơn hàng</h3>
          <OrderStatusPieChart data={sales.orderStatusBreakdown} />
        </div>
      </div>

      <div className="mt-8">
        <h3 className="mb-2 text-sm font-semibold">Sản phẩm bán chạy</h3>
        <TopProductsChart data={sales.topProducts} />
      </div>
    </div>
  );
}
