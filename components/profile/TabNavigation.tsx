"use client";

import React from 'react';
import { motion } from 'motion/react';

interface Tab {
  id: string;
  label: string;
  requiresAdmin?: boolean;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function TabNavigation({ tabs, activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="mb-12 px-8">
      <div className="flex gap-8 border-b border-slate-200/50">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                relative pb-4 transition-all duration-200
                ${isActive
                  ? 'text-violet-700'
                  : 'text-slate-500 hover:text-slate-700'
                }
              `}
            >
              {tab.label}

              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-purple-400 shadow-lg shadow-violet-500/50"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
