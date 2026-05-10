import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Mail, X, CheckCircle2 } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { resendVerificationEmail } from "../api/auth.api";

const EmailVerifyBanner = () => {
  const { user, refresh } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [dismissed, setDismissed] = useState(
    sessionStorage.getItem("dismissed_verify_banner") === "1"
  );
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const justVerified = searchParams.get("verified") === "1";

  useEffect(() => {
    if (justVerified) {
      // Refresh user state so emailVerified updates from /auth/me.
      refresh();
      // Clear the param so the banner doesn't stick after a refresh.
      const next = new URLSearchParams(searchParams);
      next.delete("verified");
      setSearchParams(next, { replace: true });
    }
  }, [justVerified, refresh, searchParams, setSearchParams]);

  const handleResend = async () => {
    setSending(true);
    setError(null);
    try {
      await resendVerificationEmail();
      setSent(true);
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not send verification email"
      );
    } finally {
      setSending(false);
    }
  };

  const handleDismiss = () => {
    sessionStorage.setItem("dismissed_verify_banner", "1");
    setDismissed(true);
  };

  if (justVerified) {
    return (
      <div className="bg-bg-soft border-b border-border-soft px-4 md:px-8 py-3 flex items-center gap-3 text-sm text-text-secondary">
        <CheckCircle2 size={16} className="text-brand-primary shrink-0" />
        <span>Email verified — thanks!</span>
      </div>
    );
  }

  if (!user || user.emailVerified || dismissed) return null;

  return (
    <div className="bg-[#fffbe8] border-b border-[#f5e69a] px-4 md:px-8 py-3 flex items-center gap-3 text-sm text-[#5a4a00]">
      <Mail size={16} className="shrink-0" />
      <span className="flex-1 min-w-0">
        {sent
          ? "Verification email sent. Check your inbox."
          : "Please verify your email to keep your account secure."}
      </span>
      {!sent && (
        <button
          type="button"
          onClick={handleResend}
          disabled={sending}
          className="text-xs font-semibold text-brand-primary hover:underline disabled:opacity-60 whitespace-nowrap"
        >
          {sending ? "Sending…" : "Resend email"}
        </button>
      )}
      {error && <span className="text-xs text-text-error">{error}</span>}
      <button
        type="button"
        aria-label="Dismiss"
        onClick={handleDismiss}
        className="text-[#5a4a00]/60 hover:text-[#5a4a00]"
      >
        <X size={15} />
      </button>
    </div>
  );
};

export default EmailVerifyBanner;
