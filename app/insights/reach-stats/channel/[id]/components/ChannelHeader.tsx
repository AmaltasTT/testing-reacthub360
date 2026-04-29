"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { enrichedChannels, type Channel } from "@/lib/reach-stats/data";
import { useChannelsList } from "@/hooks/use-channel-drilldown";

interface DatePreset {
  label: string;
  from: string;
  to: string;
}

function resolveLogoUrl(logo: unknown): string | null {
  if (logo == null) return null;
  if (typeof logo === "string") {
    const t = logo.trim();
    return t || null;
  }
  if (typeof logo === "object" && logo !== null && "url" in logo) {
    const value = (logo as { url?: unknown }).url;
    if (typeof value === "string") {
      const t = value.trim();
      return t || null;
    }
  }
  return null;
}

function getQuickPresets(): DatePreset[] {
  const today = new Date().toISOString().split("T")[0];
  const now = Date.now();
  return [
    {
      label: "Last 7 days",
      from: new Date(now - 7 * 86400000).toISOString().split("T")[0],
      to: today,
    },
    {
      label: "Last 30 days",
      from: new Date(now - 30 * 86400000).toISOString().split("T")[0],
      to: today,
    },
    {
      label: "This month",
      from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0],
      to: today,
    },
  ];
}

function formatDateRange(from?: string, to?: string): string {
  if (!from || !to) return "Select date range";
  const f = new Date(from);
  const t = new Date(to);
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const fromStr = f.toLocaleDateString("en-US", opts);
  const toStr = t.toLocaleDateString("en-US", { ...opts, year: "numeric" });
  return `${fromStr}–${toStr}`;
}

function matchesQuickPreset(from: string | undefined, to: string | undefined, presets: DatePreset[]): boolean {
  if (!from || !to) return false;
  return presets.some((p) => p.from === from && p.to === to);
}

