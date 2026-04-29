"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, MoreVertical, Settings, Link as LinkIcon, TrendingUp, CheckCircle2, FileEdit, XCircle, Trash2 } from 'lucide-react';
import { useUser } from '@/hooks/use-user';

interface Campaign {
  id: string;
  name: string;
  goal: string;
  market: string;
  channels: Array<{ id: string; name: string; icon: string; logoUrl?: string | null }>;
  status: 'active' | 'draft' | 'disabled';
  createdAt: Date;
}

interface LaunchIQProps {
  onCreateCampaign: () => void;
  onEditCampaign: (campaignId: string) => void;
  onDeleteCampaign: (campaignId: string) => void;
  campaigns: Campaign[];
  isDeletingCampaign?: boolean;
}

export function LaunchIQ({ onCreateCampaign, onEditCampaign, onDeleteCampaign, campaigns, isDeletingCampaign }: LaunchIQProps) {
  const router = useRouter();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const { data: user } = useUser();

  const handleMenuToggle = (campaignId: string) => {
    setOpenMenuId(openMenuId === campaignId ? null : campaignId);
  };

  const statusBadgeClass = (status: Campaign['status']) => {
    switch (status) {
      case 'active':
        return 'border-emerald-200 bg-emerald-50 text-emerald-800';
      case 'draft':
        return 'border-amber-200 bg-amber-50 text-amber-800';
      case 'disabled':
        return 'border-slate-200 bg-slate-100 text-slate-600';
      default:
        return 'border-slate-200 bg-slate-100 text-slate-600';
    }
  };

  const statusLabel = (status: Campaign['status']) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'draft':
        return 'Draft';
      case 'disabled':
        return 'Disabled';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: Campaign['status']) => {
    switch (status) {
      case 'active':
        return {
          icon: CheckCircle2,
          color: 'text-emerald-500',
          tooltip: 'Campaign is active'
        };
      case 'draft':
        return {
          icon: FileEdit,
          color: 'text-amber-500',
          tooltip: 'Campaign is in draft'
        };
      case 'disabled':
        return {
          icon: XCircle,
          color: 'text-slate-400',
          tooltip: 'Campaign is disabled'
        };
      default:
        return {
          icon: CheckCircle2,
          color: 'text-slate-400',
          tooltip: 'Status unknown'
        };
    }
  };

  const renderEmptyState = () => (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/80 shadow-xl p-6 sm:p-12">
      <div className="flex flex-col items-center justify-center">
        {/* Empty State Illustration */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center mb-6">
          <TrendingUp className="w-10 h-10 sm:w-12 sm:h-12 text-violet-600" />
        </div>

        {/* Message */}
        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2 text-center">
          Ready to launch your first campaign?
        </h3>
        <p className="text-sm sm:text-base text-slate-600 mb-8 max-w-md text-center px-4">
          Create your first trackable campaign to start observing signals and unlocking insights.
        </p>

        {/* Premium Gradient CTA */}
        <button
          type="button"
          onClick={onCreateCampaign}
          className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create your first campaign
        </button>
      </div>
    </div>
  );

  const renderCampaignList = () => (
    <div className="space-y-4">
      {campaigns.map((campaign) => (
        <div
          key={campaign.id}
          className="bg-white/70 backdrop-blur-sm rounded-xl border border-white/80 shadow-lg hover:shadow-xl p-4 sm:p-6 transition-all hover:scale-[1.01]"
        >
          {/* Top Row: Title with Status Icon + CTAs + Menu */}
          <div className="flex items-start justify-between gap-3 mb-3">
            {/* Campaign Title with Status Indicator */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {/* Status Indicator */}
              <div className="relative group flex-shrink-0">
                {(() => {
                  const { icon: StatusIcon, color, tooltip } = getStatusIcon(campaign.status);
                  return <StatusIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${color}`} />;
                })()}
                {/* Tooltip */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-1.5 bg-slate-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none whitespace-nowrap z-50 shadow-xl">
                  {getStatusIcon(campaign.status).tooltip}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-slate-900 rotate-45"></div>
                </div>
              </div>
              <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 truncate">
                  {campaign.name}
                </h3>
                <span
                  className={`shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${statusBadgeClass(campaign.status)}`}
                >
                  {statusLabel(campaign.status)}
                </span>
              </div>
            </div>

            {/* Right Side: CTAs + Menu */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() =>
                  router.push(`/insightsiq?campaign_id=${encodeURIComponent(campaign.id)}`)
                }
                className="px-2.5 sm:px-3 py-1.5 bg-violet-50 hover:bg-violet-100 text-violet-700 rounded-full text-xs font-medium hover:shadow-sm transition-all whitespace-nowrap"
              >
                <span className="hidden sm:inline">Go to InsightsIQ</span>
                <span className="sm:hidden">Insights</span>
              </button>

              {/* Overflow Menu */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => handleMenuToggle(campaign.id)}
                  className="p-1.5 rounded-lg hover:bg-slate-100/80 transition-colors"
                  aria-label="More options"
                >
                  <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
                </button>

                {/* Dropdown Menu */}
                {openMenuId === campaign.id && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setOpenMenuId(null)}
                    />

                    {/* Menu */}
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white/95 backdrop-blur-md rounded-xl border border-slate-200 shadow-xl z-20 py-1.5 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenuId(null);
                          onEditCampaign(campaign.id);
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-violet-50 flex items-center gap-3 transition-colors"
                      >
                        <Settings className="w-4 h-4 text-slate-400" />
                        Edit campaign setup
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenuId(null);
                          router.push('/channels');
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-violet-50 flex items-center gap-3 transition-colors"
                      >
                        <LinkIcon className="w-4 h-4 text-slate-400" />
                        Connect more channels
                      </button>

                      {/* Divider */}
                      <div className="h-px bg-slate-200 my-1.5"></div>

                      {/* Delete Option */}
                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenuId(null);
                          setDeleteConfirmId(campaign.id);
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm text-[#e11d48] hover:bg-red-50 flex items-center gap-3 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                        Delete campaign
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Second Row: Goal and Market */}
          <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-600 mb-4">
            <span className="font-medium">{campaign.goal}</span>
            <span className="text-slate-400">•</span>
            <span>{campaign.market}</span>
          </div>

          {/* Subtle Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-4"></div>

          {/* Selected Channels */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Campaign Channels
            </p>
            <div className="flex flex-wrap gap-2">
              {campaign.channels.map((channel) => (
                <div
                  key={channel.id}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-lg border border-slate-200/60 text-xs sm:text-sm font-medium text-slate-700 hover:border-violet-300 transition-colors"
                >
                  {channel.logoUrl ? (
                    <img
                      src={channel.logoUrl}
                      alt=""
                      width={20}
                      height={20}
                      className="h-5 w-5 shrink-0 rounded object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-base leading-none" aria-hidden>
                      {channel.icon}
                    </span>
                  )}
                  <span>{channel.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-lavender-50 to-blue-50 py-6 sm:py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Personalized Greeting */}
        <div className="mb-6 sm:mb-8">
          <p className="text-xs sm:text-sm text-slate-600 mb-1">
            We're almost set{user?.first_name ? `, ${user.first_name}` : ''}
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            LaunchIQ
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-slate-700 max-w-2xl">
            Your campaign control center. Track, optimize, and unlock insights as signals flow.
          </p>
        </div>

        {/* Gradient Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent mb-6 sm:mb-10"></div>

        {/* Header with CTA */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 sm:mb-10">
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-2">
              Campaigns
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Draft and active campaigns for your workspace. Tags show current status.
            </p>
          </div>

          {/* Premium Gradient CTA Button */}
          <button
            type="button"
            onClick={onCreateCampaign}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2 flex-shrink-0"
          >
            <Plus className="w-5 h-5" />
            <span className="whitespace-nowrap">Create Campaign</span>
          </button>
        </div>

        {/* Campaign List Section */}
        <div>
          {/* Content */}
          {campaigns.length === 0 ? renderEmptyState() : renderCampaignList()}

          {/* Helper Text (when campaigns exist) */}
          {campaigns.length > 0 && (
            <p className="mt-5 text-xs sm:text-sm text-slate-500 text-center px-4">
              Insights and recommendations will evolve as data becomes available.
            </p>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8">
              {/* Warning Icon */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 sm:w-7 sm:h-7 text-[#e11d48]" />
              </div>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 text-center mb-2">
                Delete Campaign?
              </h3>

              {/* Message */}
              <p className="text-sm sm:text-base text-slate-600 text-center mb-6">
                Are you sure you want to delete{' '}
                <span className="font-semibold text-slate-900">
                  "{campaigns.find(c => c.id === deleteConfirmId)?.name}"
                </span>
                ? This action cannot be undone.
              </p>

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(null)}
                  disabled={isDeletingCampaign}
                  className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDeleteCampaign(deleteConfirmId);
                    setDeleteConfirmId(null);
                  }}
                  disabled={isDeletingCampaign}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isDeletingCampaign ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete Campaign
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}