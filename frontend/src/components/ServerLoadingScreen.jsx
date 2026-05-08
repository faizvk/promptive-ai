import React from "react";
import { ArrowRight, Github } from "lucide-react";

const ServerLoadingScreen = () => {
  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-5 py-10 bg-gradient-to-b from-brand-primary via-[#062c5a] to-[#051a33] text-white overflow-hidden">
      {/* Grid texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
      />
      {/* Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] max-w-[120%] h-[400px] bg-btn-primary/20 rounded-full blur-[120px]"
      />

      <div className="relative max-w-[560px] w-full text-center">
        {/* Logo */}
        <div className="text-2xl md:text-[1.5rem] font-extrabold tracking-[-0.02em] mb-10 md:mb-14">
          Promptive
          <span className="bg-gradient-to-r from-btn-secondary to-[#fff5cf] bg-clip-text text-transparent">
            AI
          </span>
        </div>

        {/* Loading dot */}
        <div className="flex justify-center mb-6">
          <div className="w-3 h-3 rounded-full bg-btn-secondary animate-pulse-loader shadow-[0_0_24px_rgba(255,228,146,0.6)]" />
        </div>

        {/* Eyebrow */}
        <span className="inline-block text-[0.7rem] font-bold tracking-[0.18em] uppercase text-white/50 mb-3">
          Waking the backend
        </span>

        <h1 className="text-2xl md:text-3xl font-extrabold tracking-[-0.02em] mb-3">
          Starting backend…
        </h1>

        <p className="text-sm md:text-base text-white/70 leading-relaxed mb-8 max-w-md mx-auto">
          Render free tier sleeps after inactivity. This usually takes
          30&#8211;60 seconds.
        </p>

        {/* CTA */}
        <div className="rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm p-5 md:p-6">
          <p className="text-sm text-white/70 mb-3">
            Meanwhile, browse UI screenshots and source on GitHub.
          </p>
          <a
            href="https://github.com/faizvk/promptive-ai"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/15 hover:border-white/25 px-4 py-2.5 rounded-xl transition-all"
          >
            <Github size={15} />
            View on GitHub
            <ArrowRight
              size={14}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ServerLoadingScreen;
