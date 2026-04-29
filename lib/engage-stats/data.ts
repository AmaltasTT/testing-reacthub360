// ─── ENGAGE-STATS DATA LAYER ─────────────────────────────────
// Re-exports shared items from reach-stats, defines engage-specific data

export { P, CAMPAIGNS, PERIOD_OPTIONS, fmt, fmtPct, fmtMoney, fmtSpend } from "@/lib/reach-stats/data";
export type { Campaign, PeriodOption } from "@/lib/reach-stats/data";

// ─── ENGAGE CHANNEL INTERFACE ────────────────────────────────

export interface EngageChannel {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: string;
  subtype: "paid" | "organic";
  cpe: number;       // Cost per Engagement
  cpqe: number;      // Cost per Qualified Engagement
  cpqeGap: number;   // Gap between CPE and CPQE (%)
  eis: number;        // Engagement Impact Score (0-10)
  eqs: number;        // Engagement Quality Score (0-10)
  esr: number;        // Engagement Sustainability Rate (0-1)
  action: string;     // SCALE | HOLD | FIX | AUDIT
  actionColor: string;
  t1Volume: number;   // Tier 1 (Low depth) engagements
  t2Volume: number;   // Tier 2 (Medium depth) engagements
  t3Volume: number;   // Tier 3 (High depth) engagements
  totalEngagements: number;
}

// ─── ENGAGE TOTALS ───────────────────────────────────────────

export const ENGAGE_TOTALS = {
  eis: 6.8,
  eisTarget: 8.3,
  eisPrior: 6.5,
  eqs: 7.0,
  eqsTarget: 6.8,
  eqsPrior: 6.8,
  esr: 0.65,
  esrTarget: 0.83,
  esrPrior: 0.62,
  cpqe: 0.80,
  cpqeTarget: 0.87,
  cpqePrior: 0.92,
};

// ─── 37 ENGAGE CHANNELS ─────────────────────────────────────

