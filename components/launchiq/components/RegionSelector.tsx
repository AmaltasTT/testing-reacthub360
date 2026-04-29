"use client";

import { cn } from "@/lib/utils";

export function RegionSelector({
  regions,
  selected,
  onToggle,
}: {
  regions: string[];
  selected: Set<string>;
  onToggle: (region: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {regions.map((r) => {
        const on = selected.has(r);
        return (
          <button
            key={r}
            type="button"
            onClick={() => onToggle(r)}
            className={cn(
              "rounded-full border-[1.5px] px-[18px] py-2 text-xs font-medium transition-all duration-200 [transition-timing-function:var(--launchiq-spring)]",
              on
                ? "border-[#6366F1] bg-[#6366F1] text-white shadow-[0_3px_10px_rgba(99,102,241,0.2)]"
                : "border-transparent bg-[#F5F5F7] text-[#6e6e73] hover:border-indigo-100 hover:bg-indigo-50/60"
            )}
          >
            {r}
          </button>
        );
      })}
    </div>
  );
}
