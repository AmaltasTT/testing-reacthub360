// ─── DATA MODEL (Framework-aligned: QR = Qualified Reach, QRR = Qualified Reach Rate, CpQR = Cost per QR, APR = Audience Penetration Rate) ───

export interface Channel {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: string;
  subtype: "paid" | "organic";
  reach: number;
  qr: number;
  spend: number;
  viewability: number;
  penetration: number;
  campaigns: number;
  trend: number;
  account: string;
  accountId: string;
  accountLabel: string;
  idLabel: string;
  qrr?: number;
  cpqr?: number;
}

export interface Campaign {
  id: string;
  name: string;
  channels: number;
  status: string;
}

export interface PeriodOption {
  key: string;
  label: string;
}

export interface FrequencyChannel {
  id: string;
  name: string;
  icon: string;
  color: string;
  impressions: number;
  uniqueReach: number;
  avgFreq: number;
  optimalFreq: number;
  cpm: number;
  cpqr: number;
  freqCurve: Array<{ freq: number; qrrLift: number; cpmAt: number }>;
  excessFreq?: number;
  excessImpressions?: number;
  wastedSpend?: number;
  status?: string;
}

export interface AgeSegment {
  label: string;
  reach: number;
  engaged: number;
  spend: number;
  color: string;
}

export interface GenderSegment {
  label: string;
  reach: number;
  engaged: number;
  spend: number;
  color: string;
}

export interface InterestSegment {
  name: string;
  reach: number;
  engaged: number;
  cper: number;
  trend: number;
  channels: Record<string, number>;
}

export interface OverlapData {
  pair: [string, string];
  pairColors: [string, string];
  pairIcons: [string, string];
  overlap: number;
  severity: string;
  wastedSpend: number;
  uniqueA: number;
  uniqueB: number;
  shared: number;
  totalCombined: number;
  insight: string;
  action: string;
  trend: number[];
  trendDays: string[];
}

export interface GeoCountry {
  code: string;
  name: string;
  flag: string;
  reach: number;
  engaged: number;
  spend: number;
  penetration: number;
  trend: number;
  channels: Record<string, number>;
  cities: Array<{
    name: string;
    reach: number;
    engaged: number;
    spend: number;
  }>;
}

export const CHANNELS: Channel[] = [
  { id: "facebook", name: "Facebook", icon: "f", color: "#1877F2", type: "social", subtype: "paid", reach: 18200000, qr: 8600000, spend: 28900, viewability: 0.72, penetration: 0.55, campaigns: 4, trend: 0.10, account: "REACTIQ360 Global", accountId: "act_284719385", accountLabel: "Ad Account", idLabel: "Account ID" },
  { id: "instagram", name: "Instagram", icon: "◎", color: "#E4405F", type: "social", subtype: "paid", reach: 15800000, qr: 8200000, spend: 21900, viewability: 0.78, penetration: 0.62, campaigns: 3, trend: 0.09, account: "REACTIQ360 Global", accountId: "act_284719385", accountLabel: "Ad Account", idLabel: "Account ID" },
  { id: "google-search", name: "Google Search", icon: "G", color: "#4285F4", type: "search", subtype: "paid", reach: 12400000, qr: 5000000, spend: 17980, viewability: 0.85, penetration: 0.48, campaigns: 5, trend: 0.11, account: "REACTIQ360 – Search", accountId: "847-291-0384", accountLabel: "Account", idLabel: "Customer ID" },
  { id: "tiktok", name: "TikTok", icon: "♪", color: "#010101", type: "social", subtype: "paid", reach: 8400000, qr: 5700000, spend: 15540, viewability: 0.65, penetration: 0.28, campaigns: 3, trend: 0.10, account: "REACTIQ360 Official", accountId: "7294018365", accountLabel: "Advertiser", idLabel: "Advertiser ID" },
  { id: "google-display", name: "Google Display", icon: "▣", color: "#EA4335", type: "display", subtype: "paid", reach: 6200000, qr: 1500000, spend: 19275, viewability: 0.48, penetration: 0.15, campaigns: 3, trend: 0.07, account: "REACTIQ360 – Display", accountId: "847-291-0384", accountLabel: "Account", idLabel: "Customer ID" },
  { id: "dv360", name: "DV360", icon: "◈", color: "#7C3AED", type: "display", subtype: "paid", reach: 5400000, qr: 1600000, spend: 16200, viewability: 0.52, penetration: 0.18, campaigns: 2, trend: 0.05, account: "REACTIQ360 Programmatic", accountId: "P-4829173", accountLabel: "Partner", idLabel: "Partner ID" },
  { id: "youtube", name: "YouTube Ads", icon: "▶", color: "#FF0000", type: "video", subtype: "paid", reach: 9200000, qr: 4100000, spend: 22400, viewability: 0.62, penetration: 0.45, campaigns: 2, trend: 0.07, account: "REACTIQ360 – Video", accountId: "847-291-0384", accountLabel: "Account", idLabel: "Customer ID" },
  { id: "linkedin", name: "LinkedIn Ads", icon: "in", color: "#0A66C2", type: "social", subtype: "paid", reach: 4800000, qr: 2900000, spend: 18600, viewability: 0.74, penetration: 0.35, campaigns: 3, trend: 0.08, account: "REACTIQ360 B2B", accountId: "508294716", accountLabel: "Account", idLabel: "Account ID" },
  { id: "pinterest", name: "Pinterest Ads", icon: "P", color: "#E60023", type: "social", subtype: "paid", reach: 3600000, qr: 1800000, spend: 8400, viewability: 0.70, penetration: 0.22, campaigns: 1, trend: 0.06, account: "REACTIQ360 Visual", accountId: "PIN-839201", accountLabel: "Advertiser", idLabel: "Advertiser ID" },
  { id: "snapchat", name: "Snapchat Ads", icon: "👻", color: "#F7D731", type: "social", subtype: "paid", reach: 2800000, qr: 1500000, spend: 6200, viewability: 0.58, penetration: 0.14, campaigns: 1, trend: 0.09, account: "REACTIQ360", accountId: "SNAP-492817", accountLabel: "Organization", idLabel: "Org ID" },
  { id: "organic-search", name: "Organic Search", icon: "◉", color: "#34A853", type: "search", subtype: "organic", reach: 8900000, qr: 4500000, spend: 0, viewability: 0.92, penetration: 0.42, campaigns: 0, trend: 0.09, account: "reactiq360.com", accountId: "SC-reactiq360", accountLabel: "Property", idLabel: "Property ID" },
  { id: "instagram-organic", name: "Instagram Organic", icon: "◎", color: "#E4405F", type: "social", subtype: "organic", reach: 5800000, qr: 4100000, spend: 0, viewability: 0.88, penetration: 0.38, campaigns: 0, trend: 0.12, account: "@reactiq360", accountId: "IG-48291738", accountLabel: "Profile", idLabel: "Page ID" },
  { id: "facebook-organic", name: "Facebook Organic", icon: "f", color: "#1877F2", type: "social", subtype: "organic", reach: 4200000, qr: 3800000, spend: 0, viewability: 0.80, penetration: 0.32, campaigns: 0, trend: 0.08, account: "REACTIQ360", accountId: "FB-102847391", accountLabel: "Page", idLabel: "Page ID" },
  { id: "email", name: "Email", icon: "✉", color: "#6366F1", type: "direct", subtype: "organic", reach: 3200000, qr: 2600000, spend: 0, viewability: 0.95, penetration: 0.84, campaigns: 0, trend: 0.06, account: "REACTIQ360 Marketing", accountId: "HBS-r360-prod", accountLabel: "Workspace", idLabel: "Workspace ID" },
];