export const ENGAGE_CHANNELS: EngageChannel[] = [
  // Paid Social
  { id: "facebook-feed", name: "Facebook Feed", icon: "f", color: "#1877F2", type: "social", subtype: "paid", cpe: 0.42, cpqe: 0.68, cpqeGap: 62, eis: 5.8, eqs: 5.2, esr: 0.48, action: "FIX", actionColor: "#EF4444", t1Volume: 28400, t2Volume: 12600, t3Volume: 4200, totalEngagements: 45200 },
  { id: "facebook-stories", name: "Facebook Stories", icon: "f", color: "#1877F2", type: "social", subtype: "paid", cpe: 0.38, cpqe: 0.72, cpqeGap: 89, eis: 4.9, eqs: 4.4, esr: 0.42, action: "FIX", actionColor: "#EF4444", t1Volume: 18200, t2Volume: 6800, t3Volume: 1900, totalEngagements: 26900 },
  { id: "facebook-reels", name: "Facebook Reels", icon: "f", color: "#1877F2", type: "social", subtype: "paid", cpe: 0.35, cpqe: 0.58, cpqeGap: 66, eis: 6.2, eqs: 5.8, esr: 0.52, action: "HOLD", actionColor: "#F59E0B", t1Volume: 14600, t2Volume: 8400, t3Volume: 3100, totalEngagements: 26100 },
  { id: "instagram-feed", name: "Instagram Feed", icon: "◎", color: "#E4405F", type: "social", subtype: "paid", cpe: 0.48, cpqe: 0.62, cpqeGap: 29, eis: 7.4, eqs: 7.8, esr: 0.72, action: "SCALE", actionColor: "#22C55E", t1Volume: 12200, t2Volume: 18400, t3Volume: 8600, totalEngagements: 39200 },
  { id: "instagram-stories", name: "Instagram Stories", icon: "◎", color: "#E4405F", type: "social", subtype: "paid", cpe: 0.32, cpqe: 0.54, cpqeGap: 69, eis: 6.8, eqs: 6.4, esr: 0.58, action: "HOLD", actionColor: "#F59E0B", t1Volume: 22100, t2Volume: 14800, t3Volume: 5200, totalEngagements: 42100 },
  { id: "instagram-reels", name: "Instagram Reels", icon: "◎", color: "#E4405F", type: "social", subtype: "paid", cpe: 0.28, cpqe: 0.44, cpqeGap: 57, eis: 8.1, eqs: 8.4, esr: 0.78, action: "SCALE", actionColor: "#22C55E", t1Volume: 8400, t2Volume: 16200, t3Volume: 12800, totalEngagements: 37400 },
  { id: "tiktok-infeed", name: "TikTok In-Feed", icon: "♪", color: "#010101", type: "social", subtype: "paid", cpe: 0.22, cpqe: 0.38, cpqeGap: 73, eis: 8.4, eqs: 8.2, esr: 0.74, action: "SCALE", actionColor: "#22C55E", t1Volume: 9200, t2Volume: 18600, t3Volume: 14200, totalEngagements: 42000 },
  { id: "tiktok-topview", name: "TikTok TopView", icon: "♪", color: "#010101", type: "social", subtype: "paid", cpe: 0.85, cpqe: 1.12, cpqeGap: 32, eis: 7.2, eqs: 7.6, esr: 0.68, action: "HOLD", actionColor: "#F59E0B", t1Volume: 6800, t2Volume: 8400, t3Volume: 5600, totalEngagements: 20800 },
  { id: "tiktok-spark", name: "TikTok Spark Ads", icon: "♪", color: "#010101", type: "social", subtype: "paid", cpe: 0.18, cpqe: 0.32, cpqeGap: 78, eis: 8.8, eqs: 8.6, esr: 0.82, action: "SCALE", actionColor: "#22C55E", t1Volume: 5400, t2Volume: 12800, t3Volume: 16400, totalEngagements: 34600 },
  { id: "linkedin-feed", name: "LinkedIn Feed", icon: "in", color: "#0A66C2", type: "social", subtype: "paid", cpe: 1.24, cpqe: 1.48, cpqeGap: 19, eis: 8.2, eqs: 8.8, esr: 0.84, action: "SCALE", actionColor: "#22C55E", t1Volume: 3200, t2Volume: 8600, t3Volume: 11400, totalEngagements: 23200 },
  { id: "linkedin-message", name: "LinkedIn Message", icon: "in", color: "#0A66C2", type: "social", subtype: "paid", cpe: 2.80, cpqe: 3.20, cpqeGap: 14, eis: 7.8, eqs: 8.4, esr: 0.80, action: "HOLD", actionColor: "#F59E0B", t1Volume: 1800, t2Volume: 4200, t3Volume: 6800, totalEngagements: 12800 },
  { id: "pinterest-standard", name: "Pinterest Standard", icon: "P", color: "#E60023", type: "social", subtype: "paid", cpe: 0.36, cpqe: 0.58, cpqeGap: 61, eis: 6.4, eqs: 6.2, esr: 0.56, action: "HOLD", actionColor: "#F59E0B", t1Volume: 10800, t2Volume: 7200, t3Volume: 3400, totalEngagements: 21400 },
  { id: "pinterest-idea", name: "Pinterest Idea Pins", icon: "P", color: "#E60023", type: "social", subtype: "paid", cpe: 0.42, cpqe: 0.52, cpqeGap: 24, eis: 7.0, eqs: 7.2, esr: 0.64, action: "SCALE", actionColor: "#22C55E", t1Volume: 6400, t2Volume: 9800, t3Volume: 5600, totalEngagements: 21800 },
  { id: "snapchat-ads", name: "Snapchat Ads", icon: "👻", color: "#F7D731", type: "social", subtype: "paid", cpe: 0.26, cpqe: 0.48, cpqeGap: 85, eis: 5.4, eqs: 4.8, esr: 0.44, action: "AUDIT", actionColor: "#8B5CF6", t1Volume: 16200, t2Volume: 6400, t3Volume: 2200, totalEngagements: 24800 },
  // Paid Video
  { id: "youtube-instream", name: "YouTube In-Stream", icon: "▶", color: "#FF0000", type: "video", subtype: "paid", cpe: 0.08, cpqe: 0.28, cpqeGap: 250, eis: 5.2, eqs: 4.6, esr: 0.38, action: "FIX", actionColor: "#EF4444", t1Volume: 32400, t2Volume: 8200, t3Volume: 2800, totalEngagements: 43400 },
  { id: "youtube-discovery", name: "YouTube Discovery", icon: "▶", color: "#FF0000", type: "video", subtype: "paid", cpe: 0.32, cpqe: 0.46, cpqeGap: 44, eis: 7.0, eqs: 7.4, esr: 0.66, action: "SCALE", actionColor: "#22C55E", t1Volume: 8600, t2Volume: 12400, t3Volume: 7200, totalEngagements: 28200 },
  { id: "youtube-shorts", name: "YouTube Shorts", icon: "▶", color: "#FF0000", type: "video", subtype: "paid", cpe: 0.14, cpqe: 0.36, cpqeGap: 157, eis: 6.6, eqs: 6.0, esr: 0.52, action: "HOLD", actionColor: "#F59E0B", t1Volume: 18400, t2Volume: 10200, t3Volume: 4600, totalEngagements: 33200 },
  // Paid Display
  { id: "gdn-standard", name: "GDN Standard", icon: "▣", color: "#EA4335", type: "display", subtype: "paid", cpe: 0.06, cpqe: 0.42, cpqeGap: 600, eis: 3.2, eqs: 2.8, esr: 0.22, action: "AUDIT", actionColor: "#8B5CF6", t1Volume: 38600, t2Volume: 4200, t3Volume: 800, totalEngagements: 43600 },
  { id: "gdn-responsive", name: "GDN Responsive", icon: "▣", color: "#EA4335", type: "display", subtype: "paid", cpe: 0.08, cpqe: 0.38, cpqeGap: 375, eis: 3.8, eqs: 3.2, esr: 0.26, action: "AUDIT", actionColor: "#8B5CF6", t1Volume: 34200, t2Volume: 5800, t3Volume: 1200, totalEngagements: 41200 },
  { id: "dv360-display", name: "DV360 Display", icon: "◈", color: "#7C3AED", type: "display", subtype: "paid", cpe: 0.10, cpqe: 0.44, cpqeGap: 340, eis: 3.6, eqs: 3.0, esr: 0.24, action: "AUDIT", actionColor: "#8B5CF6", t1Volume: 36400, t2Volume: 4800, t3Volume: 1000, totalEngagements: 42200 },
  { id: "dv360-video", name: "DV360 Video", icon: "◈", color: "#7C3AED", type: "display", subtype: "paid", cpe: 0.18, cpqe: 0.52, cpqeGap: 189, eis: 5.0, eqs: 4.8, esr: 0.40, action: "FIX", actionColor: "#EF4444", t1Volume: 22800, t2Volume: 8400, t3Volume: 3200, totalEngagements: 34400 },
  // Paid Search
  { id: "google-search", name: "Google Search", icon: "G", color: "#4285F4", type: "search", subtype: "paid", cpe: 1.82, cpqe: 2.04, cpqeGap: 12, eis: 8.6, eqs: 9.0, esr: 0.88, action: "SCALE", actionColor: "#22C55E", t1Volume: 2400, t2Volume: 6800, t3Volume: 14200, totalEngagements: 23400 },
  { id: "microsoft-search", name: "Microsoft Search", icon: "M", color: "#00A4EF", type: "search", subtype: "paid", cpe: 1.48, cpqe: 1.72, cpqeGap: 16, eis: 7.8, eqs: 8.2, esr: 0.82, action: "SCALE", actionColor: "#22C55E", t1Volume: 1800, t2Volume: 4400, t3Volume: 8200, totalEngagements: 14400 },
  // Paid Native
  { id: "outbrain", name: "Outbrain", icon: "O", color: "#E65100", type: "native", subtype: "paid", cpe: 0.14, cpqe: 0.48, cpqeGap: 243, eis: 4.4, eqs: 3.8, esr: 0.32, action: "FIX", actionColor: "#EF4444", t1Volume: 24600, t2Volume: 6200, t3Volume: 1800, totalEngagements: 32600 },
  { id: "taboola", name: "Taboola", icon: "T", color: "#1A56DB", type: "native", subtype: "paid", cpe: 0.12, cpqe: 0.46, cpqeGap: 283, eis: 4.2, eqs: 3.6, esr: 0.30, action: "FIX", actionColor: "#EF4444", t1Volume: 26800, t2Volume: 5800, t3Volume: 1400, totalEngagements: 34000 },
  // Organic Social
  { id: "instagram-organic", name: "Instagram Organic", icon: "◎", color: "#E4405F", type: "social", subtype: "organic", cpe: 0, cpqe: 0, cpqeGap: 0, eis: 7.8, eqs: 8.0, esr: 0.76, action: "SCALE", actionColor: "#22C55E", t1Volume: 8200, t2Volume: 14600, t3Volume: 10400, totalEngagements: 33200 },
  { id: "facebook-organic", name: "Facebook Organic", icon: "f", color: "#1877F2", type: "social", subtype: "organic", cpe: 0, cpqe: 0, cpqeGap: 0, eis: 5.4, eqs: 5.0, esr: 0.46, action: "HOLD", actionColor: "#F59E0B", t1Volume: 18400, t2Volume: 8600, t3Volume: 3200, totalEngagements: 30200 },
  { id: "tiktok-organic", name: "TikTok Organic", icon: "♪", color: "#010101", type: "social", subtype: "organic", cpe: 0, cpqe: 0, cpqeGap: 0, eis: 8.6, eqs: 8.4, esr: 0.80, action: "SCALE", actionColor: "#22C55E", t1Volume: 6800, t2Volume: 14200, t3Volume: 12600, totalEngagements: 33600 },
  { id: "linkedin-organic", name: "LinkedIn Organic", icon: "in", color: "#0A66C2", type: "social", subtype: "organic", cpe: 0, cpqe: 0, cpqeGap: 0, eis: 7.6, eqs: 8.2, esr: 0.78, action: "SCALE", actionColor: "#22C55E", t1Volume: 4200, t2Volume: 9800, t3Volume: 8400, totalEngagements: 22400 },
  { id: "youtube-organic", name: "YouTube Organic", icon: "▶", color: "#FF0000", type: "video", subtype: "organic", cpe: 0, cpqe: 0, cpqeGap: 0, eis: 7.2, eqs: 7.6, esr: 0.70, action: "SCALE", actionColor: "#22C55E", t1Volume: 6400, t2Volume: 11200, t3Volume: 8800, totalEngagements: 26400 },
  { id: "pinterest-organic", name: "Pinterest Organic", icon: "P", color: "#E60023", type: "social", subtype: "organic", cpe: 0, cpqe: 0, cpqeGap: 0, eis: 6.8, eqs: 7.0, esr: 0.62, action: "HOLD", actionColor: "#F59E0B", t1Volume: 8800, t2Volume: 10200, t3Volume: 5400, totalEngagements: 24400 },
  // Organic Search & Email
  { id: "organic-search", name: "Organic Search", icon: "◉", color: "#34A853", type: "search", subtype: "organic", cpe: 0, cpqe: 0, cpqeGap: 0, eis: 8.4, eqs: 8.8, esr: 0.86, action: "SCALE", actionColor: "#22C55E", t1Volume: 3200, t2Volume: 8400, t3Volume: 12800, totalEngagements: 24400 },
  { id: "email", name: "Email", icon: "✉", color: "#6366F1", type: "direct", subtype: "organic", cpe: 0, cpqe: 0, cpqeGap: 0, eis: 8.0, eqs: 8.6, esr: 0.84, action: "SCALE", actionColor: "#22C55E", t1Volume: 2800, t2Volume: 7200, t3Volume: 11600, totalEngagements: 21600 },
  // Additional Paid
  { id: "reddit-ads", name: "Reddit Ads", icon: "R", color: "#FF4500", type: "social", subtype: "paid", cpe: 0.34, cpqe: 0.56, cpqeGap: 65, eis: 6.6, eqs: 6.8, esr: 0.60, action: "HOLD", actionColor: "#F59E0B", t1Volume: 9800, t2Volume: 8400, t3Volume: 4600, totalEngagements: 22800 },
  { id: "twitter-ads", name: "X (Twitter) Ads", icon: "𝕏", color: "#000000", type: "social", subtype: "paid", cpe: 0.52, cpqe: 0.78, cpqeGap: 50, eis: 5.6, eqs: 5.4, esr: 0.46, action: "HOLD", actionColor: "#F59E0B", t1Volume: 14200, t2Volume: 8600, t3Volume: 3400, totalEngagements: 26200 },
  { id: "spotify-ads", name: "Spotify Ads", icon: "♫", color: "#1DB954", type: "audio", subtype: "paid", cpe: 0.18, cpqe: 0.42, cpqeGap: 133, eis: 5.0, eqs: 4.6, esr: 0.38, action: "FIX", actionColor: "#EF4444", t1Volume: 20400, t2Volume: 6800, t3Volume: 2400, totalEngagements: 29600 },
  { id: "programmatic-audio", name: "Programmatic Audio", icon: "🎧", color: "#8B5CF6", type: "audio", subtype: "paid", cpe: 0.16, cpqe: 0.40, cpqeGap: 150, eis: 4.8, eqs: 4.4, esr: 0.36, action: "FIX", actionColor: "#EF4444", t1Volume: 21600, t2Volume: 6200, t3Volume: 2000, totalEngagements: 29800 },
];

