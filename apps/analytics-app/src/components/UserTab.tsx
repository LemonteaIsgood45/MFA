import { useEffect, useState } from "react";
import StatCard from "./StatCard";
import UserTable from "./UserTable";
import { apiFetch } from "@/lib/api";
import type { AdminUser, UserStats } from "@/types/user";

interface UsersTabProps {
  token: string | null | undefined;
}

export default function UsersTab({ token }: UsersTabProps) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busyUserId, setBusyUserId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    apiFetch<UserStats>("/api/users/stats", token)
      .then(setStats)
      .catch((e) => setError(e.message));
  }, [token]);

  useEffect(() => {
    if (!token) return;
    const query = search.trim()
      ? `?search=${encodeURIComponent(search.trim())}`
      : "";
    apiFetch<AdminUser[]>(`/api/users${query}`, token)
      .then(setUsers)
      .catch((e) => setError(e.message));
  }, [token, search]);

  async function handleToggleBan(user: AdminUser) {
    setBusyUserId(user.id);
    setNotice(null);
    try {
      await apiFetch(`/api/users/${user.id}/ban`, token, {
        method: "PATCH",
        body: JSON.stringify({ isBanned: !user.isBanned }),
      });
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, isBanned: !u.isBanned } : u,
        ),
      );
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Lỗi khi cập nhật.");
    } finally {
      setBusyUserId(null);
    }
  }

  async function handleResetPassword(user: AdminUser) {
    setBusyUserId(user.id);
    setNotice(null);
    try {
      const result = await apiFetch<{ temporaryPassword: string }>(
        `/api/users/${user.id}/reset-password`,
        token,
        { method: "POST" },
      );
      setNotice(
        `Đã đặt lại mật khẩu cho ${user.email}. Mật khẩu tạm thời: ${result.temporaryPassword}`,
      );
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Lỗi khi đặt lại mật khẩu.");
    } finally {
      setBusyUserId(null);
    }
  }

  if (!token) {
    return <p>Vui lòng đăng nhập để xem người dùng.</p>;
  }

  if (error) {
    return <p className="text-red-600">Lỗi tải dữ liệu: {error}</p>;
  }

  return (
    <div>
      <div className="flex gap-4">
        <StatCard
          label="Tổng người dùng"
          value={stats ? stats.totalUsers.toLocaleString("vi-VN") : "…"}
        />
        <StatCard
          label="Đang trong phiên"
          value={stats ? stats.activeSessions.toLocaleString("vi-VN") : "…"}
          hint="Hoạt động trong 15 phút qua"
        />
      </div>

      <div className="mt-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo tên hoặc email..."
          className="w-72 rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-800"
        />
      </div>

      {notice && (
        <p className="mt-3 rounded-md bg-gray-50 px-3 py-2 text-sm dark:bg-slate-800">
          {notice}
        </p>
      )}

      <div className="mt-4 overflow-x-auto">
        <UserTable
          users={users}
          onToggleBan={handleToggleBan}
          onResetPassword={handleResetPassword}
          busyUserId={busyUserId}
        />
      </div>
    </div>
  );
}
