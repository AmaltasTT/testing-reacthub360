"use client";

import { useEffect, useState } from "react";
import { useSubscriptionCheck } from "@/hooks/use-subscription";
import { motion, AnimatePresence } from "motion/react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  AlertTriangle,
  X,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Check,
} from "lucide-react";
import { UpgradeModal } from "./UpgradeModal";

type UserState = "not-connected" | "connected";
type Plan = "starter" | "growth" | "scale";

const featureData = [
  { feature: "Monthly Active Campaigns", starter: "5", growth: "25", scale: "Unlimited" },
  { feature: "Channel Connections", starter: "3", growth: "10", scale: "Unlimited" },
  { feature: "LaunchIQ Campaign Builder", starter: true, growth: true, scale: true },
  { feature: "Reach Metrics", starter: true, growth: true, scale: true },
  { feature: "Engage Metrics", starter: true, growth: true, scale: true },
  { feature: "Act Metrics", starter: "Basic", growth: true, scale: true },
  { feature: "Convert Metrics", starter: "Basic", growth: true, scale: true },
  { feature: "Talk Metrics", starter: false, growth: true, scale: true },
  { feature: "Cross-Journey Insights", starter: false, growth: "Basic", scale: "Advanced" },
  { feature: "Custom Dashboards", starter: "1", growth: "5", scale: "Unlimited" },
  { feature: "Data Export", starter: "CSV", growth: "CSV, API", scale: "CSV, API, Webhooks" },
  { feature: "Historical Data", starter: "30 days", growth: "90 days", scale: "2 years" },
  { feature: "Team Members", starter: "2", growth: "10", scale: "Unlimited" },
  { feature: "Priority Support", starter: false, growth: true, scale: true },
  { feature: "Dedicated Account Manager", starter: false, growth: false, scale: true },
  { feature: "Custom Integrations", starter: false, growth: false, scale: true },
];

