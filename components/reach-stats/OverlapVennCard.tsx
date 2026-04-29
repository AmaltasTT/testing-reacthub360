'use client';

import { useState } from 'react';

export function OverlapVennCard({
  pair,
  pairColors,
  pairIcons,
  overlap,
  severity,
  wastedSpend,
  uniqueA,
  uniqueB,
  shared,
  insight,
  action,
  trend,
  trendDays
}: {
  pair: [string, string];
  pairColors: [string, string];
  pairIcons: [string, string];
  overlap: number;
  severity: string;
  wastedSpend: number;
  uniqueA: number;
  uniqueB: number;
  shared: number;
  insight: string;
  action: string;
  trend?: number[];
  trendDays?: string[];
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [showAction, setShowAction] = useState(false);

  const severityColors = {
    high: { bg: "#FEE2E2", text: "#DC2626", border: "#DC2626" },
    moderate: { bg: "#FEF3C7", text: "#D97706", border: "#D97706" },
    low: { bg: "#DBEAFE", text: "#2563EB", border: "#2563EB" }
  };
  const sev = severityColors[severity as keyof typeof severityColors];

  const fmt = (n: number) => {
    if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
    if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
    return n.toFixed(0);
  };

  return (
    <div
      style={{
        padding: 18,
        background: "#fff",
        borderRadius: 12,
        border: `1.5px solid ${isHovered ? sev.border : sev.bg}`,
        boxShadow: isHovered ? '0 8px 24px rgba(0,0,0,0.12)' : '0 1px 3px rgba(0,0,0,0.05)',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: 'pointer',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <div style={{ width: 20, height: 20, borderRadius: 4, background: pairColors[0], color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>{pairIcons[0]}</div>
          <span style={{ fontSize: 13, fontWeight: 600 }}>{pair[0]}</span>
          <span style={{ fontSize: 11, color: "#9CA3AF" }}>↔</span>
          <div style={{ width: 20, height: 20, borderRadius: 4, background: pairColors[1], color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>{pairIcons[1]}</div>
          <span style={{ fontSize: 13, fontWeight: 600 }}>{pair[1]}</span>
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, color: sev.text, background: sev.bg, padding: "2px 8px", borderRadius: 12 }}>{severity.toUpperCase()}</span>
      </div>

      {/* Enhanced Venn diagram */}
      <div style={{ position: "relative", height: 70, marginBottom: 12 }}>
        <svg width="100%" height="70" viewBox="0 0 140 70">
          <circle cx="45" cy="35" r="28" fill={pairColors[0]} opacity={isHovered ? 0.4 : 0.3} />
          <circle cx="95" cy="35" r="28" fill={pairColors[1]} opacity={isHovered ? 0.4 : 0.3} />
          {/* Overlap text */}
          <text x="70" y="32" textAnchor="middle" fontSize="16" fontWeight="700" fill="#374151">{Math.round(overlap * 100)}%</text>
          <text x="70" y="44" textAnchor="middle" fontSize="9" fill="#6B7280">overlap</text>
          {/* Unique A */}
          <text x="30" y="38" textAnchor="middle" fontSize="9" fontWeight="600" fill={pairColors[0]}>{fmt(uniqueA)}</text>
          {/* Unique B */}
          <text x="110" y="38" textAnchor="middle" fontSize="9" fontWeight="600" fill={pairColors[1]}>{fmt(uniqueB)}</text>
        </svg>
      </div>

      {/* Shared audience metric */}
      <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
        <span>Shared audience:</span>
        <span style={{ fontWeight: 600, color: '#374151' }}>{fmt(shared)}</span>
      </div>

      <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 8, lineHeight: 1.4 }}>{insight}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#DC2626" }}>~${(wastedSpend / 1000).toFixed(1)}K wasted/mo</div>

      {/* Trend sparkline - shows on hover */}
      {trend && trendDays && isHovered && (
        <div style={{
          marginTop: 12,
          paddingTop: 12,
          borderTop: "1px solid #E5E7EB",
          animation: 'fadeIn 0.3s ease-in-out',
        }}>
          <div style={{ fontSize: 10, color: "#6B7280", marginBottom: 6, display: 'flex', justifyContent: 'space-between' }}>
            <span>6-week trend:</span>
            <span style={{ fontWeight: 600 }}>{trendDays[0]} → {trendDays[5]}</span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 32 }}>
            {trend.map((v, i) => {
              const max = Math.max(...trend);
              const min = Math.min(...trend);
              const range = max - min || 1;
              const height = Math.max(20, ((v - min) / range) * 100);
              return (
                <div key={i} style={{
                  flex: 1,
                  height: `${height}%`,
                  background: severity === "high" ? "#DC2626" : severity === "moderate" ? "#D97706" : "#2563EB",
                  borderRadius: 2,
                  opacity: 0.7,
                  position: 'relative',
                  transition: 'all 0.2s',
                }}>
                  <div style={{
                    position: 'absolute',
                    bottom: -16,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: 8,
                    color: '#9CA3AF',
                    whiteSpace: 'nowrap',
                  }}>{trendDays[i]}</div>
                </div>
              );
            })}
          </div>
          <div style={{ fontSize: 10, color: sev.text, marginTop: 18, textAlign: 'center', fontWeight: 600 }}>
            {trend[trend.length - 1] > trend[0] ? '↗ Increasing' : trend[trend.length - 1] < trend[0] ? '↘ Decreasing' : '→ Stable'}
          </div>
        </div>
      )}

      {/* Expandable action section */}
      {action && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #E5E7EB" }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowAction(!showAction);
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 10px',
              background: 'rgba(124,58,237,0.04)',
              border: '1px solid rgba(124,58,237,0.1)',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              color: '#7C3AED',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <span>💡 Recommended Action</span>
            <span style={{ fontSize: 10, transform: showAction ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
          </button>
          {showAction && (
            <div style={{
              marginTop: 8,
              padding: 10,
              background: '#F9FAFB',
              borderRadius: 6,
              fontSize: 11,
              color: '#374151',
              lineHeight: 1.5,
              animation: 'fadeIn 0.2s ease-in-out',
            }}>
              {action}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
