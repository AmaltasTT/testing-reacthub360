"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";

interface OnboardingData {
  companyName: string;
  businessModel: string;
  industry: string;
  industryOther: string;
  companySize: string;
  websiteUrl: string;
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
}

export function useSubmitOnboarding() {
  const { token } = useAuth();

  return useMutation({
    mutationFn: async (data: OnboardingData) => {
      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to submit onboarding data");
      }

      return response.json();
    },
  });
}
