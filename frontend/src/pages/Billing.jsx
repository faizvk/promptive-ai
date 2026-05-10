import React, { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Check, Sparkles, AlertCircle, ArrowRight } from "lucide-react";
import {
  fetchPlans,
  fetchSubscription,
  startSubscription,
  verifyPayment,
  cancelSubscription,
} from "../api/payments.api";

const RAZORPAY_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

let scriptPromise = null;
const loadRazorpay = () => {
  if (scriptPromise) return scriptPromise;
  if (window.Razorpay) return Promise.resolve();
  scriptPromise = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = RAZORPAY_SCRIPT;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load Razorpay"));
    document.head.appendChild(s);
  });
  return scriptPromise;
};

const formatINR = (paise) => `₹${Math.round(paise / 100)}`;

const Billing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [plans, setPlans] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [paymentsConfigured, setPaymentsConfigured] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [plansRes, subRes] = await Promise.all([
        fetchPlans(),
        fetchSubscription(),
      ]);
      setPlans(plansRes.plans || []);
      setPaymentsConfigured(plansRes.paymentsConfigured);
      setSubscription(subRes.subscription);
      setCurrentPlan(subRes.plan);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load billing");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleSubscribe = async (planId) => {
    setWorking(true);
    setError(null);
    setSuccess(null);
    try {
      await loadRazorpay();
      const res = await startSubscription(planId);

      const rzp = new window.Razorpay({
        key: res.razorpayKeyId,
        subscription_id: res.subscriptionId,
        name: "Promptive AI",
        description: `Upgrade to ${planId}`,
        theme: { color: "#043873" },
        handler: async (response) => {
          try {
            await verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_subscription_id: response.razorpay_subscription_id,
              razorpay_signature: response.razorpay_signature,
            });
            setSuccess("Subscription activated. Thanks!");
            await refresh();
          } catch (err) {
            setError(
              err.response?.data?.message || "Payment verification failed"
            );
          } finally {
            setWorking(false);
          }
        },
        modal: {
          ondismiss: () => setWorking(false),
        },
      });

      rzp.on("payment.failed", () => {
        setWorking(false);
        setError("Payment failed. Please try again.");
      });

      rzp.open();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Could not start checkout"
      );
      setWorking(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Cancel your subscription at the end of the current period?")) {
      return;
    }
    setWorking(true);
    try {
      await cancelSubscription();
      setSuccess(
        "Cancellation scheduled. You'll keep access until your current period ends."
      );
      await refresh();
    } catch (err) {
      setError(err.response?.data?.message || "Cancellation failed");
    } finally {
      setWorking(false);
    }
  };

  // Auto-trigger upgrade if ?upgrade=plan is in the URL.
  useEffect(() => {
    const upgrade = searchParams.get("upgrade");
    if (
      upgrade &&
      paymentsConfigured &&
      plans.length > 0 &&
      currentPlan?.id !== upgrade
    ) {
      handleSubscribe(upgrade);
      // Clear query param so we don't retrigger.
      const next = new URLSearchParams(searchParams);
      next.delete("upgrade");
      setSearchParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentsConfigured, plans, currentPlan]);

  const isOnPaidPlan =
    subscription?.plan && subscription.plan !== "free" &&
    subscription.status === "active";

  return (
    <div className="max-w-[1100px] mx-auto">
      <header className="mb-8 md:mb-10">
        <span className="inline-block text-[0.7rem] font-bold tracking-[0.18em] uppercase text-brand-primary/70 mb-2">
          Workspace
        </span>
        <h1 className="text-2xl md:text-[1.85rem] font-extrabold tracking-[-0.02em] text-text-primary mb-1">
          Billing &amp; plans
        </h1>
        <p className="text-sm md:text-[0.95rem] text-text-secondary">
          Upgrade to unlock premium models, more capacity, and voice synthesis.
        </p>
      </header>

      {error && (
        <div className="bg-bg-error border border-border-error text-text-error rounded-xl p-4 text-sm mb-5 flex items-start gap-2">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="bg-bg-soft border border-border-soft text-text-secondary rounded-xl p-4 text-sm mb-5 flex items-start gap-2">
          <Check size={16} className="mt-0.5 shrink-0 text-brand-primary" />
          {success}
        </div>
      )}

      {!paymentsConfigured && (
        <div className="bg-[#fffbe8] border border-[#f5e69a] text-[#5a4a00] rounded-xl p-4 text-sm mb-6">
          Payments are not configured on this server. Set
          <code className="font-mono mx-1">RAZORPAY_KEY_ID</code> and
          <code className="font-mono mx-1">RAZORPAY_KEY_SECRET</code> in the
          backend env to enable upgrades.
        </div>
      )}

      {loading ? (
        <p className="text-text-muted">Loading…</p>
      ) : (
        <>
          {/* Current plan */}
          <div className="bg-bg-surface border border-border-soft rounded-2xl p-5 md:p-6 mb-8">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <span className="text-[0.7rem] font-bold tracking-[0.18em] uppercase text-text-muted">
                  Current plan
                </span>
                <h2 className="text-xl font-extrabold text-text-primary mt-1">
                  {currentPlan?.name || "Free"}{" "}
                  {subscription?.cancelAtPeriodEnd && (
                    <span className="text-xs font-medium text-text-muted ml-2">
                      (cancels at period end)
                    </span>
                  )}
                </h2>
                {subscription?.currentPeriodEnd && (
                  <p className="text-sm text-text-muted mt-1">
                    Renews on{" "}
                    {new Date(
                      subscription.currentPeriodEnd
                    ).toLocaleDateString()}
                  </p>
                )}
              </div>
              {isOnPaidPlan && !subscription?.cancelAtPeriodEnd && (
                <button
                  onClick={handleCancel}
                  disabled={working}
                  className="text-xs font-semibold text-text-error hover:underline disabled:opacity-60"
                >
                  Cancel subscription
                </button>
              )}
            </div>
          </div>

          {/* Plan picker */}
          <div className="grid gap-5 md:grid-cols-3">
            {plans.map((plan) => {
              const isCurrent = currentPlan?.id === plan.id;
              const isFree = plan.price === 0;
              const highlight = plan.id === "pro";
              return (
                <div
                  key={plan.id}
                  className={`rounded-2xl bg-bg-surface border ${
                    isCurrent
                      ? "border-brand-primary"
                      : highlight
                      ? "border-brand-primary/30"
                      : "border-border-soft"
                  } p-5 md:p-6 flex flex-col`}
                >
                  {highlight && (
                    <span className="inline-flex items-center gap-1 self-start text-[0.65rem] font-bold uppercase tracking-[0.18em] text-brand-primary bg-brand-primary/10 px-2 py-1 rounded-full mb-2">
                      <Sparkles size={11} /> Most popular
                    </span>
                  )}
                  <h3 className="text-lg font-extrabold text-text-primary">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mt-1 mb-4">
                    <span className="text-2xl font-extrabold text-text-primary">
                      {isFree ? "₹0" : formatINR(plan.price)}
                    </span>
                    {!isFree && (
                      <span className="text-xs text-text-muted">/month</span>
                    )}
                  </div>
                  <ul className="flex flex-col gap-2 mb-5 text-[0.85rem] text-text-secondary">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-1.5">
                        <Check
                          size={13}
                          className="text-brand-primary mt-0.5 shrink-0"
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto">
                    {isCurrent ? (
                      <button
                        disabled
                        className="w-full px-4 py-2.5 rounded-xl border border-border-soft text-sm font-semibold text-text-muted"
                      >
                        Current plan
                      </button>
                    ) : isFree ? (
                      <Link
                        to="/dashboard"
                        className="block text-center w-full px-4 py-2.5 rounded-xl border border-border-soft text-sm font-semibold text-text-primary hover:bg-bg-soft"
                      >
                        Free plan
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleSubscribe(plan.id)}
                        disabled={working || !paymentsConfigured}
                        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-[#032c5a] text-white text-sm font-semibold disabled:opacity-60 transition-colors"
                      >
                        {working ? "Working…" : `Upgrade to ${plan.name}`}
                        {!working && <ArrowRight size={14} />}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Billing;
