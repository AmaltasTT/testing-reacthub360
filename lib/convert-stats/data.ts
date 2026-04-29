// ─── CONVERT-STATS DATA LAYER ─────────────────────────────────
// Re-exports shared items from reach-stats; convert-specific mock totals

export { P, CAMPAIGNS, PERIOD_OPTIONS, fmt, fmtPct, fmtMoney, fmtSpend } from "@/lib/reach-stats/data";
export type { Campaign, PeriodOption } from "@/lib/reach-stats/data";

export const CONVERT_TOTALS = {
  cvr: 12.5,
  cvrPrior: 10.2,
  cvrTarget: 10,
  revenueK: 847,
  revenuePriorK: 725,
  revenueTargetK: 800,
  cpcon: 1.5,
  cpconPrior: 2.0,
  cpconTarget: 1.0,
  aov: 120,
  aovPrior: 110,
  aovTarget: 110,
};

export interface ConvertChannelRow {
  name: string;
  cvr: number;
  conversions: number;
  color: string;
}

export const CONVERT_CHANNEL_METRICS: ConvertChannelRow[] = [
  { name: "Email", cvr: 5.8, conversions: 898, color: "#7C5CFC" },
  { name: "Google PPC", cvr: 4.8, conversions: 828, color: "#4285F4" },
  { name: "Facebook Ads", cvr: 2.8, conversions: 498, color: "#1877F2" },
  { name: "LinkedIn", cvr: 3.6, conversions: 328, color: "#0A66C2" },
  { name: "Instagram Ads", cvr: 2.4, conversions: 328, color: "#E4405F" },
];
