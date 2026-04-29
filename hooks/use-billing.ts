"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";

// --- Types ---

export interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  cardholder_name: string;
}

export interface Invoice {
  id: string;
  number: string;
  date: number;
  amount_due: number;
  amount_paid: number;
  status: "paid" | "open" | "void" | "draft" | "uncollectible";
  description: string;
  pdf_url: string;
}

export interface InvoicesResponse {
  invoices: Invoice[];
  has_more: boolean;
  total_count: number;
}

export interface SubscriptionDetails {
  id: string;
  status: "active" | "trialing" | "past_due" | "canceled" | "unpaid" | "incomplete" | "paused";
  current_period_start: number;
  current_period_end: number;
  cancel_at_period_end: boolean;
  cancel_at?: number;
  plan: {
    id: string;
    name: string;
    amount: number;
    interval: string;
  };
  upcoming_invoice?: {
    amount_due: number;
    date: number;
    line_items: any[];
  };
}

export interface PlanInfo {
  name: string;
  amount?: number;
  unit_amount?: number;
  interval: string;
}

export interface PlanChangePreview {
  current_plan: PlanInfo;
  new_plan: PlanInfo;
  change_type: "upgrade" | "downgrade";
  proration_amount: number;
  next_invoice_amount: number;
  immediate_charge: number;
  currency: string;
}

export interface PlanChangeResult {
  previous_plan: PlanInfo;
  new_plan: PlanInfo;
  change_type: string;
  effective_date: string;
  stripe_subscription_status: string;
}

export interface BillingAddress {
  name?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

// --- Helpers ---

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

// --- Queries ---

export function usePaymentMethod() {
  const { token } = useAuth();

  return useQuery<PaymentMethod | null>({
    queryKey: ["billing", "paymentMethod"],
    queryFn: async () => {
      if (!token) throw new Error("No authentication token");

      const res = await fetch("/api/billing/payment-method", {
        headers: authHeaders(token),
      });

      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error("Failed to fetch payment method");
      }

      return res.json();
    },
    enabled: !!token,
    staleTime: 60 * 1000,
  });
}

export function useInvoices(startingAfter?: string) {
  const { token } = useAuth();

  return useQuery<InvoicesResponse>({
    queryKey: ["billing", "invoices", startingAfter],
    queryFn: async () => {
      if (!token) throw new Error("No authentication token");

      const url = startingAfter
        ? `/api/billing/invoices?starting_after=${startingAfter}`
        : "/api/billing/invoices";

      const res = await fetch(url, {
        headers: authHeaders(token),
      });

      if (!res.ok) throw new Error("Failed to fetch invoices");
      return res.json();
    },
    enabled: !!token,
    staleTime: 60 * 1000,
  });
}

export function useSubscriptionDetails(options?: { enabled?: boolean }) {
  const { token } = useAuth();

  return useQuery<SubscriptionDetails>({
    queryKey: ["billing", "subscription"],
    queryFn: async () => {
      if (!token) throw new Error("No authentication token");

      const res = await fetch("/api/billing/subscription", {
        headers: authHeaders(token),
      });

      if (!res.ok) throw new Error("Failed to fetch subscription details");
      return res.json();
    },
    enabled: !!token && (options?.enabled ?? true),
    staleTime: 60 * 1000,
  });
}

export function useBillingAddress() {
  const { token } = useAuth();

  return useQuery<BillingAddress | null>({
    queryKey: ["billing", "address"],
    queryFn: async () => {
      if (!token) throw new Error("No authentication token");

      const res = await fetch("/api/billing/billing-address", {
        headers: authHeaders(token),
      });

      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error("Failed to fetch billing address");
      }

      return res.json();
    },
    enabled: !!token,
    staleTime: 60 * 1000,
  });
}

// --- Mutations ---

export function useCreateSetupIntent() {
  const { token } = useAuth();

  return useMutation<{ client_secret: string }>({
    mutationFn: async () => {
      if (!token) throw new Error("No authentication token");

      const res = await fetch("/api/billing/setup-intent", {
        method: "POST",
        headers: authHeaders(token),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to create setup intent");
      }

      return res.json();
    },
  });
}

export function useUpdatePaymentMethod() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentMethodId: string) => {
      if (!token) throw new Error("No authentication token");

      const res = await fetch("/api/billing/update-payment-method", {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify({ payment_method_id: paymentMethodId }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to update payment method");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billing", "paymentMethod"] });
    },
  });
}

export function useCancelSubscription() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { reason?: string; feedback?: string }) => {
      if (!token) throw new Error("No authentication token");

      const res = await fetch("/api/billing/cancel-subscription", {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to cancel subscription");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billing", "subscription"] });
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

export function useReactivateSubscription() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!token) throw new Error("No authentication token");

      const res = await fetch("/api/billing/reactivate-subscription", {
        method: "POST",
        headers: authHeaders(token),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to reactivate subscription");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billing", "subscription"] });
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

export function useRetryPayment() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!token) throw new Error("No authentication token");

      const res = await fetch("/api/billing/retry-payment", {
        method: "POST",
        headers: authHeaders(token),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to retry payment");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billing", "subscription"] });
      queryClient.invalidateQueries({ queryKey: ["billing", "invoices"] });
    },
  });
}

export function useUpdateBillingAddress() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (address: BillingAddress) => {
      if (!token) throw new Error("No authentication token");

      const res = await fetch("/api/billing/billing-address", {
        method: "PATCH",
        headers: authHeaders(token),
        body: JSON.stringify(address),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to update billing address");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billing", "address"] });
    },
  });
}

export function usePreviewPlanChange() {
  const { token } = useAuth();

  return useMutation<PlanChangePreview, Error, { new_plan_id: number }>({
    mutationFn: async ({ new_plan_id }) => {
      if (!token) throw new Error("No authentication token");

      const res = await fetch("/api/billing/preview-plan-change", {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify({ new_plan_id }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to preview plan change");
      }

      return res.json();
    },
  });
}

export function useActivateSubscription() {
  const { token } = useAuth();

  return useMutation<{ success: boolean; client_secret: string; session_id: string; message: string }, Error, { return_url: string }>({
    mutationFn: async (body) => {
      if (!token) throw new Error("No authentication token");

      const res = await fetch("/api/billing/activate-subscription", {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || err.message || "Failed to activate subscription");
      }

      return res.json();
    },
  });
}

export function useChangePlan() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<PlanChangeResult, Error, { new_plan_id: number; proration_behavior?: string }>({
    mutationFn: async ({ new_plan_id, proration_behavior }) => {
      if (!token) throw new Error("No authentication token");

      const res = await fetch("/api/billing/change-plan", {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify({ new_plan_id, proration_behavior }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to change plan");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billing", "subscription"] });
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}
