import { useEffect, useRef } from 'react';

export default function Spotlight() {
  const spotlightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const spotlight = spotlightRef.current;
    if (!spotlight) return;
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

    let frame = 0;

    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        spotlight.style.setProperty('--spotlight-x', `${e.clientX}px`);
        spotlight.style.setProperty('--spotlight-y', `${e.clientY}px`);
        spotlight.style.opacity = '1';
      });
    };

    const handleMouseLeave = () => {
      spotlight.style.opacity = '0';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={spotlightRef}
      className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 ease-in-out"
      style={{
        opacity: 0,
        background:
          'radial-gradient(600px circle at var(--spotlight-x, 50vw) var(--spotlight-y, 50vh), rgba(255,255,255,0.06), transparent 40%)',
      }}
    />
  );
}
