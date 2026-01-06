import React, { useState } from "react";
import { Menu, Bell, ChevronDown, LogOut, User } from "lucide-react";
import "./styles/Topbar.css";

const Topbar = ({ onMenuClick, title = "Dashboard" }) => {
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <header className="topbar">
      {/* LEFT */}
      <div className="topbar-left">
        <button className="menu-toggle-btn" onClick={onMenuClick}>
          <Menu size={20} />
        </button>
        <h3 className="topbar-title">{title}</h3>
      </div>

      {/* RIGHT */}
      <div className="topbar-right">
        {/* Notifications */}
        <button className="icon-btn">
          <Bell size={18} />
        </button>

        {/* User menu */}
        <div className="user-menu" onClick={() => setOpen((prev) => !prev)}>
          <div className="user-avatar">
            <User size={16} />
          </div>
          <ChevronDown size={14} />

          {open && (
            <div className="user-dropdown">
              <button>
                <User size={14} /> Profile
              </button>
              <button onClick={handleLogout} className="logout">
                <LogOut size={14} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
