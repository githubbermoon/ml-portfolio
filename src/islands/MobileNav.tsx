import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MagneticButton from "./MagneticButton";

interface Link {
  href: string;
  label: string;
}

interface MobileNavProps {
  links: Link[];
  base: string;
}

const MobileNav: React.FC<MobileNavProps> = ({ links, base }) => {
  const [isOpen, setIsOpen] = useState(false);

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
        className="relative z-50 rounded-full border border-mist/30 bg-white/60 px-4 py-2 text-sm font-medium tracking-wide text-glass shadow-sm backdrop-blur-md transition hover:border-glass/50 md:hidden"
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
            className="fixed inset-0 z-[60] flex flex-col bg-white/96 px-7 py-7 text-slate-950 backdrop-blur-xl dark:bg-black/95 dark:text-white"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-white/45">
                Navigation
              </p>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700 transition hover:border-slate-900 hover:text-slate-950 dark:border-white/20 dark:text-white/60 dark:hover:text-white"
              >
                Close
              </button>
            </div>

            <nav className="mt-20 flex flex-col items-start gap-7">
              {links.map((link, i) => (
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

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ delay: 0.06 + links.length * 0.06, duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="mt-8"
              >
                <MagneticButton
                  href={base + "#contact"}
                  className="rounded-full border border-slate-400 px-6 py-3 text-base text-slate-950 transition hover:border-slate-950 dark:border-white/25 dark:text-white dark:hover:bg-white/10"
                >
                  Contact
                </MagneticButton>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileNav;
