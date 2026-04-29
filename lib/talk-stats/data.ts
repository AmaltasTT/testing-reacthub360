export { P, CAMPAIGNS, PERIOD_OPTIONS, fmt, fmtPct, fmtMoney, fmtSpend } from "@/lib/reach-stats/data";

export interface TalkKpiDatum {
  label: string;
  shortLabel: string;
  value: string;
  delta: string;
  status: string;
  statusVsTarget: string;
  targetValue: string | null;
  trend: "up" | "down" | "down-good";
  badge: string;
  badgeColor: string;
  statusType: "progress" | "target" | "gauge";
  trendData: Array<{ value: number }>;
  forecastLabel: string;
  forecastValue: string;
  scaleLabel: string;
  insight: string;
  benchmark: string;
}

export interface AgentAction {
  title: string;
  description: string;
  arrImpact: string;
  deadline: string;
  type: "FIX" | "SCALE";
}

export interface RetentionChannelDatum {
  channel: string;
  crr: number;
  clv: number;
  cprc: number;
  cac: number;
  aar: number;
  churned: number;
  repeatRate: number;
  signal: "SCALE" | "WATCH" | "FIX";
  move: "Scale" | "Watch" | "Fix" | "Pause";
  bestSegment: string;
}

export interface ClvTier {
  name: string;
  percentage: number;
  color: string;
  clv: number;
  customers: number;
  arr: number;
  trend: string;
  microAction: string;
}

export interface ClvScaleDriver {
  lever: string;
  impact: string;
  current: string;
  benchmark: string;
}

export interface ClvFixLeak {
  leak: string;
  accounts: number;
  valueLeaking: number;
}

export interface LifecycleStage {
  name: string;
  usage: string;
  count: number;
  percentage: number;
  color: string;
  delta: string;
  deltaType: "positive" | "negative";
  arr: number;
  returnRate: number;
  returnRateBench: number;
  sessionGap: string;
  churnRisk: string;
  lifecycleDuration: string;
  entering: number;
  enteringFrom: string;
  progressing: number;
  progressingTo: string;
  lost: number;
  lostTo: string;
  signal: string;
  nextMove: string;
  expectedImpact: string;
  revenueSignal: string;
  expanding: number;
  contracting: number;
  planMix: string;
  forecast30d: {
    percentage: number;
    count: number;
    arr: number;
  };
}

export interface LifecycleFlow {
  from: string;
  to: string;
  count: number;
}

export interface RetentionIntervention {
  name: string;
  category: "Nurture" | "Reactivation";
  stage: string;
  channel: string;
  lift: number;
  reach: number;
  costPerUser: number;
  totalSpend: number;
  arrProtected: number;
  decision: "Scale" | "Optimize" | "Maintain" | "Best efficiency" | "Kill" | "Test";
  color: string;
  winRate?: number;
  reChurn?: number;
}

export interface AcvCohort {
  band: string;
  label: string;
  acv: number;
  clv: number;
  retention: number;
  customers: number;
  churnRate: number;
  expanding: number;
  color: string;
}

export interface TalkTopAction {
  color: string;
  label: string;
  impact: string;
}

export const TALK_CSS_VARS: Record<string, string> = {
  "--font-sans": "\"DM Sans\", Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
  "--font-mono": "\"DM Mono\", \"SFMono-Regular\", \"Courier New\", ui-monospace, monospace",
  "--font-serif": "\"Instrument Serif\", Georgia, serif",
  "--background": "#FAFBFC",
  "--foreground": "#172B4D",
  "--border": "#EBEDF0",
  "--purple": "#7C5CFC",
  "--green": "#36B37E",
  "--red": "#E04A4A",
  "--amber": "#FFA726",
  "--blue": "#4A7AE0",
  "--neutral-900": "#172B4D",
  "--neutral-700": "#42526E",
  "--neutral-600": "#5E6C84",
  "--neutral-500": "#5E6C84",
  "--neutral-400": "#8993A4",
  "--neutral-300": "#8993A4",
  "--neutral-100": "#EBEDF0",
  "--neutral-50": "#F4F5F7",
  "--neutral-0": "#ffffff",
};

