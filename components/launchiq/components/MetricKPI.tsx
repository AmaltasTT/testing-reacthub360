"use client";

export function MetricKPI({
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
    <div className="rounded-[14px] border border-white/45 bg-[rgba(255,255,255,0.65)] p-5 shadow-sm backdrop-blur-md transition-shadow hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(99,102,241,0.06)]">
      <div className="mb-1 text-[11px] font-normal text-[#aeaeb2]">{label}</div>
      <div className="text-2xl font-bold tracking-tight text-[#1d1d1f]">{value}</div>
      {pct != null && (
        <div className="mt-1.5 flex items-center gap-1 text-[10px] font-light text-[#aeaeb2]">
          <div className="h-[2.5px] w-7 overflow-hidden rounded-sm bg-indigo-100">
            <span className="block h-full rounded-sm bg-[#6366F1] opacity-40" style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}
