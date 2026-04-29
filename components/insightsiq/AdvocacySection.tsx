"use client";

export function AdvocacySection() {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2.5 mb-4">
        <h3 className="text-[17px] font-semibold text-slate-900 tracking-tight">Advocacy</h3>
        <p className="text-[13px] text-slate-500 font-medium">Turning customers into brand champions</p>
      </div>

      {/* Row 1: Advocacy Action Rate & Cost per Advocacy Action */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Advocacy Action Rate */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-7 shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-[rgba(0,0,0,0.03)]">
          {/* Header */}
          <div className="flex items-start justify-between mb-1.5">
            <div className="flex items-center gap-2.5">
              <h3 className="text-[16px] font-bold text-[#111827] tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Advocacy Action Rate
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
          <p className="text-[12.5px] text-[#9CA3AF] mb-6" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            % of retained customers driven to advocate by campaign channel
          </p>

          {/* Donut + Bars */}
          <div className="flex gap-6 items-start mb-6">
            {/* Donut */}
            <div className="relative flex-shrink-0" style={{ width: '120px', height: '120px' }}>
              <svg width="120" height="120" className="transform -rotate-90">
                <defs>
                  <linearGradient id="advocacyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="#A78BFA" />
                  </linearGradient>
                </defs>
                <circle cx="60" cy="60" r="48" fill="none" stroke="#F3F0FF" strokeWidth="12" />
                <circle
                  cx="60" cy="60" r="48"
                  fill="none"
                  stroke="url(#advocacyGradient)"
                  strokeWidth="12"
                  strokeDasharray={`${0.28 * 301.6} 301.6`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[28px] font-extrabold text-[#111827] tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  28%
                </span>
              </div>
            </div>

            {/* Bars */}
            <div className="flex-1 space-y-2">
              {[
                { channel: 'Loyalty Program', rate: '38%', fillPercent: 100 },
                { channel: 'Email Nurture', rate: '31%', fillPercent: 82 },
                { channel: 'SMS Campaigns', rate: '24%', fillPercent: 63 },
                { channel: 'Push Notifications', rate: '19%', fillPercent: 50 },
                { channel: 'Instagram DMs', rate: '28%', fillPercent: 74 }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-[12px] text-[#6B7280] text-right" style={{ width: '115px', fontFamily: 'DM Sans, sans-serif' }}>
                    {item.channel}
                  </span>
                  <div className="flex-1 h-3.5 bg-[#F3F0FF] rounded">
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

          {/* Bottom KPIs */}
          <div className="pt-4.5 mt-6 border-t border-[#F3F4F6]">
            <div className="flex justify-between">
              <div>
                <div className="text-[11px] text-[#9CA3AF] mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>Non-Advocates</div>
                <div className="text-[20px] font-bold text-[#EF4444]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>72%</div>
              </div>
              <div>
                <div className="text-[11px] text-[#9CA3AF] mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>Total Actions</div>
                <div className="text-[20px] font-bold text-[#111827]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>10'520</div>
              </div>
              <div>
                <div className="text-[11px] text-[#9CA3AF] mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>Top Channel</div>
                <div className="text-[20px] font-bold text-[#111827]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Loyalty</div>
              </div>
            </div>
          </div>
        </div>

        {/* Cost per Advocacy Action */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-7 shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-[rgba(0,0,0,0.03)]">
          {/* Header */}
          <div className="flex items-start justify-between mb-1.5">
            <h3 className="text-[16px] font-bold text-[#111827] tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Cost per Advocacy Action
            </h3>
            <button
              className="text-[13px] font-medium text-[#7C3AED] hover:text-[#6D28D9] transition-colors"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
              onClick={(e) => e.stopPropagation()}
            >
              View breakdown →
            </button>
          </div>
          <p className="text-[12.5px] text-[#9CA3AF] mb-6" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Cost to generate one advocacy action per campaign channel
          </p>

          {/* Main Metric */}
          <div className="flex items-center gap-3 mb-6">
            <div className="text-[48px] font-extrabold text-[#111827] tracking-tight leading-none" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              $4.46
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 11L7 3M7 3L3 7M7 3L11 7" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-[13px] font-bold text-[#7C3AED]" style={{ fontFamily: 'DM Sans, sans-serif' }}>-11%</span>
              </div>
              <span className="text-[11px] text-[#9CA3AF]" style={{ fontFamily: 'DM Sans, sans-serif' }}>Avg. CPA</span>
            </div>
          </div>

          {/* Channel Bars */}
          <div className="space-y-2.5 mb-6">
            {[
              { channel: 'Push Notifications', cost: '$2.40', width: 40, color: '#7C3AED' },
              { channel: 'Email Nurture', cost: '$3.10', width: 52, color: '#8B5CF6' },
              { channel: 'Loyalty Program', cost: '$4.20', width: 70, color: '#A78BFA' },
              { channel: 'SMS Campaigns', cost: '$5.60', width: 93, color: '#C4B5FD' },
              { channel: 'Instagram DMs', cost: '$6.80', width: 100, color: '#F87171' }
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] text-[#6B7280]" style={{ fontFamily: 'DM Sans, sans-serif' }}>{item.channel}</span>
                  <span className="text-[13px] font-bold text-[#111827]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{item.cost}</span>
                </div>
                <div className="h-3 bg-[#F3F0FF] rounded overflow-hidden">
                  <div
                    className="h-full rounded"
                    style={{ width: `${item.width}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100">
              <div className="text-[10px] text-purple-700 font-semibold mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>Efficient</div>
              <div className="text-[24px] font-bold text-purple-700" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>2 channels</div>
            </div>
            <div className="p-3 rounded-xl bg-red-50/60 border border-red-100">
              <div className="text-[10px] text-red-700 font-semibold mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>Over budget</div>
              <div className="text-[24px] font-bold text-red-700" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>1 channels</div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Positive Sentiment Rate & Average Review Score */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Positive Sentiment Rate */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-7 shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-[rgba(0,0,0,0.03)]">
          {/* Header */}
          <div className="flex items-start justify-between mb-1.5">
            <div className="flex items-center gap-2.5">
              <h3 className="text-[16px] font-bold text-[#111827] tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Positive Sentiment Rate
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
          <p className="text-[12.5px] text-[#9CA3AF] mb-6" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            % of brand mentions with positive sentiment across platforms
          </p>

          {/* Donut + Benchmark */}
          <div className="flex gap-6 items-start mb-6">
            {/* Donut */}
            <div className="relative flex-shrink-0" style={{ width: '120px', height: '120px' }}>
              <svg width="120" height="120" className="transform -rotate-90">
                <defs>
                  <linearGradient id="sentimentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="#A78BFA" />
                  </linearGradient>
                </defs>
                <circle cx="60" cy="60" r="48" fill="none" stroke="#F3F0FF" strokeWidth="12" />
                <circle
                  cx="60" cy="60" r="48"
                  fill="none"
                  stroke="url(#sentimentGradient)"
                  strokeWidth="12"
                  strokeDasharray={`${0.72 * 301.6} 301.6`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[28px] font-extrabold text-[#111827] tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  72%
                </span>
              </div>
            </div>

            {/* Benchmark Section */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50/80 border border-purple-200/50 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-600"></div>
                <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wide" style={{ fontFamily: 'DM Sans, sans-serif' }}>Above Industry Benchmark</span>
              </div>

              <div className="mb-2">
                <div className="text-[11px] text-[#9CA3AF] mb-1.5" style={{ fontFamily: 'DM Sans, sans-serif' }}>Your score vs. industry average</div>
                <div className="relative h-3 bg-[#F3F0FF] rounded-full overflow-hidden mb-1">
                  <div className="absolute h-full w-[72%] rounded-full" style={{ background: 'linear-gradient(to right, #7C3AED, #A78BFA)' }}></div>
                  <div className="absolute right-[28%] top-0 bottom-0 w-px bg-slate-400"></div>
                </div>
                <div className="flex items-center justify-between text-[10px]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  <span className="text-purple-700 font-bold">You: 72%</span>
                  <span className="text-slate-500 font-semibold">⚑ BENCHMARK 65%</span>
                </div>
              </div>

              <div className="text-[18px] font-bold text-purple-700" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                +7pts <span className="text-[11px] font-medium text-slate-500" style={{ fontFamily: 'DM Sans, sans-serif' }}>vs. industry</span>
              </div>
            </div>
          </div>

          {/* Bottom Metrics */}
          <div className="pt-4 border-t border-[#F3F4F6] grid grid-cols-4 gap-4 mb-5">
            <div>
              <div className="text-[11px] text-[#9CA3AF] mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>Positive</div>
              <div className="text-[20px] font-bold text-[#7652b3]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>72%</div>
            </div>
            <div>
              <div className="text-[11px] text-[#9CA3AF] mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>Neutral</div>
              <div className="text-[20px] font-bold text-slate-400" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>18%</div>
            </div>
            <div>
              <div className="text-[11px] text-[#9CA3AF] mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>Negative</div>
              <div className="text-[20px] font-bold text-red-500" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>10%</div>
            </div>
            <div>
              <div className="text-[11px] text-[#9CA3AF] mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>Mentions</div>
              <div className="text-[20px] font-bold text-[#111827]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>14.2K</div>
            </div>
          </div>

          {/* Top Advocacy Channels */}
          <div className="pt-4 border-t border-[#F3F4F6]">
            <div className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Top Advocacy Channels <span className="text-slate-400">— WHERE SENTIMENT LIVES</span>
            </div>
            <div className="space-y-2">
              {[
                { platform: 'Google Reviews', score: '81%', mentions: '4.6K', width: 100, isPositive: true },
                { platform: 'Instagram', score: '76%', mentions: '3.8K', width: 94, isPositive: true },
                { platform: 'TikTok', score: '70%', mentions: '2.2K', width: 86, isPositive: true },
                { platform: 'Trustpilot', score: '64%', mentions: '1.9K', width: 79, isPositive: false },
                { platform: 'On-site Reviews', score: '58%', mentions: '1.6K', width: 72, isPositive: false }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-[12px] text-[#6B7280] w-28" style={{ fontFamily: 'DM Sans, sans-serif' }}>{item.platform}</span>
                  <div className="flex-1 h-2.5 bg-[#F3F0FF] rounded overflow-hidden">
                    <div
                      className="h-full rounded"
                      style={{
                        width: `${item.width}%`,
                        background: item.isPositive ? 'linear-gradient(to right, #7C3AED, #A78BFA)' : '#F87171'
                      }}
                    />
                  </div>
                  <span className="text-[12px] font-bold text-[#374151] w-10 text-right" style={{ fontFamily: 'DM Sans, sans-serif' }}>{item.score}</span>
                  <span className="text-[11px] text-[#9CA3AF] w-10 text-right" style={{ fontFamily: 'DM Sans, sans-serif' }}>{item.mentions}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Average Review Score */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-7 shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-[rgba(0,0,0,0.03)]">
          {/* Header */}
          <div className="flex items-start justify-between mb-1.5">
            <h3 className="text-[16px] font-bold text-[#111827] tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Average Review Score
            </h3>
            <button
              className="text-[13px] font-medium text-[#7C3AED] hover:text-[#6D28D9] transition-colors"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
              onClick={(e) => e.stopPropagation()}
            >
              View breakdown →
            </button>
          </div>
          <p className="text-[12.5px] text-[#9CA3AF] mb-6" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Review distribution and quality segmentation
          </p>

          {/* Main Score */}
          <div className="mb-6">
            <div className="flex items-baseline gap-3 mb-1">
              <div className="text-[48px] font-extrabold text-[#111827] tracking-tight leading-none" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                4.2
              </div>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4].map((star) => (
                  <svg key={star} width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 1.5L11.09 6.26L16.18 6.99L12.59 10.47L13.45 15.54L9 13.27L4.55 15.54L5.41 10.47L1.82 6.99L6.91 6.26L9 1.5Z" fill="#FBBF24" stroke="#FBBF24" strokeWidth="1" />
                  </svg>
                ))}
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 1.5L11.09 6.26L16.18 6.99L12.59 10.47L13.45 15.54L9 13.27L4.55 15.54L5.41 10.47L1.82 6.99L6.91 6.26L9 1.5Z" fill="#E5E7EB" stroke="#E5E7EB" strokeWidth="1" />
                </svg>
              </div>
            </div>
            <div className="text-[12px] text-[#9CA3AF] mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>10'200 reviews</div>
            <div className="flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 11L7 3M7 3L3 7M7 3L11 7" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[12px] font-bold text-[#7C3AED]" style={{ fontFamily: 'DM Sans, sans-serif' }}>+0.3 from last period</span>
            </div>
          </div>

          {/* Distribution Bars */}
          <div className="space-y-3 mb-6">
            {[
              { label: 'Excellent', range: '4.5 – 5.0', count: "4'280", percent: '42%', width: 100, color: '#7C3AED' },
              { label: 'Good', range: '4.0 – 4.4', count: "2'860", percent: '28%', width: 67, color: '#A78BFA' },
              { label: 'Average', range: '3.5 – 3.9', count: "1'640", percent: '16%', width: 38, color: '#C4B5FD' },
              { label: 'Poor', range: 'Below 3.5', count: "1'420", percent: '14%', width: 33, color: '#F87171', isCritical: true }
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-semibold text-[#374151]" style={{ fontFamily: 'DM Sans, sans-serif' }}>{item.label}</span>
                    <span className="text-[11px] text-[#9CA3AF]" style={{ fontFamily: 'DM Sans, sans-serif' }}>{item.range}</span>
                    {item.isCritical && <span className="text-[9px] font-bold text-[#e11d48] px-1.5 py-0.5 rounded bg-red-50 border border-red-200">⚠️CRITICAL</span>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] font-bold text-[#111827]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{item.count}</span>
                    <span className="text-[12px] font-semibold text-[#6B7280] w-10 text-right" style={{ fontFamily: 'DM Sans, sans-serif' }}>{item.percent}</span>
                  </div>
                </div>
                <div className="h-3 bg-[#F3F0FF] rounded overflow-hidden">
                  <div
                    className="h-full rounded"
                    style={{ width: `${item.width}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Insight Cards */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 rounded-lg bg-purple-50/60 border border-purple-100">
              <div className="text-[9px] font-bold text-purple-700 uppercase tracking-wide mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>STRENGTHS</div>
              <div className="text-[16px] font-bold text-purple-700 mb-0.5" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>70%</div>
              <div className="text-[9px] text-[#7652b3]" style={{ fontFamily: 'DM Sans, sans-serif' }}>rated 4.0+ — drill down →</div>
            </div>
            <div className="p-2.5 rounded-lg bg-red-50/60 border border-red-100">
              <div className="text-[9px] font-bold text-red-700 uppercase tracking-wide mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>NEEDS ATTENTION</div>
              <div className="text-[16px] font-bold text-red-700 mb-0.5" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>14%</div>
              <div className="text-[9px] text-[#e11d48]" style={{ fontFamily: 'DM Sans, sans-serif' }}>rated below 3.5 — drill down →</div>
            </div>
            <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-100">
              <div className="text-[9px] font-bold text-blue-700 uppercase tracking-wide mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>USE IN MARKETING</div>
              <div className="text-[16px] font-bold text-blue-700 mb-0.5" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>4,280</div>
              <div className="text-[9px] text-blue-600" style={{ fontFamily: 'DM Sans, sans-serif' }}>5-star reviews — drill down →</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
