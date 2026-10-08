import React, { Suspense, lazy } from "react";
import Layout from "@/components/Layout";
import { loadRemoteComponent } from "@/lib/remotes";
import { useAuthToken, useTheme } from "@mfa/shared-store";
import RemoteErrorBoundary from "@/components/RemoteErrorBoundary";

const RemoteServiceList = lazy(() =>
  loadRemoteComponent("serviceApp/ServiceList"),
);

export default function ServicesPage() {
  const token = useAuthToken();
  const theme = useTheme();

  return (
    <Layout>
      <RemoteErrorBoundary remoteName="Service App">
        <Suspense fallback={<p>Đang tải Service App...</p>}>
          <RemoteServiceList token={token} theme={theme} />
        </Suspense>
      </RemoteErrorBoundary>
    </Layout>
  );
}
