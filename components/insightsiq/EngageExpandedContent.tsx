'use client';

import { useId, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart3, Sparkles, Info, Users } from 'lucide-react';
import type { ReachFilterContext } from '@/components/insightsiq/PhaseCard';
import type { EngageCostChannelRow, EngageExpandedData } from '@/hooks/use-insightsiq';
import { buildInsightsMetricsUrl } from '@/lib/insights-campaign-url';

interface EngageExpandedContentProps {
  filterContext?: ReachFilterContext;
  data?: EngageExpandedData;
  isLoading?: boolean;
}

function parsePercentWidth(pct?: string): number {
  if (!pct) return 0;
  const n = parseFloat(String(pct).replace('%', ''));
  return Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 0;
}

function EngageExpandedSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-72 rounded-2xl bg-slate-200/70" />
        <div className="h-72 rounded-2xl bg-slate-200/70" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-96 rounded-2xl bg-slate-200/70" />
        <div className="h-96 rounded-2xl bg-slate-200/70" />
      </div>
    </div>
  );
}

function channelScoreBar(score: number) {
  const w = Math.round(Math.min(10, Math.max(0, score)) * 10);
  return { width: w, isLow: score < 4 };
}

function CostChannelRow({
  ch,
  maxCpe,
  maxCpqe,
}: {
  ch: EngageCostChannelRow;
  maxCpe: number;
  maxCpqe: number;
}) {
  const cpeNum = ch.cpe_value != null && Number.isFinite(ch.cpe_value) ? ch.cpe_value : null;
  const cpqeNum = ch.cpqe_value != null && Number.isFinite(ch.cpqe_value) ? ch.cpqe_value : null;
  const cpeW = maxCpe > 0 && cpeNum != null ? (cpeNum / maxCpe) * 100 : 0;
  const cpqeW = maxCpqe > 0 && cpqeNum != null ? (cpqeNum / maxCpqe) * 100 : 0;
  const gap =
    cpeNum != null && cpqeNum != null && cpeNum > 0 ? (cpqeNum / cpeNum).toFixed(1) : null;
  const cpeLabel = ch.cpe ?? (cpeNum == null ? 'N/A' : undefined) ?? '—';
  const cpqeLabel = ch.cpqe ?? '—';

  return (
    <div className="border-b border-slate-200/50 last:border-0 pb-3 last:pb-0 mb-3 last:mb-0">
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-[13px] font-semibold text-slate-900 truncate">{ch.name}</span>
        {gap != null && (
          <span className="text-[11px] font-bold text-slate-600 flex-shrink-0">{gap}× CpQE/CPE</span>
        )}
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 min-h-[28px]">
          {cpeNum != null && maxCpe > 0 ? (
            <div
              className="h-7 bg-purple-200/60 rounded-lg flex items-center justify-start px-2.5 min-w-0 transition-all duration-700"
              style={{ width: `${Math.max(cpeW, 10)}%` }}
            >
              <span className="text-[12px] font-bold text-purple-700 truncate">{cpeLabel}</span>
            </div>
          ) : (
            <span className="text-[12px] font-bold text-slate-500">{cpeLabel}</span>
          )}
          <span className="text-[11px] text-slate-500 font-medium w-10 flex-shrink-0">CPE</span>
        </div>
        <div className="flex items-center gap-2 min-h-[28px]">
          <div
            className="h-7 bg-[#A78BFA] rounded-lg flex items-center justify-start px-2.5 min-w-0 transition-all duration-700"
            style={{ width: cpqeW > 0 ? `${Math.max(cpqeW, 8)}%` : 'auto' }}
          >
            <span className="text-[12px] font-bold text-white truncate">{cpqeLabel}</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium w-10 flex-shrink-0">CpQE</span>
        </div>
      </div>
    </div>
  );
}