export const deriveMetrics = (ch: Channel): Channel => {
  const qrr = ch.reach > 0 ? ch.qr / ch.reach : 0;
  const cpqr = ch.spend > 0 && ch.qr > 0 ? ch.spend / (ch.qr / 1000) : 0;
  return { ...ch, qrr, cpqr };
};

export const enrichedChannels = CHANNELS.map(deriveMetrics);
export const paidChannels = enrichedChannels.filter((c) => c.subtype === "paid");
export const organicChannels = enrichedChannels.filter((c) => c.subtype === "organic");

export const totals = {
  reach: enrichedChannels.reduce((s, c) => s + c.reach, 0),
  qr: enrichedChannels.reduce((s, c) => s + c.qr, 0),
  qrTarget: 65_000_000,
  spend: enrichedChannels.reduce((s, c) => s + c.spend, 0),
  qrr: 0,
  qrrTarget: 0.55,
  avgCpqr: 0,
  avgCpqrTarget: 2.80,
  apr: 0,
  aprTarget: 0.45,
};
totals.qrr = totals.qr / totals.reach;
totals.avgCpqr = totals.spend / (totals.qr / 1000);
totals.apr = enrichedChannels.reduce((s, c) => s + c.penetration, 0) / enrichedChannels.length;

export const OVERLAP_DATA: OverlapData[] = [
  { pair: ["Facebook", "Instagram"], pairColors: ["#1877F2", "#E4405F"], pairIcons: ["f", "◎"], overlap: 0.65, severity: "high", wastedSpend: 16500,
    uniqueA: 6370000, uniqueB: 5530000, shared: 11700000, totalCombined: 23600000,
    insight: "65% of your IG audience already sees FB ads. Differentiate creative roles across Meta or redirect overlap budget to TikTok.",
    action: "Differentiate creative or shift IG overlap budget to TikTok",
    trend: [0.58, 0.60, 0.61, 0.63, 0.64, 0.65], trendDays: ["W1", "W2", "W3", "W4", "W5", "W6"] },
  { pair: ["Outbrain", "Taboola"], pairColors: ["#E65100", "#1A56DB"], pairIcons: ["O", "T"], overlap: 0.53, severity: "high", wastedSpend: 9200,
    uniqueA: 2870000, uniqueB: 3150000, shared: 3420000, totalCombined: 9440000,
    insight: "Native ad networks serve overlapping publisher pools. 53% of Taboola users already see Outbrain placements — consolidate to one or split by content vertical.",
    action: "Consolidate to one network or split by publisher vertical",
    trend: [0.48, 0.49, 0.50, 0.51, 0.52, 0.53], trendDays: ["W1", "W2", "W3", "W4", "W5", "W6"] },
  { pair: ["Google Display", "Google Search"], pairColors: ["#EA4335", "#4285F4"], pairIcons: ["▣", "G"], overlap: 0.42, severity: "moderate", wastedSpend: 7800,
    uniqueA: 3596000, uniqueB: 7192000, shared: 5208000, totalCombined: 15996000,
    insight: "Display and Search share 42% of users, but intent differs. Cap cross-channel frequency within the Google ecosystem.",
    action: "Apply cross-channel frequency caps in Google Ads",
    trend: [0.38, 0.39, 0.40, 0.41, 0.42, 0.42], trendDays: ["W1", "W2", "W3", "W4", "W5", "W6"] },
  { pair: ["YouTube Ads", "TikTok"], pairColors: ["#FF0000", "#010101"], pairIcons: ["▶", "♪"], overlap: 0.38, severity: "moderate", wastedSpend: 5400,
    uniqueA: 5100000, uniqueB: 6720000, shared: 4510000, totalCombined: 16330000,
    insight: "38% video audience overlap — both compete for short-form attention. Differentiate by format: long-form storytelling on YouTube, trend-native on TikTok.",
    action: "Split by format — long-form YouTube, trend-native TikTok",
    trend: [0.33, 0.34, 0.35, 0.36, 0.37, 0.38], trendDays: ["W1", "W2", "W3", "W4", "W5", "W6"] },
  { pair: ["Microsoft Search", "Google Search"], pairColors: ["#00A4EF", "#4285F4"], pairIcons: ["M", "G"], overlap: 0.31, severity: "moderate", wastedSpend: 3900,
    uniqueA: 2640000, uniqueB: 7192000, shared: 2980000, totalCombined: 12812000,
    insight: "31% overlap between Bing and Google searchers. Microsoft skews older/desktop — use for B2B targeting to reach audiences Google misses.",
    action: "Use Microsoft for B2B desktop audiences Google underserves",
    trend: [0.30, 0.30, 0.31, 0.31, 0.31, 0.31], trendDays: ["W1", "W2", "W3", "W4", "W5", "W6"] },
];

