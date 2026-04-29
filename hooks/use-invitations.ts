"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";

/**
 * Invitation interface based on API specification
 */
export interface Invitation {
  id: number;
  organizations_id: number;
  email: string;
  role: "Admin" | "Manager" | "Member";
  token?: string;
  expiration?: string;
  status: "pending" | "accepted" | "expired" | "cancelled";
  invited_by: number;
  created_at: string;
  accepted_at?: string;
  accepted_by?: number;
}

/**
 * Send invitation request payload
 */
export interface SendInvitationPayload {
  email: string;
  role: "Admin" | "Manager" | "Member";
}

/**
 * Accept invitation request payload
 */
export interface AcceptInvitationPayload {
  token: string;
  first_name: string;
  last_name: string;
  password: string;
  phone_number?: string;
}

/**
 * Accept invitation response
 */
export interface AcceptInvitationResponse {
  authToken: string;
  user_email: string;
}

/**
 * Hook to list invitations
 * @param status - Filter by status (optional): "pending" | "accepted" | "expired" | "cancelled" | "all"
 */
export function useInvitations(status?: string) {
  const { token, isAuthenticated } = useAuth();

  return useQuery<Invitation[]>({
    queryKey: ["invitations", status],
    queryFn: async () => {
      if (!token) {
        throw new Error("No authentication token available");
      }

      const url =
        status && status !== "all"
          ? `https://xyfx-hog3-y19r.n7e.xano.io/api:b0QkHv4_/list_invitations?status=${status}`
          : "https://xyfx-hog3-y19r.n7e.xano.io/api:b0QkHv4_/list_invitations";

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to fetch invitations: ${response.statusText}`,
        );
      }

      return response.json();
    },
    enabled: isAuthenticated && !!token,
    staleTime: 30 * 1000, // 30 seconds
    retry: 1,
  });
}

/**
 * Hook to send an invitation (Admin only)
 */
export function useSendInvitation() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SendInvitationPayload) => {
      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await fetch(
        "https://xyfx-hog3-y19r.n7e.xano.io/api:b0QkHv4_/send_invitation",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to send invitation");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate invitations query to refetch updated list
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
  });
}

/**
 * Hook to cancel an invitation (Admin only)
 */
export function useCancelInvitation() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (invitationId: number) => {
      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await fetch(
        `https://xyfx-hog3-y19r.n7e.xano.io/api:b0QkHv4_/cancel_invitation?invitation_id=${invitationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to cancel invitation");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate invitations query to refetch updated list
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
  });
}

/**
 * Hook to accept an invitation (Public - no auth required)
 * This is used on the public invitation acceptance page
 */
export function useAcceptInvitation() {
  return useMutation({
    mutationFn: async (payload: AcceptInvitationPayload) => {
      const response = await fetch(
        "https://xyfx-hog3-y19r.n7e.xano.io/api:b0QkHv4_/accept_invitation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to accept invitation");
      }

      return response.json() as Promise<AcceptInvitationResponse>;
    },
  });
}
