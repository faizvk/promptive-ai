import React, { useEffect, useState } from "react";
import {
  Image,
  FileText,
  MessageSquare,
  Mic,
  ArrowRight,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { fetchDashboardOverview } from "../../api/dashboard.api";
import { useAuth } from "../../auth/AuthContext";

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white border border-border-soft rounded-xl ${className}`}
  >
    {children}
  </div>
);

const Overview = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardOverview()
      .then((res) =>
        setData({ stats: res.stats, plan: res.plan, usage: res.usage })
      )
      .catch((err) => console.error("Overview load failed", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-text-muted text-sm py-12 text-center">Loading…</div>
    );
  }

  const stats = data?.stats || {};
  const usage = data?.usage || {};
  const plan = data?.plan;

  const hello = user?.name ? user.name.split(" ")[0] : "there";

  const metrics = [
    {
      icon: <MessageSquare size={15} />,
      label: "Chats",
      value: stats.chatsStarted ?? 0,
    },
    {
      icon: <Image size={15} />,
      label: "Images",
      value: stats.imagesGenerated ?? 0,
    },
    {
      icon: <FileText size={15} />,
      label: "Rewrites",
      value: stats.rewritesDone ?? 0,
    },
    {
      icon: <Mic size={15} />,
      label: "Voice clips",
      value: stats.voicesGenerated ?? 0,
    },
  ];

  const usageItems = plan
    ? [
        { label: "Chat", used: usage.chat ?? 0, limit: plan.limits.chat },
        { label: "Image", used: usage.image ?? 0, limit: plan.limits.image },
        {
          label: "Rewrite",
          used: usage.rewrite ?? 0,
          limit: plan.limits.rewrite,
        },
        {
          label: "Voice (min)",
          used: Math.round(usage.voice ?? 0),
          limit: plan.limits.voice,
        },
      ]
    : [];

  const actions = [
    {
      to: "/dashboard/chat",
      icon: <MessageSquare size={18} />,
      title: "Start a chat",
      desc: "Talk to GPT, Claude, Gemini, Llama",
    },
    {
      to: "/dashboard/image",
      icon: <Image size={18} />,
      title: "Generate image",
      desc: "Turn prompts into visuals",
    },
    {
      to: "/dashboard/rewrite",
      icon: <FileText size={18} />,
      title: "Rewrite content",
      desc: "Refine tone and clarity",
    },
    {
      to: "/dashboard/voice",
      icon: <Mic size={18} />,
      title: "Voice synthesis",
      desc: "Text-to-speech in real voices",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Hero / greeting */}
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[1.6rem] md:text-3xl font-extrabold tracking-[-0.02em] text-text-primary">
            Welcome back, {hello}.
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Here's what's happening in your workspace this month.
          </p>
        </div>
        {plan && (
          <Link
            to="/dashboard/billing"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border-soft bg-white hover:border-brand-primary/30 transition-colors text-xs font-semibold text-text-secondary"
          >
            <Sparkles size={13} className="text-brand-primary" />
            {plan.name} plan
            <ArrowRight size={12} />
          </Link>
        )}
      </header>

      {/* Metrics strip */}
      <Card className="p-1">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-border-soft">
          {metrics.map((m) => (
            <div key={m.label} className="px-4 md:px-5 py-4">
              <div className="flex items-center gap-2 text-text-muted">
                {m.icon}
                <span className="text-[0.7rem] uppercase font-bold tracking-[0.12em]">
                  {m.label}
                </span>
              </div>
              <div className="text-2xl md:text-3xl font-extrabold text-text-primary tracking-tight mt-1">
                {m.value}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Two-column: usage + quick actions */}
      <div className="grid gap-5 md:gap-6 grid-cols-1 lg:grid-cols-[1fr_1.2fr]">
        {plan && (
          <Card className="p-5 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-text-secondary">
                <TrendingUp size={16} className="text-brand-primary" />
                <h2 className="text-sm font-bold text-text-primary">
                  This month's usage
                </h2>
              </div>
              <span className="text-[0.7rem] text-text-muted">
                {usage.period}
              </span>
            </div>
            <div className="flex flex-col gap-4">
              {usageItems.map((u) => {
                const noLimit = u.limit === 0;
                const pct = noLimit
                  ? 0
                  : Math.min(100, Math.round((u.used / u.limit) * 100));
                return (
                  <div key={u.label}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="text-text-secondary">{u.label}</span>
                      {noLimit ? (
                        <span className="text-xs text-text-muted">
                          Not on plan
                        </span>
                      ) : (
                        <span className="text-text-primary font-medium tracking-tight">
                          {u.used} <span className="text-text-muted">/</span>{" "}
                          {u.limit}
                        </span>
                      )}
                    </div>
                    <div className="w-full h-1 bg-bg-soft rounded-full overflow-hidden">
                      {!noLimit && (
                        <div
                          className={`h-full transition-[width] ${
                            pct >= 90
                              ? "bg-text-error"
                              : pct >= 70
                              ? "bg-[#f59e0b]"
                              : "bg-brand-primary"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <Link
              to="/dashboard/billing"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-primary hover:underline mt-5"
            >
              Upgrade for more capacity <ArrowRight size={12} />
            </Link>
          </Card>
        )}

        <Card className="p-5 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-text-primary">
              Quick actions
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {actions.map((a) => (
              <Link
                key={a.to}
                to={a.to}
                className="group flex flex-col gap-2 p-4 rounded-lg border border-border-soft hover:border-brand-primary/30 hover:bg-bg-soft transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-colors">
                  {a.icon}
                </div>
                <div>
                  <div className="text-sm font-bold text-text-primary leading-tight">
                    {a.title}
                  </div>
                  <p className="text-[0.75rem] text-text-muted mt-0.5 leading-snug">
                    {a.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
