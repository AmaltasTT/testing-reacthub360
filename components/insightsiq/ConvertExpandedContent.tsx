'use client';

import { useId, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, Lightbulb, ShoppingCart, Sparkles } from 'lucide-react';
import { LineChart, Line } from 'recharts';
import type { ReachFilterContext } from '@/components/insightsiq/PhaseCard';
import type { ConvertExpandedData } from '@/hooks/use-insightsiq';
import { buildInsightsMetricsUrl } from '@/lib/insights-campaign-url';

interface ConvertExpandedContentProps {
  filterContext?: ReachFilterContext;
  data?: ConvertExpandedData;
  isLoading?: boolean;
}

function parsePercentString(s: string): number | null {
  if (!s || s === '—') return null;
  const n = parseFloat(String(s).replace('%', '').trim());
  return Number.isFinite(n) ? n : null;
}

function parseMoney(s?: string): number | null {
  if (!s || s === '—') return null;
  const t = s.trim().replace(/[$,]/g, '');
  if (/K$/i.test(t)) {
    const n = parseFloat(t.replace(/K$/i, ''));
    return Number.isFinite(n) ? n * 1000 : null;
  }
  if (/M$/i.test(t)) {
    const n = parseFloat(t.replace(/M$/i, ''));
    return Number.isFinite(n) ? n * 1_000_000 : null;
  }
  const n = parseFloat(t);
  return Number.isFinite(n) ? n : null;
}

function parseRoas(s?: string): number | null {
  if (!s || s === '—') return null;
  const n = parseFloat(String(s).replace(/×/g, 'x').replace(/x/gi, '').trim());
  return Number.isFinite(n) ? n : null;
}

function parseCpcNumber(s?: string): number | null {
  if (!s || s === '—') return null;
  const n = parseFloat(String(s).replace(/[$,]/g, '').trim());
  return Number.isFinite(n) ? n : null;
}

function formatSparkline(arr: number[]) {
  return arr.map((value) => ({ value }));
}

function ConvertExpandedSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-20 rounded-2xl bg-slate-200/70" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-72 rounded-2xl bg-slate-200/70" />
        <div className="h-72 rounded-2xl bg-slate-200/70" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-72 rounded-2xl bg-slate-200/70" />
        <div className="h-72 rounded-2xl bg-slate-200/70" />
      </div>
      <div className="h-96 rounded-2xl bg-slate-200/70" />
    </div>
  );
}

