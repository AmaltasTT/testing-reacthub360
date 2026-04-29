"use client";

import { useState } from 'react';
import { ChevronDown, TrendingUp, Lightbulb, Target } from 'lucide-react';

export function WhyWeAsk() {
  const [isExpanded, setIsExpanded] = useState(true);

  const reasons = [
    {
      icon: TrendingUp,
      title: 'Industry benchmarks',
      description: 'Compare your performance against similar companies in your sector.',
    },
    {
      icon: Lightbulb,
      title: 'Smarter recommendations',
      description: 'Get AI-powered insights tailored to your business model and scale.',
    },
    {
      icon: Target,
      title: 'Relevant metrics',
      description: 'See KPIs and dashboards configured for what matters to your company.',
    },
  ];

  return (
    <div className="bg-gradient-to-br from-purple-50 to-violet-50/50 rounded-xl border border-purple-200/60 overflow-hidden transition-all">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-8 py-6 flex items-center justify-between hover:bg-purple-100/30 transition-colors"
        aria-expanded={isExpanded}
        aria-controls="why-we-ask-content"
      >
        <h3 className="text-slate-900">Why we ask this</h3>
        <ChevronDown
          className={`w-5 h-5 text-slate-600 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''
            }`}
          aria-hidden="true"
        />
      </button>

      <div
        id="why-we-ask-content"
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="px-8 pb-8 space-y-6">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#7652b3]" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 mb-1">{reason.title}</h4>
                  <p className="text-sm text-slate-600">{reason.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
