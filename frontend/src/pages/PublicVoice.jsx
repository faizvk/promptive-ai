import React from "react";
import { Link } from "react-router-dom";
import {
  Mic,
  Sparkles,
  Shield,
  ArrowRight,
  Volume2,
  Download,
  Languages,
  Wand2,
  Headphones,
  Megaphone,
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

const VOICES = [
  { name: "Rachel", description: "Calm, neutral American female", provider: "ElevenLabs" },
  { name: "Josh", description: "Deep American male", provider: "ElevenLabs" },
  { name: "Bella", description: "Warm American female", provider: "ElevenLabs" },
  { name: "Domi", description: "Confident American female", provider: "ElevenLabs" },
  { name: "Nova", description: "OpenAI premium voice", provider: "OpenAI" },
  { name: "Onyx", description: "OpenAI deep authoritative voice", provider: "OpenAI" },
];

const USE_CASES = [
  {
    icon: Headphones,
    title: "Podcasters",
    description: "Generate intros, outros, or whole episodes when guests can't record.",
  },
  {
    icon: Megaphone,
    title: "Marketers",
    description: "Create ad voiceovers and social-media narration in under a minute.",
  },
  {
    icon: Wand2,
    title: "Creators",
    description: "Add narration to videos, lessons, and walkthroughs without a microphone.",
  },
];

const PublicVoice = () => {
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
            AI Voice Synthesis
          </span>
          <div
            {...fadeIn({
              direction: "up",
              distance: 80,
              duration: 0.9,
            })}
          >
            <h1 className="text-3xl sm:text-5xl md:text-[3.5rem] font-extrabold tracking-[-0.025em] leading-[1.1] mb-5 md:mb-6">
              Studio-grade voiceovers,{" "}
              <span className="text-btn-secondary">from your keyboard.</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed">
              Convert any text into natural-sounding speech using voices from
              ElevenLabs and OpenAI. Download as MP3 in seconds.
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
              Try voice synthesis <ArrowRight size={15} />
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
            <h2 className={sectionTitle}>From text to audio in seconds.</h2>
            <p className={sectionLead}>
              Three steps from a paragraph of text to a downloadable MP3.
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
                <Wand2 size={18} />
              </div>
              <h4 className="text-base font-bold mb-1.5 text-text-primary tracking-tight">
                Paste your text
              </h4>
              <p className="text-[0.9rem] leading-relaxed text-text-secondary">
                Drop in up to 2,000 characters per request. Plain text, no
                special markup needed.
              </p>
            </div>
            <div className={stepCard}>
              <div className={stepIcon}>
                <Volume2 size={18} />
              </div>
              <h4 className="text-base font-bold mb-1.5 text-text-primary tracking-tight">
                Pick a voice
              </h4>
              <p className="text-[0.9rem] leading-relaxed text-text-secondary">
                Choose from premium ElevenLabs voices or OpenAI's six TTS
                voices. Each has a distinct personality.
              </p>
            </div>
            <div className={stepCard}>
              <div className={stepIcon}>
                <Download size={18} />
              </div>
              <h4 className="text-base font-bold mb-1.5 text-text-primary tracking-tight">
                Generate &amp; download
              </h4>
              <p className="text-[0.9rem] leading-relaxed text-text-secondary">
                Preview the audio inline, then download the MP3 with one click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VOICES GRID */}
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
            <span className={eyebrow}>Voices in the catalog</span>
            <h2 className={sectionTitle}>Pick the right voice for the moment.</h2>
            <p className={sectionLead}>
              Multiple providers, one workflow. Use one for narration, another
              for ads.
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
            {VOICES.map((v) => (
              <div
                key={v.name}
                className="bg-white border border-border-soft rounded-xl p-5 flex items-center gap-4 transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-brand-primary/30"
              >
                <div className="w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
                  <Volume2 size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-text-primary tracking-tight truncate">
                      {v.name}
                    </h3>
                    <span className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-text-muted bg-bg-soft border border-border-soft px-1.5 py-0.5 rounded-full whitespace-nowrap shrink-0">
                      {v.provider}
                    </span>
                  </div>
                  <p className="text-[0.85rem] text-text-secondary truncate mt-0.5">
                    {v.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEMO */}
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
            <h2 className={sectionTitle}>Clean voice workspace.</h2>
            <p className={sectionLead}>
              Sign in to generate real audio. Free tier doesn't include voice
              yet — upgrade for 30 minutes a month.
            </p>
          </div>

          <div className="relative rounded-2xl border border-border-soft bg-bg-surface p-5 md:p-6">
            <div className="flex flex-col gap-3 opacity-50 pointer-events-none">
              <select className="w-full p-3 rounded-lg border border-border-soft bg-bg-soft text-sm" disabled>
                <option>Rachel — Calm American female · ElevenLabs</option>
              </select>
              <textarea
                placeholder="Once upon a time, in a land far away, there lived a curious little robot…"
                disabled
                rows={4}
                className="w-full p-3.5 rounded-lg border border-border-soft bg-bg-soft text-sm resize-none"
              />
              <button
                disabled
                className="w-full p-3 rounded-lg border-0 bg-brand-primary text-white text-sm font-semibold"
              >
                Generate audio
              </button>
            </div>

            <div className="mt-5 border border-dashed border-border-soft rounded-lg p-6 text-center bg-bg-soft/40">
              <Shield
                size={20}
                className="mx-auto mb-3 text-brand-primary"
              />
              <p className="text-sm font-semibold text-text-primary mb-1">
                Available on Pro &amp; Business
              </p>
              <p className="text-xs text-text-muted mb-4">
                30 voice minutes on Pro, 5 hours on Business.
              </p>
              <Link
                to="/pricing"
                className="inline-flex items-center gap-1 text-sm font-semibold text-brand-primary hover:gap-2 transition-all"
              >
                Compare plans <ArrowRight size={14} />
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
            <span className={eyebrow}>Who uses it</span>
            <h2 className={sectionTitle}>Voice for everyone who ships.</h2>
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
            Give your text a voice.
          </h2>
          <p className="text-base md:text-lg text-white/70 mb-8 md:mb-10">
            Sign up free, upgrade when you're ready to generate audio.
          </p>
          <Link to="/signup" className={primaryBtn}>
            Create your account <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default PublicVoice;
