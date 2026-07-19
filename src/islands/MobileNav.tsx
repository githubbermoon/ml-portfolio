import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { applyLanguage } from "./LanguageToggle";

interface Link {
  href: string;
  label: string;
  key?: string;
}

const hiLabels: Record<string, string> = {
  "nav.home": "होम",
  "nav.realms": "रियलम्स",
  "nav.projects": "प्रोजेक्ट्स",
  "nav.kosh": "कोश",
  "nav.blog": "ब्लॉग",
  "nav.contact": "संपर्क",
};

interface MobileNavProps {
  links: Link[];
  base: string;
  simple?: boolean;
}

const MobileNav: React.FC<MobileNavProps> = ({ links, base, simple = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const setLanguage = (next: 'en' | 'hi') => {
    setLang(next);
    localStorage.setItem('realms-lang', next);
    applyLanguage(next);
  };
  const menuLinks = simple
    ? [
        { href: base, label: "Home", key: "nav.home" },
        { href: base + "blog/", label: "Realms", key: "nav.realms" },
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
    const saved = localStorage.getItem('realms-lang');
    setLang(saved === 'hi' ? 'hi' : 'en');
    const handler = (event: Event) => {
      const next = (event as CustomEvent).detail?.lang;
      setLang(next === 'hi' ? 'hi' : 'en');
    };
    window.addEventListener('realms-language-change', handler);
    return () => window.removeEventListener('realms-language-change', handler);
  }, []);

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
          ? "fixed left-32 top-8 z-[140] pointer-events-auto bg-transparent text-sm uppercase tracking-[0.2em] text-slate-700 transition hover:text-slate-950"
          : "relative z-50 rounded-full border border-mist/30 bg-white/70 px-4 py-2 text-sm font-medium tracking-wide text-glass shadow-sm backdrop-blur-md transition hover:border-glass/50 md:hidden"}
      >
        <span data-i18n="nav.menu">{lang === 'hi' ? 'मेनू' : 'Menu'}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[150] flex flex-col bg-[#fdfcfb]/96 px-7 py-7 text-slate-950 backdrop-blur-xl dark:bg-black/95 dark:text-white"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-white/45">
                <span data-i18n="nav.navigation">{lang === 'hi' ? 'नेविगेशन' : 'Navigation'}</span>
              </p>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-sm text-slate-700 transition hover:text-slate-950 dark:text-white/60 dark:hover:text-white"
              >
                <span data-i18n="nav.close">{lang === 'hi' ? 'बंद करें' : 'Close'}</span>
              </button>
            </div>

            <div className="mt-12 flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-xs uppercase tracking-[0.18em] text-slate-600 dark:border-white/10 dark:text-white/60">
              <button type="button" onClick={() => setLanguage('en')} className={lang === 'en' ? 'text-slate-950 dark:text-white' : 'hover:text-slate-950 dark:hover:text-white'}>EN</button>
              <span className="text-slate-300 dark:text-white/20">/</span>
              <button type="button" onClick={() => setLanguage('hi')} className={lang === 'hi' ? 'text-slate-950 dark:text-white' : 'hover:text-slate-950 dark:hover:text-white'}>हिंदी</button>
            </div>

            <nav className="mt-12 flex flex-col items-start gap-7">
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
                  {lang === 'hi' && link.key ? (hiLabels[link.key] || link.label) : link.label}
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
