"use client";

export function ReactivationRateChart() {
  return (
    <div className="relative group overflow-hidden rounded-2xl backdrop-blur-xl bg-white/70 border border-white/40 shadow-[0_8px_32px_rgba(139,92,246,0.08)] hover:shadow-[0_12px_48px_rgba(139,92,246,0.12)] transition-all duration-500">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.02] via-transparent to-purple-500/[0.02]" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-400/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-md bg-blue-600 text-white text-[15px] font-bold">Reactivation Rate</span>
            <span className="text-[13px] text-slate-400 font-semibold uppercase tracking-wide">OMTM</span>
          </div>
          <button
            className="text-[13px] text-[#7652b3] hover:text-purple-700 font-semibold"
            onClick={(e) => e.stopPropagation()}
          >
            View breakdown →
          </button>
        </div>

        <p className="text-[13px] text-slate-400 font-medium mb-6">% of lapsed customers reactivated within 90 days</p>

        {/* Top metrics row */}
        <div className="flex items-center gap-5 mb-8">
          {/* Circular gauge */}
          <div className="relative flex-shrink-0">
            <svg width="120" height="120" className="transform -rotate-90">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#E9D5FF" strokeWidth="16" />
              <circle
                cx="60" cy="60" r="50"
                fill="none"
                stroke="#A855F7"
                strokeWidth="16"
                strokeDasharray={`${(0.44) * 314} 314`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[42px] font-bold text-slate-900 tracking-tight">44%</span>
            </div>
          </div>

          {/* Metric cards */}
          <div className="flex-1 grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-purple-100/60 border border-purple-200/40">
              <div className="text-[11px] text-[#7652b3] font-semibold mb-1">Total Win-backs</div>
              <div className="text-[26px] font-bold text-slate-900 tracking-tight leading-none mb-1">7'430</div>
              <span className="text-[11px] font-bold text-emerald-600">+22%</span>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-100/60 border border-emerald-200/40">
              <div className="text-[11px] text-emerald-700 font-semibold mb-1">Avg. Cost / Win-back</div>
              <div className="text-[26px] font-bold text-slate-900 tracking-tight leading-none mb-1">$6.70</div>
              <span className="text-[11px] font-bold text-emerald-600">-8%</span>
            </div>
            <div className="p-3.5 rounded-xl bg-amber-100/60 border border-amber-200/40">
              <div className="text-[11px] text-amber-700 font-semibold mb-1">Avg. Days to Return</div>
              <div className="text-[26px] font-bold text-slate-900 tracking-tight leading-none mb-1">34</div>
              <span className="text-[11px] font-semibold text-slate-500">-3d</span>
            </div>
          </div>
        </div>

        {/* Table header */}
        <div className="grid grid-cols-[2.5fr,1fr,1.2fr,1fr] gap-4 mb-3 px-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">CHANNEL</div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">RATE</div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">WON BACK</div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">COST</div>
        </div>

        {/* Channel rows with background bars */}
        <div className="space-y-2">
          {[
            { channel: 'Loyalty Program', rate: '62%', wonBack: '1840', cost: '$8.20', barWidth: 100, barColor: 'bg-purple-600', barBg: 'bg-purple-100' },
            { channel: 'Email Nurture', rate: '55%', wonBack: "2'310", cost: '$5.40', barWidth: 89, barColor: 'bg-purple-500', barBg: 'bg-purple-100' },
            { channel: 'SMS Campaigns', rate: '48%', wonBack: '1120', cost: '$6.80', barWidth: 77, barColor: 'bg-purple-400', barBg: 'bg-purple-100' },
            { channel: 'Push Notifications', rate: '41%', wonBack: '960', cost: '$3.10', barWidth: 66, barColor: 'bg-purple-300', barBg: 'bg-purple-100', costColor: 'text-emerald-600' },
            { channel: 'Instagram DMs', rate: '34%', wonBack: '680', cost: '$9.50', barWidth: 55, barColor: 'bg-purple-200', barBg: 'bg-purple-100', costColor: 'text-[#e11d48]' },
            { channel: 'FB Messenger', rate: '29%', wonBack: '520', cost: '$7.20', barWidth: 47, barColor: 'bg-purple-100', barBg: 'bg-slate-100' }
          ].map((item, idx) => (
            <div key={idx} className="relative">
              {/* Background bar (full width) */}
              <div className={`absolute inset-0 ${item.barBg} rounded-lg`} />
              {/* Colored bar based on percentage */}
              <div
                className={`absolute inset-y-0 left-0 ${item.barColor} rounded-lg transition-all duration-700`}
                style={{ width: `${item.barWidth}%` }}
              />
              {/* Content on top */}
              <div className="relative grid grid-cols-[2.5fr,1fr,1.2fr,1fr] gap-4 items-center px-3 py-2.5">
                <span className="text-[14px] font-medium text-slate-600">{item.channel}</span>
                <span className="text-[14px] font-semibold text-slate-700 text-right">{item.rate}</span>
                <span className="text-[14px] font-semibold text-slate-700 text-right">{item.wonBack}</span>
                <span className={`text-[14px] font-bold ${item.costColor || 'text-slate-900'} text-right`}>{item.cost}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="mt-6 grid grid-cols-[1fr,2.5fr] gap-4">
          <div className="p-4 rounded-xl bg-red-100/70 border border-red-200/50">
            <div className="text-[11px] text-[#e11d48] font-semibold mb-1">Still Lapsed</div>
            <div className="text-[48px] font-bold text-[#e11d48] tracking-tight leading-none">56%</div>
          </div>
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/50">
            <div className="flex items-start gap-2">
              <span className="text-[18px]">💡</span>
              <div>
                <span className="text-[12px] font-bold text-amber-900">Insight:</span>
                <span className="text-[12px] text-amber-900 leading-relaxed ml-1">
                  Push Notifications deliver win-backs at $3.10 each — 63% cheaper than the next channel. Email Nurture drives the highest volume (2,310). Consider a combined push + email sequence for lapsed segments.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
