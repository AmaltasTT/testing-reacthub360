"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";

// ─── Base URLs ───────────────────────────────────────────────────────────────
const CAMPAIGNS_API = "https://xyfx-hog3-y19r.n7e.xano.io/api:Wqh-dK1c";
const INSIGHTS_API = "https://xyfx-hog3-y19r.n7e.xano.io/api:Ugw7284o";

// ─── Shared Filter Interface ─────────────────────────────────────────────────
export interface InsightsFilters {
  campaign_ids?: number[];
  geography?: string;
  date_from?: string;
  date_to?: string;
}

// ─── Fetch Helper ────────────────────────────────────────────────────────────
async function insightsiqFetch<T>(
  baseUrl: string,
  path: string,
  token: string,
  filters?: InsightsFilters
): Promise<T> {
  const params = new URLSearchParams();
  if (filters?.campaign_ids?.length) {
    params.set("campaign_ids", filters.campaign_ids.join(","));
  }
  if (filters?.geography && filters.geography !== "global") {
    params.set("geography", filters.geography);
  }
  if (filters?.date_from) params.set("date_from", filters.date_from);
  if (filters?.date_to) params.set("date_to", filters.date_to);

  const query = params.toString();
  const url = `${baseUrl}${path}${query ? `?${query}` : ""}`;

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

// ─── Response Types ──────────────────────────────────────────────────────────

// 1. Campaigns
export interface InsightsIQCampaign {
  id: number;
  name: string;
  status: string;
  geography?: string;
  created_at?: number;
}

// 2. Geographies
export interface InsightsIQGeography {
  id: string;
  name: string;
}

// 3. Brand Momentum — values are numbers (API returns 0 as placeholder)
export interface BrandMomentumMetric {
  value: number;
  delta: number;
}

export interface BrandMomentumData {
  bms: BrandMomentumMetric;
  bmi: BrandMomentumMetric;
  romi: BrandMomentumMetric;
}

// 4. Performance Snapshot — named keys, not an array
export interface SnapshotMetricCard {
  value: string;
  delta: string;
  percentage: number;
  status: string;
}

export interface PerformanceSnapshotData {
  total_reach: SnapshotMetricCard;
  cost_per_reach: SnapshotMetricCard;
  audience_penetration_rate: SnapshotMetricCard;
  total_spend_vs_roas: SnapshotMetricCard & {
    secondary_value: string;
    secondary_delta: string;
  };
}

// 5. Key Insights — arrays may be empty (placeholder)
export interface KeyInsightsData {
  key_insights: string[];
  top_opportunities: string[];
}

// 6. Phases Overview
/** Period-over-period delta: signed %, "0%", or "—" when not comparable */
export type PhaseOverviewDelta = string;

export interface PhaseMetric {
  label: string;
  value: string | number | null;
  delta?: PhaseOverviewDelta | null;
  available?: boolean;
}

export interface PhaseOverviewItem {
  name: string;
  status: string;
  status_subtitle?: string;
  momentum: string;
  pulse_dot: string | null;
  sparkline_data: number[];
  primary_metrics: PhaseMetric[];
  supporting_metrics: Array<{ label: string; value: string; tooltip?: string }>;
}

export interface PhasesOverviewData {
  phases: PhaseOverviewItem[];
}

// 7. Reach Expanded (/phases_reach)
export interface ReachMetricValue {
  value: string | number | null;
  available?: boolean;
  note?: string;
  tooltip?: string;
}

export interface ReachChannelRow {
  channel: string;
  reach: {
    value: string | number;
    tooltip?: string;
  };
  qualified_reach: ReachMetricValue;
  qualified_reach_ratio?: ReachMetricValue;
  cost_per_qualified_reach?: ReachMetricValue;
}

export interface ReachExpandedData {
  supporting_metrics: {
    impressions: string;
    viewable_impressions: string;
    cpm: string;
    vcpm: string;
  };
  frequency: number;
  total_reach_platform: {
    value: string;
    tooltip: string;
  };
  total_reach_by_device: {
    value: string;
    desktop: number;
    mobile: number;
  };
  qualified_reach?: ReachMetricValue;
  qualified_reach_ratio?: ReachMetricValue;
  cost_per_qualified_reach?: ReachMetricValue;
  channels?: ReachChannelRow[];
}

// 8. Engage Expanded
export interface ChannelScore {
  name: string;
  score: number;
}

export interface EngageCostChannelRow {
  name: string;
  value?: string | null;
  cpe?: string | null;
  cpqe?: string | null;
  cpe_value?: number | null;
  cpqe_value?: number | null;
}

export interface EngageExpandedData {
  engagement_impact_score: {
    value: number | null;
    value_raw_0_100?: number;
    trend: string;
    channels: ChannelScore[];
    available?: boolean;
    note?: string;
  };
  engagement_quality_score: {
    value: number;
    value_raw_model?: number;
    channels: ChannelScore[];
    available?: boolean;
    note?: string;
  };
  engagement_rate_by_channel: {
    value?: string | number | null;
    average: string;
    channels?: { name: string; value: string; delta?: string; width?: number }[];
    available?: boolean;
    note?: string;
  };
  engaged_icp: {
    total: string;
    total_value?: number;
    trend: string;
    channels: { name: string; value: string; percentage?: string }[];
    available?: boolean;
    note?: string;
  };
  cost_per_engagement: {
    average: string;
    cpqe_average?: string;
    cpe_value?: number | null;
    cpqe_value?: number | null;
    channels: EngageCostChannelRow[];
    available?: boolean;
    note?: string;
  };
  vanity_metrics: {
    likes: string;
    saves: string;
    comments: string;
    shares: string;
    video_views: string;
  };
  insights: string[];
}

// 9. Act Expanded (/phases_act)
export interface ActActionBreakdownMeta {
  canonical_metrics?: string;
  legacy_keys_note?: string;
}

export interface ActActionBreakdown {
  leads?: string;
  lead_form_opens?: string;
  event_registrations?: string;
  qualified_leads?: string;
  add_to_cart?: string;
  wishlist_adds?: string;
  newsletter_signups?: string;
  downloads?: string;
}

export interface ActExpandedData {
  action_breakdown_meta?: ActActionBreakdownMeta;
  action_breakdown: ActActionBreakdown;
  action_completion_rate: {
    rate?: number;
    value: string;
    benchmark: string;
    trend: string;
    channels: { name: string; value: string }[];
    available?: boolean;
    note?: string;
  };
  action_impact_score: {
    value: number;
    value_0_10?: number;
    scale?: string;
    label: string;
    formula: string;
    channels: { name: string; aqs?: number; sessions?: number; ais?: number }[];
    available?: boolean;
    note?: string;
  };
  action_quality_score: {
    value: number;
    value_0_10?: number;
    scale?: string;
    channels: { name: string; score: number }[];
    available?: boolean;
    note?: string;
  };
  action_channel_efficiency: {
    channels: {
      name: string;
      cpa?: string;
      ais?: number;
      ace?: number;
      grade?: string;
    }[];
    insight_banner: string;
    legend?: string;
  };
  insights: string[];
}

// 10. Convert Expanded
export interface ConvertExpandedData {
  additional_metrics: {
    total_orders: string;
    cart_abandonment: string;
    repeat_purchase: string;
    cac: string;
  };
  conversion_rate: {
    value: string | null;
    trend: string;
    benchmark: string;
    sparkline: number[];
    channels: { name: string; value: string }[];
    available?: boolean;
    note?: string;
  };
  conversions_by_channel: {
    total: number;
    trend: string;
    channels: { name: string; value: number }[];
  };
  revenue_by_channel: {
    total: string;
    trend: string;
    channels: { name: string; value: string }[];
  };
  aov: {
    value: string;
    trend: string;
    benchmark: string;
    sparkline: number[];
    channels: { name: string; value: string }[];
  };
  channel_efficiency: {
    total_revenue: string;
    total_ad_spend: string;
    blended_roas: string;
    note?: string;
    channels: {
      name: string;
      revenue?: string;
      conv_rate?: string;
      cpc?: string;
      cpc_label?: string;
      roas?: string;
      trend?: string;
    }[];
  };
  insights: string[];
}

// 11. Talk Expanded — all values are "0" placeholders
export interface TalkExpandedData {
  additional_metrics: {
    customer_reviews: string;
    avg_rating: string;
    referrals_generated: string;
    social_mentions: string;
  };
  retention_rate: {
    value: string;
    channels: { name: string; value: string }[];
    bottom_metrics: {
      churn_rate: string;
      repeat_purchase: string;
      days_to_return: string;
    };
  };
  cost_per_retained_customer: {
    average: string;
    best_efficiency: string;
    industry_benchmark: string;
    channels: { name: string; cost: string; efficiency_pct?: string }[];
  };
  reactivation_rate: {
    value: string;
    channels: { name: string; value: string }[];
    bottom_metrics: {
      still_lapsed: string;
      win_backs: string;
      avg_cost: string;
      days_to_return: string;
    };
  };
  clv: {
    average: string;
    trend: string;
    channels: { name: string; value: string }[];
  };
  advocacy: {
    advocacy_action_rate: {
      value: string;
      channels: { name: string; value: string }[];
      non_advocates: string;
      total_actions: string;
      top_channel: string;
    };
    cost_per_advocacy_action: {
      value: string;
      delta: string;
      channels: { name: string; value: string }[];
    };
    positive_sentiment_rate: {
      value: string;
      benchmark: string;
      distribution: {
        positive: string;
        neutral: string;
        negative: string;
        total_mentions: string;
      };
      platforms: { name: string; value: string }[];
    };
    average_review_score: {
      value: string;
      delta: string;
      distribution: {
        excellent: string;
        good: string;
        average: string;
        poor: string;
      };
    };
  };
  insight_note: string;
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

// 1. Campaigns
export function useInsightsIQCampaigns() {
  const { token, isAuthenticated } = useAuth();

  return useQuery<InsightsIQCampaign[]>({
    queryKey: ["insightsiq", "campaigns"],
    queryFn: () => insightsiqFetch<InsightsIQCampaign[]>(CAMPAIGNS_API, "/campaigns", token!),
    enabled: isAuthenticated && !!token,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

// 2. Geographies
export function useInsightsIQGeographies() {
  const { token, isAuthenticated } = useAuth();

  return useQuery<InsightsIQGeography[]>({
    queryKey: ["insightsiq", "geographies"],
    queryFn: () => insightsiqFetch<InsightsIQGeography[]>(CAMPAIGNS_API, "/geographies", token!),
    enabled: isAuthenticated && !!token,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

// 3. Brand Momentum
export function useInsightsIQBrandMomentum(filters?: InsightsFilters, enabled = true) {
  const { token, isAuthenticated } = useAuth();

  return useQuery<BrandMomentumData>({
    queryKey: ["insightsiq", "brand_momentum", filters],
    queryFn: () =>
      insightsiqFetch<BrandMomentumData>(INSIGHTS_API, "/brand_momentum", token!, filters),
    enabled: enabled && isAuthenticated && !!token,
    staleTime: 2 * 60 * 1000,
    retry: 2,
  });
}

// 4. Performance Snapshot
export function useInsightsIQPerformanceSnapshot(filters?: InsightsFilters, enabled = true) {
  const { token, isAuthenticated } = useAuth();

  return useQuery<PerformanceSnapshotData>({
    queryKey: ["insightsiq", "performance_snapshot", filters],
    queryFn: () =>
      insightsiqFetch<PerformanceSnapshotData>(
        INSIGHTS_API,
        "/performance_snapshot",
        token!,
        filters
      ),
    enabled: enabled && isAuthenticated && !!token,
    staleTime: 2 * 60 * 1000,
    retry: 2,
  });
}

// 5. Key Insights
export function useInsightsIQKeyInsights(filters?: InsightsFilters, enabled = true) {
  const { token, isAuthenticated } = useAuth();

  return useQuery<KeyInsightsData>({
    queryKey: ["insightsiq", "key_insights", filters],
    queryFn: () =>
      insightsiqFetch<KeyInsightsData>(INSIGHTS_API, "/key_insights", token!, filters),
    enabled: enabled && isAuthenticated && !!token,
    staleTime: 2 * 60 * 1000,
    retry: 2,
  });
}

// 6. Phases Overview
export function useInsightsIQPhasesOverview(filters?: InsightsFilters, enabled = true) {
  const { token, isAuthenticated } = useAuth();

  return useQuery<PhasesOverviewData>({
    queryKey: ["insightsiq", "phases_overview", filters],
    queryFn: () =>
      insightsiqFetch<PhasesOverviewData>(INSIGHTS_API, "/phases_overview", token!, filters),
    enabled: enabled && isAuthenticated && !!token,
    staleTime: 2 * 60 * 1000,
    retry: 2,
  });
}

// 7. Phase: Reach (lazy — only fetches when expanded)
export function useInsightsIQPhaseReach(filters?: InsightsFilters, isExpanded = false) {
  const { token, isAuthenticated } = useAuth();

  return useQuery<ReachExpandedData>({
    queryKey: ["insightsiq", "phase_reach", filters],
    queryFn: () =>
      insightsiqFetch<ReachExpandedData>(INSIGHTS_API, "/phases_reach", token!, filters),
    enabled: isAuthenticated && !!token && isExpanded,
    staleTime: 2 * 60 * 1000,
    retry: 2,
  });
}

// 8. Phase: Engage (lazy)
export function useInsightsIQPhaseEngage(filters?: InsightsFilters, isExpanded = false) {
  const { token, isAuthenticated } = useAuth();

  return useQuery<EngageExpandedData>({
    queryKey: ["insightsiq", "phase_engage", filters],
    queryFn: () =>
      insightsiqFetch<EngageExpandedData>(INSIGHTS_API, "/phases_engage", token!, filters),
    enabled: isAuthenticated && !!token && isExpanded,
    staleTime: 2 * 60 * 1000,
    retry: 2,
  });
}

// 9. Phase: Act (lazy)
export function useInsightsIQPhaseAct(filters?: InsightsFilters, isExpanded = false) {
  const { token, isAuthenticated } = useAuth();

  return useQuery<ActExpandedData>({
    queryKey: ["insightsiq", "phase_act", filters],
    queryFn: () =>
      insightsiqFetch<ActExpandedData>(INSIGHTS_API, "/phases_act", token!, filters),
    enabled: isAuthenticated && !!token && isExpanded,
    staleTime: 2 * 60 * 1000,
    retry: 2,
  });
}

// 10. Phase: Convert (lazy)
export function useInsightsIQPhaseConvert(filters?: InsightsFilters, isExpanded = false) {
  const { token, isAuthenticated } = useAuth();

  return useQuery<ConvertExpandedData>({
    queryKey: ["insightsiq", "phase_convert", filters],
    queryFn: () =>
      insightsiqFetch<ConvertExpandedData>(INSIGHTS_API, "/phases_convert", token!, filters),
    enabled: isAuthenticated && !!token && isExpanded,
    staleTime: 2 * 60 * 1000,
    retry: 2,
  });
}

// 11. Phase: Talk (lazy)
export function useInsightsIQPhaseTalk(filters?: InsightsFilters, isExpanded = false) {
  const { token, isAuthenticated } = useAuth();

  return useQuery<TalkExpandedData>({
    queryKey: ["insightsiq", "phase_talk", filters],
    queryFn: () =>
      insightsiqFetch<TalkExpandedData>(INSIGHTS_API, "/phases_talk", token!, filters),
    enabled: isAuthenticated && !!token && isExpanded,
    staleTime: 2 * 60 * 1000,
    retry: 2,
  });
}
