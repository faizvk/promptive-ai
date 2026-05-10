import React, { useEffect, useState } from "react";
import {
  Image,
  FileText,
  MessageSquare,
  Mic,
  Activity,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { fetchDashboardOverview } from "../../api/dashboard.api";

const statCard =
  "group bg-white rounded-2xl p-5 md:p-6 flex items-center gap-4 border border-border-soft transition-colors duration-200 hover:border-brand-primary/30";

const statIcon =
  "w-11 h-11 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center transition-colors duration-200 group-hover:bg-brand-primary group-hover:text-white";

const actionCard =
  "group bg-white border border-border-soft rounded-2xl p-5 md:p-6 no-underline text-text-primary flex items-center gap-4 transition-colors duration-200 hover:border-brand-primary/30";

const actionIcon =
  "w-11 h-11 rounded-xl bg-bg-soft text-brand-primary flex items-center justify-center transition-colors duration-200 group-hover:bg-brand-primary group-hover:text-white";

const Overview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardOverview()
      .then((res) =>
        setData({ stats: res.stats, plan: res.plan, usage: res.usage })
      )
      .catch((err) => console.error("Failed to load dashboard overview", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] text-text-muted">
        Loading dashboard…
      </div>
    );
  }

  const stats = data?.stats || {};
  const usage = data?.usage || {};
  const plan = data?.plan;

  const statsItems = [
    {
      icon: <MessageSquare size={20} />,
      label: "Chats",
      value: stats.chatsStarted ?? 0,
    },
    {
      icon: <Image size={20} />,
      label: "Images",
      value: stats.imagesGenerated ?? 0,
    },
    {
      icon: <FileText size={20} />,
      label: "Rewrites",
      value: stats.rewritesDone ?? 0,
    },
    {
      icon: <Mic size={20} />,
      label: "Voice clips",
      value: stats.voicesGenerated ?? 0,
    },
  ];

  const usageItems = plan
    ? [
        {
          label: "Chat messages",
          used: usage.chat ?? 0,
          limit: plan.limits.chat,
        },
        {
          label: "Images",
          used: usage.image ?? 0,
          limit: plan.limits.image,
        },
        {
          label: "Rewrites",
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
      icon: <MessageSquare size={20} />,
      title: "Start a Chat",
      description: "Talk to GPT, Claude, Gemini, Llama",
    },
    {
      to: "/dashboard/image",
      icon: <Image size={20} />,
      title: "Generate Image",
      description: "Turn prompts into visuals",
    },
    {
      to: "/dashboard/rewrite",
      icon: <FileText size={20} />,
      title: "Rewrite Content",
      description: "Refine tone and clarity",
    },
    {
      to: "/dashboard/voice",
      icon: <Mic size={20} />,
      title: "Voice Synthesis",
      description: "Text-to-speech in real voices",
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto">
      <header className="mb-8 md:mb-10 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <span className="inline-block text-[0.7rem] font-bold tracking-[0.18em] uppercase text-brand-primary/70 mb-2">
            Workspace
          </span>
          <h1 className="text-2xl md:text-[1.85rem] font-extrabold tracking-[-0.02em] text-text-primary mb-1">
            Welcome back
          </h1>
          <p className="text-sm md:text-[0.95rem] text-text-secondary">
            A snapshot of your activity and tools.
          </p>
        </div>
        {plan && (
          <Link
            to="/dashboard/billing"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-primary hover:underline"
          >
            <span className="text-[0.7rem] font-bold tracking-[0.18em] uppercase text-text-muted mr-2">
              Plan
            </span>
            {plan.name}
            <ArrowRight size={13} />
          </Link>
        )}
      </header>

      <section className="grid gap-4 md:gap-5 grid-cols-2 lg:grid-cols-4 mb-8 md:mb-10">
        {statsItems.map((stat) => (
          <div key={stat.label} className={statCard}>
            <div className={statIcon}>{stat.icon}</div>
            <div className="min-w-0">
              <strong className="text-2xl md:text-[1.5rem] font-extrabold block leading-none mb-1.5 tracking-tight text-text-primary truncate">
                {stat.value}
              </strong>
              <span className="text-[0.8rem] font-medium text-text-muted">
                {stat.label}
              </span>
            </div>
          </div>
        ))}
      </section>

      {plan && (
        <section className="mb-8 md:mb-10">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-lg md:text-[1.15rem] font-bold text-text-primary">
              This month's usage
            </h2>
            <span className="text-xs text-text-muted">
              Resets at the start of each month
            </span>
          </div>
          <div className="bg-white border border-border-soft rounded-2xl p-5 md:p-6">
            <div className="flex items-center gap-2 mb-5">
              <Activity size={16} className="text-brand-primary" />
              <span className="text-sm font-semibold text-text-primary">
                {plan.name} plan
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {usageItems.map((u) => {
                const pct =
                  u.limit > 0
                    ? Math.min(100, Math.round((u.used / u.limit) * 100))
                    : 0;
                const noLimit = u.limit === 0;
                return (
                  <div key={u.label}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-text-secondary">{u.label}</span>
                      <span className="text-text-primary font-medium">
                        {noLimit
                          ? "Not on plan"
                          : `${u.used} / ${u.limit}`}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-bg-soft rounded-full overflow-hidden">
                      {!noLimit && (
                        <div
                          className={`h-full transition-all ${
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
          </div>
        </section>
      )}

      <section className="mb-8 md:mb-12">
        <div className="flex items-baseline justify-between mb-4 md:mb-5">
          <h2 className="text-lg md:text-[1.15rem] font-bold text-text-primary">
            Quick actions
          </h2>
        </div>

        <div className="grid gap-4 md:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {actions.map((action) => (
            <Link key={action.to} to={action.to} className={actionCard}>
              <div className={actionIcon}>{action.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-text-primary leading-tight">
                  {action.title}
                </div>
                <p className="text-[0.85rem] text-text-muted mt-0.5">
                  {action.description}
                </p>
              </div>
              <ArrowRight
                size={16}
                className="text-text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-brand-primary shrink-0"
              />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Overview;
