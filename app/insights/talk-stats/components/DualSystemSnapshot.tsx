"use client";

import { ArrowRightLeft, TrendingDown, TrendingUp } from "lucide-react";

interface DualSystemSnapshotProps {
  activeView: "retention" | "advocacy";
  onViewChange: (view: "retention" | "advocacy") => void;
}

export function DualSystemSnapshot({ activeView, onViewChange }: DualSystemSnapshotProps) {
  return (
    <>
      <div className="mb-2 flex gap-4">
        <button
          onClick={() => onViewChange("retention")}
          className="flex-1 rounded-2xl border p-6 transition-all"
          style={{
            backgroundColor:
              activeView === "retention" ? "var(--neutral-0)" : "var(--neutral-50)",
            borderColor: activeView === "retention" ? "var(--purple)" : "var(--border)",
            borderWidth: activeView === "retention" ? "2px" : "1px",
            boxShadow:
              activeView === "retention"
                ? "0 4px 12px rgba(124,92,252,0.12)"
                : "none",
          }}
        >
          <div className="mb-3 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: "var(--purple)" }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--neutral-700)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                RETENTION
              </span>
              {activeView === "retention" && (
                <span
                  className="rounded-full px-2 py-0.5"
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    backgroundColor: "var(--purple)",
                    color: "white",
                    textTransform: "uppercase",
                  }}
                >
                  ACTIVE
                </span>
              )}
            </div>
          </div>
          <div className="mb-1 flex items-baseline gap-2">
            <span
              style={{
                fontSize: 36,
                fontWeight: 600,
                color: "var(--neutral-900)",
                fontFamily: "var(--font-mono)",
              }}
            >
              72%
            </span>
            <div className="flex items-center gap-1" style={{ color: "var(--green)" }}>
              <TrendingUp size={18} />
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  fontFamily: "var(--font-mono)",
                }}
              >
                +3.1
              </span>
            </div>
          </div>
          <p style={{ fontSize: 14, color: "var(--neutral-500)" }}>
            CRR - Stability engine healthy
          </p>
        </button>
        <div className="flex items-center justify-center px-4">
          <ArrowRightLeft size={20} style={{ color: "var(--neutral-300)" }} />
        </div>
        <button
          onClick={() => onViewChange("advocacy")}
          className="flex-1 rounded-2xl border p-6 transition-all"
          style={{
            backgroundColor:
              activeView === "advocacy" ? "var(--neutral-0)" : "var(--neutral-50)",
            borderColor: activeView === "advocacy" ? "var(--green)" : "var(--border)",
            borderWidth: activeView === "advocacy" ? "2px" : "1px",
            boxShadow:
              activeView === "advocacy"
                ? "0 4px 12px rgba(54,179,126,0.12)"
                : "none",
          }}
        >
          <div className="mb-3 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: "var(--green)" }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--neutral-700)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                ADVOCACY
              </span>
              {activeView === "advocacy" && (
                <span
                  className="rounded-full px-2 py-0.5"
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    backgroundColor: "var(--green)",
                    color: "white",
                    textTransform: "uppercase",
                  }}
                >
                  ACTIVE
                </span>
              )}
            </div>
          </div>
          <div className="mb-1 flex items-baseline gap-2">
            <span
              style={{
                fontSize: 36,
                fontWeight: 600,
                color: "var(--neutral-900)",
                fontFamily: "var(--font-mono)",
              }}
            >
              12.1%
            </span>
            <div className="flex items-center gap-1" style={{ color: "var(--red)" }}>
              <TrendingDown size={18} />
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  fontFamily: "var(--font-mono)",
                }}
              >
                −1.4
              </span>
            </div>
          </div>
          <p style={{ fontSize: 14, color: "var(--neutral-500)" }}>
            AAR - Amplification engine stalled
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span style={{ fontSize: 11, color: "var(--neutral-400)" }}>
              820 Retained customers with high advocacy potential
            </span>
          </div>
        </button>
      </div>
      <div
        className="mb-6 rounded-lg px-4 py-2.5"
        style={{
          backgroundColor: "rgba(124,92,252,0.04)",
          border: "1px solid rgba(124,92,252,0.1)",
        }}
      >
        <p
          style={{
            fontSize: 12,
            color: "var(--neutral-700)",
            textAlign: "center",
          }}
        >
          Retention improving, but advocacy decline signals weakening downstream growth
        </p>
      </div>
    </>
  );
}
