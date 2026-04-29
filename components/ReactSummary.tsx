'use client'

import { motion } from "motion/react";
import {
  Radio,
  Users,
  MousePointerClick,
  ShoppingCart,
  MessageSquare,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRef } from "react";
import { Button } from "./ui/button";

interface MetricTileProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
  gradient: string;
  delay: number;
}

function MetricTile({
  icon,
  label,
  value,
  change,
  gradient,
  delay,
}: MetricTileProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      className="group relative bg-white rounded-[2rem] p-10 card-enhanced card-hover-glow transition-all duration-500 cursor-pointer overflow-hidden border border-gray-100"
    >
      {/* Subtle gradient on hover */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 bg-gradient-to-br ${gradient}`}
      />

      {/* Icon with glow */}
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="relative mb-8"
      >
        <div
          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
        >
          {icon}
        </div>
        {/* Subtle glow ring */}
        <div
          className={`absolute inset-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}
        />
      </motion.div>

      {/* Metric value - LARGE cinematic typography */}
      <div className="mb-6">
        <motion.div
          className="text-7xl text-gray-900 tracking-tight mb-2"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.2, duration: 0.5 }}
        >
          {value}
        </motion.div>
        <div className="text-sm text-gray-500 uppercase tracking-wider mb-1">
          {label}
        </div>
        {/* Micro-context that appears on hover */}
        <motion.div
          className="text-xs text-gray-400 h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-300 overflow-hidden"
          style={{ fontWeight: 500 }}
        >
          {label === "Reach" && "people saw your brand"}
          {label === "Engage" && "interactions with your content"}
          {label === "Act" && "clicked to learn more"}
          {label === "Convert" && "became customers"}
          {label === "Talk" && "conversations started"}
        </motion.div>
      </div>

      {/* Change indicator - green accent */}
      <div className="flex items-center gap-2 text-sm text-green-600">
        <TrendingUp className="w-4 h-4" />
        <span>{change}</span>
      </div>
    </motion.div>
  );
}

export function ReactSummary() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollPosition =
        scrollContainerRef.current.scrollLeft +
        (direction === "right" ? scrollAmount : -scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: "smooth",
      });
    }
  };

  const metrics = [
    {
      icon: <Radio className="w-8 h-8 text-white" />,
      label: "Reach",
      value: "2.4M",
      change: "+18% vs last week",
      gradient: "from-violet-500 to-purple-600",
      delay: 0.1,
    },
    {
      icon: <Users className="w-8 h-8 text-white" />,
      label: "Engage",
      value: "847K",
      change: "+23% vs last week",
      gradient: "from-cyan-500 to-blue-600",
      delay: 0.2,
    },
    {
      icon: <MousePointerClick className="w-8 h-8 text-white" />,
      label: "Act",
      value: "124K",
      change: "+15% vs last week",
      gradient: "from-indigo-500 to-violet-600",
      delay: 0.3,
    },
    {
      icon: <ShoppingCart className="w-8 h-8 text-white" />,
      label: "Convert",
      value: "18.2K",
      change: "+8% vs last week",
      gradient: "from-pink-500 to-rose-600",
      delay: 0.4,
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-white" />,
      label: "Talk",
      value: "3.1K",
      change: "+31% vs last week",
      gradient: "from-orange-500 to-pink-600",
      delay: 0.5,
    },
  ];

  return (
    <section className="mb-24">
      {/* Section header - H1 exception, centered */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="mb-12 text-center"
      >
        <h1
          className="text-[48px] text-[#444A57] mb-3"
          style={{ fontWeight: 600, letterSpacing: "-0.01em" }}
        >
          How Your Brand Showed Up This Week
        </h1>
        <p className="text-[18px] text-[#717784]" style={{ fontWeight: 400 }}>
          From first impression to final conversion — here's your full-funnel
          story
        </p>
      </motion.div>

      {/* Metrics grid - 5 columns on large screens */}
      <div className="relative">
        {/* Left scroll button */}
        <Button
          onClick={() => scroll("left")}
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-gradient-to-br from-violet-600 to-purple-700 backdrop-blur-xl border-0 text-white hover:from-violet-700 hover:to-purple-800 hover:scale-110 active:scale-95 shadow-lg hover:shadow-xl w-14 h-14 rounded-3xl transition-all duration-200"
          style={{ pointerEvents: "auto" }}
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        {/* Scrollable container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-6 px-10 scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {metrics.map((metric) => (
            <div key={metric.label} className="min-w-[270px] flex-shrink-0">
              <MetricTile {...metric} />
            </div>
          ))}
        </div>

        {/* Right scroll button */}
        <Button
          onClick={() => scroll("right")}
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-gradient-to-br from-violet-600 to-purple-700 backdrop-blur-xl border-0 text-white hover:from-violet-700 hover:to-purple-800 hover:scale-110 active:scale-95 shadow-lg hover:shadow-xl w-14 h-14 rounded-3xl transition-all duration-200"
          style={{ pointerEvents: "auto" }}
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      {/* Subtle gradient divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="mt-16 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"
      />
    </section>
  );
}