// ─── EIS/EQS/ESR TREND DATA (7 weeks) ───────────────────────
// ESR is stored as an integer percentage (e.g. 68 = 68%) to match the
// 0-100 Y-axis domain used when the ESR metric tab is selected.

export const EIS_TREND_DATA = [
  { week: "W-6", eis: 5.4, eqs: 6.2, esr: 62 },
  { week: "W-5", eis: 5.6, eqs: 6.4, esr: 63 },
  { week: "W-4", eis: 6.0, eqs: 6.6, esr: 64 },
  { week: "W-3", eis: 6.1, eqs: 6.8, esr: 65 },
  { week: "W-2", eis: 6.2, eqs: 6.9, esr: 66 },
  { week: "W-1", eis: 6.5, eqs: 7.0, esr: 67 },
  { week: "Now",  eis: 6.8, eqs: 7.2, esr: 68 },
];

// ─── CHANNEL BREAKDOWNS FOR EIS/EQS/ESR BAR CHARTS ──────────
// color  → channel brand colour (icon square background)
// barColor → performance-tier colour for the horizontal bar:
//   #7652B3 / #8B5FD6 / #6B4FA3 = high tier
//   #9F8CD9 / #A890E0 / #9B87C4 = mid tier
//   #FF9B9B                     = low tier

