"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ComposedChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
  ResponsiveContainer,
} from "recharts";
import { Card } from "./shared/Card";
import { InsightRibbon } from "./shared/InsightRibbon";
import { YourNextMove } from "./shared/YourNextMove";
import { Pill } from "./shared/Pill";
import { CustomTooltip } from "./shared/CustomTooltip";
import type { TransformedEngage } from "@/lib/reach-stats/channel-transforms";

const ACCENT = "#7652B3";
const ACCENT_MUTED = "#C4B5E3";
const DANGER = "#E11D48";
const DAYS = ["Jan 1", "Jan 5", "Jan 9", "Jan 13", "Jan 17", "Jan 21", "Jan 25", "Jan 31"];

type EngageDataPoint = {
  date: string;
  eis: number | null;
  eqs: number | null;
  eqsTarget: number;
  cpqe: number | null;
  esr: number | null;
  engagementRate?: number | null;
};

function parseEqsFromSummary(eqs: string | undefined): number | null {
  if (!eqs || eqs === "—") return null;
  const n = parseFloat(String(eqs).replace(/[^0-9.-]+/g, ""));
  return Number.isFinite(n) ? n : null;
}

function toEngageChartData(timeSeries: TransformedEngage["timeSeries"]): EngageDataPoint[] {
  const eqsTarget = 0.4;
  const num = (x: unknown): number | null =>
    typeof x === "number" && Number.isFinite(x) ? x : null;
  return timeSeries.map((pt) => {
    const p = pt as Record<string, unknown>;
    const er =
      num(p.engagementRate) ??
      (typeof p.engagement_rate === "number" && Number.isFinite(p.engagement_rate)
        ? (p.engagement_rate as number)
        : null);
    return {
      date: String(p.date ?? ""),
      eis: num(p.eis),
      eqs: num(p.eqs) ?? (er != null ? er / 100 : null),
      eqsTarget,
      cpqe: num(p.cpqe),
      esr: num(p.esr) ?? er,
      engagementRate: er,
    };
  });
}

const engageData: EngageDataPoint[] = DAYS.map((d, i) => ({
  date: d,
  eis: [2.1, 2.58, 3.04, 3.52, 3.98, 4.28, 4.62, 4.82][i],
  eqs: [0.22, 0.24, 0.26, 0.28, 0.3, 0.31, 0.33, 0.34][i],
  eqsTarget: 0.4,
  cpqe: [1.12, 1.04, 0.98, 0.94, 0.9, 0.88, 0.86, 0.84][i],
  esr: [48, 50, 53, 56, 58, 60, 62, 64][i],
}));

const peakEngData = [
  { window: "12\u20133am", score: 4.9 },
  { window: "3\u20136am", score: 4.9 },
  { window: "6\u20139am", score: 8.7 },
  { window: "9\u201312pm", score: 8.5 },
  { window: "12\u20133pm", score: 9.5 },
  { window: "3\u20136pm", score: 9.5 },
  { window: "6\u20139pm", score: 9.2 },
  { window: "9\u201312am", score: 9.1 },
];

const getPeakBarColor = (value: number) => {
  if (value >= 9.5) return "#7652B3";
  if (value >= 8.5) return "#C4B5E3";
  return "#C8CDD6";
};

const peakEngStyledData = peakEngData.map((item) => ({
  ...item,
  eng: 0,
  fill: getPeakBarColor(item.score),
}));

const PeakEngTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value?: number | string }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  const value = payload[0]?.value;
  return (
    <div className="rounded-[8px] bg-[#2D1B4E] px-[10px] py-[10px] text-white">
      <div className="text-[11px] font-semibold leading-none text-white">{label}</div>
      <div className="mt-1 font-mono text-[12px] leading-none text-white">{` Score: ${value}`}</div>
    </div>
  );
};

type EngageMetric = "eis" | "eqs" | "cpqe" | "esr";
type AxisKind = "number" | "currency" | "percent";
type LineDef = {
  dataKey: Exclude<keyof EngageDataPoint, "date">;
  name: string;
  color: string;
  yAxisId: "y" | "y1";
  strokeWidth?: number;
  dashed?: boolean;
};

