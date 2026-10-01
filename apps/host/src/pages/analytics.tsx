import dynamic from "next/dynamic";
import React, { Suspense } from "react";
import Layout from "@/components/Layout";
import { loadRemoteComponent } from "@/lib/remotes";
import { useAuthToken, useTheme } from "@mfa/shared-store";
import RemoteErrorBoundary from "@/components/RemoteErrorBoundary";

const RemoteDashboard = dynamic(
  () => loadRemoteComponent("analyticsApp/Dashboard"),
  {
    ssr: false,
    loading: () => <p>Đang tải Analytics App...</p>,
  },
);

export default function AnalyticsPage() {
  const token = useAuthToken();
  const theme = useTheme();

  return (
    <Layout>
      {/* No page-level heading here — Dashboard renders its own full-page
          header + tabs now, so a duplicate title above it would be redundant. */}
      <RemoteErrorBoundary remoteName="Analytics App">
        <Suspense fallback={<p>Đang tải Analytics App...</p>}>
          <RemoteDashboard token={token} theme={theme} />
        </Suspense>
      </RemoteErrorBoundary>
    </Layout>
  );
}