export const TALK_KPI_DATA: TalkKpiDatum[] = [
  { label: "Customer Retention Rate", shortLabel: "CRR", value: "72%", delta: "+3.1pts", status: "On Track", statusVsTarget: "72% On Track", targetValue: "75%", trend: "up", badge: "OMTM", badgeColor: "var(--purple)", statusType: "progress", trendData: [{ value: 68 }, { value: 69 }, { value: 70 }, { value: 71 }, { value: 72 }, { value: 73 }, { value: 74.26 }], forecastLabel: "Forecast", forecastValue: "74.26%", scaleLabel: "SCALE", insight: "Retention engine healthy — sustained by Retained segment momentum", benchmark: "Industry: 68–78%" },
  { label: "Customer Lifetime Value", shortLabel: "CLV", value: "$486", delta: "+14%", status: "Accelerating", statusVsTarget: "Above Target", targetValue: "$520", trend: "up", badge: "KPI", badgeColor: "var(--purple)", statusType: "target", trendData: [{ value: 420 }, { value: 430 }, { value: 445 }, { value: 458 }, { value: 470 }, { value: 480 }, { value: 486 }, { value: 491 }], forecastLabel: "Forecast", forecastValue: "$491", scaleLabel: "SCALE", insight: "Growth driven by Retained segment (+$82 CLV lift)", benchmark: "Industry: $380–$620" },
  { label: "Cost per Retained Customer", shortLabel: "CpRC", value: "$8.40", delta: "−12%", status: "Efficient", statusVsTarget: "84% efficiency", targetValue: null, trend: "down-good", badge: "KPI", badgeColor: "var(--purple)", statusType: "progress", trendData: [{ value: 11 }, { value: 10.5 }, { value: 10 }, { value: 9.5 }, { value: 9 }, { value: 8.6 }, { value: 8.4 }, { value: 8.22 }], forecastLabel: "Forecast", forecastValue: "$8.22", scaleLabel: "EFFICIENT", insight: "Cost improving faster than retention growth", benchmark: "Industry: $6–$14" },
  { label: "Win-Back Rate", shortLabel: "Win-Back", value: "44%", delta: "−2.1pts", status: "Declining", statusVsTarget: "44%", targetValue: null, trend: "down", badge: "KPI", badgeColor: "var(--purple)", statusType: "gauge", trendData: [{ value: 48 }, { value: 47 }, { value: 46 }, { value: 45 }, { value: 44.5 }, { value: 44 }, { value: 43 }, { value: 41.35 }], forecastLabel: "Forecast", forecastValue: "41.35%", scaleLabel: "FIX", insight: "Of reactivation attempts, 44% succeed — declining from email conversion drop (-6 pts)", benchmark: "Industry: 30–50%" },
];