export const EIS_CHANNEL_DATA = [
  { name: "LinkedIn",    icon: "in", color: "#0A66C2", barColor: "#7652B3", value: 8.2, change:  0.4, eqs: 8.6, esr: 86 },
  { name: "TikTok",     icon: "♪",  color: "#010101", barColor: "#7652B3", value: 7.4, change:  0.6, eqs: 7.8, esr: 78 },
  { name: "YouTube",    icon: "▶",  color: "#FF0000", barColor: "#7652B3", value: 6.8, change:  0.2, eqs: 7.1, esr: 71 },
  { name: "Google PPC", icon: "G",  color: "#4285F4", barColor: "#9F8CD9", value: 6.2, change:  0.0, eqs: 6.0, esr: 60 },
  { name: "Instagram",  icon: "◎",  color: "#E4405F", barColor: "#9F8CD9", value: 5.6, change: -0.2, eqs: 5.4, esr: 54 },
  { name: "Facebook",   icon: "f",  color: "#1877F2", barColor: "#9F8CD9", value: 4.8, change: -0.3, eqs: 4.6, esr: 46 },
  { name: "GDN",        icon: "▣",  color: "#EA4335", barColor: "#FF9B9B", value: 3.2, change: -0.5, eqs: 2.8, esr: 28 },
];

