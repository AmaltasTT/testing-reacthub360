"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";

interface UpdateOrganizationData {
  name?: string;
  website?: string;
  industry?: string;
  company_size?: string;
  business_model?: string;
  logo_image?: string; // Base64 encoded image
  street_address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
}

export function useUpdateOrganization() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateOrganizationData) => {
      if (!token) {
        throw new Error("No authentication token available");
      }

      // Call Next.js API route instead of Xano directly
      const response = await fetch("/api/organization", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Failed to update organization: ${response.statusText}`
        );
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch user data after successful update (includes organization data)
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}
