'use client'

import { motion } from 'motion/react';
import { ArrowRight, Plus, Sparkles, Facebook, Instagram, Linkedin, Youtube, Twitter } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useState } from 'react';

// Brand icon components
const BrandIcons: Record<string, React.ReactNode> = {
  FB: <Facebook className="w-4 h-4" />,
  IG: <Instagram className="w-4 h-4" />,
  LI: <Linkedin className="w-4 h-4" />,
  YT: <Youtube className="w-4 h-4" />,
  TT: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  ),
  GG: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  ),
  TW: <Twitter className="w-4 h-4" />,
};

interface CampaignCardProps {
  name: string;
  platforms: string[];
  spend: string;
  metric: string;
  status: 'Excellent' | 'Good' | 'Needs Attention';
  delay: number;
}

function CampaignCard({ name, platforms, spend, metric, status, delay }: CampaignCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const statusConfig = {
    Excellent: {
      badgeClass: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-300',
      borderGradient: 'linear-gradient(180deg, #10B981 0%, #059669 100%)',
      glowColor: 'rgba(16, 185, 129, 0.4)',
      bgGradient: 'linear-gradient(135deg, rgba(236, 253, 245, 0.4) 0%, rgba(255, 255, 255, 1) 100%)',
    },
    Good: {
      badgeClass: 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-300',
      borderGradient: 'linear-gradient(180deg, #3B82F6 0%, #0EA5E9 100%)',
      glowColor: 'rgba(59, 130, 246, 0.3)',
      bgGradient: 'linear-gradient(135deg, rgba(239, 246, 255, 0.4) 0%, rgba(255, 255, 255, 1) 100%)',
    },
    'Needs Attention': {
      badgeClass: 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 border-orange-300',
      borderGradient: 'linear-gradient(180deg, #F97316 0%, #F59E0B 100%)',
      glowColor: 'rgba(249, 115, 22, 0.3)',
      bgGradient: 'linear-gradient(135deg, rgba(255, 247, 237, 0.4) 0%, rgba(255, 255, 255, 1) 100%)',
    },
  };

  const config = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, scale: 1.01 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative overflow-hidden rounded-3xl p-8 cursor-pointer group transition-all duration-500"
      style={{
        background: config.bgGradient,
        boxShadow: isHovered 
          ? `0 20px 40px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(107, 124, 255, 0.1), 0 0 30px ${config.glowColor}`
          : '0 4px 20px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.04)',
      }}
    >
      {/* Status-based gradient ribbon on left edge with glow */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1.5"
        style={{
          background: config.borderGradient,
          boxShadow: isHovered ? `0 0 15px ${config.glowColor}` : 'none',
          transition: 'box-shadow 0.3s ease',
        }}
      />
      
      {/* Sparkles for Excellent campaigns */}
      {status === 'Excellent' && (
        <div className="absolute top-6 right-6">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, 0],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Sparkles className="w-5 h-5 text-green-500" />
          </motion.div>
        </div>
      )}
      
      {/* Hover glow overlay */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(107, 124, 255, 0.08) 0%, transparent 70%)',
        }}
      />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <h3 className="text-2xl text-gray-900" style={{ fontWeight: 600 }}>{name}</h3>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Badge className={`${config.badgeClass} border-2 px-4 py-1.5 shadow-md`}>
                {status}
              </Badge>
            </motion.div>
          </div>
          
          {/* Platform icons with brand icons */}
          <div className="flex items-center gap-2.5 mb-5">
            {platforms.map((platform, idx) => {
              const icon = BrandIcons[platform];
              return (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.1, y: -2 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-600 flex items-center justify-center text-white shadow-md hover:shadow-lg transition-shadow"
                >
                  {icon || <span className="text-xs">{platform}</span>}
                </motion.div>
              );
            })}
          </div>
          
          <div className="flex items-center gap-6 text-base flex-wrap">
            <span className="text-gray-600">
              Spend: <span className="text-gray-900" style={{ fontWeight: 600 }}>{spend}</span>
            </span>
            <div className="flex items-center gap-2">
              <motion.span
                animate={{
                  opacity: [1, 0.7, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="text-cyan-600 px-3 py-1.5 rounded-lg bg-cyan-50/50 border border-cyan-200/50"
                style={{ fontWeight: 600 }}
              >
                {metric}
              </motion.span>
              {/* Comparative context */}
              {status === 'Excellent' && (
                <span className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded-md border border-green-200">
                  2.1x your avg
                </span>
              )}
            </div>
          </div>
        </div>
        
        <motion.div whileHover={{ x: 4 }}>
          <Button 
            variant="ghost" 
            className="text-gray-700 hover:text-cyan-600 hover:bg-cyan-50/80 gap-2 rounded-xl px-6 py-6 border border-transparent hover:border-cyan-200 transition-all"
          >
            <span className="underline decoration-transparent group-hover:decoration-cyan-600 transition-all" style={{ fontWeight: 500 }}>
              Optimize now
            </span>
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function ActiveCampaigns() {
  return (
    <div className="mb-24">
      {/* Header with unified H2 system */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="flex items-start justify-between mb-6"
      >
        <div>
          <h2 className="text-[32px] text-[#444A57] mb-2" style={{ fontWeight: 600, letterSpacing: '-0.01em' }}>
            What's Running Right Now
          </h2>
          <p className="text-[18px] text-[#717784]" style={{ fontWeight: 400 }}>
            Your campaigns, their momentum, and where to focus next
          </p>
        </div>
        
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-0 gap-2 shadow-lg hover:shadow-xl transition-all px-6 py-6 rounded-2xl">
            <Plus className="w-5 h-5" />
            Create New Campaign
          </Button>
        </motion.div>
      </motion.div>
      
      {/* Campaign cards */}
      <div className="space-y-6 mb-12">
        <CampaignCard
          name="Q4 Brand Awareness Push"
          platforms={['FB', 'IG', 'LI']}
          spend="$24,500"
          metric="+18% reach"
          status="Excellent"
          delay={0.1}
        />
        <CampaignCard
          name="Product Launch - TikTok Series"
          platforms={['TT', 'YT']}
          spend="$18,200"
          metric="+31% engagement"
          status="Good"
          delay={0.2}
        />
        <CampaignCard
          name="Retargeting Campaign"
          platforms={['FB', 'GG']}
          spend="$12,800"
          metric="+12% conversions"
          status="Needs Attention"
          delay={0.3}
        />
      </div>
      
      {/* Animated gradient line */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.3 }}
        className="mb-8"
      >
        <motion.div
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="h-[1px] w-full"
          style={{
            background: 'linear-gradient(90deg, #6B7CFF 0%, #A6E3FF 50%, transparent 100%)',
            backgroundSize: '200% 100%',
            opacity: 0.08,
          }}
        />
      </motion.div>
      
      {/* Campaign Exploration CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center"
      >
        {/* Emotional copy line with hover underline */}
        <motion.div
          className="relative mb-6 max-w-[640px]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 
            className="text-[18px] text-center"
            style={{ 
              color: 'rgba(30, 30, 30, 0.9)', 
              fontWeight: 500,
            }}
          >
            See what's driving your wins and where to amplify momentum.
          </h3>
          
          {/* Hover underline animation */}
          <motion.div
            className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-[#6B7CFF] to-[#00C6FF]"
            initial={{ width: 0 }}
            whileHover={{ width: '100%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </motion.div>
        
        {/* CTA Button */}
        <motion.div
          whileHover={{ y: -2 }}
          className="inline-block"
        >
          <button
            className="group relative overflow-hidden px-8 py-4 rounded-[14px] transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #6B7CFF 0%, #00C6FF 100%)',
              boxShadow: '0 4px 12px rgba(107, 124, 255, 0.15)',
            }}
          >
            {/* Hover glow effect */}
            <motion.div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ 
                boxShadow: '0 0 25px rgba(107, 124, 255, 0.4), 0 0 40px rgba(0, 198, 255, 0.3)' 
              }}
            />
            
            <div className="flex items-center gap-3 relative z-10">
              <span className="text-[18px] text-white" style={{ fontWeight: 600 }}>
                Explore All Campaigns
              </span>
              
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <ArrowRight className="w-5 h-5 text-white" />
              </motion.div>
            </div>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
