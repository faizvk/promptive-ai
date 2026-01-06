import React from "react";
import { User, Menu } from "lucide-react";
import "./styles/Topbar.css";

const Topbar = ({ onMenuClick }) => {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="menu-toggle-btn" onClick={onMenuClick}>
          <Menu size={20} />
        </button>
        <h3>Dashboard</h3>
      </div>

      <div className="topbar-right">
        <div className="user-profile">
          <User size={18} />
          <span>Account</span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
