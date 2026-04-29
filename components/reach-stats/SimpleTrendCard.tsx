'use client';

export function SimpleTrendCard({
  title,
  value,
  trend,
  trendLabel
}: {
  title: string;
  value: string;
  trend: number[];
  trendLabel: string;
}) {
  const max = Math.max(...trend);
  const min = Math.min(...trend);
  const range = max - min || 1;

  return (
    <div style={{ padding: 16, background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb" }}>
      <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>{value}</div>

      {/* Simple sparkline */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 24 }}>
        {trend.map((v, i) => (
          <div key={i} style={{
            flex: 1,
            height: `${((v - min) / range) * 100}%`,
            background: "#7C3AED",
            borderRadius: 2,
            opacity: 0.7
          }} />
        ))}
      </div>
      <div style={{ fontSize: 10, color: "#6B7280", marginTop: 4 }}>{trendLabel}</div>
    </div>
  );
}