export const totalOverlapWaste = OVERLAP_DATA.reduce((s, o) => s + o.wastedSpend, 0);

export const CAMPAIGNS: Campaign[] = [
  { id: "all", name: "All Campaigns", channels: 14, status: "active" },
  { id: "1", name: "Holiday Sale 2024", channels: 5, status: "active" },
  { id: "2", name: "Spring Collection", channels: 6, status: "active" },
  { id: "3", name: "Back to School", channels: 4, status: "active" },
  { id: "4", name: "New Year Promo", channels: 3, status: "active" },
  { id: "5", name: "Summer Launch 2025", channels: 8, status: "active" },
];

export const PERIOD_OPTIONS: PeriodOption[] = [
  { key: "7d", label: "7 days" },
  { key: "14d", label: "14 days" },
  { key: "30d", label: "30 days" },
  { key: "90d", label: "90 days" },
  { key: "custom", label: "Custom" },
];

// ─── TREND DATA (6 weeks for charts) ─────────────────────────

export const trendDays = ["W1", "W2", "W3", "W4", "W5", "W6"];
export const trendReach = [78400000, 79800000, 81200000, 82100000, 83000000, 83000000];
export const trendQR = [48200000, 49600000, 50800000, 51400000, 52100000, 52500000];
export const trendCpqr = [3.42, 3.38, 3.25, 3.18, 3.15, 3.12];
export const trendQRR = [0.615, 0.622, 0.626, 0.626, 0.628, 0.633];
export const cpqrBenchmark = [5.0, 5.0, 5.0, 5.0, 5.0, 5.0]; // Industry benchmark line
export const benchmarkBand = { min: 0.55, max: 0.65 };

