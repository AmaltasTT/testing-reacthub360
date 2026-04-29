"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView, animate } from "motion/react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip as RechartTooltip,
  ResponsiveContainer,
  Legend,
  ScatterChart,
  Scatter,
  Cell,
  LabelList,
  ReferenceArea,
  Area,
  ReferenceLine,
  Label,
} from "recharts";
import { P } from "@/lib/act-stats/data";

// ─── Data ─────────────────────────────────────────────────────

const aisStackedData = [
  { date: "Feb 6",  exploratory: 61, evaluating: 31, commitment: 8,  ais: 6.7 },
  { date: "Feb 8",  exploratory: 61, evaluating: 31, commitment: 8,  ais: 6.8 },
  { date: "Feb 10", exploratory: 60, evaluating: 31, commitment: 9,  ais: 6.9 },
  { date: "Feb 12", exploratory: 59, evaluating: 32, commitment: 9,  ais: 6.9 },
  { date: "Feb 14", exploratory: 58, evaluating: 32, commitment: 10, ais: 7.0 },
  { date: "Feb 16", exploratory: 57, evaluating: 33, commitment: 10, ais: 7.1 },
  { date: "Feb 18", exploratory: 56, evaluating: 33, commitment: 11, ais: 7.1 },
  { date: "Feb 20", exploratory: 55, evaluating: 33, commitment: 12, ais: 7.1 },
  { date: "Feb 22", exploratory: 53, evaluating: 34, commitment: 13, ais: 7.1 },
  { date: "Feb 24", exploratory: 52, evaluating: 34, commitment: 14, ais: 7.2 },
  { date: "Feb 26", exploratory: 51, evaluating: 34, commitment: 15, ais: 7.3 },
  { date: "Feb 28", exploratory: 49, evaluating: 35, commitment: 16, ais: 7.3 },
  { date: "Mar 1",  exploratory: 48, evaluating: 35, commitment: 17, ais: 7.3 },
  { date: "Mar 2",  exploratory: 47, evaluating: 35, commitment: 18, ais: 7.4 },
  { date: "Mar 3",  exploratory: 45, evaluating: 36, commitment: 19, ais: 7.4 },
  { date: "Mar 4",  exploratory: 44, evaluating: 36, commitment: 20, ais: 7.5 },
  { date: "Mar 5",  exploratory: 43, evaluating: 36, commitment: 21, ais: 7.5 },
  { date: "Mar 6",  exploratory: 41, evaluating: 37, commitment: 22, ais: 7.5 },
  { date: "Mar 7",  exploratory: 40, evaluating: 37, commitment: 23, ais: 7.5 },
  { date: "Mar 8",  exploratory: 39, evaluating: 37, commitment: 24, ais: 7.5 },
];

const aqsStackedData = [
  { date: "Feb 6",  exploratory: 66, evaluating: 25, commitment: 9,  aqs: 25 },
  { date: "Feb 10", exploratory: 65, evaluating: 26, commitment: 9,  aqs: 26 },
  { date: "Feb 14", exploratory: 64, evaluating: 26, commitment: 10, aqs: 27 },
  { date: "Feb 18", exploratory: 63, evaluating: 26, commitment: 11, aqs: 28 },
  { date: "Feb 22", exploratory: 62, evaluating: 25, commitment: 13, aqs: 30 },
  { date: "Feb 26", exploratory: 61, evaluating: 25, commitment: 14, aqs: 32 },
  { date: "Mar 1",  exploratory: 59, evaluating: 24, commitment: 17, aqs: 34 },
  { date: "Mar 3",  exploratory: 57, evaluating: 24, commitment: 19, aqs: 36 },
  { date: "Mar 5",  exploratory: 55, evaluating: 23, commitment: 22, aqs: 38 },
  { date: "Mar 7",  exploratory: 52, evaluating: 24, commitment: 24, aqs: 59 },
];

const acrStackedData = [
  { date: "Feb 6",  exploratory: 50, evaluating: 30, commitment: 20, acr: 63 },
  { date: "Feb 10", exploratory: 51, evaluating: 29, commitment: 20, acr: 62 },
  { date: "Feb 14", exploratory: 52, evaluating: 29, commitment: 19, acr: 61 },
  { date: "Feb 18", exploratory: 53, evaluating: 28, commitment: 19, acr: 60 },
  { date: "Feb 22", exploratory: 54, evaluating: 28, commitment: 18, acr: 60 },
  { date: "Feb 26", exploratory: 55, evaluating: 27, commitment: 18, acr: 59 },
  { date: "Mar 4",  exploratory: 56, evaluating: 27, commitment: 17, acr: 59 },
  { date: "Mar 8",  exploratory: 57, evaluating: 26, commitment: 17, acr: 59 },
];

const aisActionsData = [
  { action: "Free Trial Signup",          ais: 8.5, volume: 18500, trend: "+18%", trendValue: 18,  intent: "Commitment" },
  { action: "CRM Sales Touch",            ais: 8.0, volume: 15000, trend: "+3%",  trendValue: 3,   intent: "Commitment" },
  { action: "Interactive ROI Calculator", ais: 7.5, volume: 16200, trend: "-5%",  trendValue: -5,  intent: "Commitment" },
  { action: "Demo Request",               ais: 6.6, volume: 2200,  trend: "+12%", trendValue: 12,  intent: "Evaluation" },
  { action: "LinkedIn Lead Gen Form",     ais: 6.4, volume: 2800,  trend: "+9%",  trendValue: 9,   intent: "Evaluation" },
  { action: "Pricing Page Dwell >30s",    ais: 6.1, volume: 3100,  trend: "+6%",  trendValue: 6,   intent: "Evaluation" },
  { action: "Case Study Download",        ais: 6.0, volume: 1200,  trend: "-3%",  trendValue: -3,  intent: "Evaluation" },
  { action: "Product Page View",          ais: 6.0, volume: 1500,  trend: "+1%",  trendValue: 1,   intent: "Evaluation" },
  { action: "Interactive Product Demo",   ais: 5.9, volume: 2200,  trend: "+4%",  trendValue: 4,   intent: "Evaluation" },
  { action: "Facebook Lead Gen Form",     ais: 5.6, volume: 880,   trend: "-2%",  trendValue: -2,  intent: "Evaluation" },
  { action: "Product Demo Video >75%",    ais: 5.5, volume: 2000,  trend: "0%",   trendValue: 0,   intent: "Evaluation" },
  { action: "Scroll Depth (75%)",         ais: 2.0, volume: 180,   trend: "+8%",  trendValue: 8,   intent: "Exploration" },
  { action: "Facebook Quiz",              ais: 1.8, volume: 120,   trend: "+5%",  trendValue: 5,   intent: "Exploration" },
  { action: "LinkedIn Poll",              ais: 1.6, volume: 100,   trend: "+2%",  trendValue: 2,   intent: "Exploration" },
  { action: "Scroll Depth (50%)",         ais: 1.5, volume: 210,   trend: "+6%",  trendValue: 6,   intent: "Exploration" },
  { action: "Scroll Depth (25%)",         ais: 1.0, volume: 260,   trend: "+4%",  trendValue: 4,   intent: "Exploration" },
];

const aqsActionsData = [
  { action: "Free Trial Signup",          intentLevel: "Commitment", aqsScore: 92, intentVolume: "4,200",  contribution: "+0.4%" },
  { action: "CRM Sales Touch",            intentLevel: "Commitment", aqsScore: 87, intentVolume: "3,100",  contribution: "+0.3%" },
  { action: "Interactive ROI Calculator", intentLevel: "Commitment", aqsScore: 80, intentVolume: "5,600",  contribution: "+0.4%" },
  { action: "Demo Request",               intentLevel: "Evaluating", aqsScore: 74, intentVolume: "12,400", contribution: "+0.7%" },
  { action: "LinkedIn Lead Gen Form",     intentLevel: "Evaluating", aqsScore: 66, intentVolume: "21,800", contribution: "+0.8%" },
  { action: "Pricing Page Dwell >30s",    intentLevel: "Evaluating", aqsScore: 61, intentVolume: "32,600", contribution: "+0.8%" },
  { action: "Interactive Product Demo",   intentLevel: "Evaluating", aqsScore: 58, intentVolume: "25,400", contribution: "+0.4%" },
  { action: "Product Demo Video >75%",    intentLevel: "Evaluating", aqsScore: 53, intentVolume: "38,200", contribution: "+0.1%" },
  { action: "Case Study Download",        intentLevel: "Evaluating", aqsScore: 50, intentVolume: "17,600", contribution: "-0.1%" },
  { action: "Product Page View",          intentLevel: "Evaluating", aqsScore: 44, intentVolume: "46,800", contribution: "-1.0%" },
  { action: "Facebook Lead Gen Form",     intentLevel: "Evaluating", aqsScore: 41, intentVolume: "14,800", contribution: "-0.4%" },
  { action: "Scroll Depth (75%)",         intentLevel: "Exploration", aqsScore: 56, intentVolume: "31,200", contribution: "+0.3%" },
  { action: "Facebook Quiz",              intentLevel: "Exploration", aqsScore: 52, intentVolume: "21,600", contribution: "+0.0%" },
  { action: "LinkedIn Poll",              intentLevel: "Exploration", aqsScore: 48, intentVolume: "16,400", contribution: "-0.2%" },
  { action: "Scroll Depth (50%)",         intentLevel: "Exploration", aqsScore: 45, intentVolume: "38,800", contribution: "-0.7%" },
];

