"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { calculateDaysLeft, type Subscription } from "@/lib/subscription-utils";
import { useRouter } from "next/navigation";

interface TrialStatusBannerProps {
  subscription: Subscription | null;
}

export function TrialStatusBanner({ subscription }: TrialStatusBannerProps) {
  const router = useRouter();
  const [isClosed, setIsClosed] = useState(false);

  if (isClosed) return null;

  if (!subscription) return null;

  // Trial Active
  if (subscription.status === "trial" && subscription.trial_end) {
    const daysLeft = calculateDaysLeft(subscription.trial_end);

    if (daysLeft > 0) {
      return (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl flex items-center justify-between shadow-sm relative"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎉</span>
              <span className="text-blue-900 font-semibold">
                Trial Active - {daysLeft} day{daysLeft !== 1 ? "s" : ""} remaining
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => router.push("/profile?tab=billing")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                Add Payment Method
              </Button>
              <button
                onClick={() => setIsClosed(true)}
                className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded-lg hover:bg-blue-100"
                aria-label="Close banner"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      );
    } else {
      // Trial expired
      return (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-center justify-between shadow-sm relative"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <span className="text-red-900 font-semibold">
                Trial Expired - Add payment to continue
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => router.push("/profile?tab=billing")}
                className="text-[#e11d48] hover:bg-red-700 text-white font-semibold"
              >
                Add Payment Now
              </Button>
              <button
                onClick={() => setIsClosed(true)}
                className="text-[#e11d48] hover:text-red-800 transition-colors p-1 rounded-lg hover:bg-red-100"
                aria-label="Close banner"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      );
    }
  }

  // Active Subscription - Don't show banner
  if (subscription.status === "active") {
    return null;
  }

  // Inactive Subscription
  if (subscription.status === "inactive" || subscription.status === "canceled") {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-center justify-between shadow-sm relative"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <span className="text-red-900 font-semibold">
              Payment Failed - Please update payment method
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => router.push("/profile?tab=billing")}
              className="text-[#e11d48] hover:bg-red-700 text-white font-semibold"
            >
              Update Payment
            </Button>
            <button
              onClick={() => setIsClosed(true)}
              className="text-[#e11d48] hover:text-red-800 transition-colors p-1 rounded-lg hover:bg-red-100"
              aria-label="Close banner"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return null;
}
