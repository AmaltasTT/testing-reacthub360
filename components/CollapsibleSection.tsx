"use client";

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  tooltip?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function CollapsibleSection({ title, tooltip, children, defaultOpen = false }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-slate-900 font-medium">{title}</span>
          {tooltip && (
            <div className="group relative">
              <div className="w-4 h-4 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs cursor-help">
                ?
              </div>
              <div className="absolute left-0 top-6 hidden group-hover:block w-64 bg-slate-900 text-white text-xs rounded-lg px-3 py-2 z-10">
                {tooltip}
              </div>
            </div>
          )}
        </div>
        <ChevronDown 
          className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="px-6 py-5 bg-slate-50/50 border-t border-slate-200">
          {children}
        </div>
      )}
    </div>
  );
}
