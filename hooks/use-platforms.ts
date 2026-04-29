"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";

interface LogoImage {
  mime: string;
  url: string;
}

export interface LinkedAccount {
  id: number;
  ad_account_name: string;
  connection_id: string;
  initial_sync_done: boolean;
  initial_sync_started_at: string | null;
  last_synced_at: string | null;
  last_fetched_at: string | null;
  is_active: boolean;
}

export type AuthStatus = "connected" | "auth_pending" | "disconnected" | "re_connect";

export interface Authentication {
  id: number;
  email: string;
  provider_name: string;
  platforms_id: string;
  status: AuthStatus;
  token_expiry_at: string | null;
  refresh_token_expiry_at: string | null;
  _linked_accounts?: LinkedAccount[];
}

export interface Platform {
  id: string;
  created_at: number;
  category: string;
  name: string;
  slug: string;
  weight: number;
  is_paid: boolean;
  logo: LogoImage;
  _authentication?: Authentication;
}

export function usePlatforms() {
  const { token, isAuthenticated } = useAuth();

  return useQuery<Platform[]>({
    queryKey: ["platforms"],
    queryFn: async () => {
      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await fetch(
        "https://xyfx-hog3-y19r.n7e.xano.io/api:b3UvZDq3/platforms",
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
          errorData.error || `Failed to fetch platforms: ${response.statusText}`
        );
      }

      const data = await response.json();
      return data;
    },
    // Only run the query when we have a valid token
    enabled: isAuthenticated && !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes - platforms don't change often
    retry: 2,
  });
}

// Helper hook to get only connected platforms
export function useConnectedPlatforms() {
  const { data: platforms, isLoading, error } = usePlatforms();

  const connectedPlatforms = platforms?.filter(
    (platform) => platform._authentication?.status === "connected"
  ) || [];

  const pendingPlatforms = platforms?.filter(
    (platform) => platform._authentication?.status === "auth_pending"
  ) || [];

  return {
    connectedPlatforms,
    pendingPlatforms,
    allPlatforms: platforms || [],
    isLoading,
    error,
    connectedCount: connectedPlatforms.length,
    pendingCount: pendingPlatforms.length,
  };
}
