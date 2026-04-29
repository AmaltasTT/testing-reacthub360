'use client'

import { motion } from 'motion/react';
import { Brain, Shuffle, Rocket, Palette, Users } from 'lucide-react';
import Link from 'next/link';

interface ModuleCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  delay: number;
  href?: string;
}

function ModuleCard({ icon, title, description, color, delay, href }: ModuleCardProps) {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`relative overflow-hidden rounded-3xl bg-white p-8 cursor-pointer group card-enhanced card-hover-glow transition-all duration-500 border border-gray-100`}
    >
      {/* Subtle gradient accent */}
      <motion.div 
        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-cyan-500 to-indigo-500 rounded-t-3xl"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
      />
      
      <div className="relative z-10">
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="mb-6"
        >
          {icon}
        </motion.div>
        <h3 className="text-2xl text-gray-900 mb-3 tracking-tight group-hover:text-gray-700 transition-colors">{title}</h3>
        <p className="text-base text-gray-600 leading-relaxed mb-4">{description}</p>
        
        {/* Enhanced CTA that appears on hover */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ opacity: 1, y: 0, x: 4 }}
          className="flex items-center gap-2 text-sm text-cyan-600 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:underline"
          style={{ fontWeight: 600 }}
        >
          <span>Open {title}</span>
          <span>→</span>
        </motion.button>
      </div>
      
      {/* Decorative element */}
      <div className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full bg-gradient-to-br from-violet-50 to-cyan-50 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-700" />
    </motion.div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

export function ModuleAccessBar() {
  return (
    <div className="mb-24">
      <motion.div 
        initial={{ opacity: 0.8, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mb-12 text-center"
      >
        <h2 className="text-5xl text-gray-900 mb-4 tracking-tight section-header">Your Intelligence Network</h2>
        <p className="text-xl text-gray-500 tracking-wide" style={{ color: '#717784' }}>Everything you need to understand, plan, and grow your brand</p>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <ModuleCard
          icon={
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
          }
          title="InsightsIQ"
          description="See what's driving results and why it matters."
          color=""
          delay={0.1}
        />
        <ModuleCard
          icon={
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Shuffle className="w-8 h-8 text-white" />
            </div>
          }
          title="MixIQ"
          description="Allocate budget where it'll multiply fastest."
          color=""
          delay={0.2}
        />
        <ModuleCard
          icon={
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <Rocket className="w-8 h-8 text-white" />
            </div>
          }
          title="LaunchIQ"
          description="Go live across channels in minutes, not days."
          color=""
          delay={0.3}
          href="/launchiq"
        />
        <ModuleCard
          icon={
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center shadow-lg">
              <Palette className="w-8 h-8 text-white" />
            </div>
          }
          title="CreativeIQ"
          description="Know which creative will hit before you publish."
          color=""
          delay={0.4}
        />
        <ModuleCard
          icon={
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
          }
          title="CompetitorIQ"
          description="Stay ahead of every move your rivals make."
          color=""
          delay={0.5}
        />
      </div>
    </div>
  );
}
