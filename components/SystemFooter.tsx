'use client'

import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

export function SystemFooter() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="sticky bottom-0 left-0 right-0 z-40 bg-white/60 backdrop-blur-xl border-t border-violet-200/40"
    >
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-center gap-3 text-sm text-gray-600">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          </motion.div>
          <span>All systems synced 3h ago · Last data pull successful</span>
        </div>
      </div>
    </motion.div>
  );
}
