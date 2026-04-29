"use client";

interface SegmentedControlOption {
  value: string;
  label: string;
}

interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value: string | null;
  onChange: (value: string) => void;
  error?: string;
}

export function SegmentedControl({ options, value, onChange, error }: SegmentedControlProps) {
  return (
    <div
      role="radiogroup"
      className="flex items-center gap-3"
      aria-invalid={error ? 'true' : 'false'}
    >
      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(option.value)}
            className={`
              flex-1 px-5 py-3 rounded-full font-medium text-sm
              transition-all duration-200 border-2
              ${
                isSelected
                  ? 'bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-500/40 ring-2 ring-purple-400/30'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-purple-400 hover:bg-purple-50 hover:shadow-sm shadow-sm'
              }
            `}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
