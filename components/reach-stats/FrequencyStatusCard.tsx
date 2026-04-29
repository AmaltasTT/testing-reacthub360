'use client';

import { P } from '@/lib/reach-stats/data';

export function FrequencyStatusCard({
  channel
}: {
  channel: any;
}) {
  const statusColors = {
    critical: { bg: "#FEE2E2", text: "#DC2626", label: "Critical" },
    over: { bg: "#FEF3C7", text: "#D97706", label: "Over" },
    optimal: { bg: "#D1FAE5", text: "#059669", label: "Optimal" },
    under: { bg: "#DBEAFE", text: "#2563EB", label: "Under" }
  };
  const sc = statusColors[channel.status as keyof typeof statusColors];

  return (
    <div style={{ padding: 16, background: sc.bg, borderRadius: 12, border: `1px solid ${sc.text}40` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: channel.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>{channel.icon}</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{channel.name}</div>
            <div style={{ fontSize: 11, color: P.text3 }}>Avg: {channel.avgFreq.toFixed(1)}× · Optimal: {channel.optimalFreq.toFixed(1)}×</div>
          </div>
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, color: sc.text, background: "#fff", padding: "3px 8px", borderRadius: 12 }}>{sc.label}</span>
      </div>

      {channel.wastedSpend > 0 && (
        <div style={{ fontSize: 13, fontWeight: 600, color: "#DC2626" }}>
          ${(channel.wastedSpend / 1000).toFixed(1)}K recoverable
        </div>
      )}
    </div>
  );
}
