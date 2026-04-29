/**
 * LaunchIQ API adapter — wire Xano routes here as they ship.
 *
 * ---------------------------------------------------------------------------
 * BACKEND CHECKLIST (Xano) — endpoints from LaunchIQ Developer Handoff v4
 * ---------------------------------------------------------------------------
 * | Method | Path / function | Purpose |
 * |--------|-----------------|--------|
 * | GET | campaigns/benchmarks?goal&biz_model&industry&geo | OMTM + KPIs + confidence |
 * | GET | campaigns/channel-recommendations?goal&org_id | Ranked channels, relevance, plan |
 * | GET | config/regions | Country list for chips |
 * | GET | organizations/{org_id}/context | Overlay: business context |
 * | PUT | organizations/{org_id}/context | Persist org context |
 * | GET | platforms/{id}/campaigns?days=30&limit=5 | Optional; may keep get_ad_account_campaigns |
 * | GET | campaigns/check-name?name&org_id | Name availability |
 * | POST | campaigns/create | Async create → { campaign_id, status: "initializing" } |
 * | GET | campaigns/{id}/status | Poll until active |
 * | POST | (optional) campaign_analytics_events | Observability events |
 * ---------------------------------------------------------------------------
 */

const BASE = process.env.NEXT_PUBLIC_LAUNCHIQ_API_BASE ?? "";

export type BenchmarkMetric = {
  metric_key: string;
  label: string;
  value: string;
  confidence: number;
};

export type BenchmarksResult = {
  metrics: BenchmarkMetric[];
  omtm_key: string;
  kpi_keys: string[];
};

export type ChannelRecommendation = {
  platform_id: string;
  name: string;
  connected: boolean;
  relevance_score: number;
  campaigns_count?: number;
};

export type ChannelRecommendationsResult = {
  channels: ChannelRecommendation[];
  plan?: { tier: string; used: number; limit: number };
};

export async function fetchBenchmarks(_params: {
  goal: string;
  businessModel?: string;
  industry?: string;
  geo?: string;
  token: string | null;
}): Promise<BenchmarksResult | null> {
  if (!BASE) return null;
  // TODO: GET ${BASE}/campaigns/benchmarks?...
  return null;
}

export async function fetchChannelRecommendations(_params: {
  goal: string;
  orgId: number;
  token: string | null;
}): Promise<ChannelRecommendationsResult | null> {
  if (!BASE) return null;
  return null;
}

export async function fetchRegionsFromApi(_token: string | null): Promise<string[] | null> {
  if (!BASE) return null;
  return null;
}

export async function checkCampaignNameAvailable(_params: {
  name: string;
  orgId: number;
  token: string | null;
}): Promise<boolean | null> {
  if (!BASE) return null;
  return null;
}

export async function createCampaignAsync(_params: {
  body: unknown;
  token: string | null;
}): Promise<{ campaign_id: number; status: string } | null> {
  if (!BASE) return null;
  return null;
}

export async function fetchCampaignPipelineStatus(_params: {
  campaignId: number;
  token: string | null;
}): Promise<{ status: "initializing" | "active" | string } | null> {
  if (!BASE) return null;
  return null;
}

/** Re-export checklist for tooling / docs consumers */
export const LAUNCHIQ_BACKEND_ENDPOINTS = [
  "GET campaigns/benchmarks",
  "GET campaigns/channel-recommendations",
  "GET config/regions",
  "GET organizations/{org_id}/context",
  "PUT organizations/{org_id}/context",
  "GET campaigns/check-name",
  "POST campaigns/create (async) + GET campaigns/{id}/status",
  "POST campaign_analytics_events (optional)",
] as const;
