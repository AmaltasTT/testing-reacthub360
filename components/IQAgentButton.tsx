'use client'

import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';

export function IQAgentButton() {
  const [isActive, setIsActive] = useState(true);

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setIsActive(!isActive)}
      className="relative w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center justify-center group"
    >
      {/* Pulsing glow when active */}
      {isActive && (
        <>
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-400 to-purple-500"
          />
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500"
          />
        </>
      )}
      
      {/* Icon */}
      <motion.div
        animate={isActive ? { rotate: [0, 5, -5, 0] } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative z-10"
      >
        <Sparkles className="w-6 h-6 text-white" />
      </motion.div>
      
      {/* Tooltip on hover */}
      <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 px-4 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
        IQ Agent
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
      </div>
    </motion.button>
  );
}
