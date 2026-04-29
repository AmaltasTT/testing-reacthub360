"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { usePlatforms } from "@/hooks/use-platforms";
import type { Platform, LinkedAccount, Authentication } from "@/hooks/use-platforms";
import { useUser } from "@/hooks/use-user";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Info,
  CheckCircle2,
  Search,
  Loader2,
  XCircle,
  Filter,
  Clock,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import {
  PlatformSyncBadge,
  AccountSyncBadge,
} from "@/components/sync/SyncStatusIndicator";
import {
  getPlatformSyncSummary,
  deriveAccountSyncState,
  deriveNeedsReauth,
  hasAnySyncing,
  getRelativeTime,
  type PlatformSyncSummary,
} from "@/lib/sync-status-utils";
import Image from "next/image";
import { toast } from "sonner";
import {
  getOAuthProvider,
  isOAuthSupported,
  getOAuthRedirectUri,
} from "@/lib/oauth-config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ---------------------------------------------------------------------------
// Category filter types
// ---------------------------------------------------------------------------

type CategoryFilter =
  | "All"
  | "Social"
  | "Video"
  | "Analytics"
  | "Email/CRM"
  | "Shopping Ads"
  | "Native Ads"
  | "Search"
  | "Display"
  | "E-Commerce"
  | "Reviews";

const visibleCategories: CategoryFilter[] = [
  "All",
  "Social",
  "Video",
  "Analytics",
];

