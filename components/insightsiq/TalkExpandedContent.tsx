'use client';

import { useRouter } from 'next/navigation';
import { BarChart3, TrendingUp, ArrowUpRight, AlertTriangle, Info } from 'lucide-react';
import { ReactivationRateChart } from './ReactivationRateChart';
import { AdvocacySection } from './AdvocacySection';
import type { ReachFilterContext } from '@/components/insightsiq/PhaseCard';
import type { TalkExpandedData } from '@/hooks/use-insightsiq';
import { buildInsightsMetricsUrl } from '@/lib/insights-campaign-url';

interface TalkExpandedContentProps {
  filterContext?: ReachFilterContext;
  data?: TalkExpandedData;
  isLoading?: boolean;
}

export function TalkExpandedContent({ filterContext, data, isLoading }: TalkExpandedContentProps = {}) {
  const router = useRouter();

  return (
    <>
      {/* Retention Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2.5 mb-4">
          <h3 className="text-[17px] font-semibold text-slate-900 tracking-tight">Retention</h3>
          <p className="text-[13px] text-slate-500 font-medium">Keeping customers coming back</p>
        </div>

        {/* Row 1: Customer Retention Rate & Cost per Retained Customer */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Customer Retention Rate */}
          <div className="relative group overflow-hidden rounded-2xl backdrop-blur-xl bg-white/70 border border-white/40 shadow-[0_8px_32px_rgba(139,92,246,0.08)] hover:shadow-[0_12px_48px_rgba(139,92,246,0.12)] transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.03] via-transparent to-blue-500/[0.02]" />
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-400/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative z-10 p-5">
              <div className="flex items-start justify-between mb-5">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-[15px] font-semibold text-slate-900 tracking-tight">Customer Retention Rate</h3>
                    <span className="px-2 py-0.5 rounded-md bg-purple-500/10 backdrop-blur-sm border border-purple-500/20 text-[10px] font-bold text-purple-700 uppercase tracking-wide">
                      OMTM
                    </span>
                  </div>
                  <p className="text-[12px] text-slate-500 font-medium">% of customers who made repeat purchases</p>
                </div>
                <button
                  className="text-[11px] text-[#7652b3] hover:text-purple-700 font-semibold flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-purple-50/50 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  View breakdown →
                </button>
              </div>

              <div className="flex items-center gap-6">
                <div className="relative flex-shrink-0">
                  <svg width="120" height="120" className="transform -rotate-90 drop-shadow-sm">
                    <circle cx="60" cy="60" r="48" fill="none" stroke="#F1F5F9" strokeWidth="10" />
                    <circle
                      cx="60" cy="60" r="48"
                      fill="none"
                      stroke="url(#gaugeGradientCRR)"
                      strokeWidth="10"
                      strokeDasharray={`${(7.2 / 10) * 301.6} 301.6`}
                      strokeLinecap="round"
                      className="drop-shadow-md"
                    />
                    <defs>
                      <linearGradient id="gaugeGradientCRR" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#7C3AED" />
                        <stop offset="100%" stopColor="#A78BFA" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[32px] font-semibold text-slate-900 tracking-tight">72%</span>
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  {[
                    { name: 'Loyalty Program', score: '85%', width: 100 },
                    { name: 'Email Nurture', score: '78%', width: 92 },
                    { name: 'SMS Campaigns', score: '71%', width: 84 },
                    { name: 'Push Notifications', score: '64%', width: 75 },
                    { name: 'Instagram DMs', score: '58%', width: 68 },
                    { name: 'FB Messenger', score: '54%', width: 64 }
                  ].map((channel, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-[12px] font-medium text-slate-600 w-32 truncate">{channel.name}</span>
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden backdrop-blur-sm">
                        <div
                          className="h-full rounded-full transition-all duration-700 bg-[#A78BFA]"
                          style={{ width: `${channel.width}%` }}
                        />
                      </div>
                      <span className="text-[12px] font-semibold text-slate-900 w-10 text-right">{channel.score}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 grid grid-cols-3 gap-4">
                <div>
                  <div className="text-[11px] text-slate-500 font-medium mb-0.5">Churn Rate</div>
                  <div className="text-[15px] font-bold text-[#e11d48]">28%</div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 font-medium mb-0.5">Repeat Purchase</div>
                  <div className="text-[15px] font-bold text-slate-900">2.4x</div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 font-medium mb-0.5">Days to Return</div>
                  <div className="text-[15px] font-bold text-slate-900">18</div>
                </div>
              </div>
            </div>
          </div>

          {/* Cost per Retained Customer */}
          <div className="relative group overflow-hidden rounded-2xl backdrop-blur-xl bg-white/70 border border-white/40 shadow-[0_8px_32px_rgba(139,92,246,0.08)] hover:shadow-[0_12px_48px_rgba(139,92,246,0.12)] transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] via-transparent to-emerald-500/[0.02]" />
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative z-10 p-5">
              <div className="flex items-start justify-between mb-5">
                <div className="flex-1">
                  <h3 className="text-[15px] font-semibold text-slate-900 mb-1 tracking-tight">Cost per Retained Customer</h3>
                  <p className="text-[12px] text-slate-500 font-medium">Efficiency by retention channel</p>
                </div>
                <button
                  className="text-[11px] text-[#7652b3] hover:text-purple-700 font-semibold flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-purple-50/50 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  View breakdown →
                </button>
              </div>

              {/* Hero Metric */}
              <div className="flex items-center gap-6 mb-6">
                <div className="relative flex-shrink-0">
                  <svg width="100" height="100" className="drop-shadow-sm">
                    <defs>
                      <linearGradient id="efficiencyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#7C3AED" />
                        <stop offset="50%" stopColor="#A78BFA" />
                        <stop offset="100%" stopColor="#C4B5FD" />
                      </linearGradient>
                    </defs>
                    {/* Background circle */}
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#F1F5F9" strokeWidth="8" />
                    {/* Efficiency arc - 84% efficient (16% lower than benchmark) */}
                    <circle
                      cx="50" cy="50" r="42"
                      fill="none"
                      stroke="url(#efficiencyGradient)"
                      strokeWidth="8"
                      strokeDasharray={`${0.84 * 264} 264`}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                      className="drop-shadow-md"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[26px] font-bold text-slate-900 tracking-tight">$8.40</span>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">Avg Cost</span>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-50/80 to-purple-100/40 backdrop-blur-sm border border-purple-200/40">
                      <div className="text-[11px] text-purple-700 font-semibold mb-0.5 uppercase tracking-wide">Best</div>
                      <div className="text-[20px] font-bold text-purple-900 tracking-tight">$2.40</div>
                      <div className="text-[10px] text-[#7652b3] font-medium">Email</div>
                    </div>
                    <div className="p-3 rounded-xl bg-gradient-to-br from-slate-50/80 to-slate-100/40 backdrop-blur-sm border border-slate-200/40">
                      <div className="text-[11px] text-slate-600 font-semibold mb-0.5 uppercase tracking-wide">Benchmark</div>
                      <div className="text-[20px] font-bold text-slate-900 tracking-tight">$10.00</div>
                      <div className="text-[10px] text-slate-500 font-medium">Industry</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Channel Efficiency Bars */}
              <div className="space-y-3">
                {[
                  { name: 'Email', cost: 2.40, max: 10.20, efficiency: 76, color: 'from-purple-600 to-purple-500' },
                  { name: 'Push Notifications', cost: 3.80, max: 10.20, efficiency: 63, color: 'from-purple-500 to-purple-400' },
                  { name: 'SMS', cost: 4.80, max: 10.20, efficiency: 53, color: 'from-purple-400 to-purple-300' },
                  { name: 'Loyalty Program', cost: 8.40, max: 10.20, efficiency: 18, color: 'from-purple-300 to-purple-200' },
                  { name: 'Instagram DMs', cost: 9.60, max: 10.20, efficiency: 6, color: 'from-purple-200 to-purple-100' },
                  { name: 'FB Messenger', cost: 10.20, max: 10.20, efficiency: 0, color: 'from-slate-300 to-slate-200' }
                ].map((channel, idx) => (
                  <div key={idx} className="group/item">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[12px] font-semibold text-slate-900">{channel.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold text-slate-900">${channel.cost.toFixed(2)}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${idx < 3 ? 'bg-purple-50 text-purple-700 border border-purple-200/50' :
                          idx === 3 ? 'bg-purple-50/50 text-[#7652b3] border border-purple-200/30' :
                            'bg-slate-50 text-slate-600 border border-slate-200/50'
                          }`}>
                          {channel.efficiency > 0 ? `-${channel.efficiency}%` : 'Max'}
                        </span>
                      </div>
                    </div>
                    <div className="relative h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`absolute left-0 top-0 h-full bg-gradient-to-r ${channel.color} rounded-full transition-all duration-700 shadow-sm`}
                        style={{ width: `${(channel.max - channel.cost) / channel.max * 100}%` }}
                      />
                      <div className="absolute right-0 top-0 bottom-0 w-px bg-slate-300" style={{ right: '0%' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Reactivation Rate & Customer Lifetime Value */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Reactivation Rate */}
          <div className="relative overflow-hidden rounded-2xl bg-white p-7 shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-[rgba(0,0,0,0.03)]">
            {/* Section 1 - Header */}
            <div className="mb-6">
              <div className="flex items-start justify-between mb-1.5">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-[16px] font-bold text-[#111827] tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    Customer Reactivation Rate
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-[#F3F4F6] text-[10px] font-semibold text-[#6B7280] uppercase tracking-[0.5px]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    OMTM
                  </span>
                </div>
                <button
                  className="text-[13px] font-medium text-[#7C3AED] hover:text-[#6D28D9] transition-colors"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  View breakdown →
                </button>
              </div>
              <p className="text-[12.5px] text-[#9CA3AF]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                % of lapsed customers reactivated within 90 days
              </p>
            </div>

            {/* Section 2 - Donut + Channel Bars */}
            <div className="flex gap-6 items-start mb-6">
              {/* Donut */}
              <div className="relative flex-shrink-0" style={{ width: '120px', height: '120px' }}>
                <svg width="120" height="120" className="transform -rotate-90">
                  <defs>
                    <linearGradient id="reactivationGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#7C3AED" />
                      <stop offset="100%" stopColor="#A78BFA" />
                    </linearGradient>
                  </defs>
                  <circle cx="60" cy="60" r="48" fill="none" stroke="#F3F0FF" strokeWidth="12" />
                  <circle
                    cx="60" cy="60" r="48"
                    fill="none"
                    stroke="url(#reactivationGradient)"
                    strokeWidth="12"
                    strokeDasharray={`${0.44 * 301.6} 301.6`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[28px] font-extrabold text-[#111827] tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    44%
                  </span>
                </div>
              </div>

              {/* Channel Bars */}
              <div className="flex-1 space-y-2">
                {[
                  { channel: 'Loyalty Program', rate: '62%', fillPercent: 100 },
                  { channel: 'Email Nurture', rate: '55%', fillPercent: 89 },
                  { channel: 'SMS Campaigns', rate: '48%', fillPercent: 77 },
                  { channel: 'Push Notifications', rate: '41%', fillPercent: 66 },
                  { channel: 'Instagram DMs', rate: '34%', fillPercent: 55 },
                  { channel: 'FB Messenger', rate: '29%', fillPercent: 47 }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-[12px] text-[#6B7280] text-right" style={{ width: '115px', fontFamily: 'DM Sans, sans-serif' }}>
                      {item.channel}
                    </span>
                    <div className="flex-1 h-3.5 bg-[#F3F0FF] rounded" style={{ position: 'relative' }}>
                      <div
                        className="h-full rounded"
                        style={{
                          width: `${item.fillPercent}%`,
                          background: 'linear-gradient(to right, #7C3AED, #A78BFA)'
                        }}
                      />
                    </div>
                    <span className="text-[12px] font-semibold text-[#374151]" style={{ width: '32px', fontFamily: 'DM Sans, sans-serif' }}>
                      {item.rate}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3 - Bottom KPIs */}
            <div className="pt-4.5 mt-6 border-t border-[#F3F4F6]">
              <div className="flex justify-between">
                <div>
                  <div className="text-[11px] text-[#9CA3AF] mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>Still Lapsed</div>
                  <div className="text-[20px] font-bold text-[#EF4444]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>56%</div>
                </div>
                <div>
                  <div className="text-[11px] text-[#9CA3AF] mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>Win-backs</div>
                  <div className="text-[20px] font-bold text-[#111827]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>7,430</div>
                </div>
                <div>
                  <div className="text-[11px] text-[#9CA3AF] mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>Avg. Cost</div>
                  <div className="text-[20px] font-bold text-[#111827]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>$6.70</div>
                </div>
                <div>
                  <div className="text-[11px] text-[#9CA3AF] mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>Days to Return</div>
                  <div className="text-[20px] font-bold text-[#111827]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>34</div>
                </div>
              </div>
            </div>

            {/* Insight Text Box */}
            <div className="mt-5 p-4 rounded-lg bg-purple-50/60 border border-purple-100">
              <p className="text-[14px] text-purple-700 leading-relaxed" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                Loyalty Program drives the highest advocacy rate (38%) — consider expanding referral incentives to convert the 72% non-advocates.
              </p>
            </div>
          </div>

          {/* Customer Lifetime Value (CLV) */}
          <div className="relative group overflow-hidden rounded-2xl backdrop-blur-xl bg-white/70 border border-white/40 shadow-[0_8px_32px_rgba(139,92,246,0.08)] hover:shadow-[0_12px_48px_rgba(139,92,246,0.12)] transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] via-transparent to-purple-500/[0.02]" />
            <div className="absolute top-0 left-0 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative z-10 p-5">
              <div className="flex items-start justify-between mb-5">
                <div className="flex-1">
                  <h3 className="text-[15px] font-semibold text-slate-900 mb-1 tracking-tight">Customer Lifetime Value</h3>
                  <p className="text-[12px] text-slate-500 font-medium">Projected CLV by retention channel</p>
                </div>
                <button
                  className="text-[11px] text-[#7652b3] hover:text-purple-700 font-semibold flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-purple-50/50 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  View breakdown →
                </button>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <div className="text-[40px] font-bold text-slate-900 tracking-tight">$486</div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50/80 backdrop-blur-sm border border-emerald-200/40">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-[12px] font-bold text-emerald-600">+14%</span>
                  </div>
                  <span className="text-[13px] text-slate-500 font-medium">Average CLV</span>
                </div>
              </div>

              <div className="space-y-2.5">
                {[
                  { channel: 'Loyalty Program', value: '$698', width: 100, bgColor: 'bg-purple-500' },
                  { channel: 'Email Nurture', value: '$572', width: 82, bgColor: 'bg-purple-400' },
                  { channel: 'SMS Campaigns', value: '$491', width: 70, bgColor: 'bg-purple-300' },
                  { channel: 'Push Notifications', value: '$415', width: 59, bgColor: 'bg-purple-200' },
                  { channel: 'Instagram DMs', value: '$362', width: 52, bgColor: 'bg-purple-100' },
                  { channel: 'FB Messenger', value: '$318', width: 46, bgColor: 'bg-purple-50' }
                ].map((item, idx) => (
                  <div key={idx} className="relative">
                    <div className="flex items-center">
                      <span className="text-[13px] font-medium text-slate-700 w-40 flex-shrink-0">{item.channel}</span>
                      <div className="flex-1 relative">
                        {/* Background bar (full width, very light) */}
                        <div className="h-9 bg-slate-50 rounded-lg" />
                        {/* Value bar */}
                        <div
                          className={`absolute top-0 left-0 h-9 ${item.bgColor} rounded-lg transition-all duration-700 flex items-center justify-end pr-3`}
                          style={{ width: `${item.width}%` }}
                        >
                          <span className="text-[13px] font-bold text-white drop-shadow-sm">{item.value}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-[12px] text-slate-500 font-medium">Avg. CLV baseline</span>
                <span className="text-[16px] font-bold text-slate-900">$486</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Separator */}
      <div className="mb-8">
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </div>

      {/* Advocacy Section */}
      <AdvocacySection />

      <div className="mt-6 flex justify-start">
        <button
          type="button"
          className="px-6 py-3 text-base text-white bg-gradient-to-r from-[#A78BFA] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#A78BFA] rounded-xl shadow-md hover:shadow-lg transition-all duration-200 font-bold flex items-center gap-2 group"
          onClick={(e) => {
            e.stopPropagation();
            router.push(buildInsightsMetricsUrl('/insights/talk-stats', filterContext));
          }}
        >
          <BarChart3 className="w-4 h-4" />
          Explore Talk Drivers
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </>
  );
}