export function ConvertExpandedContent({ filterContext, data, isLoading }: ConvertExpandedContentProps = {}) {
  const router = useRouter();
  const uid = useId();
  const gradConv = `convSpark-${uid}`;
  const gradAov = `aovSpark-${uid}`;

  const am = data?.additional_metrics;
  const cr = data?.conversion_rate;
  const cbc = data?.conversions_by_channel;
  const rbc = data?.revenue_by_channel;
  const aov = data?.aov;
  const eff = data?.channel_efficiency;
  const insights = data?.insights ?? [];

  const convSparkData = useMemo(() => formatSparkline(cr?.sparkline ?? []), [cr?.sparkline]);
  const aovSparkData = useMemo(() => formatSparkline(aov?.sparkline ?? []), [aov?.sparkline]);

  const maxCrPct = useMemo(() => {
    const vals = (cr?.channels ?? []).map((c) => parsePercentString(c.value)).filter((n): n is number => n != null && n > 0);
    return vals.length ? Math.max(...vals) : 1;
  }, [cr?.channels]);

  const maxConv = useMemo(() => {
    const vals = (cbc?.channels ?? []).map((c) => c.value).filter((n) => n > 0);
    return vals.length ? Math.max(...vals) : 1;
  }, [cbc?.channels]);

  const maxRev = useMemo(() => {
    const vals = (rbc?.channels ?? []).map((c) => parseMoney(c.value)).filter((n): n is number => n != null && n > 0);
    return vals.length ? Math.max(...vals) : 1;
  }, [rbc?.channels]);

  const maxAov = useMemo(() => {
    const vals = (aov?.channels ?? []).map((c) => parseMoney(c.value)).filter((n): n is number => n != null && n > 0);
    return vals.length ? Math.max(...vals) : 1;
  }, [aov?.channels]);

  const maxCpcEff = useMemo(() => {
    const vals = (eff?.channels ?? []).map((c) => parseCpcNumber(c.cpc)).filter((n): n is number => n != null && n > 0);
    return vals.length ? Math.max(...vals) : 7;
  }, [eff?.channels]);

  const maxRoasEff = useMemo(() => {
    const vals = (eff?.channels ?? []).map((c) => parseRoas(c.roas)).filter((n): n is number => n != null && n > 0);
    return vals.length ? Math.max(...vals, 1) : 10;
  }, [eff?.channels]);

  if (isLoading && !data) {
    return <ConvertExpandedSkeleton />;
  }

  if (!data) {
    return <p className="text-sm text-slate-600">No Convert data for this view.</p>;
  }

  const crDisplay = cr?.value != null && cr.value !== '' ? cr.value : '—';
  const crUnavailable = cr?.available === false;

  return (
    <>
      {am && (
        <div className="mb-6 rounded-2xl border border-slate-200/60 bg-white/60 backdrop-blur-sm p-4 sm:p-5">
          <h3 className="text-[14px] font-semibold text-slate-900 mb-3">Additional metrics</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(
              [
                ['total_orders', 'Total orders'],
                ['cart_abandonment', 'Cart abandonment'],
                ['repeat_purchase', 'Repeat purchase'],
                ['cac', 'CAC'],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className="rounded-xl border border-slate-100 bg-white/80 px-3 py-2">
                <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-0.5">{label}</div>
                <div className="text-sm font-bold text-slate-900">{am[key] ?? '—'}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Conversion Rate */}
        <div className="relative group overflow-hidden rounded-2xl backdrop-blur-xl bg-white/70 border border-white/40 shadow-[0_8px_32px_rgba(139,92,246,0.08)] hover:shadow-[0_12px_48px_rgba(139,92,246,0.12)] transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.03] via-transparent to-blue-500/[0.02]" />
          <div className="relative z-10 p-5">
            <div className="flex items-start justify-between mb-5">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-[15px] font-semibold text-slate-900 tracking-tight">Conversion Rate</h3>
                  <span className="px-2 py-0.5 rounded-md bg-purple-500/10 backdrop-blur-sm border border-purple-500/20 text-[10px] font-bold text-purple-700 uppercase tracking-wide">
                    OMTM
                  </span>
                </div>
                <p className="text-[12px] text-slate-500 font-medium">% of visitors who convert</p>
              </div>
            </div>

            {crUnavailable && cr?.note && (
              <p className="mb-4 text-[12px] text-amber-800 bg-amber-50/80 border border-amber-200/50 rounded-lg px-3 py-2 leading-relaxed">
                {cr.note}
              </p>
            )}

            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex-shrink-0">
                <div className="mb-3">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-[48px] font-semibold text-slate-900 tracking-tight leading-none">{crDisplay}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">overall conversion rate</span>
                </div>

                {convSparkData.length > 0 ? (
                  <div className="w-[140px] h-[50px]" onClick={(e) => e.stopPropagation()}>
                    <LineChart width={140} height={50} data={convSparkData}>
                      <defs>
                        <linearGradient id={gradConv} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#A78BFA" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#A78BFA" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#A78BFA"
                        strokeWidth={2.5}
                        dot={false}
                        fill={`url(#${gradConv})`}
                      />
                    </LineChart>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 w-[140px]">No sparkline for this period.</p>
                )}
              </div>

              <div className="flex-1 space-y-2 min-w-[200px] max-h-[240px] overflow-y-auto pr-1">
                {(cr?.channels ?? []).map((channel, idx) => {
                  const p = parsePercentString(channel.value);
                  const w = p != null && p > 0 ? Math.max(4, (p / maxCrPct) * 100) : p === 0 ? 2 : 0;
                  const isDash = channel.value === '—' || p == null;
                  return (
                    <div key={`${channel.name}-${idx}`} className="flex items-center gap-2">
                      <span className="text-[12px] font-medium text-slate-700 w-28 truncate">{channel.name}</span>
                      <div className="flex-1 h-3 bg-white/40 backdrop-blur-sm rounded-full overflow-hidden border border-white/60 shadow-inner">
                        <div
                          className={`h-full rounded-full transition-all duration-700 shadow-sm ${
                            isDash ? 'bg-slate-200/50' : 'bg-gradient-to-r from-[#A78BFA]/60 to-[#A78BFA]/40 backdrop-blur-md'
                          }`}
                          style={{ width: `${w}%` }}
                        />
                      </div>
                      <span className="text-[12px] font-semibold text-slate-900 w-12 text-right shrink-0">{channel.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/60">
              <div className="flex flex-wrap items-center gap-1 text-[12px] text-slate-600">
                <TrendingUp className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-medium text-slate-700">{cr?.trend ?? '—'}</span>
                <span className="text-slate-500">— Benchmark: {cr?.benchmark ?? '—'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Conversions by Channel */}
        <div className="relative group overflow-hidden rounded-2xl backdrop-blur-xl bg-white/70 border border-white/40 shadow-[0_8px_32px_rgba(139,92,246,0.08)] hover:shadow-[0_12px_48px_rgba(139,92,246,0.12)] transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.02] via-transparent to-purple-500/[0.02]" />
          <div className="relative z-10 p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-[15px] font-semibold text-slate-900 mb-1 tracking-tight">Conversions by Channel</h3>
                <p className="text-[12px] text-slate-500 font-medium">Total conversion volume</p>
              </div>
            </div>

            <div className="mb-5 p-4 rounded-xl bg-gradient-to-br from-purple-50/80 to-blue-50/60 backdrop-blur-sm border border-purple-100/50">
              <div className="text-[36px] font-semibold text-slate-900 leading-none tracking-tight mb-1">
                {cbc?.total != null ? cbc.total.toLocaleString() : '—'}
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                <TrendingUp className="w-3 h-3 text-slate-400" />
                <span className="text-[12px] text-slate-600 font-medium">{cbc?.trend ?? '—'}</span>
              </div>
            </div>

            <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
              {(cbc?.channels ?? []).map((channel, idx) => {
                const w = channel.value > 0 ? Math.max(4, (channel.value / maxConv) * 100) : 0;
                return (
                  <div
                    key={`${channel.name}-${idx}`}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50/50 transition-colors"
                  >
                    <span className="text-[12px] font-medium text-slate-700 w-28 truncate">{channel.name}</span>
                    <div className="flex-1 h-3 bg-white/40 backdrop-blur-sm rounded-full overflow-hidden border border-white/60 shadow-inner">
                      <div
                        className="h-full rounded-full transition-all duration-700 shadow-sm bg-gradient-to-r from-[#A78BFA]/60 to-[#A78BFA]/40 backdrop-blur-md"
                        style={{ width: `${w}%` }}
                      />
                    </div>
                    <span className="text-[12px] font-semibold text-slate-900 w-10 text-right shrink-0">{channel.value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Revenue by Channel */}
        <div className="relative group overflow-hidden rounded-2xl backdrop-blur-xl bg-white/70 border border-white/40 shadow-[0_8px_32px_rgba(139,92,246,0.08)] hover:shadow-[0_12px_48px_rgba(139,92,246,0.12)] transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] via-transparent to-purple-500/[0.02]" />
          <div className="relative z-10 p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-[15px] font-semibold text-slate-900 mb-1 tracking-tight">Revenue by Channel</h3>
                <p className="text-[12px] text-slate-500 font-medium">Total converted value</p>
              </div>
            </div>

            <div className="mb-5 p-4 rounded-xl bg-gradient-to-br from-purple-50/80 to-blue-50/60 backdrop-blur-sm border border-purple-100/50">
              <div className="text-[36px] font-semibold text-slate-900 leading-none tracking-tight mb-1">{rbc?.total ?? '—'}</div>
              <div className="flex items-center gap-1 flex-wrap">
                <TrendingUp className="w-3 h-3 text-slate-400" />
                <span className="text-[12px] text-slate-600 font-medium">{rbc?.trend ?? '—'}</span>
              </div>
            </div>

            <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
              {(rbc?.channels ?? []).map((channel, idx) => {
                const m = parseMoney(channel.value);
                const w = m != null && m > 0 ? Math.max(4, (m / maxRev) * 100) : 0;
                const isDash = channel.value === '—' || m == null;
                return (
                  <div
                    key={`${channel.name}-${idx}`}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50/50 transition-colors"
                  >
                    <span className="text-[12px] font-medium text-slate-700 w-28 truncate">{channel.name}</span>
                    <div className="flex-1 h-3 bg-white/40 backdrop-blur-sm rounded-full overflow-hidden border border-white/60 shadow-inner">
                      <div
                        className={`h-full rounded-full transition-all duration-700 shadow-sm ${
                          isDash ? 'bg-slate-200/50' : 'bg-gradient-to-r from-[#A78BFA]/60 to-[#A78BFA]/40 backdrop-blur-md'
                        }`}
                        style={{ width: `${w}%` }}
                      />
                    </div>
                    <span className="text-[12px] font-semibold text-slate-900 w-14 text-right shrink-0">{channel.value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* AOV */}
        <div className="relative group overflow-hidden rounded-2xl backdrop-blur-xl bg-white/70 border border-white/40 shadow-[0_8px_32px_rgba(139,92,246,0.08)] hover:shadow-[0_12px_48px_rgba(139,92,246,0.12)] transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] via-transparent to-emerald-500/[0.02]" />
          <div className="relative z-10 p-5">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="text-[15px] font-semibold text-slate-900 mb-1 tracking-tight">Average Order Value (AOV)</h3>
                <p className="text-[12px] text-slate-500 font-medium">Revenue per conversion</p>
              </div>
            </div>

            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex-shrink-0">
                <div className="mb-3">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-[48px] font-semibold text-slate-900 tracking-tight leading-none">{aov?.value ?? '—'}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">average order value</span>
                </div>

                {aovSparkData.length > 0 ? (
                  <div className="w-[140px] h-[50px]" onClick={(e) => e.stopPropagation()}>
                    <LineChart width={140} height={50} data={aovSparkData}>
                      <defs>
                        <linearGradient id={gradAov} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#A78BFA" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#A78BFA" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#A78BFA"
                        strokeWidth={2.5}
                        dot={false}
                        fill={`url(#${gradAov})`}
                      />
                    </LineChart>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 w-[140px]">No sparkline for this period.</p>
                )}
              </div>

              <div className="flex-1 space-y-2 min-w-[200px] max-h-[240px] overflow-y-auto pr-1">
                {(aov?.channels ?? []).map((channel, idx) => {
                  const m = parseMoney(channel.value);
                  const w = m != null && m > 0 ? Math.max(4, (m / maxAov) * 100) : 0;
                  const isDash = channel.value === '—' || m == null;
                  return (
                    <div key={`${channel.name}-${idx}`} className="flex items-center gap-2">
                      <span className="text-[12px] font-medium text-slate-700 w-28 truncate">{channel.name}</span>
                      <div className="flex-1 h-3 bg-white/40 backdrop-blur-sm rounded-full overflow-hidden border border-white/60 shadow-inner">
                        <div
                          className={`h-full rounded-full transition-all duration-700 shadow-sm ${
                            isDash ? 'bg-slate-200/50' : 'bg-gradient-to-r from-[#A78BFA]/60 to-[#A78BFA]/40 backdrop-blur-md'
                          }`}
                          style={{ width: `${w}%` }}
                        />
                      </div>
                      <span className="text-[12px] font-semibold text-slate-900 w-14 text-right shrink-0">{channel.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/60">
              <div className="flex flex-wrap items-center gap-1 text-[12px] text-slate-600">
                <TrendingUp className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-medium text-slate-700">{aov?.trend ?? '—'}</span>
                <span className="text-slate-500">— Benchmark: {aov?.benchmark ?? '—'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Channel efficiency */}
      <div className="relative group overflow-hidden rounded-2xl backdrop-blur-xl bg-white/70 border border-white/40 shadow-[0_8px_32px_rgba(139,92,246,0.08)] hover:shadow-[0_12px_48px_rgba(139,92,246,0.12)] transition-all duration-500 mb-4">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.02] via-transparent to-purple-500/[0.02]" />
        <div className="relative z-10 p-5">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="text-[15px] font-semibold text-slate-900 mb-1 tracking-tight">Channel Conversion Efficiency</h3>
              <p className="text-[12px] text-slate-500 font-medium">Performance scorecard across all channels</p>
            </div>
          </div>

          {eff?.note && (
            <p className="mb-4 text-[11px] text-slate-600 bg-slate-50/80 border border-slate-200/50 rounded-lg px-3 py-2 leading-relaxed">
              {eff.note}
            </p>
          )}

          <div className="grid grid-cols-12 gap-3 px-2 sm:px-4 pb-2 mb-2 border-b border-slate-200/60">
            <div className="col-span-1 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">#</div>
            <div className="col-span-3 sm:col-span-2 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Channel</div>
            <div className="col-span-2 text-[10px] text-slate-400 font-semibold uppercase tracking-wider text-right">Revenue</div>
            <div className="col-span-2 text-[10px] text-slate-400 font-semibold uppercase tracking-wider text-right">Conv rate</div>
            <div className="col-span-2 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">CPC / cost</div>
            <div className="col-span-2 sm:col-span-3 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">ROAS</div>
          </div>

          <div className="space-y-2 mb-5 max-h-[320px] overflow-y-auto pr-1">
            {(eff?.channels ?? []).map((channel, idx) => {
              const roasN = parseRoas(channel.roas);
              const cpcN = parseCpcNumber(channel.cpc);
              const roasW = roasN != null ? Math.min((roasN / maxRoasEff) * 100, 100) : 0;
              const cpcW = cpcN != null ? Math.min((cpcN / maxCpcEff) * 100, 100) : 0;
              const hasRev = channel.revenue && channel.revenue !== '—';
              return (
                <div
                  key={`${channel.name}-${idx}`}
                  className={`grid grid-cols-12 gap-2 sm:gap-3 items-center px-2 sm:px-4 py-3 rounded-xl transition-all duration-200 ${
                    hasRev ? 'bg-white/40 border border-slate-200/30 hover:bg-white/60' : 'bg-white/25 border border-slate-100/40'
                  }`}
                >
                  <div className="col-span-1">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-[11px] bg-gradient-to-br from-purple-400 to-purple-500">
                      {idx + 1}
                    </div>
                  </div>
                  <div className="col-span-3 sm:col-span-2 min-w-0">
                    <div className="text-[13px] font-semibold text-slate-900 truncate">{channel.name}</div>
                    {channel.trend && (
                      <span className="text-[10px] font-medium text-slate-500">{channel.trend}</span>
                    )}
                  </div>
                  <div className="col-span-2 text-right">
                    <div className="text-[14px] font-bold text-slate-900 truncate">{channel.revenue ?? '—'}</div>
                  </div>
                  <div className="col-span-2 text-right">
                    <div className="text-[13px] font-semibold text-slate-700">{channel.conv_rate ?? '—'}</div>
                  </div>
                  <div className="col-span-2 min-w-0">
                    {cpcN != null ? (
                      <div className="flex items-center gap-1.5">
                        <div className="flex-1 h-5 bg-slate-100/80 rounded-full overflow-hidden min-w-0">
                          <div
                            className="h-full rounded-full transition-all duration-700 flex items-center justify-start px-1.5 bg-gradient-to-r from-[#A78BFA] to-[#7C3AED]"
                            style={{ width: `${Math.max(cpcW, 8)}%` }}
                          >
                            <span className="text-[10px] font-bold text-white truncate">{channel.cpc}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-[12px] text-slate-600">{channel.cpc ?? '—'}</span>
                    )}
                    {channel.cpc_label && (
                      <div className="text-[9px] text-slate-400 mt-0.5 truncate">{channel.cpc_label}</div>
                    )}
                  </div>
                  <div className="col-span-2 sm:col-span-3 min-w-0">
                    {roasN != null ? (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-6 bg-slate-100/80 rounded-full overflow-hidden min-w-0">
                          <div
                            className={`h-full rounded-full transition-all duration-700 flex items-center justify-start px-2 ${
                              roasN < 1 ? 'bg-gradient-to-r from-red-400 to-red-500' : roasN >= 5 ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : 'bg-gradient-to-r from-[#A78BFA] to-[#7C3AED]'
                            }`}
                            style={{ width: `${Math.max(roasW, 8)}%` }}
                          >
                            <span className="text-[11px] font-bold text-white truncate">{channel.roas}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-[12px] text-slate-600">{channel.roas ?? '—'}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-gradient-to-br from-purple-50/60 to-blue-50/40 backdrop-blur-sm border border-purple-200/30">
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Revenue</div>
              <div className="text-[16px] font-bold text-slate-900">{eff?.total_revenue ?? '—'}</div>
            </div>
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Ad Spend</div>
              <div className="text-[16px] font-bold text-slate-900">{eff?.total_ad_spend ?? '—'}</div>
            </div>
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Blended ROAS</div>
              <div className="text-[16px] font-bold text-purple-700">{eff?.blended_roas ?? '—'}</div>
            </div>
          </div>
        </div>
      </div>

      {insights.length > 0 && (
        <div className="mb-8 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.map((text, i) => (
              <div
                key={i}
                className="px-4 py-3.5 rounded-xl bg-gradient-to-br from-purple-50/80 to-blue-50/40 backdrop-blur-sm border border-purple-200/40 flex items-start gap-3"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-purple-100/80 flex items-center justify-center">
                  {i === 0 ? <Sparkles className="w-4 h-4 text-[#7652b3]" /> : <Lightbulb className="w-4 h-4 text-[#7652b3]" />}
                </div>
                <p className="text-[12px] text-slate-700 font-medium leading-relaxed flex-1">{text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-start">
        <button
          type="button"
          className="px-6 py-3 text-base text-white bg-gradient-to-r from-[#A78BFA] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#A78BFA] rounded-xl shadow-md hover:shadow-lg transition-all duration-200 font-bold flex items-center gap-2 group"
          onClick={(e) => {
            e.stopPropagation();
            router.push(buildInsightsMetricsUrl('/insights/convert-stats', filterContext));
          }}
        >
          <ShoppingCart className="w-4 h-4" />
          Explore Convert Drivers
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </>
  );
}
