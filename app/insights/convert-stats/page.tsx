"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { P, CONVERT_TOTALS, PERIOD_OPTIONS, CAMPAIGNS } from "@/lib/convert-stats/data";
import { AnimatedNumber } from "@/components/reach-stats/AnimatedNumber";
import {
  StatusLineIndicator,
  TargetStatusIndicator,
  CircleFillIndicator,
  ArcColorIndicator,
} from "@/app/insights/components/KpiCardIndicators";

import { ConvertStatsHeader } from "./components/ConvertStatsHeader";
import { ConvertAIPoweredInsightsSection } from "./components/sections/ConvertAIPoweredInsightsSection";
import { ConversionByChannelSection } from "./components/sections/ConversionByChannelSection";
import { ConversionInMotionSection } from "./components/sections/ConversionInMotionSection";
import { RevenueFlowSection } from "./components/sections/RevenueFlowSection";
import { ConvertDriversSection } from "./components/sections/ConvertDriversSection";
import { ConversionQualityBySourceSection } from "./components/sections/ConversionQualityBySourceSection";
import { ConvertDeepDiveSection } from "./components/sections/ConvertDeepDiveSection";
import { PhaseNavigationCardsSection } from "./components/sections/PhaseNavigationCardsSection";
import { ChannelPerformanceTab } from "@/app/insights/reach-stats/components/sections/ChannelPerformanceTab";
import {
  readCampaignIdFromSearchParams,
  writeCampaignIdToSearchParams,
  buildUrlWithSearchString,
} from "@/lib/insights-campaign-url";

const progressWidth = (current: number, target: number) =>
  Math.min((current / target) * 100, 100);

export default function ConvertInsightsPage() {
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

  const cvrFraction = CONVERT_TOTALS.cvr / 100;
  const cpconFraction = CONVERT_TOTALS.cpcon / 100;

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

      <ConvertStatsHeader
        selectedCampaigns={selectedCampaigns}
        selectedPeriod={selectedPeriod}
        customDateRange={customDateRange}
        onCampaignChange={handleCampaignChange}
        onPeriodChange={setSelectedPeriod}
        onCustomDateChange={setCustomDateRange}
      />

      <div style={{ padding: "16px 40px 0" }}>
        <div style={{ maxWidth: 1360, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#34C759" }} />
            <span style={{ fontSize: 12, color: P.text3 }}>
              Phase health: <span style={{ fontWeight: 600, color: "#34C759" }}>Strong performance</span>
            </span>
          </div>
        </div>
      </div>

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
                    <span style={{ fontSize: 12, fontWeight: 500, color: "#5A5A6E" }}>Conversion Rate (CVR)</span>
                  </div>
                  <div style={{ fontSize: 40, fontWeight: 700, color: P.text1, lineHeight: 1, letterSpacing: -1 }}>
                    <AnimatedNumber value={cvrFraction} format="percent" />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: "#10B981", marginTop: 6 }}>
                    +2.3pp vs prior
                  </div>
                </div>
                <div style={{ textAlign: "right", fontSize: 11, color: "#9A9AAA", lineHeight: 1.6 }}>
                  <div>
                    prior: {(CONVERT_TOTALS.cvrPrior / 100).toLocaleString(undefined, { style: "percent", maximumFractionDigits: 1 })} · target:{" "}
                    {(CONVERT_TOTALS.cvrTarget / 100).toLocaleString(undefined, { style: "percent", maximumFractionDigits: 0 })}
                  </div>
                </div>
              </div>
              <StatusLineIndicator
                percentage={Math.round(progressWidth(CONVERT_TOTALS.cvr, CONVERT_TOTALS.cvrTarget))}
              />
            </div>

            <div style={{ flex: "0 0 20%", borderRight: "1px solid #E8E8F0", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "24px 24px 20px", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", color: "#9A9AAA", textTransform: "uppercase" }}>KPI</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#5A5A6E" }}>REV</span>
                </div>
                <div style={{ fontSize: 32, fontWeight: 700, color: P.text1, lineHeight: 1 }}>
                  $<AnimatedNumber value={CONVERT_TOTALS.revenueK} format="number" />
                  K
                </div>
                <div style={{ fontSize: 11, fontWeight: 500, color: P.accent, marginTop: 6 }}>+vs prior period</div>
                <div style={{ fontSize: 11, color: "#9A9AAA", marginTop: 2 }}>Revenue (blended)</div>
              </div>
              <CircleFillIndicator
                percentage={Math.round(progressWidth(CONVERT_TOTALS.revenueK, CONVERT_TOTALS.revenueTargetK))}
                label="to target"
              />
            </div>

            <div style={{ flex: "0 0 20%", borderRight: "1px solid #E8E8F0", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "24px 24px 20px", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", color: "#9A9AAA", textTransform: "uppercase" }}>KPI</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#5A5A6E" }}>CPCON</span>
                </div>
                <div style={{ fontSize: 32, fontWeight: 700, color: P.text1, lineHeight: 1 }}>
                  <AnimatedNumber value={cpconFraction} format="percent" />
                </div>
                <div style={{ fontSize: 11, fontWeight: 500, color: "#10B981", marginTop: 6 }}>Improving vs prior</div>
                <div style={{ fontSize: 11, color: "#9A9AAA", marginTop: 2 }}>Cost per conversion</div>
              </div>
              <ArcColorIndicator percentage={Math.min(100, Math.round((CONVERT_TOTALS.cpconTarget / CONVERT_TOTALS.cpcon) * 100))} label="eff." />
            </div>

            <div style={{ flex: "0 0 20%", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "24px 24px 20px", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", color: "#9A9AAA", textTransform: "uppercase" }}>KPI</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#5A5A6E" }}>AOV</span>
                </div>
                <div style={{ fontSize: 32, fontWeight: 700, color: P.text1, lineHeight: 1 }}>
                  <AnimatedNumber value={CONVERT_TOTALS.aov} format="money" />
                </div>
                <div style={{ fontSize: 11, fontWeight: 500, color: "#10B981", marginTop: 6 }}>+vs prior</div>
                <div style={{ fontSize: 11, color: "#9A9AAA", marginTop: 2 }}>Average order value</div>
              </div>
              <TargetStatusIndicator
                current={CONVERT_TOTALS.aov}
                target={CONVERT_TOTALS.aovTarget}
                unit="$"
                isLowerBetter={false}
              />
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 40px" }}>
        <div style={{ maxWidth: 1360, margin: "8px auto 0", borderBottom: "1px solid #E8E8F0" }}>
          <div style={{ display: "flex", gap: 28 }}>
            {[
              { key: "overview" as const, label: "Convert Overview" },
              { key: "drilldown" as const, label: "Channel Performance" },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
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
            <ConvertAIPoweredInsightsSection />
            <ConversionByChannelSection />
            <ConversionInMotionSection />
            <RevenueFlowSection />
            <ConvertDriversSection />
            <ConversionQualityBySourceSection />
            <ConvertDeepDiveSection />
            <PhaseNavigationCardsSection />
          </>
        )}

        {activeTab === "drilldown" && (
          <>
            {/* Shared reach-oriented channel grid until a convert-specific drilldown API exists */}
            <ChannelPerformanceTab
              selectedCampaigns={selectedCampaigns}
              selectedPeriod={selectedPeriod}
              customDateRange={customDateRange}
            />
          </>
        )}
      </div>
    </div>
  );
}
