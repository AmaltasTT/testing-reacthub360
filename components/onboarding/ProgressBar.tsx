"use client";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  return (
    <div className="w-full" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={totalSteps}>
      <div className="flex gap-2">
        {Array.from({ length: totalSteps }, (_, index) => {
          const step = index + 1;
          const isActive = step === currentStep;
          const isCompleted = step < currentStep;

          return (
            <div
              key={step}
              className={`
                flex-1 h-2 rounded-full transition-all duration-500
                ${isActive ? 'bg-purple-600 shadow-sm shadow-purple-400/50' : ''}
                ${isCompleted ? 'bg-purple-600' : ''}
                ${!isActive && !isCompleted ? 'bg-slate-200' : ''}
              `}
              aria-label={`Step ${step} of ${totalSteps}${isActive ? ' (current)' : ''}${isCompleted ? ' (completed)' : ''}`}
            />
          );
        })}
      </div>
    </div>
  );
}
