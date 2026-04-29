"use client";
import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 z-[100] origin-left"
      style={{ 
        scaleX,
        background: "linear-gradient(90deg, #6E8B4A 0%, #4ade80 100%)",
        boxShadow: "0 0 10px #4ade80, 0 0 5px #4ade80"
      }}
    />
  );
}
