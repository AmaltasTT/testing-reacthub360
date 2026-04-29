"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { usePlans } from "@/hooks/use-subscription";
import {
  usePreviewPlanChange,
  useChangePlan,
  useActivateSubscription,
  type PlanChangePreview,
} from "@/hooks/use-billing";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Check,
  AlertCircle,
  Sparkles,
  Zap,
  Shield,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Grid overlay — matches the pattern used in BillingTab modals
const GRID_BG =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  reason?: "trial_expiring" | "trial_expired" | "subscription_expired" | "inactive" | "feature_locked";
}

type Step = "select" | "preview" | "checkout" | "success";

function resolvePlanAmount(plan: { amount?: number; unit_amount?: number }): number {
  return plan.amount ?? plan.unit_amount ?? 0;
}

function formatAmount(cents: number | null | undefined, currency = "usd") {
  const value = Number(cents);
  if (!isFinite(value)) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(Math.abs(value));
}

// Shared gradient modal header
function ModalHeader({
  gradient,
  icon,
  title,
  subtitle,
  subtitleClass = "text-violet-100",
}: {
  gradient: string;
  icon: React.ReactNode;
  title: React.ReactNode;
  subtitle: React.ReactNode;
  subtitleClass?: string;
}) {
  return (
    <div className={`relative ${gradient} px-6 pt-8 pb-7 flex-shrink-0`}>
      <div
        className="absolute inset-0 opacity-20"
        style={{ backgroundImage: `url('${GRID_BG}')` }}
      />
      <div className="relative flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg flex-shrink-0">
          {icon}
        </div>
        <div>
          <DialogTitle className="text-xl font-bold text-white leading-tight">{title}</DialogTitle>
          <DialogDescription className={`text-sm mt-1 ${subtitleClass}`}>{subtitle}</DialogDescription>
        </div>
      </div>
    </div>
  );
}

