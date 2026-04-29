"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { P, ENGAGE_TOTALS, PERIOD_OPTIONS } from "@/lib/engage-stats/data";
import { AnimatedNumber } from "@/components/reach-stats/AnimatedNumber";
import {
  StatusLineIndicator,
  TargetStatusIndicator,
  CircleFillIndicator,
  ArcColorIndicator,
} from "@/app/insights/components/KpiCardIndicators";

import { EngageStatsHeader } from "./components/EngageStatsHeader";
import { SnapshotRow } from "./components/SnapshotRow";

import { BudgetPacingSection } from "./components/sections/BudgetPacingSection";
import { ChannelEfficiencySection } from "./components/sections/ChannelEfficiencySection";
import { PerformanceDriversSection } from "./components/sections/PerformanceDriversSection";
import { EngagementDepthSection } from "./components/sections/EngagementDepthSection";
import { AttentionDecaySection } from "./components/sections/AttentionDecaySection";
import { ContentIntelligenceSection } from "./components/sections/ContentIntelligenceSection";
import { FooterNavSection } from "./components/sections/FooterNavSection";
import { ChannelPerformanceTab } from "@/app/insights/reach-stats/components/sections/ChannelPerformanceTab";
import {
  readCampaignIdFromSearchParams,
  writeCampaignIdToSearchParams,
  buildUrlWithSearchString,
} from "@/lib/insights-campaign-url";

export default function EngageInsights() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>(["all"]);
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [customDateRange, setCustomDateRange] = useState({
    from: "2026-01-01",
    to: "2026-01-31",
  });

  // Initialize period / custom range from URL (campaign follows `campaign_id` via searchParams)
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

  const fadeUp = (delay: number) => ({
    animation: `fadeUp 0.5s ease-out ${delay}s both`,
  });

  // Progress bar helper
  const progressWidth = (current: number, target: number) =>
    Math.min((current / target) * 100, 100);

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
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* HEADER */}
      <EngageStatsHeader
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
              boxShadow: "0 2px 14px rgba(124,92,252,0.18)",
              overflow: "hidden",
              display: "flex",
            }}
          >
            {/* OMTM: EIS (40%) */}
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
                      Engagement Impact Score (EIS)
                    </span>
                  </div>
                  <div style={{ fontSize: 40, fontWeight: 700, color: P.text1, lineHeight: 1, letterSpacing: -1 }}>
                    <AnimatedNumber value={ENGAGE_TOTALS.eis} format="number" />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: P.accent, marginTop: 6 }}>
                    +0.3 vs prior period
                  </div>
                </div>
                <div style={{ textAlign: "right", fontSize: 11, color: "#9A9AAA", lineHeight: 1.6 }}>
                  <div>prior: {ENGAGE_TOTALS.eisPrior} · target: {ENGAGE_TOTALS.eisTarget}</div>
                  <div>{Math.round((ENGAGE_TOTALS.eis / ENGAGE_TOTALS.eisTarget) * 100)}% of target</div>
                </div>
              </div>

              <StatusLineIndicator
                percentage={Math.round(progressWidth(ENGAGE_TOTALS.eis, ENGAGE_TOTALS.eisTarget))}
              />
            </div>

            {/* KPI: EQS (20%) */}
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
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#5A5A6E" }}>EQS</span>
                </div>
                <div style={{ fontSize: 32, fontWeight: 700, color: P.text1, lineHeight: 1 }}>
                  <AnimatedNumber value={ENGAGE_TOTALS.eqs} format="number" />
                </div>
                <div style={{ fontSize: 11, fontWeight: 500, color: "#10B981", marginTop: 6 }}>+3% vs prior</div>
                <div style={{ fontSize: 11, color: "#9A9AAA", marginTop: 2 }}>Engagement Quality Score</div>
              </div>
              <CircleFillIndicator
                percentage={Math.round(Math.min((ENGAGE_TOTALS.eqs / ENGAGE_TOTALS.eqsTarget) * 100, 100))}
                label="quality"
              />
            </div>

            {/* KPI: ESR (20%) */}
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
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#5A5A6E" }}>ESR</span>
                </div>
                <div style={{ fontSize: 32, fontWeight: 700, color: P.text1, lineHeight: 1 }}>
                  <AnimatedNumber value={ENGAGE_TOTALS.esr} format="percent" />
                </div>
                <div style={{ fontSize: 11, fontWeight: 500, color: P.accent, marginTop: 6 }}>+3pp vs prior</div>
                <div style={{ fontSize: 11, color: "#9A9AAA", marginTop: 2 }}>Engagement Stickiness Rate</div>
              </div>
              <ArcColorIndicator percentage={Math.round(ENGAGE_TOTALS.esr * 100)} label="rate" />
            </div>

            {/* KPI: CPQE (20%) */}
            <div style={{ flex: "0 0 20%", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "24px 24px 20px", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", color: "#9A9AAA", textTransform: "uppercase" }}>KPI</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#5A5A6E" }}>CPQE</span>
                </div>
                <div style={{ fontSize: 32, fontWeight: 700, color: P.text1, lineHeight: 1 }}>
                  <AnimatedNumber value={ENGAGE_TOTALS.cpqe} format="money" />
                </div>
                <div style={{ fontSize: 11, fontWeight: 500, color: "#10B981", marginTop: 6 }}>−$0.12 vs prior</div>
                <div style={{ fontSize: 11, color: "#9A9AAA", marginTop: 2 }}>Cost per Qualified Engagement</div>
              </div>
              <TargetStatusIndicator
                current={ENGAGE_TOTALS.cpqe}
                target={ENGAGE_TOTALS.cpqeTarget}
                unit="$"
                isLowerBetter={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ═══ TAB NAVIGATION ═══ */}
      <div style={{ padding: "0 40px" }}>
        <div style={{ maxWidth: 1360, margin: "8px auto 0", borderBottom: "1px solid #E8E8F0" }}>
          <div style={{ display: "flex", gap: 28 }}>
            {[
              { key: "overview", label: "Engage Overview" },
              // { key: "demographics", label: "Demographics" },
              // { key: "geography", label: "Geography" },
              { key: "drilldown", label: "Channel Performance" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                style={{
                  position: "relative",
                  padding: "12px 0",
                  fontSize: 14,
                  fontWeight: activeTab === t.key ? 600 : 500,
                  color: activeTab === t.key ? P.text1 : "#8A8A9A",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  transition: "color 0.2s",
                }}
              >
                {t.label}
                {activeTab === t.key && (
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
            {/* <SnapshotRow /> */}
            <BudgetPacingSection />
            <ChannelEfficiencySection />
            <PerformanceDriversSection />
            <EngagementDepthSection />
            <AttentionDecaySection />
            <ContentIntelligenceSection />
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

        {(activeTab === "demographics" || activeTab === "geography") && (
          <div
            style={{
              padding: "60px 40px",
              textAlign: "center",
              background: P.card,
              borderRadius: 14,
              border: `1px solid ${P.border}`,
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 600, color: P.text1, marginBottom: 8 }}>
              Coming Soon
            </div>
            <div style={{ fontSize: 13, color: P.text3 }}>
              The {activeTab === "demographics" ? "Demographics" : "Geography"} tab is under development.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
