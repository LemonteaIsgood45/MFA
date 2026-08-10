import dynamic from "next/dynamic";
import React, { Suspense } from "react";
import Layout from "@/components/Layout";
import { loadRemoteComponent } from "@/lib/remotes";
import { useAuthToken, useTheme } from "@mfa/shared-store";

const RemoteDashboard = dynamic(() => loadRemoteComponent("analyticsApp/Dashboard"), {
  ssr: false,
  loading: () => <p>Đang tải Analytics App...</p>,
});

export default function AnalyticsPage() {
  const token = useAuthToken();
  const theme = useTheme();

  return (
    <Layout>
      <h1 className="text-2xl font-semibold">Thống kê</h1>
      <p className="mt-1 text-gray-500 dark:text-slate-400">
        Module này được fetch runtime từ Analytics App (Webpack, cổng 5002).
      </p>
      <Suspense fallback={<p>Đang tải...</p>}>
        <div className="mt-4">
          <RemoteDashboard token={token} theme={theme} />
        </div>
      </Suspense>
    </Layout>
  );
}
