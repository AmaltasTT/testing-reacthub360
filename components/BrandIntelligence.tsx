'use client'

import { motion } from 'motion/react';
import { TrendingUp, AlertTriangle, Target, ArrowRight } from 'lucide-react';

interface MetricItemProps {
  title: string;
  metric: string;
  metricLabel: string;
  description: string;
  accentColor: string;
}

function MetricItem({ title, metric, metricLabel, description, accentColor }: MetricItemProps) {
  return (
    <div className="mb-6 last:mb-0">
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-[15px] text-gray-900 leading-snug flex-1" style={{ fontWeight: 600 }}>
          {title}
        </h4>
        <div className="text-right ml-4 flex-shrink-0">
          <div className={`text-[18px] ${accentColor} leading-none mb-0.5`} style={{ fontWeight: 700 }}>
            {metric}
          </div>
          <div className={`text-[10px] ${accentColor} uppercase tracking-wider`} style={{ fontWeight: 700 }}>
            {metricLabel}
          </div>
        </div>
      </div>
      <p className="text-[13px] text-gray-400 leading-relaxed" style={{ fontWeight: 400 }}>
        {description}
      </p>
    </div>
  );
}

interface CompetitorItemProps {
  name: string;
  rank: string;
  score: string;
}

function CompetitorItem({ name, rank, score }: CompetitorItemProps) {
  return (
    <div className="flex items-center justify-between mb-5 last:mb-0">
      <div className="flex-1">
        <div className="text-[15px] text-gray-900 mb-0.5" style={{ fontWeight: 600 }}>
          {name}
        </div>
        <div className="text-[12px] text-gray-400" style={{ fontWeight: 500 }}>
          {rank}
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="text-[32px] text-gray-900 leading-none" style={{ fontWeight: 700 }}>
          {score}
        </div>
        <div className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5" style={{ fontWeight: 600 }}>
          SCORE
        </div>
      </div>
    </div>
  );
}

export function BrandIntelligence() {
  return (
    <div className="mb-24">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="mb-8"
      >
        <h2 className="text-[32px] text-[#444A57] mb-2" style={{ fontWeight: 600, letterSpacing: '-0.01em' }}>
          Your next move
        </h2>
        <p className="text-[15px] text-gray-500" style={{ fontWeight: 400 }}>
          Real-time actions to protect, grow, and outpace your competition
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Fix This Now - Red/Coral Column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[24px] bg-white p-7 border border-gray-100 shadow-sm"
        >
          {/* Top gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-red-400 via-orange-400 to-orange-300 rounded-t-[24px]" />

          {/* Icon and Header */}
          <div className="flex items-start gap-4 mb-7">
            <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-500" strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <h3 className="text-[17px] text-gray-900 mb-1" style={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
                Fix This Now
              </h3>
              <p className="text-[13px] text-gray-500" style={{ fontWeight: 400 }}>
                Stop the bleed before it costs you more
              </p>
            </div>
          </div>

          {/* Metrics */}
          <div className="mb-6">
            <MetricItem
              title="CPAP 23% above benchmark"
              metric="+23%"
              metricLabel="VS BENCHMARK"
              description="Q4 Brand Awareness Push • Est. waste: $2.1K/mo"
              accentColor="text-red-500"
            />
            <MetricItem
              title="Cost per Conversion jumped 28%"
              metric="+28%"
              metricLabel="WOW"
              description="Retargeting Campaign • Creative fatigue likely"
              accentColor="text-red-500"
            />
            <MetricItem
              title="Bounce rate spiked on paid traffic"
              metric="68%"
              metricLabel="BOUNCE"
              description="Product Launch – TikTok • Landing page mismatch"
              accentColor="text-red-500"
            />
          </div>

          {/* CTA */}
          <motion.button
            whileHover={{ x: 3 }}
            className="flex items-center gap-2 text-[13px] text-red-500 group"
            style={{ fontWeight: 600 }}
          >
            View all issues
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
          </motion.button>
        </motion.div>

        {/* Scale What's Working - Cyan Column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[24px] bg-white p-7 border border-gray-100 shadow-sm"
        >
          {/* Top gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-400 via-cyan-400 to-cyan-300 rounded-t-[24px]" />

          {/* Icon and Header */}
          <div className="flex items-start gap-4 mb-7">
            <div className="w-11 h-11 rounded-xl bg-cyan-50 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-cyan-500" strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <h3 className="text-[17px] text-gray-900 mb-1" style={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
                Scale What's Working
              </h3>
              <p className="text-[13px] text-gray-500" style={{ fontWeight: 400 }}>
                Double down where momentum is building
              </p>
            </div>
          </div>

          {/* Metrics */}
          <div className="mb-6">
            <MetricItem
              title="LinkedIn outperforming Meta on ICP reach"
              metric="2.3×"
              metricLabel="EFFICIENCY"
              description="Q4 Brand Awareness Push • Shift 20% budget"
              accentColor="text-cyan-500"
            />
            <MetricItem
              title="Google Shopping ROAS exceeding target"
              metric="4.2×"
              metricLabel="ROAS"
              description="Holiday Shopping • Scale while efficient"
              accentColor="text-cyan-500"
            />
            <MetricItem
              title="Post-purchase emails driving repeats"
              metric="+5%"
              metricLabel="VS BASELINE"
              description="Retention Sequence • 23% repeat rate"
              accentColor="text-cyan-500"
            />
          </div>

          {/* CTA */}
          <motion.button
            whileHover={{ x: 3 }}
            className="flex items-center gap-2 text-[13px] text-cyan-500 group"
            style={{ fontWeight: 600 }}
          >
            View all opportunities
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
          </motion.button>
        </motion.div>

        {/* Market Pulse - Violet Column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[24px] bg-white p-7 border border-gray-100 shadow-sm"
        >
          {/* Top gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-violet-400 via-purple-400 to-purple-300 rounded-t-[24px]" />

          {/* Icon and Header */}
          <div className="flex items-start gap-4 mb-7">
            <div className="w-11 h-11 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
              <Target className="w-5 h-5 text-violet-500" strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <h3 className="text-[17px] text-gray-900 mb-1" style={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
                Market Pulse
              </h3>
              <p className="text-[13px] text-gray-500" style={{ fontWeight: 400 }}>
                Your position in the market
              </p>
            </div>
          </div>

          {/* Competitor Rankings */}
          <div className="mb-6">
            <CompetitorItem
              name="Fashion Forward Co."
              rank="#1"
              score="94"
            />
            <CompetitorItem
              name="You"
              rank="#23"
              score="78"
            />
            <CompetitorItem
              name="Style Avenue"
              rank="#45"
              score="65"
            />
          </div>

          {/* Gap Analysis */}
          <div className="mb-6 p-4 bg-violet-50/50 rounded-xl border border-violet-100">
            <div className="text-[10px] text-violet-500 uppercase tracking-wider mb-2" style={{ fontWeight: 700 }}>
              GAP TO CLOSE
            </div>
            <p className="text-[13px] text-gray-700 leading-relaxed" style={{ fontWeight: 500 }}>
              <span className="text-violet-700" style={{ fontWeight: 700 }}>#1</span> investing in <span className="text-violet-700" style={{ fontWeight: 700 }}>UGC video</span>—format up 47% industry-wide
            </p>
          </div>

          {/* CTA */}
          <motion.button
            whileHover={{ x: 3 }}
            className="flex items-center gap-2 text-[13px] text-violet-500 group"
            style={{ fontWeight: 600 }}
          >
            View full leaderboard
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}