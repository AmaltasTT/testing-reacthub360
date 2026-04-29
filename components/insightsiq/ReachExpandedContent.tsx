'use client';

import { useRouter } from 'next/navigation';
import { AlertTriangle, BarChart3, Radio } from 'lucide-react';
import type { ReachFilterContext } from '@/components/insightsiq/PhaseCard';
import type { ReachExpandedData, ReachMetricValue } from '@/hooks/use-insightsiq';
import { ReachChannelTray } from '@/components/reach-stats/ReachChannelIcon';
import { buildInsightsMetricsUrl } from '@/lib/insights-campaign-url';

interface ReachExpandedContentProps {
  filterContext?: ReachFilterContext;
  data?: ReachExpandedData;
  isLoading?: boolean;
}

/** Parse API reach display string (e.g. "10.4K") or numeric; fallback to tooltip "Exact reach: 10393". */
function parseReachNumber(reach?: { value?: string | number | null; tooltip?: string }): number {
  if (!reach) return 0;
  if (typeof reach.value === 'number' && Number.isFinite(reach.value)) return reach.value;
  const v = reach.value;
  if (typeof v === 'string') {
    const trimmed = v.trim().toUpperCase().replace(/,/g, '');
    if (trimmed.endsWith('K')) {
      const n = parseFloat(trimmed.slice(0, -1));
      return Number.isNaN(n) ? 0 : n * 1000;
    }
    if (trimmed.endsWith('M')) {
      const n = parseFloat(trimmed.slice(0, -1));
      return Number.isNaN(n) ? 0 : n * 1_000_000;
    }
    const n = parseFloat(trimmed);
    if (!Number.isNaN(n)) return n;
  }
  const m = reach.tooltip?.match(/Exact reach:\s*([\d,]+)/i) || reach.tooltip?.match(/(\d[\d,]*)/);
  if (m) return parseInt(m[1].replace(/,/g, ''), 10) || 0;
  return 0;
}

function parseRatioPercent(m?: ReachMetricValue): number | null {
  if (!m?.available || m.value == null) return null;
  if (typeof m.value === 'number' && Number.isFinite(m.value)) return Math.min(100, Math.max(0, m.value));
  const s = String(m.value).trim().replace('%', '');
  const n = parseFloat(s);
  return Number.isNaN(n) ? null : Math.min(100, Math.max(0, n));
}

function parseMoney(m?: ReachMetricValue): number | null {
  if (!m?.available || m.value == null) return null;
  if (typeof m.value === 'number' && Number.isFinite(m.value)) return m.value;
  const s = String(m.value).replace(/[$,]/g, '');
  const n = parseFloat(s);
  return Number.isNaN(n) ? null : n;
}

function formatCpqrDisplay(m?: ReachMetricValue): string {
  if (!m?.available || m.value == null) return '—';
  return typeof m.value === 'string' ? m.value : `$${m.value}`;
}

function efficiencyBadge(cpqr: number | null, minCpqr: number | null, maxCpqr: number | null): { label: string; className: string } | null {
  if (cpqr == null || minCpqr == null || maxCpqr == null) return null;
  if (cpqr === minCpqr && minCpqr !== maxCpqr)
    return { label: 'Most efficient', className: 'px-3 py-1.5 bg-[#D1FAE5] text-[#059669] text-[13px] font-semibold rounded-lg inline-block' };
  if (cpqr === maxCpqr && minCpqr !== maxCpqr)
    return { label: 'Highest cost', className: 'px-3 py-1.5 bg-[#FEE2E2] text-[#DC2626] text-[13px] font-semibold rounded-lg inline-block' };
  return { label: 'Average', className: 'px-3 py-1.5 bg-[#F3F4F6] text-[#6B7280] text-[13px] font-semibold rounded-lg inline-block' };
}

function ReachExpandedSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 bg-slate-200/80 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80 bg-slate-200/80 rounded-xl" />
        <div className="h-80 bg-slate-200/80 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-64 bg-slate-200/80 rounded-xl" />
        <div className="h-64 bg-slate-200/80 rounded-xl" />
      </div>
    </div>
  );
}

