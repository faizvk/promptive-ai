import React from "react";
import { useForm } from "react-hook-form";
import { Mail, Lock, LogIn, Chrome } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { login } from "../api/auth.api";
import { fadeIn } from "../animations/FadeIn";
import "./styles/Form.css";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect back to intended page or dashboard
  const redirectTo = location.state?.from?.pathname || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm();

  /* ======================
     EMAIL / PASSWORD LOGIN
     ====================== */
  const onSubmit = async (data) => {
    try {
      await login({
        email: data.email,
        password: data.password,
      });

      navigate(redirectTo, { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message || "Invalid email or password";
      setError("root", { message });
    }
  };

  /* ======================
     GOOGLE LOGIN
     ====================== */
  const handleGoogleLogin = () => {
    window.location.href = "https://promptive-ai.onrender.com/auth/google";
  };

  return (
    <div className="form-main">
      {/* LEFT SECTION */}
      <div className="form-head">
        <div
          className="head-content"
          {...fadeIn({
            direction: "left",
            distance: 80,
            duration: 0.9,
          })}
        >
          <span className="badge">Welcome Back</span>
          <h1>Nice to see you again.</h1>
          <p>
            Log in to access your dashboard, manage your AI tools, and continue
            where you left off.
          </p>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div
        className="form-container"
        {...fadeIn({
          direction: "up",
          distance: 80,
          duration: 0.9,
        })}
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-header-mobile">
            <h2>Sign In</h2>
            <p>Enter your credentials to access your account</p>
          </div>

          {/* GLOBAL ERROR */}
          {errors.root?.message && (
            <div className="error-banner">{errors.root.message}</div>
          )}

          {/* GOOGLE LOGIN */}
          <button
            type="button"
            className="google-btn"
            onClick={handleGoogleLogin}
          >
            <Chrome size={18} />
            Continue with Google
          </button>

          <div className="divider">
            <span>or</span>
          </div>

          {/* EMAIL */}
          <div className="input-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                placeholder="name@company.com"
                autoComplete="email"
                className={errors.email ? "input-error" : ""}
                {...register("email", {
                  required: "Email is required",
                })}
              />
            </div>
            {errors.email?.message && (
              <span className="error-text">{errors.email.message}</span>
            )}
          </div>

          {/* PASSWORD */}
          <div className="input-group">
            <div className="label-row">
              <label>Password</label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot?
              </Link>
            </div>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className={errors.password ? "input-error" : ""}
                {...register("password", {
                  required: "Password is required",
                })}
              />
            </div>
            {errors.password?.message && (
              <span className="error-text">{errors.password.message}</span>
            )}
          </div>

          {/* SUBMIT */}
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign In"}
            {!isSubmitting && <LogIn size={18} />}
          </button>

          <p className="footer-text">
            Don’t have an account? <Link to="/signup">Create one</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
