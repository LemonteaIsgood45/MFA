// The remotes are only resolvable at RUNTIME by webpack's Module Federation
// container, not by TypeScript's module resolver at build time. These
// ambient declarations let the host import from them with full typing.
declare module "serviceApp/ServiceList" {
  import type { RemoteModuleProps } from "@mfa/shared-types";
  const ServiceList: React.ComponentType<RemoteModuleProps>;
  export default ServiceList;
}

declare module "analyticsApp/Dashboard" {
  import type { RemoteModuleProps } from "@mfa/shared-types";
  const Dashboard: React.ComponentType<RemoteModuleProps>;
  export default Dashboard;
}
