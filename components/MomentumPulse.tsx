'use client'

import { motion } from 'motion/react';
import { Zap } from 'lucide-react';

export function MomentumPulse() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="relative cursor-pointer group"
      title="New insights available"
    >
      {/* Pulsing glow effect */}
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.4, 0, 0.4],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 rounded-full bg-cyan-400"
      />
      
      {/* Icon container */}
      <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center shadow-lg">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        >
          <Zap className="w-5 h-5 text-white fill-white" />
        </motion.div>
      </div>
      
      {/* Notification badge */}
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full border-2 border-white flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-1.5 h-1.5 bg-white rounded-full"
        />
      </div>
    </motion.div>
  );
}
