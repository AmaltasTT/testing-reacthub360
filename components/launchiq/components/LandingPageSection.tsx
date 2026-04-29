"use client";

import { useState } from "react";

export function LandingPageSection({
  pages,
  onChange,
  utmCampaign,
}: {
  pages: string[];
  onChange: (pages: string[]) => void;
  utmCampaign: string;
}) {
  const [open, setOpen] = useState(false);

  const primary = pages[0] || "";

  return (
    <div>
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full items-center rounded-[14px] border border-white/45 bg-[rgba(255,255,255,0.65)] px-5 py-4 text-left shadow-sm backdrop-blur-md transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(99,102,241,0.06)]"
        >
          <span className="flex-1 text-sm font-medium text-[#6e6e73]">Landing page</span>
          <span className="launchiq-mono max-w-[40%] truncate text-xs text-[#aeaeb2]">
            {primary || "https://…"}
          </span>
          <span className="ml-4 text-xs font-medium text-[#6366F1]">Edit</span>
        </button>
      ) : (
        <div className="rounded-[14px] border border-white/45 bg-white p-5 shadow-md">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-[#6e6e73]">Landing pages</span>
            <button type="button" className="text-xs font-medium text-[#6366F1]" onClick={() => setOpen(false)}>
              Collapse
            </button>
          </div>
          <div className="space-y-2">
            {pages.map((url, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className="launchiq-mono min-w-0 flex-1 rounded-[10px] border border-white/45 bg-[rgba(255,255,255,0.8)] px-[18px] py-3.5 text-[13px] text-[#1d1d1f] outline-none focus:border-[#6366F1] focus:ring-4 focus:ring-indigo-500/10"
                  value={url}
                  placeholder="https://…"
                  onChange={(e) => {
                    const next = [...pages];
                    next[i] = e.target.value;
                    onChange(next);
                  }}
                />
                <button
                  type="button"
                  className="rounded-[10px] bg-[#F5F5F7] px-3 text-lg text-[#aeaeb2] transition-colors hover:bg-rose-500 hover:text-white"
                  onClick={() => onChange(pages.filter((_, j) => j !== i))}
                  aria-label="Remove URL"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="mt-2 text-xs font-medium text-[#6366F1]"
            onClick={() => onChange([...pages, ""])}
          >
            + Add another page
          </button>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <div className="mb-1 text-[10px] font-light text-[#aeaeb2]">utm_source</div>
              <input readOnly className="w-full rounded-[10px] border-0 bg-[#F5F5F7] px-3 py-2.5 text-[11px] text-[#aeaeb2]" value="reactiq360" />
            </div>
            <div>
              <div className="mb-1 text-[10px] font-light text-[#aeaeb2]">utm_campaign</div>
              <input
                readOnly
                className="w-full rounded-[10px] border-0 bg-[#F5F5F7] px-3 py-2.5 text-[11px] text-[#aeaeb2]"
                value={utmCampaign}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
