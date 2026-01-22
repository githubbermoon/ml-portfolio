import { motion } from 'framer-motion';
import { useState, type ReactNode } from 'react';
import WarpOverlay from './WarpOverlay';

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  themeColor?: string;
  href?: string;
};

export default function ProjectCard({ children, className = "", delay = 0, themeColor = "#cbd5e1", href }: Props) {
  const [isWarping, setIsWarping] = useState(false);

  const handleNavigation = (e: React.MouseEvent) => {
    if (!href) return;
    e.preventDefault();
    
    // Trigger fullscreen warp overlay
    setIsWarping(true);
  };

  const handleWarpComplete = () => {
    // Navigate after warp animation completes
    if (href) {
      window.location.href = href;
    }
  };

  return (
    <>
      <motion.div
        className={`group relative overflow-hidden rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md transition-all duration-500 ease-out hover:bg-white/[0.08] hover:border-white/20 hover:shadow-2xl hover:shadow-black/50 cursor-pointer ${className}`}
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ 
           y: -8,
           scale: 1.02,
        }}
        onClick={handleNavigation}
      >
        {/* Soft Gradient Overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {children}
      </motion.div>
      
      {/* Fullscreen Warp Overlay - renders on top of everything */}
      <WarpOverlay 
        isActive={isWarping} 
        themeColor={themeColor} 
        onComplete={handleWarpComplete}
      />
    </>
  );
}
