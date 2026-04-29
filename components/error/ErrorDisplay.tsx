"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, WifiOff, ServerCrash, Shield, Clock } from "lucide-react";

export type ErrorType =
  | "network"
  | "server"
  | "auth"
  | "subscription"
  | "timeout"
  | "unknown";

interface ErrorDisplayProps {
  error: Error | unknown;
  type?: ErrorType;
  onRetry?: () => void;
  showRetry?: boolean;
  title?: string;
  message?: string;
}

/**
 * User-friendly error display component
 * Automatically detects error type and shows appropriate message
 */
export function ErrorDisplay({
  error,
  type,
  onRetry,
  showRetry = true,
  title,
  message,
}: ErrorDisplayProps) {
  const errorDetails = getErrorDetails(error, type);

  return (
    <Alert className={`${errorDetails.colorClass} border-2`}>
      {errorDetails.icon}
      <AlertDescription>
        <div className="space-y-3">
          <div>
            <h3 className={`font-semibold ${errorDetails.textClass} text-base mb-1`}>
              {title || errorDetails.title}
            </h3>
            <p className={`${errorDetails.textClass} text-sm`}>
              {message || errorDetails.message}
            </p>
          </div>

          {showRetry && onRetry && (
            <Button
              onClick={onRetry}
              variant="outline"
              size="sm"
              className={`${errorDetails.buttonClass}`}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}

/**
 * Compact inline error display
 */
export function InlineError({ error, onRetry }: { error: Error | unknown; onRetry?: () => void }) {
  const errorMessage = error instanceof Error ? error.message : "An error occurred";

  return (
    <div className="flex items-center gap-2 text-sm text-[#e11d48]">
      <AlertCircle className="w-4 h-4" />
      <span>{errorMessage}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-red-700 hover:text-red-800 underline ml-2"
        >
          Retry
        </button>
      )}
    </div>
  );
}

/**
 * Get user-friendly error details based on error type
 */
function getErrorDetails(error: Error | unknown, type?: ErrorType) {
  const errorMessage = error instanceof Error ? error.message.toLowerCase() : "";

  // Auto-detect error type if not provided
  if (!type) {
    if (errorMessage.includes("network") || errorMessage.includes("fetch")) {
      type = "network";
    } else if (errorMessage.includes("unauthorized") || errorMessage.includes("401")) {
      type = "auth";
    } else if (errorMessage.includes("subscription") || errorMessage.includes("403")) {
      type = "subscription";
    } else if (errorMessage.includes("timeout") || errorMessage.includes("timed out")) {
      type = "timeout";
    } else if (errorMessage.includes("500") || errorMessage.includes("server")) {
      type = "server";
    } else {
      type = "unknown";
    }
  }

  switch (type) {
    case "network":
      return {
        icon: <WifiOff className="h-5 w-5 text-amber-600" />,
        title: "Connection Issue",
        message: "Unable to connect to the server. Please check your internet connection and try again.",
        colorClass: "border-amber-200 bg-amber-50",
        textClass: "text-amber-900",
        buttonClass: "border-amber-300 text-amber-700 hover:bg-amber-100",
      };

    case "server":
      return {
        icon: <ServerCrash className="h-5 w-5 text-[#e11d48]" />,
        title: "Server Error",
        message: "Our servers are experiencing issues. We're working to fix this. Please try again in a few moments.",
        colorClass: "border-red-200 bg-red-50",
        textClass: "text-red-900",
        buttonClass: "border-red-300 text-red-700 hover:bg-red-100",
      };

    case "auth":
      return {
        icon: <Shield className="h-5 w-5 text-[#e11d48]" />,
        title: "Authentication Required",
        message: "Your session has expired. Please refresh the page to log in again.",
        colorClass: "border-red-200 bg-red-50",
        textClass: "text-red-900",
        buttonClass: "border-red-300 text-red-700 hover:bg-red-100",
      };

    case "subscription":
      return {
        icon: <Shield className="h-5 w-5 text-amber-600" />,
        title: "Subscription Required",
        message: "This feature requires an active subscription. Please upgrade your plan to continue.",
        colorClass: "border-amber-200 bg-amber-50",
        textClass: "text-amber-900",
        buttonClass: "border-amber-300 text-amber-700 hover:bg-amber-100",
      };

    case "timeout":
      return {
        icon: <Clock className="h-5 w-5 text-amber-600" />,
        title: "Request Timeout",
        message: "The request took too long to complete. Please try again.",
        colorClass: "border-amber-200 bg-amber-50",
        textClass: "text-amber-900",
        buttonClass: "border-amber-300 text-amber-700 hover:bg-amber-100",
      };

    default:
      return {
        icon: <AlertCircle className="h-5 w-5 text-slate-600" />,
        title: "Something went wrong",
        message: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
        colorClass: "border-slate-200 bg-slate-50",
        textClass: "text-slate-900",
        buttonClass: "border-slate-300 text-slate-700 hover:bg-slate-100",
      };
  }
}
