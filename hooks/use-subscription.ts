"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";
import type { SubscriptionData } from "@/lib/subscription-utils";

/**
 * Hook to check subscription status
 */
export function useSubscriptionCheck() {
  const { token } = useAuth();

  return useQuery<SubscriptionData>({
    queryKey: ["subscription", "check"],
    queryFn: async () => {
      if (!token) {
        throw new Error("No authentication token");
      }

      const response = await fetch("/api/subscription/check", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.log("Failed to check subscription");
      }

      return response.json();
    },
    enabled: !!token,
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Hook to select a subscription plan
 */
export function useSelectPlan() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (planId: number) => {
      if (!token) {
        throw new Error("No authentication token");
      }

      const response = await fetch("/api/subscription/select-plan", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan_id: planId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to select plan");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate subscription and user queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

/**
 * Hook to fetch available plans
 */
export function usePlans() {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      if (!token) {
        throw new Error("No authentication token");
      }

      const response = await fetch(
        "https://xyfx-hog3-y19r.n7e.xano.io/api:ErRcIFe2/get_all_plans",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch plans");
      }

      return response.json();
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
