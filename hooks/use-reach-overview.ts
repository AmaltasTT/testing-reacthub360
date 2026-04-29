"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";

// ─── Base URL ────────────────────────────────────────────────────────────────
const CHANNELS_API = "https://xyfx-hog3-y19r.n7e.xano.io/api:yqPsrHo2";

// ─── Filter Interface ────────────────────────────────────────────────────────
export interface OverviewFilters {
  date_from?: string;
  date_to?: string;
  campaign_id?: string;
}

// ─── Fetch Helper ────────────────────────────────────────────────────────────
async function overviewFetch<T>(
  path: string,
  token: string,
  filters?: OverviewFilters
): Promise<T> {
  const params = new URLSearchParams();
  if (filters?.date_from) params.set("date_from", filters.date_from);
  if (filters?.date_to) params.set("date_to", filters.date_to);
  if (filters?.campaign_id) params.set("campaign_id", filters.campaign_id);

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

// ─── Response Types ──────────────────────────────────────────────────────────

// Endpoint 1: Overview Summary
export interface OverviewTotals {
  reach: number;
  qr: number;
  spend: number;
  qrr: number;
  avg_cpqr: number;
  apr: number;
  qr_target: number | null;
  qrr_target: number | null;
  avg_cpqr_target: number | null;
  apr_target: number | null;
  qr_delta: string;
  cpqr_delta: string;
  apr_delta: string;
  qrr_delta: string;
}

export interface OverviewChannel {
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
  account_id: string;
  account_label: string;
  id_label: string;
  status?: string;
}

export interface OverviewSummaryResponse {
  totals: OverviewTotals;
  channels: OverviewChannel[];
}

// Endpoint 2: Overview Trends
export interface BenchmarkBand {
  min: number;
  max: number;
}

export interface OverviewTrendsResponse {
  periods: string[];
  reach: number[];
  qr: number[];
  cpqr: number[];
  qrr: number[];
  cpqr_benchmark: number[];
  benchmark_band: BenchmarkBand;
}

// Endpoint 3: Overview Overlap
export interface OverlapPair {
  pair: [string, string];
  pair_colors: [string, string];
  pair_icons: [string, string];
  overlap: number;
  severity: string;
  wasted_spend: number;
  unique_a: number;
  unique_b: number;
  shared: number;
  total_combined: number;
  insight: string;
  action: string;
  trend: number[];
  trend_days: string[];
}

export interface OverviewOverlapResponse {
  overlaps: OverlapPair[];
  total_overlap_waste: number;
}

// Endpoint 4: Overview Frequency
export interface FreqCurvePoint {
  freq: number;
  qrr_lift: number;
  cpm_at: number;
}

export interface FreqInsight {
  verdict: string;
  detail: string;
}

export interface FrequencyChannel {
  id: string;
  name: string;
  icon: string;
  color: string;
  impressions: number;
  unique_reach: number;
  avg_freq: number;
  optimal_freq: number;
  cpm: number;
  cpqr: number;
  excess_freq: number;
  excess_impressions: number;
  wasted_spend: number;
  status: string;
  freq_curve: FreqCurvePoint[];
  insight: FreqInsight;
}

export interface OverviewFrequencyResponse {
  channels: FrequencyChannel[];
  total_freq_waste: number;
}

// Endpoint 5: Overview Campaigns
export interface OverviewCampaign {
  id: string;
  name: string;
  channels: number;
  status: string;
}

export interface OverviewCampaignsResponse {
  campaigns: OverviewCampaign[];
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

// 1. Campaigns (no date dependency — fetch once on mount)
export function useOverviewCampaigns(enabled = true) {
  const { token, isAuthenticated } = useAuth();

  return useQuery<OverviewCampaignsResponse>({
    queryKey: ["overview-campaigns"],
    queryFn: () =>
      overviewFetch<OverviewCampaignsResponse>(
        "/overview_campaigns",
        token!
      ),
    enabled: enabled && isAuthenticated && !!token,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

// 2. Summary (KPI cards + channel table)
export function useOverviewSummary(
  filters?: OverviewFilters,
  enabled = true
) {
  const { token, isAuthenticated } = useAuth();

  return useQuery<OverviewSummaryResponse>({
    queryKey: [
      "overview-summary",
      {
        date_from: filters?.date_from,
        date_to: filters?.date_to,
        campaign_id: filters?.campaign_id,
      },
    ],
    queryFn: () =>
      overviewFetch<OverviewSummaryResponse>(
        "/overview_summary",
        token!,
        filters
      ),
    enabled: enabled && isAuthenticated && !!token,
    staleTime: 2 * 60 * 1000,
    retry: 2,
  });
}

// 3. Trends (chart section)
export function useOverviewTrends(
  filters?: OverviewFilters,
  enabled = true
) {
  const { token, isAuthenticated } = useAuth();

  return useQuery<OverviewTrendsResponse>({
    queryKey: [
      "overview-trends",
      {
        date_from: filters?.date_from,
        date_to: filters?.date_to,
        campaign_id: filters?.campaign_id,
      },
    ],
    queryFn: () =>
      overviewFetch<OverviewTrendsResponse>(
        "/overview_trends",
        token!,
        filters
      ),
    enabled: enabled && isAuthenticated && !!token,
    staleTime: 2 * 60 * 1000,
    retry: 2,
  });
}

// 4. Overlap (audience overlap analysis)
export function useOverviewOverlap(
  filters?: OverviewFilters,
  enabled = true
) {
  const { token, isAuthenticated } = useAuth();

  return useQuery<OverviewOverlapResponse>({
    queryKey: [
      "overview-overlap",
      {
        date_from: filters?.date_from,
        date_to: filters?.date_to,
        campaign_id: filters?.campaign_id,
      },
    ],
    queryFn: () =>
      overviewFetch<OverviewOverlapResponse>(
        "/overview_overlap",
        token!,
        filters
      ),
    enabled: enabled && isAuthenticated && !!token,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

// 5. Frequency (frequency optimization)
export function useOverviewFrequency(
  filters?: OverviewFilters,
  enabled = true
) {
  const { token, isAuthenticated } = useAuth();

  return useQuery<OverviewFrequencyResponse>({
    queryKey: [
      "overview-frequency",
      {
        date_from: filters?.date_from,
        date_to: filters?.date_to,
        campaign_id: filters?.campaign_id,
      },
    ],
    queryFn: () =>
      overviewFetch<OverviewFrequencyResponse>(
        "/overview_frequency",
        token!,
        filters
      ),
    enabled: enabled && isAuthenticated && !!token,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}
