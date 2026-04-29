"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { P, ACT_TOTALS, CAMPAIGNS, PERIOD_OPTIONS } from "@/lib/act-stats/data";
import { AnimatedNumber } from "@/components/reach-stats/AnimatedNumber";
import {
  StatusLineIndicator,
  TargetStatusIndicator,
  CircleFillIndicator,
  ArcColorIndicator,
} from "@/app/insights/components/KpiCardIndicators";

import { ActStatsHeader } from "./components/ActStatsHeader";
import { AIPoweredInsightsSection } from "./components/sections/AIPoweredInsightsSection";
import { IntentStageVelocitySection } from "./components/sections/IntentStageVelocitySection";
import { ActPerformanceDriversSection } from "./components/sections/ActPerformanceDriversSection";
import { ActPerformanceByChannelSection } from "./components/sections/ActPerformanceByChannelSection";
import { IntentFlowByChannelSection } from "./components/sections/IntentFlowByChannelSection";
import { FooterNavSection } from "./components/sections/FooterNavSection";
import { ChannelPerformanceTab } from "@/app/insights/reach-stats/components/sections/ChannelPerformanceTab";
import {
  readCampaignIdFromSearchParams,
  writeCampaignIdToSearchParams,
  buildUrlWithSearchString,
} from "@/lib/insights-campaign-url";

const progressWidth = (current: number, target: number) =>
  Math.min((current / target) * 100, 100);

export default function ActInsights() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"overview" | "drilldown">("overview");
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

    if (periodParam && PERIOD_OPTIONS.some((p) => p.key === periodParam)) {
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
      <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
        @keyframes ping {
          0%   { transform: scale(1); opacity: 0.4; }
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>

      {/* HEADER */}
      <ActStatsHeader
        selectedCampaigns={selectedCampaigns}
        selectedPeriod={selectedPeriod}
        customDateRange={customDateRange}
        onCampaignChange={handleCampaignChange}
        onPeriodChange={setSelectedPeriod}
        onCustomDateChange={setCustomDateRange}
      />

      {/* ═══ KPI CARDS ROW ═══ */}
      <div style={{ padding: "24px 40px 0" }}>
        <div style={{ maxWidth: 1360, margin: "0 auto" }}>
          <div
            style={{
              background: "#fff",
              border: "1px solid #E8E8F0",
              borderRadius: 12,
              boxShadow: "0 2px 14px rgba(124,58,237,0.18)",
              overflow: "hidden",
              display: "flex",
            }}
          >
            {/* OMTM: AIS (40%) */}
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
                      Action Impact Score (AIS)
                    </span>
                  </div>
                  <div style={{ fontSize: 40, fontWeight: 700, color: P.text1, lineHeight: 1, letterSpacing: -1 }}>
                    <AnimatedNumber value={ACT_TOTALS.ais} format="number" />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: P.accent, marginTop: 6 }}>
                    +1.0 vs prior period
                  </div>
                </div>
                <div style={{ textAlign: "right", fontSize: 11, color: "#9A9AAA", lineHeight: 1.6 }}>
                  <div>prior: {ACT_TOTALS.aisPrior} · target: {ACT_TOTALS.aisTarget}</div>
                  <div>{Math.round((ACT_TOTALS.ais / ACT_TOTALS.aisTarget) * 100)}% of target</div>
                </div>
              </div>

              <StatusLineIndicator
                percentage={Math.round(progressWidth(ACT_TOTALS.ais, ACT_TOTALS.aisTarget))}
              />
            </div>

            {/* KPI: CpQV (20%) */}
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
                  <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", color: "#9A9AAA", textTransform: "uppercase" }}>KPI</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#5A5A6E" }}>CpQV</span>
                </div>
                <div style={{ fontSize: 32, fontWeight: 700, color: P.text1, lineHeight: 1 }}>
                  <AnimatedNumber value={ACT_TOTALS.cpqv} format="money" />
                </div>
                <div style={{ fontSize: 11, fontWeight: 500, color: "#10B981", marginTop: 6 }}>−5% vs prior</div>
                <div style={{ fontSize: 11, color: "#9A9AAA", marginTop: 2 }}>Cost per Qualified Visit</div>
              </div>
              <TargetStatusIndicator
                current={ACT_TOTALS.cpqv}
                target={ACT_TOTALS.cpqvTarget}
                unit="$"
                isLowerBetter={true}
              />
            </div>

            {/* KPI: AQS (20%) */}
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
                  <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", color: "#9A9AAA", textTransform: "uppercase" }}>KPI</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#5A5A6E" }}>AQS</span>
                </div>
                <div style={{ fontSize: 32, fontWeight: 700, color: P.text1, lineHeight: 1 }}>
                  <AnimatedNumber value={ACT_TOTALS.aqs} format="number" />
                </div>
                <div style={{ fontSize: 11, fontWeight: 500, color: P.accent, marginTop: 6 }}>+3pts vs prior</div>
                <div style={{ fontSize: 11, color: "#9A9AAA", marginTop: 2 }}>Action Quality Score</div>
              </div>
              <CircleFillIndicator
                percentage={Math.round(Math.min((ACT_TOTALS.aqs / ACT_TOTALS.aqsTarget) * 100, 100))}
                label="quality"
              />
            </div>

            {/* KPI: ACR (20%) */}
            <div style={{ flex: "0 0 20%", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "24px 24px 20px", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", color: "#9A9AAA", textTransform: "uppercase" }}>KPI</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#5A5A6E" }}>ACR</span>
                </div>
                <div style={{ fontSize: 32, fontWeight: 700, color: P.text1, lineHeight: 1 }}>
                  <AnimatedNumber value={ACT_TOTALS.acr} format="percent" />
                </div>
                <div style={{ fontSize: 11, fontWeight: 500, color: "#10B981", marginTop: 6 }}>+5pp vs prior</div>
                <div style={{ fontSize: 11, color: "#9A9AAA", marginTop: 2 }}>Action Completion Rate</div>
              </div>
              <ArcColorIndicator percentage={Math.round(ACT_TOTALS.acr * 100)} label="rate" />
            </div>
          </div>
        </div>
      </div>

      {/* ═══ TAB NAVIGATION ═══ */}
      <div style={{ padding: "0 40px" }}>
        <div style={{ maxWidth: 1360, margin: "8px auto 0", borderBottom: "1px solid #E8E8F0" }}>
          <div style={{ display: "flex", gap: 28 }}>
            {[
              { key: "overview" as const, label: "Act Overview" },
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

      {/* BODY */}
      <div style={{ maxWidth: 1360, margin: "0 auto", padding: "26px 40px 80px" }}>
        {activeTab === "overview" && (
          <>
            <AIPoweredInsightsSection />
            <IntentStageVelocitySection />
            <ActPerformanceDriversSection />
            <ActPerformanceByChannelSection />
            <IntentFlowByChannelSection />
            <FooterNavSection />
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
