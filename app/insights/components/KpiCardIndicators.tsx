"use client";

// ─── SHARED KPI CARD BOTTOM INDICATOR COMPONENTS ─────────────
// Used by reach-stats and engage-stats KPI header cards

export function StatusLineIndicator({ percentage }: { percentage: number }) {
  const status = percentage >= 75 ? "On Track" : percentage >= 50 ? "Fair" : "Needs Attention";
  return (
    <div
      style={{
        height: 48,
        padding: "0 24px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        borderTop: "1px solid #E8E8F0",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 9, fontWeight: 500, color: "#9A9AAA", letterSpacing: "0.05em", textTransform: "uppercase" }}>
          STATUS VS. TARGET
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#7C5CFC" }}>{percentage}%</span>
          <span style={{ fontSize: 9, color: "#7C5CFC" }}>{status}</span>
        </div>
      </div>
      <div style={{ position: "relative", height: 4, width: "100%" }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: `${percentage}%`,
            background: "#C5D5F7",
            borderRadius: 9999,
            transition: "width 0.3s",
          }}
        />
        {percentage < 100 && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              right: 0,
              transform: "translate(50%, -50%)",
              width: 8,
              height: 8,
              background: "#fff",
              border: "2px solid #B5C7EB",
              borderRadius: "50%",
            }}
          />
        )}
      </div>
    </div>
  );
}

export function TargetStatusIndicator({
  current,
  target,
  unit,
  isLowerBetter = false,
}: {
  current: number;
  target: number;
  unit: string;
  isLowerBetter?: boolean;
}) {
  const isGood = isLowerBetter ? current < target : current > target;
  const isBad = isLowerBetter ? current > target : current < target;
  const statusText = current === target ? "On Target" : isGood ? "Below Target" : "Above Target";
  const statusColor = current === target ? "#7C5CFC" : isGood ? "#10B981" : "#EF4444";

  return (
    <div
      style={{
        height: 48,
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderTop: "1px solid #E8E8F0",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontSize: 9, fontWeight: 500, color: "#9A9AAA", letterSpacing: "0.05em", textTransform: "uppercase" }}>
          STATUS VS. TARGET
        </span>
        <span style={{ fontSize: 11, fontWeight: 700, color: statusColor }}>{statusText}</span>
      </div>
      <span style={{ fontSize: 10, fontWeight: 600, color: "#5A5A6E" }}>
        Target: {unit}{(target ?? 0).toFixed(2)}
      </span>
    </div>
  );
}

export function CircleFillIndicator({ percentage, label = "penetration" }: { percentage: number; label?: string }) {
  const radius = 16;
  const strokeWidth = 3;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const safePct = isFinite(percentage) ? percentage : 0;
  const strokeDashoffset = circumference - (safePct / 100) * circumference;

  return (
    <div
      style={{
        height: 48,
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        borderTop: "1px solid #E8E8F0",
      }}
    >
      <svg width="36" height="36" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r={normalizedRadius} fill="none" stroke="#E8E8F0" strokeWidth={strokeWidth} />
        <circle
          cx="18"
          cy="18"
          r={normalizedRadius}
          fill="none"
          stroke="#C5D5F7"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 18 18)"
          style={{ transition: "stroke-dashoffset 0.3s" }}
        />
      </svg>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontSize: 9, fontWeight: 500, color: "#9A9AAA", letterSpacing: "0.05em", textTransform: "uppercase" }}>
          STATUS VS. TARGET
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#7C5CFC" }}>{isFinite(percentage) ? percentage : "—"}%</span>
          <span style={{ fontSize: 9, color: "#9A9AAA" }}>{label}</span>
        </div>
      </div>
    </div>
  );
}

export function ArcColorIndicator({ percentage, label = "rate" }: { percentage: number; label?: string }) {
  const getColor = (pct: number) => {
    if (pct < 25) return "#EF4444";
    if (pct < 50) return "#F97316";
    if (pct < 75) return "#C5D5F7";
    return "#7C5CFC";
  };
  const getStatusLabel = (pct: number) => {
    if (pct < 25) return "Critical";
    if (pct < 50) return "Low";
    if (pct < 75) return "Good";
    return "Excellent";
  };

  const color = getColor(percentage);
  const statusLabel = getStatusLabel(percentage);
  const angle = 180 - (percentage / 100) * 180;
  const angleRad = (angle * Math.PI) / 180;
  const cx = 32, cy = 30, r = 22;
  const dialX = cx + r * Math.cos(angleRad);
  const dialY = cy - r * Math.sin(angleRad);

  return (
    <div
      style={{
        height: 48,
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderTop: "1px solid #E8E8F0",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <svg width="64" height="34" viewBox="0 0 64 34" style={{ flexShrink: 0 }}>
          <path d={`M 10 30 A 22 22 0 0 1 54 30`} fill="none" stroke="#E8E8F0" strokeWidth="6" strokeLinecap="round" />
          <path
            d={`M 10 30 A 22 22 0 0 1 ${dialX} ${dialY}`}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            style={{
              filter: percentage >= 50 ? "drop-shadow(0 0 4px rgba(124,92,252,0.4))" : "none",
              transition: "all 0.3s",
            }}
          />
          <circle cx={dialX} cy={dialY} r="3.5" fill="white" stroke={color} strokeWidth="2" style={{ transition: "all 0.3s" }} />
        </svg>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 9, fontWeight: 500, color: "#9A9AAA", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            STATUS VS. TARGET
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color }}>{percentage}%</span>
            <span style={{ fontSize: 9, color }}>· {statusLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
