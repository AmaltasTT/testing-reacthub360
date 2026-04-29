"use client";

import { useState, useRef, type MouseEvent } from "react";
import { motion, useInView } from "motion/react";
import {
  CONVERT_DRIVER_CHANNELS,
  type ConvertDriverChannel,
  type DriverVerdict,
} from "@/lib/convert-stats/convert-drivers-data";

function getVerdictColor(verdict: string) {
  switch (verdict) {
    case "SCALE":
      return { bg: "bg-[#36B37E]/[0.18]", text: "text-[#36B37E]", border: "border-[#36B37E]/25" };
    case "MAINTAIN":
      return { bg: "bg-[#3B82F6]/[0.18]", text: "text-[#3B82F6]", border: "border-[#3B82F6]/25" };
    case "FIX":
      return { bg: "bg-[#EF4444]/[0.18]", text: "text-[#EF4444]", border: "border-[#EF4444]/25" };
    case "OPTIMIZE":
      return { bg: "bg-[#F59E0B]/[0.18]", text: "text-[#F59E0B]", border: "border-[#F59E0B]/25" };
    default:
      return { bg: "bg-gray-200", text: "text-gray-600", border: "border-gray-300" };
  }
}

function getSignalColor(signal: string) {
  if (signal.includes("Intent")) return { bg: "bg-[#7C4DFF]/[0.12]", text: "text-[#7C4DFF]" };
  if (signal.includes("Efficiency") || signal.includes("Champion")) return { bg: "bg-[#36B37E]/[0.12]", text: "text-[#36B37E]" };
  if (signal.includes("AOV")) return { bg: "bg-[#3B82F6]/[0.12]", text: "text-[#3B82F6]" };
  if (signal.includes("Subscription") || signal.includes("Anchor")) return { bg: "bg-[#6E6E85]/[0.12]", text: "text-[#6E6E85]" };
  if (signal.includes("Volume")) return { bg: "bg-[#EF4444]/[0.12]", text: "text-[#EF4444]" };
  return { bg: "bg-gray-100", text: "text-gray-600" };
}

function isHealthy(metric: string, value: number) {
  if (metric === "roas") return value >= 3;
  if (metric === "cvr") return value >= 3;
  if (metric === "cpc") return value < 100;
  return true;
}

function verdictInsight(verdict: DriverVerdict): string {
  switch (verdict) {
    case "SCALE":
      return "Strong performer with efficient cost structure. Increase investment to maximize returns.";
    case "MAINTAIN":
      return "Solid performance with balanced efficiency. Monitor closely and maintain current spend levels.";
    case "FIX":
      return "High cost per conversion with low ROAS. Optimize targeting or reduce spend until efficiency improves.";
    case "OPTIMIZE":
      return "Moderate performance. Test new targeting strategies to improve conversion efficiency.";
    default:
      return "";
  }
}

