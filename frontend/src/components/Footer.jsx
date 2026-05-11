import React from "react";
import { Link } from "react-router-dom";
import { Github } from "lucide-react";

const colHeading =
  "text-[0.65rem] font-bold uppercase mb-3 text-white/50 tracking-[0.18em]";

const colLink =
  "block text-[0.875rem] text-white/70 no-underline mb-2 transition-colors hover:text-white";

const Footer = () => {
  return (
    <footer className="relative w-full bg-brand-primary text-white px-5 pt-14 pb-7 md:px-8 md:pt-16 md:pb-8 z-[109]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />

      <div className="relative max-w-[1200px] mx-auto grid gap-10 md:gap-12 md:grid-cols-[2fr_1fr_1fr]">
        <div className="text-center md:text-left">
          <h2 className="text-[1.4rem] md:text-2xl font-extrabold tracking-[-0.02em]">
            Promptive
            <span className="text-btn-secondary">AI</span>
          </h2>
          <p className="mt-2.5 text-[0.875rem] text-white/65 max-w-[340px] mx-auto md:mx-0 leading-relaxed">
            One workspace for chat, images, content, and voice — powered by the
            best AI models in 2026.
          </p>

          <a
            href="https://github.com/faizvk/promptive-ai"
            aria-label="GitHub repository"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.06] border border-white/10 text-white/75 hover:bg-white/12 hover:text-white transition-[transform,background-color,color] duration-200 hover:-translate-y-0.5 mt-5"
          >
            <Github size={15} />
          </a>
        </div>

        <div>
          <h4 className={colHeading}>Product</h4>
          <Link to="/image-generate" className={colLink}>
            Image Generation
          </Link>
          <Link to="/content-rewrite" className={colLink}>
            Content Rewrite
          </Link>
          <Link to="/pricing" className={colLink}>
            Pricing
          </Link>
          <Link to="/dashboard" className={colLink}>
            Dashboard
          </Link>
        </div>

        <div>
          <h4 className={colHeading}>Account</h4>
          <Link to="/login" className={colLink}>
            Sign in
          </Link>
          <Link to="/signup" className={colLink}>
            Create account
          </Link>
          <a
            href="https://github.com/faizvk/promptive-ai"
            target="_blank"
            rel="noreferrer"
            className={colLink}
          >
            Source on GitHub
          </a>
        </div>
      </div>

      <div className="relative max-w-[1200px] mx-auto mt-10 pt-5 border-t border-white/10 text-center">
        <p className="text-[0.8rem] text-white/50">
          © {new Date().getFullYear()} Promptive AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
