"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const particleConfigs = [
  { left: "20%", top: "30%", delay: 0.2, duration: 2.5 },
  { left: "75%", top: "40%", delay: 0.5, duration: 3.0 },
  { left: "35%", top: "70%", delay: 0.1, duration: 2.2 },
  { left: "80%", top: "60%", delay: 0.8, duration: 2.8 },
  { left: "15%", top: "50%", delay: 0.4, duration: 3.2 },
  { left: "65%", top: "25%", delay: 0.7, duration: 2.4 },
];

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Total duration ~3.8s before triggering exit sequence
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0f0c] overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* STEP 1: Background Soft Radial Glow */}
          <motion.div 
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ scale: 1.5, opacity: 0, transition: { duration: 0.8 } }}
            transition={{ duration: 2, ease: "easeOut" }}
            style={{
              background: "radial-gradient(circle at center, rgba(47,79,63,0.3) 0%, rgba(10,15,12,1) 60%)"
            }}
          />

          {/* STEP 4: Soft floating elements & thin glowing lines */}
          <div className="absolute inset-0 pointer-events-none">
             {particleConfigs.map((p, i) => (
               <motion.div
                 key={i}
                 className="absolute w-1 h-1 bg-[#4ade80]/40 rounded-full"
                 style={{
                   left: p.left,
                   top: p.top,
                   filter: "blur(1px)"
                 }}
                 initial={{ y: 0, opacity: 0 }}
                 animate={{ y: -60, opacity: [0, 1, 0] }}
                 transition={{ 
                   duration: p.duration, 
                   ease: "easeInOut",
                   delay: p.delay,
                   repeat: Infinity
                 }}
               />
             ))}
             {/* Tech Circuit line 1 */}
             <motion.div
                className="absolute top-1/2 left-[15%] w-[15%] h-[1px] bg-gradient-to-r from-transparent via-[#4ade80]/20 to-transparent"
                initial={{ scaleX: 0, opacity: 0, x: -50 }}
                animate={{ scaleX: 1, opacity: 1, x: 50 }}
                transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
                exit={{ opacity: 0 }}
             />
             {/* Tech Circuit line 2 */}
             <motion.div
                className="absolute top-[40%] right-[15%] w-[15%] h-[1px] bg-gradient-to-r from-transparent via-[#6E8B4A]/30 to-transparent"
                initial={{ scaleX: 0, opacity: 0, x: 50 }}
                animate={{ scaleX: 1, opacity: 1, x: -50 }}
                transition={{ duration: 2.5, delay: 0.8, ease: "easeInOut" }}
                exit={{ opacity: 0 }}
             />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            {/* STEP 3: Layered Glow Behind Logo */}
            <motion.div
              className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-[#6E8B4A]/20 blur-[40px] pointer-events-none"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
              exit={{ scale: 3, opacity: 0, transition: { duration: 0.8 } }}
            />
            <motion.div
              className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-[#4ade80]/15 blur-[30px] pointer-events-none"
              animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, delay: 0.5 }}
              exit={{ scale: 4, opacity: 0, transition: { duration: 0.8 } }}
            />

            {/* STEP 2: Logo Reveal */}
            <motion.div
              className="relative h-36 md:h-44 mb-10 z-10 flex items-center justify-center"
              initial={{ filter: "blur(20px)", scale: 0.8, rotate: -8, opacity: 0 }}
              animate={{ filter: "blur(0px)", scale: 1, rotate: 0, opacity: 1 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              exit={{ scale: 0.9, opacity: 0, filter: "blur(10px)", transition: { duration: 0.6 } }}
            >
              <img 
                src="/logo.jpg" 
                alt="VISHWAS" 
                className="h-full w-auto object-contain"
              />
            </motion.div>

            {/* STEP 5: Slogan */}
            <motion.h2
              className="text-[#D4DABF]/90 text-lg md:text-xl font-light tracking-wider mb-12 font-sans"
              initial={{ opacity: 0, y: 15, letterSpacing: "0px" }}
              animate={{ opacity: 1, y: 0, letterSpacing: "2px" }}
              transition={{ delay: 1.2, duration: 1.5, ease: "easeOut" }}
              exit={{ opacity: 0, y: -10, transition: { duration: 0.4 } }}
            >
              A better life, a better world.
            </motion.h2>

            {/* STEP 6: Loading Indicator */}
            <motion.div 
              className="relative w-48 md:w-64 h-[2px] bg-white/5 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
            >
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-transparent via-[#4ade80] to-[#22c55e] rounded-full"
                initial={{ width: "0%", x: "0%" }}
                animate={{ width: ["0%", "100%", "100%"], x: ["0%", "0%", "100%"] }}
                transition={{ duration: 2.2, ease: [0.65, 0, 0.35, 1], repeat: Infinity }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