export function EngageExpandedContent({ filterContext, data, isLoading }: EngageExpandedContentProps = {}) {
  const router = useRouter();
  const uid = useId();

  const eis = data?.engagement_impact_score;
  const eqs = data?.engagement_quality_score;
  const rate = data?.engagement_rate_by_channel;
  const icp = data?.engaged_icp;
  const costs = data?.cost_per_engagement;
  const vanity = data?.vanity_metrics;
  const insights = data?.insights ?? [];

  const eisAvailable = eis?.available !== false && eis?.value != null && Number.isFinite(eis.value);
  const eisGauge = eisAvailable ? Math.min(10, Math.max(0, eis!.value!)) : 0;

  const eqsValue = eqs?.value != null && Number.isFinite(eqs.value) ? Math.min(10, Math.max(0, eqs.value)) : null;

  const rateChannels = rate?.channels?.length ? rate.channels : [];

  const costStats = useMemo(() => {
    const rows = costs?.channels ?? [];
    const cpeVals = rows
      .map((c) => c.cpe_value)
      .filter((n): n is number => n != null && Number.isFinite(n) && n > 0);
    const cpqeVals = rows
      .map((c) => c.cpqe_value)
      .filter((n): n is number => n != null && Number.isFinite(n) && n > 0);
    const maxCpe = cpeVals.length ? Math.max(...cpeVals) : 0;
    const maxCpqe = cpqeVals.length ? Math.max(...cpqeVals) : 0;
    const sorted = [...rows].sort((a, b) => {
      const aq = a.cpqe_value ?? 999;
      const bq = b.cpqe_value ?? 999;
      return aq - bq;
    });
    return { rows: sorted, maxCpe, maxCpqe };
  }, [costs?.channels]);

  if (isLoading && !data) {
    return <EngageExpandedSkeleton />;
  }

  const eisChannels =
    eis?.channels?.map((c) => {
      const { width, isLow } = channelScoreBar(c.score);
      return { name: c.name, score: c.score, width, isLow };
    }) ?? [];

  const eqsChannels =
    eqs?.channels?.map((c) => {
      const { width, isLow } = channelScoreBar(c.score);
      return { name: c.name, score: c.score, width, isLow };
    }) ?? [];

  const gradientEis = `gaugeEis-${uid}`;
  const gradientEqs = `gaugeEqs-${uid}`;

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Engagement Impact Score */}
        <div className="relative group overflow-hidden rounded-2xl backdrop-blur-xl bg-white/70 border border-white/40 shadow-[0_8px_32px_rgba(139,92,246,0.08)]">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.03] via-transparent to-blue-500/[0.02]" />
          <div className="relative z-10 p-5">
            <div className="flex items-start justify-between mb-5">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-[15px] font-semibold text-slate-900 tracking-tight">
                    Engagement Impact Score
                  </h3>
                  <span className="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-[10px] font-bold text-purple-700 uppercase tracking-wide">
                    OMTM
                  </span>
                </div>
                <p className="text-[12px] text-slate-500 font-medium">Overall engagement effectiveness</p>
              </div>
            </div>

            {!eisAvailable ? (
              <div className="flex items-start gap-2 rounded-xl border border-amber-200/60 bg-amber-50/80 px-3 py-3 text-[13px] text-amber-900">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{eis?.note || eis?.trend || 'Engagement impact score is not available for this period.'}</span>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <div className="relative flex-shrink-0">
                  <svg width="120" height="120" className="transform -rotate-90 drop-shadow-sm">
                    <circle cx="60" cy="60" r="48" fill="none" stroke="#F1F5F9" strokeWidth="10" />
                    <circle
                      cx="60"
                      cy="60"
                      r="48"
                      fill="none"
                      stroke={`url(#${gradientEis})`}
                      strokeWidth="10"
                      strokeDasharray={`${(eisGauge / 10) * 301.6} 301.6`}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id={gradientEis} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#7C3AED" />
                        <stop offset="100%" stopColor="#A78BFA" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[32px] font-semibold text-slate-900 tracking-tight">{eis!.value}</span>
                    <span className="text-[11px] text-slate-400 font-medium">out of 10</span>
                  </div>
                </div>

                <div className="flex-1 space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {eisChannels.length === 0 ? (
                    <p className="text-[12px] text-slate-500">No channel breakdown.</p>
                  ) : (
                    eisChannels.map((channel, idx) => (
                      <div key={`${channel.name}-${idx}`} className="flex items-center gap-2">
                        <span className="text-[12px] font-medium text-slate-700 w-24 sm:w-28 truncate" title={channel.name}>
                          {channel.name}
                        </span>
                        <div className="flex-1 h-3 bg-white/40 backdrop-blur-sm rounded-full overflow-hidden border border-white/60 shadow-inner">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              channel.isLow
                                ? 'bg-slate-300/60'
                                : 'bg-gradient-to-r from-[#A78BFA]/60 to-[#A78BFA]/40'
                            }`}
                            style={{ width: `${channel.width}%` }}
                          />
                        </div>
                        <span className="text-[12px] font-semibold text-slate-900 w-7 text-right">{channel.score}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {eisAvailable && (
              <div className="mt-4 pt-3 border-t border-slate-200/60">
                <p className="text-[12px] text-slate-600">
                  <span className="font-medium text-slate-800">{eis?.trend || 'Trend'}</span>
                  {eis?.value_raw_0_100 != null && (
                    <span className="text-slate-500"> · Raw index {eis.value_raw_0_100}</span>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Engagement Quality Score */}
        <div className="relative group overflow-hidden rounded-2xl backdrop-blur-xl bg-white/70 border border-white/40 shadow-[0_8px_32px_rgba(139,92,246,0.08)]">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] via-transparent to-purple-500/[0.02]" />
          <div className="relative z-10 p-5">
            <div className="flex items-start justify-between mb-5">
              <div className="flex-1">
                <h3 className="text-[15px] font-semibold text-slate-900 mb-1 tracking-tight">
                  Engagement Quality Score
                </h3>
                <p className="text-[12px] text-slate-500 font-medium">Depth & quality composite</p>
              </div>
            </div>

            {eqsValue == null ? (
              <div className="flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-[13px] text-slate-700">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{eqs?.note || 'Engagement quality score is not available.'}</span>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <div className="relative flex-shrink-0">
                  <svg width="120" height="120" className="transform -rotate-90 drop-shadow-sm">
                    <circle cx="60" cy="60" r="48" fill="none" stroke="#F1F5F9" strokeWidth="10" />
                    <circle
                      cx="60"
                      cy="60"
                      r="48"
                      fill="none"
                      stroke={`url(#${gradientEqs})`}
                      strokeWidth="10"
                      strokeDasharray={`${(eqsValue / 10) * 301.6} 301.6`}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id={gradientEqs} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#7C3AED" />
                        <stop offset="100%" stopColor="#A78BFA" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[32px] font-semibold text-slate-900 tracking-tight">{eqsValue}</span>
                    <span className="text-[11px] text-slate-400 font-medium">out of 10</span>
                  </div>
                </div>

                <div className="flex-1 space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {eqsChannels.length === 0 ? (
                    <p className="text-[12px] text-slate-500">No channel breakdown.</p>
                  ) : (
                    eqsChannels.map((channel, idx) => (
                      <div key={`${channel.name}-${idx}`} className="flex items-center gap-2">
                        <span className="text-[12px] font-medium text-slate-700 w-24 sm:w-28 truncate" title={channel.name}>
                          {channel.name}
                        </span>
                        <div className="flex-1 h-3 bg-white/40 backdrop-blur-sm rounded-full overflow-hidden border border-white/60 shadow-inner">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              channel.isLow
                                ? 'bg-slate-300/60'
                                : 'bg-gradient-to-r from-[#A78BFA]/60 to-[#A78BFA]/40'
                            }`}
                            style={{ width: `${channel.width}%` }}
                          />
                        </div>
                        <span className="text-[12px] font-semibold text-slate-900 w-7 text-right">{channel.score}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {eqs?.value_raw_model != null && (
              <p className="mt-2 text-[11px] text-slate-400">Model raw: {eqs.value_raw_model}</p>
            )}

            <div className="mt-4 pt-3 border-t border-slate-200/60">
              <div className="grid grid-cols-5 gap-2 sm:gap-3">
                {[
                  { label: 'Likes', value: vanity?.likes },
                  { label: 'Saves', value: vanity?.saves },
                  { label: 'Comments', value: vanity?.comments },
                  { label: 'Shares', value: vanity?.shares },
                  { label: 'Video 50%+', value: vanity?.video_views },
                ].map((metric) => (
                  <div key={metric.label}>
                    <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wide mb-0.5 truncate">
                      {metric.label}
                    </div>
                    <div className="text-[13px] font-semibold text-slate-900">{metric.value ?? '—'}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Engagement rate + Engaged ICP */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/70 border border-white/40 shadow-[0_8px_32px_rgba(139,92,246,0.08)] p-5">
          <h3 className="text-[15px] font-semibold text-slate-900 mb-1 tracking-tight">
            Engagement rate by channel
          </h3>
          <p className="text-[12px] text-slate-500 font-medium mb-4">Engagement actions relative to impressions</p>

          {rateChannels.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {rateChannels.map((c, idx) => (
                <div
                  key={`${c.name}-${idx}`}
                  className="grid grid-cols-12 gap-2 items-center px-2 py-1.5 rounded-lg hover:bg-slate-50/50"
                >
                  <div className="col-span-4 text-[12px] font-medium text-slate-900 truncate" title={c.name}>
                    {c.name}
                  </div>
                  <div className="col-span-5">
                    <div className="h-5 bg-slate-100/80 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#C4B5FD] to-[#A78BFA]"
                        style={{ width: `${c.width ?? 50}%` }}
                      />
                    </div>
                  </div>
                  <div className="col-span-3 text-right text-[13px] font-semibold text-slate-900">{c.value}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-amber-200/60 bg-amber-50/80 px-3 py-3 text-[13px] text-amber-950 mb-6">
              {rate?.average || 'Engagement rate by channel is not available for this selection.'}
            </div>
          )}

          <div className="mt-6 pt-5 border-t border-slate-200/60">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-purple-600" />
              <h3 className="text-[15px] font-semibold text-slate-900 tracking-tight">Engaged ICP</h3>
            </div>
            <p className="text-[12px] text-slate-500 mb-3">High-intent engaged audience by channel</p>

            <div className="mb-4 p-3 rounded-xl bg-gradient-to-br from-purple-50/80 to-blue-50/50 border border-purple-100/50">
              <div className="text-[28px] font-semibold text-slate-900 leading-none">{icp?.total ?? '—'}</div>
              <p className="text-[12px] text-slate-500 mt-1">{icp?.trend ?? ''}</p>
              {icp?.note ? <p className="text-[11px] text-slate-400 mt-1">{icp.note}</p> : null}
            </div>

            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {(icp?.channels ?? []).length === 0 ? (
                <p className="text-[12px] text-slate-500">No engaged ICP breakdown.</p>
              ) : (
                icp!.channels.map((row, idx) => {
                  const w = parsePercentWidth(row.percentage);
                  return (
                    <div key={`${row.name}-${idx}`}>
                      <div className="flex items-center justify-between mb-1 gap-2">
                        <span className="text-[12px] font-medium text-slate-800 truncate">{row.name}</span>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-[13px] font-bold text-slate-900">{row.value}</span>
                          {row.percentage && (
                            <span className="text-[11px] text-slate-500">{row.percentage}</span>
                          )}
                        </div>
                      </div>
                      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#A78BFA]/70 to-[#A78BFA]/40 rounded-full"
                          style={{ width: `${w}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Cost per engagement */}
        <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/70 border border-white/40 shadow-[0_8px_32px_rgba(139,92,246,0.08)] p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-[15px] font-semibold text-slate-900 mb-1 tracking-tight">
                Cost per engagement
              </h3>
              <p className="text-[12px] text-slate-500 font-medium">CPE vs CpQE by channel</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-4 pb-3 border-b border-slate-200/50 text-[12px] text-slate-600">
            <span>
              Avg CPE: <strong className="text-slate-900">{costs?.average ?? '—'}</strong>
            </span>
            {costs?.cpqe_average != null && (
              <span>
                Avg CpQE: <strong className="text-slate-900">{costs.cpqe_average}</strong>
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 mb-3 text-[11px] text-slate-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-purple-200/60" />
              CPE
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-[#A78BFA]" />
              CpQE
            </div>
          </div>

          {costs?.note ? <p className="text-[12px] text-slate-500 mb-3">{costs.note}</p> : null}

          <div className="max-h-[420px] overflow-y-auto pr-1 space-y-1">
            {costStats.rows.length === 0 ? (
              <p className="text-[12px] text-slate-500">No cost breakdown returned.</p>
            ) : (
              costStats.rows.map((ch) => (
                <CostChannelRow key={ch.name} ch={ch} maxCpe={costStats.maxCpe} maxCpqe={costStats.maxCpqe} />
              ))
            )}
          </div>
        </div>
      </div>

      {insights.length > 0 && (
        <div className="mb-8 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insights.slice(0, 6).map((text, i) => (
              <div
                key={i}
                className="px-4 py-3.5 rounded-xl bg-gradient-to-br from-slate-50/90 to-slate-100/50 border border-slate-200/40 flex items-start gap-3"
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
            router.push(buildInsightsMetricsUrl('/insights/engage-stats', filterContext));
          }}
        >
          <BarChart3 className="w-4 h-4" />
          Explore Engage Drivers
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </>
  );
}
