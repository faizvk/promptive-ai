import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { tokenStore } from "../api/api";
import { useAuth } from "../auth/AuthContext";

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const { refresh } = useAuth();

  useEffect(() => {
    // Tokens arrive in the URL fragment: #a=ACCESS&r=REFRESH
    const hash = window.location.hash.replace(/^#/, "");
    const params = new URLSearchParams(hash);
    const accessToken = params.get("a");
    const refreshToken = params.get("r");

    const goto = async (path) => {
      // Wipe the hash so tokens don't sit in history.
      history.replaceState(null, "", window.location.pathname);
      // Re-bootstrap auth state, then navigate.
      await refresh();
      navigate(path, { replace: true });
    };

    if (accessToken) {
      tokenStore.set({ accessToken, refreshToken });
      goto("/dashboard");
    } else {
      goto("/login?error=oauth_failed");
    }
  }, [navigate, refresh]);

  return (
    <div className="min-h-screen flex items-center justify-center text-text-muted text-sm">
      Signing you in…
    </div>
  );
};

export default OAuthSuccess;
