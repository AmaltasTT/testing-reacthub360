'use client'

import { motion } from 'motion/react';
import { Radio, Users, MousePointerClick, ShoppingCart, MessageSquare, ArrowUpRight } from 'lucide-react';

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
  changeType: 'positive' | 'neutral' | 'negative';
  color: string;
  delay: number;
}

function MetricCard({ icon, label, value, change, changeType, color, delay }: MetricCardProps) {
  const changeColor = changeType === 'positive' ? 'text-green-600' : changeType === 'negative' ? 'text-[#e11d48]' : 'text-gray-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group relative bg-white rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Hover gradient glow */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${color} mix-blend-soft-light`} />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-6 shadow-md`}
        >
          {icon}
        </motion.div>

        {/* Metric value - LARGE */}
        <div className="mb-4">
          <div className="text-6xl text-gray-900 tracking-tight mb-2">
            {value}
          </div>
          <div className="text-base text-gray-600">
            {label}
          </div>
        </div>

        {/* Change indicator */}
        <div className={`flex items-center gap-1 text-sm ${changeColor}`}>
          <ArrowUpRight className="w-4 h-4" />
          <span>{change}</span>
        </div>
      </div>

      {/* Subtle decorative element */}
      <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-gray-100/50 group-hover:scale-150 transition-transform duration-500" />
    </motion.div>
  );
}

export function ReactMetrics() {
  const metrics = [
    {
      icon: <Radio className="w-7 h-7 text-white" />,
      label: 'Reach',
      value: '2.4M',
      change: '+18% vs last week',
      changeType: 'positive' as const,
      color: 'from-violet-500 to-purple-600',
      delay: 0.1,
    },
    {
      icon: <Users className="w-7 h-7 text-white" />,
      label: 'Engage',
      value: '847K',
      change: '+23% vs last week',
      changeType: 'positive' as const,
      color: 'from-cyan-500 to-blue-600',
      delay: 0.2,
    },
    {
      icon: <MousePointerClick className="w-7 h-7 text-white" />,
      label: 'Act',
      value: '124K',
      change: '+15% vs last week',
      changeType: 'positive' as const,
      color: 'from-indigo-500 to-violet-600',
      delay: 0.3,
    },
    {
      icon: <ShoppingCart className="w-7 h-7 text-white" />,
      label: 'Convert',
      value: '18.2K',
      change: '+8% vs last week',
      changeType: 'positive' as const,
      color: 'from-pink-500 to-rose-600',
      delay: 0.4,
    },
    {
      icon: <MessageSquare className="w-7 h-7 text-white" />,
      label: 'Talk',
      value: '3.1K',
      change: '+31% vs last week',
      changeType: 'positive' as const,
      color: 'from-orange-500 to-pink-600',
      delay: 0.5,
    },
  ];

  return (
    <div className="mb-20">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <h2 className="text-3xl text-gray-900 mb-2">Brand in Motion</h2>
        <p className="text-lg text-gray-500">Real-time intelligence across your marketing universe</p>
      </motion.div>

      {/* Metrics grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>
    </div>
  );
}
