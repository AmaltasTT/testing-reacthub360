"use client";

import { motion } from "motion/react";
import { TrendingUp, Zap } from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { capitalizeWords } from "@/lib/utils";

export function HeroSection() {
  const { data: user, isLoading, error } = useUser();
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  // Brand Momentum Score (BMS) - mock data, would come from backend
  const bmsScore = 71; // 0-100 scale

  // Floating particles for ambient background
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 4,
    duration: 8 + Math.random() * 4,
    size: 4 + Math.random() * 6,
  }));

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#E8EEFF]/40 via-white to-[#F5F8FF]/40 p-12 mb-20 shadow-[0_20px_60px_rgba(107,124,255,0.15)]">
      {/* Subtle animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Main gradient orbs - very subtle */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-violet-400/15 to-purple-300/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            delay: 2,
            ease: "easeInOut",
          }}
          className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-gradient-to-tr from-cyan-400/15 to-blue-300/10 rounded-full blur-3xl"
        />

        {/* Slow-moving soft blur particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background:
                "radial-gradient(circle, rgba(107, 124, 255, 0.06) 0%, transparent 70%)",
              filter: "blur(4px)",
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, 20, 0],
              opacity: [0.06, 0.12, 0.06],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between gap-16">
          {/* Left side: Text content and momentum card */}
          <div className="flex-1">
            {/* Greeting - 48px, #1E1E1E, weight 600 */}
            <motion.h1
              className="text-[48px] tracking-tight mb-3"
              style={{
                color: "#1E1E1E",
                fontWeight: 600,
                letterSpacing: "-0.02em",
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {greeting}, {capitalizeWords(user?.first_name)}
            </motion.h1>

            {/* Main headline with animated gradient - #6B7CFF → #00C6FF */}
            <motion.h2
              className="text-4xl lg:text-5xl tracking-tight mb-3 leading-tight relative inline-block"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              style={{ letterSpacing: "-0.02em" }}
            >
              <motion.span
                className="bg-gradient-to-r from-[#6B7CFF] via-[#8B9CFF] to-[#00C6FF] bg-clip-text text-transparent relative"
                style={{
                  backgroundSize: "200% 100%",
                  filter: "drop-shadow(0 2px 8px rgba(107, 124, 255, 0.25))",
                }}
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                you're on a 7-day growth streak
              </motion.span>
            </motion.h2>

            {/* Subline - 18px, #717784, letter spacing +1% */}
            <motion.p
              className="text-[18px] mb-8"
              style={{ color: "#717784", letterSpacing: "0.01em" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Every metric is trending up. Here's what to double down on today.
            </motion.p>

            {/* Momentum card with message - ENHANCED */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="relative max-w-2xl group"
            >
              {/* Outer glow that appears on hover */}
              <motion.div
                className="absolute -inset-1 rounded-[1.75rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(107, 124, 255, 0.2), rgba(139, 156, 255, 0.15), rgba(0, 198, 255, 0.2))",
                  filter: "blur(20px)",
                }}
              />

              <div
                className="relative px-10 py-8 rounded-[1.75rem] overflow-hidden backdrop-blur-sm transition-all duration-300"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(250, 251, 255, 0.95) 0%, rgba(240, 244, 255, 0.95) 100%)",
                  border: "2px solid rgba(107, 124, 255, 0.15)",
                  boxShadow:
                    "0 8px 32px rgba(107, 124, 255, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
                }}
              >
                {/* Animated gradient overlay */}
                <motion.div
                  className="absolute inset-0 rounded-[1.75rem] opacity-50"
                  style={{
                    background:
                      "radial-gradient(circle at top left, rgba(107, 124, 255, 0.08) 0%, transparent 60%)",
                  }}
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Decorative corner accent */}
                <div
                  className="absolute top-0 right-0 w-32 h-32 opacity-30"
                  style={{
                    background:
                      "radial-gradient(circle at center, rgba(0, 198, 255, 0.15), transparent 70%)",
                    filter: "blur(20px)",
                  }}
                />

                {/* Icon badge */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: 0.7,
                    type: "spring",
                    stiffness: 200,
                    damping: 12,
                  }}
                  className="absolute -top-4 -left-4 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, #6B7CFF 0%, #8B9CFF 100%)",
                  }}
                >
                  <Zap className="w-6 h-6 text-white" fill="currentColor" />
                </motion.div>

                {/* Content */}
                <div className="relative z-10">
                  <p
                    className="text-[20px] leading-relaxed mb-4"
                    style={{
                      color: "#1E1E1E",
                      fontWeight: 600,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    <motion.span
                      className="bg-gradient-to-r from-[#6B7CFF] via-[#8B9CFF] to-[#6B7CFF] bg-clip-text text-transparent inline-block"
                      style={{
                        backgroundSize: "200% 100%",
                      }}
                      animate={{
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      Your brand is hitting its stride.
                    </motion.span>{" "}
                    <span style={{ color: "#1E1E1E" }}>
                      Engagement is up 23% this week — the rhythm you found is
                      working.
                    </span>
                  </p>
                  <div className="flex items-start gap-2">
                    <div
                      className="w-1 h-1 rounded-full mt-2.5 flex-shrink-0"
                      style={{
                        background: "linear-gradient(135deg, #6B7CFF, #00C6FF)",
                      }}
                    />
                    <p
                      className="text-[17px] leading-relaxed"
                      style={{ color: "#717784", fontWeight: 500 }}
                    >
                      3 new opportunities ready for you to act on below.
                    </p>
                  </div>
                </div>

                {/* Bottom highlight bar */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 rounded-b-[1.75rem]"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(107, 124, 255, 0.3), rgba(0, 198, 255, 0.3), transparent)",
                    backgroundSize: "200% 100%",
                  }}
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 0%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </div>
            </motion.div>
          </div>

          {/* Right side: BMS Circular Progress Ring */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex-shrink-0"
          >
            {/* Hover glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              style={{
                background:
                  "radial-gradient(circle, rgba(107, 124, 255, 0.25) 0%, rgba(0, 198, 255, 0.25) 100%)",
                filter: "blur(40px)",
                transform: "scale(1.4)",
              }}
            />

            {/* Background circle */}
            <svg
              width="200"
              height="200"
              className="transform -rotate-90 relative z-10"
            >
              <circle
                cx="100"
                cy="100"
                r="92"
                fill="white"
                stroke="#E5E7EB"
                strokeWidth="2"
              />
              <circle
                cx="100"
                cy="100"
                r="85"
                fill="none"
                stroke="#F0F0F0"
                strokeWidth="14"
              />
              {/* Progress circle with gradient */}
              <defs>
                <linearGradient
                  id="bmsGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#6B7CFF" />
                  <stop offset="50%" stopColor="#8B9CFF" />
                  <stop offset="100%" stopColor="#00C6FF" />
                </linearGradient>
              </defs>
              <motion.circle
                cx="100"
                cy="100"
                r="85"
                fill="none"
                stroke="url(#bmsGradient)"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 85}`}
                initial={{
                  strokeDashoffset: 2 * Math.PI * 85,
                  opacity: 0.9,
                }}
                animate={{
                  strokeDashoffset: 2 * Math.PI * 85 * (1 - bmsScore / 100),
                  opacity: [0.9, 1, 0.9],
                }}
                transition={{
                  strokeDashoffset: {
                    delay: 0.6,
                    duration: 1.5,
                    ease: [0.22, 1, 0.36, 1],
                  },
                  opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                }}
              />
            </svg>

            {/* Center content - just the number */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.8,
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                }}
              >
                <span
                  className="text-[64px] leading-none block"
                  style={{
                    color: "#1E1E1E",
                    fontWeight: 700,
                  }}
                >
                  {bmsScore}
                </span>
              </motion.div>
            </div>

            {/* Labels below the circle */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="absolute -bottom-14 transform -translate-x-1/2 flex flex-col items-center gap-2 w-full"
            >
              <span
                className="text-[14px] tracking-wide whitespace-nowrap"
                style={{ color: "#1E1E1E", fontWeight: 600 }}
              >
                Brand Momentum Score
              </span>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50/80 backdrop-blur-sm border border-green-200/50"
              >
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span
                  className="text-[13px] text-green-700"
                  style={{ fontWeight: 600 }}
                >
                  +5 this week
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
