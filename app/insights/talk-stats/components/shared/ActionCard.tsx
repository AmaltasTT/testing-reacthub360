"use client";

interface ActionCardProps {
  tagColor: string;
  tagBg: string;
  tag: string;
  title: string;
  description: string;
}

export function ActionCard({
  tagColor,
  tagBg,
  tag,
  title,
  description,
}: ActionCardProps) {
  return (
    <div className="rounded-lg p-4" style={{ backgroundColor: "#F8F9FA" }}>
      <div
        className="mb-2 inline-block rounded px-2 py-1"
        style={{
          backgroundColor: tagBg,
          color: tagColor,
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.5px",
        }}
      >
        {tag}
      </div>
      <div
        style={{
          fontSize: "14px",
          fontWeight: 600,
          color: "var(--neutral-900)",
          marginBottom: 6,
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: "12px", color: "var(--neutral-600)", lineHeight: 1.5 }}>
        {description}
      </div>
    </div>
  );
}
