'use client'

import { motion } from 'motion/react';
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';

export function OnboardingCard() {
  const completedSteps = 1;
  const totalSteps = 3;
  const percentageComplete = Math.round((completedSteps / totalSteps) * 100);

  const steps = [
    { id: 1, title: 'Watch intro video', completed: true },
    { id: 2, title: 'Connect your first campaign', completed: false },
    { id: 3, title: 'Explore InsightsIQ dashboard', completed: false },
  ];

  // Color coding for progress line only
  const getProgressLineColor = () => {
    if (percentageComplete <= 30) {
      return 'from-red-400 to-rose-400';
    } else if (percentageComplete <= 64) {
      return 'from-yellow-400 to-amber-400';
    } else {
      return 'from-green-400 to-emerald-400';
    }
  };

  const progressLineColor = getProgressLineColor();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.65, duration: 0.7, ease: "easeOut" }}
      className="mb-16"
    >
      {/* Section Title */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="mb-6"
      >
        <h2 className="text-[32px] text-[#444A57] mb-2" style={{ fontWeight: 600, letterSpacing: '-0.01em' }}>
          Your Onboarding Progress
        </h2>
      </motion.div>

      <div className="relative rounded-3xl bg-white/40 backdrop-blur-xl border border-gray-200/50 overflow-hidden group hover:border-gray-300/50 transition-all duration-500">
        {/* Subtle top accent */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-400 via-sky-400 to-cyan-400 opacity-60" />
        
        {/* Content */}
        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-[18px] text-gray-900 mb-2" style={{ fontWeight: 600 }}>
                Hey Joy, you're almost done! 🎉
              </p>
              <p className="text-[15px] text-gray-600" style={{ fontWeight: 500 }}>
                Complete your onboarding to unlock the full REACTIQ360 experience
              </p>
            </div>
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-sky-400 text-white flex-shrink-0">
              <span className="text-[20px]" style={{ fontWeight: 700 }}>{percentageComplete}%</span>
            </div>
          </div>

          {/* Minimal progress indicator */}
          <div className="flex gap-2 mb-6">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                  index < completedSteps
                    ? `bg-gradient-to-r ${progressLineColor}`
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Clean steps list */}
          <div className="space-y-3 mb-6">
            {steps.map((step) => (
              <div
                key={step.id}
                className="flex items-center gap-3 group/step"
              >
                {step.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                )}
                <span
                  className={`text-[15px] ${
                    step.completed ? 'text-gray-400' : 'text-gray-700'
                  }`}
                  style={{ fontWeight: step.completed ? 500 : 500 }}
                >
                  {step.title}
                </span>
              </div>
            ))}
          </div>

          {/* Refined CTA */}
          <motion.button
            whileHover={{ scale: 1.005 }}
            whileTap={{ scale: 0.995 }}
            className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-blue-500 to-sky-500 text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 group/btn"
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-[15px]" style={{ fontWeight: 600 }}>
                Continue setup
              </span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
            </div>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
