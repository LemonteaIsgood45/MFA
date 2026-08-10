import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const links = [
  { href: "/", label: "Trang chủ" },
  { href: "/services", label: "Quản lý dịch vụ" },
  { href: "/analytics", label: "Thống kê" },
];

export default function Sidebar() {
  const router = useRouter();

  return (
    <nav className="flex w-56 flex-col gap-2 border-r border-gray-200 p-4 dark:border-slate-700">
      {links.map((link) => {
        const active = router.pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-md px-3 py-2 no-underline ${
              active
                ? "bg-indigo-50 font-semibold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                : "text-gray-700 dark:text-slate-300"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
