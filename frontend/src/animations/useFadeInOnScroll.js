import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useFadeInOnScroll() {
  const location = useLocation();

  useEffect(() => {
    const elements = document.querySelectorAll("[data-fade='true']");

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translate(0, 0)";
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [location.pathname]); // ✅ critical
}
