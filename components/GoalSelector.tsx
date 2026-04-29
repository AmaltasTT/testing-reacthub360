"use client";

import { Check, Info } from 'lucide-react';

interface GoalOption {
  id: string;
  name: string;
  phase: string;
  description?: string;
}

interface GoalSelectorProps {
  goals: GoalOption[];
  selectedGoal: string;
  onSelectGoal: (goalId: string) => void;
}

export function GoalSelector({ goals, selectedGoal, onSelectGoal }: GoalSelectorProps) {
  return (
    <>
      <style>{`
        .goal-selector-container::-webkit-scrollbar {
          height: 6px;
        }
        .goal-selector-container::-webkit-scrollbar-track {
          background: #f8fafc;
          border-radius: 3px;
        }
        .goal-selector-container::-webkit-scrollbar-thumb {
          background: #e9d5ff;
          border-radius: 3px;
        }
        .goal-selector-container::-webkit-scrollbar-thumb:hover {
          background: #ddd6fe;
        }
      `}</style>
      <div 
        className="goal-selector-container flex gap-3 overflow-x-auto pb-2 pt-3"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#e9d5ff #f8fafc'
        }}
      >
        {goals.map((goal) => {
          const isSelected = selectedGoal === goal.id;

          return (
            <button
              key={goal.id}
              type="button"
              onClick={() => onSelectGoal(goal.id)}
              className={`relative px-6 py-3.5 rounded-xl border-2 transition-all whitespace-nowrap flex-shrink-0 group ${
                isSelected
                  ? 'border-violet-500 bg-gradient-to-br from-violet-50 to-purple-50 shadow-md'
                  : 'border-slate-200 bg-white hover:border-violet-300 hover:bg-gradient-to-br hover:from-violet-50/30 hover:to-purple-50/30 hover:shadow-sm'
              }`}
            >
              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-lg">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
              )}

              {/* Goal Name with Info Icon */}
              <div className="flex items-center gap-2">
                <span className={`font-semibold ${isSelected ? 'text-violet-700' : 'text-slate-700'}`}>
                  {goal.name}
                </span>
                <div className="relative">
                  <Info className={`w-4 h-4 cursor-help flex-shrink-0 ${isSelected ? 'text-violet-500' : 'text-slate-400'}`} />
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1.5 bg-slate-900 text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none whitespace-nowrap z-[100] shadow-xl">
                    {goal.phase}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 mr-[-4px] w-2 h-2 bg-slate-900 rotate-45"></div>
                  </div>
                </div>
              </div>

              {/* Optional Description */}
              {goal.description && (
                <p className="mt-2 text-sm text-slate-600">{goal.description}</p>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}