import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useFadeInOnScroll } from "./animations/useFadeInOnScroll";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import ImageGenerate from "./pages/imageGenerate";

function App() {
  useFadeInOnScroll();

  return (
    <div className="app-main">
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/image-generate" element={<ImageGenerate />} />
      </Routes>
    </div>
  );
}

export default App;