export function ConvertDriversSection() {
  const [hoveredChannel, setHoveredChannel] = useState<string | null>(null);
  const [tooltipData, setTooltipData] = useState<{ channel: ConvertDriverChannel; x: number; y: number } | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(chartRef, { once: true, amount: 0.3 });

  const handleBubbleHover = (channel: ConvertDriverChannel, event: MouseEvent<HTMLDivElement>) => {
    setHoveredChannel(channel.name);
    const chartRect = chartRef.current?.getBoundingClientRect();
    if (chartRect) {
      const bubbleRect = event.currentTarget.getBoundingClientRect();
      const bubbleX = bubbleRect.left + bubbleRect.width / 2;
      const bubbleY = bubbleRect.top + bubbleRect.height / 2;
      setTooltipData({
        channel,
        x: bubbleX - chartRect.left,
        y: bubbleY - chartRect.top,
      });
    }
  };

  const handleBubbleLeave = () => {
    setHoveredChannel(null);
    setTooltipData(null);
  };

  const sortedChannels = [...CONVERT_DRIVER_CHANNELS].sort((a, b) => b.cvr - a.cvr);

  return (
    <div className="mt-12 mb-12">
      <div className="mb-7">
        <h2 className="text-[26px] font-bold text-[#1A1A2E] tracking-tight mb-2" style={{ letterSpacing: "-0.5px" }}>
          Conversion Efficiency
        </h2>
        <p className="text-[14px] text-[#6E6E85]">Revenue vs. cost efficiency — bubble size = conversion volume</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#D2D2D7] shadow-md p-7">
        <div className="border-t border-b border-[#D2D2D7] py-4 mb-6">
          <div className="grid grid-cols-4 gap-6">
            <div>
              <div className="text-[11px] font-bold text-[#86868B] uppercase tracking-wide mb-2">Total Revenue</div>
              <div className="text-[28px] font-bold text-[#1D1D1F] tracking-tight font-mono">$847K</div>
              <div className="text-[12px] font-semibold text-[#36B37E] font-mono mt-1">+22% vs prior</div>
            </div>
            <div className="border-l border-[#D2D2D7] pl-6">
              <div className="text-[11px] font-bold text-[#86868B] uppercase tracking-wide mb-2">Blended ROAS</div>
              <div className="text-[28px] font-bold text-[#1D1D1F] tracking-tight font-mono">4.3×</div>
              <div className="text-[12px] font-semibold text-[#36B37E] font-mono mt-1">+0.6× vs prior</div>
            </div>
            <div className="border-l border-[#D2D2D7] pl-6">
              <div className="text-[11px] font-bold text-[#86868B] uppercase tracking-wide mb-2">Avg CPC</div>
              <div className="text-[28px] font-bold text-[#1D1D1F] tracking-tight font-mono">$2.50</div>
              <div className="text-[12px] font-semibold text-[#36B37E] font-mono mt-1">−8% vs prior</div>
            </div>
            <div className="border-l border-[#D2D2D7] pl-6">
              <div className="text-[11px] font-bold text-[#86868B] uppercase tracking-wide mb-2">Action</div>
              <div className="mt-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-[#36B37E] uppercase tracking-wide">SCALE</span>
                  <span className="text-[12px] font-semibold text-[#1D1D1F]">Email, Google PPC</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-[#EF4444] uppercase tracking-wide">FIX</span>
                  <span className="text-[12px] font-semibold text-[#1D1D1F]">TikTok</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          ref={chartRef}
          className="relative rounded-2xl border border-[#D2D2D7] overflow-hidden mb-6"
          style={{
            height: "500px",
            background: "linear-gradient(180deg, rgba(249, 250, 251, 0.5) 0%, rgba(255, 255, 255, 1) 100%)",
          }}
        >
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#E5E5E7]" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-[#E5E5E7]" />

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-semibold text-[#86868B] uppercase tracking-wide">
            Cost Per Conversion →
          </div>
          <div
            className="absolute left-4 top-1/2 text-[9px] font-semibold text-[#86868B] uppercase tracking-wide"
            style={{ transform: "translateY(-50%) rotate(-90deg)", transformOrigin: "center" }}
          >
            Revenue →
          </div>

          <div className="absolute top-4 left-4 text-[10px] font-bold text-[#36B37E] uppercase tracking-wide opacity-70">
            High Revenue · Low Cost
          </div>
          <div className="absolute top-4 right-4 text-[10px] font-bold text-[#3B82F6] uppercase tracking-wide opacity-70">
            High Revenue · High Cost
          </div>
          <div className="absolute bottom-12 left-4 text-[10px] font-bold text-[#86868B] uppercase tracking-wide opacity-70">
            Low Revenue · Low Cost
          </div>
          <div className="absolute bottom-12 right-4 text-[10px] font-bold text-[#EF4444] uppercase tracking-wide opacity-70">
            Low Revenue · High Cost
          </div>

          {CONVERT_DRIVER_CHANNELS.map((channel, index) => {
            const isHovered = hoveredChannel === channel.name;
            const isOtherHovered = Boolean(hoveredChannel && hoveredChannel !== channel.name);
            const colors = getVerdictColor(channel.verdict);

            return (
              <motion.div
                key={channel.name}
                className="absolute cursor-pointer"
                style={{
                  left: `${channel.xPercent}%`,
                  top: `${channel.yPercent}%`,
                  width: `${channel.bubbleSize}px`,
                  height: `${channel.bubbleSize}px`,
                  transform: "translate(-50%, -50%)",
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={
                  isInView
                    ? {
                        scale: isHovered ? 1.12 : 1,
                        opacity: isOtherHovered ? 0.15 : 1,
                      }
                    : { scale: 0, opacity: 0 }
                }
                transition={{
                  delay: index * 0.12,
                  duration: 0.3,
                  scale: { duration: isHovered ? 0.2 : 0.3 },
                }}
                onMouseEnter={(e) => handleBubbleHover(channel, e)}
                onMouseLeave={handleBubbleLeave}
              >
                <motion.div
                  className="w-full h-full rounded-full flex flex-col items-center justify-center text-white relative"
                  style={{
                    background: `radial-gradient(circle at 35% 35%, ${channel.color}ed, ${channel.color}aa)`,
                    boxShadow: isHovered ? `0 10px 30px ${channel.color}44` : `0 4px 12px ${channel.color}26`,
                  }}
                  animate={!hoveredChannel && isInView ? { scale: [1, 1.07, 1] } : {}}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.6,
                    ease: "easeInOut",
                  }}
                >
                  <div
                    className="font-bold text-center"
                    style={{ fontSize: channel.bubbleSize > 100 ? "15px" : channel.bubbleSize > 80 ? "12px" : "10px" }}
                  >
                    {channel.name}
                  </div>
                  <div
                    className="font-mono font-semibold opacity-85 text-center"
                    style={{ fontSize: channel.bubbleSize > 100 ? "13px" : "11px" }}
                  >
                    ${(channel.revenue / 1000).toFixed(0)}K
                  </div>
                </motion.div>

                {!hoveredChannel && (
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[8px] font-bold uppercase border ${colors.bg} ${colors.text} ${colors.border}`}
                    style={{ top: `${channel.bubbleSize}px`, marginTop: "4px" }}
                  >
                    {channel.verdict}
                  </div>
                )}
              </motion.div>
            );
          })}

          {tooltipData && (
            <div
              className="absolute bg-white border border-[#D2D2D7] rounded-2xl shadow-2xl p-5 pointer-events-none z-50"
              style={{
                left: tooltipData.x > 400 ? `${tooltipData.x - 300}px` : `${tooltipData.x + 20}px`,
                top: tooltipData.y < 250 ? `${tooltipData.y + 20}px` : `${tooltipData.y - 220}px`,
                width: "280px",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: tooltipData.channel.color }} />
                  <span className="text-[15px] font-bold text-[#1D1D1F]">{tooltipData.channel.name}</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase border ${getVerdictColor(tooltipData.channel.verdict).bg} ${getVerdictColor(tooltipData.channel.verdict).text} ${getVerdictColor(tooltipData.channel.verdict).border}`}
                >
                  {tooltipData.channel.verdict}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-[#F9FAFB] border border-[#D2D2D7] rounded-lg p-2">
                  <div className="text-[9px] font-semibold text-[#86868B] uppercase mb-1">Revenue</div>
                  <div className="text-[15px] font-bold text-[#1D1D1F] font-mono">
                    ${(tooltipData.channel.revenue / 1000).toFixed(0)}K
                  </div>
                </div>
                <div className="bg-[#F9FAFB] border border-[#D2D2D7] rounded-lg p-2">
                  <div className="text-[9px] font-semibold text-[#86868B] uppercase mb-1">ROAS</div>
                  <div
                    className={`text-[15px] font-bold font-mono ${isHealthy("roas", tooltipData.channel.roas) ? "text-[#1D1D1F]" : "text-[#EF4444]"}`}
                  >
                    {tooltipData.channel.roas.toFixed(1)}×
                  </div>
                </div>
                <div className="bg-[#F9FAFB] border border-[#D2D2D7] rounded-lg p-2">
                  <div className="text-[9px] font-semibold text-[#86868B] uppercase mb-1">CVR</div>
                  <div
                    className={`text-[15px] font-bold font-mono ${isHealthy("cvr", tooltipData.channel.cvr) ? "text-[#1D1D1F]" : "text-[#EF4444]"}`}
                  >
                    {tooltipData.channel.cvr.toFixed(1)}%
                  </div>
                </div>
                <div className="bg-[#F9FAFB] border border-[#D2D2D7] rounded-lg p-2">
                  <div className="text-[9px] font-semibold text-[#86868B] uppercase mb-1">CpCon</div>
                  <div
                    className={`text-[15px] font-bold font-mono ${isHealthy("cpc", tooltipData.channel.cpc) ? "text-[#1D1D1F]" : "text-[#EF4444]"}`}
                  >
                    ${tooltipData.channel.cpc}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#D2D2D7]">
                <p className="text-[12.5px] text-[#5A5A6E] leading-relaxed">{verdictInsight(tooltipData.channel.verdict)}</p>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-[#D2D2D7] pt-6 mt-6">
          <h4 className="text-[13px] font-bold text-[#1D1D1F] mb-4">Channel performance detail</h4>

          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-[#D2D2D7]">
                <th className="text-left text-[10px] font-bold text-[#86868B] uppercase tracking-wide pb-2">Channel</th>
                <th className="text-right text-[10px] font-bold text-[#86868B] uppercase tracking-wide pb-2">Revenue</th>
                <th className="text-right text-[10px] font-bold text-[#86868B] uppercase tracking-wide pb-2">CPC</th>
                <th className="text-right text-[10px] font-bold text-[#86868B] uppercase tracking-wide pb-2">CVR ↓</th>
                <th className="text-right text-[10px] font-bold text-[#86868B] uppercase tracking-wide pb-2">Signal</th>
                <th className="text-center text-[10px] font-bold text-[#86868B] uppercase tracking-wide pb-2">Move</th>
              </tr>
            </thead>
            <tbody>
              {sortedChannels.map((channel, idx) => {
                const signalColors = getSignalColor(channel.signal);
                const verdictColors = getVerdictColor(channel.verdict);
                const isTopPerformer = idx === 0;

                return (
                  <tr key={channel.name} className={`border-b border-[#E5E5E7] ${isTopPerformer ? "bg-[#F3F0FF]" : ""}`}>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: channel.color }} />
                        <span className="text-[13px] font-medium text-[#1D1D1F]">{channel.name}</span>
                      </div>
                    </td>
                    <td className="text-right text-[13px] font-bold text-[#1D1D1F] font-mono py-3">
                      ${(channel.revenue / 1000).toFixed(0)}K
                    </td>
                    <td className="text-right text-[13px] font-bold text-[#1D1D1F] font-mono py-3">${channel.cpc}</td>
                    <td className="text-right py-3">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-[50px] h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#7C5CFC] rounded-full"
                            style={{ width: `${Math.min((channel.cvr / 6) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-[13px] font-bold text-[#1D1D1F] font-mono w-10">{channel.cvr.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="text-right py-3">
                      <span className={`inline-block text-[11px] font-medium px-2.5 py-1 rounded-md ${signalColors.bg} ${signalColors.text}`}>
                        {channel.signal}
                      </span>
                    </td>
                    <td className="text-center py-3">
                      <span
                        className={`inline-block text-[10px] font-bold uppercase px-2.5 py-1 rounded-md ${verdictColors.bg} ${verdictColors.text}`}
                      >
                        {channel.verdict}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <p className="text-[12px] text-[#5A5A6E] mt-4">
            Top 2 channels contribute <strong className="text-[#1D1D1F]">56%</strong> of revenue.{" "}
            <strong className="text-[#1D1D1F]">HubSpot</strong> alone drives $2+ ROAS.
          </p>
        </div>
      </div>
    </div>
  );
}