export const EQS_CHANNEL_DATA = [
  { name: "LinkedIn",    icon: "in", color: "#0A66C2", barColor: "#8B5FD6", value: 8.6, change:  0.5, esr: 86, eis: 8.2 },
  { name: "TikTok",     icon: "♪",  color: "#010101", barColor: "#8B5FD6", value: 7.8, change:  0.4, esr: 78, eis: 7.4 },
  { name: "YouTube",    icon: "▶",  color: "#FF0000", barColor: "#8B5FD6", value: 7.1, change:  0.1, esr: 71, eis: 6.8 },
  { name: "Google PPC", icon: "G",  color: "#4285F4", barColor: "#A890E0", value: 6.0, change:  0.0, esr: 60, eis: 6.2 },
  { name: "Instagram",  icon: "◎",  color: "#E4405F", barColor: "#FF9B9B", value: 5.4, change: -0.3, esr: 54, eis: 5.6 },
  { name: "Facebook",   icon: "f",  color: "#1877F2", barColor: "#FF9B9B", value: 4.6, change: -0.2, esr: 46, eis: 4.8 },
  { name: "GDN",        icon: "▣",  color: "#EA4335", barColor: "#FF9B9B", value: 2.8, change: -0.4, esr: 28, eis: 3.2 },
];

// ESR values are integer percentages (86 = 86%) — already on the 0-100 scale
// used by the chart Y-axis and bar-width calculation.
export const ESR_CHANNEL_DATA = [
  { name: "LinkedIn",    icon: "in", color: "#0A66C2", barColor: "#6B4FA3", value: 86, change:  0.5, eqs: 8.6, eis: 8.2 },
  { name: "TikTok",     icon: "♪",  color: "#010101", barColor: "#6B4FA3", value: 78, change:  0.4, eqs: 7.8, eis: 7.4 },
  { name: "YouTube",    icon: "▶",  color: "#FF0000", barColor: "#6B4FA3", value: 71, change:  0.1, eqs: 7.1, eis: 6.8 },
  { name: "Google PPC", icon: "G",  color: "#4285F4", barColor: "#9B87C4", value: 60, change:  0.0, eqs: 6.0, eis: 6.2 },
  { name: "Instagram",  icon: "◎",  color: "#E4405F", barColor: "#FF9B9B", value: 54, change: -0.3, eqs: 5.4, eis: 5.6 },
  { name: "Facebook",   icon: "f",  color: "#1877F2", barColor: "#FF9B9B", value: 46, change: -0.2, eqs: 4.6, eis: 4.8 },
  { name: "GDN",        icon: "▣",  color: "#EA4335", barColor: "#FF9B9B", value: 28, change: -0.4, eqs: 2.8, eis: 3.2 },
];

// ─── ATTENTION DECAY DATA ────────────────────────────────────

export interface DecayPoint {
  time: string;
  [key: string]: number | string;
}

export const ATTENTION_DECAY_DATA: DecayPoint[] = [
  { time: "0s", "Facebook": 100, "Instagram": 100, "TikTok": 100, "LinkedIn": 100, "YouTube": 100, "GDN": 100 },
  { time: "3s", "Facebook": 72, "Instagram": 78, "TikTok": 88, "LinkedIn": 82, "YouTube": 68, "GDN": 45 },
  { time: "6s", "Facebook": 54, "Instagram": 62, "TikTok": 76, "LinkedIn": 74, "YouTube": 52, "GDN": 28 },
  { time: "10s", "Facebook": 38, "Instagram": 48, "TikTok": 64, "LinkedIn": 66, "YouTube": 42, "GDN": 18 },
  { time: "15s", "Facebook": 26, "Instagram": 36, "TikTok": 52, "LinkedIn": 58, "YouTube": 34, "GDN": 12 },
  { time: "30s", "Facebook": 14, "Instagram": 22, "TikTok": 38, "LinkedIn": 48, "YouTube": 24, "GDN": 6 },
  { time: "Complete", "Facebook": 8, "Instagram": 14, "TikTok": 28, "LinkedIn": 42, "YouTube": 18, "GDN": 3 },
];