export const FREQUENCY_DATA: FrequencyChannel[] = [
  { id: "facebook", name: "Facebook", icon: "f", color: "#1877F2", impressions: 54600000, uniqueReach: 18200000, avgFreq: 3.0, optimalFreq: 2.5, cpm: 5.30, cpqr: 3.36, freqCurve: [
    { freq: 1, qrrLift: 0.18, cpmAt: 4.20 }, { freq: 2, qrrLift: 0.32, cpmAt: 4.80 }, { freq: 3, qrrLift: 0.38, cpmAt: 5.30 },
    { freq: 4, qrrLift: 0.39, cpmAt: 6.10 }, { freq: 5, qrrLift: 0.38, cpmAt: 7.20 }, { freq: 6, qrrLift: 0.35, cpmAt: 8.60 },
  ]},
  { id: "instagram", name: "Instagram", icon: "◎", color: "#E4405F", impressions: 42100000, uniqueReach: 15800000, avgFreq: 2.7, optimalFreq: 2.8, cpm: 5.20, cpqr: 2.67, freqCurve: [
    { freq: 1, qrrLift: 0.22, cpmAt: 4.40 }, { freq: 2, qrrLift: 0.38, cpmAt: 4.90 }, { freq: 3, qrrLift: 0.48, cpmAt: 5.20 },
    { freq: 4, qrrLift: 0.50, cpmAt: 5.80 }, { freq: 5, qrrLift: 0.49, cpmAt: 6.90 }, { freq: 6, qrrLift: 0.46, cpmAt: 8.10 },
  ]},
  { id: "google-display", name: "Google Display", icon: "▣", color: "#EA4335", impressions: 37200000, uniqueReach: 6200000, avgFreq: 6.0, optimalFreq: 2.0, cpm: 5.18, cpqr: 12.85, freqCurve: [
    { freq: 1, qrrLift: 0.14, cpmAt: 3.80 }, { freq: 2, qrrLift: 0.22, cpmAt: 4.40 }, { freq: 3, qrrLift: 0.24, cpmAt: 5.18 },
    { freq: 4, qrrLift: 0.23, cpmAt: 6.20 }, { freq: 5, qrrLift: 0.20, cpmAt: 7.80 }, { freq: 6, qrrLift: 0.16, cpmAt: 9.60 },
  ]},
  { id: "dv360", name: "DV360", icon: "◈", color: "#7C3AED", impressions: 29700000, uniqueReach: 5400000, avgFreq: 5.5, optimalFreq: 2.2, cpm: 5.45, cpqr: 10.13, freqCurve: [
    { freq: 1, qrrLift: 0.12, cpmAt: 4.00 }, { freq: 2, qrrLift: 0.20, cpmAt: 4.60 }, { freq: 3, qrrLift: 0.24, cpmAt: 5.45 },
    { freq: 4, qrrLift: 0.23, cpmAt: 6.80 }, { freq: 5, qrrLift: 0.20, cpmAt: 8.40 }, { freq: 6, qrrLift: 0.15, cpmAt: 10.20 },
  ]},
  { id: "tiktok", name: "TikTok", icon: "♪", color: "#010101", impressions: 18500000, uniqueReach: 8400000, avgFreq: 2.2, optimalFreq: 3.0, cpm: 8.40, cpqr: 2.73, freqCurve: [
    { freq: 1, qrrLift: 0.28, cpmAt: 7.20 }, { freq: 2, qrrLift: 0.52, cpmAt: 8.00 }, { freq: 3, qrrLift: 0.68, cpmAt: 8.40 },
    { freq: 4, qrrLift: 0.72, cpmAt: 9.20 }, { freq: 5, qrrLift: 0.70, cpmAt: 10.80 }, { freq: 6, qrrLift: 0.65, cpmAt: 12.40 },
  ]},
  { id: "youtube", name: "YouTube Ads", icon: "▶", color: "#FF0000", impressions: 23000000, uniqueReach: 9200000, avgFreq: 2.5, optimalFreq: 2.5, cpm: 9.74, cpqr: 5.46, freqCurve: [
    { freq: 1, qrrLift: 0.16, cpmAt: 8.20 }, { freq: 2, qrrLift: 0.30, cpmAt: 9.00 }, { freq: 3, qrrLift: 0.40, cpmAt: 9.74 },
    { freq: 4, qrrLift: 0.42, cpmAt: 11.20 }, { freq: 5, qrrLift: 0.40, cpmAt: 13.00 }, { freq: 6, qrrLift: 0.36, cpmAt: 15.20 },
  ]},
  { id: "linkedin", name: "LinkedIn Ads", icon: "in", color: "#0A66C2", impressions: 12000000, uniqueReach: 4800000, avgFreq: 2.5, optimalFreq: 2.8, cpm: 15.50, cpqr: 6.41, freqCurve: [
    { freq: 1, qrrLift: 0.20, cpmAt: 13.00 }, { freq: 2, qrrLift: 0.38, cpmAt: 14.60 }, { freq: 3, qrrLift: 0.52, cpmAt: 15.50 },
    { freq: 4, qrrLift: 0.56, cpmAt: 17.80 }, { freq: 5, qrrLift: 0.54, cpmAt: 20.40 }, { freq: 6, qrrLift: 0.48, cpmAt: 23.60 },
  ]},
];

export const freqWaste = FREQUENCY_DATA.map(ch => {
  const excessFreq = Math.max(0, ch.avgFreq - ch.optimalFreq);
  const excessImpressions = excessFreq * ch.uniqueReach;
  const wastedSpend = (excessImpressions / 1000) * ch.cpm;
  const status = ch.avgFreq > ch.optimalFreq * 1.5 ? "critical" : ch.avgFreq > ch.optimalFreq ? "over" : ch.avgFreq >= ch.optimalFreq * 0.8 ? "optimal" : "under";
  return { ...ch, excessFreq: +excessFreq.toFixed(1), excessImpressions, wastedSpend: Math.round(wastedSpend), status };
}).sort((a, b) => b.wastedSpend - a.wastedSpend);

export const totalFreqWaste = freqWaste.reduce((s, c) => s + c.wastedSpend, 0);

export const FREQ_INSIGHTS: Record<string, { verdict: string; detail: string }> = {
  "tiktok": { verdict: "Opportunity", detail: "Below optimal frequency — room to scale impressions and capture incremental QR without CPM inflation." },
  "youtube": { verdict: "Balanced", detail: "Frequency at optimal. CPM is high ($9.74) due to format premium, but each impression is working efficiently." },
  "linkedin": { verdict: "Watch", detail: "At optimal, but CPM is highest across the mix ($15.50). B2B targeting premium is expected — monitor for creep." },
  "instagram": { verdict: "Efficient", detail: "Slightly below optimal with strong QRR. Low CPM ($5.20) makes this the most cost-efficient frequency profile." },
  "facebook": { verdict: "Threshold", detail: "Frequency 0.5× above optimal. CPM starting to inflate. Cap at 2.5× or refresh creative to extend effectiveness." },
  "dv360": { verdict: "Over-exposed", detail: "5.5× is 2.5× past optimal. Each impression after 2.2× costs $6.80+ CPM while QRR has already peaked and declined." },
  "google-display": { verdict: "Critical", detail: "6.0× is 3× past optimal. QRR peaked at 2× and has declined 33%. You're paying $5.18 CPM for impressions that erode qualified reach." },
};

