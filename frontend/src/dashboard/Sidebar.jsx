import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Image,
  FileText,
  Clock,
  PanelLeftClose,
} from "lucide-react";
import "./styles/Sidebar.css";

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? "show" : ""}`}
        onClick={onClose}
      />

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            Promptive<span>AI</span>
          </div>

          <button
            className="sidebar-toggle-btn"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <PanelLeftClose size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" end onClick={onClose}>
            <LayoutDashboard size={19} />
            <span>Overview</span>
          </NavLink>

          <NavLink to="/dashboard/image" onClick={onClose}>
            <Image size={19} />
            <span>Image Generation</span>
          </NavLink>

          <NavLink to="/dashboard/rewrite" onClick={onClose}>
            <FileText size={19} />
            <span>Content Rewrite</span>
          </NavLink>

          <NavLink to="/dashboard/history" onClick={onClose}>
            <Clock size={19} />
            <span>History</span>
          </NavLink>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
