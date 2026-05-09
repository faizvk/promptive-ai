import React from "react";
import { Link } from "react-router-dom";
import { Github } from "lucide-react";

const colHeading =
  "text-[0.7rem] sm:text-xs font-bold uppercase mb-4 text-white/60 tracking-[0.18em]";

const colLink =
  "block text-[0.9rem] text-white/75 no-underline mb-2.5 transition-colors hover:text-white";

const socialLink =
  "w-9 h-9 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-white/80 transition-colors duration-200 hover:bg-white/15 hover:border-white/25 hover:text-white";

const Footer = () => {
  return (
    <footer className="relative w-full bg-brand-primary text-white px-5 pt-14 pb-8 md:px-8 md:pt-20 md:pb-10 z-[109] overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]"
      />

      <div className="relative max-w-[1200px] mx-auto grid gap-10 md:gap-12 md:grid-cols-[2fr_1fr_1fr]">
        <div className="text-center md:text-left">
          <h2 className="text-2xl md:text-[1.75rem] font-extrabold tracking-[-0.02em]">
            Promptive
            <span className="bg-gradient-to-r from-btn-secondary to-[#fff5cf] bg-clip-text text-transparent">
              AI
            </span>
          </h2>
          <p className="mt-3 text-sm md:text-[0.95rem] text-white/70 max-w-[360px] mx-auto md:mx-0 leading-relaxed">
            Build faster with AI-powered tools for image generation and content
            creation.
          </p>

          <div className="flex justify-center md:justify-start gap-3 mt-6">
            <a
              href="https://github.com/faizvk/promptive-ai"
              aria-label="GitHub repository"
              target="_blank"
              rel="noreferrer"
              className={socialLink}
            >
              <Github size={16} />
            </a>
          </div>
        </div>

        <div>
          <h4 className={colHeading}>Product</h4>
          <Link to="/image-generate" className={colLink}>
            Image Generation
          </Link>
          <Link to="/content-rewrite" className={colLink}>
            Content Rewrite
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

      <div className="relative max-w-[1200px] mx-auto mt-10 md:mt-14 pt-6 border-t border-white/10 text-center">
        <p className="text-[0.85rem] text-white/60">
          © {new Date().getFullYear()} Promptive AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
