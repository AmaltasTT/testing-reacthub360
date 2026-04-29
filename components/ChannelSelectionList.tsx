"use client";

import { useState, useEffect, useRef } from 'react';
import { Check, X, ChevronDown, ChevronUp, Loader2, Filter } from 'lucide-react';
import { AdAccount } from '@/hooks/use-campaign-ad-accounts';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface Channel {
  id: string;
  name: string;
  platform: string;
  icon: string;
  connected: boolean;
  category: 'social' | 'search' | 'video' | 'display' | 'crm-email' | 'commerce' | 'analytics' | 'shopping-ads' | 'native-ads' | 'reviews';
  available?: boolean; // For future tier-locked channels
}

interface ChannelSelectionListProps {
  channels: Channel[];
  selectedChannels: string[];
  onChannelToggle: (channelId: string) => void;
  onConnectChannel?: (channelId: string) => void;
  // New props for ad accounts
  adAccountsByChannel?: Record<string, AdAccount[]>;
  selectedAdAccounts?: Record<string, string[]>; // channelId -> accountIds[]
  onAdAccountToggle?: (channelId: string, accountId: string) => void;
  loadingAdAccountsForChannel?: Record<string, boolean>; // Per-channel loading state
  onChannelExpand?: (channelId: string) => void; // Callback when channel is expanded
}

type FilterType = 'all' | 'social' | 'search' | 'video' | 'display' | 'crm-email' | 'commerce' | 'analytics' | 'shopping-ads' | 'native-ads' | 'reviews';

const filterLabels: Record<FilterType, string> = {
  'all': 'All',
  'social': 'Social',
  'search': 'Search',
  'video': 'Video',
  'display': 'Display',
  'crm-email': 'Email/CRM',
  'commerce': 'E-Commerce',
  'analytics': 'Analytics',
  'shopping-ads': 'Shopping Ads',
  'native-ads': 'Native Ads',
  'reviews': 'Reviews',
};

// Categories to show directly as buttons
const visibleCategories: FilterType[] = ['all', 'social', 'video', 'analytics'];

// Categories to show in dropdown (matching channels page)
const dropdownCategories: FilterType[] = ['search', 'display', 'commerce', 'crm-email', 'shopping-ads', 'native-ads', 'reviews'];

