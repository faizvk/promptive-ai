import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const FullPageLoader = () => (
  <div className="min-h-screen flex items-center justify-center text-text-muted text-sm">
    Loading…
  </div>
);

const PublicRoute = () => {
  const { status } = useAuth();

  if (status === "loading") return <FullPageLoader />;

  if (status === "authenticated") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