export const ChannelHeader = ({
  channel,
  dateFrom,
  dateTo,
  onDateRangeChange,
  channelSwitchSearch,
}: {
  channel: Channel;
  dateFrom?: string;
  dateTo?: string;
  onDateRangeChange?: (from: string, to: string) => void;
  /** Preserve query string (e.g. `campaign_id`) when switching channels. */
  channelSwitchSearch?: string;
}) => {
  const router = useRouter();
  const [showChannelDropdown, setShowChannelDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const channelRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);

  const quickPresets = getQuickPresets();
  const isCustomRange =
    !!dateFrom &&
    !!dateTo &&
    !matchesQuickPreset(dateFrom, dateTo, quickPresets);

  useEffect(() => {
    if (dateFrom) setCustomFrom(dateFrom);
    if (dateTo) setCustomTo(dateTo);
  }, [dateFrom, dateTo]);

  const { data: apiChannels } = useChannelsList();

  const dropdownChannels = (apiChannels ?? []).length > 0
    ? (apiChannels ?? []).map((ch) => ({
        id: String(ch.id),
        name: ch.name,
        icon: ch.name.charAt(0).toUpperCase(),
        color: "#7C3AED",
        logoUrl: resolveLogoUrl(ch.logo),
      }))
    : enrichedChannels.map((ch) => ({ id: ch.id, name: ch.name, icon: ch.icon, color: ch.color, logoUrl: null as string | null }));

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (channelRef.current && !channelRef.current.contains(e.target as Node)) setShowChannelDropdown(false);
      if (dateRef.current && !dateRef.current.contains(e.target as Node)) setShowDateDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl backdrop-saturate-[180%] border-b border-gray-100 px-8 py-3">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[7px] bg-gradient-to-br from-purple-600 to-purple-900 grid place-items-center text-[12px] font-bold text-white">
              R
            </div>
            <span className="text-[13px] font-semibold text-gray-700">REACTIQ360</span>
          </div>

          {/* Channel pill with dropdown */}
          <div ref={channelRef} className="relative">
            <button
              onClick={() => setShowChannelDropdown(!showChannelDropdown)}
              className="flex items-center gap-2 px-3.5 py-[7px] pr-3 bg-white border border-gray-200 rounded-[10px] cursor-pointer hover:border-gray-300 transition-colors"
            >
              {(channel as any)?.logoUrl ? (
                <img src={(channel as any).logoUrl} alt="" className="w-[26px] h-[26px] rounded-[7px] object-contain flex-shrink-0" />
              ) : (
                <div
                  className="w-[26px] h-[26px] rounded-[7px] grid place-items-center text-[13px] font-bold text-white flex-shrink-0"
                  style={{ background: channel?.color ?? "#7652B3" }}
                >
                  {channel?.icon ?? "?"}
                </div>
              )}
              <span className="text-[13px] font-semibold text-gray-800">{channel?.name ?? "Loading..."}</span>
              <span className="text-[10px] text-gray-400">▾</span>
            </button>
            {showChannelDropdown && (
              <div className="absolute top-full left-0 mt-1.5 bg-white border border-gray-200 rounded-[10px] shadow-lg z-[200] min-w-[200px] p-1.5 max-h-[400px] overflow-y-auto">
                {dropdownChannels.map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => {
                      setShowChannelDropdown(false);
                      const qs = channelSwitchSearch?.trim();
                      router.push(
                        `/insights/reach-stats/channel/${ch.id}${qs ? `?${qs}` : ""}`
                      );
                    }}
                    className={`flex items-center gap-2 w-full px-3 py-2 rounded-[7px] text-[13px] font-medium text-gray-700 hover:bg-gray-50 ${ch.id === channel?.id ? "bg-purple-50 font-semibold text-[#7652b3]" : ""
                      }`}
                  >
                    {ch.logoUrl ? (
                      <img src={ch.logoUrl} alt="" className="w-5 h-5 rounded-[5px] object-contain flex-shrink-0" />
                    ) : (
                      <span
                        className="w-5 h-5 rounded-[5px] grid place-items-center text-[11px] font-bold text-white flex-shrink-0"
                        style={{ background: ch.color }}
                      >
                        {ch.icon}
                      </span>
                    )}
                    {ch.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-2 items-center flex-wrap">
          <div ref={dateRef} className="relative">
            <button
              onClick={() => setShowDateDropdown(!showDateDropdown)}
              className="inline-flex items-center gap-1.5 px-3 py-[7px] border border-gray-200 rounded-[9px] text-[12px] font-medium text-gray-500 bg-white hover:border-gray-300 transition-colors"
            >
              📅 {formatDateRange(dateFrom, dateTo)}
              <span className="text-[10px] text-gray-400">▾</span>
            </button>
            {showDateDropdown && (
              <div className="absolute top-full right-0 mt-1.5 bg-white border border-gray-200 rounded-[10px] shadow-lg z-[200] min-w-[280px] p-2">
                <div className="text-[8px] font-bold uppercase tracking-[0.08em] text-gray-400 px-3 pt-1.5 pb-1">Quick select</div>
                {quickPresets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      onDateRangeChange?.(preset.from, preset.to);
                      setCustomFrom(preset.from);
                      setCustomTo(preset.to);
                      setShowDateDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-[7px] text-[13px] font-medium text-gray-700 hover:bg-gray-50 ${
                      dateFrom === preset.from && dateTo === preset.to ? "bg-purple-50 text-[#7652b3] font-semibold" : ""
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}

                <div className="my-2 border-t border-gray-100" />

                <div className="text-[8px] font-bold uppercase tracking-[0.08em] text-gray-400 px-3 pt-0.5 pb-1.5">Custom range</div>
                <div className="px-2 pb-1 space-y-2">
                  <div className="flex gap-2 items-end">
                    <label className="flex-1 min-w-0">
                      <span className="block text-[11px] text-gray-500 mb-1">From</span>
                      <input
                        type="date"
                        value={customFrom}
                        onChange={(e) => setCustomFrom(e.target.value)}
                        className="w-full rounded-[7px] border border-gray-200 px-2 py-1.5 text-[12px] text-gray-800 bg-white"
                      />
                    </label>
                    <label className="flex-1 min-w-0">
                      <span className="block text-[11px] text-gray-500 mb-1">To</span>
                      <input
                        type="date"
                        value={customTo}
                        onChange={(e) => setCustomTo(e.target.value)}
                        className="w-full rounded-[7px] border border-gray-200 px-2 py-1.5 text-[12px] text-gray-800 bg-white"
                      />
                    </label>
                  </div>
                  <button
                    type="button"
                    disabled={!customFrom || !customTo}
                    onClick={() => {
                      let from = customFrom;
                      let to = customTo;
                      if (from > to) [from, to] = [to, from];
                      setCustomFrom(from);
                      setCustomTo(to);
                      onDateRangeChange?.(from, to);
                      setShowDateDropdown(false);
                    }}
                    className={`w-full rounded-[7px] py-2 text-[13px] font-semibold transition-colors ${
                      isCustomRange ? "bg-purple-50 text-[#7652b3]" : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    } disabled:opacity-50 disabled:pointer-events-none`}
                  >
                    Apply custom range
                  </button>
                </div>
              </div>
            )}
          </div>

          <button className="inline-flex items-center gap-1.5 px-3 py-[7px] border border-gray-200 rounded-[9px] text-[12px] font-medium text-gray-500 bg-white">
            {channel?.account || "Acme Marketing"} ▾
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 py-[7px] bg-purple-600 text-white rounded-[9px] text-[12px] font-medium border border-purple-600">
            ↓ Export
          </button>
        </div>
      </div>
    </header>
  );
};
