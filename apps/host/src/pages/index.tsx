import Layout from "@/components/Layout";
import Link from "next/link";
import { useCurrentUser } from "@mfa/shared-store";

export default function HomePage() {
  const user = useCurrentUser();
  return (
    <Layout>
      <h1 className="text-2xl font-semibold">Xin chào, {user?.name} 👋</h1>
      <p className="mt-2 text-gray-600 dark:text-slate-400">
        Chọn <strong>Quản lý dịch vụ</strong> hoặc <strong>Thống kê</strong> ở
        thanh bên.
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/services" className="rounded-md bg-primary px-4 py-2 text-white no-underline hover:bg-primary-hover">Mua sắm</Link>
        <Link href="/analytics" className="rounded-md border border-border px-4 py-2 text-text-primary no-underline hover:bg-surface-hover">Mở thống kê</Link>
      </div>
    </Layout>
  );
}
