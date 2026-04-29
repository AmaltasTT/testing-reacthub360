"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Invalidate all subscription-related caches so status refreshes on next read
    queryClient.invalidateQueries({ queryKey: ["subscription"] });
    queryClient.invalidateQueries({ queryKey: ["billing", "subscription"] });
    queryClient.invalidateQueries({ queryKey: ["user"] });
  }, [queryClient]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm text-center">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-8 py-10 space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-900">Payment Successful!</h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              Your subscription is being activated. This usually takes a few seconds.
              You'll have full access to all features shortly.
            </p>
          </div>
          <Button
            onClick={() => router.push("/")}
            className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white shadow-lg shadow-violet-500/25"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
