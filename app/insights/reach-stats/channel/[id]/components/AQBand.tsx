"use client";
import React from "react";
import { type Channel, fmtPct } from "@/lib/reach-stats/data";

export const AQBand = ({
  channel,
  onNavigateEngage,
}: {
  channel: Channel;
  onNavigateEngage: () => void;
}) => {
  const channelQRR = channel ? fmtPct(channel.qrr ?? 0) : "0%";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-4 overflow-hidden">
      <div className="flex items-baseline gap-2 px-6 py-3 border-b border-gray-100">
        <span className="text-[11px] font-bold uppercase tracking-widest text-gray-700">
          Attention-Qualified Reach
        </span>
        <span className="text-[9px] text-gray-400">Awareness Quality</span>
      </div>
      <div className="flex flex-wrap items-center gap-6 px-6 py-4">
        {/* QRR ratio */}
        <div className="text-center px-6 py-3 bg-purple-50 border border-purple-100 rounded-xl flex-shrink-0 animate-[subtlePulse_3s_ease-in-out_infinite]">
          <div className="text-[8px] font-bold uppercase tracking-widest text-[#7652b3] mb-0.5">
            QRR
          </div>
          <div className="font-mono text-[30px] font-extrabold text-purple-900 leading-none">
            {channelQRR}
          </div>
        </div>

        <div className="w-px h-10 bg-gray-100 flex-shrink-0" />

        {/* Resonance */}
        <div>
          <div className="text-[9px] font-semibold uppercase tracking-wide text-gray-400 mb-1">
            Resonance: <strong className="text-green-700">STRONG</strong>
          </div>
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-green-50 text-green-700 text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
            Healthy
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            Audience Saturation: <strong>18%</strong> · Message Resonance:{" "}
            <strong className="text-green-700">High</strong>
          </div>
        </div>

        {/* What Next card */}
        <div className="ml-auto min-w-[280px] bg-gray-50 border border-gray-150 rounded-xl overflow-hidden flex-shrink-0">
          <div className="flex items-center justify-between px-3.5 py-2 border-b border-gray-100">
            <span className="font-mono text-[10px] font-bold tracking-wide bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
              WHAT NEXT?
            </span>
            <button
              onClick={onNavigateEngage}
              className="text-[10px] text-[#7652b3] font-semibold hover:underline"
            >
              Full creative breakdown →
            </button>
          </div>
          <div className="p-3 flex flex-col gap-1.5">
            {[
              {
                tag: "SCALE",
                tagCls: "bg-green-100 text-green-800",
                text: "Customer Success Story (12.4% eng) + Product Demo 45s (8.2%)",
              },
              {
                tag: "SCALE",
                tagCls: "bg-green-100 text-green-800",
                text: "Interactive Product Quiz carousel (9.8% eng)",
              },
              {
                tag: "PAUSE",
                tagCls: "bg-gray-100 text-gray-500",
                text: "All static image ads — reallocate to top performers",
              },
            ].map((a, i) => (
              <div
                key={i}
                className="flex items-baseline gap-2 text-[11px] text-gray-600"
              >
                <span
                  className={`font-mono text-[9px] font-bold px-1.5 py-px rounded flex-shrink-0 ${a.tagCls}`}
                >
                  {a.tag}
                </span>
                <span>{a.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
