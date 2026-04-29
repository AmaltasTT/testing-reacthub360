import type { ReachFilterContext } from "@/components/insightsiq/PhaseCard";

/**
 * Single campaign id from the URL for InsightsIQ + insights metrics pages.
 * Prefer `campaign_id` (LaunchIQ / InsightsIQ); fall back to legacy `campaigns` (comma-separated).
 */
export function readCampaignIdFromSearchParams(searchParams: URLSearchParams): string | undefined {
  const direct = searchParams.get("campaign_id")?.trim();
  if (direct && direct !== "all") return direct;
  const legacy = searchParams.get("campaigns")?.split(",")[0]?.trim();
  if (legacy && legacy !== "all") return legacy;
  return undefined;
}

/** Copy of current query string with `campaign_id` set or removed; drops legacy `campaigns`. */
export function writeCampaignIdToSearchParams(
  searchParams: URLSearchParams,
  campaignId: string | undefined | null
): URLSearchParams {
  const next = new URLSearchParams(searchParams.toString());
  next.delete("campaigns");
  const id = campaignId?.trim();
  if (!id || id === "all") next.delete("campaign_id");
  else next.set("campaign_id", id);
  return next;
}

export function buildUrlWithSearchString(pathname: string, searchParams: URLSearchParams): string {
  const q = searchParams.toString();
  return q ? `${pathname}?${q}` : pathname;
}

export function insightsIqPathForCampaign(selectedFirst: string | undefined): string {
  if (!selectedFirst || selectedFirst === "all") return "/insightsiq";
  return `/insightsiq?campaign_id=${encodeURIComponent(selectedFirst)}`;
}

/** Period + optional custom dates + campaign_id for reach / engage / act / convert stats deep links. */
/** Append `?campaign_id=` when a concrete campaign is selected (paths without existing query). */
export function pathWithCampaignSearchParam(path: string, campaignId: string | undefined): string {
  if (!campaignId || campaignId === "all") return path;
  return `${path}?campaign_id=${encodeURIComponent(campaignId)}`;
}

export function pathWithCampaignFromSearchParams(path: string, searchParams: URLSearchParams): string {
  return pathWithCampaignSearchParam(path, readCampaignIdFromSearchParams(searchParams));
}

export function buildInsightsMetricsUrl(path: string, filterContext?: ReachFilterContext): string {
  const params = new URLSearchParams();
  if (!filterContext) return path;

  const periodMap: Record<string | number, string> = {
    7: "7d",
    14: "14d",
    30: "30d",
    60: "90d",
    90: "90d",
    custom: "custom",
  };
  const period = periodMap[filterContext.selectedPeriod];
  if (period) params.set("period", period);

  if (
    filterContext.selectedPeriod === "custom" &&
    filterContext.customRange.start &&
    filterContext.customRange.end
  ) {
    params.set("from", filterContext.customRange.start.toISOString().split("T")[0]);
    params.set("to", filterContext.customRange.end.toISOString().split("T")[0]);
  }

  const cid = filterContext.selectedCampaigns[0]?.trim();
  if (cid && Number.isFinite(Number(cid))) params.set("campaign_id", cid);

  const query = params.toString();
  return query ? `${path}?${query}` : path;
}
