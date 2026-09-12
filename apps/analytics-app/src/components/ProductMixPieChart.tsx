import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { ProductMixItem } from "@/types/product";

const COLORS = [
  "#4f46e5",
  "#16a34a",
  "#d97706",
  "#dc2626",
  "#0891b2",
  "#9333ea",
];

interface ProductMixPieChartProps {
  data: ProductMixItem[];
}

export default function ProductMixPieChart({ data }: ProductMixPieChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="label"
          outerRadius={100}
          label
        >
          {data.map((entry, index) => (
            <Cell key={entry.label} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
