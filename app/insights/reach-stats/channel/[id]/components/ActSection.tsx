"use client";
import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card } from "./shared/Card";
import { InsightRibbon } from "./shared/InsightRibbon";
import { MetricCard } from "./shared/MetricCard";
import { DynamicInsightPanel } from "./shared/DynamicInsightPanel";
import { YourNextMove } from "./shared/YourNextMove";
import { Pill } from "./shared/Pill";
import type { TransformedAct } from "@/lib/reach-stats/channel-transforms";

const ACCENT = "#7652B3";
const ACCENT_MUTED = "#C4B5E3";
const ACCENT_LIGHT = "#EDE8F7";
const DAYS = ["Jan 1", "Jan 5", "Jan 9", "Jan 13", "Jan 17", "Jan 21", "Jan 25", "Jan 31"];

const actData = DAYS.map((d, i) => ({
  date: d,
  acr: [58, 60, 62, 64, 65, 66, 67, 67.8][i],
  aqs: [0.48, 0.5, 0.52, 0.54, 0.56, 0.58, 0.6, 0.62][i],
  ais: [820, 1640, 2890, 3800, 4400, 4900, 5280, 5549][i],
  cpa: [8.2, 7.8, 7.4, 7.1, 6.95, 6.88, 6.84, 6.82][i],
}));

type ActMetric = "acr" | "aqs" | "ais" | "cpa";

type Series = {
  key: "acr" | "aqs" | "ais" | "cpa";
  name: string;
  color: string;
  dashed?: boolean;
  yAxisId?: "y" | "y1";
};

const seriesByMetric: Record<ActMetric, Series[]> = {
  acr: [{ key: "acr", name: "ACR (%)", color: ACCENT, yAxisId: "y" }],
  aqs: [{ key: "aqs", name: "AQS", color: ACCENT, yAxisId: "y" }],
  ais: [{ key: "ais", name: "AIS", color: ACCENT, yAxisId: "y" }],
  cpa: [{ key: "cpa", name: "CpA ($)", color: ACCENT, yAxisId: "y" }],
};

const insightItems: Array<{ key: ActMetric; title: string; body: string }> = [
  {
    key: "acr",
    title: "Action Completion Rate",
    body: "Qualification forms at 58% ACR - the 20pp gap vs standard is the intent filter working. Website forms at 34% suggest landing page friction, not audience mismatch.",
  },
  {
    key: "aqs",
    title: "Action Quality Score",
    body: "Qualification forms (x3) + Messenger (x2) drive AQS despite lower volume. Standard forms cheap but weight x1 - they inflate action counts, not quality.",
  },
  {
    key: "ais",
    title: "Action Impact Score",
    body: "Qualification forms = 52% of AIS from 32% of volume. Every budget shift toward them compounds - quality and scale moving in the same direction.",
  },
  {
    key: "cpa",
    title: "Cost per Action",
    body: "$6.82 aggregate hides the real story: Qualification forms at $5.40, External page at $13.20. Shift mix and blended CpA drops without changing total spend.",
  },
];

const ActTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number | string; color?: string }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="pointer-events-none max-w-[220px] rounded-lg bg-[#2D1B4E] px-3.5 py-2.5 text-white shadow-xl">
      <div className="mb-1 text-[11px] font-semibold text-white/65">{label}</div>
      <div className="space-y-1">
        {payload.map((item, idx) => (
          <div key={idx} className="flex items-center gap-1.5 text-[11px]">
            <span className="h-2 w-2 rounded-full" style={{ background: item.color || ACCENT }} />
            <span className="text-white/80">{item.name}</span>
            <span className="ml-auto font-mono text-[13px] font-semibold text-white">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ActSection = ({ data }: { data?: TransformedAct }) => {
  // Use API timeSeries when available, fallback to static data
  const chartData = data?.timeSeries ?? actData;
  const [metric, setMetric] = useState<ActMetric>("acr");
  const [switching, setSwitching] = useState(false);

  const activeSeries = seriesByMetric[metric];
  const hasRightAxis = activeSeries.some((s) => s.yAxisId === "y1");

  const switchMetric = (next: ActMetric) => {
    if (next === metric) return;
    setSwitching(true);
    setTimeout(() => {
      setMetric(next);
      setSwitching(false);
    }, 180);
  };

  const yFormatter = (value: number) => {
    if (metric === "cpa") return `$${Number(value).toFixed(2)}`;
    if (metric === "acr") return `${value}%`;
    return value >= 1000 ? `${(value / 1000).toFixed(0)}K` : `${value}`;
  };

  const yDomain: [number, number | "auto"] =
    metric === "acr"
      ? [0, 100]
      : metric === "aqs"
        ? [0, 1]
        : [0, "auto"];

  return (
    <Card>
      <div className="px-7 py-5">
        <h2 className="text-base font-bold tracking-tight">Act - High-Intent Actions</h2>
      </div>
      <InsightRibbon>
        Conversion-intent campaigns - measuring action completion, quality, and cost efficiency · <strong>{data?.summary.acr ?? "67.8%"} ACR</strong> · qualification forms outperforming at {data?.summary.cpa ?? "$5.40"} CpA vs $13.20 on landing pages, mix shift is the lever
      </InsightRibbon>
      <div className="p-6">
        <div className="mb-4 flex flex-wrap gap-3">
          <MetricCard
            label="Action Completion Rate (ACR)"
            value={data?.summary.acr ?? "67.8%"}
            delta={data?.summary.acrDelta ? `${data.summary.acrDelta} · OMTM` : "Up 3pp · OMTM"}
            selected={metric === "acr"}
            onClick={() => switchMetric("acr")}
            formula="ACR = Completed Actions ÷ Action Starts × 100"
          />
          <MetricCard
            label="Action Quality Score (AQS)"
            value={data?.summary.aqs ?? "0.62"}
            delta={data?.summary.aqsDelta ? `${data.summary.aqsDelta} · Qualification forms drive quality` : "Qualification forms drive quality"}
            selected={metric === "aqs"}
            onClick={() => switchMetric("aqs")}
            formula="AQS = Σ(Actions × Quality Weight) ÷ Max Possible"
          />
          <MetricCard
            label="Action Impact Score (AIS)"
            value={data?.summary.ais ?? "5,549"}
            delta={data?.summary.aisDelta ?? "Quality-weighted actions at scale"}
            selected={metric === "ais"}
            onClick={() => switchMetric("ais")}
            formula="AIS = AQS × ln(Total Actions + 1)"
          />
          <MetricCard
            label="Cost per Action (CpA)"
            value={data?.summary.cpa ?? "$6.82"}
            delta={data?.summary.cpaDelta ?? "Down 12%"}
            selected={metric === "cpa"}
            onClick={() => switchMetric("cpa")}
            formula="CpA = Ad Spend ÷ Total Completed Actions"
          />
        </div>

        <DynamicInsightPanel items={data?.insights?.length ? data.insights : insightItems} activeKey={metric} />

        <div className={`mb-5 h-64 rounded-xl bg-[#FDFDFE] p-3 transition-opacity duration-200 ${switching ? "opacity-20" : "opacity-100"}`}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid stroke="#DFE2E8" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fontFamily: "DM Sans", fill: "#6E7787" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                yAxisId="y"
                domain={yDomain}
                tick={{ fontSize: 10, fontFamily: "JetBrains Mono", fill: "#9BA3B0" }}
                tickFormatter={yFormatter}
              />
              <YAxis
                yAxisId="y1"
                orientation="right"
                hide={!hasRightAxis}
                domain={[0, "auto"]}
                tick={{ fontSize: 10, fontFamily: "JetBrains Mono", fill: "#9BA3B0" }}
                tickFormatter={(v) => `$${Number(v).toFixed(2)}`}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<ActTooltip />} cursor={false} />
              <Legend
                verticalAlign="top"
                align="left"
                iconType="circle"
                wrapperStyle={{ fontSize: 11, fontFamily: "DM Sans", paddingBottom: 10 }}
              />
              {activeSeries.map((s) => (
                <Line
                  key={s.key}
                  yAxisId={s.yAxisId || "y"}
                  type="monotone"
                  dataKey={s.key}
                  name={s.name}
                  stroke={s.color}
                  strokeWidth={s.key === "acr" ? 2.5 : 2.25}
                  strokeDasharray={s.dashed ? "4 3" : undefined}
                  dot={{ r: 4, fill: s.color }}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <YourNextMove
          scale={[
            { tag: "Scale", text: <><strong>Qualification Forms budget +40%</strong> - $5.40 CpA, 58% ACR, 52% of AIS from 32% of volume</> },
            { tag: "Scale", text: <><strong>Messenger Bot budget +20%</strong> - $8.90 CpA but highest downstream conversion rate</> },
          ]}
          fix={[
            { tag: "Fix", text: <><strong>External landing page</strong> - 34% ACR, $13.20 CpA · A/B test copy or replace with Instant Form</> },
            { tag: "Reduce", text: <><strong>Standard Form volume</strong> - 78% ACR looks good but weight x1 · move budget to qualification forms</> },
          ]}
          watch={[
            { tag: "Track", text: <><strong>ACR vs 70% target</strong> - at 67.8%, qualification form ACR dropping signals audience mismatch</> },
            { tag: "Track", text: <><strong>Messenger downstream conversion</strong> - $8.90 CpA justified only if conversion rate holds above 18%</> },
          ]}
        />

        <h3 className="text-sm font-bold">Action Source Performance</h3>
        <div className="mt-3 overflow-hidden rounded-xl border border-gray-100">
          <table className="w-full border-collapse text-[12px]">
            <thead className="bg-gray-50">
              <tr>
                {["Action Source", "Actions", "CpA", "ACR", "vs Prev", "Verdict"].map((h) => (
                  <th key={h} className="border-b-2 border-gray-100 px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-wide text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { src: "Instant Form - Qualification", srcMeta: "3 qualifying questions", actions: "2,890", cpa: "$5.40", acr: "58%", vs: "Up 12%", vsColor: "text-green-600", verdict: "Scale Up", v: "accent" as const },
                { src: "Instant Form - Standard", srcMeta: "Name + email only", actions: "3,456", cpa: "$4.12", acr: "78%", vs: "Flat 0%", vsColor: "text-gray-400", verdict: "Reduce", v: "default" as const },
                { src: "Messenger Bot", srcMeta: "Automated qualification flow", actions: "1,234", cpa: "$8.90", acr: "-", vs: "Up 18%", vsColor: "text-green-600", verdict: "Scale Up", v: "accent" as const },
                { src: "External Landing Page", srcMeta: "Website redirect form", actions: "1,365", cpa: "$13.20", acr: "34%", vs: "Down 6%", vsColor: "text-[#e11d48]", verdict: "Optimize", v: "default" as const, cpaColor: "text-[#e11d48]", acrColor: "text-[#e11d48]" },
              ].map((r, i) => (
                <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="px-3 py-2.5">
                    <div className="font-semibold">{r.src}</div>
                    <div className="text-[11px] text-gray-400">{r.srcMeta}</div>
                  </td>
                  <td className="px-3 py-2.5 font-mono">{r.actions}</td>
                  <td className={`px-3 py-2.5 font-mono ${(r as { cpaColor?: string }).cpaColor || ""}`}>{r.cpa}</td>
                  <td className={`px-3 py-2.5 font-mono ${(r as { acrColor?: string }).acrColor || ""}`}>{r.acr}</td>
                  <td className="px-3 py-2.5 font-mono">
                    <span className={`text-[9px] font-semibold ${r.vsColor}`}>{r.vs}</span>
                  </td>
                  <td className="px-3 py-2.5"><Pill variant={r.v}>{r.verdict}</Pill></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
};
