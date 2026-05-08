import React from "react";
import { Link } from "react-router-dom";
import { Twitter, Github, Linkedin, Youtube } from "lucide-react";

const colHeading =
  "text-[0.8rem] font-bold uppercase mb-4 text-[#e5e7eb] tracking-[0.08em]";

const colLink =
  "block text-[0.9rem] text-[#cbd5e1] no-underline mb-2.5 hover:text-white";

const socialLink =
  "w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white transition-[background,transform] duration-200 hover:-translate-y-0.5";

const legalLink = "text-[0.85rem] text-[#cbd5e1] no-underline hover:text-white";

const Footer = () => {
  return (
    <footer className="w-full bg-brand-primary text-white px-5 pt-12 pb-8 md:px-8 md:pt-16 z-[109]">
      <div className="max-w-[1400px] mx-auto grid gap-8 md:gap-12 md:grid-cols-[2fr_repeat(3,1fr)]">
        <div className="flex flex-col justify-center items-center text-center md:text-left md:items-start">
          <h2 className="text-2xl md:text-[1.75rem] font-black">
            Promptive<span>AI</span>
          </h2>
          <p className="mt-3 text-sm md:text-[0.95rem] text-[#cbd5e1] max-w-[360px]">
            Build faster with AI-powered tools for image generation and content
            creation.
          </p>
        </div>

        <div>
          <h4 className={colHeading}>Product</h4>
          <Link to="/image-generate" className={colLink}>
            Image Generation
          </Link>
          <Link to="/content-rewrite" className={colLink}>
            Content Rewrite
          </Link>
          <Link to="/history" className={colLink}>
            History
          </Link>
        </div>

        <div>
          <h4 className={colHeading}>Company</h4>
          <a href="#" className={colLink}>
            About
          </a>
          <a href="#" className={colLink}>
            Careers
          </a>
          <a href="#" className={colLink}>
            Contact
          </a>
        </div>

        <div>
          <h4 className={colHeading}>Resources</h4>
          <a href="#" className={colLink}>
            Documentation
          </a>
          <a href="#" className={colLink}>
            Blog
          </a>
          <a href="#" className={colLink}>
            Support
          </a>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto mt-8 md:mt-12 pt-6 border-t border-white/10 flex flex-col gap-4 items-center text-center md:flex-row md:justify-between">
        <div className="flex gap-3 mt-5 md:mt-0">
          <a href="#" aria-label="Twitter" className={socialLink}>
            <Twitter size={18} />
          </a>
          <a href="#" aria-label="GitHub" className={socialLink}>
            <Github size={18} />
          </a>
          <a href="#" aria-label="LinkedIn" className={socialLink}>
            <Linkedin size={18} />
          </a>
          <a href="#" aria-label="YouTube" className={socialLink}>
            <Youtube size={18} />
          </a>
        </div>
        <p className="text-[0.85rem] text-[#cbd5e1]">
          © {new Date().getFullYear()} Promptive AI. All rights reserved.
        </p>

        <div className="flex gap-6">
          <a href="#" className={legalLink}>
            Privacy Policy
          </a>
          <a href="#" className={legalLink}>
            Terms
          </a>
          <a href="#" className={legalLink}>
            Security
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
