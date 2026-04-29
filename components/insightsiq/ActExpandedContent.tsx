'use client';

import { useId, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Lightbulb, Sparkles, BarChart3, Info } from 'lucide-react';
import type { ReachFilterContext } from '@/components/insightsiq/PhaseCard';
import type { ActExpandedData } from '@/hooks/use-insightsiq';
import { buildInsightsMetricsUrl } from '@/lib/insights-campaign-url';

interface ActExpandedContentProps {
  filterContext?: ReachFilterContext;
  data?: ActExpandedData;
  isLoading?: boolean;
}

const BREAKDOWN_ITEMS: { key: keyof ActExpandedData['action_breakdown']; label: string }[] = [
  { key: 'leads', label: 'Leads' },
  { key: 'lead_form_opens', label: 'Lead form opens' },
  { key: 'event_registrations', label: 'Event registrations' },
  { key: 'qualified_leads', label: 'Qualified leads' },
  { key: 'add_to_cart', label: 'Add to cart' },
  { key: 'wishlist_adds', label: 'Wishlist adds' },
  { key: 'newsletter_signups', label: 'Newsletter signups' },
  { key: 'downloads', label: 'Downloads' },
];

function parsePercentString(s: string): number | null {
  if (!s || s === '—') return null;
  const n = parseFloat(String(s).replace('%', '').trim());
  return Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : null;
}

function completionRatePercent(d?: ActExpandedData): number {
  const r = d?.action_completion_rate;
  if (r?.rate != null && Number.isFinite(r.rate)) {
    return Math.min(100, Math.max(0, r.rate));
  }
  return parsePercentString(r?.value ?? '') ?? 0;
}

function gradeStyle(grade?: string): {
  rowBg: string;
  bar: string;
  badge: string;
} {
  const g = (grade ?? '').toUpperCase();
  if (g === 'A')
    return {
      rowBg: 'bg-emerald-50/30',
      bar: 'bg-gradient-to-r from-emerald-400 to-emerald-300',
      badge: 'bg-emerald-100 text-emerald-700',
    };
  if (g === 'B')
    return {
      rowBg: 'bg-purple-50/25',
      bar: 'bg-gradient-to-r from-purple-400 to-purple-300',
      badge: 'bg-purple-100 text-purple-700',
    };
  if (g === 'C')
    return {
      rowBg: 'bg-red-50/20',
      bar: 'bg-gradient-to-r from-red-300 to-red-200',
      badge: 'bg-red-100 text-red-700',
    };
  return {
    rowBg: 'bg-white/30 hover:bg-white/60',
    bar: 'bg-gradient-to-r from-slate-300 to-slate-200',
    badge: 'bg-slate-100 text-slate-700',
  };
}

function ActExpandedSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-24 rounded-2xl bg-slate-200/70" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80 rounded-2xl bg-slate-200/70" />
        <div className="h-80 rounded-2xl bg-slate-200/70" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80 rounded-2xl bg-slate-200/70" />
        <div className="h-80 rounded-2xl bg-slate-200/70" />
      </div>
    </div>
  );
}

