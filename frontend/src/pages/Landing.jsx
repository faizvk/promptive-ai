import React from "react";
import { Link } from "react-router-dom";
import {
  Image,
  FileText,
  MessageSquare,
  Mic,
  Sparkles,
  Shield,
  Zap,
  ArrowRight,
  Check,
} from "lucide-react";
import { fadeIn } from "../animations/FadeIn";

const primaryBtn =
  "group bg-brand-primary hover:bg-[#032c5a] text-white px-6 py-3 rounded-xl text-sm font-semibold inline-flex items-center gap-2 transition-colors no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 focus-visible:ring-offset-2";

const secondaryBtn =
  "border border-white/25 bg-white/5 backdrop-blur-sm text-white px-6 py-3 rounded-xl text-sm font-semibold inline-flex items-center gap-2 hover:bg-white/10 hover:border-white/40 transition-colors no-underline";

const eyebrow =
  "inline-block text-[0.7rem] font-bold tracking-[0.18em] uppercase text-brand-primary/70 mb-3";

const sectionTitle =
  "text-[1.6rem] sm:text-3xl md:text-[2.25rem] font-extrabold tracking-[-0.025em] text-text-primary leading-tight";

const sectionLead =
  "mt-3 text-sm sm:text-base text-text-secondary leading-relaxed max-w-xl mx-auto";

const FEATURES = [
  {
    icon: MessageSquare,
    title: "Multi-model chat",
    description:
      "Talk to GPT-4o, Claude 3.5, Gemini, and Llama — switch model mid-conversation, never lose context.",
  },
  {
    icon: Image,
    title: "Image generation",
    description:
      "Turn prompts into high-quality images with selectable resolution, aspect ratio, and quality preset.",
  },
  {
    icon: FileText,
    title: "Content rewriting",
    description:
      "Rewrite anything in professional, formal, casual, or creative tone — meaning and length stay intact.",
  },
  {
    icon: Mic,
    title: "Voice synthesis",
    description:
      "Generate studio-grade voiceovers from text using ElevenLabs and OpenAI voices. Download as MP3.",
  },
];

const STEPS = [
  {
    title: "Sign in",
    description:
      "Create your workspace in seconds. Free tier doesn't need a card.",
  },
  {
    title: "Pick your tool",
    description:
      "Chat, generate, rewrite, or synthesize voice — all from a single dashboard.",
  },
  {
    title: "Ship faster",
    description:
      "Save your work, manage history, and reuse everything across projects.",
  },
];

const TRUST_POINTS = [
  {
    icon: Shield,
    title: "Secure by default",
    description:
      "httpOnly cookie auth, per-account lockout, audit logging, and rate limiting.",
  },
  {
    icon: Zap,
    title: "Fast inference",
    description:
      "Backed by Google Gemini, OpenAI, Anthropic, Groq, ElevenLabs, and Hugging Face.",
  },
  {
    icon: Sparkles,
    title: "Made for builders",
    description:
      "Clean UI, transparent pricing, no fluff. Predictable monthly caps, no surprise bills.",
  },
];

