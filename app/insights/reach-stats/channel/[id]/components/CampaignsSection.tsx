"use client";
import React from "react";
import { Card } from "./shared/Card";
import { Pill } from "./shared/Pill";
import { CampaignAccordion } from "./CampaignAccordion";
import { OverlapCard } from "./OverlapCard";
import type { TransformedCampaignRow } from "@/lib/reach-stats/channel-transforms";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const campTrendData = [
  { date: "Jan 25", cpc: 18.2, freq: 5.4 },
  { date: "Jan 26", cpc: 19.4, freq: 5.6 },
  { date: "Jan 27", cpc: 19.8, freq: 5.8 },
  { date: "Jan 28", cpc: 20.1, freq: 5.9 },
  { date: "Jan 29", cpc: 20.9, freq: 6.0 },
  { date: "Jan 30", cpc: 21.2, freq: 6.15 },
  { date: "Jan 31", cpc: 21.43, freq: 6.25 },
];

const formatK = (value: number) =>
  value >= 1000 ? `${Math.round(value / 1000)}K` : `${value}`;

const newAudQualifiedReachData = [
  { date: "Jan 25", qualifiedReach: 34000 },
  { date: "Jan 26", qualifiedReach: 41000 },
  { date: "Jan 27", qualifiedReach: 48000 },
  { date: "Jan 28", qualifiedReach: 57000 },
  { date: "Jan 29", qualifiedReach: 68000 },
  { date: "Jan 30", qualifiedReach: 81000 },
  { date: "Jan 31", qualifiedReach: 97000 },
];

const videoViewsTrendData = [
  { date: "Jan 1", videoViews: 24000, viewRate: 78 },
  { date: "Jan 5", videoViews: 58000, viewRate: 79 },
  { date: "Jan 9", videoViews: 98000, viewRate: 80 },
  { date: "Jan 13", videoViews: 142000, viewRate: 81 },
  { date: "Jan 17", videoViews: 186000, viewRate: 81 },
  { date: "Jan 21", videoViews: 218000, viewRate: 82 },
  { date: "Jan 25", videoViews: 252000, viewRate: 82 },
  { date: "Jan 31", videoViews: 278000, viewRate: 82 },
];

type CampaignAnchorId =
  | "camp-retargeting"
  | "camp-new-audiences"
  | "camp-brand-awareness"
  | "camp-video-views";

