"use client";

import { useState, useRef, useId, type ReactNode } from "react";
import {
  attributionModels,
  channelBreakdown,
  REVENUE_FLOW_TOTAL_BASE,
  type AttributionModel,
  type AttributionData,
  type Node,
} from "@/lib/convert-stats/revenue-flow-data";

type LayoutNode = Node & { y: number; height: number };

function calculateNodeLayout(nodes: Node[], totalHeight: number): LayoutNode[] {
  const totalValue = nodes.reduce((sum, node) => sum + node.value, 0);
  const gap = 10;
  const usableHeight = totalHeight - gap * (nodes.length - 1);
  let currentY = 0;
  return nodes.map((node) => {
    const height = Math.max(38, (node.value / totalValue) * usableHeight);
    const y = currentY;
    currentY += height + gap;
    return { ...node, y, height };
  });
}

function generateFlowPath(
  sourceX: number,
  sourceY: number,
  _sourceHeight: number,
  targetX: number,
  targetY: number,
  _targetHeight: number,
  thickness: number
): string {
  const midX = (sourceX + targetX) / 2;
  const sourceTop = sourceY;
  const sourceBottom = sourceY + thickness;
  const targetTop = targetY;
  const targetBottom = targetY + thickness;
  return `
      M ${sourceX},${sourceTop}
      C ${midX},${sourceTop} ${midX},${targetTop} ${targetX},${targetTop}
      L ${targetX},${targetBottom}
      C ${midX},${targetBottom} ${midX},${sourceBottom} ${sourceX},${sourceBottom}
      Z
    `;
}

function getModelDescription(model: AttributionModel): string {
  const descriptions: Record<AttributionModel, string> = {
    lastClick: "Credits the final touchpoint before conversion",
    firstClick: "Credits the first touchpoint that started the journey",
    equalCredit: "Splits credit equally across all touchpoints",
    aiWeighted: "AgentIQ assigns credit based on actual influence patterns",
  };
  return descriptions[model];
}

