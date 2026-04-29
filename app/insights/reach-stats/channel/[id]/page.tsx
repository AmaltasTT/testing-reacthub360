"use client";

import { useState, useEffect, useRef, useCallback, useMemo, use } from "react";
import { useSearchParams } from "next/navigation";
import {
  useChannelFunnel,
  useChannelReach,
  useChannelEngage,
  useChannelAct,
  useChannelConvert,
  useChannelTalk,
  useChannelCampaigns,
  useChannelBudgetPacing,
  useChannelCrossCampaignSignals,
  useChannelRecommendations,
  type ChannelFilters,
} from "@/hooks/use-channel-drilldown";
import {
  transformFunnelData,
  transformReachData,
  transformEngageData,
  transformActData,
  transformConvertData,
  transformTalkData,
  transformCampaignsData,
  transformBudgetPacingData,
  transformCrossCampaignData,
  transformRecommendationsData,
} from "@/lib/reach-stats/channel-transforms";
import { InlineError } from "@/components/error/ErrorDisplay";

// ─── Components ──────────────────────────────────────────────────────────────
import { ChannelHeader } from "./components/ChannelHeader";
import { SectionNav } from "./components/SectionNav";
import { FunnelSection } from "./components/FunnelSection";
import { BudgetPacingSection } from "./components/BudgetPacingSection";
import { AQBand } from "./components/AQBand";
import { BudgetReallocation } from "./components/BudgetReallocation";
import { CrossCampaignSignals } from "./components/CrossCampaignSignals";
import { ReachSection } from "./components/ReachSection";
import { EngageSection } from "./components/EngageSection";
import { ActSection } from "./components/ActSection";
import { ConvertSection } from "./components/ConvertSection";
import { TalkSection } from "./components/TalkSection";
import { CampaignsSection } from "./components/CampaignsSection";
import { RecommendationsSection } from "./components/RecommendationsSection";
import { ScrollReveal } from "./components/shared/ScrollReveal";
import {
  FunnelSkeleton,
  PhaseSectionSkeleton,
  TableSkeleton,
  BudgetPacingSkeleton,
  CrossCampaignSkeleton,
  RecommendationsSkeleton,
} from "./components/shared/SectionSkeleton";

// ─── Types ───────────────────────────────────────────────────────────────────
type NavSection = "overview" | "reach" | "engage" | "act" | "convert" | "talk" | "campaigns";

