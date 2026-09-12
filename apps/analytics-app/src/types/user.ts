export type UserRole = "admin" | "staff" | "customer";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isBanned: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface UserStats {
  totalUsers: number;
  activeSessions: number;
}