"use client";
import React, { useMemo, useState } from "react";
import {
  ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceArea, ReferenceLine,
} from "recharts";
import { type Channel, fmt, fmtPct, fmtMoney } from "@/lib/reach-stats/data";
import type { TransformedReach } from "@/lib/reach-stats/channel-transforms";
import { Card } from "./shared/Card";
import { InsightRibbon } from "./shared/InsightRibbon";
import { MetricCard } from "./shared/MetricCard";
import { DynamicInsightPanel } from "./shared/DynamicInsightPanel";
import { CustomTooltip } from "./shared/CustomTooltip";
import { YourNextMove } from "./shared/YourNextMove";
import { PlacementTable } from "./PlacementTable";

const ACCENT = "#7652B3";
const ACCENT_MUTED = "#C4B5E3";
const DANGER = "#E11D48";
const TARGET_APR = 15;
const HIGH_FREQUENCY_THRESHOLD = 3;

type ReachMetric = "reach" | "qrr" | "frequency" | "cpqr";
type ReachDataPoint = {
  date: string;
  qualifiedReach: number;
  reach: number;
  cpqr: number;
  frequency: number;
  qrr: number;
};
type AxisKind = "number" | "currency" | "percent" | "times";
type LineDef = {
  dataKey: Exclude<keyof ReachDataPoint, "date">;
  name: string;
  color: string;
  yAxisId: "y" | "y1";
  strokeWidth?: number;
  dashed?: boolean;
};

type RecommendationItem = { text: string; priority: number };
type MetricLike = number | string | { value?: number | null; formatted?: string } | null | undefined;

const chartByMetric: Record<ReachMetric, {
  leftAxis: AxisKind;
  rightAxis?: AxisKind;
  lines: LineDef[];
  showThreshold: boolean;
}> = {
  reach: {
    leftAxis: "number",
    rightAxis: "currency",
    showThreshold: true,
    lines: [
      { dataKey: "qualifiedReach", name: "Qualified Reach (K)", color: ACCENT, yAxisId: "y", strokeWidth: 2.5 },
      { dataKey: "reach", name: "Total Reach (K)", color: ACCENT_MUTED, yAxisId: "y", strokeWidth: 2 },
      { dataKey: "cpqr", name: "CpQR ($)", color: DANGER, yAxisId: "y1", strokeWidth: 2, dashed: true },
    ],
  },
  qrr: {
    leftAxis: "percent",
    rightAxis: "number",
    showThreshold: false,
    lines: [
      { dataKey: "qrr", name: "QRR (%)", color: ACCENT, yAxisId: "y", strokeWidth: 2.5 },
      { dataKey: "qualifiedReach", name: "Qualified Reach (K)", color: ACCENT_MUTED, yAxisId: "y1", strokeWidth: 2 },
    ],
  },
  frequency: {
    leftAxis: "times",
    rightAxis: "currency",
    showThreshold: true,
    lines: [
      { dataKey: "frequency", name: "Frequency (x)", color: ACCENT, yAxisId: "y", strokeWidth: 2.5 },
      { dataKey: "cpqr", name: "CpQR ($)", color: DANGER, yAxisId: "y1", strokeWidth: 2, dashed: true },
    ],
  },
  cpqr: {
    leftAxis: "currency",
    rightAxis: "times",
    showThreshold: false,
    lines: [
      { dataKey: "cpqr", name: "CpQR ($)", color: DANGER, yAxisId: "y", strokeWidth: 2.5 },
      { dataKey: "frequency", name: "Frequency (x)", color: ACCENT_MUTED, yAxisId: "y1", strokeWidth: 2 },
    ],
  },
};

const axisTickFormatter = (kind: AxisKind) => (value: number | null | undefined) => {
  if (value == null) return "";
  if (kind === "currency") return `$${value.toFixed(0)}`;
  if (kind === "percent") return `${value.toFixed(0)}%`;
  if (kind === "times") return `${value.toFixed(1)}x`;
  return value >= 1000 ? `${(value / 1000).toFixed(0)}K` : `${value}`;
};

