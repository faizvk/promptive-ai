import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, LogIn, Chrome } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { loginSchema } from "../utils/loginSchema";
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
  googleBtn,
  divider,
  dividerText,
} from "./formClasses";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [turnstileToken, setTurnstileToken] = useState(null);

  const redirectTo = location.state?.from?.pathname || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({ resolver: zodResolver(loginSchema) });

  const handleToken = useCallback((token) => setTurnstileToken(token), []);

  const onSubmit = async (data) => {
    if (isTurnstileConfigured() && !turnstileToken) {
      setError("root", { message: "Please complete the captcha." });
      return;
    }
    try {
      await login({
        email: data.email,
        password: data.password,
        ...(turnstileToken ? { turnstileToken } : {}),
      });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      let message;
      if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.code === "ERR_NETWORK" || !err.response) {
        message = "Could not reach the server. Please try again.";
      } else {
        message = "Sign-in failed. Please try again.";
      }
      setError("root", { message });
    }
  };

  const handleGoogleLogin = () => {
    const baseUrl =
      import.meta.env.VITE_API_BASE_URL ||
      "https://promptive-ai.onrender.com";
    window.location.href = `${baseUrl}/auth/google`;
  };

  return (
    <div className={authShell}>
      <div className={authCard}>
        <div className={authHeader}>
          <Link to="/" className={authLogo}>
            Promptive<span className="text-brand-primary">AI</span>
          </Link>
          <h1 className={authTitle}>Welcome back</h1>
          <p className={authSubtitle}>
            Sign in to your workspace to keep building.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className={formEl}>
          {errors.root?.message && (
            <div className={errorBanner}>{errors.root.message}</div>
          )}

          <button
            type="button"
            className={googleBtn}
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
          >
            <Chrome size={16} />
            Continue with Google
          </button>

          <div className={divider}>
            <span className={dividerText}>or</span>
          </div>

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

          <div className={inputGroup}>
            <div className="flex justify-between items-center">
              <label className={labelEl}>Password</label>
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-brand-primary no-underline hover:underline"
              >
                Forgot?
              </Link>
            </div>
            <div className={inputWrapper}>
              <input
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className={`${inputBase} ${errors.password ? inputErrorClass : ""}`}
                {...register("password")}
              />
              <Lock size={16} className={inputIcon} />
            </div>
            {errors.password?.message && (
              <span className={errorText}>{errors.password.message}</span>
            )}
          </div>

          <TurnstileWidget onToken={handleToken} />

          <button type="submit" className={submitBtn} disabled={isSubmitting}>
            {isSubmitting ? "Signing in…" : "Sign in"}
            {!isSubmitting && <LogIn size={15} />}
          </button>

          <p className={footerText}>
            Don't have an account?{" "}
            <Link to="/signup" className={footerLink}>
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
