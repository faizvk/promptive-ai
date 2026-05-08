import React from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  RefreshCcw,
  Sliders,
  Shield,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { fadeIn } from "../animations/FadeIn";

const primaryBtn =
  "group bg-gradient-to-b from-btn-primary to-[#3b8de8] text-white px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl no-underline text-sm sm:text-base font-semibold inline-flex items-center gap-2 shadow-[0_4px_14px_rgba(79,156,249,0.35)] hover:shadow-[0_8px_24px_rgba(79,156,249,0.45)] hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-btn-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-primary";

const secondaryBtn =
  "border border-white/25 bg-white/5 backdrop-blur-sm text-white px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl no-underline text-sm sm:text-base font-semibold inline-flex items-center gap-2 hover:bg-white/10 hover:border-white/40 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40";

const eyebrow =
  "inline-block text-[0.7rem] sm:text-xs font-bold tracking-[0.18em] uppercase text-brand-primary/70 mb-3";

const sectionH2 =
  "text-2xl sm:text-3xl md:text-[2.5rem] font-extrabold tracking-[-0.02em] text-text-primary leading-tight";

const sectionLead =
  "mt-3 sm:mt-4 text-sm sm:text-base md:text-[1.05rem] text-text-secondary leading-relaxed max-w-2xl mx-auto";

const stepCard =
  "group relative p-6 sm:p-8 rounded-2xl bg-bg-surface border border-black/[0.06] transition-all duration-300 text-left hover:border-btn-primary/30 hover:-translate-y-1 hover:shadow-[0_24px_48px_-16px_rgba(4,56,115,0.18)]";

const stepIcon =
  "w-12 h-12 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-5 transition-colors duration-300 group-hover:bg-brand-primary group-hover:text-white";

