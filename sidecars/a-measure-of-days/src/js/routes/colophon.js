import gsap from "gsap";

export function mount() {
  const context = gsap.context(() => {
    gsap.from(".colophon-page > *", { opacity: 0, y: 24, duration: .9, stagger: .08, ease: "power3.out" });
  });
  return () => context.revert();
}
