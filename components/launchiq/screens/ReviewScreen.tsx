"use client";

import { useCallback, useEffect, useMemo, useState, type KeyboardEvent, type MouseEvent } from "react";
import { MetricHero } from "@/components/launchiq/components/MetricHero";
import { MetricKPI } from "@/components/launchiq/components/MetricKPI";
import { RegionSelector } from "@/components/launchiq/components/RegionSelector";
import { LandingPageSection } from "@/components/launchiq/components/LandingPageSection";
import { useMultiAccountCampaigns } from "@/hooks/use-account-campaigns";
import type { AdAccount } from "@/hooks/use-campaign-ad-accounts";
import type { LinkedAccount } from "@/hooks/use-platforms";
import {
  validateAtLeastOneConnectedChannelIncluded,
  validateCampaignSelectionForIncludedChannels,
} from "@/components/launchiq/lib/validate-review-channels";

const REVIEW_CH_PREVIEW = 3;

function truncateAccountId(id: string | number | null | undefined, head = 10): string {
  const s = id == null ? "" : String(id);
  if (s.length <= head + 3) return s;
  return `${s.slice(0, head)}…`;
}

/**
 * One-line caption: same resolution order as Channels page — `GET /platforms` linked
 * (`ad_account_name` + `connection_id`) first, then `get_available_ad_accounts` rows.
 */
function selectedAccountsCaption(
  accounts: AdAccount[],
  selectedIds: string[],
  loading: boolean,
  linked: LinkedAccount[]
): string {
  const idOrder =
    selectedIds.length > 0
      ? selectedIds
      : linked.map((l) => l.connection_id).filter((id): id is string => typeof id === "string" && id.length > 0);

  if (idOrder.length === 0) {
    if (loading && accounts.length === 0 && linked.length === 0) return "Syncing ad accounts…";
    if (!loading && accounts.length === 0 && linked.length === 0) return "No ad accounts linked";
    return "No ad account selected — expand to choose";
  }

  const resolved = idOrder
    .map((id) => {
      const link = linked.find((l) => l.connection_id === id);
      if (link) return { name: link.ad_account_name, id };
      const acc = accounts.find((a) => a.account_id === id);
      if (acc) return { name: acc.account_name, id };
      return null;
    })
    .filter((x): x is { name: string; id: string } => Boolean(x));
  if (resolved.length === 0) return "Selected account not found — expand to refresh";

  if (resolved.length === 1) {
    const a = resolved[0];
    return `${a.name} · ${truncateAccountId(a.id)}`;
  }
  if (resolved.length === 2) {
    return `${resolved[0].name} · ${resolved[1].name}`;
  }
  return `${resolved[0].name} · ${resolved[1].name} · +${resolved.length - 2} more`;
}

/** Primary ad account id: selected, else first platform-linked account, else first available row. */
function primaryAccountIdForCard(
  accounts: AdAccount[],
  selectedIds: string[],
  linked: LinkedAccount[]
): string | null {
  if (selectedIds.length > 0) return selectedIds[0];
  const firstLinked = linked.find((l) => l.connection_id)?.connection_id;
  if (firstLinked) return firstLinked;
  if (accounts.length > 0) return accounts[0].account_id;
  return null;
}

