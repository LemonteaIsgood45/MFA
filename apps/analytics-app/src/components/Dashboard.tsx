import { useState } from "react";
import Tabs from "./Tabs";
import ProductsTab from "./ProductsTab";
import UsersTab from "./UsersTab";
import SalesTab from "./SalesTab";
import { useAuthToken } from "@mfa/shared-store";
import type { RemoteModuleProps } from "@mfa/shared-types";
// Imported here (not just in bootstrap.tsx) so the CSS ships as part of
// this exposed module's own chunk — bootstrap.tsx is only the standalone
// entry and isn't loaded when the host consumes Dashboard via Module
// Federation, so this is what makes Tailwind classes work there too.
import "../index.css";

const TABS = [
  { id: "products", label: "Sản phẩm" },
  { id: "users", label: "Người dùng" },
  { id: "sales", label: "Doanh số" },
];

export default function Dashboard(props: RemoteModuleProps) {
  const storeToken = useAuthToken();
  const token = props.token ?? storeToken;
  const isDark = props.theme === "dark";

  const [activeTab, setActiveTab] = useState("products");

  return (
    <div className={isDark ? "dark" : undefined}>
      <div className="min-h-screen bg-white p-6 text-gray-900 dark:bg-slate-900 dark:text-slate-100">
        <h1 className="text-xl font-semibold">Bảng điều khiển thống kê</h1>
        <div className="mt-4">
          <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />
        </div>
        <div className="mt-6">
          {activeTab === "products" && <ProductsTab token={token} />}
          {activeTab === "users" && <UsersTab token={token} />}
          {activeTab === "sales" && <SalesTab token={token} />}
        </div>
      </div>
    </div>
  );
}
