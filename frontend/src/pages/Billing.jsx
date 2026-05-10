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

const formatINR = (paise) => `₹${Math.round(paise / 100).toLocaleString("en-IN")}`;

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
        modal: { ondismiss: () => setWorking(false) },
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
    if (
      !confirm(
        "Cancel your subscription at the end of the current period? You'll keep access until then."
      )
    ) {
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

  useEffect(() => {
    const upgrade = searchParams.get("upgrade");
    if (
      upgrade &&
      paymentsConfigured &&
      plans.length > 0 &&
      currentPlan?.id !== upgrade
    ) {
      handleSubscribe(upgrade);
      const next = new URLSearchParams(searchParams);
      next.delete("upgrade");
      setSearchParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentsConfigured, plans, currentPlan]);

  const isOnPaidPlan =
    subscription?.plan &&
    subscription.plan !== "free" &&
    subscription.status === "active";

  return (
    <div className="flex flex-col gap-5">
      <header>
        <h1 className="text-[1.6rem] md:text-3xl font-extrabold tracking-[-0.02em] text-text-primary">
          Plan &amp; billing
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Manage your subscription and unlock more capacity.
        </p>
      </header>

      {error && (
        <div className="bg-bg-error border border-border-error text-text-error rounded-lg p-3 text-sm flex items-start gap-2">
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="bg-bg-soft border border-border-soft text-text-secondary rounded-lg p-3 text-sm flex items-start gap-2">
          <Check size={15} className="mt-0.5 shrink-0 text-brand-primary" />
          {success}
        </div>
      )}

      {!paymentsConfigured && (
        <div className="bg-[#fffbe8] border border-[#f5e69a] text-[#5a4a00] rounded-lg p-3.5 text-sm">
          Payments are not configured on this server. Set
          <code className="font-mono mx-1">RAZORPAY_KEY_ID</code> and
          <code className="font-mono mx-1">RAZORPAY_KEY_SECRET</code> in the
          backend env to enable upgrades.
        </div>
      )}

      {loading ? (
        <div className="text-text-muted text-sm py-12 text-center">
          Loading…
        </div>
      ) : (
        <>
          {/* Current plan summary */}
          <div className="bg-white border border-border-soft rounded-xl p-5 md:p-6 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <span className="text-[0.65rem] font-bold tracking-[0.18em] uppercase text-text-muted">
                Current plan
              </span>
              <h2 className="text-xl font-extrabold text-text-primary mt-1 flex items-center gap-2">
                {currentPlan?.name || "Free"}
                {subscription?.cancelAtPeriodEnd && (
                  <span className="text-[0.65rem] font-medium text-text-muted bg-bg-soft border border-border-soft rounded-full px-2 py-0.5">
                    Cancels at period end
                  </span>
                )}
              </h2>
              {subscription?.currentPeriodEnd && (
                <p className="text-sm text-text-muted mt-1">
                  Renews on{" "}
                  {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
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

          {/* Plan picker */}
          <div className="grid gap-4 md:grid-cols-3">
            {plans.map((plan) => {
              const isCurrent = currentPlan?.id === plan.id;
              const isFree = plan.price === 0;
              const highlight = plan.id === "pro";
              return (
                <div
                  key={plan.id}
                  className={`rounded-xl bg-white border ${
                    isCurrent
                      ? "border-brand-primary ring-2 ring-brand-primary/10"
                      : highlight
                      ? "border-brand-primary/40"
                      : "border-border-soft"
                  } p-5 flex flex-col`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-base font-extrabold text-text-primary">
                      {plan.name}
                    </h3>
                    {highlight && (
                      <span className="inline-flex items-center gap-1 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-full">
                        <Sparkles size={10} /> Popular
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-2xl font-extrabold text-text-primary">
                      {isFree ? "₹0" : formatINR(plan.price)}
                    </span>
                    {!isFree && (
                      <span className="text-xs text-text-muted">/mo</span>
                    )}
                  </div>
                  <ul className="flex flex-col gap-1.5 mb-4 text-[0.85rem] text-text-secondary">
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
                    {isCurrent ? (
                      <button
                        disabled
                        className="w-full px-3 py-2 rounded-lg border border-border-soft text-sm font-semibold text-text-muted"
                      >
                        Current plan
                      </button>
                    ) : isFree ? (
                      <Link
                        to="/dashboard"
                        className="block text-center w-full px-3 py-2 rounded-lg border border-border-soft text-sm font-semibold text-text-primary hover:bg-bg-soft"
                      >
                        Free plan
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleSubscribe(plan.id)}
                        disabled={working || !paymentsConfigured}
                        className="flex items-center justify-center gap-1.5 w-full px-3 py-2 rounded-lg bg-brand-primary hover:bg-[#032c5a] text-white text-sm font-semibold disabled:opacity-60 transition-colors"
                      >
                        {working ? "Working…" : `Upgrade to ${plan.name}`}
                        {!working && <ArrowRight size={13} />}
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
