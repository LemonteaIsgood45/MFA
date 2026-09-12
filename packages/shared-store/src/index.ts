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

const SESSION_KEY = "mfa-auth-session";
type StoredSession = Pick<GlobalState, "user" | "auth">;

function saveSession(session: StoredSession): void {
  if (typeof window !== "undefined") window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export const useGlobalStore = create<GlobalState>((set) => ({
  user: null,
  auth: null,
  theme: "light",
  setUser: (user) => {
    set({ user });
    saveSession({ user, auth: useGlobalStore.getState().auth });
  },
  setAuth: (auth) => {
    set({ auth });
    saveSession({ user: useGlobalStore.getState().user, auth });
  },
  setTheme: (theme) => set({ theme }),
  logout: () => {
    set({ user: null, auth: null });
    if (typeof window !== "undefined") window.sessionStorage.removeItem(SESSION_KEY);
  },
}));

/** Hydrates the federation-wide store once in the host browser session. */
export function hydrateSession(): void {
  if (typeof window === "undefined") return;
  const raw = window.sessionStorage.getItem(SESSION_KEY);
  if (!raw) return;
  try {
    const session = JSON.parse(raw) as StoredSession;
    if (session.auth && session.auth.expiresAt > Date.now() && session.user) useGlobalStore.setState(session);
    else window.sessionStorage.removeItem(SESSION_KEY);
  } catch {
    window.sessionStorage.removeItem(SESSION_KEY);
  }
}

// Convenience selector hooks
export const useAuthToken = () => useGlobalStore((s) => s.auth?.token ?? null);
export const useCurrentUser = () => useGlobalStore((s) => s.user);
export const useTheme = () => useGlobalStore((s) => s.theme);
