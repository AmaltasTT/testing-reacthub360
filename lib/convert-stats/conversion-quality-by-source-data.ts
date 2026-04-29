// Ported from Convert_Insights_-_Drill_Down ConversionQualityBySource.tsx

export interface ConversionQualitySource {
  name: string;
  percentage: number;
  color: string;
  badge: string;
}

export interface ConversionQualityTier {
  name: string;
  price: string;
  color: string;
  arr: string;
  volume: number;
  topSource: ConversionQualitySource;
  sources: ConversionQualitySource[];
}

export const CONVERSION_QUALITY_TIERS: ConversionQualityTier[] = [
  {
    name: "Starter",
    price: "$29/mo",
    color: "#A78BFA",
    arr: "$276K",
    volume: 794,
    topSource: { name: "Google Ads", percentage: 32, color: "#4285F4", badge: "G" },
    sources: [
      { name: "Google Ads", percentage: 32, color: "#4285F4", badge: "G" },
      { name: "Email", percentage: 24, color: "#36B37E", badge: "E" },
      { name: "LinkedIn", percentage: 18, color: "#0A66C2", badge: "L" },
      { name: "Organic Search", percentage: 14, color: "#8B5CF6", badge: "O" },
      { name: "TikTok", percentage: 8, color: "#1A1A2E", badge: "T" },
      { name: "Taboola", percentage: 4, color: "#2D4EA2", badge: "T" },
    ],
  },
  {
    name: "Growth",
    price: "$99/mo",
    color: "#8B5CF6",
    arr: "$740K",
    volume: 623,
    topSource: { name: "LinkedIn", percentage: 30, color: "#0A66C2", badge: "L" },
    sources: [
      { name: "LinkedIn", percentage: 30, color: "#0A66C2", badge: "L" },
      { name: "Email", percentage: 26, color: "#36B37E", badge: "E" },
      { name: "Google Ads", percentage: 20, color: "#4285F4", badge: "G" },
      { name: "Organic Search", percentage: 14, color: "#8B5CF6", badge: "O" },
      { name: "Taboola", percentage: 8, color: "#2D4EA2", badge: "T" },
      { name: "TikTok", percentage: 2, color: "#1A1A2E", badge: "T" },
    ],
  },
  {
    name: "Pro",
    price: "$249/mo",
    color: "#7C3AED",
    arr: "$1.82M",
    volume: 340,
    topSource: { name: "LinkedIn", percentage: 38, color: "#0A66C2", badge: "L" },
    sources: [
      { name: "LinkedIn", percentage: 38, color: "#0A66C2", badge: "L" },
      { name: "Email", percentage: 28, color: "#36B37E", badge: "E" },
      { name: "Google Ads", percentage: 16, color: "#4285F4", badge: "G" },
      { name: "Organic Search", percentage: 12, color: "#8B5CF6", badge: "O" },
      { name: "Taboola", percentage: 6, color: "#2D4EA2", badge: "T" },
      { name: "TikTok", percentage: 0, color: "#1A1A2E", badge: "T" },
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    color: "#5B21B6",
    arr: "$518K",
    volume: 85,
    topSource: { name: "LinkedIn", percentage: 48, color: "#0A66C2", badge: "L" },
    sources: [
      { name: "LinkedIn", percentage: 48, color: "#0A66C2", badge: "L" },
      { name: "Email", percentage: 30, color: "#36B37E", badge: "E" },
      { name: "Google Ads", percentage: 12, color: "#4285F4", badge: "G" },
      { name: "Organic Search", percentage: 8, color: "#8B5CF6", badge: "O" },
      { name: "Taboola", percentage: 2, color: "#2D4EA2", badge: "T" },
      { name: "TikTok", percentage: 0, color: "#1A1A2E", badge: "T" },
    ],
  },
];
