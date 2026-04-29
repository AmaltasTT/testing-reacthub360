"use client";

import { P, type Channel } from "@/lib/reach-stats/data";

interface RowLabel {
  header: string;
  items: any[];
}

interface BubbleHeatmapProps {
  rowLabels: RowLabel;
  rowRender: (item: any, index: number) => React.ReactNode;
  channelList: Channel[];
  getData: (item: any, channel: Channel) => number;
  stickyWidth?: number;
}

export function BubbleHeatmap({
  rowLabels,
  rowRender,
  channelList,
  getData,
  stickyWidth = 60,
}: BubbleHeatmapProps) {
  const COL_W = 72;
  const scrollW = channelList.length * COL_W;

  return (
    <div style={{ display: "flex", position: "relative" }}>
      <div
        style={{
          flexShrink: 0,
          width: stickyWidth,
          zIndex: 2,
          background: P.card,
          borderRight: `1px solid ${P.divider}`,
        }}
      >
        <div
          style={{
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: `1px solid ${P.divider}`,
          }}
        >
          <span
            style={{
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: 0.4,
              color: P.text3,
              fontWeight: 600,
            }}
          >
            {rowLabels.header}
          </span>
        </div>
        {rowLabels.items.map((item, i) => (
          <div
            key={i}
            style={{
              height: 56,
              display: "flex",
              alignItems: "center",
              justifyContent: stickyWidth > 80 ? "flex-start" : "center",
              paddingLeft: stickyWidth > 80 ? 12 : 0,
              gap: 8,
              borderBottom:
                i < rowLabels.items.length - 1
                  ? "1px solid rgba(0,0,0,0.03)"
                  : "none",
              cursor: (item as any).onClick ? "pointer" : "default",
            }}
            onClick={(item as any).onClick}
          >
            {rowRender(item, i)}
          </div>
        ))}
      </div>
      <div
        style={{
          flex: 1,
          overflowX: "auto",
          overflowY: "hidden",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "thin",
          scrollbarColor: `${P.accent}40 transparent`,
        }}
      >
        <div style={{ minWidth: scrollW }}>
          <div
            style={{
              display: "flex",
              borderBottom: `1px solid ${P.divider}`,
              height: 56,
            }}
          >
            {channelList.map((ch) => (
              <div
                key={ch.id}
                style={{
                  width: COL_W,
                  flexShrink: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 3,
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    background: ch.color,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 9,
                    fontWeight: 700,
                  }}
                >
                  {ch.icon}
                </div>
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 600,
                    color: P.text3,
                    textAlign: "center",
                    lineHeight: 1.15,
                    maxWidth: 62,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {ch.name.replace("Google ", "G.").replace(" Ads", "")}
                </span>
              </div>
            ))}
          </div>
          {rowLabels.items.map((item, rowIdx) => {
            const vals = channelList.map((ch) => ({ ch, val: getData(item, ch) }));
            const best = vals.reduce((a, b) => (a.val > b.val ? a : b));
            return (
              <div
                key={rowIdx}
                style={{
                  display: "flex",
                  height: 56,
                  borderBottom:
                    rowIdx < rowLabels.items.length - 1
                      ? "1px solid rgba(0,0,0,0.03)"
                      : "none",
                }}
              >
                {vals.map(({ ch, val }) => {
                  const isBest = val === best.val && val > 0;
                  const size = Math.max(26, Math.round(val * 44));
                  const bg =
                    val >= 0.6
                      ? "#7C3AED"
                      : val >= 0.4
                      ? "#A78BFA"
                      : val >= 0.25
                      ? "#D4D4D8"
                      : val > 0
                      ? "rgba(220,38,38,0.15)"
                      : "transparent";
                  const tc =
                    val >= 0.6
                      ? "#fff"
                      : val >= 0.4
                      ? "#fff"
                      : val >= 0.25
                      ? P.text1
                      : val > 0
                      ? P.danger
                      : "transparent";
                  return (
                    <div
                      key={ch.id}
                      style={{
                        width: COL_W,
                        flexShrink: 0,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {val > 0 ? (
                        <div
                          style={{
                            width: size,
                            height: size,
                            borderRadius: "50%",
                            background: bg,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 10,
                            fontWeight: 700,
                            color: tc,
                            boxShadow: isBest
                              ? `0 0 0 2px #fff, 0 0 0 3.5px ${
                                  val >= 0.6 ? "#7C3AED" : "#A78BFA"
                                }`
                              : "none",
                            transition: "all 0.3s ease",
                          }}
                        >
                          {Math.round(val * 100)}%
                        </div>
                      ) : (
                        <span
                          style={{
                            fontSize: 10,
                            color: P.text3,
                            opacity: 0.3,
                          }}
                        >
                          —
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 32,
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.9))",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
    </div>
  );
}
