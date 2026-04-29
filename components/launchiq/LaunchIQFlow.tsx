"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useCampaignGoals } from "@/hooks/use-campaign-goals";
import { useConnectedPlatforms, type LinkedAccount } from "@/hooks/use-platforms";
import { useUser } from "@/hooks/use-user";
import { usePlans } from "@/hooks/use-subscription";
import type { Plan } from "@/lib/subscription-utils";
import { useCreateCampaign, type CreateCampaignPayload } from "@/hooks/use-create-campaign";
import { useUpdateCampaign } from "@/hooks/use-update-campaign";
import type { CampaignDetailResponse } from "@/hooks/use-campaign";
import { useCampaigns } from "@/hooks/use-campaigns";
import { useDeleteCampaign } from "@/hooks/use-delete-campaign";
import type { AdAccount } from "@/hooks/use-campaign-ad-accounts";
import { ConnectionDrawer } from "@/components/ConnectionDrawer";
import { DefineScreen } from "@/components/launchiq/screens/DefineScreen";
import { ReviewScreen } from "@/components/launchiq/screens/ReviewScreen";
import { LaunchScreen } from "@/components/launchiq/screens/LaunchScreen";
import { MetricsOverlay, type MetricsOverlayValues } from "@/components/launchiq/overlays/MetricsOverlay";
import { goalNameToVisualKey } from "@/components/launchiq/lib/goalColors";
import { displayChannelName, isOrganicSlug } from "@/components/launchiq/lib/channel-utils";
import {
  defaultMetricsForGoal,
  formatMetricWithAffix,
  LAUNCHIQ_V7_DEFAULT_AGE_RANGES,
  LAUNCHIQ_V7_OVERLAY_BUSINESS_FIELDS,
  LAUNCHIQ_V7_OVERLAY_DEMOGRAPHICS_FIELDS,
  stripMetricRawValue,
  normalizeAgeRangesForApi,
} from "@/lib/launchiq-metrics";
import { fetchBenchmarks, fetchRegionsFromApi } from "@/lib/launchiq-api";
import { cn } from "@/lib/utils";
import {
  validateAtLeastOneConnectedChannelIncluded,
  validateCampaignSelectionForIncludedChannels,
} from "@/components/launchiq/lib/validate-review-channels";

const DEFAULT_REGIONS = [
  "Austria",
  "Canada",
  "France",
  "Germany",
  "Ireland",
  "Italy",
  "Switzerland",
  "UK",
  "US",
];

type Screen = 1 | 2 | 3;

function createInitialOverlayValues(): MetricsOverlayValues {
  return {
    omtmValue: "0",
    kpiValues: ["0", "0", "0"],
    revenueTarget: "",
    ...LAUNCHIQ_V7_OVERLAY_BUSINESS_FIELDS,
    ...LAUNCHIQ_V7_OVERLAY_DEMOGRAPHICS_FIELDS,
    ageRanges: [...LAUNCHIQ_V7_DEFAULT_AGE_RANGES],
    interestsTags: [],
    painTags: [],
    motivations: [],
  };
}

function geographyFromRegions(regions: Set<string>): string {
  return Array.from(regions).join(", ");
}

const XANO_GET_CAMPAIGN = "https://xyfx-hog3-y19r.n7e.xano.io/api:Wqh-dK1c/get_campaign";

function campaignStatusIsDraft(status: string | undefined): boolean {
  return String(status ?? "").toLowerCase() === "draft";
}

/** Xano `created_at` may be seconds or ms. */
function toCreatedAtMs(ts: number): number {
  if (!Number.isFinite(ts) || ts <= 0) return Date.now();
  return ts < 1e12 ? ts * 1000 : ts;
}

function formatRelativeAgeFromTimestamp(createdAtRaw: number): string {
  const ms = toCreatedAtMs(createdAtRaw);
  const ageSec = Math.max(0, (Date.now() - ms) / 1000);
  if (ageSec < 60) return "just now";
  if (ageSec < 3600) return `${Math.floor(ageSec / 60)} min ago`;
  if (ageSec < 86400) return `${Math.floor(ageSec / 3600)} h ago`;
  return `${Math.floor(ageSec / 86400)} d ago`;
}

async function fetchCampaignDetailApi(campaignId: string, token: string | null): Promise<CampaignDetailResponse> {
  if (!token) throw new Error("Not signed in");
  const res = await fetch(`${XANO_GET_CAMPAIGN}?campaign_id=${encodeURIComponent(campaignId)}`, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(typeof err.error === "string" ? err.error : res.statusText);
  }
  return res.json();
}

