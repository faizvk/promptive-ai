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
import "./styles/PublicContentRewrite.css";

const PublicContentRewrite = () => {
  return (
    <main className="public-rewrite-page">
      {/* ================= HERO ================= */}
      <section className="public-hero">
        <div className="hero-content">
          <span className="hero-badge">AI Content Rewrite</span>
          <div
            {...fadeIn({
              direction: "up",
              distance: 80,
              duration: 0.9,
            })}
          >
            <h1>
              Rewrite content with <span>clarity & precision</span>
            </h1>
            <p>
              Improve tone, clarity, and structure of your content using
              advanced AI — without losing meaning.
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
        <h2>How content rewrite works</h2>

        <div
          className="steps-grid"
          {...fadeIn({
            direction: "right",
            distance: 80,
            duration: 0.9,
          })}
        >
          <div className="step-card">
            <FileText size={22} />
            <h4>Paste your text</h4>
            <p>Provide the content you want to improve or rewrite.</p>
          </div>

          <div className="step-card">
            <Sliders size={22} />
            <h4>Select a tone</h4>
            <p>Choose professional, formal, casual, or creative.</p>
          </div>

          <div className="step-card">
            <RefreshCcw size={22} />
            <h4>Rewrite instantly</h4>
            <p>Get a refined version while preserving meaning.</p>
          </div>
        </div>
      </section>

      {/* ================= EXAMPLES ================= */}
      <section
        className="examples"
        {...fadeIn({
          direction: "left",
          distance: 80,
          duration: 0.9,
        })}
      >
        <h2>Before & after examples</h2>

        <div className="example-grid">
          <div className="example-card">
            <span>Before</span>
            <p>
              We provide tools that help teams make content faster and better.
            </p>
          </div>

          <div className="example-card improved">
            <span>After</span>
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
        className="demo"
        {...fadeIn({
          direction: "up",
          distance: 80,
          duration: 0.9,
        })}
      >
        <h2>Try a demo</h2>
        <p>See how rewriting works. Sign up to unlock full functionality.</p>

        <div className="demo-box">
          <textarea placeholder="Paste your content here…" disabled />

          <select disabled>
            <option>Professional</option>
            <option>Formal</option>
            <option>Casual</option>
            <option>Creative</option>
          </select>

          <button disabled>Rewrite Content</button>

          <div className="demo-overlay">
            <Shield size={20} />
            <span>Sign up to unlock content rewrite</span>
          </div>
        </div>
      </section>

      {/* ================= USE CASES ================= */}
      <section
        className="use-cases"
        {...fadeIn({
          direction: "right",
          distance: 80,
          duration: 0.9,
        })}
      >
        <h2>Who is this for?</h2>

        <div className="use-case-grid">
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
      <section className="cta">
        <div
          {...fadeIn({
            direction: "up",
            distance: 80,
            duration: 0.9,
          })}
        >
          <h2>Rewrite smarter with Promptive AI</h2>
          <p>No credit card required. Upgrade anytime.</p>
        </div>

        <Link to="/signup" className="primary-btn">
          Get Started for Free <ArrowRight size={16} />
        </Link>
      </section>
    </main>
  );
};

export default PublicContentRewrite;
