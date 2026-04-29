"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";

interface LogoImage {
  access: string;
  path: string;
  name: string;
  type: string;
  size: number;
  mime: string;
  meta: {
    width: number;
    height: number;
  };
  url: string;
}

interface Organization {
  id: number;
  created_at: number;
  name: string;
  website: string;
  domain: string;
  plan: number;
  industry: string;
  business_model?: string;
  company_size?: string;
  onboarding_completed?: boolean;
  street_address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  magic_link: string | null;
  logo?: LogoImage;
}

interface Plan {
  id: number;
  price_id: string;
  nickname: string;
  interval: string;
  unit_amount: number;
  features: any[];
  created_at: number;
  plan_title: string;
}

interface Subscription {
  id: number;
  created_at: number;
  organization_id: number;
  plan_id: number;
  plan_expiry: number;
  status: string;
  trial_end?: number;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  _plan: Plan;
}

interface AvatarImage {
  name: string;
  type: string;
  size: number;
  mime: string;
  meta: {
    width: number;
    height: number;
  };
  url: string;
}

interface User {
  id: number;
  created_at: number;
  email: string;
  first_name: string;
  last_name: string;
  organizations_id: number;
  role: string;
  is_active: boolean;
  show_welcome?: boolean;
  phone_number?: string;
  avatar_image?: AvatarImage;
  _organizations?: Organization;
  _subscription?: Subscription;
}

export function useUser() {
  const { token, isAuthenticated } = useAuth();

  return useQuery<User>({
    queryKey: ["user"],
    queryFn: async () => {
      if (!token) {
        throw new Error("No authentication token available");
      }

      // Call Next.js API route instead of Xano directly
      const response = await fetch("/api/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Failed to fetch user: ${response.statusText}`
        );
      }

      const res = await response.json();
      return res;
    },
    // Only run the query when we have a valid token
    enabled: isAuthenticated && !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

export function useUpdateWelcomeStatus() {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  return useMutation({
    mutationFn: async () => {
      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await fetch("/api/user/welcome", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ show_welcome: false }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to update welcome status");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate user query to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}