export function ChannelSelectionList({
  channels,
  selectedChannels,
  onChannelToggle,
  onConnectChannel,
  adAccountsByChannel = {},
  selectedAdAccounts = {},
  onAdAccountToggle,
  loadingAdAccountsForChannel = {},
  onChannelExpand,
}: ChannelSelectionListProps) {
  const [activeFilters, setActiveFilters] = useState<FilterType[]>(['all']);
  const [expandedChannels, setExpandedChannels] = useState<Set<string>>(new Set());
  const prevExpandedRef = useRef<Set<string>>(new Set());

  const toggleFilter = (filter: FilterType) => {
    if (filter === 'all') {
      setActiveFilters(['all']);
    } else {
      const newFilters = activeFilters.filter(f => f !== 'all');
      if (activeFilters.includes(filter)) {
        const filtered = newFilters.filter(f => f !== filter);
        setActiveFilters(filtered.length === 0 ? ['all'] : filtered);
      } else {
        setActiveFilters([...newFilters, filter]);
      }
    }
  };

  const toggleChannelExpansion = (channelId: string) => {
    const newExpanded = new Set(expandedChannels);
    if (newExpanded.has(channelId)) {
      newExpanded.delete(channelId);
    } else {
      newExpanded.add(channelId);
      // Trigger fetch when expanding
      onChannelExpand?.(channelId);
    }
    setExpandedChannels(newExpanded);
  };

  // Auto-expand channels immediately when they are selected
  useEffect(() => {
    setExpandedChannels(prev => {
      const newExpanded = new Set(prev);

      selectedChannels.forEach(channelId => {
        const channel = channels.find(ch => ch.id === channelId);

        // Expand immediately if channel is selected and connected (don't wait for ad accounts)
        if (channel?.connected && !newExpanded.has(channelId)) {
          newExpanded.add(channelId);
        }
      });

      // Collapse channels that are no longer selected
      Array.from(prev).forEach(channelId => {
        if (!selectedChannels.includes(channelId)) {
          newExpanded.delete(channelId);
        }
      });

      return prev.size !== newExpanded.size || [...newExpanded].some(id => !prev.has(id)) ? newExpanded : prev;
    });
  }, [selectedChannels, channels]);

  // Trigger fetch for newly expanded channels separately to avoid setState-during-render
  useEffect(() => {
    expandedChannels.forEach(channelId => {
      if (!prevExpandedRef.current.has(channelId)) {
        onChannelExpand?.(channelId);
      }
    });
    prevExpandedRef.current = expandedChannels;
  }, [expandedChannels, onChannelExpand]);

  const filteredChannels = channels.filter(channel => {
    if (activeFilters.includes('all')) return true;
    return activeFilters.includes(channel.category as FilterType);
  });

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="flex flex-wrap gap-2.5">
        {/* Visible Category Filters */}
        {visibleCategories.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => toggleFilter(filter)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 shadow-sm ${
              activeFilters.includes(filter)
                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-200 scale-105'
                : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-violet-300 hover:shadow-md hover:scale-105'
            }`}
          >
            {filterLabels[filter]}
          </button>
        ))}

        {/* More Filters Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 shadow-sm flex items-center gap-2 ${
                dropdownCategories.some(cat => activeFilters.includes(cat))
                  ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-200 scale-105'
                  : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-violet-300 hover:shadow-md hover:scale-105'
              }`}
            >
              <Filter className="w-4 h-4" />
              More
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="bg-white border-2 border-slate-200 shadow-xl rounded-xl min-w-[180px]"
          >
            {dropdownCategories.map((filter) => (
              <DropdownMenuItem
                key={filter}
                onClick={() => toggleFilter(filter)}
                className={`cursor-pointer px-4 py-2.5 text-sm font-medium transition-colors rounded-lg mx-1 my-0.5 ${
                  activeFilters.includes(filter)
                    ? 'bg-violet-50 text-violet-700'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {filterLabels[filter]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Scrollable Channel List */}
      <div className="relative">
        {/* Sticky Header with gradient */}
        <div className="sticky top-0 bg-gradient-to-b from-white via-white to-white/80 backdrop-blur-sm z-10 pb-3 mb-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              {filteredChannels.length} {filteredChannels.length === 1 ? 'channel' : 'channels'} available
            </p>
            <div className="h-px flex-1 ml-4 bg-gradient-to-r from-violet-200 via-purple-200 to-transparent"></div>
          </div>
        </div>

        {/* Channel List Container */}
        <div
          className="max-h-[600px] overflow-y-auto space-y-3 pr-2"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#e9d5ff #f8fafc'
          }}
        >
          {filteredChannels.map((channel) => {
            const isSelected = selectedChannels.includes(channel.id);
            const isAvailable = channel.available !== false;
            const isExpanded = expandedChannels.has(channel.id);
            const channelAdAccounts = adAccountsByChannel[channel.id] || [];
            const hasAdAccounts = channelAdAccounts.length > 0;
            const selectedAccounts = selectedAdAccounts[channel.id] || [];

            return (
              <div
                key={channel.id}
                className={`group relative rounded-2xl border-2 transition-all duration-300 ${
                  isSelected
                    ? 'border-violet-400 bg-gradient-to-br from-violet-50 via-purple-50/30 to-white shadow-lg shadow-violet-100'
                    : isAvailable
                    ? 'border-slate-200 bg-white hover:border-violet-300 hover:shadow-xl hover:shadow-violet-50'
                    : 'border-slate-200 bg-slate-50 opacity-60'
                }`}
              >
                {/* Selection indicator gradient bar */}
                {isSelected && (
                  <div className="absolute left-0 top-8 w-1.5 h-12 bg-gradient-to-b from-violet-500 to-purple-600 rounded-r-full"></div>
                )}

                {/* Main Channel Row */}
                <div className="px-5 py-4 flex items-center gap-4">
                  {/* Checkbox */}
                  <button
                    type="button"
                    onClick={() => isAvailable && onChannelToggle(channel.id)}
                    disabled={!isAvailable}
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      isSelected
                        ? 'bg-gradient-to-br from-violet-600 to-purple-600 border-violet-600 shadow-lg shadow-violet-200'
                        : isAvailable
                        ? 'border-slate-300 hover:border-violet-400 hover:bg-violet-50'
                        : 'border-slate-300 cursor-not-allowed'
                    }`}
                    aria-label={`${isSelected ? 'Deselect' : 'Select'} ${channel.name}`}
                  >
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                  </button>

                  {/* Platform Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    isSelected
                      ? 'bg-gradient-to-br from-violet-100 to-purple-100 shadow-inner'
                      : 'bg-slate-100 group-hover:bg-gradient-to-br group-hover:from-violet-50 group-hover:to-purple-50'
                  }`}>
                    <span className="text-xl">{channel.icon}</span>
                  </div>

                  {/* Channel Info */}
                  <div className="flex-1 text-left">
                    <div className={`font-semibold ${isAvailable ? 'text-slate-900' : 'text-slate-500'}`}>
                      {channel.name}
                    </div>
                    <div className="text-sm text-slate-500 mt-0.5">{channel.platform}</div>
                    {isSelected && hasAdAccounts && (
                      <div className="text-xs text-violet-600 mt-1 font-medium">
                        {selectedAccounts.length} of {channelAdAccounts.length} ad account{channelAdAccounts.length !== 1 ? 's' : ''} selected
                      </div>
                    )}
                  </div>

                  {/* Status Badge & Actions */}
                  <div className="flex items-center gap-3">
                    {channel.connected ? (
                      <div className="px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 flex items-center gap-1.5 shadow-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        Connected
                      </div>
                    ) : isAvailable ? (
                      <>
                        <div className="px-4 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                          Not connected
                        </div>
                        {onConnectChannel && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onConnectChannel(channel.id);
                            }}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 border-2 border-violet-200 text-sm font-semibold text-violet-700 hover:from-violet-100 hover:to-purple-100 hover:border-violet-300 hover:shadow-lg hover:shadow-violet-100 transition-all duration-300"
                          >
                            Connect
                          </button>
                        )}
                      </>
                    ) : (
                      <div className="px-4 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-400 border border-slate-200">
                        Not available
                      </div>
                    )}

                    {/* Expand/Collapse Button for connected channels */}
                    {isSelected && channel.connected && (
                      <button
                        type="button"
                        onClick={() => toggleChannelExpansion(channel.id)}
                        className="p-2 rounded-lg hover:bg-violet-100 transition-colors"
                        aria-label={isExpanded ? 'Collapse ad accounts' : 'Expand ad accounts'}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-violet-600" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-violet-600" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Ad Accounts Section (Expandable) */}
                {isSelected && channel.connected && isExpanded && (
                  <div className="px-5 pb-4 pt-2 border-t border-violet-200/50">
                    <div className="ml-10">
                      <div className="mb-3">
                        <h4 className="text-sm font-semibold text-slate-700 mb-1">
                          Select Ad Accounts
                        </h4>
                        <p className="text-xs text-slate-500">
                          Choose which ad accounts to use for this campaign
                        </p>
                      </div>

                      {loadingAdAccountsForChannel[channel.id] ? (
                        <div className="flex items-center justify-center py-6">
                          <Loader2 className="w-6 h-6 text-violet-600 animate-spin mr-2" />
                          <span className="text-sm text-slate-600">Loading ad accounts...</span>
                        </div>
                      ) : channelAdAccounts.length > 0 ? (
                        <div className="space-y-2">
                          {channelAdAccounts.map((account) => {
                            const isAccountSelected = selectedAccounts.includes(account.account_id);

                            return (
                              <div
                                key={account.account_id}
                                onClick={() => onAdAccountToggle?.(channel.id, account.account_id)}
                                className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                                  isAccountSelected
                                    ? 'border-violet-400 bg-violet-50'
                                    : 'border-slate-200 bg-white hover:border-violet-300 hover:bg-violet-50/30'
                                }`}
                              >
                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                  isAccountSelected
                                    ? 'bg-violet-600 border-violet-600'
                                    : 'border-slate-300'
                                }`}>
                                  {isAccountSelected && <Check className="w-3 h-3 text-white" />}
                                </div>
                                <div className="flex-1">
                                  <div className="text-sm font-medium text-slate-900">
                                    {account.account_name}
                                  </div>
                                  <div className="text-xs text-slate-500">
                                    ID: {account.account_id}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-sm text-slate-500">
                          No ad accounts available
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
