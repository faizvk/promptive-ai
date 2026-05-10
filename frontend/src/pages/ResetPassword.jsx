import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Lock, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { submitPasswordReset } from "../api/auth.api";
import {
  authShell,
  authCard,
  authHeader,
  authTitle,
  authSubtitle,
  authLogo,
  formEl,
  inputGroup,
  labelEl,
  inputWrapper,
  inputIcon,
  inputBase,
  inputErrorClass,
  errorText,
  errorBanner,
  submitBtn,
  footerText,
  footerLink,
} from "./formClasses";

const schema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long"),
});

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async ({ password }) => {
    try {
      await submitPasswordReset({ token, password });
      setDone(true);
      setTimeout(() => navigate("/login", { replace: true }), 1500);
    } catch (err) {
      const message =
        err.response?.data?.message || "Could not reset password";
      setError("root", { message });
    }
  };

  return (
    <div className={authShell}>
      <div className={authCard}>
        <div className={authHeader}>
          <Link to="/" className={authLogo}>
            Promptive<span className="text-brand-primary">AI</span>
          </Link>
          <h1 className={authTitle}>Set a new password</h1>
          <p className={authSubtitle}>
            Choose a new password to finish resetting your account.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className={formEl}>
          {!token && (
            <div className={errorBanner}>
              Reset link is missing a token. Open the link from your email.
            </div>
          )}

          {done ? (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-bg-soft border border-border-soft">
              <CheckCircle2
                size={16}
                className="text-brand-primary mt-0.5 shrink-0"
              />
              <p className="text-sm text-text-secondary leading-relaxed">
                Password updated. Redirecting you to sign in…
              </p>
            </div>
          ) : (
            <>
              {errors.root?.message && (
                <div className={errorBanner}>{errors.root.message}</div>
              )}

              <div className={inputGroup}>
                <label className={labelEl}>New password</label>
                <div className={inputWrapper}>
                  <input
                    type="password"
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    className={`${inputBase} ${errors.password ? inputErrorClass : ""}`}
                    {...register("password")}
                  />
                  <Lock size={16} className={inputIcon} />
                </div>
                {errors.password?.message && (
                  <span className={errorText}>{errors.password.message}</span>
                )}
              </div>

              <button
                type="submit"
                className={submitBtn}
                disabled={isSubmitting || !token}
              >
                {isSubmitting ? "Saving…" : "Update password"}
              </button>
            </>
          )}

          <p className={footerText}>
            Need a new link?{" "}
            <Link to="/forgot-password" className={footerLink}>
              Request reset email
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
