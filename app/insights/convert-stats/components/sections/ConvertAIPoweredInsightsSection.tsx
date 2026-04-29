"use client";

import { useState, useEffect } from "react";
import { ChevronRight, ArrowRight, RefreshCw, X, Sparkles, TrendingUp, AlertCircle, Target, CheckCircle } from "lucide-react";
import { P } from "@/lib/convert-stats/data";

interface ActionableInsight {
  id: string;
  insight: string;
  insightDetails: string;
  metrics: { label: string; value: string }[];
  action: string;
  actionDetails: string;
  expectedImpact: { metric: string; value: string }[];
  channels: string[];
  priority: "high" | "medium" | "low";
  confidence: number;
  effort: "low" | "medium" | "high";
  timeframe: string;
  isNew?: boolean;
}

const actionableInsights: ActionableInsight[] = [
  {
    id: "1",
    insight: "Checkout friction",
    insightDetails: "Qualified→Purchased drop widened vs prior period",
    metrics: [{ label: "Qualified→Purchased drop", value: "↑3.3 pts" }],
    action: "Fix pricing page bounce rate",
    actionDetails:
      "A/B test a simplified single-page checkout with pre-filled plan selection; pricing page bounces spiked 12%.",
    expectedImpact: [{ metric: "Expected: CVR", value: "12.5% → 13.8%" }],
    channels: ["Website", "Checkout"],
    priority: "high",
    confidence: 92,
    effort: "low",
    timeframe: "2-3 days",
    isNew: true,
  },
  {
    id: "2",
    insight: "Email revenue concentration",
    insightDetails: "Top channel driving blended ROAS",
    metrics: [{ label: "Email share of revenue", value: "23%" }],
    action: "Scale winning creative",
    actionDetails:
      "Increase send volume on the top 2 performing journeys while holding CPCON flat with holdout tests.",
    expectedImpact: [{ metric: "Expected: Revenue", value: "+8-12%" }],
    channels: ["Email"],
    priority: "high",
    confidence: 88,
    effort: "medium",
    timeframe: "1 week",
  },
  {
    id: "3",
    insight: "AOV compression",
    insightDetails: "Mix shift toward starter tier",
    metrics: [{ label: "AOV vs prior", value: "−4.2%" }],
    action: "Bundle high-margin add-ons",
    actionDetails:
      "Promote annual prepay + onboarding bundle on checkout for Growth tier visitors.",
    expectedImpact: [{ metric: "Expected: AOV", value: "$120 → $128" }],
    channels: ["Website", "Stripe"],
    priority: "medium",
    confidence: 84,
    effort: "low",
    timeframe: "3-5 days",
  },
  {
    id: "4",
    insight: "Paid social CPCON drift",
    insightDetails: "Meta / IG CPCON above blended target",
    metrics: [{ label: "CPCON vs target", value: "+0.4pp" }],
    action: "Tighten conversion events",
    actionDetails:
      "Re-map pixel events and exclude low-intent landing pages from optimization.",
    expectedImpact: [{ metric: "Expected: CPCON", value: "1.5% → 1.2%" }],
    channels: ["Facebook Ads", "Instagram Ads"],
    priority: "medium",
    confidence: 79,
    effort: "low",
    timeframe: "1-2 days",
  },
];

const getEffortLabel = (effort: string) => {
  if (effort === "low") return "Quick win";
  if (effort === "medium") return "Moderate effort";
  return "High effort";
};