const acrActionsData = [
  { action: "Pricing Page Scroll >=50%",      acr: 78, goal: 70, started: 3400,  completed: 2652, vsGoal: 8,   trend: 5,   recommendation: "Scale Up" },
  { action: "Feature Page Scroll >=50%",      acr: 74, goal: 70, started: 2960,  completed: 2190, vsGoal: 4,   trend: 2,   recommendation: "Optimize Flow" },
  { action: "Homepage CTA Click",             acr: 72, goal: 65, started: 4100,  completed: 2952, vsGoal: 7,   trend: 4,   recommendation: "Scale Up" },
  { action: "Blog Post Read >=70%",           acr: 69, goal: 60, started: 5800,  completed: 4002, vsGoal: 9,   trend: 6,   recommendation: "Scale Up" },
  { action: "Product Demo Video >=75%",       acr: 68, goal: 65, started: 2240,  completed: 1523, vsGoal: 3,   trend: -1,  recommendation: "Check Friction" },
  { action: "Comparison Tool Usage",          acr: 67, goal: 60, started: 1230,  completed: 824,  vsGoal: 7,   trend: 3,   recommendation: "Expand Reach" },
  { action: "Case Study Download",            acr: 63, goal: 60, started: 1180,  completed: 743,  vsGoal: 3,   trend: 3,   recommendation: "Expand Reach" },
  { action: "Webinar Registration",           acr: 59, goal: 55, started: 920,   completed: 543,  vsGoal: 4,   trend: 1,   recommendation: "Expand Reach" },
  { action: "Security Whitepaper Download",   acr: 56, goal: 55, started: 680,   completed: 381,  vsGoal: 1,   trend: -4,  recommendation: "Optimize Flow" },
  { action: "Free Trial Signup",              acr: 54, goal: 60, started: 1020,  completed: 551,  vsGoal: -6,  trend: -6,  recommendation: "Reduce Barriers" },
  { action: "Newsletter Signup",              acr: 52, goal: 50, started: 2780,  completed: 1446, vsGoal: 2,   trend: 1,   recommendation: "Optimize Flow" },
  { action: "Contact Sales Form",             acr: 49, goal: 55, started: 860,   completed: 421,  vsGoal: -6,  trend: -3,  recommendation: "Reduce Barriers" },
  { action: "ROI Calculator Completion",      acr: 46, goal: 50, started: 1560,  completed: 718,  vsGoal: -4,  trend: -2,  recommendation: "Reduce Barriers" },
  { action: "Community Forum Registration",   acr: 43, goal: 50, started: 940,   completed: 404,  vsGoal: -7,  trend: -9,  recommendation: "Reduce Barriers" },
  { action: "Template Library Access",        acr: 42, goal: 45, started: 1120,  completed: 470,  vsGoal: -3,  trend: -1,  recommendation: "Check Friction" },
  { action: "LinkedIn Ad Click-Through",      acr: 38, goal: 35, started: 8400,  completed: 3192, vsGoal: 3,   trend: -1,  recommendation: "Check Friction" },
  { action: "Checkout Step 1 to Step 2",      acr: 36, goal: 45, started: 2800,  completed: 1008, vsGoal: -9,  trend: -9,  recommendation: "Fix Now" },
  { action: "Retargeting Banner Click",       acr: 33, goal: 30, started: 11200, completed: 3696, vsGoal: 3,   trend: 2,   recommendation: "Optimize Flow" },
  { action: "Account Setup Completion",       acr: 31, goal: 40, started: 640,   completed: 198,  vsGoal: -9,  trend: -7,  recommendation: "Fix Now" },
  { action: "Mobile App First Action",        acr: 28, goal: 38, started: 1480,  completed: 414,  vsGoal: -10, trend: -11, recommendation: "Fix Now" },
];

type Metric = "AIS" | "AQS" | "ACR";

interface Recommendation {
  category: string;
  tag?: string;
  title: string;
  description?: string;
  stat?: string;
  action?: string;
}

const metricConfig: Record<Metric, { title: string; description: string; recommendations: Recommendation[] }> = {
  AIS: {
    title: "Action Impact Score (AIS)",
    description: "Which actions carry the most weight and are they growing?",
    recommendations: [
      { category: "ALLOCATE MORE", title: "LinkedIn · TikTok", description: "Strong evaluation signals driving Action Impact Score." },
      { category: "OPTIMIZE",      title: "Facebook",          description: "High traffic volume but weak intent formation. Refine targeting." },
      { category: "VALIDATE",      title: "GDN Display",       description: "Low AIS relative to cost. Confirm downstream quality before renewing." },
    ],
  },
  AQS: {
    title: "Action Quality Score (AQS)",
    description: "How is the intent mix shifting and is quality improving?",
    recommendations: [
      { category: "FIX FRICTION", title: "Navigation Clicks",  description: "6,000 clicks going nowhere. Add exit-intent prompts at drop-off points." },
      { category: "SCALE",        title: "Free Trial · CRM",   description: "AQS 90 and 85. Your strongest quality anchors. Increase distribution." },
      { category: "OPTIMIZE",     title: "ROI Calculator",     description: "High quality but flat reach. Improve discoverability to unlock volume." },
      { category: "MONITOR",      title: "AQS Target: 50+",    description: "Set as primary quality KPI. Track weekly toward 60-day goal." },
    ],
  },
  ACR: {
    title: "Action Completion Rate (ACR)",
    description: "How many actions reach completion and where does friction hit?",
    recommendations: [
      { category: "01", tag: "FIX FRICTION", title: "Demo Request Form",  stat: "45% ACR, 5 pts below goal.", action: "Shorten form. Add step indicator." },
      { category: "02", tag: "FIX FRICTION", title: "Contact Sales Form", stat: "49% ACR, dropping 3 pts.",   action: "Add exit-intent recovery. Cut required fields." },
      { category: "03", tag: "SCALE",        title: "Pricing Page Scroll",stat: "78% ACR, 8 pts above goal.", action: "Push more traffic here. It performs." },
      { category: "04", tag: "VALIDATE",     title: "Free Trial Signup",  stat: "54% ACR, trending down 6 pts.", action: "Audit step 2 drop-off before it worsens." },
    ],
  },
};

function getCategoryColor(cat: string): string {
  if (cat === "ALLOCATE MORE" || cat === "SCALE" || cat === "VALIDATE") return "#7C5CFC";
  if (cat === "OPTIMIZE") return "#F59E0B";
  if (cat === "FIX FRICTION") return "#EF4444";
  if (cat === "MONITOR") return "#9CA3AF";
  return "#7C5CFC";
}

function getTagColor(tag: string): string {
  if (tag === "FIX FRICTION") return "#EF4444";
  if (tag === "SCALE" || tag === "VALIDATE") return "#7C5CFC";
  return "#7C5CFC";
}

function getAisBarColor(ais: number): string {
  if (ais >= 7.0) return "#6B4FBB";
  if (ais >= 5.5) return "#C4B5FD";
  if (ais >= 3.5) return "#E9D5FF";
  return "#F5F3FF";
}

function getAqsScoreStyle(score: number): { color: string; bg: string } {
  if (score >= 85) return { color: "#6B4FBB", bg: "#F0EDFF" };
  if (score >= 70) return { color: "#7C5CFC", bg: "#F5F3FF" };
  return { color: "#A78BFA", bg: "#FAF8FF" };
}

// ─── Gauge Components ──────────────────────────────────────────

