"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  type OverviewFilters,
  useOverviewFrequency,
  useOverviewOverlap,
  useOverviewSummary,
  useOverviewTrends,
} from "@/hooks/use-reach-overview";
import {
  normalizeOverviewFrequency,
  normalizeOverviewOverlap,
  normalizeOverviewSummary,
  normalizeOverviewTrends,
} from "@/lib/reach-stats/overview-view-model";
import { P, fmt, fmtSpend, PERIOD_OPTIONS } from "@/lib/reach-stats/data";
import { AnimatedNumber } from "@/components/reach-stats/AnimatedNumber";
import { InlineError } from "@/components/error/ErrorDisplay";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArcColorIndicator,
  CircleFillIndicator,
  StatusLineIndicator,
  TargetStatusIndicator,
} from "@/app/insights/components/KpiCardIndicators";
import { ReachStatsHeader } from "./components/ReachStatsHeader";
import { TotalReachSection } from "./components/sections/TotalReachSection";
import { ReachTrendSection } from "./components/sections/ReachTrendSection";
import { APRSection } from "./components/sections/APRSection";
import { OverlapAnalysisSection } from "./components/sections/OverlapAnalysisSection";
import { FrequencyOptimizationSection } from "./components/sections/FrequencyOptimizationSection";
import { ChannelEfficiencySection } from "./components/sections/ChannelEfficiencySection";
import { ChannelPerformanceTab } from "./components/sections/ChannelPerformanceTab";
import {
  readCampaignIdFromSearchParams,
  writeCampaignIdToSearchParams,
  buildUrlWithSearchString,
} from "@/lib/insights-campaign-url";

type ActiveTab = "overview" | "drilldown";

function periodToFilters(
  period: string,
  customDateRange: { from: string; to: string },
  selectedCampaigns: string[]
): OverviewFilters {
  const campaignId =
    selectedCampaigns[0] && selectedCampaigns[0] !== "all"
      ? selectedCampaigns[0]
      : undefined;

  if (period === "custom") {
    return {
      date_from: customDateRange.from || undefined,
      date_to: customDateRange.to || undefined,
      campaign_id: campaignId,
    };
  }

  const days = Number.parseInt(period, 10);
  if (Number.isNaN(days)) {
    return { campaign_id: campaignId };
  }

  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - days);

  return {
    date_from: from.toISOString().slice(0, 10),
    date_to: to.toISOString().slice(0, 10),
    campaign_id: campaignId,
  };
}

function progressPercent(current: number, target: number | null) {
  if (!target || target <= 0) return 100;
  return Math.min((current / target) * 100, 100);
}

function deltaColor(delta: string, lowerIsBetter = false) {
  const trimmed = delta.trim();
  const isNegative = trimmed.startsWith("-");
  const isPositive = trimmed.startsWith("+");

  if (!isNegative && !isPositive) return P.accent;
  if (lowerIsBetter) return isNegative ? P.accent : P.danger;
  return isNegative ? P.danger : P.accent;
}

function OverviewStateCard({
  children,
  minHeight = 220,
}: {
  children: React.ReactNode;
  minHeight?: number;
}) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #E8E8F0",
        borderRadius: 14,
        boxShadow: P.shadow,
        minHeight,
        padding: 24,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 24,
      }}
    >
      {children}
    </div>
  );
}

function OverviewSectionSkeleton({ minHeight = 220 }: { minHeight?: number }) {
  return (
    <OverviewStateCard minHeight={minHeight}>
      <div style={{ width: "100%" }}>
        <Skeleton className="h-5 w-56 mb-4" />
        <Skeleton className="h-4 w-80 mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </div>
    </OverviewStateCard>
  );
}