export const TALK_ADVOCACY_KPI_DATA: TalkKpiDatum[] = [
  { label: "Advocacy Action Rate", shortLabel: "AAR", value: "28%", delta: "+2.4pts", status: "Improving", statusVsTarget: "28% On Track", targetValue: "32%", trend: "up", badge: "OMTM", badgeColor: "var(--green)", statusType: "progress", trendData: [{ value: 22 }, { value: 23 }, { value: 24.5 }, { value: 25 }, { value: 25.8 }, { value: 26.4 }, { value: 28 }, { value: 29.2 }], forecastLabel: "Forecast", forecastValue: "29.2%", scaleLabel: "SCALE", insight: "Loyalty and nurture channels are producing the healthiest advocate lift", benchmark: "Industry: 20–35%" },
  { label: "Cost per Advocacy Action", shortLabel: "CpAA", value: "$4.46", delta: "−11%", status: "Efficient", statusVsTarget: "Ahead of plan", targetValue: "$4.80", trend: "down-good", badge: "KPI", badgeColor: "var(--green)", statusType: "target", trendData: [{ value: 5.9 }, { value: 5.7 }, { value: 5.4 }, { value: 5.2 }, { value: 4.9 }, { value: 4.8 }, { value: 4.46 }, { value: 4.3 }], forecastLabel: "Forecast", forecastValue: "$4.30", scaleLabel: "EFFICIENT", insight: "Push and email are compounding earned actions below benchmark cost", benchmark: "Industry: $4–$8" },
  { label: "Positive Sentiment Rate", shortLabel: "PSR", value: "72%", delta: "+7pts", status: "Above Benchmark", statusVsTarget: "7 pts above benchmark", targetValue: null, trend: "up", badge: "KPI", badgeColor: "var(--green)", statusType: "progress", trendData: [{ value: 61 }, { value: 63 }, { value: 64 }, { value: 66 }, { value: 68 }, { value: 69.5 }, { value: 72 }, { value: 73.5 }], forecastLabel: "Forecast", forecastValue: "73.5%", scaleLabel: "SCALE", insight: "Review platforms and social proof are strengthening downstream reach quality", benchmark: "Industry benchmark: 65%" },
  { label: "Average Review Score", shortLabel: "ARS", value: "4.2", delta: "+0.3", status: "Recovering", statusVsTarget: "4.2 / 5", targetValue: "4.5", trend: "up", badge: "KPI", badgeColor: "var(--green)", statusType: "target", trendData: [{ value: 3.7 }, { value: 3.8 }, { value: 3.85 }, { value: 3.9 }, { value: 4.0 }, { value: 4.05 }, { value: 4.2 }, { value: 4.26 }], forecastLabel: "Forecast", forecastValue: "4.26", scaleLabel: "FIX", insight: "Review quality is moving up, but low-score pockets still need intervention", benchmark: "Industry: 3.8–4.4" },
];

export const TALK_AGENT_ACTIONS: AgentAction[] = [
  { title: "Activate Drifting → re-engagement within 72h", description: "2,100 Drifting customers (28% of base) · Enterprise & Mid-Market segments · Session decay ≥25%", arrImpact: "+$85K ARR", deadline: "This week", type: "FIX" },
  { title: "Scale Google Search for Enterprise", description: "82% CRR, 16.4× LTV/CAC · Increase Enterprise targeting budget 40% · Jan–Mar cohorts retain 12% higher", arrImpact: "+$34K ARR", deadline: "This month", type: "SCALE" },
  { title: "Deploy email reactivation for Lapsed <30d", description: "290 Lapsed customers within reactivation window · Email 1.9× lift vs other channels · Prioritize Pro plan holders", arrImpact: "+$28K ARR", deadline: "Next 7 days", type: "SCALE" },
  { title: "Kill discount reactivation offers", description: "30% win rate but 42% re-churn · Negative unit economics at $35/user · Redirect $14K budget to behavioral email triggers", arrImpact: "−$65K churn exposure", deadline: "Immediate", type: "FIX" },
];

export const TALK_ADVOCACY_ACTIONS: AgentAction[] = [
  { title: "Scale loyalty referrals in high-sentiment cohorts", description: "Loyalty Program produces 38% AAR and the cleanest positive-sentiment mix across retained customers", arrImpact: "+$52K pipeline lift", deadline: "This month", type: "SCALE" },
  { title: "Prioritize low-cost advocate channels", description: "Push Notifications and Email Nurture drive advocacy at $2.40 and $3.10 per action — below the blended $4.46 benchmark", arrImpact: "+$18K efficiency gain", deadline: "Next 7 days", type: "SCALE" },
  { title: "Escalate poor-review rescue flows", description: "14% of reviews are below 3.5 and are dragging review score recovery in Trustpilot and on-site channels", arrImpact: "−$22K sentiment risk", deadline: "This week", type: "FIX" },
  { title: "Convert high-PSR customers into testimonials", description: "72% PSR signals enough positive sentiment to harvest more reviews, testimonials, and referral stories", arrImpact: "+$31K earned reach", deadline: "This month", type: "SCALE" },
];

