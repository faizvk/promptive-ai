import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useFadeInOnScroll } from "./animations/useFadeInOnScroll";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";

function App() {
  useFadeInOnScroll();

  return (
    <div className="app-main">
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
