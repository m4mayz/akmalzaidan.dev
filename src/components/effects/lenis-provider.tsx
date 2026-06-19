"use client";

import Lenis from "lenis";
import { useEffect } from "react";

export function LenisProvider() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.documentElement.classList.add("lenis-disabled");

      return () => {
        document.documentElement.classList.remove("lenis-disabled");
      };
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (time: number) => Math.min(1, 1.001 - Math.pow(2, -10 * time)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.15,
    });

    document.documentElement.classList.add("lenis", "lenis-smooth");

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };

    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      document.documentElement.classList.remove("lenis", "lenis-smooth");
    };
  }, []);

  return null;
}
