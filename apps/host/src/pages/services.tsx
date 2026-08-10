import dynamic from "next/dynamic";
import React, { Suspense } from "react";
import Layout from "@/components/Layout";
import { loadRemoteComponent } from "@/lib/remotes";
import { useAuthToken, useTheme } from "@mfa/shared-store";

// Loaded at runtime via @module-federation/runtime — must be client-only,
// since the remote script is only fetched in the browser.
const RemoteServiceList = dynamic(() => loadRemoteComponent("serviceApp/ServiceList"), {
  ssr: false,
  loading: () => <p>Đang tải Service App...</p>,
});

export default function ServicesPage() {
  const token = useAuthToken();
  const theme = useTheme();

  return (
    <Layout>
      <h1 className="text-2xl font-semibold">Quản lý dịch vụ</h1>
      <p className="mt-1 text-gray-500 dark:text-slate-400">
        Module này được fetch runtime từ Service App (Vite, cổng 5001).
      </p>
      <Suspense fallback={<p>Đang tải...</p>}>
        <div className="mt-4">
          <RemoteServiceList token={token} theme={theme} />
        </div>
      </Suspense>
    </Layout>
  );
}
