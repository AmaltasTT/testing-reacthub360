"use client";

import { Info, X, TrendingDown, TrendingUp } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useCountUp } from '@/hooks/useCountUp';

interface MetricCardProps {
  title: string;
  value: string | number;
  delta?: string;
  type: 'omtm' | 'ring' | 'share' | 'cost' | 'arc-purple' | 'spend';
  status?: 'healthy' | 'ok' | 'caution' | 'action';
  percentage?: number;
  tooltip?: string;
  secondaryValue?: string;
  secondaryDelta?: string;
}

const statusColors = {
  healthy: {
    stroke: '#10b981',
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    shadow: 'shadow-[0_0_24px_rgba(16,185,129,0.15)]',
    gradient: 'bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400'
  },
  ok: {
    stroke: '#3b82f6',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    shadow: 'shadow-[0_0_24px_rgba(59,130,246,0.15)]',
    gradient: 'bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600'
  },
  caution: {
    stroke: '#f59e0b',
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    shadow: 'shadow-[0_0_24px_rgba(245,158,11,0.15)]',
    gradient: 'bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400'
  },
  action: {
    stroke: '#ef4444',
    bg: 'bg-red-50',
    text: 'text-[#e11d48]',
    shadow: 'shadow-[0_0_24px_rgba(239,68,68,0.15)]',
    gradient: 'bg-gradient-to-r from-red-400 via-red-500 to-rose-400'
  }
};