function ReviewChannelFlatCampaignList({
  channelId,
  authProviderId,
  accountIds,
  selectedCampaigns,
  onCampaignToggle,
  onEnsureChannelIncluded,
  channelIncluded,
  fetchEnabled,
  onCampaignListCount,
}: {
  channelId: string;
  authProviderId: number;
  accountIds: string[];
  selectedCampaigns: Record<string, Array<{ id: string; name: string }>>;
  onCampaignToggle: (accountKey: string, campaignId: string, campaignName: string) => void;
  onEnsureChannelIncluded: (channelId: string) => void;
  channelIncluded: boolean;
  fetchEnabled: boolean;
  onCampaignListCount: (channelId: string, count: number) => void;
}) {
  const results = useMultiAccountCampaigns(authProviderId, accountIds, {
    enabled: fetchEnabled && accountIds.length > 0,
  });

  const flatRows = useMemo(() => {
    const rows: Array<{
      accountKey: string;
      campaign_id: string;
      campaign_name: string;
    }> = [];
    accountIds.forEach((accountId, idx) => {
      const camps = results[idx]?.data?.campaigns;
      if (!camps?.length) return;
      for (const c of camps) {
        rows.push({
          accountKey: `${channelId}_${accountId}`,
          campaign_id: c.campaign_id,
          campaign_name: c.campaign_name,
        });
      }
    });
    return rows;
  }, [channelId, accountIds, results]);

  useEffect(() => {
    if (!fetchEnabled) return;
    onCampaignListCount(channelId, flatRows.length);
  }, [channelId, fetchEnabled, flatRows.length, onCampaignListCount]);

  const loading =
    fetchEnabled &&
    accountIds.length > 0 &&
    results.some((r) => r.isLoading || r.isFetching);
  const showLoading = loading && flatRows.length === 0;
  const anyErr = results.some((r) => r.isError);

  const handleToggle = (accountKey: string, cId: string, cName: string) => {
    const wasSelected = (selectedCampaigns[accountKey] || []).some((x) => x.id === cId);
    if (!wasSelected && !channelIncluded) {
      onEnsureChannelIncluded(channelId);
    }
    onCampaignToggle(accountKey, cId, cName);
  };

  if (!fetchEnabled) return null;

  return (
    <>
      {showLoading && <p className="launchiq-review-cp-status">Loading campaigns…</p>}
      {anyErr && !showLoading && (
        <p className="launchiq-review-cp-status launchiq-review-cp-status--err">
          Some campaigns could not be loaded.
        </p>
      )}
      {!showLoading && flatRows.length === 0 && !anyErr && accountIds.length > 0 && (
        <p className="launchiq-review-cp-status">No campaigns for this ad account.</p>
      )}
      {flatRows.length > 0 && (
        <ul className="launchiq-review-cp-list" role="list">
          {flatRows.map((r) => {
            const checked = (selectedCampaigns[r.accountKey] || []).some(
              (x) => String(x.id) === String(r.campaign_id)
            );
            return (
              <li key={`${r.accountKey}_${String(r.campaign_id)}`} className="launchiq-review-cp-li">
                <label className="launchiq-review-cp-label">
                  <input
                    type="checkbox"
                    className="launchiq-review-cp-cb"
                    checked={checked}
                    onChange={() =>
                      handleToggle(r.accountKey, String(r.campaign_id), r.campaign_name)
                    }
                  />
                  <span className="launchiq-review-cp-cname">{r.campaign_name}</span>
                  <span className="launchiq-review-cp-cid launchiq-mono" title={String(r.campaign_id)}>
                    {truncateAccountId(r.campaign_id, 14)}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

export type ReviewConnectedChannel = {
  platformId: string;
  slug: string;
  /** Raw platform name from GET /platforms (Channels card title). */
  platformName: string;
  title: string;
  category: string;
  authProviderId: number;
  logoUrl: string | null;
};

function ReviewConnectedChannelRow({
  row,
  included,
  expanded,
  accounts,
  linkedAccounts,
  loading,
  selectedIds,
  selectedCampaigns,
  onToggleChannelIncluded,
  onExpandedChannelChange,
  onEnsureAdAccountSelected,
  onEnsureChannelIncluded,
  onCampaignToggle,
}: {
  row: ReviewConnectedChannel;
  included: boolean;
  expanded: boolean;
  accounts: AdAccount[];
  linkedAccounts: LinkedAccount[];
  loading: boolean;
  selectedIds: string[];
  selectedCampaigns: Record<string, Array<{ id: string; name: string }>>;
  onToggleChannelIncluded: (channelId: string) => void;
  onExpandedChannelChange: (id: string | null) => void;
  onEnsureAdAccountSelected: (channelId: string, accountId: string) => void;
  onEnsureChannelIncluded: (channelId: string) => void;
  onCampaignToggle: (accountKey: string, campaignId: string, campaignName: string) => void;
}) {
  const [fetchedListTotal, setFetchedListTotal] = useState(0);

  useEffect(() => {
    if (!included) setFetchedListTotal(0);
  }, [included]);

  const onListCount = useCallback((_channelId: string, n: number) => {
    setFetchedListTotal(n);
  }, []);

  const caption = selectedAccountsCaption(accounts, selectedIds, loading, linkedAccounts);
  const captionClickable =
    !loading && (accounts.length > 0 || linkedAccounts.some((l) => l.connection_id));
  const primaryId = primaryAccountIdForCard(accounts, selectedIds, linkedAccounts);

  const effectiveAccountIds = useMemo(() => {
    if (selectedIds.length > 0) return selectedIds;
    const fromLinked = linkedAccounts
      .map((l) => l.connection_id)
      .filter((id): id is string => typeof id === "string" && id.length > 0);
    if (fromLinked.length > 0) return fromLinked;
    const first = accounts[0]?.account_id;
    return first ? [first] : [];
  }, [selectedIds, accounts, linkedAccounts]);

  const openCampaignsFromCaption = () => {
    if (!captionClickable || !primaryId) return;
    onEnsureAdAccountSelected(row.platformId, primaryId);
    onExpandedChannelChange(row.platformId);
  };

  const handleCaptionClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    openCampaignsFromCaption();
  };

  const handleCaptionKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      openCampaignsFromCaption();
    }
  };

  const handleRowToggle = () => {
    if (expanded) {
      onExpandedChannelChange(null);
    } else {
      const primary = primaryAccountIdForCard(accounts, selectedIds, linkedAccounts);
      if (primary && selectedIds.length === 0) {
        onEnsureAdAccountSelected(row.platformId, primary);
      }
      onExpandedChannelChange(row.platformId);
    }
  };

  return (
    <div className="launchiq-review-ch-block my-2">
      <div
        role="button"
        tabIndex={0}
        className="launchiq-review-ch-row"
        onClick={handleRowToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleRowToggle();
          }
        }}
      >
        <button
          type="button"
          className="launchiq-review-ch-ck"
          data-on={included}
          aria-checked={included}
          title={included ? "Included in campaign" : "Not included"}
          onClick={(e) => {
            e.stopPropagation();
            onToggleChannelIncluded(row.platformId);
          }}
        >
          {included ? "✓" : ""}
        </button>
        <div className="launchiq-review-ch-ic" aria-hidden>
          {row.logoUrl ? (
            <img src={row.logoUrl} alt="" className="launchiq-review-ch-ic-img" />
          ) : (
            <span aria-hidden>◆</span>
          )}
        </div>
        <div className="launchiq-review-ch-inf">
          <div className="launchiq-review-ch-nm">{row.platformName}</div>
          <div
            className="launchiq-review-ch-ct"
            title={caption}
            data-clickable={captionClickable ? "true" : "false"}
            role={captionClickable ? "button" : undefined}
            tabIndex={captionClickable ? 0 : undefined}
            onClick={captionClickable ? handleCaptionClick : undefined}
            onKeyDown={captionClickable ? handleCaptionKeyDown : undefined}
          >
            {caption}
          </div>
        </div>
        {/* <span className="launchiq-review-ch-pill" data-zr={fetchedListTotal === 0}>
          {fetchedListTotal}
        </span> */}
        <span className="launchiq-review-ch-arrow" data-open={expanded} aria-hidden>
          ›
        </span>
      </div>
      {expanded && (
        <div className="launchiq-ch-campaigns max-h-[min(50vh,320px)] animate-in fade-in slide-in-from-top-1 overflow-y-auto py-2 duration-200">
          {loading && accounts.length === 0 && linkedAccounts.length === 0 && (
            <p className="py-2.5 text-xs font-light text-[#aeaeb2]">Loading accounts…</p>
          )}
          {!loading && accounts.length === 0 && linkedAccounts.length === 0 && (
            <p className="py-2.5 text-xs font-light text-[#aeaeb2]">No ad accounts linked for this channel.</p>
          )}
          {!loading && effectiveAccountIds.length === 0 && (accounts.length > 0 || linkedAccounts.length > 0) && (
            <p className="py-2.5 text-xs font-light text-[#aeaeb2]">No ad account available.</p>
          )}
          {effectiveAccountIds.length > 0 && (
            <ReviewChannelFlatCampaignList
              channelId={row.platformId}
              authProviderId={row.authProviderId}
              accountIds={effectiveAccountIds}
              selectedCampaigns={selectedCampaigns}
              onCampaignToggle={onCampaignToggle}
              onEnsureChannelIncluded={onEnsureChannelIncluded}
              channelIncluded={included}
              fetchEnabled={expanded}
              onCampaignListCount={onListCount}
            />
          )}
        </div>
      )}
    </div>
  );
}

export function ReviewScreen({
  goalLabel,
  regions,
  selectedRegions,
  onToggleRegion,
  omtmLabel,
  omtmValue,
  omtmConfidence,
  kpiLabels,
  kpiValues,
  kpiConfidences,
  onEditMetrics,
  selectedChannelTag,
  connectedChannels,
  includedChannelIds,
  expandedChannelId,
  onExpandedChannelChange,
  onToggleChannelIncluded,
  onEnsureAdAccountSelected,
  onEnsureChannelIncluded,
  onCampaignToggle,
  loadingAdAccounts,
  adAccountsByChannel,
  linkedAccountsByChannel,
  selectedAdAccounts,
  selectedCampaigns,
  landingPages,
  onLandingPagesChange,
  utmCampaign,
  revenueVisible,
  revenueValue,
  onRevenueChange,
  launchError,
  onLaunch,
  isLaunching,
}: {
  goalLabel: string;
  regions: string[];
  selectedRegions: Set<string>;
  onToggleRegion: (r: string) => void;
  omtmLabel: string;
  omtmValue: string;
  omtmConfidence?: number;
  kpiLabels: [string, string, string];
  kpiValues: [string, string, string];
  kpiConfidences?: [number | undefined, number | undefined, number | undefined];
  onEditMetrics: () => void;
  selectedChannelTag: string;
  connectedChannels: ReviewConnectedChannel[];
  includedChannelIds: Set<string>;
  expandedChannelId: string | null;
  onExpandedChannelChange: (id: string | null) => void;
  onToggleChannelIncluded: (channelId: string) => void;
  onEnsureAdAccountSelected: (channelId: string, accountId: string) => void;
  onEnsureChannelIncluded: (channelId: string) => void;
  onCampaignToggle: (accountKey: string, campaignId: string, campaignName: string) => void;
  loadingAdAccounts: Record<string, boolean | undefined>;
  adAccountsByChannel: Record<string, AdAccount[]>;
  linkedAccountsByChannel: Record<string, LinkedAccount[]>;
  selectedAdAccounts: Record<string, string[]>;
  selectedCampaigns: Record<string, Array<{ id: string; name: string }>>;
  landingPages: string[];
  onLandingPagesChange: (pages: string[]) => void;
  utmCampaign: string;
  revenueVisible: boolean;
  revenueValue: string;
  onRevenueChange: (v: string) => void;
  launchError: string | null;
  onLaunch: () => void;
  isLaunching: boolean;
}) {
  const [showAllConnected, setShowAllConnected] = useState(false);
  const [channelsSectionError, setChannelsSectionError] = useState<string | null>(null);

  const connectedForValidation = useMemo(
    () => connectedChannels.map((c) => ({ platformId: c.platformId, title: c.title })),
    [connectedChannels]
  );

  const includedChannelSig = useMemo(() => [...includedChannelIds].sort().join("|"), [includedChannelIds]);
  const selectedCampaignsSig = useMemo(() => JSON.stringify(selectedCampaigns), [selectedCampaigns]);

  useEffect(() => {
    setChannelsSectionError(null);
  }, [includedChannelSig, selectedCampaignsSig]);

  const handleLaunchClick = useCallback(() => {
    setChannelsSectionError(null);
    const errInclude = validateAtLeastOneConnectedChannelIncluded(connectedForValidation, includedChannelIds);
    if (errInclude) {
      setChannelsSectionError(errInclude);
      return;
    }
    const errCampaigns = validateCampaignSelectionForIncludedChannels(
      connectedForValidation,
      includedChannelIds,
      selectedCampaigns
    );
    if (errCampaigns) {
      setChannelsSectionError(errCampaigns);
      return;
    }
    onLaunch();
  }, [connectedForValidation, includedChannelIds, selectedCampaigns, onLaunch]);

  const moreConnectedCount = Math.max(0, connectedChannels.length - REVIEW_CH_PREVIEW);
  const visibleConnected = useMemo(
    () =>
      showAllConnected || moreConnectedCount === 0
        ? connectedChannels
        : connectedChannels.slice(0, REVIEW_CH_PREVIEW),
    [connectedChannels, showAllConnected, moreConnectedCount]
  );

  useEffect(() => {
    if (showAllConnected) return;
    if (!expandedChannelId) return;
    const visibleIds = new Set(visibleConnected.map((r) => r.platformId));
    if (!visibleIds.has(expandedChannelId)) onExpandedChannelChange(null);
  }, [showAllConnected, expandedChannelId, visibleConnected, onExpandedChannelChange]);

  return (
    <div className="launchiq-screen-enter mx-auto max-w-[580px] px-6 pb-40 pt-[100px]">
      <h1 className="mb-3.5 text-[48px] font-extrabold leading-[1.02] tracking-[-2px] text-[#1d1d1f]">
        Looks good.
        <br />
        Anything to tweak?
      </h1>
      <p className="mb-14 text-[17px] font-light leading-relaxed text-[#6e6e73]">
        Pre-configured for your <strong className="font-medium text-[#1d1d1f]">{goalLabel}</strong> goal. Review below
        or just launch.
      </p>

      <section className="mb-10">
        <div className="mb-5 flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[1.2px] text-[#aeaeb2]">
            Choose Campaign Region
          </span>
        </div>
        <RegionSelector regions={regions} selected={selectedRegions} onToggle={onToggleRegion} />
      </section>

      <section className="mb-10">
        <div className="mb-5 flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[1.2px] text-[#aeaeb2]">Target Metrics</span>
          <span className="launchiq-mono text-[10px] font-medium text-[#6366F1]">Benchmark</span>
          <button
            type="button"
            onClick={onEditMetrics}
            className="ml-auto text-[13px] font-medium text-[#6366F1] hover:opacity-70"
          >
            Edit
          </button>
        </div>
        <div>
          <MetricHero label={omtmLabel} value={omtmValue} confidence={omtmConfidence} />
          <div className="mt-2.5 grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-2.5">
            {kpiLabels.map((label, i) => (
              <MetricKPI key={label} label={label} value={kpiValues[i]} confidence={kpiConfidences?.[i]} />
            ))}
          </div>
        </div>
        {revenueVisible && (
          <div className="mt-5">
            <label className="mb-2.5 block text-[13px] font-medium text-[#6e6e73]">
              Revenue Target <span className="text-rose-500">*</span>
            </label>
            <input
              className="w-full rounded-[14px] border border-white/45 bg-[rgba(255,255,255,0.8)] px-[22px] py-[18px] text-lg font-semibold text-[#1d1d1f] outline-none backdrop-blur-md focus:border-[#6366F1]"
              placeholder="e.g., €50,000"
              value={revenueValue}
              onChange={(e) => onRevenueChange(e.target.value)}
            />
            <p className="mt-2 text-[11px] font-light text-[#aeaeb2]">Required for ROAS computation.</p>
          </div>
        )}
      </section>

      <section className="mb-10">
        <div className="mb-5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-[1.2px] text-[#aeaeb2]">Channels</span>
          <span className="launchiq-mono max-w-full text-[10px] font-medium leading-snug text-[#6366F1]">
            {selectedChannelTag}
          </span>
        </div>
        {channelsSectionError ? (
          <div
            className="mb-4 rounded-[10px] border border-rose-200 bg-rose-50 px-4 py-2.5 text-[13px] font-medium text-rose-600"
            role="alert"
          >
            {channelsSectionError}
          </div>
        ) : null}
        {connectedChannels.length === 0 ? (
          <p className="text-[13px] font-light text-[#aeaeb2]">
            No connected channels yet. Connect an ad platform from your workspace, then return to LaunchIQ.
          </p>
        ) : (
          <div className="launchiq-review-ch-list">
            {visibleConnected.map((row) => (
              <ReviewConnectedChannelRow
                key={row.platformId}
                row={row}
                included={includedChannelIds.has(row.platformId)}
                expanded={expandedChannelId === row.platformId}
                accounts={adAccountsByChannel[row.platformId] || []}
                linkedAccounts={linkedAccountsByChannel[row.platformId] || []}
                loading={loadingAdAccounts[row.platformId] === true}
                selectedIds={selectedAdAccounts[row.platformId] || []}
                selectedCampaigns={selectedCampaigns}
                onToggleChannelIncluded={onToggleChannelIncluded}
                onExpandedChannelChange={onExpandedChannelChange}
                onEnsureAdAccountSelected={onEnsureAdAccountSelected}
                onEnsureChannelIncluded={onEnsureChannelIncluded}
                onCampaignToggle={onCampaignToggle}
              />
            ))}
            {moreConnectedCount > 0 && (
              <button
                type="button"
                className="launchiq-review-ch-more"
                onClick={() => setShowAllConnected((v) => !v)}
              >
                {showAllConnected
                  ? "Show fewer channels"
                  : `+ ${moreConnectedCount} more connected channel${moreConnectedCount !== 1 ? "s" : ""}`}
              </button>
            )}
          </div>
        )}
      </section>

      <section className="mb-10">
        <div className="mb-5 flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[1.2px] text-[#aeaeb2]">Campaign Page</span>
          <span className="rounded-md bg-[#F5F5F7] px-2 py-0.5 text-[10px] text-[#aeaeb2]">Auto</span>
        </div>
        <LandingPageSection pages={landingPages} onChange={onLandingPagesChange} utmCampaign={utmCampaign} />
      </section>

      <p className="mb-6 text-xs font-light leading-relaxed text-[#aeaeb2]">
        Channels without specific mappings track <strong className="font-medium text-[#6e6e73]">all active data</strong>{" "}
        from that platform. Refine anytime in Campaign Settings.
      </p>

      {launchError && (
        <div className="mb-3 rounded-[10px] border border-rose-200 bg-rose-50 px-4 py-2.5 text-[13px] font-medium text-rose-600">
          {launchError}
        </div>
      )}

      <div className="mt-14 flex flex-col gap-3">
        <button
          type="button"
          disabled={isLaunching}
          onClick={handleLaunchClick}
          className="w-full rounded-[18px] bg-gradient-to-br from-[#6366F1] to-[#4F46E5] py-[18px] text-[17px] font-semibold text-white shadow-[0_6px_24px_rgba(99,102,241,0.2)] transition-all duration-300 [transition-timing-function:var(--launchiq-spring)] hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLaunching ? "Launching…" : "Launch campaign"}
        </button>
        <p className="text-center text-[13px] font-light text-[#aeaeb2]">
          Refine everything after launch in Campaign Settings.
        </p>
      </div>
    </div>
  );
}
