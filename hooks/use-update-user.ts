"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";

interface UpdateUserData {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  phone_number?: string;
  avatar?: string;
}

export function useUpdateUser() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateUserData) => {
      if (!token) {
        throw new Error("No authentication token available");
      }

      // Call Next.js API route instead of Xano directly
      const response = await fetch("/api/user", {
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
          errorData.error || `Failed to update user: ${response.statusText}`
        );
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch user data after successful update
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}
