import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, ChevronDown, LogOut, Sparkles } from "lucide-react";
import { useAuth } from "../auth/AuthContext";

const PAGE_TITLES = {
  "/dashboard": "Overview",
  "/dashboard/chat": "AI Chat",
  "/dashboard/image": "Image generation",
  "/dashboard/rewrite": "Content rewrite",
  "/dashboard/voice": "Voice synthesis",
  "/dashboard/history": "History",
  "/dashboard/billing": "Plan & billing",
};

const Topbar = ({ onMenuClick }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    navigate("/login", { replace: true });
  };

  const initial =
    user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U";
  const title = PAGE_TITLES[pathname] || "Dashboard";

  return (
    <header className="h-[64px] flex items-center justify-between gap-3 px-4 md:px-6 bg-white border-b border-border-soft sticky top-0 z-40">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <button
          className="lg:hidden text-text-muted hover:text-text-primary p-2 -ml-2 rounded-lg hover:bg-bg-soft shrink-0"
          onClick={onMenuClick}
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-[1rem] md:text-[1.05rem] font-bold text-text-primary tracking-[-0.01em] m-0 truncate">
          {title}
        </h1>
      </div>

      <div ref={menuRef} className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 px-1.5 py-1 rounded-full hover:bg-bg-soft transition-colors"
          aria-haspopup="menu"
          aria-expanded={open}
        >
          <div className="w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
            {initial}
          </div>
          <ChevronDown
            size={14}
            className={`text-text-muted transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {open && (
          <div
            role="menu"
            className="absolute top-[calc(100%+8px)] right-0 w-[240px] bg-white border border-border-soft rounded-xl shadow-[0_8px_24px_-12px_rgba(0,0,0,0.12)] py-1.5 animate-dropdown-in z-50"
          >
            {user && (
              <div className="px-3 py-2.5 border-b border-border-soft mb-1">
                <div className="text-sm font-semibold text-text-primary truncate">
                  {user.name || "Account"}
                </div>
                <div className="text-xs text-text-muted truncate">
                  {user.email}
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setOpen(false);
                navigate("/dashboard/billing");
              }}
              className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-sm text-text-secondary hover:bg-bg-soft hover:text-text-primary transition-colors"
            >
              <Sparkles size={14} className="text-text-muted" />
              Plan &amp; billing
            </button>

            <div className="h-px bg-border-soft my-1 mx-2" />

            <button
              onClick={handleLogout}
              className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-sm text-text-error hover:bg-bg-error transition-colors"
            >
              <LogOut size={14} />
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;
