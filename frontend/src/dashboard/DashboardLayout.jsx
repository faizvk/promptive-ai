import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import EmailVerifyBanner from "./EmailVerifyBanner";

const isDesktop = () =>
  typeof window !== "undefined" && window.innerWidth >= 1024;

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(isDesktop());
  const { pathname } = useLocation();

  // Close sidebar on route change (mobile only).
  useEffect(() => {
    if (!isDesktop()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsSidebarOpen(false);
    }
  }, [pathname]);

  // Re-sync sidebar to viewport width on resize.
  useEffect(() => {
    const onResize = () => setIsSidebarOpen(isDesktop());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="flex min-h-screen w-full bg-bg-soft">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div
        className={`flex-1 flex flex-col min-h-screen min-w-0 transition-[margin-left] duration-200 ${
          isSidebarOpen ? "lg:ml-[260px]" : "ml-0"
        }`}
      >
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
        <EmailVerifyBanner />
        <main className="flex-1 px-4 md:px-6 lg:px-8 py-6 md:py-8 overflow-x-hidden">
          <div className="max-w-[1400px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
