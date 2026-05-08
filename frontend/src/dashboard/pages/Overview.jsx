import React, { useEffect, useState } from "react";
import { Image, FileText, Clock, Zap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchDashboardOverview } from "../../api/dashboard.api";

const statCard =
  "group bg-white rounded-2xl p-5 md:p-6 flex items-center gap-4 border border-border-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-primary/20 hover:shadow-[0_18px_36px_-16px_rgba(4,56,115,0.15)]";

const statIcon =
  "w-11 h-11 rounded-xl bg-gradient-to-br from-brand-primary/10 to-brand-primary/5 text-brand-primary flex items-center justify-center transition-colors duration-300 group-hover:from-brand-primary group-hover:to-[#062c5a] group-hover:text-white";

const actionCard =
  "group bg-white border border-border-soft rounded-2xl p-5 md:p-6 no-underline text-text-primary flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 hover:border-brand-primary/30 hover:shadow-[0_18px_36px_-14px_rgba(4,56,115,0.18)]";

const actionIcon =
  "w-11 h-11 rounded-xl bg-bg-soft text-brand-primary flex items-center justify-center transition-all duration-300 group-hover:bg-brand-primary group-hover:text-white";

const Overview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOverview = async () => {
      try {
        const res = await fetchDashboardOverview();
        setStats(res.stats);
      } catch (err) {
        console.error("Failed to load dashboard overview", err);
      } finally {
        setLoading(false);
      }
    };

    loadOverview();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] text-text-muted">
        Loading dashboard…
      </div>
    );
  }

  const statsItems = [
    { icon: Image, label: "Images generated", value: stats.imagesGenerated },
    { icon: FileText, label: "Rewrites done", value: stats.rewritesDone },
    { icon: Clock, label: "Total actions", value: stats.totalActions },
    { icon: Zap, label: "AI response", value: stats.aiStatus },
  ];

  const actions = [
    {
      to: "/dashboard/image",
      icon: Image,
      title: "Generate Image",
      description: "Turn prompts into visuals",
    },
    {
      to: "/dashboard/rewrite",
      icon: FileText,
      title: "Rewrite Content",
      description: "Refine tone and clarity",
    },
    {
      to: "/dashboard/history",
      icon: Clock,
      title: "View History",
      description: "Browse past generations",
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto">
      <header className="mb-8 md:mb-10">
        <span className="inline-block text-[0.7rem] font-bold tracking-[0.18em] uppercase text-brand-primary/70 mb-2">
          Workspace
        </span>
        <h1 className="text-2xl md:text-[1.85rem] font-extrabold tracking-[-0.02em] text-text-primary mb-1">
          Welcome back
        </h1>
        <p className="text-sm md:text-[0.95rem] text-text-secondary">
          A snapshot of your activity and tools.
        </p>
      </header>

      <section className="grid gap-4 md:gap-5 grid-cols-1 [@media(min-width:481px)]:grid-cols-2 lg:grid-cols-4 mb-8 md:mb-12">
        {statsItems.map(({ icon: Icon, label, value }) => (
          <div key={label} className={statCard}>
            <div className={statIcon}>
              <Icon size={20} />
            </div>
            <div className="min-w-0">
              <strong className="text-2xl md:text-[1.5rem] font-extrabold block leading-none mb-1.5 tracking-tight text-text-primary truncate">
                {value}
              </strong>
              <span className="text-[0.8rem] font-medium text-text-muted">
                {label}
              </span>
            </div>
          </div>
        ))}
      </section>

      <section className="mb-8 md:mb-12">
        <div className="flex items-baseline justify-between mb-4 md:mb-5">
          <h2 className="text-lg md:text-[1.15rem] font-bold text-text-primary">
            Quick actions
          </h2>
        </div>

        <div className="grid gap-4 md:gap-5 grid-cols-1 md:grid-cols-3">
          {actions.map(({ to, icon: Icon, title, description }) => (
            <Link key={to} to={to} className={actionCard}>
              <div className={actionIcon}>
                <Icon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-text-primary leading-tight">
                  {title}
                </div>
                <p className="text-[0.85rem] text-text-muted mt-0.5">
                  {description}
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

      <section>
        <h2 className="text-lg md:text-[1.15rem] font-bold text-text-primary mb-4">
          Recent activity
        </h2>
        <div className="bg-white rounded-2xl p-8 md:p-10 border border-dashed border-border-soft text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-bg-soft text-text-muted flex items-center justify-center">
            <Clock size={20} />
          </div>
          <p className="text-text-secondary text-[0.95rem]">
            Recent activity will appear here as you generate.
          </p>
          <Link
            to="/dashboard/history"
            className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-brand-primary hover:gap-2 transition-all"
          >
            View history <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Overview;
