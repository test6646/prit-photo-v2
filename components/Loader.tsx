"use client";

import { useEffect, useState } from "react";

export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let value = 0;
    let raf: number;

    const updateProgress = () => {
      const state = document.readyState;

      if (state === "loading") {
        value += Math.random() * 8 + 4;
      } else if (state === "interactive") {
        value += Math.random() * 15 + 8;
      } else if (state === "complete") {
        value = 100;
      }

      value = Math.min(value, 100);

      if (value >= 100) {
        setProgress(100);
        setTimeout(() => setVisible(false), 380);
        return;
      }

      setProgress(Math.floor(value));
      raf = requestAnimationFrame(updateProgress);
    };

    raf = requestAnimationFrame(updateProgress);

    return () => cancelAnimationFrame(raf);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center font-[blauer]"
      style={{ background: "var(--background)" }}
    >
      <div className="flex flex-col items-center text-center">

        {/* Main Logo - Matching Landing.tsx style */}
        <div className="mb-6 md:mb-8">
          <h1
            className="text-[17vw] md:text-[12.5vw] lg:text-[10.5vw] leading-[0.82] font-light tracking-[-0.07em]"
            style={{ color: "var(--text)" }}
          >
            PRIT
          </h1>
          <h1
            className="text-[17vw] md:text-[12.5vw] lg:text-[10.5vw] leading-[0.82] font-light tracking-[-0.07em] -mt-3 md:-mt-5"
            style={{ color: "var(--text)" }}
          >
            PHOTO
          </h1>
        </div>

        {/* Tagline - Consistent with your other muted texts */}
        <p
          className="text-[13px] md:text-[14px] tracking-[0.42em] uppercase font-light"
          style={{ color: "var(--text-muted)" }}
        >
          PREPARING YOUR STORY
        </p>

        {/* Progress Bar - Clean and consistent */}
        <div className="mt-14 w-[260px] md:w-[320px]">
          <div
            className="h-[1px] w-full relative overflow-hidden"
            style={{ background: "var(--border)" }}
          >
            <div
              className="absolute left-0 top-0 h-full bg-[var(--text)] transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Percentage */}
          <div
            className="mt-5 text-[11px] tracking-[0.35em] font-light"
            style={{ color: "var(--text-muted)" }}
          >
            {progress}%
          </div>
        </div>

        {/* Footer info - Matches Navbar style */}
        <p
          className="absolute bottom-10 text-[10px] tracking-[0.28em] text-[var(--text-muted)]"
        >
          PRIT PHOTO • AHMEDABAD
        </p>

      </div>
    </div>
  );
}