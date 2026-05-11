import React from "react";
import { Link } from "react-router-dom";
import {
  MessageSquare,
  Sparkles,
  Layers,
  Shield,
  ArrowRight,
  History,
  BookOpen,
  Briefcase,
} from "lucide-react";
import { fadeIn } from "../animations/FadeIn";

const primaryBtn =
  "group bg-brand-primary hover:bg-[#032c5a] text-white px-6 py-3 rounded-xl text-sm font-semibold inline-flex items-center gap-2 transition-[transform,background-color] duration-200 hover:-translate-y-0.5 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 focus-visible:ring-offset-2";

const secondaryBtn =
  "border border-white/25 bg-white/5 backdrop-blur-sm text-white px-6 py-3 rounded-xl text-sm font-semibold inline-flex items-center gap-2 hover:bg-white/10 hover:border-white/40 transition-[transform,background-color,border-color] duration-200 hover:-translate-y-0.5 no-underline";

const eyebrow =
  "inline-block text-[0.7rem] font-bold tracking-[0.18em] uppercase text-brand-primary/70 mb-3";

const sectionTitle =
  "text-[1.6rem] sm:text-3xl md:text-[2.25rem] font-extrabold tracking-[-0.025em] text-text-primary leading-tight";

const sectionLead =
  "mt-3 text-sm sm:text-base text-text-secondary leading-relaxed max-w-xl mx-auto";

const stepCard =
  "group bg-bg-surface border border-border-soft rounded-xl p-6 transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-brand-primary/30";

const stepIcon =
  "w-10 h-10 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-4 transition-colors group-hover:bg-brand-primary group-hover:text-white";

const MODELS = [
  {
    name: "Google Gemini 2.5",
    description: "Fast, multimodal, great for everyday questions.",
    tier: "Free",
  },
  {
    name: "OpenAI GPT-4o",
    description: "Flagship reasoning model for complex tasks.",
    tier: "Pro",
  },
  {
    name: "Anthropic Claude 3.5 Sonnet",
    description: "Long context, careful reasoning, great writing.",
    tier: "Pro",
  },
  {
    name: "Meta Llama 3.3 70B",
    description: "Open Meta model served at ultra-low latency.",
    tier: "Free",
  },
  {
    name: "OpenAI GPT-4o mini",
    description: "Affordable everyday model, super-fast.",
    tier: "Free",
  },
  {
    name: "Anthropic Claude Haiku",
    description: "Snappy answers from Anthropic.",
    tier: "Free",
  },
];

const USE_CASES = [
  {
    icon: BookOpen,
    title: "Researchers",
    description:
      "Ask follow-up questions, summarize papers, compare models on the same prompt.",
  },
  {
    icon: Briefcase,
    title: "Professionals",
    description:
      "Draft emails, prep meeting notes, summarize threads — switch models when one stalls.",
  },
  {
    icon: Sparkles,
    title: "Builders",
    description:
      "Pair-program with Claude or GPT-4o, then save the conversation for later reference.",
  },
];

