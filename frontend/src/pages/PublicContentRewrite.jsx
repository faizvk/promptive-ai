import React from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  RefreshCcw,
  Sliders,
  Shield,
  ArrowRight,
} from "lucide-react";
import { fadeIn } from "../animations/FadeIn";

const primaryBtn =
  "bg-btn-primary text-white px-7 py-3.5 rounded-[10px] no-underline font-semibold inline-flex items-center gap-2 hover:opacity-90";

const secondaryBtn =
  "border border-white/40 text-white px-7 py-3.5 rounded-[10px] no-underline hover:opacity-90";

const stepCard =
  "p-6 md:p-8 rounded-2xl bg-bg-surface shadow-card";

const exampleCard =
  "p-6 md:p-8 rounded-[14px] bg-white border border-border-soft text-left";

const PublicContentRewrite = () => {
  return (
    <main className="w-full overflow-x-hidden">
      {/* ================= HERO ================= */}
      <section className="bg-gradient-to-b from-brand-primary to-[#071a33] text-white px-5 py-16 md:px-8 md:py-24 text-center">
        <div className="max-w-[900px] mx-auto">
          <span className="inline-block px-3 py-1.5 rounded-full bg-white/10 text-xs mb-4">
            AI Content Rewrite
          </span>
          <div
            {...fadeIn({
              direction: "up",
              distance: 80,
              duration: 0.9,
            })}
          >
            <h1 className="text-3xl sm:text-4xl md:text-[3rem] font-extrabold leading-tight">
              Rewrite content with <span>clarity & precision</span>
            </h1>
            <p className="mt-3 text-sm md:text-base">
              Improve tone, clarity, and structure of your content using
              advanced AI — without losing meaning.
            </p>
          </div>

          <div
            className="mt-6 md:mt-8 flex gap-3 md:gap-4 justify-center flex-wrap"
            {...fadeIn({
              direction: "left",
              distance: 80,
              duration: 0.9,
            })}
          >
            <Link to="/signup" className={primaryBtn}>
              Get Started Free <ArrowRight size={16} />
            </Link>
            <Link to="#demo" className={secondaryBtn}>
              Try Demo
            </Link>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section
        className="px-5 py-12 md:px-8 md:py-20 text-center"
        {...fadeIn({
          direction: "up",
          distance: 80,
          duration: 0.9,
        })}
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
          How content rewrite works
        </h2>

        <div
          className="mt-8 md:mt-12 grid gap-5 md:gap-8 md:grid-cols-3"
          {...fadeIn({
            direction: "right",
            distance: 80,
            duration: 0.9,
          })}
        >
          <div className={stepCard}>
            <FileText size={22} />
            <h4>Paste your text</h4>
            <p>Provide the content you want to improve or rewrite.</p>
          </div>

          <div className={stepCard}>
            <Sliders size={22} />
            <h4>Select a tone</h4>
            <p>Choose professional, formal, casual, or creative.</p>
          </div>

          <div className={stepCard}>
            <RefreshCcw size={22} />
            <h4>Rewrite instantly</h4>
            <p>Get a refined version while preserving meaning.</p>
          </div>
        </div>
      </section>

      {/* ================= EXAMPLES ================= */}
      <section
        className="bg-bg-soft px-5 py-12 md:px-8 md:py-20"
        {...fadeIn({
          direction: "left",
          distance: 80,
          duration: 0.9,
        })}
      >
        <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold">
          Before &amp; after examples
        </h2>

        <div className="max-w-[900px] mx-auto mt-6 md:mt-8 grid gap-5 md:gap-8 md:grid-cols-2">
          <div className={exampleCard}>
            <span className="text-xs font-bold text-text-muted uppercase">
              Before
            </span>
            <p>
              We provide tools that help teams make content faster and better.
            </p>
          </div>

          <div className={`${exampleCard} !border-btn-primary`}>
            <span className="text-xs font-bold text-text-muted uppercase">
              After
            </span>
            <p>
              Our platform empowers teams to create high-quality content faster
              with AI-driven tools.
            </p>
          </div>
        </div>
      </section>

      {/* ================= DEMO ================= */}
      <section
        id="demo"
        className="px-5 py-12 md:px-8 md:py-20 text-center"
        {...fadeIn({
          direction: "up",
          distance: 80,
          duration: 0.9,
        })}
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Try a demo</h2>
        <p className="text-sm md:text-base mt-2">
          See how rewriting works. Sign up to unlock full functionality.
        </p>

        <div className="max-w-[600px] mx-auto my-6 md:my-8 relative flex flex-col gap-4">
          <textarea
            placeholder="Paste your content here…"
            disabled
            className="p-3 rounded-[10px] border border-border-soft"
          />

          <select
            disabled
            className="p-3 rounded-[10px] border border-border-soft"
          >
            <option>Professional</option>
            <option>Formal</option>
            <option>Casual</option>
            <option>Creative</option>
          </select>

          <button
            disabled
            className="p-3 rounded-[10px] border-0 bg-brand-primary text-white opacity-50"
          >
            Rewrite Content
          </button>

          <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center gap-2 font-semibold">
            <Shield size={20} />
            <span>Sign up to unlock content rewrite</span>
          </div>
        </div>
      </section>

      {/* ================= USE CASES ================= */}
      <section
        className="px-5 py-12 md:px-8 md:py-20 text-center"
        {...fadeIn({
          direction: "right",
          distance: 80,
          duration: 0.9,
        })}
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
          Who is this for?
        </h2>

        <div className="mt-8 md:mt-12 grid gap-5 md:gap-8 md:grid-cols-3">
          <div>
            <h4>Content creators</h4>
            <p>Refine captions, blogs, and scripts effortlessly.</p>
          </div>
          <div>
            <h4>Marketing teams</h4>
            <p>Adapt messaging across channels and audiences.</p>
          </div>
          <div>
            <h4>Professionals</h4>
            <p>Polish emails, proposals, and documents.</p>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-brand-primary text-white px-5 py-12 md:px-8 md:py-20 text-center">
        <div
          {...fadeIn({
            direction: "up",
            distance: 80,
            duration: 0.9,
          })}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            Rewrite smarter with Promptive AI
          </h2>
          <p className="text-sm md:text-base mt-2 mb-6">
            No credit card required. Upgrade anytime.
          </p>
        </div>

        <Link to="/signup" className={primaryBtn}>
          Get Started for Free <ArrowRight size={16} />
        </Link>
      </section>
    </main>
  );
};

export default PublicContentRewrite;