export const CampaignsSection = ({
  isOrganic,
  channelName,
  campaigns,
  scrollTo,
  data,
}: {
  isOrganic: boolean;
  channelName: string;
  campaigns: number;
  scrollTo: (id: string) => void;
  data?: TransformedCampaignRow[];
}) => {
  const [videoTab, setVideoTab] = React.useState<
    "demo" | "time" | "interest" | "geo"
  >("demo");
  const campaignCardRefs = React.useRef<
    Record<CampaignAnchorId, HTMLDivElement | null>
  >({
    "camp-retargeting": null,
    "camp-new-audiences": null,
    "camp-brand-awareness": null,
    "camp-video-views": null,
  });
  const [openCampaigns, setOpenCampaigns] = React.useState<
    Record<CampaignAnchorId, boolean>
  >({
    "camp-retargeting": true,
    "camp-new-audiences": true,
    "camp-brand-awareness": false,
    "camp-video-views": false,
  });

  const handleCampaignTableClick = (campaignId: CampaignAnchorId) => {
    setOpenCampaigns((prev) => ({ ...prev, [campaignId]: true }));
    requestAnimationFrame(() => {
      campaignCardRefs.current[campaignId]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  return (
    <Card>
      <div className="px-7 py-5">
        <h2 className="text-base font-bold tracking-tight">Campaigns</h2>
        <p className="text-[12px] text-gray-400 mt-0.5">
          {isOrganic
            ? <>Organic channel &mdash; no paid campaigns</>
            : <>{data?.length ?? campaigns} active campaigns &middot; 1 needs immediate attention</>}
        </p>
      </div>
      <div className="p-6">
        {isOrganic ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
            <div className="text-5xl">🌱</div>
            <h3 className="text-base font-bold text-gray-700">
              Organic channels have no paid campaigns
            </h3>
            <p className="text-[13px] text-gray-400 max-w-sm leading-relaxed">
              {channelName} is an organic channel. Performance here is driven by
              content strategy, SEO, and audience engagement — not paid ad
              campaigns.
            </p>
            <button
              onClick={() => scrollTo("reach")}
              className="mt-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-xl text-[13px] font-semibold hover:bg-purple-200 transition-colors"
            >
              View Reach metrics instead →
            </button>
          </div>
        ) : (
          <>
            {/* Comparison table */}
            <div className="mb-5">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-3">
                Campaign Comparison — At a Glance
              </p>
              <div className="overflow-x-auto border border-gray-100 rounded-xl">
                <table className="w-full border-collapse text-[12px]">
                  <thead className="bg-gray-50">
                    <tr>
                      {[
                        "Campaign",
                        "Spend",
                        "ROAS",
                        "Purchases",
                        "CpC",
                        "Sat. %",
                        "Freq",
                        "Health",
                      ].map((h) => (
                        <th
                          key={h}
                          className="text-left px-3 py-2.5 text-[10px] font-bold text-gray-400 uppercase border-b-2 border-gray-100"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data && data.length > 0 ? (
                      data.map((campaign, i) => (
                        <tr key={campaign.id} className={`${i < data.length - 1 ? "border-b border-gray-100" : ""} hover:bg-gray-50`}>
                          <td className="px-3 py-2.5 font-semibold text-[#7652b3]">
                            {campaign.name}
                          </td>
                          <td className="px-3 py-2.5 font-mono">{campaign.spend}</td>
                          <td className="px-3 py-2.5 font-mono">{campaign.roas}</td>
                          <td className="px-3 py-2.5 font-mono">{campaign.purchases}</td>
                          <td className="px-3 py-2.5 font-mono">{campaign.costPerConversion}</td>
                          <td className="px-3 py-2.5 font-mono">—</td>
                          <td className="px-3 py-2.5 font-mono">—</td>
                          <td className="px-3 py-2.5">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                              —
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <>
                        <tr className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-3 py-2.5 font-semibold text-[#7652b3] cursor-pointer hover:underline">
                            <button type="button" onClick={() => handleCampaignTableClick("camp-retargeting")} className="text-left hover:underline">
                              Retargeting - Engagers
                            </button>
                          </td>
                          <td className="px-3 py-2.5 font-mono">$2,400</td>
                          <td className="px-3 py-2.5 font-mono">3.1×</td>
                          <td className="px-3 py-2.5 font-mono">112</td>
                          <td className="px-3 py-2.5 font-mono">$21.43 <span className="text-[10px] font-semibold text-[#e11d48]">↑18%</span></td>
                          <td className="px-3 py-2.5 font-mono text-[#e11d48] font-semibold">71%</td>
                          <td className="px-3 py-2.5 font-mono text-[#e11d48]">6.25×</td>
                          <td className="px-3 py-2.5"><span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-[#e11d48]">Critical</span></td>
                        </tr>
                        <tr className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-3 py-2.5 font-semibold text-[#7652b3] cursor-pointer hover:underline">
                            <button type="button" onClick={() => handleCampaignTableClick("camp-new-audiences")} className="text-left hover:underline">
                              New Audiences
                            </button>
                          </td>
                          <td className="px-3 py-2.5 font-mono">$5,200</td>
                          <td className="px-3 py-2.5 font-mono">2.8×</td>
                          <td className="px-3 py-2.5 font-mono">189</td>
                          <td className="px-3 py-2.5 font-mono">$22.47 <span className="text-[10px] font-semibold text-gray-400">→</span></td>
                          <td className="px-3 py-2.5 font-mono text-[#7652b3]">4.5%</td>
                          <td className="px-3 py-2.5 font-mono text-[#7652b3]">1.8×</td>
                          <td className="px-3 py-2.5"><span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">Growing</span></td>
                        </tr>
                        <tr className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-3 py-2.5 font-semibold text-[#7652b3] cursor-pointer hover:underline">
                            <button type="button" onClick={() => handleCampaignTableClick("camp-brand-awareness")} className="text-left hover:underline">
                              Brand Awareness
                            </button>
                          </td>
                          <td className="px-3 py-2.5 font-mono">$6,800</td>
                          <td colSpan={3} className="px-3 py-2.5 font-mono text-[10px] text-gray-400">Brand objective - <span className="text-green-600 font-semibold text-[12px]">72% VCR · 6.4% Eng Rate · 62K qual. reach</span></td>
                          <td className="px-3 py-2.5 font-mono text-gray-400">—</td>
                          <td className="px-3 py-2.5 font-mono text-amber-500 font-semibold">5.0×</td>
                          <td className="px-3 py-2.5"><span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">Stable</span></td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-3 py-2.5 font-semibold text-[#7652b3] cursor-pointer hover:underline">
                            <button type="button" onClick={() => handleCampaignTableClick("camp-video-views")} className="text-left hover:underline">
                              Video Views
                            </button>
                          </td>
                          <td className="px-3 py-2.5 font-mono">$3,800</td>
                          <td className="px-3 py-2.5 font-mono">—</td>
                          <td className="px-3 py-2.5 font-mono">82% VR</td>
                          <td className="px-3 py-2.5 font-mono">—</td>
                          <td className="px-3 py-2.5 font-mono">—</td>
                          <td className="px-3 py-2.5 font-mono">—</td>
                          <td className="px-3 py-2.5"><span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">Stable</span></td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ marginBottom: "1.25rem" }}>
              <div
                className="text-[10px] font-bold text-gray-400 uppercase tracking-wide"
                style={{ marginBottom: "0.875rem" }}
              >
                Cross-Campaign Patterns
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4,1fr)",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    background: "linear-gradient(160deg,#F0EAFF,#F0EAFF)",
                    border: "1px solid #EDE8F7",
                    borderRadius: 12,
                    padding: "1.125rem 1rem 1rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: 0,
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.5rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "#7652B3",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Audience
                  </div>
                  <div
                    style={{
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "#111827",
                      lineHeight: 1.3,
                      marginBottom: "0.75rem",
                    }}
                  >
                    25–34 Female wins across all 4 campaigns
                  </div>
                  <div
                    style={{
                      fontSize: "0.6875rem",
                      color: "#4B5563",
                      lineHeight: 1.65,
                      flex: 1,
                    }}
                  >
                    ↓ $18.21 CpC · Retargeting
                    <br />
                    58% conversion share · New Aud.
                    <br />
                    8.8% eng rate · Brand Awareness
                    <br />
                    88% view rate · Video Views
                  </div>
                  <div
                    style={{
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      color: "#1F2937",
                      lineHeight: 1.4,
                      margin: "0.875rem 0 0.875rem",
                    }}
                  >
                    Bid +20% for this segment, all campaigns
                  </div>
                  <button
                    type="button"
                    style={{
                      width: "100%",
                      padding: "0.625rem 0.75rem",
                      background: "#7652B3",
                      color: "#fff",
                      border: "none",
                      borderRadius: 12,
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      fontFamily: "inherit",
                      cursor: "pointer",
                      letterSpacing: "0.01em",
                    }}
                  >
                    More Insights with AgentIQ →
                  </button>
                </div>

                <div
                  style={{
                    background: "linear-gradient(160deg,#F0EAFF,#F0EAFF)",
                    border: "1px solid #EDE8F7",
                    borderRadius: 12,
                    padding: "1.125rem 1rem 1rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: 0,
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.5rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "#7652B3",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Timing
                  </div>
                  <div
                    style={{
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "#111827",
                      lineHeight: 1.3,
                      marginBottom: "0.75rem",
                    }}
                  >
                    Thu–Sun 6pm–12am dominates every campaign
                  </div>
                  <div
                    style={{
                      fontSize: "0.6875rem",
                      color: "#4B5563",
                      lineHeight: 1.65,
                      flex: 1,
                    }}
                  >
                    73% of retargeting conversions
                    <br />
                    68% of acquisition conversions
                    <br />
                    $9.80 CPM · lowest awareness cost
                    <br />
                    89% video view rate
                  </div>
                  <div
                    style={{
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      color: "#1F2937",
                      lineHeight: 1.4,
                      margin: "0.875rem 0 0.875rem",
                    }}
                  >
                    Enable dayparting, exclude 12am–9am
                  </div>
                  <button
                    type="button"
                    style={{
                      width: "100%",
                      padding: "0.625rem 0.75rem",
                      background: "#7652B3",
                      color: "#fff",
                      border: "none",
                      borderRadius: 12,
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      fontFamily: "inherit",
                      cursor: "pointer",
                      letterSpacing: "0.01em",
                    }}
                  >
                    More Insights with AgentIQ →
                  </button>
                </div>

                <div
                  style={{
                    background: "linear-gradient(160deg,#F0EAFF,#F0EAFF)",
                    border: "1px solid #EDE8F7",
                    borderRadius: 12,
                    padding: "1.125rem 1rem 1rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: 0,
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.5rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "#7652B3",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Interests
                  </div>
                  <div
                    style={{
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "#111827",
                      lineHeight: 1.3,
                      marginBottom: "0.75rem",
                    }}
                  >
                    Home Improvement + DIY top performers everywhere
                  </div>
                  <div
                    style={{
                      fontSize: "0.6875rem",
                      color: "#4B5563",
                      lineHeight: 1.65,
                      flex: 1,
                    }}
                  >
                    60% below avg CpC · Retargeting
                    <br />
                    $20 avg CpC · New Audiences
                    <br />
                    71% video completion rate · Brand Awareness
                    <br />
                    0:42 avg watch · Video Views
                  </div>
                  <div
                    style={{
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      color: "#1F2937",
                      lineHeight: 1.4,
                      margin: "0.875rem 0 0.875rem",
                    }}
                  >
                    Scale budget + build lookalikes from converters
                  </div>
                  <button
                    type="button"
                    style={{
                      width: "100%",
                      padding: "0.625rem 0.75rem",
                      background: "#7652B3",
                      color: "#fff",
                      border: "none",
                      borderRadius: 12,
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      fontFamily: "inherit",
                      cursor: "pointer",
                      letterSpacing: "0.01em",
                    }}
                  >
                    More Insights with AgentIQ →
                  </button>
                </div>

                <div
                  style={{
                    background: "linear-gradient(160deg,#F0EAFF,#F0EAFF)",
                    border: "1px solid #EDE8F7",
                    borderRadius: 12,
                    padding: "1.125rem 1rem 1rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: 0,
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.5rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "#7652B3",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Geography
                  </div>
                  <div
                    style={{
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "#111827",
                      lineHeight: 1.3,
                      marginBottom: "0.75rem",
                    }}
                  >
                    CA + TX lead every campaign objective
                  </div>
                  <div
                    style={{
                      fontSize: "0.6875rem",
                      color: "#4B5563",
                      lineHeight: 1.65,
                      flex: 1,
                    }}
                  >
                    52 conversions · Retargeting
                    <br />
                    41% of purchases · New Audiences
                    <br />
                    7.4% eng rate · Brand Awareness
                    <br />
                    72% video completion · Video Views
                  </div>
                  <div
                    style={{
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      color: "#1F2937",
                      lineHeight: 1.4,
                      margin: "0.875rem 0 0.875rem",
                    }}
                  >
                    Apply +15% geo bid adj. for CA + TX
                  </div>
                  <button
                    type="button"
                    style={{
                      width: "100%",
                      padding: "0.625rem 0.75rem",
                      background: "#7652B3",
                      color: "#fff",
                      border: "none",
                      borderRadius: 12,
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      fontFamily: "inherit",
                      cursor: "pointer",
                      letterSpacing: "0.01em",
                    }}
                  >
                    More Insights with AgentIQ →
                  </button>
                </div>
              </div>
            </div>

            {/* Audience Overlap */}
            {/* <div className="mb-5">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-3">Audience Overlap — Cross-Campaign Frequency Risk</p>
              <div className="grid grid-cols-3 gap-3 mb-3">
                <OverlapCard pair="Retargeting âˆ© New Audiences" pct="18.4" note="~8,300 people in both" />
                <OverlapCard pair="Retargeting âˆ© Brand Awareness" pct="34.2" note="~15,400 people in both" />
                <OverlapCard pair="New Audiences âˆ© Brand Awareness" pct="8.6" note="~10,600 people in both" />
              </div>
              <div className="flex gap-3 p-4 rounded-xl mb-4 bg-red-50 border-l-4 border-red-500">
                <span className="text-lg leading-6 flex-shrink-0">!</span>
                <div>
                  <h5 className="text-[13px] font-bold mb-0.5">34% overlap between Retargeting and Brand Awareness audiences</h5>
                  <p className="text-[12px] text-gray-500 leading-relaxed">15,400 people receive ads from both campaigns. Consider exclusion lists to reduce overlap.</p>
                </div>
              </div>
            </div> */}

            {/* Campaign Accordions */}
            <div
              id="camp-retargeting"
              ref={(node) => {
                campaignCardRefs.current["camp-retargeting"] = node;
              }}
            >
              <CampaignAccordion
                title="Retargeting – Engagers"
                healthStatus="critical"
                healthLabel="Critical"
                summary="Audience saturating fast · freq 6.25× · CpC rising"
                spend="$2,400"
                theme="retargeting"
                open={openCampaigns["camp-retargeting"]}
                onOpenChange={(nextOpen) =>
                  setOpenCampaigns((prev) => ({
                    ...prev,
                    "camp-retargeting": nextOpen,
                  }))
                }
                trendAfterExtra
                kpis={[
                  { label: "Qual. Reach", value: "16.2K" },
                  { label: "Purchases", value: "112" },
                  {
                    label: "vs Prev",
                    value: "CpC ↑18%",
                    valueClassName: "text-[#e11d48]",
                  },
                ]}
                trendData={campTrendData}
                extraContent={
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mb-4">
                      <div className="rounded-xl border border-red-200 bg-red-50 p-3 relative overflow-hidden">
                        <div className="absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-red-600 to-rose-400" />
                        <div className="text-[10px] font-bold uppercase tracking-wide text-[#e11d48] mb-1">
                          Frequency
                        </div>
                        <div className="text-[13px] font-bold text-gray-800 mb-1">
                          6.25× — well past diminishing returns
                        </div>
                        <div className="text-[11px] text-gray-600">
                          <span className="text-[#e11d48] font-semibold">
                            Action:
                          </span>{" "}
                          Pause 7 days to reset, add frequency cap of 5×/week
                        </div>
                      </div>
                      <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 relative overflow-hidden">
                        <div className="absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-amber-500 to-amber-300" />
                        <div className="text-[10px] font-bold uppercase tracking-wide text-amber-700 mb-1">
                          Budget
                        </div>
                        <div className="text-[13px] font-bold text-gray-800 mb-1">
                          CpC rising 18% as efficiency drops
                        </div>
                        <div className="text-[11px] text-gray-600">
                          <span className="text-amber-700 font-semibold">
                            Action:
                          </span>{" "}
                          Shift $1,200 to New Audiences until saturation resolves
                        </div>
                      </div>
                      <div className="rounded-xl border border-red-200 bg-red-50 p-3 relative overflow-hidden">
                        <div className="absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-red-600 to-rose-400" />
                        <div className="text-[10px] font-bold uppercase tracking-wide text-[#e11d48] mb-1">
                          Priority Action
                        </div>
                        <div className="text-[13px] font-bold text-gray-800 mb-1">
                          Expand lookalike exclusion pool now
                        </div>
                        <div className="text-[11px] text-gray-600">
                          <span className="text-[#e11d48] font-semibold">
                            Action:
                          </span>{" "}
                          Seed from 112 converters → build 1% LAL → exclude anyone
                          reached 5×+ with no purchase
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">
                        Delivery
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                        <div className="rounded-xl border border-gray-200 bg-white p-3">
                          <div className="text-[9px] font-bold uppercase tracking-wide text-gray-400">
                            Spend
                          </div>
                          <div className="font-mono text-[20px] font-bold text-gray-900">
                            $2,400
                          </div>
                          <div className="text-[11px] text-gray-400">
                            → flat vs prev
                          </div>
                        </div>
                        <div className="rounded-xl border border-gray-200 bg-white p-3">
                          <div className="text-[9px] font-bold uppercase tracking-wide text-gray-400">
                            Impressions · CPM
                          </div>
                          <div className="font-mono text-[20px] font-bold text-gray-900">
                            282K{" "}
                            <span className="text-[12px] font-medium text-gray-500">
                              $8.51
                            </span>
                          </div>
                          <div className="text-[11px] text-gray-400">
                            → impressions flat · CPM rising
                          </div>
                        </div>
                        <div className="rounded-xl border border-red-200 bg-red-50 p-3">
                          <div className="text-[9px] font-bold uppercase tracking-wide text-[#e11d48]">
                            Reach · Freq
                          </div>
                          <div className="font-mono text-[20px] font-bold text-gray-900">
                            45K{" "}
                            <span className="text-[12px] font-medium text-[#e11d48]">
                              6.25×
                            </span>
                          </div>
                          <div className="text-[11px] text-[#e11d48]">
                            <span className="font-semibold">Action:</span> Cap
                            frequency at 3×/week — 71% saturated
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">
                        Quality
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                        <div className="rounded-xl border border-gray-200 bg-white p-3">
                          <div className="text-[9px] font-bold uppercase tracking-wide text-gray-400">
                            Qual. Reach
                          </div>
                          <div className="font-mono text-[20px] font-bold text-gray-900">
                            16.2K
                          </div>
                          <div className="text-[11px] text-[#e11d48]">
                            <span className="text-amber-700 font-semibold">
                              Action:
                            </span>{" "}
                            Expand audience pool — qualified reach declining as
                            frequency climbs
                          </div>
                        </div>
                        <div className="rounded-xl border border-gray-200 bg-white p-3">
                          <div className="text-[9px] font-bold uppercase tracking-wide text-gray-400">
                            QRR
                          </div>
                          <div className="font-mono text-[20px] font-bold text-gray-900">
                            36%
                          </div>
                          <div className="text-[11px] text-[#e11d48]">
                            <span className="text-amber-700 font-semibold">
                              Action:
                            </span>{" "}
                            Refresh creative to recover QRR — ↓ from 48%,
                            degrading
                          </div>
                        </div>
                        <div className="rounded-xl border border-red-200 bg-red-50 p-3">
                          <div className="text-[9px] font-bold uppercase tracking-wide text-[#e11d48]">
                            Freq. vs Prev
                          </div>
                          <div className="font-mono text-[20px] font-bold text-[#e11d48]">
                            +2.1×
                          </div>
                          <div className="text-[11px] text-[#e11d48]">
                            ↑ from 4.15× · cap at 3×/week
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">
                        Outcome
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                        <div className="rounded-xl border border-red-200 bg-red-50 p-3">
                          <div className="text-[9px] font-bold uppercase tracking-wide text-[#e11d48]">
                            CpC
                          </div>
                          <div className="font-mono text-[20px] font-bold text-gray-900">
                            $21.43
                          </div>
                          <div className="text-[11px] text-[#e11d48]">
                            ↑ 18% vs prev · rising fast
                          </div>
                        </div>
                        <div className="rounded-xl border border-gray-200 bg-white p-3">
                          <div className="text-[9px] font-bold uppercase tracking-wide text-gray-400">
                            Purchases
                          </div>
                          <div className="font-mono text-[20px] font-bold text-gray-900">
                            112
                          </div>
                          <div className="text-[11px] text-[#e11d48]">
                            ↓ 6% vs prev period
                          </div>
                        </div>
                        <div className="rounded-xl border border-gray-200 bg-white p-3">
                          <div className="text-[9px] font-bold uppercase tracking-wide text-gray-400">
                            ROAS
                          </div>
                          <div className="font-mono text-[20px] font-bold text-gray-900">
                            3.1×
                          </div>
                          <div className="text-[11px] text-amber-500">
                            ↓ from 3.6× · eroding
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-[10px] text-gray-500 mb-2">
                        <strong className="text-gray-700">
                          ROAS Eroding as CpC Climbs:
                        </strong>{" "}
                        ROAS dropped from 3.6× to 3.1× as frequency hit 6.25× and
                        CpC rose 18%.
                      </div>
                      <div className="px-4 py-2 rounded-lg text-[11px] font-semibold bg-blue-50 text-blue-700">
                        <strong>Action:</strong> Pause for 7 days to reset
                        frequency, or shift budget to New Audiences.
                      </div>
                    </div>
                  </>
                }
                extraContentAfterTrend={
                  <>
                    <div className="mb-4">
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">
                        Recency × Frequency Matrix
                      </div>
                      <div className="text-[11px] text-gray-500 mb-3">
                        Cross-reference how recently someone saw the ad against
                        how many times. Top-right = dead audience.
                      </div>
                      <div className="grid grid-cols-4 gap-[2px] text-[11px]">
                        <div className="p-2" />
                        <div className="rounded-tl-md bg-gray-100 px-3 py-2 text-center text-[9px] font-bold uppercase tracking-wide text-gray-500">
                          1–2× seen
                        </div>
                        <div className="bg-gray-100 px-3 py-2 text-center text-[9px] font-bold uppercase tracking-wide text-gray-500">
                          3–4× seen
                        </div>
                        <div className="rounded-tr-md bg-gray-100 px-3 py-2 text-center text-[9px] font-bold uppercase tracking-wide text-[#e11d48]">
                          5×+ seen
                        </div>

                        <div className="bg-gray-100 px-3 py-2 text-[9px] font-bold uppercase tracking-wide text-gray-500 flex items-center">
                          Last 3 days
                        </div>
                        <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-center">
                          <div className="font-bold text-emerald-600">8.2K</div>
                          <div className="text-[9px] text-emerald-600 mt-1">
                            Fresh · serve
                          </div>
                        </div>
                        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-center">
                          <div className="font-bold text-amber-700">5.4K</div>
                          <div className="text-[9px] text-amber-700 mt-1">
                            Watch closely
                          </div>
                        </div>
                        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-center">
                          <div className="font-bold text-amber-700">3.1K</div>
                          <div className="text-[9px] text-amber-700 mt-1">
                            Cap at 5×
                          </div>
                        </div>

                        <div className="bg-gray-100 px-3 py-2 text-[9px] font-bold uppercase tracking-wide text-gray-500 flex items-center">
                          4-7 days ago
                        </div>
                        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-center">
                          <div className="font-bold text-amber-700">6.8K</div>
                          <div className="text-[9px] text-amber-700 mt-1">
                            Refresh creative
                          </div>
                        </div>
                        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-center">
                          <div className="font-bold text-[#e11d48]">7.2K</div>
                          <div className="text-[9px] text-[#e11d48] mt-1">
                            Reduce budget
                          </div>
                        </div>
                        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-center relative overflow-hidden">
                          <div className="absolute left-0 right-0 top-0 h-[2px] text-[#e11d48]" />
                          <div className="font-bold text-[#e11d48]">9.4K</div>
                          <div className="text-[9px] font-bold text-[#e11d48] mt-1">
                            ⛔ Exclude now
                          </div>
                        </div>

                        <div className="rounded-bl-md bg-gray-100 px-3 py-2 text-[9px] font-bold uppercase tracking-wide text-gray-500 flex items-center">
                          8+ days ago
                        </div>
                        <div className="rounded-md border border-gray-200 bg-gray-50 p-3 text-center">
                          <div className="font-bold text-gray-600">2.1K</div>
                          <div className="text-[9px] text-gray-500 mt-1">
                            Low priority
                          </div>
                        </div>
                        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-center">
                          <div className="font-bold text-[#e11d48]">1.8K</div>
                          <div className="text-[9px] text-[#e11d48] mt-1">
                            Exclude
                          </div>
                        </div>
                        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-center relative overflow-hidden">
                          <div className="absolute left-0 right-0 top-0 h-[2px] text-[#e11d48]" />
                          <div className="font-bold text-[#e11d48]">1.2K</div>
                          <div className="text-[9px] font-bold text-[#e11d48] mt-1">
                            ⛔ Exclude now
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 px-4 py-2 rounded-lg text-[11px] font-semibold bg-red-50 text-red-700">
                        <strong>Action:</strong> Exclude all users in the red
                        cells (5×+ seen) — that's ~10.6K people still being served
                        ads who haven't purchased and are actively raising your
                        CpC. Add an exclusion custom audience in Ads Manager:
                        "Reached 5+ times, no purchase, any date."
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">
                        Campaign Configuration
                      </div>
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {[
                          { label: "Objective", value: "Sales", accent: true },
                          { label: "Optimization", value: "Purchase" },
                          { label: "Bid Strategy", value: "Cost Cap $25" },
                          { label: "Daily Budget", value: "$77.42" },
                          { label: "Dayparting", value: "Not set", danger: true },
                          { label: "Freq Cap", value: "None", danger: true },
                          { label: "Start", value: "Jan 1" },
                          { label: "Duration", value: "31 days" },
                        ].map((c) => (
                          <div
                            key={c.label}
                            className="flex-shrink-0 bg-white border border-gray-200 rounded-lg px-3 py-2 min-w-[120px]"
                          >
                            <div className="text-[8px] font-bold uppercase text-gray-400 tracking-wide">
                              {c.label}
                            </div>
                            <div
                              className={`text-[11px] font-semibold mt-0.5 ${c.danger ? "text-[#e11d48]" : c.accent ? "text-purple-700" : "text-gray-700"}`}
                            >
                              {c.value}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 px-4 py-2 rounded-lg text-[11px] font-semibold bg-blue-50 text-blue-700">
                        <strong>Action:</strong> Set dayparting to Thu–Sun
                        6pm–12am. Add frequency cap of 5×/week.
                      </div>
                    </div>
                  </>
                }
              />
            </div>

            <div
              id="camp-new-audiences"
              ref={(node) => {
                campaignCardRefs.current["camp-new-audiences"] = node;
              }}
            >
              <CampaignAccordion
                title="New Audiences – Acquisition"
                healthStatus="growing"
                healthLabel="Growing"
                summary="Low saturation · healthy freq 1.8× · ROAS improving"
                spend="$5,200"
                theme="acquisition"
                open={openCampaigns["camp-new-audiences"]}
                onOpenChange={(nextOpen) =>
                  setOpenCampaigns((prev) => ({
                    ...prev,
                    "camp-new-audiences": nextOpen,
                  }))
                }
                hideInsight
                kpis={[
                  { label: "Purchases", value: "189" },
                  { label: "CpA", value: "$27.51" },
                  {
                    label: "vs Prev",
                    value: "ROAS ↑12%",
                    valueClassName: "text-emerald-700",
                  },
                ]}
                extraContent={
                  <>
                    <div className="mb-5 grid grid-cols-1 gap-2.5 md:grid-cols-3">
                      {[
                        {
                          tag: "Scale",
                          title: "Only 4.4% APR — massive headroom",
                          body: (
                            <>
                              {" "}
                              <span className="font-semibold text-purple-700">
                                Action:
                              </span>{" "}
                              Double daily budget, monitor CpC weekly against $25
                              cap{" "}
                            </>
                          ),
                        },
                        {
                          tag: "Placement",
                          title: "Feed Mobile drives 63% of purchases",
                          body: (
                            <>
                              {" "}
                              <span className="font-semibold text-amber-700">
                                Action:
                              </span>{" "}
                              Shift Feed Desktop budget ($42.86 CpC) to Feed
                              Mobile + Reels{" "}
                            </>
                          ),
                        },
                        {
                          tag: "Creative",
                          title: "45s Product Demo drives 89 of 189 purchases",
                          body: (
                            <>
                              {" "}
                              <span className="font-semibold text-purple-700">
                                Action:
                              </span>{" "}
                              Increase impression share for this creative to
                              60%+{" "}
                            </>
                          ),
                        },
                      ].map((c) => (
                        <div
                          key={c.tag}
                          className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-3.5"
                        >
                          <div className="absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-purple-600 to-purple-300" />
                          <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.1em] text-purple-700">
                            {c.tag}
                          </div>
                          <div className="mb-1 text-[13px] font-bold text-gray-800">
                            {c.title}
                          </div>
                          <div className="text-[11px] text-gray-600">
                            {c.body}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mb-4">
                      <div className="mb-2 text-[10px] font-bold uppercase tracking-wide text-gray-400">
                        Delivery
                      </div>
                      <div className="grid grid-cols-1 gap-2.5 md:grid-cols-4">
                        <div className="rounded-xl border border-gray-200 bg-white p-3.5">
                          <div className="text-[9px] font-bold uppercase tracking-wide text-gray-400">
                            Spend
                          </div>
                          <div className="font-mono text-[20px] font-bold text-gray-900">
                            $5,200
                          </div>
                          <div className="text-[11px] text-gray-500">
                            → flat vs prev
                          </div>
                        </div>
                        <div className="rounded-xl border border-gray-200 bg-white p-3.5">
                          <div className="text-[9px] font-bold uppercase tracking-wide text-gray-400">
                            Impressions · CPM
                          </div>
                          <div className="font-mono text-[20px] font-bold text-gray-900">
                            480K{" "}
                            <span className="text-[12px] font-medium text-gray-500">
                              $10.83
                            </span>
                          </div>
                          <div className="text-[11px] text-emerald-600">
                            ↑ 18% impr · CPM stable
                          </div>
                        </div>
                        <div className="rounded-xl border border-gray-200 bg-white p-3.5">
                          <div className="text-[9px] font-bold uppercase tracking-wide text-gray-400">
                            Reach · Freq
                          </div>
                          <div className="font-mono text-[20px] font-bold text-gray-900">
                            98K{" "}
                            <span className="text-[12px] font-medium text-gray-500">
                              1.8×
                            </span>
                          </div>
                          <div className="text-[11px] text-gray-500">
                            Healthy · well below saturation
                          </div>
                        </div>
                        <div className="rounded-xl border border-gray-200 bg-white p-3.5">
                          <div className="text-[9px] font-bold uppercase tracking-wide text-gray-400">
                            Qualified Reach
                          </div>
                          <div className="font-mono text-[20px] font-bold text-gray-900">
                            53K
                          </div>
                          <div className="text-[11px] text-purple-700">
                            54% QRR · 4.4% APR
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="mb-2 text-[10px] font-bold uppercase tracking-wide text-gray-400">
                        Quality
                      </div>
                      <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3">
                        <div className="rounded-xl border border-gray-200 bg-white p-3.5">
                          <div className="text-[9px] font-bold uppercase tracking-wide text-gray-400">
                            Eng. Rate
                          </div>
                          <div className="font-mono text-[20px] font-bold text-gray-900">
                            7.4%
                          </div>
                          <div className="text-[11px] text-emerald-600">
                            ↑ from 6.1% · improving
                          </div>
                        </div>
                        <div className="rounded-xl border border-gray-200 bg-white p-3.5">
                          <div className="text-[9px] font-bold uppercase tracking-wide text-gray-400">
                            CTR
                          </div>
                          <div className="font-mono text-[20px] font-bold text-gray-900">
                            6.8%
                          </div>
                          <div className="text-[11px] text-emerald-600">
                            ↑ from 5.4% · strong
                          </div>
                        </div>
                        <div className="rounded-xl border border-gray-200 bg-white p-3.5">
                          <div className="text-[9px] font-bold uppercase tracking-wide text-gray-400">
                            Audience Penetration
                          </div>
                          <div className="font-mono text-[20px] font-bold text-gray-900">
                            4.4%
                          </div>
                          <div className="text-[11px] text-gray-500">
                            Massive headroom remaining
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="mb-2 text-[10px] font-bold uppercase tracking-wide text-gray-400">
                        Outcome
                      </div>
                      <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3">
                        <div className="rounded-xl border border-gray-200 bg-white p-3.5">
                          <div className="text-[9px] font-bold uppercase tracking-wide text-gray-400">
                            Purchases
                          </div>
                          <div className="font-mono text-[20px] font-bold text-gray-900">
                            189
                          </div>
                          <div className="text-[11px] text-emerald-600">
                            ↑ 24% vs prev period
                          </div>
                        </div>
                        <div className="rounded-xl border border-gray-200 bg-white p-3.5">
                          <div className="text-[9px] font-bold uppercase tracking-wide text-gray-400">
                            CPC
                          </div>
                          <div className="font-mono text-[20px] font-bold text-gray-900">
                            $22.47
                          </div>
                          <div className="text-[11px] text-emerald-600">
                            ↓ from $24.80 · below cap
                          </div>
                        </div>
                        <div className="rounded-xl border border-gray-200 bg-white p-3.5">
                          <div className="text-[9px] font-bold uppercase tracking-wide text-gray-400">
                            ROAS
                          </div>
                          <div className="font-mono text-[20px] font-bold text-gray-900">
                            2.8×
                          </div>
                          <div className="text-[11px] text-emerald-600">
                            ↑ from 2.1× · climbing
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="newaud-qr-wrap">
                        <div className="newaud-qr-label">Qualified Reach</div>
                        <div className="newaud-qr-chart">
                          <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart
                              data={newAudQualifiedReachData}
                              margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
                            >
                              <CartesianGrid stroke="#DFE2E8" vertical={false} />
                              <XAxis
                                dataKey="date"
                                tick={{
                                  fontSize: 11,
                                  fontFamily: "DM Sans, sans-serif",
                                  fill: "#6E7787",
                                }}
                                axisLine={false}
                                tickLine={false}
                              />
                              <YAxis
                                yAxisId="y"
                                domain={[0, "auto"]}
                                tick={{
                                  fontSize: 10,
                                  fontFamily: "JetBrains Mono, monospace",
                                  fill: "#4F5664",
                                }}
                                tickFormatter={(v) => `${Math.round(Number(v) / 1000)}K`}
                                axisLine={false}
                                tickLine={false}
                                width={50}
                              />
                              <Tooltip
                                cursor={{ stroke: "#E8EAF0", strokeWidth: 1 }}
                                formatter={(value) => [formatK(Number(value)), "Qualified Reach"]}
                              />
                              <Area
                                yAxisId="y"
                                type="monotone"
                                dataKey="qualifiedReach"
                                name="Qualified Reach"
                                fill="rgba(237,232,247,0.25)"
                                stroke="none"
                                isAnimationActive={false}
                              />
                              <Line
                                yAxisId="y"
                                type="monotone"
                                dataKey="qualifiedReach"
                                name="Qualified Reach"
                                stroke="#7652B3"
                                strokeWidth={2}
                                dot={{
                                  r: 4,
                                  fill: "#7652B3",
                                  stroke: "#fff",
                                  strokeWidth: 2,
                                }}
                              />
                            </ComposedChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="mb-2 text-[10px] font-bold uppercase tracking-wide text-gray-400">
                        Segment Performance
                      </div>
                      <div className="mb-3 flex border-b border-gray-200">
                        <button
                          type="button"
                          className="border-b-2 border-purple-600 px-4 py-2 text-xs font-semibold text-purple-700"
                        >
                          Demographics
                        </button>
                        <button
                          type="button"
                          className="border-b-2 border-transparent px-4 py-2 text-xs text-gray-400"
                        >
                          Time Windows
                        </button>
                        <button
                          type="button"
                          className="border-b-2 border-transparent px-4 py-2 text-xs text-gray-400"
                        >
                          Interests
                        </button>
                        <button
                          type="button"
                          className="border-b-2 border-transparent px-4 py-2 text-xs text-gray-400"
                        >
                          Geography
                        </button>
                      </div>
                      <div className="overflow-x-auto rounded-xl border border-gray-100">
                        <table className="w-full border-collapse text-[12px]">
                          <thead className="bg-gray-50">
                            <tr>
                              {[
                                "Segment",
                                "Reach",
                                "Purchases",
                                "Conv. Rate",
                                "CpA",
                                "ROAS",
                                "Verdict",
                              ].map((h) => (
                                <th
                                  key={h}
                                  className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wide text-gray-400 border-b-2 border-gray-200"
                                >
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-gray-100">
                              <td className="px-3 py-2 font-semibold">
                                25–34 Female
                              </td>
                              <td className="px-3 py-2 font-mono">18.4K</td>
                              <td className="px-3 py-2 font-mono">62</td>
                              <td className="px-3 py-2 font-mono font-semibold text-emerald-600">
                                8.4%
                              </td>
                              <td className="px-3 py-2 font-mono">$19.80</td>
                              <td className="px-3 py-2 font-mono font-semibold text-emerald-600">
                                3.8×
                              </td>
                              <td className="px-3 py-2">
                                <span className="rounded-full border border-purple-200 bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700">
                                  Scale ↑
                                </span>
                              </td>
                            </tr>
                            <tr className="border-b border-gray-100">
                              <td className="px-3 py-2 font-semibold">
                                25–34 Male
                              </td>
                              <td className="px-3 py-2 font-mono">14.2K</td>
                              <td className="px-3 py-2 font-mono">48</td>
                              <td className="px-3 py-2 font-mono font-semibold text-emerald-600">
                                6.8%
                              </td>
                              <td className="px-3 py-2 font-mono">$22.10</td>
                              <td className="px-3 py-2 font-mono text-emerald-600">
                                3.1×
                              </td>
                              <td className="px-3 py-2">
                                <span className="rounded-full border border-purple-200 bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700">
                                  Scale ↑
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2 font-semibold">
                                45–54 Male
                              </td>
                              <td className="px-3 py-2 font-mono">4.2K</td>
                              <td className="px-3 py-2 font-mono">8</td>
                              <td className="px-3 py-2 font-mono text-[#e11d48]">
                                2.4%
                              </td>
                              <td className="px-3 py-2 font-mono text-[#e11d48]">
                                $36.20
                              </td>
                              <td className="px-3 py-2 font-mono text-[#e11d48]">
                                1.2×
                              </td>
                              <td className="px-3 py-2">
                                <span className="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-bold text-[#e11d48]">
                                  Reduce
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="mb-2 text-[10px] font-bold uppercase tracking-wide text-gray-400">
                        Placement Breakdown
                      </div>
                      <div className="overflow-x-auto rounded-xl border border-gray-100">
                        <table className="w-full border-collapse text-[12px]">
                          <thead className="bg-gray-50">
                            <tr>
                              {[
                                "Placement",
                                "Reach",
                                "Purchases",
                                "CPC",
                                "CTR",
                                "ROAS",
                                "Verdict",
                              ].map((h) => (
                                <th
                                  key={h}
                                  className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wide text-gray-400 border-b-2 border-gray-200"
                                >
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-gray-100">
                              <td className="px-3 py-2 font-semibold">
                                Feed Mobile
                              </td>
                              <td className="px-3 py-2 font-mono">52K</td>
                              <td className="px-3 py-2 font-mono">118</td>
                              <td className="px-3 py-2 font-mono">$20.34</td>
                              <td className="px-3 py-2 font-mono">7.2%</td>
                              <td className="px-3 py-2 font-mono">3.2×</td>
                              <td className="px-3 py-2">
                                <span className="rounded-full border border-purple-200 bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700">
                                  Scale ↑
                                </span>
                              </td>
                            </tr>
                            <tr className="border-b border-gray-100">
                              <td className="px-3 py-2 font-semibold">Reels</td>
                              <td className="px-3 py-2 font-mono">24K</td>
                              <td className="px-3 py-2 font-mono">42</td>
                              <td className="px-3 py-2 font-mono">$23.81</td>
                              <td className="px-3 py-2 font-mono">6.4%</td>
                              <td className="px-3 py-2 font-mono">2.8×</td>
                              <td className="px-3 py-2">
                                <span className="rounded-full border border-purple-200 bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700">
                                  Scale ↑
                                </span>
                              </td>
                            </tr>
                            <tr className="border-b border-gray-100">
                              <td className="px-3 py-2 font-semibold">Stories</td>
                              <td className="px-3 py-2 font-mono">14K</td>
                              <td className="px-3 py-2 font-mono">22</td>
                              <td className="px-3 py-2 font-mono">$27.27</td>
                              <td className="px-3 py-2 font-mono">4.6%</td>
                              <td className="px-3 py-2 font-mono">2.2×</td>
                              <td className="px-3 py-2">
                                <span className="rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-500">
                                  Monitor
                                </span>
                              </td>
                            </tr>
                            <tr className="bg-red-50">
                              <td className="px-3 py-2 font-semibold">
                                Feed Desktop
                              </td>
                              <td className="px-3 py-2 font-mono">8K</td>
                              <td className="px-3 py-2 font-mono">7</td>
                              <td className="px-3 py-2 font-mono text-[#e11d48]">
                                $42.86
                              </td>
                              <td className="px-3 py-2 font-mono text-[#e11d48]">
                                2.1%
                              </td>
                              <td className="px-3 py-2 font-mono text-[#e11d48]">
                                1.4×
                              </td>
                              <td className="px-3 py-2">
                                <span className="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-bold text-[#e11d48]">
                                  Pause
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="mt-3 flex gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-[11px] text-gray-800">
                        <span className="mt-[5px] h-1.5 w-1.5 flex-shrink-0 rounded-full text-[#e11d48]" />
                        <span>
                          <strong className="text-[#e11d48]">Action:</strong> Pause
                          Feed Desktop — $42.86 CpC at 1.4× ROAS. Reallocate
                          $970/month to Feed Mobile and Reels.
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 text-[10px] font-bold uppercase tracking-wide text-gray-400">
                        Campaign Configuration
                      </div>
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {[
                          { label: "Objective", value: "Sales", accent: true },
                          { label: "Optimization", value: "Purchase" },
                          { label: "Bid Strategy", value: "Lowest Cost" },
                          { label: "CpA", value: "$27.51" },
                          { label: "Daily Budget", value: "$167.74" },
                          { label: "Lifetime", value: "$5,200" },
                          { label: "Start", value: "Jan 1" },
                          { label: "Duration", value: "31 days" },
                        ].map((c) => (
                          <div
                            key={c.label}
                            className="min-w-[120px] flex-shrink-0 rounded-xl border border-gray-100 bg-white px-3 py-2 text-center"
                          >
                            <div className="text-[8px] font-bold uppercase tracking-wide text-gray-400">
                              {c.label}
                            </div>
                            <div
                              className={`mt-0.5 text-[11px] font-semibold ${c.accent ? "text-purple-700" : "text-gray-700"}`}
                            >
                              {c.value}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 flex gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2.5 text-[11px] text-blue-800">
                        <span className="mt-[5px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
                        <span>
                          <strong className="text-blue-700">Action:</strong> Scale
                          daily budget from $167 to $334 — APR at 4.4% with 82%
                          headroom and ROAS improving to 2.8×. Monitor CpC weekly
                          against $25 cost cap.
                        </span>
                      </div>
                    </div>
                  </>
                }
              />
            </div>

            <div
              id="camp-brand-awareness"
              ref={(node) => {
                campaignCardRefs.current["camp-brand-awareness"] = node;
              }}
            >
              <CampaignAccordion
                title="Brand Awareness – Q1"
                healthStatus="stable"
                healthLabel="Stable"
                summary="QRR declining as freq climbs · Reels outperforming all placements"
                spend="$6,800"
                theme="awareness"
                open={openCampaigns["camp-brand-awareness"]}
                onOpenChange={(nextOpen) =>
                  setOpenCampaigns((prev) => ({
                    ...prev,
                    "camp-brand-awareness": nextOpen,
                  }))
                }
                hideInsight
                kpis={[
                  { label: "Qual. Reach", value: "62K" },
                  { label: "Eng. Rate", value: "6.4%" },
                  {
                    label: "vs Prev",
                    value: "QRR ↓8%",
                    valueClassName: "text-[#e11d48]",
                  },
                ]}
                extraContent={
                  <>
                    <div className="mb-4 grid grid-cols-1 gap-2.5 md:grid-cols-3">
                      <div className="relative overflow-hidden rounded-xl border border-red-200 bg-red-50 p-3.5">
                        <div className="absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-red-600 to-rose-400" />
                        <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#e11d48]">
                          Frequency
                        </div>
                        <div className="mb-1 text-[13px] font-bold text-gray-800">
                          5.0× — nearing saturation
                        </div>
                        <div className="text-[11px] text-gray-600">
                          <span className="font-semibold text-[#e11d48]">
                            Action:
                          </span>{" "}
                          Cap at 4×/week, rotate creatives to reset signal
                        </div>
                      </div>
                      <div className="relative overflow-hidden rounded-xl border border-red-200 bg-red-50 p-3.5">
                        <div className="absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-red-600 to-rose-400" />
                        <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#e11d48]">
                          Placement
                        </div>
                        <div className="mb-1 text-[13px] font-bold text-gray-800">
                          Audience Network — 1.2% eng, dead weight
                        </div>
                        <div className="text-[11px] text-gray-600">
                          <span className="font-semibold text-[#e11d48]">
                            Action:
                          </span>{" "}
                          Exclude now, reallocate budget to Reels (7.8% eng)
                        </div>
                      </div>
                      <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-3.5">
                        <div className="absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-purple-600 to-purple-300" />
                        <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.1em] text-purple-700">
                          Creative
                        </div>
                        <div className="mb-1 text-[13px] font-bold text-gray-800">
                          Brand Story 30s — 72% video completion rate, top
                          performer
                        </div>
                        <div className="text-[11px] text-gray-600">
                          <span className="font-semibold text-purple-700">
                            Action:
                          </span>{" "}
                          Scale to all placements · retire Logo Static (2.1% eng)
                        </div>
                      </div>
                    </div>

                    <div className="mb-4 flex gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-[11px] text-gray-800">
                      <span className="mt-[5px] h-1.5 w-1.5 flex-shrink-0 rounded-full text-[#e11d48]" />
                      <span>
                        <strong className="text-[#e11d48]">Action:</strong> QRR ↓8%
                        — freq at 5.0× with no cap, fatigue taking hold. Set freq
                        cap 4×/week and pause Logo Awareness Static on Audience
                        Network before QRR falls below 40%.
                      </span>
                    </div>

                    <div className="mb-4">
                      <div className="mb-2 text-[10px] font-bold uppercase tracking-wide text-gray-400">
                        Campaign Metrics
                      </div>
                      <div className="grid grid-cols-1 gap-2 md:grid-cols-5">
                        <div className="rounded-xl border border-gray-200 bg-white p-3">
                          <div className="text-[8px] font-bold uppercase tracking-wide text-gray-400">
                            Qual. Reach
                          </div>
                          <div className="font-mono text-[18px] font-bold text-gray-900">
                            62K
                          </div>
                          <div className="text-[10px] text-[#e11d48]">
                            QRR 50% · ↓ from 58%
                          </div>
                        </div>
                        <div className="rounded-xl border border-gray-200 bg-white p-3">
                          <div className="text-[8px] font-bold uppercase tracking-wide text-gray-400">
                            Reach · Freq
                          </div>
                          <div className="font-mono text-[18px] font-bold text-gray-900">
                            124K{" "}
                            <span className="text-[11px] text-amber-500">
                              5.0×
                            </span>
                          </div>
                          <div className="text-[10px] text-amber-500">
                            ↑ from 3.8× · nearing cap
                          </div>
                        </div>
                        <div className="rounded-xl border border-gray-200 bg-white p-3">
                          <div className="text-[8px] font-bold uppercase tracking-wide text-gray-400">
                            Eng. Rate
                          </div>
                          <div className="font-mono text-[18px] font-bold text-gray-900">
                            6.4%
                          </div>
                          <div className="text-[10px] text-gray-400">
                            → flat vs prev
                          </div>
                        </div>
                        <div className="rounded-xl border border-gray-200 bg-white p-3">
                          <div className="text-[8px] font-bold uppercase tracking-wide text-gray-400">
                            Video Completion Rate
                          </div>
                          <div className="font-mono text-[18px] font-bold text-gray-900">
                            72%
                          </div>
                          <div className="text-[10px] text-emerald-600">
                            ↑ from 64% · content working
                          </div>
                        </div>
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                          <div className="text-[8px] font-bold uppercase tracking-wide text-amber-700">
                            Cost / Qual. Reach
                          </div>
                          <div className="font-mono text-[18px] font-bold text-gray-900">
                            $0.110
                          </div>
                          <div className="text-[10px] text-amber-500">
                            ↑ from $0.088 · rising
                          </div>
                        </div>
                      </div>
                    </div>


                    <div className="mb-4">
                      <div className="mb-2 text-[10px] font-bold uppercase tracking-wide text-gray-400">
                        Placement Breakdown
                      </div>
                      <div className="overflow-x-auto rounded-xl border border-gray-100">
                        <table className="w-full border-collapse text-[12px]">
                          <thead className="bg-gray-50">
                            <tr>
                              {[
                                "Placement",
                                "Reach",
                                "Freq",
                                "CPM",
                                "Eng. Rate",
                                "VCR",
                                "Verdict",
                              ].map((h) => (
                                <th
                                  key={h}
                                  className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wide text-gray-400 border-b-2 border-gray-200"
                                >
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-gray-100">
                              <td className="px-3 py-2 font-semibold">Reels</td>
                              <td className="px-3 py-2 font-mono">29K</td>
                              <td className="px-3 py-2 font-mono">4.9×</td>
                              <td className="px-3 py-2 font-mono">$11.20</td>
                              <td className="px-3 py-2 font-mono font-semibold text-purple-700">
                                7.8%
                              </td>
                              <td className="px-3 py-2 font-mono">—</td>
                              <td className="px-3 py-2">
                                <span className="rounded-full border border-purple-200 bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700">
                                  Scale ↑
                                </span>
                              </td>
                            </tr>
                            <tr className="border-b border-gray-100">
                              <td className="px-3 py-2 font-semibold">
                                Feed Mobile
                              </td>
                              <td className="px-3 py-2 font-mono">63K</td>
                              <td className="px-3 py-2 font-mono">5.2×</td>
                              <td className="px-3 py-2 font-mono">$11.50</td>
                              <td className="px-3 py-2 font-mono">6.8%</td>
                              <td className="px-3 py-2 font-mono">—</td>
                              <td className="px-3 py-2">
                                <span className="rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-500">
                                  Monitor
                                </span>
                              </td>
                            </tr>
                            <tr className="border-b border-gray-100">
                              <td className="px-3 py-2 font-semibold">Stories</td>
                              <td className="px-3 py-2 font-mono">32K</td>
                              <td className="px-3 py-2 font-mono">4.8×</td>
                              <td className="px-3 py-2 font-mono">$11.80</td>
                              <td className="px-3 py-2 font-mono">5.4%</td>
                              <td className="px-3 py-2 font-mono">—</td>
                              <td className="px-3 py-2">
                                <span className="rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-500">
                                  Monitor
                                </span>
                              </td>
                            </tr>
                            <tr className="bg-red-50">
                              <td className="px-3 py-2 font-semibold">
                                Audience Network
                              </td>
                              <td className="px-3 py-2 font-mono">8K</td>
                              <td className="px-3 py-2 font-mono text-[#e11d48]">
                                6.0×
                              </td>
                              <td className="px-3 py-2 font-mono">$8.50</td>
                              <td className="px-3 py-2 font-mono text-[#e11d48]">
                                1.2%
                              </td>
                              <td className="px-3 py-2 font-mono text-gray-400">
                                —
                              </td>
                              <td className="px-3 py-2">
                                <span className="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-bold text-[#e11d48]">
                                  Pause
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="mb-2 text-[10px] font-bold uppercase tracking-wide text-gray-400">
                        Creative Performance
                      </div>
                      <div className="overflow-x-auto rounded-xl border border-gray-100">
                        <table className="w-full border-collapse text-[12px]">
                          <thead className="bg-gray-50">
                            <tr>
                              {[
                                "Creative",
                                "Qual. Reach",
                                "VCR",
                                "Eng. Rate",
                                "Verdict",
                              ].map((h) => (
                                <th
                                  key={h}
                                  className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wide text-gray-400 border-b-2 border-gray-200"
                                >
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-gray-100">
                              <td className="px-3 py-2">
                                <div className="creative-row">
                                  <div className="thumb thumb-1 video" />
                                  <div>
                                    <div className="creative-name">
                                      Brand Story — 30s
                                    </div>
                                    <div className="creative-meta">
                                      Video · Feed + Reels
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-3 py-2 font-mono font-semibold text-purple-700">
                                48.8K
                              </td>
                              <td className="px-3 py-2 font-mono font-semibold text-purple-700">
                                72%
                              </td>
                              <td className="px-3 py-2 font-mono">7.8%</td>
                              <td className="px-3 py-2">
                                <span className="rounded-full border border-purple-200 bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700">
                                  Scale ↑
                                </span>
                              </td>
                            </tr>
                            <tr className="border-b border-gray-100">
                              <td className="px-3 py-2">
                                <div className="creative-row">
                                  <div className="thumb thumb-1 video" />
                                  <div>
                                    <div className="creative-name">
                                      Team Culture Reel — 15s
                                    </div>
                                    <div className="creative-meta">
                                      Video · Reels + Stories
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-3 py-2 font-mono">26.9K</td>
                              <td className="px-3 py-2 font-mono">64%</td>
                              <td className="px-3 py-2 font-mono">6.2%</td>
                              <td className="px-3 py-2">
                                <span className="rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-500">
                                  Monitor
                                </span>
                              </td>
                            </tr>
                            <tr className="bg-red-50">
                              <td className="px-3 py-2">
                                <div className="flex items-center gap-2.5">
                                  <div className="h-9 w-9 overflow-hidden rounded-lg bg-gradient-to-br from-gray-300 to-gray-400" />
                                  <div>
                                    <div className="text-[13px] font-semibold">
                                      Logo Awareness Static
                                    </div>
                                    <div className="text-[11px] font-semibold text-[#e11d48]">
                                      ⚠ Running on Audience Network
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-3 py-2 font-mono text-[#e11d48]">
                                4.4K
                              </td>
                              <td className="px-3 py-2 font-mono text-gray-400">
                                —
                              </td>
                              <td className="px-3 py-2 font-mono text-[#e11d48]">
                                2.1%
                              </td>
                              <td className="px-3 py-2">
                                <span className="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-bold text-[#e11d48]">
                                  Pause
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 text-[10px] font-bold uppercase tracking-wide text-gray-400">
                        Campaign Configuration
                      </div>
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {[
                          {
                            label: "Objective",
                            value: "Awareness",
                            accent: true,
                          },
                          { label: "Optimization", value: "Reach" },
                          { label: "Bid Strategy", value: "Lowest Cost" },
                          { label: "Daily Budget", value: "$219.35" },
                          { label: "Lifetime", value: "$6,800" },
                          { label: "Freq Cap", value: "None set", danger: true },
                          { label: "Start", value: "Jan 1" },
                          { label: "Duration", value: "31 days" },
                        ].map((c) => (
                          <div
                            key={c.label}
                            className="min-w-[120px] flex-shrink-0 rounded-xl border border-gray-100 bg-white px-3 py-2 text-center"
                          >
                            <div className="text-[8px] font-bold uppercase tracking-wide text-gray-400">
                              {c.label}
                            </div>
                            <div
                              className={`mt-0.5 text-[11px] font-semibold ${c.danger ? "text-[#e11d48]" : c.accent ? "text-purple-700" : "text-gray-700"}`}
                            >
                              {c.value}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 flex gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-[11px] text-gray-800">
                        <span className="mt-[5px] h-1.5 w-1.5 flex-shrink-0 rounded-full text-[#e11d48]" />
                        <span>
                          <strong className="text-[#e11d48]">Action:</strong> Add
                          freq cap of 4×/week immediately to prevent further
                          audience fatigue and protect QRR.
                        </span>
                      </div>
                    </div>
                  </>
                }
              />
            </div>

            <div
              id="camp-video-views"
              ref={(node) => {
                campaignCardRefs.current["camp-video-views"] = node;
              }}
            >
              <CampaignAccordion
                title="Video Views – Product Launch"
                healthStatus="stable"
                healthLabel="Stable"
                summary="Reels outperforming · Feed Desktop wasting budget · watch time rising"
                spend="$3,800"
                theme="video"
                open={openCampaigns["camp-video-views"]}
                onOpenChange={(nextOpen) =>
                  setOpenCampaigns((prev) => ({
                    ...prev,
                    "camp-video-views": nextOpen,
                  }))
                }
                hideInsight
                kpis={[
                  { label: "Qual. Reach", value: "53K" },
                  { label: "Eng. Rate", value: "82% VR" },
                  {
                    label: "vs Prev",
                    value: "Watch ↑8%",
                    valueClassName: "text-emerald-700",
                  },
                ]}
                extraContent={
                  <>
                    <div className="mb-5 grid grid-cols-1 gap-2.5 md:grid-cols-4">
                      <div className="relative overflow-hidden rounded-xl border border-red-200 bg-red-50 p-3.5">
                        <div className="absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-red-600 to-rose-400" />
                        <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#e11d48]">
                          Placement
                        </div>
                        <div className="mb-1 text-[13px] font-bold text-gray-800">
                          Feed Desktop at 43% view rate — worst
                        </div>
                        <div className="text-[11px] text-gray-600">
                          <span className="font-semibold text-[#e11d48]">
                            Action:
                          </span>{" "}
                          Cut Feed Desktop entirely, move budget to Reels (88% VR)
                        </div>
                      </div>
                      <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-3.5">
                        <div className="absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-purple-600 to-purple-300" />
                        <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.1em] text-purple-700">
                          Creative
                        </div>
                        <div className="mb-1 text-[13px] font-bold text-gray-800">
                          Product Demo 45s — 84% VR, top view-through performer
                        </div>
                        <div className="text-[11px] text-gray-600">
                          <span className="font-semibold text-purple-700">
                            Action:
                          </span>{" "}
                          Duplicate as a conversion campaign
                        </div>
                      </div>
                      <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-3.5">
                        <div className="absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-purple-600 to-purple-300" />
                        <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.1em] text-purple-700">
                          Segment
                        </div>
                        <div className="mb-1 text-[13px] font-bold text-gray-800">
                          25–34 Female — 88% VR, 0:38 avg watch
                        </div>
                        <div className="text-[11px] text-gray-600">
                          <span className="font-semibold text-purple-700">
                            Action:
                          </span>{" "}
                          Bid up 20% for this segment across awareness
                        </div>
                      </div>
                      <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-3.5">
                        <div className="absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-purple-600 to-purple-300" />
                        <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.1em] text-purple-700">
                          Reallocation
                        </div>
                        <div className="mb-1 text-[13px] font-bold text-gray-800">
                          Reels: 88% VR at lowest CPM — dominant placement
                        </div>
                        <div className="text-[11px] text-gray-600">
                          <span className="font-semibold text-amber-700">
                            Action:
                          </span>{" "}
                          Shift Feed Desktop budget ($14.20 CPM, 43% VR) entirely
                          to Reels + Feed Mobile
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="mb-2 text-[10px] font-bold uppercase tracking-wide text-gray-400">
                        Delivery
                      </div>
                      <div className="grid grid-cols-1 gap-2.5 md:grid-cols-4">
                        <div className="rounded-xl border border-gray-200 bg-white p-3.5">
                          <div className="text-[9px] font-bold uppercase tracking-wide text-gray-400">
                            Spend
                          </div>
                          <div className="font-mono text-[20px] font-bold text-gray-900">
                            $3,800
                          </div>
                          <div className="text-[11px] text-gray-400">
                            → flat vs prev
                          </div>
                        </div>
                        <div className="rounded-xl border border-gray-200 bg-white p-3.5">
                          <div className="text-[9px] font-bold uppercase tracking-wide text-gray-400">
                            Impressions · CPM
                          </div>
                          <div className="font-mono text-[20px] font-bold text-gray-900">
                            285K{" "}
                            <span className="text-[12px] font-medium text-gray-500">
                              $13.33
                            </span>
                          </div>
                          <div className="text-[11px] text-emerald-600">
                            ↑ 11% impr · CPM stable
                          </div>
                        </div>
                        <div className="rounded-xl border border-gray-200 bg-white p-3.5">
                          <div className="text-[9px] font-bold uppercase tracking-wide text-gray-400">
                            Reach · Freq
                          </div>
                          <div className="font-mono text-[20px] font-bold text-gray-900">
                            74K{" "}
                            <span className="text-[12px] font-medium text-gray-500">
                              3.8×
                            </span>
                          </div>
                          <div className="text-[11px] text-gray-500">
                            Healthy · rising but manageable
                          </div>
                        </div>
                        <div className="rounded-xl border border-gray-200 bg-white p-3.5">
                          <div className="text-[9px] font-bold uppercase tracking-wide text-gray-400">
                            Qualified Reach
                          </div>
                          <div className="font-mono text-[20px] font-bold text-gray-900">
                            53K
                          </div>
                          <div className="text-[11px] font-medium text-purple-700">
                            72% QRR · stable
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="mb-2 text-[10px] font-bold uppercase tracking-wide text-gray-400">
                        Quality
                      </div>
                      <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3">
                        <div className="rounded-xl border border-gray-200 bg-white p-3.5">
                          <div className="text-[9px] font-bold uppercase tracking-wide text-gray-400">
                            View Rate
                          </div>
                          <div className="font-mono text-[20px] font-bold text-gray-900">
                            82%
                          </div>
                          <div className="text-[11px] text-emerald-600">
                            ↑ from 78% · strong growth
                          </div>
                        </div>
                        <div className="rounded-xl border border-gray-200 bg-white p-3.5">
                          <div className="text-[9px] font-bold uppercase tracking-wide text-gray-400">
                            Avg. Watch Time
                          </div>
                          <div className="font-mono text-[20px] font-bold text-gray-900">
                            0:36{" "}
                            <span className="text-[12px] font-medium text-gray-500">
                              of 0:45
                            </span>
                          </div>
                          <div className="text-[11px] text-amber-500">
                            Drop-off at 0:36 — last 9s unwatched
                          </div>
                        </div>
                        <div className="rounded-xl border border-gray-200 bg-white p-3.5">
                          <div className="text-[9px] font-bold uppercase tracking-wide text-gray-400">
                            View-Through Assists
                          </div>
                          <div className="font-mono text-[20px] font-bold text-gray-900">
                            67
                          </div>
                          <div className="text-[11px] text-gray-500">
                            Assisted conversions — closed via retargeting
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 flex gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-[11px] text-amber-900">
                        <span className="mt-[5px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
                        <span>
                          <strong className="text-amber-700">Action:</strong> Edit
                          CTA into first 0:33 of the 45s video — drop-off at 0:36
                          means the conversion moment is being missed by most
                          viewers.
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="mb-2 text-[10px] font-bold uppercase tracking-wide text-gray-400">
                        Outcome
                      </div>
                      <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3">
                        <div className="rounded-xl border border-gray-200 bg-white p-3.5">
                          <div className="text-[9px] font-bold uppercase tracking-wide text-gray-400">
                            Cost per View
                          </div>
                          <div className="font-mono text-[20px] font-bold text-gray-900">
                            $0.016
                          </div>
                          <div className="text-[11px] text-emerald-600">
                            ↓ from $0.019 · improving
                          </div>
                        </div>
                        <div className="rounded-xl border border-gray-200 bg-white p-3.5">
                          <div className="text-[9px] font-bold uppercase tracking-wide text-gray-400">
                            Top Placement
                          </div>
                          <div className="text-[20px] font-bold text-gray-900 leading-tight">
                            Reels
                          </div>
                          <div className="text-[11px] font-medium text-emerald-600">
                            88% VR · lowest CPM
                          </div>
                        </div>
                        <div className="rounded-xl border border-gray-200 bg-white p-3.5">
                          <div className="text-[9px] font-bold uppercase tracking-wide text-gray-400">
                            Top Segment
                          </div>
                          <div className="text-[20px] font-bold text-gray-900 leading-tight">
                            25–34 F
                          </div>
                          <div className="text-[11px] font-medium text-purple-700">
                            88% VR · 0:38 avg watch
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="act-chart-wrap">
                        <ResponsiveContainer width="100%" height="100%">
                          <ComposedChart
                            data={videoViewsTrendData}
                            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                          >
                            <CartesianGrid stroke="#DFE2E8" vertical={false} />
                            <XAxis
                              dataKey="date"
                              tick={{
                                fontSize: 11,
                                fontFamily: "DM Sans, sans-serif",
                                fill: "#6E7787",
                              }}
                              axisLine={false}
                              tickLine={false}
                            />
                            <YAxis
                              yAxisId="y"
                              domain={[0, "auto"]}
                              tick={{
                                fontSize: 10,
                                fontFamily: "JetBrains Mono, monospace",
                                fill: "#4F5664",
                              }}
                              tickFormatter={(v) => formatK(Number(v))}
                              axisLine={false}
                              tickLine={false}
                              width={54}
                            />
                            <YAxis
                              yAxisId="y1"
                              orientation="right"
                              tick={{
                                fontSize: 10,
                                fontFamily: "JetBrains Mono, monospace",
                                fill: "rgba(196,181,227,0.8)",
                              }}
                              tickFormatter={(v) => `${Number(v)}%`}
                              axisLine={false}
                              tickLine={false}
                              width={54}
                            />
                            <Tooltip
                              cursor={{ stroke: "#E8EAF0", strokeWidth: 1 }}
                              formatter={(value, name) => {
                                const num = Number(value);
                                if (name === "View Rate (%)") return [`${num}%`, name];
                                return [formatK(num), name];
                              }}
                            />
                            <Legend
                              verticalAlign="top"
                              align="left"
                              iconType="circle"
                              wrapperStyle={{
                                paddingBottom: 8,
                                fontSize: 11,
                                fontFamily: "DM Sans, sans-serif",
                              }}
                            />
                            <Area
                              yAxisId="y"
                              type="monotone"
                              dataKey="videoViews"
                              name="Video Views"
                              fill="rgba(237,232,247,0.31)"
                              stroke="none"
                              isAnimationActive={false}
                            />
                            <Line
                              yAxisId="y"
                              type="monotone"
                              dataKey="videoViews"
                              name="Video Views"
                              stroke="#7652B3"
                              strokeWidth={2}
                              dot={{
                                r: 4,
                                fill: "#7652B3",
                                stroke: "#fff",
                                strokeWidth: 2,
                              }}
                            />
                            <Line
                              yAxisId="y1"
                              type="monotone"
                              dataKey="viewRate"
                              name="View Rate (%)"
                              stroke="#C4B5E3"
                              strokeWidth={2}
                              strokeDasharray="4 3"
                              dot={{ r: 3, fill: "#C4B5E3" }}
                            />
                          </ComposedChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="mb-2 text-[10px] font-bold uppercase tracking-wide text-gray-400">
                        Segment Performance
                      </div>
                      <div className="mb-3 flex border-b border-gray-200">
                        <button
                          type="button"
                          onClick={() => setVideoTab("demo")}
                          className={`border-b-2 px-4 py-2 text-xs ${videoTab === "demo" ? "border-purple-600 font-semibold text-purple-700" : "border-transparent text-gray-400"}`}
                        >
                          Demographics
                        </button>
                        <button
                          type="button"
                          onClick={() => setVideoTab("time")}
                          className={`border-b-2 px-4 py-2 text-xs ${videoTab === "time" ? "border-purple-600 font-semibold text-purple-700" : "border-transparent text-gray-400"}`}
                        >
                          Time Windows
                        </button>
                        <button
                          type="button"
                          onClick={() => setVideoTab("interest")}
                          className={`border-b-2 px-4 py-2 text-xs ${videoTab === "interest" ? "border-purple-600 font-semibold text-purple-700" : "border-transparent text-gray-400"}`}
                        >
                          Interests
                        </button>
                        <button
                          type="button"
                          onClick={() => setVideoTab("geo")}
                          className={`border-b-2 px-4 py-2 text-xs ${videoTab === "geo" ? "border-purple-600 font-semibold text-purple-700" : "border-transparent text-gray-400"}`}
                        >
                          Geography
                        </button>
                      </div>
                      <div className="overflow-x-auto rounded-xl border border-gray-100">
                        {videoTab === "demo" && (
                          <table className="w-full border-collapse text-[12px]">
                            <thead className="bg-gray-50">
                              <tr>
                                {[
                                  "Segment",
                                  "Reach",
                                  "Views",
                                  "View Rate",
                                  "Avg. Watch",
                                  "Verdict",
                                ].map((h) => (
                                  <th
                                    key={h}
                                    className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wide text-gray-400 border-b-2 border-gray-200"
                                  >
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b border-gray-100">
                                <td className="px-3 py-2 font-semibold">
                                  25–34 Female
                                </td>
                                <td className="px-3 py-2 font-mono">28K</td>
                                <td className="px-3 py-2 font-mono">246K</td>
                                <td className="px-3 py-2 font-mono font-semibold text-purple-700">
                                  88%
                                </td>
                                <td className="px-3 py-2 font-mono">0:38</td>
                                <td className="px-3 py-2">
                                  <span className="rounded-full border border-purple-200 bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700">
                                    Scale ↑
                                  </span>
                                </td>
                              </tr>
                              <tr className="border-b border-gray-100">
                                <td className="px-3 py-2 font-semibold">
                                  25–34 Male
                                </td>
                                <td className="px-3 py-2 font-mono">22K</td>
                                <td className="px-3 py-2 font-mono">178K</td>
                                <td className="px-3 py-2 font-mono">81%</td>
                                <td className="px-3 py-2 font-mono">0:32</td>
                                <td className="px-3 py-2">
                                  <span className="rounded-full border border-purple-200 bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700">
                                    Scale ↑
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="px-3 py-2 font-semibold">
                                  45–54 Male
                                </td>
                                <td className="px-3 py-2 font-mono">6K</td>
                                <td className="px-3 py-2 font-mono">34K</td>
                                <td className="px-3 py-2 font-mono text-[#e11d48]">
                                  57%
                                </td>
                                <td className="px-3 py-2 font-mono text-[#e11d48]">
                                  0:14
                                </td>
                                <td className="px-3 py-2">
                                  <span className="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-bold text-[#e11d48]">
                                    Reduce
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        )}
                        {videoTab === "time" && (
                          <table className="w-full border-collapse text-[12px]">
                            <thead className="bg-gray-50">
                              <tr>
                                {[
                                  "Window",
                                  "Reach",
                                  "Views",
                                  "View Rate",
                                  "Avg. Watch",
                                  "Verdict",
                                ].map((h) => (
                                  <th
                                    key={h}
                                    className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wide text-gray-400 border-b-2 border-gray-200"
                                  >
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b border-gray-100">
                                <td className="px-3 py-2 font-semibold">
                                  Thu–Sun 6pm–12am
                                </td>
                                <td className="px-3 py-2 font-mono">32K</td>
                                <td className="px-3 py-2 font-mono">286K</td>
                                <td className="px-3 py-2 font-mono font-semibold text-purple-700">
                                  89%
                                </td>
                                <td className="px-3 py-2 font-mono">0:40</td>
                                <td className="px-3 py-2">
                                  <span className="rounded-full border border-purple-200 bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700">
                                    Scale ↑
                                  </span>
                                </td>
                              </tr>
                              <tr className="border-b border-gray-100">
                                <td className="px-3 py-2 font-semibold">
                                  Mon–Wed 6pm–12am
                                </td>
                                <td className="px-3 py-2 font-mono">18K</td>
                                <td className="px-3 py-2 font-mono">142K</td>
                                <td className="px-3 py-2 font-mono">79%</td>
                                <td className="px-3 py-2 font-mono">0:33</td>
                                <td className="px-3 py-2">
                                  <span className="rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-500">
                                    Monitor
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="px-3 py-2 font-semibold">
                                  All days 12am–9am
                                </td>
                                <td className="px-3 py-2 font-mono">8K</td>
                                <td className="px-3 py-2 font-mono">38K</td>
                                <td className="px-3 py-2 font-mono text-[#e11d48]">
                                  48%
                                </td>
                                <td className="px-3 py-2 font-mono text-[#e11d48]">
                                  0:11
                                </td>
                                <td className="px-3 py-2">
                                  <span className="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-bold text-[#e11d48]">
                                    Exclude
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        )}
                        {videoTab === "interest" && (
                          <table className="w-full border-collapse text-[12px]">
                            <thead className="bg-gray-50">
                              <tr>
                                {[
                                  "Interest",
                                  "Reach",
                                  "Views",
                                  "View Rate",
                                  "Avg. Watch",
                                  "Verdict",
                                ].map((h) => (
                                  <th
                                    key={h}
                                    className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wide text-gray-400 border-b-2 border-gray-200"
                                  >
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b border-gray-100">
                                <td className="px-3 py-2 font-semibold">
                                  Home Improvement + DIY
                                </td>
                                <td className="px-3 py-2 font-mono">24K</td>
                                <td className="px-3 py-2 font-mono">211K</td>
                                <td className="px-3 py-2 font-mono font-semibold text-purple-700">
                                  88%
                                </td>
                                <td className="px-3 py-2 font-mono">0:42</td>
                                <td className="px-3 py-2">
                                  <span className="rounded-full border border-purple-200 bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700">
                                    Scale ↑
                                  </span>
                                </td>
                              </tr>
                              <tr className="border-b border-gray-100">
                                <td className="px-3 py-2 font-semibold">
                                  Interior Design
                                </td>
                                <td className="px-3 py-2 font-mono">18K</td>
                                <td className="px-3 py-2 font-mono">148K</td>
                                <td className="px-3 py-2 font-mono">82%</td>
                                <td className="px-3 py-2 font-mono">0:36</td>
                                <td className="px-3 py-2">
                                  <span className="rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-500">
                                    Monitor
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="px-3 py-2 font-semibold">
                                  General Retail
                                </td>
                                <td className="px-3 py-2 font-mono">9K</td>
                                <td className="px-3 py-2 font-mono">52K</td>
                                <td className="px-3 py-2 font-mono text-[#e11d48]">
                                  58%
                                </td>
                                <td className="px-3 py-2 font-mono text-[#e11d48]">
                                  0:16
                                </td>
                                <td className="px-3 py-2">
                                  <span className="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-bold text-[#e11d48]">
                                    Reduce
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        )}
                        {videoTab === "geo" && (
                          <table className="w-full border-collapse text-[12px]">
                            <thead className="bg-gray-50">
                              <tr>
                                {[
                                  "State",
                                  "Reach",
                                  "Views",
                                  "View Rate",
                                  "Avg. Watch",
                                  "Verdict",
                                ].map((h) => (
                                  <th
                                    key={h}
                                    className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wide text-gray-400 border-b-2 border-gray-200"
                                  >
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b border-gray-100">
                                <td className="px-3 py-2 font-semibold">
                                  California
                                </td>
                                <td className="px-3 py-2 font-mono">18K</td>
                                <td className="px-3 py-2 font-mono">162K</td>
                                <td className="px-3 py-2 font-mono font-semibold text-purple-700">
                                  90%
                                </td>
                                <td className="px-3 py-2 font-mono">0:40</td>
                                <td className="px-3 py-2">
                                  <span className="rounded-full border border-purple-200 bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700">
                                    Scale ↑
                                  </span>
                                </td>
                              </tr>
                              <tr className="border-b border-gray-100">
                                <td className="px-3 py-2 font-semibold">Texas</td>
                                <td className="px-3 py-2 font-mono">14K</td>
                                <td className="px-3 py-2 font-mono">118K</td>
                                <td className="px-3 py-2 font-mono text-purple-700">
                                  84%
                                </td>
                                <td className="px-3 py-2 font-mono">0:37</td>
                                <td className="px-3 py-2">
                                  <span className="rounded-full border border-purple-200 bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700">
                                    Scale ↑
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="px-3 py-2 font-semibold">
                                  Other States
                                </td>
                                <td className="px-3 py-2 font-mono">42K</td>
                                <td className="px-3 py-2 font-mono">278K</td>
                                <td className="px-3 py-2 font-mono">66%</td>
                                <td className="px-3 py-2 font-mono">0:26</td>
                                <td className="px-3 py-2">
                                  <span className="rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-500">
                                    Monitor
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        )}
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="mb-2 text-[10px] font-bold uppercase tracking-wide text-gray-400">
                        Placement Breakdown
                      </div>
                      <div className="overflow-x-auto rounded-xl border border-gray-100">
                        <table className="w-full border-collapse text-[12px]">
                          <thead className="bg-gray-50">
                            <tr>
                              {[
                                "Placement",
                                "Reach",
                                "Impr",
                                "CPM",
                                "Views",
                                "View Rate",
                                "Avg. Watch",
                              ].map((h) => (
                                <th
                                  key={h}
                                  className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wide text-gray-400 border-b-2 border-gray-200"
                                >
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-gray-100">
                              <td className="px-3 py-2 font-semibold">
                                Feed Mobile
                              </td>
                              <td className="px-3 py-2 font-mono">48K</td>
                              <td className="px-3 py-2 font-mono">182K</td>
                              <td className="px-3 py-2 font-mono">$11.40</td>
                              <td className="px-3 py-2 font-mono">152K</td>
                              <td className="px-3 py-2 font-mono font-semibold text-purple-700">
                                84%
                              </td>
                              <td className="px-3 py-2 font-mono">0:38</td>
                            </tr>
                            <tr className="border-b border-gray-100">
                              <td className="px-3 py-2 font-semibold">Reels</td>
                              <td className="px-3 py-2 font-mono">22K</td>
                              <td className="px-3 py-2 font-mono">89K</td>
                              <td className="px-3 py-2 font-mono">$10.80</td>
                              <td className="px-3 py-2 font-mono">78K</td>
                              <td className="px-3 py-2 font-mono font-semibold text-purple-700">
                                88%
                              </td>
                              <td className="px-3 py-2 font-mono">0:42</td>
                            </tr>
                            <tr >
                              <td className="px-3 py-2 font-semibold">
                                Feed Desktop
                              </td>
                              <td className="px-3 py-2 font-mono">4K</td>
                              <td className="px-3 py-2 font-mono">14K</td>
                              <td className="px-3 py-2 font-mono">
                                $14.20
                              </td>
                              <td className="px-3 py-2 font-mono">6K</td>
                              <td className="px-3 py-2 font-mono font-semibold">
                                43%
                              </td>
                              <td className="px-3 py-2 font-mono">
                                0:12
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                    </div>

                    <div className="mb-4">
                      <div className="mb-2 text-[10px] font-bold uppercase tracking-wide text-gray-400">
                        Creative Performance
                      </div>
                      <div className="overflow-x-auto rounded-xl border border-gray-100">
                        <table className="w-full border-collapse text-[12px]">
                          <thead className="bg-gray-50">
                            <tr>
                              {[
                                "Creative",
                                "Reach",
                                "View Rate",
                                "Avg. Watch",
                                "Drop-off Point",
                                "Verdict",
                              ].map((h) => (
                                <th
                                  key={h}
                                  className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wide text-gray-400 border-b-2 border-gray-200"
                                >
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-gray-100 p-2">
                              <td className="px-3 py-2">
                                <div className="creative-row">
                                  <div className="thumb thumb-1 video" />
                                  <div>
                                    <div className="creative-name">
                                      45s Product Demo
                                    </div>
                                    <div className="creative-meta">
                                      Video · Feed + Reels
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-3 py-2 font-mono">42K</td>
                              <td className="px-3 py-2 font-mono font-semibold text-purple-700">
                                84%
                              </td>
                              <td className="px-3 py-2 font-mono font-semibold text-purple-700">
                                0:38
                              </td>
                              <td className="px-3 py-2 text-[11px] text-amber-500">
                                0:36 — edit CTA to 0:33
                              </td>
                              <td className="px-3 py-2">
                                <span className="rounded-full border border-purple-200 bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700">
                                  Scale ↑
                                </span>
                              </td>
                            </tr>
                            <tr className="border-b border-gray-100">
                              <td className="px-3 py-2">
                                <div className="creative-row">
                                  <div className="thumb thumb-6 carousel" />
                                  <div>
                                    <div className="creative-name">
                                      Customer Story Carousel
                                    </div>
                                    <div className="creative-meta">
                                      Carousel · Feed
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-3 py-2 font-mono">34K</td>
                              <td className="px-3 py-2 font-mono">79%</td>
                              <td className="px-3 py-2 font-mono">0:31</td>
                              <td className="px-3 py-2 text-[11px] text-gray-500">
                                0:31 — acceptable
                              </td>
                              <td className="px-3 py-2">
                                <span className="rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-500">
                                  Monitor
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2">
                                <div className="creative-row">
                                  <div className="thumb thumb-1 video" />
                                  <div>
                                    <div className="creative-name">
                                      Before/After Results
                                    </div>
                                    <div className="creative-meta">
                                      Video · Reels
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-3 py-2 font-mono">22K</td>
                              <td className="px-3 py-2 font-mono">76%</td>
                              <td className="px-3 py-2 font-mono">0:28</td>
                              <td className="px-3 py-2 text-[11px] text-gray-500">
                                0:28 — stable
                              </td>
                              <td className="px-3 py-2">
                                <span className="rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-500">
                                  Monitor
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 text-[10px] font-bold uppercase tracking-wide text-gray-400">
                        Campaign Configuration
                      </div>
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {[
                          {
                            label: "Objective",
                            value: "Video Views",
                            accent: true,
                          },
                          { label: "Optimization", value: "ThruPlay" },
                          { label: "Bid Strategy", value: "Lowest Cost" },
                          { label: "Avg. Watch", value: "0:36" },
                          { label: "Daily Budget", value: "$122.58" },
                          { label: "Lifetime", value: "$3,800" },
                          { label: "Start", value: "Jan 1" },
                          { label: "Duration", value: "31 days" },
                        ].map((c) => (
                          <div
                            key={c.label}
                            className="min-w-[120px] flex-shrink-0 rounded-xl border border-gray-100 bg-white px-3 py-2 text-center"
                          >
                            <div className="text-[8px] font-bold uppercase tracking-wide text-gray-400">
                              {c.label}
                            </div>
                            <div
                              className={`mt-0.5 text-[11px] font-semibold ${c.accent ? "text-purple-700" : "text-gray-700"}`}
                            >
                              {c.value}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 flex gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2.5 text-[11px] text-blue-800">
                        <span className="mt-[5px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
                        <span>
                          <strong className="text-blue-700">Action:</strong>{" "}
                          Remove Feed Desktop from placement targeting — 43% VR vs
                          88% on Reels. Shift that budget to Reels and duplicate
                          the 45s Product Demo as a conversion campaign.
                        </span>
                      </div>
                    </div>
                  </>
                }
              />
            </div>
          </>
        )}
      </div>
      <style jsx>{`
        .creative-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .thumb {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          flex-shrink: 0;
          overflow: hidden;
          position: relative;
        }

        .thumb.video::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-top: 6px solid transparent;
          border-bottom: 6px solid transparent;
          border-left: 9px solid #fff;
          transform: translate(-42%, -50%);
        }

        .thumb.carousel::after {
          content: "⊞";
          position: absolute;
          bottom: 2px;
          right: 3px;
          font-size: 10px;
          color: #fff;
          background: rgba(0, 0, 0, 0.35);
          padding: 0 3px;
          border-radius: 3px;
          line-height: 1.4;
        }

        .thumb-1 {
          background:
            linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
            linear-gradient(135deg, #ede8f7, #c4b5e3);
        }

        .thumb-3 {
          background: linear-gradient(135deg, #f8f6fc, #ede8f7);
        }

        .thumb-6 {
          background: linear-gradient(135deg, #f8f6fc, #ede8f7);
        }

        .creative-name {
          font-weight: 600;
          font-size: 14px;
          color: #1e293b;
        }

        .creative-meta {
          font-size: 12px;
          color: #94a3b8;
          margin-top: 2px;
        }

        .newaud-qr-wrap {
          background: #fff;
          border: 1px solid #dfe2e8;
          border-radius: 12px;
          padding: 1rem;
          width: 100%;
        }

        .newaud-qr-label {
          font-size: 0.6875rem;
          font-weight: 600;
          color: #4f5664;
          margin-bottom: 0.75rem;
        }

        .newaud-qr-chart {
          position: relative;
          height: 200px;
        }

        .reach-metric-cards {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 14px;
        }

        .reach-metric-card {
          flex: 1;
          min-width: 120px;
          padding: 12px 16px;
          border: 1.5px solid #e8eaf0;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          background: #fff;
          text-align: left;
        }

        .reach-metric-card:hover {
          border-color: #c4b5e3;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(118, 82, 179, 0.08);
        }

        .reach-metric-card.selected {
          border-color: #7652b3;
          background: #f8f6fc;
        }

        .reach-metric-label {
          font-size: 10px;
          font-weight: 600;
          color: #9ba3b0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }

        .reach-metric-value {
          font-family: "JetBrains Mono", monospace;
          font-size: 20px;
          font-weight: 700;
          color: #242830;
          line-height: 1.2;
        }

        .reach-metric-card.selected .reach-metric-value {
          color: #4a2f7a;
        }

        .reach-metric-delta {
          margin-top: 2px;
          font-size: 10px;
          font-weight: 600;
          color: #6e7787;
          line-height: 1.4;
        }

        .reach-insight-title {
          font-size: 14px;
          font-weight: 700;
          color: #14171d;
          margin-bottom: 4px;
        }

        .reach-insight-sub {
          font-size: 12px;
          line-height: 1.55;
          color: #4f5664;
          margin-bottom: 4px;
        }

        .reach-chart-wrap {
          position: relative;
          height: 300px;
          background: #fdfdfe;
          border-radius: 12px;
          padding: 12px;
          margin: 8px 0 20px;
          transition: opacity 0.18s ease;
        }

        .reach-chart-wrap.switching {
          opacity: 0.15;
        }

        .reach-tooltip {
          background: #2d1b4e;
          color: #fff;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 12px;
          line-height: 1.6;
          box-shadow: 0 8px 24px rgba(74, 47, 122, 0.3);
          min-width: 185px;
        }

        .reach-tooltip-title {
          font-family: "DM Sans", sans-serif;
          font-weight: 600;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.65);
          margin-bottom: 4px;
        }

        .reach-tooltip-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .reach-tooltip-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .reach-tooltip-label {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.8);
        }

        .reach-tooltip-value {
          margin-left: auto;
          font-family: "JetBrains Mono", monospace;
          font-weight: 600;
          font-size: 13px;
        }

        .eng-metric-cards {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }

        .eng-metric-card {
          flex: 1;
          min-width: 120px;
          padding: 12px 16px;
          border: 1.5px solid #e8eaf0;
          border-radius: 12px;
          cursor: pointer;
          background: #fff;
          transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          text-align: left;
        }

        .eng-metric-card:hover {
          border-color: #c4b5e3;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(118, 82, 179, 0.08);
        }

        .eng-metric-card:active {
          transform: translateY(0);
        }

        .eng-metric-card.selected {
          border-color: #7652b3;
          background: #f8f6fc;
        }

        .eng-metric-label {
          font-size: 10px;
          font-weight: 600;
          color: #9ba3b0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }

        .eng-metric-value {
          font-family: "JetBrains Mono", monospace;
          font-size: 20px;
          font-weight: 700;
          color: #242830;
          line-height: 1.2;
        }

        .eng-metric-card.selected .eng-metric-value {
          color: #4a2f7a;
        }

        .eng-metric-delta {
          font-size: 10px;
          font-weight: 600;
          color: #6e7787;
          margin-top: 2px;
          line-height: 1.45;
        }

        .eng-insight-title {
          font-size: 14px;
          font-weight: 700;
          color: #14171d;
          margin-bottom: 4px;
        }

        .eng-insight-sub {
          font-size: 12px;
          color: #4f5664;
          line-height: 1.55;
          margin-bottom: 4px;
        }

        .eng-chart-wrap {
          position: relative;
          height: 260px;
          background: #fdfdfe;
          border-radius: 12px;
          padding: 12px;
          margin: 8px 0 0;
          transition: opacity 0.18s ease;
        }

        .eng-chart-wrap.switching {
          opacity: 0.15;
        }

        .eng-tooltip {
          background: #2d1b4e;
          color: #fff;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 12px;
          line-height: 1.6;
          box-shadow: 0 8px 24px rgba(74, 47, 122, 0.3);
          min-width: 185px;
        }

        .eng-tooltip-title {
          font-family: "DM Sans", sans-serif;
          font-weight: 600;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.65);
          margin-bottom: 4px;
        }

        .eng-tooltip-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .eng-tooltip-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .eng-tooltip-label {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.8);
        }

        .eng-tooltip-value {
          margin-left: auto;
          font-family: "JetBrains Mono", monospace;
          font-weight: 600;
          font-size: 13px;
        }

        .act-metric-cards {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }

        .act-metric-card {
          flex: 1;
          min-width: 120px;
          padding: 12px 16px;
          border: 1.5px solid #e8eaf0;
          border-radius: 12px;
          cursor: pointer;
          background: #fff;
          transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          text-align: left;
        }

        .act-metric-card:hover {
          border-color: #c4b5e3;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(118, 82, 179, 0.08);
        }

        .act-metric-card:active {
          transform: translateY(0);
        }

        .act-metric-card.selected {
          border-color: #7652b3;
          background: #f8f6fc;
        }

        .act-metric-label {
          font-size: 10px;
          font-weight: 600;
          color: #9ba3b0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }

        .act-metric-value {
          font-family: "JetBrains Mono", monospace;
          font-size: 20px;
          font-weight: 700;
          color: #242830;
          line-height: 1.2;
        }

        .act-metric-card.selected .act-metric-value {
          color: #4a2f7a;
        }

        .act-metric-delta {
          font-size: 10px;
          font-weight: 600;
          color: #6e7787;
          margin-top: 2px;
          line-height: 1.45;
        }

        .act-insight-title {
          font-size: 14px;
          font-weight: 700;
          color: #14171d;
          margin-bottom: 4px;
        }

        .act-insight-sub {
          font-size: 12px;
          color: #4f5664;
          line-height: 1.55;
          margin-bottom: 4px;
        }

        .act-chart-wrap {
          position: relative;
          height: 200px;
          background: #ffffff;
          border-radius: 12px;
          padding: 12px;
          margin: 8px 0 0;
        }

        .act-tooltip {
          background: #2d1b4e;
          color: #fff;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 12px;
          line-height: 1.6;
          box-shadow: 0 8px 24px rgba(74, 47, 122, 0.3);
          min-width: 185px;
        }

        .act-tooltip-title {
          font-family: "DM Sans", sans-serif;
          font-weight: 600;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.65);
          margin-bottom: 4px;
        }

        .act-tooltip-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .act-tooltip-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .act-tooltip-label {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.8);
        }

        .act-tooltip-value {
          margin-left: auto;
          font-family: "JetBrains Mono", monospace;
          font-weight: 600;
          font-size: 13px;
        }
      `}</style>
    </Card>
  );
};
