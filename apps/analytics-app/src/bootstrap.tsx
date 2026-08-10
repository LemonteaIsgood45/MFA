import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// This only runs when analytics-app is opened directly (npm run dev),
// letting the team build/preview it fully standalone, exactly as the
// spec requires ("code, run dev server, deploy independently").
const container = document.getElementById("root");
if (container) {
  createRoot(container).render(<App />);
}
