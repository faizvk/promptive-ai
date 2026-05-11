import React from "react";
import { Link } from "react-router-dom";
import { Image, Sparkles, Layers, Shield, ArrowRight } from "lucide-react";
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
  "mt-3 sm:mt-4 text-sm sm:text-base md:text-[1.05rem] text-text-secondary leading-relaxed max-w-3xl mx-auto text-pretty";

const stepCard =
  "group relative p-6 sm:p-8 rounded-2xl bg-bg-surface border border-border-soft transition-[transform,border-color] duration-200 hover:-translate-y-0.5 text-left hover:border-btn-primary/40";

const stepIcon =
  "w-12 h-12 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-5 transition-colors duration-300 group-hover:bg-brand-primary group-hover:text-white";

const ExampleCard = ({ src, alt, prompt }) => (
  <div className="group relative rounded-2xl overflow-hidden bg-white border border-border-soft transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-btn-primary/40">
    <div className="aspect-[4/5] overflow-hidden bg-bg-soft">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
    </div>
    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/85 via-black/50 to-transparent text-white">
      <p className="text-xs sm:text-sm font-medium leading-snug">"{prompt}"</p>
    </div>
  </div>
);

const PublicImageGenerate = () => {
  return (
    <main className="w-full overflow-x-hidden">
      {/* ================= HERO ================= */}
      <section className="relative bg-gradient-to-b from-brand-primary via-[#062c5a] to-[#051a33] text-white px-5 py-20 sm:py-24 md:px-8 md:py-32 text-center overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        />

        <div className="relative max-w-[900px] mx-auto">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 border border-white/15 rounded-full text-[0.7rem] sm:text-xs font-semibold tracking-[0.12em] mb-6 sm:mb-8 uppercase backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-btn-secondary" />
            AI Image Generation
          </span>
          <div
            {...fadeIn({
              direction: "up",
              distance: 80,
              duration: 0.9,
            })}
          >
            <h1 className="text-3xl sm:text-5xl md:text-[3.5rem] font-extrabold tracking-[-0.025em] leading-[1.1] mb-5 md:mb-6">
              Turn text into{" "}
              <span className="bg-gradient-to-r from-btn-secondary to-[#fff5cf] bg-clip-text text-transparent">
                stunning images
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed">
              Generate high-quality visuals from natural language prompts using
              state-of-the-art AI models.
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
            <h2 className={sectionH2}>From prompt to visual</h2>
            <p className={sectionLead}>
              Three steps to turn an idea into a finished image you can ship.
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
                <Sparkles size={22} />
              </div>
              <h4 className="text-lg md:text-xl font-bold mb-2 text-text-primary">
                Write a prompt
              </h4>
              <p className="text-[0.95rem] leading-relaxed text-text-secondary">
                Describe the image you want in natural language.
              </p>
            </div>

            <div className={stepCard}>
              <div className={stepIcon}>
                <Layers size={22} />
              </div>
              <h4 className="text-lg md:text-xl font-bold mb-2 text-text-primary">
                AI generates
              </h4>
              <p className="text-[0.95rem] leading-relaxed text-text-secondary">
                Our models interpret your prompt and generate visuals.
              </p>
            </div>

            <div className={stepCard}>
              <div className={stepIcon}>
                <Image size={22} />
              </div>
              <h4 className="text-lg md:text-xl font-bold mb-2 text-text-primary">
                Download &amp; reuse
              </h4>
              <p className="text-[0.95rem] leading-relaxed text-text-secondary">
                Use your images anywhere — marketing, social, design.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= EXAMPLES ================= */}
      <section className="bg-bg-soft px-5 py-16 md:px-6 md:py-24 border-y border-black/5">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <span className={eyebrow}>Sample outputs</span>
            <h2 className={sectionH2}>Generated by Promptive</h2>
            <p className={sectionLead}>
              Real outputs from real prompts — hover to see the prompt that
              produced each image.
            </p>
          </div>

          <div
            className="grid gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            {...fadeIn({
              direction: "left",
              distance: 80,
              duration: 0.9,
            })}
          >
            <ExampleCard
              src="./sunset.png"
              alt="A futuristic city at sunset"
              prompt="A futuristic city at sunset"
            />
            <ExampleCard
              src="./portrait.png"
              alt="Photorealistic portrait, studio lighting"
              prompt="Photorealistic portrait, studio lighting"
            />
            <ExampleCard
              src="./product.png"
              alt="Minimal product shot on white background"
              prompt="Minimal product shot on white background"
            />
          </div>
        </div>
      </section>

      {/* ================= DEMO ================= */}
      <section
        id="demo"
        className="bg-white px-5 py-16 md:px-6 md:py-24"
        {...fadeIn({
          direction: "right",
          distance: 80,
          duration: 0.9,
        })}
      >
        <div className="max-w-[700px] mx-auto">
          <div className="text-center mb-8 md:mb-10">
            <span className={eyebrow}>Try it</span>
            <h2 className={sectionH2}>Preview the workflow</h2>
            <p className={sectionLead}>
              Experience how prompts work. Sign up to generate real images.
            </p>
          </div>

          <div className="relative rounded-2xl border border-border-soft bg-bg-surface p-5 md:p-6">
            <div className="flex flex-col gap-3 md:gap-4 [&>*]:opacity-50 [&>*]:pointer-events-none">
              <textarea
                placeholder="A cyberpunk street at night, neon lights, rain..."
                disabled
                rows={4}
                className="w-full p-4 rounded-xl border border-border-soft bg-bg-soft text-sm resize-none"
              />
              <button
                disabled
                className="p-3 rounded-xl border-0 bg-brand-primary text-white text-sm font-semibold"
              >
                Generate Image
              </button>
            </div>

            <div className="absolute inset-0 rounded-2xl bg-white/85 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3 text-center p-6">
              <div className="w-12 h-12 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                <Shield size={20} />
              </div>
              <p className="font-semibold text-text-primary">
                Sign up to unlock image generation
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
      <section className="bg-bg-soft px-5 py-16 md:px-6 md:py-24 border-t border-black/5">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <span className={eyebrow}>Who it's for</span>
            <h2 className={sectionH2}>Designed for visual thinkers</h2>
          </div>

          <div className="grid gap-5 md:gap-6 md:grid-cols-3">
            <div className="p-6 md:p-8 rounded-2xl bg-white border border-border-soft text-left transition-colors duration-200 hover:border-brand-primary/30">
              <h4 className="text-lg font-bold mb-2 text-text-primary">
                Creators
              </h4>
              <p className="text-[0.95rem] leading-relaxed text-text-secondary">
                Generate visuals for social media &amp; content.
              </p>
            </div>
            <div className="p-6 md:p-8 rounded-2xl bg-white border border-border-soft text-left transition-colors duration-200 hover:border-brand-primary/30">
              <h4 className="text-lg font-bold mb-2 text-text-primary">
                Marketing teams
              </h4>
              <p className="text-[0.95rem] leading-relaxed text-text-secondary">
                Create ads, banners, and campaigns faster.
              </p>
            </div>
            <div className="p-6 md:p-8 rounded-2xl bg-white border border-border-soft text-left transition-colors duration-200 hover:border-brand-primary/30">
              <h4 className="text-lg font-bold mb-2 text-text-primary">
                Developers &amp; designers
              </h4>
              <p className="text-[0.95rem] leading-relaxed text-text-secondary">
                Prototype ideas and design assets instantly.
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
          className="relative max-w-[800px] mx-auto"
          {...fadeIn({
            direction: "up",
            distance: 80,
            duration: 0.9,
          })}
        >
          <h2 className="text-3xl sm:text-4xl md:text-[2.75rem] font-extrabold mb-3 md:mb-4 tracking-[-0.02em] leading-tight">
            Start generating images with AI
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

export default PublicImageGenerate;
