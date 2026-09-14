import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, X } from "lucide-react";
import { applyLanguage } from "./LanguageToggle";
import "./realms-menu.css";

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
  manuscript?: boolean;
}

const MobileNav: React.FC<MobileNavProps> = ({ links, base, simple = false, manuscript = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [theme, setThemeState] = useState<'dark' | 'bright'>('dark');
  const setLanguage = (next: 'en' | 'hi') => {
    setLang(next);
    localStorage.setItem('realms-lang', next);
    applyLanguage(next);
    // Force re-render to update translations for labels in current page
    window.dispatchEvent(new CustomEvent('realms-language-change', { detail: { lang: next } }));
  };
  const menuLinks = simple
    ? [
        { href: base, label: "Home", key: "nav.home" },
        { href: base + "blog/", label: "Realms", key: "nav.realms" },
      ]
    : links;

  const setTheme = (next: "dark" | "bright") => {
    const apply = () => {
      setThemeState(next);
      localStorage.setItem("clawd-theme", next);
      document.documentElement.dataset.theme = next;
      window.dispatchEvent(new CustomEvent("theme-change", { detail: { theme: next } }));
    };
    const doc = document as Document & { startViewTransition?: (callback: () => void) => { finished: Promise<void> } };
    if (doc.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.classList.add('theme-transitioning');
      doc.startViewTransition(apply).finished.finally(() => document.documentElement.classList.remove('theme-transitioning'));
    } else apply();
  };

  const openVisitorPreferences = () => {
    window.dispatchEvent(new CustomEvent("visitor-preferences-open"));
    setIsOpen(false);
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
    const syncTheme = () => setThemeState(document.documentElement.dataset.theme === 'bright' ? 'bright' : 'dark');
    syncTheme();
    window.addEventListener('theme-change', syncTheme);
    return () => window.removeEventListener('theme-change', syncTheme);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && setIsOpen(false);
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-expanded={isOpen}
        aria-label={manuscript ? "Open navigation" : undefined}
        className={manuscript
          ? `realms-menu-trigger${isOpen ? ' is-open' : ''}`
          : simple
          ? "fixed left-32 top-8 z-[140] pointer-events-auto bg-transparent text-sm uppercase tracking-[0.2em] text-slate-700 transition hover:text-slate-950"
          : "relative z-50 rounded-full border border-mist/30 bg-white/70 px-4 py-2 text-sm font-medium tracking-wide text-glass shadow-sm backdrop-blur-md transition hover:border-glass/50 md:hidden"}
      >
        {manuscript ? (
          <><span className="sr-only">Open navigation</span><span className="realms-menu-lines" aria-hidden="true"><i /><i /><i /></span></>
        ) : <span>{lang === 'hi' ? 'मेनू' : 'Menu'}</span>}
      </button>

      <AnimatePresence>
        {isOpen && manuscript && (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation"
              className="realms-menu-backdrop"
              onClick={() => setIsOpen(false)}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Site navigation"
              className="realms-menu-panel"
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="realms-menu-head">
                <button type="button" onClick={() => setIsOpen(false)} aria-label="Close navigation" className="realms-menu-close"><X size={17} strokeWidth={1.25} /></button>
              </div>

              <nav className="realms-menu-links">
                {menuLinks.map((link, i) => (
                  <motion.a key={link.href} href={link.href} onClick={() => setIsOpen(false)}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 + i * 0.045, duration: 0.28 }}>
                    <span className="realms-menu-roll">
                      <span>{lang === 'hi' && link.key ? (hiLabels[link.key] || link.label) : link.label}</span>
                      <span aria-hidden="true">{lang === 'hi' ? link.label : (link.key ? (hiLabels[link.key] || link.label) : link.label)}</span>
                    </span>
                    <small>0{i + 1}</small>
                  </motion.a>
                ))}
              </nav>

              <div className="realms-menu-tools">
                <button type="button" className="realms-language-switch" onClick={() => setLanguage(lang === 'en' ? 'hi' : 'en')} aria-label={lang === 'en' ? 'Switch to Hindi' : 'Switch to English'}>
                  <span data-active={lang === 'en'}>A</span><i>/</i><span data-active={lang === 'hi'}>अ</span>
                </button>
                <button type="button" className="realms-analytics-switch" onClick={openVisitorPreferences}>
                  Visitor measurement
                </button>
                <button type="button" className="realms-theme-switch" onClick={() => setTheme(theme === 'dark' ? 'bright' : 'dark')} aria-label={theme === 'dark' ? 'Use bright theme' : 'Use dark theme'} title={theme === 'dark' ? 'Bright mode' : 'Dark mode'}>
                  {theme === 'dark' ? <Sun size={18} strokeWidth={1.25} /> : <Moon size={18} strokeWidth={1.25} />}
                </button>
              </div>
            </motion.div>
          </>
        )}
        {isOpen && !manuscript && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[150] flex flex-col bg-[#fdfcfb]/96 px-7 py-7 text-slate-950 backdrop-blur-xl dark:bg-black/95 dark:text-white"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-white/45">
                <span>{lang === 'hi' ? 'नेविगेशन' : 'Navigation'}</span>
              </p>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-sm text-slate-700 transition hover:text-slate-950 dark:text-white/60 dark:hover:text-white"
              >
                <span>{lang === 'hi' ? 'बंद करें' : 'Close'}</span>
              </button>
            </div>

            <div className="mt-12 flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-xs uppercase tracking-[0.18em] text-slate-600 dark:border-white/10 dark:text-white/60">
              <button type="button" onClick={() => setLanguage('en')} className={lang === 'en' ? 'text-slate-950 dark:text-white' : 'hover:text-slate-950 dark:hover:text-white'}>A</button>
              <span className="text-slate-300 dark:text-white/20">/</span>
              <button type="button" onClick={() => setLanguage('hi')} className={lang === 'hi' ? 'text-slate-950 dark:text-white' : 'hover:text-slate-950 dark:hover:text-white'}>अ</button>
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
                  <span>{lang === 'hi' && link.key ? (hiLabels[link.key] || link.label) : link.label}</span>
                </motion.a>
              ))}
            </nav>

            {simple && (
              <div className="mt-auto border-t border-slate-200 pt-6 dark:border-white/10">
                <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-slate-500 dark:text-white/45">Theme</p>
                <div className="flex gap-3 text-sm text-slate-700 dark:text-white/70">
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
