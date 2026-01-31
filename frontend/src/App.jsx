import "./App.css";
import { Routes, Route, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import { useFadeInOnScroll } from "./animations/useFadeInOnScroll";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ServerLoadingScreen from "./components/ServerLoadingScreen";

import Landing from "./pages/Landing";
import PublicImageGenerate from "./pages/PublicImageGenerate";
import PublicContentRewrite from "./pages/PublicContentRewrite";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import OAuthSuccess from "./pages/OAuthSuccess";

import ImageGenerate from "./pages/ImageGenerate";
import ContentRewrite from "./pages/ContentRewrite";
import History from "./pages/History";

import DashboardLayout from "./dashboard/DashboardLayout";
import Overview from "./dashboard/pages/Overview";

/* ---------- Public Layout ---------- */
const PublicLayout = () => (
  <>
    <Navbar />
    <div className="app-main">
      <Outlet />
    </div>
    <Footer />
  </>
);

function App() {
  useFadeInOnScroll();

  const [backendReady, setBackendReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkBackend = async () => {
      if (!mounted) return;

      try {
        const res = await fetch("https://promptive-ai.onrender.com/");

        if (res.ok && mounted) {
          setBackendReady(true);
        } else {
          setTimeout(checkBackend, 3000);
        }
      } catch {
        setTimeout(checkBackend, 3000);
      }
    };

    checkBackend();

    return () => {
      mounted = false;
    };
  }, []);

  if (!backendReady) return <ServerLoadingScreen />;

  return (
    <Routes>
      {/* ================= PUBLIC LAYOUT ================= */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/image-generate" element={<PublicImageGenerate />} />
        <Route path="/content-rewrite" element={<PublicContentRewrite />} />

        {/* UNGUARDED OAUTH CALLBACK */}
        <Route path="/oauth-success" element={<OAuthSuccess />} />

        {/* PUBLIC AUTH PAGES ONLY */}
        <Route element={<PublicRoute />}>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Route>
      </Route>

      {/* ================= PROTECTED DASHBOARD ================= */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="image" element={<ImageGenerate />} />
          <Route path="rewrite" element={<ContentRewrite />} />
          <Route path="history" element={<History />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
