import type {
  ChannelFunnelResponse,
  ChannelReachResponse,
  ChannelEngageResponse,
  ChannelActResponse,
  ChannelConvertResponse,
  ChannelTalkResponse,
  ChannelCampaignsResponse,
  ChannelBudgetPacingResponse,
  ChannelCrossCampaignResponse,
  ChannelRecommendationsResponse,
  TimeSeriesPoint,
  MetricValue,
} from "@/hooks/use-channel-drilldown";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatEpochDate(epochStr: string): string {
  const d = new Date(Number(epochStr) * 1000);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function convertTimeSeries(points: TimeSeriesPoint[]): TimeSeriesPoint[] {
  return points.map((pt) => ({
    ...pt,
    date: /^\d{10,}$/.test(String(pt.date)) ? formatEpochDate(String(pt.date)) : String(pt.date),
  }));
}

/** Map channel_engage timeSeries (often only `engagementRate` %) into chart keys the UI expects. */
function normalizeEngageTimeSeriesPoints(points: TimeSeriesPoint[]): TimeSeriesPoint[] {
  return points.map((pt) => {
    const p = pt as Record<string, unknown>;
    const er =
      typeof p.engagementRate === "number"
        ? p.engagementRate
        : typeof p.engagement_rate === "number"
          ? p.engagement_rate
          : undefined;
    const next: Record<string, unknown> = { ...p };
    if (er != null) {
      next.engagementRate = er;
      // Summary EQS is 0–1; approximate daily EQS from engagement % when per-day eqs is absent
      if (typeof p.eqs !== "number") next.eqs = er / 100;
      // ESR card uses %; align daily series when esr not provided
      if (typeof p.esr !== "number") next.esr = er;
    }
    return next as TimeSeriesPoint;
  });
}

function fmtValue(mv: MetricValue | null | undefined): string {
  if (mv == null) return "—";
  if (mv.formatted != null) return mv.formatted;
  if (mv.value != null) return String(mv.value);
  return "—";
}

function metricNumber(mv: MetricValue | null | undefined): number | null {
  if (mv == null) return null;
  if (typeof mv.value === "number" && Number.isFinite(mv.value)) return mv.value;
  // Some endpoints only return a formatted string; try to parse a number from it.
  if (typeof mv.formatted === "string") {
    const s = mv.formatted.trim();
    const upper = s.toUpperCase();
    if (upper.endsWith("K")) {
      const n = parseFloat(upper.slice(0, -1));
      return Number.isFinite(n) ? n * 1000 : null;
    }
    if (upper.endsWith("M")) {
      const n = parseFloat(upper.slice(0, -1));
      return Number.isFinite(n) ? n * 1_000_000 : null;
    }
    const n = parseFloat(s.replace(/[^0-9.-]+/g, ""));
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function deltaArrow(mv: MetricValue | null | undefined): string {
  if (mv == null) return "—";
  const df = mv.delta_formatted ?? "";
  if (mv.delta > 0) return `↑ ${df}`;
  if (mv.delta < 0) return `↓ ${df.replace("-", "")}`;
  return df || "—";
}

function trendColor(trend: "growing" | "declining" | "stable"): string {
  if (trend === "growing") return "#059669";
  if (trend === "declining") return "#E11D48";
  return "#6e6e73";
}

// ─── Funnel ──────────────────────────────────────────────────────────────────

export interface TransformedFunnelPhase {
  phase: string;
  value: string;
  sub: string;
  delta: string;
  convRate?: string;
  convRateWarning?: boolean;
}

export interface TransformedFunnel {
  channel: ChannelFunnelResponse["channel"];
  phases: TransformedFunnelPhase[];
}

function formatFunnelScalar(v: string | number | null | undefined): string {
  if (v === null || v === undefined) return "N/A";
  if (typeof v === "number") return Number.isFinite(v) ? String(v) : "N/A";
  return v;
}

export function transformFunnelData(api: ChannelFunnelResponse): TransformedFunnel {
  return {
    channel: api.channel,
    phases: (api.phases ?? []).map((p) => {
      const head = p.primary_metrics?.[0];
      const rawMain = head?.value;
      const mainUnavailable = head?.available === false;
      const mainValue =
        mainUnavailable || rawMain === null || rawMain === undefined
          ? "—"
          : typeof rawMain === "number"
            ? String(rawMain)
            : rawMain;
      const mainDelta = head?.delta ?? "—";

      const subFromPrimary = (p.primary_metrics ?? [])
        .slice(1)
        .map((m) => `${formatFunnelScalar(m.value)} ${m.label}`);

      const subFromSupporting = (p.supporting_metrics ?? []).map(
        (s) => `${formatFunnelScalar(s.value)} ${s.label}`
      );

      const sub = [...subFromPrimary, ...subFromSupporting].join(" · ") || p.status_subtitle;

      return {
        phase: p.name,
        value: mainValue,
        sub,
        delta: mainDelta,
      };
    }),
  };
}

// ─── Reach ───────────────────────────────────────────────────────────────────

export interface TransformedReach {
  summary: {
    totalReach: string;
    totalReachValue?: number | null;
    qualifiedReach: string;
    qrr: string;
    cpqr: string;
    frequency: string;
    apr: string;
    aprValue?: number | null;
    impressions: string;
    cpm: string;
    vcpm: string;
    spend: string;
    viewableImpressions: string;
    totalReachDelta: string;
    qrrDelta: string;
    cpqrDelta: string;
    frequencyDelta: string;
  };
  timeSeries: TimeSeriesPoint[];
  deviceBreakdown: Array<{ device: string; value: number; percentage: number }>;
  placements: ChannelReachResponse["placements"];
  insights: Array<{ key: string; title: string; body: string }>;
  recommendations?: ChannelReachResponse["recommendations"];
}

export function transformReachData(api: ChannelReachResponse): TransformedReach {
  // Convert deviceBreakdown from object { desktop: {value, pct}, mobile: {value, pct} }
  // to array [{ device, value, percentage }]
  const deviceArr: TransformedReach["deviceBreakdown"] = [];
  if (api.deviceBreakdown) {
    for (const [device, entry] of Object.entries(api.deviceBreakdown)) {
      if (entry && typeof entry === "object") {
        deviceArr.push({ device, value: entry.value ?? 0, percentage: entry.pct ?? 0 });
      }
    }
  }

  // Convert insights from object { key: { title, body } } to array [{ key, title, body }]
  const insightsArr: TransformedReach["insights"] = [];
  if (api.insights && typeof api.insights === "object" && !Array.isArray(api.insights)) {
    for (const [key, val] of Object.entries(api.insights)) {
      if (val && typeof val === "object") {
        insightsArr.push({ key, title: val.title ?? "", body: val.body ?? "" });
      }
    }
  } else if (Array.isArray(api.insights)) {
    insightsArr.push(...api.insights);
  }

  return {
    summary: {
      totalReach: fmtValue(api.summary.totalReach),
      totalReachValue: metricNumber(api.summary.totalReach),
      qualifiedReach: fmtValue(api.summary.qualifiedReach),
      qrr: fmtValue(api.summary.qrr),
      cpqr: fmtValue(api.summary.cpqr),
      frequency: fmtValue(api.summary.frequency),
      apr: fmtValue(api.summary.apr),
      aprValue: metricNumber(api.summary.apr),
      impressions: fmtValue(api.summary.impressions),
      cpm: fmtValue(api.summary.cpm),
      vcpm: fmtValue(api.summary.vcpm),
      spend: fmtValue(api.summary.spend),
      viewableImpressions: fmtValue(api.summary.viewableImpressions),
      totalReachDelta: deltaArrow(api.summary.totalReach),
      qrrDelta: deltaArrow(api.summary.qrr),
      cpqrDelta: deltaArrow(api.summary.cpqr),
      frequencyDelta: deltaArrow(api.summary.frequency),
    },
    timeSeries: convertTimeSeries(api.timeSeries ?? []),
    deviceBreakdown: deviceArr,
    placements: api.placements ?? [],
    insights: insightsArr,
    recommendations: api.recommendations,
  };
}

// ─── Engage ──────────────────────────────────────────────────────────────────

export interface TransformedEngage {
  summary: {
    eis: string;
    eisDelta: string;
    eqs: string;
    eqsDelta: string;
    engagementRate: string;
    engagementRateDelta: string;
    cpe: string;
    cpeDelta: string;
    cpqe: string;
    cpqeDelta: string;
    totalEngagements: string;
    engagedIcp: string;
    esr: string;
  };
  vanityMetrics: {
    likes: string;
    saves: string;
    comments: string;
    shares: string;
    videoViews: string;
  };
  signalBreakdown: Array<{
    action: string;
    current: number;
    previous: number;
    delta_formatted: string;
    trend: "growing" | "declining" | "stable";
    trendColor: string;
  }>;
  peakEngagement: Array<{ window: string; score: number }>;
  timeSeries: TimeSeriesPoint[];
  insights: Array<{ key: string; title: string; body: string }>;
}

export function transformEngageData(api: ChannelEngageResponse): TransformedEngage {
  const s = api.summary ?? {};
  const v = api.vanityMetrics ?? {};
  const videoVanity = v.videoViews ?? v.video_views;

  // Convert insights object to array if needed
  const insightsArr: TransformedEngage["insights"] = [];
  if (api.insights && typeof api.insights === "object" && !Array.isArray(api.insights)) {
    for (const [key, val] of Object.entries(api.insights)) {
      if (val && typeof val === "object") {
        insightsArr.push({ key, title: val.title ?? "", body: val.body ?? "" });
      }
    }
  } else if (Array.isArray(api.insights)) {
    insightsArr.push(...api.insights);
  }

  const rawSeries = api.timeSeries ?? [];
  const timeSeries = convertTimeSeries(normalizeEngageTimeSeriesPoints(rawSeries));

  return {
    summary: {
      eis: fmtValue(s.eis),
      eisDelta: deltaArrow(s.eis),
      eqs: fmtValue(s.eqs),
      eqsDelta: deltaArrow(s.eqs),
      engagementRate: fmtValue(s.engagementRate),
      engagementRateDelta: deltaArrow(s.engagementRate),
      cpe: fmtValue(s.cpe),
      cpeDelta: deltaArrow(s.cpe),
      cpqe: fmtValue(s.cpqe),
      cpqeDelta: deltaArrow(s.cpqe),
      totalEngagements: fmtValue(s.totalEngagements),
      engagedIcp: fmtValue(s.engagedIcp),
      esr: api.esr != null ? String(api.esr) : "—",
    },
    vanityMetrics: {
      likes: String(v.likes?.value ?? 0),
      saves: String(v.saves?.value ?? 0),
      comments: String(v.comments?.value ?? 0),
      shares: String(v.shares?.value ?? 0),
      videoViews: String(videoVanity?.value ?? 0),
    },
    signalBreakdown: (api.signalBreakdown ?? []).map((sig) => ({
      action: sig.action,
      current: sig.current,
      previous: sig.previous,
      delta_formatted: sig.delta_formatted,
      trend: sig.trend,
      trendColor: trendColor(sig.trend),
    })),
    peakEngagement: api.peakWindows ?? [],
    timeSeries,
    insights: insightsArr,
  };
}

// ─── Act ─────────────────────────────────────────────────────────────────────

export interface TransformedAct {
  summary: {
    ais: string;
    aisDelta: string;
    aqs: string;
    aqsDelta: string;
    acr: string;
    acrDelta: string;
    cpa: string;
    cpaDelta: string;
    leads: string;
    leadsDelta: string;
    qualifiedLeads: string;
    qualifiedLeadsDelta: string;
    leadFormOpens: string;
    eventRegistrations: string;
  };
  campaignBreakdown: Array<{
    name: string;
    actions: string;
    acr: string;
    cpa: string;
    aqs: string;
  }>;
  timeSeries: TimeSeriesPoint[];
  insights: Array<{ key: string; title: string; body: string }>;
}

export function transformActData(api: ChannelActResponse): TransformedAct {
  const insightsArr: TransformedAct["insights"] = [];
  if (api.insights && typeof api.insights === "object" && !Array.isArray(api.insights)) {
    for (const [key, val] of Object.entries(api.insights)) {
      if (val && typeof val === "object") {
        insightsArr.push({ key, title: val.title ?? "", body: val.body ?? "" });
      }
    }
  }

  return {
    summary: {
      ais: fmtValue(api.summary.ais),
      aisDelta: deltaArrow(api.summary.ais),
      aqs: fmtValue(api.summary.aqs),
      aqsDelta: deltaArrow(api.summary.aqs),
      acr: fmtValue(api.summary.acr),
      acrDelta: deltaArrow(api.summary.acr),
      cpa: fmtValue(api.summary.cpa),
      cpaDelta: deltaArrow(api.summary.cpa),
      leads: fmtValue(api.summary.leads),
      leadsDelta: deltaArrow(api.summary.leads),
      qualifiedLeads: fmtValue(api.summary.qualifiedLeads),
      qualifiedLeadsDelta: deltaArrow(api.summary.qualifiedLeads),
      leadFormOpens: String(api.summary.leadFormOpens?.value ?? 0),
      eventRegistrations: String(api.summary.eventRegistrations?.value ?? 0),
    },
    campaignBreakdown: (api.campaignBreakdown ?? []).map((c) => ({
      name: c.name,
      actions: fmtValue(c.actions),
      acr: fmtValue(c.acr),
      cpa: fmtValue(c.cpa),
      aqs: fmtValue(c.aqs),
    })),
    timeSeries: convertTimeSeries(api.timeSeries ?? []),
    insights: insightsArr,
  };
}

// ─── Convert ─────────────────────────────────────────────────────────────────

export interface TransformedConvert {
  summary: {
    conversionRate: string;
    conversionRateDelta: string;
    revenue: string;
    revenueDelta: string;
    purchases: string;
    purchasesDelta: string;
    roas: string;
    roasDelta: string;
    aov: string;
    aovDelta: string;
    costPerConversion: string;
    costPerConversionDelta: string;
    cartAbandonmentRate: string;
  };
  campaignBreakdown: Array<{
    name: string;
    conversions: string;
    revenue: string;
    roas: string;
    aov: string;
    costPerConversion: string;
  }>;
  timeSeries: TimeSeriesPoint[];
  insights: Array<{ key: string; title: string; body: string }>;
}

export function transformConvertData(api: ChannelConvertResponse): TransformedConvert {
  const insightsArr: TransformedConvert["insights"] = [];
  if (api.insights && typeof api.insights === "object" && !Array.isArray(api.insights)) {
    for (const [key, val] of Object.entries(api.insights)) {
      if (val && typeof val === "object") {
        insightsArr.push({ key, title: val.title ?? "", body: val.body ?? "" });
      }
    }
  }

  return {
    summary: {
      conversionRate: fmtValue(api.summary.conversionRate),
      conversionRateDelta: deltaArrow(api.summary.conversionRate),
      revenue: fmtValue(api.summary.revenue),
      revenueDelta: deltaArrow(api.summary.revenue),
      purchases: fmtValue(api.summary.purchases),
      purchasesDelta: deltaArrow(api.summary.purchases),
      roas: fmtValue(api.summary.roas),
      roasDelta: deltaArrow(api.summary.roas),
      aov: fmtValue(api.summary.aov),
      aovDelta: deltaArrow(api.summary.aov),
      costPerConversion: fmtValue(api.summary.costPerConversion),
      costPerConversionDelta: deltaArrow(api.summary.costPerConversion),
      cartAbandonmentRate: api.summary.cartAbandonmentRate?.formatted
        ?? (api.summary.cartAbandonmentRate?.value != null ? String(api.summary.cartAbandonmentRate.value) : "—"),
    },
    campaignBreakdown: (api.campaignBreakdown ?? []).map((c) => ({
      name: c.name,
      conversions: fmtValue(c.conversions),
      revenue: fmtValue(c.revenue),
      roas: fmtValue(c.roas),
      aov: fmtValue(c.aov),
      costPerConversion: fmtValue(c.costPerConversion),
    })),
    timeSeries: convertTimeSeries(api.timeSeries ?? []),
    insights: insightsArr,
  };
}

// ─── Talk ────────────────────────────────────────────────────────────────────

export interface TransformedTalk {
  summary: {
    aar: string;
    aarDelta: string;
    cpaa: string;
    cpaaDelta: string;
    shareRate: string;
    shareRateDelta: string;
    advocacyActions: string;
    advocacyActionsDelta: string;
  };
  advocacyBreakdown: Array<{
    action: string;
    volume: number;
    pct: number;
    trend: "growing" | "declining" | "stable";
    trendColor: string;
  }>;
  timeSeries: TimeSeriesPoint[];
  partialData: boolean;
  sentiment: Record<string, any> | null;
  earnedMedia: Record<string, any> | null;
  insights: Array<{ key: string; title: string; body: string }>;
}

export function transformTalkData(api: ChannelTalkResponse): TransformedTalk {
  const insightsArr: TransformedTalk["insights"] = [];
  if (api.insights && typeof api.insights === "object" && !Array.isArray(api.insights)) {
    for (const [key, val] of Object.entries(api.insights)) {
      if (val && typeof val === "object") {
        insightsArr.push({ key, title: val.title ?? "", body: val.body ?? "" });
      }
    }
  }

  return {
    summary: {
      aar: fmtValue(api.summary.aar),
      aarDelta: deltaArrow(api.summary.aar),
      cpaa: fmtValue(api.summary.cpaa),
      cpaaDelta: deltaArrow(api.summary.cpaa),
      shareRate: fmtValue(api.summary.shareRate),
      shareRateDelta: deltaArrow(api.summary.shareRate),
      advocacyActions: fmtValue(api.summary.advocacyActions),
      advocacyActionsDelta: deltaArrow(api.summary.advocacyActions),
    },
    advocacyBreakdown: (api.advocacyBreakdown ?? []).map((a) => ({
      action: a.action,
      volume: a.volume,
      pct: a.pct,
      trend: a.trend,
      trendColor: trendColor(a.trend),
    })),
    timeSeries: convertTimeSeries(api.timeSeries ?? []),
    partialData: api.data_availability !== "full",
    sentiment: api.sentiment ?? null,
    earnedMedia: api.earnedMedia ?? null,
    insights: insightsArr,
  };
}

// ─── Campaigns ───────────────────────────────────────────────────────────────

export interface TransformedCampaignRow {
  id: string;
  name: string;
  reach: string;
  spend: string;
  spendRaw: number;
  impressions: string;
  engagementRate: string;
  leads: string;
  revenue: string;
  purchases: string;
  roas: string;
  costPerConversion: string;
}

function fmtNum(n: number): string {
  if (n == null || isNaN(n)) return "—";
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toFixed(0);
}

function fmtMoney(n: number): string {
  if (n == null || isNaN(n)) return "—";
  if (n === 0) return "$0";
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n.toFixed(2)}`;
}

export function transformCampaignsData(api: ChannelCampaignsResponse): TransformedCampaignRow[] {
  return (api?.campaigns ?? [])
    .map((c) => ({
      id: c.campaign_id,
      name: c.campaign_name,
      reach: fmtNum(c.reach),
      spend: fmtMoney(c.spend),
      spendRaw: c.spend,
      impressions: fmtNum(c.impressions),
      engagementRate: `${(c.engagement_rate ?? 0).toFixed(1)}%`,
      leads: fmtNum(c.leads),
      revenue: fmtMoney(c.revenue),
      purchases: fmtNum(c.purchases),
      roas: `${(c.roas ?? 0).toFixed(1)}×`,
      costPerConversion: fmtMoney(c.cost_per_conversion),
    }))
    .sort((a, b) => b.spendRaw - a.spendRaw);
}

// ─── Budget Pacing ───────────────────────────────────────────────────────────

export interface TransformedBudgetPacing {
  available: boolean;
  reason?: string;
  totalBudget: string;
  totalSpend: string;
  dailyAvg: string;
  projectedSpend: string;
  totalBudgetRaw: number;
  totalSpendRaw: number;
  dailyAvgRaw: number;
  daysElapsed: number;
  daysTotal: number;
  pacingStatus: string;
  spendCurve: TimeSeriesPoint[];
  campaigns: Array<{
    name: string;
    budget: string;
    spent: string;
    pacing: number;
    status: string;
  }>;
}

export function transformBudgetPacingData(api: ChannelBudgetPacingResponse): TransformedBudgetPacing {
  // Map from actual API shape (nested under summary) to flat transformed shape
  const summary = api.summary;
  return {
    available: api.available,
    reason: api.budget?.note,
    totalBudget: api.budget?.total != null ? `$${api.budget.total.toLocaleString()}` : "—",
    totalSpend: summary?.totalSpend?.formatted ?? "$0",
    dailyAvg: summary?.dailyAvgSpend?.formatted ?? "$0",
    projectedSpend: summary?.projectedSpend?.formatted ?? "$0",
    totalBudgetRaw: api.budget?.total ?? 0,
    totalSpendRaw: summary?.totalSpend?.value ?? 0,
    dailyAvgRaw: summary?.dailyAvgSpend?.value ?? 0,
    daysElapsed: summary?.daysElapsed ?? 0,
    daysTotal: summary?.totalDays ?? 0,
    pacingStatus: api.alert ?? "",
    spendCurve: api.spendCurve ? convertTimeSeries(api.spendCurve) : [],
    campaigns: [], // API doesn't return per-campaign breakdown in this endpoint
  };
}

// ─── Cross-Campaign Signals ──────────────────────────────────────────────────

export interface TransformedSignalCard {
  category: string;
  title: string;
  stats: string;
  signalType: "opportunity" | "warning" | "insight";
  color: string;
}

export interface TransformedCrossCampaign {
  available: boolean;
  reason?: string;
  signals: TransformedSignalCard[];
  campaignCount: number;
}

export function transformCrossCampaignData(api: ChannelCrossCampaignResponse): TransformedCrossCampaign {
  const signalColor = (type: string) => {
    if (type === "opportunity") return "#059669";
    if (type === "warning") return "#E11D48";
    return "#7652B3";
  };

  return {
    available: api.available,
    signals: (api.signals ?? [])
      .filter((s) => s.title) // only include signals with content
      .map((s) => ({
        category: s.category ?? "",
        title: s.title ?? "",
        stats: s.stats ?? "",
        signalType: s.signal_type ?? "insight",
        color: signalColor(s.signal_type ?? "insight"),
      })),
    campaignCount: 0,
  };
}

// ─── Recommendations ─────────────────────────────────────────────────────────

export interface TransformedRecommendations {
  scale: Array<{ text: string; priority: number }>;
  fix: Array<{ text: string; priority: number }>;
  watch: Array<{ text: string; priority: number }>;
}

export function transformRecommendationsData(api: ChannelRecommendationsResponse): TransformedRecommendations {
  return {
    scale: api.scale ?? [],
    fix: api.fix ?? [],
    watch: api.watch ?? [],
  };
}
