import { Routes, Route, Outlet } from "react-router-dom";
import { Suspense, lazy } from "react";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import { useFadeInOnScroll } from "./animations/useFadeInOnScroll";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Lazy pages
const Landing = lazy(() => import("./pages/Landing"));
const PublicImageGenerate = lazy(() => import("./pages/PublicImageGenerate"));
const PublicContentRewrite = lazy(() => import("./pages/PublicContentRewrite"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Login = lazy(() => import("./pages/Login"));

const ImageGenerate = lazy(() => import("./pages/ImageGenerate"));
const ContentRewrite = lazy(() => import("./pages/ContentRewrite"));
const History = lazy(() => import("./pages/History"));

const DashboardLayout = lazy(() => import("./dashboard/DashboardLayout"));
const Overview = lazy(() => import("./dashboard/pages/Overview"));

const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center text-text-muted text-sm">
    Loading…
  </div>
);

const PublicLayout = () => (
  <>
    <Navbar />
    <div className="w-full min-h-screen flex flex-col justify-center items-center text-center">
      <Outlet />
    </div>
    <Footer />
  </>
);

function App() {
  useFadeInOnScroll();

  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        {/* ================= PUBLIC LAYOUT ================= */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/image-generate" element={<PublicImageGenerate />} />
          <Route path="/content-rewrite" element={<PublicContentRewrite />} />

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
    </Suspense>
  );
}

export default App;
