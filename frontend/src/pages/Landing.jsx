import React from "react";
import { Link } from "react-router-dom";
import { Image, FileText, Zap, Shield, ArrowRight } from "lucide-react";
import { fadeIn } from "../animations/FadeIn";

const primaryBtn =
  "bg-btn-primary text-white px-7 py-3.5 rounded-[10px] no-underline font-semibold inline-flex items-center gap-2 hover:opacity-90";

const secondaryBtn =
  "border border-white/40 text-white px-7 py-3.5 rounded-[10px] no-underline hover:opacity-90";

const featureCard =
  "p-6 sm:p-8 md:p-12 md:px-9 rounded-3xl bg-bg-surface border border-black/5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_-1px_rgba(0,0,0,0.01)] transition-[transform,box-shadow] duration-[250ms] ease-in-out text-left hover:-translate-y-2 hover:shadow-[0_24px_48px_-14px_rgba(0,0,0,0.12)]";

const stepCard =
  "bg-white p-6 sm:p-8 md:p-11 md:px-9 rounded-[20px] border border-border-soft text-center transition-[transform,box-shadow] duration-[250ms] hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.12)]";

const stepNumber =
  "w-12 h-12 bg-brand-primary text-white rounded-full flex items-center justify-center font-bold mx-auto mb-5 md:mb-7 text-[0.95rem] shadow-[0_0_0_10px_rgba(4,56,115,0.12)]";

const useCaseItem =
  "p-6 sm:p-8 md:p-10 md:px-9 rounded-[18px] border border-border-soft bg-bg-surface transition-[transform,box-shadow] duration-[250ms] text-left hover:-translate-y-1 hover:shadow-[0_18px_36px_-14px_rgba(0,0,0,0.1)]";

