import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useFadeInOnScroll(ready = true) {
  const location = useLocation();

  useEffect(() => {
    if (!ready) return;

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
      { threshold: 0.15 },
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [location.pathname, ready]); // 👈 add ready
}
