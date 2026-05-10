import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Image,
  FileText,
  MessageSquare,
  Mic,
  Clock,
  CreditCard,
  X,
} from "lucide-react";
import { useAuth } from "../auth/AuthContext";

const navLinkBase =
  "relative flex items-center gap-3 px-3 py-2 rounded-lg text-text-secondary text-sm font-medium transition-colors duration-150 hover:bg-bg-soft hover:text-text-primary";

const navLinkActive =
  "!bg-bg-soft !text-text-primary [&_svg]:!text-brand-primary before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-[3px] before:rounded-full before:bg-brand-primary";

const sectionLabel =
  "text-[0.65rem] font-bold uppercase tracking-[0.18em] text-text-muted px-3 mt-5 mb-2";

const PRIMARY_LINKS = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Overview", end: true },
  { to: "/dashboard/chat", icon: MessageSquare, label: "AI Chat" },
  { to: "/dashboard/image", icon: Image, label: "Image" },
  { to: "/dashboard/rewrite", icon: FileText, label: "Rewrite" },
  { to: "/dashboard/voice", icon: Mic, label: "Voice" },
];

const SECONDARY_LINKS = [
  { to: "/dashboard/history", icon: Clock, label: "History" },
  { to: "/dashboard/billing", icon: CreditCard, label: "Plan & billing" },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const initial =
    user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U";

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[90] transition-[opacity,visibility] duration-200 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed top-0 left-0 w-[260px] h-screen bg-white border-r border-border-soft flex flex-col z-[100] transition-transform duration-200 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 h-[68px] border-b border-border-soft">
          <NavLink
            to="/dashboard"
            className="text-[1.1rem] font-extrabold tracking-tight text-text-primary"
            onClick={onClose}
          >
            Promptive
            <span className="text-brand-primary">AI</span>
          </NavLink>
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="lg:hidden text-text-muted hover:text-text-primary p-1.5 rounded-md hover:bg-bg-soft"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-3">
          <p className={sectionLabel}>Workspace</p>
          {PRIMARY_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={onClose}
              className={({ isActive }) =>
                `${navLinkBase} ${isActive ? navLinkActive : ""}`
              }
            >
              <link.icon size={17} className="shrink-0 text-text-muted" />
              <span>{link.label}</span>
            </NavLink>
          ))}

          <p className={sectionLabel}>Account</p>
          {SECONDARY_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `${navLinkBase} ${isActive ? navLinkActive : ""}`
              }
            >
              <link.icon size={17} className="shrink-0 text-text-muted" />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {user && (
          <div className="border-t border-border-soft p-3">
            <div className="flex items-center gap-2.5 p-2 rounded-lg">
              <div className="w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                {initial}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-text-primary truncate">
                  {user.name || "Account"}
                </div>
                <div className="text-[0.7rem] text-text-muted truncate">
                  {user.email}
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
