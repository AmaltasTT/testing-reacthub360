import { motion } from 'motion/react';
import { TrendingUp, Info } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export function BrandMomentumWeek() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<'bottom' | 'top'>('bottom');
  const [tooltipAlign, setTooltipAlign] = useState<'right' | 'left'>('right');
  const buttonRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Mock data - would come from backend
  const bmsScore = 72;
  const bmsChange = 4.2;
  const bmiValue = 1.34;
  const bmiChange = 0.12;
  const romiValue = 4.2;
  const romiChange = 0.8;

  // Calculate tooltip position to ensure it stays within viewport
  useEffect(() => {
    if (showTooltip && buttonRef.current && tooltipRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Check vertical position
      const spaceBelow = viewportHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;

      if (spaceBelow < tooltipRect.height + 20 && spaceAbove > tooltipRect.height + 20) {
        setTooltipPosition('top');
      } else {
        setTooltipPosition('bottom');
      }

      // Check horizontal position
      const spaceRight = viewportWidth - buttonRect.right;

      if (spaceRight < tooltipRect.width + 20) {
        setTooltipAlign('left');
      } else {
        setTooltipAlign('right');
      }
    }
  }, [showTooltip]);

  return (
    <div className="mb-16">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="mb-8"
      >
        <h2 className="text-[48px] text-[#444A57] mb-3" style={{ fontWeight: 600, letterSpacing: '-0.01em' }}>
          Your Brand's Momentum this Week
        </h2>
        <p className="text-[18px] text-[#717784]" style={{ fontWeight: 400 }}>
          Strategic performance indicators that define your market position
        </p>
      </motion.div>

      {/* Metrics Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-visible rounded-[32px] bg-white p-10 border border-gray-100 shadow-sm"
      >
        <div className="flex items-center gap-12">
          {/* Strategic Label + Brand Momentum */}
          <div className="flex items-center gap-5 flex-shrink-0">
            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <TrendingUp className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>

            {/* Label */}
            <div>
              <div className="text-[11px] text-gray-500 uppercase tracking-wider mb-1" style={{ fontWeight: 600 }}>
                STRATEGIC
              </div>
              <div className="text-[20px] text-gray-900" style={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
                Brand Momentum
              </div>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="w-px h-20 bg-gray-200" />

          {/* BMS - Brand Momentum Score */}
          <div className="flex items-center gap-5 flex-1">
            {/* Circular Progress */}
            <div className="relative flex-shrink-0">
              <svg width="80" height="80" className="transform -rotate-90">
                {/* Background circle */}
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="6"
                />
                {/* Progress circle */}
                <defs>
                  <linearGradient id="bmsGradientWeek" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
                <motion.circle
                  cx="40"
                  cy="40"
                  r="34"
                  fill="none"
                  stroke="url(#bmsGradientWeek)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 34}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 34 * (1 - bmsScore / 100) }}
                  transition={{ delay: 0.3, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                />
              </svg>
              {/* Center number */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[26px] text-gray-900 leading-none" style={{ fontWeight: 700 }}>
                  {bmsScore}
                </span>
              </div>
            </div>

            {/* BMS Details */}
            <div className="flex-1">
              <div className="text-[11px] text-gray-500 uppercase tracking-wider mb-1" style={{ fontWeight: 600 }}>
                BMS
              </div>
              <div className="text-[16px] text-gray-900 mb-1" style={{ fontWeight: 600 }}>
                Brand Momentum Score
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                <span className="text-[14px] text-green-600" style={{ fontWeight: 700 }}>
                  +{bmsChange.toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="w-px h-20 bg-gray-200" />

          {/* BMI - Brand Momentum Index */}
          <div className="flex-1">
            <div className="text-[11px] text-gray-500 uppercase tracking-wider mb-1" style={{ fontWeight: 600 }}>
              BMI
            </div>
            <div className="text-[16px] text-gray-900 mb-1" style={{ fontWeight: 600 }}>
              Brand Momentum Index
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[32px] text-cyan-600 leading-none" style={{ fontWeight: 700 }}>
                {bmiValue}x
              </span>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                <span className="text-[13px] text-green-600" style={{ fontWeight: 700 }}>
                  +{bmiChange.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="w-px h-20 bg-gray-200" />

          {/* ROMI - Return on Marketing Investment */}
          <div className="flex-1">
            <div className="text-[11px] text-gray-500 uppercase tracking-wider mb-1" style={{ fontWeight: 600 }}>
              ROMI
            </div>
            <div className="text-[16px] text-gray-900 mb-1" style={{ fontWeight: 600 }}>
              Return on Marketing Investment
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[32px] text-[#7652b3] leading-none" style={{ fontWeight: 700 }}>
                {romiValue}x
              </span>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                <span className="text-[13px] text-green-600" style={{ fontWeight: 700 }}>
                  +{romiChange.toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Info Icon with Tooltip */}
          <div className="relative flex-shrink-0">
            <button
              ref={buttonRef}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors relative"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <Info className="w-5 h-5" />
            </button>

            {/* Tooltip */}
            {showTooltip && (
              <motion.div
                ref={tooltipRef}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className={`fixed ${tooltipPosition === 'top' ? 'bottom-auto' : 'top-auto'} ${tooltipAlign === 'right' ? 'right-auto' : 'left-auto'} min-w-[380px] max-w-[450px] w-max bg-white rounded-2xl p-6 shadow-2xl border border-gray-100`}
                style={{
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 0 1px rgba(0, 0, 0, 0.1)',
                  zIndex: 9999,
                  left: buttonRef.current ? `${buttonRef.current.getBoundingClientRect().right - 400}px` : 'auto',
                  top: buttonRef.current && tooltipPosition === 'bottom'
                    ? `${buttonRef.current.getBoundingClientRect().bottom + 12}px`
                    : buttonRef.current && tooltipPosition === 'top'
                      ? `${buttonRef.current.getBoundingClientRect().top - (tooltipRef.current?.offsetHeight || 200) - 12}px`
                      : 'auto'
                }}
              >
                <div className="space-y-4">
                  {/* BMS */}
                  <div>
                    <div className="text-[15px] mb-1" style={{ fontWeight: 700, color: '#10b981' }}>
                      Brand Momentum Score (BMS):
                    </div>
                    <div className="text-[14px] text-gray-600" style={{ fontWeight: 400 }}>
                      Overall health indicator (0-100)
                    </div>
                  </div>

                  {/* BMI */}
                  <div>
                    <div className="text-[15px] mb-1" style={{ fontWeight: 700, color: '#0891b2' }}>
                      Brand Momentum Index (BMI):
                    </div>
                    <div className="text-[14px] text-gray-600" style={{ fontWeight: 400 }}>
                      Performance vs. industry benchmark
                    </div>
                  </div>

                  {/* ROMI */}
                  <div>
                    <div className="text-[15px] mb-1" style={{ fontWeight: 700, color: '#9333ea' }}>
                      ROMI:
                    </div>
                    <div className="text-[14px] text-gray-600" style={{ fontWeight: 400 }}>
                      Revenue generated per dollar invested in marketing
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}