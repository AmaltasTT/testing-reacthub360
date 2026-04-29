"use client";

import { cn } from "@/lib/utils";

export function LaunchCelebration({
  open,
  message,
  subMessage,
}: {
  open: boolean;
  message: string;
  subMessage?: string;
}) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-[300] flex flex-col items-center justify-center bg-white transition-opacity duration-300",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0 invisible"
      )}
      aria-hidden={!open}
    >
      <div className="h-11 w-11 animate-spin rounded-full border-[2.5px] border-indigo-100 border-t-[#6366F1]" />
      <p className="mt-5 animate-pulse text-[22px] font-semibold tracking-tight text-[#1d1d1f]">{message}</p>
      {subMessage && <p className="mt-2 text-sm font-light text-[#aeaeb2]">{subMessage}</p>}
    </div>
  );
}
