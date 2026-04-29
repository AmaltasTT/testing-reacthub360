'use client'

import { motion } from 'motion/react';
import { TrendingUp, Target, BarChart3, DollarSign, Heart, Trophy, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { CelebrationEffect } from './CelebrationEffect';

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
  color: string;
  delay: number;
  isPersonalBest?: boolean;
  personalBestLabel?: string;
  category: string;
}

function MetricCard({ icon, label, value, change, color, delay, isPersonalBest, personalBestLabel, category }: MetricCardProps) {
  const [count, setCount] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const targetValue = parseFloat(value);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = targetValue / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= targetValue) {
        setCount(targetValue);
        clearInterval(timer);
        
        // Trigger celebration when reaching personal best
        if (isPersonalBest) {
          setTimeout(() => setShowCelebration(true), 200);
        }
      } else {
        setCount(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [targetValue, isPersonalBest]);

  return (
    <CelebrationEffect trigger={showCelebration}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -8 }}
        className="relative overflow-hidden rounded-2xl bg-white cursor-pointer group transition-all duration-300 border border-gray-100 flex-shrink-0"
        style={{
          width: '340px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        }}
      >
        {/* Gradient top border */}
        <div 
          className="absolute top-0 left-0 right-0 h-1"
          style={{
            background: 'linear-gradient(90deg, #818CF8 0%, #60A5FA 50%, #A78BFA 100%)',
          }}
        />

        {/* Personal Best badge - top right */}
        {isPersonalBest && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.3, duration: 0.4 }}
            className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-md text-xs"
            style={{
              background: 'rgba(255, 107, 0, 0.1)',
              color: '#FF6B00',
              fontWeight: 600,
            }}
          >
            <Trophy className="w-3 h-3" />
            BEST
          </motion.div>
        )}

        <div className="p-6">
          {/* Icon */}
          <motion.div
            whileHover={{ scale: 1.05, rotate: 3 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="mb-5"
          >
            <div className="w-12 h-12">
              {icon}
            </div>
          </motion.div>
          
          {/* Title with metric value */}
          <h3 className="text-gray-900 text-lg mb-3" style={{ fontWeight: 600, lineHeight: 1.4 }}>
            {label} {label.includes('ROAS') ? `${count.toFixed(1)}x` : Math.round(count)}
          </h3>
          
          {/* Quote description */}
          <p className="text-gray-600 text-sm mb-6 italic" style={{ fontWeight: 400, lineHeight: 1.5 }}>
            "{change}"
          </p>

          {/* Bottom section */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            {/* Category badge */}
            <span 
              className="px-3 py-1 rounded-md text-xs"
              style={{
                background: 'rgba(168, 85, 247, 0.1)',
                color: '#8B5CF6',
                fontWeight: 600,
              }}
            >
              {category}
            </span>

            {/* See details link */}
            <motion.button
              whileHover={{ x: 3 }}
              className="flex items-center gap-1 text-sm text-cyan-600 hover:text-cyan-700 transition-colors"
              style={{ fontWeight: 500 }}
            >
              See details
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </CelebrationEffect>
  );
}

export function BrandHealthCards() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -360, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 360, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll(); // Check initial state
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div className="mb-20">
      {/* Header section */}
      <div className="mb-6">
        <h2 className="text-[32px] text-[#444A57] mb-2" style={{ fontWeight: 600, letterSpacing: '-0.01em' }}>
          This week's wins
        </h2>
        <p className="text-base text-[#717784] mb-4" style={{ fontWeight: 400 }}>
          Live intelligence on trends and opportunities you can act on today
        </p>

        {/* Status bar */}
        <div className="flex items-center justify-between">
          {/* Live indicator */}
          <div className="flex items-center gap-2">
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-green-500"
            />
            <span className="text-sm text-gray-600">
              Live · Updated 2 min ago
            </span>
          </div>

          {/* Alert notification */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex items-center gap-2 text-sm"
            style={{ color: '#FF6B00', fontWeight: 500 }}
          >
            <Trophy className="w-4 h-4" />
            2 personal bests this week
          </motion.div>
        </div>
      </div>

      {/* Horizontal scrolling cards with navigation arrows */}
      <div className="relative -mx-8 px-8 group">
        {/* Left arrow */}
        {showLeftArrow && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white border-2 border-gray-200 shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all opacity-0 group-hover:opacity-100"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
        )}

        {/* Right arrow */}
        {showRightArrow && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white border-2 border-gray-200 shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all opacity-0 group-hover:opacity-100"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        )}

        <div 
          ref={scrollContainerRef}
          className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide"
        >
          <MetricCard
            icon={
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            }
            label="Brand Momentum Score"
            value="78"
            change="+5 vs last week — momentum building across all channels"
            color=""
            delay={0.1}
            category="MomentumIQ"
          />
          <MetricCard
            icon={
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
                <Target className="w-6 h-6 text-white" />
              </div>
            }
            label="Active Campaigns"
            value="12"
            change="2 launched this week — strong pipeline execution"
            color=""
            delay={0.2}
            category="LaunchIQ"
          />
          <MetricCard
            icon={
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-md">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            }
            label="Brand Lift"
            value="14"
            change="+14% this week — your highest lift in 2 months"
            color=""
            delay={0.3}
            isPersonalBest={true}
            personalBestLabel="Your highest lift!"
            category="InsightsIQ"
          />
          <MetricCard
            icon={
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center shadow-md">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            }
            label="ROAS"
            value="4.3"
            change="+0.4 vs last month — efficiency improving steadily"
            color=""
            delay={0.4}
            category="MixIQ"
          />
          <MetricCard
            icon={
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-md">
                <Heart className="w-6 h-6 text-white" />
              </div>
            }
            label="Sentiment Score"
            value="82"
            change="+3 points — audience connection at peak levels"
            color=""
            delay={0.5}
            isPersonalBest={true}
            personalBestLabel="Your highest CTR!"
            category="CreativeIQ"
          />
        </div>
      </div>

      {/* Add scrollbar styling */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}