const Landing = () => {
  return (
    <main className="w-full overflow-x-hidden">
      {/* ================= HERO ================= */}
      <section className="px-5 py-16 sm:py-20 md:px-6 md:py-28 bg-gradient-to-b from-brand-primary to-[#071a33] text-white text-center">
        <div className="max-w-[900px] mx-auto">
          <div
            {...fadeIn({
              direction: "up",
              distance: 80,
              duration: 0.9,
            })}
          >
            <span className="inline-block px-3.5 py-1.5 bg-white/10 rounded-full text-xs font-semibold tracking-[0.08em] mb-6 uppercase">
              AI-powered productivity
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-[3.25rem] font-extrabold mb-4 md:mb-5 leading-tight">
              Create images and rewrite content <br className="hidden sm:block" />
              <span>faster with AI</span>
            </h1>
            <p className="text-base sm:text-lg md:text-[1.15rem] text-[#cbd5e1] mb-8 md:mb-10">
              Promptive AI helps creators, teams, and developers generate
              visuals and refine content using powerful AI models.
            </p>
          </div>

          <div
            className="flex justify-center gap-4 flex-wrap"
            {...fadeIn({
              direction: "left",
              distance: 80,
              duration: 0.9,
            })}
          >
            <Link to="/signup" className={primaryBtn}>
              Get Started <ArrowRight size={16} />
            </Link>
            <Link to="/image-generate" className={secondaryBtn}>
              Try Image Generator
            </Link>
          </div>
        </div>
      </section>

      {/* ================= SOCIAL PROOF ================= */}
      <section className="bg-bg-soft px-5 py-12 md:px-6 md:py-[4.5rem] border-t border-b border-black/5">
        <p className="text-xs font-bold text-brand-primary uppercase tracking-[0.15em] mb-8 md:mb-12 text-center opacity-85">
          Trusted by professionals building with AI
        </p>

        <div
          className="max-w-[1000px] mx-auto grid gap-8 md:gap-12 text-center grid-cols-2 md:grid-cols-4"
          {...fadeIn({
            direction: "up",
            distance: 80,
            duration: 0.9,
          })}
        >
          <div>
            <strong className="text-3xl md:text-[2.5rem] font-extrabold text-text-primary block mb-2">
              10k+
            </strong>
            <span className="text-[0.9rem] font-medium text-text-muted">
              AI generations
            </span>
          </div>
          <div>
            <strong className="text-3xl md:text-[2.5rem] font-extrabold text-text-primary block mb-2">
              1k+
            </strong>
            <span className="text-[0.9rem] font-medium text-text-muted">
              Active users
            </span>
          </div>
          <div>
            <strong className="text-3xl md:text-[2.5rem] font-extrabold text-text-primary block mb-2">
              99.9%
            </strong>
            <span className="text-[0.9rem] font-medium text-text-muted">
              Uptime
            </span>
          </div>
          <div>
            <strong className="text-3xl md:text-[2.5rem] font-extrabold text-text-primary block mb-2">
              Fast
            </strong>
            <span className="text-[0.9rem] font-medium text-text-muted">
              Inference
            </span>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section
        className="bg-white px-5 py-12 md:p-5"
        {...fadeIn({
          direction: "left",
          distance: 80,
          duration: 0.9,
        })}
      >
        <h2 className="text-center text-2xl sm:text-3xl md:text-[2.5rem] font-extrabold tracking-[-0.02em] mb-6 md:mb-8 text-text-primary">
          Everything you need to create with AI
        </h2>

        <div className="grid gap-6 md:gap-10 grid-cols-1 md:grid-cols-3">
          <div className={featureCard}>
            <Image size={28} />
            <h3 className="text-[1.3rem] font-bold mb-3 mt-3">
              AI Image Generation
            </h3>
            <p className="text-base leading-[1.6] text-text-secondary">
              Generate high-quality images from text prompts using modern
              diffusion models.
            </p>
          </div>

          <div className={featureCard}>
            <FileText size={28} />
            <h3 className="text-[1.3rem] font-bold mb-3 mt-3">
              Content Rewrite
            </h3>
            <p className="text-base leading-[1.6] text-text-secondary">
              Rewrite content in different tones while preserving clarity and
              intent.
            </p>
          </div>

          <div className={featureCard}>
            <Zap size={28} />
            <h3 className="text-[1.3rem] font-bold mb-3 mt-3">
              Fast & Reliable
            </h3>
            <p className="text-base leading-[1.6] text-text-secondary">
              Optimized inference pipelines ensure fast responses at scale.
            </p>
          </div>

          <div className={featureCard}>
            <Shield size={28} />
            <h3 className="text-[1.3rem] font-bold mb-3 mt-3">
              Secure & Private
            </h3>
            <p className="text-base leading-[1.6] text-text-secondary">
              Your data stays isolated, authenticated, and fully owned by you.
            </p>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section
        className="bg-[#f8fafc] px-5 py-16 md:px-6 md:py-24"
        {...fadeIn({
          direction: "right",
          distance: 80,
          duration: 0.9,
        })}
      >
        <div className="max-w-[1100px] mx-auto text-center">
          <h2
            className="text-2xl sm:text-3xl md:text-[3rem] text-text-secondary mb-10 md:mb-[70px]"
            {...fadeIn({
              direction: "up",
              distance: 80,
              duration: 0.9,
            })}
          >
            Designed for simple, powerful workflows
          </h2>

          <div className="grid gap-6 md:gap-10 grid-cols-1 md:grid-cols-3">
            <div className={stepCard}>
              <span className={stepNumber}>01</span>
              <h4 className="text-[1.2rem] font-bold mb-3 text-text-primary">
                Create an account
              </h4>
              <p className="text-[0.95rem] leading-[1.6] text-text-secondary">
                Sign up in seconds and access your AI workspace instantly.
              </p>
            </div>

            <div className={stepCard}>
              <span className={stepNumber}>02</span>
              <h4 className="text-[1.2rem] font-bold mb-3 text-text-primary">
                Describe your intent
              </h4>
              <p className="text-[0.95rem] leading-[1.6] text-text-secondary">
                Provide a prompt or text and choose the desired output.
              </p>
            </div>

            <div className={stepCard}>
              <span className={stepNumber}>03</span>
              <h4 className="text-[1.2rem] font-bold mb-3 text-text-primary">
                Generate & manage
              </h4>
              <p className="text-[0.95rem] leading-[1.6] text-text-secondary">
                Generate results, download assets, and manage history.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= USE CASES ================= */}
      <section
        className="bg-white px-5 py-16 md:px-6 md:py-24"
        {...fadeIn({
          direction: "left",
          distance: 80,
          duration: 0.9,
        })}
      >
        <div className="max-w-[1100px] mx-auto text-center">
          <h2
            className="text-2xl sm:text-3xl md:text-[3rem] text-text-secondary mb-10 md:mb-[70px]"
            {...fadeIn({
              direction: "up",
              distance: 80,
              duration: 0.9,
            })}
          >
            Built for professionals and teams
          </h2>

          <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-3">
            <div className={useCaseItem}>
              <h4 className="text-[1.15rem] font-bold mb-3 text-text-primary">
                Content Creators
              </h4>
              <p className="text-[0.95rem] leading-[1.6] text-text-secondary">
                Generate visuals, rewrite captions, and publish faster.
              </p>
            </div>
            <div className={useCaseItem}>
              <h4 className="text-[1.15rem] font-bold mb-3 text-text-primary">
                Marketing Teams
              </h4>
              <p className="text-[0.95rem] leading-[1.6] text-text-secondary">
                Create campaign assets and iterate without bottlenecks.
              </p>
            </div>
            <div className={useCaseItem}>
              <h4 className="text-[1.15rem] font-bold mb-3 text-text-primary">
                Developers
              </h4>
              <p className="text-[0.95rem] leading-[1.6] text-text-secondary">
                Prototype ideas, generate assets, and test workflows quickly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-brand-primary px-5 py-16 md:px-6 md:py-28 text-center text-white">
        <div
          {...fadeIn({
            direction: "left",
            distance: 80,
            duration: 0.9,
          })}
        >
          {" "}
          <h2 className="text-2xl sm:text-3xl md:text-[2.75rem] font-extrabold mb-3 md:mb-4">
            Build faster with AI-powered tools
          </h2>
          <p className="text-base md:text-[1.2rem] text-white/85 mb-8 md:mb-11">
            Start for free. No credit card required.
          </p>
        </div>

        <Link
          to="/signup"
          className={primaryBtn}
          {...fadeIn({
            direction: "up",
            distance: 80,
            duration: 0.9,
          })}
        >
          Get Started <ArrowRight size={16} />
        </Link>
      </section>
    </main>
  );
};

export default Landing;
