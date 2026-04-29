"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";

// ─── Base URL ────────────────────────────────────────────────────────────────
const CHANNELS_API = "https://xyfx-hog3-y19r.n7e.xano.io/api:yqPsrHo2";

// ─── Filter Interface ────────────────────────────────────────────────────────
export interface ChannelFilters {
  channel_id?: string;
  date_from?: string;
  date_to?: string;
  compare_start?: string;
  compare_end?: string;
  campaign_id?: number;
}

// ─── Fetch Helper (GET) ───────────────────────────────────────────────────────
async function channelFetch<T>(
  path: string,
  token: string,
  filters?: ChannelFilters
): Promise<T> {
  const params = new URLSearchParams();
  if (filters?.channel_id) params.set("channel_id", filters.channel_id);
  if (filters?.date_from) params.set("date_from", filters.date_from);
  if (filters?.date_to) params.set("date_to", filters.date_to);
  if (filters?.compare_start) params.set("compare_start", filters.compare_start);
  if (filters?.compare_end) params.set("compare_end", filters.compare_end);
  if (filters?.campaign_id) params.set("campaign_id", String(filters.campaign_id));

  const query = params.toString();
  const url = `${CHANNELS_API}${path}${query ? `?${query}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to fetch ${path}: ${response.statusText}`
    );
  }

  return response.json();
}

// ─── Post Helper (POST with JSON body) ───────────────────────────────────────
async function channelPost<T>(
  path: string,
  token: string,
  body: Record<string, unknown>
): Promise<T> {
  const response = await fetch(`${CHANNELS_API}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to fetch ${path}: ${response.statusText}`
    );
  }

  return response.json();
}

// ─── Response Types ──────────────────────────────────────────────────────────

export interface SimpleMetric {
  value: number;
  formatted: string;
}

export interface MetricValue {
  value: number | null;
  formatted?: string;
  delta: number;
  delta_formatted: string;
}

export interface SimpleVanityMetric {
  value: number;
}

export interface TimeSeriesPoint {
  date: string;
  [key: string]: string | number | null | undefined;
}

// 1. Channels List
export interface ChannelLogo {
  access: string;
  path: string;
  name: string;
  type: string;
  size: number;
  mime: string;
  meta: { width: number; height: number };
  url: string;
}

export interface ChannelListItem {
  id: number;
  name: string;
  provider_name: string;
  type: "paid" | "organic";
  logo: ChannelLogo | string | null;
  status: string;
  metrics: {
    reach: number;
    spend: number;
    impressions: number;
    /** Primary qualified / ICP reach; some stacks also send `qualified_reach` / `qr` */
    icp_reach: number;
    qualified_reach?: number;
    qr?: number;
    engagement_rate: number;
    leads: number;
    conversions: number;
  } | null;
}

export interface ChannelsListApiResponse {
  channels: ChannelListItem[];
}

export type ChannelsListResponse = ChannelListItem[];

// 2. Channel Funnel (matches actual API)
export interface FunnelMetric {
  label: string;
  value: string | number | null;
  delta: string;
  available?: boolean;
}

export interface FunnelPhase {
  name: string;
  status: string;
  status_subtitle: string;
  momentum: string;
  /** May be empty when the backend has no mini-series for the phase */
  sparkline_data: number[];
  primary_metrics: FunnelMetric[];
  supporting_metrics: Array<{ label: string; value: string | number }>;
}

export interface ChannelFunnelResponse {
  channel: {
    provider_name: string;
    display_name: string;
    /** Present on newer API payloads — preferred over inferring from slug */
    is_paid?: boolean;
    platforms_id: string;
    platform_slug: string;
    status: string;
  };
  phases: FunnelPhase[];
}

// 3. Channel Reach
export interface DeviceBreakdownEntry {
  value: number;
  pct: number;
}

export interface ChannelReachResponse {
  summary: {
    totalReach: MetricValue;
    impressions: MetricValue;
    viewableImpressions: MetricValue;
    spend: MetricValue;
    frequency: MetricValue;
    qualifiedReach: MetricValue;
    qrr: MetricValue;
    cpqr: MetricValue;
    apr: MetricValue;
    cpm: MetricValue;
    vcpm: MetricValue;
  };
  timeSeries: TimeSeriesPoint[];
  deviceBreakdown: {
    desktop: DeviceBreakdownEntry;
    mobile: DeviceBreakdownEntry;
  };
  placements: Array<{
    name: string;
    impressions: MetricValue;
    reach: MetricValue;
    qrr: MetricValue;
    cpqr: MetricValue;
    viewability: MetricValue;
    frequency: MetricValue;
  }>;
  insights: Record<string, any>;
  recommendations: {
    scale: Array<{ text: string; priority: number }>;
    fix: Array<{ text: string; priority: number }>;
    watch: Array<{ text: string; priority: number }>;
  };
}

// 4. Channel Engage
export interface SignalBreakdownItem {
  action: string;
  current: number;
  previous: number;
  delta_formatted: string;
  trend: "growing" | "declining" | "stable";
}

export interface ChannelEngageResponse {
  summary: Partial<{
    eis: MetricValue;
    eqs: MetricValue;
    engagementRate: MetricValue;
    cpe: MetricValue;
    cpqe: MetricValue;
    totalEngagements: MetricValue;
    engagedIcp: MetricValue;
  }>;
  vanityMetrics?: Partial<{
    likes: SimpleVanityMetric;
    saves: SimpleVanityMetric;
    comments: SimpleVanityMetric;
    shares: SimpleVanityMetric;
    videoViews: SimpleVanityMetric;
    /** Some APIs use snake_case */
    video_views: SimpleVanityMetric;
  }>;
  signalBreakdown?: SignalBreakdownItem[];
  peakWindows?: Array<{ window: string; score: number }>;
  /** Points often include `engagementRate` (%); may omit per-metric series until backend adds them. */
  timeSeries?: TimeSeriesPoint[];
  creatives?: any[];
  esr?: number | null;
  insights?: Record<string, any>;
}

// 5. Channel Act
export interface CampaignBreakdownRow {
  name: string;
  actions: MetricValue;
  acr: MetricValue;
  cpa: MetricValue;
  aqs: MetricValue;
}

export interface ChannelActResponse {
  summary: {
    ais: MetricValue;
    aqs: MetricValue;
    acr: MetricValue;
    cpa: MetricValue;
    leads: MetricValue;
    qualifiedLeads: MetricValue;
    leadFormOpens: SimpleVanityMetric;
    eventRegistrations: SimpleVanityMetric;
  };
  campaignBreakdown: CampaignBreakdownRow[];
  timeSeries: TimeSeriesPoint[];
  actionSources: any[];
  insights?: Record<string, any>;
}

// 6. Channel Convert
export interface StaticMetric {
  value: number | null;
  formatted?: string;
}

export interface ChannelConvertResponse {
  summary: {
    conversionRate: MetricValue;
    revenue: MetricValue;
    purchases: MetricValue;
    roas: MetricValue;
    aov: MetricValue;
    costPerConversion: MetricValue;
    cartAbandonmentRate: StaticMetric;
  };
  campaignBreakdown: Array<{
    name: string;
    conversions: MetricValue;
    revenue: MetricValue;
    roas: MetricValue;
    aov: MetricValue;
    costPerConversion: MetricValue;
  }>;
  timeSeries: TimeSeriesPoint[];
  funnel: any[];
  dpaCatalog: any[];
  insights?: Record<string, any>;
}

// 7. Channel Talk
export interface AdvocacyBreakdownItem {
  action: string;
  volume: number;
  pct: number;
  trend: "growing" | "declining" | "stable";
}

export interface ChannelTalkResponse {
  data_availability: string;
  summary: {
    aar: MetricValue;
    cpaa: MetricValue;
    shareRate: MetricValue;
    advocacyActions: MetricValue;
  };
  advocacyBreakdown: AdvocacyBreakdownItem[];
  sentiment: Record<string, any> | null;
  earnedMedia: Record<string, any> | null;
  creatives: any[];
  timeSeries?: TimeSeriesPoint[];
  insights?: Record<string, any>;
}

// 8. Channel Campaigns
export interface ChannelCampaignRow {
  campaign_id: string;
  campaign_name: string;
  reach: number;
  spend: number;
  impressions: number;
  engagement_rate: number;
  leads: number;
  revenue: number;
  purchases: number;
  roas: number;
  cost_per_conversion: number;
}

export interface ChannelCampaignsResponse {
  campaigns: ChannelCampaignRow[];
  details: any[];
  crossCampaignPatterns: any[];
}

// 9. Channel Budget Pacing (matches actual API)
export interface ChannelBudgetPacingResponse {
  available: boolean;
  summary: {
    totalSpend: SimpleMetric;
    dailyAvgSpend: SimpleMetric;
    projectedSpend: SimpleMetric;
    daysElapsed: number;
    daysRemaining: number;
    totalDays: number;
  };
  spendCurve: TimeSeriesPoint[];
  budget: {
    total: number | null;
    note?: string;
  };
  alert: string | null;
}

// 10. Channel Cross-Campaign Signals (matches actual API)
export interface CrossCampaignSignal {
  category?: string;
  title?: string;
  stats?: string;
  signal_type?: "opportunity" | "warning" | "insight";
}

export interface ChannelCrossCampaignResponse {
  available: boolean;
  signals: CrossCampaignSignal[];
  channel_averages?: {
    roas: number;
    cpr: number;
    engagement_rate: number;
  };
  audiencePatterns?: any[];
  timingPatterns?: any[];
  geoPatterns?: any[];
}

// 11. Channel Recommendations
export interface Recommendation {
  text: string;
  priority: number;
}

export interface ChannelRecommendationsResponse {
  scale: Recommendation[];
  fix: Recommendation[];
  watch: Recommendation[];
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

// 1. Channels List (POST with campaign_id + date range)
export function useChannelsList(filters?: Omit<ChannelFilters, "channel_id">, enabled = true) {
  const { token, isAuthenticated } = useAuth();

  return useQuery<ChannelsListResponse>({
    queryKey: ["channels", {
      date_from: filters?.date_from,
      date_to: filters?.date_to,
      campaign_id: filters?.campaign_id,
    }],
    queryFn: async () => {
      const res = await channelFetch<ChannelsListApiResponse>("/channels_list", token!, filters);
      return res.channels;
    },
    enabled: enabled && isAuthenticated && !!token,
    staleTime: 2 * 60 * 1000,
    retry: 2,
  });
}

// 2. Channel Funnel
export function useChannelFunnel(filters: ChannelFilters, enabled = true) {
  const { token, isAuthenticated } = useAuth();

  return useQuery<ChannelFunnelResponse>({
    queryKey: ["channel-funnel", filters.channel_id, filters.date_from, filters.date_to],
    queryFn: () => channelFetch<ChannelFunnelResponse>("/channel_funnel", token!, filters),
    enabled: enabled && isAuthenticated && !!token && !!filters.channel_id,
    staleTime: 2 * 60 * 1000,
    retry: 2,
  });
}

// 3. Channel Reach (lazy)
export function useChannelReach(filters: ChannelFilters, enabled = true) {
  const { token, isAuthenticated } = useAuth();

  return useQuery<ChannelReachResponse>({
    queryKey: ["channel-reach", filters.channel_id, filters.date_from, filters.date_to],
    queryFn: () => channelFetch<ChannelReachResponse>("/channel_reach", token!, filters),
    enabled: enabled && isAuthenticated && !!token && !!filters.channel_id,
    staleTime: 2 * 60 * 1000,
    retry: 2,
  });
}

// 4. Channel Engage (lazy)
export function useChannelEngage(filters: ChannelFilters, enabled = true) {
  const { token, isAuthenticated } = useAuth();

  return useQuery<ChannelEngageResponse>({
    queryKey: ["channel-engage", filters.channel_id, filters.date_from, filters.date_to],
    queryFn: () => channelFetch<ChannelEngageResponse>("/channel_engage", token!, filters),
    enabled: enabled && isAuthenticated && !!token && !!filters.channel_id,
    staleTime: 2 * 60 * 1000,
    retry: 2,
  });
}

// 5. Channel Act (lazy)
export function useChannelAct(filters: ChannelFilters, enabled = true) {
  const { token, isAuthenticated } = useAuth();

  return useQuery<ChannelActResponse>({
    queryKey: ["channel-act", filters.channel_id, filters.date_from, filters.date_to],
    queryFn: () => channelFetch<ChannelActResponse>("/channel_act", token!, filters),
    enabled: enabled && isAuthenticated && !!token && !!filters.channel_id,
    staleTime: 2 * 60 * 1000,
    retry: 2,
  });
}

// 6. Channel Convert (lazy)
export function useChannelConvert(filters: ChannelFilters, enabled = true) {
  const { token, isAuthenticated } = useAuth();

  return useQuery<ChannelConvertResponse>({
    queryKey: ["channel-convert", filters.channel_id, filters.date_from, filters.date_to],
    queryFn: () => channelFetch<ChannelConvertResponse>("/channel_convert", token!, filters),
    enabled: enabled && isAuthenticated && !!token && !!filters.channel_id,
    staleTime: 2 * 60 * 1000,
    retry: 2,
  });
}

// 7. Channel Talk (lazy)
export function useChannelTalk(filters: ChannelFilters, enabled = true) {
  const { token, isAuthenticated } = useAuth();

  return useQuery<ChannelTalkResponse>({
    queryKey: ["channel-talk", filters.channel_id, filters.date_from, filters.date_to],
    queryFn: () => channelFetch<ChannelTalkResponse>("/channel_talk", token!, filters),
    enabled: enabled && isAuthenticated && !!token && !!filters.channel_id,
    staleTime: 2 * 60 * 1000,
    retry: 2,
  });
}

// 8. Channel Campaigns
export function useChannelCampaigns(filters: ChannelFilters, enabled = true) {
  const { token, isAuthenticated } = useAuth();

  return useQuery<ChannelCampaignsResponse>({
    queryKey: ["channel-campaigns", filters.channel_id, filters.date_from, filters.date_to],
    queryFn: () => channelFetch<ChannelCampaignsResponse>("/channel_campaigns", token!, filters),
    enabled: enabled && isAuthenticated && !!token && !!filters.channel_id,
    staleTime: 2 * 60 * 1000,
    retry: 2,
  });
}

// 9. Channel Budget Pacing (paid only)
export function useChannelBudgetPacing(filters: ChannelFilters, enabled = true) {
  const { token, isAuthenticated } = useAuth();

  return useQuery<ChannelBudgetPacingResponse>({
    queryKey: ["channel-budget-pacing", filters.channel_id, filters.date_from, filters.date_to],
    queryFn: () => channelFetch<ChannelBudgetPacingResponse>("/channel_budget_pacing", token!, filters),
    enabled: enabled && isAuthenticated && !!token && !!filters.channel_id,
    staleTime: 2 * 60 * 1000,
    retry: 2,
  });
}

// 10. Channel Cross-Campaign Signals (paid only)
export function useChannelCrossCampaignSignals(filters: ChannelFilters, enabled = true) {
  const { token, isAuthenticated } = useAuth();

  return useQuery<ChannelCrossCampaignResponse>({
    queryKey: ["channel-cross-campaign-signals", filters.channel_id, filters.date_from, filters.date_to],
    queryFn: () => channelFetch<ChannelCrossCampaignResponse>("/channel_cross_campaign_signals", token!, filters),
    enabled: enabled && isAuthenticated && !!token && !!filters.channel_id,
    staleTime: 2 * 60 * 1000,
    retry: 2,
  });
}

// 11. Channel Recommendations
export function useChannelRecommendations(filters: ChannelFilters, enabled = true) {
  const { token, isAuthenticated } = useAuth();

  return useQuery<ChannelRecommendationsResponse>({
    queryKey: ["channel-recommendations", filters.channel_id, filters.date_from, filters.date_to],
    queryFn: () => channelFetch<ChannelRecommendationsResponse>("/channel_recommendations", token!, filters),
    enabled: enabled && isAuthenticated && !!token && !!filters.channel_id,
    staleTime: 2 * 60 * 1000,
    retry: 2,
  });
}