export const TALK_AGENTIQ_ACTIONS_BY_VIEW = {
  retention: TALK_AGENT_ACTIONS,
  advocacy: TALK_ADVOCACY_ACTIONS,
} as const;

export const TALK_AGENTIQ_PROMPTS_BY_VIEW = {
  retention: [
    "What is the fastest way to improve win-back rate in the next 30 days?",
    "Which retention lever is creating the biggest CLV gap right now?",
    "How should I prioritize Drifting versus Lapsed recovery?",
    "Build me a 30-day retention action plan from these signals.",
  ],
  advocacy: [
    "Which advocacy channel should get the next dollar of spend?",
    "How do I convert positive sentiment into more referrals?",
    "What should I do first to improve review score and PSR together?",
    "Build me a 30-day advocacy action plan from these signals.",
  ],
} as const;

export const TALK_RETENTION_CHANNELS: RetentionChannelDatum[] = [
  { channel: "Google Search", crr: 82, clv: 622, cprc: 2.10, cac: 38, aar: 2450000, churned: 180000, repeatRate: 78, signal: "SCALE", move: "Scale", bestSegment: "Enterprise" },
  { channel: "LinkedIn Ads", crr: 76, clv: 598, cprc: 8.80, cac: 86, aar: 1890000, churned: 240000, repeatRate: 71, signal: "SCALE", move: "Scale", bestSegment: "Enterprise" },
  { channel: "Email Nurture", crr: 74, clv: 486, cprc: 2.04, cac: 12, aar: 1620000, churned: 160000, repeatRate: 69, signal: "SCALE", move: "Scale", bestSegment: "Mid-Market" },
  { channel: "Taboola", crr: 58, clv: 342, cprc: 6.20, cac: 52, aar: 980000, churned: 520000, repeatRate: 52, signal: "WATCH", move: "Watch", bestSegment: "Mid-Market" },
  { channel: "Instagram Ads", crr: 52, clv: 298, cprc: 4.80, cac: 64, aar: 720000, churned: 480000, repeatRate: 48, signal: "FIX", move: "Fix", bestSegment: "SMB" },
  { channel: "Outbrain", crr: 48, clv: 256, cprc: 5.40, cac: 58, aar: 580000, churned: 640000, repeatRate: 0, signal: "FIX", move: "Pause", bestSegment: "None" },
];

export const TALK_CLV_TIERS: ClvTier[] = [
  { name: "High-Velocity", percentage: 14, color: "#5B3FA0", clv: 698, customers: 675, arr: 471150, trend: "+2.1%", microAction: "Expand & refer" },
  { name: "Stable", percentage: 34, color: "#7C5CFC", clv: 542, customers: 1639, arr: 888338, trend: "+1.8%", microAction: "Protect & grow" },
  { name: "Plateauing", percentage: 33, color: "#FFA726", clv: 398, customers: 1591, arr: 633218, trend: "−0.4%", microAction: "Upsell opportunity" },
  { name: "Declining", percentage: 19, color: "#E04A4A", clv: 276, customers: 915, arr: 252540, trend: "−3.2%", microAction: "Prevent churn transition" },
];

export const TALK_CLV_SCALE_DRIVERS: ClvScaleDriver[] = [
  { lever: "Increase usage frequency", impact: "+$82 CLV", current: "2.3×/week", benchmark: "4.1×/week" },
  { lever: "Expand to premium tiers", impact: "+$64 CLV", current: "18% adopt", benchmark: "32% adopt" },
  { lever: "Cross-sell adjacent products", impact: "+$46 CLV", current: "1.2 products", benchmark: "2.4 products" },
  { lever: "Reduce time to value", impact: "+$28 CLV", current: "14 days", benchmark: "6 days" },
];

