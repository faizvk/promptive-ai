import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useFadeInOnScroll() {
  const location = useLocation();

  useEffect(() => {
    const elements = document.querySelectorAll("[data-fade='true']");

    if (!elements.length) return;

    const reveal = (el) => {
      el.style.opacity = "1";
      el.style.transform = "translate(0, 0)";
    };

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );

    elements.forEach((el) => observer.observe(el));

    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();

      if (rect.top < window.innerHeight && rect.bottom > 0) {
        reveal(el);
        observer.unobserve(el);
      }
    });

    return () => observer.disconnect();
  }, [location.pathname]);
}
