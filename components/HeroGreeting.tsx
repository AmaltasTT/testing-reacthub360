"use client";

import { motion } from "motion/react";
import { TrendingUp, Flame } from "lucide-react";
import { useUser } from "@/hooks/use-user";

export function HeroGreeting() {
  const { data: user, isLoading, error } = useUser();
  const streakDays = 7;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative mb-16 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50/40 via-transparent to-cyan-50/40 rounded-[2rem] -z-10" />

      <div className="py-20 px-12 text-center">
        {streakDays > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full mb-6 border border-orange-200/60 shadow-sm"
            style={{
              background:
                "linear-gradient(135deg, rgba(255, 237, 213, 0.5) 0%, rgba(254, 215, 170, 0.3) 100%)",
              backdropFilter: "blur(10px)",
            }}
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Flame className="w-5 h-5 text-orange-500" fill="currentColor" />
            </motion.div>
            <span
              className="text-[15px] text-orange-700"
              style={{ fontWeight: 600 }}
            >
              {streakDays}-day momentum streak
            </span>
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-base"
            >
              🔥
            </motion.div>
          </motion.div>
        )}

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-6xl lg:text-7xl tracking-tight text-gray-900 mb-6"
        >
          Good morning, {user.first_name} —<br />
          <span className="bg-gradient-to-r from-violet-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent">
            your brand momentum is rising
          </span>
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
            className="inline-block ml-3"
          >
            📈
          </motion.span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="text-xl text-gray-500 max-w-2xl mx-auto"
        >
          Your mission control for connected intelligence
        </motion.p>

        {/* Momentum indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg"
        >
          <TrendingUp className="w-5 h-5 text-green-600" />
          <span className="text-sm text-gray-700">
            Marketing universe expanding
          </span>
          <span className="text-sm text-green-600">+12% this week 🌍</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
