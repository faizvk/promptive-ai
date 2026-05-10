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
  formMain,
  formContainer,
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
    <div className={formMain}>
      <div className={formContainer}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className={formEl}>
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-brand-primary"
          >
            <ArrowLeft size={14} /> Back to sign in
          </Link>

          <div className="mb-2">
            <span className="inline-block text-[0.7rem] font-bold tracking-[0.18em] uppercase text-brand-primary/70 mb-2">
              Account recovery
            </span>
            <h1 className="text-2xl font-extrabold tracking-[-0.02em] m-0 mb-2 text-text-primary">
              Forgot your password?
            </h1>
            <p className="text-sm text-text-secondary">
              Enter your email and we'll send you a link to set a new password.
            </p>
          </div>

          {submitted ? (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-bg-soft border border-border-soft">
              <CheckCircle2
                size={18}
                className="text-brand-primary mt-0.5 shrink-0"
              />
              <p className="text-sm text-text-secondary leading-relaxed">
                If an account exists for that email, a password reset link has
                been sent. Check your inbox (and spam folder).
              </p>
            </div>
          ) : (
            <>
              {errors.root?.message && (
                <div className={errorBanner}>{errors.root.message}</div>
              )}

              <div className={inputGroup}>
                <label className={labelEl}>Email Address</label>
                <div className={inputWrapper}>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={`${inputBase} ${errors.email ? inputErrorClass : ""}`}
                    {...register("email")}
                  />
                  <Mail size={18} className={inputIcon} />
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
