"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useSubscriptionCheck, usePlans } from "@/hooks/use-subscription";
import { PlanSelectionModal } from "@/components/PlanSelectionModal";
import { useQueryClient } from "@tanstack/react-query";

interface SubscriptionHandlerProps {
  children: React.ReactNode;
}

/**
 * SubscriptionHandler - Manages subscription status checking and plan selection flow
 *
 * This component:
 * 1. Checks if user needs to select a plan after authentication
 * 2. Shows an uncloseable modal if plan selection is required
 * 3. Fetches available plans from the API
 * 4. Handles plan selection and refreshes data after successful selection
 */
export function SubscriptionHandler({ children }: SubscriptionHandlerProps) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [showPlanModal, setShowPlanModal] = useState(false);
  const queryClient = useQueryClient();

  // Check subscription status
  const {
    data: subscriptionData,
    isLoading: subscriptionLoading,
    error: subscriptionError,
  } = useSubscriptionCheck();

  // Fetch available plans
  const { data: plans, isLoading: plansLoading, error: plansError } = usePlans();

  // Check if user needs to select a plan
  useEffect(() => {
    if (
      !authLoading &&
      !subscriptionLoading &&
      isAuthenticated &&
      subscriptionData
    ) {
      console.log("Subscription check data:", subscriptionData);
      console.log("Needs plan selection:", subscriptionData.needs_plan_selection);

      if (subscriptionData.needs_plan_selection) {
        setShowPlanModal(true);
      } else {
        setShowPlanModal(false);
      }
    }
  }, [
    authLoading,
    subscriptionLoading,
    isAuthenticated,
    subscriptionData,
  ]);

  // Debug plans loading
  useEffect(() => {
    console.log("Plans data:", plans);
    console.log("Plans loading:", plansLoading);
    console.log("Plans error:", plansError);
  }, [plans, plansLoading, plansError]);

  // Handle successful plan selection
  const handlePlanSelected = async (data: any) => {
    console.log("Plan selected successfully:", data);

    // Invalidate and refetch subscription and user data
    await queryClient.invalidateQueries({ queryKey: ["subscription"] });
    await queryClient.invalidateQueries({ queryKey: ["user"] });

    // Close the modal
    setShowPlanModal(false);
  };

  // Show loading state while checking subscription
  if (authLoading || (isAuthenticated && subscriptionLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-cyan-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error if subscription check fails (but don't block access)
  if (subscriptionError) {
    console.error("Subscription check error:", subscriptionError);
  }

  return (
    <>
      {children}

      {/* Plan Selection Modal - Only shows when needs_plan_selection is true */}
      {showPlanModal && (
        <>
          {plansLoading ? (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-white">Loading plans...</p>
              </div>
            </div>
          ) : plansError ? (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
              <div className="bg-white rounded-2xl p-8 max-w-md mx-4">
                <h3 className="text-xl font-bold text-[#e11d48] mb-4">Error Loading Plans</h3>
                <p className="text-gray-700 mb-4">Failed to load subscription plans. Please try again.</p>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
                >
                  Reload Page
                </button>
              </div>
            </div>
          ) : plans && plans.length > 0 ? (
            <PlanSelectionModal
              isOpen={showPlanModal}
              plans={plans}
              onPlanSelected={handlePlanSelected}
            />
          ) : (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
              <div className="bg-white rounded-2xl p-8 max-w-md mx-4">
                <h3 className="text-xl font-bold text-yellow-600 mb-4">No Plans Available</h3>
                <p className="text-gray-700 mb-4">No subscription plans are currently available. Please contact support.</p>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
                >
                  Reload Page
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
