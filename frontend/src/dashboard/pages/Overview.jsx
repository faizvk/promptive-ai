import React, { useEffect, useState } from "react";
import { Image, FileText, Clock, Zap } from "lucide-react";
import { fetchDashboardOverview } from "../../api/dashboard.api";
import "./styles/Overview.css";

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
    return <p className="status-text">Loading dashboard…</p>;
  }

  return (
    <div className="overview">
      {/* ================= HEADER ================= */}
      <header className="overview-header">
        <h1>Dashboard</h1>
        <p>Overview of your activity and tools</p>
      </header>

      {/* ================= STATS ================= */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Image size={20} />
          </div>
          <div>
            <strong>{stats.imagesGenerated}</strong>
            <span>Images generated</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FileText size={20} />
          </div>
          <div>
            <strong>{stats.rewritesDone}</strong>
            <span>Rewrites done</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Clock size={20} />
          </div>
          <div>
            <strong>{stats.totalActions}</strong>
            <span>Total actions</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Zap size={20} />
          </div>
          <div>
            <strong>{stats.aiStatus}</strong>
            <span>AI response</span>
          </div>
        </div>
      </section>

      {/* ================= QUICK ACTIONS ================= */}
      <section className="overview-actions">
        <h2>Quick actions</h2>

        <div className="action-grid">
          <a href="/dashboard/image" className="action-card">
            <Image size={22} />
            <span>Generate Image</span>
          </a>

          <a href="/dashboard/rewrite" className="action-card">
            <FileText size={22} />
            <span>Rewrite Content</span>
          </a>

          <a href="/dashboard/history" className="action-card">
            <Clock size={22} />
            <span>View History</span>
          </a>
        </div>
      </section>

      {/* ================= RECENT ACTIVITY ================= */}
      <section className="overview-recent">
        <h2>Recent activity</h2>
        <div className="recent-card">
          <p>Recent activity will appear here.</p>
        </div>
      </section>
    </div>
  );
};

export default Overview;