function AISGauge() {
  const circumference = 238.76;
  const value = 7.5;
  const filled = (value / 10) * circumference;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
      <div style={{ position: "relative", width: 90, height: 90, flexShrink: 0 }}>
        <svg width="90" height="90" viewBox="0 0 90 90">
          <circle cx="45" cy="45" r="38" fill="none" stroke="#F5F5F7" strokeWidth="9" />
          <circle
            cx="45" cy="45" r="38"
            fill="none"
            stroke="#7C5CFC"
            strokeWidth="9"
            strokeDasharray={`${filled} ${circumference}`}
            strokeLinecap="round"
            transform="rotate(-90 45 45)"
          />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 24, fontWeight: 700, color: "#1D1D1F", lineHeight: 1 }}>7.5</span>
          <span style={{ fontSize: 9, color: "#86868B" }}>/ 10</span>
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#9B8FFF", display: "inline-block" }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: "#9B8FFF" }}>Strong</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#000", marginLeft: 8 }}>+0.8 pts vs prior period</span>
        </div>
        <div style={{ position: "relative", height: 10, borderRadius: 5, background: "linear-gradient(to right, #E6D9FF, #9B8FFF, #6B4EE6)", maxWidth: 260, marginBottom: 4 }}>
          <div style={{ position: "absolute", left: "75%", top: -3, width: 2, height: 16, background: "#6B4EE6", borderRadius: 1 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", maxWidth: 260 }}>
          <span style={{ fontSize: 9, color: "#86868B" }}>0-4</span>
          <span style={{ fontSize: 9, color: "#86868B" }}>4-7</span>
          <span style={{ fontSize: 9, color: "#86868B" }}>7-10</span>
        </div>
      </div>
    </div>
  );
}

