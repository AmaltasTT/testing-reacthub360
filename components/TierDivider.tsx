'use client'

import { motion } from 'motion/react';

export function TierDivider() {
  return (
    <div className="relative py-8 mb-8">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-violet-300/60 to-transparent" />
      </div>
      <motion.div
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 flex items-center overflow-hidden"
      >
        <div className="w-1/3 h-px bg-gradient-to-r from-transparent via-cyan-500/70 to-transparent shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
      </motion.div>
    </div>
  );
}
