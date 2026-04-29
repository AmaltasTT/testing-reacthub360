// Ported from Convert_Insights_-_Drill_Down ConvertDrivers.tsx

export type DriverVerdict = "SCALE" | "MAINTAIN" | "FIX" | "OPTIMIZE";

export interface ConvertDriverChannel {
  name: string;
  revenue: number;
  cpc: number;
  conversions: number;
  bubbleSize: number;
  xPercent: number;
  yPercent: number;
  color: string;
  verdict: DriverVerdict;
  roas: number;
  cvr: number;
  signal: string;
}

export const CONVERT_DRIVER_CHANNELS: ConvertDriverChannel[] = [
  {
    name: "Email",
    revenue: 195000,
    cpc: 0.85,
    conversions: 890,
    bubbleSize: 110,
    xPercent: 15,
    yPercent: 28,
    color: "#36B37E",
    verdict: "SCALE",
    roas: 8.2,
    cvr: 5.8,
    signal: "High Intent Leader",
  },
  {
    name: "Google PPC",
    revenue: 285000,
    cpc: 2.5,
    conversions: 620,
    bubbleSize: 116,
    xPercent: 35,
    yPercent: 18,
    color: "#4285F4",
    verdict: "SCALE",
    roas: 4.8,
    cvr: 4.6,
    signal: "Efficiency Champion",
  },
  {
    name: "Facebook Ads",
    revenue: 142000,
    cpc: 1.2,
    conversions: 480,
    bubbleSize: 90,
    xPercent: 25,
    yPercent: 48,
    color: "#1877F2",
    verdict: "MAINTAIN",
    roas: 3.2,
    cvr: 2.9,
    signal: "High AOV Driver",
  },
  {
    name: "LinkedIn",
    revenue: 98000,
    cpc: 5.75,
    conversions: 320,
    bubbleSize: 78,
    xPercent: 75,
    yPercent: 58,
    color: "#0A66C2",
    verdict: "OPTIMIZE",
    roas: 2.4,
    cvr: 3.8,
    signal: "High AOV Driver",
  },
  {
    name: "Instagram Ads",
    revenue: 68000,
    cpc: 3.1,
    conversions: 320,
    bubbleSize: 78,
    xPercent: 50,
    yPercent: 72,
    color: "#E1306C",
    verdict: "OPTIMIZE",
    roas: 2.1,
    cvr: 2.4,
    signal: "Volume, Low Yield",
  },
  {
    name: "TikTok",
    revenue: 42000,
    cpc: 2.85,
    conversions: 280,
    bubbleSize: 75,
    xPercent: 45,
    yPercent: 88,
    color: "#1A1A2E",
    verdict: "FIX",
    roas: 1.8,
    cvr: 1.8,
    signal: "Volume, Low Yield",
  },
];
