import dynamic from "next/dynamic";
import React, { Suspense } from "react";
import Layout from "@/components/Layout";
import { loadRemoteComponent } from "@/lib/remotes";
import { useAuthToken, useTheme } from "@mfa/shared-store";

const RemoteServiceList = dynamic(() => loadRemoteComponent("serviceApp/ServiceList"), {
  ssr: false,
  loading: () => <p>Đang tải Service App...</p>,
});

export default function ServicesPage() {
  const token = useAuthToken();
  const theme = useTheme();

  return (
    <Layout>
      <Suspense fallback={<p>Đang tải...</p>}>
        <RemoteServiceList token={token} theme={theme} />
      </Suspense>
    </Layout>
  );
}
