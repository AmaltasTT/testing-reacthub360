"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "./GlassCard";
import {
  CreditCard,
  Download,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Loader2,
  RefreshCw,
  MapPin,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/hooks/use-user";
import { useAuth } from "@/contexts/auth-context";
import { useQueryClient } from "@tanstack/react-query";
import {
  usePaymentMethod,
  useInvoices,
  useSubscriptionDetails,
  useBillingAddress,
  useCreateSetupIntent,
  useUpdatePaymentMethod,
  useCancelSubscription,
  useReactivateSubscription,
  useRetryPayment,
  useUpdateBillingAddress,
} from "@/hooks/use-billing";
import { StripeProvider } from "@/components/billing/StripeProvider";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "sonner";
import { UpgradeModal } from "@/components/subscription/UpgradeModal";
import type { BillingAddress } from "@/hooks/use-billing";

// --- Status badge helper ---

function SubscriptionStatusBadge({ status, cancelAtPeriodEnd }: { status: string; cancelAtPeriodEnd?: boolean }) {
  if (cancelAtPeriodEnd) {
    return (
      <Badge className="bg-amber-100 text-amber-700 border-amber-200">
        <Clock className="w-3 h-3 mr-1" />
        Cancelling
      </Badge>
    );
  }

  switch (status) {
    case "active":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Active
        </Badge>
      );
    case "trialing":
      return (
        <Badge className="bg-blue-100 text-blue-700 border-blue-200">
          <Clock className="w-3 h-3 mr-1" />
          Trial
        </Badge>
      );
    case "past_due":
      return (
        <Badge className="bg-red-100 text-red-700 border-red-200">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Past Due
        </Badge>
      );
    case "canceled":
      return (
        <Badge className="bg-slate-100 text-slate-700 border-slate-200">
          <XCircle className="w-3 h-3 mr-1" />
          Canceled
        </Badge>
      );
    case "unpaid":
      return (
        <Badge className="bg-red-100 text-red-700 border-red-200">
          <AlertCircle className="w-3 h-3 mr-1" />
          Unpaid
        </Badge>
      );
    default:
      return (
        <Badge className="bg-slate-100 text-slate-600 border-slate-200">
          {status}
        </Badge>
      );
  }
}

// --- Stripe Card Form (rendered inside Elements) ---

function CardForm({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const updatePaymentMethod = useUpdatePaymentMethod();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    try {
      const { error, setupIntent } = await stripe.confirmSetup({
        elements,
        redirect: "if_required",
      });

      if (error) {
        toast.error(error.message || "Failed to confirm card");
        return;
      }

      if (setupIntent?.payment_method) {
        await updatePaymentMethod.mutateAsync(
          typeof setupIntent.payment_method === "string"
            ? setupIntent.payment_method
            : setupIntent.payment_method.id
        );
        toast.success("Payment method updated successfully");
        onSuccess();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update payment method");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="px-6 py-6">
        <PaymentElement />
      </div>
      <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
          className="border-slate-300 hover:bg-slate-100"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!stripe || isProcessing}
          className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white shadow-lg shadow-violet-500/30"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            "Update Card"
          )}
        </Button>
      </div>
    </form>
  );
}

// --- Invoice status badge ---

function InvoiceStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "paid":
      return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Paid</Badge>;
    case "open":
      return <Badge className="bg-amber-100 text-amber-700 border-amber-200">Open</Badge>;
    case "void":
      return <Badge className="bg-slate-100 text-slate-600 border-slate-200">Void</Badge>;
    case "draft":
      return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Draft</Badge>;
    case "uncollectible":
      return <Badge className="bg-red-100 text-red-700 border-red-200">Uncollectible</Badge>;
    default:
      return <Badge className="bg-slate-100 text-slate-600 border-slate-200">{status}</Badge>;
  }
}

// --- Card brand display ---

function cardBrandDisplay(brand: string) {
  const brands: Record<string, string> = {
    visa: "Visa",
    mastercard: "Mastercard",
    amex: "Amex",
    discover: "Discover",
    diners: "Diners Club",
    jcb: "JCB",
    unionpay: "UnionPay",
  };
  return brands[brand?.toLowerCase()] || brand || "Card";
}

