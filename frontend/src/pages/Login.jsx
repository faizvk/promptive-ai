import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, LogIn, Chrome } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { loginSchema } from "../utils/loginSchema";
import { fadeIn } from "../animations/FadeIn";
import {
  formMain,
  formHead,
  headContent,
  badge,
  badgeDot,
  headH1,
  headP,
  formContainer,
  formHeaderMobile,
  formHeaderMobileEyebrow,
  formHeaderMobileH2,
  formHeaderMobileP,
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

  const redirectTo = location.state?.from?.pathname || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      await login({
        email: data.email,
        password: data.password,
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
    window.location.href = "https://promptive-ai.onrender.com/auth/google";
  };

  return (
    <div className={formMain}>
      <div className={formHead}>
        {/* Background decoration */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_at_top_left,black_30%,transparent_70%)]"
        />

        <div
          className={headContent}
          {...fadeIn({
            direction: "left",
            distance: 80,
            duration: 0.9,
          })}
        >
          <span className={badge}>
            <span className={badgeDot} />
            Welcome Back
          </span>
          <h1 className={headH1}>Nice to see you again.</h1>
          <p className={headP}>
            Log in to access your dashboard, manage your AI tools, and continue
            where you left off.
          </p>
        </div>
      </div>

      <div
        className={formContainer}
        {...fadeIn({
          direction: "up",
          distance: 80,
          duration: 0.9,
        })}
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate className={formEl}>
          <div className={formHeaderMobile}>
            <span className={formHeaderMobileEyebrow}>Welcome Back</span>
            <h2 className={formHeaderMobileH2}>Sign In</h2>
            <p className={formHeaderMobileP}>
              Enter your credentials to access your account
            </p>
          </div>

          {errors.root?.message && (
            <div className={errorBanner}>{errors.root.message}</div>
          )}

          <button
            type="button"
            className={googleBtn}
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
          >
            <Chrome size={18} />
            Continue with Google
          </button>

          <div className={divider}>
            <span className={dividerText}>or</span>
          </div>

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
              <Lock size={18} className={inputIcon} />
            </div>
            {errors.password?.message && (
              <span className={errorText}>{errors.password.message}</span>
            )}
          </div>

          <button type="submit" className={submitBtn} disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign In"}
            {!isSubmitting && <LogIn size={18} />}
          </button>

          <p className={footerText}>
            Don’t have an account?{" "}
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
