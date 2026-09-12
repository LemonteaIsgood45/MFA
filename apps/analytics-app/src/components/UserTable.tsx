import type { AdminUser } from "@/types/user";

interface UserTableProps {
  users: AdminUser[];
  onToggleBan: (user: AdminUser) => void;
  onResetPassword: (user: AdminUser) => void;
  busyUserId: string | null;
}

export default function UserTable({
  users,
  onToggleBan,
  onResetPassword,
  busyUserId,
}: UserTableProps) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-200 text-left text-gray-500 dark:border-slate-700 dark:text-slate-400">
          <th className="py-2">Người dùng</th>
          <th className="py-2">Vai trò</th>
          <th className="py-2">Hoạt động</th>
          <th className="py-2">Trạng thái</th>
          <th className="py-2" />
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr
            key={user.id}
            className="border-b border-gray-100 dark:border-slate-800"
          >
            <td className="py-2.5">
              <div className="font-medium">{user.name}</div>
              <div className="text-xs text-gray-400">{user.email}</div>
            </td>
            <td className="py-2.5">{user.role}</td>
            <td className="py-2.5">
              <span
                className={`inline-flex items-center gap-1.5 text-xs ${user.isActive ? "text-green-600" : "text-gray-400"}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${user.isActive ? "bg-green-500" : "bg-gray-300"}`}
                />
                {user.isActive ? "Đang hoạt động" : "Không hoạt động"}
              </span>
            </td>
            <td className="py-2.5">
              {user.isBanned ? (
                <span className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-700 dark:bg-red-500/10 dark:text-red-400">
                  Đã khóa
                </span>
              ) : (
                <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:bg-green-500/10 dark:text-green-400">
                  Bình thường
                </span>
              )}
            </td>
            <td className="py-2.5">
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={busyUserId === user.id}
                  onClick={() => onToggleBan(user)}
                  className="rounded-md border border-gray-300 px-2.5 py-1 text-xs hover:bg-gray-100 disabled:opacity-50 dark:border-slate-600 dark:hover:bg-slate-700"
                >
                  {user.isBanned ? "Mở khóa" : "Khóa"}
                </button>
                <button
                  type="button"
                  disabled={busyUserId === user.id}
                  onClick={() => onResetPassword(user)}
                  className="rounded-md border border-gray-300 px-2.5 py-1 text-xs hover:bg-gray-100 disabled:opacity-50 dark:border-slate-600 dark:hover:bg-slate-700"
                >
                  Đặt lại mật khẩu
                </button>
              </div>
            </td>
          </tr>
        ))}
        {users.length === 0 && (
          <tr>
            <td colSpan={5} className="py-6 text-center text-gray-400">
              Không tìm thấy người dùng.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
