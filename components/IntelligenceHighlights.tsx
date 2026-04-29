'use client'

import { motion } from 'motion/react';
import { Sparkles, TrendingUp, Target, Zap } from 'lucide-react';
import { Badge } from './ui/badge';

interface HighlightCardProps {
  icon: React.ReactNode;
  title: string;
  insight: string;
  source: string;
  sourceColor: string;
  gradient: string;
}

function HighlightCard({ icon, title, insight, source, sourceColor, gradient }: HighlightCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex-shrink-0 w-[500px] bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group"
    >
      {/* Header with icon and badge */}
      <div className="flex items-start justify-between mb-6">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <Badge className={`${sourceColor} border-0 shadow-sm`}>
          {source}
        </Badge>
      </div>
      
      {/* Title */}
      <h3 className="text-2xl text-gray-900 mb-4">
        {title}
      </h3>
      
      {/* Insight quote */}
      <p className="text-lg text-gray-600 leading-relaxed">
        "{insight}"
      </p>
      
      {/* Decorative element */}
      <div className="mt-6 h-1 w-16 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
}

export function IntelligenceHighlights() {
  const highlights = [
    {
      icon: <Sparkles className="w-6 h-6 text-white" />,
      title: 'LinkedIn engagement surging',
      insight: 'Your thought leadership posts are driving 3x more qualified leads than paid campaigns this quarter.',
      source: 'MixIQ',
      sourceColor: 'bg-violet-100 text-violet-700',
      gradient: 'from-violet-500 to-purple-600',
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-white" />,
      title: 'Video content breakout',
      insight: 'Short-form video completion rates up 47% — audiences prefer authentic behind-the-scenes content.',
      source: 'CreativeIQ',
      sourceColor: 'bg-cyan-100 text-cyan-700',
      gradient: 'from-cyan-500 to-blue-600',
    },
    {
      icon: <Target className="w-6 h-6 text-white" />,
      title: 'Competitor gap detected',
      insight: 'Your brand owns the "sustainable innovation" conversation — 2x more mentions than nearest competitor.',
      source: 'CompetitorIQ',
      sourceColor: 'bg-orange-100 text-orange-700',
      gradient: 'from-orange-500 to-pink-600',
    },
    {
      icon: <Zap className="w-6 h-6 text-white" />,
      title: 'Campaign momentum building',
      insight: 'Q1 product launch campaign showing early lift — consider increasing budget by 15% to maximize impact.',
      source: 'LaunchIQ',
      sourceColor: 'bg-indigo-100 text-indigo-700',
      gradient: 'from-indigo-500 to-violet-600',
    },
  ];

  return (
    <div className="mb-20">
      {/* Section header - unified H2 system */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="mb-6"
      >
        <h2 className="text-[32px] text-[#444A57] mb-2" style={{ fontWeight: 600, letterSpacing: '-0.01em' }}>
          Intelligence Highlights
        </h2>
        <p className="text-[18px] text-[#717784]" style={{ fontWeight: 400 }}>
          AI-powered insights from your connected intelligence network
        </p>
      </motion.div>
      
      {/* Horizontal scroll container */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.7 }}
        className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {highlights.map((highlight, index) => (
          <HighlightCard key={index} {...highlight} />
        ))}
      </motion.div>
    </div>
  );
}
