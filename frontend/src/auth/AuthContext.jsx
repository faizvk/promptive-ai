/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  fetchCurrentUser,
  login as apiLogin,
  logout as apiLogout,
  signup as apiSignup,
} from "../api/auth.api";
import { tokenStore } from "../api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | authenticated | unauthenticated

  const refresh = useCallback(async () => {
    try {
      const { user: me } = await fetchCurrentUser();
      setUser(me);
      setStatus("authenticated");
      return me;
    } catch {
      tokenStore.clear();
      setUser(null);
      setStatus("unauthenticated");
      return null;
    }
  }, []);

  // Bootstrap on mount. Skip the /auth/me round-trip when there's clearly no
  // session — the api interceptor would just 401 and the refresh interceptor
  // would short-circuit anyway. This avoids the flash of a network error and
  // keeps the initial paint quick for unauthenticated visitors.
  useEffect(() => {
    if (!tokenStore.getAccess() && !tokenStore.getRefresh()) {
      setStatus("unauthenticated");
      return;
    }
    refresh();
  }, [refresh]);

  const login = useCallback(async (credentials) => {
    const res = await apiLogin(credentials);
    if (res?.accessToken) {
      tokenStore.set({
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
      });
    }
    if (res?.user) {
      setUser(res.user);
      setStatus("authenticated");
    }
    return res;
  }, []);

  const signup = useCallback(async (payload) => {
    const res = await apiSignup(payload);
    if (res?.accessToken) {
      tokenStore.set({
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
      });
    }
    if (res?.user) {
      setUser(res.user);
      setStatus("authenticated");
    }
    return res;
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } finally {
      tokenStore.clear();
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      status,
      isAuthenticated: status === "authenticated",
      isLoading: status === "loading",
      login,
      signup,
      logout,
      refresh,
    }),
    [user, status, login, signup, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
