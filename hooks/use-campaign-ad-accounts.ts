"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";

export interface AdAccount {
  id: string;
  name: string;
  platform: string;
  platform_id: string;
  account_id: string;
  account_name: string;
  auth_provider_id: number;
  status?: string;
  currency?: string;
  timezone?: string;
}

export interface AdAccountsResponse {
  ad_accounts: AdAccount[];
}

// New API response format
interface NewAPIAccount {
  id: string;
  name: string;
  auth_provider_id: number;
  is_linked: boolean;
}

// Platform mapping for display names
const platformDisplayNames: Record<string, string> = {
  facebook_ads: "Facebook Ads",
  instagram_ads: "Instagram Ads",
  google_ads: "Google Ads",
  linkedin_members: "LinkedIn",
  microsoft_search_ads: "Microsoft Ads",
  tiktok_ads: "TikTok Ads",
  pinterest_ads: "Pinterest Ads",
};

// Transform new API response to AdAccount format
// Since we don't know the exact platform from the response, we'll handle it during fetch
function transformNewAPIAccount(
  account: NewAPIAccount,
  platformSlug: string
): AdAccount[] {
  const accounts: AdAccount[] = [];

  // Handle Meta platforms (Facebook & Instagram share accounts)
  if (platformSlug === "facebook_ads" || platformSlug === "facebook_organic") {
    // Add Facebook Ads account
    accounts.push({
      id: `facebook_ads_${account.id}`,
      name: account.name,
      platform: platformDisplayNames.facebook_ads,
      platform_id: "facebook_ads",
      account_id: account.id,
      account_name: account.name,
      auth_provider_id: account.auth_provider_id,
    });

    // Also add Instagram Ads account (same Meta account)
    accounts.push({
      id: `instagram_ads_${account.id}`,
      name: account.name,
      platform: platformDisplayNames.instagram_ads,
      platform_id: "instagram_ads",
      account_id: account.id,
      account_name: account.name,
      auth_provider_id: account.auth_provider_id,
    });
  } else {
    // For other platforms, create a single account entry
    const displayName = platformDisplayNames[platformSlug] || platformSlug;
    accounts.push({
      id: `${platformSlug}_${account.id}`,
      name: account.name,
      platform: displayName,
      platform_id: platformSlug,
      account_id: account.id,
      account_name: account.name,
      auth_provider_id: account.auth_provider_id,
    });
  }

  return accounts;
}

/**
 * Hook to fetch ad accounts based on auth provider IDs
 * @param authProviderIds - Array of auth provider IDs from platform._authentication.id
 * @param authProviderToPlatform - Mapping of auth_provider_id to platform slug
 */
export function useAdAccountsByAuthProviders(
  authProviderIds: number[],
  authProviderToPlatform: Record<number, string> = {}
) {
  const { token, isAuthenticated } = useAuth();

  return useQuery<AdAccountsResponse>({
    queryKey: ["ad-accounts-by-auth-providers", authProviderIds.sort().join(',')],
    queryFn: async () => {
      if (!token) {
        throw new Error("No authentication token available");
      }

      if (authProviderIds.length === 0) {
        return { ad_accounts: [] };
      }

      // Make parallel GET requests for each auth provider
      const requestsWithContext = authProviderIds.map(authProviderId => ({
        authProviderId,
        platformSlug: authProviderToPlatform[authProviderId] || "unknown",
        request: fetch(
          `https://xyfx-hog3-y19r.n7e.xano.io/api:b3UvZDq3/get_available_ad_accounts?auth_provider_id=${authProviderId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
      }));

      const responses = await Promise.all(
        requestsWithContext.map(ctx => ctx.request)
      );

      // Check for errors
      const errors = responses.filter(r => !r.ok);
      if (errors.length > 0) {
        throw new Error(`Failed to fetch ad accounts from ${errors.length} provider(s)`);
      }

      // Parse all responses
      const rawDataArrays: NewAPIAccount[][] = await Promise.all(
        responses.map(r => r.json())
      );

      // Transform each response with its platform context
      const allAccounts: AdAccount[] = [];
      rawDataArrays.forEach((accounts, index) => {
        const platformSlug = requestsWithContext[index].platformSlug;
        accounts.forEach(account => {
          const transformed = transformNewAPIAccount(account, platformSlug);
          allAccounts.push(...transformed);
        });
      });

      return {
        ad_accounts: allAccounts,
      };
    },
    // Only run the query when we have a valid token and auth provider IDs
    enabled: isAuthenticated && !!token && authProviderIds.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}
