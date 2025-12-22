import React from "react";
import { useForm } from "react-hook-form";
import { Mail, Lock, LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/auth.api";
import { fadeIn } from "../animations/FadeIn";
import "./styles/Form.css";

const Login = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await login({
        email: data.email,
        password: data.password,
      });

      // Redirect after successful login
      console.log("success login");
    } catch (err) {
      const message =
        err.response?.data?.message || "Invalid email or password";

      setError("root", { message });
    }
  };

  return (
    <div className="form-main">
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
            Log in to access your projects, collaborate with your team, and pick
            up right where you left off.
          </p>
        </div>
      </div>

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

          {/* Global form error */}
          {errors.root?.message && (
            <div className="error-banner">{errors.root.message}</div>
          )}

          {/* Email */}
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

          {/* Password */}
          <div className="input-group">
            <div className="label-row">
              <label>Password</label>
              <a href="#" className="forgot-link">
                Forgot?
              </a>
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

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign In"}
            {!isSubmitting && <LogIn size={18} />}
          </button>

          <p className="footer-text">
            Don't have an account? <Link to="/">Create one</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
