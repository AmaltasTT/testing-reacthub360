'use client'

import { motion } from 'motion/react';
import { Lightbulb, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

export function NextActionBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-50/90 to-green-50/90 backdrop-blur-xl border border-cyan-300/60 p-6 mb-12 shadow-md"
    >
      {/* Animated background pulse */}
      <motion.div
        animate={{ 
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.05, 1]
        }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute inset-0 bg-gradient-to-r from-cyan-100/20 to-green-100/20"
      />
      
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <motion.div
            animate={{ 
              scale: [1, 1.15, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="flex-shrink-0"
          >
            <Lightbulb className="w-8 h-8 text-cyan-600" />
          </motion.div>
          <div>
            <h3 className="text-gray-900 mb-1">Your Next Best Move</h3>
            <p className="text-gray-700">
              Shift 10% of your Meta budget to TikTok for <span className="text-cyan-600">+2.3% projected engagement lift</span>.
            </p>
            <p className="text-gray-500 text-xs mt-1">AI recommendation based on current market trends</p>
          </div>
        </div>
        <Button className="bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 text-white border-0 gap-2 flex-shrink-0 shadow-md hover:shadow-lg transition-all">
          Show Me How
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}
