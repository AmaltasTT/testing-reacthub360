'use client'

import { motion } from 'motion/react';
import { Wifi, ArrowRight, CheckCircle2, Clock, Check, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { OnboardingProgress } from './OnboardingProgress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { useConnectedPlatforms } from '@/hooks/use-platforms';
import Image from 'next/image';

interface ChannelIconProps {
  name: string;
  status: 'active' | 'pending';
  delay: number;
  disabled?: boolean;
  logoUrl?: string;
  category?: string;
}

function ChannelIcon({ name, status, delay, disabled = false, logoUrl, category }: ChannelIconProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, duration: 0.4 }}
            whileHover={!disabled ? { scale: 1.08, y: -4 } : {}}
            className="relative cursor-pointer"
          >
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-md transition-all duration-300 ${disabled
                ? 'bg-gray-100 text-gray-400 border-2 border-gray-200 opacity-50'
                : status === 'active'
                  ? 'bg-white border-2 border-violet-300 hover:shadow-xl hover:border-violet-400'
                  : 'bg-white text-gray-600 border-2 border-gray-300 hover:shadow-lg hover:border-gray-400'
              }`}>
              {logoUrl ? (
                <div className="relative w-12 h-12">
                  <Image
                    src={logoUrl}
                    alt={name}
                    fill
                    className="object-contain"
                    sizes="48px"
                  />
                </div>
              ) : (
                <span className="text-sm font-medium text-gray-700">{name.slice(0, 2)}</span>
              )}
            </div>
            {!disabled && (
              <motion.div
                animate={status === 'active' ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
                className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-3 border-white flex items-center justify-center shadow-lg ${status === 'active' ? 'bg-green-500' : 'bg-orange-400'
                  }`}
              >
                {status === 'active' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                ) : (
                  <Clock className="w-3.5 h-3.5 text-white" />
                )}
              </motion.div>
            )}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          sideOffset={8}
          className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 px-4 py-3 shadow-2xl rounded-lg"
        >
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-white text-sm tracking-tight">{name}</p>
            </div>
            {category && (
              <p className="text-xs text-slate-400 font-medium">{category}</p>
            )}
            <div className="flex items-center gap-1.5 pt-0.5 border-t border-slate-700/50 mt-2 pt-2">
              {status === 'active' ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50 animate-pulse" />
                  <span className="text-xs font-medium text-emerald-300">Active & Syncing</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50" />
                  <span className="text-xs font-medium text-amber-300">Authentication Pending</span>
                </>
              )}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function IntelligenceNetwork() {
  // Fetch platforms data from API
  const {
    connectedPlatforms,
    pendingPlatforms,
    allPlatforms,
    isLoading,
    error,
    connectedCount,
    pendingCount,
  } = useConnectedPlatforms();

  // Plan configuration
  const planName = 'Growth';
  const channelLimit = 8; // Plan-based limit (Growth: 8, Premium: unlimited)
  const onboardingProgress: number = 75; // Setup completion percentage (0-100)

  // Combine connected and pending platforms for display
  const displayPlatforms = [
    ...connectedPlatforms.map(p => ({
      id: p.id,
      name: p.name,
      status: 'active' as const,
      logoUrl: p.logo.url,
      category: p.category
    })),
    ...pendingPlatforms.map(p => ({
      id: p.id,
      name: p.name,
      status: 'pending' as const,
      logoUrl: p.logo.url,
      category: p.category
    })),
  ];

  const capacityUsedPercentage = Math.round((connectedCount / channelLimit) * 100);
  const isAtCapacity = connectedCount >= channelLimit;

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-white p-12 mb-20 shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-gray-100">
      {/* Setup Progress Ring - Minimalist Circular */}
      <div className="absolute top-8 right-8">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative w-12 h-12 cursor-help">
                {/* Background arc */}
                <svg className="w-12 h-12 transform -rotate-90">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="#EAEFF5"
                    strokeWidth="2.5"
                    fill="none"
                  />
                  {/* Gradient progress arc */}
                  {onboardingProgress < 100 ? (
                    <>
                      <defs>
                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#00C2FF" />
                          <stop offset="100%" stopColor="#8C52FF" />
                        </linearGradient>
                      </defs>
                      <motion.circle
                        cx="24"
                        cy="24"
                        r="20"
                        stroke="url(#progressGradient)"
                        strokeWidth="2.5"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 20}`}
                        strokeDashoffset={`${2 * Math.PI * 20 * (1 - onboardingProgress / 100)}`}
                        strokeLinecap="round"
                        initial={{ strokeDashoffset: 2 * Math.PI * 20 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 20 * (1 - onboardingProgress / 100) }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                      />
                    </>
                  ) : (
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      stroke="#10B981"
                      strokeWidth="2.5"
                      fill="none"
                    />
                  )}
                </svg>
                {/* Center content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {onboardingProgress === 100 ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <span className="text-xs text-gray-700">{onboardingProgress}%</span>
                  )}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-sm">
                Setup {onboardingProgress}% complete — connect remaining channels to unlock full insights.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Subtle gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-cyan-500 to-indigo-500 rounded-t-[2rem] opacity-60" />

      {/* Minimal background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.03, 0.06, 0.03],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-96 h-96 bg-violet-500 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10">
        <div className="mb-10">
          {/* Bold WiFi icon with gradient */}
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block mb-6"
          >
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-md">
              <Wifi className="w-7 h-7 text-white" />
              {/* Pulsing rings */}
              <motion.div
                animate={{
                  scale: [1, 1.8],
                  opacity: [0.4, 0],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-2xl border-2 border-cyan-500"
              />
            </div>
          </motion.div>

          <h2 className="text-[32px] text-[#444A57] mb-2" style={{ fontWeight: 600, letterSpacing: '-0.01em' }}>
            Connected Brilliance
          </h2>
          <p className="text-[18px] text-[#717784] mb-4" style={{ fontWeight: 400 }}>
            Your channels, unified. Your data, alive.
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <p className="text-base text-gray-600">
                <span className="text-gray-900">Plan: {planName}</span> · <span className="text-gray-900">{connectedCount} of {channelLimit} channels connected</span>
                {pendingCount > 0 && <> · <span className="text-orange-600">{pendingCount} pending</span></>}
              </p>
              {/* Capacity indicator */}
              {capacityUsedPercentage >= 75 && (
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs shadow-sm ${isAtCapacity
                      ? 'bg-red-100 text-red-700 border-2 border-red-300'
                      : 'bg-orange-100 text-orange-700 border-2 border-orange-300'
                    }`}
                >
                  {isAtCapacity ? 'At capacity' : 'Near capacity'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Channel icons grid */}
        <div className="flex flex-wrap gap-6 mb-10 justify-center lg:justify-start min-h-[120px]">
          {isLoading ? (
            <div className="w-full flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
              <span className="ml-3 text-gray-600">Loading channels...</span>
            </div>
          ) : error ? (
            <div className="w-full flex items-center justify-center py-12">
              <p className="text-[#e11d48]">Failed to load channels. Please try again later.</p>
            </div>
          ) : displayPlatforms.length === 0 ? (
            <div className="w-full flex items-center justify-center py-12">
              <p className="text-gray-600">No channels connected yet. Start by connecting your first platform!</p>
            </div>
          ) : (
            displayPlatforms.map((platform, idx) => {
              // Disable channels beyond capacity if at limit
              const shouldDisable = isAtCapacity && platform.status === 'pending';
              return (
                <ChannelIcon
                  key={platform.id}
                  name={platform.name}
                  status={platform.status}
                  delay={0.1 + idx * 0.05}
                  disabled={shouldDisable}
                  logoUrl={platform.logoUrl}
                  category={platform.category}
                />
              );
            })
          )}
        </div>

        {/* CTA and sync info */}
        <div className="pt-8 border-t border-gray-200 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm"
              />
              <span className="text-base text-gray-600">Active sync • Real-time intelligence flowing</span>
            </div>

            {isAtCapacity ? (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white border-0 gap-2 shadow-lg hover:shadow-xl transition-all px-6 py-6 rounded-2xl">
                  Upgrade Plan
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </motion.div>
            ) : (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 text-white border-0 gap-2 shadow-lg hover:shadow-xl transition-all px-6 py-6 rounded-2xl">
                  Expand Network
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </motion.div>
            )}
          </div>

          {/* Gentle nudge when at capacity */}
          {isAtCapacity && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-violet-50 border-2 border-violet-200 rounded-2xl p-4"
            >
              <p className="text-base text-gray-700">
                You've maxed out your connected channels — unlock unlimited intelligence on <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Premium</span>.
              </p>
            </motion.div>
          )}

          {/* Onboarding Progress Bar */}
          <OnboardingProgress progress={onboardingProgress} />
        </div>
      </div>
    </div>
  );
}
