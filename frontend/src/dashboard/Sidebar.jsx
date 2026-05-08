import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Image,
  FileText,
  Clock,
  PanelLeftClose,
} from "lucide-react";

const navLinkBase =
  "relative flex items-center gap-3 px-4 py-3 rounded-xl text-white/65 no-underline text-[0.95rem] font-medium transition-all duration-200 hover:bg-white/[0.06] hover:text-white [&_svg]:opacity-70 [&_svg]:transition-opacity";

const navLinkActive =
  "!text-white !bg-white/[0.08] [&_svg]:!opacity-100 before:content-[''] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[3px] before:rounded-full before:bg-btn-secondary";

const navSectionLabel =
  "text-[0.7rem] font-bold uppercase tracking-[0.18em] text-white/40 px-4 mb-3";

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-[4px] z-[90] transition-[opacity,visibility] duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed top-0 left-0 w-[280px] h-screen bg-gradient-to-b from-brand-primary via-[#062c5a] to-[#051a33] text-white p-6 flex flex-col z-[100] transition-transform duration-300 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] border-r border-white/[0.08] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Subtle grid texture */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:linear-gradient(to_bottom,black_30%,transparent_90%)]"
        />

        <div className="relative flex items-center justify-between mb-10 px-1">
          <div className="text-[1.25rem] font-extrabold tracking-[-0.02em]">
            Promptive
            <span className="bg-gradient-to-r from-btn-secondary to-[#fff5cf] bg-clip-text text-transparent">
              AI
            </span>
          </div>

          <button
            className="bg-white/5 border border-white/10 text-white/70 p-2 rounded-lg cursor-pointer flex items-center justify-center transition-all duration-200 hover:bg-white/10 hover:text-white hover:border-white/20"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <PanelLeftClose size={18} />
          </button>
        </div>

        <p className={`relative ${navSectionLabel}`}>Workspace</p>

        <nav className="relative flex flex-col gap-1.5">
          <NavLink
            to="/dashboard"
            end
            onClick={onClose}
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? navLinkActive : ""}`
            }
          >
            <LayoutDashboard size={18} />
            <span>Overview</span>
          </NavLink>

          <NavLink
            to="/dashboard/image"
            onClick={onClose}
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? navLinkActive : ""}`
            }
          >
            <Image size={18} />
            <span>Image Generation</span>
          </NavLink>

          <NavLink
            to="/dashboard/rewrite"
            onClick={onClose}
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? navLinkActive : ""}`
            }
          >
            <FileText size={18} />
            <span>Content Rewrite</span>
          </NavLink>

          <NavLink
            to="/dashboard/history"
            onClick={onClose}
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? navLinkActive : ""}`
            }
          >
            <Clock size={18} />
            <span>History</span>
          </NavLink>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
