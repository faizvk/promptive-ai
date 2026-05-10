/* eslint-disable react-refresh/only-export-components */
import { useEffect, useRef } from "react";

const SCRIPT_URL = "https://challenges.cloudflare.com/turnstile/v0/api.js";
const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;

let scriptLoadPromise = null;

const loadTurnstileScript = () => {
  if (scriptLoadPromise) return scriptLoadPromise;
  if (window.turnstile) return Promise.resolve();

  scriptLoadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${SCRIPT_URL}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Failed to load Turnstile"))
      );
      return;
    }
    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Turnstile"));
    document.head.appendChild(script);
  });

  return scriptLoadPromise;
};

const TurnstileWidget = ({ onToken }) => {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);

  useEffect(() => {
    if (!SITE_KEY) return;

    let cancelled = false;

    loadTurnstileScript()
      .then(() => {
        if (cancelled || !window.turnstile || !containerRef.current) return;
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: SITE_KEY,
          callback: (token) => onToken?.(token),
          "error-callback": () => onToken?.(null),
          "expired-callback": () => onToken?.(null),
        });
      })
      .catch((err) => {
        console.error("Turnstile load error:", err);
      });

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // ignore
        }
      }
    };
  }, [onToken]);

  if (!SITE_KEY) return null;

  return <div ref={containerRef} className="my-2" />;
};

export const isTurnstileConfigured = () => Boolean(SITE_KEY);

export default TurnstileWidget;