/** Same range as ChannelHeader “Last 7 days” quick preset so the first request includes dates. */
function getDefaultChannelDateRange(): { from: string; to: string } {
  const today = new Date().toISOString().split("T")[0];
  const now = Date.now();
  return {
    from: new Date(now - 7 * 86400000).toISOString().split("T")[0],
    to: today,
  };
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function ChannelDrillDownPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const channelSwitchSearch = searchParams.toString();
  const channelId = id;

  // ─── Date range state (defaults match ChannelHeader “Last 7 days”) ─────────
  const [[dateFrom, dateTo], setDateRange] = useState(() => {
    const r = getDefaultChannelDateRange();
    return [r.from, r.to] as [string, string];
  });

  const filters = useMemo<ChannelFilters>(
    () => ({
      channel_id: channelId,
      date_from: dateFrom,
      date_to: dateTo,
    }),
    [channelId, dateFrom, dateTo]
  );

  // ─── Visible sections for lazy loading ───────────────────────────────────
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const markVisible = useCallback((section: string) => {
    setVisibleSections((prev) => {
      if (prev.has(section)) return prev;
      const next = new Set(prev);
      next.add(section);
      return next;
    });
  }, []);

  const apiEnabled = !!channelId;

  const {
    data: funnelRaw,
    isLoading: isFunnelLoading,
    error: funnelError,
    refetch: refetchFunnel,
  } = useChannelFunnel(filters, apiEnabled);

  const {
    data: reachRaw,
    isLoading: isReachLoading,
    error: reachError,
    refetch: refetchReach,
  } = useChannelReach(filters, apiEnabled && visibleSections.has("reach"));

  const {
    data: engageRaw,
    isLoading: isEngageLoading,
    error: engageError,
    refetch: refetchEngage,
  } = useChannelEngage(filters, apiEnabled && visibleSections.has("engage"));

  const {
    data: actRaw,
    isLoading: isActLoading,
    error: actError,
    refetch: refetchAct,
  } = useChannelAct(filters, apiEnabled && visibleSections.has("act"));

  const {
    data: convertRaw,
    isLoading: isConvertLoading,
    error: convertError,
    refetch: refetchConvert,
  } = useChannelConvert(filters, apiEnabled && visibleSections.has("convert"));

  const {
    data: talkRaw,
    isLoading: isTalkLoading,
    error: talkError,
    refetch: refetchTalk,
  } = useChannelTalk(filters, apiEnabled && visibleSections.has("talk"));

  const {
    data: campaignsRaw,
    isLoading: isCampaignsLoading,
    error: campaignsError,
    refetch: refetchCampaigns,
  } = useChannelCampaigns(filters, apiEnabled && visibleSections.has("campaigns"));

  const isOrganic =
    funnelRaw?.channel?.is_paid === true
      ? false
      : funnelRaw?.channel?.is_paid === false
        ? true
        : (funnelRaw?.channel?.platform_slug?.includes("organic") ?? false);

  const {
    data: budgetRaw,
    isLoading: isBudgetLoading,
    error: budgetError,
    refetch: refetchBudget,
  } = useChannelBudgetPacing(filters, apiEnabled && !isOrganic);

  const {
    data: crossCampaignRaw,
    isLoading: isCrossCampaignLoading,
    error: crossCampaignError,
    refetch: refetchCrossCampaign,
  } = useChannelCrossCampaignSignals(filters, apiEnabled && !isOrganic);

  const {
    data: recommendationsRaw,
    isLoading: isRecommendationsLoading,
    error: recommendationsError,
    refetch: refetchRecommendations,
  } = useChannelRecommendations(filters, apiEnabled && visibleSections.has("recommendations"));

  // ─── Transform API data ──────────────────────────────────────────────────
  const funnelData = funnelRaw ? transformFunnelData(funnelRaw) : undefined;
  const reachData = reachRaw ? transformReachData(reachRaw) : undefined;
  const engageData = engageRaw ? transformEngageData(engageRaw) : undefined;
  const actData = actRaw ? transformActData(actRaw) : undefined;
  const convertData = convertRaw ? transformConvertData(convertRaw) : undefined;
  const talkData = talkRaw ? transformTalkData(talkRaw) : undefined;
  const campaignsData = campaignsRaw ? transformCampaignsData(campaignsRaw) : undefined;
  const budgetData = budgetRaw ? transformBudgetPacingData(budgetRaw) : undefined;
  const crossCampaignData = crossCampaignRaw ? transformCrossCampaignData(crossCampaignRaw) : undefined;
  const recommendationsData = recommendationsRaw ? transformRecommendationsData(recommendationsRaw) : undefined;

  const channel = funnelData
    ? {
        id: funnelData.channel.platforms_id,
        name: funnelData.channel.display_name,
        icon: funnelData.channel.display_name.charAt(0).toUpperCase(),
        color: "#7C3AED",
        logoUrl: null as string | null,
        type: funnelData.channel.provider_name ?? funnelData.channel.display_name,
        subtype:
          funnelData.channel.is_paid === true
            ? "paid"
            : funnelData.channel.is_paid === false
              ? "organic"
              : funnelData.channel.platform_slug?.includes("organic")
                ? "organic"
                : "paid",
        account: funnelData.channel.provider_name ?? "",
        accountId: funnelData.channel.platforms_id,
      }
    : null;

  // ─── Nav / scroll tracking ───────────────────────────────────────────────
  const [activeSection, setActiveSection] = useState<NavSection>("overview");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const scrollTo = useCallback((id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(id as NavSection);
  }, []);

  useEffect(() => {
    const handler = () => {
      const scrollY = window.scrollY + 130;
      const sections = Object.entries(sectionRefs.current);
      let current = sections[0]?.[0] as NavSection;
      for (const [id, el] of sections) {
        if (el && el.offsetTop <= scrollY) current = id as NavSection;
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const setRef = (id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  };

  // ─── Date range change handler ───────────────────────────────────────────
  const handleDateRangeChange = useCallback((from: string, to: string) => {
    setDateRange([from, to]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased text-gray-900">
      <ChannelHeader
        channel={channel as any}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateRangeChange={handleDateRangeChange}
        channelSwitchSearch={channelSwitchSearch}
      />
      <SectionNav activeSection={activeSection} onNavigate={scrollTo} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-16">
        {/* ═══════════ OVERVIEW ═══════════ */}
        <section ref={setRef("overview")} id="overview">
          <ScrollReveal>
            {isFunnelLoading ? (
              <FunnelSkeleton />
            ) : funnelError ? (
              <InlineError error={funnelError} onRetry={() => refetchFunnel()} />
            ) : (
              <FunnelSection
                channel={channel as any}
                onNavigate={scrollTo}
                data={funnelData}
              />
            )}
          </ScrollReveal>

          {!isOrganic && (
            <>
              <ScrollReveal>
                {isBudgetLoading ? (
                  <BudgetPacingSkeleton />
                ) : budgetError ? (
                  <InlineError error={budgetError} onRetry={() => refetchBudget()} />
                ) : (
                  <BudgetPacingSection
                    onNavigateCampaigns={() => scrollTo("campaigns")}
                    data={budgetData}
                  />
                )}
              </ScrollReveal>
              <ScrollReveal>
                {isCrossCampaignLoading ? (
                  <CrossCampaignSkeleton />
                ) : crossCampaignError ? (
                  <InlineError error={crossCampaignError} onRetry={() => refetchCrossCampaign()} />
                ) : (
                  <CrossCampaignSignals data={crossCampaignData} />
                )}
              </ScrollReveal>
            </>
          )}
        </section>

        {/* ═══════════ REACH ═══════════ */}
        <section ref={setRef("reach")} id="reach" className="pt-4">
          <ScrollReveal onVisible={() => markVisible("reach")}>
            {isReachLoading ? (
              <PhaseSectionSkeleton />
            ) : reachError ? (
              <InlineError error={reachError} onRetry={() => refetchReach()} />
            ) : (
              <ReachSection channel={channel as any} data={reachData} />
            )}
          </ScrollReveal>
        </section>

        {/* ═══════════ ENGAGE ═══════════ */}
        <section ref={setRef("engage")} id="engage" className="pt-4">
          <ScrollReveal onVisible={() => markVisible("engage")}>
            {isEngageLoading ? (
              <PhaseSectionSkeleton />
            ) : engageError ? (
              <InlineError error={engageError} onRetry={() => refetchEngage()} />
            ) : (
              <EngageSection data={engageData} />
            )}
          </ScrollReveal>
        </section>

        {/* ═══════════ ACT ═══════════ */}
        <section ref={setRef("act")} id="act" className="pt-4">
          <ScrollReveal onVisible={() => markVisible("act")}>
            {isActLoading ? (
              <PhaseSectionSkeleton />
            ) : actError ? (
              <InlineError error={actError} onRetry={() => refetchAct()} />
            ) : (
              <ActSection data={actData} />
            )}
          </ScrollReveal>
        </section>

        {/* ═══════════ CONVERT ═══════════ */}
        <section ref={setRef("convert")} id="convert" className="pt-4">
          <ScrollReveal onVisible={() => markVisible("convert")}>
            {isConvertLoading ? (
              <PhaseSectionSkeleton />
            ) : convertError ? (
              <InlineError error={convertError} onRetry={() => refetchConvert()} />
            ) : (
              <ConvertSection data={convertData} />
            )}
          </ScrollReveal>
        </section>

        {/* ═══════════ TALK ═══════════ */}
        <section ref={setRef("talk")} id="talk" className="pt-4">
          <ScrollReveal onVisible={() => markVisible("talk")}>
            {isTalkLoading ? (
              <PhaseSectionSkeleton />
            ) : talkError ? (
              <InlineError error={talkError} onRetry={() => refetchTalk()} />
            ) : (
              <TalkSection data={talkData} />
            )}
          </ScrollReveal>
        </section>

        {/* ═══════════ RECOMMENDATIONS ═══════════ */}
        <section className="pt-4">
          <ScrollReveal onVisible={() => markVisible("recommendations")}>
            {isRecommendationsLoading ? (
              <RecommendationsSkeleton />
            ) : recommendationsError ? (
              <InlineError error={recommendationsError} onRetry={() => refetchRecommendations()} />
            ) : (
              <RecommendationsSection data={recommendationsData} />
            )}
          </ScrollReveal>
        </section>

        {/* ═══════════ CAMPAIGNS ═══════════ */}
        <section ref={setRef("campaigns")} id="campaigns" className="pt-4">
          <ScrollReveal onVisible={() => markVisible("campaigns")}>
            {isCampaignsLoading ? (
              <TableSkeleton />
            ) : campaignsError ? (
              <InlineError error={campaignsError} onRetry={() => refetchCampaigns()} />
            ) : (
              <CampaignsSection
                isOrganic={!!isOrganic}
                channelName={channel?.name ?? ""}
                campaigns={(channel as any)?.campaigns ?? 0}
                scrollTo={scrollTo}
                data={campaignsData}
              />
            )}
          </ScrollReveal>
        </section>
      </main>
    </div>
  );
}
