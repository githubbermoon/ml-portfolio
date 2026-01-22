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

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Menu Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative z-50 text-sm font-medium tracking-wide text-white mix-blend-difference transition-opacity hover:opacity-70 md:hidden"
      >
        MENU
      </button>

      {/* Fullscreen Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 left-6 text-sm font-medium tracking-wide text-white/50 transition-colors hover:text-white"
            >
              CLOSE
            </button>

            {/* Links */}
            <nav className="flex flex-col items-center gap-8">
              {links.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{
                    delay: 0.1 + i * 0.1,
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="text-4xl font-light text-white transition-colors hover:text-blue-300"
                >
                  {link.label}
                </motion.a>
              ))}

              {/* Mobile CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{
                  delay: 0.1 + links.length * 0.1,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mt-8"
              >
                <MagneticButton
                  href={base + "#contact"}
                  className="rounded-full border border-white/20 px-6 py-3 text-lg text-white transition hover:bg-white/10"
                >
                  Start a project
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
