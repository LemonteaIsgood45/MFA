import { create } from "zustand";
import type { AuthToken, ThemeMode, User } from "@mfa/shared-types";

/**
 * This store is published as a Module Federation "shared" singleton
 * (see the `shared` block in each app's webpack/vite federation config).
 * Because Module Federation loads every remote into the SAME browser
 * JS realm as the host at runtime, all three apps end up importing the
 * exact same module instance -> the exact same Zustand store instance.
 * That is what makes token/theme/user state stay in sync between
 * Host, Service App and Analytics App without any prop drilling.
 */
interface GlobalState {
  user: User | null;
  auth: AuthToken | null;
  theme: ThemeMode;
  setUser: (user: User | null) => void;
  setAuth: (auth: AuthToken | null) => void;
  setTheme: (theme: ThemeMode) => void;
  logout: () => void;
}

export const useGlobalStore = create<GlobalState>((set) => ({
  user: null,
  auth: null,
  theme: "light",
  setUser: (user) => set({ user }),
  setAuth: (auth) => set({ auth }),
  setTheme: (theme) => set({ theme }),
  logout: () => set({ user: null, auth: null }),
}));

// Convenience selector hooks
export const useAuthToken = () => useGlobalStore((s) => s.auth?.token ?? null);
export const useCurrentUser = () => useGlobalStore((s) => s.user);
export const useTheme = () => useGlobalStore((s) => s.theme);
