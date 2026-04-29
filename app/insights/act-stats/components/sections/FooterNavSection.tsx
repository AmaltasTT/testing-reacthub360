"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CircleArrowLeft, CircleArrowRight } from "lucide-react";
import { P } from "@/lib/act-stats/data";
import { pathWithCampaignFromSearchParams } from "@/lib/insights-campaign-url";

export function FooterNavSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const withCampaign = (path: string) => pathWithCampaignFromSearchParams(path, searchParams);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
      {/* Engage (left) */}
      <div
        style={{
          background: "linear-gradient(135deg, #F0F9FF 0%, #fff 100%)",
          borderRadius: 16,
          border: "1px solid #BAE6FD",
          padding: 28,
          cursor: "pointer",
          transition: "border-color 0.2s",
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = "#38BDF8")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = "#BAE6FD")}
        role="button"
        tabIndex={0}
        aria-label="Go to Engage Stats"
        onClick={() => router.push(withCampaign("/insights/engage-stats"))}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            router.push(withCampaign("/insights/engage-stats"));
          }
        }}
      >
        {/* Title row */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "#DBEAFE",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <CircleArrowLeft style={{ width: 24, height: 24, color: "#2563EB" }} />
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 600, color: P.text1, marginBottom: 2 }}>Engage</div>
            <div style={{ fontSize: 13, color: P.text3 }}>
              See how interest-driven engagement is building attention depth.
            </div>
          </div>
        </div>

        {/* OMTM block */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 1,
              textTransform: "uppercase",
              color: "#0284C7",
              marginBottom: 6,
            }}
          >
            OMTM
          </div>
          <div style={{ fontSize: 13, fontWeight: 500, color: P.text2, marginBottom: 6 }}>
            Engagement Quality Score
          </div>
          <div
            style={{
              fontSize: 38,
              fontWeight: 700,
              color: "#0284C7",
              letterSpacing: -1,
              fontVariantNumeric: "tabular-nums",
              lineHeight: 1,
            }}
          >
            7.4
          </div>
        </div>

        {/* KPI strip */}
        <div
          style={{
            paddingTop: 16,
            borderTop: "1px solid #BAE6FD",
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          {[
            { label: "ESR", value: "62.3%" },
            { label: "Content Depth", value: "4.8" },
            { label: "CpQE", value: "$1.82" },
          ].map((kpi, i) => (
            <React.Fragment key={kpi.label}>
              {i > 0 && <div style={{ width: 1, height: 32, background: "#BAE6FD" }} />}
              <div>
                <div style={{ fontSize: 11, color: P.text3, marginBottom: 4 }}>{kpi.label}</div>
                <div style={{ fontSize: 17, fontWeight: 600, color: P.text1, fontVariantNumeric: "tabular-nums" }}>
                  {kpi.value}
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Convert (right) */}
      <div
        style={{
          background: "linear-gradient(135deg, #FFF8F0 0%, #FFEFD9 40%, #FFFFFF 100%)",
          borderRadius: 16,
          border: "1px solid #FED7AA",
          padding: 28,
          cursor: "pointer",
          transition: "border-color 0.2s",
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = "#FFA726")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = "#FED7AA")}
        role="button"
        tabIndex={0}
        aria-label="Go to Convert Stats"
        onClick={() => router.push(withCampaign("/insights/convert-stats"))}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            router.push(withCampaign("/insights/convert-stats"));
          }
        }}
      >
        {/* Title row */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
              <div style={{ fontSize: 20, fontWeight: 600, color: P.text1 }}>Convert</div>
            </div>
            <div style={{ fontSize: 13, color: P.text3 }}>
              See how committed actions are translating into pipeline and revenue.
            </div>
          </div>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "#FFA726",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <CircleArrowRight style={{ width: 24, height: 24, color: "#fff" }} />
          </div>
        </div>

        {/* OMTM block */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 1,
              textTransform: "uppercase",
              color: "#F57C00",
              marginBottom: 6,
            }}
          >
            OMTM
          </div>
          <div style={{ fontSize: 13, fontWeight: 500, color: P.text2, marginBottom: 6 }}>
            Conversion rate (portfolio)
          </div>
          <div
            style={{
              fontSize: 38,
              fontWeight: 700,
              color: "#F57C00",
              letterSpacing: -1,
              fontVariantNumeric: "tabular-nums",
              lineHeight: 1,
            }}
          >
            12.5%
          </div>
        </div>

        {/* KPI strip */}
        <div
          style={{
            paddingTop: 16,
            borderTop: "1px solid #FED7AA",
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          {[
            { label: "Revenue", value: "$847K" },
            { label: "AOV", value: "$302" },
            { label: "CPCON", value: "1.5%" },
          ].map((kpi, i) => (
            <React.Fragment key={kpi.label}>
              {i > 0 && <div style={{ width: 1, height: 32, background: "#FED7AA" }} />}
              <div>
                <div style={{ fontSize: 11, color: P.text3, marginBottom: 4 }}>{kpi.label}</div>
                <div style={{ fontSize: 17, fontWeight: 600, color: P.text1, fontVariantNumeric: "tabular-nums" }}>
                  {kpi.value}
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
