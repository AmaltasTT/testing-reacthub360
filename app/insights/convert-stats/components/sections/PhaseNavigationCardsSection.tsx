"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { P } from "@/lib/convert-stats/data";
import { pathWithCampaignFromSearchParams } from "@/lib/insights-campaign-url";

export function PhaseNavigationCardsSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const withCampaign = (path: string) => pathWithCampaignFromSearchParams(path, searchParams);

  return (
    <div style={{ marginTop: 48, paddingBottom: 48 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, maxWidth: 1320 }}>
        <div
          role="button"
          tabIndex={0}
          onClick={() => router.push(withCampaign("/insights/act-stats"))}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              router.push(withCampaign("/insights/act-stats"));
            }
          }}
          style={{
            background: "linear-gradient(135deg, #F3F0FF 0%, #E6E0FF 40%, #FFFFFF 100%)",
            borderRadius: 16,
            border: `1px solid ${P.border}`,
            padding: "28px 32px",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #7C5CFC, #9B7DFC)" }} />
          <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "#7C5CFC",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 0 6px rgba(124,92,252,0.15)",
              }}
            >
              <ChevronLeft style={{ width: 22, height: 22, color: "#fff" }} />
            </div>
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: P.text1, margin: "0 0 4px" }}>Act</h3>
              <p style={{ fontSize: 13, color: P.text3, margin: 0, lineHeight: 1.4 }}>
                See how qualified intent is translating into committed actions.
              </p>
            </div>
          </div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "#7C5CFC", marginBottom: 6 }}>OMTM</div>
          <div style={{ fontSize: 14, fontWeight: 500, color: P.text2, marginBottom: 4 }}>Action Impact Score</div>
          <div style={{ fontSize: 40, fontWeight: 700, color: "#7C5CFC", letterSpacing: -1 }}>8.1</div>
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={() => router.push(withCampaign("/insights/talk-stats"))}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              router.push(withCampaign("/insights/talk-stats"));
            }
          }}
          style={{
            background: "linear-gradient(135deg, #FFF8F0 0%, #FFEFD9 40%, #FFFFFF 100%)",
            borderRadius: 16,
            border: "1px solid #FED7AA",
            padding: "28px 32px",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #FFA726, #FF9800)" }} />
          <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: P.text1, margin: "0 0 4px" }}>Talk</h3>
              <p style={{ fontSize: 13, color: P.text3, margin: 0, lineHeight: 1.4 }}>
                Post-conversion advocacy and retention (InsightsIQ hub).
              </p>
            </div>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "#FFA726",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 0 6px rgba(255,167,38,0.15)",
              }}
            >
              <ChevronRight style={{ width: 22, height: 22, color: "#fff" }} />
            </div>
          </div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "#F57C00", marginBottom: 6 }}>OMTM</div>
          <div style={{ fontSize: 14, fontWeight: 500, color: P.text2, marginBottom: 4 }}>Advocacy score</div>
          <div style={{ fontSize: 40, fontWeight: 700, color: "#F57C00", letterSpacing: -1 }}>58%</div>
        </div>
      </div>
    </div>
  );
}