// --- Format helpers ---

function formatUnixDate(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatCents(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

// --- Main Component ---

export function BillingTab() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const { data: user, isLoading: userLoading } = useUser();
  const userStatus = (user?._subscription?.status || "").toLowerCase();
  const isTrialUser = userStatus === "trial" || userStatus === "trialing";
  const { data: subscription, isLoading: subLoading, error: subError } = useSubscriptionDetails({
    enabled: !userLoading && !isTrialUser,
  });
  const { data: paymentMethod, isLoading: pmLoading } = usePaymentMethod();
  const { data: billingAddress, isLoading: addrLoading } = useBillingAddress();
  const { data: invoicesData, isLoading: invLoading } = useInvoices();

  // Load more invoices state
  const [loadedInvoices, setLoadedInvoices] = useState<any[]>([]);
  const [lastInvoiceId, setLastInvoiceId] = useState<string | undefined>();
  const [downloadingInvoiceId, setDownloadingInvoiceId] = useState<string | null>(null);
  const { data: moreInvoicesData, isFetching: loadingMore } = useInvoices(lastInvoiceId);

  // Modals
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Cancel form
  const [cancelReason, setCancelReason] = useState("");
  const [cancelFeedback, setCancelFeedback] = useState("");

  // Address form
  const [addressForm, setAddressForm] = useState<BillingAddress>({
    name: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
  });

  // Stripe setup intent
  const createSetupIntent = useCreateSetupIntent();
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // Detect return from Stripe checkout and show success toast
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout_success") === "true") {
      window.history.replaceState({}, "", window.location.pathname);
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      queryClient.invalidateQueries({ queryKey: ["billing", "subscription"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Subscription activated! Your plan is now active.");
    }
  }, [queryClient]);

  // Mutations
  const cancelSubscription = useCancelSubscription();
  const reactivateSubscription = useReactivateSubscription();
  const retryPayment = useRetryPayment();
  const updateBillingAddress = useUpdateBillingAddress();

  // Fallback to user subscription if billing API hasn't loaded
  const userSubscription = user?._subscription;
  const userPlan = userSubscription?._plan;

  const handleOpenPaymentModal = async () => {
    try {
      const result = await createSetupIntent.mutateAsync();
      setClientSecret(result.client_secret);
      setShowPaymentModal(true);
    } catch (err: any) {
      toast.error(err.message || "Failed to initialize payment form");
    }
  };

  const handleCancelSubscription = async () => {
    try {
      await cancelSubscription.mutateAsync({
        reason: cancelReason || undefined,
        feedback: cancelFeedback || undefined,
      });
      toast.success("Subscription will be cancelled at the end of the billing period");
      setShowCancelDialog(false);
      setCancelReason("");
      setCancelFeedback("");
    } catch (err: any) {
      toast.error(err.message || "Failed to cancel subscription");
    }
  };

  const handleReactivate = async () => {
    try {
      await reactivateSubscription.mutateAsync();
      toast.success("Subscription reactivated successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to reactivate subscription");
    }
  };

  const handleRetryPayment = async () => {
    try {
      await retryPayment.mutateAsync();
      toast.success("Payment retried successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to retry payment");
    }
  };

  const handleOpenAddressModal = () => {
    if (billingAddress) {
      setAddressForm({ ...billingAddress });
    }
    setShowAddressModal(true);
  };

  const handleSaveAddress = async () => {
    try {
      await updateBillingAddress.mutateAsync(addressForm);
      toast.success("Billing address updated");
      setShowAddressModal(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to update address");
    }
  };

  const handleDownloadInvoice = async (invoice: any) => {
    // Try the direct URL from the list response first (covers pdf_url and Stripe's invoice_pdf)
    const directUrl = invoice.pdf_url || invoice.invoice_pdf;
    if (directUrl) {
      window.open(directUrl, "_blank");
      return;
    }

    // Fall back to the dedicated PDF endpoint
    setDownloadingInvoiceId(invoice.id);
    try {
      const res = await fetch(`/api/billing/invoice-pdf/${invoice.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch PDF");
      const data = await res.json();
      const url = data.pdf_url || data.url || data.invoice_pdf;
      if (url) {
        window.open(url, "_blank");
      } else {
        toast.error("PDF not available for this invoice");
      }
    } catch {
      toast.error("Failed to download invoice");
    } finally {
      setDownloadingInvoiceId(null);
    }
  };

  const handleLoadMore = () => {
    const allInvoices = [...loadedInvoices, ...(invoicesData?.invoices || [])];
    const lastId = allInvoices[allInvoices.length - 1]?.id;
    if (lastId) {
      setLoadedInvoices(allInvoices);
      setLastInvoiceId(lastId);
    }
  };

  // Combine all invoices for display
  const allInvoices = lastInvoiceId
    ? [...loadedInvoices, ...(moreInvoicesData?.invoices || [])]
    : invoicesData?.invoices || [];
  const hasMore = lastInvoiceId
    ? moreInvoicesData?.has_more
    : invoicesData?.has_more;

  // Determine plan display info
  const planName = subscription?.plan?.name || userPlan?.plan_title || "Free Trial";
  const planAmount = subscription?.plan?.amount != null
    ? formatCents(subscription.plan.amount)
    : userPlan
      ? `$${(userPlan.unit_amount).toFixed(2)}`
      : "$0";
  const planInterval = subscription?.plan?.interval || userPlan?.interval || "month";
  const subStatus = subscription?.status || userSubscription?.status || "active";
  const cancelAtPeriodEnd = subscription?.cancel_at_period_end || false;
  const nextBillingDate = subscription?.current_period_end
    ? formatUnixDate(subscription.current_period_end)
    : userSubscription?.plan_expiry
      ? new Date(userSubscription.plan_expiry).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      : "N/A";

  return (
    <div className="px-8 pb-12">
      <div className="space-y-8">
        {/* Past Due Warning Banner */}
        {subStatus === "past_due" && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
            <AlertTriangle className="w-5 h-5 text-[#e11d48] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="text-red-900 font-medium mb-1">Payment Failed</div>
              <p className="text-sm text-red-700 mb-3">
                Your last payment was unsuccessful. Please update your payment method or retry the payment to avoid service interruption.
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleRetryPayment}
                  disabled={retryPayment.isPending}
                  className="text-[#e11d48] hover:bg-red-700 text-white"
                >
                  {retryPayment.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  Retry Payment
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleOpenPaymentModal}
                  disabled={createSetupIntent.isPending}
                  className="border-red-200 text-red-700"
                >
                  Update Card
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Current Plan */}
        <div className="relative rounded-xl overflow-hidden bg-slate-50/40 border border-slate-200/40">
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400 via-cyan-300 to-transparent" />
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-cyan-400/10 to-transparent" />

          <div className="relative p-8">
            {subLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-9 w-32" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-4 w-56" />
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wider text-slate-400 mb-3 font-light">
                    Current Plan
                  </div>
                  <h3 className="text-slate-900 mb-2 font-semibold text-xl">
                    {planName} Plan
                  </h3>
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-3xl text-slate-900 font-bold">{planAmount}</span>
                    <span className="text-slate-600">per {planInterval}</span>
                  </div>
                  <div className="mb-4">
                    <SubscriptionStatusBadge status={subStatus} cancelAtPeriodEnd={cancelAtPeriodEnd} />
                  </div>
                  {cancelAtPeriodEnd && subscription?.cancel_at ? (
                    <p className="text-sm text-amber-700">
                      Access until:{" "}
                      <span className="font-medium">{formatUnixDate(subscription.cancel_at)}</span>
                    </p>
                  ) : (
                    <p className="text-sm text-slate-600">
                      Next billing date:{" "}
                      <span className="text-slate-900 font-medium">{nextBillingDate}</span>
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="border-violet-200 text-violet-700 hover:bg-violet-50"
                    onClick={() => setShowUpgradeModal(true)}
                  >
                    Change Plan
                  </Button>
                  {cancelAtPeriodEnd ? (
                    <Button
                      variant="outline"
                      className="text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                      onClick={handleReactivate}
                      disabled={reactivateSubscription.isPending}
                    >
                      {reactivateSubscription.isPending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : null}
                      Reactivate
                    </Button>
                  ) : subStatus !== "canceled" ? (
                    <Button
                      variant="outline"
                      className="text-slate-600 hover:bg-slate-50"
                      onClick={() => setShowCancelDialog(true)}
                    >
                      Cancel Plan
                    </Button>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Method */}
          <GlassCard className="p-6 flex flex-col justify-between">
            <h3 className="text-slate-900 mb-6 font-semibold">Payment Method</h3>
            {pmLoading ? (
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-14 h-10 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </div>
            ) : paymentMethod ? (
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-400 flex items-center justify-center text-white">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-slate-900 font-medium">
                    {cardBrandDisplay(paymentMethod.brand)} ---- {paymentMethod.last4}
                  </div>
                  <div className="text-sm text-slate-600">
                    Expires {paymentMethod.exp_month}/{paymentMethod.exp_year}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 mb-6 text-slate-500">
                <CreditCard className="w-5 h-5" />
                <span className="text-sm">No payment method on file</span>
              </div>
            )}
            <Button
              variant="outline"
              onClick={handleOpenPaymentModal}
              disabled={createSetupIntent.isPending}
              className="w-full"
            >
              {createSetupIntent.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              {paymentMethod ? "Update Payment Method" : "Add Payment Method"}
            </Button>
          </GlassCard>

          {/* Billing Address */}
          <GlassCard className="p-6 flex flex-col justify-between">
            <h3 className="text-slate-900 mb-6 font-semibold">Billing Address</h3>
            {addrLoading ? (
              <div className="space-y-2 mb-6">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            ) : billingAddress && billingAddress.line1 ? (
              <div className="space-y-1 text-slate-600 mb-6">
                {billingAddress.name && <p className="text-slate-900 font-medium">{billingAddress.name}</p>}
                <p>{billingAddress.line1}</p>
                {billingAddress.line2 && <p>{billingAddress.line2}</p>}
                <p>
                  {billingAddress.city}
                  {billingAddress.state ? `, ${billingAddress.state}` : ""}{" "}
                  {billingAddress.postal_code}
                </p>
                <p>{billingAddress.country}</p>
              </div>
            ) : (
              <div className="flex items-center gap-3 mb-6 text-slate-500">
                <MapPin className="w-5 h-5" />
                <span className="text-sm">No billing address set</span>
              </div>
            )}
            <Button variant="outline" className="w-full" onClick={handleOpenAddressModal}>
              {billingAddress?.line1 ? "Update Address" : "Add Address"}
            </Button>
          </GlassCard>
        </div>

        {/* Billing History */}
        <GlassCard className="overflow-hidden">
          <div className="p-6 border-b border-slate-200/50">
            <h3 className="text-slate-900 font-semibold">Billing History</h3>
          </div>
          {invLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-14" />
                </div>
              ))}
            </div>
          ) : allInvoices.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <p>No invoices yet</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200/50">
                      <th className="text-left px-6 py-4 text-slate-700 text-sm">Invoice</th>
                      <th className="text-left px-6 py-4 text-slate-700 text-sm">Date</th>
                      <th className="text-left px-6 py-4 text-slate-700 text-sm">Amount</th>
                      <th className="text-left px-6 py-4 text-slate-700 text-sm">Status</th>
                      <th className="px-6 py-4 text-slate-700 text-sm w-16"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {allInvoices.map((invoice) => (
                      <tr
                        key={invoice.id}
                        className="border-b border-slate-200/30 hover:bg-violet-50/30 transition-colors"
                      >
                        <td className="px-6 py-4 text-slate-900">
                          {invoice.number || invoice.id}
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {formatUnixDate(invoice.date)}
                        </td>
                        <td className="px-6 py-4 text-slate-900 font-medium">
                          {formatCents(invoice.amount_due)}
                        </td>
                        <td className="px-6 py-4">
                          <InvoiceStatusBadge status={invoice.status} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end">
                            <button
                              onClick={() => handleDownloadInvoice(invoice)}
                              disabled={downloadingInvoiceId === invoice.id}
                              title="Download invoice PDF"
                              className="w-8 h-8 flex items-center justify-center rounded-lg text-violet-600 hover:text-violet-700 hover:bg-violet-50 transition-colors disabled:opacity-40"
                            >
                              {downloadingInvoiceId === invoice.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Download className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {hasMore && (
                <div className="p-4 text-center border-t border-slate-200/50">
                  <Button
                    variant="ghost"
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="text-violet-600"
                  >
                    {loadingMore ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : null}
                    Load More
                  </Button>
                </div>
              )}
            </>
          )}
        </GlassCard>

        {/* Help Banner */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-cyan-50 border border-cyan-200">
          <AlertCircle className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-cyan-900 font-medium mb-1">Need help with billing?</div>
            <p className="text-sm text-cyan-700">
              Contact our support team at{" "}
              <a href="mailto:billing@reactiq360.com" className="underline">
                billing@reactiq360.com
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* ── Payment Method Modal ── */}
      <Dialog
        open={showPaymentModal}
        onOpenChange={(open) => {
          if (!open) {
            setShowPaymentModal(false);
            setClientSecret(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md border-0 gap-0 p-0 overflow-hidden">
          {/* Gradient header */}
          <div className="relative bg-gradient-to-br from-violet-500 via-purple-500 to-violet-600 px-6 pt-8 pb-6">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
            <div className="relative flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg flex-shrink-0">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-white">
                  {paymentMethod ? "Update Payment Method" : "Add Payment Method"}
                </DialogTitle>
                <p className="text-violet-100 text-sm mt-0.5">
                  Your payment info is encrypted and secure
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white">
            {clientSecret ? (
              <StripeProvider clientSecret={clientSecret}>
                <CardForm
                  onSuccess={() => {
                    setShowPaymentModal(false);
                    setClientSecret(null);
                  }}
                  onCancel={() => {
                    setShowPaymentModal(false);
                    setClientSecret(null);
                  }}
                />
              </StripeProvider>
            ) : (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-violet-600" />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Cancel Subscription Dialog ── */}
      <Dialog
        open={showCancelDialog}
        onOpenChange={(open) => {
          if (!open) {
            setShowCancelDialog(false);
            setCancelReason("");
            setCancelFeedback("");
          }
        }}
      >
        <DialogContent className="sm:max-w-lg border-0 gap-0 p-0 overflow-hidden">
          {/* Red gradient header */}
          <div className="relative bg-gradient-to-br from-red-500 via-rose-500 to-red-600 px-6 pt-8 pb-6">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
            <div className="relative flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-white">
                  Cancel Subscription
                </DialogTitle>
                <p className="text-red-100 text-sm mt-0.5">
                  This takes effect at the end of your billing period
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6 bg-white space-y-5">
            {/* Warning notice */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-amber-900 mb-1">Before you go</p>
                <p className="text-amber-700">
                  Your subscription will remain active until{" "}
                  <span className="font-semibold">{nextBillingDate}</span>.
                  After that, you will lose access to premium features.
                </p>
              </div>
            </div>

            {/* Reason select */}
            <div>
              <Label className="text-sm font-semibold text-slate-700 mb-2 block">
                Reason for cancellation{" "}
                <span className="text-slate-400 font-normal">(optional)</span>
              </Label>
              <Select value={cancelReason} onValueChange={setCancelReason}>
                <SelectTrigger className="h-11 border-slate-200 focus:ring-violet-500/20">
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent position="item-aligned" className="bg-white">
                  <SelectItem value="too_expensive">Too expensive</SelectItem>
                  <SelectItem value="missing_features">Missing features</SelectItem>
                  <SelectItem value="switched_service">Switched to another service</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Feedback textarea */}
            <div>
              <Label className="text-sm font-semibold text-slate-700 mb-2 block">
                Additional feedback{" "}
                <span className="text-slate-400 font-normal">(optional)</span>
              </Label>
              <Textarea
                placeholder="Tell us how we can improve..."
                value={cancelFeedback}
                onChange={(e) => setCancelFeedback(e.target.value)}
                rows={3}
                className="border-slate-200 resize-none focus:ring-violet-500/20"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => {
                setShowCancelDialog(false);
                setCancelReason("");
                setCancelFeedback("");
              }}
              className="border-slate-300 hover:bg-slate-100"
            >
              Keep Subscription
            </Button>
            <Button
              onClick={handleCancelSubscription}
              disabled={cancelSubscription.isPending}
              className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white shadow-lg shadow-red-500/30"
            >
              {cancelSubscription.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Cancel Subscription"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Billing Address Modal ── */}
      <Dialog open={showAddressModal} onOpenChange={setShowAddressModal}>
        <DialogContent className="sm:max-w-md border-0 gap-0 p-0 overflow-hidden">
          {/* Gradient header */}
          <div className="relative bg-gradient-to-br from-violet-500 via-purple-500 to-violet-600 px-6 pt-8 pb-6">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
            <div className="relative flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg flex-shrink-0">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-white">
                  Billing Address
                </DialogTitle>
                <p className="text-violet-100 text-sm mt-0.5">
                  Used for your invoices and receipts
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6 bg-white space-y-4">
            <div>
              <Label htmlFor="addr-name" className="text-sm font-semibold text-slate-700">
                Name
              </Label>
              <Input
                id="addr-name"
                className="mt-1.5 h-11 border-slate-200"
                value={addressForm.name || ""}
                onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                placeholder="Name on invoice"
              />
            </div>
            <div>
              <Label htmlFor="addr-line1" className="text-sm font-semibold text-slate-700">
                Address Line 1
              </Label>
              <Input
                id="addr-line1"
                className="mt-1.5 h-11 border-slate-200"
                value={addressForm.line1}
                onChange={(e) => setAddressForm({ ...addressForm, line1: e.target.value })}
                placeholder="Street address"
              />
            </div>
            <div>
              <Label htmlFor="addr-line2" className="text-sm font-semibold text-slate-700">
                Address Line 2{" "}
                <span className="text-slate-400 font-normal">(optional)</span>
              </Label>
              <Input
                id="addr-line2"
                className="mt-1.5 h-11 border-slate-200"
                value={addressForm.line2 || ""}
                onChange={(e) => setAddressForm({ ...addressForm, line2: e.target.value })}
                placeholder="Apt, suite, etc."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="addr-city" className="text-sm font-semibold text-slate-700">
                  City
                </Label>
                <Input
                  id="addr-city"
                  className="mt-1.5 h-11 border-slate-200"
                  value={addressForm.city}
                  onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="addr-state" className="text-sm font-semibold text-slate-700">
                  State
                </Label>
                <Input
                  id="addr-state"
                  className="mt-1.5 h-11 border-slate-200"
                  value={addressForm.state}
                  onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="addr-zip" className="text-sm font-semibold text-slate-700">
                  Postal Code
                </Label>
                <Input
                  id="addr-zip"
                  className="mt-1.5 h-11 border-slate-200"
                  value={addressForm.postal_code}
                  onChange={(e) => setAddressForm({ ...addressForm, postal_code: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="addr-country" className="text-sm font-semibold text-slate-700">
                  Country
                </Label>
                <Input
                  id="addr-country"
                  className="mt-1.5 h-11 border-slate-200"
                  value={addressForm.country}
                  onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                  placeholder="US"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => setShowAddressModal(false)}
              className="border-slate-300 hover:bg-slate-100"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveAddress}
              disabled={updateBillingAddress.isPending}
              className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white shadow-lg shadow-violet-500/30"
            >
              {updateBillingAddress.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Address"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upgrade Modal */}
      <UpgradeModal
        open={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </div>
  );
}
