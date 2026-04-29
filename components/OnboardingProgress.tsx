'use client'

import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

interface OnboardingProgressProps {
  progress: number; // 0-100
}

export function OnboardingProgress({ progress }: OnboardingProgressProps) {
  const isComplete = progress === 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      className="flex items-center gap-3 pt-3 mt-3 border-t border-violet-200/50"
    >
      {isComplete ? (
        <>
          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
          <span className="text-sm text-green-700">
            Setup complete — your intelligence is fully connected
          </span>
        </>
      ) : (
        <>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-gray-600">Onboarding {progress}% complete</span>
            </div>
            <div className="h-1.5 bg-violet-100/60 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full relative"
              >
                {/* Subtle shimmer effect */}
                <motion.div
                  animate={{
                    x: ['-100%', '200%'],
                    opacity: [0, 0.6, 0],
                  }}
                  transition={{
                    duration: 2,
                    ease: "easeInOut",
                    delay: 1.5,
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                />
              </motion.div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