export function MetricCard({
  title,
  value,
  delta,
  type,
  status = 'healthy',
  percentage = 75,
  tooltip,
  secondaryValue,
  secondaryDelta
}: MetricCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const statusColor = statusColors[status];
  const isPositive = delta?.startsWith('+');

  // Semi-circular gauge for OMTM
  const renderGauge = () => {
    const radius = 50;
    const strokeWidth = 8;
    const circumference = Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative flex flex-col items-center mt-4 mb-2">
        <svg width="120" height="70" viewBox="0 0 120 70" className="overflow-visible">
          {/* Background arc */}
          <path
            d="M 10 60 A 50 50 0 0 1 110 60"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Foreground arc */}
          <path
            d="M 10 60 A 50 50 0 0 1 110 60"
            fill="none"
            stroke={statusColor.stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
          />
        </svg>
        <div className="absolute bottom-0 text-center">
          <div className="text-3xl font-semibold text-slate-900 tracking-tight">{value.toLocaleString()}</div>
        </div>
      </div>
    );
  };

  // Circular ring for KPI
  const renderRing = () => {
    const radius = 28;
    const strokeWidth = 4;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative flex items-center justify-center mt-4 mb-2">
        <svg width="70" height="70" viewBox="0 0 70 70">
          {/* Background ring */}
          <circle
            cx="35"
            cy="35"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
          />
          {/* Foreground ring */}
          <circle
            cx="35"
            cy="35"
            r={radius}
            fill="none"
            stroke={statusColor.stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 35 35)"
            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
          />
        </svg>
        <div className="absolute text-xl font-semibold text-slate-900">{value}</div>
      </div>
    );
  };

  // Segmented circular share indicator for market share
  const renderShare = () => {
    const radius = 28;
    const strokeWidth = 4;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative flex items-center justify-center mt-4 mb-2">
        <svg width="70" height="70" viewBox="0 0 70 70">
          {/* Background circle (unfilled portion) */}
          <circle
            cx="35"
            cy="35"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
          />
          {/* Filled segment (share percentage) */}
          <circle
            cx="35"
            cy="35"
            r={radius}
            fill="none"
            stroke={statusColor.stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 35 35)"
            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
          />
        </svg>
        <div className="absolute text-xl font-semibold text-slate-900">{value}</div>
      </div>
    );
  };

  // Cost efficiency indicator with trend arrow
  const renderCost = () => {
    const isPositiveTrend = delta?.startsWith('+');
    const TrendIcon = isPositiveTrend ? TrendingUp : TrendingDown;

    return (
      <div className="flex flex-col items-center mt-4 mb-2">
        <div className="text-3xl font-semibold text-slate-900 mb-3">{value}</div>

        {/* Trend Arrow - Uses status color */}
        <div className="mb-3">
          <TrendIcon
            className="w-12 h-12"
            style={{ color: statusColor.stroke }}
            strokeWidth={2.5}
          />
        </div>

        {/* Percentage change pill - Always green for cost type */}
        {delta && (
          <div className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/50">
            {delta}
          </div>
        )}
      </div>
    );
  };

  // Dark purple semi-circular arc for Total Reach
  const renderArcPurple = () => {
    const radius = 50;
    const strokeWidth = 8;
    const circumference = Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative flex flex-col items-center mt-4 mb-2">
        <svg width="120" height="70" viewBox="0 0 120 70" className="overflow-visible">
          {/* Background arc */}
          <path
            d="M 10 60 A 50 50 0 0 1 110 60"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Foreground arc - dark purple */}
          <path
            d="M 10 60 A 50 50 0 0 1 110 60"
            fill="none"
            stroke="#7C3AED"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
          />
        </svg>
        <div className="absolute bottom-0 text-center">
          <div className="text-3xl font-semibold text-slate-900 tracking-tight">{value.toLocaleString()}</div>
        </div>
      </div>
    );
  };

  // Premium Total Spend indicator - Simple value display with glassmorphic styling
  const renderSpend = () => {
    const isPositivePrimary = delta?.startsWith('+');
    const isPositiveSecondary = secondaryDelta?.startsWith('+');

    return (
      <div className="relative flex flex-col items-center justify-center mt-6 mb-2">
        {/* Dual values with "vs." */}
        <div className="flex items-center gap-2.5 mb-2.5">
          <div className="text-2xl font-bold text-[#7652b3]">{value}</div>
          <span className="text-lg font-semibold text-slate-400">vs.</span>
          <div className="text-2xl font-bold text-[#7652b3]">{secondaryValue || '—'}</div>
        </div>

        {/* Delta pills below the numbers */}
        <div className="flex items-center gap-2.5">
          {delta && (
            <div
              className={`
                text-xs px-2.5 py-0.5 rounded-full font-medium
                ${isPositivePrimary
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                  : 'bg-red-50 text-red-700 border border-red-200/50'
                }
              `}
            >
              {delta}
            </div>
          )}
          {secondaryDelta && (
            <div
              className={`
                text-xs px-2.5 py-0.5 rounded-full font-medium
                ${isPositiveSecondary
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                  : 'bg-red-50 text-red-700 border border-red-200/50'
                }
              `}
            >
              {secondaryDelta}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderVisualization = () => {
    switch (type) {
      case 'omtm':
        return renderGauge();
      case 'ring':
        return renderRing();
      case 'share':
        return renderShare();
      case 'cost':
        return renderCost();
      case 'arc-purple':
        return renderArcPurple();
      case 'spend':
        return renderSpend();
      default:
        return null;
    }
  };

  return (
    <div
      className={`
        relative rounded-2xl border overflow-hidden
        transition-all duration-300 ease-out h-full flex flex-col
        hover:scale-[1.02] active:scale-[0.98]
        ${type === 'spend'
          ? 'bg-white/95 backdrop-blur-xl shadow-[0_2px_8px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(139,92,246,0.12)] border-black/[0.06]'
          : type === 'omtm'
            ? 'bg-white/95 backdrop-blur-xl shadow-[0_2px_8px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(139,92,246,0.10)] border-black/[0.06]'
            : 'bg-white/95 backdrop-blur-xl shadow-[0_2px_8px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(139,92,246,0.08)] border-black/[0.06]'
        }
      `}
    >
      {/* Subtle Gradient Line at Top */}
      {type !== 'spend' && (
        <div className={`absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl ${type === 'arc-purple'
          ? 'bg-gradient-to-r from-purple-500 via-purple-600 to-violet-500 opacity-60'
          : statusColor.gradient + ' opacity-50'
          }`} />
      )}

      {/* Content */}
      <div className={`relative flex-1 flex flex-col ${type === 'omtm' || type === 'arc-purple' || type === 'spend' ? 'p-6' : 'p-5'}`}>
        {/* Title with Info Icon */}
        <div className="flex items-center gap-1.5 mb-2">
          <h3 className={`
            text-[#6e6e73] tracking-wide font-medium
            ${type === 'omtm' ? 'text-xs uppercase' : 'text-xs uppercase'}
          `}>
            {title}
          </h3>
          {tooltip && (
            <>
              <button
                onClick={() => setShowTooltip(true)}
                className="relative group"
              >
                <Info className="w-3.5 h-3.5 text-[#86868b] hover:text-purple-500 cursor-pointer transition-colors duration-200" />
              </button>

              {/* Overlay Modal */}
              {showTooltip && (
                <div
                  className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                  onClick={() => setShowTooltip(false)}
                >
                  <div
                    className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200 border border-black/[0.06]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Close Button */}
                    <button
                      onClick={() => setShowTooltip(false)}
                      className="absolute top-4 right-4 text-[#86868b] hover:text-[#1d1d1f] transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    {/* Title */}
                    <h4 className="text-lg font-semibold text-slate-900 mb-3 pr-8">{title}</h4>

                    {/* Definition */}
                    <p className="text-slate-600 leading-relaxed">{tooltip}</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Visualization */}
        <div className="flex-1 flex items-center justify-center">
          {renderVisualization()}
        </div>

        {/* Delta - only show for non-spend and non-cost types */}
        {delta && type !== 'spend' && type !== 'cost' && (
          <div className="flex justify-center mt-2">
            <div
              className={`
                text-xs px-2.5 py-0.5 rounded-full
                ${isPositive
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                  : 'bg-red-50 text-red-700 border border-red-200/50'
                }
              `}
            >
              {delta}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}