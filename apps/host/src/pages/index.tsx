import React from "react";
import Link from "next/link";
import Layout from "@/components/Layout";
import { useCurrentUser } from "@mfa/shared-store";

export default function HomePage() {
  const user = useCurrentUser();
  return (
    <Layout>
      <h1 className="text-2xl font-semibold">
        {user ? `Xin chào, ${user.name} 👋` : "Chào mừng đến MFA Store"}
      </h1>
      <p className="mt-2 text-gray-600 dark:text-slate-400">
        {user
          ? "Bạn có thể mua sắm. Bảng Thống kê chỉ dành cho quản trị viên và điều hành viên."
          : "Bạn có thể duyệt danh mục ngay. Đăng nhập để thêm sản phẩm vào giỏ và mua hàng."}
      </p>
      {!user && (
        <Link
          href="/services"
          className="mt-5 inline-block rounded-md bg-indigo-600 px-4 py-2 text-white no-underline"
        >
          Duyệt sản phẩm
        </Link>
      )}
    </Layout>
  );
}
