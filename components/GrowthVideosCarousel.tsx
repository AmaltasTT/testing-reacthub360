'use client'

import { motion } from 'motion/react';
import { Play, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface VideoCardProps {
  title: string;
  duration: string;
  thumbnail: string;
  category: string;
}

function VideoCard({ title, duration, thumbnail, category }: VideoCardProps) {
  // Category-based gradients
  const categoryGradients: Record<string, string> = {
    'Quick Win': 'linear-gradient(135deg, #FFC3F7 0%, #FEE2FF 100%)',
    'Strategy': 'linear-gradient(135deg, #B7D5FF 0%, #EAF3FF 100%)',
    'Creative': 'linear-gradient(135deg, #00E0FF 0%, #E0FFFF 100%)',
    'CompetitorIQ': 'linear-gradient(135deg, #C2DFFF 0%, #FFFFFF 100%)',
    'Advanced': 'linear-gradient(135deg, #E0B3FF 0%, #F5E0FF 100%)',
    'Tutorial': 'linear-gradient(135deg, #B3FFE0 0%, #E0FFF5 100%)',
  };

  return (
    <div className="px-3">
      <motion.div
        whileHover={{ y: -6, scale: 1.02 }}
        className="relative overflow-hidden rounded-3xl bg-white cursor-pointer group card-enhanced card-hover-glow transition-all duration-300 border border-gray-100"
      >
        {/* Video thumbnail with gradient and vignette */}
        <div 
          className="relative aspect-video overflow-hidden"
          style={{
            background: categoryGradients[category] || 'linear-gradient(135deg, #B7D5FF 0%, #EAF3FF 100%)',
            boxShadow: 'inset 0 0 20px rgba(107, 124, 255, 0.08)',
            filter: 'blur(1px)',
          }}
        >
          {/* Vignette effect */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at center, transparent 40%, rgba(0, 0, 0, 0.15) 100%)',
            }}
          />
          
          <div className="absolute inset-0 flex items-center justify-center" style={{ filter: 'blur(0)' }}>
            <motion.div
              whileHover={{ scale: 1.15 }}
              className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-2xl group-hover:bg-gradient-to-r group-hover:from-violet-600 group-hover:to-cyan-600 transition-all duration-300"
              style={{
                boxShadow: '0 0 30px rgba(107, 124, 255, 0.25)',
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Play className="w-7 h-7 text-violet-600 group-hover:text-white transition-colors fill-current ml-1" />
              </motion.div>
            </motion.div>
          </div>
          
          {/* Duration badge */}
          <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-gray-900/80 backdrop-blur-sm flex items-center gap-1">
            <Clock className="w-3 h-3 text-white" />
            <span className="text-white text-xs">{duration}</span>
          </div>

          {/* Hover gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-violet-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Video info */}
        <div className="p-4">
          <h3 className="text-gray-900 text-sm mb-1 line-clamp-2 group-hover:text-violet-600 transition-colors">
            {title}
          </h3>
        </div>

        {/* Shimmer effect */}
        <motion.div
          animate={{
            x: ['-200%', '200%'],
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 5,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
        />
      </motion.div>
    </div>
  );
}

export function GrowthVideosCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const videos = [
    {
      title: "How to Optimize Your NES Score in 3 Simple Steps",
      duration: "3:42",
      thumbnail: "",
      category: "Quick Win"
    },
    {
      title: "Understanding Campaign Momentum: Data-Driven Insights",
      duration: "5:15",
      thumbnail: "",
      category: "Strategy"
    },
    {
      title: "Creative Best Practices for TikTok & Meta Ads",
      duration: "4:28",
      thumbnail: "",
      category: "Creative"
    },
    {
      title: "Competitive Intelligence: Track & Beat Your Rivals",
      duration: "6:03",
      thumbnail: "",
      category: "CompetitorIQ"
    },
    {
      title: "Attribution Mastery: MixIQ Deep Dive",
      duration: "7:20",
      thumbnail: "",
      category: "Advanced"
    },
    {
      title: "Weekly Momentum Report Walkthrough",
      duration: "2:55",
      thumbnail: "",
      category: "Tutorial"
    }
  ];

  const totalSlides = videos.length;
  const slidesToShow = 2;
  const maxIndex = Math.max(0, totalSlides - slidesToShow);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="mb-10">
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="mb-6"
      >
        <h2 className="text-[32px] text-[#444A57] mb-2" style={{ fontWeight: 600, letterSpacing: '-0.01em' }}>
          Growth Momentum Videos
        </h2>
        <p className="text-[18px] text-[#717784]" style={{ fontWeight: 400 }}>
          Watch and learn strategies to accelerate your brand performance
        </p>
      </motion.div>

      <div className="relative">
        {/* Navigation arrows */}
        {currentIndex > 0 && (
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-xl border border-violet-300/60 shadow-lg hover:shadow-xl flex items-center justify-center group transition-all duration-300 hover:scale-110 hover:bg-gradient-to-r hover:from-violet-500 hover:to-cyan-500"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
          </button>
        )}

        {currentIndex < maxIndex && (
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-xl border border-violet-300/60 shadow-lg hover:shadow-xl flex items-center justify-center group transition-all duration-300 hover:scale-110 hover:bg-gradient-to-r hover:from-violet-500 hover:to-cyan-500"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
          </button>
        )}

        {/* Carousel container */}
        <div className="overflow-hidden">
          <motion.div
            className="flex gap-6"
            animate={{ x: `${-currentIndex * (100 / slidesToShow)}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {videos.map((video, index) => (
              <div
                key={index}
                className="flex-shrink-0"
                style={{ width: `calc(${100 / slidesToShow}% - ${(slidesToShow - 1) * 24 / slidesToShow}px)` }}
              >
                <VideoCard {...video} />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Dots navigation */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? 'w-8 h-2 bg-gradient-to-r from-violet-500 to-cyan-500'
                  : 'w-2 h-2 bg-violet-300 hover:bg-violet-400'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
