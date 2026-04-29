"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";

/**
 * Update user data payload
 */
export interface UpdateUserPayload {
  userId: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: "Admin" | "Manager" | "Member";
  phone_number?: string;
}

/**
 * Hook to update a user (Admin only)
 */
export function useUpdateOrganizationUser() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateUserPayload) => {
      if (!token) {
        throw new Error("No authentication token available");
      }

      const { userId, ...updateData } = payload;

      const response = await fetch(
        `https://xyfx-hog3-y19r.n7e.xano.io/api:cLFOjouu/users/${userId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update user");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate organization users query to refetch updated list
      queryClient.invalidateQueries({ queryKey: ["organization", "users"] });
    },
  });
}

/**
 * Hook to delete a user (Admin only)
 */
export function useDeleteOrganizationUser() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: number) => {
      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await fetch(
        `https://xyfx-hog3-y19r.n7e.xano.io/api:cLFOjouu/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete user");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate organization users query to refetch updated list
      queryClient.invalidateQueries({ queryKey: ["organization", "users"] });
    },
  });
}