export const AGE_SEGMENTS: AgeSegment[] = [
  { label: "18–24", reach: 14200000, engaged: 8900000, spend: 18400, color: "#818CF8" },
  { label: "25–34", reach: 24800000, engaged: 12600000, spend: 32200, color: "#6366F1" },
  { label: "35–44", reach: 18600000, engaged: 11800000, spend: 24800, color: "#7C3AED" },
  { label: "45–54", reach: 12400000, engaged: 5200000, spend: 16400, color: "#9333EA" },
  { label: "55–64", reach: 8200000, engaged: 2800000, spend: 11200, color: "#A855F7" },
  { label: "65+", reach: 4800000, engaged: 1200000, spend: 5800, color: "#C084FC" },
];

export const AGE_BY_GENDER: Record<string, AgeSegment[]> = {
  Female: [
    { label: "18–24", reach: 8100000, engaged: 5600000, spend: 10800, color: "#818CF8" },
    { label: "25–34", reach: 14200000, engaged: 7900000, spend: 18600, color: "#6366F1" },
    { label: "35–44", reach: 10400000, engaged: 7200000, spend: 14200, color: "#7C3AED" },
    { label: "45–54", reach: 6800000, engaged: 3100000, spend: 8800, color: "#9333EA" },
    { label: "55–64", reach: 4200000, engaged: 1500000, spend: 5400, color: "#A855F7" },
    { label: "65+", reach: 2500000, engaged: 700000, spend: 2800, color: "#C084FC" },
  ],
  Male: [
    { label: "18–24", reach: 6100000, engaged: 3300000, spend: 7600, color: "#818CF8" },
    { label: "25–34", reach: 10600000, engaged: 4700000, spend: 13600, color: "#6366F1" },
    { label: "35–44", reach: 8200000, engaged: 4600000, spend: 10600, color: "#7C3AED" },
    { label: "45–54", reach: 5600000, engaged: 2100000, spend: 7600, color: "#9333EA" },
    { label: "55–64", reach: 4000000, engaged: 1300000, spend: 5800, color: "#A855F7" },
    { label: "65+", reach: 2300000, engaged: 500000, spend: 3000, color: "#C084FC" },
  ],
};

export const GENDER_DATA: GenderSegment[] = [
  { label: "Female", reach: 46200000, engaged: 24800000, spend: 56400, color: "#E4405F" },
  { label: "Male", reach: 32600000, engaged: 16400000, spend: 42200, color: "#4285F4" },
  { label: "Other", reach: 4200000, engaged: 1300000, spend: 10200, color: "#6E6E73" },
];

export const INTEREST_SEGMENTS: InterestSegment[] = [
  { name: "Tech Enthusiasts", reach: 12400000, engaged: 8700000, cper: 1.92, trend: 0.14, channels: { "Facebook": 0.58, "Instagram": 0.72, "TikTok": 0.82, "Google Search": 0.68, "Google Display": 0.42, "DV360": 0.48, "YouTube Ads": 0.62, "LinkedIn Ads": 0.54, "Pinterest Ads": 0.38, "Snapchat Ads": 0.58 } },
  { name: "Creative Professionals", reach: 9800000, engaged: 6500000, cper: 2.18, trend: 0.11, channels: { "Facebook": 0.52, "Instagram": 0.78, "TikTok": 0.74, "Google Search": 0.54, "Google Display": 0.36, "DV360": 0.40, "YouTube Ads": 0.56, "LinkedIn Ads": 0.48, "Pinterest Ads": 0.66, "Snapchat Ads": 0.44 } },
  { name: "Fitness & Wellness", reach: 8200000, engaged: 5100000, cper: 2.45, trend: 0.08, channels: { "Facebook": 0.56, "Instagram": 0.76, "TikTok": 0.70, "Google Search": 0.44, "Google Display": 0.30, "DV360": 0.34, "YouTube Ads": 0.60, "LinkedIn Ads": 0.22, "Pinterest Ads": 0.58, "Snapchat Ads": 0.48 } },
  { name: "Business Decision Makers", reach: 7600000, engaged: 4200000, cper: 3.10, trend: 0.06, channels: { "Facebook": 0.48, "Instagram": 0.42, "TikTok": 0.28, "Google Search": 0.72, "Google Display": 0.38, "DV360": 0.52, "YouTube Ads": 0.44, "LinkedIn Ads": 0.78, "Pinterest Ads": 0.20, "Snapchat Ads": 0.16 } },
  { name: "Fashion & Lifestyle", reach: 11200000, engaged: 5600000, cper: 2.82, trend: 0.09, channels: { "Facebook": 0.44, "Instagram": 0.74, "TikTok": 0.68, "Google Search": 0.32, "Google Display": 0.24, "DV360": 0.28, "YouTube Ads": 0.42, "LinkedIn Ads": 0.18, "Pinterest Ads": 0.72, "Snapchat Ads": 0.56 } },
  { name: "Parents", reach: 6800000, engaged: 3400000, cper: 3.40, trend: 0.04, channels: { "Facebook": 0.62, "Instagram": 0.54, "TikTok": 0.46, "Google Search": 0.40, "Google Display": 0.26, "DV360": 0.30, "YouTube Ads": 0.52, "LinkedIn Ads": 0.20, "Pinterest Ads": 0.48, "Snapchat Ads": 0.24 } },
  { name: "Gaming", reach: 8600000, engaged: 5800000, cper: 1.78, trend: 0.18, channels: { "Facebook": 0.42, "Instagram": 0.58, "TikTok": 0.88, "Google Search": 0.46, "Google Display": 0.52, "DV360": 0.56, "YouTube Ads": 0.74, "LinkedIn Ads": 0.14, "Pinterest Ads": 0.22, "Snapchat Ads": 0.70 } },
  { name: "Travel & Adventure", reach: 5400000, engaged: 2400000, cper: 3.85, trend: 0.03, channels: { "Facebook": 0.40, "Instagram": 0.56, "TikTok": 0.52, "Google Search": 0.36, "Google Display": 0.22, "DV360": 0.26, "YouTube Ads": 0.48, "LinkedIn Ads": 0.24, "Pinterest Ads": 0.54, "Snapchat Ads": 0.32 } },
];

