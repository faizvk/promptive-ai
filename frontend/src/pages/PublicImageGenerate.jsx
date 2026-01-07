import React from "react";
import { Link } from "react-router-dom";
import { Image, Sparkles, Layers, Shield, ArrowRight } from "lucide-react";
import { fadeIn } from "../animations/FadeIn";
import "./styles/PublicImageGenerate.css";

const PublicImageGenerate = () => {
  return (
    <main className="public-image-page">
      {/* ================= HERO ================= */}
      <section className="public-hero">
        <div className="hero-content">
          <span className="hero-badge">AI Image Generation</span>
          <div
            {...fadeIn({
              direction: "up",
              distance: 80,
              duration: 0.9,
            })}
          >
            <h1>
              Turn text into <span>stunning images</span>
            </h1>
            <p>
              Generate high-quality visuals from natural language prompts using
              state-of-the-art AI models.
            </p>
          </div>

          <div
            className="hero-actions"
            {...fadeIn({
              direction: "left",
              distance: 80,
              duration: 0.9,
            })}
          >
            <Link to="/signup" className="primary-btn">
              Get Started Free <ArrowRight size={16} />
            </Link>
            <Link to="#demo" className="secondary-btn">
              Try Demo
            </Link>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section
        className="how-it-works"
        {...fadeIn({
          direction: "up",
          distance: 80,
          duration: 0.9,
        })}
      >
        <h2>How image generation works</h2>

        <div
          className="steps-grid"
          {...fadeIn({
            direction: "right",
            distance: 80,
            duration: 0.9,
          })}
        >
          <div className="step-card">
            <Sparkles size={22} />
            <h4>Write a prompt</h4>
            <p>Describe the image you want in natural language.</p>
          </div>

          <div className="step-card">
            <Layers size={22} />
            <h4>AI generates</h4>
            <p>Our models interpret your prompt and generate visuals.</p>
          </div>

          <div className="step-card">
            <Image size={22} />
            <h4>Download & reuse</h4>
            <p>Use your images anywhere — marketing, social, design.</p>
          </div>
        </div>
      </section>

      {/* ================= EXAMPLES ================= */}
      <section className="examples">
        <h2>Example outputs</h2>

        <div
          className="example-grid"
          {...fadeIn({
            direction: "left",
            distance: 80,
            duration: 0.9,
          })}
        >
          <div className="example-card">
            <img src="./sunset.png" alt="AI city" />
            <p>“A futuristic city at sunset”</p>
          </div>

          <div className="example-card">
            <img src="./potrait.png" alt="AI portrait" />
            <p>“Photorealistic portrait, studio lighting”</p>
          </div>

          <div className="example-card">
            <img src="./product.png" alt="AI product" />
            <p>“Minimal product shot on white background”</p>
          </div>
        </div>
      </section>

      {/* ================= DEMO ================= */}
      <section
        id="demo"
        className="demo"
        {...fadeIn({
          direction: "right",
          distance: 80,
          duration: 0.9,
        })}
      >
        <h2>Try a demo</h2>
        <p>Experience how prompts work. Sign up to generate real images.</p>

        <div className="demo-box">
          <textarea
            placeholder="A cyberpunk street at night, neon lights, rain..."
            disabled
          />
          <button disabled>Generate Image</button>

          <div className="demo-overlay">
            <Shield size={20} />
            <span>Sign up to unlock image generation</span>
          </div>
        </div>
      </section>

      {/* ================= USE CASES ================= */}
      <section className="use-cases">
        <h2>Who is this for?</h2>

        <div className="use-case-grid">
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
      <section className="cta">
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

        <Link to="/signup" className="primary-btn">
          Get Started for Free <ArrowRight size={16} />
        </Link>
      </section>
    </main>
  );
};

export default PublicImageGenerate;