export function LaunchIQFlow({
  onComplete,
  onBack,
  mode,
  editingCampaignId,
  editingCampaignDetail,
}: {
  onComplete: (data: { name: string; goal: string; market: string; channels: Array<{ id: string; name: string; icon: string }> }) => void;
  onBack: () => void;
  mode: "create" | "edit";
  editingCampaignId: string | null;
  editingCampaignDetail: CampaignDetailResponse | null;
}) {
  const { token } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const { data: plansRaw } = usePlans();
  const { data: campaignsList = [], isLoading: campaignsListLoading } = useCampaigns({
    enabled: mode === "create",
  });
  const { mutateAsync: deleteCampaignAsync } = useDeleteCampaign();
  const { data: campaignGoals = [], isLoading: goalsLoading } = useCampaignGoals();
  const { allPlatforms, isLoading: platformsLoading } = useConnectedPlatforms();
  const { mutate: createCampaign, isPending: isCreating } = useCreateCampaign();
  const { mutate: updateCampaign, isPending: isUpdating } = useUpdateCampaign();

  const [screen, setScreen] = useState<Screen>(1);
  const [campaignName, setCampaignName] = useState("");
  const [selectedGoalId, setSelectedGoalId] = useState("");
  const [regionsList, setRegionsList] = useState<string[]>(DEFAULT_REGIONS);
  const [selectedRegions, setSelectedRegions] = useState<Set<string>>(new Set());
  const [includedChannelIds, setIncludedChannelIds] = useState<Set<string>>(new Set());
  const [expandedChannelId, setExpandedChannelId] = useState<string | null>(null);
  const [selectedAdAccounts, setSelectedAdAccounts] = useState<Record<string, string[]>>({});
  const [adAccountsByChannel, setAdAccountsByChannel] = useState<Record<string, AdAccount[]>>({});
  const [loadingAdAccounts, setLoadingAdAccounts] = useState<Record<string, boolean>>({});
  const [selectedCampaigns, setSelectedCampaigns] = useState<Record<string, Array<{ id: string; name: string }>>>({});
  const [landingPages, setLandingPages] = useState<string[]>([""]);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [launchError, setLaunchError] = useState<string | null>(null);
  const [pipelineInitializing, setPipelineInitializing] = useState(false);
  /** Invalidates create/update callbacks if the user leaves the Launch step while a request is in flight. */
  const launchGeneration = useRef(0);
  /** Campaign id for `Go to InsightsIQ` deep link after a successful launch. */
  const insightsLinkCampaignIdRef = useRef<string | null>(null);
  const [successSnapshot, setSuccessSnapshot] = useState<{
    name: string;
    goal: string;
    regions: string;
    channels: { name: string; count: string }[];
    omtm: string;
    kpis: string;
    costMetric: string;
  } | null>(null);

  /** When user resumes a `status: draft` campaign from `get_all_campaigns`, launches PATCH this id instead of POST create. */
  const [resumedDraftCampaignId, setResumedDraftCampaignId] = useState<string | null>(null);
  const [resumeDraftLoading, setResumeDraftLoading] = useState(false);

  const [connectionDrawer, setConnectionDrawer] = useState<{ open: boolean; channelId: string | null }>({
    open: false,
    channelId: null,
  });

  const inFlight = useRef<Set<string>>(new Set());
  const fetched = useRef<Set<string>>(new Set());

  const platformsForUi = useMemo(
    () => allPlatforms.filter((p) => !isOrganicSlug(p.slug)),
    [allPlatforms]
  );

  const primaryServerDraft = useMemo(() => {
    if (mode !== "create") return null;
    const drafts = campaignsList.filter((c) => campaignStatusIsDraft(c.status));
    if (drafts.length === 0) return null;
    return [...drafts].sort((a, b) => (b.created_at ?? 0) - (a.created_at ?? 0))[0] ?? null;
  }, [mode, campaignsList]);

  const showServerDraftBanner =
    mode === "create" &&
    screen === 1 &&
    primaryServerDraft != null &&
    !resumeDraftLoading &&
    resumedDraftCampaignId === null;

  const defineDraftBannerName = showServerDraftBanner
    ? (primaryServerDraft?.name?.trim() || "Draft campaign")
    : "";
  const defineDraftBannerAge =
    showServerDraftBanner && primaryServerDraft
      ? formatRelativeAgeFromTimestamp(primaryServerDraft.created_at)
      : "";

  const selectedGoal = useMemo(() => {
    if (!selectedGoalId) return null;
    const want = String(selectedGoalId).trim();
    return campaignGoals.find((g) => String(g.id).trim() === want) ?? null;
  }, [campaignGoals, selectedGoalId]);

  const goalVisual = selectedGoal ? goalNameToVisualKey(selectedGoal.name) : "other";
  const metricDefs = useMemo(() => defaultMetricsForGoal(goalVisual), [goalVisual]);

  const [overlayValues, setOverlayValues] = useState<MetricsOverlayValues>(() => createInitialOverlayValues());

  const omtmDisplay = useMemo(
    () => formatMetricWithAffix(overlayValues.omtmValue, metricDefs.omtm),
    [overlayValues.omtmValue, metricDefs.omtm]
  );
  const kpiDisplays = useMemo(
    () =>
      [0, 1, 2].map((i) =>
        formatMetricWithAffix(overlayValues.kpiValues[i], metricDefs.kpis[i] ?? `KPI ${i + 1}`)
      ) as [string, string, string],
    [overlayValues.kpiValues, metricDefs.kpis]
  );

  /** Load regions from API when available; else defaults */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const api = await fetchRegionsFromApi(token);
      if (!cancelled && api?.length) setRegionsList(api);
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  /** Benchmarks when API ships */
  useEffect(() => {
    if (screen !== 2 || !selectedGoal) return;
    let cancelled = false;
    (async () => {
      const b = await fetchBenchmarks({
        goal: selectedGoal.name,
        businessModel: user?._organizations?.business_model,
        industry: user?._organizations?.industry,
        geo: geographyFromRegions(selectedRegions),
        token,
      });
      if (cancelled || !b?.metrics?.length) return;
      const omtm = b.metrics.find((m) => m.metric_key === b.omtm_key) || b.metrics[0];
      const kpis = b.kpi_keys.map((k) => b.metrics.find((m) => m.metric_key === k)).filter(Boolean) as typeof b.metrics;
      setOverlayValues((prev) => ({
        ...prev,
        omtmValue: stripMetricRawValue(String(omtm?.value ?? prev.omtmValue), metricDefs.omtm),
        kpiValues: [
          stripMetricRawValue(String(kpis[0]?.value ?? prev.kpiValues[0]), metricDefs.kpis[0] ?? "KPI 1"),
          stripMetricRawValue(String(kpis[1]?.value ?? prev.kpiValues[1]), metricDefs.kpis[1] ?? "KPI 2"),
          stripMetricRawValue(String(kpis[2]?.value ?? prev.kpiValues[2]), metricDefs.kpis[2] ?? "KPI 3"),
        ],
      }));
    })();
    return () => {
      cancelled = true;
    };
  }, [screen, selectedGoal, selectedRegions, token, user, metricDefs]);

  /** Pre-fill regions from org country when API exposes it */
  useEffect(() => {
    if (selectedRegions.size > 0) return;
    const org = user?._organizations as { country?: string } | undefined;
    const country = org?.country?.trim();
    if (!country) return;
    const match = DEFAULT_REGIONS.find((r) => r.toLowerCase() === country.toLowerCase());
    if (match) setSelectedRegions(new Set([match]));
  }, [user, selectedRegions.size]);

  const hydrateFromCampaignDetail = useCallback(
    (detail: CampaignDetailResponse) => {
      setCampaignName(detail.name);
      setSelectedGoalId(String(detail.goal_id));
      const geo = detail.geography || "";
      const parts = geo.split(",").map((s) => s.trim()).filter(Boolean);
      if (parts.length) {
        const next = new Set<string>();
        parts.forEach((p) => {
          if (DEFAULT_REGIONS.includes(p) || regionsList.includes(p)) next.add(p);
        });
        if (next.size) setSelectedRegions(next);
      }

      const ids = new Set<string>();
      const adMap: Record<string, string[]> = {};
      const campMap: Record<string, Array<{ id: string; name: string }>> = {};

      (detail._campaign_auth_providers_of_campaigns ?? []).forEach((ap) => {
        const platform = allPlatforms.find((p) => p._authentication?.id === ap.auth_provider_id);
        if (!platform) return;
        ids.add(platform.id);
        const d = ap as {
          ad_accounts?: { id: string | number }[];
          campaigns?: Array<{ id: string | number; name?: string }>;
        };
        if (d.ad_accounts?.length) {
          adMap[platform.id] = d.ad_accounts.map((a) => String(a.id));
        }
        const firstAcc = d.ad_accounts?.[0]?.id != null ? String(d.ad_accounts[0].id) : "";
        if (firstAcc && d.campaigns?.length) {
          campMap[`${platform.id}_${firstAcc}`] = d.campaigns.map((c) => ({
            id: String(c.id),
            name: String(c.name ?? ""),
          }));
        }
      });

      setIncludedChannelIds(ids);
      setSelectedAdAccounts(adMap);
      setSelectedCampaigns(campMap);

      const ctx = detail._campaign_context_of_campaigns as unknown as Record<string, unknown> | undefined;
      if (ctx && typeof ctx === "object") {
        const bt = (ctx.business_type ?? ctx.Business_Type) as string | undefined;
        const interests = Array.isArray(ctx.interests) ? (ctx.interests as unknown[]).map(String) : [];
        const category = ctx.category != null ? String(ctx.category) : "";
        const contextStr = ctx.context != null ? String(ctx.context) : "";
        const comps = Array.isArray(ctx.competitors) ? (ctx.competitors as unknown[]).map(String) : [];
        const ageRange = Array.isArray(ctx.age_range) ? (ctx.age_range as unknown[]).map(String) : [];

        setOverlayValues((prev) => ({
          ...prev,
          ...(String(bt ?? "").trim() && {
            businessModel: String(bt).trim(),
            businessType: String(bt).trim(),
          }),
          ...(category.trim() && { industry: category.trim() }),
          ...(contextStr.trim() && { icp: contextStr.trim() }),
          ...(comps.length > 0 && { competitors: comps.slice(0, 5).join(", ") }),
          ...(interests.length > 0 && { interestsTags: interests.slice(0, 5) }),
          ...(ageRange.length > 0 && { ageRanges: ageRange }),
        }));
      }
    },
    [allPlatforms, regionsList]
  );

  /** Edit mode: hydrate from campaign detail */
  useEffect(() => {
    if (mode !== "edit" || !editingCampaignDetail || allPlatforms.length === 0) return;
    hydrateFromCampaignDetail(editingCampaignDetail);
  }, [mode, editingCampaignDetail, allPlatforms.length, hydrateFromCampaignDetail]);

  /** Fresh draft list when opening the create wizard (LaunchIQ page also invalidates on entry). */
  useEffect(() => {
    if (mode !== "create") return;
    void queryClient.invalidateQueries({ queryKey: ["campaigns"] });
  }, [mode, queryClient]);

  useEffect(() => {
    if (mode === "edit") setResumedDraftCampaignId(null);
  }, [mode]);

  const resumeScreenFromDetail = useCallback((detail: CampaignDetailResponse) => {
    const hasGeo = (detail.geography || "").trim().length > 0;
    const hasChannels = (detail._campaign_auth_providers_of_campaigns?.length ?? 0) > 0;
    setScreen(hasGeo || hasChannels ? 2 : 1);
  }, []);

  const handleResumeDraftFlow = useCallback(async () => {
    if (!(showServerDraftBanner && primaryServerDraft && token)) return;
    setResumeDraftLoading(true);
    setLaunchError(null);
    try {
      const detail = await fetchCampaignDetailApi(String(primaryServerDraft.id), token);
      hydrateFromCampaignDetail(detail);
      resumeScreenFromDetail(detail);
      setResumedDraftCampaignId(String(detail.id));
    } catch (e) {
      setLaunchError(e instanceof Error ? e.message : "Could not load draft campaign");
    } finally {
      setResumeDraftLoading(false);
    }
  }, [showServerDraftBanner, primaryServerDraft, token, hydrateFromCampaignDetail, resumeScreenFromDetail]);

  const handleDiscardDraftFlow = useCallback(async () => {
    if (!(showServerDraftBanner && primaryServerDraft)) return;
    setLaunchError(null);
    try {
      await deleteCampaignAsync({ campaign_id: primaryServerDraft.id });
      await queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    } catch (e) {
      setLaunchError(e instanceof Error ? e.message : "Could not delete draft campaign");
      return;
    }
    setResumedDraftCampaignId(null);
    setScreen(1);
    setCampaignName("");
    setSelectedGoalId("");
    setSelectedRegions(new Set());
    setIncludedChannelIds(new Set());
    setExpandedChannelId(null);
    setSelectedAdAccounts({});
    setAdAccountsByChannel({});
    setLoadingAdAccounts({});
    setSelectedCampaigns({});
    setLandingPages([""]);
    setOverlayValues(createInitialOverlayValues());
  }, [showServerDraftBanner, primaryServerDraft, deleteCampaignAsync, queryClient]);

  const fetchAdAccountsForChannel = useCallback(
    async (channelId: string) => {
      if (fetched.current.has(channelId) || inFlight.current.has(channelId)) return;
      const platform = allPlatforms.find((p) => p.id === channelId);
      const authProviderId = platform?._authentication?.id;
      const platformSlug = platform?.slug;
      if (!authProviderId || !platformSlug || !token) return;

      inFlight.current.add(channelId);
      setLoadingAdAccounts((p) => ({ ...p, [channelId]: true }));
      try {
        const response = await fetch(
          `https://xyfx-hog3-y19r.n7e.xano.io/api:b3UvZDq3/get_available_ad_accounts?auth_provider_id=${authProviderId}`,
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        );
        if (!response.ok) throw new Error("accounts");
        const rawAccounts = await response.json();
        const transformed: AdAccount[] = [];
        rawAccounts.forEach((account: { id: string; name: string; auth_provider_id?: number }) => {
          let displayPlatform = platform?.name || platformSlug;
          let effectivePlatformId = platformSlug;
          if (platformSlug === "facebook_ads") {
            displayPlatform = "Facebook Ads";
            effectivePlatformId = "facebook_ads";
          } else if (platformSlug === "instagram_ads") {
            displayPlatform = "Instagram Ads";
            effectivePlatformId = "instagram_ads";
          }
          transformed.push({
            id: `${effectivePlatformId}_${account.id}`,
            name: account.name,
            platform: displayPlatform,
            platform_id: effectivePlatformId,
            account_id: account.id,
            account_name: account.name,
            auth_provider_id: account.auth_provider_id ?? authProviderId,
          });
        });
        setAdAccountsByChannel((prev) => ({ ...prev, [channelId]: transformed }));
        fetched.current.add(channelId);

        setSelectedAdAccounts((prev) => {
          if (prev[channelId]?.length) return prev;
          const linked = platform?._authentication?._linked_accounts;
          if (linked && linked.length > 0) {
            const ids = linked
              .map((l) => l.connection_id)
              .filter((id): id is string => typeof id === "string" && id.length > 0);
            if (ids.length > 0) return { ...prev, [channelId]: ids };
          }
          if (transformed[0]) {
            return { ...prev, [channelId]: [transformed[0].account_id] };
          }
          return prev;
        });
      } catch {
        /* ignore */
      } finally {
        setLoadingAdAccounts((p) => ({ ...p, [channelId]: false }));
        inFlight.current.delete(channelId);
      }
    },
    [allPlatforms, token]
  );

  const toggleRegion = (r: string) => {
    setSelectedRegions((prev) => {
      const next = new Set(prev);
      if (next.has(r)) next.delete(r);
      else next.add(r);
      return next;
    });
  };

  const toggleChannelIncluded = (channelId: string) => {
    setIncludedChannelIds((prev) => {
      const next = new Set(prev);
      if (next.has(channelId)) {
        next.delete(channelId);
        setSelectedAdAccounts((a) => {
          const c = { ...a };
          delete c[channelId];
          return c;
        });
        setSelectedCampaigns((c) => {
          const o = { ...c };
          Object.keys(o).forEach((k) => {
            if (k.startsWith(`${channelId}_`)) delete o[k];
          });
          return o;
        });
      } else {
        next.add(channelId);
        void fetchAdAccountsForChannel(channelId);
      }
      return next;
    });
  };

  /** Include channel in campaign without toggling off (e.g. first campaign selected while row was unchecked). */
  const ensureChannelIncluded = useCallback(
    (channelId: string) => {
      setIncludedChannelIds((prev) => {
        if (prev.has(channelId)) return prev;
        const next = new Set(prev).add(channelId);
        void fetchAdAccountsForChannel(channelId);
        return next;
      });
    },
    [fetchAdAccountsForChannel]
  );

  /** Ensure an ad account is selected (idempotent) — used when opening campaigns from the card caption. */
  const ensureAdAccountSelected = useCallback((channelId: string, accountId: string) => {
    setSelectedAdAccounts((prev) => {
      const cur = prev[channelId] || [];
      if (cur.includes(accountId)) return prev;
      return { ...prev, [channelId]: [...cur, accountId] };
    });
  }, []);

  const toggleCampaign = (accountKey: string, campaignId: string, campaignName: string) => {
    setSelectedCampaigns((prev) => {
      const list = prev[accountKey] || [];
      const has = list.some((c) => c.id === campaignId);
      const next = has ? list.filter((c) => c.id !== campaignId) : [...list, { id: campaignId, name: campaignName }];
      return { ...prev, [accountKey]: next };
    });
  };

  /** Linked accounts from GET /platforms — same source as Channels page cards. */
  const linkedAccountsByChannel = useMemo(() => {
    const m: Record<string, LinkedAccount[]> = {};
    for (const p of platformsForUi) {
      const list = p._authentication?._linked_accounts;
      if (list?.length) m[p.id] = list;
    }
    return m;
  }, [platformsForUi]);

  /** Align selection with GET /platforms linked accounts when nothing selected yet (matches Channels page). */
  useEffect(() => {
    if (screen !== 2) return;
    setSelectedAdAccounts((prev) => {
      let next: Record<string, string[]> | null = null;
      const touch = () => {
        if (!next) next = { ...prev };
        return next;
      };
      for (const p of platformsForUi) {
        if (p._authentication?.status !== "connected") continue;
        const ch = p.id;
        if ((prev[ch]?.length ?? 0) > 0) continue;
        const linked = p._authentication?._linked_accounts;
        if (!linked?.length) continue;
        const ids = linked
          .map((l) => l.connection_id)
          .filter((id): id is string => typeof id === "string" && id.length > 0);
        if (ids.length === 0) continue;
        touch()[ch] = ids;
      }
      return next ?? prev;
    });
  }, [screen, platformsForUi]);

  /** All tenant-connected channels (Review list — inclusion is per-checkbox, default off). */
  const connectedChannelsOnly = useMemo(
    () =>
      platformsForUi
        .filter((p) => p._authentication?.status === "connected")
        .map((p) => ({
          platformId: p.id,
          slug: p.slug,
          /** Same heading as Channels grid: platform `name` from API. */
          platformName: p.name,
          title: displayChannelName(p.slug, p.name),
          category: p.category,
          authProviderId: p._authentication!.id as number,
          logoUrl: p.logo?.url ?? null,
        })),
    [platformsForUi]
  );

  const totalConnectedChannels = connectedChannelsOnly.length;

  const allPlans = useMemo((): Plan[] => {
    if (!plansRaw) return [];
    if (Array.isArray(plansRaw)) return plansRaw as Plan[];
    const wrapped = plansRaw as { plans?: Plan[] };
    return Array.isArray(wrapped.plans) ? wrapped.plans : [];
  }, [plansRaw]);

  const currentPlanFromCatalog = useMemo(() => {
    const planId = user?._subscription?.plan_id;
    if (planId == null) return null;
    return allPlans.find((p) => p.id === planId) ?? null;
  }, [allPlans, user?._subscription?.plan_id]);

  const currentPlanTitle =
    currentPlanFromCatalog?.plan_title?.trim() ||
    user?._subscription?._plan?.plan_title?.trim() ||
    "Plan";

  /** Plan channel-connection allowance from `get_all_plans` (`unit_amount` on matched plan). */
  const planChannelAllowance =
    currentPlanFromCatalog?.unit_amount ?? user?._subscription?._plan?.unit_amount ?? 0;

  const channelUsageLabel =
    planChannelAllowance > 0
      ? `${totalConnectedChannels}/${planChannelAllowance}`
      : String(totalConnectedChannels);

  const channelUsageBarPct =
    planChannelAllowance > 0
      ? Math.min(100, Math.round((totalConnectedChannels / planChannelAllowance) * 1000) / 10)
      : 0;

  const checkedChannelsForCampaign = useMemo(
    () => connectedChannelsOnly.filter((c) => includedChannelIds.has(c.platformId)).length,
    [connectedChannelsOnly, includedChannelIds]
  );

  const channelsSummaryTag = `${checkedChannelsForCampaign} selected · ${totalConnectedChannels} connected`;

  /**
   * Preload ad accounts only for channels already included in the campaign.
   * Avoids calling `get_available_ad_accounts` for every connected platform (noisy 500s, slower resume).
   */
  useEffect(() => {
    if (screen !== 2) return;
    for (const p of platformsForUi) {
      if (p._authentication?.status !== "connected") continue;
      if (!includedChannelIds.has(p.id)) continue;
      void fetchAdAccountsForChannel(p.id);
    }
  }, [screen, platformsForUi, includedChannelIds, fetchAdAccountsForChannel]);

  const validateLaunch = (): string | null => {
    if (selectedRegions.size === 0) return "Select at least one campaign region.";
    if (goalVisual === "conversion" && !overlayValues.revenueTarget.trim())
      return "Revenue target is required for Conversion campaigns.";

    const connectedForValidation = connectedChannelsOnly.map((c) => ({
      platformId: c.platformId,
      title: c.title,
    }));
    const errInclude = validateAtLeastOneConnectedChannelIncluded(connectedForValidation, includedChannelIds);
    if (errInclude) return errInclude;

    const includedConnected = platformsForUi.filter(
      (p) => includedChannelIds.has(p.id) && p._authentication?.status === "connected"
    );
    if (includedConnected.length === 0) return "Include at least one connected channel.";
    for (const p of includedConnected) {
      const acc = selectedAdAccounts[p.id] || [];
      if (acc.length === 0) return `Select at least one ad account for ${displayChannelName(p.slug, p.name)}.`;
    }

    const errCampaigns = validateCampaignSelectionForIncludedChannels(
      connectedForValidation,
      includedChannelIds,
      selectedCampaigns
    );
    if (errCampaigns) return errCampaigns;

    return null;
  };

  const buildAuthProvidersPayload = () => {
    return Array.from(includedChannelIds)
      .map((channelId) => {
        const platform = allPlatforms.find((p) => p.id === channelId);
        const authProviderId = platform?._authentication?.id;
        if (!authProviderId) return null;
        const channelAccountIds = selectedAdAccounts[channelId] || [];
        const channelAccounts = adAccountsByChannel[channelId] || [];
        const ad_accounts = channelAccountIds
          .map((accountId) => {
            const account = channelAccounts.find((acc) => acc.account_id === accountId);
            if (!account) return null;
            return { id: account.account_id, name: account.account_name };
          })
          .filter((x): x is { id: string; name: string } => x !== null);

        const campaignsForThisProvider: Array<{ id: string; name: string }> = [];
        channelAccountIds.forEach((accountId) => {
          const accountKey = `${channelId}_${accountId}`;
          (selectedCampaigns[accountKey] || []).forEach((c) => {
            if (!campaignsForThisProvider.find((x) => x.id === c.id)) campaignsForThisProvider.push(c);
          });
        });

        return {
          auth_provider_id: authProviderId,
          ...(ad_accounts.length > 0 && { ad_accounts }),
          ...(campaignsForThisProvider.length > 0 && { campaigns: campaignsForThisProvider }),
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
  };

  /** First time through Define: POST a server `draft` row, then Review uses PATCH on launch. */
  const handleDefineContinue = useCallback(() => {
    setLaunchError(null);
    if (mode === "edit" && editingCampaignId) {
      setScreen(2);
      return;
    }
    if (resumedDraftCampaignId) {
      setScreen(2);
      return;
    }
    if (!user?.organizations_id) {
      setLaunchError("Missing organization.");
      return;
    }
    const name = campaignName.trim();
    const goalId = parseInt(selectedGoalId, 10);
    if (!name || !selectedGoalId || !Number.isFinite(goalId)) return;

    const payload: CreateCampaignPayload = {
      name,
      goal_id: goalId,
      organizations_id: user.organizations_id,
      status: "draft",
    };

    createCampaign(payload, {
      onSuccess: (data) => {
        const rawId = data.campaign?.id;
        if (typeof rawId !== "number" || !Number.isFinite(rawId)) {
          setLaunchError("Campaign could not be saved. Please try again.");
          return;
        }
        setResumedDraftCampaignId(String(rawId));
        setScreen(2);
      },
      onError: (e) => setLaunchError(e.message),
    });
  }, [
    mode,
    editingCampaignId,
    resumedDraftCampaignId,
    user?.organizations_id,
    campaignName,
    selectedGoalId,
    createCampaign,
  ]);

  const handleLaunch = () => {
    setLaunchError(null);
    const err = validateLaunch();
    if (err) {
      setLaunchError(err);
      return;
    }
    if (!user?.organizations_id) {
      setLaunchError("Missing organization.");
      return;
    }
    if (!selectedGoalId) {
      setLaunchError("Select a goal.");
      return;
    }

    const interestsArray = overlayValues.interestsTags.slice(0, 3);
    const geography = geographyFromRegions(selectedRegions);
    const auth_providers = buildAuthProvidersPayload();

    const payload = {
      name: campaignName.trim(),
      goal_id: parseInt(selectedGoalId, 10),
      geography,
      auth_providers,
      organizations_id: user.organizations_id,
      status: "active" as const,
      ...(overlayValues.businessModel && { business_type: overlayValues.businessModel }),
      ...(overlayValues.ageRanges.length > 0 && {
        age_range: normalizeAgeRangesForApi(overlayValues.ageRanges),
      }),
      ...(interestsArray.length > 0 && { interests: interestsArray }),
      ...(overlayValues.industry && { category: overlayValues.industry }),
      ...(overlayValues.icp && { context_description: overlayValues.icp }),
    };

    const connectedSummaries = platformsForUi
      .filter((p) => includedChannelIds.has(p.id) && p._authentication?.status === "connected")
      .map((p) => {
        const n = displayChannelName(p.slug, p.name);
        const keys = Object.keys(selectedCampaigns).filter((k) => k.startsWith(`${p.id}_`));
        let count = 0;
        keys.forEach((k) => {
          count += selectedCampaigns[k]?.length || 0;
        });
        const accN = (selectedAdAccounts[p.id] || []).length;
        const label = count > 0 ? `·${count}` : accN > 0 ? `·${accN} acct` : "";
        return { name: n, count: label || "·0" };
      });

    const gen = ++launchGeneration.current;
    setSuccessSnapshot({
      name: campaignName.trim(),
      goal: selectedGoal?.name || "",
      regions: geography,
      channels: connectedSummaries,
      omtm: metricDefs.omtm,
      kpis: metricDefs.kpis.join(" · "),
      costMetric: metricDefs.kpis[2] ?? "",
    });
    setScreen(3);
    setPipelineInitializing(true);

    const onLaunchSuccess = (apiData?: unknown) => {
      if (launchGeneration.current !== gen) return;
      const rec = apiData as { campaign?: { id?: number }; id?: number } | undefined;
      const fromApi =
        rec && typeof rec.campaign?.id === "number"
          ? String(rec.campaign.id)
          : rec && typeof rec.id === "number"
            ? String(rec.id)
            : null;
      const fromFlow =
        mode === "edit" && editingCampaignId
          ? editingCampaignId
          : resumedDraftCampaignId
            ? resumedDraftCampaignId
            : null;
      insightsLinkCampaignIdRef.current = fromApi ?? fromFlow;
      setResumedDraftCampaignId(null);
      setPipelineInitializing(false);
      void queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      // Stay on screen 3 (LaunchScreen) until the user leaves via header Back or another explicit action.
      // Do not call onComplete here — that unmounted the flow and returned to the list immediately.
    };

    const onError = (e: Error) => {
      if (launchGeneration.current !== gen) return;
      setPipelineInitializing(false);
      setSuccessSnapshot(null);
      setScreen(2);
      setLaunchError(e.message);
    };

    if (mode === "edit" && editingCampaignId) {
      const { organizations_id: _org, ...updateBody } = payload;
      updateCampaign(
        { ...updateBody, campaign_id: Number(editingCampaignId) },
        {
          onSuccess: (data) => onLaunchSuccess(data),
          onError: (e) => onError(e),
        }
      );
    } else if (resumedDraftCampaignId) {
      const { organizations_id: _org, ...updateBody } = payload;
      updateCampaign(
        { ...updateBody, campaign_id: Number(resumedDraftCampaignId) },
        {
          onSuccess: (data) => onLaunchSuccess(data),
          onError: (e) => onError(e),
        }
      );
    } else {
      createCampaign(payload, {
        onSuccess: (data) => onLaunchSuccess(data),
        onError: (e) => onError(e),
      });
    }
  };

  const handleGoToInsightsIQ = useCallback(() => {
    const cid = insightsLinkCampaignIdRef.current?.trim();
    insightsLinkCampaignIdRef.current = null;
    router.push(cid ? `/insightsiq?campaign_id=${encodeURIComponent(cid)}` : "/insightsiq");
  }, [router]);

  const handleCreateAnother = useCallback(() => {
    insightsLinkCampaignIdRef.current = null;
    setSuccessSnapshot(null);
    setLaunchError(null);
    setResumedDraftCampaignId(null);
    setPipelineInitializing(false);
    setScreen(1);
    setCampaignName("");
    setSelectedGoalId("");
    setSelectedRegions(new Set());
    setIncludedChannelIds(new Set());
    setExpandedChannelId(null);
    setSelectedAdAccounts({});
    setAdAccountsByChannel({});
    setLoadingAdAccounts({});
    setSelectedCampaigns({});
    setLandingPages([""]);
    setOverlayOpen(false);
    setOverlayValues(createInitialOverlayValues());
    inFlight.current.clear();
    fetched.current.clear();
    void queryClient.invalidateQueries({ queryKey: ["campaigns"] });
  }, [queryClient]);

  const handleHeaderBack = useCallback(() => {
    if (screen === 1) {
      onBack();
      return;
    }
    if (screen === 3 && successSnapshot) {
      if (isCreating || isUpdating) launchGeneration.current += 1;
      setPipelineInitializing(false);
      insightsLinkCampaignIdRef.current = null;
      const snap = successSnapshot;
      onComplete({
        name: snap.name,
        goal: snap.goal,
        market: snap.regions,
        channels: snap.channels.map((c, i) => ({
          id: String(i),
          name: c.name,
          icon: "🔗",
        })),
      });
      return;
    }
    if (screen === 3) {
      if (isCreating || isUpdating) launchGeneration.current += 1;
      setSuccessSnapshot(null);
      setPipelineInitializing(false);
    }
    setScreen((s) => (s > 1 ? ((s - 1) as Screen) : s));
  }, [onBack, screen, isCreating, isUpdating, successSnapshot, onComplete]);

  const stepClass = (s: Screen) =>
    cn(
      "flex items-center gap-1.5 px-3.5 text-[13px] transition-colors",
      screen === s && "font-semibold text-[#1d1d1f]",
      screen > s && "font-semibold text-[#6366F1]",
      screen < s && "font-normal text-[#aeaeb2]"
    );

  const dotClass = (s: Screen) =>
    cn(
      "h-1.5 w-1.5 rounded-full bg-[#aeaeb2] opacity-25 transition-all [transition-timing-function:var(--launchiq-spring)]",
      screen === s && "h-2 w-2 bg-[#6366F1] opacity-100 shadow-[0_0_12px_rgba(99,102,241,0.3)]",
      screen > s && "bg-[#6366F1] opacity-50"
    );

  const lineClass = (after: Screen) =>
    cn(
      "h-px w-9 bg-[#aeaeb2] opacity-20 transition-all",
      screen > after && "bg-[#6366F1] opacity-35"
    );

  if (goalsLoading || platformsLoading || (mode === "create" && campaignsListLoading)) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-[#6e6e73]">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-8">
      <header className="fixed left-0 right-0 top-0 z-[100] flex min-h-14 items-center border-b border-indigo-500/[0.06] bg-[rgba(250,250,254,0.72)] px-9 py-1.5 backdrop-blur-xl">
        <button
          type="button"
          onClick={handleHeaderBack}
          className="flex min-w-[120px] items-center gap-1 text-sm font-medium text-[#6366F1] hover:opacity-60"
        >
          <ChevronLeft className="h-4 w-4" />
          {screen === 1 ? "LaunchIQ" : "Back"}
        </button>
        <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 py-0.5">
          <div className="flex items-center justify-center gap-0">
            <div className={stepClass(1)}>
              <span className={dotClass(1)} />
              Define
            </div>
            <div className={lineClass(1)} />
            <div className={stepClass(2)}>
              <span className={dotClass(2)} />
              Review
            </div>
            <div className={lineClass(2)} />
            <div className={stepClass(3)}>
              <span className={dotClass(3)} />
              Launch
            </div>
          </div>
        </div>
        <div className="flex min-w-[120px] max-w-[min(40vw,220px)] justify-end">
          <div
            className="flex min-w-0 items-center gap-1.5 rounded-[10px] border border-white/45 bg-[rgba(255,255,255,0.65)] px-3.5 py-1.5 text-[11px] font-medium text-[#6366F1] backdrop-blur-sm"
            title="Current subscription plan"
          >
            <span className="truncate">{currentPlanTitle}</span>
            <span className="inline-block h-[2.5px] w-9 shrink-0 overflow-hidden rounded-sm bg-indigo-100">
              <span
                className="block h-full bg-[#6366F1] transition-[width]"
                style={{ width: `${channelUsageBarPct}%` }}
              />
            </span>
            <span className="truncate">{channelUsageLabel}</span>
          </div>
        </div>
      </header>

      {screen === 1 && (
        <DefineScreen
          campaignName={campaignName}
          onNameChange={setCampaignName}
          goals={campaignGoals}
          selectedGoalId={selectedGoalId}
          onSelectGoal={setSelectedGoalId}
          showDraftBanner={showServerDraftBanner}
          draftName={defineDraftBannerName}
          draftAgeLabel={defineDraftBannerAge}
          onResumeDraft={() => void handleResumeDraftFlow()}
          onDiscardDraft={() => void handleDiscardDraftFlow()}
          canContinue={campaignName.trim() !== "" && selectedGoalId !== ""}
          onContinue={handleDefineContinue}
          continuePending={isCreating && screen === 1}
          draftBannerLoading={resumeDraftLoading}
          errorMessage={launchError}
        />
      )}

      {screen === 2 && !selectedGoal && selectedGoalId ? (
        <div className="launchiq-screen-enter mx-auto max-w-[580px] px-6 pb-40 pt-[100px]">
          <h1 className="mb-3 text-[28px] font-bold tracking-tight text-[#1d1d1f]">Goal could not be loaded</h1>
          <p className="mb-6 text-[15px] leading-relaxed text-[#6e6e73]">
            This draft uses goal id <span className="font-mono text-[#1d1d1f]">{selectedGoalId}</span>, which does not
            match the current goals list. Go back to Define and select a goal, or contact support if this persists.
          </p>
          <button
            type="button"
            onClick={() => setScreen(1)}
            className="rounded-[14px] bg-[#6366F1] px-5 py-3 text-[15px] font-semibold text-white hover:opacity-90"
          >
            Back to Define
          </button>
        </div>
      ) : null}

      {screen === 2 && selectedGoal && (
        <>
          <ReviewScreen
            goalLabel={selectedGoal.name}
            regions={regionsList}
            selectedRegions={selectedRegions}
            onToggleRegion={toggleRegion}
            omtmLabel={metricDefs.omtm}
            omtmValue={omtmDisplay}
            kpiLabels={[metricDefs.kpis[0], metricDefs.kpis[1], metricDefs.kpis[2]]}
            kpiValues={kpiDisplays}
            onEditMetrics={() => setOverlayOpen(true)}
            selectedChannelTag={channelsSummaryTag}
            connectedChannels={connectedChannelsOnly}
            includedChannelIds={includedChannelIds}
            expandedChannelId={expandedChannelId}
            onExpandedChannelChange={setExpandedChannelId}
            onToggleChannelIncluded={toggleChannelIncluded}
            onEnsureAdAccountSelected={ensureAdAccountSelected}
            onEnsureChannelIncluded={ensureChannelIncluded}
            onCampaignToggle={toggleCampaign}
            loadingAdAccounts={loadingAdAccounts}
            adAccountsByChannel={adAccountsByChannel}
            linkedAccountsByChannel={linkedAccountsByChannel}
            selectedAdAccounts={selectedAdAccounts}
            selectedCampaigns={selectedCampaigns}
            landingPages={landingPages}
            onLandingPagesChange={setLandingPages}
            utmCampaign={campaignName.trim().replace(/\s+/g, "_").slice(0, 40)}
            revenueVisible={goalVisual === "conversion"}
            revenueValue={overlayValues.revenueTarget}
            onRevenueChange={(v) => setOverlayValues((o) => ({ ...o, revenueTarget: v }))}
            launchError={launchError}
            onLaunch={handleLaunch}
            isLaunching={isCreating || isUpdating}
          />
          <MetricsOverlay
            open={overlayOpen}
            onOpenChange={setOverlayOpen}
            goalLabel={selectedGoal.name}
            omtmLabel={metricDefs.omtm}
            kpiLabels={[metricDefs.kpis[0], metricDefs.kpis[1], metricDefs.kpis[2]]}
            initial={overlayValues}
            onApply={setOverlayValues}
          />
        </>
      )}

      {screen === 3 && successSnapshot && (
        <LaunchScreen
          campaignName={successSnapshot.name}
          goalLabel={successSnapshot.goal}
          regionsLabel={successSnapshot.regions}
          channelSummaries={successSnapshot.channels}
          omtmLabel={successSnapshot.omtm}
          kpiSummary={successSnapshot.kpis}
          costMetricLabel={successSnapshot.costMetric}
          initializing={pipelineInitializing}
          onGoToInsightsIQ={handleGoToInsightsIQ}
          onCreateAnother={handleCreateAnother}
        />
      )}

      {connectionDrawer.open && connectionDrawer.channelId && (
        <ConnectionDrawer
          isOpen={connectionDrawer.open}
          onClose={() => setConnectionDrawer({ open: false, channelId: null })}
          channelName={displayChannelName(
            allPlatforms.find((x) => x.id === connectionDrawer.channelId)?.slug || "",
            allPlatforms.find((x) => x.id === connectionDrawer.channelId)?.name || ""
          )}
          channelIcon="🔗"
          onConnect={() => {
            if (connectionDrawer.channelId) {
              setIncludedChannelIds((prev) => new Set(prev).add(connectionDrawer.channelId!));
            }
            setConnectionDrawer({ open: false, channelId: null });
          }}
        />
      )}
    </div>
  );
}
