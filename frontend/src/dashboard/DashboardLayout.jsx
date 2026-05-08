import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div
      className={`flex min-h-screen w-full bg-[#f8fafc] overflow-x-hidden ${
        isSidebarOpen ? "sidebar-open" : ""
      }`}
    >
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <div
        className={`flex-1 flex flex-col min-h-screen transition-[margin-left] duration-300 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] ${
          isSidebarOpen ? "lg:ml-[280px]" : "ml-0"
        }`}
      >
        <Topbar onMenuClick={toggleSidebar} />
        <div className="flex-1 p-5 max-w-[1600px] w-full mx-auto overflow-y-auto md:p-6 lg:p-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
