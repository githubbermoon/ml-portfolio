import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      smoothWheel: true,
      smoothTouch: false,
      lerp: 0.06,
      wheelMultiplier: 0.8,
    });

    let animationId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      animationId = requestAnimationFrame(raf);
    };
    animationId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationId);
      lenis.destroy();
    };
  }, []);

  return null;
}
