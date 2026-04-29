"use client";
import React from "react";

type NavSection = "overview" | "reach" | "engage" | "act" | "convert" | "talk" | "campaigns";

const navItems: { id: NavSection; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "reach", label: "Reach" },
  { id: "engage", label: "Engage" },
  { id: "act", label: "Act" },
  { id: "convert", label: "Convert" },
  { id: "talk", label: "Talk" },
  { id: "campaigns", label: "Campaigns" },
];

export const SectionNav = ({
  activeSection,
  onNavigate,
}: {
  activeSection: string;
  onNavigate: (id: string) => void;
}) => (
  <nav className="sticky top-[60px] z-40 bg-white/80 backdrop-blur-xl backdrop-saturate-[180%] border-b border-gray-100">
    <div className="max-w-[1400px] mx-auto px-8 flex gap-0 overflow-x-auto">
      {navItems.map((item, idx) => (
        <React.Fragment key={item.id}>
          <button
            onClick={() => onNavigate(item.id)}
            className={`px-[1.125rem] py-3 text-[13px] font-medium whitespace-nowrap border-b-2 transition-colors ${activeSection === item.id
                ? "text-[#7652b3] border-purple-500 font-semibold"
                : "text-gray-400 border-transparent hover:text-gray-700"
              }`}
          >
            {item.label}
          </button>
          {idx < navItems.length - 1 && (
            <span className="text-gray-200 text-[10px] px-0.5 flex items-center">
              {item.id === "talk" ? "·" : "›"}
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  </nav>
);
