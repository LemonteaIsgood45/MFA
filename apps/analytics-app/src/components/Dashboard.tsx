import { useState, useEffect } from "react";
import Tabs from "./Tabs";
import ProductsTab from "./ProductsTab";
import UsersTab from "./UsersTab";
import SalesTab from "./SalesTab";
import { useAuthToken } from "@mfa/shared-store";
import type { RemoteModuleProps } from "@mfa/shared-types";
import "../index.css";

const TABS = [
  { id: "products", label: "Sản phẩm" },
  { id: "users", label: "Người dùng" },
  { id: "sales", label: "Doanh số" },
];

export default function Dashboard(props: RemoteModuleProps) {
  const storeToken = useAuthToken();
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("products");

  // Defer dynamic state sync until client hydration completes
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const token = props.token ?? (isMounted ? storeToken : null);
  const isDark = props.theme === "dark";

  return (
    <div className={isDark ? "dark" : ""}>
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