export function UpgradeModal({ open, onClose, reason = "inactive" }: UpgradeModalProps) {
  const { data: plans, isLoading: plansLoading } = usePlans();
  const previewPlanChange = usePreviewPlanChange();
  const changePlan = useChangePlan();
  const activateSubscription = useActivateSubscription();

  const [step, setStep] = useState<Step>("select");
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [pendingPlan, setPendingPlan] = useState<any>(null);
  const [preview, setPreview] = useState<PlanChangePreview | null>(null);
  const [billingInterval, setBillingInterval] = useState<"month" | "year">("month");
  const [planError, setPlanError] = useState<string | null>(null);
  const [checkoutClientSecret, setCheckoutClientSecret] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const getMessage = () => {
    switch (reason) {
      case "trial_expiring":
        return {
          title: "Your trial is ending soon",
          subtitle: "Upgrade now to keep all features without interruption.",
          icon: <Sparkles className="w-6 h-6 text-white" />,
        };
      case "trial_expired":
        return {
          title: "Your trial has expired",
          subtitle: "Subscribe to restore access to all REACTIQ360 features.",
          icon: <AlertCircle className="w-6 h-6 text-white" />,
        };
      case "subscription_expired":
        return {
          title: "Your subscription has expired",
          subtitle: "Renew your subscription to continue using REACTIQ360.",
          icon: <AlertCircle className="w-6 h-6 text-white" />,
        };
      case "feature_locked":
        return {
          title: "Subscription required",
          subtitle: "Upgrade to unlock the full power of REACTIQ360.",
          icon: <Shield className="w-6 h-6 text-white" />,
        };
      default:
        return {
          title: "Choose your plan",
          subtitle: "Select the plan that's right for your team.",
          icon: <Zap className="w-6 h-6 text-white" />,
        };
    }
  };

  const handleClose = () => {
    setStep("select");
    setSelectedPlanId(null);
    setPendingPlan(null);
    setPreview(null);
    setPlanError(null);
    setCheckoutClientSecret(null);
    setCheckoutError(null);
    previewPlanChange.reset();
    changePlan.reset();
    activateSubscription.reset();
    onClose();
  };

  const handlePlanClick = async (plan: any) => {
    setSelectedPlanId(plan.id);
    setPendingPlan(plan);
    setPlanError(null);

    try {
      const result = await previewPlanChange.mutateAsync({ new_plan_id: plan.id });
      setPreview(result);
      setStep("preview");
    } catch (previewErr: any) {
      const msg: string = previewErr?.message ?? "";
      const isNoSubscription =
        msg.toLowerCase().includes("no active subscription") ||
        msg.toLowerCase().includes("no subscription") ||
        msg.toLowerCase().includes("not found");

      if (isNoSubscription) {
        setStep("checkout");
        setCheckoutClientSecret(null);
        setCheckoutError(null);
        try {
          const currentUrl = new URL(window.location.href);
          currentUrl.searchParams.set("checkout_success", "true");
          const data = await activateSubscription.mutateAsync({
            return_url: currentUrl.toString(),
          });
          setCheckoutClientSecret(data.client_secret);
        } catch (err: any) {
          setCheckoutError(err.message || "Failed to initialize checkout");
        }
      } else {
        setPlanError(msg || "Failed to load plan preview");
        setSelectedPlanId(null);
      }
    }
  };

  const handleConfirmChange = async () => {
    if (!pendingPlan) return;
    try {
      await changePlan.mutateAsync({ new_plan_id: pendingPlan.id });
      setStep("success");
    } catch (err: any) {
      toast.error(err.message || "Failed to change plan");
    }
  };

  const message = getMessage();

  // Interval toggle logic
  const allPlans: any[] = plans ?? [];
  const hasMonthly = allPlans.some((p) => p.interval === "month");
  const hasYearly = allPlans.some((p) => p.interval === "year");
  const showToggle = hasMonthly && hasYearly;
  const filteredPlans = showToggle
    ? allPlans.filter((p) => p.interval === billingInterval)
    : allPlans;

  const getYearlySavings = () => {
    const monthlyPlans = allPlans.filter((p) => p.interval === "month");
    const yearlyPlans = allPlans.filter((p) => p.interval === "year");
    if (!monthlyPlans.length || !yearlyPlans.length) return null;
    const totalMonthly = monthlyPlans.reduce((s: number, p: any) => s + (p.unit_amount ?? 0), 0);
    const totalYearly = yearlyPlans.reduce((s: number, p: any) => s + (p.unit_amount ?? 0), 0);
    const annualized = totalMonthly * 12;
    if (!annualized) return null;
    const pct = Math.round(((annualized - totalYearly) / annualized) * 100);
    return pct > 0 ? pct : null;
  };
  const yearlySavings = getYearlySavings();

  const isPreviewing = previewPlanChange.isPending;

  // ── Checkout step ─────────────────────────────────────────────────────────
  if (step === "checkout") {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-xl border-0 gap-0 p-0 overflow-hidden bg-white">
          <ModalHeader
            gradient="bg-gradient-to-br from-violet-600 via-violet-500 to-purple-600"
            icon={<CreditCard className="w-6 h-6 text-white" />}
            title="Activate Your Subscription"
            subtitle="Enter your payment details to get started"
          />

          <div className="overflow-y-auto" style={{ maxHeight: "calc(90vh - 108px)" }}>
            {checkoutError ? (
              <div className="p-6 space-y-4">
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-[#e11d48]" />
                  <AlertDescription className="text-red-800">{checkoutError}</AlertDescription>
                </Alert>
                <Button
                  variant="outline"
                  onClick={() => {
                    setStep("select");
                    setCheckoutError(null);
                    activateSubscription.reset();
                  }}
                  className="w-full border-slate-200 hover:bg-slate-50"
                >
                  <ChevronLeft className="w-4 h-4 mr-1.5" />
                  Back to Plans
                </Button>
              </div>
            ) : !checkoutClientSecret ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Loader2 className="w-7 h-7 animate-spin text-violet-600" />
                <p className="text-sm text-slate-400">Preparing secure checkout…</p>
              </div>
            ) : (
              <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={{ clientSecret: checkoutClientSecret }}
              >
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // ── Success step ──────────────────────────────────────────────────────────
  if (step === "success" && preview) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-sm border-0 gap-0 p-0 overflow-hidden bg-white">
          <div className="relative bg-gradient-to-br from-emerald-500 via-emerald-400 to-teal-500 px-6 pt-10 pb-10 text-center">
            <div
              className="absolute inset-0 opacity-20"
              style={{ backgroundImage: `url('${GRID_BG}')` }}
            />
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-white/25 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-900/20">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <DialogTitle className="text-2xl font-bold text-white">
                Plan {preview.change_type === "upgrade" ? "Upgraded" : "Changed"}!
              </DialogTitle>
              <DialogDescription className="text-emerald-100 text-sm mt-2 leading-relaxed">
                You're now on the{" "}
                <span className="font-semibold text-white">{preview.new_plan.name}</span> plan.
                Changes are effective immediately.
              </DialogDescription>
            </div>
          </div>

          <div className="p-5">
            <Button
              onClick={handleClose}
              className="w-full h-10 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white shadow-md shadow-violet-500/20 font-semibold"
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // ── Preview step ──────────────────────────────────────────────────────────
  if (step === "preview" && preview) {
    const isUpgrade = preview.change_type === "upgrade";
    const currency = preview.currency || "usd";

    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg border-0 gap-0 p-0 overflow-hidden bg-white">
          <ModalHeader
            gradient={
              isUpgrade
                ? "bg-gradient-to-br from-violet-600 via-violet-500 to-purple-600"
                : "bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600"
            }
            icon={
              isUpgrade
                ? <TrendingUp className="w-6 h-6 text-white" />
                : <TrendingDown className="w-6 h-6 text-white" />
            }
            title={`Review Plan ${isUpgrade ? "Upgrade" : "Downgrade"}`}
            subtitle="Review the billing details before confirming"
            subtitleClass={isUpgrade ? "text-violet-100" : "text-amber-100"}
          />

          <div className="p-6 space-y-5">
            {/* Plan transition */}
            <div className="flex items-center gap-3">
              <div className="flex-1 p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2">
                  Current
                </p>
                <p className="font-semibold text-slate-900 text-sm">{preview.current_plan.name}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {formatAmount(resolvePlanAmount(preview.current_plan), currency)}/
                  {preview.current_plan.interval}
                </p>
              </div>

              <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center ${isUpgrade ? "bg-violet-100" : "bg-amber-100"
                    }`}
                >
                  <ArrowRight
                    className={`w-3.5 h-3.5 ${isUpgrade ? "text-violet-600" : "text-amber-600"}`}
                  />
                </div>
                <Badge
                  className={`text-[10px] px-1.5 py-0 border ${isUpgrade
                      ? "bg-violet-100 text-violet-700 border-violet-200"
                      : "bg-amber-100 text-amber-700 border-amber-200"
                    }`}
                >
                  {isUpgrade ? "Upgrade" : "Downgrade"}
                </Badge>
              </div>

              <div
                className={`flex-1 p-4 rounded-xl border-2 text-center ${isUpgrade
                    ? "bg-violet-50/50 border-violet-200"
                    : "bg-amber-50/50 border-amber-200"
                  }`}
              >
                <p
                  className={`text-[10px] font-semibold uppercase tracking-widest mb-2 ${isUpgrade ? "text-violet-400" : "text-amber-400"
                    }`}
                >
                  New
                </p>
                <p
                  className={`font-semibold text-sm ${isUpgrade ? "text-violet-900" : "text-amber-900"
                    }`}
                >
                  {preview.new_plan.name}
                </p>
                <p
                  className={`text-xs mt-1 ${isUpgrade ? "text-violet-600" : "text-amber-600"
                    }`}
                >
                  {formatAmount(resolvePlanAmount(preview.new_plan), currency)}/
                  {preview.new_plan.interval}
                </p>
              </div>
            </div>

            {/* Billing summary */}
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Billing Summary
                </p>
              </div>
              <div className="px-4 py-4 space-y-3 bg-white">
                {preview.immediate_charge !== 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                      {preview.immediate_charge > 0
                        ? "Charged today (proration)"
                        : "Credit applied to account"}
                    </span>
                    <span
                      className={`text-sm font-semibold ${preview.immediate_charge > 0 ? "text-slate-900" : "text-emerald-600"
                        }`}
                    >
                      {preview.immediate_charge < 0 ? "−" : ""}
                      {formatAmount(preview.immediate_charge, currency)}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-sm font-semibold text-slate-700">Next invoice total</span>
                  <span className="text-base font-bold text-slate-900">
                    {formatAmount(preview.next_invoice_amount, currency)}
                  </span>
                </div>
              </div>
            </div>

            {/* Downgrade note */}
            {!isUpgrade && (
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-700">
                  Downgrading takes effect immediately. Any unused credit will be applied to your
                  next invoice.
                </p>
              </div>
            )}

            {changePlan.isError && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-[#e11d48]" />
                <AlertDescription className="text-red-800">
                  {changePlan.error?.message || "Failed to change plan. Please try again."}
                </AlertDescription>
              </Alert>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <Button
                variant="outline"
                onClick={() => {
                  setStep("select");
                  setPreview(null);
                  setSelectedPlanId(null);
                  setPlanError(null);
                  changePlan.reset();
                  previewPlanChange.reset();
                }}
                disabled={changePlan.isPending}
                className="flex-1 border-slate-200 hover:bg-slate-50"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <Button
                onClick={handleConfirmChange}
                disabled={changePlan.isPending}
                className={`flex-1 text-white font-semibold shadow-md ${isUpgrade
                    ? "bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 shadow-violet-500/25"
                    : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-amber-500/25"
                  }`}
              >
                {changePlan.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Confirming…
                  </>
                ) : (
                  `Confirm ${isUpgrade ? "Upgrade" : "Downgrade"}`
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // ── Select step ───────────────────────────────────────────────────────────
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-3xl border-0 gap-0 p-0 overflow-hidden bg-white flex flex-col max-h-[90vh]">
        {/* Gradient header */}
        <ModalHeader
          gradient="bg-gradient-to-br from-violet-600 via-violet-500 to-purple-600"
          icon={message.icon}
          title={message.title}
          subtitle={message.subtitle}
        />

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 min-h-0">
          {/* Billing interval toggle */}
          {showToggle && (
            <div className="flex justify-center pt-5 px-6">
              <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 gap-0.5">
                <button
                  onClick={() => { setBillingInterval("month"); setSelectedPlanId(null); }}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${billingInterval === "month"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                    }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => { setBillingInterval("year"); setSelectedPlanId(null); }}
                  className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${billingInterval === "year"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                    }`}
                >
                  Yearly
                  {yearlySavings && (
                    <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700">
                      Save {yearlySavings}%
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}

          {planError && (
            <div className="px-6 pt-4">
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-[#e11d48]" />
                <AlertDescription className="text-red-800">{planError}</AlertDescription>
              </Alert>
            </div>
          )}

          {/* Plan cards */}
          {plansLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
              <p className="text-sm text-slate-400">Loading plans…</p>
            </div>
          ) : filteredPlans.length > 0 ? (
            <div className="grid grid-cols-3 gap-5 p-6">
              {filteredPlans.map((plan: any) => {
                const isPopular = plan.nickname?.toLowerCase().includes("pro");
                const price = (plan.unit_amount ?? 0);
                const isYearly = plan.interval === "year";
                const perMonthPrice = isYearly ? (price / 12).toFixed(2) : null;
                const isLoading = isPreviewing && selectedPlanId === plan.id;
                const isSelected = selectedPlanId === plan.id;

                return (
                  <div
                    key={plan.id}
                    onClick={() => !isPreviewing && handlePlanClick(plan)}
                    className={`group relative rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col min-h-[320px] ${isPreviewing && !isSelected
                        ? "opacity-40 cursor-not-allowed"
                        : "cursor-pointer"
                      } ${isSelected
                        ? "border-violet-400 ring-2 ring-violet-500/20 shadow-xl shadow-violet-500/15 bg-violet-50/30 -translate-y-1 scale-[1.02]"
                        : isPopular
                          ? "border-violet-200 shadow-md shadow-violet-500/5 hover:shadow-xl hover:shadow-violet-500/15 hover:border-violet-400 hover:-translate-y-1.5 hover:scale-[1.02] bg-white"
                          : "border-slate-200 bg-white hover:border-violet-300 hover:shadow-lg hover:shadow-violet-500/10 hover:-translate-y-1 hover:scale-[1.01]"
                      }`}
                  >
                    {/* Subtle background glow on hover */}
                    {!isSelected && (
                      <div className="absolute inset-0 bg-gradient-to-b from-violet-50/0 to-violet-50/0 group-hover:from-violet-50/40 group-hover:to-purple-50/20 transition-all duration-300 pointer-events-none rounded-2xl" />
                    )}

                    {/* Top accent stripe */}
                    <div
                      className={`h-1.5 flex-shrink-0 transition-all duration-300 ${isSelected
                          ? "bg-gradient-to-r from-violet-500 to-purple-400"
                          : isPopular
                            ? "bg-gradient-to-r from-violet-400/80 to-purple-300/80 group-hover:from-violet-500 group-hover:to-purple-400"
                            : "bg-slate-100 group-hover:bg-gradient-to-r group-hover:from-violet-300/70 group-hover:to-purple-200/70"
                        }`}
                    />

                    <div className="relative p-6 flex flex-col flex-1">
                      {/* Card header row */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="min-w-0">
                          <h3 className="text-2xl font-bold text-slate-900 truncate">
                            {plan.plan_title || plan.nickname}
                          </h3>
                          {plan.description && (
                            <p className="text-xs text-slate-400 mt-1 leading-snug">
                              {plan.description}
                            </p>
                          )}
                        </div>
                        {isPopular && (
                          <Badge className="ml-2 flex-shrink-0 bg-violet-100 text-violet-700 border-violet-200 text-[10px] font-semibold px-2 py-0.5 group-hover:bg-violet-200 transition-colors duration-200">
                            Popular
                          </Badge>
                        )}
                      </div>

                      {/* Price */}
                      <div className="mb-5">
                        {isYearly && perMonthPrice ? (
                          <>
                            <div className="flex items-baseline gap-1">
                              <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
                                ${perMonthPrice}
                              </span>
                              <span className="text-slate-500 text-sm">/mo</span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1.5">
                              Billed annually · ${price}/year
                            </p>
                          </>
                        ) : (
                          <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
                              ${price}
                            </span>
                            <span className="text-slate-500 text-sm">/month</span>
                          </div>
                        )}
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-slate-100 mb-4 group-hover:bg-violet-100/60 transition-colors duration-300" />

                      {/* Features — flex-1 pushes CTA to bottom */}
                      <div className="flex-1">
                        {plan.features && plan.features.length > 0 && (
                          <ul className="space-y-3">
                            {plan.features.map((feature: any, index: number) => (
                              <li key={index} className="flex items-start gap-2.5 text-sm text-slate-600 leading-snug">
                                <div className="w-4 h-4 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-violet-200 transition-colors duration-200">
                                  <Check className="w-2.5 h-2.5 text-violet-600 stroke-[3]" />
                                </div>
                                {typeof feature === "string" ? feature : feature.name || feature.description}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {/* CTA button */}
                      <div className="mt-6">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isPreviewing) handlePlanClick(plan);
                          }}
                          disabled={isPreviewing}
                          className={`w-full h-11 font-semibold text-white transition-all duration-200 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 shadow-md shadow-violet-500/25 group-hover:shadow-lg group-hover:shadow-violet-500/35 ${isSelected ? "from-violet-600 to-purple-600" : ""
                            }`}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Loading…
                            </>
                          ) : (
                            <>
                              Select Plan
                              <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-0.5" />
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="px-6 py-8">
              <Alert className="border-slate-200 bg-slate-50">
                <AlertCircle className="h-4 w-4 text-slate-400" />
                <AlertDescription className="text-slate-500">
                  No plans available at the moment. Please contact support.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50">
            <p className="text-xs text-slate-400 text-center">
              Need help choosing?{" "}
              <a
                href="mailto:support@reactiq360.com"
                className="text-violet-600 hover:text-violet-700 font-medium hover:underline"
              >
                Contact our sales team
              </a>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
