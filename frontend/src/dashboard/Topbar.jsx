import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Bell, ChevronDown, LogOut, User } from "lucide-react";
import { useAuth } from "../auth/AuthContext";

const iconBtn =
  "bg-bg-soft border border-border-soft text-text-secondary p-2.5 rounded-xl cursor-pointer flex items-center justify-center transition-colors duration-200 hover:bg-white hover:text-text-primary hover:border-text-muted/40";

const dropdownBtn =
  "w-full flex items-center gap-2.5 px-3 py-2.5 border-0 bg-transparent rounded-lg text-[0.9rem] font-medium text-text-secondary cursor-pointer transition-colors duration-150 hover:bg-bg-soft hover:text-text-primary";

const Topbar = ({ onMenuClick, title = "Dashboard" }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
    await logout();
    navigate("/login", { replace: true });
  };

  const initial = user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U";

  return (
    <header className="relative h-[68px] flex items-center justify-between px-4 md:px-8 bg-white/80 backdrop-blur-md border-b border-border-soft sticky top-0 z-40">
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          className={iconBtn}
          onClick={onMenuClick}
          aria-label="Toggle sidebar"
        >
          <Menu size={18} />
        </button>
        <h3 className="text-base md:text-[1.05rem] font-bold text-text-primary tracking-[-0.01em] m-0">
          {title}
        </h3>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button className={iconBtn} aria-label="Notifications">
          <Bell size={17} />
        </button>

        <div
          ref={menuRef}
          className="relative flex items-center gap-2 p-1 pr-3 bg-bg-soft border border-border-soft rounded-full cursor-pointer transition-colors duration-200 text-text-secondary hover:bg-white hover:border-text-muted/40"
          onClick={() => setOpen((prev) => !prev)}
        >
          <div className="w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
            {initial}
          </div>
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />

          {open && (
            <div className="absolute top-[calc(100%+10px)] right-0 w-[240px] bg-white border border-border-soft rounded-xl shadow-lg p-1.5 flex flex-col gap-0.5 animate-dropdown-in z-50">
              {user ? (
                <div className="px-3 py-2.5 border-b border-border-soft mb-1">
                  <div className="text-[0.9rem] font-semibold text-text-primary truncate">
                    {user.name || "Account"}
                  </div>
                  <div className="text-xs text-text-muted truncate">
                    {user.email}
                  </div>
                </div>
              ) : null}
              <button
                onClick={handleLogout}
                className={`${dropdownBtn} !text-text-error hover:!bg-bg-error`}
              >
                <LogOut size={15} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
