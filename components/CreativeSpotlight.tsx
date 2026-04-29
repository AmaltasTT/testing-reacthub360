'use client'

import { motion } from 'motion/react';
import { ArrowRight, ChevronLeft, ChevronRight, Instagram, Linkedin, Facebook } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useRef } from 'react';

// Brand icon components
const BrandIcons: Record<string, React.ReactNode> = {
  Instagram: <Instagram className="w-5 h-5" />,
  TikTok: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  ),
  LinkedIn: <Linkedin className="w-5 h-5" />,
  Facebook: <Facebook className="w-5 h-5" />,
};

interface CreativeCardProps {
  channel: string;
  stat: string;
  bgColor: string;
  gradientColors: string;
}

function CreativeCard({ channel, stat, bgColor, gradientColors }: CreativeCardProps) {
  const icon = BrandIcons[channel];
  
  return (
    <motion.div 
      whileHover={{ y: -6 }}
      className="relative overflow-hidden rounded-3xl bg-white p-8 min-w-[380px] card-enhanced card-hover-glow transition-all duration-500 border border-gray-100 group cursor-pointer"
    >
      {/* Creative preview with platform-specific gradient and inner glow */}
      <div 
        className={`relative w-full h-56 rounded-2xl mb-6 flex items-center justify-center overflow-hidden`}
        style={{
          background: gradientColors,
          boxShadow: 'inset 0 0 20px rgba(107, 124, 255, 0.08)',
          filter: 'blur(0.5px)',
        }}
      >
        <div 
          className="text-gray-600 text-base relative z-10"
          style={{ 
            opacity: 0.7,
            filter: 'blur(0)',
            backdropFilter: 'blur(0)',
          }}
        >
          Creative Preview
        </div>
        {/* Faint animated light pass on hover */}
        <motion.div
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        />
      </div>
      
      <div className="flex items-center justify-between gap-3">
        {/* Brand icon badge */}
        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-600 text-white shadow-sm flex-shrink-0">
          {icon}
        </div>
        <span className="text-base text-cyan-600 flex-1 text-right">{stat}</span>
      </div>
    </motion.div>
  );
}

export function CreativeSpotlight() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 420;
      const newScrollPosition = scrollContainerRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  const creatives = [
    { 
      channel: 'Instagram', 
      stat: '+31% engagement vs avg', 
      bgColor: 'bg-gradient-to-br from-purple-100 to-pink-100',
      gradientColors: 'linear-gradient(135deg, #FFC3F7 0%, #FEE2FF 100%)'
    },
    { 
      channel: 'TikTok', 
      stat: '+28% completion rate', 
      bgColor: 'bg-gradient-to-br from-cyan-100 to-blue-100',
      gradientColors: 'linear-gradient(135deg, #00E0FF 0%, #E0FFFF 100%)'
    },
    { 
      channel: 'LinkedIn', 
      stat: '+24% CTR', 
      bgColor: 'bg-gradient-to-br from-blue-100 to-indigo-100',
      gradientColors: 'linear-gradient(135deg, #B7D5FF 0%, #EAF3FF 100%)'
    },
    { 
      channel: 'Facebook', 
      stat: '+19% shares', 
      bgColor: 'bg-gradient-to-br from-indigo-100 to-violet-100',
      gradientColors: 'linear-gradient(135deg, #C2DFFF 0%, #FFFFFF 100%)'
    },
  ];

  return (
    <div className="mb-24">
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="mb-6"
      >
        <h2 className="text-[32px] text-[#444A57] mb-2" style={{ fontWeight: 600, letterSpacing: '-0.01em' }}>
          The Creative Pulse
        </h2>
        <p className="text-[18px] text-[#717784]" style={{ fontWeight: 400 }}>
          See what's sparking the most connection
        </p>
      </motion.div>
      
      <div className="relative">
        {/* Left scroll button */}
        <motion.div 
          whileHover={{ scale: 1.1 }} 
          whileTap={{ scale: 0.95 }}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20"
        >
          <Button
            onClick={() => scroll('left')}
            variant="ghost"
            size="icon"
            className="bg-gradient-to-r from-violet-600 to-indigo-600 backdrop-blur-xl border-0 text-white hover:from-violet-700 hover:to-indigo-700 shadow-2xl w-12 h-12 rounded-2xl"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </motion.div>

        {/* Scrollable container */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-6 px-16 scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {creatives.map((creative, idx) => (
            <CreativeCard key={idx} {...creative} />
          ))}
        </div>

        {/* Right scroll button */}
        <motion.div 
          whileHover={{ scale: 1.1 }} 
          whileTap={{ scale: 0.95 }}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20"
        >
          <Button
            onClick={() => scroll('right')}
            variant="ghost"
            size="icon"
            className="bg-gradient-to-r from-violet-600 to-indigo-600 backdrop-blur-xl border-0 text-white hover:from-violet-700 hover:to-indigo-700 shadow-2xl w-12 h-12 rounded-2xl"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </motion.div>
        
        <div className="flex justify-center mt-8">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button variant="outline" className="text-base text-cyan-600 hover:text-cyan-700 border-2 border-cyan-200 hover:bg-cyan-50 gap-2 shadow-sm hover:shadow-lg transition-all px-6 py-6 rounded-2xl">
              Open in CreativeIQ
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
