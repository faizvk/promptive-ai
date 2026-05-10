import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { requestPasswordReset } from "../api/auth.api";
import TurnstileWidget, {
  isTurnstileConfigured,
} from "../components/TurnstileWidget";
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
  email: z.string().email("Please enter a valid email address"),
});

const ForgotPassword = () => {
  const [submitted, setSubmitted] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState(null);
  const handleToken = useCallback((token) => setTurnstileToken(token), []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async ({ email }) => {
    if (isTurnstileConfigured() && !turnstileToken) {
      setError("root", { message: "Please complete the captcha." });
      return;
    }
    try {
      await requestPasswordReset(email, turnstileToken);
      setSubmitted(true);
    } catch (err) {
      const message =
        err.response?.data?.message || "Could not send reset email";
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
          <h1 className={authTitle}>Reset your password</h1>
          <p className={authSubtitle}>
            Enter your email and we'll send you a link to set a new password.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className={formEl}>
          {submitted ? (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-bg-soft border border-border-soft">
              <CheckCircle2
                size={16}
                className="text-brand-primary mt-0.5 shrink-0"
              />
              <p className="text-sm text-text-secondary leading-relaxed">
                If an account exists for that email, a password reset link has
                been sent. Check your inbox and spam folder.
              </p>
            </div>
          ) : (
            <>
              {errors.root?.message && (
                <div className={errorBanner}>{errors.root.message}</div>
              )}

              <div className={inputGroup}>
                <label className={labelEl}>Email</label>
                <div className={inputWrapper}>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={`${inputBase} ${errors.email ? inputErrorClass : ""}`}
                    {...register("email")}
                  />
                  <Mail size={16} className={inputIcon} />
                </div>
                {errors.email?.message && (
                  <span className={errorText}>{errors.email.message}</span>
                )}
              </div>

              <TurnstileWidget onToken={handleToken} />

              <button
                type="submit"
                className={submitBtn}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending…" : "Send reset link"}
              </button>
            </>
          )}

          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary mt-1"
          >
            <ArrowLeft size={13} /> Back to sign in
          </Link>

          <p className={footerText}>
            Remembered it?{" "}
            <Link to="/login" className={footerLink}>
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
