"use client";

import {
  getSyncStatus,
  getRelativeTime,
  deriveAccountSyncState,
  type AccountSyncState,
  type PlatformSyncSummary,
} from "@/lib/sync-status-utils";
import type { LinkedAccount, Authentication } from "@/hooks/use-platforms";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  Loader2,
  RefreshCw,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// --- Per-account indicator (new) ----------------------------------------

interface AccountSyncBadgeProps {
  account: LinkedAccount;
  authStatus: Authentication["status"];
}

const STATE_CONFIG: Record<
  AccountSyncState,
  { color: string; dot: string; icon: React.ReactNode; label: (a: LinkedAccount) => string }
> = {
  disconnected: {
    color: "bg-slate-100 text-slate-700 border-slate-200",
    dot: "bg-slate-400",
    icon: <XCircle className="w-3.5 h-3.5" />,
    label: () => "Disconnected",
  },
  pending: {
    color: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-400",
    icon: <Clock className="w-3.5 h-3.5" />,
    label: () => "Waiting for first sync",
  },
  syncing: {
    color: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
    icon: <Loader2 className="w-3.5 h-3.5 animate-spin" />,
    label: (a) =>
      a.initial_sync_started_at
        ? `Syncing data...`
        : "Syncing data...",
  },
  synced: {
    color: "bg-green-50 text-green-700 border-green-200",
    dot: "bg-green-500",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    label: (a) =>
      a.last_synced_at ? `Last synced: ${getRelativeTime(a.last_synced_at)}` : "Synced",
  },
};

export function AccountSyncBadge({ account, authStatus }: AccountSyncBadgeProps) {
  const state = deriveAccountSyncState(account, authStatus);
  const cfg = STATE_CONFIG[state];

  return (
    <Badge
      className={`${cfg.color} px-2.5 py-1 flex items-center gap-1.5 text-xs font-medium border`}
    >
      {cfg.icon}
      <span>{cfg.label(account)}</span>
    </Badge>
  );
}

// --- Platform-level summary badge ----------------------------------------

interface PlatformSyncBadgeProps {
  summary: PlatformSyncSummary;
}

const SUMMARY_CONFIG: Record<
  PlatformSyncSummary,
  { color: string; dot: string; icon: React.ReactNode; label: string }
> = {
  not_connected: {
    color: "bg-slate-100 text-slate-600 border-slate-200",
    dot: "bg-slate-400",
    icon: <XCircle className="w-3.5 h-3.5" />,
    label: "Not connected",
  },
  disconnected: {
    color: "bg-slate-100 text-slate-600 border-slate-200",
    dot: "bg-slate-400",
    icon: <XCircle className="w-3.5 h-3.5" />,
    label: "Disconnected",
  },
  needs_reauth: {
    color: "bg-orange-50 text-orange-700 border-orange-200",
    dot: "bg-orange-500",
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
    label: "Re-auth required",
  },
  syncing: {
    color: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
    icon: <Loader2 className="w-3.5 h-3.5 animate-spin" />,
    label: "Syncing...",
  },
  pending: {
    color: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-400",
    icon: <Clock className="w-3.5 h-3.5" />,
    label: "Waiting for sync",
  },
  synced: {
    color: "bg-green-50 text-green-700 border-green-200",
    dot: "bg-green-500",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    label: "Synced",
  },
};

export function PlatformSyncBadge({ summary }: PlatformSyncBadgeProps) {
  const cfg = SUMMARY_CONFIG[summary];

  return (
    <Badge
      className={`${cfg.color} px-2.5 py-1 flex items-center gap-1.5 text-xs font-medium border`}
    >
      {cfg.icon}
      <span>{cfg.label}</span>
    </Badge>
  );
}

// --- Legacy SyncStatusIndicator (kept for backward compatibility) --------

interface SyncStatusIndicatorProps {
  lastFetchedAt: string | null | undefined;
  showLabel?: boolean;
  showIcon?: boolean;
  variant?: "default" | "compact" | "detailed";
}

export function SyncStatusIndicator({
  lastFetchedAt,
  showLabel = true,
  showIcon = true,
  variant = "default",
}: SyncStatusIndicatorProps) {
  const syncStatus = getSyncStatus(lastFetchedAt);
  const relativeTime = getRelativeTime(lastFetchedAt);

  const getIcon = () => {
    switch (syncStatus.status) {
      case "recent":
        return <CheckCircle2 className="w-4 h-4" />;
      case "stale":
        return <Clock className="w-4 h-4" />;
      case "old":
        return <AlertTriangle className="w-4 h-4" />;
      case "never":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getColorClasses = () => {
    switch (syncStatus.color) {
      case "green":
        return "bg-green-100 text-green-700 border-green-200";
      case "yellow":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "red":
        return "bg-red-100 text-red-700 border-red-200";
      case "gray":
        return "bg-slate-100 text-slate-700 border-slate-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getDotColor = () => {
    switch (syncStatus.color) {
      case "green":
        return "bg-green-500";
      case "yellow":
        return "bg-yellow-500";
      case "red":
        return "bg-red-500";
      case "gray":
        return "bg-slate-400";
      default:
        return "bg-slate-400";
    }
  };

  if (variant === "compact") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${getDotColor()}`} />
              {showLabel && (
                <span className="text-xs text-slate-600">{syncStatus.text}</span>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{syncStatus.description}</p>
            <p className="text-xs text-slate-400 mt-1">
              Last synced: {relativeTime}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (variant === "detailed") {
    return (
      <div className="flex items-center gap-2 text-sm">
        {showIcon && (
          <span className={`${getDotColor()} p-1.5 rounded-full text-white`}>
            {getIcon()}
          </span>
        )}
        <div className="flex flex-col">
          <span className="font-medium text-slate-900">{syncStatus.text}</span>
          <span className="text-xs text-slate-500">{relativeTime}</span>
        </div>
      </div>
    );
  }

  return (
    <Badge className={`${getColorClasses()} px-2 py-1 flex items-center gap-1.5`}>
      {showIcon && getIcon()}
      {showLabel && <span>{syncStatus.text}</span>}
    </Badge>
  );
}
