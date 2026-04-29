import { Info, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import type { BrandMomentumData } from '@/hooks/use-insightsiq';

interface BrandMomentumProps {
  data?: BrandMomentumData;
  isLoading?: boolean;
}

export function BrandMomentum({ data, isLoading }: BrandMomentumProps = {}) {
  const [showTooltip, setShowTooltip] = useState(false);

  // API returns numbers; 0 is valid (placeholder) so avoid falsy || fallback
  const formatValue = (v: number | undefined) => v != null ? String(v) : '—';
  const formatDelta = (d: number | undefined) => {
    if (d == null) return '';
    return d > 0 ? `+${d}` : String(d);
  };

  const bmsValue = formatValue(data?.bms?.value);
  const bmsDelta = formatDelta(data?.bms?.delta);
  const bmiValue = formatValue(data?.bmi?.value);
  const bmiDelta = formatDelta(data?.bmi?.delta);
  const romiValue = formatValue(data?.romi?.value);
  const romiDelta = formatDelta(data?.romi?.delta);

  // Numeric BMS value for circle progress (0–100 scale)
  const bmsNumeric = data?.bms?.value ?? 0;

  const isPositiveDelta = (delta: string) => delta.startsWith('+');

  return (
    <div className="bg-gradient-to-br from-slate-50/80 to-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 mb-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
        {/* Left: Strategic Brand Momentum */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="w-14 h-14 bg-gradient-to-br from-[#5956E9] to-[#3D1DFF] rounded-xl flex items-center justify-center shadow-md">
            <TrendingUp className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">
              STRATEGIC
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Brand Momentum
            </h3>
          </div>
        </div>

        {/* Right: Metrics */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 flex-1 w-full lg:w-auto">
          {/* BMS - Brand Momentum Score */}
          <div className={`flex items-center gap-3 bg-white/60 rounded-xl p-4 border border-slate-200/40 flex-1 min-w-[180px] ${isLoading ? 'animate-pulse' : ''}`}>
            <div className="relative flex-shrink-0">
              <svg width="56" height="56" className="transform -rotate-90">
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  fill="none"
                  stroke="#E7E8EC"
                  strokeWidth="6"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  fill="none"
                  stroke="#1FC16B"
                  strokeWidth="6"
                  strokeDasharray={`${(bmsNumeric / 100) * 150.8} 150.8`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-slate-900">{bmsValue}</span>
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">
                BMS
              </div>
              <div className="text-sm font-medium text-slate-700 mb-1">
                Brand Momentum Score
              </div>
              {bmsDelta && (
                <div className="flex items-center gap-1">
                  <svg className={`w-3 h-3 ${isPositiveDelta(bmsDelta) ? 'text-emerald-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={isPositiveDelta(bmsDelta) ? "M5 10l7-7m0 0l7 7m-7-7v18" : "M19 14l-7 7m0 0l-7-7m7 7V3"} />
                  </svg>
                  <span className={`text-sm font-semibold ${isPositiveDelta(bmsDelta) ? 'text-emerald-600' : 'text-red-600'}`}>{bmsDelta}</span>
                </div>
              )}
            </div>
          </div>

          {/* BMI - Brand Momentum Index */}
          <div className={`flex flex-col justify-center bg-white/60 rounded-xl p-4 border border-slate-200/40 flex-1 min-w-[180px] ${isLoading ? 'animate-pulse' : ''}`}>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
              BMI
            </div>
            <div className="text-sm font-medium text-slate-700 mb-1">
              Brand Momentum Index
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#3D94FF]">{bmiValue}</span>
              {bmiDelta && (
                <div className="flex items-center gap-1">
                  <svg className={`w-3 h-3 ${isPositiveDelta(bmiDelta) ? 'text-emerald-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={isPositiveDelta(bmiDelta) ? "M5 10l7-7m0 0l7 7m-7-7v18" : "M19 14l-7 7m0 0l-7-7m7 7V3"} />
                  </svg>
                  <span className={`text-sm font-semibold ${isPositiveDelta(bmiDelta) ? 'text-emerald-600' : 'text-red-600'}`}>{bmiDelta}</span>
                </div>
              )}
            </div>
          </div>

          {/* ROMI - Return on Marketing Investment */}
          <div className={`flex flex-col justify-center bg-white/60 rounded-xl p-4 border border-slate-200/40 flex-1 min-w-[180px] ${isLoading ? 'animate-pulse' : ''}`}>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
              ROMI
            </div>
            <div className="text-sm font-medium text-slate-700 mb-1">
              Return on Marketing Investment
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#8B5CF6]">{romiValue}</span>
              {romiDelta && (
                <div className="flex items-center gap-1">
                  <svg className={`w-3 h-3 ${isPositiveDelta(romiDelta) ? 'text-emerald-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={isPositiveDelta(romiDelta) ? "M5 10l7-7m0 0l7 7m-7-7v18" : "M19 14l-7 7m0 0l-7-7m7 7V3"} />
                  </svg>
                  <span className={`text-sm font-semibold ${isPositiveDelta(romiDelta) ? 'text-emerald-600' : 'text-red-600'}`}>{romiDelta}</span>
                </div>
              )}
            </div>
          </div>

          {/* Info Icon */}
          <div className="relative flex-shrink-0 self-start sm:self-center">
            <button
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors duration-200"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <Info className="w-4 h-4 text-slate-500" />
            </button>
            {showTooltip && (
              <div
                className="fixed w-80 bg-white text-slate-800 text-sm rounded-2xl p-5 shadow-[0_20px_70px_-10px_rgba(0,0,0,0.25)] border border-slate-200/60 pointer-events-none"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 9999,
                }}
              >
                <p className="mb-3 leading-relaxed">
                  <strong className="text-[#1FC16B] font-semibold">Brand Momentum Score (BMS):</strong>{' '}
                  <span className="text-slate-700">Overall health indicator (0-100)</span>
                </p>
                <p className="mb-3 leading-relaxed">
                  <strong className="text-[#3D94FF] font-semibold">Brand Momentum Index (BMI):</strong>{' '}
                  <span className="text-slate-700">Performance vs. industry benchmark</span>
                </p>
                <p className="leading-relaxed">
                  <strong className="text-[#8B5CF6] font-semibold">ROMI:</strong>{' '}
                  <span className="text-slate-700">Revenue generated per dollar invested in marketing</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}