export function SubscriptionBanner() {
  const { data: subscriptionData, isLoading } = useSubscriptionCheck();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [isExpiredExpanded, setIsExpiredExpanded] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan>("growth");
  const [isBillingExpanded, setIsBillingExpanded] = useState(false);
  const [showBillingCountdown, setShowBillingCountdown] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowBillingCountdown(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading || !subscriptionData || !subscriptionData.subscription || dismissed) {
    return null;
  }

  const { subscription } = subscriptionData;
  const { status, trial_end, plan_expiry } = subscription;
  const is_trial = status === "trial";

  // Calculate days remaining for trial
  const getDaysRemaining = (endDate: string | number | undefined | null): number => {
    if (!endDate) return 0;
    const endTime = typeof endDate === 'string' ? new Date(endDate).getTime() : endDate;
    const now = Date.now();
    const diff = endTime - now;
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const trialDaysRemaining = is_trial ? getDaysRemaining(trial_end) : 0;
  const isTrialExpiring = is_trial && trialDaysRemaining <= 3 && trialDaysRemaining > 0;
  const isTrialExpired = is_trial && trialDaysRemaining === 0;

  // Check subscription expiry
  const now = Date.now();
  const planExpiryTime = plan_expiry ? (typeof plan_expiry === 'string' ? new Date(plan_expiry).getTime() : plan_expiry) : null;
  const planExpiryDaysRemaining = planExpiryTime
    ? Math.max(0, Math.ceil((planExpiryTime - now) / (1000 * 60 * 60 * 24)))
    : null;
  const isSubscriptionExpired = status === "active" && !!planExpiryTime && planExpiryTime < now;
  const isSubscriptionExpiringSoon =
    status === "active" &&
    !!planExpiryTime &&
    planExpiryTime >= now &&
    planExpiryDaysRemaining !== null &&
    planExpiryDaysRemaining <= 7;
  const isInactive = status === "inactive";
  const connectedChannels = Number(
    subscriptionData.connected_platforms_count ??
    subscriptionData.connected_channels ??
    subscriptionData.connectedChannels ??
    0
  );
  const launchedCampaigns = Number(
    subscriptionData.campaigns_count ??
    subscriptionData.launched_campaigns ??
    subscriptionData.launchedCampaigns ??
    0
  );
  const userState: UserState =
    connectedChannels > 0 || launchedCampaigns > 0 ? "connected" : "not-connected";
  const daysRemaining = planExpiryDaysRemaining ?? Math.max(
    0,
    Number(
      subscriptionData.billing_grace_days_remaining ??
      subscriptionData.grace_days_remaining ??
      subscriptionData.days_remaining ??
      5
    )
  );

  const getSubtext = () => {
    if (userState === "not-connected") {
      return "Connect your channels. Start uncovering hidden growth signals across your customer journey.";
    }
    return "Resume your plan to keep tracking performance across Reach, Engage, Act, Convert, and Talk.";
  };

  const renderChecklistItem = (text: string) => (
    <div className="flex items-center gap-3">
      <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
        <div className="w-2 h-2 rounded-full bg-gray-300" />
      </div>
      <span className="text-gray-700">{text}</span>
    </div>
  );

  const renderFeatureCell = (value: string | boolean | number) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className="w-5 h-5 text-green-600 mx-auto" />
      ) : (
        <span className="text-gray-400 text-center">-</span>
      );
    }
    return <span className="text-gray-700 text-center">{value}</span>;
  };

  const getPlanButtonText = () => {
    const planNames: Record<Plan, string> = {
      starter: "Starter",
      growth: "Growth",
      scale: "Scale",
    };
    return `Choose ${planNames[selectedPlan]}`;
  };

  const getCountdownMessage = () => {
    if (isSubscriptionExpired) {
      return "Your subscription has expired. Update billing immediately to restore access.";
    }
    if (daysRemaining >= 5) {
      return `Update billing within ${daysRemaining} days to avoid interruptions to your campaign insights.`;
    }
    if (daysRemaining >= 2) {
      return `Only ${daysRemaining} days left to update billing before insights pause.`;
    }
    if (daysRemaining === 1) {
      return "Last day to update billing and avoid interruption.";
    }
    return "Update billing immediately to restore access.";
  };

  const handleConnectChannelsRedirect = () => {
    const webflowBaseUrl =
      process.env.NEXT_PUBLIC_WEBFLOW_BASE_URL || "https://reactiq360.com";
    const targetUrl = `${webflowBaseUrl}/app/channels`;

    // If running inside an iframe on Webflow, redirect the parent window.
    if (window.top) {
      window.top.location.href = targetUrl;
      return;
    }

    window.location.href = targetUrl;
  };

  const handleHelpRedirect = () => {
    const webflowBaseUrl =
      process.env.NEXT_PUBLIC_WEBFLOW_BASE_URL || "https://reactiq360.com";
    const targetUrl = `${webflowBaseUrl}/app/help`;

    if (window.top) {
      window.top.location.href = targetUrl;
      return;
    }

    window.location.href = targetUrl;
  };

  const handleSettingsBillingRedirect = () => {
    const webflowBaseUrl =
      process.env.NEXT_PUBLIC_WEBFLOW_BASE_URL || "https://reactiq360.com";
    const targetUrl = `${webflowBaseUrl}/app/settings?tab=billing`;

    if (window.top) {
      window.top.location.href = targetUrl;
      return;
    }

    window.location.href = targetUrl;
  };

  // Don't show banner for active, non-expiring subscriptions
  if (status === "active" && !isSubscriptionExpired && !isSubscriptionExpiringSoon && !is_trial) {
    return null;
  }

  // Trial expiring soon (3 days or less)
  if (isTrialExpiring) {
    return (
      <>
        <Alert className="border-amber-200 bg-amber-50 mx-6 mt-4 relative">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <AlertDescription className="text-amber-900 flex items-center justify-between">
            <div className="pr-8">
              <strong className="font-semibold">Trial expires in {trialDaysRemaining} {trialDaysRemaining === 1 ? 'day' : 'days'}</strong>
              <p className="text-sm mt-1">
                Upgrade now to continue accessing all features without interruption.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowUpgradeModal(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white"
                size="sm"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Upgrade Now
              </Button>
              <button
                onClick={() => setDismissed(true)}
                className="text-amber-600 hover:text-amber-800 p-1"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </AlertDescription>
        </Alert>
        <UpgradeModal
          open={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          reason="trial_expiring"
        />
      </>
    );
  }

  // Trial expired
  if (isTrialExpired) {
    return (
      <>
        <div className="mx-6 mt-4 w-full max-w-[calc(100%-3rem)]">
          <div
            className="relative"
            style={{ filter: "drop-shadow(0 4px 30px rgba(99, 102, 241, 0.2))" }}
          >
            <div
              className="relative overflow-hidden"
              style={{
                background: "linear-gradient(to right, #6366F1, #AE95ED)",
                borderRadius: "12px",
                padding: "24px 32px",
              }}
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <h2 className="text-white text-2xl mb-2">
                    Your trial has ended. Your marketing momentum doesn&apos;t have to.
                  </h2>
                  {!isExpiredExpanded && (
                    <p className="text-white text-base" style={{ opacity: 0.85 }}>
                      {getSubtext()}
                    </p>
                  )}
                </div>

                <div className="flex-shrink-0 flex flex-col items-start lg:items-end gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setIsExpiredExpanded(!isExpiredExpanded)}
                      className="px-6 py-2.5 rounded-lg text-white transition-all hover:scale-105"
                      style={{
                        background: "linear-gradient(to right, #6366F1, #AE95ED)",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                      }}
                    >
                      Continue with REACTIQ360
                    </button>
                    <button
                      onClick={handleHelpRedirect}
                      className="px-6 py-2.5 rounded-lg text-white border-2 border-white bg-transparent transition-all hover:bg-white/10"
                    >
                      Get onboarding help
                    </button>
                    <button
                      onClick={() => setIsExpiredExpanded(!isExpiredExpanded)}
                      className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
                      aria-label={isExpiredExpanded ? "Collapse details" : "Expand details"}
                    >
                      {isExpiredExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {!isExpiredExpanded && (
                    <p className="text-white text-sm" style={{ opacity: 0.7 }}>
                      Your data stays safe. Reactivation is instant.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <AnimatePresence>
              {isExpiredExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="bg-white rounded-b-xl p-8 mt-px">
                    {userState === "not-connected" && (
                      <div className="mb-8 pb-8 border-b border-gray-200">
                        <h3 className="text-2xl text-gray-900 mb-4">
                          You were one step away from unlocking hidden growth signals on REACTIQ360.
                        </h3>
                        <p className="text-gray-700 mb-4 leading-relaxed">
                          REACTIQ360 begins uncovering growth signals once your channels connect and
                          your first campaign runs through LaunchIQ.
                        </p>
                        <p className="text-gray-700 mb-6 leading-relaxed">
                          That step never happened during your trial. Let&apos;s fix that.
                        </p>

                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 mb-6">
                          <h4 className="text-xl text-gray-900 mb-3">14-Day Extension</h4>
                          <p className="text-gray-700 mb-6 leading-relaxed">
                            Connect your channels and launch your first campaign. We will extend your
                            trial by 14 days the moment it goes live.
                          </p>
                          <p className="text-gray-600 italic">
                            No risk. Just a chance to see what your marketing data has been trying to
                            tell you.
                          </p>
                        </div>

                        <div className="space-y-3 mb-6">
                          {renderChecklistItem("Connect your channels")}
                          {renderChecklistItem("Launch your first campaign in LaunchIQ")}
                          {renderChecklistItem(
                            "Start uncovering growth signals across your customer journey"
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                          <button
                            onClick={handleConnectChannelsRedirect}
                            className="px-6 py-3 rounded-lg text-white transition-all hover:scale-105"
                            style={{
                              background: "linear-gradient(to right, #6366F1, #AE95ED)",
                              boxShadow: "0 2px 8px rgba(99, 102, 241, 0.3)",
                            }}
                          >
                            Connect Channels
                          </button>
                          <button
                            onClick={handleHelpRedirect}
                            className="px-6 py-3 rounded-lg text-gray-700 border-2 border-gray-300 hover:border-gray-400 transition-colors"
                          >
                            Book 15-minute onboarding help
                          </button>
                        </div>
                      </div>
                    )}

                    {userState === "connected" && (
                      <div className="mb-8 pb-8 border-b border-gray-200">
                        <h3 className="text-2xl text-gray-900 mb-4">
                          Your trial helped you get started. Now keep the momentum going.
                        </h3>
                        <ul className="space-y-2 mb-6 text-gray-700">
                          <li className="flex items-start gap-2">
                            <span className="text-indigo-600 mt-1">•</span>
                            <span>See which campaigns actually drive brand momentum</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-indigo-600 mt-1">•</span>
                            <span>Unify insights across your marketing channels</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-indigo-600 mt-1">•</span>
                            <span>Spot emerging opportunities earlier</span>
                          </li>
                        </ul>
                        <p className="text-gray-700 mb-2">
                          Your dashboards and connected channels will resume instantly.
                        </p>
                        {connectedChannels > 0 && (
                          <p className="text-gray-500 text-sm">
                            You connected {connectedChannels}{" "}
                            {connectedChannels === 1 ? "channel" : "channels"} and launched{" "}
                            {launchedCampaigns} {launchedCampaigns === 1 ? "campaign" : "campaigns"}.
                          </p>
                        )}
                      </div>
                    )}

                    <div className="mb-8">
                      <h3 className="text-xl text-gray-900 mb-6">Choose Your Plan</h3>

                      <div
                        className="border border-gray-200 rounded-lg overflow-hidden mb-6"
                        style={{ height: "300px" }}
                      >
                        <div className="overflow-auto h-full">
                          <table className="w-full">
                            <thead className="bg-gray-50 sticky top-0 z-10">
                              <tr>
                                <th className="sticky left-0 bg-gray-50 px-4 py-3 text-left text-gray-900 border-b border-gray-200">
                                  Features
                                </th>
                                <th className="px-4 py-3 text-center text-gray-900 border-b border-gray-200">
                                  Starter
                                </th>
                                <th className="px-4 py-3 text-center text-gray-900 border-b border-gray-200">
                                  Growth
                                </th>
                                <th className="px-4 py-3 text-center text-gray-900 border-b border-gray-200">
                                  Scale
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {featureData.map((row, index) => (
                                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                  <td className="sticky left-0 bg-white hover:bg-gray-50 px-4 py-3 text-gray-900">
                                    {row.feature}
                                  </td>
                                  <td className="px-4 py-3">{renderFeatureCell(row.starter)}</td>
                                  <td className="px-4 py-3">{renderFeatureCell(row.growth)}</td>
                                  <td className="px-4 py-3">{renderFeatureCell(row.scale)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-4 mb-6">
                        {(["starter", "growth", "scale"] as Plan[]).map((plan) => (
                          <button
                            key={plan}
                            onClick={() => setSelectedPlan(plan)}
                            className={`flex-1 py-3 px-6 rounded-lg transition-all ${selectedPlan === plan
                              ? "text-white shadow-lg"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            style={
                              selectedPlan === plan
                                ? { background: "linear-gradient(to right, #6366F1, #AE95ED)" }
                                : undefined
                            }
                          >
                            {plan.charAt(0).toUpperCase() + plan.slice(1)}
                          </button>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center gap-4">
                        <button
                          onClick={handleSettingsBillingRedirect}
                          className="px-8 py-3 rounded-lg text-white transition-all hover:scale-105"
                          style={{
                            background: "linear-gradient(to right, #6366F1, #AE95ED)",
                            boxShadow: "0 2px 8px rgba(99, 102, 241, 0.3)",
                          }}
                        >
                          {getPlanButtonText()}
                        </button>
                        <button
                          onClick={handleHelpRedirect}
                          className="px-8 py-3 rounded-lg text-gray-700 border-2 border-gray-300 hover:border-gray-400 transition-colors"
                        >
                          Talk to us
                        </button>
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        {/* <div className="mx-6 mt-6 w-full max-w-[calc(100%-3rem)]">
          <div className="bg-white rounded-lg p-8 border border-gray-200">
            <h3 className="text-xl text-gray-900 mb-4">Dashboard Content</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="bg-gray-50 rounded-lg p-6 h-32">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div> */}
        <UpgradeModal
          open={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          reason="trial_expired"
        />
      </>
    );
  }

  // Subscription expired
  if (isSubscriptionExpired || isSubscriptionExpiringSoon) {
    return (
      <>
        <div className="mx-6 mt-4 w-full max-w-[calc(100%-3rem)]">
          <div
            className="relative"
            style={{ filter: "drop-shadow(0 4px 30px rgba(99, 102, 241, 0.2))" }}
          >
            <div
              className="relative overflow-hidden"
              style={{
                background: "linear-gradient(to right, #6366F1, #AE95ED)",
                borderRadius: "12px",
                padding: "24px 32px",
              }}
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <h2 className="text-white text-2xl mb-3">
                    {isSubscriptionExpired
                      ? "Your subscription has expired. Your marketing momentum doesn't have to stop."
                      : "Your subscription renewal needs attention. Your marketing momentum doesn't have to stop."}
                  </h2>
                  {!isBillingExpanded && (
                    <>
                      <p className="text-white text-base mb-4" style={{ opacity: 0.85 }}>
                        {isSubscriptionExpired
                          ? "Update your payment method now to restore access across Reach, Engage, Act, Convert, and Talk."
                          : "Update your payment method to keep your marketing insights flowing."}
                      </p>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: showBillingCountdown ? 1 : 0, y: showBillingCountdown ? 0 : 10 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="inline-flex items-center gap-3 px-5 py-3 rounded-lg"
                        style={{
                          background: "rgba(255, 255, 255, 0.15)",
                          backdropFilter: "blur(16px)",
                          border: "1px solid rgba(255, 255, 255, 0.25)",
                          boxShadow:
                            "0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.3)",
                        }}
                      >
                        <div className="flex items-center justify-center">
                          <AlertTriangle className="w-5 h-5" style={{ color: "#FCD34D", strokeWidth: 2.5 }} />
                        </div>
                        <div className="flex items-center gap-1.5 text-white">
                          {isSubscriptionExpired ? (
                            <span className="text-sm" style={{ opacity: 0.95, fontWeight: 600 }}>
                              Subscription has expired
                            </span>
                          ) : (
                            <>
                              <span className="text-sm" style={{ opacity: 0.95, fontWeight: 500 }}>
                                Update billing within
                              </span>
                              <span className="text-lg tracking-tight" style={{ fontWeight: 700, letterSpacing: "-0.02em" }}>
                                {daysRemaining} {daysRemaining === 1 ? "day" : "days"}
                              </span>
                              <span className="text-sm" style={{ opacity: 0.95, fontWeight: 500 }}>
                                to avoid interruptions to your campaign insights.
                              </span>
                            </>
                          )}
                        </div>
                      </motion.div>
                    </>
                  )}
                </div>

                <div className="flex-shrink-0 flex flex-col items-start lg:items-end gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setIsBillingExpanded(!isBillingExpanded)}
                      className="px-8 py-3 rounded-lg text-white transition-all hover:scale-105"
                      style={{
                        background: "linear-gradient(to right, #6366F1, #AE95ED)",
                        boxShadow: "0 4px 16px rgba(99, 102, 241, 0.25)",
                        fontWeight: 600,
                        fontSize: "16px",
                      }}
                    >
                      Update billing
                    </button>
                    <button
                      onClick={handleHelpRedirect}
                      className="px-6 py-2.5 rounded-lg text-white border border-white/40 bg-white/10 transition-all hover:bg-white/20 backdrop-blur-sm"
                      style={{ borderRadius: "10px", fontWeight: 500 }}
                    >
                      Get billing help
                    </button>
                    <button
                      onClick={() => setIsBillingExpanded(!isBillingExpanded)}
                      className="text-white hover:bg-white/15 p-2 rounded-lg transition-colors"
                      aria-label={isBillingExpanded ? "Collapse details" : "Expand details"}
                    >
                      {isBillingExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {isBillingExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="bg-white p-8 mt-px rounded-b-xl">
                    <h3 className="text-2xl text-gray-900 mb-3" style={{ fontWeight: 600 }}>
                      Let&apos;s get your subscription back on track.
                    </h3>
                    <p className="text-gray-700 mb-4 leading-relaxed text-base">
                      Update your payment method to restore uninterrupted access to your dashboards,
                      campaign insights, and marketing intelligence.
                    </p>

                    <p className="text-gray-700 text-base mb-6">
                      You currently have{" "}
                      <span style={{ fontWeight: 700 }}>{connectedChannels}</span>{" "}
                      connected {connectedChannels === 1 ? "channel" : "channels"} and{" "}
                      <span style={{ fontWeight: 700 }}>{launchedCampaigns}</span>{" "}
                      active {launchedCampaigns === 1 ? "campaign" : "campaigns"}. Update billing
                      to keep your insights running.
                    </p>


                    {/* <div
                      className="mb-6 p-4 rounded-lg flex items-start gap-3"
                      style={{
                        background: daysRemaining <= 2 ? "rgba(252, 211, 77, 0.1)" : "rgba(99, 102, 241, 0.05)",
                        border: `1px solid ${daysRemaining <= 2 ? "rgba(252, 211, 77, 0.3)" : "rgba(99, 102, 241, 0.1)"}`,
                      }}
                    >
                      <AlertTriangle
                        className="w-5 h-5 flex-shrink-0 mt-0.5"
                        style={{ color: daysRemaining <= 2 ? "#F59E0B" : "#6366F1" }}
                      />
                      <p className="text-gray-700 text-sm leading-relaxed">{getCountdownMessage()}</p>
                    </div> */}

                    <div className="flex flex-wrap items-center gap-4">
                      <button
                        onClick={handleSettingsBillingRedirect}
                        className="px-8 py-3 rounded-lg text-white transition-all hover:scale-105"
                        style={{
                          background: "linear-gradient(to right, #6366F1, #AE95ED)",
                          boxShadow: "0 4px 16px rgba(99, 102, 241, 0.25)",
                          fontWeight: 600,
                          fontSize: "16px",
                        }}
                      >
                        Update payment method
                      </button>
                      <button
                        onClick={handleHelpRedirect}
                        className="text-indigo-600 hover:text-indigo-700 transition-colors underline"
                        style={{ fontWeight: 500 }}
                      >
                        Contact support
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        {/* <div className="mx-6 mt-6 w-full max-w-[calc(100%-3rem)]">
          <div className="bg-white rounded-lg p-8 border border-gray-200">
            <h3 className="text-xl text-gray-900 mb-4">Dashboard Content</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="bg-gray-50 rounded-lg p-6 h-32">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div> */}
        <UpgradeModal
          open={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          reason="subscription_expired"
        />
      </>
    );
  }

  // Inactive subscription
  if (isInactive) {
    return (
      <>
        <Alert className="border-slate-200 bg-slate-50 mx-6 mt-4 relative">
          <AlertCircle className="h-5 w-5 text-slate-600" />
          <AlertDescription className="text-slate-900 flex items-center justify-between">
            <div className="pr-8">
              <strong className="font-semibold">Subscription required</strong>
              <p className="text-sm mt-1">
                Subscribe to access all REACTIQ360 features.
              </p>
            </div>
            <Button
              onClick={() => setShowUpgradeModal(true)}
              className="bg-violet-600 hover:bg-violet-700 text-white"
              size="sm"
            >
              View Plans
            </Button>
          </AlertDescription>
        </Alert>
        <UpgradeModal
          open={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          reason="inactive"
        />
      </>
    );
  }

  return null;
}
