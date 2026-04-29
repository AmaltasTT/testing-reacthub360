'use client'

import { motion } from 'motion/react';
import { BookOpen, FileText, Users, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

interface ResourceTileProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  delay: number;
}

function ResourceTile({ icon, title, description, color, delay }: ResourceTileProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      className={`relative overflow-hidden rounded-3xl bg-white p-10 cursor-pointer group shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100`}
    >
      {/* Gradient glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50/0 to-cyan-50/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
      
      <div className="relative z-10 text-center">
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="flex justify-center mb-6"
        >
          {icon}
        </motion.div>
        <h3 className="text-3xl text-gray-900 mb-4 tracking-tight">{title}</h3>
        <p className="text-base text-gray-600 mb-6 leading-relaxed">{description}</p>
        <motion.div whileHover={{ x: 4 }}>
          <Button variant="ghost" className="text-base bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent hover:from-violet-700 hover:to-cyan-700 gap-2 p-0 h-auto">
            Show Me How
            <ArrowRight className="w-5 h-5 text-cyan-600" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function LearningCenter() {
  return (
    <div className="mb-24">
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="mb-12 text-center"
      >
        <h1 className="text-[48px] text-[#444A57] mb-3" style={{ fontWeight: 600, letterSpacing: '-0.01em' }}>
          Learn. Apply. Amplify.
        </h1>
        <h3 className="text-[20px] text-[#717784]" style={{ fontWeight: 400 }}>
          Playbooks, insights, and stories to grow your marketing intelligence
        </h3>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <ResourceTile
          icon={
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
          }
          title="Playbooks"
          description="The REACT Framework Playbook."
          color=""
          delay={0.1}
        />
        <ResourceTile
          icon={
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
              <FileText className="w-10 h-10 text-white" />
            </div>
          }
          title="Momentum Guides"
          description="5 KPIs That Matter for Growth."
          color=""
          delay={0.2}
        />
        <ResourceTile
          icon={
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg">
              <Users className="w-10 h-10 text-white" />
            </div>
          }
          title="Community & Events"
          description="Join the next REACTIQ360 webinar."
          color=""
          delay={0.3}
        />
      </div>
    </div>
  );
}
