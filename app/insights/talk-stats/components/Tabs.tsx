"use client";

interface TabsProps {
  activeTab: "overview" | "channel";
  onTabChange: (tab: "overview" | "channel") => void;
}

export function Tabs({ activeTab, onTabChange }: TabsProps) {
  return (
    <div className="mb-6 border-b" style={{ borderColor: "var(--border)" }}>
      <div className="flex gap-6">
        {(["overview", "channel"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className="relative pb-3"
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: activeTab === tab ? "var(--purple)" : "var(--neutral-500)",
            }}
          >
            {tab === "overview" ? "Overview" : "Channel Performance"}
            {activeTab === tab && (
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ backgroundColor: "var(--purple)" }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
