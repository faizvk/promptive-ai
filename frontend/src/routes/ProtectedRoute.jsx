import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const FullPageLoader = () => (
  <div className="min-h-screen flex items-center justify-center text-text-muted text-sm">
    Loading…
  </div>
);

const ProtectedRoute = () => {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "loading") return <FullPageLoader />;

  if (status !== "authenticated") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
