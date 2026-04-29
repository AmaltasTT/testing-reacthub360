"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";

/**
 * Organization user interface
 */
export interface OrganizationUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: "Admin" | "Manager" | "Member";
  organizations_id: number;
  is_active: boolean;
  created_at: string;
  phone_number?: string;
  avatar_image?: {
    url: string;
    name: string;
  };
}

/**
 * Hook to fetch all users in the organization
 */
export function useOrganizationUsers() {
  const { token, isAuthenticated } = useAuth();

  return useQuery<OrganizationUser[]>({
    queryKey: ["organization", "users"],
    queryFn: async () => {
      if (!token) {
        throw new Error("No authentication token available");
      }

      // According to the implementation guide, GET /api/users/users lists org users
      const response = await fetch(
        "https://xyfx-hog3-y19r.n7e.xano.io/api:cLFOjouu/users",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to fetch users: ${response.statusText}`,
        );
      }

      return response.json();
    },
    enabled: isAuthenticated && !!token,
    staleTime: 60 * 1000, // 1 minute
    retry: 1,
  });
}
