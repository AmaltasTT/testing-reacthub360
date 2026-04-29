"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";

interface CampaignContext {
  id: number;
  created_at: number;
  campaigns_id: number;
  business_type: string;
  interests: string[];
  category: string;
  context: string;
  competitors: string[];
  age_range: string[];
}

interface AdAccount {
  id: string;
  name: string;
}

interface Campaign {
  id: string;
  name: string;
}

interface CampaignAuthProvider {
  id: number;
  created_at: number;
  auth_provider_id: number;
  campaigns_id: number;
  ad_accounts: AdAccount[];
  campaigns: Campaign[];
}

interface Goal {
  id: number;
  name: string;
}

export interface CampaignDetailResponse {
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

export function useCampaign(campaignId: string | null) {
  const { token, isAuthenticated } = useAuth();

  return useQuery<CampaignDetailResponse>({
    queryKey: ["campaign", campaignId],
    queryFn: async () => {
      if (!token) {
        throw new Error("No authentication token available");
      }

      if (!campaignId) {
        throw new Error("Campaign ID is required");
      }

      const response = await fetch(
        `https://xyfx-hog3-y19r.n7e.xano.io/api:Wqh-dK1c/get_campaign?campaign_id=${campaignId}`,
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
          errorData.error || `Failed to fetch campaign: ${response.statusText}`
        );
      }

      return response.json();
    },
    // Only run the query when we have a valid token and campaign ID
    enabled: isAuthenticated && !!token && !!campaignId,
    staleTime: 1 * 60 * 1000, // 1 minute - campaign details don't change often while editing
    retry: 2,
  });
}
