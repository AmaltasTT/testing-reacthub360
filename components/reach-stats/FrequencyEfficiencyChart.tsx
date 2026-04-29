'use client';

import { useState } from 'react';

interface FrequencyChannel {
  id: string;
  name: string;
  icon: string;
  color: string;
  impressions: number;
  uniqueReach: number;
  avgFreq: number;
  optimalFreq: number;
  cpm: number;
}

interface FrequencyEfficiencyChartProps {
  channels: FrequencyChannel[];
  insights: Record<string, { verdict: string; detail: string }>;
}

const P = {
  text1: "#1d1d1f",
  text2: "#6e6e73",
  text3: "#aeaeb2",
  accent: "#7C3AED",
  divider: "rgba(0,0,0,0.06)",
};

export function FrequencyEfficiencyChart({ channels, insights }: FrequencyEfficiencyChartProps) {
  const [visibleLayers, setVisibleLayers] = useState({
    impressions: true,
    cpm: true,
    frequency: true,
    optimal: true,
  });
  const [hoverChannel, setHoverChannel] = useState<string | null>(null);

  const width = 900;
  const height = 320;
  const padding = { top: 40, right: 60, bottom: 80, left: 100 };
  const barWidth = (width - padding.left - padding.right) / channels.length;

  const maxImpressions = Math.max(1, ...channels.map(c => c.impressions));
  const maxCPM = Math.max(1, ...channels.map(c => c.cpm));
  const maxFreq = Math.max(1, ...channels.map(c => Math.max(c.avgFreq, c.optimalFreq)));

  const scaleImpressions = (v: number) => ((v / maxImpressions) * (height - padding.top - padding.bottom));
  const scaleCPM = (v: number) => ((v / maxCPM) * (height - padding.top - padding.bottom));
  const scaleFreq = (v: number) => ((v / maxFreq) * (height - padding.top - padding.bottom));

  const toggleLayer = (layer: keyof typeof visibleLayers) => {
    setVisibleLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  const fmt = (n: number) => {
    if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
    if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
    return n.toFixed(0);
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Toggle Pills */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {[
          { key: 'impressions' as const, label: 'Impressions', color: P.accent },
          { key: 'cpm' as const, label: 'CPM', color: '#F59E0B' },
          { key: 'frequency' as const, label: 'Avg Frequency', color: '#EF4444' },
          { key: 'optimal' as const, label: 'Optimal Freq', color: '#10B981' },
        ].map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => toggleLayer(key)}
            style={{
              padding: '6px 12px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 500,
              background: visibleLayers[key] ? color : 'transparent',
              color: visibleLayers[key] ? '#fff' : P.text3,
              border: `1px solid ${visibleLayers[key] ? color : P.divider}`,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div style={{ position: 'relative' }}>
        <svg width={width} height={height} style={{ display: 'block' }}>
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <line
              key={ratio}
              x1={padding.left}
              y1={padding.top + (height - padding.top - padding.bottom) * (1 - ratio)}
              x2={width - padding.right}
              y2={padding.top + (height - padding.top - padding.bottom) * (1 - ratio)}
              stroke={P.divider}
              strokeWidth={1}
              strokeDasharray="2,3"
            />
          ))}

          {/* Bars and lines for each channel */}
          {channels.map((ch, i) => {
            const x = padding.left + i * barWidth + barWidth / 2;
            const isHovered = hoverChannel === ch.id;

            return (
              <g key={ch.id}>
                {/* Impressions bar */}
                {visibleLayers.impressions && (
                  <rect
                    x={x - 20}
                    y={height - padding.bottom - scaleImpressions(ch.impressions)}
                    width={40}
                    height={scaleImpressions(ch.impressions)}
                    fill={P.accent}
                    opacity={isHovered ? 0.8 : 0.5}
                    rx={4}
                  />
                )}

                {/* CPM marker */}
                {visibleLayers.cpm && (
                  <circle
                    cx={x}
                    cy={height - padding.bottom - scaleCPM(ch.cpm)}
                    r={isHovered ? 6 : 5}
                    fill="#F59E0B"
                    stroke="#fff"
                    strokeWidth={2}
                  />
                )}

                {/* Avg Frequency line endpoint */}
                {visibleLayers.frequency && (
                  <circle
                    cx={x}
                    cy={height - padding.bottom - scaleFreq(ch.avgFreq)}
                    r={isHovered ? 6 : 4}
                    fill="#EF4444"
                  />
                )}

                {/* Optimal Frequency line endpoint */}
                {visibleLayers.optimal && (
                  <circle
                    cx={x}
                    cy={height - padding.bottom - scaleFreq(ch.optimalFreq)}
                    r={isHovered ? 6 : 4}
                    fill="#10B981"
                  />
                )}

                {/* Hover area */}
                <rect
                  x={x - barWidth / 2}
                  y={padding.top}
                  width={barWidth}
                  height={height - padding.top - padding.bottom}
                  fill="transparent"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoverChannel(ch.id)}
                  onMouseLeave={() => setHoverChannel(null)}
                />

                {/* Channel label */}
                <text
                  x={x}
                  y={height - padding.bottom + 20}
                  textAnchor="middle"
                  fontSize={11}
                  fill={P.text2}
                  fontWeight={isHovered ? 600 : 400}
                >
                  {ch.icon}
                </text>
                <text
                  x={x}
                  y={height - padding.bottom + 35}
                  textAnchor="middle"
                  fontSize={10}
                  fill={P.text3}
                  transform={`rotate(-45, ${x}, ${height - padding.bottom + 35})`}
                >
                  {ch.name}
                </text>
              </g>
            );
          })}

          {/* Connecting lines for frequency */}
          {visibleLayers.frequency && (
            <path
              d={channels.map((ch, i) => {
                const x = padding.left + i * barWidth + barWidth / 2;
                const y = height - padding.bottom - scaleFreq(ch.avgFreq);
                return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
              }).join(' ')}
              fill="none"
              stroke="#EF4444"
              strokeWidth={2}
            />
          )}

          {/* Connecting lines for optimal */}
          {visibleLayers.optimal && (
            <path
              d={channels.map((ch, i) => {
                const x = padding.left + i * barWidth + barWidth / 2;
                const y = height - padding.bottom - scaleFreq(ch.optimalFreq);
                return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
              }).join(' ')}
              fill="none"
              stroke="#10B981"
              strokeWidth={2}
              strokeDasharray="4,2"
            />
          )}

          {/* Y-axis labels */}
          {visibleLayers.impressions && [0, maxImpressions / 2, maxImpressions].map((val, i) => (
            <text
              key={i}
              x={padding.left - 10}
              y={height - padding.bottom - scaleImpressions(val)}
              textAnchor="end"
              fontSize={10}
              fill={P.accent}
              alignmentBaseline="middle"
            >
              {fmt(val)}
            </text>
          ))}

          {visibleLayers.cpm && [0, maxCPM / 2, maxCPM].map((val, i) => (
            <text
              key={i}
              x={width - padding.right + 10}
              y={height - padding.bottom - scaleCPM(val)}
              textAnchor="start"
              fontSize={10}
              fill="#F59E0B"
              alignmentBaseline="middle"
            >
              ${val.toFixed(2)}
            </text>
          ))}

          {/* Axis labels */}
          <text x={padding.left - 70} y={padding.top + (height - padding.top - padding.bottom) / 2} textAnchor="middle" fontSize={11} fill={P.accent} transform={`rotate(-90, ${padding.left - 70}, ${padding.top + (height - padding.top - padding.bottom) / 2})`}>
            Impressions
          </text>
          <text x={width - padding.right + 40} y={padding.top + (height - padding.top - padding.bottom) / 2} textAnchor="middle" fontSize={11} fill="#F59E0B" transform={`rotate(90, ${width - padding.right + 40}, ${padding.top + (height - padding.top - padding.bottom) / 2})`}>
            CPM ($)
          </text>
        </svg>

        {/* Tooltip on hover */}
        {hoverChannel && (() => {
          const ch = channels.find(c => c.id === hoverChannel);
          const idx = channels.findIndex(c => c.id === hoverChannel);
          const insight = ch ? insights[ch.id] : null;
          if (!ch) return null;

          const x = padding.left + idx * barWidth + barWidth / 2;

          return (
            <div
              style={{
                position: 'absolute',
                top: 10,
                left: Math.min(Math.max(x - 140, 10), width - 300),
                background: 'rgba(255,255,255,0.98)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${P.divider}`,
                borderRadius: 10,
                padding: '12px 14px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                fontSize: 12,
                minWidth: 280,
                maxWidth: 320,
                zIndex: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ width: 24, height: 24, borderRadius: 6, background: ch.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
                  {ch.icon}
                </div>
                <span style={{ fontWeight: 600, color: P.text1 }}>{ch.name}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 10, color: P.text3 }}>Impressions</div>
                  <div style={{ fontWeight: 600, color: P.accent }}>{fmt(ch.impressions)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: P.text3 }}>CPM</div>
                  <div style={{ fontWeight: 600, color: '#F59E0B' }}>${ch.cpm.toFixed(2)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: P.text3 }}>Avg Freq</div>
                  <div style={{ fontWeight: 600, color: '#EF4444' }}>{ch.avgFreq.toFixed(1)}×</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: P.text3 }}>Optimal</div>
                  <div style={{ fontWeight: 600, color: '#10B981' }}>{ch.optimalFreq.toFixed(1)}×</div>
                </div>
              </div>

              {insight && (
                <div style={{ paddingTop: 8, borderTop: `1px solid ${P.divider}` }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: P.accent, marginBottom: 4 }}>
                    {insight.verdict}
                  </div>
                  <div style={{ fontSize: 11, color: P.text2, lineHeight: 1.4 }}>
                    {insight.detail}
                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
