"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";

interface CampaignContext {
  id: number;
  created_at: number;
  campaigns_id: number;
  Business_Type: string;
  interests: string[];
  category: string;
  context: string;
  competitors: string[];
  age_range: string[];
}

interface CampaignAuthProvider {
  id: number;
  created_at: number;
  auth_provider_id: number;
  campaigns_id: number;
}

interface Goal {
  id: number;
  name: string;
}

export interface CampaignResponse {
  id: number;
  created_at: number;
  organizations_id: number;
  name: string;
  geography: string;
  updated_at: number | null;
  goal_id: number;
  status: string;
  _campaign_context_of_campaigns: CampaignContext;
  _campaign_auth_providers_of_campaigns: CampaignAuthProvider[];
  _goal: Goal;
}

export function useCampaigns(options?: { enabled?: boolean }) {
  const { token, isAuthenticated } = useAuth();
  const enabled = options?.enabled !== false;

  return useQuery<CampaignResponse[]>({
    queryKey: ["campaigns"],
    queryFn: async () => {
      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await fetch(
        "https://xyfx-hog3-y19r.n7e.xano.io/api:Wqh-dK1c/get_all_campaigns",
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
          errorData.error || `Failed to fetch campaigns: ${response.statusText}`
        );
      }

      return response.json();
    },
    enabled: enabled && isAuthenticated && !!token,
    staleTime: 2 * 60 * 1000, // 2 minutes - campaigns change more frequently
    retry: 2,
  });
}