function AQSGauge() {
  const totalArcLength = 157;
  const filledLength = (59 / 100) * totalArcLength;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
      <div style={{ position: "relative", width: 120, height: 90, flexShrink: 0 }}>
        <svg width="120" height="90" viewBox="0 0 120 90">
          <defs>
            <linearGradient id="aqsGaugeGrad" x1="0%" x2="100%" y1="0%" y2="0%">
              <stop offset="0%" stopColor="#C4B5FD" />
              <stop offset="50%" stopColor="#A78BFA" />
              <stop offset="100%" stopColor="#6B4FBB" />
            </linearGradient>
          </defs>
          <path
            d="M 10 70 A 50 50 0 0 1 110 70"
            fill="none"
            stroke="#F5F5F7"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M 10 70 A 50 50 0 0 1 110 70"
            fill="none"
            stroke="url(#aqsGaugeGrad)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${filledLength} ${totalArcLength}`}
          />
        </svg>
        <div style={{ position: "absolute", top: 18, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span style={{ fontSize: 28, fontWeight: 700, color: "#1D1D1F", lineHeight: 1 }}>59</span>
          <span style={{ fontSize: 9, color: "#86868B" }}>/ 100</span>
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#A78BFA", display: "inline-block" }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: "#A78BFA" }}>Average</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#34C759", marginLeft: 8 }}>+3 pts vs prior</span>
        </div>
        <div style={{ height: 10, borderRadius: 5, background: "linear-gradient(to right, #E9D5FF, #A78BFA, #6B4FBB)", maxWidth: 260, marginBottom: 4 }} />
        <div style={{ display: "flex", justifyContent: "space-between", maxWidth: 260 }}>
          <span style={{ fontSize: 9, color: "#86868B" }}>0-40</span>
          <span style={{ fontSize: 9, color: "#86868B" }}>40-70</span>
          <span style={{ fontSize: 9, color: "#86868B" }}>70-100</span>
        </div>
      </div>
    </div>
  );
}

function ACRGauge() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [displayValue, setDisplayValue] = useState(0);

  const radius = 53;
  const circumference = 2 * Math.PI * radius;
  const goal = 65;
  const value = 59;

  useEffect(() => {
    if (isInView) {
      const animation = animate(0, value, {
        duration: 1.8,
        ease: [0.34, 1.56, 0.64, 1],
        onUpdate: (latest) => {
          setDisplayValue(Math.round(latest));
        },
      });
      return () => animation.stop();
    }
  }, [isInView, value]);

  const progressLength = (displayValue / 100) * circumference;

  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 24 }}>
      <div ref={ref} style={{ position: "relative", width: 120, height: 120, flexShrink: 0 }}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          {/* Background track */}
          <circle
            cx="60" cy="60" r={radius}
            fill="none"
            stroke="rgba(108,93,211,0.12)"
            strokeWidth="7"
          />
          {/* Glow layer */}
          <motion.circle
            cx="60" cy="60" r={radius}
            fill="none"
            stroke="rgba(108,93,211,0.18)"
            strokeWidth="15"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progressLength}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
            initial={{ strokeDashoffset: circumference }}
            animate={isInView ? { strokeDashoffset: circumference - progressLength } : {}}
            transition={{ duration: 1.8, ease: [0.34, 1.56, 0.64, 1] }}
          />
          {/* Progress arc */}
          <motion.circle
            cx="60" cy="60" r={radius}
            fill="none"
            stroke="#6C5DD3"
            strokeWidth="7"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progressLength}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
            initial={{ strokeDashoffset: circumference }}
            animate={isInView ? { strokeDashoffset: circumference - progressLength } : {}}
            transition={{ duration: 1.8, ease: [0.34, 1.56, 0.64, 1] }}
          />
          {/* Goal marker tick at goal% */}
          <motion.line
            x1="60"
            y1={60 - radius - 5}
            x2="60"
            y2={60 - radius + 8}
            stroke="#4A3FA8"
            strokeWidth="2.5"
            transform={`rotate(${(goal / 100) * 360} 60 60)`}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 1.2 }}
          />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <motion.span
            style={{ fontSize: 28, fontWeight: 700, color: "#1C1C2E", lineHeight: 1 }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          >
            {displayValue}%
          </motion.span>
          <motion.span
            style={{ fontSize: 9.5, color: "#A8A5BE", textTransform: "uppercase", letterSpacing: "0.03em", marginTop: 4 }}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            AVG ACR
          </motion.span>
        </div>
      </div>
      <div style={{ flex: 1, paddingTop: 8 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          <motion.span
            style={{ background: "#EAE8FA", color: "#4A3FA8", fontSize: 12, fontWeight: 600, padding: "5px 12px", borderRadius: 20, display: "flex", alignItems: "center", gap: 6 }}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#9F97E0", display: "inline-block" }} />
            Average
          </motion.span>
          <motion.span
            style={{ background: "#FEF2F2", color: "#B91C1C", fontSize: 12, fontWeight: 600, padding: "5px 12px", borderRadius: 20 }}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            ▼ −4 pts vs prior period
          </motion.span>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <motion.div
            style={{ background: "#F7F6FB", border: "0.5px solid rgba(108,93,211,0.10)", borderRadius: 10, padding: "8px 14px", display: "flex", alignItems: "baseline", gap: 6 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          >
            <span style={{ fontSize: 16, fontWeight: 700, color: "#B91C1C" }}>8</span>
            <span style={{ fontSize: 9.5, color: "#A8A5BE", textTransform: "uppercase" }}>/ BELOW GOAL</span>
          </motion.div>
          <motion.div
            style={{ background: "#F7F6FB", border: "0.5px solid rgba(108,93,211,0.10)", borderRadius: 10, padding: "8px 14px", display: "flex", alignItems: "baseline", gap: 6 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 1.1 }}
          >
            <span style={{ fontSize: 16, fontWeight: 700, color: "#4A3FA8" }}>12</span>
            <span style={{ fontSize: 9.5, color: "#A8A5BE", textTransform: "uppercase" }}>/ AT OR ABOVE</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ─── BubbleScatterChart ────────────────────────────────────────

const bubbleData = [
  { id: "b1",  action: "Blog visit",       tier: "Exploration" as const, volume: 5200, weight: 1,    xPos: 0.12 },
  { id: "b2",  action: "Social click",     tier: "Exploration" as const, volume: 4100, weight: 1.15, xPos: 0.45 },
  { id: "b3",  action: "Whitepaper DL",    tier: "Exploration" as const, volume: 1800, weight: 2.1,  xPos: 0.28 },
  { id: "b4",  action: "Webinar reg.",     tier: "Evaluation"  as const, volume: 620,  weight: 3,    xPos: 0.75 },
  { id: "b5",  action: "Pricing page",     tier: "Evaluation"  as const, volume: 880,  weight: 3,    xPos: 1.05 },
  { id: "b6",  action: "Case study",       tier: "Evaluation"  as const, volume: 430,  weight: 3,    xPos: 0.9  },
  { id: "b7",  action: "Product compare",  tier: "Evaluation"  as const, volume: 310,  weight: 4,    xPos: 1.0  },
  { id: "b8",  action: "Demo request",     tier: "Commitment"  as const, volume: 190,  weight: 5,    xPos: 1.5  },
  { id: "b9",  action: "Free trial start", tier: "Commitment"  as const, volume: 270,  weight: 5,    xPos: 1.7  },
  { id: "b10", action: "Sales contact",    tier: "Commitment"  as const, volume: 95,   weight: 5,    xPos: 1.85 },
];

const tierColors = { Exploration: "#AFA9EC", Evaluation: "#534AB7", Commitment: "#3C3489" };
const tierOpacity = { Exploration: 0.45, Evaluation: 0.72, Commitment: 1.0 };

const BubbleTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const impact = data.volume * data.weight;
    return (
      <div style={{ background: "#26215C", borderRadius: 10, padding: "10px 14px", minWidth: 160, boxShadow: "0 4px 16px rgba(0,0,0,0.25)" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{data.action}</div>
        <div style={{ fontSize: 11, color: "#AFA9EC" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 2 }}>
            <span>Volume:</span><span style={{ fontWeight: 600 }}>{data.volume.toLocaleString()}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 2 }}>
            <span>Weight:</span><span style={{ fontWeight: 600 }}>{data.weight}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 2 }}>
            <span>Impact:</span><span style={{ fontWeight: 600 }}>{impact.toLocaleString()}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
            <span>Tier:</span><span style={{ fontWeight: 600 }}>{data.tier}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

function BubbleScatterChart() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      style={{ width: "100%", position: "relative" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isInView ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <style>{`
        @keyframes bubbleIn {
          from { opacity: 0; transform: scale(0); }
          to { opacity: 1; transform: scale(1); }
        }
        ${isInView ? `
          .recharts-scatter circle { animation: bubbleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) backwards; }
          .recharts-scatter circle:nth-child(1) { animation-delay: 0.4s; }
          .recharts-scatter circle:nth-child(2) { animation-delay: 0.5s; }
          .recharts-scatter circle:nth-child(3) { animation-delay: 0.6s; }
          .recharts-scatter circle:nth-child(4) { animation-delay: 0.7s; }
          .recharts-scatter circle:nth-child(5) { animation-delay: 0.8s; }
          .recharts-scatter circle:nth-child(6) { animation-delay: 0.9s; }
          .recharts-scatter circle:nth-child(7) { animation-delay: 1.0s; }
          .recharts-scatter circle:nth-child(8) { animation-delay: 1.1s; }
          .recharts-scatter circle:nth-child(9) { animation-delay: 1.2s; }
          .recharts-scatter circle:nth-child(10) { animation-delay: 1.3s; }
        ` : ""}
      `}</style>

      {/* Y-axis label */}
      <motion.div
        style={{
          position: "absolute",
          left: 60,
          top: "17%",
          transformOrigin: "center center",
          whiteSpace: "nowrap",
          writingMode: "vertical-rl" as const,
          transform: "translateX(50%)",
          fontSize: 13,
          color: "#888780",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Business Impact Potential
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <ResponsiveContainer width="100%" height={280}>
          <ScatterChart margin={{ top: 20, right: 40, bottom: 20, left: 120 }}>
            <XAxis
              type="number"
              dataKey="xPos"
              name="tier"
              domain={[0, 2]}
              ticks={[0.33, 1, 1.67]}
              tickFormatter={() => ""}
              tick={{ fill: "#86868B", fontSize: 11 }}
              axisLine={{ stroke: "#E5E5EA" }}
              tickLine={false}
            />
            <YAxis
              type="number"
              dataKey="weight"
              name="impact"
              domain={[0.5, 5.5]}
              ticks={[1, 2, 3, 4, 5]}
              tickFormatter={(v) => {
                if (v === 1) return "Low";
                if (v === 2) return "Low+";
                if (v === 3) return "Mid";
                if (v === 4) return "High";
                if (v === 5) return "Max";
                return "";
              }}
              tick={{ fill: "#86868B", fontSize: 11 }}
              axisLine={{ stroke: "#E5E5EA" }}
              tickLine={false}
            />
            <ZAxis type="number" dataKey="volume" range={[324, 14400]} />
            <ReferenceArea
              x1={0} x2={2} y1={0.5} y2={5.5}
              fill="#EEEDFE"
              fillOpacity={0.4}
            />
            <RechartTooltip content={<BubbleTooltip />} cursor={{ strokeDasharray: "3 3" }} />
            <Scatter data={bubbleData} fill="#8884d8">
              {bubbleData.map((entry) => (
                <Cell
                  key={`cell-${entry.id}`}
                  fill={tierColors[entry.tier]}
                  opacity={tierOpacity[entry.tier]}
                  style={{ cursor: "pointer" }}
                />
              ))}
              <LabelList
                dataKey="action"
                content={(props: any) => {
                  const { x, y, value, index } = props;
                  const dataPoint = bubbleData[index];
                  if (!dataPoint || dataPoint.volume < 1800) return null;
                  return (
                    <text
                      x={x} y={y}
                      fill="white"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={10}
                      fontWeight={500}
                    >
                      {value}
                    </text>
                  );
                }}
              />
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Legend */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, marginTop: -8 }}>
        {(["Exploration", "Evaluation", "Commitment"] as const).map((tier) => (
          <div key={tier} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: tierColors[tier] }} />
            <span style={{ fontSize: 11, color: "#86868B" }}>{tier}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── AIS Tab Content ───────────────────────────────────────────

type SortKey = "ais" | "volume" | "trendValue";
type SortDir = "asc" | "desc";

function AISContent() {
  const [sortKey, setSortKey] = useState<SortKey>("ais");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const maxVol = Math.max(...aisActionsData.map((r) => r.volume));

  const sorted = [...aisActionsData].sort((a, b) => {
    const av = a[sortKey] as number;
    const bv = b[sortKey] as number;
    return sortDir === "desc" ? bv - av : av - bv;
  });

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else { setSortKey(key); setSortDir("desc"); }
  }

  const arrowFor = (key: SortKey) => sortKey === key ? (sortDir === "desc" ? " ↓" : " ↑") : " ↕";

  return (
    <div>
      {/* Inflection note */}
      <p style={{ fontSize: 11, color: "#86868B", fontStyle: "italic", marginBottom: 16 }}>
        Inflection point: <strong>Feb 20</strong> — where Commitment intent crossed 12% and AIS began accelerating
      </p>

      {/* BubbleScatterChart */}
      <BubbleScatterChart />

      {/* Distribution Snapshot */}
      <div style={{ border: "1px solid rgba(107,79,187,0.10)", borderRadius: 8, padding: 14, background: "rgba(107,79,187,0.04)", marginBottom: 24, marginTop: 32 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32, marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid rgba(107,79,187,0.08)" }}>
          {[
            { label: "Commitment", value: "52%", pct: 52, color: "#6B4FBB", gradientFrom: "#6B4FBB", gradientTo: "#8B6FD4", trackBg: "rgba(107,79,187,0.12)" },
            { label: "Evaluation", value: "33%", pct: 33, color: "#A78BFA", gradientFrom: "#A78BFA", gradientTo: "#C4B5FD", trackBg: "rgba(167,139,250,0.12)" },
            { label: "Exploration", value: "15%", pct: 15, color: "#93C5FD", gradientFrom: "#93C5FD", gradientTo: "#BFDBFE", trackBg: "rgba(147,197,253,0.12)" },
          ].map((item) => (
            <div key={item.label}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#1D1D1F" }}>{item.label}</span>
                <span style={{ fontSize: 20, fontWeight: 700, color: item.color }}>{item.value}</span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: item.trackBg, marginBottom: 6, overflow: "hidden" }}>
                <div style={{ width: `${item.pct}%`, height: "100%", background: `linear-gradient(to right, ${item.gradientFrom}, ${item.gradientTo})`, borderRadius: 3 }} />
              </div>
              <span style={{ fontSize: 9, color: "#9CA3AF" }}>of AIS impact</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 11, color: "#6B7280", margin: 0, lineHeight: 1.6 }}>
          Most meaningful actions are already in <strong style={{ color: "#111827" }}>decision-stage behaviours</strong> — AIS is driven by quality, not volume.
        </p>
      </div>

      {/* Action Impact Drivers table */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: "#1D1D1F", marginBottom: 4 }}>Action Impact Drivers</div>
        <div style={{ fontSize: 11, color: "#86868B", marginBottom: 12 }}>Actions ranked by weighted contribution to overall AIS — click column to sort</div>

        {/* Table header */}
        <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid #F0EFF5", paddingBottom: 8, marginBottom: 4 }}>
          <div style={{ width: 192, fontSize: 10, fontWeight: 700, color: "#86868B", letterSpacing: "0.05em", textTransform: "uppercase" }}>ACTION</div>
          <div style={{ flex: 1, fontSize: 10, fontWeight: 700, color: "#86868B", letterSpacing: "0.05em", textTransform: "uppercase", cursor: "pointer" }} onClick={() => handleSort("ais")}>
            AIS SCORE{arrowFor("ais")}
          </div>
          <div style={{ width: 128, fontSize: 10, fontWeight: 700, color: "#86868B", letterSpacing: "0.05em", textTransform: "uppercase", cursor: "pointer" }} onClick={() => handleSort("volume")}>
            VOLUME{arrowFor("volume")}
          </div>
          <div style={{ width: 96, fontSize: 10, fontWeight: 700, color: "#86868B", letterSpacing: "0.05em", textTransform: "uppercase", textAlign: "right", cursor: "pointer" }} onClick={() => handleSort("trendValue")}>
            TREND{arrowFor("trendValue")}
          </div>
          <div style={{ width: 16 }} />
        </div>

        {/* Rows */}
        <div className="action-impact-rows" style={{ maxHeight: `calc(8 * 48px)`, overflowY: "auto", scrollbarWidth: "thin", scrollbarColor: "#D5CCFF transparent" }}>
          <style>{`.action-impact-rows::-webkit-scrollbar{width:6px}.action-impact-rows::-webkit-scrollbar-track{background:transparent}.action-impact-rows::-webkit-scrollbar-thumb{background-color:#D5CCFF;border-radius:3px}.action-impact-rows::-webkit-scrollbar-thumb:hover{background-color:#C5B8FF}`}</style>
          {sorted.map((row, i) => {
            const barColor = getAisBarColor(row.ais);
            const isPositive = row.trendValue > 0;
            const intentDotColor = row.intent === "Commitment" ? "#7C5CFC" : row.intent === "Evaluation" ? "#A78BFA" : "#93C5FD";
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", minHeight: 48, borderBottom: "1px solid #F9F9FB" }}>
                <div style={{ width: 192, fontSize: 13, fontWeight: 700, color: "#3D3D40", paddingRight: 8 }}>{row.action}</div>
                <div style={{ flex: 1, paddingRight: 12 }}>
                  <div style={{ height: 32, background: "#F5F5F7", borderRadius: 6, overflow: "hidden", position: "relative" }}>
                    <div style={{ width: `${(row.ais / 10) * 100}%`, height: "100%", background: barColor, borderRadius: 6, display: "flex", alignItems: "center", paddingLeft: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{row.ais}</span>
                    </div>
                  </div>
                </div>
                <div style={{ width: 128, paddingRight: 8 }}>
                  <div style={{ height: 20, background: "#F5F5F7", borderRadius: 4, overflow: "hidden", position: "relative", marginBottom: 2 }}>
                    <div style={{ width: `${(row.volume / maxVol) * 100}%`, height: "100%", background: "#C4B5FD", borderRadius: 4 }} />
                  </div>
                  <div style={{ fontSize: 10, color: "#86868B" }}>{row.volume.toLocaleString()}</div>
                </div>
                <div style={{ width: 96, textAlign: "right", fontSize: 12, fontWeight: 700, color: isPositive ? "#34C759" : row.trendValue < 0 ? "#EF4444" : "#86868B", paddingRight: 8 }}>
                  {isPositive ? "▲" : row.trendValue < 0 ? "▼" : ""} {row.trend}
                </div>
                <div style={{ width: 16 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: intentDotColor, display: "inline-block" }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
          {[
            { color: "#7C5CFC", label: "Commitment" },
            { color: "#A78BFA", label: "Evaluating" },
            { color: "#7CB8F7", label: "Exploration" },
          ].map((l) => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: l.color, display: "inline-block" }} />
              <span style={{ fontSize: 10, color: "#86868B" }}>{l.label}</span>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 24, height: 6, borderRadius: 3, background: "linear-gradient(to right, #6B4FBB, #E9D5FF)" }} />
            <span style={{ fontSize: 10, color: "#86868B" }}>AIS significance</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 24, height: 6, borderRadius: 3, background: "#C4B5FD" }} />
            <span style={{ fontSize: 10, color: "#86868B" }}>Volume reach</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── AQS Tab Content ───────────────────────────────────────────

type AqsSortKey = "aqsScore" | "intentVolume" | "contribution";

function AQSContent() {
  const [sortKey, setSortKey] = useState<AqsSortKey>("aqsScore");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sorted = [...aqsActionsData].sort((a, b) => {
    if (sortKey === "aqsScore") {
      return sortDir === "desc" ? b.aqsScore - a.aqsScore : a.aqsScore - b.aqsScore;
    }
    if (sortKey === "contribution") {
      const av = parseFloat(a.contribution);
      const bv = parseFloat(b.contribution);
      return sortDir === "desc" ? bv - av : av - bv;
    }
    // intentVolume: strip commas
    const av = parseInt(a.intentVolume.replace(",", ""));
    const bv = parseInt(b.intentVolume.replace(",", ""));
    return sortDir === "desc" ? bv - av : av - bv;
  });

  function handleSort(key: AqsSortKey) {
    if (sortKey === key) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else { setSortKey(key); setSortDir("desc"); }
  }

  const arrowFor = (key: AqsSortKey) => sortKey === key ? (sortDir === "desc" ? " ↓" : " ↑") : " ↕";

  function getIntentDots(level: string) {
    if (level === "Commitment") return [{ color: "#7C5CFC" }, { color: "#7C5CFC" }, { color: "#7C5CFC" }];
    if (level === "Evaluating")  return [{ color: "#C4B5FD" }, { color: "#C4B5FD" }, { color: "#e0e0e0" }];
    return [{ color: "#93C5FD" }, { color: "#e0e0e0" }, { color: "#e0e0e0" }];
  }

  function getIntentBadge(level: string) {
    if (level === "Commitment") return { bg: "#EDE8FF", color: "#4A2D8A" };
    if (level === "Evaluating")  return { bg: "#F3EFFF", color: "#7C5CFC" };
    return { bg: "#EFF6FF", color: "#3B82F6" };
  }

  const maxContribAbs = Math.max(...aqsActionsData.map((r) => Math.abs(parseFloat(r.contribution))));

  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#1D1D1F", marginBottom: 4 }}>Intent Quality Mix: 30-Day Trend</div>
      <div style={{ fontSize: 11, color: "#86868B", marginBottom: 16 }}>Stacked intent composition with AQS line overlay — commitment share driving score improvement</div>

      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={aqsStackedData} margin={{ top: 4, right: 16, left: -8, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0EFF5" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#86868B" }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="pct" domain={[0, 100]} tick={{ fontSize: 10, fill: "#86868B" }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="score" orientation="right" domain={[0, 100]} tick={{ fontSize: 10, fill: "#86868B" }} axisLine={false} tickLine={false} />
          <RechartTooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
          <Bar yAxisId="pct" dataKey="exploratory" stackId="a" fill="#93C5FD" name="Exploration" />
          <Bar yAxisId="pct" dataKey="evaluating"  stackId="a" fill="#A78BFA" name="Evaluation" />
          <Bar yAxisId="pct" dataKey="commitment"  stackId="a" fill="#6B4FBB" name="Commitment" radius={[4,4,0,0]} />
          <Line yAxisId="score" dataKey="aqs" stroke="#6B4FBB" strokeWidth={2} dot={{ r: 3, fill: "#6B4FBB" }} name="AQS" />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {[
          { color: "#6B4FBB", label: "Commitment", type: "bar" },
          { color: "#A78BFA", label: "Evaluation",  type: "bar" },
          { color: "#93C5FD", label: "Exploration", type: "bar" },
        ].map((l) => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 12, height: 12, borderRadius: 2, background: l.color, display: "inline-block" }} />
            <span style={{ fontSize: 11, color: "#86868B" }}>{l.label}</span>
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 24, height: 2, background: "#6B4FBB" }} />
          <span style={{ fontSize: 11, color: "#86868B" }}>AQS</span>
        </div>
      </div>

      {/* AQS Quality Breakdown table */}
      <div style={{ fontSize: 11, fontWeight: 700, color: "#86868B", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 12 }}>
        QUALITY BREAKDOWN BY ACTION — Click column to sort
      </div>
      <div style={{ background: "linear-gradient(135deg, rgba(250,248,255,0.6), rgba(245,243,255,0.8), rgba(250,248,255,0.6))", borderRadius: 16, padding: 24 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid rgba(124,92,252,0.1)", paddingBottom: 8, marginBottom: 4 }}>
          <div style={{ width: 240, fontSize: 10, fontWeight: 700, color: "#86868B", letterSpacing: "0.05em", textTransform: "uppercase" }}>ACTION</div>
          <div style={{ width: 120, textAlign: "center", fontSize: 10, fontWeight: 700, color: "#86868B", letterSpacing: "0.05em", textTransform: "uppercase" }}>INTENT</div>
          <div style={{ width: 90, textAlign: "center", fontSize: 10, fontWeight: 700, color: "#86868B", letterSpacing: "0.05em", textTransform: "uppercase", cursor: "pointer" }} onClick={() => handleSort("aqsScore")}>
            AQS{arrowFor("aqsScore")}
          </div>
          <div style={{ width: 140, textAlign: "right", fontSize: 10, fontWeight: 700, color: "#86868B", letterSpacing: "0.05em", textTransform: "uppercase", cursor: "pointer" }} onClick={() => handleSort("intentVolume")}>
            VOLUME{arrowFor("intentVolume")}
          </div>
          <div style={{ width: 180, textAlign: "right", fontSize: 10, fontWeight: 700, color: "#86868B", letterSpacing: "0.05em", textTransform: "uppercase", cursor: "pointer" }} onClick={() => handleSort("contribution")}>
            CONTRIBUTION{arrowFor("contribution")}
          </div>
        </div>

        <div className="aqs-table-rows" style={{ maxHeight: `calc(6 * 48px)`, overflowY: "auto", scrollbarWidth: "thin", scrollbarColor: "#D5CCFF transparent" }}>
          <style>{`.aqs-table-rows::-webkit-scrollbar{width:6px}.aqs-table-rows::-webkit-scrollbar-track{background:transparent}.aqs-table-rows::-webkit-scrollbar-thumb{background-color:#D5CCFF;border-radius:3px}.aqs-table-rows::-webkit-scrollbar-thumb:hover{background-color:#C5B8FF}`}</style>
          {sorted.map((row, i) => {
            const scoreStyle = getAqsScoreStyle(row.aqsScore);
            const badgeStyle = getIntentBadge(row.intentLevel);
            const dots = getIntentDots(row.intentLevel);
            const contribVal = parseFloat(row.contribution);
            const contribColor = contribVal >= 0 ? "#7C5CFC" : "#F44336";
            const barWidth = (Math.abs(contribVal) / maxContribAbs) * 80;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", minHeight: 48, borderBottom: "1px solid rgba(124,92,252,0.05)" }}>
                <div style={{ width: 240, display: "flex", alignItems: "center", gap: 6, paddingRight: 8 }}>
                  <div style={{ display: "flex", gap: 3 }}>
                    {dots.map((d, di) => (
                      <span key={di} style={{ width: 6, height: 6, borderRadius: "50%", background: d.color, display: "inline-block" }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#1D1D1F" }}>{row.action}</span>
                </div>
                <div style={{ width: 120, textAlign: "center" }}>
                  <span style={{ background: badgeStyle.bg, color: badgeStyle.color, fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 12 }}>
                    {row.intentLevel}
                  </span>
                </div>
                <div style={{ width: 90, display: "flex", justifyContent: "center" }}>
                  <span style={{ width: 52, height: 32, display: "flex", alignItems: "center", justifyContent: "center", background: scoreStyle.bg, color: scoreStyle.color, fontSize: 13, fontWeight: 700, borderRadius: 8 }}>
                    {row.aqsScore}
                  </span>
                </div>
                <div style={{ width: 140, textAlign: "right", paddingRight: 8 }}>
                  <span style={{ background: "#F3EFFF", color: "#7C5CFC", fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 8 }}>
                    {row.intentVolume}
                  </span>
                </div>
                <div style={{ width: 180, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: contribColor, minWidth: 48, textAlign: "right" }}>{row.contribution}</span>
                  <div style={{ width: 80, height: 6, borderRadius: 3, background: "rgba(124,92,252,0.08)", overflow: "hidden" }}>
                    <div style={{ width: barWidth, height: "100%", background: contribColor, borderRadius: 3 }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── ACR Tab Content ───────────────────────────────────────────

function getRecommendationStyle(rec: string): { color: string; bgColor: string; border: string } {
  switch (rec) {
    case "Scale Up":
      return { color: "#FFFFFF", bgColor: "#4A3FA8", border: "none" };
    case "Expand Reach":
      return { color: "#4A3FA8", bgColor: "rgba(108,93,211,0.14)", border: "0.5px solid rgba(108,93,211,0.3)" };
    case "Check Friction":
      return { color: "#92400E", bgColor: "rgba(217,119,6,0.10)", border: "0.5px solid rgba(217,119,6,0.3)" };
    case "Optimize Flow":
      return { color: "#6C5DD3", bgColor: "rgba(159,151,224,0.18)", border: "0.5px solid rgba(159,151,224,0.4)" };
    case "Reduce Barriers":
      return { color: "#C94A3A", bgColor: "rgba(201,74,58,0.10)", border: "0.5px solid rgba(201,74,58,0.3)" };
    case "Fix Now":
      return { color: "#FFFFFF", bgColor: "#C94A3A", border: "none" };
    default:
      return { color: "#6C5DD3", bgColor: "rgba(159,151,224,0.18)", border: "0.5px solid rgba(159,151,224,0.4)" };
  }
}

function getACRColor(vsGoal: number): string {
  if (vsGoal >= 5) return "#4A3FA8";
  if (vsGoal >= 0) return "#7B6FD8";
  return "#C94A3A";
}

function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
}

type AcrSortKey = "acr" | "started" | "completed" | "vsGoal" | "trend";

function ACRContent() {
  const [sortKey, setSortKey] = useState<AcrSortKey>("acr");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const sorted = [...acrActionsData].sort((a, b) => {
    const av = a[sortKey] as number;
    const bv = b[sortKey] as number;
    return sortDir === "desc" ? bv - av : av - bv;
  });

  function handleSort(key: AcrSortKey) {
    if (sortKey === key) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else { setSortKey(key); setSortDir("desc"); }
  }

  const arrowFor = (key: AcrSortKey) => sortKey === key ? (sortDir === "desc" ? " ↓" : " ↑") : " ↕";

  // Segment calculations
  const needsAttention = acrActionsData.filter((a) => a.acr < 50);
  const onTrack = acrActionsData.filter((a) => a.acr >= 50 && a.acr < 65);
  const overperforming = acrActionsData.filter((a) => a.acr >= 65);

  const needsAttentionVolume = needsAttention.reduce((sum, a) => sum + a.started, 0);
  const onTrackVolume = onTrack.reduce((sum, a) => sum + a.started, 0);
  const overperformingVolume = overperforming.reduce((sum, a) => sum + a.started, 0);
  const totalVolume = needsAttentionVolume + onTrackVolume + overperformingVolume;

  const needsAttentionAvg = needsAttention.length > 0
    ? Math.round(needsAttention.reduce((sum, a) => sum + a.acr, 0) / needsAttention.length) : 0;
  const onTrackAvg = onTrack.length > 0
    ? Math.round(onTrack.reduce((sum, a) => sum + a.acr, 0) / onTrack.length) : 0;
  const overperformingAvg = overperforming.length > 0
    ? Math.round(overperforming.reduce((sum, a) => sum + a.acr, 0) / overperforming.length) : 0;

  const circum34 = 2 * Math.PI * 34;

  return (
    <div ref={sectionRef} style={{ overflow: "visible" }}>
      {/* COMPLETION RATE AT A GLANCE */}
      <div style={{ marginBottom: 32, overflow: "visible" }}>
        <div style={{ fontSize: 10.5, fontWeight: 600, color: "#A8A5BE", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 16 }}>
          COMPLETION RATE AT A GLANCE
        </div>

        <div style={{ display: "flex", borderRadius: 12, border: "1px solid rgba(108,93,211,0.10)", height: 140, overflow: "visible", position: "relative" }}>
          {/* Needs Attention */}
          <div
            style={{ flex: needsAttention.length, background: "rgba(201,74,58,0.07)", padding: "30px 32px", display: "flex", alignItems: "center", gap: 24, borderRight: "0.5px solid rgba(108,93,211,0.10)", cursor: "pointer", position: "relative" }}
            onMouseEnter={() => setHoveredSegment("needsAttention")}
            onMouseLeave={() => setHoveredSegment(null)}
          >
            {hoveredSegment === "needsAttention" && (
              <div style={{ position: "absolute", bottom: "100%", left: 32, marginBottom: 16, padding: "16px 18px", background: "#1C1C2E", color: "#fff", borderRadius: 12, minWidth: 280, boxShadow: "0 8px 24px rgba(0,0,0,0.22)", pointerEvents: "none", zIndex: 9999 }}>
                <div style={{ position: "absolute", bottom: -8, left: 32, width: 0, height: 0, borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderTop: "8px solid #1C1C2E" }} />
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>Needs Attention</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", marginBottom: 2 }}>Avg ACR: {needsAttentionAvg}% · {needsAttention.length} actions</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", marginBottom: 8 }}>{(needsAttentionVolume / 1000).toFixed(1)}k starts · {Math.round((needsAttentionVolume / totalVolume) * 100)}% of volume</div>
                {needsAttention.map((a, idx) => (
                  <div key={idx} style={{ display: "flex", gap: 6, fontSize: 11, color: "rgba(255,255,255,0.7)", marginBottom: 2 }}>
                    <span>•</span><span>{a.action}</span>
                  </div>
                ))}
              </div>
            )}
            <div style={{ position: "relative", width: 80, height: 80, flexShrink: 0 }}>
              <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(201,74,58,0.12)" strokeWidth="5.5" strokeLinecap="round" />
                <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(201,74,58,0.16)" strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${(needsAttentionAvg / 100) * circum34} ${circum34}`}
                  style={{ transition: "stroke-dasharray 1s ease-out", filter: "blur(2px)" }}
                />
                <circle cx="40" cy="40" r="34" fill="none" stroke="#C94A3A" strokeWidth="5.5" strokeLinecap="round"
                  strokeDasharray={`${(needsAttentionAvg / 100) * circum34} ${circum34}`}
                  style={{ transition: "stroke-dasharray 1s ease-out" }}
                />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: "#C94A3A", lineHeight: 1 }}>{needsAttentionAvg}%</span>
              </div>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 7 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#C94A3A", opacity: 0.65, textTransform: "uppercase", letterSpacing: "0.05em" }}>NEEDS ATTENTION</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 32, fontWeight: 700, color: "#C94A3A", lineHeight: 1 }}>{needsAttention.length}</span>
                <span style={{ fontSize: 13, color: "#1C1C2E", opacity: 0.5 }}>actions</span>
              </div>
              <div style={{ fontSize: 10.5, color: "#1C1C2E", opacity: 0.45 }}>{(needsAttentionVolume / 1000).toFixed(1)}k · {Math.round((needsAttentionVolume / totalVolume) * 100)}% of volume</div>
            </div>
          </div>

          {/* On Track */}
          <div
            style={{ flex: onTrack.length, background: "rgba(159,151,224,0.10)", padding: "30px 32px", display: "flex", alignItems: "center", gap: 24, borderRight: "0.5px solid rgba(108,93,211,0.10)", cursor: "pointer", position: "relative" }}
            onMouseEnter={() => setHoveredSegment("onTrack")}
            onMouseLeave={() => setHoveredSegment(null)}
          >
            {hoveredSegment === "onTrack" && (
              <div style={{ position: "absolute", bottom: "100%", left: 32, marginBottom: 16, padding: "16px 18px", background: "#1C1C2E", color: "#fff", borderRadius: 12, minWidth: 280, boxShadow: "0 8px 24px rgba(0,0,0,0.22)", pointerEvents: "none", zIndex: 9999 }}>
                <div style={{ position: "absolute", bottom: -8, left: 32, width: 0, height: 0, borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderTop: "8px solid #1C1C2E" }} />
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>On Track</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", marginBottom: 2 }}>Avg ACR: {onTrackAvg}% · {onTrack.length} actions</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", marginBottom: 8 }}>{(onTrackVolume / 1000).toFixed(1)}k starts · {Math.round((onTrackVolume / totalVolume) * 100)}% of volume</div>
                {onTrack.map((a, idx) => (
                  <div key={idx} style={{ display: "flex", gap: 6, fontSize: 11, color: "rgba(255,255,255,0.7)", marginBottom: 2 }}>
                    <span>•</span><span>{a.action}</span>
                  </div>
                ))}
              </div>
            )}
            <div style={{ position: "relative", width: 80, height: 80, flexShrink: 0 }}>
              <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(159,151,224,0.12)" strokeWidth="5.5" strokeLinecap="round" />
                <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(159,151,224,0.16)" strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${(onTrackAvg / 100) * circum34} ${circum34}`}
                  style={{ transition: "stroke-dasharray 1s ease-out", filter: "blur(2px)" }}
                />
                <circle cx="40" cy="40" r="34" fill="none" stroke="#9F97E0" strokeWidth="5.5" strokeLinecap="round"
                  strokeDasharray={`${(onTrackAvg / 100) * circum34} ${circum34}`}
                  style={{ transition: "stroke-dasharray 1s ease-out" }}
                />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: "#9F97E0", lineHeight: 1 }}>{onTrackAvg}%</span>
              </div>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 7 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#9F97E0", opacity: 0.65, textTransform: "uppercase", letterSpacing: "0.05em" }}>ON TRACK</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 32, fontWeight: 700, color: "#9F97E0", lineHeight: 1 }}>{onTrack.length}</span>
                <span style={{ fontSize: 13, color: "#1C1C2E", opacity: 0.5 }}>actions</span>
              </div>
              <div style={{ fontSize: 10.5, color: "#1C1C2E", opacity: 0.45 }}>{(onTrackVolume / 1000).toFixed(1)}k · {Math.round((onTrackVolume / totalVolume) * 100)}% of volume</div>
            </div>
          </div>

          {/* Overperforming */}
          <div
            style={{ flex: overperforming.length, background: "rgba(74,63,168,0.10)", padding: "30px 32px", display: "flex", alignItems: "center", gap: 24, cursor: "pointer", position: "relative" }}
            onMouseEnter={() => setHoveredSegment("overperforming")}
            onMouseLeave={() => setHoveredSegment(null)}
          >
            {hoveredSegment === "overperforming" && (
              <div style={{ position: "absolute", bottom: "100%", left: 32, marginBottom: 16, padding: "16px 18px", background: "#1C1C2E", color: "#fff", borderRadius: 12, minWidth: 280, boxShadow: "0 8px 24px rgba(0,0,0,0.22)", pointerEvents: "none", zIndex: 9999 }}>
                <div style={{ position: "absolute", bottom: -8, left: 32, width: 0, height: 0, borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderTop: "8px solid #1C1C2E" }} />
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>Overperforming</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", marginBottom: 2 }}>Avg ACR: {overperformingAvg}% · {overperforming.length} actions</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", marginBottom: 8 }}>{(overperformingVolume / 1000).toFixed(1)}k starts · {Math.round((overperformingVolume / totalVolume) * 100)}% of volume</div>
                {overperforming.map((a, idx) => (
                  <div key={idx} style={{ display: "flex", gap: 6, fontSize: 11, color: "rgba(255,255,255,0.7)", marginBottom: 2 }}>
                    <span>•</span><span>{a.action}</span>
                  </div>
                ))}
              </div>
            )}
            <div style={{ position: "relative", width: 80, height: 80, flexShrink: 0 }}>
              <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(74,63,168,0.12)" strokeWidth="5.5" strokeLinecap="round" />
                <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(74,63,168,0.16)" strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${(overperformingAvg / 100) * circum34} ${circum34}`}
                  style={{ transition: "stroke-dasharray 1s ease-out", filter: "blur(2px)" }}
                />
                <circle cx="40" cy="40" r="34" fill="none" stroke="#4A3FA8" strokeWidth="5.5" strokeLinecap="round"
                  strokeDasharray={`${(overperformingAvg / 100) * circum34} ${circum34}`}
                  style={{ transition: "stroke-dasharray 1s ease-out" }}
                />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: "#4A3FA8", lineHeight: 1 }}>{overperformingAvg}%</span>
              </div>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 7 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#4A3FA8", opacity: 0.65, textTransform: "uppercase", letterSpacing: "0.05em" }}>OVERPERFORMING</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 32, fontWeight: 700, color: "#4A3FA8", lineHeight: 1 }}>{overperforming.length}</span>
                <span style={{ fontSize: 13, color: "#1C1C2E", opacity: 0.5 }}>actions</span>
              </div>
              <div style={{ fontSize: 10.5, color: "#1C1C2E", opacity: 0.45 }}>{(overperformingVolume / 1000).toFixed(1)}k · {Math.round((overperformingVolume / totalVolume) * 100)}% of volume</div>
            </div>
          </div>
        </div>
      </div>

      {/* COMPLETION BREAKDOWN table */}
      <div style={{ marginTop: 32 }}>
        <div style={{ fontSize: 10.5, fontWeight: 600, color: "#A8A5BE", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 12 }}>
          COMPLETION BREAKDOWN — CLICK COLUMN TO SORT
        </div>

        <div style={{ border: "1px solid rgba(108,93,211,0.10)", borderRadius: 8, overflow: "hidden", maxHeight: 220 }}>
          {/* Sticky header */}
          <div style={{ position: "sticky", top: 0, background: "#fff", zIndex: 10, display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid rgba(108,93,211,0.10)" }}>
            <div style={{ width: 220, paddingRight: 12 }}>
              <button onClick={() => handleSort("acr")} style={{ fontSize: 10, fontWeight: 600, color: "#A8A5BE", textTransform: "uppercase", letterSpacing: "0.06em", cursor: "pointer", background: "none", border: "none", padding: 0 }}>
                ACTION {sortKey === "acr" ? (sortDir === "asc" ? "↑" : "↓") : ""}
              </button>
            </div>
            <div style={{ width: 70 }}>
              <button onClick={() => handleSort("acr")} style={{ fontSize: 10, fontWeight: 600, color: "#A8A5BE", textTransform: "uppercase", letterSpacing: "0.06em", cursor: "pointer", background: "none", border: "none", padding: 0 }}>
                ACR{arrowFor("acr")}
              </button>
            </div>
            <div style={{ width: 95, textAlign: "right", paddingRight: 16 }}>
              <button onClick={() => handleSort("started")} style={{ fontSize: 10, fontWeight: 600, color: "#A8A5BE", textTransform: "uppercase", letterSpacing: "0.06em", cursor: "pointer", background: "none", border: "none", padding: 0, marginLeft: "auto", display: "block" }}>
                STARTED{arrowFor("started")}
              </button>
            </div>
            <div style={{ width: 105, textAlign: "right", paddingRight: 16 }}>
              <button onClick={() => handleSort("completed")} style={{ fontSize: 10, fontWeight: 600, color: "#A8A5BE", textTransform: "uppercase", letterSpacing: "0.06em", cursor: "pointer", background: "none", border: "none", padding: 0, marginLeft: "auto", display: "block" }}>
                COMPLETED{arrowFor("completed")}
              </button>
            </div>
            <div style={{ width: 85, display: "flex", justifyContent: "center" }}>
              <button onClick={() => handleSort("vsGoal")} style={{ fontSize: 10, fontWeight: 600, color: "#A8A5BE", textTransform: "uppercase", letterSpacing: "0.06em", cursor: "pointer", background: "none", border: "none", padding: 0 }}>
                VS GOAL{arrowFor("vsGoal")}
              </button>
            </div>
            <div style={{ width: 85, display: "flex", justifyContent: "center" }}>
              <button onClick={() => handleSort("trend")} style={{ fontSize: 10, fontWeight: 600, color: "#A8A5BE", textTransform: "uppercase", letterSpacing: "0.06em", cursor: "pointer", background: "none", border: "none", padding: 0 }}>
                TREND{arrowFor("trend")}
              </button>
            </div>
            <div style={{ flex: 1, minWidth: 140 }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: "#A8A5BE", textTransform: "uppercase", letterSpacing: "0.06em" }}>RECOMMENDATION</span>
            </div>
          </div>

          {/* Scrollable body */}
          <div className="acr-rows" style={{ maxHeight: 176, overflowY: "auto", scrollbarWidth: "thin", scrollbarColor: "#D5CCFF transparent" }}>
            <style>{`.acr-rows::-webkit-scrollbar{width:6px}.acr-rows::-webkit-scrollbar-track{background:transparent}.acr-rows::-webkit-scrollbar-thumb{background-color:#D5CCFF;border-radius:3px}.acr-rows::-webkit-scrollbar-thumb:hover{background-color:#C5B8FF}`}</style>
            {sorted.map((row, i) => {
              const recStyle = getRecommendationStyle(row.recommendation);
              const acrColor = getACRColor(row.vsGoal);
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", padding: "0 16px", borderBottom: "1px solid rgba(108,93,211,0.10)", minHeight: 44, background: "transparent" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#F7F6FB"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  <div style={{ width: 220, fontSize: 11.5, color: "#1C1C2E", paddingRight: 12 }}>{row.action}</div>
                  <div style={{ width: 70 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: acrColor }}>{row.acr}%</span>
                  </div>
                  <div style={{ width: 95, textAlign: "right", fontSize: 11.5, color: "#6B6880", paddingRight: 16 }}>{formatNumber(row.started)}</div>
                  <div style={{ width: 105, textAlign: "right", fontSize: 11.5, color: "#6B6880", paddingRight: 16 }}>{formatNumber(row.completed)}</div>
                  <div style={{ width: 85, display: "flex", justifyContent: "center" }}>
                    <span style={{ fontSize: 10.5, fontWeight: 600, padding: "4px 10px", borderRadius: 20, background: row.vsGoal >= 0 ? "#EAE8FA" : "#FEF2F2", color: row.vsGoal >= 0 ? "#4A3FA8" : "#B91C1C" }}>
                      {row.vsGoal > 0 ? "+" : ""}{row.vsGoal}%
                    </span>
                  </div>
                  <div style={{ width: 85, display: "flex", justifyContent: "center", alignItems: "center", gap: 4 }}>
                    <span style={{ color: row.trend >= 0 ? "#4A3FA8" : "#B91C1C" }}>{row.trend >= 0 ? "▲" : "▼"}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: row.trend >= 0 ? "#4A3FA8" : "#B91C1C" }}>
                      {row.trend > 0 ? "+" : ""}{row.trend}%
                    </span>
                  </div>
                  <div style={{ flex: 1, minWidth: 140, display: "flex", justifyContent: "flex-start" }}>
                    <span style={{ fontSize: 10.5, fontWeight: 600, padding: "6px 14px", borderRadius: 20, whiteSpace: "nowrap", display: "inline-block", color: recStyle.color, background: recStyle.bgColor, border: recStyle.border }}>
                      {row.recommendation}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────

export function ActPerformanceDriversSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [metric, setMetric] = useState<Metric>("AIS");
  const currentMetric = metricConfig[metric];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Section header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ height: 1, background: "linear-gradient(to right, transparent, #D2D2D7, transparent)", marginBottom: 24 }} />
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1D1D1F", margin: 0, letterSpacing: -0.3 }}>Act Performance Drivers</h2>
        <p style={{ fontSize: 13, color: "#86868B", margin: "4px 0 0", fontWeight: 500 }}>What&apos;s driving quality actions and where is friction building?</p>
      </div>

      {/* Main card */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #E8E8F0",
          borderRadius: 16,
          boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Purple accent bar when AIS selected */}
        {metric === "AIS" && (
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: "linear-gradient(90deg, #7C5CFC 0%, #9B8FFF 100%)",
            boxShadow: "0 2px 8px rgba(124,92,252,0.3)",
          }} />
        )}

        <div style={{ display: "flex", flexDirection: "row" }}>
          {/* Left panel */}
          <div style={{ flex: 1, padding: 32, borderRight: "1px solid #E5E5EA" }}>
            {/* Title + tabs row */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1C1C2E", marginBottom: 4 }}>{currentMetric.title}</div>
                <div style={{ fontSize: 12, color: "#6B6880" }}>{currentMetric.description}</div>
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0, marginLeft: 16 }}>
                {(["AIS", "AQS", "ACR"] as Metric[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMetric(m)}
                    style={{
                      padding: "8px 20px",
                      borderRadius: 8,
                      border: metric === m ? "none" : "1px solid #E5E5EA",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      background: metric === m ? "#7C5CFC" : "#fff",
                      color: metric === m ? "#fff" : "#6B6B6B",
                      boxShadow: metric === m ? "0 2px 8px rgba(124,92,252,0.25)" : "none",
                      transition: "all 0.2s",
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Gauge per metric */}
            {metric === "AIS" && <AISGauge />}
            {metric === "AQS" && <AQSGauge />}
            {metric === "ACR" && <ACRGauge />}

            {/* Content per metric */}
            {metric === "AIS" && <AISContent />}
            {metric === "AQS" && <AQSContent />}
            {metric === "ACR" && <ACRContent />}
          </div>

          {/* Right panel */}
          <div style={{ flex: "0 0 25%", background: "#FAFAFA", padding: 24 }}>
            <div style={{ position: "sticky", top: 24 }}>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: "#1D1D1F", margin: "0 0 16px" }}>Your Next Move</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 24, marginBottom: 24 }}>
                {currentMetric.recommendations.map((rec, i) => (
                  <div key={i}>
                    {/* For ACR: show tag as colored label; for AIS/AQS: show category */}
                    {metric === "ACR" && rec.tag ? (
                      <div style={{ fontSize: 9.5, fontWeight: 700, color: getTagColor(rec.tag), letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 4 }}>
                        {rec.tag}
                      </div>
                    ) : metric !== "ACR" ? (
                      <div style={{ fontSize: 9.5, fontWeight: 700, color: getCategoryColor(rec.category), letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 4 }}>
                        {rec.category}
                      </div>
                    ) : null}
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1C1C2E", marginBottom: 4 }}>{rec.title}</div>
                    {rec.stat && <div style={{ fontSize: 11, color: "#6B6880", lineHeight: 1.5, marginBottom: 2 }}>{rec.stat}</div>}
                    <div style={{ fontSize: 11, fontWeight: 500, color: "#1C1C2E", lineHeight: 1.5 }}>{rec.action || rec.description}</div>
                  </div>
                ))}
              </div>
              <button
                style={{
                  width: "100%",
                  background: "linear-gradient(to right, #7C5CFC, #9B8FFF)",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "10px 20px",
                  borderRadius: 24,
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(124,92,252,0.25)",
                }}
              >
                Show Me More From AgentIQ &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
