"use client";

import { useQueries, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";

// Raw API response type (LinkedIn and others may return numeric `id`)
interface RawAccountCampaign {
  id: string | number;
  name: string;
}

// Transformed type for the UI
export interface AccountCampaign {
  campaign_id: string;
  campaign_name: string;
}

export interface AccountCampaignsResponse {
  campaigns: AccountCampaign[];
}

export const accountCampaignsQueryKey = (authProviderId: number, accountId: string) =>
  ["account-campaigns", authProviderId, accountId] as const;

export async function fetchAccountCampaigns(
  token: string,
  authProviderId: number,
  accountId: string
): Promise<AccountCampaignsResponse> {
  const response = await fetch(
    "https://xyfx-hog3-y19r.n7e.xano.io/api:Wqh-dK1c/get_ad_account_campaigns",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        auth_provider_id: authProviderId,
        ad_account_id: accountId,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to fetch campaigns: ${response.statusText}`);
  }

  const rawData: RawAccountCampaign[] = await response.json();
  const campaigns: AccountCampaign[] = rawData.map((campaign) => ({
    campaign_id: String(campaign.id ?? ""),
    campaign_name: campaign.name,
  }));
  return { campaigns };
}

/**
 * Hook to fetch campaigns for a specific ad account
 * @param authProviderId - The auth provider ID for the platform
 * @param accountId - The ad account ID selected by the user
 */
export function useAccountCampaigns(
  authProviderId: number | null,
  accountId: string | null,
  options?: { enabled?: boolean }
) {
  const { token, isAuthenticated } = useAuth();
  const extraEnabled = options?.enabled !== false;

  return useQuery<AccountCampaignsResponse>({
    queryKey:
      authProviderId && accountId
        ? accountCampaignsQueryKey(authProviderId, accountId)
        : (["account-campaigns", "__idle__"] as const),
    queryFn: async () => {
      if (!token) {
        throw new Error("No authentication token available");
      }
      if (!authProviderId || !accountId) {
        return { campaigns: [] };
      }
      return fetchAccountCampaigns(token, authProviderId, accountId);
    },
    enabled:
      extraEnabled && isAuthenticated && !!token && !!authProviderId && !!accountId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

/**
 * Parallel fetches for multiple ad accounts (same cache keys as useAccountCampaigns).
 */
export function useMultiAccountCampaigns(
  authProviderId: number | null,
  accountIds: string[],
  options?: { enabled?: boolean }
) {
  const { token, isAuthenticated } = useAuth();
  const extraEnabled = options?.enabled !== false;

  return useQueries({
    queries: accountIds.map((accountId) => ({
      queryKey: accountCampaignsQueryKey(authProviderId ?? 0, accountId),
      queryFn: async () => {
        if (!token) throw new Error("No authentication token available");
        if (!authProviderId) return { campaigns: [] as AccountCampaign[] };
        return fetchAccountCampaigns(token, authProviderId, accountId);
      },
      enabled:
        extraEnabled &&
        isAuthenticated &&
        !!token &&
        !!authProviderId &&
        accountIds.length > 0,
      staleTime: 5 * 60 * 1000,
      retry: 2,
    })),
  });
}
