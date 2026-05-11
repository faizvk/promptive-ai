import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { fetchPlans } from "../api/payments.api";
import { useAuth } from "../auth/AuthContext";
import { fadeIn } from "../animations/FadeIn";

const formatINR = (paise) =>
  `₹${Math.round(paise / 100).toLocaleString("en-IN")}`;

const Pricing = () => {
  const { isAuthenticated } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans()
      .then((res) => setPlans(res.plans || []))
      .catch(() => setPlans([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="w-full overflow-x-hidden">
      {/* HERO */}
      <section className="relative bg-gradient-to-b from-brand-primary via-[#062c5a] to-[#051a33] text-white px-5 py-20 md:px-6 md:py-28 text-center overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        />
        <div
          className="relative max-w-[800px] mx-auto"
          {...fadeIn({ direction: "up", distance: 60, duration: 0.7 })}
        >
          <span className="inline-block text-[0.7rem] font-bold tracking-[0.18em] uppercase text-white/70 mb-4">
            Pricing
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[-0.025em] mb-3 leading-tight">
            Simple, predictable pricing.
          </h1>
          <p className="text-base md:text-lg text-white/70 max-w-xl mx-auto">
            Start free. Upgrade when you need more capacity, premium models, or
            voice synthesis.
          </p>
        </div>
      </section>

      {/* PLANS */}
      <section className="bg-bg-soft border-y border-border-soft px-5 py-14 md:px-6 md:py-20">
        <div
          className="max-w-[1100px] mx-auto"
          {...fadeIn({ direction: "up", distance: 60, duration: 0.8 })}
        >
          {loading ? (
            <p className="text-center text-text-muted text-sm">
              Loading plans…
            </p>
          ) : (
            <div className="grid gap-4 md:gap-5 md:grid-cols-3">
              {plans.map((plan) => {
                const isFree = plan.price === 0;
                const highlight = plan.id === "pro";
                return (
                  <div
                    key={plan.id}
                    className={`relative rounded-xl bg-white border ${
                      highlight ? "border-brand-primary/40" : "border-border-soft"
                    } p-6 flex flex-col transition-[transform,border-color] duration-200 hover:-translate-y-1 hover:border-brand-primary/40`}
                  >
                    {highlight && (
                      <span className="absolute -top-2.5 right-5 inline-flex items-center gap-1 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-brand-primary bg-white border border-brand-primary/30 px-2 py-0.5 rounded-full">
                        <Sparkles size={10} /> Popular
                      </span>
                    )}
                    <h3 className="text-base font-extrabold text-text-primary">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-text-muted mt-1 mb-5 leading-relaxed">
                      {plan.description}
                    </p>
                    <div className="flex items-baseline gap-1 mb-5">
                      <span className="text-3xl font-extrabold text-text-primary tracking-tight">
                        {isFree ? "₹0" : formatINR(plan.price)}
                      </span>
                      {!isFree && (
                        <span className="text-xs text-text-muted">/month</span>
                      )}
                    </div>
                    <ul className="flex flex-col gap-2 mb-6 text-[0.9rem] text-text-secondary">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-1.5">
                          <Check
                            size={13}
                            className="text-brand-primary mt-0.5 shrink-0"
                          />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto">
                      {isFree ? (
                        <Link
                          to={isAuthenticated ? "/dashboard" : "/signup"}
                          className="block text-center w-full px-4 py-2.5 rounded-lg border border-border-soft text-sm font-semibold text-text-primary hover:bg-bg-soft hover:border-text-muted/40 transition-[transform,background-color,border-color] duration-200 hover:-translate-y-0.5"
                        >
                          {isAuthenticated ? "Go to dashboard" : "Get started"}
                        </Link>
                      ) : (
                        <Link
                          to={
                            isAuthenticated
                              ? `/dashboard/billing?upgrade=${plan.id}`
                              : "/signup"
                          }
                          className="group flex justify-center items-center gap-1.5 w-full px-4 py-2.5 rounded-lg bg-brand-primary hover:bg-[#032c5a] text-white text-sm font-semibold transition-[transform,background-color] duration-200 hover:-translate-y-0.5"
                        >
                          Upgrade to {plan.name}
                          <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white px-5 py-14 md:px-6 md:py-20">
        <div
          className="max-w-[760px] mx-auto"
          {...fadeIn({ direction: "up", distance: 60, duration: 0.8 })}
        >
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-[-0.025em] text-text-primary text-center mb-8">
            Common questions
          </h2>
          <div className="grid gap-3">
            {[
              {
                q: "Can I cancel any time?",
                a: "Yes. You keep access until the end of your current billing period.",
              },
              {
                q: "What happens if I hit my plan limit?",
                a: "Your requests are blocked until the start of the next month, or upgrade for more capacity right away.",
              },
              {
                q: "Which AI models can I use?",
                a: "Free tier gets Gemini, Llama, GPT-4o mini, Claude Haiku. Pro and Business unlock GPT-4o and Claude Sonnet.",
              },
              {
                q: "Is voice synthesis included?",
                a: "Voice is on Pro (30 min/mo) and Business (5 hours/mo). Free plans don't include voice yet.",
              },
            ].map(({ q, a }) => (
              <div
                key={q}
                className="bg-bg-soft border border-border-soft rounded-xl p-5"
              >
                <h3 className="text-sm font-bold text-text-primary">{q}</h3>
                <p className="text-sm text-text-secondary mt-1.5 leading-relaxed">
                  {a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Pricing;