export function ActExpandedContent({ filterContext, data, isLoading }: ActExpandedContentProps = {}) {
  const router = useRouter();
  const uid = useId();

  const acrPct = useMemo(() => completionRatePercent(data), [data]);
  const acr = data?.action_completion_rate;
  const ais = data?.action_impact_score;
  const aqs = data?.action_quality_score;
  const eff = data?.action_channel_efficiency;
  const insights = data?.insights ?? [];

  const aisGauge10 = useMemo(() => {
    if (ais?.value_0_10 != null && Number.isFinite(ais.value_0_10)) {
      return Math.min(10, Math.max(0, ais.value_0_10));
    }
    if (ais?.value != null && Number.isFinite(ais.value)) {
      return Math.min(10, Math.max(0, ais.value / 10));
    }
    return 0;
  }, [ais?.value, ais?.value_0_10]);

  const aqsGauge10 = useMemo(() => {
    if (aqs?.value_0_10 != null && Number.isFinite(aqs.value_0_10)) {
      return Math.min(10, Math.max(0, aqs.value_0_10));
    }
    if (aqs?.value != null && Number.isFinite(aqs.value)) {
      return Math.min(10, Math.max(0, aqs.value));
    }
    return 0;
  }, [aqs?.value, aqs?.value_0_10]);

  const maxAce = useMemo(() => {
    const vals = (eff?.channels ?? []).map((c) => c.ace ?? 0).filter((n) => n > 0);
    return vals.length ? Math.max(...vals) : 1;
  }, [eff?.channels]);

  const gradAcr = `gaugeAcr-${uid}`;
  const gradAis = `gaugeAis-${uid}`;
  const gradAqs = `gaugeAqs-${uid}`;

  if (isLoading && !data) {
    return <ActExpandedSkeleton />;
  }

  const breakdown = data?.action_breakdown;

  return (
    <>
      {breakdown && (
        <div className="mb-6 rounded-2xl border border-slate-200/60 bg-white/60 backdrop-blur-sm p-4 sm:p-5">
          <h3 className="text-[14px] font-semibold text-slate-900 mb-3">Action breakdown</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {BREAKDOWN_ITEMS.map(({ key, label }) => (
              <div key={key} className="rounded-xl border border-slate-100 bg-white/80 px-3 py-2">
                <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-0.5">
                  {label}
                </div>
                <div className="text-sm font-bold text-slate-900">{breakdown[key] ?? '—'}</div>
              </div>
            ))}
          </div>
          {data?.action_breakdown_meta?.legacy_keys_note && (
            <p className="mt-3 text-[11px] text-slate-500 leading-relaxed">{data.action_breakdown_meta.legacy_keys_note}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Action Completion Rate */}
        <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/70 border border-white/40 shadow-[0_8px_32px_rgba(139,92,246,0.08)]">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.03] via-transparent to-blue-500/[0.02]" />
          <div className="relative z-10 p-6">
            <div className="flex items-start justify-between mb-5">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-[15px] font-semibold text-slate-900 tracking-tight">Action Completion Rate</h3>
                  <span className="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-[10px] font-bold text-purple-700 uppercase tracking-wide">
                    OMTM
                  </span>
                </div>
                <p className="text-[12px] text-slate-500 font-medium">Qualified leads ÷ leads (by channel where available)</p>
              </div>
            </div>

            {acr?.available === false ? (
              <p className="text-[13px] text-slate-600">{acr?.note || 'Action completion rate is not available.'}</p>
            ) : (
              <>
                <div className="flex items-center gap-6">
                  <div className="relative flex-shrink-0">
                    <svg width="120" height="120" className="transform -rotate-90 drop-shadow-sm">
                      <circle cx="60" cy="60" r="48" fill="none" stroke="#F1F5F9" strokeWidth="10" />
                      <circle
                        cx="60"
                        cy="60"
                        r="48"
                        fill="none"
                        stroke={`url(#${gradAcr})`}
                        strokeWidth="10"
                        strokeDasharray={`${(acrPct / 100) * 301.6} 301.6`}
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id={gradAcr} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#7C3AED" />
                          <stop offset="100%" stopColor="#A78BFA" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[28px] font-semibold text-slate-900 tracking-tight">{acr?.value ?? '—'}</span>
                      <span className="text-[11px] text-slate-400 font-medium">overall</span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-2 max-h-[240px] overflow-y-auto pr-1">
                    {(acr?.channels ?? []).length === 0 ? (
                      <p className="text-[12px] text-slate-500">No channel breakdown.</p>
                    ) : (
                      acr!.channels.map((ch, idx) => {
                        const w = parsePercentString(ch.value) ?? 0;
                        const isDash = ch.value === '—' || w === 0;
                        return (
                          <div key={`${ch.name}-${idx}`} className="flex items-center gap-2">
                            <span className="text-[12px] font-medium text-slate-700 w-28 truncate" title={ch.name}>
                              {ch.name}
                            </span>
                            <div className="flex-1 h-3 bg-white/40 backdrop-blur-sm rounded-full overflow-hidden border border-white/60 shadow-inner">
                              <div
                                className={`h-full rounded-full transition-all duration-700 ${
                                  isDash
                                    ? 'bg-slate-200/50'
                                    : 'bg-gradient-to-r from-[#A78BFA]/60 to-[#A78BFA]/40'
                                }`}
                                style={{ width: `${isDash ? 4 : w}%` }}
                              />
                            </div>
                            <span className="text-[12px] font-semibold text-slate-900 w-12 text-right">{ch.value}</span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 text-[12px] text-slate-600">
                  <span className="font-medium text-slate-800">{acr?.trend}</span>
                  <span className="text-slate-500">
                    {' '}
                    · Benchmark: <span className="font-semibold text-slate-800">{acr?.benchmark}</span>
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action Impact Score */}
        <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/70 border border-white/40 shadow-[0_8px_32px_rgba(139,92,246,0.08)]">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] via-transparent to-purple-500/[0.02]" />
          <div className="relative z-10 p-6">
            <div className="flex items-start justify-between mb-5">
              <div className="flex-1">
                <h3 className="text-[15px] font-semibold text-slate-900 mb-1 tracking-tight">Action Impact Score (AIS)</h3>
                <p className="text-[12px] text-slate-500 font-medium">{ais?.formula || 'Quality × scale composite'}</p>
              </div>
            </div>

            <div className="flex flex-col xl:flex-row xl:items-start gap-6">
              <div className="relative flex-shrink-0 mx-auto xl:mx-0">
                <svg width="120" height="120" className="transform -rotate-90 drop-shadow-sm">
                  <circle cx="60" cy="60" r="48" fill="none" stroke="#F1F5F9" strokeWidth="10" />
                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    fill="none"
                    stroke={`url(#${gradAis})`}
                    strokeWidth="10"
                    strokeDasharray={`${(aisGauge10 / 10) * 301.6} 301.6`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id={gradAis} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#7C3AED" />
                      <stop offset="100%" stopColor="#A78BFA" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[28px] font-semibold text-slate-900 tracking-tight">{aisGauge10.toFixed(1)}</span>
                  <span className="text-[11px] text-slate-400 font-medium">gauge (0–10)</span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-baseline gap-2 mb-2 text-[12px] text-slate-600">
                  <span>
                    AIS (0–100): <strong className="text-slate-900">{ais?.value ?? '—'}</strong>
                  </span>
                  {ais?.label && (
                    <span className="text-slate-500">
                      · {ais.label}
                    </span>
                  )}
                </div>
                {ais?.scale && <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">{ais.scale}</p>}

                <div className="rounded-xl overflow-hidden border border-slate-200/60 backdrop-blur-sm max-h-[260px] overflow-y-auto">
                  <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-slate-50/80 border-b border-slate-200/60 sticky top-0">
                    <div className="col-span-4 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Channel</div>
                    <div className="col-span-2 text-[10px] text-slate-500 font-semibold uppercase tracking-wider text-right">AQS</div>
                    <div className="col-span-3 text-[10px] text-slate-500 font-semibold uppercase tracking-wider text-right">Sessions</div>
                    <div className="col-span-3 text-[10px] text-slate-500 font-semibold uppercase tracking-wider text-right">AIS</div>
                  </div>
                  {(ais?.channels ?? []).map((ch, idx) => {
                    const low = (ch.ais ?? 0) < 35;
                    return (
                      <div
                        key={`${ch.name}-${idx}`}
                        className={`grid grid-cols-12 gap-2 px-3 py-2 border-b border-slate-200/40 last:border-b-0 hover:bg-slate-50/50 ${low ? 'bg-slate-50/30' : ''}`}
                      >
                        <div className="col-span-4 text-[12px] font-medium text-slate-900 truncate" title={ch.name}>
                          {ch.name}
                        </div>
                        <div className="col-span-2 text-[12px] font-semibold text-slate-900 text-right">
                          {ch.aqs != null ? ch.aqs : '—'}
                        </div>
                        <div className="col-span-3 text-[12px] font-semibold text-slate-900 text-right">
                          {ch.sessions != null && ch.sessions > 0 ? ch.sessions : '—'}
                        </div>
                        <div
                          className={`col-span-3 text-[12px] font-bold text-right ${low ? 'text-slate-600' : 'text-purple-700'}`}
                        >
                          {ch.ais != null ? ch.ais : '—'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Action Quality Score */}
        <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/70 border border-white/40 shadow-[0_8px_32px_rgba(139,92,246,0.08)]">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.02] via-transparent to-purple-500/[0.02]" />
          <div className="relative z-10 p-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="text-[15px] font-semibold text-slate-900 mb-1 tracking-tight">Action Quality Score (AQS)</h3>
                <p className="text-[12px] text-slate-500 font-medium">Mapped to 0–10 for the gauge</p>
              </div>
            </div>

            {aqs?.scale && <p className="text-[11px] text-slate-500 mb-4 leading-relaxed">{aqs.scale}</p>}

            <div className="flex items-center gap-6 mb-4">
              <div className="relative flex-shrink-0">
                <svg width="120" height="120" className="transform -rotate-90 drop-shadow-sm">
                  <circle cx="60" cy="60" r="48" fill="none" stroke="#F1F5F9" strokeWidth="10" />
                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    fill="none"
                    stroke={`url(#${gradAqs})`}
                    strokeWidth="10"
                    strokeDasharray={`${(aqsGauge10 / 10) * 301.6} 301.6`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id={gradAqs} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#7C3AED" />
                      <stop offset="100%" stopColor="#A78BFA" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[28px] font-semibold text-slate-900 tracking-tight">{aqsGauge10.toFixed(1)}</span>
                  <span className="text-[11px] text-slate-400 font-medium">out of 10</span>
                </div>
              </div>

              <div className="text-[12px] text-slate-600">
                Raw index: <strong className="text-slate-900">{aqs?.value ?? '—'}</strong>
              </div>
            </div>

            <div className="flex-1 space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {(aqs?.channels ?? []).map((ch, idx) => {
                const w = Math.round(Math.min(10, Math.max(0, ch.score)) * 10);
                const isLow = ch.score < 5;
                return (
                  <div key={`${ch.name}-${idx}`} className="flex items-center gap-2">
                    <span className="text-[12px] font-medium text-slate-700 w-28 truncate" title={ch.name}>
                      {ch.name}
                    </span>
                    <div className="flex-1 h-3.5 bg-white/40 backdrop-blur-sm rounded-full overflow-hidden border border-white/60 shadow-inner">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          isLow ? 'bg-slate-300/60' : 'bg-gradient-to-r from-[#A78BFA]/60 to-[#A78BFA]/40'
                        }`}
                        style={{ width: `${w}%` }}
                      />
                    </div>
                    <span className="text-[12px] font-semibold text-slate-900 w-10 text-right">{ch.score}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Channel Efficiency */}
        <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/70 border border-white/40 shadow-[0_8px_32px_rgba(139,92,246,0.08)]">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.02] via-transparent to-blue-500/[0.02]" />
          <div className="relative z-10 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-[15px] font-semibold text-slate-900 tracking-tight">Action Channel Efficiency</h3>
                  <div className="relative group/tooltip">
                    <Info className="w-4 h-4 text-slate-400 hover:text-[#7652b3] cursor-help transition-colors" />
                    <div className="absolute left-0 top-6 w-72 px-3 py-2.5 rounded-xl bg-slate-900/95 backdrop-blur-md border border-white/10 shadow-2xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 z-50">
                      <p className="text-[11px] text-white/90 font-medium leading-relaxed">
                        {eff?.legend ||
                          'CPA, AIS (0–100), ACE (completion %), and grade summarize cost vs action quality by channel.'}
                      </p>
                      <div className="absolute -top-1 left-4 w-2 h-2 bg-slate-900 border-l border-t border-white/10 rotate-45" />
                    </div>
                  </div>
                </div>
                <p className="text-[12px] text-slate-500 font-medium">Cost and grades by channel</p>
              </div>
            </div>

            {eff?.insight_banner ? (
              <div className="mb-4 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-50/80 to-blue-50/60 backdrop-blur-sm border border-purple-200/40 flex items-center gap-2.5">
                <Lightbulb className="w-4 h-4 text-[#7652b3] flex-shrink-0" />
                <span className="text-[12px] text-slate-700 font-medium">{eff.insight_banner}</span>
              </div>
            ) : null}

            <div className="space-y-0 mb-4 border border-slate-200/40 rounded-xl overflow-hidden backdrop-blur-sm bg-white/40 max-h-[340px] overflow-y-auto">
              {(eff?.channels ?? []).map((channel, idx) => {
                const styles = gradeStyle(channel.grade);
                const ace = channel.ace ?? 0;
                const barWidth = maxAce > 0 ? (ace / maxAce) * 100 : 0;

                return (
                  <div
                    key={`${channel.name}-${idx}`}
                    className={`transition-all duration-200 ${styles.rowBg} ${idx < (eff?.channels.length ?? 0) - 1 ? 'border-b border-slate-200/30' : ''}`}
                  >
                    <div className="px-4 py-3">
                      <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-[13px] font-semibold text-slate-900 truncate">{channel.name}</span>
                          <span className="text-[13px] font-medium text-slate-600">{channel.cpa ?? '—'}</span>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="text-[11px] font-semibold text-slate-600 tabular-nums">
                            ACE {ace}%
                          </span>
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide min-w-[2.5rem] text-center ${styles.badge}`}
                          >
                            {channel.grade ?? '—'}
                          </span>
                        </div>
                      </div>
                      <div className="h-2.5 bg-white/60 backdrop-blur-sm rounded-full overflow-hidden border border-white/80 shadow-inner">
                        <div className={`h-full rounded-full transition-all duration-700 ${styles.bar}`} style={{ width: `${barWidth}%` }} />
                      </div>
                      <div className="mt-1 text-[10px] text-slate-500">AIS {channel.ais != null ? channel.ais : '—'}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {eff?.legend && (
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{eff.legend}</p>
            )}
          </div>
        </div>
      </div>

      {insights.length > 0 && (
        <div className="mb-8 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.map((text, i) => (
              <div
                key={i}
                className="px-4 py-3.5 rounded-xl bg-gradient-to-br from-slate-50/90 to-purple-50/40 backdrop-blur-sm border border-slate-200/40 flex items-start gap-3"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-slate-200/60">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                </div>
                <p className="text-[12px] text-slate-700 font-medium leading-relaxed">{text}</p>
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
            router.push(buildInsightsMetricsUrl('/insights/act-stats', filterContext));
          }}
        >
          <BarChart3 className="w-4 h-4" />
          Explore Act Drivers
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </>
  );
}
