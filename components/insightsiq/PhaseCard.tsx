'use client';

import { useState, useRef } from 'react';
import { ChevronDown, Info, TrendingDown, AlertTriangle, Monitor, BarChart3, Sparkles, Radio, Users, MousePointerClick, ShoppingCart, MessageCircle, TrendingUp, Zap, Clipboard, AlertCircle, Heart, Music, Camera, Play, Search } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Area, AreaChart, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { TalkExpandedContent } from '@/components/insightsiq/TalkExpandedContent';
import { ConvertExpandedContent } from '@/components/insightsiq/ConvertExpandedContent';
import { ActExpandedContent } from '@/components/insightsiq/ActExpandedContent';
import { ReachExpandedContent } from '@/components/insightsiq/ReachExpandedContent';
import { EngageExpandedContent } from '@/components/insightsiq/EngageExpandedContent';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import type { ReachExpandedData, EngageExpandedData, ActExpandedData, ConvertExpandedData, TalkExpandedData } from '@/hooks/use-insightsiq';

type Status = 'Healthy' | 'Stable' | 'Improving' | 'Caution' | 'Rising' | 'On Track';

interface Metric {
  label: string;
  value: string | number | null;
  delta?: string | null;
  available?: boolean;
}

/** Backend inverts % change for these so “+” = lower cost = good */
function isInvertedCostMetricLabel(label: string): boolean {
  return (
    /cost per reach|\(cpr\)|cpqr|cost per qualified reach/i.test(label) ||
    /cost per click/i.test(label) ||
    /cost per lead/i.test(label) ||
    /cost per conversion/i.test(label)
  );
}

function formatPhaseMetricValue(metric: Metric): string {
  if (metric.available === false) return '—';
  const v = metric.value;
  if (v === null || v === undefined) return '—';
  return typeof v === 'number' ? String(v) : v;
}

function getDeltaColorClass(delta: string, metricLabel: string): string {
  if (delta === '—') return 'text-slate-400';
  if (delta === '0%') return 'text-slate-500';

  const neg = delta.startsWith('-') || delta.startsWith('\u2212');
  const pos = delta.startsWith('+');
  if (!pos && !neg) return 'text-slate-400';

  const inverted = isInvertedCostMetricLabel(metricLabel);
  if (inverted) {
    if (pos) return 'text-emerald-600';
    if (neg) return 'text-red-500';
  } else {
    if (pos) return 'text-emerald-600';
    if (neg) return 'text-red-500';
  }
  return 'text-slate-500';
}

/** API `pulse_dot: null` hides dot; omit prop to use phase fallback */
function resolvePulseIndicator(
  pulseFromApi: string | null | undefined,
  fallback: 'win' | 'alert' | null | undefined
): 'win' | 'alert' | null {
  if (pulseFromApi === null) return null;
  if (pulseFromApi !== undefined && pulseFromApi !== '') {
    const s = pulseFromApi.toLowerCase();
    if (s.includes('alert') || s.includes('caution') || s.includes('issue') || s.includes('warning')) return 'alert';
    return 'win';
  }
  if (pulseFromApi === '') return null;
  return fallback === 'alert' || fallback === 'win' ? fallback : null;
}

interface SupportingMetric {
  label: string;
  value: string;
  tooltip?: string;
}

interface DeviceBreakdown {
  desktop: string;
  mobile: string;
}

interface Row3Metric {
  label: string;
  value: string;
  tooltip?: string;
  deviceBreakdown?: DeviceBreakdown;
}

export interface ReachFilterContext {
  selectedCampaigns: string[];
  selectedPeriod: number | 'custom';
  customRange: { start: Date | null; end: Date | null };
}

interface PhaseCardProps {
  name: string;
  status: Status;
  metrics: Metric[];
  momentum: string;
  sparklineData: number[];
  /** From phases_overview.status_subtitle */
  statusSubtitle?: string | null;
  /** From phases_overview.pulse_dot; null = no dot */
  pulseDot?: string | null;
  expandedContent: {
    additionalMetrics: Metric[];
    row3Metrics?: Row3Metric[];
  };
  // Optional: Primary and supporting metrics for Reach accordion
  primaryMetrics?: Metric[];
  supportingMetrics?: SupportingMetric[];
  ctaLabel?: string;
  reachFilterContext?: ReachFilterContext;
  // API data for expanded content
  phaseExpandedData?: ReachExpandedData | EngageExpandedData | ActExpandedData | ConvertExpandedData | TalkExpandedData;
  phaseExpandedLoading?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
}

