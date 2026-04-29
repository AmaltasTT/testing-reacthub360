"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import { Loader2, Shield } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AdminRouteProps {
  children: React.ReactNode;
  fallbackPath?: string;
}

/**
 * Route guard component that restricts access to Admin users only.
 * Non-admin users will be redirected to the fallback path or shown an error message.
 *
 * Usage:
 * <AdminRoute>
 *   <AdminOnlyContent />
 * </AdminRoute>
 */
export function AdminRoute({ children, fallbackPath = "/" }: AdminRouteProps) {
  const router = useRouter();
  const { data: user, isLoading, error } = useUser();

  useEffect(() => {
    if (!isLoading && user && user.role !== "Admin") {
      // Redirect non-admin users
      router.push(fallbackPath);
    }
  }, [user, isLoading, router, fallbackPath]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50/40 via-violet-50/20 to-purple-50/30">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-violet-600 mx-auto mb-4" />
          <p className="text-slate-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50/40 via-violet-50/20 to-purple-50/30 p-6">
        <Alert className="max-w-md border-red-200 bg-red-50">
          <Shield className="h-5 w-5 text-[#e11d48]" />
          <AlertDescription className="text-red-800">
            <div className="font-semibold mb-1">Access Verification Failed</div>
            Unable to verify your permissions. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Not admin - show error before redirect completes
  if (user && user.role !== "Admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50/40 via-violet-50/20 to-purple-50/30 p-6">
        <Alert className="max-w-md border-amber-200 bg-amber-50">
          <Shield className="h-5 w-5 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <div className="font-semibold mb-1">Admin Access Required</div>
            You don't have permission to access this page. Redirecting...
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // User is admin, render children
  return <>{children}</>;
}

/**
 * Route guard that allows both Admin and Manager access.
 * Members will be redirected.
 */
export function ManagerRoute({ children, fallbackPath = "/" }: AdminRouteProps) {
  const router = useRouter();
  const { data: user, isLoading, error } = useUser();

  useEffect(() => {
    if (!isLoading && user && user.role === "Member") {
      router.push(fallbackPath);
    }
  }, [user, isLoading, router, fallbackPath]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50/40 via-violet-50/20 to-purple-50/30">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-violet-600 mx-auto mb-4" />
          <p className="text-slate-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50/40 via-violet-50/20 to-purple-50/30 p-6">
        <Alert className="max-w-md border-red-200 bg-red-50">
          <Shield className="h-5 w-5 text-[#e11d48]" />
          <AlertDescription className="text-red-800">
            <div className="font-semibold mb-1">Access Verification Failed</div>
            Unable to verify your permissions. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (user && user.role === "Member") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50/40 via-violet-50/20 to-purple-50/30 p-6">
        <Alert className="max-w-md border-amber-200 bg-amber-50">
          <Shield className="h-5 w-5 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <div className="font-semibold mb-1">Manager Access Required</div>
            You don't have permission to access this page. Redirecting...
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}
