import React from "react";
import { Link } from "react-router-dom";
import { Image, FileText, Zap, Shield, ArrowRight } from "lucide-react";
import { fadeIn } from "../animations/FadeIn";

const primaryBtn =
  "group bg-btn-primary hover:bg-[#3b8de8] text-white px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl no-underline text-sm sm:text-base font-semibold inline-flex items-center gap-2 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-btn-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-primary";

const secondaryBtn =
  "border border-white/25 bg-white/5 backdrop-blur-sm text-white px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl no-underline text-sm sm:text-base font-semibold inline-flex items-center gap-2 hover:bg-white/10 hover:border-white/40 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40";

const eyebrow =
  "inline-block text-[0.7rem] sm:text-xs font-bold tracking-[0.18em] uppercase text-brand-primary/70 mb-3";

const sectionH2 =
  "text-2xl sm:text-3xl md:text-[2.5rem] font-extrabold tracking-[-0.02em] text-text-primary leading-tight";

const sectionLead =
  "mt-3 sm:mt-4 text-sm sm:text-base md:text-[1.05rem] text-text-secondary leading-relaxed max-w-2xl mx-auto";

const featureCard =
  "group relative p-6 sm:p-8 rounded-2xl bg-bg-surface border border-border-soft transition-colors duration-200 text-left overflow-hidden hover:border-btn-primary/40";

const featureIcon =
  "w-12 h-12 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-5 transition-colors duration-300 group-hover:bg-brand-primary group-hover:text-white";

const stepCard =
  "relative bg-white p-6 sm:p-8 rounded-2xl border border-border-soft text-left transition-colors duration-200 hover:border-brand-primary/30";

const stepNumber =
  "inline-flex items-center justify-center w-11 h-11 bg-brand-primary text-white rounded-xl font-bold mb-5 text-sm";

const useCaseItem =
  "p-6 sm:p-8 rounded-2xl border border-border-soft bg-bg-surface transition-colors duration-200 text-left hover:border-brand-primary/30";

