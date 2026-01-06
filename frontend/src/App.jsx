import "./App.css";
import { Routes, Route, Outlet } from "react-router-dom";
import { useFadeInOnScroll } from "./animations/useFadeInOnScroll";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Landing from "./pages/Landing";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";

import ImageGenerate from "./pages/imageGenerate";
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

  return (
    <Routes>
      {/* ================= PUBLIC ROUTES ================= */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
      </Route>

      {/* ================= DASHBOARD ROUTES ================= */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Overview />} />
        <Route path="image" element={<ImageGenerate />} />
        <Route path="rewrite" element={<ContentRewrite />} />
        <Route path="history" element={<History />} />
      </Route>
    </Routes>
  );
}

export default App;
