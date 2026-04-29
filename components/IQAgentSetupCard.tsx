'use client'

import { motion } from 'motion/react';
import { Zap, RefreshCw, Settings, Sparkles } from 'lucide-react';
import { useState } from 'react';

type IQAgentState = 'inactive' | 'warming-up' | 'active';

interface IQAgentSetupCardProps {
  state?: IQAgentState;
}

// Neural network particle component
function NeuralParticle({ index, total }: { index: number; total: number }) {
  const angle = (index / total) * Math.PI * 2;
  const radius = 120;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;
  
  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-violet-400 to-cyan-400"
      style={{
        left: '50%',
        top: '50%',
      }}
      animate={{
        x: [0, x, 0],
        y: [0, y, 0],
        scale: [1, 1.5, 1],
        opacity: [0.3, 0.8, 0.3],
      }}
      transition={{
        duration: 4 + index * 0.5,
        repeat: Infinity,
        ease: "easeInOut",
        delay: index * 0.2,
      }}
    />
  );
}

// Connection lines between particles
function NeuralConnections() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-20" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      {[...Array(8)].map((_, i) => (
        <motion.line
          key={i}
          x1="50%"
          y1="50%"
          x2={`${50 + Math.cos(i * Math.PI / 4) * 30}%`}
          y2={`${50 + Math.sin(i * Math.PI / 4) * 30}%`}
          stroke="url(#connectionGradient)"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 0.5, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
        />
      ))}
    </svg>
  );
}

export function IQAgentSetupCard({ state = 'inactive' }: IQAgentSetupCardProps) {
  const [agentState] = useState<IQAgentState>(state);
  
  // State-specific configuration
  const stateConfig = {
    inactive: {
      icon: <Zap className="w-5 h-5 text-white" />,
      iconGradient: 'from-blue-500 to-indigo-600',
      headline: 'IQAgent — your personalized performance companion',
      subline: 'Get proactive insights, alerts, and recommendations powered by your campaign data.',
      buttonText: 'Configure IQAgent',
      buttonIcon: <Zap className="w-4 h-4" />,
      buttonGradient: 'from-blue-500 to-cyan-500',
      microtext: 'Takes less than 2 minutes to activate personalized intelligence.',
    },
    'warming-up': {
      icon: <RefreshCw className="w-5 h-5 text-white" />,
      iconGradient: 'from-amber-400 to-orange-500',
      headline: 'IQAgent is learning your brand',
      subline: "We're analyzing your campaigns and tuning recommendations. You'll start seeing personalized insights soon.",
      buttonText: 'View Progress',
      buttonIcon: <RefreshCw className="w-4 h-4" />,
      buttonGradient: 'from-amber-400 to-orange-400',
      microtext: 'Training in progress — this usually takes 24-48 hours.',
    },
    active: {
      icon: <Sparkles className="w-5 h-5 text-white" />,
      iconGradient: 'from-violet-500 to-cyan-500',
      headline: 'IQAgent is active and learning',
      subline: "You're receiving personalized notifications and smart recommendations as your data evolves.",
      buttonText: 'Manage Preferences',
      buttonIcon: <Settings className="w-4 h-4" />,
      buttonGradient: 'from-violet-500 to-cyan-500',
      microtext: 'Adaptive learning is on — you can retrain or adjust anytime.',
    },
  };

  const config = stateConfig[agentState];

  return (
    <div className="mb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-[28px] border border-white/40"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 250, 251, 0.9) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(139, 92, 246, 0.08), 0 2px 8px rgba(59, 130, 246, 0.06)',
        }}
      >
        {/* 60/40 Layout Grid */}
        <div className="grid lg:grid-cols-[60%_40%] gap-0">
          {/* Left Column - Content (60%) */}
          <div className="px-10 py-10 flex flex-col justify-center">
            {/* Badge Icon */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${config.iconGradient} flex items-center justify-center shadow-lg mb-5`}
            >
              {config.icon}
            </motion.div>

            {/* Headline */}
            <motion.h3 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-[28px] leading-tight mb-3 text-gray-900"
              style={{ fontWeight: 600 }}
            >
              {config.headline}
            </motion.h3>

            {/* Subline */}
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-[16px] leading-relaxed mb-6 text-gray-600"
              style={{ fontWeight: 400 }}
            >
              {config.subline}
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2 px-6 py-3.5 rounded-xl text-white shadow-lg hover:shadow-xl transition-all bg-gradient-to-r ${config.buttonGradient}`}
                style={{ fontWeight: 600, fontSize: '15px' }}
              >
                {config.buttonIcon}
                <span>{config.buttonText}</span>
              </motion.button>

              <p 
                className="text-[13px] mt-3 text-gray-500"
                style={{ fontWeight: 400 }}
              >
                {config.microtext}
              </p>
            </motion.div>
          </div>

          {/* Right Column - AI Visual (40%) */}
          <div className="relative min-h-[320px] flex items-center justify-center overflow-hidden">
            {/* Animated gradient background */}
            <motion.div
              className="absolute inset-0"
              animate={{
                background: [
                  'linear-gradient(135deg, rgba(196, 181, 253, 0.3) 0%, rgba(165, 243, 252, 0.2) 50%, rgba(255, 255, 255, 0.1) 100%)',
                  'linear-gradient(135deg, rgba(165, 243, 252, 0.3) 0%, rgba(196, 181, 253, 0.2) 50%, rgba(255, 255, 255, 0.1) 100%)',
                  'linear-gradient(135deg, rgba(196, 181, 253, 0.3) 0%, rgba(165, 243, 252, 0.2) 50%, rgba(255, 255, 255, 0.1) 100%)',
                ],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Glowing orb in center */}
            <motion.div
              className="absolute"
              style={{
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, rgba(59, 130, 246, 0.2) 50%, transparent 100%)',
                filter: 'blur(40px)',
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Neural network particles */}
            <div className="relative w-full h-full">
              {[...Array(8)].map((_, i) => (
                <NeuralParticle key={i} index={i} total={8} />
              ))}
              
              {/* Central node */}
              <motion.div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 shadow-lg"
                animate={{
                  scale: [1, 1.3, 1],
                  boxShadow: [
                    '0 0 20px rgba(139, 92, 246, 0.4)',
                    '0 0 40px rgba(139, 92, 246, 0.6)',
                    '0 0 20px rgba(139, 92, 246, 0.4)',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <NeuralConnections />
            </div>

            {/* Floating intelligence indicators */}
            <motion.div
              className="absolute top-8 right-8 px-3 py-2 rounded-xl bg-white/80 backdrop-blur-md shadow-lg border border-violet-200/50"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.7, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
                <span className="text-xs text-gray-700" style={{ fontWeight: 500 }}>
                  {agentState === 'inactive' ? 'Ready to activate' : agentState === 'warming-up' ? 'Learning...' : 'Active'}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