export const FORMAT_DECAY_DATA: DecayPoint[] = [
  { time: "0s", "Video": 100, "Carousel": 100, "Static": 100, "Stories": 100, "Text": 100 },
  { time: "3s", "Video": 82, "Carousel": 76, "Static": 58, "Stories": 84, "Text": 72 },
  { time: "6s", "Video": 68, "Carousel": 62, "Static": 38, "Stories": 72, "Text": 64 },
  { time: "10s", "Video": 54, "Carousel": 52, "Static": 24, "Stories": 58, "Text": 56 },
  { time: "15s", "Video": 42, "Carousel": 44, "Static": 16, "Stories": 44, "Text": 48 },
  { time: "30s", "Video": 28, "Carousel": 32, "Static": 8, "Stories": 28, "Text": 38 },
  { time: "Complete", "Video": 18, "Carousel": 24, "Static": 4, "Stories": 16, "Text": 32 },
];

export const CHANNEL_DECAY_COLORS: Record<string, string> = {
  "Facebook": "#1877F2", "Instagram": "#E4405F", "TikTok": "#010101",
  "LinkedIn": "#0A66C2", "YouTube": "#FF0000", "GDN": "#EA4335",
};

export const FORMAT_DECAY_COLORS: Record<string, string> = {
  "Video": "#7C3AED", "Carousel": "#0A66C2", "Static": "#EA4335",
  "Stories": "#E4405F", "Text": "#6366F1",
};

// ─── BUDGET PACING DATA ──────────────────────────────────────

export const BUDGET_DATA = {
  spent: 38000,
  total: 122000,
  remaining: 84000,
  dailyRunRate: 1267,
  phaseShare: 0.31,
  roas: 2.8,
  roasTarget: 3.5,
  daysElapsed: 21,
  totalDays: 31,
  primaryDrags: ["GDN Standard (ROAS 0.8×)", "Outbrain (ROAS 1.2×)"],
  strengths: ["Google Search (ROAS 6.2×)", "LinkedIn Feed (ROAS 4.8×)"],
};

// ─── ACTION RECOMMENDATIONS ──────────────────────────────────

export const ACTION_RECS = {
  allocateMore: {
    title: "Allocate More Budget",
    color: "#22C55E",
    bgColor: "rgba(34,197,94,0.06)",
    borderColor: "rgba(34,197,94,0.15)",
    channels: ["LinkedIn Feed", "TikTok Spark Ads", "Instagram Reels"],
    recommendation: "These channels show EIS >8.0 and CPQE below average. Increasing budget by 20-30% could yield +18% qualified engagements.",
  },
  correctDistortion: {
    title: "Correct Distortion",
    color: "#F59E0B",
    bgColor: "rgba(245,158,11,0.06)",
    borderColor: "rgba(245,158,11,0.15)",
    channels: ["Facebook Feed", "Facebook Stories", "YouTube In-Stream"],
    recommendation: "High CPE-to-CPQE gap indicates vanity engagement. Tighten targeting or shift to qualified-engagement optimized bidding.",
  },
  validateTraffic: {
    title: "Validate Traffic Quality",
    color: "#EF4444",
    bgColor: "rgba(239,68,68,0.06)",
    borderColor: "rgba(239,68,68,0.15)",
    channels: ["GDN Standard", "GDN Responsive", "DV360 Display"],
    recommendation: "EIS <4.0 with >85% T1 engagement suggests bot or accidental click traffic. Audit placements and add exclusion lists.",
  },
};

// ─── ENGAGEMENT DEPTH TOP 10 CHANNELS ────────────────────────

