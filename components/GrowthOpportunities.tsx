'use client'

import { motion } from 'motion/react';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface OpportunityCardProps {
  text: string;
  platform: string;
  icon: string;
  delay: number;
}

function OpportunityCard({ text, platform, icon, delay }: OpportunityCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="relative overflow-hidden rounded-3xl bg-white p-8 cursor-pointer group card-enhanced card-hover-glow transition-all duration-500 border border-gray-100"
    >
      {/* Gradient accent bar on top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-cyan-500 to-indigo-500 rounded-t-3xl" />
      
      <div className="flex items-start gap-4">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <span className="text-4xl flex-shrink-0">{icon}</span>
        </motion.div>
        <div className="flex-1">
          <p className="text-xl text-gray-900 mb-3 leading-relaxed group-hover:text-gray-700 transition-colors">{text}</p>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-gradient-to-r from-violet-100 to-cyan-100 text-violet-700 border-2 border-violet-200 px-3 py-1 shadow-sm">
              {platform}
            </Badge>
            <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
              Click to explore →
            </span>
          </div>
        </div>
        <motion.div
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ArrowRight className="w-6 h-6 text-cyan-600 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.div>
      </div>
    </motion.div>
  );
}

export function GrowthOpportunities() {
  return (
    <div className="mb-24">
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="mb-6"
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-[32px] text-[#444A57] mb-2" style={{ fontWeight: 600, letterSpacing: '-0.01em' }}>
              Where to Double Down Next
            </h2>
            <p className="text-[18px] text-[#717784]" style={{ fontWeight: 400 }}>
              AI-spotted opportunities to amplify what's already working
            </p>
          </div>
          
          {/* Action indicator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-violet-50 border border-violet-200"
          >
            <TrendingUp className="w-4 h-4 text-violet-600" />
            <span className="text-sm text-violet-700" style={{ fontWeight: 600 }}>
              3 ready to act on
            </span>
          </motion.div>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <OpportunityCard
          text="Your LinkedIn CTR is crushing it — 14% above competitors."
          platform="LinkedIn"
          icon="📈"
          delay={0.1}
        />
        <OpportunityCard
          text="Meta costs just dropped 8% — perfect time to scale up."
          platform="Meta"
          icon="💰"
          delay={0.2}
        />
        <OpportunityCard
          text="This video is a winner — 2.5x more engagement than others."
          platform="Multi-channel"
          icon="🎬"
          delay={0.3}
        />
      </div>
      
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button variant="outline" className="text-base text-cyan-600 hover:text-cyan-700 border-2 border-cyan-200 hover:bg-cyan-50 gap-2 shadow-sm hover:shadow-lg transition-all px-6 py-6 rounded-2xl">
          Explore More Drivers
          <ArrowRight className="w-5 h-5" />
        </Button>
      </motion.div>
    </div>
  );
}
