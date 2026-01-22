import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

type Props = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
};

export default function ScrollReveal({ children, delay = 0, className = "" }: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });

  return (
    <div ref={ref} className={className}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75, scale: 0.98 },
          visible: { opacity: 1, y: 0, scale: 1 },
        }}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ duration: 0.8, delay: delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}