export const DEPTH_CHANNELS = [
  { name: "LinkedIn Feed", icon: "in", color: "#0A66C2", type: "B2B Social", t1: 3200, t2: 8600, t3: 11400, alignment: "Strong", alignColor: "#22C55E", action: "Scale" },
  { name: "Google Search", icon: "G", color: "#4285F4", type: "Search", t1: 2400, t2: 6800, t3: 14200, alignment: "Strong", alignColor: "#22C55E", action: "Scale" },
  { name: "TikTok Spark Ads", icon: "♪", color: "#010101", type: "Short Video", t1: 5400, t2: 12800, t3: 16400, alignment: "Strong", alignColor: "#22C55E", action: "Scale" },
  { name: "Instagram Reels", icon: "◎", color: "#E4405F", type: "Short Video", t1: 8400, t2: 16200, t3: 12800, alignment: "Strong", alignColor: "#22C55E", action: "Scale" },
  { name: "Email", icon: "✉", color: "#6366F1", type: "Direct", t1: 2800, t2: 7200, t3: 11600, alignment: "Strong", alignColor: "#22C55E", action: "Scale" },
  { name: "Instagram Feed", icon: "◎", color: "#E4405F", type: "Social", t1: 12200, t2: 18400, t3: 8600, alignment: "Acceptable", alignColor: "#F59E0B", action: "Optimize" },
  { name: "Facebook Feed", icon: "f", color: "#1877F2", type: "Social", t1: 28400, t2: 12600, t3: 4200, alignment: "Weak", alignColor: "#EF4444", action: "Fix" },
  { name: "YouTube In-Stream", icon: "▶", color: "#FF0000", type: "Video", t1: 32400, t2: 8200, t3: 2800, alignment: "Weak", alignColor: "#EF4444", action: "Fix" },
  { name: "GDN Standard", icon: "▣", color: "#EA4335", type: "Display", t1: 38600, t2: 4200, t3: 800, alignment: "Weak", alignColor: "#EF4444", action: "Audit" },
  { name: "Snapchat Ads", icon: "👻", color: "#F7D731", type: "Social", t1: 16200, t2: 6400, t3: 2200, alignment: "Weak", alignColor: "#EF4444", action: "Audit" },
];

// ─── PERFORMANCE DRIVER DIAGNOSTICS ──────────────────────────

export const DRIVER_DIAGNOSTICS = {
  eis: {
    color: "#7C3AED",
    message: "EIS trending upward — driven by TikTok Spark Ads and LinkedIn Feed outperforming. GDN Standard dragging the average down significantly.",
  },
  eqs: {
    color: "#0A66C2",
    message: "EQS above target — search and B2B channels delivering highest quality. Facebook engagement quality declining due to algorithmic feed changes.",
  },
  esr: {
    color: "#22C55E",
    message: "ESR improving but still below target. Channels with high initial engagement (TikTok, Stories) show faster decay. LinkedIn and Email retain best.",
  },
};

export const WHAT_NEXT_ACTIONS = [
  { title: "Scale High-EIS Channels", color: "#22C55E", text: "Increase TikTok Spark and LinkedIn Feed budgets by 25%. Both show EIS >8.0 with room to grow before saturation." },
  { title: "Fix Quality Gaps", color: "#F59E0B", text: "Facebook Feed and YouTube In-Stream have high volume but low EQS. Tighten targeting to qualified audiences." },
  { title: "Audit Display Traffic", color: "#EF4444", text: "GDN and DV360 display showing EIS <4.0 with >85% low-depth engagement. Likely bot traffic — add placement exclusions." },
];

// ─── CONTENT INTELLIGENCE DATA ──────────────────────────────

export interface ContentItem {
  title: string;
  platform: string;
  format: string;
  type: string;
  eis: number;
  lift: string;
  esr: string;
  eqs: number;
  channels: string[];
  action: string;
}

export const CONTENT_INTEL_TOP: ContentItem[] = [
  { title: "B2B Marketer POV: Analytics Hell", platform: "TikTok", format: "Video", type: "organic", eis: 8.4, lift: "+26.3%", esr: "79%", eqs: 8.6, channels: ["instagram", "youtube", "linkedin"], action: "REPURPOSE" },
  { title: "How REACT Framework Transforms B2B Marketing ROI", platform: "LinkedIn", format: "Video", type: "organic", eis: 8.1, lift: "+24.3%", esr: "88%", eqs: 9.2, channels: ["youtube", "tiktok"], action: "SCALE" },
  { title: "5 Signs Your Marketing Data Is Lying to You", platform: "LinkedIn", format: "Video", type: "organic", eis: 7.8, lift: "+22.2%", esr: "84%", eqs: 8.8, channels: ["tiktok", "instagram"], action: "SCALE" },
  { title: "Hidden Cost of Fragmented Analytics [8-slide]", platform: "LinkedIn", format: "Carousel", type: "organic", eis: 7.4, lift: "+20.8%", esr: "81%", eqs: 8.4, channels: ["instagram", "tiktok"], action: "SCALE" },
  { title: "Why Your Attribution Model Is Broken", platform: "LinkedIn", format: "Video", type: "organic", eis: 7.6, lift: "+21.5%", esr: "82%", eqs: 8.5, channels: ["youtube", "instagram"], action: "SCALE" },
  { title: "The Real ROI of Engagement Marketing", platform: "TikTok", format: "Video", type: "organic", eis: 7.9, lift: "+23.1%", esr: "85%", eqs: 8.7, channels: ["instagram", "linkedin"], action: "REPURPOSE" },
  { title: "Stop Measuring Vanity Metrics [10-slide]", platform: "LinkedIn", format: "Carousel", type: "organic", eis: 7.2, lift: "+19.8%", esr: "80%", eqs: 8.3, channels: ["instagram", "tiktok"], action: "SCALE" },
  { title: "Marketing Analytics Stack Breakdown", platform: "LinkedIn", format: "Video", type: "organic", eis: 7.5, lift: "+20.4%", esr: "83%", eqs: 8.6, channels: ["youtube", "tiktok"], action: "SCALE" },
  { title: "Data-Driven Decision Making Framework", platform: "TikTok", format: "Video", type: "organic", eis: 7.7, lift: "+22.0%", esr: "86%", eqs: 8.8, channels: ["instagram", "linkedin", "youtube"], action: "REPURPOSE" },
  { title: "Content Performance Deep Dive [12-slide]", platform: "LinkedIn", format: "Carousel", type: "organic", eis: 7.3, lift: "+20.1%", esr: "81%", eqs: 8.4, channels: ["instagram", "tiktok"], action: "SCALE" },
];

