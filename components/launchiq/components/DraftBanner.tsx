"use client";

export function DraftBanner({
  campaignName,
  ageLabel,
  onResume,
  onDiscard,
  isBusy = false,
}: {
  campaignName: string;
  ageLabel: string;
  onResume: () => void;
  onDiscard: () => void;
  /** When true, resume/discard are disabled (e.g. fetching campaign from API). */
  isBusy?: boolean;
}) {
  return (
    <div className="mb-7 rounded-[18px] border-[1.5px] border-indigo-200/80 bg-indigo-50/90 p-4 shadow-sm backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-[15px] font-semibold text-[#1d1d1f]">
            Continue setting up <span className="text-indigo-700">{campaignName}</span>?
          </div>
          <div className="text-xs font-light text-[#aeaeb2]">Last updated {ageLabel}</div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={isBusy}
            onClick={onResume}
            className="rounded-[10px] bg-[#6366F1] px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isBusy ? "Loading…" : "Resume"}
          </button>
          <button
            type="button"
            disabled={isBusy}
            onClick={onDiscard}
            className="rounded-[10px] bg-[#F5F5F7] px-4 py-2 text-[13px] font-medium text-[#aeaeb2] transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Start new
          </button>
        </div>
      </div>
    </div>
  );
}
