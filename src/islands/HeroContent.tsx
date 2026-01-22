import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

export default function HeroContent() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-3xl"
    >
      <motion.p variants={item} className="text-xs uppercase tracking-[0.3em] text-mist">
        ML + Computer Vision
      </motion.p>
      
      <motion.div variants={item} className="mt-4">
        <h1 
          className="text-7xl md:text-9xl font-black text-glow-cinematic"
          style={{ filter: 'url(#liquid-hero-filter)' }}
        >
          Pranjal Prakash
        </h1>
      </motion.div>

      <motion.p variants={item} className="mt-10 text-3xl text-glass md:text-4xl">
        Applied ML and computer vision systems
      </motion.p>

      <motion.p variants={item} className="mt-6 text-lg text-mist md:text-xl">
        MCA student at Reva University (CGPA 8.47) building real-time vision pipelines, ML demos, and
        reliable backends with PyTorch and FastAPI.
      </motion.p>

      <motion.div variants={item} className="mt-8 flex flex-wrap gap-4">
        <a className="glass-panel px-6 py-3 text-sm text-glass hover:text-white transition-colors" href="#work">
          View featured work
        </a>
        <a className="rounded-full border border-mist/40 px-6 py-3 text-sm text-mist hover:border-glass/50 hover:text-glass transition-colors" href="#contact">
          Contact
        </a>
      </motion.div>
    </motion.div>
  );
}
