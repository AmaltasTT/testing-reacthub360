"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";

export interface DeleteCampaignPayload {
  campaign_id: number;
}

export interface DeleteCampaignResponse {
  success: boolean;
  message?: string;
}

export function useDeleteCampaign() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<DeleteCampaignResponse, Error, DeleteCampaignPayload>({
    mutationFn: async ({ campaign_id }: DeleteCampaignPayload) => {
      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await fetch(
        `https://xyfx-hog3-y19r.n7e.xano.io/api:Wqh-dK1c/campaign`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ campaign_id }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Failed to delete campaign: ${response.statusText}`
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
