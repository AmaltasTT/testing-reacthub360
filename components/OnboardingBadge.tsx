'use client'

import { motion } from 'motion/react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

interface OnboardingBadgeProps {
  progress: number; // 0-100
}

export function OnboardingBadge({ progress }: OnboardingBadgeProps) {
  // Color coding based on progress percentage
  const getProgressColor = () => {
    if (progress < 40) return '#EF4444'; // Red below 40%
    if (progress >= 40 && progress < 75) return '#EAB308'; // Yellow 40-74%
    return '#10B981'; // Green 75-100%
  };

  const progressColor = getProgressColor();
  
  // Background color for the badge - more subtle
  const getBgColor = () => {
    if (progress < 40) return 'bg-red-50/80 border-red-200/50';
    if (progress >= 40 && progress < 75) return 'bg-yellow-50/80 border-yellow-200/50';
    return 'bg-green-50/80 border-green-200/50';
  };

  const bgColor = getBgColor();
  
  // Text color based on progress - more subtle
  const getTextColor = () => {
    if (progress < 40) return 'text-red-700';
    if (progress >= 40 && progress < 75) return 'text-yellow-700';
    return 'text-green-700';
  };
  
  const textColor = getTextColor();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className={`relative px-3 py-1.5 rounded-full backdrop-blur-xl border shadow-sm cursor-help ${bgColor}`}
          >
            <div className="flex items-center gap-2">
              {/* Circular progress ring - smaller */}
              <div className="relative w-7 h-7 flex-shrink-0">
                <svg className="w-7 h-7 transform -rotate-90">
                  {/* Background circle */}
                  <circle
                    cx="14"
                    cy="14"
                    r="11"
                    stroke="#E5E7EB"
                    strokeWidth="2.5"
                    fill="white"
                  />
                  {/* Progress arc */}
                  <motion.circle
                    cx="14"
                    cy="14"
                    r="11"
                    stroke={progressColor}
                    strokeWidth="2.5"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 11}`}
                    strokeDashoffset={`${2 * Math.PI * 11 * (1 - progress / 100)}`}
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: 2 * Math.PI * 11 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 11 * (1 - progress / 100) }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                </svg>
                {/* Percentage in center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] font-semibold text-gray-900">{progress}%</span>
                </div>
              </div>
              
              {/* Text content - hide on mobile */}
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="text-[11px] text-gray-600">Onboarding</span>
                <span className={`text-[11px] font-semibold ${textColor}`}>Completion</span>
              </div>
            </div>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="text-sm">
            Track your onboarding steps — connect remaining channels to unlock full insights.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
