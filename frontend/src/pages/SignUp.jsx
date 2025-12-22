import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "../utils/signUpSchema";
import { User, Mail, Lock, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../api/auth.api";
import { fadeIn } from "../animations/FadeIn";
import "./styles/Form.css";

const SignUp = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.fullName,
        email: data.email,
        password: data.password,
      };

      await signup(payload);

      // Redirect after successful signup
      navigate("/login");
    } catch (err) {
      const message =
        err.response?.data?.message || "Signup failed. Please try again.";

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
          <span className="badge">Platform Access</span>
          <h1>Start your journey with us.</h1>
          <p>
            Experience the most advanced workspace management tool. Join 10,000+
            teams worldwide.
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
            <h2>Create Account</h2>
            <p>Enter your details to get started</p>
          </div>

          {/* Global form error */}
          {errors.root?.message && (
            <div className="error-banner">{errors.root.message}</div>
          )}

          {/* Full Name */}
          <div className="input-group">
            <label>Full Name</label>
            <div className="input-wrapper">
              <User size={18} className="input-icon" />
              <input
                type="text"
                autoComplete="name"
                placeholder="John Doe"
                className={errors.fullName ? "input-error" : ""}
                {...register("fullName")}
              />
            </div>
            {errors.fullName?.message && (
              <span className="error-text">{errors.fullName.message}</span>
            )}
          </div>

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
                {...register("email")}
              />
            </div>
            {errors.email?.message && (
              <span className="error-text">{errors.email.message}</span>
            )}
          </div>

          {/* Password */}
          <div className="input-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                className={errors.password ? "input-error" : ""}
                {...register("password")}
              />
            </div>
            {errors.password?.message && (
              <span className="error-text">{errors.password.message}</span>
            )}
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Get Started"}
            {!isSubmitting && <ArrowRight size={18} />}
          </button>

          <p className="footer-text">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
