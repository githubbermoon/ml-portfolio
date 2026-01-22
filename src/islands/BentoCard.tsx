import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export default function BentoCard({ children, className = "", delay = 0 }: Props) {
  return (
    <motion.div
      className={`glass-panel relative overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ 
        scale: 1.05, 
        backgroundColor: "rgba(255,255,255,0.06)",
        borderColor: "rgba(255,255,255,0.35)",
        zIndex: 10
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          background: "radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.06), transparent 40%)"
        }}
      />
      {children}
    </motion.div>
  );
}