function SummaryKpiSkeleton() {
  return (
    <div style={{ padding: "24px 40px 0" }}>
      <div style={{ maxWidth: 1360, margin: "0 auto" }}>
        <div
          style={{
            background: "#fff",
            border: "1px solid #E8E8F0",
            borderRadius: 12,
            boxShadow: "0 2px 14px rgba(124,92,252,0.18)",
            overflow: "hidden",
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 0,
          }}
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              style={{
                padding: 24,
                borderRight: index < 3 ? "1px solid #E8E8F0" : "none",
              }}
            >
              <Skeleton className="h-4 w-24 mb-4" />
              <Skeleton className="h-10 w-36 mb-4" />
              <Skeleton className="h-3 w-20 mb-3" />
              <Skeleton className="h-3 w-28" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ReachInsights() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>(["all"]);
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [customDateRange, setCustomDateRange] = useState({
    from: "2026-01-01",
    to: "2026-01-31",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const periodParam = params.get("period");
    const fromParam = params.get("from");
    const toParam = params.get("to");

    if (periodParam && PERIOD_OPTIONS.some((option) => option.key === periodParam)) {
      setSelectedPeriod(periodParam);
    }

    if (periodParam === "custom" && fromParam && toParam) {
      setCustomDateRange({ from: fromParam, to: toParam });
    }
  }, []);

  const campaignFromUrl = readCampaignIdFromSearchParams(searchParams);
  const prevUrlCampaignRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    const id = campaignFromUrl;
    if (id) {
      setSelectedCampaigns((prev) =>
        prev.length === 1 && prev[0] === id ? prev : [id]
      );
      prevUrlCampaignRef.current = id;
      return;
    }
    if (prevUrlCampaignRef.current !== undefined) {
      setSelectedCampaigns(["all"]);
      prevUrlCampaignRef.current = undefined;
    }
  }, [campaignFromUrl]);

  const handleCampaignChange = useCallback(
    (ids: string[]) => {
      setSelectedCampaigns(ids);
      const raw = ids[0]?.trim();
      const idForUrl =
        raw && raw !== "all" && Number.isFinite(Number(raw)) ? raw : undefined;
      const next = writeCampaignIdToSearchParams(searchParams, idForUrl);
      const href = buildUrlWithSearchString(pathname, next);
      const current = buildUrlWithSearchString(pathname, new URLSearchParams(searchParams.toString()));
      if (href !== current) router.replace(href, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const overviewFilters = useMemo(
    () => periodToFilters(selectedPeriod, customDateRange, selectedCampaigns),
    [customDateRange, selectedCampaigns, selectedPeriod]
  );

  const {
    data: summaryRaw,
    error: summaryError,
    refetch: refetchSummary,
  } = useOverviewSummary(overviewFilters);
  const {
    data: trendsRaw,
    error: trendsError,
    refetch: refetchTrends,
  } = useOverviewTrends(overviewFilters, activeTab === "overview");
  const {
    data: overlapRaw,
    error: overlapError,
    refetch: refetchOverlap,
  } = useOverviewOverlap(overviewFilters, activeTab === "overview");
  const {
    data: frequencyRaw,
    error: frequencyError,
    refetch: refetchFrequency,
  } = useOverviewFrequency(overviewFilters, activeTab === "overview");

  const summary = useMemo(() => summaryRaw ? normalizeOverviewSummary(summaryRaw) : null, [summaryRaw]);
  const trends = useMemo(() => trendsRaw ? normalizeOverviewTrends(trendsRaw) : null, [trendsRaw]);
  const overlap = useMemo(() => overlapRaw ? normalizeOverviewOverlap(overlapRaw) : null, [overlapRaw]);
  const frequency = useMemo(() => frequencyRaw ? normalizeOverviewFrequency(frequencyRaw) : null, [frequencyRaw]);

  const renderSummarySection = (render: () => React.ReactNode, minHeight = 220) => {
    if (summary) return render();
    if (summaryError) {
      return (
        <OverviewStateCard minHeight={minHeight}>
          <InlineError error={summaryError} onRetry={() => refetchSummary()} />
        </OverviewStateCard>
      );
    }
    return <OverviewSectionSkeleton minHeight={minHeight} />;
  };

  const renderAsyncSection = (
    data: unknown,
    error: unknown,
    onRetry: () => void,
    render: () => React.ReactNode,
    minHeight = 220
  ) => {
    if (data) return render();
    if (error) {
      return (
        <OverviewStateCard minHeight={minHeight}>
          <InlineError error={error} onRetry={onRetry} />
        </OverviewStateCard>
      );
    }
    return <OverviewSectionSkeleton minHeight={minHeight} />;
  };

  return (
    <div
      style={{
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif",
        background: P.bg,
        minHeight: "100vh",
        color: P.text1,
      }}
    >
      <ReachStatsHeader
        selectedCampaigns={selectedCampaigns}
        selectedPeriod={selectedPeriod}
        customDateRange={customDateRange}
        onCampaignChange={handleCampaignChange}
        onPeriodChange={setSelectedPeriod}
        onCustomDateChange={setCustomDateRange}
      />

      {summary ? (
        <div style={{ padding: "24px 40px 0" }}>
          <div style={{ maxWidth: 1360, margin: "0 auto" }}>
            <div
              style={{
                background: "#fff",
                border: "1px solid #E8E8F0",
                borderRadius: 12,
                boxShadow: "0 2px 14px rgba(124,92,252,0.18)",
                overflow: "hidden",
                display: "flex",
              }}
            >
              <div
                style={{
                  flex: "0 0 40%",
                  borderRight: "1px solid #E8E8F0",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                }}
              >
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: P.accent }} />

                <div
                  style={{
                    padding: "28px 24px 20px",
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span
                        style={{
                          background: P.accentSoft,
                          color: P.accent,
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "2px 6px",
                          borderRadius: 4,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                        }}
                      >
                        OMTM
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 500, color: "#5A5A6E" }}>
                        Qualified Reach (QR)
                      </span>
                    </div>
                    <div style={{ fontSize: 40, fontWeight: 700, color: P.text1, lineHeight: 1, letterSpacing: -1 }}>
                      <AnimatedNumber value={summary.totals.qr} />
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 500,
                        color: deltaColor(summary.totals.qrDelta),
                        marginTop: 6,
                      }}
                    >
                      {summary.totals.qrDelta} vs prior period
                    </div>
                  </div>
                  <div style={{ textAlign: "right", fontSize: 11, color: "#9A9AAA", lineHeight: 1.6 }}>
                    <div>from {fmt(summary.totals.reach)} total reach</div>
                    <div>across {fmtSpend(summary.totals.spend)} spend</div>
                  </div>
                </div>

                <StatusLineIndicator
                  percentage={Math.round(progressPercent(summary.totals.qr, summary.totals.qrTarget))}
                />
              </div>

              <div
                style={{
                  flex: "0 0 20%",
                  borderRight: "1px solid #E8E8F0",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ padding: "24px 24px 20px", flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
                    <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", color: "#9A9AAA", textTransform: "uppercase" }}>
                      KPI
                    </span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#5A5A6E" }}>CpQR</span>
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 700, color: P.text1, lineHeight: 1 }}>
                    <AnimatedNumber value={summary.totals.avgCpqr} format="money" />
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      color: deltaColor(summary.totals.cpqrDelta, true),
                      marginTop: 6,
                    }}
                  >
                    {summary.totals.cpqrDelta} vs prior
                  </div>
                  <div style={{ fontSize: 11, color: "#9A9AAA", marginTop: 2 }}>Cost per Qualified Reach</div>
                </div>
                <TargetStatusIndicator
                  current={summary.totals.avgCpqr}
                  target={summary.totals.avgCpqrTarget ?? summary.totals.avgCpqr}
                  unit="$"
                  isLowerBetter
                />
              </div>

              <div
                style={{
                  flex: "0 0 20%",
                  borderRight: "1px solid #E8E8F0",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ padding: "24px 24px 20px", flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
                    <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", color: "#9A9AAA", textTransform: "uppercase" }}>
                      KPI
                    </span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#5A5A6E" }}>APR</span>
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 700, color: P.text1, lineHeight: 1 }}>
                    <AnimatedNumber value={summary.totals.apr} format="percent" />
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      color: deltaColor(summary.totals.aprDelta),
                      marginTop: 6,
                    }}
                  >
                    {summary.totals.aprDelta} vs prior
                  </div>
                  <div style={{ fontSize: 11, color: "#9A9AAA", marginTop: 2 }}>Audience Penetration Rate</div>
                </div>
                <CircleFillIndicator percentage={Math.round(summary.totals.apr * 100)} label="penetration" />
              </div>

              <div style={{ flex: "0 0 20%", display: "flex", flexDirection: "column" }}>
                <div style={{ padding: "24px 24px 20px", flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
                    <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", color: "#9A9AAA", textTransform: "uppercase" }}>
                      KPI
                    </span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#5A5A6E" }}>QRR</span>
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 700, color: P.text1, lineHeight: 1 }}>
                    <AnimatedNumber value={summary.totals.qrr} format="percent" />
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      color: deltaColor(summary.totals.qrrDelta),
                      marginTop: 6,
                    }}
                  >
                    {summary.totals.qrrDelta} vs prior
                  </div>
                  <div style={{ fontSize: 11, color: "#9A9AAA", marginTop: 2 }}>Share of Voice (SOV)</div>
                </div>
                <ArcColorIndicator percentage={Math.round(summary.totals.qrr * 100)} label="rate" />
              </div>
            </div>
          </div>
        </div>
      ) : summaryError ? (
        <div style={{ padding: "24px 40px 0" }}>
          <div style={{ maxWidth: 1360, margin: "0 auto" }}>
            <OverviewStateCard minHeight={120}>
              <InlineError error={summaryError} onRetry={() => refetchSummary()} />
            </OverviewStateCard>
          </div>
        </div>
      ) : (
        <SummaryKpiSkeleton />
      )}

      <div style={{ padding: "0 40px" }}>
        <div style={{ maxWidth: 1360, margin: "8px auto 0", borderBottom: "1px solid #E8E8F0" }}>
          <div style={{ display: "flex", gap: 28 }}>
            {[
              { key: "overview" as const, label: "Reach Overview" },
              { key: "drilldown" as const, label: "Channel Performance" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  position: "relative",
                  padding: "12px 0",
                  fontSize: 14,
                  fontWeight: activeTab === tab.key ? 600 : 500,
                  color: activeTab === tab.key ? P.text1 : "#8A8A9A",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  transition: "color 0.2s",
                }}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 2,
                      background: P.accent,
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1360, margin: "0 auto", padding: "26px 40px 80px" }}>
        {activeTab === "overview" && (
          <>
            {renderSummarySection(
              () => <TotalReachSection channels={summary!.channels} totals={summary!.totals} />,
              360
            )}

            {renderAsyncSection(
              trends,
              trendsError,
              () => {
                void refetchTrends();
              },
              () => <ReachTrendSection data={trends!} />,
              380
            )}

            {renderSummarySection(
              () => <APRSection channels={summary!.channels} totals={summary!.totals} />,
              300
            )}

            {renderAsyncSection(
              overlap,
              overlapError,
              () => {
                void refetchOverlap();
              },
              () => <OverlapAnalysisSection data={overlap!} />,
              420
            )}

            {renderAsyncSection(
              frequency,
              frequencyError,
              () => {
                void refetchFrequency();
              },
              () => <FrequencyOptimizationSection data={frequency!} />,
              520
            )}

            {renderSummarySection(
              () => <ChannelEfficiencySection channels={summary!.channels} totals={summary!.totals} />,
              320
            )}
          </>
        )}

        {activeTab === "drilldown" && (
          <ChannelPerformanceTab
            selectedCampaigns={selectedCampaigns}
            selectedPeriod={selectedPeriod}
            customDateRange={customDateRange}
          />
        )}
      </div>
    </div>
  );
}