export const TALK_CLV_FIX_LEAKS: ClvFixLeak[] = [
  { leak: "Passive → Churn", accounts: 420, valueLeaking: 82000 },
  { leak: "Limited feature adoption", accounts: 680, valueLeaking: 76000 },
  { leak: "Poor onboarding completion", accounts: 520, valueLeaking: 60000 },
];

export const TALK_ACV_COHORTS: AcvCohort[] = [
  { band: "$0–$300", label: "Starter", acv: 240, clv: 298, retention: 52, customers: 2840, churnRate: 48, expanding: 4, color: "#E04A4A" },
  { band: "$300–$600", label: "Growth", acv: 480, clv: 486, retention: 72, customers: 2950, churnRate: 28, expanding: 12, color: "#FFA726" },
  { band: "$600–$1.2K", label: "Pro", acv: 840, clv: 698, retention: 86, customers: 1280, churnRate: 14, expanding: 24, color: "#7C5CFC" },
  { band: "$1.2K+", label: "Enterprise", acv: 2400, clv: 1240, retention: 94, customers: 430, churnRate: 6, expanding: 32, color: "#36B37E" },
];

export const TALK_LIFECYCLE_STAGES: LifecycleStage[] = [
  { name: "Activated", usage: "First session or conversion in last 7 days", count: 1275, percentage: 17, color: "#4A7AE0", delta: "+1.5 pts", deltaType: "positive", arr: 260000, returnRate: 62, returnRateBench: 70, sessionGap: "+18%", churnRisk: "Moderate", lifecycleDuration: "1.2 months", entering: 420, enteringFrom: "New sign-ups", progressing: 420, progressingTo: "Retained", lost: 85, lostTo: "Drifting", signal: "New customers completing their first session within 7 days. 62% return for a second session, but 38% show no follow-up activity.", nextMove: "Trigger a welcome sequence within 24h of first session. Customers who return within 48h retain at 2.1× the rate of those who don't. Deploy behavioral nudges: Day 1 confirmation, Day 3 value reminder, Day 5 feature spotlight.", expectedImpact: "Increasing activation-to-retained conversion by 10% could add ~$42K ARR.", revenueSignal: "84% on entry plan", expanding: 4, contracting: 2, planMix: "92% Starter · 8% Growth", forecast30d: { percentage: 16, count: 1200, arr: 245000 } },
  { name: "Retained", usage: "Consistent return behavior (≥2 sessions/week)", count: 2625, percentage: 35, color: "#7C5CFC", delta: "+2 pts", deltaType: "positive", arr: 1550000, returnRate: 88, returnRateBench: 85, sessionGap: "−4%", churnRisk: "Low", lifecycleDuration: "7.2 months", entering: 420, enteringFrom: "Activated", progressing: 610, progressingTo: "Drifting", lost: 45, lostTo: "Churned", signal: "Strong habitual return patterns — ≥2 sessions/week with stable or increasing frequency. These customers are deeply embedded.", nextMove: "Cross-sell and upsell — your expansion revenue engine. Trigger upgrade offers when session depth exceeds plan limits. Introduce referral program to this segment.", expectedImpact: "Retained customers generate 2.6× higher CLV than Drifting customers.", revenueSignal: "18% upgraded this period", expanding: 22, contracting: 3, planMix: "34% Starter · 48% Growth · 18% Pro", forecast30d: { percentage: 33, count: 2475, arr: 1460000 } },
  { name: "Drifting", usage: "Session frequency declining ≥25% vs baseline", count: 2100, percentage: 28, color: "#FFA726", delta: "+3 pts", deltaType: "negative", arr: 520000, returnRate: 48, returnRateBench: 60, sessionGap: "+32%", churnRisk: "High", lifecycleDuration: "3.8 months", entering: 610, enteringFrom: "Retained", progressing: 380, progressingTo: "Lapsed", lost: 140, lostTo: "Churned", signal: "Customers in this segment show a 30–45% decline in weekly session frequency over the last 14 days.", nextMove: "Trigger re-engagement campaigns within 3–5 days of inactivity, prioritizing high-value cohorts.", expectedImpact: "Reducing engagement decay by 15% could protect ~$85K ARR.", revenueSignal: "12% downgraded this period", expanding: 3, contracting: 12, planMix: "52% Starter · 38% Growth · 10% Pro", forecast30d: { percentage: 33, count: 2475, arr: 680000 } },
  { name: "Lapsed", usage: "No session in 14+ days", count: 1050, percentage: 14, color: "#E04A4A", delta: "−1 pt", deltaType: "positive", arr: 260000, returnRate: 18, returnRateBench: 25, sessionGap: "N/A", churnRisk: "Critical", lifecycleDuration: "5.6 months", entering: 380, enteringFrom: "Drifting", progressing: 290, progressingTo: "Reactivated", lost: 310, lostTo: "Churned", signal: "Fully inactive — no sessions in 14+ days. 72% will not return without direct intervention. $260K ARR exposed.", nextMove: "Triage by CLV: top 30% get personal outreach + incentive within 7 days. Deploy lifecycle email triggers for remaining. Redirect budget from low-ROI rescue to Drifting prevention.", expectedImpact: "Reactivating 10% more Lapsed users could recover ~$35K ARR.", revenueSignal: "28% downgraded before lapsing", expanding: 0, contracting: 28, planMix: "68% Starter · 28% Growth · 4% Pro", forecast30d: { percentage: 13, count: 975, arr: 240000 } },
  { name: "Reactivated", usage: "Returned after ≥14 days inactivity", count: 450, percentage: 6, color: "#36B37E", delta: "+1.2 pts", deltaType: "positive", arr: 110000, returnRate: 38, returnRateBench: 45, sessionGap: "−12%", churnRisk: "Moderate", lifecycleDuration: "2.4 months", entering: 290, enteringFrom: "Lapsed", progressing: 165, progressingTo: "Retained", lost: 65, lostTo: "Drifting", signal: "Users are most likely to reactivate within 7–10 days when exposed to remarketing or lifecycle email triggers.", nextMove: "Deploy reactivation campaigns within the first 7 days of inactivity, prioritizing high CLV users. Email channel shows 1.9× lift vs other channels.", expectedImpact: "Increasing reactivation rate by +5 pts could recover ~$35K ARR.", revenueSignal: "6% re-upgraded after return", expanding: 6, contracting: 8, planMix: "72% Starter · 24% Growth · 4% Pro", forecast30d: { percentage: 5, count: 375, arr: 95000 } },
];