export function RevenueFlowSection() {
  const uid = useId().replace(/:/g, "");
  const [selectedModel, setSelectedModel] = useState<AttributionModel>("lastClick");
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [tooltipData, setTooltipData] = useState<{
    svgX: number;
    svgY: number;
    node: Node;
  } | null>(null);
  const svgContainerRef = useRef<HTMLDivElement>(null);

  const data: AttributionData = attributionModels[selectedModel];

  const svgHeight = 420;
  const leftNodes = calculateNodeLayout(data.leftColumn.nodes, svgHeight);
  const middleNodes = calculateNodeLayout(data.middleColumn.nodes, svgHeight);
  const rightNodes = calculateNodeLayout(data.rightColumn.nodes, svgHeight);

  const handleNodeHover = (nodeId: string, x: number, y: number, node: Node) => {
    setHoveredNode(nodeId);
    setTooltipData({ svgX: x, svgY: y, node });
  };

  const handleNodeLeave = () => {
    setHoveredNode(null);
    setTooltipData(null);
  };

  const leftToMiddlePaths: ReactNode[] = [];
  leftNodes.forEach((sourceNode) => {
    const flows = data.leftToMiddle.filter((f) => f.source === sourceNode.id);
    let currentY = sourceNode.y;
    flows.forEach((flow, idx) => {
      const targetNode = middleNodes.find((n) => n.id === flow.target);
      if (!targetNode) return;
      const sourceTotal = data.leftToMiddle.filter((f) => f.source === sourceNode.id).reduce((sum, f) => sum + f.value, 0);
      const thickness = (flow.value / sourceTotal) * sourceNode.height;
      const flowsToTarget = data.leftToMiddle.filter((f) => f.target === flow.target);
      const indexInTarget = flowsToTarget.findIndex((f) => f.source === sourceNode.id && f.target === flow.target);
      const targetTotal = data.leftToMiddle.filter((f) => f.target === flow.target).reduce((sum, f) => sum + f.value, 0);
      let targetY = targetNode.y;
      for (let i = 0; i < indexInTarget; i++) {
        targetY += (flowsToTarget[i].value / targetTotal) * targetNode.height;
      }
      const path = generateFlowPath(130, currentY, sourceNode.height, 365, targetY, targetNode.height, thickness);
      const gradientId = `${uid}-g-${sourceNode.id}-${flow.target}-${idx}`;
      currentY += thickness;
      const isConnected = hoveredNode === sourceNode.id || hoveredNode === flow.target;
      const opacity = hoveredNode && !isConnected ? 0.06 : 1;
      leftToMiddlePaths.push(
        <g key={`${sourceNode.id}-${flow.target}-${idx}`}>
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={sourceNode.color} stopOpacity="0.4" />
              <stop offset="100%" stopColor={targetNode.color} stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <path
            d={path}
            fill={`url(#${gradientId})`}
            style={{
              opacity,
              transition: "opacity 200ms ease, d 600ms ease",
            }}
          />
        </g>
      );
    });
  });

  const middleToRightPaths: ReactNode[] = [];
  middleNodes.forEach((sourceNode) => {
    const flows = data.middleToRight.filter((f) => f.source === sourceNode.id);
    let currentY = sourceNode.y;
    flows.forEach((flow, idx) => {
      const targetNode = rightNodes.find((n) => n.id === flow.target);
      if (!targetNode) return;
      const sourceTotal = data.middleToRight.filter((f) => f.source === sourceNode.id).reduce((sum, f) => sum + f.value, 0);
      const thickness = (flow.value / sourceTotal) * sourceNode.height;
      const flowsToTarget = data.middleToRight.filter((f) => f.target === flow.target);
      const indexInTarget = flowsToTarget.findIndex((f) => f.source === sourceNode.id && f.target === flow.target);
      const targetTotal = data.middleToRight.filter((f) => f.target === flow.target).reduce((sum, f) => sum + f.value, 0);
      let targetY = targetNode.y;
      for (let i = 0; i < indexInTarget; i++) {
        targetY += (flowsToTarget[i].value / targetTotal) * targetNode.height;
      }
      const path = generateFlowPath(495, currentY, sourceNode.height, 730, targetY, targetNode.height, thickness);
      const gradientId = `${uid}-gm-${sourceNode.id}-${flow.target}-${idx}`;
      currentY += thickness;
      const isConnected = hoveredNode === sourceNode.id || hoveredNode === flow.target;
      const opacity = hoveredNode && !isConnected ? 0.06 : 1;
      middleToRightPaths.push(
        <g key={`mid-${sourceNode.id}-${flow.target}-${idx}`}>
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={sourceNode.color} stopOpacity="0.4" />
              <stop offset="100%" stopColor={targetNode.color} stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <path
            d={path}
            fill={`url(#${gradientId})`}
            style={{
              opacity,
              transition: "opacity 200ms ease, d 600ms ease",
            }}
          />
        </g>
      );
    });
  });

  const modelButtons: { key: AttributionModel; label: string }[] = [
    { key: "lastClick", label: "Last Click" },
    { key: "firstClick", label: "First Click" },
    { key: "equalCredit", label: "Equal Credit" },
    { key: "aiWeighted", label: "AI-Weighted" },
  ];

  return (
    <div className="mt-12 mb-12">
      <div className="mb-7">
        <h2 className="text-[26px] font-bold text-[#1A1A2E] tracking-tight mb-2" style={{ letterSpacing: "-0.5px" }}>
          Revenue Flow
        </h2>
        <p className="text-[14px] text-[#6E6E85]">
          Understand how different attribution models reveal revenue paths from channels to outcomes.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#D2D2D7] shadow-md p-7">
        <div className="flex items-start justify-between mb-5 gap-4 flex-wrap">
          <div>
            <p className="text-[12px] text-[#86868B]">{getModelDescription(selectedModel)}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-[#86868B] mr-1">Attribution</span>
            {modelButtons.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedModel(key)}
                className={`px-3 py-1.5 rounded-lg text-[10.5px] font-semibold transition-all duration-150 border ${
                  selectedModel === key
                    ? "bg-[#7C5CFC] text-white border-[#7C5CFC]"
                    : "bg-white text-[#5A5A6E] border-[#D2D2D7] hover:border-[#7C5CFC]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-b border-[#D2D2D7] py-4 mb-6">
          <div className="grid grid-cols-4 gap-6">
            <div>
              <div className="text-[11px] font-bold text-[#86868B] uppercase tracking-wide mb-2">Total Revenue</div>
              <div className="text-[28px] font-bold text-[#1D1D1F] tracking-tight font-mono">{data.totalRevenue}</div>
            </div>
            <div className="border-l border-[#D2D2D7] pl-6">
              <div className="text-[11px] font-bold text-[#86868B] uppercase tracking-wide mb-2">Subscription Mix</div>
              <div className="text-[28px] font-bold text-[#7C4DFF] tracking-tight font-mono">{data.subscriptionMix}</div>
            </div>
            <div className="border-l border-[#D2D2D7] pl-6">
              <div className="text-[11px] font-bold text-[#86868B] uppercase tracking-wide mb-2">Completed</div>
              <div className="text-[28px] font-bold text-[#36B37E] tracking-tight font-mono">{data.completed}</div>
            </div>
            <div className="border-l border-[#D2D2D7] pl-6">
              <div className="text-[11px] font-bold text-[#86868B] uppercase tracking-wide mb-2">Churned</div>
              <div className="text-[28px] font-bold text-[#EF4444] tracking-tight font-mono">{data.churned}</div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4 px-2">
          <div className="text-[10px] font-bold text-[#86868B] uppercase tracking-wide">{data.leftColumn.header}</div>
          <div className="text-[10px] font-bold text-[#86868B] uppercase tracking-wide">{data.middleColumn.header}</div>
          <div className="text-[10px] font-bold text-[#86868B] uppercase tracking-wide">{data.rightColumn.header}</div>
        </div>

        <div className="relative mb-6">
          <div ref={svgContainerRef} className="w-full" style={{ height: "420px" }}>
            <svg viewBox="0 0 860 420" className="w-full" style={{ height: "420px" }}>
              <g>{leftToMiddlePaths}</g>
              <g>{middleToRightPaths}</g>

              <g>
                {leftNodes.map((node) => {
                  const isHovered = hoveredNode === node.id;
                  const isConnected = hoveredNode
                    ? data.leftToMiddle.some((f) => f.source === node.id || f.target === node.id)
                    : false;
                  const opacity = hoveredNode && hoveredNode !== node.id && !isConnected ? 0.06 : 1;
                  return (
                    <g
                      key={node.id}
                      style={{
                        cursor: "pointer",
                        opacity,
                        transition: "opacity 200ms ease, transform 600ms ease",
                      }}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const svgRect = svgContainerRef.current?.getBoundingClientRect();
                        if (svgRect) {
                          handleNodeHover(node.id, rect.left + rect.width / 2 - svgRect.left, rect.bottom - svgRect.top, node);
                        }
                      }}
                      onMouseLeave={handleNodeLeave}
                    >
                      <rect
                        x="0"
                        y={node.y}
                        width="130"
                        height={node.height}
                        rx="10"
                        fill={node.color}
                        style={{
                          filter: isHovered ? `drop-shadow(0 4px 12px ${node.color}55)` : "none",
                          transition: "filter 200ms ease, y 600ms ease, height 600ms ease",
                        }}
                      />
                      <text
                        x="65"
                        y={node.y + node.height / 2}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="white"
                        fontSize="12"
                        fontWeight="700"
                      >
                        {node.label}
                      </text>
                      {node.height > 56 && (
                        <text
                          x="65"
                          y={node.y + node.height / 2 + 14}
                          textAnchor="middle"
                          fill="white"
                          fillOpacity="0.85"
                          fontSize="11"
                          fontFamily="monospace"
                        >
                          ${(node.value / 1000).toFixed(0)}K
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>

              <g>
                {middleNodes.map((node) => {
                  const isHovered = hoveredNode === node.id;
                  const isConnected = hoveredNode
                    ? data.leftToMiddle.some((f) => f.target === node.id) || data.middleToRight.some((f) => f.source === node.id)
                    : false;
                  const opacity = hoveredNode && hoveredNode !== node.id && !isConnected ? 0.06 : 1;
                  return (
                    <g
                      key={node.id}
                      style={{
                        cursor: "pointer",
                        opacity,
                        transition: "opacity 200ms ease, transform 600ms ease",
                      }}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const svgRect = svgContainerRef.current?.getBoundingClientRect();
                        if (svgRect) {
                          handleNodeHover(node.id, rect.left + rect.width / 2 - svgRect.left, rect.bottom - svgRect.top, node);
                        }
                      }}
                      onMouseLeave={handleNodeLeave}
                    >
                      <rect
                        x="365"
                        y={node.y}
                        width="130"
                        height={node.height}
                        rx="10"
                        fill={node.color}
                        style={{
                          filter: isHovered ? `drop-shadow(0 4px 12px ${node.color}55)` : "none",
                          transition: "filter 200ms ease, y 600ms ease, height 600ms ease",
                        }}
                      />
                      <text
                        x="430"
                        y={node.y + node.height / 2}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="white"
                        fontSize="12"
                        fontWeight="700"
                      >
                        {node.label}
                      </text>
                      {node.height > 56 && (
                        <text
                          x="430"
                          y={node.y + node.height / 2 + 14}
                          textAnchor="middle"
                          fill="white"
                          fillOpacity="0.85"
                          fontSize="11"
                          fontFamily="monospace"
                        >
                          ${(node.value / 1000).toFixed(0)}K
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>

              <g>
                {rightNodes.map((node) => {
                  const isHovered = hoveredNode === node.id;
                  const isConnected = hoveredNode ? data.middleToRight.some((f) => f.target === node.id) : false;
                  const opacity = hoveredNode && hoveredNode !== node.id && !isConnected ? 0.06 : 1;
                  return (
                    <g
                      key={node.id}
                      style={{
                        cursor: "pointer",
                        opacity,
                        transition: "opacity 200ms ease, transform 600ms ease",
                      }}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const svgRect = svgContainerRef.current?.getBoundingClientRect();
                        if (svgRect) {
                          handleNodeHover(node.id, rect.left + rect.width / 2 - svgRect.left, rect.bottom - svgRect.top, node);
                        }
                      }}
                      onMouseLeave={handleNodeLeave}
                    >
                      <rect
                        x="730"
                        y={node.y}
                        width="130"
                        height={node.height}
                        rx="10"
                        fill={node.color}
                        style={{
                          filter: isHovered ? `drop-shadow(0 4px 12px ${node.color}55)` : "none",
                          transition: "filter 200ms ease, y 600ms ease, height 600ms ease",
                        }}
                      />
                      <text
                        x="795"
                        y={node.y + node.height / 2}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="white"
                        fontSize="12"
                        fontWeight="700"
                      >
                        {node.label}
                      </text>
                      {node.height > 56 && (
                        <text
                          x="795"
                          y={node.y + node.height / 2 + 14}
                          textAnchor="middle"
                          fill="white"
                          fillOpacity="0.85"
                          fontSize="11"
                          fontFamily="monospace"
                        >
                          ${(node.value / 1000).toFixed(0)}K
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>

          {tooltipData && (
            <div
              className="absolute bg-white border border-[#D2D2D7] rounded-xl shadow-lg p-4 pointer-events-none"
              style={{
                left: `${tooltipData.svgX}px`,
                top: `${tooltipData.svgY + 10}px`,
                transform: "translateX(-50%)",
                width: "240px",
                zIndex: 1000,
              }}
            >
              <div className="text-[14px] font-bold text-[#1D1D1F] mb-1">{tooltipData.node.label}</div>
              {tooltipData.node.description && (
                <div className="text-[11px] text-[#86868B] mb-3">{tooltipData.node.description}</div>
              )}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-[9px] font-semibold text-[#86868B] uppercase">Revenue</div>
                  <div className="text-[15px] font-bold text-[#1D1D1F] font-mono">
                    ${(tooltipData.node.value / 1000).toFixed(0)}K
                  </div>
                </div>
                <div>
                  <div className="text-[9px] font-semibold text-[#86868B] uppercase">Share</div>
                  <div className="text-[15px] font-bold text-[#1D1D1F] font-mono">
                    {((tooltipData.node.value / REVENUE_FLOW_TOTAL_BASE) * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-4 flex-wrap mb-6">
          {[
            { label: "Subscription", color: "#7C4DFF" },
            { label: "One-time", color: "#9F7AEA" },
            { label: "Upgrade", color: "#3B82F6" },
            { label: "Renewal", color: "#B794F4" },
            { label: "Completed", color: "#36B37E" },
            { label: "In Pipeline", color: "#F59E0B" },
            { label: "Churned", color: "#EF4444" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded" style={{ backgroundColor: item.color }} />
              <span className="text-[11px] text-[#5A5A6E]">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-[#D2D2D7] pt-6 mt-6">
          <h4 className="text-[13px] font-bold text-[#1D1D1F] mb-4">Channel outcome breakdown</h4>
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-[#D2D2D7]">
                <th className="text-left text-[10px] font-bold text-[#86868B] uppercase tracking-wide pb-2">Channel</th>
                <th className="text-right text-[10px] font-bold text-[#86868B] uppercase tracking-wide pb-2">Completed %</th>
                <th className="text-right text-[10px] font-bold text-[#86868B] uppercase tracking-wide pb-2">Churned %</th>
                <th className="text-right text-[10px] font-bold text-[#86868B] uppercase tracking-wide pb-2">Friction</th>
                <th className="text-center text-[10px] font-bold text-[#86868B] uppercase tracking-wide pb-2">Verdict</th>
              </tr>
            </thead>
            <tbody>
              {channelBreakdown.map((row, idx) => (
                <tr key={idx} className="border-b border-[#E5E5E7]">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded shrink-0" style={{ backgroundColor: row.color }} />
                      <span className="text-[13px] font-medium text-[#1D1D1F]">{row.channel}</span>
                    </div>
                  </td>
                  <td className="text-right text-[13px] font-bold text-[#36B37E] py-3">{row.completed}%</td>
                  <td
                    className={`text-right text-[13px] font-bold py-3 ${row.churned >= 30 ? "text-[#EF4444]" : "text-[#5A5A6E]"}`}
                  >
                    {row.churned}%
                  </td>
                  <td className="text-right py-3">
                    {row.friction ? (
                      <span className="inline-block bg-[#FEE2E2] text-[#EF4444] text-[11px] px-2.5 py-1 rounded-md">
                        ⚠ {row.friction.label}
                        {row.friction.value != null ? ` ${row.friction.value}%` : ""}
                      </span>
                    ) : (
                      <span className="text-[#D2D2D7]">—</span>
                    )}
                  </td>
                  <td className="text-center py-3">
                    <span
                      className={`inline-block text-[10px] font-bold uppercase px-2.5 py-1 rounded-md ${
                        row.verdict === "SCALE"
                          ? "bg-[#36B37E]/[0.14] text-[#36B37E]"
                          : row.verdict === "FIX" || row.verdict === "FIX FRICTION"
                            ? "bg-[#EF4444]/[0.14] text-[#EF4444]"
                            : "bg-[#3B82F6]/[0.14] text-[#3B82F6]"
                      }`}
                    >
                      {row.verdict}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[12px] text-[#5A5A6E] mt-4">
            <strong className="text-[#1D1D1F]">TikTok</strong> has 32% churn with no mid-funnel nurture.{" "}
            <strong className="text-[#1D1D1F]">Email</strong> has the lowest churn at 8% — scale nurture sequences.
          </p>
        </div>
      </div>
    </div>
  );
}