const PublicChat = () => {
  return (
    <main className="w-full overflow-x-hidden">
      {/* HERO */}
      <section className="relative bg-gradient-to-b from-brand-primary via-[#062c5a] to-[#051a33] text-white px-5 py-20 sm:py-24 md:px-8 md:py-32 text-center overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        />

        <div className="relative max-w-[900px] mx-auto">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 border border-white/15 rounded-full text-[0.7rem] sm:text-xs font-semibold tracking-[0.12em] mb-6 sm:mb-8 uppercase backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-btn-secondary" />
            Multi-model AI Chat
          </span>
          <div
            {...fadeIn({
              direction: "up",
              distance: 80,
              duration: 0.9,
            })}
          >
            <h1 className="text-3xl sm:text-5xl md:text-[3.5rem] font-extrabold tracking-[-0.025em] leading-[1.1] mb-5 md:mb-6">
              One chat.{" "}
              <span className="text-btn-secondary">Every model.</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed">
              Chat with GPT-4o, Claude 3.5, Gemini, and Llama from a single
              dashboard. Switch models mid-conversation. Your history is saved
              automatically.
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
              Start chatting <ArrowRight size={15} />
            </Link>
            <Link to="/pricing" className={secondaryBtn}>
              See pricing
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
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
            <h2 className={sectionTitle}>Pick. Ask. Save.</h2>
            <p className={sectionLead}>
              Promptive's chat workspace handles the routing, history, and
              model-switching so you can focus on the question.
            </p>
          </div>

          <div
            className="grid gap-4 md:gap-5 md:grid-cols-3"
            {...fadeIn({
              direction: "right",
              distance: 80,
              duration: 0.9,
            })}
          >
            <div className={stepCard}>
              <div className={stepIcon}>
                <Layers size={18} />
              </div>
              <h4 className="text-base font-bold mb-1.5 text-text-primary tracking-tight">
                Pick a model
              </h4>
              <p className="text-[0.9rem] leading-relaxed text-text-secondary">
                Choose from GPT-4o, Claude, Gemini, Llama. Free models are
                always available; premium unlocks with Pro.
              </p>
            </div>
            <div className={stepCard}>
              <div className={stepIcon}>
                <MessageSquare size={18} />
              </div>
              <h4 className="text-base font-bold mb-1.5 text-text-primary tracking-tight">
                Ask anything
              </h4>
              <p className="text-[0.9rem] leading-relaxed text-text-secondary">
                Type your question. Conversations support context windows up to
                the model's limit, with no extra setup.
              </p>
            </div>
            <div className={stepCard}>
              <div className={stepIcon}>
                <History size={18} />
              </div>
              <h4 className="text-base font-bold mb-1.5 text-text-primary tracking-tight">
                Saved automatically
              </h4>
              <p className="text-[0.9rem] leading-relaxed text-text-secondary">
                Every chat is named, dated, and searchable. Resume any
                conversation from your dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MODELS GRID */}
      <section
        className="bg-bg-soft px-5 py-16 md:px-6 md:py-24 border-y border-border-soft"
        {...fadeIn({
          direction: "up",
          distance: 80,
          duration: 0.9,
        })}
      >
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-10 md:mb-14">
            <span className={eyebrow}>Models you can pick</span>
            <h2 className={sectionTitle}>Six models. Zero extra accounts.</h2>
            <p className={sectionLead}>
              All routed through one API key, one bill, one dashboard.
            </p>
          </div>
          <div
            className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            {...fadeIn({
              direction: "left",
              distance: 80,
              duration: 0.9,
            })}
          >
            {MODELS.map((m) => (
              <div
                key={m.name}
                className="bg-white border border-border-soft rounded-xl p-5 transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-brand-primary/30"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-text-primary tracking-tight">
                    {m.name}
                  </h3>
                  <span className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-full">
                    {m.tier}
                  </span>
                </div>
                <p className="text-[0.85rem] leading-relaxed text-text-secondary">
                  {m.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEMO PEEK */}
      <section
        className="bg-white px-5 py-16 md:px-6 md:py-24"
        {...fadeIn({
          direction: "up",
          distance: 80,
          duration: 0.9,
        })}
      >
        <div className="max-w-[680px] mx-auto">
          <div className="text-center mb-8 md:mb-10">
            <span className={eyebrow}>Workspace preview</span>
            <h2 className={sectionTitle}>Built for serious conversations.</h2>
            <p className={sectionLead}>
              A clean, distraction-free interface for chatting with multiple
              models.
            </p>
          </div>

          <div className="relative rounded-2xl border border-border-soft bg-bg-surface p-5 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-text-primary">
                Marketing copy review
              </span>
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-text-muted bg-bg-soft border border-border-soft px-2 py-0.5 rounded-full">
                Claude 3.5 Sonnet
              </span>
            </div>

            <div className="flex flex-col gap-3 mb-4 opacity-50 pointer-events-none">
              <div className="self-end max-w-[80%] rounded-2xl px-4 py-2.5 bg-brand-primary text-white text-[0.9rem]">
                Can you rephrase this for a more confident tone?
              </div>
              <div className="self-start max-w-[80%] rounded-2xl px-4 py-2.5 bg-bg-soft border border-border-soft text-text-primary text-[0.9rem]">
                Sure. Here are three sharper versions you can A/B test…
              </div>
            </div>

            <div className="border border-dashed border-border-soft rounded-lg p-6 text-center bg-bg-soft/40">
              <Shield
                size={20}
                className="mx-auto mb-3 text-brand-primary"
              />
              <p className="text-sm font-semibold text-text-primary mb-1">
                Sign in to start chatting
              </p>
              <p className="text-xs text-text-muted mb-4">
                Free models, no credit card needed.
              </p>
              <Link
                to="/signup"
                className="inline-flex items-center gap-1 text-sm font-semibold text-brand-primary hover:gap-2 transition-all"
              >
                Create your free account <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section
        className="bg-bg-soft px-5 py-16 md:px-6 md:py-24 border-t border-border-soft"
        {...fadeIn({
          direction: "up",
          distance: 80,
          duration: 0.9,
        })}
      >
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-10 md:mb-14">
            <span className={eyebrow}>Who it's for</span>
            <h2 className={sectionTitle}>Built for anyone who thinks in words.</h2>
          </div>

          <div className="grid gap-4 md:gap-5 grid-cols-1 md:grid-cols-3">
            {USE_CASES.map((u) => (
              <div
                key={u.title}
                className="bg-white border border-border-soft rounded-xl p-5 transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-brand-primary/30"
              >
                <div className="w-10 h-10 rounded-lg bg-bg-soft text-brand-primary flex items-center justify-center mb-4">
                  <u.icon size={18} />
                </div>
                <h3 className="text-base font-bold mb-1.5 text-text-primary">
                  {u.title}
                </h3>
                <p className="text-[0.9rem] leading-relaxed text-text-secondary">
                  {u.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
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
            Talk to any model. Right now.
          </h2>
          <p className="text-base md:text-lg text-white/70 mb-8 md:mb-10">
            Free models available immediately. No credit card required.
          </p>
          <Link to="/signup" className={primaryBtn}>
            Get started for free <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default PublicChat;
