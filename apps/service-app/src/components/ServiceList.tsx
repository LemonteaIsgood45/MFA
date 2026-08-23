import { useState } from "react";
import ProductListPage from "./ProductListPage";
import ProductDetailPage from "./ProductDetailPage";
import type { RemoteModuleProps } from "@mfa/shared-types";
// Imported here (not just in main.tsx) so the CSS ships as part of this
// exposed module's own chunk — main.tsx is only the standalone entry and
// isn't loaded at all when the host consumes ServiceList via Module
// Federation, so this is what makes Tailwind classes actually work there too.
import "../index.css";

type View = { name: "list" } | { name: "detail"; productId: string };

/**
 * Top-level component exposed as "serviceApp/ServiceList". Owns its own
 * internal list/detail navigation via component state rather than a URL
 * router — this avoids a federated remote fighting the host's own routing
 * (Next.js router) or needing react-router shared as another singleton
 * across the federation boundary. When run standalone, it behaves the
 * same way; there's just no separate app shell around it.
 */
export default function ServiceList(props: RemoteModuleProps) {
  const [view, setView] = useState<View>({ name: "list" });
  const isDark = props.theme === "dark";

  return (
    <div className={isDark ? "dark" : undefined}>
      <div className="min-h-screen bg-white text-gray-900 dark:bg-slate-900 dark:text-slate-100">
        {view.name === "list" ? (
          <ProductListPage onSelectProduct={(productId) => setView({ name: "detail", productId })} />
        ) : (
          <ProductDetailPage productId={view.productId} onBack={() => setView({ name: "list" })} />
        )}
      </div>
    </div>
  );
}
