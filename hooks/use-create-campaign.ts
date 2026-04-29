"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";

export interface CreateCampaignPayload {
  name: string;
  goal_id: number;
  /** Omit for step-1 draft; Xano stores `""` when absent. */
  geography?: string;
  /** Omit until channels are chosen on Review. */
  auth_providers?: Array<{
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
  organizations_id: number;
  status: "draft" | "active" | "disabled";
  business_type?: string;
  interests?: string[];
  category?: string;
  context_description?: string;
  competitors?: string[];
  age_range?: string[];
  updated_at?: null;
}

/** Xano `111_campaign_POST` returns `{ campaign, campaign_context }`. */
export interface CreateCampaignResponse {
  campaign?: {
    id: number;
    name?: string;
    goal_id?: number;
    geography?: string;
    status?: string;
  };
  campaign_context?: unknown;
}

export function useCreateCampaign() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<CreateCampaignResponse, Error, CreateCampaignPayload>({
    mutationFn: async (campaignData: CreateCampaignPayload) => {
      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await fetch(
        "https://xyfx-hog3-y19r.n7e.xano.io/api:Wqh-dK1c/campaign",
        {
          method: "POST",
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
          errorData.error || `Failed to create campaign: ${response.statusText}`
        );
      }

      return response.json() as Promise<CreateCampaignResponse>;
    },
    onSuccess: () => {
      // Invalidate campaigns query to refetch the updated list
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}
