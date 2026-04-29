// ─── ACT-STATS DATA LAYER ────────────────────────────────────
// Re-exports shared items from reach-stats, defines act-specific data

export { P, CAMPAIGNS, PERIOD_OPTIONS, fmt, fmtPct, fmtMoney, fmtSpend } from "@/lib/reach-stats/data";
export type { Campaign, PeriodOption } from "@/lib/reach-stats/data";

// ─── ACT TOTALS ───────────────────────────────────────────────

export const ACT_TOTALS = {
  // OMTM: AIS (Action Impact Score) — 40% card
  ais: 8.0,
  aisPrior: 7.0,
  aisTarget: 10.0, // → StatusLineIndicator @ 80%

  // KPI: CpQV (Cost per Qualified Visit) — 20% card
  cpqv: 3.14,
  cpqvPrior: 3.30,
  cpqvTarget: 3.00, // lower is better → TargetStatusIndicator

  // KPI: AQS (Action Quality Score) — 20% card
  aqs: 70,
  aqsPrior: 67,
  aqsTarget: 75, // → CircleFillIndicator @ 93%

  // KPI: ACR (Action Completion Rate) — 20% card
  acr: 0.51,
  acrPrior: 0.46,
  acrTarget: 0.60, // → ArcColorIndicator @ 51
};

// ─── ACT CHANNEL INTERFACE ────────────────────────────────────

export interface ActChannel {
  id: string;
  name: string;
  icon: string;
  color: string;
  actionValue: number;
  acpa: number;        // Action Cost per Acquisition ($)
  ais: number;         // Action Impact Score (0–10)
  aqs: number;         // Action Quality Score (0–100)
  acr: number;         // Action Completion Rate (0–1)
  actionSignal: string;
  recommendedMove: string;
  volume: number;      // Bubble size in scatter chart
}

// ─── ACT CHANNELS (12) ───────────────────────────────────────

export const ACT_CHANNELS: ActChannel[] = [
  { id: "organic-search",  name: "Organic Search", icon: "search",    color: "#6C3FC7", actionValue: 18200, acpa: 6,  ais: 7.4, aqs: 82, acr: 0.72, actionSignal: "High Intent Leader",       recommendedMove: "Scale",    volume: 2200 },
  { id: "email",           name: "Email",           icon: "mail",      color: "#7C5CFC", actionValue: 12600, acpa: 32, ais: 4.8, aqs: 68, acr: 0.58, actionSignal: "Efficient but capped",    recommendedMove: "Expand",   volume: 394  },
  { id: "linkedin-ads",    name: "LinkedIn Ads",    icon: "linkedin",  color: "#9B7DFC", actionValue: 8400,  acpa: 38, ais: 5.1, aqs: 74, acr: 0.26, actionSignal: "High quality actions",    recommendedMove: "Scale",    volume: 221  },
  { id: "google-ppc",      name: "Google PPC",      icon: "G",         color: "#3B82F6", actionValue: 6900,  acpa: 42, ais: 5.9, aqs: 71, acr: 0.45, actionSignal: "Balanced performance",    recommendedMove: "Maintain", volume: 164  },
  { id: "youtube-ads",     name: "YouTube Ads",     icon: "youtube",   color: "#E74C3C", actionValue: 4100,  acpa: 48, ais: 3.2, aqs: 44, acr: 0.18, actionSignal: "High spend, low yield",   recommendedMove: "Fix",      volume: 185  },
  { id: "hubspot-forms",   name: "HubSpot Forms",   icon: "H",         color: "#B8A4FC", actionValue: 3850,  acpa: 28, ais: 4.2, aqs: 61, acr: 0.35, actionSignal: "Volume heavy",            recommendedMove: "Optimize", volume: 138  },
  { id: "tiktok",          name: "TikTok",          icon: "TT",        color: "#52526B", actionValue: 2900,  acpa: 19, ais: 3.5, aqs: 38, acr: 0.22, actionSignal: "Low action depth",        recommendedMove: "Fix",      volume: 153  },
  { id: "pinterest-ads",   name: "Pinterest Ads",   icon: "P",         color: "#C0392B", actionValue: 2400,  acpa: 46, ais: 4.5, aqs: 59, acr: 0.28, actionSignal: "Niche but costly",        recommendedMove: "Optimize", volume: 88   },
  { id: "gdn-display",     name: "GDN Display",     icon: "□",         color: "#E67E22", actionValue: 2100,  acpa: 35, ais: 2.8, aqs: 31, acr: 0.12, actionSignal: "Awareness only",          recommendedMove: "Fix",      volume: 310  },
  { id: "instagram-ads",   name: "Instagram Ads",   icon: "instagram", color: "#D4C8FD", actionValue: 3200,  acpa: 31, ais: 3.9, aqs: 52, acr: 0.21, actionSignal: "Weak intent signals",     recommendedMove: "Fix",      volume: 103  },
  { id: "twitter-ads",     name: "X / Twitter Ads", icon: "twitter",   color: "#1A1A2E", actionValue: 1800,  acpa: 44, ais: 3.8, aqs: 48, acr: 0.19, actionSignal: "Declining engagement",    recommendedMove: "Fix",      volume: 95   },
  { id: "microsoft-ads",   name: "Microsoft Ads",   icon: "Ms",        color: "#2980B9", actionValue: 3600,  acpa: 50, ais: 5.4, aqs: 66, acr: 0.38, actionSignal: "Undervalued potential",   recommendedMove: "Maintain", volume: 110  },
];

// ─── SIGNAL / MOVE STYLING HELPERS ───────────────────────────

export const getSignalStyle = (signal: string): { bg: string; text: string } => {
  if (signal.includes("Intent Leader") || signal.includes("quality")) return { bg: "#EDE8FF", text: "#4A2D8A" };
  if (signal.includes("Balanced") || signal.includes("potential")) return { bg: "#EDE8FF", text: "#6C3FC7" };
  if (signal.includes("Efficient") || signal.includes("performance")) return { bg: "#F7F7FA", text: "#52526B" };
  if (signal.includes("Niche") || signal.includes("Volume") || signal.includes("costly") || signal.includes("heavy")) return { bg: "#FEF3C7", text: "#92400E" };
  return { bg: "#FEE2E2", text: "#991B1B" };
};

export const getMoveStyle = (move: string): { bg: string; text: string } => {
  const styles: Record<string, { bg: string; text: string }> = {
    Scale:    { bg: "#EDE8FF", text: "#4A2D8A" },
    Expand:   { bg: "#DBEAFE", text: "#1D4ED8" },
    Maintain: { bg: "#DCFCE7", text: "#15803D" },
    Optimize: { bg: "#FEF3C7", text: "#92400E" },
    Fix:      { bg: "#FEE2E2", text: "#991B1B" },
  };
  return styles[move] ?? styles.Fix;
};
