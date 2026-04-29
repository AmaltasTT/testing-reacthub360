export type GoalVisualKey =
  | "awareness"
  | "consideration"
  | "conversion"
  | "retention"
  | "advocacy";

export function goalNameToVisualKey(name: string): GoalVisualKey | "other" {
  const n = name.trim().toLowerCase();
  if (n.includes("aware")) return "awareness";
  if (n.includes("consider")) return "consideration";
  if (n.includes("conversion")) return "conversion";
  if (n.includes("retention")) return "retention";
  if (n.includes("advocacy")) return "advocacy";
  return "other";
}

/** Handoff v4 — border + shadow tokens for selected goal card */
export const goalCardStyles: Record<
  GoalVisualKey,
  { border: string; shadow: string; iconBg: string; iconShadow: string; checkBg: string }
> = {
  awareness: {
    border: "border-[rgba(99,102,241,0.35)]",
    shadow: "shadow-[0_8px_28px_rgba(99,102,241,0.35)]",
    iconBg: "bg-gradient-to-br from-[#818CF8] to-[#6366F1]",
    iconShadow: "shadow-[0_6px_20px_rgba(99,102,241,0.2)]",
    checkBg: "bg-[#6366F1]",
  },
  consideration: {
    border: "border-[rgba(245,158,11,0.35)]",
    shadow: "shadow-[0_8px_28px_rgba(245,158,11,0.35)]",
    iconBg: "bg-gradient-to-br from-[#FCD34D] to-[#F59E0B]",
    iconShadow: "shadow-[0_6px_20px_rgba(245,158,11,0.2)]",
    checkBg: "bg-[#F59E0B]",
  },
  conversion: {
    border: "border-[rgba(16,185,129,0.35)]",
    shadow: "shadow-[0_8px_28px_rgba(16,185,129,0.35)]",
    iconBg: "bg-gradient-to-br from-[#6EE7B7] to-[#10B981]",
    iconShadow: "shadow-[0_6px_20px_rgba(16,185,129,0.2)]",
    checkBg: "bg-[#10B981]",
  },
  retention: {
    border: "border-[rgba(59,130,246,0.35)]",
    shadow: "shadow-[0_8px_28px_rgba(59,130,246,0.35)]",
    iconBg: "bg-gradient-to-br from-[#93C5FD] to-[#3B82F6]",
    iconShadow: "shadow-[0_6px_20px_rgba(59,130,246,0.2)]",
    checkBg: "bg-[#3B82F6]",
  },
  advocacy: {
    border: "border-[rgba(168,85,247,0.35)]",
    shadow: "shadow-[0_8px_28px_rgba(168,85,247,0.35)]",
    iconBg: "bg-gradient-to-br from-[#D8B4FE] to-[#A855F7]",
    iconShadow: "shadow-[0_6px_20px_rgba(168,85,247,0.2)]",
    checkBg: "bg-[#A855F7]",
  },
};
