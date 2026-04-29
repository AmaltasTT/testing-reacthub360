"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";

export interface UpdateCampaignPayload {
  campaign_id: number;
  name: string;
  goal_id: number;
  geography: string;
  auth_providers: Array<{
    auth_provider_id: number;
    ad_accounts?: Array<{
      id: string;
      name: string;
    }>;
    campaigns?: Array<{
      id: string;
      name: string;
    }>;
  }>;
  status: "draft" | "active" | "disabled";
  business_type?: string;
  interests?: string[];
  category?: string;
  context_description?: string;
  competitors?: string[];
  age_range?: string[];
}

export interface UpdateCampaignResponse {
  id: number;
  name: string;
  goal_id: number;
  geography: string;
  status: string;
  // Add other response fields as needed
}

export function useUpdateCampaign() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<UpdateCampaignResponse, Error, UpdateCampaignPayload>({
    mutationFn: async (campaignData: UpdateCampaignPayload) => {
      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await fetch(
        `https://xyfx-hog3-y19r.n7e.xano.io/api:Wqh-dK1c/campaign`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(campaignData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Failed to update campaign: ${response.statusText}`
        );
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate campaigns query to refetch the updated list
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}