export const SEGMENT_INSIGHTS: Record<string, { topChannels: string; why: string; action: string }> = {
  "Gaming": { topChannels: "TikTok (88%), YouTube (74%)", why: "Highest engagement-to-cost ratio across the mix. TikTok and YouTube dominate — this audience responds to immersive, creator-led formats. Scale aggressively here.", action: "Increase TikTok + YouTube budget by 20%" },
  "Tech Enthusiasts": { topChannels: "TikTok (82%), Instagram (72%)", why: "Strong QRR across most channels. Broad digital presence makes this segment low-risk for multi-channel campaigns. Tech content performs well on visual platforms.", action: "Test LinkedIn thought leadership for B2B crossover" },
  "Creative Professionals": { topChannels: "Instagram (78%), TikTok (74%)", why: "Visual-first audience that converts well on portfolio-style platforms. Pinterest also strong at 66%. Consider creative showcases over traditional ad formats.", action: "Shift budget toward Instagram Reels + Pinterest" },
  "Fitness & Wellness": { topChannels: "Instagram (76%), TikTok (70%)", why: "Strong mid-funnel engagement but CpQR is climbing. This segment responds to aspirational content — authenticity matters more than polish.", action: "Refresh creative with UGC-style content" },
  "Business Decision Makers": { topChannels: "LinkedIn (78%), Google Search (72%)", why: "Highest CpQR at $3.10 but justified by purchase intent. LinkedIn and Search capture high-intent moments. Low social engagement — don't force TikTok here.", action: "Double down on LinkedIn + Search, trim social" },
  "Fashion & Lifestyle": { topChannels: "Instagram (74%), Pinterest (72%)", why: "Good reach volume but mediocre QRR — lots of passive scrolling. Pinterest drives more qualified engagement than expected. Instagram needs creative refresh.", action: "Test Pinterest scale, audit IG creative fatigue" },
  "Parents": { topChannels: "Facebook (62%), Instagram (54%)", why: "Facebook is the standout channel — this older demo still lives there. High CpQR reflects smaller targetable pool. Worth maintaining but don't over-invest.", action: "Maintain Facebook presence, cap CpQR at $3.50" },
  "Travel & Adventure": { topChannels: "Instagram (56%), Pinterest (54%)", why: "Lowest QRR and highest CpQR — aspirational but low-converting. Consider as brand-building only, not performance. Seasonal spikes may improve metrics.", action: "Reduce to brand-only budget, revisit in peak season" },
};

export const HEATMAP_DATA: Record<string, Record<string, number>> = {
  "18–24": { "Facebook": 0.38, "Instagram": 0.58, "TikTok": 0.74, "Google Search": 0.32, "Google Display": 0.19, "DV360": 0.22, "YouTube Ads": 0.48, "LinkedIn Ads": 0.26, "Pinterest Ads": 0.52, "Snapchat Ads": 0.66 },
  "25–34": { "Facebook": 0.44, "Instagram": 0.56, "TikTok": 0.71, "Google Search": 0.42, "Google Display": 0.22, "DV360": 0.26, "YouTube Ads": 0.46, "LinkedIn Ads": 0.58, "Pinterest Ads": 0.48, "Snapchat Ads": 0.55 },
  "35–44": { "Facebook": 0.52, "Instagram": 0.61, "TikTok": 0.62, "Google Search": 0.48, "Google Display": 0.28, "DV360": 0.31, "YouTube Ads": 0.50, "LinkedIn Ads": 0.64, "Pinterest Ads": 0.54, "Snapchat Ads": 0.40 },
  "45–54": { "Facebook": 0.48, "Instagram": 0.42, "TikTok": 0.38, "Google Search": 0.44, "Google Display": 0.24, "DV360": 0.28, "YouTube Ads": 0.44, "LinkedIn Ads": 0.56, "Pinterest Ads": 0.46, "Snapchat Ads": 0.28 },
  "55–64": { "Facebook": 0.40, "Instagram": 0.31, "TikTok": 0.22, "Google Search": 0.38, "Google Display": 0.20, "DV360": 0.24, "YouTube Ads": 0.38, "LinkedIn Ads": 0.42, "Pinterest Ads": 0.34, "Snapchat Ads": 0.16 },
  "65+": { "Facebook": 0.32, "Instagram": 0.20, "TikTok": 0.14, "Google Search": 0.28, "Google Display": 0.16, "DV360": 0.18, "YouTube Ads": 0.30, "LinkedIn Ads": 0.32, "Pinterest Ads": 0.22, "Snapchat Ads": 0.10 },
};