const statusConfig = {
  Healthy: {
    color: 'bg-purple-400',
    label: 'Healthy',
    glow: 'shadow-[0_0_12px_rgba(167,139,250,0.4)]',
    gradient: 'from-purple-400 to-purple-300',
    chartColor: '#A78BFA',
    bgGlow: 'bg-purple-50'
  },
  Stable: {
    color: 'bg-purple-500',
    label: 'Stable',
    glow: 'shadow-[0_0_12px_rgba(139,92,246,0.4)]',
    gradient: 'from-purple-500 to-purple-400',
    chartColor: '#8B5CF6',
    bgGlow: 'bg-purple-50'
  },
  Improving: {
    color: 'bg-purple-600',
    label: 'Improving',
    glow: 'shadow-[0_0_12px_rgba(124,58,237,0.4)]',
    gradient: 'from-purple-600 to-purple-500',
    chartColor: '#7C3AED',
    bgGlow: 'bg-purple-50'
  },
  Caution: {
    color: 'bg-fuchsia-500',
    label: 'Caution',
    glow: 'shadow-[0_0_12px_rgba(217,70,239,0.4)]',
    gradient: 'from-fuchsia-500 to-purple-400',
    chartColor: '#D946EF',
    bgGlow: 'bg-fuchsia-50'
  },
  Rising: {
    color: 'bg-violet-500',
    label: 'Rising',
    glow: 'shadow-[0_0_12px_rgba(139,92,246,0.4)]',
    gradient: 'from-violet-500 to-purple-400',
    chartColor: '#8b5cf6',
    bgGlow: 'bg-violet-50'
  },
  'On Track': {
    color: 'bg-purple-700',
    label: 'On Track',
    glow: 'shadow-[0_0_12px_rgba(109,40,217,0.4)]',
    gradient: 'from-purple-700 to-purple-600',
    chartColor: '#6D28D9',
    bgGlow: 'bg-purple-50'
  }
};

// Phase icons mapping
const phaseIcons = {
  'Reach': Users,
  'Engage': Radio,
  'Act': MousePointerClick,
  'Convert': ShoppingCart,
  'Talk': MessageCircle
};

// Phase-specific color schemes
const phaseColors = {
  'Reach': {
    gradient: 'from-purple-400 to-purple-300',
    accentBar: 'bg-gradient-to-b from-purple-400 to-purple-300',
    statusColor: 'text-[#7652b3]',
    subtitleColor: 'text-emerald-600', // Positive status
    bg: 'bg-purple-50'
  },
  'Engage': {
    gradient: 'from-purple-500 to-purple-400',
    accentBar: 'bg-gradient-to-b from-purple-500 to-purple-400',
    statusColor: 'text-[#7652b3]',
    subtitleColor: 'text-slate-500', // Neutral status
    bg: 'bg-purple-50'
  },
  'Act': {
    gradient: 'from-purple-600 to-purple-500',
    accentBar: 'bg-gradient-to-b from-purple-600 to-purple-500',
    statusColor: 'text-orange-600',
    subtitleColor: 'text-orange-600', // Warning status
    bg: 'bg-purple-50'
  },
  'Convert': {
    gradient: 'from-purple-700 to-purple-600',
    accentBar: 'bg-gradient-to-b from-purple-700 to-purple-600',
    statusColor: 'text-emerald-600',
    subtitleColor: 'text-emerald-600', // Positive status
    bg: 'bg-purple-50'
  },
  'Talk': {
    gradient: 'from-purple-500 to-violet-400',
    accentBar: 'bg-gradient-to-b from-purple-500 to-violet-400',
    statusColor: 'text-[#7652b3]',
    subtitleColor: 'text-emerald-600', // Positive status
    bg: 'bg-purple-50'
  }
};

// Phase-specific configurations for curiosity features
const phaseEnhancements = {
  Reach: {
    pulseDot: 'win' as const,
    statusSubtitle: 'Outperforming by 18%',
    quickAction: {
      text: 'Optimize',
      icon: Zap,
      variant: 'primary' as const
    }
  },
  Engage: {
    pulseDot: null,
    statusSubtitle: 'On target',
    quickAction: {
      text: 'Details',
      icon: Clipboard,
      variant: 'secondary' as const
    }
  },
  Act: {
    pulseDot: 'alert' as const,
    statusSubtitle: '1 issue needs attention',
    quickAction: {
      text: 'Fix Issue',
      icon: AlertCircle,
      variant: 'primary' as const
    }
  },
  Convert: {
    pulseDot: 'win' as const,
    statusSubtitle: 'Revenue up 12%',
    quickAction: {
      text: 'Details',
      icon: Clipboard,
      variant: 'secondary' as const
    }
  },
  Talk: {
    pulseDot: 'win' as const,
    statusSubtitle: 'Advocacy surging +24%',
    quickAction: {
      text: 'Amplify',
      icon: Heart,
      variant: 'primary' as const
    }
  }
};