const Landing = () => {
  return (
    <main className="w-full overflow-x-hidden">
      {/* HERO */}
      <section className="relative bg-gradient-to-b from-brand-primary via-[#062c5a] to-[#051a33] text-white px-5 py-24 md:px-6 md:py-32 text-center overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        />

        <div className="relative max-w-[920px] mx-auto">
          <div
            {...fadeIn({ direction: "up", distance: 60, duration: 0.7 })}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/15 rounded-full text-[0.7rem] font-semibold tracking-[0.12em] mb-7 uppercase backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-btn-secondary" />
              AI Workspace · 2026
            </span>
            <h1 className="text-[2.25rem] sm:text-5xl md:text-[3.4rem] font-extrabold tracking-[-0.03em] mb-5 leading-[1.05]">
              One workspace.
              <br className="hidden sm:block" /> Every AI tool you need.
            </h1>
            <p className="text-base sm:text-lg md:text-[1.1rem] text-white/70 max-w-2xl mx-auto leading-relaxed">
              Chat with the best models, generate images, rewrite content, and
              synthesize voice — all from a single dashboard with one
              subscription.
            </p>
          </div>

          <div
            className="mt-8 md:mt-10 flex gap-3 justify-center flex-wrap"
            {...fadeIn({ direction: "up", distance: 40, duration: 0.7 })}
          >
            <Link to="/signup" className={primaryBtn}>
              Get started for free
              <ArrowRight size={15} />
            </Link>
            <Link to="/pricing" className={secondaryBtn}>
              View pricing
            </Link>
          </div>

          <p className="text-[0.75rem] text-white/50 mt-6">
            No credit card required · Free plan included
          </p>
        </div>
      </section>

      {/* POWERED BY */}
      <section className="bg-white border-y border-border-soft px-5 py-10 md:px-6 md:py-12">
        <p className="text-[0.7rem] font-bold text-text-muted uppercase tracking-[0.18em] mb-5 text-center">
          Powered by industry-leading AI
        </p>
        <div className="max-w-[1100px] mx-auto flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-text-secondary text-sm font-semibold">
          <span>Google Gemini</span>
          <span className="text-text-muted">·</span>
          <span>OpenAI</span>
          <span className="text-text-muted">·</span>
          <span>Anthropic Claude</span>
          <span className="text-text-muted">·</span>
          <span>Groq · Llama</span>
          <span className="text-text-muted">·</span>
          <span>ElevenLabs</span>
          <span className="text-text-muted">·</span>
          <span>Hugging Face</span>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-bg-soft px-5 py-16 md:px-6 md:py-24 border-b border-border-soft">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-10 md:mb-14">
            <span className={eyebrow}>What's inside</span>
            <h2 className={sectionTitle}>
              Four core tools, one focused workspace.
            </h2>
            <p className={sectionLead}>
              Every Promptive feature is built around the same principle: do
              less, do it well, do it fast.
            </p>
          </div>

          <div className="grid gap-4 md:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group bg-white border border-border-soft rounded-xl p-5 transition-colors hover:border-brand-primary/30"
              >
                <div className="w-10 h-10 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-4 transition-colors group-hover:bg-brand-primary group-hover:text-white">
                  <f.icon size={18} />
                </div>
                <h3 className="text-[1.05rem] font-bold mb-1.5 text-text-primary tracking-tight">
                  {f.title}
                </h3>
                <p className="text-[0.9rem] leading-relaxed text-text-secondary">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white px-5 py-16 md:px-6 md:py-24">
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-10 md:mb-14">
            <span className={eyebrow}>How it works</span>
            <h2 className={sectionTitle}>From idea to output in three steps.</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3 max-w-[900px] mx-auto">
            {STEPS.map((s, i) => (
              <div
                key={s.title}
                className="bg-white border border-border-soft rounded-xl p-5"
              >
                <div className="text-[0.75rem] font-bold text-brand-primary mb-2">
                  Step {i + 1}
                </div>
                <h4 className="text-base font-bold mb-1.5 text-text-primary">
                  {s.title}
                </h4>
                <p className="text-sm leading-relaxed text-text-secondary">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="bg-bg-soft px-5 py-16 md:px-6 md:py-24 border-y border-border-soft">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-10 md:mb-14">
            <span className={eyebrow}>Why Promptive</span>
            <h2 className={sectionTitle}>
              Built for serious work, not demos.
            </h2>
          </div>

          <div className="grid gap-4 md:gap-5 grid-cols-1 md:grid-cols-3">
            {TRUST_POINTS.map((t) => (
              <div
                key={t.title}
                className="bg-white border border-border-soft rounded-xl p-5"
              >
                <div className="w-10 h-10 rounded-lg bg-bg-soft text-brand-primary flex items-center justify-center mb-4">
                  <t.icon size={18} />
                </div>
                <h3 className="text-base font-bold mb-1.5 text-text-primary">
                  {t.title}
                </h3>
                <p className="text-[0.9rem] leading-relaxed text-text-secondary">
                  {t.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING TEASER */}
      <section className="bg-white px-5 py-16 md:px-6 md:py-24">
        <div className="max-w-[800px] mx-auto text-center">
          <span className={eyebrow}>Pricing</span>
          <h2 className={sectionTitle}>Simple plans that grow with you.</h2>
          <p className={sectionLead}>
            Start free. Upgrade for premium models, more capacity, and voice
            synthesis. Cancel any time.
          </p>

          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-6 mb-8 text-sm text-text-secondary">
            <li className="inline-flex items-center gap-1.5">
              <Check size={14} className="text-brand-primary" /> Free tier
              forever
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Check size={14} className="text-brand-primary" /> Cancel
              anytime
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Check size={14} className="text-brand-primary" /> No setup fees
            </li>
          </ul>

          <Link to="/pricing" className={primaryBtn}>
            See pricing
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-gradient-to-br from-brand-primary via-[#062c5a] to-[#051a33] text-white px-5 py-20 md:px-6 md:py-24 text-center overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        />
        <div className="relative max-w-[700px] mx-auto">
          <h2 className="text-[1.85rem] sm:text-3xl md:text-[2.25rem] font-extrabold tracking-tight mb-3 leading-tight">
            Ready to build with AI?
          </h2>
          <p className="text-base text-white/70 mb-8">
            Start free. No credit card required.
          </p>
          <Link to="/signup" className={primaryBtn}>
            Create your account
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Landing;
