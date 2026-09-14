import { Core, Renderer, Transition } from "@unseenco/taxi";
import gsap from "gsap";

let unmountRoute = null;

async function mountCurrentRoute() {
  if (typeof unmountRoute === "function") unmountRoute();
  const view = document.querySelector("[data-taxi-view]");
  const route = view?.dataset.taxiView || "measure-of-days";
  try {
    const module = await import(`./routes/${route}.js`);
    unmountRoute = module.mount?.() || null;
  } catch (error) {
    console.error(`Unable to mount route: ${route}`, error);
  }
}

class KoshRenderer extends Renderer {
  initialLoad() { mountCurrentRoute(); }
  onEnter() { mountCurrentRoute(); }
  onLeave() {
    if (typeof unmountRoute === "function") unmountRoute();
    unmountRoute = null;
  }
}

class VeilTransition extends Transition {
  onLeave({ from, done }) {
    gsap.to(from, { opacity: 0, y: -18, duration: .35, ease: "power2.in", onComplete: done });
  }
  onEnter({ to, done }) {
    window.scrollTo(0, 0);
    gsap.fromTo(to, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .65, ease: "power3.out", onComplete: done });
  }
}

new Core({
  allowInterruption: true,
  links: "a[data-taxi-link]",
  renderers: {
    default: KoshRenderer,
    "measure-of-days": KoshRenderer,
    colophon: KoshRenderer,
  },
  transitions: { default: VeilTransition },
});

const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".folio-index");
const closeMenu = () => {
  document.body.classList.remove("menu-open");
  toggle?.setAttribute("aria-expanded", "false");
};
toggle?.addEventListener("click", () => {
  const open = document.body.classList.toggle("menu-open");
  toggle.setAttribute("aria-expanded", String(open));
});
nav?.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});