export function PhaseCard({
  name,
  status,
  metrics,
  momentum,
  sparklineData,
  statusSubtitle: statusSubtitleProp,
  pulseDot: pulseDotProp,
  expandedContent,
  primaryMetrics,
  supportingMetrics,
  ctaLabel,
  reachFilterContext,
  phaseExpandedData,
  phaseExpandedLoading,
  onExpandedChange
}: PhaseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const statusInfo = statusConfig[status];

  const chartData = sparklineData.map((value, index) => ({ value, index }));

  // Use primaryMetrics if available, otherwise fall back to regular metrics
  const displayMetrics = primaryMetrics || metrics;

  // Get the icon for this phase
  const PhaseIcon = phaseIcons[name as keyof typeof phaseIcons];

  // Get phase-specific enhancements
  const enhancements = phaseEnhancements[name as keyof typeof phaseEnhancements];

  // Get phase-specific colors
  const phaseColorScheme = phaseColors[name as keyof typeof phaseColors];

  const resolvedSubtitle = statusSubtitleProp ?? enhancements?.statusSubtitle;
  const pulseIndicator = resolvePulseIndicator(pulseDotProp, enhancements?.pulseDot);

  return (
    <div
      className="group relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06),0_2px_4px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer border border-black/[0.06] overflow-hidden hover:scale-[1.005] active:scale-[0.995]"
      onClick={() => {
        const next = !isExpanded;
        setIsExpanded(next);
        onExpandedChange?.(next);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Status accent bar - use phase-specific color */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${phaseColorScheme.accentBar} ${isHovered ? 'opacity-90' : 'opacity-60'} transition-opacity duration-200`} />

      {/* Collapsed View */}
      <div className="p-7 relative">
        <div className="flex items-center justify-between gap-8">
          {/* Left Section: Phase Name + Icon + Status */}
          <div className="flex items-center gap-4 flex-shrink-0 min-w-[140px]">
            {/* Phase Icon with Pulse Dot - use phase-specific color */}
            {PhaseIcon && (
              <div className="relative">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${phaseColorScheme.gradient} flex items-center justify-center shadow-sm`}>
                  <PhaseIcon className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                {/* Pulse Indicator Dot (API pulse_dot or fallback) */}
                {pulseIndicator && (
                  <div
                    className={`absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${pulseIndicator === 'win' ? 'bg-emerald-500' : 'bg-red-500'
                      }`}
                    style={{
                      animation: 'pulse-dot 1.5s ease-in-out infinite'
                    }}
                  />
                )}
              </div>
            )}

            <div className="flex flex-col">
              <h2 className="text-lg font-semibold text-[#1d1d1f] tracking-tight" style={{ letterSpacing: '-0.01em' }}>{name}</h2>
              {resolvedSubtitle && (
                <p className={`text-[11px] ${phaseColorScheme.subtitleColor} mt-0.5 font-medium`}>
                  {resolvedSubtitle}
                </p>
              )}
            </div>
          </div>

          {/* Middle Section: Metrics Preview with Trend Indicators */}
          <div className="hidden lg:flex items-center gap-10 flex-1">
            {displayMetrics.map((metric, index) => {
              const valueText = formatPhaseMetricValue(metric);
              const hasDelta = metric.delta !== undefined && metric.delta !== null;

              return (
                <div
                  key={index}
                  className="flex flex-col min-w-0"
                  onMouseEnter={(e) => e.stopPropagation()}
                >
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium mb-2.5">{metric.label}</span>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-xl font-semibold text-slate-900 tracking-tight">{valueText}</span>
                    {hasDelta && (
                      <span className={`text-[11px] font-bold ${getDeltaColorClass(metric.delta!, metric.label)}`}>
                        {metric.delta}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Section: Chevron */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            {/* Chevron Only */}
            <div className="w-8 h-8 rounded-lg bg-slate-100/80 hover:bg-slate-200/80 flex items-center justify-center transition-colors duration-200">
              <ChevronDown
                className={`w-4 h-4 text-slate-500 transition-all duration-500 ${isExpanded ? 'rotate-180' : ''
                  } group-hover:text-slate-700`}
              />
            </div>
          </div>

          {/* Mobile: Simple Chevron Only */}
          <div className="lg:hidden relative flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-slate-100/80 hover:bg-slate-200/80 flex items-center justify-center transition-colors duration-200">
              <ChevronDown
                className={`w-4 h-4 text-slate-500 transition-all duration-500 ${isExpanded ? 'rotate-180' : ''
                  } group-hover:text-slate-700`}
              />
            </div>
          </div>
        </div>

        {/* Mobile Metrics Preview */}
        <div className="lg:hidden mt-5 flex flex-col gap-2.5 text-sm">
          {displayMetrics.map((metric, index) => {
            const valueText = formatPhaseMetricValue(metric);
            const hasDelta = metric.delta !== undefined && metric.delta !== null;
            return (
              <div key={index} className="flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-b from-slate-50/90 to-slate-100/50 border border-slate-200/60">
                <span className="text-xs uppercase tracking-wider text-slate-500 font-medium">{metric.label}</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-base font-bold text-slate-900">{valueText}</span>
                  {hasDelta && (
                    <span className={`text-xs font-semibold ${getDeltaColorClass(metric.delta!, metric.label)}`}>
                      {metric.delta}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expanded View */}
      <div className={`transition-all duration-500 ease-in-out ${isExpanded ? (name === 'Act' ? 'max-h-[4500px]' : name === 'Convert' ? 'max-h-[4000px]' : name === 'Talk' ? 'max-h-[5500px]' : name === 'Reach' ? 'max-h-[6000px]' : name === 'Engage' ? 'max-h-[4000px]' : 'max-h-[1200px]') : 'max-h-0'} ${isExpanded ? 'opacity-100' : 'opacity-0'} overflow-hidden`}>
        <div className="border-t border-purple-100/50 px-7 py-8 bg-gradient-to-b from-purple-50/20 to-violet-50/20 backdrop-blur-sm">

          {/* Special Reach Accordion Layout */}
          {name === 'Reach' && primaryMetrics ? (
            <ReachExpandedContent filterContext={reachFilterContext} data={phaseExpandedData as ReachExpandedData} isLoading={phaseExpandedLoading} />
          ) : name === 'Engage' ? (
            <EngageExpandedContent filterContext={reachFilterContext} data={phaseExpandedData as EngageExpandedData} isLoading={phaseExpandedLoading} />
          ) : name === 'Engage' && supportingMetrics ? (
            <>
              {/* Engage Accordion Layout */}
              {/* 2x2 Grid of Main Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Engagement Quality Score */}
                <div className="bg-gradient-to-br from-slate-50/80 to-white/60 rounded-2xl p-4 sm:p-6 border border-slate-200/50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-6">
                    <div>
                      <h3 className="text-sm sm:text-base font-semibold text-slate-900 mb-1">Engagement Quality Score</h3>
                      <p className="text-xs text-slate-500">Composite score based on engagement depth & quality</p>
                    </div>
                    <button
                      className="text-xs text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1 self-start sm:self-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      How EQS works
                      <Info className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start gap-6">
                    {/* Circular Gauge */}
                    <div className="flex-shrink-0 relative mx-auto sm:mx-0">
                      <svg width="100" height="100" className="transform -rotate-90">
                        {/* Background circle */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#e2e8f0"
                          strokeWidth="8"
                        />
                        {/* Progress circle */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#06b6d4"
                          strokeWidth="8"
                          strokeDasharray={`${(7.0 / 10) * 251.2} 251.2`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-2xl font-bold text-slate-900">7.0</div>
                        <div className="text-xs text-slate-500">out of 10</div>
                      </div>
                    </div>

                    {/* Channel Scores */}
                    <div className="flex-1 w-full space-y-2.5">
                      {[
                        { name: 'LinkedIn', score: 8.4, color: 'from-cyan-400 to-cyan-500' },
                        { name: 'YouTube', score: 7.6, color: 'from-cyan-400 to-cyan-500' },
                        { name: 'TikTok', score: 6.2, color: 'from-cyan-400 to-cyan-500' },
                        { name: 'Google Ads', score: 5.8, color: 'from-cyan-400 to-cyan-500' },
                        { name: 'Meta', score: 4.8, color: 'from-amber-400 to-amber-500' }
                      ].map((channel, idx) => (
                        <div key={idx} className="flex items-center gap-2 sm:gap-3">
                          <span className="text-xs text-slate-600 w-16 sm:w-20">{channel.name}</span>
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-gradient-to-r ${channel.color} rounded-full`}
                              style={{ width: `${(channel.score / 10) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-slate-900 w-6 sm:w-8 text-right">{channel.score}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Metrics */}
                  <div className="mt-6 pt-4 border-t border-slate-200/50 grid grid-cols-2 gap-x-4 gap-y-2">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between sm:gap-3 text-xs text-slate-600">
                        <span>Likes</span>
                        <span className="font-semibold text-slate-900">12.4K</span>
                      </div>
                      <div className="flex items-center justify-between sm:gap-3 text-xs text-slate-600">
                        <span>Comments</span>
                        <span className="font-semibold text-slate-900">2.8K</span>
                      </div>
                      <div className="flex items-center justify-between sm:gap-3 text-xs text-slate-600">
                        <span>Shares</span>
                        <span className="font-semibold text-slate-900">1.2K</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between sm:gap-3 text-xs text-slate-600">
                        <span>Saves</span>
                        <span className="font-semibold text-slate-900">890</span>
                      </div>
                      <div className="flex items-center justify-between sm:gap-3 text-xs text-slate-600">
                        <span className="truncate">Video Views (50%+)</span>
                        <span className="font-semibold text-slate-900 flex-shrink-0">8.6K</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Engagement Rate by Channel */}
                <div className="bg-gradient-to-br from-slate-50/80 to-white/60 rounded-2xl p-4 sm:p-6 border border-slate-200/50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-6">
                    <div>
                      <h3 className="text-sm sm:text-base font-semibold text-slate-900 mb-1">Engagement Rate by Channel</h3>
                      <p className="text-xs text-slate-500">Engagement actions / impressions</p>
                    </div>
                    <button
                      className="text-xs text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1 self-start sm:self-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Breakdown
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {[
                      { channel: 'TikTok', rate: '4.8%', width: '96%', badge: 'Highest' },
                      { channel: 'LinkedIn', rate: '3.2%', width: '64%', badge: null },
                      { channel: 'YouTube', rate: '2.9%', width: '58%', badge: null },
                      { channel: 'Meta', rate: '1.9%', width: '38%', badge: null },
                      { channel: 'Google Ads', rate: '0.8%', width: '16%', badge: 'Lowest' }
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs sm:text-sm text-slate-700 font-medium">{item.channel}</span>
                          <div className="flex items-center gap-2 sm:gap-3">
                            {item.badge && (
                              <span className={`px-1.5 sm:px-2 py-0.5 ${item.badge === 'Highest' ? 'bg-cyan-100 text-cyan-700' : 'bg-rose-100 text-rose-700'} text-xs font-medium rounded-md whitespace-nowrap`}>
                                {item.badge}
                              </span>
                            )}
                            <span className="text-xs sm:text-sm font-semibold text-slate-900">{item.rate}</span>
                          </div>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full" style={{ width: item.width }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Average */}
                  <div className="mt-4 pt-4 border-t border-slate-200/50 text-xs sm:text-sm text-slate-600">
                    Average Engagement Rate: <span className="font-semibold text-slate-900">2.7%</span>
                  </div>
                </div>

                {/* Engaged ICP */}
                <div className="bg-gradient-to-br from-slate-50/80 to-white/60 rounded-2xl p-6 border border-slate-200/50">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-base font-semibold text-slate-900 mb-1">Engaged ICP</h3>
                      <p className="text-xs text-slate-500">High-quality engaged users</p>
                    </div>
                    <button
                      className="text-xs text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View segments
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7m0 0l7 7m-7-7v18" />
                      </svg>
                    </button>
                  </div>

                  <div className="mb-6">
                    <div className="text-4xl font-bold text-slate-900">5K</div>
                    <div className="flex items-center gap-2 mt-2">
                      <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                      <span className="text-sm font-semibold text-emerald-600">+12% vs last period</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { channel: 'LinkedIn', value: '1.7K', percent: '33%' },
                      { channel: 'TikTok', value: '1.4K', percent: '28%' },
                      { channel: 'YouTube', value: '900', percent: '18%' },
                      { channel: 'Meta', value: '700', percent: '14%' },
                      { channel: 'Google Ads', value: '350', percent: '7%' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-slate-700">{item.channel}</span>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-slate-900">{item.value}</span>
                          <span className="text-xs text-slate-500 w-10 text-right">{item.percent}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cost per Engagement */}
                <div className="bg-gradient-to-br from-slate-50/80 to-white/60 rounded-2xl p-6 border border-slate-200/50">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-base font-semibold text-slate-900 mb-1">Cost per Engagement</h3>
                      <p className="text-xs text-slate-500">Efficiency by channel</p>
                    </div>
                    <button
                      className="text-xs text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Detail
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {[
                      { rank: 1, channel: 'TikTok', cost: '$1.80', badge: 'Best', icon: Music, iconBg: 'bg-emerald-500', iconColor: 'text-white' },
                      { rank: 2, channel: 'YouTube', cost: '$2.40', badge: null, icon: Play, iconBg: 'bg-purple-500', iconColor: 'text-white' },
                      { rank: 3, channel: 'Meta', cost: '$3.20', badge: null, icon: Camera, iconBg: 'bg-purple-500', iconColor: 'text-white' },
                      { rank: 4, channel: 'LinkedIn', cost: '$4.60', badge: null, icon: Users, iconBg: 'bg-slate-500', iconColor: 'text-white' },
                      { rank: 5, channel: 'Google Ads', cost: '$6.80', badge: 'Highest', icon: Search, iconBg: 'bg-amber-500', iconColor: 'text-white' }
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.rank} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/80 transition-colors">
                          <div className={`w-10 h-10 rounded-xl ${item.iconBg} flex items-center justify-center shadow-md flex-shrink-0`}>
                            <Icon className={`w-5 h-5 ${item.iconColor}`} strokeWidth={2.5} />
                          </div>
                          <span className="text-sm text-slate-700 font-medium flex-1">{item.channel}</span>
                          <span className="text-base font-bold text-slate-900">{item.cost}</span>
                          {item.badge && (
                            <span className={`px-2 py-1 ${item.badge === 'Best' ? 'bg-cyan-100 text-cyan-700' : 'bg-rose-100 text-rose-700'} text-xs font-semibold rounded-md`}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Average */}
                  <div className="mt-4 pt-4 border-t border-slate-200/50 text-sm text-slate-600">
                    Average CPE: <span className="font-semibold text-slate-900">$3.76</span>
                  </div>
                </div>
              </div>

              {/* Insights Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-br from-cyan-50/80 to-sky-50/60 rounded-xl p-4 border border-cyan-200/50 flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-cyan-600" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      <span className="font-semibold text-slate-900">LinkedIn delivers highest EQS (8.4)</span> — premium audience highly engaged
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-50/80 to-orange-50/60 rounded-xl p-4 border border-amber-200/50 flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      <span className="font-semibold text-slate-900">Meta EQS at 4.8</span> — low quality engagement, review targeting
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50/80 to-teal-50/60 rounded-xl p-4 border border-emerald-200/50 flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <TrendingDown className="w-5 h-5 text-emerald-600" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      <span className="font-semibold text-slate-900">TikTok CPE is $1.80</span> — most cost-effective engagement channel
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="flex justify-start">
                <button
                  className="px-6 py-3 text-sm text-white bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 font-semibold flex items-center gap-2 group"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Future: Navigate to detailed analysis
                  }}
                >
                  <Sparkles className="w-4 h-4" />
                  Improve Engagement Quality
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </>
          ) : name === 'Talk' ? (
            <TalkExpandedContent
              filterContext={reachFilterContext}
              data={phaseExpandedData as TalkExpandedData}
              isLoading={phaseExpandedLoading}
            />
          ) : name === 'Convert' ? (
            <ConvertExpandedContent filterContext={reachFilterContext} data={phaseExpandedData as ConvertExpandedData} isLoading={phaseExpandedLoading} />
          ) : name === 'Act' ? (
            <ActExpandedContent filterContext={reachFilterContext} data={phaseExpandedData as ActExpandedData} isLoading={phaseExpandedLoading} />
          ) : (
            <>
              {/* Default expanded view for Act & Convert */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {expandedContent.additionalMetrics.map((metric, index) => {
                  const hasDelta = metric.delta !== undefined && metric.delta !== null;
                  return (
                    <div key={index} className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50">
                      <div className="text-xs text-slate-500 mb-2">{metric.label}</div>
                      <div className="text-2xl font-bold text-slate-900">{formatPhaseMetricValue(metric)}</div>
                      {hasDelta && (
                        <div className={`text-xs font-medium mt-1 ${getDeltaColorClass(metric.delta!, metric.label)}`}>
                          {metric.delta}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
