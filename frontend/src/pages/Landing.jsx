import React from "react";
import { Link } from "react-router-dom";
import { Image, FileText, Zap, Shield, ArrowRight } from "lucide-react";
import { fadeIn } from "../animations/FadeIn";
import "./styles/Landing.css";

const Landing = () => {
  return (
    <main className="landing">
      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="hero-content">
          <div
            {...fadeIn({
              direction: "up",
              distance: 80,
              duration: 0.9,
            })}
          >
            <span className="hero-badge">AI-powered productivity</span>
            <h1>
              Create images and rewrite content <br />
              <span>faster with AI</span>
            </h1>
            <p>
              Promptive AI helps creators, teams, and developers generate
              visuals and refine content using powerful AI models.
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
              Get Started <ArrowRight size={16} />
            </Link>
            <Link to="/image-generate" className="secondary-btn">
              Try Image Generator
            </Link>
          </div>
        </div>
      </section>

      {/* ================= SOCIAL PROOF ================= */}
      <section className="social-proof">
        <p className="social-proof-label">
          Trusted by professionals building with AI
        </p>

        <div
          className="social-proof-stats"
          {...fadeIn({
            direction: "up",
            distance: 80,
            duration: 0.9,
          })}
        >
          <div>
            <strong>10k+</strong>
            <span>AI generations</span>
          </div>
          <div>
            <strong>1k+</strong>
            <span>Active users</span>
          </div>
          <div>
            <strong>99.9%</strong>
            <span>Uptime</span>
          </div>
          <div>
            <strong>Fast</strong>
            <span>Inference</span>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section
        className="features"
        {...fadeIn({
          direction: "left",
          distance: 80,
          duration: 0.9,
        })}
      >
        <h2>Everything you need to create with AI</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <Image size={28} />
            <h3>AI Image Generation</h3>
            <p>
              Generate high-quality images from text prompts using modern
              diffusion models.
            </p>
          </div>

          <div className="feature-card">
            <FileText size={28} />
            <h3>Content Rewrite</h3>
            <p>
              Rewrite content in different tones while preserving clarity and
              intent.
            </p>
          </div>

          <div className="feature-card">
            <Zap size={28} />
            <h3>Fast & Reliable</h3>
            <p>Optimized inference pipelines ensure fast responses at scale.</p>
          </div>

          <div className="feature-card">
            <Shield size={28} />
            <h3>Secure & Private</h3>
            <p>
              Your data stays isolated, authenticated, and fully owned by you.
            </p>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section
        className="how-it-works"
        {...fadeIn({
          direction: "right",
          distance: 80,
          duration: 0.9,
        })}
      >
        <h2
          {...fadeIn({
            direction: "up",
            distance: 80,
            duration: 0.9,
          })}
        >
          Designed for simple, powerful workflows
        </h2>

        <div className="steps">
          <div className="step">
            <span>01</span>
            <h4>Create an account</h4>
            <p>Sign up in seconds and access your AI workspace instantly.</p>
          </div>

          <div className="step">
            <span>02</span>
            <h4>Describe your intent</h4>
            <p>Provide a prompt or text and choose the desired output.</p>
          </div>

          <div className="step">
            <span>03</span>
            <h4>Generate & manage</h4>
            <p>Generate results, download assets, and manage history.</p>
          </div>
        </div>
      </section>

      {/* ================= USE CASES ================= */}
      <section
        className="use-cases"
        {...fadeIn({
          direction: "left",
          distance: 80,
          duration: 0.9,
        })}
      >
        <h2
          {...fadeIn({
            direction: "up",
            distance: 80,
            duration: 0.9,
          })}
        >
          Built for professionals and teams
        </h2>

        <div className="use-case-grid">
          <div>
            <h4>Content Creators</h4>
            <p>Generate visuals, rewrite captions, and publish faster.</p>
          </div>
          <div>
            <h4>Marketing Teams</h4>
            <p>Create campaign assets and iterate without bottlenecks.</p>
          </div>
          <div>
            <h4>Developers</h4>
            <p>Prototype ideas, generate assets, and test workflows quickly.</p>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="cta">
        <div
          {...fadeIn({
            direction: "left",
            distance: 80,
            duration: 0.9,
          })}
        >
          {" "}
          <h2>Build faster with AI-powered tools</h2>
          <p>Start for free. No credit card required.</p>
        </div>

        <Link
          to="/signup"
          className="cta-btn"
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