export const ATTENTION_GAPS = [
  { segment: "25–34 Males", current: { channel: "Google Display", qrr: 0.18, cpqr: 6.40, spend: 14200 }, better: { channel: "Instagram", qrr: 0.61, cpqr: 2.30 }, savingsPercent: 64 },
  { segment: "18–24 Females", current: { channel: "DV360", qrr: 0.21, cpqr: 8.20, spend: 8400 }, better: { channel: "TikTok", qrr: 0.76, cpqr: 1.65 }, savingsPercent: 80 },
  { segment: "45–54 Mixed", current: { channel: "TikTok", qrr: 0.38, cpqr: 3.10, spend: 6200 }, better: { channel: "Facebook", qrr: 0.48, cpqr: 2.85 }, savingsPercent: 8 },
];

export const GEO_COUNTRIES: GeoCountry[] = [
  { code: "US", name: "United States", flag: "🇺🇸", reach: 28400000, engaged: 14200000, spend: 38600, penetration: 0.52, trend: 0.12,
    channels: { "Facebook": 0.46, "Instagram": 0.54, "TikTok": 0.72, "Google Search": 0.41, "Google Display": 0.22, "DV360": 0.28, "YouTube Ads": 0.52, "LinkedIn Ads": 0.38, "Pinterest Ads": 0.44, "Snapchat Ads": 0.48 },
    cities: [
      { name: "New York", reach: 6200000, engaged: 3400000, spend: 9200 },
      { name: "Los Angeles", reach: 4800000, engaged: 2600000, spend: 7100 },
      { name: "Chicago", reach: 3100000, engaged: 1500000, spend: 4800 },
      { name: "San Francisco", reach: 2400000, engaged: 1600000, spend: 3200 },
      { name: "Miami", reach: 1900000, engaged: 880000, spend: 2800 },
      { name: "Austin", reach: 1600000, engaged: 1100000, spend: 2400 },
      { name: "Seattle", reach: 1400000, engaged: 920000, spend: 2100 },
      { name: "Boston", reach: 1200000, engaged: 680000, spend: 1800 },
    ]},
  { code: "DE", name: "Germany", flag: "🇩🇪", reach: 14800000, engaged: 9100000, spend: 18200, penetration: 0.48, trend: 0.09,
    channels: { "Facebook": 0.52, "Instagram": 0.62, "TikTok": 0.58, "Google Search": 0.48, "Google Display": 0.26, "DV360": 0.30, "YouTube Ads": 0.46, "LinkedIn Ads": 0.44, "Pinterest Ads": 0.36, "Snapchat Ads": 0.32 },
    cities: [
      { name: "Berlin", reach: 3600000, engaged: 2400000, spend: 4200 },
      { name: "Munich", reach: 2800000, engaged: 1900000, spend: 3600 },
      { name: "Hamburg", reach: 2100000, engaged: 1200000, spend: 2800 },
      { name: "Frankfurt", reach: 1800000, engaged: 1100000, spend: 2400 },
      { name: "Cologne", reach: 1400000, engaged: 780000, spend: 1600 },
      { name: "Stuttgart", reach: 1100000, engaged: 680000, spend: 1200 },
    ]},
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", reach: 16200000, engaged: 9800000, spend: 22400, penetration: 0.54, trend: 0.11,
    channels: { "Facebook": 0.48, "Instagram": 0.58, "TikTok": 0.68, "Google Search": 0.44, "Google Display": 0.24, "DV360": 0.26, "YouTube Ads": 0.50, "LinkedIn Ads": 0.42, "Pinterest Ads": 0.40, "Snapchat Ads": 0.44 },
    cities: [
      { name: "London", reach: 5800000, engaged: 3800000, spend: 8200 },
      { name: "Manchester", reach: 2400000, engaged: 1400000, spend: 3200 },
      { name: "Birmingham", reach: 1800000, engaged: 980000, spend: 2400 },
      { name: "Edinburgh", reach: 1200000, engaged: 780000, spend: 1600 },
      { name: "Bristol", reach: 980000, engaged: 620000, spend: 1200 },
      { name: "Leeds", reach: 860000, engaged: 440000, spend: 980 },
    ]},
  { code: "FR", name: "France", flag: "🇫🇷", reach: 11200000, engaged: 5800000, spend: 14600, penetration: 0.42, trend: 0.07,
    channels: { "Facebook": 0.42, "Instagram": 0.52, "TikTok": 0.64, "Google Search": 0.38, "Google Display": 0.20, "DV360": 0.24, "YouTube Ads": 0.44, "LinkedIn Ads": 0.34, "Pinterest Ads": 0.38, "Snapchat Ads": 0.42 },
    cities: [
      { name: "Paris", reach: 4200000, engaged: 2400000, spend: 5800 },
      { name: "Lyon", reach: 1600000, engaged: 820000, spend: 2100 },
      { name: "Marseille", reach: 1400000, engaged: 640000, spend: 1800 },
      { name: "Toulouse", reach: 920000, engaged: 480000, spend: 1200 },
      { name: "Bordeaux", reach: 780000, engaged: 420000, spend: 980 },
    ]},
  { code: "CH", name: "Switzerland", flag: "🇨🇭", reach: 4200000, engaged: 2800000, spend: 8400, penetration: 0.58, trend: 0.08,
    channels: { "Facebook": 0.56, "Instagram": 0.66, "TikTok": 0.52, "Google Search": 0.52, "Google Display": 0.32, "DV360": 0.36, "YouTube Ads": 0.48, "LinkedIn Ads": 0.54, "Pinterest Ads": 0.34, "Snapchat Ads": 0.30 },
    cities: [
      { name: "Zurich", reach: 1400000, engaged: 980000, spend: 2800 },
      { name: "Geneva", reach: 920000, engaged: 620000, spend: 1900 },
      { name: "Basel", reach: 680000, engaged: 440000, spend: 1200 },
      { name: "Bern", reach: 520000, engaged: 340000, spend: 980 },
    ]},
  { code: "IE", name: "Ireland", flag: "🇮🇪", reach: 3200000, engaged: 2100000, spend: 4800, penetration: 0.62, trend: 0.14,
    channels: { "Facebook": 0.58, "Instagram": 0.64, "TikTok": 0.71, "Google Search": 0.46, "Google Display": 0.28, "DV360": 0.32, "YouTube Ads": 0.48, "LinkedIn Ads": 0.40, "Pinterest Ads": 0.36, "Snapchat Ads": 0.38 },
    cities: [
      { name: "Dublin", reach: 1600000, engaged: 1100000, spend: 2400 },
      { name: "Cork", reach: 620000, engaged: 420000, spend: 920 },
      { name: "Galway", reach: 380000, engaged: 260000, spend: 580 },
      { name: "Limerick", reach: 280000, engaged: 180000, spend: 420 },
    ]},
  { code: "AT", name: "Austria", flag: "🇦🇹", reach: 3800000, engaged: 2400000, spend: 5200, penetration: 0.46, trend: 0.06,
    channels: { "Facebook": 0.54, "Instagram": 0.60, "TikTok": 0.54, "Google Search": 0.46, "Google Display": 0.28, "DV360": 0.30, "YouTube Ads": 0.44, "LinkedIn Ads": 0.42, "Pinterest Ads": 0.32, "Snapchat Ads": 0.28 },
    cities: [
      { name: "Vienna", reach: 1800000, engaged: 1200000, spend: 2600 },
      { name: "Graz", reach: 620000, engaged: 380000, spend: 820 },
      { name: "Salzburg", reach: 480000, engaged: 320000, spend: 680 },
      { name: "Innsbruck", reach: 360000, engaged: 220000, spend: 480 },
    ]},
  { code: "IT", name: "Italy", flag: "🇮🇹", reach: 9600000, engaged: 5200000, spend: 12800, penetration: 0.38, trend: 0.10,
    channels: { "Facebook": 0.44, "Instagram": 0.56, "TikTok": 0.66, "Google Search": 0.36, "Google Display": 0.18, "DV360": 0.22, "YouTube Ads": 0.42, "LinkedIn Ads": 0.30, "Pinterest Ads": 0.34, "Snapchat Ads": 0.40 },
    cities: [
      { name: "Milan", reach: 2800000, engaged: 1600000, spend: 3800 },
      { name: "Rome", reach: 2400000, engaged: 1200000, spend: 3200 },
      { name: "Turin", reach: 1200000, engaged: 680000, spend: 1600 },
      { name: "Florence", reach: 860000, engaged: 520000, spend: 1100 },
      { name: "Naples", reach: 780000, engaged: 340000, spend: 880 },
    ]},
];

