import ServiceList from "./components/ServiceList";
import { useTheme } from "@mfa/shared-store";

export default function App() {
  const theme = useTheme();
  return <ServiceList token={null} theme={theme} />;
}