const Landing = () => {
  return (
    <main className="w-full overflow-x-hidden">
      {/* ================= HERO ================= */}
      <section className="relative px-5 py-20 sm:py-24 md:px-6 md:py-32 bg-gradient-to-b from-brand-primary via-[#062c5a] to-[#051a33] text-white text-center overflow-hidden">
        {/* Grid overlay with radial mask */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        />

        <div className="relative max-w-[900px] mx-auto">
          <div
            {...fadeIn({
              direction: "up",
              distance: 80,
              duration: 0.9,
            })}
          >
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 border border-white/15 rounded-full text-[0.7rem] sm:text-xs font-semibold tracking-[0.12em] mb-6 sm:mb-8 uppercase backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-btn-secondary" />
              AI-powered productivity
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-[3.5rem] font-extrabold tracking-[-0.025em] mb-5 md:mb-6 leading-[1.1]">
              Create images and rewrite content
              <br className="hidden sm:block" />{" "}
              <span className="bg-gradient-to-r from-btn-secondary to-[#fff5cf] bg-clip-text text-transparent">
                faster with AI
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed">
              Promptive AI helps creators, teams, and developers generate
              visuals and refine content using powerful AI models.
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
              Get Started
              <ArrowRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
            <Link to="/image-generate" className={secondaryBtn}>
              Try Image Generator
            </Link>
          </div>
        </div>

        {/* Bottom fade into next section */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-bg-soft/40"
        />
      </section>

      {/* ================= SOCIAL PROOF ================= */}
      <section className="bg-bg-soft px-5 py-12 md:px-6 md:py-20 border-y border-black/5">
        <p className="text-[0.7rem] sm:text-xs font-bold text-brand-primary uppercase tracking-[0.18em] mb-8 md:mb-14 text-center">
          Trusted by professionals building with AI
        </p>

        <div
          className="max-w-[1000px] mx-auto grid gap-y-10 gap-x-6 md:gap-12 text-center grid-cols-2 md:grid-cols-4"
          {...fadeIn({
            direction: "up",
            distance: 80,
            duration: 0.9,
          })}
        >
          {[
            { value: "10k+", label: "AI generations" },
            { value: "1k+", label: "Active users" },
            { value: "99.9%", label: "Uptime" },
            { value: "Fast", label: "Inference" },
          ].map((stat) => (
            <div key={stat.label}>
              <strong className="text-3xl md:text-[2.5rem] font-extrabold text-brand-primary block mb-1.5 tracking-tight">
                {stat.value}
              </strong>
              <span className="text-[0.85rem] font-medium text-text-muted">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section
        className="bg-white px-5 py-16 md:px-6 md:py-24"
        {...fadeIn({
          direction: "left",
          distance: 80,
          duration: 0.9,
        })}
      >
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <span className={eyebrow}>Capabilities</span>
            <h2 className={sectionH2}>
              Everything you need to create with AI
            </h2>
            <p className={sectionLead}>
              A modern toolkit for visual generation and content refinement,
              built for speed and reliability.
            </p>
          </div>

          <div className="grid gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <div className={featureCard}>
              <div className={featureIcon}>
                <Image size={22} />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 text-text-primary">
                AI Image Generation
              </h3>
              <p className="text-[0.95rem] leading-relaxed text-text-secondary">
                Generate high-quality images from text prompts using modern
                diffusion models.
              </p>
            </div>

            <div className={featureCard}>
              <div className={featureIcon}>
                <FileText size={22} />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 text-text-primary">
                Content Rewrite
              </h3>
              <p className="text-[0.95rem] leading-relaxed text-text-secondary">
                Rewrite content in different tones while preserving clarity and
                intent.
              </p>
            </div>

            <div className={featureCard}>
              <div className={featureIcon}>
                <Zap size={22} />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 text-text-primary">
                Fast & Reliable
              </h3>
              <p className="text-[0.95rem] leading-relaxed text-text-secondary">
                Optimized inference pipelines ensure fast responses at scale.
              </p>
            </div>

            <div className={featureCard}>
              <div className={featureIcon}>
                <Shield size={22} />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 text-text-primary">
                Secure & Private
              </h3>
              <p className="text-[0.95rem] leading-relaxed text-text-secondary">
                Your data stays isolated, authenticated, and fully owned by you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section
        className="bg-[#f8fafc] px-5 py-16 md:px-6 md:py-24 border-y border-black/5"
        {...fadeIn({
          direction: "right",
          distance: 80,
          duration: 0.9,
        })}
      >
        <div className="max-w-[1100px] mx-auto">
          <div
            className="text-center mb-10 md:mb-16"
            {...fadeIn({
              direction: "up",
              distance: 80,
              duration: 0.9,
            })}
          >
            <span className={eyebrow}>How it works</span>
            <h2 className={sectionH2}>Simple, powerful workflows</h2>
            <p className={sectionLead}>
              Three steps from intent to output. No setup, no complexity.
            </p>
          </div>

          <div className="grid gap-5 md:gap-6 grid-cols-1 md:grid-cols-3">
            <div className={stepCard}>
              <span className={stepNumber}>01</span>
              <h4 className="text-lg font-bold mb-2 text-text-primary">
                Create an account
              </h4>
              <p className="text-[0.95rem] leading-relaxed text-text-secondary">
                Sign up in seconds and access your AI workspace instantly.
              </p>
            </div>

            <div className={stepCard}>
              <span className={stepNumber}>02</span>
              <h4 className="text-lg font-bold mb-2 text-text-primary">
                Describe your intent
              </h4>
              <p className="text-[0.95rem] leading-relaxed text-text-secondary">
                Provide a prompt or text and choose the desired output.
              </p>
            </div>

            <div className={stepCard}>
              <span className={stepNumber}>03</span>
              <h4 className="text-lg font-bold mb-2 text-text-primary">
                Generate &amp; manage
              </h4>
              <p className="text-[0.95rem] leading-relaxed text-text-secondary">
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
        <div className="max-w-[1100px] mx-auto">
          <div
            className="text-center mb-10 md:mb-16"
            {...fadeIn({
              direction: "up",
              distance: 80,
              duration: 0.9,
            })}
          >
            <span className={eyebrow}>Who it's for</span>
            <h2 className={sectionH2}>Built for professionals and teams</h2>
            <p className={sectionLead}>
              From solo creators to scaling teams, Promptive adapts to the way
              you work.
            </p>
          </div>

          <div className="grid gap-5 md:gap-6 grid-cols-1 md:grid-cols-3">
            <div className={useCaseItem}>
              <h4 className="text-lg font-bold mb-2 text-text-primary">
                Content Creators
              </h4>
              <p className="text-[0.95rem] leading-relaxed text-text-secondary">
                Generate visuals, rewrite captions, and publish faster.
              </p>
            </div>
            <div className={useCaseItem}>
              <h4 className="text-lg font-bold mb-2 text-text-primary">
                Marketing Teams
              </h4>
              <p className="text-[0.95rem] leading-relaxed text-text-secondary">
                Create campaign assets and iterate without bottlenecks.
              </p>
            </div>
            <div className={useCaseItem}>
              <h4 className="text-lg font-bold mb-2 text-text-primary">
                Developers
              </h4>
              <p className="text-[0.95rem] leading-relaxed text-text-secondary">
                Prototype ideas, generate assets, and test workflows quickly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="relative bg-gradient-to-br from-brand-primary via-[#062c5a] to-[#051a33] px-5 py-20 md:px-6 md:py-28 text-center text-white overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
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
            Build faster with AI-powered tools
          </h2>
          <p className="text-base md:text-lg text-white/70 mb-8 md:mb-10">
            Start for free. No credit card required.
          </p>

          <Link to="/signup" className={primaryBtn}>
            Get Started
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

export default Landing;