export const TALK_LIFECYCLE_FLOWS: LifecycleFlow[] = [
  { from: "Activated", to: "Retained", count: 420 },
  { from: "Retained", to: "Drifting", count: 610 },
  { from: "Drifting", to: "Lapsed", count: 380 },
  { from: "Lapsed", to: "Reactivated", count: 290 },
];

export const TALK_RETENTION_INTERVENTIONS: RetentionIntervention[] = [
  { name: "Feature discovery tours", category: "Nurture", stage: "Activated", channel: "In-app", lift: 32, reach: 1680, costPerUser: 0.15, totalSpend: 252, arrProtected: 84000, decision: "Scale", color: "#4A7AE0" },
  { name: "Loyalty enrollment", category: "Nurture", stage: "Retained", channel: "In-app", lift: 28, reach: 860, costPerUser: 0, totalSpend: 0, arrProtected: 72000, decision: "Scale", color: "#7C5CFC" },
  { name: "Usage decline alerts", category: "Nurture", stage: "Drifting", channel: "Email + SMS", lift: 26, reach: 620, costPerUser: 2.40, totalSpend: 1488, arrProtected: 65000, decision: "Scale", color: "#FFA726" },
  { name: "Onboarding drip sequence", category: "Nurture", stage: "Activated", channel: "Email", lift: 18, reach: 1680, costPerUser: 1.20, totalSpend: 2016, arrProtected: 48000, decision: "Optimize", color: "#4A7AE0" },
  { name: "Milestone celebrations", category: "Nurture", stage: "Retained", channel: "In-app + Email", lift: 14, reach: 1440, costPerUser: 0.30, totalSpend: 432, arrProtected: 38000, decision: "Maintain", color: "#7C5CFC" },
  { name: "Weekly usage digest", category: "Nurture", stage: "Retained", channel: "Email", lift: 8, reach: 1440, costPerUser: 0.80, totalSpend: 1152, arrProtected: 22000, decision: "Optimize", color: "#7C5CFC" },
  { name: "QBR for high-CLV", category: "Nurture", stage: "Drifting", channel: "CSM call", lift: 35, reach: 180, costPerUser: 120, totalSpend: 21600, arrProtected: 95000, decision: "Scale", color: "#FFA726" },
  { name: "CSM video call", category: "Reactivation", stage: "Lapsed", channel: "Human", lift: 65, reach: 420, costPerUser: 95, totalSpend: 39900, arrProtected: 62000, decision: "Scale", color: "#7C5CFC", winRate: 65, reChurn: 5 },
  { name: "Founder/CEO email", category: "Reactivation", stage: "Lapsed", channel: "Human", lift: 61, reach: 580, costPerUser: 12, totalSpend: 6960, arrProtected: 48000, decision: "Scale", color: "#7C5CFC", winRate: 61, reChurn: 6 },
  { name: "Behavioral email trigger", category: "Reactivation", stage: "Lapsed", channel: "Automated", lift: 52, reach: 1200, costPerUser: 1.80, totalSpend: 2160, arrProtected: 38000, decision: "Scale", color: "#4A7AE0", winRate: 52, reChurn: 16 },
  { name: "In-app tooltip + checklist", category: "Reactivation", stage: "Reactivated", channel: "Automated", lift: 46, reach: 850, costPerUser: 0.20, totalSpend: 170, arrProtected: 32000, decision: "Best efficiency", color: "#4A7AE0", winRate: 46, reChurn: 14 },
  { name: "Discount offer", category: "Reactivation", stage: "Lapsed", channel: "Incentive", lift: 30, reach: 400, costPerUser: 35, totalSpend: 14000, arrProtected: 12000, decision: "Kill", color: "#E04A4A", winRate: 30, reChurn: 42 },
];

