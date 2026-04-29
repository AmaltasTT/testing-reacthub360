'use client'

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface CelebrationEffectProps {
  trigger: boolean;
  children: React.ReactNode;
}

export function CelebrationEffect({ trigger, children }: CelebrationEffectProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (trigger) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <div className="relative">
      {children}
      
      {/* Subtle confetti particles */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: '50%',
                y: '50%',
                scale: 0,
                opacity: 1,
              }}
              animate={{
                x: `${50 + (Math.random() - 0.5) * 100}%`,
                y: `${50 + (Math.random() - 0.5) * 100}%`,
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: 1.5,
                ease: 'easeOut',
                delay: i * 0.05,
              }}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: ['#6B7CFF', '#00C6FF', '#A6E3FF', '#C084FC', '#60A5FA'][i % 5],
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface MiniCelebrationProps {
  show: boolean;
}

export function MiniCelebration({ show }: MiniCelebrationProps) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: [0, 1.2, 1], rotate: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="inline-block"
    >
      ✨
    </motion.div>
  );
}
