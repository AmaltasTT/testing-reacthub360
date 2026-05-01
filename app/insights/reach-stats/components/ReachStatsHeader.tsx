"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { P, PERIOD_OPTIONS } from "@/lib/reach-stats/data";
import { useOverviewCampaigns } from "@/hooks/use-reach-overview";
import { insightsIqPathForCampaign } from "@/lib/insights-campaign-url";

interface ReachStatsHeaderProps {
  selectedCampaigns: string[];
  selectedPeriod: string;
  customDateRange: { from: string; to: string };
  onCampaignChange: (ids: string[]) => void;
  onPeriodChange: (period: string) => void;
  onCustomDateChange: (range: { from: string; to: string }) => void;
}

export function ReachStatsHeader({
  selectedCampaigns,
  selectedPeriod,
  customDateRange,
  onCampaignChange,
  onPeriodChange,
  onCustomDateChange,
}: ReachStatsHeaderProps) {
  const router = useRouter();
  const [showCampaignDropdown, setShowCampaignDropdown] = useState(false);
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const campaignRef = useRef<HTMLDivElement>(null);
  const customRef = useRef<HTMLDivElement>(null);

  const { data: campaignsData } = useOverviewCampaigns();
  const apiCampaigns = campaignsData?.campaigns ?? [];



  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (campaignRef.current && !campaignRef.current.contains(e.target as Node))
        setShowCampaignDropdown(false);
      if (customRef.current && !customRef.current.contains(e.target as Node))
        setShowCustomPicker(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isAllSelected = selectedCampaigns[0] === "all";

  const toggleCampaign = (id: string) => {
    onCampaignChange([id]);
    setShowCampaignDropdown(false);
  };

  const isCampaignSelected = (id: string) => selectedCampaigns[0] === id;

  const campaignDisplayText = () => {
    if (isAllSelected || selectedCampaigns.length === 0) return "All Campaigns";
    if (selectedCampaigns.length === 1) {
      return apiCampaigns.find((c) => c.id === selectedCampaigns[0])?.name ?? "Campaign";
    }
    return `${selectedCampaigns.length} Campaigns`;
  };

  const campaignSubText = () => {
    if (isAllSelected) return `${apiCampaigns.length} campaigns`;
    return "";
  };

  const periodLabel =
    selectedPeriod === "custom"
      ? `${customDateRange.from} – ${customDateRange.to}`
      : PERIOD_OPTIONS.find((p) => p.key === selectedPeriod)?.label;

  return (
    <div
      style={{
        padding: "28px 40px 0",
        position: "relative",
      }}
    >
      <div style={{ maxWidth: 1360, margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* Left accent bar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 3,
            height: 44,
            background: P.accent,
            borderRadius: 2,
          }}
        />

        {/* Breadcrumb */}
        <div style={{ paddingLeft: 16, marginBottom: 4 }}>
          <button
            onClick={() => router.push(insightsIqPathForCampaign(selectedCampaigns[0]))}
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.08em",
              color: P.accent,
              textTransform: "uppercase",
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              opacity: 0.7,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
          >
            REACT · REACH PHASE
          </button>
        </div>

        {/* Title row + Export */}
        <div style={{ paddingLeft: 16, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <h1
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: P.text1,
                letterSpacing: -0.5,
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              Reach Insights
            </h1>
            <p style={{ fontSize: 13, color: P.text3, marginTop: 6, fontWeight: 400 }}>
              Awareness goal ·{" "}
              {selectedPeriod === "custom"
                ? `${customDateRange.from} – ${customDateRange.to}`
                : `Last ${PERIOD_OPTIONS.find((p) => p.key === selectedPeriod)?.label}`}{" "}
              vs previous period
            </p>
          </div>
          <button
            style={{
              fontSize: 13,
              color: P.text2,
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              marginTop: 4,
            }}
          >
            Export ↓
          </button>
        </div>

        {/* Filter Bar */}
        <div
          style={{
            marginTop: 20,
            height: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Left: campaign selector + time period tabs */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>

            {/* Campaign selector */}
            <div ref={campaignRef} style={{ position: "relative" }}>
              <button
                onClick={() => setShowCampaignDropdown(!showCampaignDropdown)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "6px 12px", borderRadius: 6,
                  background: "#fff",
                  border: `1px solid ${P.border}`,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  cursor: "pointer", fontSize: 13,
                  color: P.text1,
                }}
              >
                <span style={{ fontSize: 10, color: P.accent, fontWeight: 700 }}>▶</span>
                <span style={{ fontWeight: 700 }}>{campaignDisplayText()}</span>
                <span style={{ fontSize: 12, color: P.text3, fontWeight: 400 }}>{campaignSubText()}</span>
                <span
                  style={{
                    fontSize: 9, color: P.text3,
                    transform: showCampaignDropdown ? "rotate(180deg)" : "none",
                    transition: "transform 0.2s",
                  }}
                >
                  ▼
                </span>
              </button>
              {showCampaignDropdown && (
                <div
                  style={{
                    position: "absolute", top: "calc(100% + 4px)", left: 0,
                    minWidth: 260, background: "#fff", borderRadius: 10,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                    border: `1px solid ${P.border}`,
                    zIndex: 200, padding: "6px 0", maxHeight: 320, overflowY: "auto",
                  }}
                >
                  {apiCampaigns.length === 0 ? (
                    <div style={{ padding: "12px 14px", fontSize: 13, color: P.text3 }}>Loading...</div>
                  ) : apiCampaigns.map((c) => {
                    const selected = isCampaignSelected(c.id);
                    return (
                      <button
                        key={c.id}
                        onClick={() => toggleCampaign(c.id)}
                        style={{
                          width: "100%", display: "flex", alignItems: "center", gap: 10,
                          padding: "9px 14px", border: "none",
                          background: selected ? P.accentSoft : "transparent",
                          cursor: "pointer", fontSize: 13, textAlign: "left",
                          transition: "background 0.15s",
                        }}
                      >
                        <span
                          style={{
                            width: 6, height: 6, borderRadius: "50%",
                            background: c.status === "active" ? "#34D399" : P.text3,
                            flexShrink: 0,
                          }}
                        />
                        <span style={{ flex: 1, fontWeight: selected ? 600 : 400, color: P.text1 }}>
                          {c.name}
                        </span>
                        {selected && (
                          <span style={{ fontSize: 12, color: P.accent, fontWeight: 700 }}>✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Time period tabs */}
            <div style={{ display: "flex", alignItems: "center", gap: 2, marginLeft: 8 }}>
              {PERIOD_OPTIONS.filter((p) => p.key !== "custom").map((p) => (
                <button
                  key={p.key}
                  onClick={() => { onPeriodChange(p.key); setShowCustomPicker(false); }}
                  style={{
                    padding: "6px 12px", border: "none", fontSize: 13,
                    fontWeight: selectedPeriod === p.key ? 600 : 400,
                    background: selectedPeriod === p.key ? P.accent : "transparent",
                    color: selectedPeriod === p.key ? "#fff" : P.text2,
                    borderRadius: 6,
                    cursor: "pointer", transition: "all 0.2s",
                  }}
                >
                  {p.label}
                </button>
              ))}

              {/* Custom date button */}
              <div ref={customRef} style={{ position: "relative" }}>
                <button
                  onClick={() => { onPeriodChange("custom"); setShowCustomPicker(!showCustomPicker); }}
                  style={{
                    padding: "6px 12px", borderRadius: 6, fontSize: 13,
                    fontWeight: selectedPeriod === "custom" ? 600 : 400,
                    background: selectedPeriod === "custom" ? P.accent : "transparent",
                    color: selectedPeriod === "custom" ? "#fff" : P.text2,
                    border: "none",
                    cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
                    transition: "all 0.2s",
                  }}
                >
                  <span style={{ fontSize: 11 }}>📅</span>
                  {selectedPeriod === "custom"
                    ? `${customDateRange.from.slice(5)} – ${customDateRange.to.slice(5)}`
                    : "Custom"}
                </button>
                {showCustomPicker && (
                  <div
                    style={{
                      position: "absolute", top: "calc(100% + 4px)", left: 0,
                      background: "#fff", borderRadius: 10,
                      boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                      border: `1px solid ${P.border}`,
                      zIndex: 200, padding: 16, display: "flex", gap: 12, alignItems: "center",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 11, color: P.text3, marginBottom: 4, fontWeight: 500 }}>From</div>
                      <input
                        type="date"
                        value={customDateRange.from}
                        onChange={(e) => onCustomDateChange({ ...customDateRange, from: e.target.value })}
                        style={{
                          padding: "6px 10px", borderRadius: 6,
                          border: `1px solid ${P.border}`, fontSize: 12,
                          color: P.text1, outline: "none",
                        }}
                      />
                    </div>
                    <span style={{ color: P.text3, marginTop: 16 }}>→</span>
                    <div>
                      <div style={{ fontSize: 11, color: P.text3, marginBottom: 4, fontWeight: 500 }}>To</div>
                      <input
                        type="date"
                        value={customDateRange.to}
                        onChange={(e) => onCustomDateChange({ ...customDateRange, to: e.target.value })}
                        style={{
                          padding: "6px 10px", borderRadius: 6,
                          border: `1px solid ${P.border}`, fontSize: 12,
                          color: P.text1, outline: "none",
                        }}
                      />
                    </div>
                    <button
                      onClick={() => setShowCustomPicker(false)}
                      style={{
                        padding: "6px 14px", borderRadius: 6, border: "none",
                        background: P.accent, color: "#fff", fontSize: 12,
                        fontWeight: 600, cursor: "pointer", marginTop: 16,
                      }}
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: showing label */}
          <div style={{ fontSize: 12, color: P.text3 }}>
            Showing:{" "}
            <strong style={{ color: P.text2 }}>{campaignDisplayText()}</strong>
            {" "}
            <strong style={{ color: P.text2 }}>{periodLabel}</strong>
          </div>
        </div>

      </div>
    </div>
  );
}
