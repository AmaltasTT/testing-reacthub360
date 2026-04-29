"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";

export interface CampaignGoal {
  id: string;
  name: string;
  phase: string;
}

interface CampaignGoalResponse {
  id: string;
  name: string;
}

// Helper function to get REACT phase based on goal name
const getReactPhase = (goalName: string): string => {
  const phases: Record<string, string> = {
    awareness: "REACT Phase 1",
    consideration: "REACT Phase 2",
    conversion: "REACT Phase 3",
    advocacy: "REACT Phase 4",
    retention: "REACT Phase 5",
  };

  return phases[goalName.toLowerCase()] || "REACT Phase";
};

// Helper function to capitalize first letter
const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export function useCampaignGoals() {
  const { token, isAuthenticated } = useAuth();

  return useQuery<CampaignGoal[]>({
    queryKey: ["campaign-goals"],
    queryFn: async () => {
      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await fetch(
        "https://xyfx-hog3-y19r.n7e.xano.io/api:Wqh-dK1c/get_campaign_goals",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Failed to fetch campaign goals: ${response.statusText}`
        );
      }

      const data: CampaignGoalResponse[] = await response.json();

      // Transform API response to match our interface (ids always strings — matches `goal_id` from campaign APIs)
      return data.map((goal) => ({
        id: String(goal.id),
        name: capitalizeFirstLetter(goal.name),
        phase: getReactPhase(goal.name),
      }));
    },
    // Only run the query when we have a valid token
    enabled: isAuthenticated && !!token,
    staleTime: 10 * 60 * 1000, // 10 minutes - goals don't change often
    retry: 2,
  });
}
