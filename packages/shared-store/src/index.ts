import { create, createStore } from "zustand";
import type { AuthToken, CartItem, ThemeMode, User } from "@mfa/shared-types";

interface GlobalState {
  user: User | null;
  auth: AuthToken | null;
  theme: ThemeMode;
  cart: CartItem[];
  setUser: (user: User | null) => void;
  setAuth: (auth: AuthToken | null) => void;
  setTheme: (theme: ThemeMode) => void;
  setCart: (items: CartItem[]) => void;
  upsertCartItem: (item: CartItem) => void;
  removeCartItemLocal: (id: string) => void;
  clearCart: () => void;
  logout: () => void;
}

const SESSION_KEY = "mfa-auth-session";
type StoredSession = Pick<GlobalState, "user" | "auth">;

function getInitialSession(): StoredSession {
  if (typeof window === "undefined") return { user: null, auth: null };
  const raw = window.localStorage.getItem(SESSION_KEY) ?? window.sessionStorage.getItem(SESSION_KEY);
  if (!raw) return { user: null, auth: null };
  try {
    const session = JSON.parse(raw) as StoredSession;
    if (session.auth && session.auth.expiresAt > Date.now() && session.user) {
      return session;
    }
    window.localStorage.removeItem(SESSION_KEY);
    window.sessionStorage.removeItem(SESSION_KEY);
  } catch {
    window.localStorage.removeItem(SESSION_KEY);
    window.sessionStorage.removeItem(SESSION_KEY);
  }
  return { user: null, auth: null };
}

function saveSession(session: StoredSession): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    window.sessionStorage.removeItem(SESSION_KEY);
  }
}

// 1. Force a single true singleton instance on the browser global window
const globalWin = typeof window !== "undefined" ? (window as any) : {};

const initialSession = getInitialSession();

const storeApi =
  globalWin.__MFA_SHARED_STORE__ ||
  (globalWin.__MFA_SHARED_STORE__ = createStore<GlobalState>((set, get) => ({
    user: initialSession.user,
    auth: initialSession.auth,
    theme: "light",
    cart: [],
    setUser: (user) => {
      set({ user });
      saveSession({ user, auth: get().auth });
    },
    setAuth: (auth) => {
      set({ auth });
      saveSession({ user: get().user, auth });
    },
    setTheme: (theme) => set({ theme }),
    setCart: (cart) => set({ cart }),
    upsertCartItem: (item) =>
      set((state) => {
        const exists = state.cart.some((c) => c.id === item.id);
        return {
          cart: exists
            ? state.cart.map((c) => (c.id === item.id ? item : c))
            : [...state.cart, item],
        };
      }),
    removeCartItemLocal: (id) =>
      set((state) => ({ cart: state.cart.filter((c) => c.id !== id) })),
    clearCart: () => set({ cart: [] }),
    logout: () => {
      set({ user: null, auth: null, cart: [] });
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(SESSION_KEY);
        window.sessionStorage.removeItem(SESSION_KEY);
      }
    },
  })));

// 2. Export useGlobalStore wrapper around the singleton store instance
export const useGlobalStore = <T>(selector: (state: GlobalState) => T): T =>
  create(storeApi)(selector);

// Expose state methods directly on function for imperative calls (e.g. useGlobalStore.getState())
useGlobalStore.getState = storeApi.getState;
useGlobalStore.setState = storeApi.setState;
useGlobalStore.subscribe = storeApi.subscribe;

/**
 * No longer triggers side-effects during render.
 * Rehydrates session synchronously before React renders to prevent hydration mismatch.
 */
export function hydrateSession(): void {
  const session = getInitialSession();
  if (session.auth || session.user) {
    storeApi.setState(session);
  }
}

// Convenience selector hooks
export const useAuthToken = () => useGlobalStore((s) => s.auth?.token ?? null);
export const useCurrentUser = () => useGlobalStore((s) => s.user);
export const useTheme = () => useGlobalStore((s) => s.theme);
export const useCart = () => useGlobalStore((s) => s.cart);
export const useCartCount = () =>
  useGlobalStore((s) => s.cart.reduce((sum, item) => sum + item.quantity, 0));
