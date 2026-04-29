"use client";

import { HeroSection } from "@/components/HeroSection";
import { BrandMomentumWeek } from "@/components/BrandMomentumWeek";
import { BrandHealthCards } from "@/components/BrandHealthCards";
import { IntelligenceNetwork } from "@/components/IntelligenceNetwork";
import { BrandIntelligence } from "@/components/BrandIntelligence";
import { MomentumInsights } from "@/components/MomentumInsights";
import { ModuleAccessBar } from "@/components/ModuleAccessBar";
import { ActiveCampaigns } from "@/components/ActiveCampaigns";
import { LearningCenter } from "@/components/LearningCenter";
import { GrowthVideosCarousel } from "@/components/GrowthVideosCarousel";
import { TierDivider } from "@/components/TierDivider";
import { IQAgentButton } from "@/components/IQAgentButton";
import { OnboardingBadge } from "@/components/OnboardingBadge";
import { OnboardingCard } from "@/components/OnboardingCard";
import { IQAgentSetupCard } from "@/components/IQAgentSetupCard";
import { UserAvatar } from "@/components/UserAvatar";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { SubscriptionBanner } from "@/components/subscription/SubscriptionBanner";
import { motion } from "motion/react";
import { useUser, useUpdateWelcomeStatus } from "@/hooks/use-user";
import { useSubmitOnboarding } from "@/hooks/use-onboarding";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function HomePage() {
  const onboardingProgress = 75;
  const { data: user, isLoading: isUserLoading } = useUser();
  const updateWelcomeStatus = useUpdateWelcomeStatus();
  const submitOnboarding = useSubmitOnboarding();
  const [showWelcome, setShowWelcome] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Check if we should show the welcome screen
  useEffect(() => {
    if (!isUserLoading && user && user.show_welcome === true) {
      setShowWelcome(true);
    }
  }, [user, isUserLoading]);

  const handleStartTour = () => {
    // Don't update show_welcome yet - only when onboarding completes or is skipped
    setShowWelcome(false);
    // Start onboarding flow
    setShowOnboarding(true);
  };

  const handleSkipTour = () => {
    // User chose to skip tour and explore on their own - mark welcome as seen
    updateWelcomeStatus.mutate();
    setShowWelcome(false);
    // Skip onboarding entirely
    console.log("User skipped onboarding from welcome screen");
  };

  const handleCloseWelcome = () => {
    // User closed welcome screen - mark as seen
    updateWelcomeStatus.mutate();
    setShowWelcome(false);
  };

  const handleOnboardingComplete = async (data: any) => {
    console.log("Onboarding completed:", data);

    // Prepare data for submission (without connectionChoice)
    const onboardingData = {
      companyName: data.formData.companyName,
      businessModel: data.formData.businessModel || '',
      industry: data.formData.industry,
      industryOther: data.formData.industryOther,
      companySize: data.formData.companySize,
      websiteUrl: data.formData.websiteUrl,
      street_address: data.formData.streetAddress,
      city: data.formData.city,
      state: data.formData.state,
      zip_code: data.formData.zipCode,
      country: data.formData.country,
    };

    // Submit onboarding data
    try {
      await submitOnboarding.mutateAsync(onboardingData);

      // Mark welcome as seen now that onboarding is complete
      updateWelcomeStatus.mutate();

      toast.success("Onboarding completed successfully!");
      setShowOnboarding(false);

      // Handle based on connection choice
      const webflowBaseUrl = process.env.NEXT_PUBLIC_WEBFLOW_BASE_URL || 'https://reacthub360.webflow.io';

      if (data.connectionChoice === 'self') {
        // Redirect to channel connections in Webflow
        window.location.href = `${webflowBaseUrl}/app/channels`;
      } else if (data.connectionChoice === 'team') {
        // Stay on homepage/dashboard
        // Already closed onboarding, user will see the dashboard
        console.log("User chose to have team connect channels, staying on homepage");
      }
    } catch (error) {
      console.error("Error submitting onboarding:", error);
      toast.error("Failed to save onboarding data. Please try again.");
    }
  };

  const handleOnboardingSkip = () => {
    // User skipped onboarding - mark welcome as seen
    updateWelcomeStatus.mutate();
    console.log("Onboarding skipped");
    setShowOnboarding(false);
  };

  const userName = user
    ? `${user.first_name} ${user.last_name}`.trim() || user.first_name
    : "User";

  /*
  ------------------------------------------------
  SUBSCRIPTION EXPIRY LOGIC
  ------------------------------------------------
  */

  const subscription = user?._subscription;

  const isSubscriptionExpired = (() => {
    if (!subscription) return false;

    const now = Date.now();

    if (subscription.status === "trial") {
      return subscription.trial_end && subscription.trial_end < now;
    }

    if (subscription.status === "active") {
      return subscription.plan_expiry && subscription.plan_expiry < now;
    }

    return true;
  })();

  const showSubscriptionBannerOnly = Boolean(isSubscriptionExpired);

  // If onboarding is showing, render only onboarding
  if (showOnboarding) {
    return (
      <OnboardingFlow
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Welcome Screen Overlay */}
      {showWelcome && (
        <WelcomeScreen
          userName={userName}
          onStartTour={handleStartTour}
          onSkipTour={handleSkipTour}
          onClose={handleCloseWelcome}
        />
      )}
      {/* Premium glass orbs floating in background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[10%] left-[15%] w-[600px] h-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, rgba(168, 85, 247, 0.15) 30%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 120, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute top-[50%] right-[10%] w-[700px] h-[700px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(59, 130, 246, 0.22) 0%, rgba(96, 165, 250, 0.12) 30%, transparent 70%)",
            filter: "blur(70px)",
          }}
        />
        <motion.div
          animate={{
            x: [0, 60, 0],
            y: [0, -80, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5,
          }}
          className="absolute bottom-[15%] left-[40%] w-[500px] h-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(147, 197, 253, 0.20) 0%, rgba(191, 219, 254, 0.10) 30%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />
      </div>

      {/* Elegant gradient accent line */}
      <div className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 via-cyan-500 to-indigo-500 z-50 opacity-80" />

      {/* this is the header navbar current commented out */}

      {/* <header
        className="sticky top-0 z-40 border-b shadow-sm"
        style={{
          background:
            "linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.6) 100%)",
          backdropFilter: "blur(40px) saturate(180%)",
          WebkitBackdropFilter: "blur(40px) saturate(180%)",
          borderColor: "rgba(255, 255, 255, 0.8)",
          boxShadow:
            "0 1px 3px rgba(139, 92, 246, 0.05), 0 8px 24px rgba(59, 130, 246, 0.04)",
        }}
      >
        <div className="max-w-7xl mx-auto px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 flex items-center justify-center shadow-md"
              >
                <span className="text-white text-xl">R</span>
              </motion.div>
              <div>
                <div className="text-gray-900 text-lg tracking-tight">
                  REACTIQ360
                </div>
                <div className="text-gray-500 text-xs">
                  Marketing Intelligence Platform
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <OnboardingBadge progress={onboardingProgress} />
              <IQAgentButton />
              <UserAvatar />
            </div>
          </div>
        </div>
      </header> */}

      {/* Main content with generous spacing */}
      <main className="max-w-7xl mx-auto px-8 py-16 relative z-10">
        <div className="space-y-6">
          {showSubscriptionBannerOnly && <SubscriptionBanner />}

          {/* 1. Hero Greeting */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0, duration: 0.7, ease: "easeOut" }}
          >
            <HeroSection />
          </motion.div>

          {/* 1.5 Brand Momentum Week - Strategic Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7, ease: "easeOut" }}
          >
            <BrandMomentumWeek />
          </motion.div>

          {/* IQAgent Setup Card - Persistent AI Companion */}
          <IQAgentSetupCard state="inactive" />

          {/* 2. Brand in Motion Metrics - Analyze */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
          >
            <BrandHealthCards />
          </motion.div>

          {/* 3. Your next move - Real-time Intelligence */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7, ease: "easeOut" }}
          >
            <BrandIntelligence />
          </motion.div>

          {/* 4. What's Running Right Now - Active Campaigns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
          >
            <ActiveCampaigns />
          </motion.div>

          {/* 5. Intelligence Network - Connect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7, ease: "easeOut" }}
          >
            <IntelligenceNetwork />
          </motion.div>

          <TierDivider />

          {/* 6. Quick Access - Act */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
          >
            <ModuleAccessBar />
          </motion.div>

          <TierDivider />

          {/* Onboarding Card - Complete your journey */}
          <OnboardingCard />

          {/* 7. Learning Center - Learn */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.7, ease: "easeOut" }}
          >
            <LearningCenter />
          </motion.div>

          {/* 8. Growth Videos - Learn */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.7, ease: "easeOut" }}
          >
            <GrowthVideosCarousel />
          </motion.div>
        </div>
      </main>

      {/* Clean minimal footer */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div>© 2025 REACTIQ360 · Marketing Intelligence Platform</div>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-gray-900 transition-colors">
                Help
              </a>
              <a href="#" className="hover:text-gray-900 transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-gray-900 transition-colors">
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
