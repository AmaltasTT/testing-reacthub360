"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { TALK_PHASE_NAVIGATION } from "@/lib/talk-stats/data";
import { pathWithCampaignFromSearchParams } from "@/lib/insights-campaign-url";

type TalkView = "retention" | "advocacy";

interface PhaseNavigatorProps {
  activeView: TalkView;
}

export function PhaseNavigator({ activeView }: PhaseNavigatorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const withCampaign = (path: string) => pathWithCampaignFromSearchParams(path, searchParams);

  const nextCard =
    activeView === "advocacy"
      ? {
          label: "Reach",
          description: "Compounding loop — advocacy feeds the next cycle of reach",
          omtmLabel: "QUALIFIED REACH",
          omtmValue: "412K",
          metrics: [
            { label: "New Sessions", value: "96K" },
            { label: "Earned Lift", value: "+18%" },
            { label: "Referral Traffic", value: "14.2K" },
          ],
        }
      : TALK_PHASE_NAVIGATION.next;

  const handleNext = () => {
    if (activeView === "advocacy") {
      router.push(withCampaign("/insights/reach-stats"));
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("view", "advocacy");
    router.push(`/insights/talk-stats?${params.toString()}`);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        onClick={() => router.push(withCampaign("/insights/convert-stats"))}
        className="rounded-2xl border p-6 text-left transition-all hover:shadow-lg"
        style={{ borderColor: "var(--border)", backgroundColor: "white", cursor: "pointer" }}
      >
        <div className="mb-3 flex items-start justify-between">
          <ArrowLeft size={20} style={{ color: "var(--neutral-400)" }} />
          <span
            className="rounded px-2 py-0.5"
            style={{
              fontSize: "10px",
              fontWeight: 600,
              backgroundColor: "var(--purple)",
              color: "white",
              textTransform: "uppercase",
            }}
          >
            OMTM
          </span>
        </div>
        <div
          style={{
            fontSize: "18px",
            fontWeight: 600,
            color: "var(--neutral-900)",
            marginBottom: 4,
          }}
        >
          {TALK_PHASE_NAVIGATION.previous.label}
        </div>
        <div style={{ fontSize: "13px", color: "var(--neutral-500)", marginBottom: 12 }}>
          {TALK_PHASE_NAVIGATION.previous.description}
        </div>
        <div className="mb-3">
          <div
            style={{
              fontSize: "11px",
              color: "var(--neutral-500)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: 4,
            }}
          >
            {TALK_PHASE_NAVIGATION.previous.omtmLabel}
          </div>
          <div
            style={{
              fontSize: "24px",
              fontWeight: 600,
              color: "var(--neutral-900)",
              fontFamily: "var(--font-mono)",
            }}
          >
            {TALK_PHASE_NAVIGATION.previous.omtmValue}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {TALK_PHASE_NAVIGATION.previous.metrics.map((metric) => (
            <div key={metric.label}>
              <div style={{ fontSize: "11px", color: "var(--neutral-500)" }}>{metric.label}</div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "var(--neutral-900)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {metric.value}
              </div>
            </div>
          ))}
        </div>
      </button>

      <button
        onClick={handleNext}
        className="rounded-2xl border p-6 text-left transition-all hover:shadow-lg"
        style={{ borderColor: "var(--border)", backgroundColor: "white", cursor: "pointer" }}
      >
        <div className="mb-3 flex items-start justify-between">
          <span
            className="rounded px-2 py-0.5"
            style={{
              fontSize: "10px",
              fontWeight: 600,
              backgroundColor: activeView === "advocacy" ? "var(--blue)" : "var(--green)",
              color: "white",
              textTransform: "uppercase",
            }}
          >
            OMTM
          </span>
          <ArrowRight size={20} style={{ color: "var(--neutral-400)" }} />
        </div>
        <div
          style={{
            fontSize: "18px",
            fontWeight: 600,
            color: "var(--neutral-900)",
            marginBottom: 4,
          }}
        >
          {nextCard.label}
        </div>
        <div style={{ fontSize: "13px", color: "var(--neutral-500)", marginBottom: 12 }}>
          {nextCard.description}
        </div>
        <div className="mb-3">
          <div
            style={{
              fontSize: "11px",
              color: "var(--neutral-500)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: 4,
            }}
          >
            {nextCard.omtmLabel}
          </div>
          <div
            style={{
              fontSize: "24px",
              fontWeight: 600,
              color: "var(--neutral-900)",
              fontFamily: "var(--font-mono)",
            }}
          >
            {nextCard.omtmValue}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {nextCard.metrics.map((metric) => (
            <div key={metric.label}>
              <div style={{ fontSize: "11px", color: "var(--neutral-500)" }}>{metric.label}</div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "var(--neutral-900)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {metric.value}
              </div>
            </div>
          ))}
        </div>
      </button>
    </div>
  );
}
