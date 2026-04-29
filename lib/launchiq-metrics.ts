import type { GoalVisualKey } from "@/components/launchiq/lib/goalColors";

/** Benchmark hint copy aligned with LaunchIQ_v7.html prototype (SaaS-style defaults). */
export function defaultOverlayMetricHints(
  key: GoalVisualKey | "other"
): [omtm: string, k1: string, k2: string, k3: string] {
  switch (key) {
    case "awareness":
      return [
        "SaaS MarTech benchmark, DACH + UK",
        "Based on ICP addressable market",
        "Challenger brand target in MarTech",
        "B2B SaaS cost benchmark, mid-market",
      ];
    case "consideration":
      return [
        "SaaS benchmark, tech-savvy B2B",
        "SaaS consideration depth benchmark",
        "MarTech action completion benchmark",
        "B2B SaaS quality action cost",
      ];
    case "conversion":
      return [
        "SaaS trial-to-paid / demo-to-close",
        "SaaS ROAS at current ACV",
        "B2B SaaS conversion cost",
        "Your detected Average Contract Value",
      ];
    case "retention":
      return [
        "SaaS industry median, MarTech",
        "Based on ACV €480, 15% annual churn",
        "Monthly Recurring Revenue benchmark",
        "Retention campaign efficiency, SaaS",
      ];
    case "advocacy":
      return [
        "Advocacy Action Rate, B2B SaaS benchmark",
        "Positive Sentiment Rate, MarTech vertical",
        "G2/Capterra review benchmark for MarTech",
        "Cost per Advocacy Action, SaaS",
      ];
    default:
      return [
        "Benchmark source will appear when API is connected",
        "Benchmark source will appear when API is connected",
        "Benchmark source will appear when API is connected",
        "Benchmark source will appear when API is connected",
      ];
  }
}

/** Default labels until GET campaigns/benchmarks is wired */
export function defaultMetricsForGoal(key: GoalVisualKey | "other"): {
  omtm: string;
  kpis: string[];
} {
  switch (key) {
    case "awareness":
      return { omtm: "Qualified Reach (QR)", kpis: ["APR", "SOV", "CpQR"] };
    case "consideration":
      return { omtm: "AIS", kpis: ["AQS", "ACR", "CpQA"] };
    case "conversion":
      return { omtm: "Conversion Rate", kpis: ["Revenue", "CpCon", "ROAS"] };
    case "retention":
      return { omtm: "CRR", kpis: ["CLV", "MRR / Repurchase", "Cost/Retained"] };
    case "advocacy":
      return { omtm: "AAR", kpis: ["CpAA", "PSR", "Avg Review Score"] };
    default:
      return { omtm: "Primary metric", kpis: ["KPI 1", "KPI 2", "KPI 3"] };
  }
}

/** Static business context copy shown in the metrics overlay (LaunchIQ_v7.html). */
export const LAUNCHIQ_V7_OVERLAY_BUSINESS_FIELDS = {
  businessModel: "SaaS (B2B)",
  industry: "Marketing Technology",
  businessType: "B2B",
  targetMarket: "DACH + UK",
  icp: "Digital-first SMBs, 11–200",
  competitors: "HubSpot, Supermetrics, DashThis",
} as const;

/** Static audience demographics copy (non–age-range) in LaunchIQ_v7.html. */
export const LAUNCHIQ_V7_OVERLAY_DEMOGRAPHICS_FIELDS = {
  companySize: "11–200 employees",
  seniority: "Director / VP / C-Suite",
  jobFunctions: "Marketing, Growth, Revenue",
  demographicsGeography: "DACH + UK",
} as const;

/** Default age chips “on” in the v7 HTML prototype. */
export const LAUNCHIQ_V7_DEFAULT_AGE_RANGES = ["25–34", "35–44"] as const;

/**
 * Campaign APIs (e.g. Xano `campaign` POST) validate `age_range` against labels with ASCII hyphens.
 * Overlay chips use typographic en/em dashes (U+2013 / U+2014); normalize before send.
 */
export function normalizeAgeRangesForApi(ageRanges: string[]): string[] {
  return ageRanges.map((a) =>
    (a ?? "")
      .trim()
      .replace(/\u2013|\u2014|\u2212/g, "-")
  );
}

/**
 * Prefix/suffix for benchmark inputs to mirror LaunchIQ_v7.html (€, %, x, plain counts).
 */
export function metricAffixForLabel(label: string): { prefix: string; suffix: string } {
  const t = label.trim();
  const lo = t.toLowerCase();

  if (/\broas\b/i.test(t)) return { prefix: "", suffix: "x" };
  if (/^cp/i.test(t) || /^cost\s*\/\s*/i.test(lo)) return { prefix: "€", suffix: "" };
  if (/\brevenue\b|\bclv\b|\bmrr\b|\bacv\b|\baov\b/i.test(lo)) return { prefix: "€", suffix: "" };
  if (/\brate\b|\bsov\b|\bapr\b|\bacr\b|\bcrr\b|\baar\b|\bpsr\b/i.test(lo)) return { prefix: "", suffix: "%" };
  if (lo.includes("conversion")) return { prefix: "", suffix: "%" };
  if (lo.includes("repurchase")) return { prefix: "", suffix: "%" };
  return { prefix: "", suffix: "" };
}

export function stripMetricRawValue(value: string, label: string): string {
  const { prefix, suffix } = metricAffixForLabel(label);
  let x = (value ?? "").trim();
  if (!x || x === "\u2014" || x === "\u2013" || x === "—") return "0";
  if (prefix && x.startsWith(prefix)) x = x.slice(prefix.length).trim();
  if (suffix && x.endsWith(suffix)) x = x.slice(0, -suffix.length).trim();
  x = x.replace(/,/g, "");
  if (!x || x === ".") return "0";
  return x;
}

/** Keep only digits and at most one decimal point while typing benchmark fields. */
export function sanitizeMetricRawTyping(input: string): string {
  let x = input.replace(/[^\d.]/g, "");
  const dot = x.indexOf(".");
  if (dot !== -1) {
    x = x.slice(0, dot + 1) + x.slice(dot + 1).replace(/\./g, "");
  }
  if (x === "" || x === ".") return "0";
  return x;
}

/** Full display string for review / summaries (raw storage + label-based affixes). */
export function formatMetricWithAffix(raw: string, label: string): string {
  const { prefix, suffix } = metricAffixForLabel(label);
  const body = stripMetricRawValue(raw, label);
  return `${prefix}${body}${suffix}`;
}
