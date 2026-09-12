import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { OrderStatusCount } from "@/types/sales";

const STATUS_COLORS: Record<string, string> = {
  completed: "#16a34a",
  pending: "#d97706",
  cancelled: "#dc2626",
};

const STATUS_LABELS: Record<string, string> = {
  completed: "Hoàn thành",
  pending: "Đang xử lý",
  cancelled: "Đã hủy",
};

interface OrderStatusPieChartProps {
  data: OrderStatusCount[];
}

export default function OrderStatusPieChart({
  data,
}: OrderStatusPieChartProps) {
  const displayData = data.map((d) => ({
    ...d,
    label: STATUS_LABELS[d.status] ?? d.status,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={displayData}
          dataKey="count"
          nameKey="label"
          outerRadius={100}
          label
        >
          {displayData.map((entry) => (
            <Cell
              key={entry.status}
              fill={STATUS_COLORS[entry.status] ?? "#94a3b8"}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
