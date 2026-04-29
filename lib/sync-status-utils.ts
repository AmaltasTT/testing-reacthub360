/**
 * Utility functions for calculating and displaying data sync status
 */

import type { LinkedAccount, Authentication } from "@/hooks/use-platforms";

// --- Legacy sync status (timestamp-based) ---

export interface SyncStatus {
  status: "never" | "recent" | "stale" | "old";
  color: "gray" | "green" | "yellow" | "red";
  text: string;
  description: string;
}

export function getSyncStatus(lastFetchedAt: string | null | undefined): SyncStatus {
  if (!lastFetchedAt) {
    return {
      status: "never",
      color: "gray",
      text: "Never synced",
      description: "Data has not been synced yet",
    };
  }

  const now = Date.now();
  const lastFetched = new Date(lastFetchedAt).getTime();
  const hoursSince = (now - lastFetched) / (1000 * 60 * 60);

  if (hoursSince < 1) {
    return {
      status: "recent",
      color: "green",
      text: "Up to date",
      description: "Synced within the last hour",
    };
  }

  if (hoursSince < 24) {
    const hours = Math.floor(hoursSince);
    return {
      status: "stale",
      color: "yellow",
      text: `${hours}h ago`,
      description: `Last synced ${hours} hour${hours !== 1 ? "s" : ""} ago`,
    };
  }

  const days = Math.floor(hoursSince / 24);
  return {
    status: "old",
    color: "red",
    text: `${days}d ago`,
    description: `Last synced ${days} day${days !== 1 ? "s" : ""} ago - sync needed`,
  };
}

// --- New sync state derivation ---

export type AccountSyncState = "disconnected" | "synced" | "syncing" | "pending";

/**
 * Derive the sync_state for a linked account based on its fields and the
 * parent authentication status.
 */
export function deriveAccountSyncState(
  account: LinkedAccount,
  authStatus: Authentication["status"]
): AccountSyncState {
  if (authStatus !== "connected") return "disconnected";
  if (account.initial_sync_done) return "synced";
  if (account.initial_sync_started_at != null) return "syncing";
  return "pending";
}

/**
 * Check whether the authentication provider needs re-authentication.
 */
export function deriveNeedsReauth(auth: Authentication): boolean {
  if (auth.status === "re_connect") return true;

  const now = Date.now();

  if (auth.token_expiry_at) {
    if (new Date(auth.token_expiry_at).getTime() < now) return true;
  }

  if (auth.refresh_token_expiry_at) {
    if (new Date(auth.refresh_token_expiry_at).getTime() < now) return true;
  }

  return false;
}

/**
 * Priority ordering for sync states.
 * Lower index = worse state.
 */
const SYNC_STATE_PRIORITY: AccountSyncState[] = [
  "disconnected",
  "syncing",
  "pending",
  "synced",
];

export type PlatformSyncSummary =
  | "disconnected"
  | "needs_reauth"
  | "syncing"
  | "pending"
  | "synced"
  | "not_connected";

/**
 * Get the worst (aggregate) sync state across all linked accounts of a
 * platform, also accounting for needs_reauth.
 */
export function getPlatformSyncSummary(auth: Authentication | null | undefined): PlatformSyncSummary {
  if (!auth) return "not_connected";

  if (auth.status === "disconnected") return "disconnected";
  if (auth.status === "auth_pending") return "pending";

  if (deriveNeedsReauth(auth)) return "needs_reauth";

  const accounts = auth._linked_accounts ?? [];
  if (accounts.length === 0) return "pending";

  let worst: AccountSyncState = "synced";
  for (const account of accounts) {
    const state = deriveAccountSyncState(account, auth.status);
    if (SYNC_STATE_PRIORITY.indexOf(state) < SYNC_STATE_PRIORITY.indexOf(worst)) {
      worst = state;
    }
  }

  return worst;
}

/**
 * Returns true when any linked account across all platforms is still syncing.
 */
export function hasAnySyncing(platforms: { _authentication?: Authentication | null }[]): boolean {
  return platforms.some((p) => {
    const auth = p._authentication;
    if (!auth || auth.status !== "connected") return false;
    return auth._linked_accounts?.some(
      (a) => deriveAccountSyncState(a, auth.status) === "syncing"
    );
  });
}

// --- Relative time helpers ---

export function getRelativeTime(timestamp: string | null | undefined): string {
  if (!timestamp) return "Never";

  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diffMs = now - then;

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days !== 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  return "Just now";
}

export function formatSyncDate(timestamp: string | null | undefined): string {
  if (!timestamp) return "Never";

  const date = new Date(timestamp);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
