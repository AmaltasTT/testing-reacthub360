"use client";

import { Check, LineChart, Megaphone, RefreshCw, Search, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { goalCardStyles, goalNameToVisualKey, type GoalVisualKey } from "@/components/launchiq/lib/goalColors";

const goalCopy: Partial<
  Record<GoalVisualKey, { title: string; description: string; Icon: typeof Target }>
> = {
  awareness: {
    title: "Awareness",
    description: "Maximize qualified reach within your ICP",
    Icon: Target,
  },
  consideration: {
    title: "Consideration",
    description: "Drive engagement and action initiation",
    Icon: Search,
  },
  conversion: {
    title: "Conversion",
    description: "Convert prospects with measurable revenue",
    Icon: LineChart,
  },
  retention: {
    title: "Retention",
    description: "Maximize customer lifetime value",
    Icon: RefreshCw,
  },
  advocacy: {
    title: "Advocacy",
    description: "Turn customers into brand advocates",
    Icon: Megaphone,
  },
};

export function GoalCard({
  goalName,
  goalId,
  selected,
  onSelect,
}: {
  goalName: string;
  goalId: string;
  selected: boolean;
  onSelect: () => void;
}) {
  const key = goalNameToVisualKey(goalName);
  const styles = key !== "other" ? goalCardStyles[key] : goalCardStyles.awareness;
  const copy =
    key !== "other" && goalCopy[key]
      ? goalCopy[key]!
      : { title: goalName, description: "Campaign goal", Icon: Target };
  const { Icon } = copy;

  return (
    <button
      type="button"
      onClick={onSelect}
      data-goal={key === "other" ? "awareness" : key}
      className={cn(
        "relative rounded-[24px] border-[1.5px] border-white/45 bg-[rgba(255,255,255,0.8)] p-8 text-left shadow-[0_8px_32px_rgba(99,102,241,0.06),0_2px_8px_rgba(0,0,0,0.02)] backdrop-blur-md transition-all duration-[450ms] [transition-timing-function:var(--launchiq-spring)]",
        "hover:-translate-y-1.5 hover:shadow-[0_24px_64px_rgba(99,102,241,0.08),0_4px_12px_rgba(0,0,0,0.03)]",
        key === "retention" && "col-span-2",
        selected && "border-white bg-white",
        selected && key !== "other" && styles.border,
        selected && key !== "other" && styles.shadow
      )}
    >
      {selected && (
        <div
          className={cn(
            "absolute right-5 top-5 flex h-7 w-7 items-center justify-center rounded-full text-white shadow-md animate-in zoom-in-50 duration-300",
            key !== "other" ? styles.checkBg : "bg-[#6366F1]"
          )}
        >
          <Check className="h-3.5 w-3.5 stroke-[2.5]" />
        </div>
      )}
      <div
        className={cn(
          "launchiq-goal-icon-wrap relative mb-[22px] flex h-14 w-14 items-center justify-center rounded-2xl text-white transition-transform duration-300 [transition-timing-function:var(--launchiq-spring)]",
          styles.iconBg,
          styles.iconShadow,
          selected && "scale-105",
          selected && key !== "other" && styles.shadow
        )}
      >
        <Icon className="relative z-[1] h-7 w-7 stroke-[1.8]" stroke="white" fill="none" />
      </div>
      <div className="mb-1 text-[22px] font-bold tracking-tight text-[#1d1d1f]">{copy.title}</div>
      <div className="text-[13px] font-light leading-snug text-[#6e6e73]">{copy.description}</div>
    </button>
  );
}