// ─── AgentIQ Sliding Panel ────────────────────────────────────
function AgentIQPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.2)",
          backdropFilter: "blur(4px)",
          zIndex: 40,
          transition: "opacity 0.3s",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
        }}
      />

      {/* Sliding panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: 960,
          background: "#fff",
          boxShadow: "-8px 0 32px rgba(0,0,0,0.12)",
          zIndex: 50,
          transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1)",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          display: "flex",
          flexDirection: "column",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif",
        }}
      >
        {/* Header */}
        <div style={{ position: "relative", borderBottom: "1px solid #E5E5E7", padding: "20px 24px" }}>
          {/* Purple accent line */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(to right, #7C3AED, #A78BFA)" }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* Indicator bar */}
              <div style={{ position: "relative" }}>
                <div style={{ width: 3, height: 24, background: "linear-gradient(to bottom, #7C3AED, #A78BFA, #7C3AED)", borderRadius: 2, boxShadow: "0 0 12px rgba(124,58,237,0.4)" }} />
              </div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 700, color: "#1D1D1F", letterSpacing: -0.3 }}>AgentIQ</div>
                <div style={{ fontSize: 11, color: "#86868B", fontWeight: 500 }}>Your Marketing Intelligence co-pilot</div>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "#F5F5F7", border: "none", cursor: "pointer" }}
            >
              <X size={16} color="#86868B" />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {/* Phase context banner */}
          <div style={{ background: "linear-gradient(to right, #F8F7FF, #FAFBFF)", borderBottom: "1px solid #E5E5E7", padding: "16px 32px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "linear-gradient(to right, #7C3AED, #A78BFA)" }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#86868B", textTransform: "uppercase", letterSpacing: "0.06em" }}>Currently Viewing</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1D1D1F" }}>Convert Phase • AgentIQ – Your Marketing Co-Pilot</div>
              </div>
              <div style={{ fontSize: 11, color: "#86868B" }}>March 8, 2026 • Live</div>
            </div>
          </div>

          {/* Two-column grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, padding: "24px 32px" }}>
            {/* Left: Strategic Insights */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <TrendingUp size={16} color="#7C3AED" />
                <span style={{ fontSize: 13, fontWeight: 700, color: "#1D1D1F", textTransform: "uppercase", letterSpacing: "0.06em" }}>Strategic Insights You're Reviewing</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { icon: <TrendingUp size={16} color="#7C3AED" />, iconBg: "rgba(124,58,237,0.1)", title: "Content-Led Campaigns Drive Quality", desc: "White paper downloads show 42% higher ACR than demo requests", badge: "Priority: High", badgeColor: "#34C759", meta: "Impact: +8.2% ACR" },
                  { icon: <AlertCircle size={16} color="#FF6B35" />, iconBg: "rgba(255,107,53,0.1)", title: "Trial Hesitation in Enterprise Segment", desc: "38% of Fortune 500 visitors don't proceed to trial signup", badge: "Priority: High", badgeColor: "#FF6B35", meta: "Revenue Risk: $2.3M" },
                  { icon: <Target size={16} color="#7C3AED" />, iconBg: "rgba(124,58,237,0.1)", title: "Social Proof Accelerates Conversions", desc: "Case study pages have 3.2× higher trial signup rate", badge: "Priority: Medium", badgeColor: "#007AFF", meta: "Impact: +12% ACR" },
                ].map((item, i) => (
                  <div key={i} style={{ background: "#fff", border: "1px solid #E5E5E7", borderRadius: 8, padding: 16 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: item.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{item.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#1D1D1F", marginBottom: 4 }}>{item.title}</div>
                        <div style={{ fontSize: 11, color: "#86868B", lineHeight: 1.6, marginBottom: 8 }}>{item.desc}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 10, fontWeight: 600, color: item.badgeColor, background: `${item.badgeColor}18`, padding: "2px 8px", borderRadius: 4 }}>{item.badge}</span>
                          <span style={{ fontSize: 10, color: "#86868B" }}>{item.meta}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button style={{ width: "100%", marginTop: 16, padding: "8px 16px", fontSize: 12, fontWeight: 600, color: "#7C3AED", background: "rgba(124,58,237,0.05)", border: "none", borderRadius: 8, cursor: "pointer" }}>
                Explore All Strategic Insights →
              </button>
            </div>

            {/* Right: Recommended Actions */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <CheckCircle size={16} color="#7C3AED" />
                <span style={{ fontSize: 13, fontWeight: 700, color: "#1D1D1F", textTransform: "uppercase", letterSpacing: "0.06em" }}>Recommended Actions You're Considering</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { icon: <Target size={16} color="#34C759" />, iconBg: "rgba(52,199,89,0.1)", title: "Promote White Papers on Homepage", desc: "Feature gated content above-the-fold to capture qualified leads", badge: "High Impact", badgeColor: "#34C759", meta: "Est. +15% Qualified Visits" },
                  { icon: <AlertCircle size={16} color="#FF6B35" />, iconBg: "rgba(255,107,53,0.1)", title: "Add Security Compliance Page", desc: "Address enterprise concerns with SOC2, GDPR badges prominently", badge: "Urgent", badgeColor: "#FF6B35", meta: "Est. +22% Enterprise ACR" },
                  { icon: <Target size={16} color="#007AFF" />, iconBg: "rgba(0,122,255,0.1)", title: "Expand Case Study Library", desc: "Create 5 industry-specific success stories with video testimonials", badge: "Medium Impact", badgeColor: "#007AFF", meta: "Est. +18% Trial Signups" },
                ].map((item, i) => (
                  <div key={i} style={{ background: "#fff", border: "1px solid #E5E5E7", borderRadius: 8, padding: 16 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: item.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{item.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#1D1D1F", marginBottom: 4 }}>{item.title}</div>
                        <div style={{ fontSize: 11, color: "#86868B", lineHeight: 1.6, marginBottom: 8 }}>{item.desc}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 10, fontWeight: 600, color: item.badgeColor, background: `${item.badgeColor}18`, padding: "2px 8px", borderRadius: 4 }}>{item.badge}</span>
                          <span style={{ fontSize: 10, color: "#86868B" }}>{item.meta}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button style={{ width: "100%", marginTop: 16, padding: "8px 16px", fontSize: 12, fontWeight: 600, color: "#7C3AED", background: "rgba(124,58,237,0.05)", border: "none", borderRadius: 8, cursor: "pointer" }}>
                View All Recommended Actions →
              </button>
            </div>
          </div>

          {/* Suggested questions */}
          <div style={{ padding: "0 32px 24px" }}>
            <div style={{ background: "linear-gradient(to right, #F8F7FF, #FAFBFF)", border: "1px solid #E5E5E7", borderRadius: 12, padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <Sparkles size={16} color="#7C3AED" />
                <span style={{ fontSize: 13, fontWeight: 700, color: "#1D1D1F" }}>Ask AgentIQ about these insights</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  "What's the ROI if I implement all high-priority actions?",
                  "Should I prioritize enterprise security or content strategy first?",
                  "Show me the data behind the white paper performance",
                  "What's the fastest way to increase ACR by 10%?",
                  "Which actions have worked for similar companies?",
                  "Help me build an action plan for the next 30 days",
                ].map((prompt, i) => (
                  <button
                    key={i}
                    style={{ textAlign: "left", padding: "12px 16px", background: "#fff", border: "1px solid #E5E5E7", borderRadius: 8, cursor: "pointer", fontSize: 12, color: "#1D1D1F" }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Input area */}
        <div style={{ borderTop: "1px solid #E5E5E7", padding: 16, background: "#FAFAFA" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #D2D2D7", borderRadius: 8, padding: "12px 16px" }}>
            <Sparkles size={16} color="#7C3AED" />
            <input
              type="text"
              placeholder="Ask AgentIQ anything about your Convert Phase insights..."
              disabled
              style={{ flex: 1, fontSize: 13, color: "#1D1D1F", border: "none", outline: "none", background: "transparent" }}
            />
            <button
              disabled
              style={{ padding: "6px 16px", background: "linear-gradient(to right, #7C3AED, #9B8FFF)", color: "#fff", fontSize: 12, fontWeight: 600, borderRadius: 6, border: "none", opacity: 0.5, cursor: "not-allowed" }}
            >
              Send
            </button>
          </div>
          <div style={{ fontSize: 10, color: "#86868B", marginTop: 8, textAlign: "center" }}>Conversational AI interface coming soon</div>
        </div>
      </div>
    </>
  );
}

// ─── Main Section ─────────────────────────────────────────────
export function ConvertAIPoweredInsightsSection() {
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);
  const [isLiveAnalyzing, setIsLiveAnalyzing] = useState(true);
  const [isAgentIQOpen, setIsAgentIQOpen] = useState(false);
  const [showPulsation, setShowPulsation] = useState(false);

  useEffect(() => {
    let scrollTimeout: ReturnType<typeof setTimeout>;
    let pulsationTimeout: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      clearTimeout(pulsationTimeout);
      setShowPulsation(false);
      scrollTimeout = setTimeout(() => {
        setShowPulsation(true);
        pulsationTimeout = setTimeout(() => setShowPulsation(false), 10000);
      }, 150);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
      clearTimeout(pulsationTimeout);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setIsLiveAnalyzing((p) => !p), 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ marginBottom: 32 }}>
      {/* Section header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, gap: 16 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div style={{ position: "relative", paddingTop: 2 }}>
            <div
              style={{
                width: 3,
                height: 24,
                background: "linear-gradient(to bottom, #7C3AED, #A78BFA, #7C3AED)",
                borderRadius: 2,
                boxShadow: "0 0 12px rgba(124,58,237,0.5)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                width: 3,
                height: 24,
                background: "linear-gradient(to bottom, #7C3AED, #A78BFA)",
                borderRadius: 2,
                animation: "pulse 2s infinite",
                opacity: 0.5,
              }}
            />
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: P.text1, letterSpacing: -0.3, margin: 0, lineHeight: 1, marginBottom: 4 }}>
              AgentIQ – Your Marketing Co-Pilot
            </h2>
            <p style={{ fontSize: 13, color: P.text3, margin: 0 }}>Unlock Insights. Drive Winning Actions.</p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", background: "#fff", border: "1px solid #D2D2D7", borderRadius: 8 }}>
            <button
              onClick={() => { setIsLiveAnalyzing(true); setTimeout(() => setIsLiveAnalyzing(false), 2000); }}
              style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}
              aria-label="Refresh insights"
            >
              <RefreshCw size={12} color="#86868B" />
            </button>
            <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.06em", color: "#86868B" }}>REFRESH</span>
            <div style={{ width: 1, height: 12, background: "#D2D2D7" }} />
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#34C759", animation: isLiveAnalyzing ? "pulse 1.5s infinite" : "none" }} />
            <span style={{ fontSize: 9, fontWeight: 600, color: P.text1 }}>2m ago</span>
          </div>
        </div>
      </div>

      {/* Main card */}
      <div style={{ background: "#FAFBFF", borderRadius: 20, border: "1px solid #E8E8ED", padding: 24, boxShadow: "0 8px 32px rgba(124,58,237,0.12)" }}>
        {/* Card header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #F0F0F5" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", color: P.accent, textTransform: "uppercase", marginBottom: 2 }}>YOUR NEXT MOVE</div>
            <div style={{ fontSize: 10, color: "#86868B" }}>Prioritized by impact × urgency</div>
          </div>
          <div style={{ padding: "6px 10px", background: "#fff", border: "1px solid #E8E8ED", borderRadius: 8 }}>
            <span style={{ fontSize: 9, fontWeight: 600, color: P.accent, letterSpacing: "0.04em" }}>{actionableInsights.length} ACTIONS</span>
          </div>
        </div>

        {/* Insight rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {actionableInsights.map((item) => {
            const isExpanded = expandedInsight === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setExpandedInsight(isExpanded ? null : item.id)}
                style={{
                  position: "relative",
                  background: "#fff",
                  borderRadius: 16,
                  border: isExpanded ? `1px solid ${P.accent}` : "1px solid #E8E8ED",
                  boxShadow: isExpanded ? "0 4px 20px rgba(124,58,237,0.15)" : "none",
                  cursor: "pointer",
                  overflow: "hidden",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
              >
                {/* Left accent bar */}
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: isExpanded ? P.accent : "#F0F0F5", transition: "background 0.2s" }} />

                <div style={{ paddingLeft: 20, paddingRight: 16, paddingTop: 14, paddingBottom: 14 }}>
                  {/* Collapsed row */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                      <div style={{ position: "relative", flexShrink: 0 }}>
                        <ChevronRight
                          size={16}
                          color={P.accent}
                          style={{ transition: "transform 0.3s", transform: isExpanded ? "rotate(90deg)" : "none" }}
                        />
                        {!isExpanded && showPulsation && (
                          <div style={{ position: "absolute", inset: 0, width: 16, height: 16, borderRadius: "50%", border: `2px solid ${P.accent}`, opacity: 0.3, animation: "ping 1s infinite" }} />
                        )}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 13, color: P.text1 }}>{item.insight}</span>
                          <ChevronRight size={12} color="#C7C7CC" />
                          <span style={{ fontSize: 13, color: P.accent }}>{item.action}</span>
                          {item.isNew && (
                            <span style={{ fontSize: 9, fontWeight: 700, color: "#fff", background: "#34C759", padding: "1px 6px", borderRadius: 4, letterSpacing: "0.06em" }}>
                              NEW
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                      <div style={{ fontSize: 10, color: "#86868B", background: "#F5F5F7", padding: "5px 10px", borderRadius: 8, whiteSpace: "nowrap" }}>
                        {item.insightDetails}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "5px 10px", borderRadius: 8, border: `1px solid ${P.accent}`, background: "#F9F8FF" }}>
                        <span style={{ fontSize: 8, fontWeight: 500, color: P.accent, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.06em", lineHeight: 1, marginBottom: 2 }}>
                          AI Confidence
                        </span>
                        <span style={{ fontSize: 11, fontWeight: 600, color: P.accent, lineHeight: 1 }}>{item.confidence}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #F5F5F7" }}>
                      {/* Insight block */}
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
                        <span style={{ fontSize: 8, fontWeight: 700, color: "#fff", background: "#86868B", padding: "3px 8px", borderRadius: 6, textTransform: "uppercase", letterSpacing: "0.06em", flexShrink: 0 }}>
                          Insight
                        </span>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: P.text1, marginBottom: 6 }}>{item.insight}</div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                            {item.metrics.map((m, i) => (
                              <span key={i} style={{ fontSize: 11, color: "#86868B" }}>
                                {m.label}{" "}
                                <span style={{ fontWeight: 600, color: P.accent }}>{m.value}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Arrow connector */}
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, padding: "0 12px" }}>
                        <div style={{ height: 1, flex: 1, background: "linear-gradient(to right, transparent, #E8E8ED, transparent)" }} />
                        <ArrowRight size={16} color={P.accent} />
                        <div style={{ height: 1, flex: 1, background: "linear-gradient(to right, transparent, #E8E8ED, transparent)" }} />
                      </div>

                      {/* Action block */}
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
                        <span style={{ fontSize: 8, fontWeight: 700, color: "#fff", background: P.accent, padding: "3px 8px", borderRadius: 6, textTransform: "uppercase", letterSpacing: "0.06em", flexShrink: 0 }}>
                          Action
                        </span>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: P.accent, marginBottom: 6 }}>{item.action}</div>
                          <p style={{ fontSize: 11, color: "#4B5563", lineHeight: 1.6, marginBottom: 8 }}>{item.actionDetails}</p>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                            {item.expectedImpact.map((impact, i) => (
                              <span key={i} style={{ fontSize: 11, fontWeight: 600, color: P.accent }}>
                                {impact.metric} {impact.value}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div style={{ paddingTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                          {item.channels.map((ch) => (
                            <span key={ch} style={{ fontSize: 10, padding: "5px 10px", background: "#F5F5F7", color: "#86868B", borderRadius: 8 }}>
                              {ch}
                            </span>
                          ))}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 10, color: P.accent, background: "#F9F8FF", padding: "5px 12px", borderRadius: 8, border: "1px solid #E8E8ED" }}>
                            {getEffortLabel(item.effort)} · {item.timeframe}
                          </span>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            style={{ fontSize: 11, fontWeight: 600, color: "#fff", background: P.accent, border: "none", padding: "7px 16px", borderRadius: 8, cursor: "pointer" }}
                          >
                            Act now →
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div style={{ marginTop: 20, display: "flex", justifyContent: "center" }}>
        <button
          onClick={() => setIsAgentIQOpen(true)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: `linear-gradient(to right, ${P.accent}, #9B8FFF)`,
            color: "#fff",
            fontSize: 12,
            fontWeight: 600,
            padding: "10px 20px",
            borderRadius: 24,
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(124,58,237,0.25)",
          }}
        >
          Show Me More From AgentIQ
          <span style={{ fontSize: 14 }}>→</span>
        </button>
      </div>

      <AgentIQPanel isOpen={isAgentIQOpen} onClose={() => setIsAgentIQOpen(false)} />
    </div>
  );
}
