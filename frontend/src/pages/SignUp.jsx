import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "../utils/signUpSchema";
import { User, Mail, Lock, ArrowRight, Chrome } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../api/auth.api";
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
      navigate("/login");
    } catch (err) {
      const message =
        err.response?.data?.message || "Signup failed. Please try again.";
      setError("root", { message });
    }
  };

  const handleGoogleSignup = () => {
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
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 -right-20 w-[400px] h-[400px] bg-btn-primary/15 rounded-full blur-[100px]"
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
            Platform Access
          </span>
          <h1 className={headH1}>Start your journey with us.</h1>
          <p className={headP}>
            Experience the most advanced workspace management tool.
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
            <span className={formHeaderMobileEyebrow}>Get Started</span>
            <h2 className={formHeaderMobileH2}>Create Account</h2>
            <p className={formHeaderMobileP}>
              Enter your details to get started
            </p>
          </div>

          {errors.root?.message && (
            <div className={errorBanner}>{errors.root.message}</div>
          )}

          <button
            type="button"
            className={googleBtn}
            onClick={handleGoogleSignup}
          >
            <Chrome size={18} />
            Continue with Google
          </button>

          <div className={divider}>
            <span className={dividerText}>or</span>
          </div>

          <div className={inputGroup}>
            <label className={labelEl}>Full Name</label>
            <div className={inputWrapper}>
              <input
                type="text"
                placeholder="Name"
                className={`${inputBase} ${errors.fullName ? inputErrorClass : ""}`}
                {...register("fullName")}
              />
              <User size={18} className={inputIcon} />
            </div>
            {errors.fullName?.message && (
              <span className={errorText}>{errors.fullName.message}</span>
            )}
          </div>

          <div className={inputGroup}>
            <label className={labelEl}>Email Address</label>
            <div className={inputWrapper}>
              <input
                type="email"
                placeholder="email"
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
            <label className={labelEl}>Password</label>
            <div className={inputWrapper}>
              <input
                type="password"
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
            {isSubmitting ? "Creating..." : "Get Started"}
            {!isSubmitting && <ArrowRight size={18} />}
          </button>

          <p className={footerText}>
            Already have an account?{" "}
            <Link to="/login" className={footerLink}>
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
