import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { fetchPlans } from "../api/payments.api";
import { useAuth } from "../auth/AuthContext";

const formatINR = (paise) => `₹${Math.round(paise / 100)}`;

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
      <section className="bg-gradient-to-b from-brand-primary via-[#062c5a] to-[#051a33] text-white px-5 py-20 md:px-8 md:py-28 text-center">
        <span className="inline-block text-[0.7rem] font-bold tracking-[0.18em] uppercase text-white/70 mb-4">
          Pricing
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Simple, predictable pricing
        </h1>
        <p className="text-base md:text-lg text-white/70 max-w-xl mx-auto">
          Start free. Upgrade when you need more capacity, premium models, or
          voice synthesis.
        </p>
      </section>

      <section className="bg-bg-soft border-y border-black/5 px-5 py-16 md:px-8 md:py-24">
        <div className="max-w-[1100px] mx-auto">
          {loading ? (
            <p className="text-center text-text-muted">Loading plans…</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {plans.map((plan) => {
                const isFree = plan.price === 0;
                const highlight = plan.id === "pro";
                return (
                  <div
                    key={plan.id}
                    className={`rounded-2xl bg-white border ${
                      highlight
                        ? "border-brand-primary/40"
                        : "border-border-soft"
                    } p-6 md:p-8 flex flex-col`}
                  >
                    {highlight && (
                      <span className="inline-flex items-center gap-1 self-start text-[0.65rem] font-bold uppercase tracking-[0.18em] text-brand-primary bg-brand-primary/10 px-2 py-1 rounded-full mb-3">
                        <Sparkles size={11} />
                        Most popular
                      </span>
                    )}
                    <h3 className="text-xl font-extrabold text-text-primary">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-text-secondary mt-1 mb-5 leading-relaxed">
                      {plan.description}
                    </p>

                    <div className="flex items-baseline gap-1.5 mb-5">
                      <span className="text-3xl md:text-[2rem] font-extrabold text-text-primary tracking-tight">
                        {isFree ? "₹0" : formatINR(plan.price)}
                      </span>
                      {!isFree && (
                        <span className="text-sm text-text-muted">/month</span>
                      )}
                    </div>

                    <ul className="flex flex-col gap-2.5 mb-6 text-[0.92rem] text-text-secondary">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2">
                          <Check
                            size={15}
                            className="text-brand-primary mt-0.5 shrink-0"
                          />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto">
                      {isFree ? (
                        <Link
                          to={isAuthenticated ? "/dashboard" : "/signup"}
                          className="block text-center w-full px-5 py-3 rounded-xl border border-border-soft text-sm font-semibold text-text-primary hover:bg-bg-soft transition-colors"
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
                          className="flex justify-center items-center gap-2 w-full px-5 py-3 rounded-xl bg-brand-primary hover:bg-[#032c5a] text-white text-sm font-semibold transition-colors"
                        >
                          Upgrade to {plan.name}
                          <ArrowRight size={15} />
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

      <section className="bg-white px-5 py-16 md:px-8 md:py-20 text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-3 text-text-primary">
          Questions about a plan?
        </h2>
        <p className="text-text-secondary max-w-xl mx-auto">
          Plans renew monthly and cancel any time. You keep access until the
          end of your current billing period.
        </p>
      </section>
    </main>
  );
};

export default Pricing;