const PublicContentRewrite = () => {
  return (
    <main className="w-full overflow-x-hidden">
      {/* ================= HERO ================= */}
      <section className="relative bg-gradient-to-b from-brand-primary via-[#062c5a] to-[#051a33] text-white px-5 py-20 sm:py-24 md:px-8 md:py-32 text-center overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[640px] max-w-[120%] h-[480px] bg-btn-primary/20 rounded-full blur-[120px]"
        />

        <div className="relative max-w-[900px] mx-auto">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 border border-white/15 rounded-full text-[0.7rem] sm:text-xs font-semibold tracking-[0.12em] mb-6 sm:mb-8 uppercase backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-btn-secondary" />
            AI Content Rewrite
          </span>
          <div
            {...fadeIn({
              direction: "up",
              distance: 80,
              duration: 0.9,
            })}
          >
            <h1 className="text-3xl sm:text-5xl md:text-[3.5rem] font-extrabold tracking-[-0.025em] leading-[1.1] mb-5 md:mb-6">
              Rewrite content with{" "}
              <span className="bg-gradient-to-r from-btn-secondary to-[#fff5cf] bg-clip-text text-transparent">
                clarity &amp; precision
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed">
              Improve tone, clarity, and structure of your content using
              advanced AI — without losing meaning.
            </p>
          </div>

          <div
            className="flex gap-3 md:gap-4 justify-center flex-wrap"
            {...fadeIn({
              direction: "left",
              distance: 80,
              duration: 0.9,
            })}
          >
            <Link to="/signup" className={primaryBtn}>
              Get Started Free
              <ArrowRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
            <a href="#demo" className={secondaryBtn}>
              Try Demo
            </a>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section
        className="bg-white px-5 py-16 md:px-6 md:py-24"
        {...fadeIn({
          direction: "up",
          distance: 80,
          duration: 0.9,
        })}
      >
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <span className={eyebrow}>How it works</span>
            <h2 className={sectionH2}>Three steps to better content</h2>
            <p className={sectionLead}>
              From rough draft to refined output — without leaving your flow.
            </p>
          </div>

          <div
            className="grid gap-5 md:gap-6 md:grid-cols-3"
            {...fadeIn({
              direction: "right",
              distance: 80,
              duration: 0.9,
            })}
          >
            <div className={stepCard}>
              <div className={stepIcon}>
                <FileText size={22} />
              </div>
              <h4 className="text-lg md:text-xl font-bold mb-2 text-text-primary">
                Paste your text
              </h4>
              <p className="text-[0.95rem] leading-relaxed text-text-secondary">
                Provide the content you want to improve or rewrite.
              </p>
            </div>

            <div className={stepCard}>
              <div className={stepIcon}>
                <Sliders size={22} />
              </div>
              <h4 className="text-lg md:text-xl font-bold mb-2 text-text-primary">
                Select a tone
              </h4>
              <p className="text-[0.95rem] leading-relaxed text-text-secondary">
                Choose professional, formal, casual, or creative.
              </p>
            </div>

            <div className={stepCard}>
              <div className={stepIcon}>
                <RefreshCcw size={22} />
              </div>
              <h4 className="text-lg md:text-xl font-bold mb-2 text-text-primary">
                Rewrite instantly
              </h4>
              <p className="text-[0.95rem] leading-relaxed text-text-secondary">
                Get a refined version while preserving meaning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= EXAMPLES ================= */}
      <section
        className="bg-bg-soft px-5 py-16 md:px-6 md:py-24 border-y border-black/5"
        {...fadeIn({
          direction: "left",
          distance: 80,
          duration: 0.9,
        })}
      >
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <span className={eyebrow}>Before &amp; after</span>
            <h2 className={sectionH2}>See the transformation</h2>
            <p className={sectionLead}>
              Same intent, sharper delivery. Promptive preserves meaning while
              refining tone, clarity, and structure.
            </p>
          </div>

          <div className="max-w-[900px] mx-auto grid gap-5 md:gap-6 md:grid-cols-2">
            <div className="p-6 md:p-8 rounded-2xl bg-white border border-border-soft text-left">
              <span className="inline-flex items-center gap-1.5 text-[0.7rem] font-bold text-text-muted uppercase tracking-[0.12em] mb-3">
                Before
              </span>
              <p className="text-[0.95rem] leading-relaxed text-text-secondary">
                We provide tools that help teams make content faster and better.
              </p>
            </div>

            <div className="relative p-6 md:p-8 rounded-2xl bg-white border-2 border-btn-primary/40 text-left shadow-[0_18px_36px_-14px_rgba(79,156,249,0.25)]">
              <span className="inline-flex items-center gap-1.5 text-[0.7rem] font-bold text-btn-primary uppercase tracking-[0.12em] mb-3">
                <Sparkles size={12} />
                After
              </span>
              <p className="text-[0.95rem] leading-relaxed text-text-primary font-medium">
                Our platform empowers teams to create high-quality content
                faster with AI-driven tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= DEMO ================= */}
      <section
        id="demo"
        className="bg-white px-5 py-16 md:px-6 md:py-24"
        {...fadeIn({
          direction: "up",
          distance: 80,
          duration: 0.9,
        })}
      >
        <div className="max-w-[700px] mx-auto">
          <div className="text-center mb-8 md:mb-10">
            <span className={eyebrow}>Try it</span>
            <h2 className={sectionH2}>Preview the workflow</h2>
            <p className={sectionLead}>
              See how rewriting works. Sign up to unlock full functionality.
            </p>
          </div>

          <div className="relative rounded-2xl border border-border-soft bg-bg-surface p-5 md:p-6 shadow-[0_24px_48px_-20px_rgba(4,56,115,0.15)]">
            <div className="flex flex-col gap-3 md:gap-4 [&>*]:opacity-50 [&>*]:pointer-events-none">
              <textarea
                placeholder="Paste your content here…"
                disabled
                rows={4}
                className="w-full p-4 rounded-xl border border-border-soft bg-bg-soft text-sm resize-none"
              />
              <select
                disabled
                className="p-3 rounded-xl border border-border-soft bg-bg-soft text-sm"
              >
                <option>Professional</option>
                <option>Formal</option>
                <option>Casual</option>
                <option>Creative</option>
              </select>
              <button
                disabled
                className="p-3 rounded-xl border-0 bg-brand-primary text-white text-sm font-semibold"
              >
                Rewrite Content
              </button>
            </div>

            <div className="absolute inset-0 rounded-2xl bg-white/85 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3 text-center p-6">
              <div className="w-12 h-12 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                <Shield size={20} />
              </div>
              <p className="font-semibold text-text-primary">
                Sign up to unlock content rewrite
              </p>
              <Link
                to="/signup"
                className="text-sm font-semibold text-brand-primary inline-flex items-center gap-1 hover:gap-2 transition-all"
              >
                Create your free account <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= USE CASES ================= */}
      <section
        className="bg-bg-soft px-5 py-16 md:px-6 md:py-24 border-t border-black/5"
        {...fadeIn({
          direction: "right",
          distance: 80,
          duration: 0.9,
        })}
      >
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <span className={eyebrow}>Who it's for</span>
            <h2 className={sectionH2}>Built for every kind of writer</h2>
          </div>

          <div className="grid gap-5 md:gap-6 md:grid-cols-3">
            <div className="p-6 md:p-8 rounded-2xl bg-white border border-border-soft text-left transition-all duration-300 hover:-translate-y-1 hover:border-brand-primary/20 hover:shadow-[0_18px_36px_-14px_rgba(4,56,115,0.12)]">
              <h4 className="text-lg font-bold mb-2 text-text-primary">
                Content creators
              </h4>
              <p className="text-[0.95rem] leading-relaxed text-text-secondary">
                Refine captions, blogs, and scripts effortlessly.
              </p>
            </div>
            <div className="p-6 md:p-8 rounded-2xl bg-white border border-border-soft text-left transition-all duration-300 hover:-translate-y-1 hover:border-brand-primary/20 hover:shadow-[0_18px_36px_-14px_rgba(4,56,115,0.12)]">
              <h4 className="text-lg font-bold mb-2 text-text-primary">
                Marketing teams
              </h4>
              <p className="text-[0.95rem] leading-relaxed text-text-secondary">
                Adapt messaging across channels and audiences.
              </p>
            </div>
            <div className="p-6 md:p-8 rounded-2xl bg-white border border-border-soft text-left transition-all duration-300 hover:-translate-y-1 hover:border-brand-primary/20 hover:shadow-[0_18px_36px_-14px_rgba(4,56,115,0.12)]">
              <h4 className="text-lg font-bold mb-2 text-text-primary">
                Professionals
              </h4>
              <p className="text-[0.95rem] leading-relaxed text-text-secondary">
                Polish emails, proposals, and documents.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="relative bg-gradient-to-br from-brand-primary via-[#062c5a] to-[#051a33] text-white px-5 py-20 md:px-6 md:py-28 text-center overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] max-w-[120%] h-[400px] bg-btn-primary/15 rounded-full blur-[100px]"
        />

        <div
          className="relative max-w-[800px] mx-auto"
          {...fadeIn({
            direction: "up",
            distance: 80,
            duration: 0.9,
          })}
        >
          <h2 className="text-3xl sm:text-4xl md:text-[2.75rem] font-extrabold mb-3 md:mb-4 tracking-[-0.02em] leading-tight">
            Rewrite smarter with Promptive AI
          </h2>
          <p className="text-base md:text-lg text-white/70 mb-8 md:mb-10">
            No credit card required. Upgrade anytime.
          </p>

          <Link to="/signup" className={primaryBtn}>
            Get Started for Free
            <ArrowRight
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default PublicContentRewrite;
