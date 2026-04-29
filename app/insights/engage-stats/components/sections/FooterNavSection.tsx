"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CircleArrowLeft, CircleArrowRight } from "lucide-react";
import { P } from "@/lib/engage-stats/data";
import { pathWithCampaignFromSearchParams } from "@/lib/insights-campaign-url";

export function FooterNavSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const withCampaign = (path: string) => pathWithCampaignFromSearchParams(path, searchParams);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
      {/* Reach (left) */}
      <div
        style={{
          background: "linear-gradient(135deg, #F0F9FF 0%, #fff 100%)",
          borderRadius: 16,
          border: "1px solid #BAE6FD",
          padding: 28,
          cursor: "pointer",
          transition: "border-color 0.2s",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLDivElement).style.borderColor = "#38BDF8")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLDivElement).style.borderColor = "#BAE6FD")
        }
        role="button"
        tabIndex={0}
        aria-label="Go to Reach Stats"
        onClick={() => router.push(withCampaign("/insights/reach-stats"))}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            router.push(withCampaign("/insights/reach-stats"));
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
            <div style={{ fontSize: 20, fontWeight: 600, color: P.text1, marginBottom: 2 }}>
              Reach
            </div>
            <div style={{ fontSize: 13, color: P.text3 }}>
              See how attention is compounding across channels.
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
            Qualified Reach
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
            55.9M
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
          <div>
            <div style={{ fontSize: 11, color: P.text3, marginBottom: 4 }}>
              Qualified Reach Rate
            </div>
            <div
              style={{
                fontSize: 17,
                fontWeight: 600,
                color: P.text1,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              78.2%
            </div>
          </div>
          <div style={{ width: 1, height: 32, background: "#BAE6FD" }} />
          <div>
            <div style={{ fontSize: 11, color: P.text3, marginBottom: 4 }}>
              Audience Penetration Rate
            </div>
            <div
              style={{
                fontSize: 17,
                fontWeight: 600,
                color: P.text1,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              42.6%
            </div>
          </div>
          <div style={{ width: 1, height: 32, background: "#BAE6FD" }} />
          <div>
            <div style={{ fontSize: 11, color: P.text3, marginBottom: 4 }}>
              Cost per Qualified Reach
            </div>
            <div
              style={{
                fontSize: 17,
                fontWeight: 600,
                color: P.text1,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              $3.14
            </div>
          </div>
        </div>
      </div>

      {/* Act (right) */}
      <div
        style={{
          background: "linear-gradient(135deg, #FAF5FF 0%, #fff 100%)",
          borderRadius: 16,
          border: "1px solid #DDD6FE",
          padding: 28,
          cursor: "pointer",
          transition: "border-color 0.2s",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLDivElement).style.borderColor = "#A78BFA")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLDivElement).style.borderColor = "#DDD6FE")
        }
        role="button"
        tabIndex={0}
        aria-label="Go to Act Stats"
        onClick={() => router.push(withCampaign("/insights/act-stats"))}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            router.push(withCampaign("/insights/act-stats"));
          }
        }}
      >
        {/* Title row */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 600, color: P.text1, marginBottom: 2 }}>
              Act
            </div>
            <div style={{ fontSize: 13, color: P.text3 }}>
              See how qualified attention is converting into action.
            </div>
          </div>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "#A78BFA",
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
              color: "#7C3AED",
              marginBottom: 6,
            }}
          >
            OMTM
          </div>
          <div style={{ fontSize: 13, fontWeight: 500, color: P.text2, marginBottom: 6 }}>
            Action Completion Rate
          </div>
          <div
            style={{
              fontSize: 38,
              fontWeight: 700,
              color: "#7C3AED",
              letterSpacing: -1,
              fontVariantNumeric: "tabular-nums",
              lineHeight: 1,
            }}
          >
            34%
          </div>
        </div>

        {/* KPI strip */}
        <div
          style={{
            paddingTop: 16,
            borderTop: "1px solid #DDD6FE",
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div>
            <div style={{ fontSize: 11, color: P.text3, marginBottom: 4 }}>
              Action Impact
            </div>
            <div
              style={{
                fontSize: 17,
                fontWeight: 600,
                color: P.text1,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              8.2
            </div>
          </div>
          <div style={{ width: 1, height: 32, background: "#DDD6FE" }} />
          <div>
            <div style={{ fontSize: 11, color: P.text3, marginBottom: 4 }}>
              Action Quality
            </div>
            <div
              style={{
                fontSize: 17,
                fontWeight: 600,
                color: P.text1,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              7.8
            </div>
          </div>
          <div style={{ width: 1, height: 32, background: "#DDD6FE" }} />
          <div>
            <div style={{ fontSize: 11, color: P.text3, marginBottom: 4 }}>
              Cost per Action
            </div>
            <div
              style={{
                fontSize: 17,
                fontWeight: 600,
                color: P.text1,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              $2.40
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
