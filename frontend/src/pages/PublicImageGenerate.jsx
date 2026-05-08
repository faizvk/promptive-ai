import React from "react";
import { Link } from "react-router-dom";
import { Image, Sparkles, Layers, Shield, ArrowRight } from "lucide-react";
import { fadeIn } from "../animations/FadeIn";

const primaryBtn =
  "bg-btn-primary text-white px-7 py-3.5 rounded-[10px] no-underline font-semibold inline-flex items-center gap-2 hover:opacity-90";

const secondaryBtn =
  "border border-white/40 text-white px-7 py-3.5 rounded-[10px] no-underline hover:opacity-90";

const stepCard = "p-8 rounded-2xl bg-bg-surface shadow-card";

const PublicImageGenerate = () => {
  return (
    <main className="w-full overflow-x-hidden">
      {/* ================= HERO ================= */}
      <section className="bg-gradient-to-b from-brand-primary to-[#071a33] text-white px-8 py-24 text-center">
        <div className="max-w-[900px] mx-auto">
          <span className="inline-block px-3 py-1.5 rounded-full bg-white/10 text-xs mb-4">
            AI Image Generation
          </span>
          <div
            {...fadeIn({
              direction: "up",
              distance: 80,
              duration: 0.9,
            })}
          >
            <h1 className="text-[3rem] font-extrabold">
              Turn text into <span>stunning images</span>
            </h1>
            <p>
              Generate high-quality visuals from natural language prompts using
              state-of-the-art AI models.
            </p>
          </div>

          <div
            className="mt-8 flex gap-4 justify-center"
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
        className="px-8 py-20 text-center"
        {...fadeIn({
          direction: "up",
          distance: 80,
          duration: 0.9,
        })}
      >
        <h2>How image generation works</h2>

        <div
          className="mt-12 grid gap-8 md:grid-cols-3"
          {...fadeIn({
            direction: "right",
            distance: 80,
            duration: 0.9,
          })}
        >
          <div className={stepCard}>
            <Sparkles size={22} />
            <h4>Write a prompt</h4>
            <p>Describe the image you want in natural language.</p>
          </div>

          <div className={stepCard}>
            <Layers size={22} />
            <h4>AI generates</h4>
            <p>Our models interpret your prompt and generate visuals.</p>
          </div>

          <div className={stepCard}>
            <Image size={22} />
            <h4>Download & reuse</h4>
            <p>Use your images anywhere — marketing, social, design.</p>
          </div>
        </div>
      </section>

      {/* ================= EXAMPLES ================= */}
      <section className="bg-bg-soft px-8 py-20">
        <h2 className="text-center">Example outputs</h2>

        <div
          className="grid gap-8 md:grid-cols-3"
          {...fadeIn({
            direction: "left",
            distance: 80,
            duration: 0.9,
          })}
        >
          <div>
            <img
              src="./sunset.png"
              alt="AI city"
              className="w-full rounded-[14px]"
            />
            <p>“A futuristic city at sunset”</p>
          </div>

          <div>
            <img
              src="./potrait.png"
              alt="AI portrait"
              className="w-full rounded-[14px]"
            />
            <p>“Photorealistic portrait, studio lighting”</p>
          </div>

          <div>
            <img
              src="./product.png"
              alt="AI product"
              className="w-full rounded-[14px]"
            />
            <p>“Minimal product shot on white background”</p>
          </div>
        </div>
      </section>

      {/* ================= DEMO ================= */}
      <section
        id="demo"
        className="px-8 py-20 text-center"
        {...fadeIn({
          direction: "right",
          distance: 80,
          duration: 0.9,
        })}
      >
        <h2>Try a demo</h2>
        <p>Experience how prompts work. Sign up to generate real images.</p>

        <div className="max-w-[600px] mx-auto my-8 relative">
          <textarea
            placeholder="A cyberpunk street at night, neon lights, rain..."
            disabled
            className="w-full h-[120px] p-4 rounded-xl border border-border-soft resize-none"
          />
          <button
            disabled
            className="mt-4 w-full p-3 rounded-[10px] border-0 bg-brand-primary text-white opacity-50"
          >
            Generate Image
          </button>

          <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center gap-2 font-semibold">
            <Shield size={20} />
            <span>Sign up to unlock image generation</span>
          </div>
        </div>
      </section>

      {/* ================= USE CASES ================= */}
      <section className="px-8 py-20 text-center">
        <h2>Who is this for?</h2>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          <div>
            <h4>Creators</h4>
            <p>Generate visuals for social media & content.</p>
          </div>
          <div>
            <h4>Marketing teams</h4>
            <p>Create ads, banners, and campaigns faster.</p>
          </div>
          <div>
            <h4>Developers & designers</h4>
            <p>Prototype ideas and design assets instantly.</p>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-brand-primary text-white px-8 py-20 text-center">
        <div
          {...fadeIn({
            direction: "up",
            distance: 80,
            duration: 0.9,
          })}
        >
          {" "}
          <h2>Start generating images with AI</h2>
          <p>No credit card required. Upgrade anytime.</p>
        </div>

        <Link to="/signup" className={primaryBtn}>
          Get Started for Free <ArrowRight size={16} />
        </Link>
      </section>
    </main>
  );
};

export default PublicImageGenerate;
