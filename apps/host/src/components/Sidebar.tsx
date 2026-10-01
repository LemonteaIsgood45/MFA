import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { canViewAnalytics } from "@mfa/shared-types";
import { useCurrentUser } from "@mfa/shared-store";

const links = [
  { href: "/", label: "Trang chủ" },
  { href: "/services", label: "Sản phẩm & dịch vụ" },
  { href: "/analytics", label: "Thống kê" },
];

export default function Sidebar() {
  const router = useRouter();
  const user = useCurrentUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const visibleLinks = links.filter(
    (link) => link.href !== "/analytics" || (mounted && canViewAnalytics(user)),
  );

  return (
    <nav className="flex w-56 shrink-0 flex-col gap-2 border-r border-border p-4">
      {visibleLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`rounded-md px-3 py-2 no-underline ${
            router.pathname === link.href
              ? "bg-indigo-50 font-semibold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
              : "text-gray-700 dark:text-slate-300"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