// metricCardsConfig is built inside the component to use API data

const insightByMetric: Record<EngageMetric, { title: string; body: string }> = {
  eis: {
    title: "Engagement Impact Score",
    body: "EIS rising while reach grows — quality isn't being diluted by volume. Reels driving the lift at EQS 0.42 vs Feed 0.28.",
  },
  eqs: {
    title: "Engagement Quality Score",
    body: "0.06 gap to 0.40 target. Reels EQS 0.42 already above target — shifting budget here closes the gap fastest.",
  },
  cpqe: {
    title: "Cost per Qualified Engagement",
    body: "$0.32 quality premium over surface CPE — filtering vanity likes. Saves at $1.12 each signal purchase intent; worth the premium.",
  },
  esr: {
    title: "Engagement Stickiness Rate",
    body: "Video at 72% watch-through, carousel at 58% swipe completion. Article scroll at 48% — lowest depth format, deprioritise.",
  },
};

const engageChartByMetric: Record<EngageMetric, {
  leftAxis: AxisKind;
  rightAxis?: AxisKind;
  lines: LineDef[];
}> = {
  eis: {
    leftAxis: "number",
    rightAxis: "currency",
    lines: [
      { dataKey: "eis", name: "EIS", color: ACCENT, yAxisId: "y", strokeWidth: 2.5 }
    ],
  },
  eqs: {
    leftAxis: "number",
    lines: [
      { dataKey: "eqs", name: "EQS", color: ACCENT, yAxisId: "y", strokeWidth: 2.5 }
    ],
  },
  cpqe: {
    leftAxis: "currency",
    rightAxis: "percent",
    lines: [
      { dataKey: "cpqe", name: "CpQE ($)", color: ACCENT, yAxisId: "y", strokeWidth: 2.5 }
    ],
  },
  esr: {
    leftAxis: "percent",
    rightAxis: "number",
    lines: [
      { dataKey: "esr", name: "ESR (%)", color: ACCENT, yAxisId: "y", strokeWidth: 2.5 }
    ],
  },
};

const axisTickFormatter = (kind: AxisKind) => (value: number) => {
  if (kind === "currency") return `$${value.toFixed(2)}`;
  if (kind === "percent") return `${value.toFixed(0)}%`;
  return value.toFixed(2);
};

type CreativeRow = {
  name: string;
  meta: string;
  format: "Video" | "Carousel" | "Static";
  reach: number;
  engrate: number;
  costeng: number;
  watch: number;
  watchLabel: string;
  verdict: string;
  vd: "accent" | "alert";
  thumbClass: string;
  video: boolean;
  carousel: boolean;
};

type CreativeSortKey = "format" | "reach" | "engrate" | "costeng" | "watch";
type SortDirection = "asc" | "desc";

const creativeRows: CreativeRow[] = [
  {
    name: "Customer Success Story",
    meta: "Feed · Mobile · 30s",
    format: "Video",
    reach: 24000,
    engrate: 12.4,
    costeng: 0.38,
    watch: 25,
    watchLabel: "0:25",
    verdict: "Scale ↑",
    vd: "accent",
    thumbClass: "thumb-1",
    video: true,
    carousel: false,
  },
  {
    name: "Interactive Product Quiz",
    meta: "Feed · Mobile · 4 slides",
    format: "Carousel",
    reach: 19000,
    engrate: 9.8,
    costeng: 0.42,
    watch: 0,
    watchLabel: "—",
    verdict: "Scale ↑",
    vd: "accent",
    thumbClass: "thumb-3",
    video: false,
    carousel: true,
  },
  {
    name: "Product Demo — 45s",
    meta: "Feed · Mobile",
    format: "Video",
    reach: 28000,
    engrate: 8.2,
    costeng: 0.42,
    watch: 28,
    watchLabel: "0:28",
    verdict: "Scale ↑",
    vd: "accent",
    thumbClass: "thumb-1",
    video: true,
    carousel: false,
  },
  {
    name: "Static Image — Generic Brand Logo",
    meta: "Feed · Mobile",
    format: "Static",
    reach: 10000,
    engrate: 1.8,
    costeng: 1.89,
    watch: 0,
    watchLabel: "—",
    verdict: "Pause",
    vd: "alert",
    thumbClass: "thumb-6",
    video: false,
    carousel: false,
  },
  {
    name: "Static Image — Product Spec Sheet",
    meta: "Feed · Desktop",
    format: "Static",
    reach: 12000,
    engrate: 1.2,
    costeng: 2.34,
    watch: 0,
    watchLabel: "—",
    verdict: "Pause",
    vd: "alert",
    thumbClass: "thumb-6",
    video: false,
    carousel: false,
  },
];

