"use client";

import { Eye, Route, Sparkles, Clock, ArrowRight, ArrowUpRight, X } from 'lucide-react';
import { motion } from 'motion/react';

interface WelcomeScreenProps {
  userName?: string;
  onStartTour: () => void;
  onSkipTour: () => void;
  onClose?: () => void;
}

export function WelcomeScreen({
  userName = "User",
  onStartTour,
  onSkipTour,
  onClose
}: WelcomeScreenProps) {
  return (
    <>
      {/* Backdrop overlay */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />

      {/* Welcome screen overlay */}
      <div
        className="fixed inset-0 z-50 overflow-y-auto"
        style={{ fontFamily: 'Montserrat, sans-serif' }}
      >
        <div className="min-h-screen relative overflow-hidden">
          {/* Background layer with gradient atmosphere */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-blue-50 to-pink-50">
            {/* Radial gradient overlays for depth */}
            <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-gradient-radial from-purple-300/30 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-radial from-blue-300/30 to-transparent rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-gradient-radial from-pink-300/20 to-transparent rounded-full blur-3xl" />

            {/* Subtle noise/grain texture */}
            <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}
            />
          </div>

          {/* Content container */}
          <div className="relative z-10 min-h-screen flex flex-col">
            {/* Top navigation anchor with logo and close button */}
            <div className="p-8 flex items-center justify-between">
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 flex items-center justify-center shadow-lg"
              >
                <span className="text-white text-2xl font-bold">R</span>
              </motion.div>

              {/* Close button */}
              {onClose && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  onClick={onClose}
                  className="group w-10 h-10 rounded-full bg-white/60 hover:bg-white/80 backdrop-blur-sm border border-white/60 flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-lg"
                  aria-label="Close welcome screen"
                >
                  <X className="w-5 h-5 text-foreground/60 group-hover:text-foreground transition-colors" />
                </motion.button>
              )}
            </div>

            {/* Main content area */}
            <div className="flex-1 flex items-center px-8 lg:px-16 xl:px-24 pb-16">
              <div className="w-full max-w-7xl mx-auto">
                {/* Two-column layout */}
                <div className="grid lg:grid-cols-[60%_40%] gap-12 lg:gap-16 items-start">

                  {/* Left column - Narrative */}
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="space-y-8"
                  >
                    {/* Eyebrow */}
                    <div className="text-sm tracking-wide text-[#7652b3] font-semibold" style={{ fontWeight: 600 }}>
                      WELCOME TO REACTIQ360
                    </div>

                    {/* Greeting */}
                    <div className="space-y-4">
                      <h2
                        className="text-4xl lg:text-5xl xl:text-6xl text-foreground"
                        style={{ fontWeight: 600 }}
                      >
                        Hey {userName},
                      </h2>

                      {/* Main headline */}
                      <h1
                        className="text-5xl lg:text-6xl xl:text-7xl leading-tight bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 bg-clip-text text-transparent"
                        style={{ fontWeight: 700 }}
                      >
                        Ready to unlock your marketing intelligence?
                      </h1>
                    </div>

                    {/* Supporting paragraph */}
                    <p
                      className="text-lg lg:text-xl text-foreground/70 max-w-xl leading-relaxed"
                      style={{ fontWeight: 400 }}
                    >
                      Take a quick tour with us using sample data. You'll see how REACTIQ360
                      connects your fragmented marketing channels into one intelligent view,
                      surfacing insights and recommendations that help you take smart actions
                      to spend smarter and convert faster.
                    </p>

                    {/* Primary action zone - desktop only */}
                    <div className="pt-4 space-y-4 hidden lg:block">
                      <button
                        onClick={onStartTour}
                        className="group inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 hover:from-purple-700 hover:via-blue-700 hover:to-purple-800 text-white rounded-2xl px-10 py-5 transition-all duration-300 ease-out hover:shadow-2xl hover:shadow-purple-500/50 hover:-translate-y-1 hover:scale-[1.02]"
                        style={{ fontWeight: 600 }}
                      >
                        <span className="text-lg">Let's Go</span>
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                      </button>

                      <div>
                        <button
                          onClick={onSkipTour}
                          className="group inline-flex items-center gap-2 text-foreground/60 hover:text-foreground transition-all duration-200 hover:gap-3"
                          style={{ fontWeight: 400 }}
                        >
                          <span>I'll explore on my own</span>
                          <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>

                  {/* Right column - Discovery card */}
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                    className="lg:sticky lg:top-24"
                  >
                    <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl shadow-purple-200/50 border border-white/60">
                      <h3
                        className="text-2xl mb-8 text-foreground/90"
                        style={{ fontWeight: 600 }}
                      >
                        What you'll see
                      </h3>

                      {/* Three discovery items */}
                      <div className="space-y-6">
                        {/* Item 1 */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.6 }}
                          className="flex gap-4 items-start"
                        >
                          <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/30">
                            <span style={{ fontWeight: 600 }}>1</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start gap-3 mb-2">
                              <Eye className="w-5 h-5 text-[#7652b3] mt-1 flex-shrink-0" />
                              <div>
                                <h4 className="text-foreground mb-1.5" style={{ fontWeight: 600 }}>
                                  Blind spots revealed
                                </h4>
                                <p className="text-foreground/60 text-sm leading-relaxed" style={{ fontWeight: 400 }}>
                                  See what your current tools are hiding
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>

                        {/* Item 2 */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.7 }}
                          className="flex gap-4 items-start"
                        >
                          <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <span style={{ fontWeight: 600 }}>2</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start gap-3 mb-2">
                              <Route className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                              <div>
                                <h4 className="text-foreground mb-1.5" style={{ fontWeight: 600 }}>
                                  The complete customer journey
                                </h4>
                                <p className="text-foreground/60 text-sm leading-relaxed" style={{ fontWeight: 400 }}>
                                  From Reach to Talk, unified in one view
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>

                        {/* Item 3 */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.8 }}
                          className="flex gap-4 items-start"
                        >
                          <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-pink-500/30">
                            <span style={{ fontWeight: 600 }}>3</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start gap-3 mb-2">
                              <Sparkles className="w-5 h-5 text-[#7652b3] mt-1 flex-shrink-0" />
                              <div>
                                <h4 className="text-foreground mb-1.5" style={{ fontWeight: 600 }}>
                                  AI-powered recommendations
                                </h4>
                                <p className="text-foreground/60 text-sm leading-relaxed" style={{ fontWeight: 400 }}>
                                  Insights that actually move the needle
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </div>

                      {/* Divider */}
                      <div className="my-8 h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent" />

                      {/* Reassurance micro-copy */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm text-foreground/60">
                          <Sparkles className="w-4 h-4 text-purple-500 flex-shrink-0" />
                          <span style={{ fontWeight: 400 }}>We'll use sample data to show you around</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-foreground/60">
                          <Clock className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          <span style={{ fontWeight: 400 }}>Takes about 3 minutes</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                </div>
              </div>
            </div>

            {/* Primary action zone - mobile only */}
            <div className="px-8 pb-8 lg:hidden space-y-4">
              <button
                onClick={onStartTour}
                className="group w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 hover:from-purple-700 hover:via-blue-700 hover:to-purple-800 text-white rounded-2xl px-10 py-5 transition-all duration-300 ease-out hover:shadow-2xl hover:shadow-purple-500/50 hover:-translate-y-1 hover:scale-[1.02]"
                style={{ fontWeight: 600 }}
              >
                <span className="text-lg">Let's Go</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="text-center">
                <button
                  onClick={onSkipTour}
                  className="group inline-flex items-center gap-2 text-foreground/60 hover:text-foreground transition-all duration-200 hover:gap-3"
                  style={{ fontWeight: 400 }}
                >
                  <span>I'll explore on my own</span>
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </div>

            {/* Progress indicator - bottom center */}
            <div className="pb-8 flex justify-center">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 shadow-sm" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/40 backdrop-blur" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/40 backdrop-blur" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
