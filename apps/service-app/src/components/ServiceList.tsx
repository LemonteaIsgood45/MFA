import React, { useEffect, useState } from "react";
import { useAuthToken } from "@mfa/shared-store";
import type { RemoteModuleProps, ServicePlan } from "@mfa/shared-types";
// Imported here (not just in main.tsx) so the CSS ships as part of this
// exposed module's own chunk — main.tsx is only the standalone entry and
// isn't loaded at all when the host consumes ServiceList via Module
// Federation, so this is what makes Tailwind classes actually work there too.
import "../index.css";

const API_BASE = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:4000";

const statusStyles: Record<ServicePlan["status"], string> = {
  active: "text-green-600",
  suspended: "text-amber-600",
  cancelled: "text-red-600",
};

export default function ServiceList(props: RemoteModuleProps) {
  const storeToken = useAuthToken();
  const token = props.token ?? storeToken;

  const [plans, setPlans] = useState<ServicePlan[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    fetch(`${API_BASE}/api/services`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json();
      })
      .then(setPlans)
      .catch((err: Error) => setError(err.message));
  }, [token]);

  async function toggleStatus(plan: ServicePlan) {
    if (!token) return;
    const nextStatus = plan.status === "active" ? "suspended" : "active";

    const res = await fetch(`${API_BASE}/api/services/${plan.id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: nextStatus }),
    });

    if (res.ok) {
      const updated: ServicePlan = await res.json();
      setPlans((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    }
  }

  if (!token) {
    return <p>Vui lòng đăng nhập để xem danh sách dịch vụ (chưa có token).</p>;
  }

  if (error) {
    return <p className="text-red-600">Lỗi tải dữ liệu: {error}</p>;
  }

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b-2 border-gray-200 text-left">
          <th className="p-2">Tên gói</th>
          <th className="p-2">Giá</th>
          <th className="p-2">Thuê bao</th>
          <th className="p-2">Trạng thái</th>
          <th className="p-2" />
        </tr>
      </thead>
      <tbody>
        {plans.map((plan) => (
          <tr key={plan.id} className="border-b border-gray-100">
            <td className="p-2">
              <strong>{plan.name}</strong>
              <div className="text-xs text-gray-500">{plan.description}</div>
            </td>
            <td className="p-2">{plan.price.toLocaleString("vi-VN")}đ</td>
            <td className="p-2">{plan.subscriberCount.toLocaleString("vi-VN")}</td>
            <td className="p-2">
              <span className={`font-semibold ${statusStyles[plan.status]}`}>{plan.status}</span>
            </td>
            <td className="p-2">
              <button
                onClick={() => toggleStatus(plan)}
                className="rounded-md border border-gray-300 px-3 py-1.5 hover:bg-gray-100"
              >
                {plan.status === "active" ? "Tạm ngưng" : "Kích hoạt"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