const EQSSignalRow = ({
  name,
  weight,
  change,
  changeColor,
  barWidth,
  barColor,
  creatives,
  bgColor,
}: {
  name: string;
  weight: string;
  change: string;
  changeColor: string;
  barWidth: string;
  barColor: string;
  creatives: { name: string; detail: string }[];
  bgColor?: string;
}) => {
  const [open, setOpen] = useState(false);
  const isFlatDeclining = barWidth === "0%";
  const isDanger = changeColor === "text-[#e11d48]";

  if (isFlatDeclining) {
    return (
      <div className={`${bgColor ?? "bg-gray-50"} rounded-lg p-2 cursor-pointer`} onClick={() => setOpen(!open)}>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-[2px]">
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] font-semibold text-gray-700">
                {name} <span className="text-[9px] font-normal text-gray-400">{weight}</span>
              </span>
              <button
                className={`text-[9px] font-semibold px-1.5 py-[1px] rounded border-none cursor-pointer font-sans leading-relaxed ${isDanger ? "text-[#e11d48] bg-red-100" : "text-gray-500 bg-gray-100"}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(!open);
                }}
              >
                creatives {open ? "▴" : "▾"}
              </button>
            </div>
            <div className={`text-[10px] mt-0.5 ${isDanger ? "text-red-500" : "text-gray-400"}`}>
              {isDanger
                ? "Hook failing - review first 3s of creatives"
                : name === "Story taps"
                  ? "Stories placement underperforming"
                  : "Low-value signal - no action needed"}
            </div>
          </div>
          <span className={`font-mono text-[12px] font-semibold shrink-0 ml-2 ${changeColor}`}>
            {change}
          </span>
        </div>

        {open && (
          <div
            className="mt-2 px-2.5 py-2 bg-white rounded-lg"
            style={{ borderLeft: `2px solid ${isDanger ? "#E11D48" : "#C8CDD6"}` }}
          >
            {creatives.map((c, i) => (
              <div key={i} className="text-[11px] text-gray-600 leading-snug mb-1 last:mb-0">
                <strong className="text-gray-800 font-semibold">{c.name}</strong> - {c.detail}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={bgColor ? `p-2 px-2.5 rounded-xl ${bgColor}` : ""}>
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-semibold text-gray-800">
            {name} <span className="text-[9px] font-normal text-gray-400">{weight}</span>
          </span>
          <button
            onClick={() => setOpen(!open)}
            className="text-[9px] font-semibold text-[#7652b3] bg-purple-50 border-none rounded px-1.5 py-px cursor-pointer"
          >
            creatives {open ? "▴" : "▾"}
          </button>
        </div>
        <span className={`text-[12px] font-bold font-mono ${changeColor}`}>{change}</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full opacity-70" style={{ width: barWidth, background: barColor }} />
      </div>
      {open && (
        <div className={`mt-2 p-2 px-2.5 bg-gray-50 rounded-xl border-l-2 ${barColor === "#059669" ? "border-green-600" : barColor === "#E11D48" ? "border-red-600" : "border-gray-300"}`}>
          {creatives.map((c, i) => (
            <div key={i} className={`text-[11px] text-gray-700 ${i < creatives.length - 1 ? "mb-1" : ""}`}>
              <strong>{c.name}</strong> — {c.detail}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const EngageSection = ({ data }: { data?: TransformedEngage }) => {
  const chartData = useMemo(() => {
    if (!data?.timeSeries?.length) return engageData;
    return toEngageChartData(data.timeSeries);
  }, [data?.timeSeries]);

  const eqsNumeric = parseEqsFromSummary(data?.summary.eqs);
  const eqsGapToTarget =
    eqsNumeric != null ? (0.4 - eqsNumeric).toFixed(2) : "—";
  const eqsProgressPct =
    eqsNumeric != null ? Math.min(100, Math.round((eqsNumeric / 0.4) * 100)) : 0;

  const peakData = data?.peakEngagement ?? peakEngData;

  const metricCardsConfig: Array<{ key: EngageMetric; label: string; value: string; delta: string }> = [
    { key: "eis", label: "Engagement Impact Score (EIS)", value: data?.summary.eis ?? "4.82", delta: `${data?.summary.eisDelta ?? "↑ 18%"} · quality × scale · OMTM` },
    { key: "eqs", label: "Engagement Quality Score (EQS)", value: data?.summary.eqs ?? "0.34", delta: `${data?.summary.eqsDelta ?? "↑ from 0.26"} · target: 0.40` },
    { key: "cpqe", label: "Cost per Qualified Engagement (CpQE)", value: data?.summary.cpqe ?? "$0.84", delta: `${data?.summary.cpqeDelta ?? "↓ 11%"} · deep signals only` },
    { key: "esr", label: "Engagement Stickiness Rate (ESR)", value: data?.summary.esr ?? "64%", delta: "Content consumption depth" },
  ];

  const [activeMetric, setActiveMetric] = useState<EngageMetric>("eis");
  const [chartMetric, setChartMetric] = useState<EngageMetric>("eis");
  const [chartSwitching, setChartSwitching] = useState(false);
  const [sortKey, setSortKey] = useState<CreativeSortKey>("engrate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [peakChartData, setPeakChartData] = useState(peakEngStyledData);
  const chartSwitchTimerRef = useRef<number | null>(null);
  const peakChartWrapRef = useRef<HTMLDivElement | null>(null);
  const peakChartHasAnimatedRef = useRef(false);
  const peakChartTimersRef = useRef<number[]>([]);
  const activeChart = engageChartByMetric[chartMetric];

  const sortedCreativeRows = useMemo(() => {
    const rows = [...creativeRows];
    rows.sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }
      const left = String(aValue);
      const right = String(bValue);
      return sortDirection === "asc" ? left.localeCompare(right) : right.localeCompare(left);
    });
    return rows;
  }, [sortDirection, sortKey]);

  const handleSort = (key: CreativeSortKey) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDirection("asc");
  };

  const handleMetricChange = (nextMetric: EngageMetric) => {
    if (nextMetric === activeMetric) return;
    setActiveMetric(nextMetric);
    setChartSwitching(true);
    if (chartSwitchTimerRef.current) {
      window.clearTimeout(chartSwitchTimerRef.current);
    }
    chartSwitchTimerRef.current = window.setTimeout(() => {
      setChartMetric(nextMetric);
      setChartSwitching(false);
      chartSwitchTimerRef.current = null;
    }, 180);
  };

  useEffect(() => {
    return () => {
      if (chartSwitchTimerRef.current) {
        window.clearTimeout(chartSwitchTimerRef.current);
      }
      peakChartTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  useEffect(() => {
    const target = peakChartWrapRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || peakChartHasAnimatedRef.current) return;
          peakChartHasAnimatedRef.current = true;
          observer.unobserve(entry.target);

          peakChartTimersRef.current = peakEngData.map((item, index) =>
            window.setTimeout(() => {
              setPeakChartData((prev) =>
                prev.map((row, rowIndex) =>
                  rowIndex === index
                    ? {
                      ...row,
                      eng: item.score,
                    }
                    : row
                )
              );
            }, index * 80)
          );
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <Card>
      <div className="px-7 py-5">
        <h2 className="text-base font-bold tracking-tight">Engage — Awareness Qualifier</h2>
      </div>
      <InsightRibbon>
        Is the attention qualified? Engagement quality and depth determine whether Reach converts to real awareness — <strong>EIS {data?.summary.eisDelta ?? "—"} · EQS {data?.summary.eqs ?? "—"}, gap of {eqsGapToTarget} to target</strong> · Reels driving the lift · <strong>pause statics, scale Reels</strong>
      </InsightRibbon>
      <div className="p-6">
        <div className="mb-4 flex flex-wrap gap-3">
          {metricCardsConfig.map((item, index) => (
            <button
              key={item.key}
              type="button"
              onClick={() => handleMetricChange(item.key)}
              onKeyDown={(e) => {
                if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
                e.preventDefault();
                const targetIndex = e.key === "ArrowRight"
                  ? Math.min(index + 1, metricCardsConfig.length - 1)
                  : Math.max(index - 1, 0);
                handleMetricChange(metricCardsConfig[targetIndex].key);
              }}
              className={`min-w-[120px] flex-1 rounded-xl border-[1.5px] bg-white px-4 py-3 text-left outline-none transition-all duration-200 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${activeMetric === item.key
                ? "border-[#7652B3] bg-[#F8F6FC]"
                : "border-[#E8EAF0] hover:-translate-y-0.5 hover:border-[#C4B5E3] hover:shadow-[0_4px_12px_rgba(118,82,179,0.08)]"}`}
            >
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.05em] text-[#9BA3B0]">
                {item.label}
              </div>
              <div className={`font-mono text-xl font-bold ${activeMetric === item.key ? "text-[#4A2F7A]" : "text-[#242830]"}`}>
                {item.value}
              </div>
              <div className="mt-0.5 text-[10px] font-semibold text-[#6E7787]">{item.delta}</div>
            </button>
          ))}
        </div>

        <div className="mb-2">
          <div className="mb-3 text-sm font-bold text-[#14171D]">{insightByMetric[activeMetric].title}</div>
          <div className="mb-1 text-xs leading-relaxed text-[#4F5664]">{insightByMetric[activeMetric].body}</div>
        </div>

        <div className="mb-3 mt-4 flex flex-wrap items-center gap-4 text-[11px] font-medium text-gray-700" style={{ fontFamily: "DM Sans, sans-serif" }}>
          {activeChart.lines.map((line) => (
            <div key={line.dataKey} className="flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: line.color }} />
              <span>{line.name}</span>
            </div>
          ))}
        </div>

        <div className={`h-[300px] bg-gray-50 rounded-xl p-3 mb-5 transition-opacity duration-[180ms] ease-out ${chartSwitching ? "opacity-[0.15]" : "opacity-100"}`}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid stroke="#DFE2E8" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fontFamily: "DM Sans" }} />
              <YAxis
                yAxisId="y"
                tick={{ fontSize: 10, fontFamily: "DM Sans" }}
                tickFormatter={axisTickFormatter(activeChart.leftAxis)}
              />
              {activeChart.rightAxis ? (
                <YAxis
                  yAxisId="y1"
                  orientation="right"
                  tick={{ fontSize: 10, fontFamily: "DM Sans", fill: "rgba(225,29,72,0.5)" }}
                  tickFormatter={axisTickFormatter(activeChart.rightAxis)}
                  axisLine={false}
                  tickLine={false}
                />
              ) : null}
              <Tooltip content={<CustomTooltip />} />
              {activeChart.lines.map((line) => (
                <Line
                  key={line.dataKey}
                  yAxisId={line.yAxisId}
                  type="monotone"
                  dataKey={line.dataKey}
                  name={line.name}
                  stroke={line.color}
                  strokeWidth={line.strokeWidth ?? 2}
                  strokeDasharray={line.dashed ? "5 3" : undefined}
                  dot={{ r: 4, fill: line.color }}
                  connectNulls={false}
                  isAnimationActive={false}
                />
              ))}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <YourNextMove
          scale={[
            { tag: "Scale", text: <><strong>Reels budget +30%</strong> — video retention up 26%, highest deep signal yield per dollar</> },
            { tag: "Scale", text: <><strong>Interactive carousels</strong> — swipe rate +15%, drives saves + shares · expand Product Quiz to Reels</> },
          ]}
          fix={[
            { tag: "Pause", text: <><strong>Both static image ads</strong> — CpQE 3–4× higher than video · reallocate $3,640 to Reels</> },
            { tag: "Rework", text: <><strong>First 3s hooks on static ads</strong> — 3s views ↓4%, Spec Sheet at 18% 3s rate · no motion = no hook</> },
          ]}
          watch={[
            { tag: "Track", text: <><strong>EQS vs 0.40 target</strong> — at 0.34 now, deep signal share needs to reach 45%+ · Reels shift closes it fastest</> },
            { tag: "Track", text: <><strong>Story taps + dayparting overlap</strong> — Stories underperforming (→1%), enable Thu–Sun 6pm–12am before cutting placement</> },
          ]}
          impact="EQS 0.34 → 0.40+ in 2–3 weeks"
        />

        {/* EQS Signal Breakdown */}
        <h3 className="text-sm font-bold mt-4">EQS Signal Breakdown</h3>
        <p className="text-[12px] text-gray-500 mb-3.5">Which signals are driving quality — and where to focus next.</p>

        <div className="grid grid-cols-3 gap-3 mt-3.5">
          {/* Column 1: Score */}
          <div className="bg-white border border-gray-200 rounded-2xl p-[1.125rem]">
            <div className="text-[9px] font-bold uppercase tracking-[0.08em] text-gray-400 mb-2">EQS Score</div>
            <div className="flex items-baseline gap-2 mb-0.5">
              <span className="font-mono text-[32px] font-extrabold text-purple-900">{data?.summary.eqs ?? "0.34"}</span>
              <span className="text-[12px] font-semibold text-green-600">{data?.summary.eqsDelta ?? "↑ from 0.26"}</span>
            </div>
            <div className="text-[11px] text-gray-400 mb-4">Target: <strong className="text-gray-700">0.40</strong> — gap of {eqsGapToTarget}</div>
            <div className="text-[9px] font-semibold uppercase tracking-[0.07em] text-gray-400 mb-1.5">Progress to target</div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-1.5">
              <div className="h-full rounded-full" style={{ width: `${eqsProgressPct}%`, background: "linear-gradient(90deg, #7652B3, #4A2F7A)" }} />
            </div>
            <div className="flex justify-between text-[9px] text-gray-400 mb-4">
              <span>0</span><span className="text-[#7652b3] font-semibold">{data?.summary.eqs ?? "0.34"} now</span><span>0.40 target</span>
            </div>
            <div className="text-[9px] font-semibold uppercase tracking-[0.07em] text-gray-400 mb-1.5">Signal mix</div>
            <div className="h-[22px] flex rounded-md overflow-hidden">
              <div className="flex items-center justify-center" style={{ width: "34%", background: "linear-gradient(90deg, #7652B3, #4A2F7A)" }}>
                <span className="text-[9px] font-bold text-white">Deep 34%</span>
              </div>
              <div className="flex-1 bg-gray-100 flex items-center justify-center">
                <span className="text-[9px] font-semibold text-gray-400">Shallow 66%</span>
              </div>
            </div>
            <div className="text-[11px] text-gray-500 mt-2">Grow deep share to 45%+ to reach 0.40 target</div>
          </div>

          {/* Column 2: Growing signals */}
          <div className="bg-white border border-gray-200 rounded-2xl p-[1.125rem]">
            <div className="text-[9px] font-bold uppercase tracking-[0.08em] text-gray-400 mb-3.5">
              Signals Growing <span className="text-green-600">↑ Scale these</span>
            </div>
            <div className="flex flex-col gap-3">
              <EQSSignalRow name="Saves" weight="×5 weight" change="+34%" changeColor="text-green-600" barWidth="90%" barColor="#059669" creatives={[{ name: "Customer Success Story", detail: "1,420 saves · 6.1% rate" }, { name: "Product Demo 45s", detail: "980 saves · 3.5% rate" }]} />
              <EQSSignalRow name="Video >75%" weight="×3 weight" change="+26%" changeColor="text-green-600" barWidth="68%" barColor="#059669" creatives={[{ name: "Customer Success Story 30s", detail: "82% avg depth" }, { name: "Brand Story Reel", detail: "78% avg depth · Feed Mobile" }]} />
              <EQSSignalRow name="Shares" weight="×5 weight" change="+22%" changeColor="text-green-600" barWidth="58%" barColor="#059669" creatives={[{ name: "Sarah's Transformation Story", detail: "1,420 shares · 6.1% rate" }, { name: "Interactive Product Quiz", detail: "820 shares · 4.3% rate" }]} />
              <EQSSignalRow name="Comments" weight="×3 weight" change="+18%" changeColor="text-green-600" barWidth="47%" barColor="#059669" creatives={[{ name: "Customer Success Story", detail: "2,100 comments · 8.8% rate" }, { name: "Interactive Product Quiz", detail: "1,340 comments · 7.1% rate" }]} />
            </div>
          </div>

          {/* Column 3: Flat/declining */}
          <div className="bg-white border border-gray-200 rounded-2xl p-[1.125rem]">
            <div className="text-[9px] font-bold uppercase tracking-[0.08em] text-gray-400 mb-3">
              Flat / Declining <span className="text-[#e11d48]">↓ Deprioritise</span>
            </div>
            <div className="flex flex-col gap-2">
              <EQSSignalRow name="Likes" weight="×1 weight" change="→ 2%" changeColor="text-gray-400" barWidth="0%" barColor="#9BA3B0" bgColor="bg-gray-50" creatives={[{ name: "Static Image — Brand Logo", detail: "4,200 likes · 7.5% rate" }, { name: "Customer Success Story", detail: "3,800 likes · 6.8% rate" }]} />
              <EQSSignalRow name="3s views" weight="×1 weight" change="↓ 4%" changeColor="text-[#e11d48]" barWidth="0%" barColor="#E11D48" bgColor="bg-red-50" creatives={[{ name: "Static Image — Spec Sheet", detail: "3s rate 18% · hook too slow" }, { name: "Static Image — Brand Logo", detail: "3s rate 22% · no motion hook" }]} />
              <EQSSignalRow name="Story taps" weight="×1 weight" change="→ 1%" changeColor="text-gray-400" barWidth="0%" barColor="#9BA3B0" bgColor="bg-gray-50" creatives={[{ name: "Static Image — Brand Logo", detail: "0.8% tap rate · Stories" }, { name: "Static Image — Spec Sheet", detail: "0.6% tap rate · Stories" }]} />
            </div>
          </div>
        </div>

        {/* Creative Performance Table */}
        <h3 className="text-sm font-bold mt-5">Creative Performance by Format</h3>
        <p className="text-[12px] text-gray-500 mb-3">Which assets generate deep engagement? Sorted by engagement rate.</p>

        <div className="max-h-[340px] overflow-y-auto rounded-xl border border-[#F0F1F4] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#DFE2E8] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-[#FAFBFC] [&::-webkit-scrollbar]:w-1.5">
          <table className="w-full border-collapse text-[13px]">
            <thead className="sticky top-0 z-[2] bg-[#FAFBFC]">
              <tr>
                <th className="whitespace-nowrap border-b-2 border-[#E8EAF0] px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-[#9BA3B0]">Creative</th>
                {[
                  { key: "format", label: "Format" },
                  { key: "reach", label: "Reach" },
                  { key: "engrate", label: "Eng. Rate" },
                  { key: "costeng", label: "CpQE" },
                  { key: "watch", label: "Avg. Watch" },
                ].map((header) => {
                  const isActive = sortKey === header.key;
                  const icon = !isActive ? "\u21C5" : sortDirection === "asc" ? "\u2191" : "\u2193";
                  return (
                    <th
                      key={header.key}
                      onClick={() => handleSort(header.key as CreativeSortKey)}
                      className={`cursor-pointer whitespace-nowrap border-b-2 border-[#E8EAF0] px-3 py-2.5 text-right text-[10px] font-bold uppercase tracking-[0.06em] transition-colors ${isActive ? "text-[#7652B3]" : "text-[#9BA3B0] hover:text-[#7652B3]"}`}
                    >
                      {header.label}
                      <span className={`ml-1 text-[10px] ${isActive ? "opacity-70 text-[#7652B3]" : "opacity-30 text-[#9BA3B0]"}`}>{icon}</span>
                    </th>
                  );
                })}
                <th className="whitespace-nowrap border-b-2 border-[#E8EAF0] px-3 py-2.5 text-right text-[10px] font-bold uppercase tracking-[0.06em] text-[#9BA3B0]">Verdict</th>
              </tr>
            </thead>
            <tbody>
              {sortedCreativeRows.map((r) => (
                <tr key={r.name} className="border-b border-[#F0F1F4] last:border-b-0 hover:bg-[#FAFBFC]">
                  <td className="px-3 py-[11px]">
                    <div className="creative-row">
                      <div className={`thumb ${r.thumbClass} ${r.video ? "video" : ""} ${r.carousel ? "carousel" : ""}`} />
                      <div>
                        <div className="text-[13px] font-semibold leading-snug text-[#14171D]">{r.name}</div>
                        <div className="text-[11px] text-[#9BA3B0]">{r.meta}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-[11px] text-right">
                    <Pill variant={r.format === "Static" ? "alert" : "accent"}>{r.format}</Pill>
                  </td>
                  <td className="px-3 py-[11px] text-right font-mono">{`${Math.round(r.reach / 1000)}K`}</td>
                  <td className="px-3 py-[11px] text-right">
                    <Pill variant={r.vd}>{`${r.engrate.toFixed(1)}%`}</Pill>
                  </td>
                  <td className={`px-3 py-[11px] text-right font-mono ${r.vd === "alert" ? "text-[#E11D48]" : "text-[#14171D]"}`}>
                    {`$${r.costeng.toFixed(2)}`}
                  </td>
                  <td className={`px-3 py-[11px] text-right font-mono ${r.watch === 0 ? "text-[#9BA3B0]" : "text-[#14171D]"}`}>
                    {r.watchLabel}
                  </td>
                  <td className="px-3 py-[11px] text-right">
                    <Pill variant={r.vd}>{r.verdict}</Pill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Peak engagement chart */}
        <div className="mt-5 rounded-2xl border border-[#E8EAF0] bg-white px-7 py-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <h3 className="mb-1 text-[14px] font-bold text-[#14171D]">Peak Engagement Windows — Thu – Sun 6pm – 12am</h3>
          <p className="mb-4 text-[12px] text-[#6E7787]">73% of conversions happen in this window at 22% lower CpC.</p>
          <div ref={peakChartWrapRef} className="relative h-[200px] rounded-xl bg-gray-50 p-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={peakChartData} barCategoryGap="20%">
                <CartesianGrid stroke="#DFE2E8" vertical={false} />
                <XAxis
                  dataKey="window"
                  tick={{ fontSize: 11, fontFamily: "DM Sans" }}
                />
                <YAxis
                  domain={[0, 10]}
                  ticks={[0, 2, 4, 6, 8, 10]}
                  tick={{ fontSize: 10, fontFamily: "DM Sans" }}
                />
                <Tooltip cursor={false} content={<PeakEngTooltip />} />
                <Bar
                  dataKey="eng"
                  name="Eng. Rate (%)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={44}
                  animationDuration={700}
                  animationEasing="ease-out"
                >
                  {peakChartData.map((entry, index) => (
                    <Cell key={`peak-bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <style jsx global>{`
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
      `}</style>
    </Card>
  );
};
