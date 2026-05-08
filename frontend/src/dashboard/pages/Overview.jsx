import React, { useEffect, useState } from "react";
import { Image, FileText, Clock, Zap } from "lucide-react";
import { fetchDashboardOverview } from "../../api/dashboard.api";

const statCard =
  "bg-white rounded-2xl p-5 md:p-7 flex items-center gap-4 border border-border-soft";

const statIcon =
  "w-[42px] h-[42px] rounded-xl bg-bg-soft flex items-center justify-center text-brand-primary";

const actionCard =
  "bg-white border border-border-soft rounded-[14px] p-5 md:p-7 no-underline text-text-primary flex items-center gap-4 transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_18px_36px_-14px_rgba(0,0,0,0.12)]";

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
    return <p>Loading dashboard…</p>;
  }

  return (
    <div className="max-w-[1400px] mx-auto">
      <header className="mb-6 md:mb-10">
        <h1 className="text-2xl md:text-[1.75rem] font-extrabold mb-1">
          Dashboard
        </h1>
        <p className="text-sm md:text-[0.95rem] text-text-secondary">
          Overview of your activity and tools
        </p>
      </header>

      <section className="grid gap-4 md:gap-6 grid-cols-1 [@media(min-width:481px)]:grid-cols-2 lg:grid-cols-4 mb-8 md:mb-12">
        <div className={statCard}>
          <div className={statIcon}>
            <Image size={20} />
          </div>
          <div>
            <strong className="text-2xl font-extrabold block">
              {stats.imagesGenerated}
            </strong>
            <span className="text-[0.85rem] text-text-secondary">
              Images generated
            </span>
          </div>
        </div>

        <div className={statCard}>
          <div className={statIcon}>
            <FileText size={20} />
          </div>
          <div>
            <strong className="text-2xl font-extrabold block">
              {stats.rewritesDone}
            </strong>
            <span className="text-[0.85rem] text-text-secondary">
              Rewrites done
            </span>
          </div>
        </div>

        <div className={statCard}>
          <div className={statIcon}>
            <Clock size={20} />
          </div>
          <div>
            <strong className="text-2xl font-extrabold block">
              {stats.totalActions}
            </strong>
            <span className="text-[0.85rem] text-text-secondary">
              Total actions
            </span>
          </div>
        </div>

        <div className={statCard}>
          <div className={statIcon}>
            <Zap size={20} />
          </div>
          <div>
            <strong className="text-2xl font-extrabold block">
              {stats.aiStatus}
            </strong>
            <span className="text-[0.85rem] text-text-secondary">
              AI response
            </span>
          </div>
        </div>
      </section>

      <section className="mb-8 md:mb-12">
        <h2 className="text-lg md:text-[1.2rem] font-bold mb-4 md:mb-5">
          Quick actions
        </h2>

        <div className="grid gap-4 md:gap-5 grid-cols-1 md:grid-cols-3">
          <a href="/dashboard/image" className={actionCard}>
            <Image size={22} />
            <span>Generate Image</span>
          </a>

          <a href="/dashboard/rewrite" className={actionCard}>
            <FileText size={22} />
            <span>Rewrite Content</span>
          </a>

          <a href="/dashboard/history" className={actionCard}>
            <Clock size={22} />
            <span>View History</span>
          </a>
        </div>
      </section>

      <section>
        <h2 className="text-lg md:text-[1.2rem] font-bold mb-4">
          Recent activity
        </h2>
        <div className="bg-white rounded-2xl p-5 md:p-8 border border-dashed border-border-soft text-text-muted">
          <p>Recent activity will appear here.</p>
        </div>
      </section>
    </div>
  );
};

export default Overview;
