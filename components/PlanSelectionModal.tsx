"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";
import { formatPrice, type Plan } from "@/lib/subscription-utils";

interface PlanSelectionModalProps {
  isOpen: boolean;
  plans: Plan[];
  onPlanSelected: (data: any) => void;
}

export function PlanSelectionModal({
  isOpen,
  plans,
  onPlanSelected,
}: PlanSelectionModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  // Filter plans: Remove "Free Trial" and show only monthly plans
  const filteredPlans = useMemo(() => {
    return plans.filter(
      (plan) =>
        plan.price_id !== "free_trial" &&
        plan.interval === "month"
    );
  }, [plans]);

  // Prevent ESC key from closing modal
  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          e.preventDefault();
          e.stopPropagation();
        }
      };

      document.addEventListener("keydown", handleKeyDown, true);
      return () => document.removeEventListener("keydown", handleKeyDown, true);
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  const handleSelectPlan = async () => {
    if (!selectedPlan || !token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/subscription/select-plan", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan_id: selectedPlan.id }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to select plan");
      }

      const data = await response.json();

      toast.success("Plan selected successfully! You have 30 days free trial.");
      onPlanSelected(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Network error. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(4px)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6 rounded-t-3xl z-10">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-sm font-semibold mb-4 shadow-lg"
                >
                  <span className="text-lg">✨</span>
                  <span>30 Days Free Trial - No Credit Card Required</span>
                </motion.div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  Choose Your Plan
                </h2>
                <p className="text-gray-600">
                  Start your free trial today. Upgrade, downgrade, or cancel anytime.
                </p>
              </div>
            </div>

            <div className="px-8 py-8">
              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 flex items-start gap-3"
                >
                  <span className="text-xl">⚠️</span>
                  <span className="flex-1">{error}</span>
                </motion.div>
              )}

              {/* Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {filteredPlans.map((plan, index) => {
                  const isSelected = selectedPlan?.id === plan.id;
                  const isPopular = plan.plan_title === "Growth";

                  return (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -8, transition: { duration: 0.2 } }}
                      onClick={() => setSelectedPlan(plan)}
                      className={`relative cursor-pointer rounded-2xl transition-all ${
                        isSelected
                          ? "bg-gradient-to-br from-violet-50 to-indigo-50"
                          : "bg-white hover:bg-gray-50"
                      }`}
                      style={{
                        border: isSelected
                          ? "3px solid transparent"
                          : "2px solid #E5E7EB",
                        backgroundClip: isSelected ? "padding-box" : undefined,
                        boxShadow: isSelected
                          ? "0 0 0 3px rgba(139, 92, 246, 0.4), 0 10px 40px rgba(139, 92, 246, 0.3)"
                          : "0 2px 8px rgba(0, 0, 0, 0.08)",
                      }}
                    >
                      {/* Popular Badge */}
                      {isPopular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
                          MOST POPULAR
                        </div>
                      )}

                      {/* Selected Checkmark */}
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg"
                        >
                          <Check className="w-5 h-5 text-white" strokeWidth={3} />
                        </motion.div>
                      )}

                      <div className="p-6">
                        {/* Plan Title */}
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">
                          {plan.plan_title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">{plan.nickname}</p>

                        {/* Price */}
                        <div className="mb-6">
                          <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                              ${plan.unit_amount}
                            </span>
                            <span className="text-gray-600 text-lg font-medium">
                              /month
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Billed monthly after trial
                          </p>
                        </div>

                        {/* Features Placeholder */}
                        <div className="space-y-3 pt-6 border-t border-gray-200">
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                              <Check className="w-3 h-3 text-green-600" strokeWidth={3} />
                            </div>
                            <span>30-day free trial</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                              <Check className="w-3 h-3 text-green-600" strokeWidth={3} />
                            </div>
                            <span>Full feature access</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                              <Check className="w-3 h-3 text-green-600" strokeWidth={3} />
                            </div>
                            <span>Cancel anytime</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  onClick={handleSelectPlan}
                  disabled={!selectedPlan || loading}
                  className="w-full py-6 text-lg font-semibold rounded-xl transition-all text-white"
                  style={{
                    background:
                      selectedPlan && !loading
                        ? "linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)"
                        : "#9CA3AF",
                    cursor: selectedPlan && !loading ? "pointer" : "not-allowed",
                    boxShadow:
                      selectedPlan && !loading
                        ? "0 4px 20px rgba(139, 92, 246, 0.4)"
                        : "none",
                    color: "#FFFFFF",
                  }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Starting Your Trial...
                    </span>
                  ) : (
                    "Start 30-Day Free Trial"
                  )}
                </Button>

                {/* Footer Text */}
                <p className="text-center mt-4 text-sm text-gray-600">
                  You won't be charged until your trial ends.{" "}
                  <span className="font-semibold">Cancel anytime.</span>
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
