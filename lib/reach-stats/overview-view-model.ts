"use client";

import type {
  OverviewFrequencyResponse,
  OverviewOverlapResponse,
  OverviewSummaryResponse,
  OverviewTrendsResponse,
} from "@/hooks/use-reach-overview";
import {
  benchmarkBand,
  cpqrBenchmark,
  enrichedChannels,
  FREQ_INSIGHTS,
  freqWaste,
  OVERLAP_DATA,
  totalFreqWaste,
  totalOverlapWaste,
  totals,
  trendCpqr,
  trendDays,
  trendQR,
  trendQRR,
  trendReach,
} from "@/lib/reach-stats/data";

export interface ReachOverviewTotalsViewModel {
  reach: number;
  qr: number;
  spend: number;
  qrr: number;
  avgCpqr: number;
  apr: number;
  qrTarget: number | null;
  qrrTarget: number | null;
  avgCpqrTarget: number | null;
  aprTarget: number | null;
  qrDelta: string;
  cpqrDelta: string;
  aprDelta: string;
  qrrDelta: string;
}

export interface ReachOverviewChannelViewModel {
  id: string;
  name: string;
  icon: string;
  color: string;
  logo?: string | null;
  type: string;
  subtype: "paid" | "organic";
  reach: number;
  qr: number;
  spend: number;
  viewability: number;
  penetration: number;
  campaigns: number;
  trend: number;
  qrr: number;
  cpqr: number;
  account: string;
  accountId: string;
  accountLabel: string;
  idLabel: string;
  status?: string;
}

export interface ReachOverviewSummaryViewModel {
  totals: ReachOverviewTotalsViewModel;
  channels: ReachOverviewChannelViewModel[];
}

export interface ReachOverviewTrendsViewModel {
  periods: string[];
  reach: number[];
  qr: number[];
  cpqr: number[];
  qrr: number[];
  cpqrBenchmark: number[];
  benchmarkBand: {
    min: number;
    max: number;
  };
}

export interface ReachOverviewOverlapItemViewModel {
  pair: [string, string];
  pairColors: [string, string];
  pairIcons: [string, string];
  overlap: number;
  severity: string;
  wastedSpend: number;
  uniqueA: number;
  uniqueB: number;
  shared: number;
  totalCombined: number;
  insight: string;
  action: string;
  trend: number[];
  trendDays: string[];
}

export interface ReachOverviewOverlapViewModel {
  overlaps: ReachOverviewOverlapItemViewModel[];
  totalOverlapWaste: number;
}

export interface ReachOverviewFrequencyCurvePointViewModel {
  freq: number;
  qrrLift: number;
  cpmAt: number;
}

export interface ReachOverviewFrequencyInsightViewModel {
  verdict: string;
  detail: string;
}

export interface ReachOverviewFrequencyItemViewModel {
  id: string;
  name: string;
  icon: string;
  color: string;
  impressions: number;
  uniqueReach: number;
  avgFreq: number;
  optimalFreq: number;
  cpm: number;
  cpqr: number;
  excessFreq: number;
  excessImpressions: number;
  wastedSpend: number;
  status: string;
  freqCurve: ReachOverviewFrequencyCurvePointViewModel[];
  insight: ReachOverviewFrequencyInsightViewModel;
}

export interface ReachOverviewFrequencyViewModel {
  channels: ReachOverviewFrequencyItemViewModel[];
  totalFreqWaste: number;
}

const DEMO_DELTAS = {
  qrDelta: "+14%",
  cpqrDelta: "-5%",
  aprDelta: "+3pts",
  qrrDelta: "+5pts",
};

function normalizeSummaryChannel(
  channel: OverviewSummaryResponse["channels"][number]
): ReachOverviewChannelViewModel {
  return {
    id: channel.id,
    name: channel.name,
    icon: channel.icon,
    color: channel.color,
    logo: channel.logo ?? null,
    type: channel.type,
    subtype: channel.subtype,
    reach: channel.reach,
    qr: channel.qr,
    spend: channel.spend,
    viewability: channel.viewability,
    penetration: channel.penetration,
    campaigns: channel.campaigns,
    trend: channel.trend,
    qrr: channel.qrr,
    cpqr: channel.cpqr,
    account: channel.account,
    accountId: channel.account_id,
    accountLabel: channel.account_label,
    idLabel: channel.id_label,
    status: channel.status,
  };
}

export function normalizeOverviewSummary(
  response: OverviewSummaryResponse
): ReachOverviewSummaryViewModel {
  return {
    totals: {
      reach: response.totals.reach,
      qr: response.totals.qr,
      spend: response.totals.spend,
      qrr: response.totals.qrr,
      avgCpqr: response.totals.avg_cpqr,
      apr: response.totals.apr,
      qrTarget: response.totals.qr_target,
      qrrTarget: response.totals.qrr_target,
      avgCpqrTarget: response.totals.avg_cpqr_target,
      aprTarget: response.totals.apr_target,
      qrDelta: response.totals.qr_delta,
      cpqrDelta: response.totals.cpqr_delta,
      aprDelta: response.totals.apr_delta,
      qrrDelta: response.totals.qrr_delta,
    },
    channels: response.channels.map(normalizeSummaryChannel),
  };
}

