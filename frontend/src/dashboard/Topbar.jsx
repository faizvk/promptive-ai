import React, { useState } from "react";
import { Menu, Bell, ChevronDown, LogOut, User } from "lucide-react";

const iconBtn =
  "bg-[#f8fafc] border border-[#e2e8f0] text-[#64748b] p-2.5 rounded-[10px] cursor-pointer flex items-center justify-center transition-all duration-200 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] hover:bg-[#f1f5f9] hover:text-[#0f172a] hover:border-[#cbd5e1]";

const dropdownBtn =
  "w-full flex items-center gap-3 px-3 py-2.5 border-0 bg-transparent rounded-lg text-[0.9rem] font-medium text-[#475569] cursor-pointer transition-all duration-150 hover:bg-[#f1f5f9] hover:text-[#0f172a]";

const Topbar = ({ onMenuClick, title = "Dashboard" }) => {
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <header className="h-[70px] flex items-center justify-between px-4 md:px-8 bg-white/80 backdrop-blur-[12px] border-b border-[#e2e8f0] sticky top-0 z-40">
      <div className="flex items-center gap-5">
        <button className={iconBtn} onClick={onMenuClick}>
          <Menu size={20} />
        </button>
        <h3 className="text-base md:text-[1.1rem] font-bold text-[#0f172a] m-0">
          {title}
        </h3>
      </div>

      <div className="flex items-center gap-4">
        <button className={iconBtn}>
          <Bell size={18} />
        </button>

        <div
          className="relative flex items-center gap-2 p-1.5 pr-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-full cursor-pointer transition-all duration-200 text-[#64748b] hover:bg-[#f1f5f9] hover:border-[#cbd5e1]"
          onClick={() => setOpen((prev) => !prev)}
        >
          <div className="w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center">
            <User size={16} />
          </div>
          <ChevronDown size={14} />

          {open && (
            <div className="absolute top-[calc(100%+12px)] right-0 w-[200px] bg-white border border-[#e2e8f0] rounded-xl shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)] p-2 flex flex-col gap-1 animate-dropdown-in">
              <button className={dropdownBtn}>
                <User size={14} /> Profile
              </button>
              <button
                onClick={handleLogout}
                className={`${dropdownBtn} !text-[#ef4444] mt-1 border-t border-[#f1f5f9] !pt-3 !rounded-t-none hover:!bg-bg-error`}
              >
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
