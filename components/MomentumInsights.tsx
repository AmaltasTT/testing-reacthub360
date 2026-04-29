'use client'

import { motion } from 'motion/react';
import { ArrowRight, ChevronLeft, ChevronRight, Zap, Flame, TrendingUp } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useRef } from 'react';

interface InsightCardProps {
  icon: string;
  headline: string;
  source: string;
  microComment?: string;
  ctaText: string;
  ctaModule: string;
  delay: number;
  trendingBadge?: 'hot' | 'new' | null;
}

function InsightCard({ icon, headline, source, microComment, ctaText, ctaModule, delay, trendingBadge }: InsightCardProps) {
  const sourceColors: Record<string, string> = {
    'MixIQ': 'bg-cyan-100 text-cyan-700 border-cyan-300',
    'TalkIQ': 'bg-pink-100 text-pink-700 border-pink-300',
    'CompetitorIQ': 'bg-violet-100 text-violet-700 border-violet-300',
    'AI Aggregated': 'bg-orange-100 text-orange-700 border-orange-300',
    'REACTIQ AI Layer': 'bg-green-100 text-green-700 border-green-300',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
      whileHover={{ y: -8 }}
      className="relative overflow-hidden rounded-3xl bg-white p-8 min-w-[420px] max-w-[420px] cursor-pointer group shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100"
    >
      {/* Gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-cyan-500 to-indigo-500 opacity-60 rounded-t-3xl" />
      
      {/* Trending Badge - top right corner */}
      {trendingBadge && (
        <motion.div
          initial={{ opacity: 0, scale: 0, x: 10, y: -10 }}
          animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
          transition={{ delay: delay + 0.3, duration: 0.4, type: 'spring', stiffness: 200 }}
          className="absolute top-4 right-4 z-20"
        >
          {trendingBadge === 'hot' && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-orange-200 shadow-sm"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 237, 213, 0.9) 0%, rgba(254, 215, 170, 0.7) 100%)',
              }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Flame className="w-3.5 h-3.5 text-orange-600" fill="currentColor" />
              </motion.div>
              <span className="text-[11px] text-orange-700" style={{ fontWeight: 600 }}>HOT</span>
            </div>
          )}
          
          {trendingBadge === 'new' && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-cyan-200 shadow-sm"
              style={{
                background: 'linear-gradient(135deg, rgba(224, 242, 254, 0.9) 0%, rgba(186, 230, 253, 0.7) 100%)',
              }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <TrendingUp className="w-3.5 h-3.5 text-cyan-600" />
              </motion.div>
              <span className="text-[11px] text-cyan-700" style={{ fontWeight: 600 }}>NEW</span>
            </div>
          )}
        </motion.div>
      )}
      
      {/* Minimal hover glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50/0 to-cyan-50/60 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-3xl" />
      
      <div className="relative z-10">
        {/* Large icon */}
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          className="text-5xl mb-6"
        >
          {icon}
        </motion.div>

        {/* Bold headline */}
        <h3 className="text-2xl text-gray-900 mb-4 leading-snug group-hover:text-gray-700 transition-colors">
          {headline}
        </h3>

        {/* Micro-comment with better typography */}
        {microComment && (
          <p className="text-base text-gray-600 mb-6 italic leading-relaxed">
            "{microComment}"
          </p>
        )}

        {/* Source tag and CTA */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 group-hover:border-gray-300 transition-colors">
          <Badge className={`${sourceColors[source] || 'bg-gray-100 text-gray-700 border-gray-300'} px-3 py-1 text-xs border-2 shadow-sm`}>
            {source}
          </Badge>
          
          <motion.button
            whileHover={{ x: 4 }}
            className="flex items-center gap-2 text-base text-cyan-600 group-hover:text-cyan-700 transition-colors hover:underline"
            style={{ fontWeight: 600 }}
          >
            <span>See details</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export function MomentumInsights() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollPosition = scrollContainerRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  const insights = [
    {
      icon: '📈',
      headline: 'LinkedIn carousel engagement surged +11% — B2B is having its moment.',
      source: 'AI Aggregated',
      microComment: 'Visual storytelling formats winning over walls of text.',
      ctaText: 'View in InsightsIQ',
      ctaModule: 'InsightsIQ',
      trendingBadge: 'hot' as const
    },
    {
      icon: '💰',
      headline: 'TikTok CPCs dropped 9% — awareness grab window now open.',
      source: 'MixIQ',
      microComment: 'Platform inventory expanding faster than demand.',
      ctaText: 'Open in MixIQ',
      ctaModule: 'MixIQ',
      trendingBadge: 'new' as const
    },
    {
      icon: '🧩',
      headline: 'BrandX doubled YouTube spend this week — competitor pivot detected.',
      source: 'CompetitorIQ',
      microComment: 'Testing long-form video after Meta saturation.',
      ctaText: 'View in CompetitorIQ',
      ctaModule: 'CompetitorIQ',
      trendingBadge: null
    },
    {
      icon: '💬',
      headline: "'Authenticity' mentions rose +14% — sentiment momentum trending up.",
      source: 'TalkIQ',
      microComment: 'Lo-fi videos still crushing polished creative.',
      ctaText: 'Open in TalkIQ',
      ctaModule: 'TalkIQ',
      trendingBadge: 'hot' as const
    },
    {
      icon: '🤖',
      headline: 'AI forecasts a +5% engagement lift for interactive polls.',
      source: 'REACTIQ AI Layer',
      microComment: 'User-generated content patterns showing strong signals.',
      ctaText: 'View in InsightsIQ',
      ctaModule: 'InsightsIQ',
      trendingBadge: null
    },
    {
      icon: '🎨',
      headline: 'Carousel ads on Instagram outperforming single image by +34%.',
      source: 'AI Aggregated',
      microComment: 'Multi-scene storytelling driving higher completion rates.',
      ctaText: 'Open in CreativeIQ',
      ctaModule: 'CreativeIQ',
      trendingBadge: 'new' as const
    },
    {
      icon: '🌍',
      headline: 'Organic reach on Meta stabilizing — paid amplification showing ROI gains.',
      source: 'MixIQ',
      microComment: 'Algorithm changes favoring quality engagement metrics.',
      ctaText: 'View in MixIQ',
      ctaModule: 'MixIQ',
      trendingBadge: null
    }
  ];

  return (
    <div className="mb-20 relative">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="mb-6"
      >
        <h2 className="text-[32px] text-[#444A57] mb-2" style={{ fontWeight: 600, letterSpacing: '-0.01em' }}>
          What's Working Right Now
        </h2>
        <p className="text-[18px] text-[#717784]" style={{ fontWeight: 400 }}>
          Live intelligence on trends and opportunities you can act on today
        </p>
      </motion.div>

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-2 h-2 rounded-full bg-green-500"
          />
          <span className="text-gray-700 text-sm" style={{ fontWeight: 500 }}>Live · Updated 2 min ago</span>
        </div>
        
        {/* Urgency indicator */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200 cursor-pointer"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Zap className="w-3.5 h-3.5 text-orange-600" fill="currentColor" />
          </motion.div>
          <span className="text-xs text-orange-700" style={{ fontWeight: 600 }}>
            2 time-sensitive opportunities below
          </span>
        </motion.div>
      </div>

      {/* Scrollable cards container */}
      <div className="relative">
        {/* Left scroll button */}
        <Button
          onClick={() => scroll('left')}
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-gradient-to-r from-violet-600 to-indigo-600 backdrop-blur-xl border-0 text-white hover:from-violet-700 hover:to-indigo-700 hover:scale-110 active:scale-95 shadow-2xl w-12 h-12 rounded-2xl transition-transform duration-200"
          style={{ pointerEvents: 'auto' }}
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        {/* Scrollable container */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-6 px-16 scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {insights.map((insight, idx) => (
            <InsightCard
              key={idx}
              {...insight}
              delay={idx * 0.1}
            />
          ))}
        </div>

        {/* Right scroll button */}
        <Button
          onClick={() => scroll('right')}
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-gradient-to-r from-violet-600 to-indigo-600 backdrop-blur-xl border-0 text-white hover:from-violet-700 hover:to-indigo-700 hover:scale-110 active:scale-95 shadow-2xl w-12 h-12 rounded-2xl transition-transform duration-200"
          style={{ pointerEvents: 'auto' }}
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
