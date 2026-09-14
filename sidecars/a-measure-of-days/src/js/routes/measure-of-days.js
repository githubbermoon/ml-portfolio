import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";
import CustomEase from "gsap/CustomEase";

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
CustomEase.create("folioEase", "M0,0 C0.16,1 0.3,1 1,1");

export function mount() {
  const context = gsap.context(() => {
    gsap.to(".page-progress span", { scaleX: 1, ease: "none", scrollTrigger: { trigger: ".essay", start: "top top", end: "bottom bottom", scrub: .1 } });

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      gsap.set(".reveal", { opacity: 1, y: 0 });
      return;
    }

    gsap.from(".hero__title span", { yPercent: 115, rotate: 1.5, duration: 1.45, stagger: .12, delay: .12, ease: "folioEase" });
    gsap.from([".hero__warning", ".hero__kicker", ".hero__meta", ".hero__enter"], { opacity: 0, y: 18, duration: .9, stagger: .1, delay: .65, ease: "power3.out" });
    gsap.to(".hero__image img", { yPercent: 9, scale: 1.045, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

    ScrollTrigger.batch(".reveal", {
      start: "top 88%",
      once: true,
      onEnter: (elements) => gsap.fromTo(elements, { opacity: 0, y: 46 }, { opacity: 1, y: 0, duration: 1.05, stagger: .08, ease: "folioEase" }),
    });

    document.querySelectorAll(".parallax").forEach((element) => {
      gsap.fromTo(element, { yPercent: -5 }, { yPercent: 7, ease: "none", scrollTrigger: { trigger: element.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
    });

    document.querySelectorAll(".split").forEach((element) => {
      const split = new SplitText(element, { type: "lines", linesClass: "split-line", aria: "none" });
      gsap.from(split.lines, { yPercent: 108, opacity: 0, duration: 1.1, stagger: .09, ease: "folioEase", scrollTrigger: { trigger: element, start: "top 82%", once: true } });
    });

    gsap.to(".orbit--one", { rotation: 360, duration: 30, repeat: -1, ease: "none" });
    gsap.to(".orbit--two", { rotation: -360, duration: 44, repeat: -1, ease: "none" });
    gsap.to(".float", { y: -12, duration: 3.4, yoyo: true, repeat: -1, ease: "sine.inOut" });
  });

  const clock = document.querySelector("[data-clock]");
  const updateClock = () => {
    if (!clock) return;
    clock.textContent = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(new Date());
  };
  updateClock();
  const timer = window.setInterval(updateClock, 1000);

  return () => {
    window.clearInterval(timer);
    context.revert();
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  };
}
