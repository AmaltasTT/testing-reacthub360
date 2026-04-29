'use client'

import { motion } from 'motion/react';
import { Rocket, BarChart3, Zap, Plus } from 'lucide-react';

interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  cta: string;
  gradient: string;
  delay: number;
}

function ActionCard({ icon, title, description, cta, gradient, delay }: ActionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="group relative bg-white rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Gradient glow on hover */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 bg-gradient-to-br ${gradient}`} />
      
      {/* Icon */}
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-6 shadow-lg`}
      >
        {icon}
      </motion.div>
      
      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-2xl text-gray-900 mb-3">
          {title}
        </h3>
        <p className="text-base text-gray-600 mb-6 leading-relaxed">
          {description}
        </p>
        
        {/* CTA */}
        <motion.button
          whileHover={{ x: 4 }}
          className={`inline-flex items-center gap-2 text-base bg-gradient-to-r ${gradient} bg-clip-text text-transparent group-hover:gap-3 transition-all duration-300`}
        >
          <span>{cta}</span>
          <motion.span
            animate={{ x: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            →
          </motion.span>
        </motion.button>
      </div>
      
      {/* Subtle decorative corner */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className={`absolute top-0 right-0 w-full h-full bg-gradient-to-bl ${gradient} opacity-5 rounded-bl-[4rem]`} />
      </div>
    </motion.div>
  );
}

export function QuickActions() {
  const actions = [
    {
      icon: <Rocket className="w-8 h-8 text-white" />,
      title: 'Launch Campaign',
      description: 'Start a new marketing initiative with AI-powered recommendations and real-time tracking.',
      cta: 'Create Campaign',
      gradient: 'from-violet-500 to-purple-600',
      delay: 0.1,
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-white" />,
      title: 'View Insights',
      description: 'Explore deep analytics across all channels with predictive intelligence and trend detection.',
      cta: 'Explore InsightsIQ',
      gradient: 'from-cyan-500 to-blue-600',
      delay: 0.2,
    },
    {
      icon: <Zap className="w-8 h-8 text-white" />,
      title: 'Optimize Performance',
      description: 'Fine-tune active campaigns with real-time A/B testing and conversion optimization.',
      cta: 'Optimize Now',
      gradient: 'from-orange-500 to-pink-600',
      delay: 0.3,
    },
    {
      icon: <Plus className="w-8 h-8 text-white" />,
      title: 'Connect Channel',
      description: 'Expand your intelligence network by connecting new data sources and platforms.',
      cta: 'Add Integration',
      gradient: 'from-indigo-500 to-violet-600',
      delay: 0.4,
    },
  ];

  return (
    <div className="mb-20">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mb-10"
      >
        <h2 className="text-3xl text-gray-900 mb-2">Ready to Amplify?</h2>
        <p className="text-lg text-gray-500">Your mission control for intelligent action</p>
      </motion.div>
      
      {/* Actions grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {actions.map((action, index) => (
          <ActionCard key={index} {...action} />
        ))}
      </div>
    </div>
  );
}
