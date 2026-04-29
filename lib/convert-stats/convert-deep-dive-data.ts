// Ported from Convert_Insights_-_Drill_Down DeepDive.tsx

export interface StageDropoffRow {
  transition: string;
  dropoff: number;
  color: string;
  delta: number;
  deltaColor: string;
  primaryDriver: string;
  channelSignal: string;
}

export interface ConversionEventRow {
  event: string;
  channel: string;
  channelBadge: string;
  channelColor: string;
  revenue: string;
  volume: number;
  cvr: string;
  trend: string;
  trendUp: boolean;
  weight: "HIGH" | "MID" | "LOW";
}

export interface RevenueAtRiskRow {
  signal: string;
  risk: "HIGH" | "MID" | "LOW";
  affected: number;
  channel: string;
  channelBadge: string;
  channelColor: string;
  impact: string;
}

export const DEEP_DIVE_STAGE_DROPOFF: StageDropoffRow[] = [
  {
    transition: "Trial → Activated",
    dropoff: 30.1,
    color: "#8B5CF6",
    delta: -1.9,
    deltaColor: "#36B37E",
    primaryDriver: "Onboarding completion improving",
    channelSignal: "GA4 leads with 74% activation",
  },
  {
    transition: "Activated → Qualified",
    dropoff: 43.3,
    color: "#F59E0B",
    delta: 0.0,
    deltaColor: "#9494A8",
    primaryDriver: "ICP filtering stable",
    channelSignal: "HubSpot scoring 89% accuracy",
  },
  {
    transition: "Qualified → Purchased",
    dropoff: 15.3,
    color: "#8B5CF6",
    delta: -3.3,
    deltaColor: "#EF4444",
    primaryDriver: "Pricing page bounce ↑12%",
    channelSignal: "Stripe checkout abandonment up",
  },
  {
    transition: "Purchased → Retained",
    dropoff: 23.0,
    color: "#F59E0B",
    delta: -1.2,
    deltaColor: "#36B37E",
    primaryDriver: "Day-30 churn flat",
    channelSignal: "Shopify digital subs 91% retain",
  },
];

export const DEEP_DIVE_CONVERSION_EVENTS: ConversionEventRow[] = [
  {
    event: "MQL → Closed Won",
    channel: "HubSpot",
    channelBadge: "H",
    channelColor: "#FF7A59",
    revenue: "$195K",
    volume: 780,
    cvr: "42.4%",
    trend: "+8%",
    trendUp: true,
    weight: "HIGH",
  },
  {
    event: "SaaS Free Trial → Paid",
    channel: "GA4",
    channelBadge: "G",
    channelColor: "#F9AB00",
    revenue: "$185K",
    volume: 620,
    cvr: "18.4%",
    trend: "+12%",
    trendUp: true,
    weight: "HIGH",
  },
  {
    event: "Digital Product Purchase",
    channel: "Shopify",
    channelBadge: "S",
    channelColor: "#96BF48",
    revenue: "$128K",
    volume: 290,
    cvr: "25.9%",
    trend: "+22%",
    trendUp: true,
    weight: "MID",
  },
  {
    event: "Plan Upgrade",
    channel: "Stripe",
    channelBadge: "S",
    channelColor: "#635BFF",
    revenue: "$80K",
    volume: 250,
    cvr: "35.7%",
    trend: "+3%",
    trendUp: true,
    weight: "MID",
  },
  {
    event: "App Template Bundle",
    channel: "Shopify",
    channelBadge: "S",
    channelColor: "#96BF48",
    revenue: "$70K",
    volume: 120,
    cvr: "10.7%",
    trend: "+34%",
    trendUp: true,
    weight: "MID",
  },
  {
    event: "Social Commerce Order",
    channel: "TikTok Shop",
    channelBadge: "T",
    channelColor: "#1A1A2E",
    revenue: "$62K",
    volume: 220,
    cvr: "1.4%",
    trend: "−5%",
    trendUp: false,
    weight: "LOW",
  },
  {
    event: "Enterprise Demo → Close",
    channel: "HubSpot",
    channelBadge: "H",
    channelColor: "#FF7A59",
    revenue: "$52K",
    volume: 28,
    cvr: "14.0%",
    trend: "+6%",
    trendUp: true,
    weight: "HIGH",
  },
  {
    event: "In-App Add-on Purchase",
    channel: "GA4",
    channelBadge: "G",
    channelColor: "#F9AB00",
    revenue: "$48K",
    volume: 430,
    cvr: "5.3%",
    trend: "+18%",
    trendUp: true,
    weight: "LOW",
  },
  {
    event: "Viral Referral Purchase",
    channel: "TikTok Shop",
    channelBadge: "T",
    channelColor: "#1A1A2E",
    revenue: "$27.5K",
    volume: 120,
    cvr: "0.8%",
    trend: "+42%",
    trendUp: true,
    weight: "LOW",
  },
];

export const DEEP_DIVE_REVENUE_AT_RISK: RevenueAtRiskRow[] = [
  {
    signal: "Single-session checkout abandoner",
    risk: "HIGH",
    affected: 220,
    channel: "Shopify",
    channelBadge: "S",
    channelColor: "#96BF48",
    impact: "$106K potential",
  },
  {
    signal: "Social referral · no return visit",
    risk: "HIGH",
    affected: 410,
    channel: "TikTok Shop",
    channelBadge: "T",
    channelColor: "#1A1A2E",
    impact: "$108K ARR at risk",
  },
  {
    signal: "No feature activation in 48h",
    risk: "HIGH",
    affected: 340,
    channel: "GA4",
    channelBadge: "G",
    channelColor: "#F9AB00",
    impact: "$92K ARR at risk",
  },
  {
    signal: "MQL score drop post-demo",
    risk: "MID",
    affected: 180,
    channel: "HubSpot",
    channelBadge: "H",
    channelColor: "#FF7A59",
    impact: "$45K pipeline",
  },
  {
    signal: "Payment method expired ≤30d",
    risk: "MID",
    affected: 95,
    channel: "Stripe",
    channelBadge: "S",
    channelColor: "#635BFF",
    impact: "$30K ARR at risk",
  },
  {
    signal: "Downgrade inquiry ≤60d",
    risk: "LOW",
    affected: 62,
    channel: "Stripe",
    channelBadge: "S",
    channelColor: "#635BFF",
    impact: "$18K ARR risk",
  },
];