const dropdownCategories: CategoryFilter[] = [
  "Search",
  "Display",
  "E-Commerce",
  "Email/CRM",
  "Shopping Ads",
  "Native Ads",
  "Reviews",
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ChannelsPage() {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [connectingPlatformId, setConnectingPlatformId] = useState<
    string | null
  >(null);
  const [managePlatform, setManagePlatform] = useState<Platform | null>(null);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [pendingLinkedAccounts, setPendingLinkedAccounts] = useState<
    LinkedAccount[] | null
  >(null);
  const [availableAccounts, setAvailableAccounts] = useState<any[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null
  );
  const {
    data: platforms,
    isLoading: platformsLoading,
    refetch: refetchPlatforms,
  } = usePlatforms();
  const { data: user, isLoading: userLoading } = useUser();
  const { token } = useAuth();

  // -----------------------------------------------------------------------
  // Mount guard for Dialog hydration
  // -----------------------------------------------------------------------
  useEffect(() => {
    setMounted(true);
  }, []);

  // -----------------------------------------------------------------------
  // Polling: refetch every 30 s while any account is still syncing
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (!platforms || !hasAnySyncing(platforms)) return;

    const id = setInterval(() => {
      refetchPlatforms();
    }, 30_000);

    return () => clearInterval(id);
  }, [platforms, refetchPlatforms]);

  // -----------------------------------------------------------------------
  // Reset edit state when modal closes
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (!managePlatform) {
      setIsEditingAccount(false);
      setPendingLinkedAccounts(null);
      setAvailableAccounts([]);
      setSelectedAccountId(null);
    }
  }, [managePlatform]);

  // Keep the modal in sync with refreshed platform data so warnings and
  // selected accounts update immediately after refetches.
  useEffect(() => {
    if (!managePlatform || !platforms) return;

    const latestPlatform = platforms.find(
      (platform) => platform.id === managePlatform.id
    );

    if (latestPlatform && latestPlatform !== managePlatform) {
      setManagePlatform(latestPlatform);
    }
  }, [managePlatform, platforms]);

  // -----------------------------------------------------------------------
  // Derived data
  // -----------------------------------------------------------------------
  const connectedCount = useMemo(() => {
    return (
      platforms?.filter(
        (p) =>
          p._authentication?.status === "connected" ||
          p._authentication?.status === "re_connect"
      ).length || 0
    );
  }, [platforms]);

  const filteredPlatforms = useMemo(() => {
    if (!platforms) return [];

    let filtered = platforms;

    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [platforms, selectedCategory, searchQuery]);

  const totalPlatforms = platforms?.length || 0;

  // -----------------------------------------------------------------------
  // Handlers
  // -----------------------------------------------------------------------

  const fetchAvailableAccounts = useCallback(
    async (platform: Platform) => {
      if (!platform._authentication?.id || !token) {
        throw new Error("Unable to fetch accounts");
      }

      const response = await fetch(
        `https://xyfx-hog3-y19r.n7e.xano.io/api:b3UvZDq3/get_available_ad_accounts?auth_provider_id=${platform._authentication.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch available accounts");
      }

      const data = await response.json();
      setAvailableAccounts(data);

      const currentAccount = platform._authentication._linked_accounts?.[0];
      setSelectedAccountId(currentAccount?.connection_id ?? null);
    },
    [token]
  );

  const handleEditAccount = useCallback(async () => {
    if (!managePlatform?._authentication?.id || !token) {
      toast.error("Unable to fetch accounts. Please try again.");
      return;
    }

    setIsEditingAccount(true);
    setLoadingAccounts(true);

    try {
      await fetchAvailableAccounts(managePlatform);
    } catch (error) {
      toast.error("Failed to fetch available accounts. Please try again.");
      setIsEditingAccount(false);
    } finally {
      setLoadingAccounts(false);
    }
  }, [fetchAvailableAccounts, managePlatform, token]);

  useEffect(() => {
    if (!managePlatform?._authentication || !token) return;

    const auth = managePlatform._authentication;
    const hasNoSelectedAccounts = (auth._linked_accounts?.length ?? 0) === 0;
    const isConnected =
      auth.status === "connected" || auth.status === "re_connect";

    if (
      !isConnected ||
      !hasNoSelectedAccounts ||
      isEditingAccount ||
      loadingAccounts ||
      availableAccounts.length > 0
    ) {
      return;
    }

    void handleEditAccount();
  }, [
    availableAccounts.length,
    handleEditAccount,
    isEditingAccount,
    loadingAccounts,
    managePlatform,
    token,
  ]);

  const handleSaveAccount = async () => {
    if (
      !selectedAccountId ||
      !managePlatform?._authentication?.id ||
      !token
    ) {
      toast.error("Please select an account.");
      return;
    }

    setLoadingAccounts(true);

    try {
      const selectedAccount = availableAccounts.find(
        (acc) => (acc.connection_id || acc.id) === selectedAccountId
      );

      if (!selectedAccount) {
        throw new Error("Selected account not found");
      }

      const requestBody = {
        auth_provider_id: managePlatform._authentication.id,
        selected_accounts: [
          {
            id: selectedAccount.connection_id || selectedAccount.id,
            name: selectedAccount.ad_account_name || selectedAccount.name,
          },
        ],
      };

      const response = await fetch(
        `https://xyfx-hog3-y19r.n7e.xano.io/api:b3UvZDq3/select_ad_accounts`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update account");
      }

      toast.success(`${managePlatform.is_paid ? "Ad account" : "Account"} updated successfully!`);

      // Hold a local "pending" linked account to prevent empty-state flicker
      // while refetch is in-flight.
      setPendingLinkedAccounts([
        {
          id: selectedAccount.id ?? selectedAccount.connection_id ?? selectedAccountId,
          connection_id: selectedAccount.connection_id ?? selectedAccount.id ?? selectedAccountId,
          ad_account_name:
            selectedAccount.ad_account_name || selectedAccount.name || "Selected Account",
        } as LinkedAccount,
      ]);

      setIsEditingAccount(false);
      await refetchPlatforms();
      setPendingLinkedAccounts(null);
    } catch (error) {
      toast.error("Failed to update account. Please try again.");
    } finally {
      setLoadingAccounts(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingAccount(false);
    setAvailableAccounts([]);
    setSelectedAccountId(null);
  };

  const handleDisconnect = async () => {
    if (!managePlatform?._authentication?.id || !token) {
      toast.error("Unable to disconnect. Please try again.");
      return;
    }

    setIsDisconnecting(true);

    try {
      const response = await fetch(
        `https://xyfx-hog3-y19r.n7e.xano.io/api:b3UvZDq3/disconnect_channel?id=${managePlatform._authentication.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to disconnect channel");
      }

      toast.success(`${managePlatform.name} disconnected successfully!`);
      setManagePlatform(null);

      refetchPlatforms();
    } catch (error) {
      toast.error("Failed to disconnect. Please try again.");
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handleConnectPlatform = async (
    platformId: string,
    platformSlug: string
  ) => {
    const oauthProvider = getOAuthProvider(platformSlug);

    if (!oauthProvider) {
      toast.info("OAuth for this platform is coming soon!");
      return;
    }

    if (!token) {
      toast.error("Authentication token not found. Please log in again.");
      return;
    }

    setConnectingPlatformId(platformId);

    try {
      const params = new URLSearchParams({
        redirect_uri: getOAuthRedirectUri(),
        platform_id: platformId,
      });

      if (oauthProvider.requiresScope !== false) {
        params.append("scope", platformSlug);
      }

      const oauthInitUrl = `${oauthProvider.initEndpoint}?${params.toString()}`;

      const response = await fetch(oauthInitUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to initialize OAuth");
      }

      const data = await response.json();

      if (data.authUrl) {
        if (window.top) {
          window.top.location.href = data.authUrl;
        } else {
          window.location.href = data.authUrl;
        }
      } else {
        throw new Error("OAuth URL not found in response");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      setConnectingPlatformId(null);
    }
  };

  const effectiveLinkedAccounts =
    pendingLinkedAccounts ??
    managePlatform?._authentication?._linked_accounts ??
    [];
  const hasLinkedAccounts = effectiveLinkedAccounts.length > 0;

  // -----------------------------------------------------------------------
  // Loading skeleton
  // -----------------------------------------------------------------------

  if (platformsLoading || userLoading) {
    return (
      <div
        className="min-h-screen relative"
        style={{
          background: "linear-gradient(180deg, #F5F5FF 0%, #FAFBFF 100%)",
        }}
      >
        <div
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-cyan-500 to-indigo-500 z-50"
          style={{ opacity: 0.6 }}
        />
        <main className="max-w-7xl mx-auto px-6 sm:px-8 py-12 sm:py-16 relative z-10">
          <div className="animate-pulse">
            <div className="mb-12">
              <div className="h-10 bg-gray-200 rounded-lg w-2/5 mb-3"></div>
              <div className="h-5 bg-gray-200 rounded-lg w-1/3"></div>
            </div>
            <div className="flex justify-between items-center mb-8">
              <div className="h-9 bg-gray-200 rounded-lg w-1/4"></div>
              <div className="h-12 bg-gray-200 rounded-xl w-48"></div>
            </div>
            <div className="mb-6">
              <div className="h-14 bg-gray-200 rounded-full max-w-md"></div>
            </div>
            <div className="flex gap-3 mb-10">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-11 bg-gray-200 rounded-full w-28"
                ></div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-80 bg-white rounded-3xl shadow-md"
                ></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <div
      className="min-h-screen relative"
      style={{
        background: "linear-gradient(180deg, #F5F5FF 0%, #FAFBFF 100%)",
      }}
    >
      <div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-cyan-500 to-indigo-500 z-50"
        style={{ opacity: 0.6 }}
      />

      <main className="max-w-7xl mx-auto px-6 sm:px-8 py-12 sm:py-16 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0, duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Welcome {user?.first_name} {user?.last_name}
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Connect your marketing platforms to start syncing data.
          </p>
        </motion.div>

        {/* Activate Channels */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="mb-10"
        >
          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Activate Channels
            </h2>
            <Badge
              variant="secondary"
              className="text-white px-5 py-3 text-sm border-0 rounded-xl shadow-md w-fit flex items-center gap-2.5 font-medium"
              style={{ backgroundColor: "#3C83F6" }}
            >
              <span className="text-base">&#x1F517;</span>
              <span>
                {connectedCount} / {totalPlatforms} Connected
              </span>
              <Info className="h-4 w-4 ml-1" />
            </Badge>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for channels..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 rounded-full bg-white border-0 shadow-md text-base focus-visible:ring-2 focus-visible:ring-offset-0"
                style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)" }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M15 5L5 15M5 5L15 15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Category filter */}
          <div className="mb-10">
            <div className="flex flex-wrap gap-3">
              {visibleCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? "bg-white text-gray-900 shadow-lg"
                      : "bg-white/70 text-gray-700 hover:bg-white hover:shadow-md"
                  }`}
                >
                  {category}
                </button>
              ))}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      dropdownCategories.includes(selectedCategory)
                        ? "bg-white text-gray-900 shadow-lg"
                        : "bg-white/70 text-gray-700 hover:bg-white hover:shadow-md"
                    }`}
                  >
                    <Filter className="w-4 h-4" />
                    More Filters
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="bg-white border border-gray-200 shadow-lg rounded-xl min-w-[180px]"
                >
                  {dropdownCategories.map((category) => (
                    <DropdownMenuItem
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`cursor-pointer px-4 py-2.5 text-sm font-medium transition-colors ${
                        selectedCategory === category
                          ? "bg-violet-50 text-violet-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* ---- Platform cards grid ---- */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredPlatforms.map((platform, index) => {
              const auth = platform._authentication;
              const summary = getPlatformSyncSummary(auth);
              const needsReauth = auth ? deriveNeedsReauth(auth) : false;
              const accounts = auth?._linked_accounts ?? [];

              return (
                <motion.div
                  key={platform.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.04,
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                >
                  <Card
                    className="bg-white rounded-3xl border-0 p-7 sm:p-8 transition-all duration-300 h-full"
                    style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 8px 24px rgba(0, 0, 0, 0.12)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 4px 12px rgba(0, 0, 0, 0.08)";
                    }}
                  >
                    <div className="flex flex-col h-full">
                      {/* Icon + Name */}
                      <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="w-14 h-14 relative flex items-center justify-center flex-shrink-0 bg-gray-50 rounded-2xl p-2">
                          <Image
                            src={platform.logo.url}
                            alt={`${platform.name} logo`}
                            width={48}
                            height={48}
                            className="object-contain"
                          />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                          {platform.name}
                        </h3>
                      </div>

                      {/* Category */}
                      <p className="text-sm text-gray-500 text-center mb-3 font-medium">
                        {platform.category}
                      </p>

                      {/* ---- Sync status area ---- */}
                      <div className="flex flex-col items-center gap-2 mb-4">
                        {/* Needs re-auth warning */}
                        {needsReauth && (
                          <div className="w-full bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0" />
                            <span className="text-xs font-medium text-orange-700">
                              Re-authentication required
                            </span>
                          </div>
                        )}

                        {/* Platform-level sync badge (only when connected and has accounts) */}
                        {auth &&
                          (auth.status === "connected" ||
                            auth.status === "re_connect") &&
                          !needsReauth &&
                          accounts.length > 0 && (
                            <PlatformSyncBadge summary={summary} />
                          )}

                        {/* Warning: no account selected */}
                        {auth &&
                          (auth.status === "connected" ||
                            auth.status === "re_connect") &&
                          accounts.length === 0 && (
                            <div className="w-full bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                              <span className="text-xs font-medium text-amber-700">
                                No {platform.is_paid ? "ad account" : "account"} selected — data will not sync
                              </span>
                            </div>
                          )}
                      </div>

                      {/* Spacer */}
                      <div className="flex-grow"></div>

                      {/* Manage integration (only for connected / re_connect) */}
                      {auth &&
                        (auth.status === "connected" ||
                          auth.status === "re_connect") && (
                          <button
                            onClick={() => setManagePlatform(platform)}
                            className="text-sm font-semibold text-center mb-5 px-6 py-3 rounded-full transition-all duration-200 cursor-pointer"
                            style={{
                              color: "#000000",
                              backgroundColor: "#FFFFFF",
                              border: "1px solid #E5E7EB",
                              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.08)",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor =
                                "#1677FF";
                              e.currentTarget.style.color = "#FFFFFF";
                              e.currentTarget.style.borderColor = "#1677FF";
                              e.currentTarget.style.boxShadow =
                                "0 4px 8px rgba(22, 119, 255, 0.25)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor =
                                "#FFFFFF";
                              e.currentTarget.style.color = "#000000";
                              e.currentTarget.style.borderColor = "#E5E7EB";
                              e.currentTarget.style.boxShadow =
                                "0 2px 4px rgba(0, 0, 0, 0.08)";
                            }}
                          >
                            Manage Integration
                          </button>
                        )}

                      {/* Connection / Reconnect button */}
                      <PlatformActionButton
                        platform={platform}
                        summary={summary}
                        needsReauth={needsReauth}
                        connectingPlatformId={connectingPlatformId}
                        onConnect={handleConnectPlatform}
                      />
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Empty state */}
          {filteredPlatforms.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-20"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900 mb-1">
                    No channels found
                  </p>
                  <p className="text-base text-gray-500">
                    {searchQuery
                      ? `No results for "${searchQuery}". Try a different search term.`
                      : "No platforms found in this category."}
                  </p>
                </div>
                {(searchQuery || selectedCategory !== "All") && (
                  <Button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("All");
                    }}
                    variant="outline"
                    className="mt-4"
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* ----------------------------------------------------------------- */}
        {/* Manage Integration Dialog                                          */}
        {/* ----------------------------------------------------------------- */}
        {mounted && (
          <Dialog
            open={!!managePlatform}
            onOpenChange={(open) => !open && setManagePlatform(null)}
          >
            <DialogContent className="sm:max-w-md bg-white border-2 border-gray-200 shadow-2xl">
              <DialogHeader className="min-w-0">
                <div className="flex items-center gap-4 mb-4">
                  {managePlatform?.logo?.url && (
                    <div className="w-12 h-12 relative flex items-center justify-center bg-gray-100 rounded-xl p-2">
                      <Image
                        src={managePlatform.logo.url}
                        alt={`${managePlatform.name} logo`}
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    </div>
                  )}
                  <div>
                    <DialogTitle className="text-xl font-bold text-gray-900">
                      {managePlatform?.name}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-600 mt-1">
                      {managePlatform?.category}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="py-4 min-w-0">
                {/* Connection status banner */}
                <ManageDialogStatusBanner platform={managePlatform} />

                {managePlatform?._authentication &&
                  (managePlatform._authentication.status === "connected" ||
                    managePlatform._authentication.status === "re_connect") &&
                  !hasLinkedAccounts && (
                    <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4 mb-6">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                        <span className="text-sm font-semibold text-amber-900">
                          No {managePlatform.is_paid ? "Ad Account" : "Account"} Selected
                        </span>
                      </div>
                      <p className="text-sm text-amber-800 mt-2 ml-7">
                        Data will not sync until you select a
                        {" "}
                        {managePlatform.is_paid ? "connected ad account" : "connected account"}.
                      </p>
                    </div>
                  )}

                {/* Linked accounts list / selection */}
                {managePlatform?._authentication &&
                  (managePlatform._authentication.status === "connected" ||
                    managePlatform._authentication.status === "re_connect") && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-gray-900">
                          {hasLinkedAccounts
                            ? `Linked ${managePlatform.is_paid ? "Ad Account" : "Account"}${
                                effectiveLinkedAccounts.length > 1 ? "s" : ""
                              }`
                            : `${managePlatform.is_paid ? "Ad Account" : "Account"} Selection`}
                        </h4>
                        {!isEditingAccount && (
                          <Button
                            onClick={handleEditAccount}
                            variant="outline"
                            size="sm"
                            className="text-xs font-medium"
                          >
                            {hasLinkedAccounts
                              ? "Edit"
                              : `Select ${managePlatform.is_paid ? "Ad Account" : "Account"}`}
                          </Button>
                        )}
                      </div>

                      {!isEditingAccount ? (
                        hasLinkedAccounts ? (
                          <div className="space-y-2">
                            {effectiveLinkedAccounts.map(
                              (account: LinkedAccount) => (
                                <div
                                  key={account.id}
                                  className="bg-gray-50 border border-gray-200 rounded-lg p-3"
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">
                                        {account.ad_account_name}
                                      </p>
                                      {account.connection_id && (
                                        <p className="text-xs text-gray-500 mt-1">
                                          ID: {account.connection_id}
                                        </p>
                                      )}
                                    </div>
                                    <AccountSyncBadge
                                      account={account}
                                      authStatus={
                                        managePlatform._authentication!.status
                                      }
                                    />
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-4 text-sm text-gray-600">
                            No {managePlatform.is_paid ? "ad account" : "account"} has been selected yet.
                          </div>
                        )
                      ) : (
                        /* Edit mode — account selector */
                        <div className="space-y-3">
                          {loadingAccounts ? (
                            <div className="flex items-center justify-center py-8">
                              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                              <span className="ml-2 text-sm text-gray-500">
                                Loading accounts...
                              </span>
                            </div>
                          ) : (
                            <>
                              {availableAccounts.length > 0 ? (
                                <>
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                      Select {managePlatform?.is_paid ? "Ad Account" : "Account"}
                                    </label>
                                    <Select
                                      value={selectedAccountId || undefined}
                                      onValueChange={setSelectedAccountId}
                                    >
                                      <SelectTrigger className="w-full min-w-0 bg-white border-2 border-gray-200 h-11 px-4 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all">
                                        <SelectValue placeholder={`Choose an ${managePlatform?.is_paid ? "ad account" : "account"}`}>
                                          {selectedAccountId &&
                                            (() => {
                                              const selected =
                                                availableAccounts.find(
                                                  (acc: any) =>
                                                    (acc.connection_id ||
                                                      acc.id) ===
                                                    selectedAccountId
                                                );
                                              return selected ? (
                                                <div className="flex min-w-0 items-center">
                                                  <span className="min-w-0 truncate font-medium text-gray-900">
                                                    {selected.ad_account_name ||
                                                      selected.name}
                                                  </span>
                                                </div>
                                              ) : null;
                                            })()}
                                        </SelectValue>
                                      </SelectTrigger>
                                      <SelectContent className="bg-white border-2 border-gray-200 shadow-lg max-h-[300px]">
                                        {availableAccounts.map(
                                          (account: any) => {
                                            const accountId =
                                              account.connection_id ||
                                              account.id;
                                            const accountName =
                                              account.ad_account_name ||
                                              account.name;

                                            return (
                                              <SelectItem
                                                key={accountId}
                                                value={accountId}
                                                className="cursor-pointer hover:bg-blue-50 focus:bg-blue-50 py-3"
                                              >
                                                <div className="flex flex-col gap-1">
                                                  <span className="font-medium text-gray-900">
                                                    {accountName}
                                                  </span>
                                                  <span className="text-xs text-gray-500">
                                                    ID: {accountId}
                                                  </span>
                                                </div>
                                              </SelectItem>
                                            );
                                          }
                                        )}
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="flex gap-2 pt-2">
                                    <Button
                                      onClick={handleCancelEdit}
                                      variant="outline"
                                      className="flex-1 border-gray-300"
                                      disabled={loadingAccounts}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      onClick={handleSaveAccount}
                                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                                      disabled={
                                        loadingAccounts || !selectedAccountId
                                      }
                                    >
                                      {loadingAccounts ? (
                                        <>
                                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                          Saving...
                                        </>
                                      ) : (
                                        "Save"
                                      )}
                                    </Button>
                                  </div>
                                </>
                              ) : (
                                <div className="text-center py-6 text-sm text-gray-500">
                                  No available accounts found
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                <div className="space-y-3 text-sm text-gray-700">
                  {hasLinkedAccounts ? (
                    <>
                      <p className="font-medium">
                        This integration is currently active and syncing data from
                        your {managePlatform?.name} account.
                      </p>
                      <p>
                        If you disconnect, you will need to re-authenticate to
                        restore the connection.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-medium">
                        This integration is connected, but no
                        {" "}
                        {managePlatform?.is_paid ? "ad account" : "account"}
                        {" "}
                        is selected yet.
                      </p>
                      <p>
                        Select an available
                        {" "}
                        {managePlatform?.is_paid ? "ad account" : "account"}
                        {" "}
                        to start syncing data, or disconnect this integration if
                        you no longer want to use it.
                      </p>
                    </>
                  )}
                </div>
              </div>

              <DialogFooter className="flex-col sm:flex-row gap-3 min-w-0">
                <Button
                  variant="outline"
                  onClick={() => setManagePlatform(null)}
                  disabled={isDisconnecting}
                  className="w-full sm:w-auto border-2 border-gray-300 hover:bg-gray-100 text-gray-900 font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDisconnect}
                  disabled={isDisconnecting}
                  className="bg-red-600 w-full sm:w-auto hover:bg-red-700 text-white font-semibold border-0 shadow-md"
                >
                  {isDisconnecting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Disconnecting...
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 mr-2" />
                      Disconnect
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/**
 * The primary CTA button on each platform card.
 * Renders different labels / colors depending on platform state.
 */
function PlatformActionButton({
  platform,
  summary,
  needsReauth,
  connectingPlatformId,
  onConnect,
}: {
  platform: Platform;
  summary: PlatformSyncSummary;
  needsReauth: boolean;
  connectingPlatformId: string | null;
  onConnect: (id: string, slug: string) => void;
}) {
  const isConnecting = connectingPlatformId === platform.id;

  // Connect Now button for disconnected, re-auth, auth_pending, or not connected
  if (
    summary === "disconnected" ||
    summary === "needs_reauth" ||
    summary === "not_connected" ||
    platform._authentication?.status === "auth_pending"
  ) {
    return (
      <Button
        onClick={() => onConnect(platform.id, platform.slug)}
        disabled={isConnecting}
        className={`w-full rounded-full py-4 font-semibold border-0 text-base flex items-center justify-center gap-2 text-white ${
          isConnecting ? "cursor-wait opacity-80" : ""
        }`}
        style={{
          backgroundColor: "#3C83F6",
          boxShadow: "0 4px 12px rgba(60, 131, 246, 0.3)",
        }}
        onMouseEnter={(e) => {
          if (isConnecting) return;
          e.currentTarget.style.backgroundColor = "#2563eb";
          e.currentTarget.style.boxShadow =
            "0 6px 16px rgba(60, 131, 246, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#3C83F6";
          e.currentTarget.style.boxShadow =
            "0 4px 12px rgba(60, 131, 246, 0.3)";
        }}
      >
        {isConnecting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Connecting...</span>
          </>
        ) : (
          <span>Connect Now</span>
        )}
      </Button>
    );
  }

  // Connected / syncing / pending / synced
  return (
    <Button
      disabled
      className="w-full rounded-full py-2.5 font-semibold border-0 text-base flex items-center justify-center gap-2 text-white cursor-default"
      style={{
        backgroundColor: "#0FC271",
        boxShadow: "0 4px 12px rgba(15, 194, 113, 0.3)",
      }}
    >
      <CheckCircle2 className="w-4 h-4" />
      <span>Connected</span>
    </Button>
  );
}

/**
 * Status banner inside the manage dialog.
 */
function ManageDialogStatusBanner({
  platform,
}: {
  platform: Platform | null;
}) {
  if (!platform?._authentication) return null;

  const auth = platform._authentication;
  const needsReauth = deriveNeedsReauth(auth);

  if (needsReauth) {
    return (
      <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          <span className="text-sm font-semibold text-orange-900">
            Re-authentication Required
          </span>
        </div>
        <p className="text-sm text-orange-800 mt-2 ml-7">
          Your access token has expired. Please re-authenticate to continue
          syncing data.
        </p>
      </div>
    );
  }

  if (auth.status === "disconnected") {
    return (
      <div className="bg-slate-50 border-2 border-slate-300 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2">
          <XCircle className="w-5 h-5 text-slate-600" />
          <span className="text-sm font-semibold text-slate-900">
            Disconnected
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5 text-green-600" />
        <span className="text-sm font-semibold text-green-900">
          Successfully Connected
        </span>
      </div>
      {auth.email && (
        <p className="text-sm font-medium text-green-800 mt-2 ml-7">
          Connected as: {auth.email}
        </p>
      )}
    </div>
  );
}