export const TALK_RETENTION_TOTALS = {
  totalRetentionSpend: TALK_RETENTION_INTERVENTIONS.reduce((sum, item) => sum + item.totalSpend, 0),
  totalArrProtected: TALK_RETENTION_INTERVENTIONS.reduce((sum, item) => sum + item.arrProtected, 0),
  nurtureSpend: TALK_RETENTION_INTERVENTIONS.filter((item) => item.category === "Nurture").reduce((sum, item) => sum + item.totalSpend, 0),
  reactivationSpend: TALK_RETENTION_INTERVENTIONS.filter((item) => item.category === "Reactivation").reduce((sum, item) => sum + item.totalSpend, 0),
  nurtureArr: TALK_RETENTION_INTERVENTIONS.filter((item) => item.category === "Nurture").reduce((sum, item) => sum + item.arrProtected, 0),
  reactivationArr: TALK_RETENTION_INTERVENTIONS.filter((item) => item.category === "Reactivation").reduce((sum, item) => sum + item.arrProtected, 0),
};

export const TALK_PERIOD_CONFIG = {
  "7d": { days: 7, intervalDays: 1, historyTicks: 7, forecastTicks: 3, labelFormat: "short_day" },
  "14d": { days: 14, intervalDays: 2, historyTicks: 7, forecastTicks: 3, labelFormat: "month_day" },
  "30d": { days: 30, intervalDays: 7, historyTicks: 4, forecastTicks: 2, labelFormat: "month_day" },
  "90d": { days: 90, intervalDays: 14, historyTicks: 6, forecastTicks: 2, labelFormat: "month_short" },
} as const;