export const CONTENT_INTEL_LOW: ContentItem[] = [
  { title: "Awareness Banner (LinkedIn Sponsored)", platform: "LinkedIn", format: "Static", type: "paid", eis: 3.1, lift: "+17.6%", esr: "24%", eqs: 2.8, channels: ["linkedin"], action: "PAUSE" },
  { title: "Static — Lead Gen Form (Facebook)", platform: "Facebook", format: "Static", type: "paid", eis: 3.4, lift: "+15.8%", esr: "36%", eqs: 3.2, channels: ["facebook"], action: "REPLACE" },
  { title: "Prospecting Banner — GDN Display", platform: "GDN", format: "Display", type: "paid", eis: 3.4, lift: "+25.0%", esr: "15%", eqs: 2.1, channels: ["facebook"], action: "PAUSE" },
  { title: "Static — Awareness Banner (IG Sponsored)", platform: "Instagram", format: "Static", type: "paid", eis: 3.6, lift: "+17.1%", esr: "38%", eqs: 3.4, channels: ["instagram"], action: "REPLACE" },
  { title: "Retargeting Display — Product Demo", platform: "GDN", format: "Display", type: "paid", eis: 3.2, lift: "+18.3%", esr: "22%", eqs: 2.6, channels: ["facebook"], action: "PAUSE" },
  { title: "Lead Magnet Banner (Facebook)", platform: "Facebook", format: "Static", type: "paid", eis: 3.5, lift: "+16.2%", esr: "34%", eqs: 3.1, channels: ["facebook"], action: "REPLACE" },
  { title: "Conversion Campaign — Static Ad", platform: "LinkedIn", format: "Static", type: "paid", eis: 3.3, lift: "+19.4%", esr: "28%", eqs: 2.9, channels: ["linkedin"], action: "PAUSE" },
  { title: "Brand Awareness Display (Instagram)", platform: "Instagram", format: "Static", type: "paid", eis: 3.7, lift: "+16.8%", esr: "40%", eqs: 3.5, channels: ["instagram"], action: "REPLACE" },
  { title: "Sponsored Content — Product Launch", platform: "Facebook", format: "Static", type: "paid", eis: 3.1, lift: "+14.5%", esr: "32%", eqs: 2.9, channels: ["facebook"], action: "REPLACE" },
  { title: "Remarketing Display — Free Trial", platform: "GDN", format: "Display", type: "paid", eis: 3.0, lift: "+20.1%", esr: "18%", eqs: 2.4, channels: ["facebook"], action: "PAUSE" },
];

export interface FormatItem {
  icon: string;
  name: string;
  subtitle: string;
  eis: number;
  lift: string;
  esr: string;
  eqs: number;
  channels: string[];
  action: string;
}

export const FORMAT_TOP: FormatItem[] = [
  { icon: "🎬", name: "Long-form Video", subtitle: "Video (long)", eis: 8.2, lift: "+21.8%", esr: "85%", eqs: 8.6, channels: ["linkedin", "youtube"], action: "PRODUCE MORE" },
  { icon: "📱", name: "Short-form Video / POV", subtitle: "Video (short)", eis: 7.9, lift: "+26.5%", esr: "74%", eqs: 7.8, channels: ["tiktok", "instagram"], action: "SCALE" },
  { icon: "🎠", name: "Carousel / Slideshow", subtitle: "Carousel", eis: 7.1, lift: "+18.8%", esr: "68%", eqs: 7.2, channels: ["linkedin", "instagram"], action: "REPURPOSE AS TIKTOK" },
];

export const FORMAT_LOW: FormatItem[] = [
  { icon: "🖼️", name: "Static Image / Banner", subtitle: "Static", eis: 3.4, lift: "-16.8%", esr: "32%", eqs: 3.1, channels: ["linkedin", "instagram", "facebook"], action: "REPLACE WITH VIDEO" },
  { icon: "📊", name: "Display Banner", subtitle: "Display", eis: 3.6, lift: "-25.0%", esr: "18%", eqs: 2.3, channels: ["instagram"], action: "PAUSE" },
];
