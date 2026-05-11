import React, { useEffect, useState } from "react";
import {
  Image,
  FileText,
  MessageSquare,
  Mic,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Clock,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { fetchDashboardOverview } from "../../api/dashboard.api";
import { fetchHistory } from "../../api/history.api";
import { useAuth } from "../../auth/AuthContext";

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white border border-border-soft rounded-xl ${className}`}
  >
    {children}
  </div>
);

const greeting = () => {
  const h = new Date().getHours();
  if (h < 5) return "Working late";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  if (h < 22) return "Good evening";
  return "Working late";
};

const formatRelative = (date) => {
  if (!date) return "";
  const diff = Date.now() - new Date(date).getTime();
  const min = Math.round(diff / 60000);
  if (min < 1) return "Just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.round(hr / 24);
  return `${d}d ago`;
};

const Overview = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    let cancelled = false;
    const loadAll = async () => {
      try {
        const [overview, imgHistory, txtHistory] = await Promise.all([
          fetchDashboardOverview(),
          fetchHistory({ type: "image" }).catch(() => ({ items: [] })),
          fetchHistory({ type: "rewrite" }).catch(() => ({ items: [] })),
        ]);
        if (cancelled) return;
        setData({
          stats: overview.stats,
          plan: overview.plan,
          usage: overview.usage,
        });
        const items = [
          ...(imgHistory.items || []).slice(0, 5).map((i) => ({
            id: i._id,
            kind: "image",
            label: i.prompt,
            url: i.imageUrl,
            createdAt: i.createdAt,
          })),
          ...(txtHistory.items || []).slice(0, 5).map((i) => ({
            id: i._id,
            kind: "rewrite",
            label: i.rewrittenText || i.originalText,
            createdAt: i.createdAt,
          })),
        ]
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime()
          )
          .slice(0, 6);
        setRecent(items);
      } catch (err) {
        console.error("Overview load failed", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadAll();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = data?.stats || {};
  const usage = data?.usage || {};
  const plan = data?.plan;
  const firstName = user?.name ? user.name.split(" ")[0] : "there";

  const metrics = [
    {
      to: "/dashboard/chat",
      icon: <MessageSquare size={15} />,
      label: "Chats",
      value: stats.chatsStarted ?? 0,
    },
    {
      to: "/dashboard/image",
      icon: <Image size={15} />,
      label: "Images",
      value: stats.imagesGenerated ?? 0,
    },
    {
      to: "/dashboard/rewrite",
      icon: <FileText size={15} />,
      label: "Rewrites",
      value: stats.rewritesDone ?? 0,
    },
    {
      to: "/dashboard/voice",
      icon: <Mic size={15} />,
      label: "Voice clips",
      value: stats.voicesGenerated ?? 0,
    },
  ];

  const usageItems = plan
    ? [
        { label: "Chat messages", used: usage.chat ?? 0, limit: plan.limits.chat },
        { label: "Images", used: usage.image ?? 0, limit: plan.limits.image },
        {
          label: "Rewrites",
          used: usage.rewrite ?? 0,
          limit: plan.limits.rewrite,
        },
        {
          label: "Voice minutes",
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
      desc: "GPT, Claude, Gemini, Llama",
    },
    {
      to: "/dashboard/image",
      icon: <Image size={18} />,
      title: "Generate image",
      desc: "Prompts to visuals",
    },
    {
      to: "/dashboard/rewrite",
      icon: <FileText size={18} />,
      title: "Rewrite content",
      desc: "Any tone, any length",
    },
    {
      to: "/dashboard/voice",
      icon: <Mic size={18} />,
      title: "Voice synthesis",
      desc: "Text → studio audio",
    },
  ];

  if (loading) {
    return (
      <div className="text-text-muted text-sm py-12 text-center">Loading…</div>
    );
  }

  const isFreePlan = !plan || plan.id === "free";

  return (
    <div className="flex flex-col gap-6">
      {/* Hero — greeting */}
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-sm text-text-muted">{greeting()},</p>
          <h1 className="text-[1.75rem] md:text-[2.25rem] font-extrabold tracking-[-0.025em] text-text-primary leading-tight">
            {firstName}.
          </h1>
        </div>
        {plan && (
          <Link
            to="/dashboard/billing"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border-soft bg-white hover:border-brand-primary/30 transition-colors text-xs font-semibold text-text-secondary no-underline"
          >
            <Sparkles size={13} className="text-brand-primary" />
            {plan.name} plan
            <ArrowRight size={12} />
          </Link>
        )}
      </header>

      {/* Metrics strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {metrics.map((m) => (
          <Link
            key={m.label}
            to={m.to}
            className="group bg-white border border-border-soft rounded-xl p-4 md:p-5 transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-brand-primary/30 no-underline"
          >
            <div className="flex items-center gap-2 text-text-muted mb-3">
              {m.icon}
              <span className="text-[0.65rem] uppercase font-bold tracking-[0.14em]">
                {m.label}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl md:text-[2rem] font-extrabold text-text-primary tracking-tight tabular-nums">
                {m.value}
              </span>
              <ArrowRight
                size={14}
                className="text-text-muted opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-brand-primary transition-all"
              />
            </div>
          </Link>
        ))}
      </div>

      {/* Upgrade hero (free plan only) */}
      {isFreePlan && (
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-brand-primary via-[#062c5a] to-[#051a33] text-white p-5 md:p-6">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_at_top_right,black_20%,transparent_70%)]"
          />
          <div className="relative flex items-center justify-between gap-4 flex-wrap">
            <div>
              <span className="inline-flex items-center gap-2 px-2.5 py-1 bg-white/10 border border-white/15 rounded-full text-[0.65rem] font-bold tracking-[0.14em] uppercase backdrop-blur-sm mb-3">
                <Sparkles size={11} className="text-btn-secondary" /> Upgrade
              </span>
              <h3 className="text-lg md:text-xl font-extrabold tracking-tight mb-1">
                Unlock GPT-4o, Claude Sonnet, and voice synthesis.
              </h3>
              <p className="text-sm text-white/70 max-w-md">
                Pro starts at ₹499/month with 100 images, 1,000 chats and 30
                voice minutes.
              </p>
            </div>
            <Link
              to="/dashboard/billing"
              className="inline-flex items-center gap-1.5 bg-white text-brand-primary hover:bg-bg-soft px-4 py-2 rounded-lg text-sm font-semibold transition-[transform,background-color] duration-200 hover:-translate-y-0.5 no-underline"
            >
              See plans <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}

      {/* Usage + Quick actions */}
      <div className="grid gap-4 md:gap-5 grid-cols-1 lg:grid-cols-[1fr_1.1fr]">
        {plan && (
          <Card className="p-5 md:p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2 text-text-secondary">
                <TrendingUp size={15} className="text-brand-primary" />
                <h2 className="text-sm font-bold text-text-primary">
                  This month's usage
                </h2>
              </div>
              <span className="text-[0.65rem] text-text-muted font-medium">
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
                        <span className="text-text-primary font-medium tabular-nums">
                          {u.used}
                          <span className="text-text-muted"> / </span>
                          {u.limit}
                        </span>
                      )}
                    </div>
                    <div className="w-full h-1.5 bg-bg-soft rounded-full overflow-hidden">
                      {!noLimit && (
                        <div
                          className={`h-full transition-[width] duration-300 ${
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
          </Card>
        )}

        <Card className="p-5 md:p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2 text-text-secondary">
              <Zap size={15} className="text-brand-primary" />
              <h2 className="text-sm font-bold text-text-primary">
                Quick actions
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {actions.map((a) => (
              <Link
                key={a.to}
                to={a.to}
                className="group flex flex-col gap-2.5 p-3.5 rounded-lg border border-border-soft hover:border-brand-primary/30 hover:bg-bg-soft transition-[transform,border-color,background-color] duration-200 hover:-translate-y-0.5 no-underline"
              >
                <div className="w-9 h-9 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center transition-colors group-hover:bg-brand-primary group-hover:text-white">
                  {a.icon}
                </div>
                <div>
                  <div className="text-sm font-bold text-text-primary leading-tight">
                    {a.title}
                  </div>
                  <p className="text-[0.72rem] text-text-muted mt-0.5 leading-snug">
                    {a.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent activity */}
      <Card className="p-5 md:p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Clock size={15} className="text-brand-primary" />
            <h2 className="text-sm font-bold text-text-primary">
              Recent activity
            </h2>
          </div>
          <Link
            to="/dashboard/history"
            className="text-xs font-semibold text-brand-primary hover:underline no-underline"
          >
            View all
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="text-center text-text-muted text-sm py-8 border border-dashed border-border-soft rounded-lg">
            <p>No activity yet — start by picking a tool above.</p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-border-soft -mx-2">
            {recent.map((item) => (
              <div
                key={`${item.kind}-${item.id}`}
                className="flex items-center gap-3 px-2 py-3 hover:bg-bg-soft/60 rounded-lg transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-bg-soft text-text-muted flex items-center justify-center shrink-0 overflow-hidden">
                  {item.kind === "image" && item.url ? (
                    <img
                      src={item.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : item.kind === "image" ? (
                    <Image size={15} />
                  ) : (
                    <FileText size={15} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary truncate">
                    {item.label || "(empty)"}
                  </p>
                  <p className="text-[0.7rem] text-text-muted mt-0.5">
                    {item.kind === "image" ? "Image" : "Rewrite"} ·{" "}
                    {formatRelative(item.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Overview;