export function ReachExpandedContent({ filterContext, data, isLoading }: ReachExpandedContentProps = {}) {
  const router = useRouter();

  if (isLoading && !data) {
    return <ReachExpandedSkeleton />;
  }

  const channels = data?.channels ?? [];
  const sortedByReach = [...channels].sort(
    (a, b) => parseReachNumber(b.reach) - parseReachNumber(a.reach)
  );
  const maxReach = sortedByReach.reduce((m, ch) => Math.max(m, parseReachNumber(ch.reach)), 0) || 1;
  const sumReach = sortedByReach.reduce((s, ch) => s + parseReachNumber(ch.reach), 0) || 1;

  const anyQualified = channels.some((ch) => ch.qualified_reach?.available && ch.qualified_reach.value != null);
  const anyCpqr = channels.some((ch) => {
    const n = parseMoney(ch.cost_per_qualified_reach);
    return n != null;
  });

  const cpqrValues = channels
    .map((ch) => parseMoney(ch.cost_per_qualified_reach))
    .filter((n): n is number => n != null);
  const minCpqr = cpqrValues.length ? Math.min(...cpqrValues) : null;
  const maxCpqr = cpqrValues.length ? Math.max(...cpqrValues) : null;

  const efficiencyRows = [...channels].sort((a, b) => {
    const ca = parseMoney(a.cost_per_qualified_reach);
    const cb = parseMoney(b.cost_per_qualified_reach);
    if (ca != null && cb != null) return ca - cb;
    if (ca != null) return -1;
    if (cb != null) return 1;
    return parseReachNumber(b.reach) - parseReachNumber(a.reach);
  });

  const topChannel = sortedByReach[0];
  const topReachLabel = topChannel?.reach?.value != null ? String(topChannel.reach.value) : '—';

  const anyRatio = channels.some((ch) => parseRatioPercent(ch.qualified_reach_ratio) != null);
  const penetrationTitle = anyRatio ? 'Qualified reach rate by channel' : 'Reach share by channel';
  const penetrationSubtitle = anyRatio
    ? '% of target audience reached (when available)'
    : 'Share of summed channel reach (channels may overlap; not deduplicated)';

  const supporting = data?.supporting_metrics;
  const device = data?.total_reach_by_device;

  return (
    <>
      {/* Summary metrics */}
      {supporting && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
          {[
            { label: 'Impressions', value: supporting.impressions },
            { label: 'Viewable impr.', value: supporting.viewable_impressions },
            { label: 'CPM', value: supporting.cpm },
            { label: 'vCPM', value: supporting.vcpm },
            { label: 'Frequency', value: data?.frequency != null ? String(data.frequency) : '—' },
            {
              label: 'Platform reach',
              value: data?.total_reach_platform?.value ?? '—',
              title: data?.total_reach_platform?.tooltip,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-[#E7E8EC]/80 bg-white/70 px-3 py-2.5"
              title={item.title}
            >
              <div className="text-[10px] font-semibold uppercase tracking-wide text-[#9CA3AF]">{item.label}</div>
              <div className="text-sm font-bold text-[#1A1D29] truncate">{item.value}</div>
            </div>
          ))}
          {device && (
            <div className="rounded-xl border border-[#E7E8EC]/80 bg-white/70 px-3 py-2.5 col-span-2 md:col-span-2 lg:col-span-2">
              <div className="text-[10px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
                Reach by device
              </div>
              <div className="text-sm font-bold text-[#1A1D29]">
                {device.value}
                <span className="font-normal text-[#6B7280] text-xs ml-2">
                  Desktop {device.desktop}% · Mobile {device.mobile}%
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {!anyQualified && channels.length > 0 && (
        <p className="text-[13px] text-amber-800 bg-amber-50 border border-amber-200/80 rounded-lg px-3 py-2 mb-4">
          Qualified reach is not available yet for these channels (ICP reach not populated). Reach bars show platform
          reach only.
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Reach vs Qualified Reach */}
        <div className="bg-gradient-to-br from-[#F5F6F8]/80 via-[#5956E9]/[0.02] to-white/60 rounded-xl p-6 border border-[#E7E8EC]/60 shadow-sm">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="font-bold text-[#1A1D29] mb-1 text-base">Reach vs Qualified Reach</h3>
              <p className="text-[13px] text-[#9CA3AF] font-normal">Compare volume and quality across channels</p>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-slate-300" />
              <span className="text-[12px] text-slate-600 font-medium">Reach</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-[#A78BFA]" />
              <span className="text-[12px] text-slate-600 font-medium">Qualified Reach</span>
            </div>
          </div>

          {channels.length === 0 ? (
            <p className="text-[13px] text-[#6B7280]">No channel reach data for this filter.</p>
          ) : (
            <div className="space-y-3.5 max-h-[420px] overflow-y-auto pr-1">
              {sortedByReach.map((ch) => {
                const r = parseReachNumber(ch.reach);
                const q =
                  ch.qualified_reach?.available && ch.qualified_reach.value != null
                    ? parseReachNumber({
                        value: ch.qualified_reach.value as string | number,
                        tooltip: ch.qualified_reach.tooltip,
                      })
                    : 0;
                const reachPct = maxReach > 0 ? (r / maxReach) * 100 : 0;
                const qualPct = maxReach > 0 ? (q / maxReach) * 100 : 0;
                const reachLabel =
                  typeof ch.reach.value === 'string' || typeof ch.reach.value === 'number'
                    ? String(ch.reach.value)
                    : '—';
                const qualLabel =
                  ch.qualified_reach?.available && ch.qualified_reach.value != null
                    ? String(ch.qualified_reach.value)
                    : '—';

                return (
                  <div key={ch.channel}>
                    <div className="flex items-center justify-between mb-1.5 gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <ReachChannelTray id="" name={ch.channel} pixelSize={32} />
                        <span className="text-[14px] font-semibold text-[#1F2937] truncate" title={ch.channel}>
                          {ch.channel}
                        </span>
                      </div>
                    </div>
                    <div
                      className="relative h-8 mb-1"
                      title={
                        [ch.reach.tooltip, ch.qualified_reach?.tooltip].filter(Boolean).join(' · ') || undefined
                      }
                    >
                      <div
                        className="absolute top-0 left-0 h-8 bg-slate-200 rounded-r-lg transition-all duration-500 min-w-[2px]"
                        style={{ width: `${Math.max(reachPct, 0.5)}%` }}
                      >
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-600 whitespace-nowrap">
                          {reachLabel}
                        </span>
                      </div>
                      {qualPct > 0 && (
                        <div
                          className="absolute top-0 left-0 h-8 bg-[#A78BFA] rounded-r-lg transition-all duration-500 flex items-center justify-end pr-2 min-w-[2px]"
                          style={{ width: `${Math.max(qualPct, 0.5)}%` }}
                        >
                          <span className="text-[11px] font-bold text-white">{qualLabel}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Channel efficiency */}
        <div className="bg-gradient-to-br from-[#F5F6F8]/80 via-[#5956E9]/[0.02] to-white/60 rounded-xl p-6 border border-[#E7E8EC]/60 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-0 mb-5">
            <div>
              <h3 className="font-bold text-[#1A1D29] mb-1 text-base">Channel efficiency</h3>
              <p className="text-[13px] text-[#9CA3AF] font-normal">
                {anyCpqr ? 'By cost per qualified reach' : 'Reach volume until CPQR is available'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-3 pb-2 border-b border-[#E7E8EC]/60 text-[11px] text-[#9CA3AF] uppercase tracking-wider font-medium">
            <div className="w-10 flex-shrink-0" />
            <div className="min-w-0 flex-1">Channel</div>
            <div className="w-20 text-center flex-shrink-0">{anyQualified ? 'Qual.' : 'Reach'}</div>
            <div className="w-16 text-center flex-shrink-0">CPQR</div>
            <div className="w-28 text-right flex-shrink-0 hidden sm:block" />
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {efficiencyRows.map((ch) => {
              const cpqr = parseMoney(ch.cost_per_qualified_reach);
              const badge = efficiencyBadge(cpqr, minCpqr, maxCpqr);
              const qualDisplay =
                ch.qualified_reach?.available && ch.qualified_reach.value != null
                  ? String(ch.qualified_reach.value)
                  : '—';
              const reachDisplay =
                typeof ch.reach.value === 'string' || typeof ch.reach.value === 'number'
                  ? String(ch.reach.value)
                  : '—';

              return (
                <div key={`eff-${ch.channel}`} className="flex items-center gap-3">
                  <ReachChannelTray id="" name={ch.channel} pixelSize={40} />
                  <div className="min-w-0 flex-1">
                    <span className="text-[15px] font-semibold text-[#1A1D29] truncate block">{ch.channel}</span>
                  </div>
                  <div className="w-20 text-center flex-shrink-0">
                    <div className="text-[15px] font-bold text-[#1A1D29]">
                      {anyQualified ? qualDisplay : reachDisplay}
                    </div>
                  </div>
                  <div
                    className="w-16 text-center flex-shrink-0 text-[15px] font-bold text-[#1A1D29]"
                    title={ch.cost_per_qualified_reach?.tooltip}
                  >
                    {formatCpqrDisplay(ch.cost_per_qualified_reach)}
                  </div>
                  <div className="w-28 flex-shrink-0 hidden sm:flex justify-end">
                    {badge ? <span className={badge.className}>{badge.label}</span> : null}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 pt-3.5 border-t border-[#E7E8EC]/60 flex flex-wrap items-center justify-between gap-2 text-[13px] text-[#6B7280] font-normal">
            <span>
              Overall qualified reach:{' '}
              <span className="font-bold text-[#1A1D29]">
                {data?.qualified_reach?.available && data.qualified_reach.value != null
                  ? String(data.qualified_reach.value)
                  : '—'}
              </span>
            </span>
            <span>
              Overall CPQR:{' '}
              <span className="font-bold text-[#1A1D29]">{formatCpqrDisplay(data?.cost_per_qualified_reach)}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Audience reach + penetration / share */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-gradient-to-br from-[#F5F6F8]/80 via-[#5956E9]/[0.02] to-white/60 rounded-xl p-6 border border-[#E7E8EC]/60 shadow-sm">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="font-bold text-[#1A1D29] mb-1 text-base">Audience reach by channel</h3>
              <p className="text-[13px] text-[#9CA3AF] font-normal">Relative reach volume</p>
            </div>
          </div>

          {sortedByReach.length === 0 ? (
            <p className="text-[13px] text-[#6B7280]">No channels to display.</p>
          ) : (
            <div className="space-y-4">
              {sortedByReach.map((ch, idx) => {
                const r = parseReachNumber(ch.reach);
                const pct = sumReach > 0 ? (r / sumReach) * 100 : 0;
                const label =
                  typeof ch.reach.value === 'string' || typeof ch.reach.value === 'number'
                    ? String(ch.reach.value)
                    : '—';
                return (
                  <div key={`aud-${ch.channel}`}>
                    <div className="flex items-center justify-between mb-1.5 gap-2">
                      <span className="text-[15px] font-semibold text-[#1F2937] truncate">{ch.channel}</span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[16px] font-bold text-[#1F2937]">{label}</span>
                        {idx === 0 && (
                          <span className="px-2.5 py-1 bg-[#EDE9FE]/60 text-[#7C3AED] text-[11px] font-semibold rounded-md border border-[#7C3AED]/10">
                            Top
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="relative h-3 bg-white/40 backdrop-blur-sm rounded-full overflow-hidden border border-white/60 shadow-inner">
                      <div
                        className="h-full bg-gradient-to-r from-[#A78BFA]/60 to-[#A78BFA]/40 rounded-full transition-all duration-700"
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-5 pt-3.5 border-t border-[#E7E8EC]/60 text-[13px] text-[#6B7280] font-normal">
            <span className="font-bold text-[#1F2937]">
              {data?.total_reach_platform?.value ?? '—'}
            </span>{' '}
            platform reach (see tooltip){' '}
            <span className="text-[#9CA3AF]">
              · {sortedByReach.length} channel{sortedByReach.length === 1 ? '' : 's'} in breakdown
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#F5F6F8]/80 via-[#5956E9]/[0.02] to-white/60 rounded-xl p-6 border border-[#E7E8EC]/60 shadow-sm">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="font-bold text-[#1A1D29] mb-1 text-base">{penetrationTitle}</h3>
              <p className="text-[13px] text-[#9CA3AF] font-normal">{penetrationSubtitle}</p>
            </div>
          </div>

          <div className="space-y-5 max-h-[360px] overflow-y-auto pr-1">
            {sortedByReach.map((ch) => {
              const ratio = parseRatioPercent(ch.qualified_reach_ratio);
              const r = parseReachNumber(ch.reach);
              const sharePct = sumReach > 0 ? (r / sumReach) * 100 : 0;
              const displayPct = ratio != null ? ratio : sharePct;
              const dash = 175.93 * (1 - displayPct / 100);

              let status = 'Scaling';
              if (ratio != null) {
                if (ratio >= 80) status = 'Saturated';
                else if (ratio < 35) status = 'Untapped';
              } else {
                if (sharePct >= 25) status = 'Large share';
                else if (sharePct < 8) status = 'Small share';
              }

              return (
                <div key={`pen-${ch.channel}`} className="flex items-center gap-4">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64" aria-hidden>
                      <circle cx="32" cy="32" r="28" fill="none" stroke="#E5E7EB" strokeWidth="6" />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        fill="none"
                        stroke="#A78BFA"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray="175.93"
                        strokeDashoffset={dash}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[13px] font-bold text-[#1F2937]">{Math.round(displayPct)}%</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[15px] font-semibold text-[#1F2937] mb-0.5 truncate">{ch.channel}</h4>
                    <p className="text-[13px] text-[#9CA3AF] font-normal">
                      {ratio != null ? `${Math.round(ratio)}% qualified reach rate` : `${Math.round(sharePct)}% of summed reach`}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="px-2.5 py-1 bg-[#EDE9FE] text-[#7C3AED] text-[11px] font-semibold rounded">
                      {status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between mt-6 pt-3.5 border-t border-[#E7E8EC]/60 text-[13px] text-[#6B7280] font-normal">
            <div>
              Overall QRR:{' '}
              <span className="font-bold text-[#1F2937]">
                {data?.qualified_reach_ratio?.available && data.qualified_reach_ratio.value != null
                  ? String(data.qualified_reach_ratio.value)
                  : '—'}
              </span>
            </div>
            <div>
              Overall CPQR:{' '}
              <span className="font-bold text-[#1F2937]">{formatCpqrDisplay(data?.cost_per_qualified_reach)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic summary (replaces static insight cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-[#E8E7FC] to-[#F5F6F8] rounded-xl p-4 border border-[#5956E9]/10 flex gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-lg bg-white/80 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-[#5956E9]" />
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-[#1A1D29] mb-1">Platform reach</p>
            <p className="text-sm text-[#707785] font-normal leading-relaxed">
              {data?.total_reach_platform?.value ?? '—'}
              {data?.total_reach_platform?.tooltip ? ` — ${data.total_reach_platform.tooltip}` : ''}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#FFF5ED] to-[#F5F6F8] rounded-xl p-4 border border-[#FFA826]/10 flex gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-lg bg-white/80 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-[#FFA826]" />
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-[#1A1D29] mb-1">Frequency</p>
            <p className="text-sm text-[#707785] font-normal leading-relaxed">
              {data?.frequency != null
                ? `${data.frequency} average frequency across the selected period.`
                : 'Frequency not available for this view.'}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#EDE9FE] to-[#F5F6F8] rounded-xl p-4 border border-[#7C3AED]/10 flex gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-lg bg-white/80 flex items-center justify-center">
              <Radio className="w-5 h-5 text-[#7C3AED]" />
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-[#1A1D29] mb-1">Top channel by reach</p>
            <p className="text-sm text-[#707785] font-normal leading-relaxed">
              {topChannel
                ? `${topChannel.channel}: ${topReachLabel} in this breakdown.`
                : 'No channel breakdown returned for the current filters.'}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-start">
        <button
          type="button"
          className="px-8 py-3.5 text-sm text-white bg-gradient-to-r from-[#5956E9] to-[#7C3AED] hover:from-[#3D1DFF] hover:to-[#5956E9] rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-semibold flex items-center gap-2.5 group"
          onClick={(e) => {
            e.stopPropagation();
            router.push(buildInsightsMetricsUrl('/insights/reach-stats', filterContext));
          }}
        >
          <BarChart3 className="w-4 h-4" />
          Explore Reach Drivers
          <svg
            className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </>
  );
}