const ensureCurrency = (value: string): string => {
  const clean = value.trim();
  if (!clean) return "$0";
  if (clean.startsWith("$")) return clean;
  if (clean === "-" || clean.toLowerCase() === "n/a") return clean;
  const numeric = Number(clean.replace(/,/g, ""));
  if (Number.isFinite(numeric)) return `$${clean}`;
  return clean;
};

const parsePercentFromString = (value: string): number | null => {
  const parsed = Number(value.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
};

const normalizePercentNumber = (value: number | null): number | null => {
  if (value == null || !Number.isFinite(value)) return null;
  if (value >= 0 && value <= 1) return value * 100;
  return value;
};

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

const compactNumber = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
};

const formatPct = (value: number): string => {
  return `${value.toFixed(1).replace(/\.0$/, "")}%`;
};

const metricValue = (metric: MetricLike): number | null => {
  if (typeof metric === "number") return Number.isFinite(metric) ? metric : null;
  if (typeof metric === "string") {
    const parsed = Number(metric.replace(/[^0-9.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : null;
  }
  if (metric && typeof metric === "object" && typeof metric.value === "number") {
    return Number.isFinite(metric.value) ? metric.value : null;
  }
  return null;
};

const deriveTag = (text: string, fallback: string): string => {
  const firstWord = text.split(/\s+/)[0]?.replace(/[^A-Za-z]/g, "");
  if (!firstWord) return fallback;
  return firstWord.slice(0, 8) || fallback;
};

const buildFallbackInsights = (channelQR: string, channelReach: string, channelQRR: string, channelCpQR: string) => [
  {
    key: "reach",
    title: "Qualified Reach vs Total Reach",
    body: `${channelQR} qualified reach out of ${channelReach} total reach. Focus on improving qualified share while preserving delivery volume.`,
  },
  {
    key: "qrr",
    title: "Qualification Rate (QRR)",
    body: `Current QRR is ${channelQRR}. Prioritize placements and creatives that consistently lift qualification quality.`,
  },
  {
    key: "frequency",
    title: "Frequency vs Efficiency",
    body: "Monitor frequency concentration closely. If exposure keeps clustering, rotate audiences and redistribute spend before efficiency drops.",
  },
  {
    key: "cpqr",
    title: "Cost per Qualified Reach (CpQR)",
    body: `Current CpQR is ${channelCpQR}. Optimize toward lower CpQR by reducing overexposed inventory and scaling efficient segments.`,
  },
];

export const ReachSection = ({ channel, data }: { channel: Channel | null; data?: TransformedReach }) => {
  const [metric, setMetric] = useState<ReachMetric>("reach");

  const channelQR = data?.summary.qualifiedReach ?? (channel ? fmt(channel.qr) : "0");
  const channelReach = data?.summary.totalReach ?? (channel ? fmt(channel.reach) : "0");
  const channelQRR = data?.summary.qrr ?? (channel ? fmtPct(channel.qrr ?? 0) : "0%");
  const channelCpQR = ensureCurrency(data?.summary.cpqr ?? (channel ? fmtMoney(channel.cpqr ?? 0) : "$0"));
  const channelAPR = data?.summary.apr ?? (channel ? fmtPct(channel.penetration) : "0%");

  const aprPercent = normalizePercentNumber(data?.summary.aprValue ?? null)
    ?? parsePercentFromString(channelAPR)
    ?? 0;
  const totalReachValue = data?.summary.totalReachValue ?? null;
  const derivedAddressable = aprPercent > 0 && totalReachValue != null
    ? totalReachValue / (aprPercent / 100)
    : null;
  const headroomPercent = clamp(100 - aprPercent, 0, 100);
  const saturationPercent = clamp(aprPercent, 0, 100);

  const chartData = data?.timeSeries ?? [];
  const activeInsights = data?.insights?.length
    ? data.insights
    : buildFallbackInsights(channelQR, channelReach, channelQRR, channelCpQR);

  const thresholdIndex = chartData.findIndex((item: any) => (item.frequency ?? 0) >= HIGH_FREQUENCY_THRESHOLD);
  const thresholdDate = thresholdIndex >= 0 ? (chartData[thresholdIndex] as any)?.date : undefined;
  const activeChart = chartByMetric[metric];

  const highFrequencyImpressionPct = useMemo(() => {
    const placements = data?.placements ?? [];
    if (!placements.length) return null;

    let total = 0;
    let high = 0;

    for (const placement of placements) {
      const impressions = metricValue((placement as any).impressions);
      const frequency = metricValue((placement as any).frequency);
      if (impressions == null || impressions <= 0 || frequency == null) continue;
      total += impressions;
      if (frequency >= HIGH_FREQUENCY_THRESHOLD) high += impressions;
    }

    if (total <= 0) return null;
    return (high / total) * 100;
  }, [data?.placements]);

  const cpqrDeltaLabel = data?.summary.cpqrDelta ?? "n/a";

  const frequencyLine = data?.summary.frequency ?? "n/a";
  const addressableLabel = derivedAddressable != null ? compactNumber(derivedAddressable) : "n/a";

  const recommendationScale = data?.recommendations?.scale ?? [];
  const recommendationFix = data?.recommendations?.fix ?? [];
  const recommendationWatch = data?.recommendations?.watch ?? [];

  const toMoveItems = (items: RecommendationItem[], fallbackTag: string) =>
    items.slice(0, 2).map((item) => ({
      tag: deriveTag(item.text, fallbackTag),
      text: item.text,
    }));

  const scaleMoves = toMoveItems(recommendationScale, "Do");
  const fixMoves = toMoveItems(recommendationFix, "Fix");
  const watchMoves = toMoveItems(recommendationWatch, "Track");
  const hasRecommendations = scaleMoves.length > 0 || fixMoves.length > 0 || watchMoves.length > 0;

  const aprActionText = recommendationScale[0]?.text ?? "No reach recommendation available for the selected date range.";
  const saturationActionText = recommendationFix[0]?.text ?? "No optimization recommendation available for the selected date range.";

  return (
    <Card>
      <div className="px-7 py-5">
        <h2 className="text-base font-bold tracking-tight">Reach - Qualified Attention</h2>
      </div>
      <InsightRibbon>
        <strong>{channelQR} qualified reach</strong> of {addressableLabel} addressable - {channelAPR} penetration - {channelQRR} QRR - CpQR delta {cpqrDeltaLabel} as frequency reaches {frequencyLine}, audience has {formatPct(headroomPercent)} headroom - <strong>optimize placements</strong>
      </InsightRibbon>
      <div className="p-6">
        <div className="flex gap-3 flex-wrap mb-4">
          <MetricCard
            label="Qualified Reach"
            value={channelQR}
            delta={
              <>
                of {channelReach} total
                {data?.summary.totalReachDelta ? ` - ${data.summary.totalReachDelta}` : ""}
              </>
            }
            selected={metric === "reach"}
            onClick={() => setMetric("reach")}
            formula="Qualified Reach = Unique users with engagement signal"
            formulaDesc="QRR = QR / Total Reach * 100"
          />
          <MetricCard
            label="Qualification Rate (QRR)"
            value={channelQRR}
            delta={data?.summary.qrrDelta ?? "No prior comparison"}
            selected={metric === "qrr"}
            onClick={() => setMetric("qrr")}
            formula="QRR = Qualified Reach / Total Reach * 100"
            formulaDesc="Percent of reached users with an engagement signal."
          />
          <MetricCard
            label="Frequency - CPM"
            value={data?.summary.frequency ?? "0x"}
            delta={
              <>
                {data?.summary.cpm ?? "n/a"} CPM
                {highFrequencyImpressionPct != null ? ` - ${formatPct(highFrequencyImpressionPct)} high-frequency impressions` : ""}
              </>
            }
            selected={metric === "frequency"}
            onClick={() => setMetric("frequency")}
            formula="Frequency = Impressions / Reach"
            formulaDesc="Average times each person saw the ad. Higher values can indicate fatigue."
          />
          <MetricCard
            label="Cost per Qual. Reach (CpQR)"
            value={channelCpQR}
            delta={data?.summary.cpqrDelta ?? "No prior comparison"}
            selected={metric === "cpqr"}
            onClick={() => setMetric("cpqr")}
            formula="CpQR = Ad Spend / Qualified Reach"
            formulaDesc="Cost to reach one attention-verified user."
          />
        </div>

        <DynamicInsightPanel items={activeInsights} activeKey={metric} />

        <div className="mb-3 mt-4 flex flex-wrap items-center gap-4 text-[11px] font-medium text-gray-700" style={{ fontFamily: "DM Sans, sans-serif" }}>
          {activeChart.lines.map((line) => (
            <div key={line.dataKey} className="flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: line.color }} />
              <span>{line.name}</span>
            </div>
          ))}
        </div>

        <div className="h-[300px] bg-gray-50 rounded-xl p-3 mb-5">
          {chartData.length === 0 ? (
            <div className="h-full grid place-items-center text-xs font-medium text-gray-400">
              No trend data for selected range
            </div>
          ) : (
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

                {activeChart.showThreshold && thresholdDate ? (
                  <>
                    <ReferenceArea
                      x1={thresholdDate}
                      x2={(chartData[chartData.length - 1] as any)?.date}
                      yAxisId="y"
                      fill="rgba(225, 29, 72, 0.035)"
                      ifOverflow="extendDomain"
                    />
                    <ReferenceLine
                      x={thresholdDate}
                      stroke="rgba(225, 29, 72, 0.12)"
                      strokeDasharray="4 4"
                      label={{ value: "HIGH FREQUENCY ZONE", position: "insideTop", fill: "rgba(225, 29, 72, 0.3)", fontSize: 8, fontWeight: 700 }}
                    />
                  </>
                ) : null}

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
                  />
                ))}
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>

        {hasRecommendations ? (
          <YourNextMove
            scale={scaleMoves}
            fix={fixMoves}
            watch={watchMoves}
          />
        ) : (
          <div className="mb-5 border border-gray-200 rounded-2xl overflow-hidden bg-white">
            <div className="px-5 py-3.5 border-b border-gray-200 bg-gray-50/80">
              <div className="text-[11px] font-bold tracking-[0.1em] uppercase text-gray-700">Your Next Move</div>
            </div>
            <div className="px-5 py-5 text-[12px] text-gray-500">
              Recommendations are not available for this channel and date range yet. Try a wider date range or check data ingestion.
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-0 bg-white border border-gray-200 rounded-t-2xl overflow-hidden mt-5">
          <div className="p-5 border-r border-gray-200">
            <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-gray-400 mb-3.5">
              Audience Penetration Rate
            </div>
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-[12px] font-semibold text-gray-700">
                APR <span className="font-mono text-base text-purple-900">{channelAPR}</span>
              </span>
              <span className="text-[10px] text-gray-500">
                Target <strong className="text-gray-700">{TARGET_APR}%</strong> - {addressableLabel} addressable
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden relative">
              <div className="h-full rounded-full" style={{ width: `${saturationPercent}%`, background: "linear-gradient(90deg, #C4B5E3, #4A2F7A)" }} />
              <div className="absolute top-0 w-[1.5px] h-full bg-red-400/40" style={{ left: `${TARGET_APR}%` }} />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[8px] text-gray-300">0</span>
              <span className="text-[8px] text-[#7652b3] font-semibold">{formatPct(saturationPercent)} now</span>
              <span className="text-[8px] text-gray-400">{TARGET_APR}% target</span>
            </div>
            <div className="text-[9px] text-gray-500 mt-2.5">
              <strong className="text-gray-700">Action:</strong> {aprActionText}
            </div>
          </div>

          <div className="p-5">
            <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-gray-400 mb-3.5">
              Audience Saturation
            </div>
            <div className="flex items-baseline gap-2.5 mb-1.5">
              <span className="font-mono text-[28px] font-bold text-gray-900">{formatPct(saturationPercent)}</span>
              <span className="text-[12px] font-semibold text-green-600">{formatPct(headroomPercent)} headroom remaining</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-1.5">
              <div className="h-full rounded-full" style={{ width: `${saturationPercent}%`, background: "linear-gradient(90deg, #059669, #34D399)" }} />
            </div>
            <div className="flex justify-between">
              <span className="text-[8px] text-gray-300">0</span>
              <span className="text-[8px] text-green-600 font-semibold">{formatPct(saturationPercent)} saturated</span>
              <span className="text-[8px] text-gray-400">100%</span>
            </div>
            <div className="text-[9px] text-gray-500 mt-2.5">
              {saturationActionText}
            </div>
          </div>
        </div>

        <PlacementTable data={data?.placements} />
      </div>
    </Card>
  );
};
