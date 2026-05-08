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
  "flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-[#94a3b8] no-underline text-[0.95rem] font-medium transition-all duration-200 hover:bg-white/5 hover:text-white [&_svg]:opacity-70";

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
        className={`fixed top-0 left-0 w-[280px] h-screen bg-brand-primary text-white p-6 flex flex-col z-[100] transition-transform duration-300 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] border-r border-white/10 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-12 px-2">
          <div className="text-[1.25rem] font-extrabold tracking-[-0.02em]">
            Promptive<span>AI</span>
          </div>

          <button
            className="bg-white/5 border border-white/10 text-[#94a3b8] p-2 rounded-lg cursor-pointer flex items-center justify-center transition-all duration-200 hover:bg-white/10 hover:text-white hover:scale-105"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <PanelLeftClose size={20} />
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          <NavLink
            to="/dashboard"
            end
            onClick={onClose}
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? "!text-white [&_svg]:!opacity-100" : ""}`
            }
          >
            <LayoutDashboard size={19} />
            <span>Overview</span>
          </NavLink>

          <NavLink
            to="/dashboard/image"
            onClick={onClose}
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? "!text-white [&_svg]:!opacity-100" : ""}`
            }
          >
            <Image size={19} />
            <span>Image Generation</span>
          </NavLink>

          <NavLink
            to="/dashboard/rewrite"
            onClick={onClose}
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? "!text-white [&_svg]:!opacity-100" : ""}`
            }
          >
            <FileText size={19} />
            <span>Content Rewrite</span>
          </NavLink>

          <NavLink
            to="/dashboard/history"
            onClick={onClose}
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? "!text-white [&_svg]:!opacity-100" : ""}`
            }
          >
            <Clock size={19} />
            <span>History</span>
          </NavLink>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
