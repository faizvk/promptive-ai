import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "../utils/signUpSchema";
import { User, Mail, Lock, ArrowRight, Chrome } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
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

const SignUp = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [turnstileToken, setTurnstileToken] = useState(null);

  const handleToken = useCallback((token) => setTurnstileToken(token), []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({ resolver: zodResolver(signUpSchema) });

  const onSubmit = async (data) => {
    if (isTurnstileConfigured() && !turnstileToken) {
      setError("root", { message: "Please complete the captcha." });
      return;
    }
    try {
      const payload = {
        name: data.fullName,
        email: data.email,
        password: data.password,
        ...(turnstileToken ? { turnstileToken } : {}),
      };
      await signup(payload);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      let message;
      if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.code === "ERR_NETWORK" || !err.response) {
        message = "Could not reach the server. Please try again.";
      } else {
        message = "Sign-up failed. Please try again.";
      }
      setError("root", { message });
    }
  };

  const handleGoogleSignup = () => {
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
          <h1 className={authTitle}>Create your account</h1>
          <p className={authSubtitle}>
            Get started for free — no credit card required.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className={formEl}>
          {errors.root?.message && (
            <div className={errorBanner}>{errors.root.message}</div>
          )}

          <button
            type="button"
            className={googleBtn}
            onClick={handleGoogleSignup}
            disabled={isSubmitting}
          >
            <Chrome size={16} />
            Continue with Google
          </button>

          <div className={divider}>
            <span className={dividerText}>or</span>
          </div>

          <div className={inputGroup}>
            <label className={labelEl}>Full name</label>
            <div className={inputWrapper}>
              <input
                type="text"
                placeholder="Ada Lovelace"
                className={`${inputBase} ${errors.fullName ? inputErrorClass : ""}`}
                {...register("fullName")}
              />
              <User size={16} className={inputIcon} />
            </div>
            {errors.fullName?.message && (
              <span className={errorText}>{errors.fullName.message}</span>
            )}
          </div>

          <div className={inputGroup}>
            <label className={labelEl}>Email</label>
            <div className={inputWrapper}>
              <input
                type="email"
                placeholder="you@example.com"
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
            <label className={labelEl}>Password</label>
            <div className={inputWrapper}>
              <input
                type="password"
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

          <TurnstileWidget onToken={handleToken} />

          <button type="submit" className={submitBtn} disabled={isSubmitting}>
            {isSubmitting ? "Creating account…" : "Create account"}
            {!isSubmitting && <ArrowRight size={15} />}
          </button>

          <p className={footerText}>
            Already have an account?{" "}
            <Link to="/login" className={footerLink}>
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
