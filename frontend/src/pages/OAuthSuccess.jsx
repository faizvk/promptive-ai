import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);

      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 0);
    } else {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return null;
};

export default OAuthSuccess;
