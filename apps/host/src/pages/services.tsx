import dynamic from "next/dynamic";
import React, { Suspense } from "react";
import Layout from "@/components/Layout";
import { loadRemoteComponent } from "@/lib/remotes";
import { useAuthToken, useTheme } from "@mfa/shared-store";
import RemoteErrorBoundary from "@/components/RemoteErrorBoundary";

const RemoteServiceList = dynamic(() => loadRemoteComponent("serviceApp/ServiceList"), {
  ssr: false,
  loading: () => <p>Đang tải Service App...</p>,
});

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