export const FLAG_STRIPES: Record<string, [string, string, string]> = {
  US: ["#B22234","#fff","#3C3B6E"], DE: ["#000","#DD0000","#FFCC00"], GB: ["#012169","#C8102E","#fff"],
  FR: ["#002395","#fff","#ED2939"], CH: ["#DA291C","#fff","#DA291C"], IE: ["#169B62","#fff","#FF883E"],
  AT: ["#ED2939","#fff","#ED2939"], IT: ["#008C45","#fff","#CD212A"],
};

// ─── PALETTE ──────────────────────────────────────────────────

export const P = {
  bg: "#f5f5f7", card: "#ffffff",
  shadow: "0 0.5px 1px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)",
  border: "rgba(0,0,0,0.04)", text1: "#1d1d1f", text2: "#6e6e73", text3: "#aeaeb2",
  divider: "rgba(0,0,0,0.06)", accent: "#7C3AED", accentSoft: "rgba(124,58,237,0.07)",
  accentFaint: "rgba(124,58,237,0.03)", barGrey: "#ececf0",
  warn: "#bf5a00", warnBg: "rgba(191,90,0,0.05)",
  danger: "#c23030", dangerBg: "rgba(194,48,48,0.04)",
  caution: "#b38200", cautionBg: "rgba(179,130,0,0.05)",
};

// ─── HELPERS ──────────────────────────────────────────────────

export const fmt = (n: number): string => {
  if (n == null || isNaN(n)) return "—";
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toFixed(0);
};

export const fmtPct = (n: number): string => (n == null || isNaN(n) ? "—" : `${(n * 100).toFixed(0)}%`);
export const fmtMoney = (n: number): string => (n == null || isNaN(n) ? "—" : n === 0 ? "$0" : `$${n.toFixed(2)}`);
export const fmtSpend = (n: number): string => (n == null || isNaN(n) ? "—" : n >= 1000 ? `$${(n / 1000).toFixed(0)}K` : `$${n}`);
