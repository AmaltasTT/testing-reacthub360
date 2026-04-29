"use client";

export function MetricHero({
  label,
  value,
  confidence,
}: {
  label: string;
  value: string;
  confidence?: number;
}) {
  const pct = confidence != null ? Math.min(100, Math.max(0, confidence)) : null;
  return (
    <div className="mb-3 rounded-[18px] border border-white/45 bg-[rgba(255,255,255,0.8)] p-9 shadow-[0_8px_32px_rgba(99,102,241,0.06)] backdrop-blur-md">
      <div className="mb-2.5 text-[11px] font-medium uppercase tracking-wide text-[#6366F1]">{label}</div>
      <div className="text-[56px] font-extrabold leading-none tracking-[-2.5px] text-[#1d1d1f]">{value}</div>
      {pct != null && (
        <div className="mt-3 flex items-center gap-1 text-[10px] font-light text-[#aeaeb2]">
          <span>Confidence</span>
          <div className="h-[2.5px] w-7 overflow-hidden rounded-sm bg-indigo-100">
            <span className="block h-full rounded-sm bg-[#6366F1] opacity-40" style={{ width: `${pct}%` }} />
          </div>
          <span>{pct}%</span>
        </div>
      )}
    </div>
  );
}
