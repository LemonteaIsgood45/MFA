import Dashboard from "./components/Dashboard";
import { useTheme } from "@mfa/shared-store";

export default function App() {
  const theme = useTheme();
  return <Dashboard token={null} theme={theme} />;
}