export function normalizeOverviewTrends(
  response: OverviewTrendsResponse
): ReachOverviewTrendsViewModel {
  return {
    periods: response.periods,
    reach: response.reach,
    qr: response.qr,
    cpqr: response.cpqr,
    qrr: response.qrr,
    cpqrBenchmark: response.cpqr_benchmark,
    benchmarkBand: response.benchmark_band,
  };
}

export function normalizeOverviewOverlap(
  response: OverviewOverlapResponse
): ReachOverviewOverlapViewModel {
  return {
    overlaps: response.overlaps.map((item) => ({
      pair: item.pair,
      pairColors: item.pair_colors,
      pairIcons: item.pair_icons,
      overlap: item.overlap,
      severity: item.severity,
      wastedSpend: item.wasted_spend,
      uniqueA: item.unique_a,
      uniqueB: item.unique_b,
      shared: item.shared,
      totalCombined: item.total_combined,
      insight: item.insight,
      action: item.action,
      trend: item.trend,
      trendDays: item.trend_days,
    })),
    totalOverlapWaste: response.total_overlap_waste,
  };
}

export function normalizeOverviewFrequency(
  response: OverviewFrequencyResponse
): ReachOverviewFrequencyViewModel {
  return {
    channels: response.channels.map((channel) => ({
      id: channel.id,
      name: channel.name,
      icon: channel.icon,
      color: channel.color,
      impressions: channel.impressions,
      uniqueReach: channel.unique_reach,
      avgFreq: channel.avg_freq,
      optimalFreq: channel.optimal_freq,
      cpm: channel.cpm,
      cpqr: channel.cpqr,
      excessFreq: channel.excess_freq,
      excessImpressions: channel.excess_impressions,
      wastedSpend: channel.wasted_spend,
      status: channel.status,
      freqCurve: channel.freq_curve.map((point) => ({
        freq: point.freq,
        qrrLift: point.qrr_lift,
        cpmAt: point.cpm_at,
      })),
      insight: channel.insight,
    })),
    totalFreqWaste: response.total_freq_waste,
  };
}

export function getDemoOverviewSummaryViewModel(): ReachOverviewSummaryViewModel {
  return {
    totals: {
      reach: totals.reach,
      qr: totals.qr,
      spend: totals.spend,
      qrr: totals.qrr,
      avgCpqr: totals.avgCpqr,
      apr: totals.apr,
      qrTarget: totals.qrTarget,
      qrrTarget: totals.qrrTarget,
      avgCpqrTarget: totals.avgCpqrTarget,
      aprTarget: totals.aprTarget,
      ...DEMO_DELTAS,
    },
    channels: enrichedChannels.map((channel) => ({
      id: channel.id,
      name: channel.name,
      icon: channel.icon,
      color: channel.color,
      logo: null,
      type: channel.type,
      subtype: channel.subtype,
      reach: channel.reach,
      qr: channel.qr,
      spend: channel.spend,
      viewability: channel.viewability,
      penetration: channel.penetration,
      campaigns: channel.campaigns,
      trend: channel.trend,
      qrr: channel.qrr ?? 0,
      cpqr: channel.cpqr ?? 0,
      account: channel.account,
      accountId: channel.accountId,
      accountLabel: channel.accountLabel,
      idLabel: channel.idLabel,
    })),
  };
}

export function getDemoOverviewTrendsViewModel(): ReachOverviewTrendsViewModel {
  return {
    periods: trendDays,
    reach: trendReach,
    qr: trendQR,
    cpqr: trendCpqr,
    qrr: trendQRR,
    cpqrBenchmark,
    benchmarkBand,
  };
}

export function getDemoOverviewOverlapViewModel(): ReachOverviewOverlapViewModel {
  return {
    overlaps: OVERLAP_DATA.map((item) => ({
      pair: item.pair,
      pairColors: item.pairColors,
      pairIcons: item.pairIcons,
      overlap: item.overlap,
      severity: item.severity,
      wastedSpend: item.wastedSpend,
      uniqueA: item.uniqueA,
      uniqueB: item.uniqueB,
      shared: item.shared,
      totalCombined: item.totalCombined,
      insight: item.insight,
      action: item.action,
      trend: item.trend,
      trendDays: item.trendDays,
    })),
    totalOverlapWaste,
  };
}

export function getDemoOverviewFrequencyViewModel(): ReachOverviewFrequencyViewModel {
  return {
    channels: freqWaste.map((channel) => ({
      id: channel.id,
      name: channel.name,
      icon: channel.icon,
      color: channel.color,
      impressions: channel.impressions,
      uniqueReach: channel.uniqueReach,
      avgFreq: channel.avgFreq,
      optimalFreq: channel.optimalFreq,
      cpm: channel.cpm,
      cpqr: channel.cpqr,
      excessFreq: channel.excessFreq ?? 0,
      excessImpressions: channel.excessImpressions ?? 0,
      wastedSpend: channel.wastedSpend ?? 0,
      status: channel.status ?? "optimal",
      freqCurve: channel.freqCurve.map((point) => ({
        freq: point.freq,
        qrrLift: point.qrrLift,
        cpmAt: point.cpmAt,
      })),
      insight: FREQ_INSIGHTS[channel.id] ?? {
        verdict: "Watch",
        detail: "Monitor this channel for incremental efficiency changes.",
      },
    })),
    totalFreqWaste,
  };
}