export type TalkPeriodKey = keyof typeof TALK_PERIOD_CONFIG;

export const TALK_TOP_ACTIONS: TalkTopAction[] = [
  { color: "var(--red)", label: "Fix Drifting segment", impact: "+$85K" },
  { color: "var(--green)", label: "Scale Google Search", impact: "+$34K" },
  { color: "var(--amber)", label: "Increase reactivation campaigns", impact: "+$28K" },
];

export const TALK_PHASE_NAVIGATION = {
  previous: {
    label: "Convert",
    description: "Conversion engine — turning prospects into customers",
    omtmLabel: "CONVERSION RATE",
    omtmValue: "8.4%",
    metrics: [
      { label: "CAC", value: "$42" },
      { label: "Time to Convert", value: "12d" },
      { label: "MQL→SQL", value: "34%" },
    ],
  },
  next: {
    label: "Talk · Advocacy",
    description: "Amplification engine — turning customers into advocates",
    omtmLabel: "ADVOCACY AMPLIFICATION RATE",
    omtmValue: "12.1%",
    metrics: [
      { label: "NPS", value: "48" },
      { label: "Referrals", value: "180" },
      { label: "Testimonials", value: "42" },
    ],
  },
};

export function formatTalkTickLabel(date: Date, format: string) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  if (format === "short_day") return days[date.getDay()];
  if (format === "month_day") return `${months[date.getMonth()]} ${date.getDate()}`;
  if (format === "month_short") return `${months[date.getMonth()]} ${date.getDate()}`;

  return `${date.getDate()}`;
}

export function generateTalkClvTrendData(
  tier: { clv: number; name: string },
  periodKey: TalkPeriodKey
) {
  const config = TALK_PERIOD_CONFIG[periodKey] ?? TALK_PERIOD_CONFIG["30d"];
  const base = tier.clv;
  const dailyVariance =
    tier.name === "Declining" ? -0.0025 : tier.name === "Plateauing" ? 0.0008 : 0.0018;
  const now = new Date();
  const data: Array<{
    date: Date;
    label: string;
    historical?: number;
    forecastLine?: number;
    forecast: boolean;
    isNow: boolean;
  }> = [];

  for (let index = 0; index < config.historyTicks; index += 1) {
    const daysBack = (config.historyTicks - 1 - index) * config.intervalDays;
    const date = new Date(now);
    date.setDate(date.getDate() - daysBack);
    const jitter = Math.sin(index * 2.7 + tier.clv * 0.01) * 0.008;
    const value =
      Math.round(
        base *
          (1 +
            dailyVariance * (index - config.historyTicks + 1) * config.intervalDays +
            jitter) *
          100
      ) / 100;
    const isLast = index === config.historyTicks - 1;

    data.push({
      date,
      label: isLast ? "Today" : formatTalkTickLabel(date, config.labelFormat),
      historical: value,
      forecastLine: isLast ? value : undefined,
      forecast: false,
      isNow: isLast,
    });
  }

  const lastHistorical = data[data.length - 1]?.historical ?? base;

  for (let index = 1; index <= config.forecastTicks; index += 1) {
    const date = new Date(now);
    date.setDate(date.getDate() + index * config.intervalDays);
    const projectedGrowth = dailyVariance * index * config.intervalDays;
    const value = Math.round(lastHistorical * (1 + projectedGrowth) * 100) / 100;

    data.push({
      date,
      label: formatTalkTickLabel(date, config.labelFormat),
      historical: undefined,
      forecastLine: value,
      forecast: true,
      isNow: false,
    });
  }

  return data;
}
