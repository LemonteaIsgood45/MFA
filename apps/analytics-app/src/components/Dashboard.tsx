import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAuthToken } from "@mfa/shared-store";
import type { AnalyticsSummary, RemoteModuleProps } from "@mfa/shared-types";
// Imported here (not just in bootstrap.tsx) so the CSS ships as part of
// this exposed module's own chunk — bootstrap.tsx is only the standalone
// entry and isn't loaded when the host consumes Dashboard via Module
// Federation, so this is what makes Tailwind classes work there too.
import "../index.css";

const API_BASE = process.env.BACKEND_URL ?? "http://localhost:4000";

export default function Dashboard(props: RemoteModuleProps) {
  const storeToken = useAuthToken();
  const token = props.token ?? storeToken;

  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    fetch(`${API_BASE}/api/analytics/summary`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json();
      })
      .then(setSummary)
      .catch((err: Error) => setError(err.message));
  }, [token]);

  if (!token) {
    return <p>Vui lòng đăng nhập để xem thống kê (chưa có token).</p>;
  }

  if (error) {
    return <p className="text-red-600">Lỗi tải dữ liệu: {error}</p>;
  }

  if (!summary) {
    return <p>Đang tải dữ liệu thống kê...</p>;
  }

  return (
    <section>
      <div className="mb-6 flex gap-4">
        <StatCard label="Tổng doanh thu" value={summary.totalRevenue.toLocaleString("vi-VN")} />
        <StatCard label="Tổng thuê bao" value={summary.totalSubscribers.toLocaleString("vi-VN")} />
        <StatCard label="Tỷ lệ rời mạng" value={`${summary.churnRate}%`} />
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={summary.revenueByMonth}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1 rounded-lg border border-gray-200 bg-gray-50 p-4">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}
