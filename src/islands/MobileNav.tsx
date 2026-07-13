import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Link {
  href: string;
  label: string;
}

interface MobileNavProps {
  links: Link[];
  base: string;
  simple?: boolean;
}

const MobileNav: React.FC<MobileNavProps> = ({ links, base, simple = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuLinks = simple
    ? [
        { href: base, label: "Home" },
        { href: base + "blog/", label: "Realms" },
      ]
    : links;

  const setTheme = (theme: "auto" | "dark" | "bright") => {
    if (theme === "auto") {
      localStorage.removeItem("clawd-theme");
      const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
      document.documentElement.dataset.theme = prefersLight ? "bright" : "dark";
      window.dispatchEvent(new CustomEvent("theme-change", { detail: { theme: prefersLight ? "bright" : "dark" } }));
      return;
    }
    localStorage.setItem("clawd-theme", theme);
    document.documentElement.dataset.theme = theme;
    window.dispatchEvent(new CustomEvent("theme-change", { detail: { theme } }));
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={simple
          ? "fixed left-32 top-8 z-[100] bg-transparent text-sm uppercase tracking-[0.2em] text-slate-600 transition hover:text-slate-950 dark:text-white/60 dark:hover:text-white"
          : "relative z-50 rounded-full border border-mist/30 bg-white/70 px-4 py-2 text-sm font-medium tracking-wide text-glass shadow-sm backdrop-blur-md transition hover:border-glass/50 md:hidden"}
      >
        Menu
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[120] flex flex-col bg-[#fdfcfb]/96 px-7 py-7 text-slate-950 backdrop-blur-xl dark:bg-black/95 dark:text-white"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-white/45">
                Navigation
              </p>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-sm text-slate-700 transition hover:text-slate-950 dark:text-white/60 dark:hover:text-white"
              >
                Close
              </button>
            </div>

            <nav className="mt-20 flex flex-col items-start gap-7">
              {menuLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ delay: 0.06 + i * 0.06, duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className="text-4xl font-light text-slate-950 transition-colors hover:text-sky-600 dark:text-white dark:hover:text-blue-300"
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>

            {simple && (
              <div className="mt-auto border-t border-slate-200 pt-6 dark:border-white/10">
                <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-slate-500 dark:text-white/45">Theme</p>
                <div className="flex gap-3 text-sm text-slate-700 dark:text-white/70">
                  <button type="button" onClick={() => setTheme("auto")} className="hover:text-slate-950 dark:hover:text-white">Auto</button>
                  <button type="button" onClick={() => setTheme("dark")} className="hover:text-slate-950 dark:hover:text-white">Dark</button>
                  <button type="button" onClick={() => setTheme("bright")} className="hover:text-slate-950 dark:hover:text-white">Bright</button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileNav;
