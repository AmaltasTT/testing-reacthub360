"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { DualSystemSnapshot } from "./components/DualSystemSnapshot";
import { KpiCards } from "./components/KpiCards";
import { TalkAgentIQPanel } from "./components/TalkAgentIQPanel";
import { Tabs } from "./components/Tabs";
import { TalkStatsHeader } from "./components/TalkStatsHeader";
import { AgentIQSection } from "./components/sections/AgentIQSection";
import { ClvEvolution } from "./components/sections/ClvEvolution";
import { CustomerLifecycle } from "./components/sections/CustomerLifecycle";
import { PhaseNavigator } from "./components/sections/PhaseNavigator";
import { RetentionAndReactivation } from "./components/sections/RetentionAndReactivation";
import { RetentionByChannel } from "./components/sections/RetentionByChannel";
import { PERIOD_OPTIONS, TALK_CSS_VARS, TALK_TOP_ACTIONS } from "@/lib/talk-stats/data";

type ActiveTab = "overview" | "channel";
type ActiveView = "retention" | "advocacy";

export default function TalkStatsPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [activeView, setActiveView] = useState<ActiveView>("retention");
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>(["all"]);
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [showRetentionDepth, setShowRetentionDepth] = useState(false);
  const [agentIQOpen, setAgentIQOpen] = useState(false);
  const [agentIQInitialTab, setAgentIQInitialTab] = useState<"actions" | "chat">("actions");
  const [agentIQPrePrompt, setAgentIQPrePrompt] = useState("");
  const [customDateRange, setCustomDateRange] = useState({
    from: "2026-01-01",
    to: "2026-01-31",
  });
  const hasHydrated = useRef(false);

  const applyUrlState = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    const periodParam = params.get("period");
    const campaignsParam = params.get("campaigns");
    const fromParam = params.get("from");
    const toParam = params.get("to");
    const viewParam = params.get("view");

    setActiveView(viewParam === "advocacy" ? "advocacy" : "retention");

    if (periodParam && PERIOD_OPTIONS.some((option) => option.key === periodParam)) {
      setSelectedPeriod(periodParam);
    } else {
      setSelectedPeriod("30d");
    }

    if (campaignsParam) {
      const firstId = campaignsParam.split(",")[0];
      if (firstId) setSelectedCampaigns([firstId]);
    } else {
      setSelectedCampaigns(["all"]);
    }

    if (periodParam === "custom" && fromParam && toParam) {
      setCustomDateRange({ from: fromParam, to: toParam });
    } else {
      setCustomDateRange({
        from: "2026-01-01",
        to: "2026-01-31",
      });
    }
  }, []);

  useEffect(() => {
    applyUrlState();
    hasHydrated.current = true;

    const handlePopState = () => {
      applyUrlState();
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [applyUrlState]);

  const syncUrlState = useCallback(
    (mode: "replace" | "push" = "replace") => {
      if (!hasHydrated.current) return;

      const params = new URLSearchParams(window.location.search);
      params.set("view", activeView);
      params.set("period", selectedPeriod);

      const firstCampaign = selectedCampaigns[0];
      if (firstCampaign && firstCampaign !== "all") {
        params.set("campaigns", firstCampaign);
      } else {
        params.delete("campaigns");
      }

      if (selectedPeriod === "custom") {
        params.set("from", customDateRange.from);
        params.set("to", customDateRange.to);
      } else {
        params.delete("from");
        params.delete("to");
      }

      const nextSearch = params.toString();
      const nextUrl = nextSearch
        ? `${window.location.pathname}?${nextSearch}`
        : window.location.pathname;
      window.history[mode === "push" ? "pushState" : "replaceState"]({}, "", nextUrl);
    },
    [activeView, customDateRange.from, customDateRange.to, selectedCampaigns, selectedPeriod]
  );

  useEffect(() => {
    syncUrlState("replace");
  }, [syncUrlState]);

  const stickyBarTotal = useMemo(
    () =>
      TALK_TOP_ACTIONS.reduce((sum, action) => {
        const numericImpact = Number(action.impact.replace(/[^\d.-]/g, ""));
        return sum + (Number.isNaN(numericImpact) ? 0 : numericImpact);
      }, 0),
    []
  );

  const openAgentIQ = ({
    tab = "actions",
    prompt = "",
  }: {
    tab?: "actions" | "chat";
    prompt?: string;
  }) => {
    setAgentIQInitialTab(tab);
    setAgentIQPrePrompt(prompt);
    setAgentIQOpen(true);
  };

  const handleViewChange = (view: ActiveView) => {
    setActiveView(view);
    if (view !== "retention") {
      setShowRetentionDepth(false);
    }

    const params = new URLSearchParams(window.location.search);
    params.set("view", view);
    const nextSearch = params.toString();
    const nextUrl = nextSearch
      ? `${window.location.pathname}?${nextSearch}`
      : window.location.pathname;
    window.history.pushState({}, "", nextUrl);
  };

  return (
    <div
      className="min-h-screen"
      style={{
        ...(TALK_CSS_VARS as CSSProperties),
        fontFamily: "var(--font-sans)",
        backgroundColor: "var(--background)",
      }}
    >
      <TalkStatsHeader
        activeView={activeView}
        selectedCampaigns={selectedCampaigns}
        selectedPeriod={selectedPeriod}
        customDateRange={customDateRange}
        onCampaignChange={setSelectedCampaigns}
        onPeriodChange={setSelectedPeriod}
        onCustomDateChange={setCustomDateRange}
      />

      <main className="mx-auto max-w-[1440px] px-8 py-6">
        <DualSystemSnapshot activeView={activeView} onViewChange={handleViewChange} />
        <KpiCards
          activeView={activeView}
          period={selectedPeriod}
          onOpenAgentIQ={(prompt) => openAgentIQ({ tab: "chat", prompt })}
        />
        <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "overview" && activeView === "retention" && (
          <div className="space-y-6">
            <AgentIQSection onOpenAgentIQ={() => openAgentIQ({ tab: "actions" })} />
            <RetentionByChannel />
            {!showRetentionDepth ? (
              <button
                onClick={() => setShowRetentionDepth(true)}
                className="w-full rounded-2xl border border-dashed px-6 py-4 text-left transition-all hover:opacity-90"
                style={{
                  borderColor: "rgba(124,92,252,0.4)",
                  backgroundColor: "rgba(124,92,252,0.03)",
                  cursor: "pointer",
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--purple)", marginBottom: 4 }}>
                  Explore deeper — CLV, Lifecycle, Nurturing
                </div>
                <div style={{ fontSize: 12, color: "var(--neutral-600)" }}>
                  Reveal the deeper retention layers on demand, then collapse them when you are done.
                </div>
              </button>
            ) : (
              <>
                <ClvEvolution period={selectedPeriod} />
                <CustomerLifecycle />
                <RetentionAndReactivation />
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowRetentionDepth(false)}
                    className="rounded-full border px-5 py-2.5"
                    style={{
                      borderColor: "var(--border)",
                      backgroundColor: "white",
                      color: "var(--neutral-700)",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Collapse
                  </button>
                </div>
              </>
            )}
            <PhaseNavigator activeView={activeView} />
          </div>
        )}

        {activeTab === "channel" && (
          <div className="p-16 text-center" style={{ color: "var(--neutral-500)" }}>
            Channel Performance — Coming in next iteration
          </div>
        )}

        {activeTab === "overview" && activeView === "advocacy" && (
          <div className="space-y-6">
            <div
              className="rounded-2xl border bg-white p-10 text-center"
              style={{ borderColor: "var(--border)" }}
            >
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "var(--neutral-900)",
                  marginBottom: 8,
                }}
              >
                Advocacy drill-down is partially aligned
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "var(--neutral-600)",
                  maxWidth: 720,
                  margin: "0 auto 20px",
                  lineHeight: 1.6,
                }}
              >
                The doc’s advocacy stack describes dedicated AAR, CpAA, PSR, review, and segment
                drill-down modules. This page now switches KPI state, URL state, AgentIQ context,
                and navigation for Advocacy, while the deeper advocacy drill-down sections still need
                their dedicated component source to reach full parity.
              </div>
              <button
                onClick={() => openAgentIQ({ tab: "actions" })}
                className="rounded-full px-5 py-2.5"
                style={{
                  background: "var(--purple)",
                  color: "white",
                  fontSize: 13,
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Show Me More From AgentIQ →
              </button>
            </div>
            <PhaseNavigator activeView={activeView} />
          </div>
        )}
      </main>

      {activeTab === "overview" && activeView === "retention" && (
        <div
          className="fixed bottom-0 left-0 right-0 z-50"
          style={{
            borderTop: "1px solid var(--border)",
            backgroundColor: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="mx-auto flex max-w-[1440px] items-center justify-between px-8 py-3">
            <div
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "var(--neutral-500)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              TOP ACTIONS
            </div>

            <div className="flex items-center gap-6">
              {TALK_TOP_ACTIONS.map((action, index) => (
                <div key={action.label} className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: action.color }}
                    />
                    <span style={{ fontSize: "12px", color: "var(--neutral-700)" }}>
                      {action.label}
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "var(--green)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {action.impact}
                    </span>
                  </div>
                  {index < TALK_TOP_ACTIONS.length - 1 && (
                    <div
                      style={{ width: "1px", height: "16px", backgroundColor: "var(--border)" }}
                    />
                  )}
                </div>
              ))}
            </div>

            <div
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "var(--purple)",
                fontFamily: "var(--font-mono)",
              }}
            >
              ${stickyBarTotal}K total
            </div>
          </div>
        </div>
      )}

      <TalkAgentIQPanel
        open={agentIQOpen}
        activeView={activeView}
        initialTab={agentIQInitialTab}
        prePrompt={agentIQPrePrompt}
        onClose={() => {
          setAgentIQOpen(false);
          setAgentIQPrePrompt("");
        }}
      />
    </div>
  );
}
